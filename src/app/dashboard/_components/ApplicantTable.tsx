import { MoreHorizontal } from 'lucide-react';
import { trpc } from '@/app/_trpc/client';
import { Badge } from '@/components/ui/badge';
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
import { TRPCError } from '@trpc/server';
import TableRowLoader from './TableRowLoader';
import { toast } from '@/components/ui/use-toast';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useState } from 'react';
import ApplicantDeleteDialog from './ApplicantDeleteDialog';

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
    isLoading: boolean;
    pageSize: number;
    refetch: () => void;
    router: AppRouterInstance;
}

const ApplicantTable: React.FC<Props> = (props) => {
    const { data, isLoading, pageSize, refetch, router } = props;
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [selectedApplicantNo, setSelectedApplicantNo] = useState<string>('');
    const [selectedFullname, setSelectedFullname] = useState<string>('');

    const { mutateAsync } = trpc.deleteApplicant.useMutation({});

    const closeDialog = () => setOpenDialog(false);

    const deleteApplicant = async (applicantId: string, fullname: string): Promise<void> => {
        try {
            const res = await mutateAsync({ applicantId, fullname });
            const [data] = res[1];
            refetch();

            toast({
                title: 'Applicant Deleted',
                description: `The applicant data (Applicant No: ${data.id}) has been successfully deleted.`,
            });
        } catch (error) {
            if (error instanceof TRPCError) {
                console.error('TRPC Error:', error.message);
            } else {
                console.error('Unexpected Error:', error);
            }
        }
    };

    const ApplicantRows = data?.map((r) => (
        <TableRow
            key={r.applicationNo}
            className='cursor-pointer'
            onDoubleClick={() => router.push(`applicants/view?id=${r.applicationNo}&view=true`)}
        >
            <TableCell className='font-semibold uppercase'>{r.fullname}</TableCell>
            <TableCell className='hidden md:table-cell'>{r.address}</TableCell>
            <TableCell className='hidden md:table-cell'>{r.licenseNo}</TableCell>
            <TableCell className='hidden md:table-cell'>
                <Badge variant='outline'>{r.applicationType}</Badge>
            </TableCell>
            <TableCell className='hidden md:table-cell'>
                <p>{r.ownedTricycles}</p>
            </TableCell>
            <TableCell>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button aria-haspopup='true' size='icon' variant='ghost'>
                            <MoreHorizontal className='h-4 w-4' />
                            <span className='sr-only'>Toggle menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => router.push(`applicants/view?id=${r.applicationNo}&view=true`)}>
                            View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`applicants/update?id=${r.applicationNo}&mode=applicant`)}>
                            Update
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`applicants/update?id=${r.applicationNo}&mode=tricycle`)}>
                            Tricycles
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                setSelectedApplicantNo(r.applicationNo);
                                setSelectedFullname(r.fullname);
                                setOpenDialog(true);
                            }}
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <ApplicantDeleteDialog
                    id={selectedApplicantNo}
                    open={openDialog}
                    name={selectedFullname}
                    onOpenChange={closeDialog}
                    onDelete={deleteApplicant}
                    description={`This action cannot be undone. This will permanently delete applicant data (Applicant No: ${selectedApplicantNo}) from our server.`}
                />
            </TableCell>
        </TableRow>
    ));

    return (
        <Table>
            <TableHeader>
                <TableRow className='hover:bg-transparent'>
                    <TableHead>Fullname</TableHead>
                    <TableHead className='hidden md:table-cell'>Address</TableHead>
                    <TableHead className='hidden md:table-cell'>License No.</TableHead>
                    <TableHead className='hidden md:table-cell'>Application Type</TableHead>
                    <TableHead className='hidden md:table-cell'>Tricycle</TableHead>
                    <TableHead>
                        <span className='sr-only'>Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                    <TableRowLoader rowCount={pageSize} colCount={6} />
                ) : (
                    ApplicantRows
                )}
            </TableBody>
        </Table>
    );
};

export default ApplicantTable;
