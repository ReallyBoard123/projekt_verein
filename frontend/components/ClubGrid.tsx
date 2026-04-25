import { fetchClubs } from "@/lib/actions";
import ClubCard from "@/components/ClubCard";
import type { Club } from "@/types";

export default async function ClubGrid({ 
  tags, 
  category 
}: { 
  tags?: string[], 
  category?: string 
}) {
  // This runs on the SERVER
  const clubs = await fetchClubs({ tags, category });

  if (clubs.length === 0) {
    return (
      <div className="py-20 text-center border rounded-xl bg-muted/5">
        <p className="text-text-muted">Keine passenden Vereine gefunden.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
      {clubs.map((club) => (
        <ClubCard key={club.id} club={club} />
      ))}
    </div>
  );
}
