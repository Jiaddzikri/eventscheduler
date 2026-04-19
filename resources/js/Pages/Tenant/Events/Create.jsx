import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

import { useState, useEffect } from 'react';
import { formatRupiah, parseRupiah } from '@/lib/utils';

export default function CreateEvent({ tenant }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        budget_per_person: '',
        start_date: '',
        end_date: '',
    });

    const [displayBudget, setDisplayBudget] = useState('');

    const handleBudgetChange = (e) => {
        const rawValue = parseRupiah(e.target.value);
        if (/^[0-9]*$/.test(rawValue)) {
            setDisplayBudget(formatRupiah(rawValue));
            setData('budget_per_person', rawValue);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('tenant.events.store', tenant.id));
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Buat Event Baru - {tenant.name}</h2>}>
            <Head title="Buat Event" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-8">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nama Event</label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                                {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Deskripsi Event</label>
                                <textarea
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    rows="4"
                                    required
                                />
                                {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Estimasi Budget per Orang (Target Cicilan)</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">Rp</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={displayBudget}
                                        onChange={handleBudgetChange}
                                        className="pl-12 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="1.500.000"
                                        required
                                    />
                                </div>
                                {errors.budget_per_person && <div className="text-red-500 text-sm mt-1">{errors.budget_per_person}</div>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tanggal Mulai</label>
                                    <input
                                        type="datetime-local"
                                        value={data.start_date}
                                        onChange={e => setData('start_date', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                    {errors.start_date && <div className="text-red-500 text-sm mt-1">{errors.start_date}</div>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tanggal Selesai</label>
                                    <input
                                        type="datetime-local"
                                        value={data.end_date}
                                        onChange={e => setData('end_date', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                    {errors.end_date && <div className="text-red-500 text-sm mt-1">{errors.end_date}</div>}
                                </div>
                            </div>

                            <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                                <Link href={route('tenant.dashboard', tenant.id)} className="px-4 py-2 text-gray-700 hover:text-gray-900">
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-indigo-600 text-white px-6 py-2 rounded-md shadow hover:bg-indigo-700 disabled:opacity-50 transition"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Event'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
