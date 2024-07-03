import { prisma } from '@/infra/database/prisma/client';
import dayjs from 'dayjs';

type GetFidelityProgramByIdAndParticipantIdInput = {
  fidelityProgramId: string;
  participantId: string;
};

type GetFidelityProgramByIdAndParticipantIdOutput = {
  data: {
    id: string;
    name: string;
    numberOfRewards: number;
    numberOfActiveDays: number;
    scoreRate: number;
    totalScore: number;
    createdAt: string;
  } | null;
  error: unknown | null;
  code:
    | 'FIDELITY_PROGRAM_NOT_FOUND'
    | 'FIDELITY_PROGRAM_FOUND'
    | 'PARTICIPANT_NOT_FOUND'
    | 'UNEXPECTED_ERROR';
};

export const getFidelityProgramByIdAndParticipantId = async ({
  fidelityProgramId,
  participantId,
}: GetFidelityProgramByIdAndParticipantIdInput): Promise<GetFidelityProgramByIdAndParticipantIdOutput> => {
  try {
    const fidelityProgram = await prisma.fidelityProgram.findUnique({
      where: {
        id: fidelityProgramId,
      },
    });

    if (!fidelityProgram) {
      return {
        data: null,
        error: null,
        code: 'FIDELITY_PROGRAM_FOUND',
      };
    }

    const participantExists = await prisma.participant.findUnique({
      where: {
        id: participantId,
      },
    });

    if (!participantExists) {
      return {
        data: null,
        error: null,
        code: 'PARTICIPANT_NOT_FOUND',
      };
    }

    const numberOfRewards = await prisma.reward.count({
      where: {
        fidelityProgramId,
      },
    });

    const totalScore = await prisma.score.count({
      where: {
        fidelityProgramId,
      },
    });

    const differenceBetweenDatesInDays = dayjs()
      .startOf('date')
      .diff(dayjs(fidelityProgram.createdAt).startOf('date'), 'days');

    return {
      data: {
        id: fidelityProgram.id,
        name: fidelityProgram.name,
        scoreRate: fidelityProgram.scoreRate,
        numberOfActiveDays: differenceBetweenDatesInDays,
        numberOfRewards,
        totalScore,
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
