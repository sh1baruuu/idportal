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

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { TRPCError } from '@trpc/server';
import { toast } from '@/components/ui/use-toast';
import { trpc } from '@/app/_trpc/client';
import DeleteDialog from './DeleteDialog';

interface Props {
    data: Tricycles[] | undefined;
    isLoading: boolean;
    pageSize: number;
    refetch: () => void;
}

const TricycleTable: React.FC<Props> = ({
    data,
    isLoading,
    pageSize,
    refetch,
}) => {
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const closeDialog = () => setOpenDialog(false);

    const { mutateAsync, isPending } = trpc.deleteTricycle.useMutation({});

    const deleteTricycle = async (plateNo: string): Promise<void> => {
        try {
            const res = await mutateAsync({ plateNo });
            refetch();

            toast({
                title: 'Tricycle Deleted',
                description: `The tricycle data (Plate No: ${res[0].plateNo}) has been successfully deleted.`,
            });

        } catch (error) {
            if (error instanceof TRPCError) {
                console.error('TRPC Error:', error.message);
            } else {
                console.error('Unexpected Error:', error);
            }
        }
    };

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
                            <DropdownMenuItem
                                onClick={() => setOpenDialog(true)}
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DeleteDialog
                        id={t.plateOrStickerNo}
                        open={openDialog}
                        onOpenChange={closeDialog}
                        onDelete={deleteTricycle}
                        description={` This action cannot be undone. This will
                                    permanently delete tricycle data (Plate No:
                                    ${t.plateOrStickerNo}) from our server.`}
                    />
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
