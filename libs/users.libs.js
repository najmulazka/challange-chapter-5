const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  getUsers: async () => {
    try {
      const result = await prisma.users.findMany({
        orderBy: {
          id: 'asc',
        },
      });
      return result;
    } catch (err) {
      throw err;
    }
  },

  getUserById: async (userId) => {
    try {
      const result = await prisma.users.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          profiles: {
            select: {
              identity_type: true,
              identity_number: true,
              address: true,
            },
          },
        },
      });
      if (!result) throw `Post with ID ${userId} doesn't not exist`;

      return result;
    } catch (err) {
      throw err;
    }
  },
};
