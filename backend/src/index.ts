import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import { notificationQueue } from './queue';

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

// Получение списка всех записей
app.get('/appointments', async () => {
  const appointments = await prisma.appointment.findMany({
    include: { doctor: true }, // Подтягиваем имя врача к каждой записи
    orderBy: { date: 'asc' },   // Сортируем по дате
  });
  return appointments;
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
  
  app.post<{ 
    Body: { patientName: string; date: string; doctorId: string } 
  }>('/appointments', {
    schema: {
      body: {
        type: 'object',
        required: ['patientName', 'date', 'doctorId'],
        properties: {
          patientName: { type: 'string', minLength: 2 },
          date: { type: 'string', format: 'date-time' },
          doctorId: { type: 'string', format: 'uuid' }
        }
      }
    }
  }, async (request, reply) => {
    const { patientName, date, doctorId } = request.body;
  
    try {
      // 1. Проверяем врача
      const doctorExists = await prisma.doctor.findUnique({
        where: { id: doctorId }
      });
  
      if (!doctorExists) {
        return reply.code(404).send({ error: 'Врач не найден' });
      }
  
      // 2. Создаем запись в БД
      const appointment = await prisma.appointment.create({
        data: {
          patientName,
          date: new Date(date),
          doctorId,
        },
      });
  
      // 3. Добавляем задачу в очередь (НЕ ждем выполнения!)
      await notificationQueue.add('send-sms', {
        patientName,
        date,
        appointmentId: appointment.id,
      });
  
      // 4. Мгновенно отвечаем клиенту
      return reply.code(201).send({
        message: 'Запись создана. Уведомление отправлено.',
        appointment,
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Ошибка при создании записи' });
    }
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