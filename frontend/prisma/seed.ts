import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { readFileSync } from 'fs'
import { join } from 'path'

async function main() {
  console.log('🌱 Starting seed...')

  // Read the JSON file
  const dataPath = join(process.cwd(), 'data', 'vereine.json')
  console.log(`📖 Reading ${dataPath}...`)
  
  const vereine = JSON.parse(readFileSync(dataPath, 'utf-8'))
  console.log(`📊 Found ${vereine.length} entries`)

  // Create database path and adapter
  const dbPath = join(process.cwd(), 'dev.db')
  console.log(`💾 Using database: ${dbPath}`)
  
  // Pass config object with URL to adapter constructor
  const adapter = new PrismaBetterSqlite3({
    url: `file:${dbPath}`
  })

  // Create Prisma client with adapter
  const prisma = new PrismaClient({
    adapter
  })

  // Clear existing data
  console.log('🧹 Clearing existing data...')
  await prisma.event.deleteMany()
  await prisma.meeting.deleteMany()
  await prisma.verein.deleteMany()

  let successCount = 0
  let errorCount = 0

  // Process each verein
  for (const item of vereine) {
    try {
      const slug = item.id || item.identity?.name?.toLowerCase().replace(/\s+/g, '-') || `verein-${Date.now()}`
      
      // Check if already exists
      const existing = await prisma.verein.findUnique({
        where: { slug }
      })
      
      if (existing) {
        console.log(`⏭️  Skipping existing: ${slug}`)
        continue
      }

      // Parse social media if present
      let socialMedia = null
      if (item.metadata?.social_media) {
        socialMedia = JSON.stringify(item.metadata.social_media)
      }

      // Create the verein
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
          socialMedia,
          
          source: item.metadata?.source || null,
          originalUrl: item.metadata?.original_url || null,
          lastSynced: item.metadata?.last_synced ? new Date(item.metadata.last_synced) : null,
          completenessScore: item.metadata?.completeness_score || 0,
          verification: item.metadata?.verification || null,
        }
      })

      // Create meetings
      if (item.meetings && item.meetings.length > 0) {
        for (const meeting of item.meetings) {
          await prisma.meeting.create({
            data: {
              vereinId: verein.id,
              type: meeting.type || 'regular_meeting',
              schedule: meeting.schedule || '',
              dayOfWeek: meeting.day_of_week || null,
              time: meeting.time || null,
              frequency: meeting.frequency || null,
              location: meeting.location || null,
              description: meeting.description || null,
              confidence: meeting.confidence || 'medium',
            }
          })
        }
      }

      // Create events
      if (item.events && item.events.length > 0) {
        for (const event of item.events) {
          await prisma.event.create({
            data: {
              vereinId: verein.id,
              type: event.type || 'special_event',
              title: event.title || null,
              date: event.date || null,
              dateDisplay: event.date_display || null,
              endDate: event.end_date || null,
              time: event.time || null,
              location: event.location || null,
              description: event.description || null,
              rawMatch: event.raw_match || null,
              confidence: event.confidence || 'medium',
            }
          })
        }
      }

      successCount++
      if (successCount % 100 === 0) {
        console.log(`✅ Processed ${successCount}/${vereine.length} entries...`)
      }
    } catch (error) {
      errorCount++
      console.error(`❌ Error processing ${item.id}:`, error)
    }
  }

  console.log('\n🎉 Seed completed!')
  console.log(`   ✅ Success: ${successCount}`)
  console.log(`   ❌ Errors: ${errorCount}`)
  console.log(`   📊 Total: ${vereine.length}`)

  await prisma.$disconnect()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
