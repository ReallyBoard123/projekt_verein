const { PrismaClient } = require('./lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const vereine = await prisma.verein.count();
  const meetings = await prisma.meeting.count();
  const events = await prisma.event.count();
  console.log(`Vereine: ${vereine}, Meetings: ${meetings}, Events: ${events}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
