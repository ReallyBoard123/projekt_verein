import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PINS = [
  { x: "18%", y: "38%", label: "Nordstadt" },
  { x: "44%", y: "28%", label: "Mitte" },
  { x: "66%", y: "52%", label: "Südstadt" },
  { x: "28%", y: "62%", label: "Bettenhausen" },
  { x: "74%", y: "24%", label: "Kirchditmold" },
];

export default function MapStrip() {
  return (
    <div
      className="relative w-full h-[320px] overflow-hidden rounded-[14px] border-[0.5px] border-[#C5DEDE] bg-[#E8F2F0]"
      role="img"
      aria-label="Karte von Kassel mit Vereinsstandorten"
    >
      {/* Stripe pattern + roads */}
      <svg
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="stripes"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="24"
              stroke="#C0D8D4"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#stripes)" opacity="0.35" />
        <path
          d="M0,160 Q300,120 600,180 T1200,140"
          stroke="#C0D8D4"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M0,80 Q200,100 500,60 T1200,90"
          stroke="#C0D8D4"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M200,0 Q220,160 250,320"
          stroke="#C0D8D4"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M650,0 Q680,100 700,320"
          stroke="#C0D8D4"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>

      {/* Pins */}
      {PINS.map(({ x, y, label }) => (
        <div
          key={label}
          className="absolute -translate-x-1/2"
          style={{ left: x, top: y }}
        >
          <div className="w-8 h-8 bg-primary flex items-center justify-center rotate-45 mx-auto rounded-tr-[6px] rounded-tl-[6px] rounded-bl-[6px] shadow-[0_2px_8px_rgba(13,92,99,0.2)]">
            <MapPin size={14} className="text-primary-foreground -rotate-45" />
          </div>
          <Badge
            variant="secondary"
            className="mt-2 bg-white hover:bg-white text-foreground text-[11px] font-medium whitespace-nowrap w-fit mx-auto shadow-[0_1px_4px_rgba(0,0,0,0.13)] border-0"
          >
            {label}
          </Badge>
        </div>
      ))}

      {/* Area label */}
      <Badge className="absolute top-4 left-4 bg-white hover:bg-white rounded-lg px-3 py-2 flex items-center gap-2 shadow-[0_1px_4px_rgba(0,0,0,0.13)] border-0">
        <MapPin size={13} className="text-primary" aria-hidden="true" />
        <span className="text-[13px] font-medium text-foreground">
          Kassel & Umgebung
        </span>
      </Badge>
    </div>
  );
}
