import { cn } from '@/lib/utils';
import { CircleAlert } from 'lucide-react';
import React from 'react';

interface Props { 
    message?: string; 
}

const CustomInputMessage: React.FC<Props> = ({ message }) => {
    return (
        <span className="flex gap-1 pt-1 items-center">
            <CircleAlert className="text-destructive animate-shake" size={11} />
            <p
                className={cn("text-[0.7rem] font-medium text-destructive")}

            >
                {message}
            </p>
        </span>
    )
}

export default CustomInputMessage;
