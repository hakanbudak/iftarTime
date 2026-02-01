import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
}

const GlassCard = ({ children, className = '' }: GlassCardProps) => {
    return (
        <div className={`glass-card rounded-2xl p-6 shadow-xl ${className}`}>
            {children}
        </div>
    );
};

export default GlassCard;
