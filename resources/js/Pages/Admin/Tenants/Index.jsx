import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function TenantIndex({ tenants }) {
    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Kelola Tenant</h2>}>
            <Head title="Manajemen Tenant" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <h3 className="text-lg font-medium text-gray-900">Daftar Vendor / Komunitas (Tenant)</h3>
                            <Link 
                                href={route('admin.tenants.create')}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 font-semibold transition"
                            >
                                + Tambah Tenant Baru
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 border-y border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nama Tenant</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rekening Bank</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tgl Dibuat</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {tenants.map(tenant => (
                                        <tr key={tenant.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tenant.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{tenant.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{tenant.bank_account_info || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(tenant.created_at).toLocaleDateString('id-ID')}</td>
                                        </tr>
                                    ))}
                                    {tenants.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="text-center py-8 text-gray-400 italic">Belum ada tenant terdaftar.</td>
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
