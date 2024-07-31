"use client";

import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bike, User, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

const DashboardCards = () => {
    const { push } = useRouter();
    const { data, isLoading, refetch } = trpc.getDashboardData.useQuery()


  return (
    <div className='grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4'>
                <Card>
                    <CardHeader>
                        <CardTitle className='text-sm font-medium'>
                            Tricycle Permit Console
                        </CardTitle>
                        <CardDescription >
                        Efficiently manage your tricycle permits with our system
                        </CardDescription>

                    </CardHeader>
                    <CardContent>
                        <Button size={'sm'} onClick={() => push('dashboard/applicants/new')}>Add Tricycle Permit</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>
                          Registered Tricycles
                        </CardTitle>
                        <Bike className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{data?.totalTricycles}</div>
                        <p className='text-xs text-muted-foreground'>
                            from {data?.totalApplicants} applicants
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            No. of Driver/Operator
                        </CardTitle>
                        <Users className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{data?.noOfDriverOperator}</div>
                        <p className='text-xs text-muted-foreground'>
                            +19% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            No. of Operator
                        </CardTitle>
                        <User className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{data?.noOfOperator}</div>
                        <p className='text-xs text-muted-foreground'>
                            +201 since last hour
                        </p>
                    </CardContent>
                </Card>
            </div>
  )
}

export default DashboardCards