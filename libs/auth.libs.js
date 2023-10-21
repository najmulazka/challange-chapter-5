const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;

module.exports = {
  registerUser: async (name, email, password, password_confirmation, identity_type, identity_number, address) => {
    try {
      const existEmail = await prisma.users.findUnique({ where: { email } });
      const existIdentityNumber = await prisma.profiles.findUnique({ where: { identity_number } });

      if (password != password_confirmation) throw 'password and confirmation password not same';
      if (existEmail) throw `Post with email : ${email} already`;
      if (existIdentityNumber) throw `Post with identity number : ${identity_number} already`;

      let encryptedPassword = await bcrypt.hash(password, 10);
      const result = await prisma.$transaction(async (prisma) => {
        const users = await prisma.users.create({ data: { name, email, password: encryptedPassword } });
        const profiles = await prisma.profiles.create({ data: { user_id: users.id, identity_type, identity_number, address } });
        return { users, profiles };
      });
      return result;
    } catch (err) {
      throw err;
    }
  },

  loginUser: async (email, password) => {
    try {
      let user = await prisma.users.findUnique({ where: { email } });
      if (!user) throw 'invalid email or password!';

      let isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) throw 'invalid email or password!';

      let token = jwt.sign({ id: user.id }, JWT_SECRET_KEY);
      return { user, token };
    } catch (err) {
      throw err;
    }
  },
};
