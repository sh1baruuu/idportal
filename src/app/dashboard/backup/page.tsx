'use client';

import { ChevronLeft } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { Button } from '@/components/ui/button';

import { useRouter } from 'next/navigation';

export default function AddRegistrantPage() {
    const { push } = useRouter();


    return (
        <div
            className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 w-full'
        >
            <div className='mx-auto grid max-w-[59rem] flex-1 auto-rows-max min-w-[942px]  gap-4'>
                <div className='flex items-center gap-4'>
                    <Button
                        type='button'
                        variant='outline'
                        size='icon'
                        onClick={() => push('/dashboard/applicants')}
                        className='h-7 w-7'
                    >
                        <ChevronLeft className='h-4 w-4' />
                        <span className='sr-only'>Back</span>
                    </Button>
                    <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
                        {'NEW APPLICANT'}
                    </h1>

                </div>


                <Card>
                    <CardHeader>
                        <CardTitle>Store Name</CardTitle>
                        <CardDescription>
                            Used to identify your store in the marketplace.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <Input placeholder="Store Name" />
                        </form>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button>Save</Button>
                    </CardFooter>
                </Card>

            </div>
        </div>
    );
}
