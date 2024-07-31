"use client";

import { trpc } from "@/app/_trpc/client";
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"


const DashboardApplicantTable = () => {
    const { data, isLoading } = trpc.getRecentApplicants.useQuery()

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>License No.</TableHead>
                    <TableHead>Applicantion Type</TableHead>
                    <TableHead>Application Date</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    data?.map(({applicationNo, address, fullname, licenseNo, applicationDate, applicationType}) => {
                        return (
                            <TableRow key={applicationNo}>
                                <TableCell>
                                    <div className='font-medium'>
                                        {fullname}
                                    </div>
                                    <div className='hidden text-sm text-muted-foreground md:inline'>
                                        {address}
                                    </div>
                                </TableCell>
                                <TableCell>{licenseNo}</TableCell>
                                <TableCell>
                                    <Badge
                                        className='text-xs'
                                        variant='outline'
                                    >
                                        {applicationType}
                                    </Badge>
                                </TableCell>
                                <TableCell>{applicationDate}</TableCell>
                            </TableRow>
                        )
                    })
                }

            </TableBody>
        </Table>
    )
}

export default DashboardApplicantTable