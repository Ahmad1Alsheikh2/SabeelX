'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function PaymentMethods() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const [isAddingCard, setIsAddingCard] = useState(false)
    const [formData, setFormData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: ''
    })

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

    const handleAddCard = async (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: Implement card addition logic with your payment provider
        setIsAddingCard(false)
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Payment Methods</h2>
                        <button
                            onClick={() => setIsAddingCard(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Add New Card
                        </button>
                    </div>

                    {/* Saved Cards List */}
                    <div className="space-y-4">
                        <div className="border rounded-lg p-4 flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                                <div className="text-2xl">💳</div>
                                <div>
                                    <p className="font-medium text-gray-900">•••• •••• •••• 1234</p>
                                    <p className="text-sm text-gray-500">Expires 12/24</p>
                                </div>
                            </div>
                            <button
                                className="text-red-600 hover:text-red-800"
                                onClick={() => {
                                    // TODO: Implement card removal logic
                                }}
                            >
                                Remove
                            </button>
                        </div>
                    </div>

                    {/* Add New Card Form */}
                    {isAddingCard && (
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Card</h3>
                                <form onSubmit={handleAddCard} className="space-y-4">
                                    <div>
                                        <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700">
                                            Cardholder Name
                                        </label>
                                        <input
                                            type="text"
                                            id="cardholderName"
                                            value={formData.cardholderName}
                                            onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                                            Card Number
                                        </label>
                                        <input
                                            type="text"
                                            id="cardNumber"
                                            value={formData.cardNumber}
                                            onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="1234 5678 9012 3456"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                                                Expiry Date
                                            </label>
                                            <input
                                                type="text"
                                                id="expiryDate"
                                                value={formData.expiryDate}
                                                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="MM/YY"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                                                CVV
                                            </label>
                                            <input
                                                type="text"
                                                id="cvv"
                                                value={formData.cvv}
                                                onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="123"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end space-x-3 mt-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsAddingCard(false)}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                        >
                                            Add Card
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
} 