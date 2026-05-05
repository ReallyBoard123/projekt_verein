#!/usr/bin/env python3
"""
Geocode Kassel Verein addresses via Nominatim (OpenStreetMap).

Produces data/geocode_cache.json (separate from vereine.json, per project
convention). A second pass merges the coordinates back into vereine.json.

Rules followed:
- 1 request/sec (Nominatim usage policy)
- Descriptive User-Agent with contact
- Skips junk addresses (", Kassel" placeholders)
- Resumes from cache on re-run
"""

import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "vereine.json"
CACHE = ROOT / "data" / "geocode_cache.json"
USER_AGENT = "projekt-verein-kassel/1.0 (github.com/ReallyBoard123)"
NOMINATIM = "https://nominatim.openstreetmap.org/search"


def is_geocodable(addr: str) -> bool:
    if not addr:
        return False
    addr = addr.strip()
    if not addr:
        return False
    # ", Kassel" or bare "Kassel" = useless
    if re.match(r"^,\s*Kassel\s*$", addr, re.I) or addr.lower() == "kassel":
        return False
    # needs at least one letter sequence besides "Kassel"
    meaningful = re.sub(r"Kassel", "", addr, flags=re.I).strip(" ,")
    return len(meaningful) >= 3


def normalize(addr: str) -> str:
    # "Wilhelmshöher Allee 259, 34131 Kassel" - already fine
    # "Heiligenröder Straße 70,  Kassel" -> drop the double space
    a = re.sub(r"\s+", " ", addr).strip()
    if "Kassel" not in a:
        a += ", Kassel"
    if "Germany" not in a and "Deutschland" not in a:
        a += ", Germany"
    return a


def geocode(addr: str) -> dict | None:
    params = {"q": addr, "format": "json", "limit": "1", "countrycodes": "de"}
    url = f"{NOMINATIM}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            results = json.loads(r.read())
    except Exception as e:
        return {"error": str(e)}
    if not results:
        return None
    top = results[0]
    return {
        "lat": float(top["lat"]),
        "lng": float(top["lon"]),
        "display_name": top.get("display_name"),
    }


def main():
    clubs = json.loads(DATA.read_text(encoding="utf-8"))
    cache = json.loads(CACHE.read_text(encoding="utf-8")) if CACHE.exists() else {}

    # Build queue: only clubs with geocodable addresses, not yet in cache
    queue = []
    for c in clubs:
        cid = str(c["id"])
        addr = (c.get("contact", {}) or {}).get("address_raw") or ""
        if not is_geocodable(addr):
            continue
        if cid in cache:
            continue
        queue.append((cid, c.get("identity", {}).get("name", "?"), normalize(addr)))

    print(f"Already cached: {len(cache)}")
    print(f"Queue: {len(queue)} addresses to geocode")
    print(f"ETA: ~{len(queue)} seconds\n")

    ok = miss = err = 0
    for i, (cid, name, addr) in enumerate(queue, 1):
        result = geocode(addr)
        cache[cid] = {"address": addr, "result": result}
        if result is None:
            miss += 1
            tag = "MISS"
        elif "error" in result:
            err += 1
            tag = f"ERR  {result['error'][:40]}"
        else:
            ok += 1
            tag = f"OK   {result['lat']:.4f},{result['lng']:.4f}"
        print(f"[{i:3d}/{len(queue)}] {tag}  {name[:50]}")

        # Save every 20 to survive interruption
        if i % 20 == 0:
            CACHE.write_text(json.dumps(cache, ensure_ascii=False, indent=2))

        time.sleep(1.1)  # Nominatim policy: max 1 req/sec

    CACHE.write_text(json.dumps(cache, ensure_ascii=False, indent=2))
    print(f"\n=== Done ===\nOK: {ok}  MISS: {miss}  ERR: {err}")
    print(f"Cache: {CACHE}")


if __name__ == "__main__":
    main()
