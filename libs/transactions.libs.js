const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  createTransaction: async (source_account_id, destination_account_id, amount) => {
    try {
      if (source_account_id == null && destination_account_id == null) throw `Transaction failed!`;
      if (destination_account_id == null) {
        const bank_account = await prisma.bank_accounts.findUnique({
          where: {
            id: Number(source_account_id),
          },
        });

        if (!bank_account) throw `The source account does not exist`;
        if (bank_account.balance < amount) throw `Low balance source account`;
        const result = await prisma.transactions.create({
          data: {
            source_account_id: Number(source_account_id),
            amount: Number(amount),
          },
        });

        await prisma.bank_accounts.update({
          where: {
            id: Number(source_account_id),
          },
          data: {
            balance: bank_account.balance - Number(amount),
          },
        });
        return result;
      }

      if (source_account_id == null) {
        const bank_account = await prisma.bank_accounts.findUnique({
          where: {
            id: Number(destination_account_id),
          },
        });

        if (!bank_account) throw `The destination account does not exist`;
        const result = await prisma.transactions.create({
          data: {
            destination_account_id: Number(destination_account_id),
            amount: Number(amount),
          },
        });

        await prisma.bank_accounts.update({
          where: {
            id: Number(destination_account_id),
          },
          data: {
            balance: bank_account.balance + Number(amount),
          },
        });

        return result;
      }

      const source_bank_account = await prisma.bank_accounts.findUnique({
        where: {
          id: Number(source_account_id),
        },
      });

      const destination_bank_account = await prisma.bank_accounts.findUnique({
        where: {
          id: Number(destination_account_id),
        },
      });

      if (!source_bank_account) throw `The source account does not exist`;
      if (!destination_bank_account) throw `The destination account does not exist`;
      if (source_account_id == destination_account_id) throw `Source account id and destination account id cannot be the same`;
      if (source_bank_account.balance < amount) throw `Low balance source account`;

      const result = await prisma.transactions.create({
        data: {
          source_account_id: Number(source_account_id),
          destination_account_id: Number(destination_account_id),
          amount: Number(amount),
        },
      });

      await prisma.bank_accounts.update({
        where: {
          id: Number(source_account_id),
        },
        data: {
          balance: source_bank_account.balance - Number(amount),
        },
      });

      await prisma.bank_accounts.update({
        where: {
          id: Number(destination_account_id),
        },
        data: {
          balance: destination_bank_account.balance + Number(amount),
        },
      });

      return result;
    } catch (err) {
      throw err;
    }
  },

  getTransactions: async () => {
    try {
      const result = await prisma.transactions.findMany({
        orderBy: {
          id: 'asc',
        },
      });

      return result;
    } catch (err) {
      throw err;
    }
  },

  getTransactionById: async (transactionId) => {
    try {
      const transaction = await prisma.transactions.findUnique({ where: { id: transactionId } });

      if (!transaction) throw `Id transaction doesn't not exist`;

      if (transaction.destination_account_id == null) {
        const result = await prisma.$transaction(async (prisma) => {
          const source_bank_account = await prisma.bank_accounts.findUnique({ where: { id: transaction.source_account_id } });
          const source_user = await prisma.users.findUnique({ where: { id: source_bank_account.user_id } });
          return {
            id: transaction.id,
            source_account_id: transaction.source_account_id,
            source_name: source_user.name,
            source_bank_name: source_bank_account.bank_name,
            source_bank_account_number: source_bank_account.bank_account_number,
            amount: transaction.amount,
          };
        });
        return result;
      }

      if (transaction.source_account_id == null) {
        const result = await prisma.$transaction(async (prisma) => {
          const destination_bank_account = await prisma.bank_accounts.findUnique({ where: { id: transaction.destination_account_id } });
          const destination_user = await prisma.users.findUnique({ where: { id: destination_bank_account.user_id } });
          return {
            id: transaction.id,
            destination_account_id: transaction.destination_account_id,
            destination_name: destination_user.name,
            destination_bank_name: destination_bank_account.bank_name,
            destination_bank_account_number: destination_bank_account.bank_account_number,
            amount: transaction.amount,
          };
        });
        return result;
      }

      if (transaction.source_account_id !== null && transaction.destination_account_id !== null) {
        const result = await prisma.$transaction(async (prisma) => {
          const source_bank_account = await prisma.bank_accounts.findUnique({ where: { id: transaction.source_account_id } });
          const source_user = await prisma.users.findUnique({ where: { id: source_bank_account.user_id } });
          const destination_bank_account = await prisma.bank_accounts.findUnique({ where: { id: transaction.destination_account_id } });
          const destination_user = await prisma.users.findUnique({ where: { id: destination_bank_account.user_id } });
          return {
            id: transaction.id,
            source_account_id: transaction.source_account_id,
            source_name: source_user.name,
            source_bank_name: source_bank_account.bank_name,
            source_bank_account_number: source_bank_account.bank_account_number,
            destination_account_id: transaction.destination_account_id,
            destination_name: destination_user.name,
            destination_bank_name: destination_bank_account.bank_name,
            destination_bank_account_number: destination_bank_account.bank_account_number,
            amount: transaction.amount,
          };
        });
        return result;
      }
    } catch (err) {
      throw err;
    }
  },
};
