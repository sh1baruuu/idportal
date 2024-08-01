'use client';

import { trpc } from '@/app/_trpc/client';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useRouter, useSearchParams } from 'next/navigation';
import ApplicantSpinner from '../../_components/ApplicantSpinner';


export default function ViewApplicantPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const updateThisId = searchParams.get("id")
    const view = searchParams.get("view")
    const { data, isLoading } = trpc.viewApplicantById.useQuery(updateThisId ?? "");
    const getTricycleById = trpc.getTricycleById.useQuery(updateThisId ?? "");

    const routerBack = () => router.push('/dashboard/applicants');

    const {
        applicationNo,
        applicationType,
        fullname,
        address,
        contactNo,
        licenseNo,
        applicationDate,
        driverName,
        driverLicenseNo
    } = data ?? {};

    if (isLoading) {
        return <ApplicantSpinner />
    }

    if (view !== "true") {
        return router.push("/dashboard/applicants")
    }

    return (
        <Dialog onOpenChange={routerBack} defaultOpen>

            <DialogContent className="sm:min-w-fit px-1 md:px-6 max-h-screen md:max-h-[95vh] lg:max-h-screen overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className='sr-only'>
                        VIEW APPLICANT
                    </DialogTitle>
                    <DialogDescription className='sr-only'>
                        VIEW APPLICANT
                    </DialogDescription>
                </DialogHeader>

                <div
                    className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'
                >
                    <div className='mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4'>
                        <div className='flex items-center gap-4 pb-4'>
                            <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-extrabold tracking-wide sm:grow-0'>
                                APPLICANT
                            </h1>
                            <Badge variant='outline' className='ml-auto sm:ml-0'>
                                #{applicationNo}
                            </Badge>

                        </div>
                        <Card className='min-w-[50vw] lg:min-w-[35vw] border-t shadow-none border-x-0 rounded-none border-b-0'>
                            <CardHeader>
                                <CardTitle className='font-bold'>
                                    Application Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='pb-0'>
                                <div className='grid md:grid-cols-4 lg:grid-cols-3 gap-6'>

                                    <div className='flex flex-col col-span-2'>
                                        <Label htmlFor='applicationType'>
                                            Application Type:
                                        </Label>
                                        <p className='text-muted-foreground py-2 text-sm'>{applicationType}</p>
                                    </div>
                                    <div className='flex flex-col '>
                                        <Label htmlFor='applicationDate'>
                                            Date:
                                        </Label>
                                        <p className='text-muted-foreground py-2 text-sm'>{applicationDate}</p>

                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className='border-t shadow-none border-x-0 rounded-none border-b-0'>
                            <CardHeader>
                                <CardTitle className='font-bold'>Personal Information</CardTitle>

                            </CardHeader>
                            <CardContent className='pb-0'>
                                <div className='grid gap-6'>
                                    <div className='flex flex-col'>
                                        <Label htmlFor='fullname'>
                                            Fullname
                                        </Label>
                                        <p className='text-muted-foreground py-2 text-sm'>{fullname}</p>
                                    </div>
                                    <div className='flex flex-col'>
                                        <Label htmlFor='address'>
                                            Address
                                        </Label>
                                        <p className='text-muted-foreground py-2 text-sm'>{address}</p>
                                    </div>
                                    <div className='md:grid-cols-2 gap-6 grid pb-2'>
                                        <div className='flex flex-col'>
                                            <Label htmlFor='licenseNo'>
                                                License No.
                                            </Label>
                                            <p className='text-muted-foreground py-2 text-sm'>{licenseNo}</p>
                                        </div>
                                        <div className='flex flex-col'>
                                            <Label htmlFor='contactNo'>
                                                Contact No.
                                            </Label>
                                            <p className='text-muted-foreground py-2 text-sm'>{contactNo}</p>

                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        {data?.applicationType == "Operator" && (
                            <Card className='border-t shadow-none border-x-0 rounded-none border-b-0'>
                                <CardHeader>
                                    <CardTitle className='font-bold'>Official Driver</CardTitle>
                                </CardHeader>
                                <CardContent className='pb-0'>
                                    <div className='md:grid-cols-2 gap-6 grid pb-2'>
                                        <div className='flex flex-col'>
                                            <Label>Fullname</Label>
                                            <p className='text-muted-foreground py-2 text-sm'>{driverName}</p>
                                        </div>
                                        <div className='flex flex-col'>
                                            <Label>
                                                License No.
                                            </Label>
                                            <p className='text-muted-foreground py-2 text-sm'>{driverLicenseNo}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                        <Card className='border-t shadow-none border-x-0 rounded-none border-b-0'>
                            <CardHeader>
                                <CardTitle className='font-bold'>Tricycles</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {getTricycleById?.data && getTricycleById.data.length > 0 ? <Table>
                                    <TableHeader>
                                        <TableRow className='hover:bg-transparent'>
                                            <TableHead className='w-40 text-foreground font-bold'>
                                                Make/Brand
                                            </TableHead>
                                            <TableHead className='text-foreground font-bold'>Engine No.</TableHead>
                                            <TableHead className='text-foreground font-bold'>Chasis No.</TableHead>
                                            <TableHead className='text-right text-foreground font-bold'>Plate/Sticker No.</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {getTricycleById.data?.map(
                                            (
                                                {
                                                    makeOrBrand,
                                                    engineNo,
                                                    chassisNo,
                                                    plateOrStickerNo,
                                                },
                                                i
                                            ) => {
                                                return (
                                                    <TableRow key={i} className='hover:bg-transparent'>
                                                        <TableCell className='text-muted-foreground font-medium text-nowrap w-32'>
                                                            {makeOrBrand}
                                                        </TableCell>
                                                        <TableCell className='text-muted-foreground font-medium'>
                                                            {engineNo}
                                                        </TableCell>
                                                        <TableCell className='text-muted-foreground font-medium'>
                                                            {chassisNo}
                                                        </TableCell>
                                                        <TableCell className='text-right text-muted-foreground font-medium'>
                                                            {plateOrStickerNo}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            }
                                        )}
                                    </TableBody>
                                </Table> : <div>No data to display</div>}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );

}
