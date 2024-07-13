import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { getFilterStatusByValue } from '@/config/data/filterOptions';
import { getPaymentStatusLabel } from '@/config/data/paymentStatuses';
import Barangay from '@/types/Barangay';

interface Props {
    barangayLists: Barangay[] | undefined;
}

export default function BarangayTable({ barangayLists }: Props) {
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
                {barangayLists?.map(
                    ({
                        id,
                        name,
                        status,
                        paymentStatus,
                        noOfRegistrants,
                        amount,
                    }) => {
                        return (
                            <TableRow key={id}>
                                <TableCell>
                                    <div className='font-medium py-2 capitalize'>
                                        {name}
                                    </div>
                                </TableCell>
                                <TableCell className='hidden sm:table-cell'>
                                    <Badge className='text-xs' variant={status}>
                                        {getFilterStatusByValue(status)}
                                    </Badge>
                                </TableCell>
                                <TableCell className='hidden sm:table-cell'>
                                    {noOfRegistrants}
                                </TableCell>
                                <TableCell className='hidden md:table-cell'>
                                    <Badge
                                        variant={paymentStatus}
                                        className='uppercase font-semibold px-0'
                                    >
                                        {getPaymentStatusLabel(paymentStatus)}
                                    </Badge>
                                </TableCell>
                                <TableCell className='text-right'>
                                    ₱{amount}
                                </TableCell>
                            </TableRow>
                        );
                    }
                )}
            </TableBody>
        </Table>
    );
}
