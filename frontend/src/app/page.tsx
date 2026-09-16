'use client';

import { useEffect, useState } from 'react';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
}

export default function Home() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/doctors')
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">CardioLite Clinic</h1>
      
      <div className="w-full max-w-md">
        <h2 className="text-2xl mb-4">Наши кардиологи</h2>
        
        {loading ? (
          <p>Загрузка данных...</p>
        ) : doctors.length === 0 ? (
          <p className="text-gray-500">В базе пока нет врачей.</p>
        ) : (
          <ul className="space-y-4">
            {doctors.map((doc) => (
              <li key={doc.id} className="p-4 border rounded-lg shadow-sm bg-white">
                <h3 className="font-semibold text-lg">{doc.name}</h3>
                <p className="text-blue-600">{doc.specialty}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}