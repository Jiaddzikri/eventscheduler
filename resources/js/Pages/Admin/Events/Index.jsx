import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { debounce } from 'lodash';

export default function AdminEventIndex({ events, tenants, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [tenantId, setTenantId] = useState(filters.tenant_id || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleFilter = debounce((query) => {
        router.get(route('admin.events.index'), query, {
            preserveState: true,
            replace: true
        });
    }, 300);

    useEffect(() => {
        handleFilter({ search, tenant_id: tenantId, status });
    }, [search, tenantId, status]);

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Kelola Keseluruhan Event</h2>}>
            <Head title="Semua Event" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Cari judul event atau tenant..."
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="w-full md:w-48">
                                <select
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                    value={tenantId}
                                    onChange={(e) => setTenantId(e.target.value)}
                                >
                                    <option value="">Semua Tenant</option>
                                    {tenants.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-full md:w-40">
                                <select
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="">Semua Status</option>
                                    <option value="active">Aktif</option>
                                    <option value="cancelled">Dibatalkan</option>
                                </select>
                            </div>
                        </div>

                        <div className="overflow-x-auto border rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Event</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tenant</th>
                                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Peserta</th>
                                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Bayar</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {events.data.map(event => (
                                        <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-gray-900">{event.title}</div>
                                                <div className="text-[10px] text-gray-400 font-medium">{new Date(event.start_date).toLocaleDateString('id-ID')}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded uppercase">
                                                    {event.tenant.name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {event.status === 'cancelled' ? (
                                                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-black rounded uppercase">Dibatalkan</span>
                                                ) : (
                                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-black rounded uppercase">Aktif</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm font-medium text-gray-700">
                                                {event.participants_count}
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm font-medium text-gray-700">
                                                {event.verified_payments_count}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={route('admin.events.show', event.id)}
                                                    className="text-indigo-600 hover:text-indigo-900 text-xs font-bold transition-colors"
                                                >
                                                    Detail Admin
                                                </Link>
                                                <span className="mx-2 text-gray-300">|</span>
                                                <Link
                                                    href={route('events.show', event.id)}
                                                    className="text-gray-600 hover:text-gray-900 text-xs font-medium transition-colors"
                                                >
                                                    Publik
                                                </Link>
                                                <span className="mx-2 text-gray-300">|</span>
                                                <Link
                                                    href={route('tenant.dashboard', event.tenant_id)}
                                                    className="text-gray-600 hover:text-gray-900 text-xs font-medium transition-colors"
                                                >
                                                    Dasbor
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {events.data.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-sm text-gray-400 italic">
                                                Tidak ada event yang ditemukan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Simple Pagination Info */}
                        <div className="mt-6 flex items-center justify-between">
                            <div className="text-xs text-gray-500">
                                Menampilkan {events.from || 0} - {events.to || 0} dari {events.total} event
                            </div>
                            <div className="flex gap-2">
                                {events.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1 text-xs border rounded transition-colors ${link.active ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
