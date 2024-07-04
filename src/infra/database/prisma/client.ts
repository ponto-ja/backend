import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export const xprisma = prisma.$extends({
  model: {
    reward: {
      async softDelete(id: string) {
        await prisma.reward.update({
          where: {
            id,
          },
          data: {
            deletedAt: new Date(),
          },
        });
      },
    },
  },
});
