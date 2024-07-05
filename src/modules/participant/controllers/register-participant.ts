import { prisma } from '@/infra/database/prisma/client';

type RegisterParticipantInput = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

type RegisterParticipantOutput = {
  error: unknown | null;
  code: 'ALREADY_REGISTERED_PARTICIPANT' | 'REGISTERED' | 'UNEXPECTED_ERROR';
};

export const registerParticipant = async ({
  firstName,
  lastName,
  phoneNumber,
}: RegisterParticipantInput): Promise<RegisterParticipantOutput> => {
  try {
    const participantExists = await prisma.participant.findUnique({
      where: {
        phoneNumber,
      },
    });

    if (participantExists) {
      return {
        error: null,
        code: 'ALREADY_REGISTERED_PARTICIPANT',
      };
    }

    await prisma.participant.create({
      data: {
        firstName,
        lastName,
        phoneNumber,
      },
    });

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
