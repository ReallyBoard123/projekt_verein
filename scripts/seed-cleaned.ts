#!/usr/bin/env tsx
/**
 * Replace database with cleaned_entries.json
 * Drops all existing data and seeds only the 157 verified high-quality entries
 */

import 'dotenv/config'
import { PrismaClient } from '../lib/generated/prisma';
import { PrismaNeon } from '@prisma/adapter-neon';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cleanedDataPath = path.join(__dirname, '..', 'data', 'cleaned_entries.json');

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

interface CleanedEntry {
  name: string;
  website?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  lat?: number | null;
  lng?: number | null;
  short_description: string;
  long_description: string;
  primary_category: string;
  secondary_tags: string[];
  target_groups: string[];
  meeting_schedule?: Array<{
    day: string;
    time_start?: string | null;
    time_end?: string | null;
    frequency: string;
    note?: string | null;
  }>;
  upcoming_events?: Array<{
    title: string;
    date?: string | null;
    dateDisplay?: string | null;
    endDate?: string | null;
    time?: string | null;
    location?: string | null;
    description?: string | null;
  }>;
  verdict: string;
  confidence: number;
  reasoning: string;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
}

async function seed(): Promise<void> {
  console.log('🗑️  Dropping all existing data...\n');
  
  // Delete all entries (cascade will handle meetings/events)
  const existingCount = await prisma.verein.count();
  console.log(`Current entries: ${existingCount}`);
  
  await prisma.verein.deleteMany({});
  console.log(`✅ Deleted all ${existingCount} entries\n`);

  // Load cleaned data
  console.log('📖 Loading cleaned_entries.json...');
  const rawData = fs.readFileSync(cleanedDataPath, 'utf-8');
  const cleanedEntries: CleanedEntry[] = JSON.parse(rawData);
  console.log(`Loaded ${cleanedEntries.length} cleaned entries\n`);

  // Filter to only "keep" verdict
  const toImport = cleanedEntries.filter(e => e.verdict === 'keep');
  console.log(`Entries with "keep" verdict: ${toImport.length}\n`);

  console.log('📝 Importing cleaned entries...\n');
  
  let success = 0;
  let failed = 0;

  for (const entry of toImport) {
    try {
      const slug = generateSlug(entry.name);
      
      // Check for duplicate slug
      const existing = await prisma.verein.findUnique({ where: { slug } });
      if (existing) {
        console.log(`⚠️  Skipping "${entry.name}" - duplicate slug: ${slug}`);
        failed++;
        continue;
      }

      // Create Verein with embedded meetings and events
      await prisma.verein.create({
        data: {
          slug,
          name: entry.name,
          type: 'Verein',
          isCharitable: false,
          
          subtitle: null,
          summary: entry.short_description,
          description: entry.long_description,
          
          categories: JSON.stringify([entry.primary_category]),
          tags: JSON.stringify(entry.secondary_tags || []),
          district: null, // Can be enriched later
          
          addressRaw: entry.address || null,
          addressLat: entry.lat || null,
          addressLng: entry.lng || null,
          email: entry.email || null,
          phone: entry.phone || null,
          website: entry.website || null,
          
          logoUrl: null,
          socialMedia: null,
          
          source: 'cleaned_entries.json',
          originalUrl: entry.website || null,
          lastSynced: new Date(),
          completenessScore: entry.confidence || 0.95,
          verification: 'manual_review',
          
          // Create meetings
          meetings: {
            create: (entry.meeting_schedule || []).map(schedule => ({
              type: 'regular_meeting',
              schedule: `${schedule.day} ${schedule.time_start || ''}`.trim(),
              dayOfWeek: schedule.day,
              time: schedule.time_start,
              frequency: schedule.frequency,
              location: null,
              description: schedule.note,
              confidence: 'high'
            }))
          },
          
          // Create events
          events: {
            create: (entry.upcoming_events || []).map(event => ({
              type: 'special_event',
              title: event.title,
              date: event.date,
              dateDisplay: event.dateDisplay,
              endDate: event.endDate,
              time: event.time,
              location: event.location,
              description: event.description,
              confidence: 'high'
            }))
          }
        }
      });
      
      success++;
      console.log(`✅ ${entry.name}`);
      
    } catch (error) {
      failed++;
      console.error(`❌ Failed to import "${entry.name}":`, error);
    }
  }

  const finalCount = await prisma.verein.count();
  
  console.log('\n✅ Seeding complete!\n');
  console.log('=== Summary ===');
  console.log(`Successfully imported: ${success} entries`);
  console.log(`Failed: ${failed} entries`);
  console.log(`Final database size: ${finalCount} entries`);
  
  // Quality metrics
  const withCoords = await prisma.verein.count({
    where: { addressLat: { not: null }, addressLng: { not: null } }
  });
  const withMeetings = await prisma.meeting.count();
  const withEvents = await prisma.event.count();
  const withWebsite = await prisma.verein.count({ where: { website: { not: null } } });
  const withEmail = await prisma.verein.count({ where: { email: { not: null } } });
  
  console.log('\n=== Quality Metrics ===');
  console.log(`With coordinates: ${withCoords} (${(withCoords/finalCount*100).toFixed(1)}%)`);
  console.log(`With meetings: ${withMeetings} entries`);
  console.log(`With events: ${withEvents} entries`);
  console.log(`With website: ${withWebsite} (${(withWebsite/finalCount*100).toFixed(1)}%)`);
  console.log(`With email: ${withEmail} (${(withEmail/finalCount*100).toFixed(1)}%)`);
}

seed()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
