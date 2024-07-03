import { prisma } from '@/infra/database/prisma/client';
import dayjs from 'dayjs';

type GetFidelityProgramSummaryInput = {
  businessOwnerId: string;
};

type GetFidelityProgramSummaryOutput = {
  data: {
    id: string;
    name: string;
    scoreRate: number;
    createdAt: string;
    numberOfParticipants: number;
    numberOfRewards: number;
    numberOfActiveDays: number;
  } | null;
  error: unknown | null;
  code: 'FIDELITY_PROGRAM_FOUND' | 'FIDELITY_PROGRAM_NOT_FOUND' | 'UNEXPECTED_ERROR';
};

export const getFidelityProgramSummary = async ({
  businessOwnerId,
}: GetFidelityProgramSummaryInput): Promise<GetFidelityProgramSummaryOutput> => {
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

    const numberOfParticipants = await prisma.pivotFidelityProgramParticipant.count({
      where: {
        fidelityProgramId: fidelityProgram.id,
      },
    });

    const numberOfRewards = await prisma.reward.count({
      where: {
        fidelityProgramId: fidelityProgram.id,
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
        createdAt: fidelityProgram.createdAt.toISOString(),
        numberOfParticipants,
        numberOfRewards,
        numberOfActiveDays: differenceBetweenDatesInDays,
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
