import { prisma } from '@/infra/database/prisma/client';

type FindFidelityProgramsByParticipantIdInput = {
  id: string;
};

type FindFidelityProgramsByParticipantIdOutput = {
  data:
    | {
        id: string;
        name: string;
        scoreRate: number;
        createdAt: string;
      }[]
    | null;
  error: unknown | null;
  code: 'PARTICIPANT_NOT_FOUND' | 'FIDELITY_PROGRAMS_FOUND' | 'UNEXPECTED_ERROR';
};

export const findFidelityProgramsByParticipantId = async ({
  id,
}: FindFidelityProgramsByParticipantIdInput): Promise<FindFidelityProgramsByParticipantIdOutput> => {
  try {
    const participantExists = await prisma.participant.findUnique({
      where: {
        id,
      },
    });

    if (!participantExists) {
      return {
        data: null,
        error: null,
        code: 'PARTICIPANT_NOT_FOUND',
      };
    }

    const data = await prisma.pivotFidelityProgramParticipant.findMany({
      where: {
        participantId: id,
      },
      include: {
        fidelityProgram: {
          select: {
            id: true,
            name: true,
            scoreRate: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const fidelityPrograms = data.map((item) => ({
      id: item.fidelityProgram.id,
      name: item.fidelityProgram.name,
      scoreRate: item.fidelityProgram.scoreRate,
      createdAt: item.fidelityProgram.createdAt.toISOString(),
    }));

    return {
      data: fidelityPrograms,
      error: null,
      code: 'FIDELITY_PROGRAMS_FOUND',
    };
  } catch (error) {
    return {
      data: null,
      error,
      code: 'UNEXPECTED_ERROR',
    };
  }
};
