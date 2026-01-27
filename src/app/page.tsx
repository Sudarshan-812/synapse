import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadZone } from "@/components/upload-zone";

export default async function Dashboard() {
  const supabase = await createClient();

  // 1. Check User
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Check Workspace
  const { data: workspace } = await supabase
    .from("workspaces")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  // 3. Server Action to Create Workspace
  async function createWorkspace(formData: FormData) {
    "use server";
    const name = formData.get("workspaceName") as string;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    // Create Workspace
    const { data: newWorkspace, error } = await supabase
      .from("workspaces")
      .insert({ name, owner_id: user.id })
      .select()
      .single();

    if (error) {
      console.error("Error creating workspace:", error);
      return;
    }

    // Add user as 'admin' in workspace_members
    await supabase.from("workspace_members").insert({
      workspace_id: newWorkspace.id,
      user_id: user.id,
      role: "admin",
    });

    // Refresh page to show the new state
    redirect("/");
  }

  // === RENDER LOGIC ===

  // SCENARIO A: No Workspace -> Show Onboarding
  if (!workspace) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Create your Workspace</CardTitle>
            <CardDescription>
              You need a workspace to start uploading documents.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createWorkspace} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workspaceName">Workspace Name</Label>
                <Input
                  name="workspaceName"
                  id="workspaceName"
                  placeholder="e.g., Engineering Docs"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Create Workspace
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // SCENARIO B: Has Workspace -> Show Dashboard
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {workspace.name}
        </h1>
        <form action={async () => {
          "use server";
          const supabase = await createClient();
          await supabase.auth.signOut();
          redirect("/login");
        }}>
          <Button variant="outline">Sign Out</Button>
        </form>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* We will build these stats next */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vector Embeddings</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">0</div>
            </CardContent>
        </Card>
      </div>
      
      {/* This is where the file upload will go */}
      <div className="mt-8 p-10 border-2 border-dashed rounded-lg flex items-center justify-center text-zinc-500">
        <UploadZone workspaceId={workspace.id} />
      </div>
    </div>
  );
}