import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import { useState } from 'react';
import debounce from 'lodash/debounce';

export default function Payments({ payments, tenants, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [tenantId, setTenantId] = useState(filters.tenant_id || '');

    const handleSearch = debounce((value) => {
        applyFilters({ search: value });
    }, 500);

    const applyFilters = (newFilters = {}) => {
        router.get(route('dashboard.payments'), {
            search: newFilters.search !== undefined ? newFilters.search : search,
            status: newFilters.status !== undefined ? newFilters.status : status,
            tenant_id: newFilters.tenant_id !== undefined ? newFilters.tenant_id : tenantId,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const resetFilters = () => {
        setSearch('');
        setStatus('');
        setTenantId('');
        router.get(route('dashboard.payments'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Riwayat Pembayaran
                </h2>
            }
        >
            <Head title="Riwayat Pembayaran" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Filter Bar */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cari Event</label>
                                <input
                                    type="text"
                                    placeholder="Judul event..."
                                    className="w-full border-gray-200 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        handleSearch(e.target.value);
                                    }}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                                <select
                                    className="w-full border-gray-200 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={status}
                                    onChange={(e) => {
                                        setStatus(e.target.value);
                                        applyFilters({ status: e.target.value });
                                    }}
                                >
                                    <option value="">Semua Status</option>
                                    <option value="PENDING">Pending (Menunggu)</option>
                                    <option value="VERIFIED">Terverifikasi (Lunas)</option>
                                    <option value="REJECTED">Ditolak</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Komunitas</label>
                                <select
                                    className="w-full border-gray-200 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={tenantId}
                                    onChange={(e) => {
                                        setTenantId(e.target.value);
                                        applyFilters({ tenant_id: e.target.value });
                                    }}
                                >
                                    <option value="">Semua Komunitas</option>
                                    {tenants.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>

                            <button 
                                onClick={resetFilters}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg transition text-sm font-bold uppercase tracking-wider h-[38px]"
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    {/* Payments Table */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl border border-gray-100">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 uppercase text-[10px] font-bold text-gray-500 tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Event & Komunitas</th>
                                        <th className="px-6 py-4 text-left">Tanggal Bayar</th>
                                        <th className="px-6 py-4 text-left">Nominal</th>
                                        <th className="px-6 py-4 text-center">Bukti</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {payments.data.map(payment => (
                                        <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-gray-900 truncate max-w-xs">
                                                    {payment.event.title}
                                                </div>
                                                <div className="text-[10px] text-gray-400 font-semibold uppercase">
                                                    {payment.event.tenant.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600 font-medium">
                                                {new Date(payment.payment_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-700">
                                                    Rp {Number(payment.amount).toLocaleString('id-ID')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {payment.proof_of_transfer_url && (
                                                    <a 
                                                        href={`/storage/${payment.proof_of_transfer_url}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition"
                                                        title="Lihat Bukti Transfer"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                    </a>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                        payment.status === 'VERIFIED' ? 'bg-green-100 text-green-700' : 
                                                        payment.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                        {payment.status === 'VERIFIED' ? 'Terverifikasi' : 
                                                         payment.status === 'REJECTED' ? 'Ditolak' : 
                                                         'Menunggu'}
                                                    </span>
                                                    {payment.status === 'REJECTED' && payment.rejection_reason && (
                                                        <div className="mt-1 text-[10px] text-red-500 italic max-w-[150px] truncate" title={payment.rejection_reason}>
                                                            {payment.rejection_reason}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {payments.data.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center">
                                                    <svg className="w-12 h-12 text-gray-200 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                                                    <p className="text-sm text-gray-400 italic font-medium">Belum ada riwayat pembayaran.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {payments.links && <Pagination links={payments.links} />}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
