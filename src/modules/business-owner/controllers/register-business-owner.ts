import { prisma } from '@/infra/database/prisma/client';

type RegisterBusinessOwnerInput = {
  firstName: string;
  lastName: string;
  email: string;
};

type RegisterBusinessOwnerOutput = {
  error: unknown | null;
  code: 'CREATED' | 'EMAIL_ALREADY_EXISTS' | 'UNEXPECTED_ERROR';
};

export const registerBusinewsOwner = async ({
  firstName,
  lastName,
  email,
}: RegisterBusinessOwnerInput): Promise<RegisterBusinessOwnerOutput> => {
  const businessOwnerExists = await prisma.businessOwner.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  if (businessOwnerExists) {
    return {
      error: null,
      code: 'EMAIL_ALREADY_EXISTS',
    };
  }

  try {
    await prisma.businessOwner.create({
      data: {
        firstName,
        lastName,
        email,
        hasActiveSubscription: true,
      },
    });

    return {
      error: null,
      code: 'CREATED',
    };
  } catch (error) {
    return {
      error,
      code: 'UNEXPECTED_ERROR',
    };
  }
};
