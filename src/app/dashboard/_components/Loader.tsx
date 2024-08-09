import { LoaderCircle } from 'lucide-react'
import React from 'react'

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const Loader: React.FC<Props> = ({ ...props }) => {
    return (
        <div className='flex items-center justify-center h-[80vh]' {...props}><LoaderCircle className='animate-spin' /></div>
    )
}

export default Loader;
