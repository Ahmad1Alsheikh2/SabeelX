import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Paywall from '@/components/Paywall';
import { authOptions } from '@/lib/auth';

export default async function BrowsePage() {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and has an active subscription
    const isSubscribed = session?.user?.subscribed;

    // If not subscribed, show paywall
    if (!isSubscribed) {
        return <Paywall />;
    }

    // If subscribed, show the actual browse content
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Browse Content</h1>
            {/* Add your browse content here */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Example content cards */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-2">Content Title 1</h2>
                    <p className="text-gray-600">Description of the content goes here...</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-2">Content Title 2</h2>
                    <p className="text-gray-600">Description of the content goes here...</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-2">Content Title 3</h2>
                    <p className="text-gray-600">Description of the content goes here...</p>
                </div>
            </div>
        </div>
    );
} 