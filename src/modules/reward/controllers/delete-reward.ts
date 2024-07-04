import { prisma, xprisma } from '@/infra/database/prisma/client';

type DeleteRewardInput = {
  id: string;
};

type DeleteRewardOutput = {
  error: unknown | null;
  code: 'REWARD_NOT_FOUND' | 'DELETED' | 'UNEXPECTED_ERROR';
};

export const deleteReward = async ({
  id,
}: DeleteRewardInput): Promise<DeleteRewardOutput> => {
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

    await xprisma.reward.softDelete(id);

    return {
      error: null,
      code: 'DELETED',
    };
  } catch (error) {
    return {
      error,
      code: 'UNEXPECTED_ERROR',
    };
  }
};
