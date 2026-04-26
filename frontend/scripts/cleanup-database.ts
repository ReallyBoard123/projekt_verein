#!/usr/bin/env tsx
/**
 * Database Cleanup Script
 * Removes noise, fixes common issues, and improves data quality
 */

import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'dev.db');

const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

interface CleanupReport {
  removed: {
    shortNames: number;
    noContactInfo: number;
    spamEntries: number;
  };
  updated: {
    shortDescriptions: number;
    normalizedAddresses: number;
  };
  totalRemoved: number;
  totalUpdated: number;
  finalCount: number;
}

async function cleanup(): Promise<CleanupReport> {
  const report: CleanupReport = {
    removed: { shortNames: 0, noContactInfo: 0, spamEntries: 0 },
    updated: { shortDescriptions: 0, normalizedAddresses: 0 },
    totalRemoved: 0,
    totalUpdated: 0,
    finalCount: 0
  };

  console.log('🔍 Starting database cleanup...\n');

  // Get all Vereine
  const all = await prisma.verein.findMany({
    include: { meetings: true, events: true }
  });

  console.log(`Total entries before cleanup: ${all.length}\n`);

  const toDelete = new Set<string>();
  const toUpdate: Array<{ id: string; updates: any }> = [];

  // === REMOVAL RULES ===

  // 1. Remove entries with very short names (< 3 chars) - obvious noise
  all.forEach(v => {
    if (!v.name || v.name.trim().length < 3) {
      toDelete.add(v.id);
      report.removed.shortNames++;
      console.log(`❌ Removing (short name): ${v.slug} - "${v.name}"`);
    }
  });

  // 2. Remove entries with NO contact info AND no description AND no meetings/events
  all.forEach(v => {
    if (toDelete.has(v.id)) return; // Already marked for deletion

    const hasContact = v.email || v.phone || v.website;
    const hasDescription = v.description && v.description.trim().length > 10;
    const hasMeetings = v.meetings.length > 0;
    const hasEvents = v.events.length > 0;

    if (!hasContact && !hasDescription && !hasMeetings && !hasEvents) {
      toDelete.add(v.id);
      report.removed.noContactInfo++;
      console.log(`❌ Removing (no contact info): ${v.slug}`);
    }
  });

  // 3. Remove obvious spam/test entries
  const spamPatterns = [/^test/i, /^spam/i, /^xxx/i, /^asdf/i, /^123/i];
  all.forEach(v => {
    if (toDelete.has(v.id)) return;

    const isSpam = spamPatterns.some(p => p.test(v.name)) || 
                   spamPatterns.some(p => v.slug.includes('test'));
    
    if (isSpam) {
      toDelete.add(v.id);
      report.removed.spamEntries++;
      console.log(`❌ Removing (spam): ${v.slug} - "${v.name}"`);
    }
  });

  // === UPDATE RULES ===

  // 4. Fix very short descriptions (mark as null instead of single char)
  all.forEach(v => {
    if (toDelete.has(v.id)) return;

    if (v.description && v.description.trim().length > 0 && v.description.trim().length < 10) {
      toUpdate.push({
        id: v.id,
        updates: { description: null }
      });
      report.updated.shortDescriptions++;
      console.log(`📝 Updated (short description): ${v.slug} - "${v.description}" → null`);
    }
  });

  // 5. Normalize incomplete addresses
  all.forEach(v => {
    if (toDelete.has(v.id)) return;

    if (v.addressRaw) {
      const normalized = v.addressRaw.trim();
      
      // If it's just ",  Kassel" or "Kassel", set to null
      if (normalized === ',  Kassel' || normalized === 'Kassel' || normalized === ', Kassel') {
        if (v.addressRaw !== normalized) {
          toUpdate.push({
            id: v.id,
            updates: { addressRaw: null }
          });
          report.updated.normalizedAddresses++;
          console.log(`📝 Updated (normalized address): ${v.slug} - "${v.addressRaw}" → null`);
        }
      }
    }
  });

  // === EXECUTE DELETIONS ===
  console.log(`\n🗑️  Deleting ${toDelete.size} entries...`);
  if (toDelete.size > 0) {
    await prisma.verein.deleteMany({
      where: { id: { in: Array.from(toDelete) } }
    });
    report.totalRemoved = toDelete.size;
  }

  // === EXECUTE UPDATES ===
  console.log(`\n✏️  Updating ${toUpdate.length} entries...`);
  if (toUpdate.length > 0) {
    for (const { id, updates } of toUpdate) {
      await prisma.verein.update({ where: { id }, data: updates });
    }
    report.totalUpdated = toUpdate.length;
  }

  // === FINAL COUNT ===
  const finalCount = await prisma.verein.count();
  report.finalCount = finalCount;

  console.log('\n✅ Cleanup complete!\n');
  console.log('=== Summary ===');
  console.log(`Removed: ${report.totalRemoved} entries`);
  console.log(`  - Short names: ${report.removed.shortNames}`);
  console.log(`  - No contact info: ${report.removed.noContactInfo}`);
  console.log(`  - Spam entries: ${report.removed.spamEntries}`);
  console.log(`Updated: ${report.totalUpdated} entries`);
  console.log(`  - Short descriptions: ${report.updated.shortDescriptions}`);
  console.log(`  - Normalized addresses: ${report.updated.normalizedAddresses}`);
  console.log(`\nFinal database size: ${finalCount} entries`);
  console.log(`Reduction: ${all.length - finalCount} entries (${((all.length - finalCount) / all.length * 100).toFixed(1)}%)`);

  return report;
}

cleanup()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
