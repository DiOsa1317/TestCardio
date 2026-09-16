interface Doctor {
    id: string;
    name: string;
    specialty: string;
  }
  
  interface Appointment {
    id: string;
    patientName: string;
    date: string;
    doctor: Doctor | null;
  }
  
  interface AppointmentListProps {
    appointments: Appointment[];
  }
  
  export function AppointmentList({ appointments }: AppointmentListProps) {
    const isValidArray = Array.isArray(appointments) && appointments.length > 0;
  
    return (
      <div className="bg-white p-6 rounded-xl shadow-md h-fit border-t-4 border-red-600">
        <h2 className="text-2xl mb-5 font-bold text-gray-900">Текущие записи</h2>
        
        {!isValidArray ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <p className="italic text-base">Нет активных записей на сегодня</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {appointments.map((app) => (
              <li key={app.id} className="p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50/30 transition">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="font-bold text-lg text-gray-900">{app.patientName}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Врач: <span className="text-red-700 font-semibold">{app.doctor?.name || 'Не указан'}</span>
                    </p>
                  </div>
                  <span className="text-xs bg-red-100 text-red-800 px-3 py-1.5 rounded-full font-medium whitespace-nowrap">
                    {new Date(app.date).toLocaleString('ru-RU')}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }