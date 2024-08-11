'use client';

import { ChevronLeft, Minus, PlusCircle } from 'lucide-react';

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
import { z } from 'zod';

import { trpc } from '@/app/_trpc/client';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import { ApplicantForm, Tricycle } from '@/types';
import { ApplicantFormSchema, TricycleSchema } from '@/types/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { customAlphabet } from 'nanoid';

export default function AddRegistrantPage() {
    const router = useRouter();
    const countApplicant = trpc.countApplicant.useQuery();
    const addApplicant = trpc.addApplicant.useMutation({});

    const applicantForm = useForm<ApplicantForm>({
        defaultValues: {
            applicationNo: '',
            applicationType: 'Driver/Operator',
            fullname: '',
            address: '',
            contactNo: '',
            licenseNo: '',
            applicationDate: new Date().toLocaleString(),
            tricycles: [],
            driverName: '',
            driverLicenseNo: '',
        },
        resolver: zodResolver(ApplicantFormSchema),
    });

    const newTricycle = useForm<Tricycle>({
        defaultValues: {
            makeOrBrand: '',
            engineNo: '',
            chassisNo: '',
            plateOrStickerNo: '',
            applicantId: '',
        },
        resolver: zodResolver(TricycleSchema),
    });

    const { applicationNo, applicationType, fullname, licenseNo, tricycles } =
        applicantForm.watch();

    const { makeOrBrand, engineNo, chassisNo, plateOrStickerNo, applicantId } =
        newTricycle.watch();

    const { append, fields, remove } = useFieldArray({
        control: applicantForm.control,
        name: 'tricycles',
    });

    const [isDriverOperator, setIsDriverOperator] = useState<boolean>(false);

    const {
        formState: { errors },
        clearErrors,
    } = newTricycle;

    useEffect(() => {
        newTricycle.setValue('applicantId', applicationNo);
    }, [applicationNo, applicationType]);

    useEffect(() => {
        const uaid = (): string => {
            const nanoid = customAlphabet('1234567890', 10);

            return `${nanoid()}`;
        };
        if (countApplicant.data) {
            applicantForm.setValue('applicationNo', uaid());
        }
    }, [countApplicant.data]);

    useEffect(() => {
        if (applicationType === 'Driver/Operator') {
            applicantForm.setValue('driverName', fullname);
            applicantForm.setValue('driverLicenseNo', licenseNo);
            setIsDriverOperator(true);
        } else {
            applicantForm.setValue('driverName', '');
            applicantForm.setValue('driverLicenseNo', '');
            setIsDriverOperator(false);
        }
    }, [applicationType, fullname, licenseNo, applicantForm, tricycles]);

    useEffect(() => {
        if (makeOrBrand.length > 0) clearErrors('makeOrBrand');
        if (engineNo.length > 0) clearErrors('engineNo');
        if (chassisNo.length > 0) clearErrors('chassisNo');
        if (plateOrStickerNo.length > 0) clearErrors('plateOrStickerNo');
    }, [makeOrBrand, engineNo, chassisNo, plateOrStickerNo, clearErrors]);

    const addTricycle = () => {
        newTricycle.trigger();

        if (
            makeOrBrand.length > 0 &&
            engineNo.length > 0 &&
            plateOrStickerNo.length > 0 &&
            chassisNo.length > 0
        ) {
            newTricycle.setValue('applicantId', applicationNo);
            append(newTricycle.getValues());
            newTricycle.reset();
        }
    };

    const onSubmit = async (data: z.infer<typeof ApplicantFormSchema>) => {
        try {
            await addApplicant.mutateAsync({
                applicant: data,
                tricycle: data.tricycles,
            });

            toast({
                title: 'New Applicant Added',
                description: 'The applicant has been successfully added.',
            });

            applicantForm.reset();
            newTricycle.reset();
        } catch (error: any) {
            if (error.message.includes('license_no_unique')) {
                return toast({
                    variant: 'destructive',
                    title: 'Applicant Already Registered',
                    description:
                        'An applicant with this license number already exists. Please check the details and try again.',
                });
            }
            console.error(error);
            

            toast({
                variant: 'destructive',
                title: 'Uh oh! Something went wrong.',
                description: 'There was a problem with your request.',
            });
        } finally {
            countApplicant.refetch();
        }
    };

    return (
        <Form {...applicantForm}>
            <form
                onSubmit={applicantForm.handleSubmit(onSubmit)}
                className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'
            >
                <div className='mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4'>
                    <div className='flex items-center gap-4'>
                        <Button
                            type='button'
                            variant='outline'
                            size='icon'
                            onClick={() => router.push('/dashboard/applicants')}
                            className='h-7 w-7'
                        >
                            <ChevronLeft className='h-4 w-4' />
                            <span className='sr-only'>Back</span>
                        </Button>
                        <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
                            {'NEW APPLICANT'}
                        </h1>
                        <Badge variant='outline' className='ml-auto sm:ml-0'>
                            {applicationType}
                        </Badge>
                        <div className='hidden items-center gap-2 md:ml-auto md:flex'>
                            <Button variant='outline' size='sm'>
                                Discard
                            </Button>
                            <Button disabled={addApplicant.isPending} size='sm'>
                                {addApplicant.isPending
                                    ? 'Saving...'
                                    : 'Save Applicant'}
                            </Button>
                        </div>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {addApplicant.isPending
                                    ? 'Loading'
                                    : 'Application Details'}
                            </CardTitle>
                            <CardDescription>
                                Please fill in the following application
                                details:
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='grid md:grid-cols-4 lg:grid-cols-3 gap-6'>
                                <FormField
                                    control={applicantForm.control}
                                    name='applicationType'
                                    render={({ field }) => (
                                        <FormItem className='flex flex-col col-span-2'>
                                            <FormLabel htmlFor='applicationType'>
                                                Application For{' '}
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                disabled={
                                                    addApplicant.isPending
                                                }
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
                                    disabled={addApplicant.isPending}
                                    render={({ field }) => (
                                        <FormItem className='flex flex-col'>
                                            <FormLabel htmlFor='applicationDate'>
                                                Date
                                            </FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl id='applicationDate'>
                                                        <Button
                                                            variant={'outline'}
                                                            disabled={
                                                                addApplicant.isPending
                                                            }
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
                                                                : undefined
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
                                                                    ); // Convert Date to string in 'YYYY-MM-DD' format
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
                                    disabled={addApplicant.isPending}
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
                                    disabled={addApplicant.isPending}
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
                                        disabled={addApplicant.isPending}
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
                                        disabled={addApplicant.isPending}
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

                    <Card>
                        <CardHeader>
                            <CardTitle>Tricycles</CardTitle>
                            <CardDescription>
                                Provide information about the tricycle.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className='w-40'>
                                            Name
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
                                    {fields?.map(
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
                                                <TableRow key={i}>
                                                    <TableCell className='font-semibold text-nowrap w-32'>
                                                        {makeOrBrand}
                                                    </TableCell>
                                                    <TableCell>
                                                        {engineNo}
                                                    </TableCell>
                                                    <TableCell>
                                                        {chassisNo}
                                                    </TableCell>
                                                    <TableCell>
                                                        {plateOrStickerNo}
                                                    </TableCell>
                                                    <TableCell className='w-28 flex justify-end'>
                                                        <Button
                                                            type='button'
                                                            variant='ghost'
                                                            onClick={() =>
                                                                remove(i)
                                                            }
                                                        >
                                                            <Minus size={20} />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        }
                                    )}
                                    <TableRow className='mt-10'>
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
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                        <CardFooter className='justify-center border-t p-4'>
                            <Button
                                type='button'
                                size='sm'
                                variant='ghost'
                                onClick={addTricycle}
                                className='gap-1'
                            >
                                <PlusCircle className='h-3.5 w-3.5' />
                                Add Tricycle
                            </Button>
                        </CardFooter>
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
                                        disabled={addApplicant.isPending}
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
                                        disabled={addApplicant.isPending}
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
                    <div className='flex items-center justify-center gap-2 md:hidden'>
                        <Button type='button' variant='outline' size='sm'>
                            Discard
                        </Button>
                        <Button type='submit' size='sm'>
                            Save Applicant
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
}
