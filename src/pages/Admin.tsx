// src/pages/Admin.tsx
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Settings,
    Database,
    Calendar,
    Trophy
} from 'lucide-react';
import {
    getStats
} from '@/firebase/admin.service.ts';
import ScheduleCalendar from '@/components/admin/ScheduleCalendar';
import DevTools from '@/components/admin/DevTools';
import FieldsManagement from '@/components/admin/FieldsManagement';

const Admin = () => {
    const [importStats, setImportStats] = useState({ fields: 0, slots: 0 });
    const [stats, setStats] = useState({ totalFields: 0, totalSlots: 0, availableSlots: 0 });

    // Fetch statistics
    const handleFetchStats = async () => {
        try {
            const statsData = await getStats();
            setStats(statsData);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    // Handle import success callback
    const handleImportSuccess = async () => {
        await handleFetchStats();
    };

    // Load data on component mount
    useEffect(() => {
        handleFetchStats();
    }, []);

    const PremiumCard = ({ children, className = "", hover = true }) => (
        <div className={`
            bg-white rounded-2xl border border-gray-100 shadow-lg 
            ${hover ? 'hover:shadow-2xl hover:-translate-y-1' : ''} 
            transition-all duration-500 overflow-hidden backdrop-blur-sm
            ${className}
        `}>
            {children}
        </div>
    );

    return (
        <div className="pt-16 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#0033A1] to-[#3366CC] rounded-2xl flex items-center justify-center shadow-lg">
                        <Settings className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-[#0033A1] mb-2">
                            Interface Admin
                        </h1>
                        <p className="text-xl text-gray-600">
                            Gestion des terrains et créneaux - Regragui Football Academy
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <PremiumCard className="p-6 bg-gradient-to-r from-[#0033A1] to-[#3366CC] text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 font-medium">Terrains importés</p>
                                <p className="text-3xl font-bold">{importStats.fields}</p>
                                <p className="text-xs text-blue-200 mt-1">Total DB: {stats.totalFields}</p>
                            </div>
                            <Database className="w-12 h-12 text-blue-200" />
                        </div>
                    </PremiumCard>

                    <PremiumCard className="p-6 bg-gradient-to-r from-[#FFCC00] to-[#FFD700] text-[#0033A1]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#0033A1]/70 font-medium">Créneaux importés</p>
                                <p className="text-3xl font-bold">{importStats.slots}</p>
                                <p className="text-xs text-[#0033A1]/70 mt-1">Total DB: {stats.totalSlots}</p>
                            </div>
                            <Calendar className="w-12 h-12 text-[#0033A1]/70" />
                        </div>
                    </PremiumCard>

                    <PremiumCard className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 font-medium">Créneaux disponibles</p>
                                <p className="text-3xl font-bold">{stats.availableSlots}</p>
                                <p className="text-xs text-green-200 mt-1">Sur {stats.totalSlots} total</p>
                            </div>
                            <Trophy className="w-12 h-12 text-green-200" />
                        </div>
                    </PremiumCard>
                </div>
            </div>

            {/* Main Content */}
            <PremiumCard className="p-8">
                <Tabs defaultValue="dev" className="space-y-8">
                    <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg h-auto">
                        <TabsTrigger
                            value="dev"
                            className="data-[state=active]:bg-[#0033A1] data-[state=active]:text-white font-semibold text-sm py-2 px-4 rounded-md transition-all duration-300 whitespace-nowrap"
                        >
                            <Settings className="w-4 h-4 mr-2" />
                            Dev
                        </TabsTrigger>
                        <TabsTrigger
                            value="terrains"
                            className="data-[state=active]:bg-[#0033A1] data-[state=active]:text-white font-semibold text-sm py-2 px-4 rounded-md transition-all duration-300 whitespace-nowrap"
                        >
                            <Database className="w-4 h-4 mr-2" />
                            Terrains
                        </TabsTrigger>
                        <TabsTrigger
                            value="schedule"
                            className="data-[state=active]:bg-[#0033A1] data-[state=active]:text-white font-semibold text-sm py-2 px-4 rounded-md transition-all duration-300 whitespace-nowrap"
                        >
                            <Calendar className="w-4 h-4 mr-2" />
                            Créneaux
                        </TabsTrigger>
                    </TabsList>

                    {/* Dev Tab */}
                    <TabsContent value="dev" className="space-y-8">
                        <DevTools
                            onImportSuccess={handleImportSuccess}
                            setImportStats={setImportStats}
                        />
                    </TabsContent>

                    {/* Terrains Tab */}
                    <TabsContent value="terrains" className="space-y-8">
                        <FieldsManagement />
                    </TabsContent>

                    {/* Schedule Tab */}
                    <TabsContent value="schedule" className="space-y-8">
                        <ScheduleCalendar />
                    </TabsContent>
                </Tabs>
            </PremiumCard>
        </div>
    );
};

export default Admin;