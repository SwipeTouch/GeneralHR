// Minimal health check until full API modules are built
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const port = Number(process.env.API_PORT) || 3001;

async function main() {
  await prisma.$connect();
  console.log(`GeneralHR API listening on http://localhost:${port}`);
  console.log('Database connected.');
}

main().catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});
