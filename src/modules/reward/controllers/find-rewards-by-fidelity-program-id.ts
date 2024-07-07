import { prisma } from '@/infra/database/prisma/client';

type FindRewardsByFidelityProgramIdInput = {
  fidelityProgramId: string;
};

type FindRewardsByFidelityProgramIdOutput = {
  data:
    | {
        name: string;
        scoreNeeded: number;
        description: string | null;
      }[]
    | null;
  error: unknown | null;
  code: 'FIDELITY_PROGRAM_NOT_FOUND' | 'REWARDS_FOUND' | 'UNEXPECTED_ERROR';
};

export const findRewardsByFidelityProgramId = async ({
  fidelityProgramId,
}: FindRewardsByFidelityProgramIdInput): Promise<FindRewardsByFidelityProgramIdOutput> => {
  try {
    const fidelityProgramExists = await prisma.fidelityProgram.findUnique({
      where: {
        id: fidelityProgramId,
      },
    });

    if (!fidelityProgramExists) {
      return {
        data: null,
        error: null,
        code: 'FIDELITY_PROGRAM_NOT_FOUND',
      };
    }

    const rewards = await prisma.reward.findMany({
      where: {
        fidelityProgramId: fidelityProgramId,
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
      data: formattedRewards,
      error: null,
      code: 'REWARDS_FOUND',
    };
  } catch (error) {
    return {
      data: null,
      error,
      code: 'UNEXPECTED_ERROR',
    };
  }
};
