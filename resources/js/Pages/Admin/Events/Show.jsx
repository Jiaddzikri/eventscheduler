import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function AdminEventShow({ event, participants, payments, funding }) {
    return (
        <AuthenticatedLayout header={
            <div className="flex items-center justify-between">
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">Detail Event Admin</h2>
                <Link 
                    href={route('admin.events.index')} 
                    className="text-sm text-indigo-600 hover:text-indigo-900 font-medium"
                >
                    &larr; Kembali ke Daftar
                </Link>
            </div>
        }>
            <Head title={`Detail: ${event.title}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Event Summary & Funding Progress */}
                    <div className="bg-white p-6 shadow sm:rounded-lg flex flex-col lg:flex-row gap-6">
                        {/* Event Details */}
                        <div className="flex-1 space-y-4">
                            <div>
                                <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold uppercase rounded mb-2">
                                    {event.tenant.name}
                                </span>
                                {event.status === 'cancelled' && (
                                    <span className="inline-block ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-bold uppercase rounded mb-2">
                                        Dibatalkan
                                    </span>
                                )}
                                <h3 className="text-2xl font-bold text-gray-900">{event.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="block text-gray-500 font-medium">Mulai:</span>
                                    <span className="text-gray-900">{new Date(event.start_date).toLocaleDateString('id-ID')}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500 font-medium">Selesai:</span>
                                    <span className="text-gray-900">{new Date(event.end_date).toLocaleDateString('id-ID')}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500 font-medium">Target per Peserta:</span>
                                    <span className="text-gray-900 font-bold">Rp {Number(event.budget_per_person).toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Funding Progress */}
                        <div className="lg:w-1/3 bg-gray-50 p-5 rounded-xl border border-gray-100">
                            <h4 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Progres Pendanaan</h4>
                            
                            <div className="mb-4">
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-xs text-gray-500 font-medium">Terkumpul</span>
                                    <span className="text-lg font-black text-indigo-600">
                                        Rp {Number(funding.total_collected).toLocaleString('id-ID')}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div 
                                        className="bg-indigo-600 h-2.5 rounded-full" 
                                        style={{ width: `${Math.min(funding.percentage, 100)}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-[10px] text-gray-400 font-medium">
                                        Target: Rp {Number(funding.total_target).toLocaleString('id-ID')}
                                    </span>
                                    <span className="text-xs font-bold text-indigo-600">
                                        {funding.percentage}%
                                    </span>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-gray-200 text-sm text-gray-600">
                                Berdasarkan <strong>{funding.participants_count}</strong> peserta aktif.
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Participants List */}
                        <div className="bg-white p-6 shadow sm:rounded-lg">
                            <h4 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Daftar Peserta</h4>
                            <div className="overflow-x-auto max-h-96">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama / Email</th>
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal Gabung</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {participants.map(p => (
                                            <tr key={p.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3">
                                                    <div className="text-sm font-medium text-gray-900">{p.user.name}</div>
                                                    <div className="text-xs text-gray-500">{p.user.email}</div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${
                                                        p.status === 'registered' ? 'bg-blue-100 text-blue-800' :
                                                        p.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {p.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-xs text-gray-500">
                                                    {new Date(p.created_at).toLocaleDateString('id-ID')}
                                                </td>
                                            </tr>
                                        ))}
                                        {participants.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="px-4 py-8 text-center text-sm text-gray-400 italic">
                                                    Belum ada peserta.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Payment History */}
                        <div className="bg-white p-6 shadow sm:rounded-lg">
                            <h4 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Riwayat Iuran</h4>
                            <div className="overflow-x-auto max-h-96">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Peserta</th>
                                            <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Nominal</th>
                                            <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {payments.map(payment => (
                                            <tr key={payment.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                                                    {new Date(payment.payment_date).toLocaleDateString('id-ID')}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="text-sm font-medium text-gray-900">{payment.user.name}</div>
                                                </td>
                                                <td className="px-4 py-3 text-right text-sm font-bold text-gray-700 whitespace-nowrap">
                                                    Rp {Number(payment.amount).toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                                                        payment.status === 'VERIFIED' ? 'bg-green-100 text-green-800' :
                                                        payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {payment.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {payments.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="px-4 py-8 text-center text-sm text-gray-400 italic">
                                                    Belum ada iuran.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
