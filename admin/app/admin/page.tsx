"use client"
import { getNotes } from '@/lib/query';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { columns } from './columns';
import { DataTable } from './data-table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Page() {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState('all');
    
    const {data, isLoading, error, refetch} = useQuery({
        queryKey: ["table", page, status],
        queryFn: () => getNotes(page, status === 'all' ? '' : status),
    })

    console.log("Full API Response:", data);
    console.log("Notes array:", data?.data);
    console.log("Pagination info:", data?.pagination);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-white to-blue-50/50 border border-slate-200/60 shadow-xl shadow-slate-900/5">
                    <div className="text-center p-4 m-4">
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                                Welcome back,
                            </span>
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
                                Admin
                            </span>
                        </h1>
                    </div>  
                </div>
                <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2">Loading notes...</span>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-white to-blue-50/50 border border-slate-200/60 shadow-xl shadow-slate-900/5">
                    <div className="text-center p-4 m-4">
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                                Welcome back,
                            </span>
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
                                Admin
                            </span>
                        </h1>
                    </div>  
                </div>
                <div className="p-8 text-center">
                    <div className="text-red-600 mb-4">❌ Error loading notes</div>
                    <Button onClick={() => refetch()} variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try Again
                    </Button>
                </div>
            </div>
        )
    }

    const notesData = data?.data || [];
    const pagination = data?.pagination;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-white to-blue-50/50 border border-slate-200/60 shadow-xl shadow-slate-900/5">
                <div className="text-center p-4 m-4">
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                        <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                            Welcome back,
                        </span>
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
                            Admin
                        </span>
                    </h1>
                    {pagination && (
                        <p className="text-sm text-gray-600 mt-2">
                            Showing {notesData.length} of {pagination.totalDocs} notes 
                            (Page {pagination.currentPage} of {pagination.totalPages})
                        </p>
                    )}
                </div>  
            </div>

           
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">Status:</label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="All statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All statuses</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => refetch()}
                        disabled={isLoading}
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>

                {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(page - 1)}
                            disabled={!pagination.hasPrevPage}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </Button>
                        
                        <span className="text-sm text-gray-600 px-3">
                            Page {pagination.currentPage} of {pagination.totalPages}
                        </span>
                        
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(page + 1)}
                            disabled={!pagination.hasNextPage}
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6">
                <DataTable columns={columns} data={notesData} />
            </div>

            <details className="bg-gray-50 p-4 rounded-lg border">
                <summary className="cursor-pointer text-sm font-medium text-gray-700">
                    🔍 Debug Information (Click to expand)
                </summary>
                <div className="mt-4 space-y-2 text-xs">
                    <div><strong>Raw Data:</strong> {data ? 'Exists' : 'Missing'}</div>
                    <div><strong>Notes Array:</strong> {notesData ? `${notesData.length} items` : 'Missing'}</div>
                    <div><strong>Pagination:</strong> {pagination ? 'Exists' : 'Missing'}</div>
                    <div><strong>Sample Note ID:</strong> {notesData[0]?._id || 'N/A'}</div>
                    <div><strong>Sample Attempts:</strong> {notesData[0]?.attempts?.length || 0} attempts</div>
                    <div><strong>Last Attempt:</strong> {
                        notesData[0]?.attempts?.length > 0 
                            ? `${notesData[0].attempts[notesData[0].attempts.length - 1].success ? 'Success' : 'Failed'} at ${notesData[0].attempts[notesData[0].attempts.length - 1].attemptedAt}`
                            : 'None'
                    }</div>
                </div>
            </details>
        </div>
    )
}