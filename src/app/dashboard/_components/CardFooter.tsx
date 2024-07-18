import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

interface Props {
    start: number;
    end: number;
    total: number | undefined;
    setPage: Dispatch<SetStateAction<number>>;
    isFirstPage: boolean | undefined;
    hasNextPage: boolean | undefined;
    name: string;
}

const CardCustomFooter: React.FC<Props> = ({
    start,
    end,
    total,
    setPage,
    hasNextPage,
    isFirstPage,
    name,
}) => {
    const getNextPage = (): void => {
        setPage((page: number) => ++page);
    };

    const getPreviousPage = (): void => {
        setPage((page: number) => --page);
    };

    if (total == 0) return;

    return (
        <CardFooter >
            <div className='text-xs text-muted-foreground'>
                Showing{' '}
                <strong>
                    {start}-{end}
                </strong>{' '}
                of <strong>{total}</strong> {name}
            </div>
            <div className='ml-10 flex gap-3'>
                <Button
                    size='icon'
                    variant='outline'
                    onClick={getPreviousPage}
                    disabled={isFirstPage}
                    className='h-7 w-7'
                >
                    <ChevronLeft className='h-5 w-5' />
                    <span className='sr-only'>Previous Order</span>
                </Button>
                <Button
                    size='icon'
                    variant='outline'
                    onClick={getNextPage}
                    disabled={hasNextPage}
                    className='h-7 w-7'
                >
                    <ChevronRight className='h-5 w-5' />
                    <span className='sr-only'>Next Order</span>
                </Button>
            </div>
        </CardFooter>
    );
};

export default CardCustomFooter;
