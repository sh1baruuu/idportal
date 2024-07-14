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
import { cn } from '@/lib/utils';
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
import { ApplicantFormSchema, TricycleSchema } from '@/types/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

export default function AddRegistrantPage() {
    const applicantForm = useForm<z.infer<typeof ApplicantFormSchema>>({
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

    const { handleSubmit, control, setValue, watch, reset } = applicantForm;

    const { data, refetch } = trpc.countApplicant.useQuery();
    const addApplicant = trpc.addApplicant.useMutation({
        onError: (error) => {
            if (error.message.includes('license_no_unique')) {
                return toast({
                    variant: 'destructive',
                    title: 'Applicant Already Registered',
                    description:
                        'An applicant with this license number already exists. Please check the details and try again.',
                });
            }
            toast({
                variant: 'destructive',
                title: 'Uh oh! Something went wrong.',
                description: 'There was a problem with your request.',
            });
        },
        onSuccess: () => {
            toast({
                title: 'New Applicant Added',
                description: 'The applicant has been successfully added.',
            });
            reset();
        },
        onSettled: () => {
            refetch();
        },
    });

    const newTricycle = useForm<z.infer<typeof TricycleSchema>>({
        defaultValues: {
            makeOrBrand: '',
            engineNo: '',
            chassisNo: '',
            plateOrStickerNo: '',
        },
        resolver: zodResolver(TricycleSchema),
    });

    // Generate applicant number
    useEffect(() => {
        const uaid = (number: any): string => {
            const paddedNumber = (++number)?.toString().padStart(4, '0');

            return `APP-${paddedNumber}`;
        };
        if (data) {
            setValue('applicationNo', uaid(data));
        }
    }, [data]);

    const [isDriverOperator, setIsDriverOperator] = useState<boolean>(false);

    const {
        formState: { errors },
        trigger,
        clearErrors,
        getValues,
    } = newTricycle;

    const { applicationType, fullname, licenseNo } = watch();
    const { append, fields, remove } = useFieldArray({
        control,
        name: 'tricycles',
    });

    const { makeOrBrand, engineNo, chassisNo, plateOrStickerNo } =
        newTricycle.watch();

    useEffect(() => {
        if (applicationType === 'Driver/Operator') {
            setValue('driverName', fullname);
            setValue('driverLicenseNo', licenseNo);
            setIsDriverOperator(true);
        } else {
            setIsDriverOperator(false);
            setValue('driverName', '');
            setValue('driverLicenseNo', '');
        }
    }, [applicationType, fullname, licenseNo, setValue]);

    useEffect(() => {
        if (makeOrBrand.length > 0) clearErrors('makeOrBrand');
        if (engineNo.length > 0) clearErrors('engineNo');
        if (chassisNo.length > 0) clearErrors('chassisNo');
        if (plateOrStickerNo.length > 0) clearErrors('plateOrStickerNo');
    }, [makeOrBrand, engineNo, chassisNo, plateOrStickerNo, clearErrors]);

    const addTricycle = () => {
        // Validate newTricycle fields
        trigger();

        // Add new tricycle to tricycles if no error
        if (
            makeOrBrand.length > 0 &&
            engineNo.length > 0 &&
            plateOrStickerNo.length > 0 &&
            chassisNo.length > 0
        ) {
            append(getValues());
            newTricycle.reset();
        }
    };

    useEffect(() => {
        console.log(addApplicant.isPending);
        
    }, [addApplicant])

    const onSubmit = (data: z.infer<typeof ApplicantFormSchema>) => {
        try {
            addApplicant.mutate(data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Form {...applicantForm}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'
            >
                <div className='mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4'>
                    <div className='flex items-center gap-4'>
                        <Button
                            type='button'
                            variant='outline'
                            size='icon'
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
                            <Button size='sm'>Save Product</Button>
                        </div>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Application Details</CardTitle>
                            <CardDescription>
                                Please fill in the following application
                                details:
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='grid md:grid-cols-4 lg:grid-cols-3 gap-6'>
                                <FormField
                                    control={control}
                                    name='applicationType'
                                    render={({ field }) => (
                                        <FormItem className='flex flex-col col-span-2'>
                                            <FormLabel>
                                                Application Permit For{' '}
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <SelectTrigger
                                                    id='status'
                                                    aria-label='Select type'
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
                                    control={control}
                                    name='applicationDate'
                                    render={({ field }) => (
                                        <FormItem className='flex flex-col'>
                                            <FormLabel>Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
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
                                                        selected={field.value}
                                                        onSelect={
                                                            field.onChange
                                                        }
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
                                Enter applicant's personal and contact
                                information.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='grid gap-6'>
                                <FormField
                                    control={control}
                                    name='fullname'
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
                                    control={control}
                                    name='address'
                                    render={({ field }) => (
                                        <FormItem className='flex flex-col'>
                                            <FormLabel>
                                                Address{' '}
                                                <span className='text-muted-foreground italic text-xs'>
                                                    (No. Street, Barangay,
                                                    Municipality, Province)
                                                </span>
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
                                <div className='md:grid-cols-2 gap-6 grid pb-2'>
                                    <FormField
                                        control={control}
                                        name='licenseNo'
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
                                    <FormField
                                        control={control}
                                        name='contactNo'
                                        render={({ field }) => (
                                            <FormItem className='flex flex-col'>
                                                <FormLabel>
                                                    Contact No.
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
                                        control={control}
                                        name='driverName'
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
                                        control={control}
                                        name='driverLicenseNo'
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
                            {addApplicant.isPending ? 'Saving' : ' Save Applicant'}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
}
