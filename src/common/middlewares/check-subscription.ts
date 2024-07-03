import type { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '@/infra/database/prisma/client';

export const checkSubscription = async (request: FastifyRequest, reply: FastifyReply) => {
  const businessOwner = await prisma.businessOwner.findUnique({
    where: {
      id: request.businessOwner.id,
    },
  });

  if (!businessOwner) {
    return reply.status(400).send({ code: 'INVALID_API_KEY' });
  }

  if (!businessOwner.hasActiveSubscription) {
    return reply.status(403).send({
      message: 'Expired subscription. Contact support to renew your subscription.',
      support:
        'https://api.whatsapp.com/send/?phone=5593992423295&text=Ol%C3%A1,+eu+gostaria+de+renovar+a+minha+assinatura+dentro+da+plataforma.',
    });
  }
};
