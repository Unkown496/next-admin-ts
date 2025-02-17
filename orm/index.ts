import 'dotenv/config';

import { PrismaClient } from '@prisma/client';

import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

const client = new PrismaClient();

type AdminData = {
  email: string;
  password: string;
};

const orm = new PrismaClient().$extends({
  model: {
    admin: {
      async singIn({ email, password }: AdminData) {
        const admin = await client.admin.findUnique({
          where: {
            email,
          },
        });

        if (!admin) return null;

        const passwordVerify = await argon2.verify(admin.password, password);
        if (!passwordVerify) return null;

        const token = jwt.sign(
          {
            id: admin.id,
            email: admin.email,
          },
          process.env.JWT_SECRET,
          {
            expiresIn:
              (process.env.JWT_EXPIRES as jwt.SignOptions['expiresIn']) || '1h',
          },
        );

        return token;
      },

      async register({ email, password }: AdminData) {
        const createAdmin = await client.admin.create({
          data: {
            email,
            password: await argon2.hash(password),
          },
        });

        return createAdmin;
      },
    },
  },
});

export default orm;
