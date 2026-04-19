import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 space-y-4">
                            <p className="font-medium text-lg">Selamat datang di Platform Manajemen Event!</p>
                            <p>Mulai eksplorasi event dari berbagai vendor atau komunitas, dan lakukan pendaftaran secara langsung.</p>
                            <div className="mt-4">
                                <a href={route('events.index')} className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-md shadow hover:bg-indigo-700 transition">
                                    Lihat Daftar Event ➜
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
