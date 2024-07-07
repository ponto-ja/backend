import { prisma } from '@/infra/database/prisma/client';

type RegisterScoreInput = {
  participant: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
  fidelityProgramId: string;
  score: number;
};

type RegisterScoreOutput = {
  error: unknown | null;
  code: 'FIDELITY_PROGRAM_NOT_FOUND' | 'REGISTERED' | 'UNEXPECTED_ERROR';
};

export const registerScore = async ({
  participant: { firstName, lastName, phoneNumber },
  fidelityProgramId,
  score,
}: RegisterScoreInput): Promise<RegisterScoreOutput> => {
  try {
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

    const participant = await prisma.participant.findUnique({
      where: {
        phoneNumber,
      },
    });

    if (!participant) {
      await prisma.participant.create({
        data: {
          firstName,
          lastName,
          phoneNumber,
          pivotFidelityProgramParticipants: {
            create: {
              fidelityProgramId,
            },
          },
          scores: {
            create: {
              score,
              fidelityProgramId,
            },
          },
          scoreHistory: {
            create: {
              score,
              operation: 'EARNING',
              fidelityProgramId,
            },
          },
        },
      });

      return {
        error: null,
        code: 'REGISTERED',
      };
    }

    const participantInProgram = await prisma.pivotFidelityProgramParticipant.findFirst({
      where: {
        fidelityProgramId,
        participantId: participant.id,
      },
    });

    if (!participantInProgram) {
      await prisma.$transaction([
        prisma.pivotFidelityProgramParticipant.create({
          data: {
            fidelityProgramId,
            participantId: participant.id,
          },
        }),
        prisma.score.create({
          data: {
            score,
            fidelityProgramId,
            participantId: participant.id,
          },
        }),
        prisma.scoreHistory.create({
          data: {
            score,
            operation: 'EARNING',
            fidelityProgramId,
            participantId: participant.id,
          },
        }),
      ]);

      return {
        error: null,
        code: 'REGISTERED',
      };
    }

    const registeredScore = await prisma.score.findFirst({
      where: {
        fidelityProgramId,
        participantId: participant.id,
      },
      select: {
        id: true,
        score: true,
      },
    });

    if (!registeredScore) {
      return {
        error: null,
        code: 'UNEXPECTED_ERROR',
      };
    }

    await prisma.$transaction([
      prisma.score.update({
        where: {
          id: registeredScore.id,
        },
        data: {
          score: Number(registeredScore.score.toString()) + score,
        },
      }),
      prisma.scoreHistory.create({
        data: {
          fidelityProgramId,
          participantId: participant.id,
          score,
          operation: 'EARNING',
        },
      }),
    ]);

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
