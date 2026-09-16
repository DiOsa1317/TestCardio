'use client';

import { useState } from 'react';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
}

interface BookingFormProps {
  doctors: Doctor[];
  onSuccess: () => void;
}

export function BookingForm({ doctors, onSuccess }: BookingFormProps) {
  const [patientName, setPatientName] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName,
          doctorId: selectedDoctorId,
          date: new Date(appointmentDate).toISOString(),
        }),
      });

      if (response.ok) {
        onSuccess(); // Обновляем список в родителе
        setPatientName('');
        setAppointmentDate('');
        setSelectedDoctorId('');
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Ошибка сервера' }));
        alert(`Не удалось записаться: ${errorData.error}`);
      }
    } catch (err) {
      alert('Ошибка соединения с сервером');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-red-600">
      <h2 className="text-2xl mb-5 font-bold text-gray-900">Запись на приём</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Яркий текст ввода и контрастный placeholder */}
        <input 
          type="text" 
          placeholder="Фамилия Имя Отчество" 
          required
          disabled={isSubmitting}
          className="w-full p-3 border border-gray-300 rounded-lg 
                     text-gray-900 font-medium placeholder:text-gray-500
                     focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
        />
        
        <select 
          required
          disabled={isSubmitting || doctors.length === 0}
          className="w-full p-3 border border-gray-300 rounded-lg 
                     text-gray-900 font-medium bg-white
                     focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
          value={selectedDoctorId}
          onChange={(e) => setSelectedDoctorId(e.target.value)}
        >
          <option value="" className="text-gray-500">Выберите специалиста</option>
          {doctors.map(doc => (
            <option key={doc.id} value={doc.id}>
              {doc.name} — {doc.specialty}
            </option>
          ))}
        </select>

        <input 
          type="datetime-local" 
          required
          disabled={isSubmitting}
          className="w-full p-3 border border-gray-300 rounded-lg 
                     text-gray-900 font-medium 
                     focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
        />

        <button 
          type="submit" 
          disabled={isSubmitting || !selectedDoctorId || !patientName || !appointmentDate}
          className="w-full bg-red-600 text-white py-3 rounded-lg 
                     hover:bg-red-700 active:bg-red-800 transition 
                     disabled:opacity-50 disabled:cursor-not-allowed 
                     font-bold text-base shadow-sm"
        >
          {isSubmitting ? 'Обработка...' : 'Подтвердить запись'}
        </button>
      </form>
    </div>
  );
}