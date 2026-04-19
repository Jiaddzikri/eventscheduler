import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import { useState, useEffect } from 'react';
import { formatRupiah } from '@/lib/utils';
import debounce from 'lodash/debounce';

export default function MyEvents({ myEvents, tenants, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [tenantId, setTenantId] = useState(filters.tenant_id || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    // Debounce search to avoid too many requests
    const handleSearch = debounce((value) => {
        applyFilters({ search: value });
    }, 500);

    const applyFilters = (newFilters = {}) => {
        router.get(route('dashboard.my-events'), {
            search: newFilters.search !== undefined ? newFilters.search : search,
            tenant_id: newFilters.tenant_id !== undefined ? newFilters.tenant_id : tenantId,
            date_from: newFilters.date_from !== undefined ? newFilters.date_from : dateFrom,
            date_to: newFilters.date_to !== undefined ? newFilters.date_to : dateTo,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const resetFilters = () => {
        setSearch('');
        setTenantId('');
        setDateFrom('');
        setDateTo('');
        router.get(route('dashboard.my-events'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Event Saya
                </h2>
            }
        >
            <Head title="Event Saya" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Filter Bar */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div className="md:col-span-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cari Event</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Judul atau deskripsi..."
                                        className="w-full border-gray-200 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        value={search}
                                        onChange={(e) => {
                                            setSearch(e.target.value);
                                            handleSearch(e.target.value);
                                        }}
                                    />
                                    {search && (
                                        <button 
                                            onClick={() => { setSearch(''); applyFilters({ search: '' }); }}
                                            className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                        </button>
                                    )}
                                </div>
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

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Dari Tanggal</label>
                                <input
                                    type="date"
                                    className="w-full border-gray-200 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={dateFrom}
                                    onChange={(e) => {
                                        setDateFrom(e.target.value);
                                        applyFilters({ date_from: e.target.value });
                                    }}
                                />
                            </div>

                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sampai Tanggal</label>
                                    <input
                                        type="date"
                                        className="w-full border-gray-200 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        value={dateTo}
                                        onChange={(e) => {
                                            setDateTo(e.target.value);
                                            applyFilters({ date_to: e.target.value });
                                        }}
                                    />
                                </div>
                                <button 
                                    onClick={resetFilters}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-lg transition"
                                    title="Reset Filter"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Events Table/List */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl border border-gray-100">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 uppercase text-[10px] font-bold text-gray-500 tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Event & Komunitas</th>
                                        <th className="px-6 py-4 text-left">Tanggal</th>
                                        <th className="px-6 py-4 text-left">Budget / Orang</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {myEvents.data.map(participation => (
                                        <tr key={participation.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div>
                                                        <div className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition truncate max-w-xs">
                                                            {participation.event.title}
                                                        </div>
                                                        <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                                                            {participation.event.tenant.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-xs text-gray-600 font-medium">
                                                    {new Date(participation.event.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-700">
                                                    Rp {Number(participation.event.budget_per_person).toLocaleString('id-ID')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${participation.event.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                    {participation.event.status === 'cancelled' ? 'Dibatalkan' : 'Aktif'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <Link 
                                                    href={route('events.show', participation.event.id)}
                                                    className="inline-flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
                                                >
                                                    Detail ➜
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {myEvents.data.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center">
                                                    <svg className="w-12 h-12 text-gray-200 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                                    <p className="text-sm text-gray-400 italic font-medium">Tidak ada event yang ditemukan.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {myEvents.links && <Pagination links={myEvents.links} />}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
