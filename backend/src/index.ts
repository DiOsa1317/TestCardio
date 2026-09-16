import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = Fastify({ logger: true });

app.register(cors);

// Тестовый маршрут
app.get('/', async () => {
  return { message: 'CardioLite API is running!' };
});

// Маршрут для получения врачей
app.get('/doctors', async () => {
  const doctors = await prisma.doctor.findMany();
  return doctors;
});


// Маршрут для создания нового врача
app.post<{ Body: { name: string; specialty: string } }>('/doctors', {
    schema: {
      body: {
        type: 'object',
        required: ['name', 'specialty'],
        properties: {
          name: { type: 'string' },
          specialty: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { name, specialty } = request.body;
    
    const doctor = await prisma.doctor.create({
      data: { name, specialty }
    });
    
    return reply.code(201).send(doctor);
  });
  

const start = async () => {
  try {
    await app.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server listening on http://localhost:3000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();