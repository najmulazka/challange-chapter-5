const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  createAccount: async (user_id, bank_name, bank_account_number, balance) => {
    try {
      const existUser = await prisma.users.findUnique({ where: { id: user_id } });
      const existAccountNumber = await prisma.bank_accounts.findUnique({ where: { bank_account_number } });

      if (!existUser) throw `Post user id ${user_id} doesn't not exist`;
      if (existAccountNumber) throw `Post with bank account number : ${bank_account_number} already`;

      const result = await prisma.bank_accounts.create({ data: { user_id, bank_name, bank_account_number, balance } });
      return result;
    } catch (err) {
      throw err;
    }
  },

  getAccounts: async () => {
    try {
      const result = await prisma.bank_accounts.findMany({
        orderBy: {
          id: 'asc',
        },
      });
      return result;
    } catch (err) {
      throw err;
    }
  },

  getAccountById: async (accountId) => {
    try {
      const result = await prisma.bank_accounts.findUnique({
        where: {
          id: accountId,
        },
        select: {
          id: true,
          users: {
            select: {
              name: true,
            },
          },
          bank_name: true,
          bank_account_number: true,
          balance: true,
        },
      });
      if (!result) throw `Post with id ${accountId} doesn't not exist`;

      return result;
    } catch (err) {
      throw err;
    }
  },
};
