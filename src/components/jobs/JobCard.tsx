import React, { useState } from 'react';
import { Job } from '../../types';
import { useTranslations } from '../../hooks/useTranslations';

interface JobCardProps {
    job: Job;
    onApplyWithAgent: (job: Job) => void;
}

const BriefcaseIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />
        <path d="M2 10.5a1.5 1.5 0 011.5-1.5h13a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 01-1.5 1.5h-13a1.5 1.5 0 01-1.5-1.5v-3z" />
    </svg>
);

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2l4.45.647a1 1 0 01.554 1.705l-3.22 3.138 1.17 4.628a1 1 0 01-1.451 1.054L12 15.58l-3.996 2.099a1 1 0 01-1.451-1.054l1.17-4.628L4.49 9.553a1 1 0 01.554-1.705l4.45-.647L11.033 2.744A1 1 0 0112 2z" clipRule="evenodd" />
    </svg>
);


const JobCard: React.FC<JobCardProps> = ({ job, onApplyWithAgent }) => {
    const t = useTranslations();
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg dark:hover:shadow-gray-700/50 transition-shadow duration-300 overflow-hidden">
            <div className="p-4">
                <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                        <BriefcaseIcon className="w-6 h-6 text-uc-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-uc-secondary dark:text-gray-100">{job.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{job.company}</p>
                        <p className="text-xs text-gray-400">{job.location} • {job.salary}</p>
                    </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                    {job.skills.map(skill => (
                        <span key={skill} className="px-2 py-0.5 bg-uc-primary/10 text-uc-primary text-xs font-semibold rounded-full">
                            {skill}
                        </span>
                    ))}
                </div>

                {isExpanded && (
                    <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 animate-fade-in">
                        <p>{job.description}</p>
                    </div>
                )}
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 flex items-center justify-between">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-sm font-semibold text-uc-primary hover:underline"
                >
                    {isExpanded ? 'Show Less' : 'View Details'}
                </button>
                <button
                    onClick={() => onApplyWithAgent(job)}
                    className="flex items-center space-x-2 px-4 py-2 bg-uc-secondary text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors shadow"
                >
                    <SparklesIcon className="w-4 h-4" />
                    <span className="text-sm">{t.applyWithAIAgent}</span>
                </button>
            </div>
        </div>
    );
};

export default JobCard;