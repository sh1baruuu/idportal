import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SortOptions } from '@/types';
import {
    ArrowDown10,
    ArrowDownAZ,
    ArrowDownZA
} from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

interface Props {
    sort: string;
    sortBy: Dispatch<SetStateAction<string>>;
}

const sortOptions: SortOptions[] = [
    { label: 'None', value: '' },
    { label: 'A to Z', value: 'ASC' },
    { label: 'Z to A', value: 'DESC' },
];

export default function SortDropdownMenu({ sort, sortBy }: Props) {

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant='outline'
                    size='sm'
                    className='h-7 gap-1 text-sm'
                >
                    {' '}
                    {sort === '' ? (
                        <ArrowDown10 className='h-3.5 w-3.5' />
                    ) : 'ASC' === sort ? (
                        <ArrowDownAZ className='h-3.5 w-3.5' />
                    ) : (
                        <ArrowDownZA className='h-3.5 w-3.5' />
                    )}
                    <span className='sr-only sm:not-sr-only'>Sort</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {sortOptions?.map(({ label, value }) => {
                    return (
                        <DropdownMenuCheckboxItem
                            key={value}
                            onClick={() => sortBy(value)}
                            checked={value === sort}
                        >
                            {label}
                        </DropdownMenuCheckboxItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
