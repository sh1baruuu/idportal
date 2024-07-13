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
import { Tricycle } from '@/types';
import { FormSchema, TricycleSchema } from '@/types/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

const emptyTricycle = {
    name: '',
    engineNo: '',
    serialChassisNo: '',
    plateOrStickerNo: '',
};

export default function AddRegistrantPage() {
    const [newTricycle, setNewTricycle] = useState<Tricycle>(emptyTricycle);
    const [isDriverOperator, setIsDriverOperator] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const form = useForm<z.infer<typeof FormSchema>>({
        defaultValues: {
            applicationType: 'Driver/Operator',
            fullname: '',
            address: '',
            contactNo: '',
            licenseNo: '',
            applicationDate: new Date(),
            tricycles: [],
            driverName: '',
            driverLicenseNo: '',
        },
        resolver: zodResolver(FormSchema),
    });

    const { handleSubmit, control, setValue, watch } = form;

    const applicationType = watch('applicationType');
    const fullname = watch('fullname');
    const licenseNo = watch('licenseNo');

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

    const { append, fields, remove } = useFieldArray({
        control,
        name: 'tricycles',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target;
        setNewTricycle((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const addTricycle = () => {
        try {
            const validatedTricycle = TricycleSchema.parse(newTricycle);
            console.dir(validatedTricycle);
            append(newTricycle);
            setNewTricycle({
                name: '',
                engineNo: '',
                serialChassisNo: '',
                plateOrStickerNo: '',
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                const formattedErrors: { [key: string]: string } = {};
                error.errors.forEach((err) => {
                    if (err.path) {
                        formattedErrors[err.path[0]] = err.message;
                    }
                });
                setErrors(formattedErrors);
            }
        }
    };

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        toast({
            title: 'You submitted the following values:',
            description: (
                <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
                    <code className='text-white'>
                        {JSON.stringify(data, null, 2)}
                    </code>
                </pre>
            ),
        });
    };

    return (
        <Form {...form}>
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
                            New Applicant
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
                                                name,
                                                engineNo,
                                                serialChassisNo,
                                                plateOrStickerNo,
                                            },
                                            i
                                        ) => {
                                            return (
                                                <TableRow key={i}>
                                                    <TableCell className='font-semibold text-nowrap w-32'>
                                                        {name}
                                                    </TableCell>
                                                    <TableCell>
                                                        {engineNo}
                                                    </TableCell>
                                                    <TableCell>
                                                        {serialChassisNo}
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
                                                htmlFor='name'
                                                className='sr-only'
                                            >
                                                Make/Brand
                                            </Label>
                                            <Input
                                                id='name'
                                                name='name'
                                                type='text'
                                                placeholder='Enter Name'
                                                value={newTricycle.name}
                                                onChange={handleChange}
                                            />
                                            {errors.name && <FormMessage >{errors.name}</FormMessage>}
                                        </TableCell>
                                        <TableCell>
                                            <Label
                                                htmlFor='engineNo'
                                                className='sr-only'
                                            >
                                                Engine No.
                                            </Label>
                                            <Input
                                                id='engineNo'
                                                name='engineNo'
                                                type='text'
                                                placeholder='Enter Engine No.'
                                                value={newTricycle.engineNo}
                                                onChange={handleChange}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Label
                                                htmlFor='serialChassisNo'
                                                className='sr-only'
                                            >
                                                Chassis No.
                                            </Label>
                                            <Input
                                                id='serialChassisNo'
                                                name='serialChassisNo'
                                                type='text'
                                                placeholder='Enter chassis no.'
                                                value={
                                                    newTricycle.serialChassisNo
                                                }
                                                onChange={handleChange}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Label
                                                htmlFor='plateOrStickerNo'
                                                className='sr-only'
                                            >
                                                Sticker No.
                                            </Label>
                                            <Input
                                                id='plateOrStickerNo'
                                                name='plateOrStickerNo'
                                                type='text'
                                                placeholder='Enter plate/sticker no.'
                                                value={
                                                    newTricycle.plateOrStickerNo
                                                }
                                                onChange={handleChange}
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
                            Save Applicant
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
}
