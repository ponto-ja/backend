import { prisma } from '@/infra/database/prisma/client';

type UpdateFidelityProgramInput = {
  id: string;
  name?: string;
  scoreRate?: number;
};

type UpdateFidelityProgramOutput = {
  error: unknown | null;
  code: 'FIDELITY_PROGRAM_NOT_FOUND' | 'UPDATED' | 'UNEXPECTED_ERROR';
};

export const updateFidelityProgram = async ({
  id,
  name,
  scoreRate,
}: UpdateFidelityProgramInput): Promise<UpdateFidelityProgramOutput> => {
  try {
    const fidelityProgramExists = await prisma.fidelityProgram.findUnique({
      where: {
        id,
      },
    });

    if (!fidelityProgramExists) {
      return {
        error: null,
        code: 'FIDELITY_PROGRAM_NOT_FOUND',
      };
    }

    await prisma.fidelityProgram.update({
      where: {
        id,
      },
      data: {
        name,
        scoreRate,
      },
    });

    return {
      error: null,
      code: 'UPDATED',
    };
  } catch (error) {
    return {
      error,
      code: 'UNEXPECTED_ERROR',
    };
  }
};
