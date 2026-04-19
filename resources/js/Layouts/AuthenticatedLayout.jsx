import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Common link styles
    const navItemBase = "flex items-center px-4 py-3 mt-2 text-gray-300 rounded-lg transition-colors hover:bg-gray-800 hover:text-white";
    const navItemActive = "flex items-center px-4 py-3 mt-2 text-white bg-gray-800 rounded-lg transition-colors";

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-20 transition-opacity bg-black bg-opacity-50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto md:flex md:flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-center h-20 border-b border-gray-800">
                    <Link href="/" className="flex items-center">
                        <ApplicationLogo className="w-auto h-8 text-indigo-400 fill-current" />
                        <span className="ml-3 text-xl font-bold text-white tracking-wider">EventPlatform</span>
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-4 px-4">Menu Utama</div>
                    
                    <Link
                        href={route('dashboard')}
                        className={route().current('dashboard') ? navItemActive : navItemBase}
                    >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                        Global Dashboard
                    </Link>

                    {user.tenants && user.tenants.length > 0 && (
                        <>
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-8 px-4">Manajemen Hak Akses</div>
                            {user.tenants.map(tenant => (
                                <Link
                                    key={tenant.id}
                                    href={route('tenant.dashboard', tenant.id)}
                                    className={route().current('tenant.dashboard', tenant.id) ? navItemActive : navItemBase}
                                >
                                    {tenant.pivot.role === 'manager' ? (
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                    ) : (
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    )}
                                    Dasbor {tenant.pivot.role === 'manager' ? 'Manajer' : 'Bendahara'}
                                </Link>
                            ))}
                        </>
                    )}

                    {/* Super Admin Panel */}
                    {user.role === 'admin' && (
                        <>
                            <div className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2 mt-8 px-4">Panel Super Admin</div>
                            <Link
                                href={route('admin.tenants.index')}
                                className={route().current('admin.tenants.*') ? navItemActive : navItemBase}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                Kelola Tenant
                            </Link>
                            <Link
                                href={route('admin.users.index')}
                                className={route().current('admin.users.*') ? navItemActive : navItemBase}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                Kelola Pengguna
                            </Link>
                        </>
                    )}
                </div>

                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                                {user.name.charAt(0)}
                            </div>
                            <div className="ml-3 truncate">
                                <p className="text-sm font-medium text-white">{user.name}</p>
                                <p className="text-xs text-gray-400">{user.email}</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 flex flex-col space-y-2">
                        <Link href={route('profile.edit')} className="text-sm text-gray-400 hover:text-white flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                            Profil Saya
                        </Link>
                        <Link href={route('logout')} method="post" as="button" className="text-sm text-red-400 hover:text-red-300 flex items-center text-left">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                            Logout
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header (Hamburger + Title) */}
                <header className="md:hidden flex items-center justify-between bg-white px-4 py-3 shadow-sm border-b border-gray-200 z-10">
                    <div className="flex items-center">
                        <button 
                            onClick={() => setSidebarOpen(true)}
                            className="text-gray-500 focus:outline-none focus:text-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                    </div>
                    <div className="text-lg font-bold text-gray-800">EventPlatform</div>
                    <div className="w-6"></div> {/* Spacer for symmetry */}
                </header>

                {/* Page Header (if exists) */}
                {header && (
                    <header className="bg-white shadow z-10 border-b border-gray-200 hidden md:block">
                        <div className="px-4 py-6 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                {/* Main scrollable content */}
                <main className="flex-1 overflow-y-auto">
                    {/* Mobile page header duplicate so it shows up */}
                    {header && (
                        <div className="bg-white shadow py-4 px-4 mb-4 md:hidden border-b border-gray-200">
                            {header}
                        </div>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}
