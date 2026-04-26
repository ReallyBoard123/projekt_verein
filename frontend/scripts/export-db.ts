import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { join } from 'path'
import { writeFileSync } from 'fs'

const dbPath = join(process.cwd(), 'dev.db')
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log(`Reading from ${dbPath} ...`)

  const vereine = await prisma.verein.findMany({
    include: { meetings: true, events: true },
    orderBy: { name: 'asc' },
  })

  console.log(`  ${vereine.length} Vereine found`)

  const meetingCount = vereine.reduce((n, v) => n + v.meetings.length, 0)
  const eventCount   = vereine.reduce((n, v) => n + v.events.length, 0)
  console.log(`  ${meetingCount} Meetings`)
  console.log(`  ${eventCount} Events`)

  const out = {
    exportedAt: new Date().toISOString(),
    counts: { vereine: vereine.length, meetings: meetingCount, events: eventCount },
    vereine,
  }

  const outPath = join(process.cwd(), 'data', 'seed-snapshot.json')
  writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf-8')
  console.log(`\nExported → ${outPath}`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
