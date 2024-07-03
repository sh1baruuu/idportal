import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { sortOptions } from '@/config/data/sortOptions';
import { ArrowDownAZ, ArrowDownZA } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

interface Props {
    selectedSort: string;
    setSelectedSort: Dispatch<SetStateAction<string>>;
}

export default function SortDropdownMenu({selectedSort, setSelectedSort}: Props) {
    
    return (
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button
                variant='outline'
                size='sm'
                className='h-7 gap-1 text-sm'
            >
                {'AZ' === selectedSort ? (
                    <ArrowDownAZ className='h-3.5 w-3.5' />
                ) : (
                    <ArrowDownZA className='h-3.5 w-3.5' />
                )}
                <span className='sr-only sm:not-sr-only'>
                    Sort
                </span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
            <DropdownMenuLabel>
                Sort by
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {sortOptions?.map(({ label, value }) => {
                return (
                    <DropdownMenuCheckboxItem
                        key={value}
                        onClick={() =>
                            setSelectedSort(value)
                        }
                        checked={value === selectedSort}
                    >
                        {label}
                    </DropdownMenuCheckboxItem>
                );
            })}
        </DropdownMenuContent>
    </DropdownMenu>
    );
}
