import React from 'react'

export default function Page() {
    return (
        <div>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-white to-blue-50/50 border border-slate-200/60 shadow-xl shadow-slate-900/5">
                {/* Background Decorative Elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl translate-x-20 -translate-y-20"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl -translate-x-20 translate-y-20"></div>
                </div>

                <div className="relative p-4 sm:p-6 lg:p-8">
                    {/* Mobile Layout */}
                    <div className="block lg:hidden space-y-6">
                        {/* Welcome Section - Mobile */}
                        <div className="text-center">


                            <div className="space-y-1 mb-6">
                                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                                    <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                                        Welcome back,
                                    </span>
                                    {/* <br /> */}
                                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
                                        Admin
                                    </span>
                                </h1>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
