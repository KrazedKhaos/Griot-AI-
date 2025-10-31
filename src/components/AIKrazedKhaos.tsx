import React from 'react';
import { AIKrazedKhaosStatus } from '../../types';

const mockStatus: AIKrazedKhaosStatus = {
    platformStatus: 'Optimal',
    securityPosture: 'Secure',
    performanceIndex: 98,
    marketSentiment: 'Positive - AI Tools & E-learning trending up.',
    contentVelocity: 42,
};

const AIKrazedKhaos: React.FC = () => {
    const status = mockStatus;

    const getStatusColor = (s: string) => {
        switch (s) {
            case 'Optimal':
            case 'Secure':
                return 'text-green-500';
            case 'Degraded':
            case 'Vulnerable':
                return 'text-yellow-500';
            case 'Critical':
            case 'Compromised':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    };

    const Card: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactElement; }> = ({ title, children, icon }) => (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
            <div className="flex items-center space-x-3">
                <div className="text-uc-primary">{icon}</div>
                <h3 className="text-md font-bold text-uc-secondary dark:text-gray-100">{title}</h3>
            </div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {children}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="text-center p-4 bg-uc-secondary rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-white tracking-widest uppercase">Governor Oversight</h1>
                <p className="text-sm text-gray-300 font-mono">Codename: KRAZED KHAOS</p>
                <p className="mt-2 text-base text-uc-primary font-semibold">"Omniscient. Omnipresent. The All-Seeing Eye."</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card title="Platform Status" icon={<StatusIcon/>}>
                    <p className={`font-bold text-lg ${getStatusColor(status.platformStatus)}`}>{status.platformStatus}</p>
                </Card>
                 <Card title="Security Posture" icon={<SecurityIcon/>}>
                    <p className={`font-bold text-lg ${getStatusColor(status.securityPosture)}`}>{status.securityPosture}</p>
                    <p className="text-xs text-gray-400">Monitored by Aegis Commander</p>
                </Card>
                 <Card title="Performance Index" icon={<PerformanceIcon/>}>
                    <p className="font-bold text-lg text-uc-secondary dark:text-gray-100">{status.performanceIndex}%</p>
                    <p className="text-xs text-gray-400">Reflex Optimizer Efficiency</p>
                </Card>
                <Card title="Content Velocity" icon={<ContentIcon/>}>
                     <p className="font-bold text-lg text-uc-secondary dark:text-gray-100">{status.contentVelocity} <span className="text-sm font-normal text-gray-500">creations/wk</span></p>
                     <p className="text-xs text-gray-400">Total AI-generated assets</p>
                </Card>
            </div>
            
            <Card title="Market Sentiment Analysis" icon={<TrendIcon/>}>
                 <p className="font-semibold text-uc-secondary dark:text-gray-200">{status.marketSentiment}</p>
                 <p className="text-xs text-gray-400 mt-1">Sourced from Trend Spotter</p>
            </Card>

        </div>
    );
};

// Icons
const StatusIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
const SecurityIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5.002 12.053 12.053 0 0010 18.455a12.053 12.053 0 007.834-13.453A11.954 11.954 0 0110 1.944zM8 9a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm1 4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" /></svg>;
const PerformanceIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>;
const TrendIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v-1h8v1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a4 4 0 00-4-4H8a4 4 0 00-4 4v1h12z" /></svg>;
const ContentIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" /></svg>;

export default AIKrazedKhaos;