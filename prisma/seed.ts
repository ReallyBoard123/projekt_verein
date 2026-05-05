import 'dotenv/config'
import { PrismaClient } from '../lib/generated/prisma'
import { PrismaNeon } from '@prisma/adapter-neon'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function seedFromSnapshot(snapshotPath: string) {
  const { vereine } = JSON.parse(readFileSync(snapshotPath, 'utf-8'))
  console.log(`Seeding ${vereine.length} Vereine from snapshot...`)

  await prisma.event.deleteMany()
  await prisma.meeting.deleteMany()
  await prisma.verein.deleteMany()

  for (const v of vereine) {
    const { meetings, events, ...vereinData } = v
    const created = await prisma.verein.create({
      data: {
        ...vereinData,
        lastSynced: vereinData.lastSynced ? new Date(vereinData.lastSynced) : null,
        createdAt: new Date(vereinData.createdAt),
        updatedAt: new Date(vereinData.updatedAt),
      },
    })

    if (meetings?.length) {
      await prisma.meeting.createMany({
        data: meetings.map(({ id: _id, vereinId: _vid, createdAt, updatedAt, ...m }: any) => ({
          ...m,
          vereinId: created.id,
          createdAt: new Date(createdAt),
          updatedAt: new Date(updatedAt),
        })),
      })
    }

    if (events?.length) {
      await prisma.event.createMany({
        data: events.map(({ id: _id, vereinId: _vid, createdAt, updatedAt, ...e }: any) => ({
          ...e,
          vereinId: created.id,
          createdAt: new Date(createdAt),
          updatedAt: new Date(updatedAt),
        })),
      })
    }
  }

  const counts = {
    vereine: await prisma.verein.count(),
    meetings: await prisma.meeting.count(),
    events: await prisma.event.count(),
  }
  console.log(`Done — ${counts.vereine} Vereine, ${counts.meetings} Meetings, ${counts.events} Events`)
}

async function seedFromRaw(rawPath: string) {
  const vereine = JSON.parse(readFileSync(rawPath, 'utf-8'))
  console.log(`Seeding ${vereine.length} entries from raw JSON...`)

  await prisma.event.deleteMany()
  await prisma.meeting.deleteMany()
  await prisma.verein.deleteMany()

  let ok = 0
  let err = 0

  for (const item of vereine) {
    try {
      const slug = item.id || item.identity?.name?.toLowerCase().replace(/\s+/g, '-') || `verein-${Date.now()}`
      if (await prisma.verein.findUnique({ where: { slug } })) continue

      const verein = await prisma.verein.create({
        data: {
          slug,
          name: item.identity?.name || 'Unknown',
          type: item.identity?.type || 'Verein',
          isCharitable: item.identity?.is_charitable || false,
          subtitle: item.content?.subtitle || null,
          summary: item.content?.summary || null,
          description: item.content?.description || null,
          categories: JSON.stringify(item.classification?.categories || []),
          tags: JSON.stringify(item.classification?.tags || []),
          district: item.classification?.district || null,
          addressRaw: item.contact?.address_raw || null,
          email: item.contact?.email || null,
          phone: item.contact?.phone || null,
          website: item.contact?.website || null,
          logoUrl: item.metadata?.logo_url || null,
          socialMedia: item.metadata?.social_media ? JSON.stringify(item.metadata.social_media) : null,
          source: item.metadata?.source || null,
          originalUrl: item.metadata?.original_url || null,
          lastSynced: item.metadata?.last_synced ? new Date(item.metadata.last_synced) : null,
          completenessScore: item.metadata?.completeness_score || 0,
          verification: item.metadata?.verification || null,
        },
      })

      if (item.meetings?.length) {
        await prisma.meeting.createMany({
          data: item.meetings.map((m: any) => ({
            vereinId: verein.id,
            type: m.type || 'regular_meeting',
            schedule: m.schedule || '',
            dayOfWeek: m.day_of_week || null,
            time: m.time || null,
            frequency: m.frequency || null,
            location: m.location || null,
            description: m.description || null,
            confidence: m.confidence || 'medium',
          })),
        })
      }

      if (item.events?.length) {
        await prisma.event.createMany({
          data: item.events.map((e: any) => ({
            vereinId: verein.id,
            type: e.type || 'special_event',
            title: e.title || null,
            date: e.date || null,
            dateDisplay: e.date_display || null,
            endDate: e.end_date || null,
            time: e.time || null,
            location: e.location || null,
            description: e.description || null,
            rawMatch: e.raw_match || null,
            confidence: e.confidence || 'medium',
          })),
        })
      }

      ok++
    } catch (e) {
      err++
      console.error(`Error on ${item.id}:`, e)
    }
  }

  console.log(`Done — ${ok} seeded, ${err} errors`)
}

async function main() {
  const snapshotPath = join(process.cwd(), 'data', 'seed-snapshot.json')
  const rawPath      = join(process.cwd(), 'data', 'vereine.json')

  if (existsSync(snapshotPath)) {
    console.log('Using seed-snapshot.json (curated data)')
    await seedFromSnapshot(snapshotPath)
  } else {
    console.log('seed-snapshot.json not found — falling back to vereine.json (raw data)')
    await seedFromRaw(rawPath)
  }
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
