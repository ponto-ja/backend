import { prisma } from '@/infra/database/prisma/client';

type RegisterParticipantInFidelityProgramInput = {
  participant: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
  fidelityProgramId: string;
};

type RegisterParticipantInFidelityProgramOutput = {
  error: unknown | null;
  code:
    | 'FIDELITY_PROGRAM_NOT_FOUND'
    | 'PARTICIPANT_REGISTERED_IN_PROGRAM'
    | 'PARTICIPANT_IS_ALREADY_IN_PROGRAM'
    | 'UNEXPECTED_ERROR';
};

export const registerParticipantInFidelityProgram = async ({
  participant: { firstName, lastName, phoneNumber },
  fidelityProgramId,
}: RegisterParticipantInFidelityProgramInput): Promise<RegisterParticipantInFidelityProgramOutput> => {
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
          scores: {
            create: {
              score: 0,
              fidelityProgramId,
            },
          },
          pivotFidelityProgramParticipants: {
            create: {
              fidelityProgramId,
            },
          },
        },
      });

      return {
        error: null,
        code: 'PARTICIPANT_REGISTERED_IN_PROGRAM',
      };
    }

    const participantInProgram = await prisma.pivotFidelityProgramParticipant.findFirst({
      where: {
        fidelityProgramId,
        participantId: participant.id,
      },
    });

    if (participantInProgram) {
      return {
        error: null,
        code: 'PARTICIPANT_IS_ALREADY_IN_PROGRAM',
      };
    }

    await prisma.$transaction([
      prisma.pivotFidelityProgramParticipant.create({
        data: {
          fidelityProgramId,
          participantId: participant.id,
        },
      }),
      prisma.score.create({
        data: {
          score: 0,
          fidelityProgramId,
          participantId: participant.id,
        },
      }),
    ]);

    return {
      error: null,
      code: 'PARTICIPANT_REGISTERED_IN_PROGRAM',
    };
  } catch (error) {
    return {
      error,
      code: 'UNEXPECTED_ERROR',
    };
  }
};
