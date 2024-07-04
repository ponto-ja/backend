import { prisma } from '@/infra/database/prisma/client';

type FindParticipantsByFidelityProgramIdInput = {
  id: string;
};

type FindParticipantsByFidelityProgramIdOutput = {
  data:
    | {
        id: string;
        firstName: string;
        lastName: string;
        phoneNumber: string;
        createdAt: string;
      }[]
    | null;
  error: unknown | null;
  code: 'PARTICIPANTS_FOUND' | 'FIDELITY_PROGRAM_NOT_FOUND' | 'UNEXPECTED_ERROR';
};

export const findParticipantsByFidelityProgramId = async ({
  id,
}: FindParticipantsByFidelityProgramIdInput): Promise<FindParticipantsByFidelityProgramIdOutput> => {
  try {
    const fidelityProgramExists = await prisma.fidelityProgram.findUnique({
      where: {
        id,
      },
    });

    if (!fidelityProgramExists) {
      return {
        data: null,
        error: null,
        code: 'FIDELITY_PROGRAM_NOT_FOUND',
      };
    }

    const data = await prisma.pivotFidelityProgramParticipant.findMany({
      where: {
        fidelityProgramId: id,
      },
      include: {
        participant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            createdAt: true,
          },
        },
      },
    });

    const participants = data.map((item) => ({
      id: item.participant.id,
      firstName: item.participant.firstName,
      lastName: item.participant.lastName,
      phoneNumber: item.participant.phoneNumber,
      createdAt: item.participant.createdAt.toISOString(),
    }));

    return {
      data: participants,
      error: null,
      code: 'PARTICIPANTS_FOUND',
    };
  } catch (error) {
    return {
      data: null,
      error,
      code: 'UNEXPECTED_ERROR',
    };
  }
};
