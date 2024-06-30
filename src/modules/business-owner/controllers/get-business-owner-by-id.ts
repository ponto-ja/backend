import { prisma } from '@/infra/database/prisma/client';
import { BusinessOwner } from '../types/business-owner';

type GetBusinessOwnerByIdInput = {
  id: string;
};

type GetBusinessOwnerByIdOutput = {
  data: BusinessOwner | null;
  error: unknown | null;
  code: 'BUSINESS_OWNER_FOUND' | 'BUSINESS_OWNER_NOT_FOUND' | 'UNEXPECTED_ERROR';
};

export const getBusinessOwnerById = async ({
  id,
}: GetBusinessOwnerByIdInput): Promise<GetBusinessOwnerByIdOutput> => {
  try {
    const businessOwner = await prisma.businessOwner.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        hasActiveSubscription: true,
      },
    });

    if (!businessOwner) {
      return {
        data: null,
        error: null,
        code: 'BUSINESS_OWNER_NOT_FOUND',
      };
    }

    return {
      data: businessOwner,
      error: null,
      code: 'BUSINESS_OWNER_FOUND',
    };
  } catch (error) {
    return {
      data: null,
      error,
      code: 'UNEXPECTED_ERROR',
    };
  }
};
