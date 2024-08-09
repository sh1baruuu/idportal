import { LoaderCircle } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils'; 

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const Loader: React.FC<Props> = ({ className, ...props }) => {
    return (
        <div 
            className={cn('flex items-center justify-center h-[80vh]', className)} 
            {...props}
        >
            <LoaderCircle className='animate-spin' />
        </div>
    );
};

export default Loader;
