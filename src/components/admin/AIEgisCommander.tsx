import React, { useState, useEffect } from 'react';
import { AIEgisCommanderReport } from '../../types';
import AIMarshalAgent from './AIMarshalAgent';

const mockReport: AIEgisCommanderReport = {
    threatLevel: 'Guarded',
    activePatrols: [
        { name: 'Alpha Squad', status: 'Operational' },
        { name: 'Bravo Squad', status: 'Operational' }
    ],
    recentIncidents: 4,
    avgResponseTime: 3
};

const AIEgisCommander: React.FC = () => {
    const [report] = useState<AIEgisCommanderReport>(mockReport);

    const getThreatColor = (level: AIEgisCommanderReport['threatLevel']) => {
        switch (level) {
            case 'Severe':
            case 'High':
                return 'text-red-500';
            case 'Elevated':
                return 'text-yellow-500';
            case 'Guarded':
                return 'text-blue-500';
            default:
                return 'text-green-500';
        }
    };

    const StatCard: React.FC<{ title: string, value: string | number, icon: React.ReactElement, valueClass?: string }> = ({ title, value, icon, valueClass }) => (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex items-center space-x-3">
            <div className="text-uc-primary">
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
                <p className={`text-xl font-bold text-uc-secondary dark:text-gray-100 ${valueClass}`}>{value}</p>
            </div>
        </div>
    );
    
    return (
        <div className="space-y-6">
            <div className="text-center">
                 <h2 className="text-2xl font-bold text-uc-secondary dark:text-white">General Commander's Briefing</h2>
                 <p className="text-sm text-gray-500 dark:text-gray-400">Strategic Security Overview</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Threat Level" value={report.threatLevel} icon={<ThreatIcon/>} valueClass={getThreatColor(report.threatLevel)} />
                <StatCard title="24H Incidents" value={report.recentIncidents} icon={<IncidentIcon/>} />
                <StatCard title="Avg. Response" value={`${report.avgResponseTime} min`} icon={<TimeIcon/>} />
                <StatCard title="Patrol Status" value="2/2 Active" icon={<PatrolIcon/>} />
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                <h3 className="text-lg font-bold text-uc-secondary dark:text-white mb-2">Active Patrols (24/7)</h3>
                <div className="space-y-2">
                    {report.activePatrols.map(squad => (
                        <div key={squad.name} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                            <span className="font-semibold text-sm text-uc-text dark:text-gray-200">{squad.name}</span>
                            <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded-full">{squad.status}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <AIMarshalAgent />
            </div>
        </div>
    );
};

// Icons
const ThreatIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>;
const IncidentIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
const TimeIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
const PatrolIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;

export default AIEgisCommander;