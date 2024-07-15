import { MoreHorizontal } from 'lucide-react';

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
import { Badge } from '@/components/ui/badge';

export interface Applicant {
    applicationNo: string;
    fullname: string;
    address: string;
    licenseNo: string | null;
    applicationType: string;
    applicationDate: string;
    ownedTricycles: number;
}

interface Props {
    data: Applicant[] | undefined;
}

const ApplicantTable: React.FC<Props> = ({ data }) => {

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Fullname</TableHead>
                    <TableHead className='hidden md:table-cell'>
                        Address
                    </TableHead>
                    <TableHead className='hidden md:table-cell'>
                        License No.
                    </TableHead>
                    <TableHead className='hidden md:table-cell'>
                        Application Type
                    </TableHead>
                    <TableHead className='hidden md:table-cell'>
                        Tricycle
                    </TableHead>
                    <TableHead>
                        <span className='sr-only'>Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data?.map((r) => (
                    <TableRow key={r.applicationNo}>
                        <TableCell className='font-semibold uppercase'>
                            {r.fullname}
                        </TableCell>
                        <TableCell>{r.address}</TableCell>
                        <TableCell>
                            <Badge variant='outline'>{r.licenseNo}</Badge>
                        </TableCell>
                        <TableCell className='hidden md:table-cell'>
                            {r.applicationType}
                        </TableCell>
                        <TableCell>
                            <p>{r.ownedTricycles}</p>
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
                                        <span className='sr-only'>
                                            Toggle menu
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end'>
                                    <DropdownMenuLabel>
                                        Actions
                                    </DropdownMenuLabel>
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                    <DropdownMenuItem>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default ApplicantTable;
