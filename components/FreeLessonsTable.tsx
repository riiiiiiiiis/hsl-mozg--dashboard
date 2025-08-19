'use client';

import { useState } from 'react';
import { format } from 'date-fns';

interface FreeLessonRegistration {
  id: number;
  user_id: number;
  username: string;
  first_name: string;
  email: string;
  registered_at: string;
  notification_sent: boolean;
  lesson_type: string;
}

interface FreeLessonsTableProps {
  registrations: FreeLessonRegistration[];
}

export default function FreeLessonsTable({ registrations }: FreeLessonsTableProps) {
  const [filter, setFilter] = useState('');

  const filteredRegistrations = registrations.filter((registration) => {
    const searchTerm = filter.toLowerCase();
    return (
      registration.username?.toLowerCase().includes(searchTerm) ||
      registration.first_name?.toLowerCase().includes(searchTerm) ||
      registration.email?.toLowerCase().includes(searchTerm) ||
      registration.lesson_type?.toLowerCase().includes(searchTerm)
    );
  });

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
    } catch {
      return dateString;
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'User ID', 'Username', 'First Name', 'Email', 'Lesson Type', 'Registration Date', 'Notification Sent'];
    const csvContent = [
      headers.join(','),
      ...filteredRegistrations.map(reg => [
        reg.id,
        reg.user_id,
        `"${reg.username || ''}"`,
        `"${reg.first_name || ''}"`,
        `"${reg.email || ''}"`,
        `"${reg.lesson_type || ''}"`,
        formatDate(reg.registered_at),
        reg.notification_sent ? 'Yes' : 'No'
      ].join(','))
    ].join('\\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `free-lessons-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (registrations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <p className="text-lg">No free lesson registrations found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Free Lesson Registrations</h2>
            <p className="text-sm text-gray-600 mt-1">
              Total: {registrations.length} registrations
              {filter && ` • Filtered: ${filteredRegistrations.length}`}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search by name, email, or lesson type..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lesson Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registration Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notification
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User ID
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRegistrations.map((registration, index) => (
              <tr key={registration.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-900">
                      {registration.first_name || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      @{registration.username || 'N/A'}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {registration.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {registration.lesson_type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(registration.registered_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {registration.notification_sent ? (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Sent
                    </span>
                  ) : (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      Not sent
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {registration.user_id}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredRegistrations.length === 0 && filter && (
        <div className="p-8 text-center">
          <p className="text-gray-500">No registrations match your search criteria.</p>
          <button
            onClick={() => setFilter('')}
            className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
          >
            Clear filter
          </button>
        </div>
      )}
    </div>
  );
}