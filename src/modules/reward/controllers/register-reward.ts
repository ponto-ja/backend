import { prisma } from '@/infra/database/prisma/client';

type RegisterRewardInput = {
  fidelityProgramId: string;
  name: string;
  scoreNeeded: number;
  description?: string | null;
};

type RegisterRewardOutput = {
  error: unknown | null;
  code: 'REGISTERED' | 'FIDELITY_PROGRAM_NOT_FOUND' | 'UNEXPECTED_ERROR';
};

export const registerReward = async ({
  fidelityProgramId,
  name,
  scoreNeeded,
  description,
}: RegisterRewardInput): Promise<RegisterRewardOutput> => {
  try {
    const fidelityProgramExists = await prisma.fidelityProgram.findUnique({
      where: {
        id: fidelityProgramId,
      },
    });

    if (!fidelityProgramExists) {
      return {
        error: null,
        code: 'FIDELITY_PROGRAM_NOT_FOUND',
      };
    }

    await prisma.reward.create({
      data: {
        name,
        scoreNeeded,
        description,
        fidelityProgramId,
      },
    });

    return {
      error: null,
      code: 'REGISTERED',
    };
  } catch (error) {
    return {
      error,
      code: 'UNEXPECTED_ERROR',
    };
  }
};
