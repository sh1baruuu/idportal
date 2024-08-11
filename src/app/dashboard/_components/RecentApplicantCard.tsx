"use client";

import { trpc } from "@/app/_trpc/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import EmptyRecentApplicant from "./EmptyRecentApplicant";
import Loader from "./Loader";
import TableRowLoader from "./TableRowLoader";


const RecentApplicantCard = () => {
    const { data, refetch, isLoading } = trpc.getRecentApplicants.useQuery();

    useEffect(() => {
        refetch()
    }, [])

    const dataExist = data && data.length > 0;

    return (
        <Card className='xl:col-span-2 hidden md:block'>
            <CardHeader className='flex flex-row items-center'>
                <div className='grid gap-2'>
                    <CardTitle>Applicants</CardTitle>
                    <CardDescription>
                       {!dataExist && "No "} Recent applicants from portal.
                    </CardDescription>
                </div>
                <Button asChild size='sm' className='ml-auto gap-1'>
                    {dataExist && <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/applicants`}>
                        View All
                        <ArrowUpRight className='h-4 w-4' />
                    </Link>}
                </Button>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        {!isLoading && dataExist && <TableRow>
                            <TableHead>Applicant</TableHead>
                            <TableHead>License No.</TableHead>
                            <TableHead>Applicantion Type</TableHead>
                            <TableHead>Application Date</TableHead>
                        </TableRow>}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? <TableRowLoader colCount={4} rowCount={5} /> : 
                            data?.map(({ applicationNo, address, fullname, licenseNo, applicationDate, applicationType }) => {
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
                        {!isLoading && !dataExist && <EmptyRecentApplicant />}
            </CardContent>
        </Card>
    )
}

export default RecentApplicantCard