import PublicLayout from '@/Layouts/PublicLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useRef, useState, useEffect } from 'react';
import { formatRupiah, parseRupiah } from '@/lib/utils';

export default function EventShow({ auth, event, isParticipant, participationStatus, payments, totalPaid, errors: pageErrors }) {
    const fileInput = useRef(null);
    const [filePreview, setFilePreview] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        amount: '',
        proof: null
    });

    const [displayAmount, setDisplayAmount] = useState('');

    const handleAmountChange = (e) => {
        const rawValue = parseRupiah(e.target.value);
        if (/^[0-9]*$/.test(rawValue)) {
            setDisplayAmount(formatRupiah(rawValue));
            setData('amount', rawValue);
        }
    };

    const handleJoin = (e) => {
        e.preventDefault();
        post(route('events.join', event.id));
    };

    const handlePay = (e) => {
        e.preventDefault();
        post(route('payments.store', event.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setDisplayAmount('');
                setFilePreview(null);
                if (fileInput.current) fileInput.current.value = '';
            }
        });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setData('proof', file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setFilePreview(e.target.result);
            reader.readAsDataURL(file);
        } else {
            setFilePreview(null);
        }
    };

    const remainingBudget = Math.max(0, event.budget_per_person - totalPaid);
    const percentagePaid = Math.min(100, (totalPaid / event.budget_per_person) * 100);

    return (
        <PublicLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Detail Event</h2>}>
            <Head title={event.title} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Cancellation Alert */}
                    {event.status === 'cancelled' && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-sm">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-bold text-red-800">Event Ini Telah Dibatalkan</h3>
                                    <div className="mt-2 text-red-700">
                                        <p className="font-semibold mb-1">Alasan Pembatalan:</p>
                                        <p className="bg-white/50 p-3 rounded italic border border-red-100 text-sm">
                                            &ldquo;{event.cancelled_reason}&rdquo;
                                        </p>
                                        <p className="mt-3 text-xs flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                                            Dibatalkan pada: {new Date(event.cancelled_at).toLocaleString('id-ID')}
                                        </p>
                                        <p className="mt-1 text-xs font-bold font-italic">
                                            * Semua pembayaran yang sudah terverifikasi telah dikembalikan otomatis ke saldo akun masing-masing member.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Balance Info for Members */}
                    {auth.user && auth.user.balance > 0 && (
                        <div className="bg-indigo-600 rounded-lg shadow-md p-4 flex items-center justify-between text-white">
                            <div className="flex items-center">
                                <div className="bg-indigo-500 p-2 rounded-full mr-3">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <span className="font-medium text-indigo-100">Saldo Anda saat ini:</span>
                            </div>
                            <span className="text-xl font-bold">Rp {Number(auth.user.balance).toLocaleString('id-ID')}</span>
                        </div>
                    )}

                    {pageErrors.error && (
                        <div className="bg-red-50 border-red-200 border text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{pageErrors.error}</span>
                        </div>
                    )}

                    {/* Event Detail Card */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-8">
                        <div className="mb-2 text-indigo-600 font-bold uppercase tracking-wider">{event.tenant.name}</div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h3>
                        
                        <div className="bg-gray-50 border border-gray-100 rounded-lg p-6 mb-6">
                            <h4 className="font-semibold border-b pb-2 mb-3">Informasi Acara</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><span className="text-gray-500">Tanggal Mulai:</span> <span className="font-medium">{new Date(event.start_date).toLocaleString('id-ID')}</span></div>
                                <div><span className="text-gray-500">Tanggal Selesai:</span> <span className="font-medium">{new Date(event.end_date).toLocaleString('id-ID')}</span></div>
                                <div>
                                    <span className="text-gray-500">Target Budget (Per Orang):</span> 
                                    <span className="font-bold text-lg text-green-600 ml-2">Rp {Number(event.budget_per_person).toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="prose max-w-none text-gray-700 mb-8">
                            <p className="whitespace-pre-wrap">{event.description}</p>
                        </div>

                        {!auth.user ? (
                            <div className="mt-6 border-t pt-6">
                                <Link
                                    href={route('login')}
                                    className="inline-block w-full sm:w-auto text-center bg-gray-800 text-white px-8 py-3 rounded-lg shadow-md hover:bg-gray-700 font-semibold transition"
                                >
                                    Login untuk Ikut Serta
                                </Link>
                            </div>
                        ) : !isParticipant ? (
                            <form onSubmit={handleJoin} className="mt-6 border-t pt-6">
                                <button
                                    type="submit"
                                    disabled={processing || event.status === 'cancelled'}
                                    className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-3 rounded-lg shadow-md hover:bg-indigo-700 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {event.status === 'cancelled' ? 'Event Dibatalkan' : 'Ikuti Event Ini'}
                                </button>
                            </form>
                        ) : (
                            <div className="mt-6 border-t pt-6">
                                <div className="inline-flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-md border border-green-200 mb-6 font-medium">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                    Anda sudah terdaftar dalam event ini
                                </div>

                                {/* Payment Module */}
                                <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                                    <div className="bg-gray-50 px-6 py-4 border-b">
                                        <h4 className="font-bold text-gray-800 text-lg">Modul Pembayaran & Cicilan</h4>
                                        <p className="text-sm text-gray-500">Transfer ke: <span className="font-semibold text-gray-700">{event.tenant.bank_account_info}</span></p>
                                    </div>
                                    <div className="p-6">
                                        {/* Progress Bar */}
                                        <div className="mb-8">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="font-medium text-gray-700">Progress Pembayaran (Terkonfirmasi)</span>
                                                <span className="font-bold text-indigo-600">{percentagePaid.toFixed(0)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${percentagePaid}%` }}></div>
                                            </div>
                                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                                <span>Terkonfirmasi: Rp {totalPaid.toLocaleString('id-ID')}</span>
                                                <span>Sisa: Rp {remainingBudget.toLocaleString('id-ID')}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Upload Form */}
                                            {remainingBudget > 0 && (
                                                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                                                    <h5 className="font-semibold text-gray-800 mb-4">Upload Bukti Transfer</h5>
                                                    
                                                    {event.status === 'cancelled' ? (
                                                        <div className="text-center py-6">
                                                            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                                            <p className="text-gray-500 text-sm italic font-medium">Pembayaran ditutup karena event telah dibatalkan.</p>
                                                        </div>
                                                    ) : (
                                                        <form onSubmit={handlePay} className="space-y-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700">Nominal Transfer (Rp)</label>
                                                                <input
                                                                    type="text"
                                                                    value={displayAmount}
                                                                    onChange={handleAmountChange}
                                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                    placeholder="50.000"
                                                                    required
                                                                />
                                                                {errors.amount && <div className="text-red-500 text-sm mt-1">{errors.amount}</div>}
                                                                {pageErrors.amount && <div className="text-red-500 text-sm mt-1">{pageErrors.amount}</div>}
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700">Foto Resi / Bukti Transfer</label>
                                                                <input
                                                                    type="file"
                                                                    ref={fileInput}
                                                                    onChange={handlePhotoChange}
                                                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                                                    accept="image/*"
                                                                    required
                                                                />
                                                                {errors.proof && <div className="text-red-500 text-sm mt-1">{errors.proof}</div>}
                                                            </div>
                                                            {filePreview && (
                                                                <div className="mt-2">
                                                                    <img src={filePreview} alt="Preview" className="h-32 object-cover rounded-md border" />
                                                                </div>
                                                            )}
                                                            <button
                                                                type="submit"
                                                                disabled={processing}
                                                                className="w-full bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 disabled:opacity-50 transition"
                                                            >
                                                                {processing ? 'Mengunggah...' : 'Kirim Bukti Pembayaran'}
                                                            </button>
                                                        </form>
                                                    )}
                                                </div>
                                            )}

                                            {/* History */}
                                            <div>
                                                <h5 className="font-semibold text-gray-800 mb-4">Riwayat Pembayaran Anda</h5>
                                                <div className="space-y-3">
                                                    {payments.map(payment => (
                                                        <div key={payment.id} className="border border-gray-100 p-3 rounded bg-white shadow-sm flex justify-between items-center">
                                                            <div>
                                                                <div className="font-medium">Rp {Number(payment.amount).toLocaleString('id-ID')}</div>
                                                                <div className="text-xs text-gray-500">{new Date(payment.payment_date).toLocaleDateString()}</div>
                                                            </div>
                                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${payment.status === 'VERIFIED' ? 'bg-green-100 text-green-800' : payment.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                                {payment.status}
                                                            </span>
                                                        </div>
                                                    ))}
                                                    {payments.length === 0 && <p className="text-sm text-gray-500 italic">Belum ada riwayat transaksi.</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
