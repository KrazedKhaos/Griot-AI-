import React from 'react';

interface SectionHeaderProps {
    title: string;
    isSubheading?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, isSubheading = false }) => {
    const Tag = isSubheading ? 'h2' : 'h2';
    const textSize = isSubheading ? 'text-xl' : 'text-2xl';

    return (
        <Tag className={`${textSize} font-bold text-uc-secondary dark:text-gray-100`}>
            {title}
        </Tag>
    );
};

export default SectionHeader;