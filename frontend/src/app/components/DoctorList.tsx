interface Doctor {
    id: string;
    name: string;
    specialty: string;
  }
  
  interface DoctorListProps {
    doctors: Doctor[];
  }
  
  export function DoctorList({ doctors }: DoctorListProps) {
    if (doctors.length === 0) {
      return (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Наши кардиологи</h3>
          <p className="text-gray-500 italic">Список специалистов пока пуст.</p>
        </div>
      );
    }
  
    return (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Наши кардиологи</h3>
        <ul className="space-y-2">
          {doctors.map((doc) => (
            <li key={doc.id} className="p-3 border-l-4 border-red-600 bg-red-50 rounded-r-lg">
              <span className="font-bold text-gray-900">{doc.name}</span>
              <span className="text-gray-600 ml-2">— {doc.specialty}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }