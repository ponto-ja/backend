import { prisma } from '@/infra/database/prisma/client';

type UpdateRewardInput = {
  id: string;
  name?: string;
  scoreNeeded?: number;
  description?: string | null;
};

type UpdateRewardOutput = {
  error: unknown | null;
  code: 'UPDATED' | 'REWARD_NOT_FOUND' | 'UNEXPECTED_ERROR';
};

export const updateReward = async ({
  id,
  name,
  scoreNeeded,
  description,
}: UpdateRewardInput): Promise<UpdateRewardOutput> => {
  try {
    const rewardExists = await prisma.reward.findUnique({
      where: {
        id,
      },
    });

    if (!rewardExists) {
      return {
        error: null,
        code: 'REWARD_NOT_FOUND',
      };
    }

    await prisma.reward.update({
      where: {
        id,
      },
      data: {
        name,
        scoreNeeded,
        description,
      },
    });

    return {
      error: null,
      code: 'UPDATED',
    };
  } catch (error) {
    return {
      error,
      code: 'UNEXPECTED_ERROR',
    };
  }
};
