

import React from "react";

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
    console.log("Tabs received:", tabs, "Active Tab is:", activeTab);
    return (
        <div className="w-full">
            {/* Tab Navigation */}
            <div className="relative border-b-2 border-slate-100">
                <nav className="flex gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative pb-4 px-6 text-sm font-semibold transition-all duration-200 ${
                                activeTab === tab.id
                                    ? "text-emerald-600"
                                    : "text-slate-600 hover:text-slate-900"
                            }`}
                        >
                            <span className="relative z-10">{tab.label}</span>
                            
                            {/* Active Underline Indicator */}
                            {activeTab === tab.id && (
                                <>
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-lg shadow-emerald-500/20" />
                                    <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 to-transparent rounded-t-xl -z-10" />
                                </>
                            )}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="py-6">
                {tabs.map((tab) => 
                    activeTab === tab.id ? (
                        <div 
                            key={tab.id} 
                            className="animate-in fade-in duration-300"
                        >
                            {tab.content}
                        </div>
                    ) : null
                )}
            </div>
        </div>
    );
};

export default Tabs;