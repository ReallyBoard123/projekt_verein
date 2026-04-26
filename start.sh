#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"

# Install frontend dependencies if needed
if [ ! -d "$ROOT/frontend/node_modules" ]; then
  echo "Installing frontend dependencies..."
  cd "$ROOT/frontend"
  npm install
fi

# Free port 8080 if occupied
PORT_PID=$(lsof -ti tcp:8080 2>/dev/null || true)
if [ -n "$PORT_PID" ]; then
  echo "Port 8080 in use (PID $PORT_PID), stopping it..."
  kill "$PORT_PID" 2>/dev/null
  sleep 1
fi

echo "Starting backend..."
cd "$ROOT/backend"
./gradlew bootRun &
BACKEND_PID=$!

echo "Starting frontend..."
cd "$ROOT/frontend"
npm run dev &
FRONTEND_PID=$!

cleanup() {
  echo ""
  echo "Stopping..."
  kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null
  wait "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null
}
trap cleanup INT TERM

echo ""
echo "Backend PID:  $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "Press Ctrl+C to stop both."

wait
