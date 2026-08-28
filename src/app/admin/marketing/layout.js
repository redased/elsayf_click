import MarketingSidebar from '@/components/MarketingSidebar';

export default function MarketingLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#0a0e17]">
            <MarketingSidebar />
            <div className="lg:pl-64 transition-all duration-300">
                {children}
            </div>
        </div>
    );
}
