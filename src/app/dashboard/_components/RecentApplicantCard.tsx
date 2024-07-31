"use client";

import { trpc } from "@/app/_trpc/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";


const RecentApplicantCard = () => {
    const { data, refetch } = trpc.getRecentApplicants.useQuery();

    useEffect(() => {
        refetch()
    }, [])

    return (
        <Card className='xl:col-span-2'>
            <CardHeader className='flex flex-row items-center'>
                <div className='grid gap-2'>
                    <CardTitle>Applicants</CardTitle>
                    <CardDescription>
                        Recent applicants from portal.
                    </CardDescription>
                </div>
                <Button asChild size='sm' className='ml-auto gap-1'>
                    <Link href='http://localhost:3000/dashboard/applicants'>
                        View All
                        <ArrowUpRight className='h-4 w-4' />
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
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
            </CardContent>
        </Card>
    )
}

export default RecentApplicantCard