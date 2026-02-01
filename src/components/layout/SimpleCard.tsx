import React from 'react';

interface SimpleCardProps {
    children: React.ReactNode;
    className?: string;
}

const SimpleCard = ({ children, className = '' }: SimpleCardProps) => {
    return (
        <div className={`card-minimal p-6 ${className}`}>
            {children}
        </div>
    );
};

export default SimpleCard;
