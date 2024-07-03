import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface Props {
    barangayList: string[];
}

export default function BarangayTable({ barangayList }: Props) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className='hidden sm:table-cell'>
                        Status
                    </TableHead>
                    <TableHead className='hidden sm:table-cell'>
                        No. of Registrants
                    </TableHead>
                    <TableHead className='hidden md:table-cell'>
                        Payment Status
                    </TableHead>
                    <TableHead className='text-right'>Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {barangayList?.map((barangay) => {
                    return (
                        <TableRow key={barangay}>
                            <TableCell>
                                <div className='font-medium py-2 capitalize'>
                                    {barangay}
                                </div>
                            </TableCell>
                            <TableCell className='hidden sm:table-cell'>
                                <Badge className='text-xs' variant='inProgress'>
                                    Not Started
                                </Badge>
                            </TableCell>
                            <TableCell className='hidden sm:table-cell'>
                                11
                            </TableCell>

                            <TableCell className='hidden md:table-cell'>
                                <Badge variant='secondary'>Secondary</Badge>
                            </TableCell>
                            <TableCell className='text-right'>₱1000</TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}
