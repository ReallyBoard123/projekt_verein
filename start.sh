#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "=== Vereinsfinder Setup & Start ==="

# ── Frontend dependencies ──────────────────────────────────────────────────
cd "$ROOT/frontend"

if [ ! -d "node_modules" ]; then
  echo "[frontend] Installing npm dependencies..."
  npm install
fi

# ── Prisma / SQLite database ───────────────────────────────────────────────
echo "[frontend] Generating Prisma client..."
npx prisma generate --schema=prisma/schema.prisma 2>/dev/null

if [ ! -f "dev.db" ]; then
  echo "[frontend] Database not found — running migrations and seeding data..."
  npx prisma migrate deploy --schema=prisma/schema.prisma
  npx tsx prisma/seed.ts
  echo "[frontend] Database ready."
fi

# ── Java / Neo4j backend (optional) ───────────────────────────────────────
BACKEND_PID=""

if command -v java &>/dev/null; then
  JAVA_VER=$(java -version 2>&1 | head -1 | grep -oP '(?<=version ")\d+' || echo "0")
  if [ "$JAVA_VER" -ge 17 ] 2>/dev/null; then
    PORT_PID=$(lsof -ti tcp:8080 2>/dev/null || true)
    if [ -n "$PORT_PID" ]; then
      echo "[backend] Port 8080 in use (PID $PORT_PID) — stopping it..."
      kill "$PORT_PID" 2>/dev/null
      sleep 1
    fi
    echo "[backend] Starting Java/Neo4j backend on :8080..."
    cd "$ROOT/backend"
    ./gradlew bootRun &
    BACKEND_PID=$!
    cd "$ROOT/frontend"
  else
    echo "[backend] Java $JAVA_VER found but Java 17+ required — skipping backend."
    echo "          The frontend runs standalone via SQLite."
  fi
else
  echo "[backend] Java not found — skipping backend."
  echo "          The frontend runs standalone via SQLite."
fi

# ── Start frontend ─────────────────────────────────────────────────────────
echo "[frontend] Starting Next.js on http://localhost:3000 ..."
cd "$ROOT/frontend"
npm run dev &
FRONTEND_PID=$!

# ── Cleanup on exit ────────────────────────────────────────────────────────
cleanup() {
  echo ""
  echo "Stopping..."
  [ -n "$BACKEND_PID" ] && kill "$BACKEND_PID" 2>/dev/null || true
  kill "$FRONTEND_PID" 2>/dev/null || true
  wait 2>/dev/null || true
}
trap cleanup INT TERM

echo ""
echo "──────────────────────────────────────"
[ -n "$BACKEND_PID" ] && echo "  Backend (Neo4j)  → http://localhost:8080  (PID $BACKEND_PID)"
echo "  Frontend (Prisma) → http://localhost:3000  (PID $FRONTEND_PID)"
echo "  Press Ctrl+C to stop."
echo "──────────────────────────────────────"

wait
