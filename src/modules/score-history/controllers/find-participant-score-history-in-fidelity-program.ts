import { prisma } from '@/infra/database/prisma/client';
import { ScoreOperation } from '@prisma/client';

type FindParticipantScoreHistoryInFidelityProgramInput = {
  participantId: string;
  fidelityProgramId: string;
};

type FindParticipantScoreHistoryInFidelityProgramOutput = {
  data:
    | {
        id: string;
        score: number;
        operation: keyof typeof ScoreOperation;
        createdAt: string;
      }[]
    | null;
  error: unknown | null;
  code:
    | 'PARTICIPANT_NOT_FOUND'
    | 'FIDELITY_PROGRAM_NOT_FOUND'
    | 'SCORE_HISTORY_FOUND'
    | 'UNEXPECTED_ERROR';
};

export const findParticipantScoreHistoryInFidelityProgram = async ({
  participantId,
  fidelityProgramId,
}: FindParticipantScoreHistoryInFidelityProgramInput): Promise<FindParticipantScoreHistoryInFidelityProgramOutput> => {
  try {
    const participant = await prisma.participant.findUnique({
      where: {
        id: participantId,
      },
    });

    if (!participant) {
      return {
        data: null,
        error: null,
        code: 'PARTICIPANT_NOT_FOUND',
      };
    }

    const fidelityProgram = await prisma.fidelityProgram.findUnique({
      where: {
        id: fidelityProgramId,
      },
    });

    if (!fidelityProgram) {
      return {
        data: null,
        error: null,
        code: 'FIDELITY_PROGRAM_NOT_FOUND',
      };
    }

    const scoreHistory = await prisma.scoreHistory.findMany({
      where: {
        fidelityProgramId,
        participantId,
      },
      select: {
        id: true,
        score: true,
        operation: true,
        createdAt: true,
      },
    });

    const formattedScoreHistory = scoreHistory.map((history) => ({
      ...history,
      score: Number(history.score.toString()),
      createdAt: history.createdAt.toISOString(),
    }));

    return {
      data: formattedScoreHistory,
      error: null,
      code: 'SCORE_HISTORY_FOUND',
    };
  } catch (error) {
    return {
      data: null,
      error,
      code: 'UNEXPECTED_ERROR',
    };
  }
};
