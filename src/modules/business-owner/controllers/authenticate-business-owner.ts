import { prisma } from '@/infra/database/prisma/client';

type AuthenticateBusinessOwnerInput = {
  email: string;
};

type AuthenticateBusinessOwnerOutput = {
  error: unknown | null;
  code: 'AUTHENTICATED' | 'INVALID_CREDENTIAL' | 'UNEXPECTED_ERROR';
};

export const authenticateBusinessOwner = async ({
  email,
}: AuthenticateBusinessOwnerInput): Promise<AuthenticateBusinessOwnerOutput> => {
  try {
    const businessOwner = await prisma.businessOwner.findUnique({
      where: {
        email,
      },
    });

    if (!businessOwner) {
      return {
        error: null,
        code: 'INVALID_CREDENTIAL',
      };
    }

    return {
      error: null,
      code: 'AUTHENTICATED',
    };
  } catch (error) {
    return {
      error,
      code: 'UNEXPECTED_ERROR',
    };
  }
};
