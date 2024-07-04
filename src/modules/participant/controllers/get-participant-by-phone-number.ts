import { prisma } from '@/infra/database/prisma/client';

type GetParticipantByPhoneNumberInput = {
  phoneNumber: string;
};

type GetParticipantByPhoneNumberOutput = {
  data: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    createdAt: string;
  } | null;
  error: unknown | null;
  code: 'PARTICIPANT_NOT_FOUND' | 'PARTICIPANT_FOUND' | 'UNEXPECTED_ERROR';
};

export const getParticipantByPhoneNumber = async ({
  phoneNumber,
}: GetParticipantByPhoneNumberInput): Promise<GetParticipantByPhoneNumberOutput> => {
  try {
    const participant = await prisma.participant.findUnique({
      where: {
        phoneNumber,
      },
    });

    if (!participant) {
      return {
        error: null,
        data: null,
        code: 'PARTICIPANT_NOT_FOUND',
      };
    }

    return {
      data: {
        id: participant.id,
        firstName: participant.firstName,
        lastName: participant.lastName,
        phoneNumber: participant.phoneNumber,
        createdAt: participant.createdAt.toISOString(),
      },
      error: null,
      code: 'PARTICIPANT_FOUND',
    };
  } catch (error) {
    return {
      data: null,
      error,
      code: 'UNEXPECTED_ERROR',
    };
  }
};
