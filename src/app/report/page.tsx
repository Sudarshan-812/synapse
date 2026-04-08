'use client'

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-zinc-800">

      {/* Print Button — hidden when printing */}
      <div className="print:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => window.print()}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-lg transition-colors"
        >
          Download PDF
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-10 py-16 print:px-8 print:py-10">

        {/* ── COVER ── */}
        <div className="mb-20 print:mb-16 border-b-2 border-zinc-200 pb-16">
          <div className="inline-block bg-blue-600 text-white text-xs font-bold tracking-widest px-3 py-1.5 rounded mb-6 uppercase">
            Technical Project Report
          </div>
          <h1 className="text-6xl font-black text-zinc-900 tracking-tight mb-4">Cortex</h1>
          <p className="text-2xl text-blue-600 font-semibold mb-6">AI Document Intelligence Platform</p>
          <p className="text-zinc-500 text-base leading-relaxed max-w-2xl">
            A production-grade, full-stack AI platform that allows users to upload documents and query them
            using natural language. Built on Next.js 16, Supabase, and Google Gemini — featuring hybrid
            vector + keyword search, re-ranking, streaming responses, agentic tool use, and conversational memory.
          </p>
          <div className="mt-8 flex gap-8 text-sm text-zinc-500">
            <span><strong className="text-zinc-700">Author:</strong> Sudarshan</span>
            <span><strong className="text-zinc-700">Date:</strong> April 2026</span>
            <span><strong className="text-zinc-700">Version:</strong> 1.0.0</span>
          </div>
        </div>

        {/* ── TABLE OF CONTENTS ── */}
        <section className="mb-16">
          <H2>Table of Contents</H2>
          <div className="grid grid-cols-2 gap-1 text-sm">
            {[
              ['1', 'Project Overview'],
              ['2', 'Technology Stack'],
              ['3', 'System Architecture'],
              ['4', 'Database Schema'],
              ['5', 'Authentication & Workspace'],
              ['6', 'Document Ingestion Pipeline'],
              ['7', 'Hybrid Search (Vector + BM25 + RRF)'],
              ['8', 'Re-Ranking'],
              ['9', 'Streaming Responses (SSE)'],
              ['10', 'Conversational Memory'],
              ['11', 'Agentic Tool Use'],
              ['12', 'Source Citations'],
              ['13', 'Multi-File Support'],
              ['14', 'Chat Session Management'],
              ['15', 'Dashboard & Statistics'],
              ['16', 'File Structure'],
              ['17', 'AI Pipeline Flow'],
              ['18', 'Completion Status'],
            ].map(([num, title]) => (
              <div key={num} className="flex gap-3 py-1.5 border-b border-zinc-100">
                <span className="text-blue-600 font-bold w-6 flex-shrink-0">{num}.</span>
                <span className="text-zinc-600">{title}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── 1. PROJECT OVERVIEW ── */}
        <section className="mb-14 print:break-before-page">
          <H2>1. Project Overview</H2>
          <P>
            Cortex is a <Strong>Retrieval-Augmented Generation (RAG)</Strong> platform — a category of AI
            application where a language model is given specific information retrieved from a database
            before answering questions. This allows the AI to answer based on <em>your own documents</em>,
            not just its training data.
          </P>
          <P>
            The core problem Cortex solves: organisations and individuals accumulate large volumes of
            documents (PDFs, reports, CSVs, notes) that are difficult to search or summarise. Cortex
            converts those documents into a searchable knowledge base that anyone can query conversationally.
          </P>
          <P>
            Unlike simple keyword search, Cortex understands the <em>meaning</em> of questions — so
            asking "What is the refund policy?" will find the relevant passage even if the document uses
            the phrase "money-back guarantee" instead.
          </P>
          <InfoBox title="Key Innovation">
            Cortex combines three retrieval methods simultaneously — semantic vector similarity, BM25
            keyword ranking, and AI re-ranking — then streams the answer token-by-token in real time.
            This is the same architecture used by enterprise RAG products like Notion AI and Perplexity.
          </InfoBox>
        </section>

        {/* ── 2. TECH STACK ── */}
        <section className="mb-14">
          <H2>2. Technology Stack</H2>
          <P>Each technology was chosen for a specific reason:</P>

          <Table headers={['Technology', 'What It Is', 'Why Used Here']}>
            <TR><TD>Next.js 16</TD><TD>React framework with server-side rendering</TD><TD>App Router for clean routing; Server Actions for secure DB calls; API Routes for streaming</TD></TR>
            <TR><TD>TypeScript</TD><TD>Typed superset of JavaScript</TD><TD>Catches bugs at compile time; essential for large codebases</TD></TR>
            <TR><TD>Supabase</TD><TD>Open-source Firebase alternative built on PostgreSQL</TD><TD>Provides auth, database, vector store, file storage, and RLS in one platform</TD></TR>
            <TR><TD>pgvector</TD><TD>PostgreSQL extension for vector similarity search</TD><TD>Stores and queries 768-dimensional embeddings natively inside the same DB</TD></TR>
            <TR><TD>Google Gemini</TD><TD>Google's family of AI models</TD><TD>gemini-embedding-001 for embeddings; gemini-2.5-flash for generation and re-ranking</TD></TR>
            <TR><TD>LangChain Text Splitters</TD><TD>Text chunking utilities</TD><TD>RecursiveCharacterTextSplitter splits documents intelligently at paragraph/sentence boundaries</TD></TR>
            <TR><TD>pdf2json</TD><TD>Node.js PDF parser</TD><TD>Extracts raw text from PDF files server-side without a browser</TD></TR>
            <TR><TD>mammoth</TD><TD>DOCX to text converter</TD><TD>Converts Microsoft Word documents to plain text for processing</TD></TR>
            <TR><TD>papaparse</TD><TD>CSV parser</TD><TD>Converts CSV rows into key:value text strings for embedding</TD></TR>
            <TR><TD>Tailwind CSS v4</TD><TD>Utility-first CSS framework</TD><TD>Rapid UI styling without leaving the component file</TD></TR>
            <TR><TD>shadcn/ui</TD><TD>Accessible component library</TD><TD>Pre-built Button, Card, Input, Label components using Radix UI primitives</TD></TR>
            <TR><TD>Tavily API</TD><TD>AI-optimised web search API</TD><TD>Gives the agent the ability to search the web for real-time information</TD></TR>
          </Table>
        </section>

        {/* ── 3. ARCHITECTURE ── */}
        <section className="mb-14">
          <H2>3. System Architecture</H2>
          <P>
            Cortex follows a <Strong>three-layer architecture</Strong>: a Next.js frontend (UI + server logic),
            Supabase as the data and auth platform, and Google Gemini as the AI layer.
          </P>
          <Code>{`USER BROWSER
  │
  ├── /login          → Supabase Auth (email/password, session cookies)
  ├── /               → Dashboard (server component, reads DB directly)
  ├── /chat/[id]      → Chat session (server load + client streaming)
  └── /report         → This report page
        │
        ▼
NEXT.JS SERVER (App Router)
  ├── Server Actions   → uploadDocument(), createChatSession(), deleteChatSession()
  └── API Route        → POST /api/chat  (SSE streaming endpoint)
        │
        ├──────────────────────┐
        ▼                      ▼
SUPABASE                  GOOGLE GEMINI
  ├── Auth                ├── gemini-embedding-001  (text → 768-dim vector)
  ├── Storage (PDFs)      ├── gemini-2.5-flash      (re-ranking, agent, streaming)
  ├── PostgreSQL          └── Tavily API            (optional web search)
  │   ├── workspaces
  │   ├── documents
  │   ├── document_chunks (pgvector + FTS)
  │   ├── chat_sessions
  │   └── chat_messages
  └── Row Level Security  (every table protected)`}</Code>
        </section>

        {/* ── 4. DATABASE SCHEMA ── */}
        <section className="mb-14 print:break-before-page">
          <H2>4. Database Schema</H2>
          <P>
            All data lives in PostgreSQL (via Supabase). Every table has Row Level Security (RLS) enabled —
            meaning even if someone gets the API key, they can only access their own data.
          </P>

          <H3>workspaces</H3>
          <P>A workspace is the top-level container for a user's documents and chats. Each user gets one workspace on signup.</P>
          <Code>{`id           uuid  PRIMARY KEY
name         text  NOT NULL
owner_id     uuid  REFERENCES auth.users
created_at   timestamptz`}</Code>

          <H3>workspace_members</H3>
          <P>Supports future multi-user access. The owner is automatically inserted as "admin" when the workspace is created.</P>
          <Code>{`id           uuid  PRIMARY KEY
workspace_id uuid  REFERENCES workspaces
user_id      uuid  REFERENCES auth.users
role         text  CHECK (role IN ('admin','editor','viewer'))
created_at   timestamptz`}</Code>

          <H3>documents</H3>
          <P>Metadata record for every uploaded file. The actual file binary lives in Supabase Storage — this table stores the reference path and file info.</P>
          <Code>{`id           uuid  PRIMARY KEY
workspace_id uuid  REFERENCES workspaces
name         text  -- original filename
storage_path text  -- path inside cortex-uploads bucket
file_type    text  -- MIME type
size_bytes   bigint
created_at   timestamptz`}</Code>

          <H3>document_chunks</H3>
          <P>
            The core of the RAG system. Each document is split into ~1000-character chunks. Each chunk has:
            (a) the raw text, (b) a 768-dimensional embedding vector for semantic search, and (c) a
            tsvector column for keyword search. Two indexes — IVFFlat for vectors, GIN for text — make
            queries fast even at scale.
          </P>
          <Code>{`id           uuid    PRIMARY KEY
document_id  uuid    REFERENCES documents
content      text    -- the raw chunk text
embedding    vector(768)  -- 768-dim float array from Gemini
content_fts  tsvector     -- auto-populated by trigger for keyword search
created_at   timestamptz

INDEXES:
  IVFFlat on embedding (cosine ops)  → fast vector search
  GIN on content_fts                 → fast keyword search`}</Code>

          <H3>chat_sessions</H3>
          <P>Each conversation is a session. Sessions auto-title themselves from the first message and float to the top of the sidebar when updated.</P>
          <Code>{`id           uuid  PRIMARY KEY
workspace_id uuid  REFERENCES workspaces
title        text  DEFAULT 'New Chat'
created_at   timestamptz
updated_at   timestamptz  -- auto-updated by trigger`}</Code>

          <H3>chat_messages</H3>
          <P>
            Every message (user and assistant) is persisted here. The <code>sources</code> column stores
            the citation metadata as JSONB — document name, chunk content, and similarity score — so
            sources survive page refreshes.
          </P>
          <Code>{`id         uuid  PRIMARY KEY
session_id uuid  REFERENCES chat_sessions
role       text  CHECK (role IN ('user','assistant'))
content    text
sources    jsonb  -- [{document_name, content, similarity, chunk_id}]
created_at timestamptz`}</Code>
        </section>

        {/* ── 5. AUTH ── */}
        <section className="mb-14">
          <H2>5. Authentication & Workspace</H2>
          <P>
            Authentication is handled by <Strong>Supabase Auth</Strong>. Sessions are stored in HTTP-only
            cookies (via <code>@supabase/ssr</code>), making them secure and accessible on both the server
            and client.
          </P>
          <H3>Login Flow</H3>
          <Code>{`User enters email + password
      ↓
Try signInWithPassword()
      ├── Success → redirect to /
      └── Fail    → try signUp() with same credentials
                        ├── Success → redirect to /
                        └── Fail    → show error message`}</Code>
          <P>
            This "magic entry" UX means the same form handles both signup and login. It's intentional —
            the platform is workspace-first, not account-first.
          </P>
          <H3>Route Protection</H3>
          <P>
            A Next.js <code>middleware.ts</code> file intercepts every request. It checks for a valid
            session. If none exists, it redirects to <code>/login</code>. If a logged-in user visits
            <code>/login</code>, they are redirected to the dashboard. No page is accidentally exposed.
          </P>
          <H3>Workspace Auto-Creation</H3>
          <P>
            On first login, the dashboard detects no workspace exists and shows an onboarding form.
            When the user submits a workspace name, a server action creates the workspace row and inserts
            the user as an admin member. Subsequent logins skip this step.
          </P>
        </section>

        {/* ── 6. INGESTION PIPELINE ── */}
        <section className="mb-14 print:break-before-page">
          <H2>6. Document Ingestion Pipeline</H2>
          <P>
            When a file is uploaded, it goes through a 5-stage pipeline. Each stage transforms the raw
            file closer to something the AI can search efficiently.
          </P>
          <Code>{`STAGE 1 — Upload to Storage
  File → Supabase Storage bucket (cortex-uploads)
  Path format: {workspaceId}/{timestamp}_{filename}

STAGE 2 — Save Metadata
  Row inserted into documents table
  (name, storage_path, file_type, size_bytes, workspace_id)

STAGE 3 — Text Extraction (by file type)
  .pdf   → pdf2json      extracts raw text from PDF structure
  .docx  → mammoth       converts Word XML to plain text
  .csv   → papaparse     converts rows to "key: value" strings
  .txt   → direct read
  .md    → direct read

STAGE 4 — Chunking
  RecursiveCharacterTextSplitter
  chunkSize: 1000 characters
  chunkOverlap: 200 characters
  Tries to split at: \n\n, \n, " ", ""
  A 10-page PDF produces ~80–150 chunks

STAGE 5 — Embed + Store
  For each chunk:
    → gemini-embedding-001.embedContent(chunk)
    → Returns 3072-dim vector, sliced to 768 (Matryoshka)
    → Insert into document_chunks
       (document_id, content, embedding)
    → Trigger auto-fills content_fts column`}</Code>

          <InfoBox title="Why 768 Dimensions?">
            Gemini Embedding 001 uses Matryoshka Representation Learning — the first 768 dimensions of
            its 3072-dim output are a self-contained, high-quality embedding. Slicing to 768 reduces
            storage by 75% and speeds up similarity search with no meaningful quality loss.
          </InfoBox>
        </section>

        {/* ── 7. HYBRID SEARCH ── */}
        <section className="mb-14">
          <H2>7. Hybrid Search — Vector + BM25 + RRF</H2>
          <P>
            Most RAG systems use only vector (semantic) search. Cortex uses <Strong>three methods combined</Strong>,
            which is significantly more accurate.
          </P>

          <H3>Vector Search (Semantic)</H3>
          <P>
            The user's query is embedded into a 768-dim vector. The database finds the chunks whose
            embedding vectors are closest in cosine distance. This captures <em>meaning</em> —
            "price" and "cost" will match even though they're different words.
          </P>

          <H3>BM25 Keyword Search</H3>
          <P>
            BM25 (Best Match 25) is the algorithm behind Google and Elasticsearch. It matches based on
            term frequency and document length. This is excellent for exact terms — names, codes,
            numbers, acronyms — that vector search often misses.
          </P>

          <H3>Reciprocal Rank Fusion (RRF)</H3>
          <P>
            Both searches return separate ranked lists. RRF merges them using the formula{' '}
            <code>1 / (60 + rank)</code> for each result in each list. A chunk that ranks #2 in
            vector search AND #1 in BM25 gets a higher combined score than one that ranks #1 in
            only one method. The constant 60 prevents top-ranked results from dominating unfairly.
          </P>
          <Code>{`-- Simplified SQL (match_documents RPC)
WITH vector_results AS (
  SELECT id, content,
    ROW_NUMBER() OVER (ORDER BY embedding <=> query_embedding) AS rank
  FROM document_chunks
  WHERE workspace_id = filter_workspace_id
    AND 1 - (embedding <=> query_embedding) > match_threshold
  LIMIT 20
),
bm25_results AS (
  SELECT id, content,
    ROW_NUMBER() OVER (
      ORDER BY ts_rank(content_fts, plainto_tsquery(query_text)) DESC
    ) AS rank
  FROM document_chunks
  WHERE content_fts @@ plainto_tsquery(query_text)
  LIMIT 20
),
rrf AS (
  SELECT
    COALESCE(v.id, b.id) AS id,
    COALESCE(v.content, b.content) AS content,
    COALESCE(1.0 / (60 + v.rank), 0) +
    COALESCE(1.0 / (60 + b.rank), 0) AS rrf_score
  FROM vector_results v
  FULL OUTER JOIN bm25_results b ON v.id = b.id
)
SELECT id, content, rrf_score AS similarity
FROM rrf ORDER BY rrf_score DESC LIMIT 10`}</Code>

          <InfoBox title="Why Hybrid Is Better">
            "What is John's employee ID?" — vector search fails (no semantic match for a specific ID).
            BM25 finds it. | "Explain the refund philosophy" — BM25 fails (no keyword match). Vector
            finds it. Hybrid wins both cases.
          </InfoBox>
        </section>

        {/* ── 8. RE-RANKING ── */}
        <section className="mb-14 print:break-before-page">
          <H2>8. Re-Ranking</H2>
          <P>
            Hybrid search returns the top 10 chunks. Re-ranking uses a second Gemini call to score
            each chunk's actual relevance to the specific question — not just statistical similarity.
          </P>
          <P>
            Vector similarity tells you "these chunks are mathematically close." Re-ranking tells you
            "these chunks actually answer the question." The difference matters for precise answers.
          </P>
          <Code>{`Prompt sent to gemini-2.5-flash:
"Score each passage's relevance to the question 1–10.
Return ONLY a JSON array like [{"index":0,"score":8},...].

Question: {query}

Passages:
[0] {chunk_0_content}
[1] {chunk_1_content}
..."

Response parsed → sorted by score → top 3 selected
These 3 chunks become the final context window for answer generation`}</Code>
          <P>
            If re-ranking fails (JSON parse error, API timeout), the system falls back to the top 3
            chunks by RRF score — the pipeline never breaks.
          </P>
        </section>

        {/* ── 9. STREAMING ── */}
        <section className="mb-14">
          <H2>9. Streaming Responses (Server-Sent Events)</H2>
          <P>
            Instead of waiting 5–10 seconds for a complete answer, Cortex streams the response
            token-by-token — exactly like ChatGPT. This uses <Strong>Server-Sent Events (SSE)</Strong>.
          </P>
          <H3>How SSE Works</H3>
          <P>
            The client makes a single HTTP POST request to <code>/api/chat</code>. Instead of a normal
            JSON response, the server keeps the connection open and sends small chunks of data as they
            become available. Each chunk is a JSON object prefixed with <code>data: </code>.
          </P>
          <Code>{`// Server sends these events over time:
data: {"type":"tool","name":"search_documents","status":"running"}
data: {"type":"tool","name":"search_documents","status":"done","count":3}
data: {"type":"token","text":"Based "}
data: {"type":"token","text":"on your "}
data: {"type":"token","text":"documents, "}
...
data: {"type":"done","sources":[{...}]}

// Client reads with:
const reader = response.body.getReader()
while (true) {
  const { done, value } = await reader.read()
  if (done) break
  // parse event, update React state
}`}</Code>
          <H3>UI Feedback During Stream</H3>
          <P>The UI updates in real time based on event type:</P>
          <Table headers={['Event Type', 'UI Effect']}>
            <TR><TD>tool (running)</TD><TD>Shows "Searching documents..." pill with spinner</TD></TR>
            <TR><TD>tool (done)</TD><TD>Updates pill to "Found 3 sources"</TD></TR>
            <TR><TD>token</TD><TD>Appends text to assistant bubble, blinks cursor</TD></TR>
            <TR><TD>done</TD><TD>Attaches source citations, clears tool indicators</TD></TR>
            <TR><TD>error</TD><TD>Shows error message in assistant bubble</TD></TR>
          </Table>
        </section>

        {/* ── 10. MEMORY ── */}
        <section className="mb-14">
          <H2>10. Conversational Memory</H2>
          <P>
            Without memory, each question is answered in isolation. The AI would have no context for
            follow-up questions like "Can you explain that in simpler terms?" or "What did you mean
            by the second point?"
          </P>
          <P>
            Cortex fetches the last 6 messages from the database and passes them to Gemini as a
            native <code>history[]</code> array in <code>startChat()</code>. This is not a prompt
            hack — it uses the Gemini API's built-in multi-turn conversation support.
          </P>
          <Code>{`// Fetch last 7 messages (6 history + current)
const { data: history } = await supabase
  .from("chat_messages")
  .select("role, content")
  .eq("session_id", sessionId)
  .order("created_at", { ascending: false })
  .limit(7)

// Convert to Gemini history format
const geminiHistory = history
  .reverse()
  .slice(0, -1)  // exclude the just-sent message
  .map(m => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }]
  }))

const chat = model.startChat({ history: geminiHistory })
await chat.sendMessage(currentQuery)`}</Code>
          <P>
            Because messages are persisted in the database (not just React state), memory also survives
            page refreshes and browser restarts. Returning to an old session restores the full history.
          </P>
        </section>

        {/* ── 11. AGENTS ── */}
        <section className="mb-14 print:break-before-page">
          <H2>11. Agentic Tool Use</H2>
          <P>
            A standard RAG system always searches documents. An <Strong>agentic</Strong> system lets the
            AI decide which tools to use based on the question type. Cortex implements a two-tool agent.
          </P>
          <H3>Architecture: Mandatory + Optional</H3>
          <P>
            Document search is <em>always mandatory</em> — it runs regardless of the question. The agent's
            job is only to decide whether web search should <em>also</em> run. This prevents the AI from
            skipping document search on general-knowledge questions.
          </P>
          <Code>{`Tools available to the agent:
┌─────────────────────────────────────────────────────────┐
│ search_web                                              │
│ Description: Search the web for current events or       │
│ information not found in documents.                     │
│ Parameters: { query: string }                           │
└─────────────────────────────────────────────────────────┘

Agent system instruction:
"Document search has already been completed.
 Found {N} relevant chunk(s).
 Your only job: decide if web search adds meaningful value.
 Call search_web if documents lack sufficient info.
 If documents are sufficient, respond with 'proceed'."

Result: Agent calls search_web  → Tavily API fetches web results
        Agent responds "proceed" → skip web search, use docs only`}</Code>
          <H3>Web Search via Tavily</H3>
          <P>
            When the agent calls <code>search_web</code>, Cortex calls the Tavily API — a search API
            specifically designed for AI agents. It returns clean, structured results (title + content)
            rather than raw HTML. Results are appended to the context before the final answer is generated.
          </P>
        </section>

        {/* ── 12. CITATIONS ── */}
        <section className="mb-14">
          <H2>12. Source Citations</H2>
          <P>
            Every AI answer includes a reference to the exact document chunks it was based on. This is
            critical for trust — users can verify the AI isn't hallucinating.
          </P>
          <P>
            After hybrid search and re-ranking, the system enriches each chunk with its document name
            by joining <code>document_chunks</code> → <code>documents</code>. The final source objects
            are stored alongside the AI's answer in the <code>chat_messages.sources</code> JSONB column.
          </P>
          <Code>{`// Source object structure (stored as JSONB):
{
  chunk_id:      "uuid",
  document_id:   "uuid",
  document_name: "company-policy.pdf",
  content:       "Employees may request refunds within 30 days...",
  similarity:    94   // percentage
}

// UI: collapsible "3 sources" toggle below each AI message
// Expanding shows: document name + similarity badge + excerpt`}</Code>
        </section>

        {/* ── 13. MULTI-FILE ── */}
        <section className="mb-14">
          <H2>13. Multi-File Support</H2>
          <P>
            A dedicated parser module (<code>src/lib/parsers.ts</code>) handles 5 file types. Each
            type has a specialised extractor. The <code>extractText()</code> function dispatches to the
            correct one based on MIME type and file extension.
          </P>
          <Table headers={['File Type', 'Parser', 'How It Works']}>
            <TR><TD>.pdf</TD><TD>pdf2json</TD><TD>Parses PDF binary structure, extracts text layer. Runs in Node.js (no browser)</TD></TR>
            <TR><TD>.docx</TD><TD>mammoth</TD><TD>Reads Word Open XML format, extracts raw text, strips formatting</TD></TR>
            <TR><TD>.csv</TD><TD>papaparse</TD><TD>Parses rows with headers, converts each row to "key: value" string for embedding</TD></TR>
            <TR><TD>.txt</TD><TD>Native</TD><TD>Buffer read → UTF-8 string. No library needed</TD></TR>
            <TR><TD>.md</TD><TD>Native</TD><TD>Buffer read → UTF-8 string. Markdown syntax is kept (Gemini handles it well)</TD></TR>
          </Table>
          <P>
            All extracted text feeds into the same chunking + embedding pipeline regardless of source
            format. The file type distinction ends after text extraction.
          </P>
        </section>

        {/* ── 14. SESSIONS ── */}
        <section className="mb-14 print:break-before-page">
          <H2>14. Chat Session Management</H2>
          <P>
            Chat is organised into <Strong>sessions</Strong> — each a separate conversation thread,
            like ChatGPT's conversation history. Sessions are scoped to a workspace.
          </P>
          <Table headers={['Feature', 'Implementation']}>
            <TR><TD>Create session</TD><TD>Server action inserts into chat_sessions, returns UUID, client navigates to /chat/[id]</TD></TR>
            <TR><TD>Auto-title</TD><TD>After first assistant reply, session title updated to first 52 chars of user's first question</TD></TR>
            <TR><TD>Sidebar order</TD><TD>Sessions ordered by updated_at DESC — most recently active floats to top</TD></TR>
            <TR><TD>Delete session</TD><TD>Optimistic UI removes from sidebar immediately; server action deletes (CASCADE removes messages)</TD></TR>
            <TR><TD>History persistence</TD><TD>Server component loads messages from DB on page load — survives refresh</TD></TR>
            <TR><TD>Auth scoping</TD><TD>Session page validates workspace ownership before rendering — prevents URL guessing attacks</TD></TR>
          </Table>
        </section>

        {/* ── 15. DASHBOARD ── */}
        <section className="mb-14">
          <H2>15. Dashboard & Statistics</H2>
          <P>
            The dashboard is a Next.js Server Component — it runs on the server, queries the database
            directly, and sends pre-rendered HTML to the browser. No API call needed from the client.
          </P>
          <Code>{`// Stats queries (run server-side at page load):
const { count: docCount } = await supabase
  .from("documents")
  .select("*", { count: "exact", head: true })
  .eq("workspace_id", workspace.id)

const { count: chunkCount } = await supabase
  .from("document_chunks")
  .select("*", { count: "exact", head: true })
  .in("document_id", docIds)

// Document list with name, size, date
const { data: documents } = await supabase
  .from("documents")
  .select("id, name, size_bytes, created_at")
  .eq("workspace_id", workspace.id)
  .order("created_at", { ascending: false })`}</Code>
          <P>
            Stats automatically reflect new uploads because <code>revalidatePath('/')</code> is called
            at the end of the <code>uploadDocument</code> server action, triggering a server-side
            re-render of the dashboard.
          </P>
        </section>

        {/* ── 16. FILE STRUCTURE ── */}
        <section className="mb-14">
          <H2>16. File Structure</H2>
          <Code>{`cortex/
├── schema.sql                    ← Full database setup SQL
├── src/
│   ├── app/
│   │   ├── api/chat/route.ts     ← SSE streaming endpoint (main AI pipeline)
│   │   ├── chat/
│   │   │   ├── layout.tsx        ← Sidebar shell (server, fetches sessions)
│   │   │   ├── page.tsx          ← Redirects to latest session
│   │   │   └── [sessionId]/
│   │   │       └── page.tsx      ← Loads messages, renders ChatWindow
│   │   ├── login/page.tsx        ← Auth page (client component)
│   │   ├── report/page.tsx       ← This report (print-to-PDF)
│   │   ├── page.tsx              ← Dashboard (server component)
│   │   ├── layout.tsx            ← Root layout (fonts, metadata)
│   │   ├── globals.css           ← Tailwind base styles
│   │   ├── actions.ts            ← uploadDocument server action
│   │   ├── chat-actions.ts       ← Legacy RAG action
│   │   └── session-actions.ts    ← createChatSession, deleteChatSession
│   ├── components/
│   │   ├── ui/                   ← shadcn: button, card, input, label
│   │   ├── chat-sidebar.tsx      ← Dark sidebar (client, session list)
│   │   ├── chat-interface.tsx    ← Legacy (unused)
│   │   ├── chat-window.tsx       ← Message thread + SSE stream (client)
│   │   └── upload-zone.tsx       ← Drag-drop uploader (client)
│   ├── lib/
│   │   ├── parsers.ts            ← extractText() for all file types
│   │   └── utils.ts              ← cn() Tailwind helper
│   └── utils/supabase/
│       ├── client.ts             ← Browser Supabase client
│       └── server.ts             ← Server Supabase client (SSR cookies)
├── middleware.ts                 ← Route protection (auth guard)
└── package.json`}</Code>
        </section>

        {/* ── 17. PIPELINE ── */}
        <section className="mb-14 print:break-before-page">
          <H2>17. Complete AI Pipeline Flow</H2>
          <P>This is the exact sequence of operations for every message sent in the chat:</P>
          <Code>{`User sends message: "What is the refund policy?"
          │
          ▼
① PERSIST user message to chat_messages table

② FETCH last 6 messages from DB (conversational memory)
   → Convert to Gemini history[] format

③ SEARCH DOCUMENTS (mandatory, always runs)
   a. Embed query with gemini-embedding-001
      "What is the refund policy?" → [0.023, -0.14, 0.87, ...]  (768 floats)
   b. Run match_documents() RPC in PostgreSQL
      → Vector search: find closest embedding vectors (cosine distance)
      → BM25 search: find chunks matching "refund policy" keywords
      → RRF merge: combine both ranked lists → top 10 candidates
   c. Re-rank (Gemini call #1):
      → Gemini scores all 10 chunks 1–10 for relevance to the question
      → Top 3 selected as final context
   d. Enrich with document names (join document_chunks → documents)

   SSE → client: {"type":"tool","name":"search_documents","status":"done","count":3}

④ AGENT: web search decision (Gemini call #2)
   → "Documents found sufficient info. Proceed."  → skip web search
   → "No relevant docs found. Call search_web." → Tavily API → web results

   SSE → client: {"type":"tool","name":"search_web","status":"done"}  (if called)

⑤ STREAM final answer (Gemini call #3)
   Prompt: "Context: [top 3 chunks]. Question: What is the refund policy? Answer:"
   → generateContentStream()
   → Each token sent immediately as SSE event

   SSE → client: {"type":"token","text":"Based "} × N times
   SSE → client: {"type":"done","sources":[{...}]}

⑥ PERSIST assistant message + sources JSONB to DB
⑦ AUTO-TITLE session if first exchange`}</Code>
        </section>

        {/* ── 18. STATUS ── */}
        <section className="mb-14">
          <H2>18. Completion Status</H2>

          <Table headers={['Feature', 'Status', 'Notes']}>
            <TR><TD>Authentication (login, signup, signout)</TD><TD className="text-green-600 font-semibold">Complete</TD><TD>Supabase Auth, SSR cookies, middleware guard</TD></TR>
            <TR><TD>Workspace creation & membership</TD><TD className="text-green-600 font-semibold">Complete</TD><TD>Auto-created on first login, admin role assigned</TD></TR>
            <TR><TD>Multi-file document upload (PDF, DOCX, CSV, TXT, MD)</TD><TD className="text-green-600 font-semibold">Complete</TD><TD>Type-specific parsers, graceful error messages</TD></TR>
            <TR><TD>Text chunking & embedding</TD><TD className="text-green-600 font-semibold">Complete</TD><TD>1000-char chunks, 768-dim Matryoshka embeddings</TD></TR>
            <TR><TD>Hybrid vector + BM25 search</TD><TD className="text-green-600 font-semibold">Complete</TD><TD>RRF merge inside PostgreSQL RPC function</TD></TR>
            <TR><TD>Re-ranking (Gemini-powered)</TD><TD className="text-green-600 font-semibold">Complete</TD><TD>Top-10 scored, top-3 selected, fallback on error</TD></TR>
            <TR><TD>Streaming responses (SSE)</TD><TD className="text-green-600 font-semibold">Complete</TD><TD>Token-by-token, cursor blink, tool status pills</TD></TR>
            <TR><TD>Conversational memory (6-turn)</TD><TD className="text-green-600 font-semibold">Complete</TD><TD>Native Gemini history[], DB-persisted</TD></TR>
            <TR><TD>Agentic web search (Tavily)</TD><TD className="text-green-600 font-semibold">Complete</TD><TD>Agent decides if web adds value, graceful if no key</TD></TR>
            <TR><TD>Source citations (collapsible)</TD><TD className="text-green-600 font-semibold">Complete</TD><TD>Document name, similarity %, excerpt</TD></TR>
            <TR><TD>Chat session management (CRUD)</TD><TD className="text-green-600 font-semibold">Complete</TD><TD>Create, title, reorder, delete, persist history</TD></TR>
            <TR><TD>Dashboard with live stats</TD><TD className="text-green-600 font-semibold">Complete</TD><TD>Real document count, chunk count, document list</TD></TR>
            <TR><TD>Row Level Security (RLS)</TD><TD className="text-green-600 font-semibold">Complete</TD><TD>All 6 tables protected, cascade deletes configured</TD></TR>
            <TR><TD>UI Design / Visual Polish</TD><TD className="text-yellow-600 font-semibold">Pending</TD><TD>Logic complete, styling phase next</TD></TR>
            <TR><TD>Document deletion</TD><TD className="text-yellow-600 font-semibold">Pending</TD><TD>Minor feature, straightforward to add</TD></TR>
            <TR><TD>Production deployment (Vercel)</TD><TD className="text-yellow-600 font-semibold">Pending</TD><TD>Requires billing + env vars configured</TD></TR>
          </Table>

          <div className="mt-10 grid grid-cols-3 gap-6 text-center">
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <div className="text-4xl font-black text-green-600">13</div>
              <div className="text-sm text-green-700 font-medium mt-1">Features Complete</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
              <div className="text-4xl font-black text-yellow-600">3</div>
              <div className="text-sm text-yellow-700 font-medium mt-1">Remaining</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <div className="text-4xl font-black text-blue-600">~90%</div>
              <div className="text-sm text-blue-700 font-medium mt-1">Overall Complete</div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <div className="border-t-2 border-zinc-200 pt-8 mt-16 text-center text-xs text-zinc-400">
          Cortex — AI Document Intelligence Platform · Built by Sudarshan · April 2026
        </div>

      </div>
    </div>
  )
}

// ── Sub-components ──────────────────────────────────────────────────────────

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-black text-zinc-900 mb-4 mt-2 pb-2 border-b border-zinc-200">
      {children}
    </h2>
  )
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-bold text-zinc-800 mt-5 mb-2">{children}</h3>
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-zinc-600 leading-relaxed mb-3">{children}</p>
}

function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-zinc-800">{children}</strong>
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <pre className="bg-zinc-900 text-green-400 text-xs rounded-lg p-4 overflow-x-auto mb-4 leading-relaxed font-mono whitespace-pre-wrap">
      {children}
    </pre>
  )
}

function InfoBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg px-5 py-4 mb-4">
      <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">{title}</p>
      <p className="text-sm text-blue-800 leading-relaxed">{children}</p>
    </div>
  )
}

function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto mb-4">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-zinc-800 text-white">
            {headers.map(h => (
              <th key={h} className="text-left px-3 py-2 text-xs font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

function TR({ children }: { children: React.ReactNode }) {
  return <tr className="border-b border-zinc-100 hover:bg-zinc-50">{children}</tr>
}

function TD({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-2 text-xs text-zinc-600 align-top ${className}`}>{children}</td>
}
