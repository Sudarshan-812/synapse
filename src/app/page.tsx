import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";
import { LandingBackground } from "@/components/landing/LandingBackground";

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; error?: string }>;
}) {
  const params = await searchParams;
  if (params.code) {
    redirect(`/auth/callback?code=${params.code}`);
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const isLoggedIn = !!user;
  const avatarUrl = user?.user_metadata?.avatar_url || undefined;
  const userName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";

  return (
    <div className="min-h-screen font-sans overflow-hidden" style={{ background: 'var(--cx-paper)', color: 'var(--cx-ink)' }}>
      <LandingBackground />
      <Navbar isLoggedIn={isLoggedIn} avatarUrl={avatarUrl} userName={userName} />
      <Hero isLoggedIn={isLoggedIn} />
      <Features />
      <CTA isLoggedIn={isLoggedIn} />
      <Footer />
    </div>
  );
}
