import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadZone } from "@/components/upload-zone";
import { FileText, Layers, MessageSquare, LogOut } from "lucide-react";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function Dashboard() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: workspace } = await supabase
    .from("workspaces")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  async function createWorkspace(formData: FormData) {
    "use server";
    const name = formData.get("workspaceName") as string;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: newWorkspace, error } = await supabase
      .from("workspaces")
      .insert({ name, owner_id: user.id })
      .select()
      .single();

    if (error) { console.error("Error creating workspace:", error); return; }

    await supabase.from("workspace_members").insert({
      workspace_id: newWorkspace.id,
      user_id: user.id,
      role: "admin",
    });

    redirect("/");
  }

  // ── No workspace → Onboarding ──────────────────────────────────────────────
  if (!workspace) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Create your Workspace</CardTitle>
            <CardDescription>You need a workspace to start uploading documents.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createWorkspace} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workspaceName">Workspace Name</Label>
                <Input name="workspaceName" id="workspaceName" placeholder="e.g., Engineering Docs" required />
              </div>
              <Button type="submit" className="w-full">Create Workspace</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Fetch real stats ───────────────────────────────────────────────────────
  const [{ data: documents, count: docCount }, ] = await Promise.all([
    supabase
      .from("documents")
      .select("id, name, size_bytes, created_at", { count: "exact" })
      .eq("workspace_id", workspace.id)
      .order("created_at", { ascending: false }),
  ]);

  const docIds = documents?.map(d => d.id) ?? [];
  const { count: chunkCount } = docIds.length > 0
    ? await supabase
        .from("document_chunks")
        .select("*", { count: "exact", head: true })
        .in("document_id", docIds)
    : { count: 0 };

  // ── Dashboard ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-5xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{workspace.name}</h1>
            <p className="text-zinc-500 text-sm mt-1">{user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild>
              <Link href="/chat">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat with Docs
              </Link>
            </Button>
            <form action={async () => {
              "use server";
              const supabase = await createClient();
              await supabase.auth.signOut();
              redirect("/login");
            }}>
              <Button variant="outline" size="icon">
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
              <FileText className="h-4 w-4 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{docCount ?? 0}</div>
              <p className="text-xs text-zinc-500 mt-1">PDFs indexed in your workspace</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vector Embeddings</CardTitle>
              <Layers className="h-4 w-4 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{chunkCount ?? 0}</div>
              <p className="text-xs text-zinc-500 mt-1">Searchable chunks in the vector DB</p>
            </CardContent>
          </Card>
        </div>

        {/* Upload Zone */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-base">Upload Document</CardTitle>
            <CardDescription>Add a PDF to your knowledge base. It will be chunked and embedded automatically.</CardDescription>
          </CardHeader>
          <CardContent>
            <UploadZone workspaceId={workspace.id} />
          </CardContent>
        </Card>

        {/* Document List */}
        {documents && documents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Indexed Documents</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {documents.map(doc => (
                  <div key={doc.id} className="flex items-center gap-3 px-6 py-3">
                    <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{doc.name}</p>
                      <p className="text-xs text-zinc-400">
                        {formatBytes(doc.size_bytes)} · {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
