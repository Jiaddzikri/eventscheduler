import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function UserCreate({ tenants }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'member', // Global role ('admin' or 'member')
        tenant_id: '',
        tenant_role: 'member', // Roles: 'manager', 'treasurer', 'member' 
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.users.store'));
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Buat Akun Pengguna</h2>}>
            <Head title="Buat Pengguna" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white p-8 shadow sm:rounded-lg">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Akun Dasar */}
                            <div>
                                <h4 className="font-semibold border-b pb-2 mb-4 text-gray-700">Data Login & Profil</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        />
                                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email Akun</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        />
                                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Password (Opsional)</label>
                                        <input
                                            type="password"
                                            value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                            placeholder="Kosongkan untuk menggunakan default: 'password'"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Global Role Utama</label>
                                        <select
                                            value={data.role}
                                            onChange={e => setData('role', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="member">Member Biasa</option>
                                            <option value="admin">Super Admin</option>
                                        </select>
                                        {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
                                        <p className="text-xs text-gray-500 mt-1">Super Admin memiliki akses tak terbatas ke portal Manajemen ini.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Opsi Atribusi Tenant */}
                            {data.role !== 'admin' && (
                                <div className="mt-8">
                                    <h4 className="font-semibold border-b pb-2 mb-4 text-gray-700">Atribusi/Penugasan Tenant (Pivot Opsional)</h4>
                                    <div className="bg-gray-50 p-4 rounded-md border border-gray-100 space-y-4">
                                        <p className="text-sm text-gray-500">Jika akun ini dibuat khusus untuk menjadi Manajer atau Bendahara suatu Vendor/Komunitas, Anda bisa mengaitkannya di sini secara langsung.</p>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Pilih Tenant (Opsional)</label>
                                            <select
                                                value={data.tenant_id}
                                                onChange={e => setData('tenant_id', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            >
                                                <option value="">-- Jangan hubungkan ke Tenant manapun --</option>
                                                {tenants.map(tenant => (
                                                    <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                                                ))}
                                            </select>
                                            {errors.tenant_id && <p className="mt-1 text-sm text-red-600">{errors.tenant_id}</p>}
                                        </div>

                                        {data.tenant_id && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Peran/Posisi di Tenant (Pivot Role)</label>
                                                <select
                                                    value={data.tenant_role}
                                                    onChange={e => setData('tenant_role', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                >
                                                    <option value="member">Member</option>
                                                    <option value="manager">Manager Event</option>
                                                    <option value="treasurer">Bendahara (Verifikator)</option>
                                                </select>
                                                {errors.tenant_role && <p className="mt-1 text-sm text-red-600">{errors.tenant_role}</p>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-end border-t pt-6 space-x-3">
                                <Link 
                                    href={route('admin.users.index')}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded shadow-sm hover:bg-gray-300"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded font-semibold shadow hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    Buat Akun
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
