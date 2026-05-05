import { fetchMapClubs } from "@/lib/actions";
import KarteClient from "./KarteClient";

export const metadata = {
  title: "Karte — VereinsFinder Kassel",
  description: "Alle Vereine und Initiativen in Kassel auf einen Blick.",
};

export default async function KartePage() {
  const clubs = await fetchMapClubs();
  return <KarteClient clubs={clubs} />;
}
