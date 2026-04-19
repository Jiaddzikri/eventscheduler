import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function TenantCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        bank_account_info: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.tenants.store'));
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Buat Tenant Baru</h2>}>
            <Head title="Buat Tenant" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white p-8 shadow sm:rounded-lg">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nama Tenant / Organisasi</label>
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
                                <label className="block text-sm font-medium text-gray-700">Informasi Rekening Bank Pembayaran</label>
                                <input
                                    type="text"
                                    value={data.bank_account_info}
                                    onChange={e => setData('bank_account_info', e.target.value)}
                                    placeholder="Cth: BCA 12345 a.n. John"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                {errors.bank_account_info && <p className="mt-1 text-sm text-red-600">{errors.bank_account_info}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Deskripsi Singkat</label>
                                <textarea
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    rows="4"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                            </div>

                            <div className="flex items-center justify-end border-t pt-6 space-x-3">
                                <Link 
                                    href={route('admin.tenants.index')}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded shadow-sm hover:bg-gray-300"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded font-semibold shadow hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    Simpan Tenant
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
