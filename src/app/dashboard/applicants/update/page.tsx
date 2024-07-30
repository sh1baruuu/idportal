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
import { z } from 'zod';

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Applicant, Tricycle } from '@/types';
import { ApplicantFormSchema, ApplicantSchema, TricycleSchema } from '@/types/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';


export default function UpdateApplicantPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const updateThisId = searchParams.get("id")
    const updateApplicant = trpc.updateApplicant.useMutation({});
    const { data, isLoading} = trpc.getApplicantById.useQuery(updateThisId ?? "");

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

    const { applicationType, fullname, licenseNo } =
        applicantForm.watch();

    const [isDriverOperator, setIsDriverOperator] = useState<boolean>(false);

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

    const routerBack = () => router.push('/dashboard/applicants')

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = applicantForm.getValues();
            const res = await updateApplicant.mutateAsync(data);

            toast({
                title: 'Applicant Updated',
                description: `The applicant (${res[0].updatedId}) has been successfully updated.`,
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
        return <h1>Loading</h1>
    }

    if (data?.exists === false) {
        return router.push("/dashboard/applicants")
    }

    return (
        <Dialog onOpenChange={routerBack} defaultOpen>
            
            <DialogContent className="sm:min-w-fit">
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
                                                        <PopoverTrigger asChild>
                                                            <FormControl id='applicationDate' className='max-w-full'>
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
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
