import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { formatRupiah, parseRupiah } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from '@/Components/ui/dialog';

export default function EditEvent({ tenant, event, errors: pageErrors }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [cancelledReason, setCancelledReason] = useState('');

    // Helper to format date for datetime-local input safely
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const d = new Date(dateString);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().slice(0, 16);
    };

    const { data, setData, put, processing, errors } = useForm({
        title: event.title || '',
        description: event.description || '',
        budget_per_person: event.budget_per_person || '',
        start_date: formatDate(event.start_date),
        end_date: formatDate(event.end_date),
    });

    const [displayBudget, setDisplayBudget] = useState(formatRupiah(event.budget_per_person));

    const handleBudgetChange = (e) => {
        const rawValue = parseRupiah(e.target.value);
        if (/^[0-9]*$/.test(rawValue)) {
            setDisplayBudget(formatRupiah(rawValue));
            setData('budget_per_person', rawValue);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        put(route('tenant.events.update', { tenant: tenant.id, event: event.id }));
    };

    const confirmDelete = () => {
        router.delete(route('tenant.events.destroy', { tenant: tenant.id, event: event.id }), {
            data: { cancelled_reason: cancelledReason },
            onFinish: () => {
                // Modal will close automatically on success due to redirect, 
                // but we keep it open if there are errors
            },
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Event - {tenant.name}</h2>}>
            <Head title="Edit Event" />

            {/* Modal Konfirmasi Hapus */}
            <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-gray-900">Hapus Event?</DialogTitle>
                        <DialogDescription className="mt-2 text-gray-600">
                            Apakah Anda yakin ingin membatalkan event{' '}
                            <span className="font-semibold text-gray-900">&ldquo;{event.title}&rdquo;</span>?
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-2 space-y-4">
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-xs text-yellow-700">
                                        Pembayaran yang sudah <span className="font-bold">VERIFIED</span> akan otomatis dikembalikan ke saldo member. Event tidak akan dihapus dari sistem untuk keperluan riwayat.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Alasan Pembatalan <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={cancelledReason}
                                onChange={(e) => setCancelledReason(e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
                                rows="3"
                                placeholder="Contoh: Terjadi kendala teknis di lokasi atau kuota tidak terpenuhi..."
                                required
                            />
                            {pageErrors.cancelled_reason && (
                                <p className="text-red-500 text-xs mt-1 font-medium">{pageErrors.cancelled_reason}</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="mt-2 gap-2">
                        <button
                            type="button"
                            onClick={() => setShowDeleteModal(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={confirmDelete}
                            disabled={cancelledReason.length < 10}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Konfirmasi Pembatalan
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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
                                <label className="block text-sm font-medium text-gray-700">Estimasi Budget per Orang</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">Rp</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={displayBudget}
                                        onChange={handleBudgetChange}
                                        className="pl-12 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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

                            <div className="flex items-center justify-between pt-4 border-t">
                                {event.status !== 'cancelled' ? (
                                    <button
                                        type="button"
                                        onClick={() => setShowDeleteModal(true)}
                                        className="text-red-600 hover:text-red-800 text-sm font-medium transition"
                                    >
                                        Batalkan Event
                                    </button>
                                ) : (
                                    <div className="text-red-500 text-sm font-semibold flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                        Event ini sudah dibatalkan
                                    </div>
                                )}
                                <div className="space-x-3">
                                    <Link href={route('tenant.dashboard', tenant.id)} className="px-4 py-2 text-gray-700 hover:text-gray-900">
                                        Batal
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-indigo-600 text-white px-6 py-2 rounded-md shadow hover:bg-indigo-700 disabled:opacity-50 transition"
                                    >
                                        {processing ? 'Menyimpan...' : 'Perbarui Event'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
