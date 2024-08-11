'use client';

import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn, handleInput, handleKeyDown } from '@/lib/utils';

import { trpc } from '@/app/_trpc/client';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import { Applicant, Tricycle } from '@/types';
import { ApplicantFormSchema, TricycleSchema } from '@/types/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { TRPCError } from '@trpc/server';
import { Minus, Plus } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import TricycleDeleteDialog from '../../_components/TricycleDeleteDialog';
import ApplicantSpinner from '../../_components/ApplicantSpinner';


export default function UpdateApplicantPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const updateThisId = searchParams.get("id")
    const mode = searchParams.get("mode")
    const updateApplicant = trpc.updateApplicant.useMutation({});
    const { data, isLoading } = trpc.getApplicantById.useQuery(updateThisId ?? "");
    const getTricycleById = trpc.getTricycleById.useQuery(updateThisId ?? "");
    const deleteTricycle = trpc.deleteTricycle.useMutation({});
    const addTricycle = trpc.addTricycle.useMutation({});

    const applicantForm = useForm<Applicant>({
        resolver: zodResolver(ApplicantFormSchema),
        defaultValues: {
            applicationNo: '',
            applicationType: '',
            fullname: '',
            address: '',
            contactNo: '',
            licenseNo: '',
            applicationDate: new Date().toLocaleString(),
            driverName: '',
            driverLicenseNo: '',
        },
    });

    const newTricycle = useForm<Tricycle>({
        defaultValues: {
            makeOrBrand: '',
            engineNo: '',
            chassisNo: '',
            plateOrStickerNo: '',
            applicantId: updateThisId ?? '',
        },
        resolver: zodResolver(TricycleSchema),
    });

    const {
        formState: { errors },
        clearErrors,
    } = newTricycle;

    const { applicationType, fullname, licenseNo, driverName, driverLicenseNo } =
        applicantForm.watch();

    const { makeOrBrand, engineNo, chassisNo, plateOrStickerNo, applicantId } =
        newTricycle.watch();


    const [isDriverOperator, setIsDriverOperator] = useState<boolean>(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [selectedPlateNo, setSelectedPlateNo] = useState<string>("");


    const closeDeleteDialog = () => setOpenDeleteDialog(false);


    useEffect(() => {
        if (data?.exists) {
            const applicantData = data as Partial<Applicant>;
            Object.keys(applicantData).forEach((key) => {
                if (key !== 'exists') {
                    applicantForm.setValue(
                        key as keyof Applicant,
                        applicantData[key as keyof Applicant] || ''
                    );
                }
            });
        }
        if (applicationType === 'Driver/Operator') {
            setIsDriverOperator(true);
        } else {
            setIsDriverOperator(false);
        }
    }, [data, applicantForm]);


    useEffect(() => {
        if (applicationType === 'Driver/Operator') {
            applicantForm.setValue('driverName', fullname);
            applicantForm.setValue('driverLicenseNo', licenseNo);
            setIsDriverOperator(true);
        } else {
            setIsDriverOperator(false);
        }
    }, [applicationType, fullname, licenseNo, applicantForm]);

    useEffect(() => {
        if (makeOrBrand.length > 0) clearErrors('makeOrBrand');
        if (engineNo.length > 0) clearErrors('engineNo');
        if (chassisNo.length > 0) clearErrors('chassisNo');
        if (plateOrStickerNo.length > 0) clearErrors('plateOrStickerNo');
    }, [makeOrBrand, engineNo, chassisNo, plateOrStickerNo, clearErrors]);


    const routerBack = () => router.push('/dashboard/applicants');

    const removeTricycle = async (plateNo: string): Promise<void> => {
        try {
            const res = await deleteTricycle.mutateAsync({ plateNo });
            getTricycleById.refetch();

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
            toast({
                variant: 'destructive',
                title: 'Uh oh! Something went wrong.',
                description: 'An error occurred while deleting tricycle. Please try again later.',
            });
        }
    };

    const insertTricycle = async () => {
        try {
            newTricycle.trigger();
            const data = newTricycle.getValues();

            if (
                makeOrBrand.length > 0 &&
                engineNo.length > 0 &&
                plateOrStickerNo.length > 0 &&
                chassisNo.length > 0
            ) {
                newTricycle.setValue('applicantId', updateThisId ?? '');

                const res = await addTricycle.mutateAsync(data);

                toast({
                    title: 'Tricycle Added',
                    description: `The applicant (Plate No: ${res[0].plateNo}) has been successfully updated.`,
                });

                getTricycleById.refetch();
                newTricycle.reset();

            }
        } catch (error) {
            if (error instanceof TRPCError) {
                console.error('TRPC Error:', error.message);
            } else {
                console.error('Unexpected Error:', error);
            }
            toast({
                variant: 'destructive',
                title: 'Uh oh! Something went wrong.',
                description: 'An error occurred while adding tricycle. Please try again later.',
            });
        } finally {
            getTricycleById.refetch()
        }
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = applicantForm.getValues();
            const res = await updateApplicant.mutateAsync(data);

            toast({
                title: 'Applicant Updated',
                description: `The applicant (Applicant No: ${res[0].updatedId}) has been successfully updated.`,
            });

            routerBack();
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Uh oh! Something went wrong.',
                description: 'An error occurred while updating the applicant. Please try again later.',
            });
        }
    };

    if (isLoading) {
        return <ApplicantSpinner />
    }

    if (data?.exists === false) {
        return router.push("/dashboard/applicants")
    }

    switch (mode) {
        case "applicant":
            return (
                <Dialog onOpenChange={routerBack} defaultOpen>

                    <DialogContent className="sm:min-w-fit px-1 md:px-6 max-h-screen  md:max-h-[95vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className='sr-only'>
                                UPDATE APPLICANT
                            </DialogTitle>
                            <DialogDescription className='sr-only'>
                                UPDATE APPLICANT
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...applicantForm}>
                            <form
                                className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'
                            >
                                <div className='mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4'>
                                    <div className='flex items-center gap-4'>
                                        <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
                                            UPDATE APPLICANT
                                        </h1>
                                        <Badge variant='outline' className='ml-auto sm:ml-0'>
                                            {applicationType}
                                        </Badge>

                                    </div>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>
                                                Application Details
                                            </CardTitle>
                                            <CardDescription>
                                                Please fill in the following application
                                                details:
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent >
                                            <div className='grid md:grid-cols-4 lg:grid-cols-3 gap-6'>
                                                <FormField
                                                    control={applicantForm.control}
                                                    name='applicationType'
                                                    disabled={updateApplicant.isPending}
                                                    render={({ field }) => (
                                                        <FormItem className='flex flex-col col-span-2'>
                                                            <FormLabel htmlFor='applicationType'>
                                                                Application For{' '}
                                                            </FormLabel>
                                                            <Select
                                                                onValueChange={field.onChange}
                                                                defaultValue={field.value}
                                                            >
                                                                <SelectTrigger
                                                                    aria-label='Select type'
                                                                    id='applicationType'
                                                                >
                                                                    <SelectValue placeholder='Select type' />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value='Driver/Operator'>
                                                                        Driver / Operator
                                                                    </SelectItem>
                                                                    <SelectItem value='Operator'>
                                                                        Operator
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={applicantForm.control}
                                                    name='applicationDate'
                                                    render={({ field }) => (
                                                        <FormItem className='flex flex-col '>
                                                            <FormLabel htmlFor='applicationDate'>
                                                                Date
                                                            </FormLabel>
                                                            <Popover>
                                                                <PopoverTrigger asChild disabled={updateApplicant.isPending}>
                                                                    <FormControl id='applicationDate' className='max-w-full' >
                                                                        <Button
                                                                            variant={'outline'}
                                                                            className={cn(
                                                                                'w-[240px] pl-3 text-left font-normal',
                                                                                !field.value &&
                                                                                'text-muted-foreground'
                                                                            )}
                                                                        >
                                                                            {field.value ? (
                                                                                format(
                                                                                    field.value,
                                                                                    'PPP'
                                                                                )
                                                                            ) : (
                                                                                <span>
                                                                                    Pick a date
                                                                                </span>
                                                                            )}
                                                                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                                                        </Button>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent
                                                                    className='w-auto p-0'
                                                                    align='start'
                                                                >
                                                                    <Calendar
                                                                        mode='single'
                                                                        selected={
                                                                            field.value
                                                                                ? new Date(
                                                                                    field.value
                                                                                )
                                                                                : null
                                                                        }
                                                                        onSelect={(
                                                                            date:
                                                                                | Date
                                                                                | undefined
                                                                        ) => {
                                                                            if (date) {
                                                                                const dateString =
                                                                                    date.toLocaleDateString(
                                                                                        'en-CA'
                                                                                    );
                                                                                field.onChange(
                                                                                    dateString
                                                                                );
                                                                            }
                                                                        }}
                                                                        disabled={(
                                                                            date: Date
                                                                        ) =>
                                                                            date > new Date() ||
                                                                            date <
                                                                            new Date(
                                                                                '1900-01-01'
                                                                            )
                                                                        }
                                                                        initialFocus
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Personal Information</CardTitle>
                                            <CardDescription>
                                                Enter applicant&apos;s personal and contact
                                                information.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className='grid gap-6'>
                                                <FormField
                                                    control={applicantForm.control}
                                                    name='fullname'
                                                    disabled={updateApplicant.isPending}
                                                    render={({ field }) => (
                                                        <FormItem className='flex flex-col'>
                                                            <FormLabel htmlFor='fullname'>
                                                                Fullname{' '}
                                                                <span className='text-muted-foreground italic text-xs'>
                                                                    (First Name Middle Initial
                                                                    Last Name)
                                                                </span>
                                                            </FormLabel>
                                                            <Input
                                                                {...field}
                                                                autoComplete='off'
                                                                type='text'
                                                                id='fullname'
                                                                className='w-full'
                                                            />
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={applicantForm.control}
                                                    name='address'
                                                    disabled={updateApplicant.isPending}
                                                    render={({ field }) => (
                                                        <FormItem className='flex flex-col'>
                                                            <FormLabel htmlFor='address'>
                                                                Address{' '}
                                                                <span className='text-muted-foreground italic text-xs'>
                                                                    (No. Street, Barangay,
                                                                    Municipality, Province)
                                                                </span>
                                                            </FormLabel>
                                                            <Input
                                                                {...field}
                                                                autoComplete='off'
                                                                type='text'
                                                                id='address'
                                                                className='w-full'
                                                            />
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <div className='md:grid-cols-2 gap-6 grid pb-2'>
                                                    <FormField
                                                        control={applicantForm.control}
                                                        name='licenseNo'
                                                        disabled={updateApplicant.isPending}
                                                        render={({ field }) => (
                                                            <FormItem className='flex flex-col'>
                                                                <FormLabel htmlFor='licenseNo'>
                                                                    License No.
                                                                </FormLabel>
                                                                <Input
                                                                    {...field}
                                                                    autoComplete='off'
                                                                    type='text'
                                                                    id='licenseNo'
                                                                    className='w-full'
                                                                />
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={applicantForm.control}
                                                        name='contactNo'
                                                        disabled={updateApplicant.isPending}
                                                        render={({ field }) => (
                                                            <FormItem className='flex flex-col'>
                                                                <FormLabel htmlFor='contactNo'>
                                                                    Contact No.
                                                                </FormLabel>
                                                                <Input
                                                                    {...field}
                                                                    autoComplete='off'
                                                                    type='text'
                                                                    id='contactNo'
                                                                    maxLength={11}
                                                                    onInput={handleInput}
                                                                    onKeyDown={handleKeyDown}
                                                                    className='w-full'
                                                                />
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {!isDriverOperator && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Official Driver</CardTitle>
                                                <CardDescription>
                                                    Provide information about the official
                                                    driver.
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className='md:grid-cols-2 gap-6 grid pb-2'>
                                                    <FormField
                                                        control={applicantForm.control}
                                                        name='driverName'
                                                        disabled={updateApplicant.isPending}
                                                        render={({ field }) => (
                                                            <FormItem className='flex flex-col'>
                                                                <FormLabel>Fullname</FormLabel>
                                                                <Input
                                                                    {...field}
                                                                    type='text'
                                                                    className='w-full'
                                                                />
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={applicantForm.control}
                                                        name='driverLicenseNo'
                                                        disabled={updateApplicant.isPending}
                                                        render={({ field }) => (
                                                            <FormItem className='flex flex-col'>
                                                                <FormLabel>
                                                                    License No.
                                                                </FormLabel>
                                                                <Input
                                                                    {...field}
                                                                    type='text'
                                                                    className='w-full'
                                                                />
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                    <div className='flex items-center pt-4 justify-end gap-4'>
                                        <Button type='button' onClick={routerBack} variant='outline' size='sm'>
                                            Discard
                                        </Button>
                                        <Button type='submit' onClick={onSubmit} size='sm'>
                                            {updateApplicant.isPending ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            );

        case "tricycle":
            return (
                <Dialog onOpenChange={routerBack} open={true} defaultOpen>

                    <DialogContent className="sm:min-w-fit px-1 md:px-6 max-h-screen  md:max-h-[95vh] lg:max-h-screen overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className='sr-only'>
                                UPDATE APPLICANT
                            </DialogTitle>
                            <DialogDescription className='sr-only'>
                                UPDATE APPLICANT
                            </DialogDescription>
                        </DialogHeader>
                        <div className='flex items-center gap-4'>
                            <h1 className='flex-1 shrink-0 whitespace-nowrap uppercase text-xl font-semibold tracking-tight sm:grow-0'>
                                TRICYCLES
                            </h1>
                            <Badge variant='outline' className='ml-auto sm:ml-0'>
                                {fullname}
                            </Badge>

                        </div>
                        <Card className=' shadow-none'>
                            <CardHeader className='pb-3'>
                                <CardTitle>DRIVER INFORMATION</CardTitle>
                            </CardHeader>
                            <CardContent className='pt-0'>
                                <div>
                                    <p className='text-[15px] text-muted-foreground'>
                                        Name: {driverName}
                                    </p>

                                    <p className='text-[15px] text-muted-foreground'>

                                        License No: {driverLicenseNo}
                                    </p>

                                </div>
                            </CardContent>
                        </Card>
                        <Card className='shadow-none border-none'>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow className='hover:bg-transparent uppercase'>
                                            <TableHead className='w-40'>
                                                Make/Brand
                                            </TableHead>
                                            <TableHead>Engine No.</TableHead>
                                            <TableHead>Chasis No.</TableHead>
                                            <TableHead>Plate/Sticker No.</TableHead>
                                            <TableHead className='sr-only '>
                                                Action
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {getTricycleById.data?.map(
                                            ({ makeOrBrand, engineNo, chassisNo, plateOrStickerNo }) => {
                                                return (
                                                    <TableRow key={plateOrStickerNo}>
                                                        <TableCell className='font-semibold text-nowrap w-32'>
                                                            {makeOrBrand}
                                                        </TableCell>
                                                        <TableCell>{engineNo}</TableCell>
                                                        <TableCell>{chassisNo}</TableCell>
                                                        <TableCell>{plateOrStickerNo}</TableCell>
                                                        <TableCell className='w-28 flex justify-end'>
                                                            <Button
                                                                type='button'
                                                                variant='ghost'
                                                                onClick={() => {
                                                                    setSelectedPlateNo(plateOrStickerNo);
                                                                    setOpenDeleteDialog(true);
                                                                }}
                                                            >
                                                                <Minus size={20} className='text-destructive' />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            }
                                        )}

                                        <TricycleDeleteDialog
                                            id={selectedPlateNo}
                                            open={openDeleteDialog}
                                            onOpenChange={closeDeleteDialog}
                                            onDelete={removeTricycle}
                                            description={` This action cannot be undone. This will permanently delete tricycle data (Plate No: ${selectedPlateNo}) from our server.`}
                                        />
                                        <TableRow className='hover:bg-transparent'>
                                            <TableCell className='w-52'>
                                                <Label
                                                    htmlFor='makeOrBrand'
                                                    className='sr-only'
                                                >
                                                    Make/Brand
                                                </Label>
                                                <Input
                                                    {...newTricycle.register(
                                                        'makeOrBrand',
                                                        {
                                                            required: true,
                                                        }
                                                    )}
                                                    id='makeOrBrand'
                                                    placeholder='Enter plate/sticker no.'
                                                    className={
                                                        errors.makeOrBrand &&
                                                        'outline outline-1 animate-shake placeholder:text-destructive outline-destructive'
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Label
                                                    htmlFor='engineNo'
                                                    className='sr-only'
                                                >
                                                    Engine No.
                                                </Label>
                                                <Input
                                                    {...newTricycle.register(
                                                        'engineNo',
                                                        {
                                                            required: true,
                                                        }
                                                    )}
                                                    id='engineNo'
                                                    placeholder='Enter plate/sticker no.'
                                                    className={
                                                        errors.engineNo &&
                                                        'outline outline-1 animate-shake placeholder:text-destructive outline-destructive'
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Label
                                                    htmlFor='chassisNo'
                                                    className='sr-only'
                                                >
                                                    Chassis No.
                                                </Label>
                                                <Input
                                                    {...newTricycle.register(
                                                        'chassisNo',
                                                        {
                                                            required: true,
                                                        }
                                                    )}
                                                    id='chassisNo'
                                                    placeholder='Enter plate/sticker no.'
                                                    className={
                                                        errors.chassisNo &&
                                                        'outline outline-1 animate-shake placeholder:text-destructive outline-destructive'
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Label
                                                    htmlFor='plateOrStickerNo'
                                                    className='sr-only'
                                                >
                                                    Plate/Sticker No.
                                                </Label>
                                                <Input
                                                    {...newTricycle.register(
                                                        'plateOrStickerNo',
                                                        {
                                                            required: true,
                                                        }
                                                    )}
                                                    id='plateOrStickerNo'
                                                    placeholder='Enter plate/sticker no.'
                                                    className={
                                                        errors.plateOrStickerNo &&
                                                        'outline outline-1 animate-shake placeholder:text-destructive outline-destructive'
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell className='w-28 flex justify-end'>
                                                <Button
                                                    type='button'
                                                    variant='ghost'
                                                    onClick={insertTricycle}
                                                >
                                                    <Plus size={20} />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>

                            </CardContent>

                        </Card>
                        <div className='flex items-center pt-4 justify-center gap-4'>

                            <Button type='submit' className='w-full' onClick={routerBack} size='sm'>
                                Done
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )

        default:
            routerBack();
    }


}
