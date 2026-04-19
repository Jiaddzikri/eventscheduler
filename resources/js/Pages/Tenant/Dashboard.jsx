import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState, useEffect, useCallback, useRef } from 'react';
import Pagination from '@/Components/Pagination';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/Components/ui/dialog"
import { Search, Calendar, FileText, CheckCircle, XCircle, Clock, Plus, Filter as FilterIcon } from "lucide-react";
import { debounce } from "lodash";

export default function TenantDashboard({ tenant, role, events, payments, filters }) {
    const isFirstRender = useRef(true);
    const { post, processing } = useForm();
    
    // Joint logic for both roles
    const [search, setSearch] = useState(filters.search || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    
    // Modal & Action State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [confirmActionData, setConfirmActionData] = useState({ paymentId: null, status: null });
    const [rejectionReason, setRejectionReason] = useState('');

    const performSearch = useCallback(
        debounce((query) => {
            router.get(route('tenant.dashboard', tenant.id), query, {
                preserveState: true,
                replace: true,
                preserveScroll: true
            });
        }, 300),
        [tenant.id]
    );

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        performSearch({ search, date_from: dateFrom, date_to: dateTo });
    }, [search, dateFrom, dateTo]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        performSearch({ search, date_from: dateFrom, date_to: dateTo });
    };

    const initiateVerify = (paymentId, newStatus) => {
        setConfirmActionData({ paymentId, status: newStatus });
        setRejectionReason('');
        setIsConfirmModalOpen(true);
    };

    const executeVerification = () => {
        post(route('tenant.payments.verify', { 
            tenant: tenant.id, 
            payment: confirmActionData.paymentId, 
            status: confirmActionData.status,
            rejection_reason: confirmActionData.status === 'REJECTED' ? rejectionReason : null
        }), {
            preserveScroll: true,
            onSuccess: () => {
                setIsConfirmModalOpen(false);
                setIsModalOpen(false);
                setRejectionReason('');
            }
        });
    };

    const openProofModal = (payment) => {
        setSelectedPayment(payment);
        setIsModalOpen(true);
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight tracking-tight">Dashboard {role === 'manager' ? 'Manajer' : 'Bendahara'}: {tenant.name}</h2>}
        >
            <Head title={`Dashboard ${tenant.name}`} />

            <div className="py-12 bg-gray-50/50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    {role === 'manager' && (
                        <div className="space-y-6">
                            {/* Manager Stats & Event Filter */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex flex-col lg:flex-row justify-between items-end gap-6">
                                    <div className="flex-1 w-full space-y-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 leading-none">Kelola Event</h3>
                                                <p className="text-gray-500 text-xs mt-1">Cari dan filter daftar kegiatan di {tenant.name}.</p>
                                            </div>
                                            <Link 
                                                href={route('tenant.events.create', tenant.id)}
                                                className="lg:hidden p-2 bg-indigo-600 text-white rounded-lg shadow-lg"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </Link>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="relative group md:col-span-1">
                                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Nama Event</label>
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                                    <input
                                                        type="text"
                                                        className="block w-full pl-9 pr-3 py-2 border-none bg-gray-50 focus:ring-2 focus:ring-indigo-500 rounded-xl text-sm transition-all"
                                                        placeholder="Cari judul..."
                                                        value={search}
                                                        onChange={(e) => setSearch(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="relative group">
                                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Dari Tanggal</label>
                                                <input
                                                    type="date"
                                                    className="block w-full px-3 py-2 border-none bg-gray-50 focus:ring-2 focus:ring-indigo-500 rounded-xl text-sm transition-all"
                                                    value={dateFrom}
                                                    onChange={(e) => setDateFrom(e.target.value)}
                                                />
                                            </div>
                                            <div className="relative group">
                                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Hingga Tanggal</label>
                                                <input
                                                    type="date"
                                                    className="block w-full px-3 py-2 border-none bg-gray-50 focus:ring-2 focus:ring-indigo-500 rounded-xl text-sm transition-all"
                                                    value={dateTo}
                                                    onChange={(e) => setDateTo(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <Link 
                                        href={route('tenant.events.create', tenant.id)}
                                        className="hidden lg:flex px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 items-center justify-center gap-2 mb-1"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Buat Event
                                    </Link>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-100">
                                        <thead className="bg-gray-50/50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Judul Event</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Budget/Org</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Tanggal Mulai</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Peserta</th>
                                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-50">
                                            {events.data.length > 0 ? (
                                                events.data.map((ev) => (
                                                    <tr key={ev.id} className="hover:bg-indigo-50/30 transition-colors group">
                                                        <td className="px-6 py-5 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-black group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                                    {ev.title.charAt(0)}
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-bold text-gray-900 leading-tight">{ev.title}</div>
                                                                    <div className="text-[10px] text-gray-400 font-medium uppercase tracking-tight italic">ID: {ev.id.substring(0, 8)}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 whitespace-nowrap text-center">
                                                            <span className="text-sm font-black text-gray-800">Rp {Number(ev.budget_per_person).toLocaleString('id-ID')}</span>
                                                        </td>
                                                        <td className="px-6 py-5 whitespace-nowrap text-center">
                                                            <div className="flex flex-col items-center">
                                                                <span className="text-sm font-bold text-gray-700">{new Date(ev.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                                                                <span className="text-[10px] text-gray-400">{new Date(ev.start_date).getFullYear()}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 whitespace-nowrap text-center">
                                                            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-emerald-100">
                                                                {ev.participants.length} Terdaftar
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-5 whitespace-nowrap text-right">
                                                            <Link 
                                                                href={route('tenant.events.edit', { tenant: tenant.id, event: ev.id })} 
                                                                className="inline-flex items-center px-4 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
                                                            >
                                                                Edit
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-16 text-center">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <div className="p-4 bg-gray-50 rounded-2xl mb-2">
                                                                <FilterIcon className="w-10 h-10 text-gray-200" />
                                                            </div>
                                                            <p className="text-gray-400 font-bold">Tidak ada event yang ditemukan</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="px-6 py-6 bg-gray-50/50 border-t border-gray-100">
                                    <Pagination links={events.links} />
                                </div>
                            </div>
                        </div>
                    )
}

                    {role === 'treasurer' && (
                        <div className="space-y-6">
                            {/* Filter Section */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Cari Member atau Event</label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input 
                                                type="text" 
                                                value={search}
                                                onChange={e => setSearch(e.target.value)}
                                                placeholder="Cth: Budi atau Gathering Nasional..."
                                                className="w-full pl-10 pr-4 py-2 bg-gray-100/50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 rounded-lg transition-all text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Dari Tanggal</label>
                                        <input 
                                            type="date" 
                                            value={dateFrom}
                                            onChange={e => setDateFrom(e.target.value)}
                                            className="w-full px-4 py-2 bg-gray-100/50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 rounded-lg transition-all text-sm"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Sampai</label>
                                            <input 
                                                type="date" 
                                                value={dateTo}
                                                onChange={e => setDateTo(e.target.value)}
                                                className="w-full px-4 py-2 bg-gray-100/50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 rounded-lg transition-all text-sm"
                                            />
                                        </div>
                                        <button 
                                            type="submit"
                                            className="bg-indigo-600 text-white p-2.5 rounded-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-sm h-[40px]"
                                        >
                                            <Search className="w-5 h-5" />
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Payment Table */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-50">
                                    <h3 className="text-xl font-bold text-gray-900">Validasi Pembayaran</h3>
                                    <p className="text-sm text-gray-500 mt-1">Gunakan tabel ini untuk memverifikasi uang kas/cicilan yang masuk dari member.</p>
                                </div>
                                
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50/50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Member & Event</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Nominal</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Tanggal Bayar</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Bukti</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Tindakan</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {payments.data.map(p => (
                                                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-gray-900 leading-tight">{p.user?.name}</div>
                                                        <div className="text-xs text-indigo-600 font-semibold tracking-wide mt-0.5">{p.event?.title}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-bold">
                                                        Rp {Number(p.amount).toLocaleString('id-ID')}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                                                        {new Date(p.payment_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button 
                                                            onClick={() => openProofModal(p)}
                                                            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-bold gap-1 group"
                                                        >
                                                            <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                            Lihat Resi
                                                        </button>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                                            p.status === 'VERIFIED' ? 'bg-green-100 text-green-700' : 
                                                            p.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                                        }`}>
                                                            {p.status === 'VERIFIED' && <CheckCircle className="w-3 h-3 mr-1" />}
                                                            {p.status === 'REJECTED' && <XCircle className="w-3 h-3 mr-1" />}
                                                            {p.status === 'PENDING' && <Clock className="w-3 h-3 mr-1" />}
                                                            {p.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        {p.status === 'PENDING' ? (
                                                            <div className="flex justify-center gap-2">
                                                                <button 
                                                                    onClick={() => initiateVerify(p.id, 'VERIFIED')}
                                                                    className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm"
                                                                    title="Terima"
                                                                >
                                                                    <CheckCircle className="w-4 h-4" />
                                                                </button>
                                                                <button 
                                                                    onClick={() => initiateVerify(p.id, 'REJECTED')}
                                                                    className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                                                                    title="Tolak"
                                                                >
                                                                    <XCircle className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-gray-400 font-medium italic">Selesai</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                            {payments.data.length === 0 && (
                                                <tr>
                                                    <td colSpan="6" className="text-center py-16">
                                                        <div className="flex flex-col items-center">
                                                            <div className="p-3 bg-gray-50 rounded-full mb-3">
                                                                <FileText className="w-8 h-8 text-gray-300" />
                                                            </div>
                                                            <p className="text-gray-400 italic font-medium">Tidak ada data pembayaran ditemukan.</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-6 bg-gray-50/30 border-t border-gray-100">
                                    <Pagination links={payments.links} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Shadcn Modal for Payment Proof */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden p-0 border-none shadow-2xl flex flex-col">
                    <DialogHeader className="p-6 bg-white border-b shrink-0">
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-600" />
                            Bukti Transfer Member
                        </DialogTitle>
                        {selectedPayment && (
                            <DialogDescription className="text-gray-500 font-medium">
                                Melalui: <span className="text-gray-800 font-bold">{selectedPayment.user?.name}</span> • Event: <span className="text-indigo-600 font-bold">{selectedPayment.event?.title}</span>
                            </DialogDescription>
                        )}
                    </DialogHeader>
                    
                    <div className="flex-1 overflow-y-auto bg-gray-50 p-4 min-h-[200px]">
                        <div className="flex justify-center items-center">
                            {selectedPayment?.proof_of_transfer_url && (
                                <img 
                                    src={`/storage/${selectedPayment.proof_of_transfer_url}`} 
                                    alt="Bukti Transfer" 
                                    className="max-w-full h-auto rounded-xl shadow-md border-4 border-white"
                                />
                            )}
                        </div>
                    </div>

                    <div className="p-6 bg-white border-t flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
                        <div className="text-center sm:text-left">
                            <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Nominal Tertera</div>
                            <div className="text-2xl font-black text-gray-900 tracking-tight">Rp {Number(selectedPayment?.amount).toLocaleString('id-ID')}</div>
                        </div>
                        
                        {selectedPayment?.status === 'PENDING' && (
                            <div className="flex gap-3 w-full sm:w-auto">
                                <button 
                                    onClick={() => initiateVerify(selectedPayment.id, 'REJECTED')}
                                    className="flex-1 sm:flex-none px-6 py-2.5 bg-red-50 text-red-700 rounded-xl font-bold border-2 border-red-100 hover:bg-red-100 transition-all active:scale-95 text-sm"
                                >
                                    Tolak Resi
                                </button>
                                <button 
                                    onClick={() => initiateVerify(selectedPayment.id, 'VERIFIED')}
                                    className="flex-1 sm:flex-none px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 text-sm"
                                >
                                    Verifikasi & Terima
                                </button>
                            </div>
                        )}
                        
                        {selectedPayment?.status !== 'PENDING' && (
                            <div className={`px-4 py-2 rounded-lg font-bold text-sm ${
                                selectedPayment?.status === 'VERIFIED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                                Status: {selectedPayment?.status}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Confirmation Modal */}
            <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {confirmActionData.status === 'VERIFIED' ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                                <XCircle className="w-5 h-5 text-red-600" />
                            )}
                            Konfirmasi Tindakan
                        </DialogTitle>
                        <DialogDescription>
                            {confirmActionData.status === 'VERIFIED' 
                                ? 'Apakah Anda yakin bukti transfer ini sudah sesuai dan ingin memverifikasi pembayaran ini?'
                                : 'Apakah Anda yakin ingin menolak bukti transfer ini? Anggota akan diminta untuk mengunggah ulang.'}
                        </DialogDescription>
                    </DialogHeader>

                    {confirmActionData.status === 'REJECTED' && (
                        <div className="py-4">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Alasan Penolakan <span className="text-red-500">*</span></label>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                rows="3"
                                placeholder="Cth: Foto resi tidak terbaca atau nominal tidak sesuai..."
                                required
                            />
                        </div>
                    )}

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            onClick={() => setIsConfirmModalOpen(false)}
                            className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            onClick={executeVerification}
                            disabled={processing || (confirmActionData.status === 'REJECTED' && !rejectionReason.trim())}
                            className={`px-6 py-2 rounded-xl font-bold text-sm text-white shadow-lg transition-all active:scale-95 disabled:opacity-50 ${
                                confirmActionData.status === 'VERIFIED' ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100' : 'bg-red-600 hover:bg-red-700 shadow-red-100'
                            }`}
                        >
                            {processing ? 'Memproses...' : (confirmActionData.status === 'VERIFIED' ? 'Ya, Verifikasi' : 'Ya, Tolak')}
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
