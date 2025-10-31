
import React from 'react';

interface SectionHeaderProps {
    title: string;
    isSubheading?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, isSubheading = false }) => {
    const Tag = isSubheading ? 'h2' : 'h2';
    const textSize = isSubheading ? 'text-xl' : 'text-2xl';

    return (
        <Tag className={`${textSize} font-bold text-uc-secondary dark:text-gray-100 px-4 md:px-0`}>
            {title}
        </Tag>
    );
};

// Adjusted the detail page usage to reflect the consistent SectionHeader usage
const ProductDetailPageSectionHeader: React.FC<{ title: string }> = ({ title }) => (
     <h2 className="text-xl font-bold text-uc-secondary dark:text-gray-100">{title}</h2>
);


export default SectionHeader;