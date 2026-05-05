#!/usr/bin/env python3
"""
Merge geocode_cache.json coordinates back into vereine.json.

Adds top-level `latitude` and `longitude` to each club that has cached
coordinates (so lib/actions.ts mapJsonClub picks them up unchanged).
"""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "vereine.json"
CACHE = ROOT / "data" / "geocode_cache.json"


def main():
    clubs = json.loads(DATA.read_text(encoding="utf-8"))
    cache = json.loads(CACHE.read_text(encoding="utf-8"))

    merged = 0
    for c in clubs:
        cid = str(c["id"])
        entry = cache.get(cid)
        if not entry:
            continue
        result = entry.get("result")
        if not result or "lat" not in result:
            continue
        c["latitude"] = result["lat"]
        c["longitude"] = result["lng"]
        merged += 1

    DATA.write_text(json.dumps(clubs, ensure_ascii=False, indent=2))
    print(f"Merged coordinates into {merged}/{len(clubs)} clubs")


if __name__ == "__main__":
    main()
