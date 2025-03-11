'use client'

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function PaymentHistory() {
    const router = useRouter()
    const { data: session, status } = useSession()

    // Mock data for payment history
    const transactions = [
        {
            id: 1,
            date: '2024-02-20',
            amount: 100,
            mentor: 'John Doe',
            status: 'Completed',
            type: 'Session Payment'
        },
        {
            id: 2,
            date: '2024-02-15',
            amount: 150,
            mentor: 'Jane Smith',
            status: 'Completed',
            type: 'Session Payment'
        }
    ]

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
                <div className="text-center">
                    <p className="text-gray-500">Loading...</p>
                </div>
            </div>
        )
    }

    if (status === 'unauthenticated') {
        router.push('/auth/signin')
        return null
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Payment History</h2>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => {/* TODO: Implement download functionality */ }}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Download History
                            </button>
                        </div>
                    </div>

                    {/* Transactions Table */}
                    <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Mentor
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                            No transactions found
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.map((transaction) => (
                                        <tr key={transaction.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(transaction.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {transaction.type}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {transaction.mentor}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                ${transaction.amount}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    {transaction.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Showing <span className="font-medium">1</span> to <span className="font-medium">2</span> of{' '}
                            <span className="font-medium">2</span> results
                        </div>
                        <div className="flex-1 flex justify-end">
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                <button
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                    disabled
                                >
                                    Previous
                                </button>
                                <button
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                    disabled
                                >
                                    Next
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 