import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { filterOptions } from '@/config/data/filterOptions';
import { ListFilter } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

interface Props {
    selectedFilter: string;
    setSelectedFilter: Dispatch<SetStateAction<string>>;
}

export default function FilterDropdownMenu({selectedFilter, setSelectedFilter}: Props) {
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant='outline'
                    size='sm'
                    className='h-7 gap-1 text-sm'
                >
                    <ListFilter className='h-3.5 w-3.5' />
                    <span className='sr-only sm:not-sr-only'>Filter</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                    onClick={() => setSelectedFilter('')}
                    checked={'' === selectedFilter}
                >
                    All
                </DropdownMenuCheckboxItem>
                {filterOptions?.map(({ status }) => {
                    return (
                        <DropdownMenuCheckboxItem
                            key={status}
                            onClick={() => setSelectedFilter(status)}
                            checked={status === selectedFilter}
                        >
                            {status}
                        </DropdownMenuCheckboxItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
