'use client';

import { useState, useEffect } from 'react';
import {
    ChevronDown,
    ChevronUp,
    MoreHorizontal,
    Search,
    Filter
} from 'lucide-react';

export interface Column<T> {
    key: keyof T;
    title: string;
    render?: (value: any, row: T) => React.ReactNode;
    sortable?: boolean;
    width?: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    onRowClick?: (row: T) => void;
    searchable?: boolean;
    filterable?: boolean;
    pagination?: boolean;
    pageSize?: number;
}

export function DataTable<T>({
    data,
    columns,
    onRowClick,
    searchable = false,
    filterable = false,
    pagination = true,
    pageSize = 10
}: DataTableProps<T>) {
    const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState<T[]>(data);

    // Sorting logic
    useEffect(() => {
        let sorted = [...data];

        if (sortColumn) {
            sorted.sort((a, b) => {
                const aVal = a[sortColumn];
                const bVal = b[sortColumn];

                if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            sorted = sorted.filter(row =>
                Object.values(row as any).some(val =>
                    String(val).toLowerCase().includes(term)
                )
            );
        }

        setFilteredData(sorted);
    }, [data, sortColumn, sortDirection, searchTerm]);

    const handleSort = (columnKey: keyof T) => {
        if (sortColumn === columnKey) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(columnKey);
            setSortDirection('asc');
        }
    };

    // Pagination
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

    return (
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            {/* Toolbar */}
            {(searchable || filterable) && (
                <div className="flex items-center gap-4 p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                    {searchable && (
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    )}

                    {filterable && (
                        <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
                            <Filter className="w-4 h-4" />
                            <span>Filters</span>
                        </button>
                    )}
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-900">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={String(column.key)}
                                    className={`text-left py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400 ${column.width || ''}`}
                                >
                                    {column.sortable ? (
                                        <button
                                            onClick={() => handleSort(column.key)}
                                            className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-200"
                                        >
                                            {column.title}
                                            {sortColumn === column.key && (
                                                sortDirection === 'asc' ?
                                                    <ChevronUp className="w-4 h-4" /> :
                                                    <ChevronDown className="w-4 h-4" />
                                            )}
                                        </button>
                                    ) : (
                                        column.title
                                    )}
                                </th>
                            ))}
                            <th className="w-12"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((row, index) => (
                            <tr
                                key={index}
                                className={`border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer ${onRowClick ? 'cursor-pointer' : ''}`}
                                onClick={() => onRowClick?.(row)}
                            >
                                {columns.map((column) => (
                                    <td key={String(column.key)} className="py-3 px-4 text-sm">
                                        {column.render ?
                                            column.render(row[column.key], row) :
                                            String(row[column.key])
                                        }
                                    </td>
                                ))}
                                <td className="py-3 px-4">
                                    <MoreHorizontal className="w-4 h-4 text-slate-400" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                        Showing {startIndex + 1}-{Math.min(startIndex + pageSize, filteredData.length)} of {filteredData.length}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            Previous
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center ${currentPage === i + 1
                                        ? 'bg-primary text-white'
                                        : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
