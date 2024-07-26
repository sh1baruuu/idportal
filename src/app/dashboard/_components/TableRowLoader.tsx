import { Skeleton } from '@/components/ui/skeleton';
import { TableRow, TableCell } from '@/components/ui/table';

interface Props {
    colCount: number;
    rowCount: number;
}

const TableRowLoader: React.FC<Props> = ({ colCount, rowCount }) => {
    const col = Array(colCount).fill(0);
    const row = Array(rowCount).fill(0);
    
    return (
        <>
            {row.map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                    {col.map((_, colIndex) => (
                        <TableCell key={colIndex} className='font-semibold uppercase'>
                            <Skeleton className='h-4 my-2 w-full' />
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    );
};

export default TableRowLoader;
