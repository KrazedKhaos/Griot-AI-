import React, { useState } from 'react';
import { SecurityEvent } from '../../types';
import { useTranslations } from '../../hooks/useTranslations';

const MOCK_EVENTS: SecurityEvent[] = [
    { id: 'evt-01', timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), type: 'Fraudulent Product', severity: 'High', details: 'Product "Crypto Doubler 2025" flagged for unrealistic claims.', status: 'Pending' },
    { id: 'evt-02', timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), type: 'Malicious Link', severity: 'Medium', details: 'Affiliate link for "Free Followers" redirected to known phishing site.', status: 'Resolved' },
    { id: 'evt-03', timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), type: 'Spam Review', severity: 'Low', details: 'User "bot123" posted 50 identical reviews in 2 minutes.', status: 'Resolved' },
    { id: 'evt-04', timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), type: 'Fraudulent Product', severity: 'High', details: 'New submission "MiracleCure" violates medical claims policy.', status: 'Pending' },
];

const AIMarshalAgent: React.FC = () => {
    const t = useTranslations();
    const [events, setEvents] = useState<SecurityEvent[]>(MOCK_EVENTS);

    const pendingSubmissions = events.filter(e => e.status === 'Pending');
    const enforcementLog = events.filter(e => e.status === 'Resolved');

    const getSeverityClass = (severity: 'Low' | 'Medium' | 'High') => {
        switch (severity) {
            case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
            case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
            case 'Low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
        }
    };

    const EventRow: React.FC<{ event: SecurityEvent, isPending?: boolean }> = ({ event, isPending }) => (
        <li className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-uc-secondary dark:text-gray-100">{event.type}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{event.details}</p>
                </div>
                <div className="flex items-center space-x-3">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getSeverityClass(event.severity)}`}>
                        {event.severity}
                    </span>
                    {isPending && (
                        <div className="flex space-x-1">
                            <button className="p-1.5 bg-green-100 text-green-700 rounded-md hover:bg-green-200" title={t.approveSubmission}><CheckIcon /></button>
                            <button className="p-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200" title={t.denySubmission}><XIcon /></button>
                        </div>
                    )}
                </div>
            </div>
        </li>
    );

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-uc-secondary dark:text-white flex items-center">
                        <CheckpointIcon className="w-5 h-5 mr-2" />
                        Submission Checkpoint
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">New products awaiting policy verification.</p>
                </div>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {pendingSubmissions.length > 0 ? (
                        pendingSubmissions.map(event => <EventRow key={event.id} event={event} isPending />)
                    ) : (
                        <li className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">No pending submissions.</li>
                    )}
                </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-uc-secondary dark:text-white flex items-center">
                        <LogIcon className="w-5 h-5 mr-2" />
                        Policy Enforcement Log
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Record of automated actions against trafficking violations.</p>
                </div>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {enforcementLog.map(event => <EventRow key={event.id} event={event} />)}
                </ul>
            </div>
        </div>
    );
};

// Icons
const CheckpointIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6.5 10a.5.5 0 000 1h3v3a.5.5 0 001 0v-3h3a.5.5 0 000-1h-3v-3a.5.5 0 00-1 0v3h-3z" clipRule="evenodd" /><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM1 10a9 9 0 1118 0 9 9 0 01-18 0z" /></svg>);
const LogIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" /></svg>);
const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>);
const XIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>);

export default AIMarshalAgent;