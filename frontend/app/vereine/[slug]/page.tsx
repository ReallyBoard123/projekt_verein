import { fetchClubBySlug, fetchClubs } from "@/lib/actions";
import ClubDetailContent from "@/components/ClubDetailContent";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// 1. PRE-RENDER TOP CLUBS
export async function generateStaticParams() {
  const clubs = await fetchClubs({ limit: 68 });
  return clubs.map((club) => ({
    slug: club.slug,
  }));
}

// 2. DYNAMIC SEO METADATA
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const club = await fetchClubBySlug(slug);
  return {
    title: `${club.name} — VereinsFinder Kassel`,
    description: club.description.substring(0, 160),
  };
}

export default async function ClubDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const club = await fetchClubBySlug(slug);

  if (!club) {
    return (
      <main className="flex items-center justify-center min-h-[60vh]">
        <p className="text-text-muted font-medium">Club nicht gefunden.</p>
      </main>
    );
  }

  return (
    <main>
      {/* Breadcrumb */}
      <div className="px-6 md:px-12 py-4 bg-background border-b-[0.5px] border-[#E8F0F0]">
        <div className="max-w-[1200px] mx-auto flex items-center gap-2 text-[14px]">
          <Link
            href="/"
            className="text-primary flex items-center gap-1 hover:underline"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            <span className="hidden sm:inline">Zurück zur Übersicht</span>
            <span className="sm:hidden">Zurück</span>
          </Link>
          <span className="text-text-muted">·</span>
          <span className="text-text-muted hidden sm:inline">Vereine</span>
          <span className="text-text-muted hidden sm:inline">·</span>
          <span className="text-text-body truncate">{club.name}</span>
        </div>
      </div>

      {/* Main Content (Interactive Client Layer) */}
      <div className="px-6 md:px-12 pt-8 md:pt-10 bg-[var(--bg-panel)] border-b-[0.5px] border-[var(--border)]">
        <ClubDetailContent club={club} />
      </div>
    </main>
  );
}
