const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Delete all data', () => {
  beforeAll(async () => {
    await prisma.transactions.deleteMany();
    await prisma.bank_accounts.deleteMany();
    await prisma.profiles.deleteMany();
    await prisma.users.deleteMany();
  });
  test('delete all data', () => {
    // console.log('delete all data');
    expect(1).toBe(1);
  });
});
