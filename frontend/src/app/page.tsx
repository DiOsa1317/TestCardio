'use client';

import { useEffect, useState } from 'react';
import { BookingForm } from './components/BookingForm';
import { DoctorList } from './components/DoctorList';
import { AppointmentList } from './components/AppointmentList';

interface Doctor { id: string; name: string; specialty: string; }
interface Appointment { id: string; patientName: string; date: string; doctor: Doctor | null; }

export default function Home() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/doctors').then(r => r.ok ? r.json() : []),
      fetch('/api/appointments').then(r => r.ok ? r.json() : [])
    ]).then(([docs, apps]) => {
      setDoctors(Array.isArray(docs) ? docs : []);
      setAppointments(Array.isArray(apps) ? apps : []);
      setLoading(false);
    }).catch(() => {
      setDoctors([]);
      setAppointments([]);
      setLoading(false);
    });
  }, []);

  const refreshAppointments = async () => {
    const res = await fetch('/api/appointments');
    const data = res.ok ? await res.json() : [];
    setAppointments(Array.isArray(data) ? data : []);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg text-red-600 font-medium animate-pulse">Загрузка CardioLite...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8 md:p-12">
      <h1 className="text-4xl font-extrabold mb-10 text-red-700 tracking-tight">
        CardioLite Clinic
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <div className="space-y-6">
          <BookingForm doctors={doctors} onSuccess={refreshAppointments} />
          <DoctorList doctors={doctors} />
        </div>
        
        <AppointmentList appointments={appointments} />
      </div>
    </main>
  );
}