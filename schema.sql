-- ============================================================
-- Synapse — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Enable pgvector extension (required for vector similarity search)
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================
-- TABLES
-- ============================================================

-- Workspaces (one per user for now, supports teams later)
CREATE TABLE IF NOT EXISTS workspaces (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  owner_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Workspace members (role-based: admin | member)
CREATE TABLE IF NOT EXISTS workspace_members (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role         TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (workspace_id, user_id)
);

-- Uploaded documents (metadata only; raw file lives in Storage)
CREATE TABLE IF NOT EXISTS documents (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  file_type    TEXT,
  size_bytes   BIGINT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Document chunks with 768-dim embeddings (text-embedding-004)
CREATE TABLE IF NOT EXISTS document_chunks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  embedding   vector(768),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- IVFFlat index for fast cosine similarity search
CREATE INDEX IF NOT EXISTS document_chunks_embedding_idx
  ON document_chunks USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- ============================================================
-- VECTOR SEARCH FUNCTION (called by chat-actions.ts via RPC)
-- ============================================================

CREATE OR REPLACE FUNCTION match_documents(
  query_embedding    vector(768),
  match_threshold    FLOAT,
  match_count        INT,
  filter_workspace_id UUID
)
RETURNS TABLE (
  id          UUID,
  content     TEXT,
  document_id UUID,
  similarity  FLOAT
)
LANGUAGE sql STABLE
AS $$
  SELECT
    dc.id,
    dc.content,
    dc.document_id,
    1 - (dc.embedding <=> query_embedding) AS similarity
  FROM document_chunks dc
  JOIN documents d ON dc.document_id = d.id
  WHERE d.workspace_id = filter_workspace_id
    AND 1 - (dc.embedding <=> query_embedding) > match_threshold
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE workspaces        ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents         ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks   ENABLE ROW LEVEL SECURITY;

-- Workspaces: owner only
CREATE POLICY "workspaces_select" ON workspaces FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY "workspaces_insert" ON workspaces FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "workspaces_delete" ON workspaces FOR DELETE USING (owner_id = auth.uid());

-- Workspace members: members of the workspace
CREATE POLICY "members_select" ON workspace_members FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY "members_insert" ON workspace_members FOR INSERT
  WITH CHECK (workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid()));

-- Documents: users who own the workspace
CREATE POLICY "documents_select" ON documents FOR SELECT
  USING (workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid()));
CREATE POLICY "documents_insert" ON documents FOR INSERT
  WITH CHECK (workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid()));
CREATE POLICY "documents_delete" ON documents FOR DELETE
  USING (workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid()));

-- Chunks: same ownership chain
CREATE POLICY "chunks_select" ON document_chunks FOR SELECT
  USING (document_id IN (
    SELECT d.id FROM documents d
    JOIN workspaces w ON d.workspace_id = w.id
    WHERE w.owner_id = auth.uid()
  ));
CREATE POLICY "chunks_insert" ON document_chunks FOR INSERT
  WITH CHECK (document_id IN (
    SELECT d.id FROM documents d
    JOIN workspaces w ON d.workspace_id = w.id
    WHERE w.owner_id = auth.uid()
  ));

-- ============================================================
-- STORAGE
-- ============================================================
-- In Supabase Dashboard → Storage → New Bucket:
--   Name: synapse-uploads
--   Public: false
--
-- Then add this Storage Policy (RLS for bucket):
--
-- INSERT policy: ((bucket_id = 'synapse-uploads') AND (auth.role() = 'authenticated'))
-- SELECT policy: ((bucket_id = 'synapse-uploads') AND (auth.role() = 'authenticated'))
-- ============================================================
