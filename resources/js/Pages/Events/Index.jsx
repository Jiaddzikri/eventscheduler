import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';

export default function EventIndex({ events }) {
    return (
        <PublicLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Eksplorasi Event</h2>}>
            <Head title="Semua Event" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map(event => (
                            <div key={event.id} className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-100 hover:shadow-md transition">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">{event.tenant.name}</div>
                                        {event.status === 'cancelled' && (
                                            <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Dibatalkan</span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{event.title}</h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{event.description}</p>
                                    
                                    <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                            {new Date(event.start_date).toLocaleDateString()}
                                        </div>
                                        <div className="font-medium text-gray-800">
                                            Rp {Number(event.budget_per_person).toLocaleString('id-ID')}
                                        </div>
                                    </div>
                                    
                                    <Link 
                                        href={route('events.show', event.id)}
                                        className="w-full block text-center bg-gray-50 border border-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-100 transition"
                                    >
                                        Lihat Detail
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    {events.length === 0 && (
                        <div className="text-center bg-white p-12 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-lg font-medium text-gray-500">Belum ada event yang dipublikasikan saat ini.</h3>
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
