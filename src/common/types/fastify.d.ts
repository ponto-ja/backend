import 'fastify';

declare module 'fastify' {
  export interface FastifyRequest {
    businessOwner: {
      id: string;
    };
  }
}
