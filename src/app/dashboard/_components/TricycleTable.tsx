import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tricycles } from '@/types';
import { MoreHorizontal } from 'lucide-react';
import TableRowLoader from './TableRowLoader';

interface Props {
    data: Tricycles[] | undefined;
    isLoading: boolean;
    pageSize: number;
}

const TricycleTable: React.FC<Props> = ({ data, isLoading, pageSize }) => {
    const TricycleRows = data?.map((t) => {
        return (
            <TableRow key={t.id}>
                <TableCell className='font-medium py-2 capitalize'>
                    {t.makeOrBrand}
                </TableCell>
                <TableCell className='hidden sm:table-cell'>
                    {t.engineNo}
                </TableCell>
                <TableCell className='hidden sm:table-cell'>
                    {t.chassisNo}
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                    {t.plateOrStickerNo}
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                    {t.driverName}
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                    {t.driverLicenseNo}
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                    {t.operator}
                </TableCell>
                <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                aria-haspopup='true'
                                size='icon'
                                variant='ghost'
                            >
                                <MoreHorizontal className='h-4 w-4' />
                                <span className='sr-only'>Toggle menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>
        );
    });

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Make/Brand</TableHead>
                    <TableHead className='hidden sm:table-cell'>
                        Engine No.
                    </TableHead>
                    <TableHead className='hidden sm:table-cell'>
                        Chassis No.
                    </TableHead>
                    <TableHead className='hidden md:table-cell'>
                        Plate/Sticker No.
                    </TableHead>
                    <TableHead className='hidden md:table-cell'>
                        Driver
                    </TableHead>
                    <TableHead className='hidden md:table-cell'>
                        License No.
                    </TableHead>
                    <TableHead className='hidden md:table-cell'>
                        Operator
                    </TableHead>
                    <TableHead className='sr-only'>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                    <TableRowLoader rowCount={pageSize} colCount={8} />
                ) : (
                    TricycleRows
                )}
            </TableBody>
        </Table>
    );
};

export default TricycleTable;
