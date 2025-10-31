import React, { useState, useMemo } from 'react';
import { Job } from '../../types';
import { useTranslations } from '../../hooks/useTranslations';
import JobCard from '../jobs/JobCard';
import AIJobAgentModal from '../jobs/AIJobAgentModal';

interface JobNexusPageProps {
    jobs: Job[];
}

const JobNexusPage: React.FC<JobNexusPageProps> = ({ jobs }) => {
    const t = useTranslations();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    const filteredJobs = useMemo(() => {
        if (!searchTerm) {
            return jobs;
        }
        const lowercasedTerm = searchTerm.toLowerCase();
        return jobs.filter(job =>
            job.title.toLowerCase().includes(lowercasedTerm) ||
            job.company.toLowerCase().includes(lowercasedTerm) ||
            job.skills.some(skill => skill.toLowerCase().includes(lowercasedTerm))
        );
    }, [jobs, searchTerm]);

    const handleApplyWithAgent = (job: Job) => {
        setSelectedJob(job);
    };

    return (
        <>
            <div className="p-4 space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-uc-secondary dark:text-white">{t.jobNexus}</h1>
                    <p className="text-md text-gray-500 dark:text-gray-400 mt-1">{t.jobNexusSubtitle}</p>
                </div>

                <div className="relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t.searchJobsPlaceholder}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-uc-primary focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-uc-text dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-400"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map(job => (
                            <JobCard key={job.id} job={job} onApplyWithAgent={handleApplyWithAgent} />
                        ))
                    ) : (
                         <div className="text-center py-10">
                            <p className="text-uc-text dark:text-gray-400">{t.noResultsFound}</p>
                        </div>
                    )}
                </div>
            </div>
            
            {selectedJob && (
                <AIJobAgentModal
                    isOpen={!!selectedJob}
                    onClose={() => setSelectedJob(null)}
                    job={selectedJob}
                />
            )}
        </>
    );
};

export default JobNexusPage;