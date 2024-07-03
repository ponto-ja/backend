import { prisma } from '@/infra/database/prisma/client';

type RegisterFidelityProgramInput = {
  businessOwnerId: string;
  name: string;
  scoreRate: number;
  rewards: {
    name: string;
    scoreNeeded: number;
    description?: string | null;
  }[];
};

type RegisterFidelityProgramOutput = {
  data: {
    id: string;
  } | null;
  error: unknown | null;
  code:
    | 'REWARDS_CANNOT_BE_EMPTY_LIST'
    | 'FIDELITY_PROGRAM_ALREADY_EXISTS'
    | 'REGISTERED'
    | 'UNEXPECTED_ERROR';
};

export const registerFidelityProgram = async ({
  businessOwnerId,
  name,
  scoreRate,
  rewards,
}: RegisterFidelityProgramInput): Promise<RegisterFidelityProgramOutput> => {
  try {
    const fidelityProgramExists = await prisma.fidelityProgram.findUnique({
      where: {
        businessOwnerId,
      },
    });

    if (fidelityProgramExists) {
      return {
        data: null,
        error: null,
        code: 'FIDELITY_PROGRAM_ALREADY_EXISTS',
      };
    }

    if (rewards.length === 0) {
      return {
        data: null,
        error: null,
        code: 'REWARDS_CANNOT_BE_EMPTY_LIST',
      };
    }

    const fidelityProgram = await prisma.fidelityProgram.create({
      data: {
        name,
        scoreRate,
        businessOwnerId,
      },
      select: {
        id: true,
      },
    });

    await prisma.reward.createMany({
      data: rewards.map((reward) => ({
        fidelityProgramId: fidelityProgram.id,
        name: reward.name,
        scoreNeeded: reward.scoreNeeded,
        description: reward.description ?? null,
      })),
    });

    return {
      data: {
        id: fidelityProgram.id,
      },
      error: null,
      code: 'REGISTERED',
    };
  } catch (error) {
    return {
      data: null,
      error,
      code: 'UNEXPECTED_ERROR',
    };
  }
};
