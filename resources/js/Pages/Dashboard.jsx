import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth, balance, transactions }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1 space-y-4">
                                    <p className="font-medium text-lg text-indigo-700">Selamat datang, {auth.user.name}!</p>
                                    <p className="text-gray-600">Mulai eksplorasi event dari berbagai komunitas, dan lakukan pendaftaran secara langsung.</p>
                                    <div className="mt-4">
                                        <a href={route('events.index')} className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-md shadow hover:bg-indigo-700 transition">
                                            Eksplorasi Event ➜
                                        </a>
                                    </div>
                                </div>
                                
                                <div className="md:w-72 bg-indigo-50 border border-indigo-100 p-6 rounded-xl flex flex-col justify-center items-center">
                                    <div className="text-indigo-600 text-sm font-bold uppercase tracking-widest mb-1">Saldo Anda</div>
                                    <div className="text-3xl font-black text-gray-900 mt-1">
                                        Rp {Number(balance).toLocaleString('id-ID')}
                                    </div>
                                    <div className="mt-3 text-xs text-indigo-400 font-medium">Otomatis bertambah saat refund</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="font-bold text-gray-800 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Riwayat Transaksi Saldo
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 uppercase text-[10px] font-bold text-gray-500 tracking-widest">
                                    <tr>
                                        <th className="px-6 py-3 text-left">Tanggal</th>
                                        <th className="px-6 py-3 text-left">Tipe</th>
                                        <th className="px-6 py-3 text-left">Keterangan</th>
                                        <th className="px-6 py-3 text-right">Nominal</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {transactions.map(tx => (
                                        <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                                {new Date(tx.created_at).toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${tx.type === 'refund' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {tx.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-gray-600 max-w-xs truncate">
                                                {tx.description}
                                                {tx.event && (
                                                    <div className="text-[10px] text-indigo-400 mt-0.5 font-medium">{tx.event.title}</div>
                                                )}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-bold ${tx.type === 'refund' || tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                                                {tx.type === 'refund' || tx.type === 'deposit' ? '+' : '-'} Rp {Number(tx.amount).toLocaleString('id-ID')}
                                            </td>
                                        </tr>
                                    ))}
                                    {transactions.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center text-sm text-gray-400 italic">
                                                Belum ada riwayat transaksi saldo.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
