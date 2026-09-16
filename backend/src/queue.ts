import { Queue, Worker } from 'bullmq';

// Настройка подключения к Redis (порт 6380!)
const connection = {
  host: 'localhost',
  port: 6380,
};

// Создаем очередь "appointment-notifications"
export const notificationQueue = new Queue('appointment-notifications', {
  connection,
});

// Создаем воркер, который обрабатывает задачи из этой очереди
export const notificationWorker = new Worker(
  'appointment-notifications',
  async (job) => {
    console.log(`[JOB STARTED] ID: ${job.id}, Data:`, job.data);
    
    // Имитация отправки SMS (задержка 2 секунды)
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    console.log(`[JOB DONE] SMS sent to ${job.data.patientName} for appointment at ${job.data.date}`);
    return { success: true };
  },
  { connection }
);

// Обработка ошибок воркера
notificationWorker.on('failed', (job, err) => {
  console.error(`[JOB FAILED] ID: ${job?.id}, Error:`, err.message);
});