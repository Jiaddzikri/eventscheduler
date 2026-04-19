import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function PublicLayout({ header, children }) {
    const user = usePage().props.auth.user;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation Bar for Public View */}
            <nav className="bg-white shadow-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Logo and Home Link */}
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto text-indigo-600 fill-current" />
                                </Link>
                                <span className="ml-3 font-bold text-xl text-gray-800 tracking-tight">EventPlatform</span>
                            </div>
                        </div>

                        {/* Right side navigation (Auth controls) */}
                        <div className="flex items-center space-x-4">
                            {user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="text-sm font-medium text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md transition"
                                >
                                    Masuk ke Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition shadow-sm"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Optional Header Section */}
            {header && (
                <header className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Main Content Area */}
            <main>
                {children}
            </main>
            
            {/* Simple Footer */}
            <footer className="bg-white border-t border-gray-200 mt-12 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} EventPlatform. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
