import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useCallback, useRef } from 'react';
import Pagination from '@/Components/Pagination';
import { Search, Filter, Users, Building2, ShieldCheck } from 'lucide-react';

const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
};

export default function UserIndex({ users, tenants, filters }) {
    const isFirstRender = useRef(true);

    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole] = useState(filters.role || 'all');
    const [tenantId, setTenantId] = useState(filters.tenant_id || 'all');

    const handleFilter = useCallback(
        debounce((query) => {
            router.get(route('admin.users.index'), query, {
                preserveState: true,
                replace: true,
            });
        }, 300),
        []
    );

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        handleFilter({ search, role, tenant_id: tenantId });
    }, [search, role, tenantId]);

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Kelola Akun Pengguna</h2>}>
            <Head title="Manajemen Pengguna" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Filter Section */}
                    <div className="bg-white p-6 shadow-sm sm:rounded-2xl border border-gray-100">
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1 space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Cari Pengguna</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-2.5 border-none bg-gray-50 focus:ring-2 focus:ring-indigo-500 rounded-xl text-sm transition-all"
                                        placeholder="Ketik nama atau email..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="w-full md:w-48 space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3" /> Peran
                                </label>
                                <select
                                    className="block w-full py-2.5 border-none bg-gray-50 focus:ring-2 focus:ring-indigo-500 rounded-xl text-sm transition-all"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="all">Semua Peran</option>
                                    <option value="admin">Admin</option>
                                    <option value="member">Member</option>
                                </select>
                            </div>

                            <div className="w-full md:w-64 space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 flex items-center gap-1">
                                    <Building2 className="w-3 h-3" /> Tenant
                                </label>
                                <select
                                    className="block w-full py-2.5 border-none bg-gray-50 focus:ring-2 focus:ring-indigo-500 rounded-xl text-sm transition-all"
                                    value={tenantId}
                                    onChange={(e) => setTenantId(e.target.value)}
                                >
                                    <option value="all">Semua Tenant</option>
                                    {tenants.map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {t.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <Link 
                                href={route('admin.users.create')}
                                className="w-full md:w-auto px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Users className="w-4 h-4" />
                                + Akun Baru
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white shadow-sm sm:rounded-2xl border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                            <h3 className="text-lg font-bold text-gray-800">Daftar Pengguna</h3>
                            <span className="bg-indigo-50 text-indigo-700 text-xs font-black px-2.5 py-1 rounded-full uppercase">
                                Total: {users.total}
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Identitas</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Global Role</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Akses Komunitas</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-50">
                                    {users.data.length > 0 ? (
                                        users.data.map((u) => (
                                            <tr key={u.id} className="hover:bg-indigo-50/30 transition-colors group">
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-11 w-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center font-black text-white shadow-sm group-hover:scale-110 transition-transform">
                                                            {u.name.charAt(0)}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-bold text-gray-900 leading-tight">{u.name}</div>
                                                            <div className="text-xs text-gray-400 font-medium">{u.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap text-center">
                                                    <span className={`px-4 py-1 inline-flex text-[10px] leading-5 font-black rounded-full uppercase tracking-tighter shadow-sm border ${
                                                        u.role === 'admin' 
                                                            ? 'bg-rose-50 text-rose-600 border-rose-100' 
                                                            : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                    }`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    {u.tenants && u.tenants.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {u.tenants.map((t) => (
                                                                <span key={t.id} className="inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 group-hover:bg-white transition-colors">
                                                                    {t.name} <span className="ml-1 text-gray-400 font-normal">({t.pivot.role})</span>
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-[10px] text-gray-300 italic font-medium">Belum ada akses komunitas</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-5 text-right whitespace-nowrap">
                                                    <Link 
                                                        href={route('admin.users.edit', u.id)}
                                                        className="text-indigo-600 hover:text-indigo-900 text-xs font-bold transition-colors"
                                                    >
                                                        Edit
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Filter className="w-12 h-12 text-gray-100" />
                                                    <p className="text-gray-400 font-bold">Tidak ada data yang cocok dengan kriteria Anda</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Always show pagination area */}
                        <div className="px-6 py-6 bg-gray-50/50 border-t border-gray-100">
                            <Pagination links={users.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
