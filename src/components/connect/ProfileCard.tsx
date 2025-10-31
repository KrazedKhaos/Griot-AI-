import React, { useState } from 'react';
import { DatingProfile } from '../../types';

interface ProfileCardProps {
    profile: DatingProfile;
    onSwipe: (profile: DatingProfile, action: 'like' | 'pass') => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onSwipe }) => {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    const nextPhoto = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentPhotoIndex(prev => (prev + 1) % profile.photos.length);
    };

    const prevPhoto = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentPhotoIndex(prev => (prev - 1 + profile.photos.length) % profile.photos.length);
    };

    return (
        <div className="relative w-full max-w-sm h-[70vh] max-h-[500px] bg-gray-200 dark:bg-gray-700 rounded-2xl shadow-xl overflow-hidden flex flex-col">
            {/* Photos */}
            <div className="absolute inset-0">
                <img src={profile.photos[currentPhotoIndex]} alt={profile.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            </div>

            {/* Photo Navigation */}
            {profile.photos.length > 1 && (
                <div className="absolute top-2 left-2 right-2 h-1 flex space-x-1">
                    {profile.photos.map((_, index) => (
                        <div key={index} className={`flex-1 h-full rounded-full ${index === currentPhotoIndex ? 'bg-white/90' : 'bg-white/40'}`}></div>
                    ))}
                </div>
            )}
            <div className="absolute inset-0 flex justify-between">
                <div className="w-1/3 h-full" onClick={prevPhoto}></div>
                <div className="w-1/3 h-full" onClick={nextPhoto}></div>
            </div>

            {/* Info */}
            <div className="relative mt-auto p-4 text-white z-10">
                <h2 className="text-3xl font-bold">{profile.name}, <span className="font-light">{profile.age}</span></h2>
                <p className="mt-1 text-sm leading-relaxed">{profile.bio}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                    {profile.interests.map(interest => (
                        <span key={interest} className="px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
                            {interest}
                        </span>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="relative flex justify-center items-center space-x-8 py-4 z-10">
                <button onClick={() => onSwipe(profile, 'pass')} className="p-4 bg-white/20 rounded-full backdrop-blur-md text-yellow-400 hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </button>
                 <button onClick={() => onSwipe(profile, 'like')} className="p-5 bg-white/20 rounded-full backdrop-blur-md text-red-500 hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                </button>
            </div>
        </div>
    );
};

export default ProfileCard;