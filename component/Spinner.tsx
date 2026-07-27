import React from 'react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    fullScreen?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', fullScreen = false }) => {
    const sizeClasses = {
        sm: 'h-16 w-16 border-t-2 border-b-2',
        md: 'h-32 w-32 border-t-2 border-b-2',
        lg: 'h-48 w-48 border-t-4 border-b-4',
    };

    const spinnerElement = (
        <div
            className={`animate-spin rounded-full border-green-500 ${sizeClasses[size]}`}
        ></div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-75 flex justify-center items-center z-50">
                {spinnerElement}
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center py-10">
            {spinnerElement}
        </div>
    );
};

export default Spinner;