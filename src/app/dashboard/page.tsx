import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadZone } from "@/components/upload-zone";
import { FileText, Layers, Search, LogOut, ChevronRight } from "lucide-react";

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

    if (error) return;

    await supabase.from("workspace_members").insert({
      workspace_id: newWorkspace.id,
      user_id: user.id,
      role: "admin",
    });

    redirect("/dashboard");
  }

  if (!workspace) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans selection:bg-fuchsia-200 relative overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[radial-gradient(ellipse_at_top,_#fdf4ff_0%,_transparent_70%)] pointer-events-none" />

        <div className="relative z-10 w-full max-w-md px-4">
          <div className="bg-white/70 backdrop-blur-xl border border-zinc-200/60 rounded-[2rem] p-10 shadow-[0_8px_40px_rgba(0,0,0,0.06)]">
            <div className="mb-6">
              <img src="/CortexLogo.png" alt="Cortex" className="h-10 w-auto object-contain" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-950 mb-1">Initialize Cortex</h1>
            <p className="text-zinc-500 text-sm mb-8">Set up your secure enterprise knowledge base.</p>

            <form action={createWorkspace} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="workspaceName" className="text-sm font-medium text-zinc-700">
                  Workspace Name
                </Label>
                <Input
                  name="workspaceName"
                  id="workspaceName"
                  placeholder="e.g., Engineering Architecture"
                  required
                  className="h-11 bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-fuchsia-500 focus-visible:border-fuchsia-500 rounded-xl shadow-sm"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-11 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl font-semibold transition-colors"
              >
                Deploy Workspace
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const [{ data: documents, count: docCount }] = await Promise.all([
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

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 font-sans selection:bg-fuchsia-200 relative overflow-hidden">

      {/* Top radial glow — matches landing page aurora feel */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-[radial-gradient(ellipse_at_top,_#fdf4ff_0%,_transparent_65%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 py-10 lg:py-14 relative z-10">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-zinc-200/80 shadow-sm mb-4">
              <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold tracking-widest text-zinc-700 uppercase">System Online</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-zinc-950">{workspace.name}</h1>
            <p className="mt-2 text-sm text-zinc-500 flex items-center gap-2">
              <span className="font-mono text-xs bg-white px-2 py-1 rounded-lg border border-zinc-200 shadow-sm text-zinc-600">
                {user.email}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild className="h-10 bg-zinc-950 hover:bg-zinc-800 text-white rounded-full px-5 text-[13.5px] font-semibold shadow-sm transition-colors">
              <Link href="/chat">
                <Search className="h-4 w-4 mr-2" />
                Query Knowledge Base
              </Link>
            </Button>
            <form action={async () => {
              "use server";
              const supabase = await createClient();
              await supabase.auth.signOut();
              redirect("/login");
            }}>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full bg-white/60 backdrop-blur-md border-zinc-200 hover:bg-white text-zinc-500 hover:text-zinc-900 shadow-sm transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* ── Bento Grid ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">

          {/* Stats column */}
          <div className="lg:col-span-1 space-y-5">

            {/* Doc count */}
            <div className="relative overflow-hidden rounded-[1.75rem] p-7 bg-white/40 backdrop-blur-2xl border border-zinc-200/60 group transition-all duration-300 hover:shadow-xl hover:shadow-zinc-900/5">
              <div className="absolute z-[-1] -top-6 -right-6 h-12 w-12 rounded-full bg-zinc-950 scale-100 origin-center transition-transform duration-[1200ms] ease-in-out group-hover:scale-[30]" />
              <div className="size-10 rounded-xl bg-white border border-zinc-200/80 flex items-center justify-center mb-5 group-hover:bg-zinc-800 group-hover:border-zinc-700 transition-colors duration-[800ms]">
                <FileText className="h-5 w-5 text-zinc-950 group-hover:text-white transition-colors duration-[800ms]" />
              </div>
              <div className="text-4xl font-bold tracking-tight text-zinc-950 group-hover:text-white transition-colors duration-[800ms]">
                {docCount ?? 0}
              </div>
              <p className="text-xs font-semibold text-zinc-500 mt-1.5 group-hover:text-zinc-300 transition-colors duration-[800ms]">
                Indexed Documents
              </p>
            </div>

            {/* Chunk count */}
            <div className="relative overflow-hidden rounded-[1.75rem] p-7 bg-white/40 backdrop-blur-2xl border border-zinc-200/60 group transition-all duration-300 hover:shadow-xl hover:shadow-zinc-900/5">
              <div className="absolute z-[-1] -top-6 -right-6 h-12 w-12 rounded-full bg-zinc-950 scale-100 origin-center transition-transform duration-[1200ms] ease-in-out group-hover:scale-[30]" />
              <div className="size-10 rounded-xl bg-white border border-zinc-200/80 flex items-center justify-center mb-5 group-hover:bg-zinc-800 group-hover:border-zinc-700 transition-colors duration-[800ms]">
                <Layers className="h-5 w-5 text-zinc-950 group-hover:text-white transition-colors duration-[800ms]" />
              </div>
              <div className="text-4xl font-bold tracking-tight text-zinc-950 group-hover:text-white transition-colors duration-[800ms]">
                {chunkCount ?? 0}
              </div>
              <p className="text-xs font-semibold text-zinc-500 mt-1.5 group-hover:text-zinc-300 transition-colors duration-[800ms]">
                Vector Embeddings
              </p>
            </div>
          </div>

          {/* Upload Zone */}
          <div className="lg:col-span-2">
            <div className="h-full relative overflow-hidden rounded-[1.75rem] bg-white/40 backdrop-blur-2xl border border-zinc-200/60 flex flex-col">
              <div className="px-8 pt-7 pb-4 border-b border-zinc-100/80">
                <h2 className="text-base font-bold text-zinc-950 tracking-tight">Ingest Data</h2>
                <p className="text-sm text-zinc-500 mt-1">
                  Drop PDFs here. The pipeline extracts, chunks, and embeds automatically.
                </p>
              </div>
              <div className="flex-1 p-6">
                <UploadZone workspaceId={workspace.id} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Document List ────────────────────────────────────────────────── */}
        {documents && documents.length > 0 && (
          <div className="relative overflow-hidden rounded-[1.75rem] bg-white/40 backdrop-blur-2xl border border-zinc-200/60">
            {/* Header */}
            <div className="px-7 py-5 border-b border-zinc-100/80 flex items-center justify-between">
              <h2 className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Data Repository</h2>
              <span className="text-xs font-semibold text-zinc-400">{docCount} file{docCount !== 1 ? "s" : ""}</span>
            </div>

            <div className="divide-y divide-zinc-100/80">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between px-7 py-4 hover:bg-white/50 transition-colors group cursor-default"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-white/80 border border-zinc-200/60 flex items-center justify-center group-hover:border-fuchsia-200 group-hover:bg-fuchsia-50 transition-all">
                      <FileText className="h-4.5 w-4.5 text-zinc-400 group-hover:text-fuchsia-500 transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-zinc-900 truncate">{doc.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-zinc-400 font-medium">{formatBytes(doc.size_bytes)}</span>
                        <span className="size-1 rounded-full bg-zinc-300" />
                        <span className="text-xs text-zinc-400 font-medium">
                          {new Date(doc.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 uppercase tracking-wider">
                      Indexed
                    </span>
                    <ChevronRight className="h-4 w-4 text-zinc-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
