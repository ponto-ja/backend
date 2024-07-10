import { prisma } from '@/infra/database/prisma/client';

type ExchangeScoreInput = {
  participantId: string;
  rewardId: string;
  fidelityProgramId: string;
};

type ExchangeScoreOutput = {
  error: unknown | null;
  code:
    | 'PARTICIPANT_NOT_FOUND'
    | 'REWARD_NOT_FOUND'
    | 'FIDELITY_PROGRAM_NOT_FOUND'
    | 'INSUFFICIENT_SCORE'
    | 'EXCHANGED_SCORES'
    | 'UNEXPECTED_ERROR';
};

export const exchangeScore = async ({
  participantId,
  rewardId,
  fidelityProgramId,
}: ExchangeScoreInput): Promise<ExchangeScoreOutput> => {
  try {
    const participant = await prisma.participant.findUnique({
      where: {
        id: participantId,
      },
    });

    if (!participant) {
      return {
        error: null,
        code: 'PARTICIPANT_NOT_FOUND',
      };
    }

    const reward = await prisma.reward.findUnique({
      where: {
        id: rewardId,
      },
    });

    if (!reward) {
      return {
        error: null,
        code: 'REWARD_NOT_FOUND',
      };
    }

    const fidelityProgram = await prisma.fidelityProgram.findUnique({
      where: {
        id: fidelityProgramId,
      },
    });

    if (!fidelityProgram) {
      return {
        error: null,
        code: 'FIDELITY_PROGRAM_NOT_FOUND',
      };
    }

    const participantScoreInProgram = await prisma.score.findFirst({
      where: {
        fidelityProgramId,
        participantId,
      },
    });

    if (!participantScoreInProgram) {
      return {
        error: null,
        code: 'UNEXPECTED_ERROR',
      };
    }

    const isSufficientScore = participantScoreInProgram.score >= reward.scoreNeeded;

    if (!isSufficientScore) {
      return {
        error: null,
        code: 'INSUFFICIENT_SCORE',
      };
    }

    await prisma.score.update({
      where: {
        id: participantScoreInProgram.id,
      },
      data: {
        score: participantScoreInProgram.score - reward.scoreNeeded,
      },
    });

    await prisma.scoreHistory.create({
      data: {
        fidelityProgramId,
        participantId,
        operation: 'SPEDING',
        score: reward.scoreNeeded,
      },
    });

    await prisma.rewardHistory.create({
      data: {
        fidelityProgramId,
        participantId,
        name: reward.name,
        description: reward.description,
        scoreNeeded: reward.scoreNeeded,
      },
    });

    return {
      error: null,
      code: 'EXCHANGED_SCORES',
    };
  } catch (error) {
    return {
      error,
      code: 'UNEXPECTED_ERROR',
    };
  }
};
