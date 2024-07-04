import { prisma } from '@/infra/database/prisma/client';

type GetFidelityProgramInput = {
  businessOwnerId: string;
};

type GetFidelityProgramOutput = {
  data: {
    id: string;
    name: string;
    scoreRate: number;
    createdAt: string;
    rewards: {
      id: string;
      name: string;
      scoreNeeded: number;
      description: string | null;
    }[];
  } | null;
  error: unknown | null;
  code: 'FIDELITY_PROGRAM_FOUND' | 'FIDELITY_PROGRAM_NOT_FOUND' | 'UNEXPECTED_ERROR';
};

export const getFidelityProgram = async ({
  businessOwnerId,
}: GetFidelityProgramInput): Promise<GetFidelityProgramOutput> => {
  try {
    const fidelityProgram = await prisma.fidelityProgram.findUnique({
      where: {
        businessOwnerId,
      },
    });

    if (!fidelityProgram) {
      return {
        data: null,
        error: null,
        code: 'FIDELITY_PROGRAM_NOT_FOUND',
      };
    }

    const rewards = await prisma.reward.findMany({
      where: {
        fidelityProgramId: fidelityProgram.id,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        scoreNeeded: true,
        description: true,
      },
    });

    const formattedRewards = rewards.map((reward) => ({
      ...reward,
      scoreNeeded: Number(reward.scoreNeeded.toString()),
    }));

    return {
      data: {
        id: fidelityProgram.id,
        name: fidelityProgram.name,
        scoreRate: fidelityProgram.scoreRate,
        rewards: formattedRewards,
        createdAt: fidelityProgram.createdAt.toISOString(),
      },
      error: null,
      code: 'FIDELITY_PROGRAM_FOUND',
    };
  } catch (error) {
    return {
      data: null,
      error,
      code: 'UNEXPECTED_ERROR',
    };
  }
};
