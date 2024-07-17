'use client';

import { File, PlusCircle } from 'lucide-react';
import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ApplicationType } from '@/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ApplicantTable from '../_components/ApplicantTable';
import CardCustomHeader from '../_components/CardCustomHeader';
import CardCustomFooter from '../_components/CardFooter';
import EmptyTableIndicator from '../_components/EmptyTableIndicator';
import SortDropdownMenu from '../_components/SortDropdownMenu';

export default function ApplicantsTab() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [page, setPage] = useState<number>(1);
    const [filter, setFilter] = useState<ApplicationType>('All');
    const [order, setOrder] = useState<string>('');
    const search = searchParams.get('s');
    const pageSize = 10;

    const { isLoading, data, refetch } = trpc.getAllApplicants.useQuery({
        search,
        page,
        pageSize,
        filter,
        order,
    });

    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, data?.total ?? 0);
    const total = data?.total ?? 0;

    useEffect(() => {
        setPage(1);
    }, [filter, search]);

    useEffect(()=>{
        refetch();
    }, [])

    return (
        <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
            <Tabs defaultValue='All'>
                <div className='flex items-center'>
                    <TabsList>
                        <TabsTrigger
                            onClick={() => setFilter('All')}
                            value='All'
                        >
                            All
                        </TabsTrigger>
                        <TabsTrigger
                            onClick={() => setFilter('Operator')}
                            value='Operator'
                        >
                            Operator
                        </TabsTrigger>
                        <TabsTrigger
                            onClick={() => setFilter('Driver/Operator')}
                            value='Driver/Operator'
                        >
                            Driver/Operator
                        </TabsTrigger>
                    </TabsList>
                    <div className='ml-auto flex items-center gap-2'>
                        <SortDropdownMenu sort={order} sortBy={setOrder} />
                        <Button
                            size='sm'
                            variant='outline'
                            className='h-7 gap-1'
                        >
                            <File className='h-3.5 w-3.5' />
                            <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                                Export
                            </span>
                        </Button>
                        <Button
                            onClick={() => router.push('applicants/new')}
                            size='sm'
                            className='h-7 gap-1'
                        >
                            <PlusCircle className='h-3.5 w-3.5' />
                            <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                                Add Applicant
                            </span>
                        </Button>
                    </div>
                </div>
                <div className='mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'>
                    <Card>
                        <CardCustomHeader title='Applicants' description='Manage and view applicant permit records.' />
                        <CardContent>
                            <ApplicantTable
                                isLoading={isLoading}
                                data={data?.applicants}
                                pageSize={pageSize}
                            />
                            <EmptyTableIndicator
                                search={search}
                                total={total}
                                isLoading={isLoading}
                            />
                        </CardContent>
                        <CardCustomFooter
                            start={start}
                            end={end}
                            total={total}
                            setPage={setPage}
                            hasNextPage={!data?.hasNextPage}
                            isFirstPage={data?.isFirstPage}
                            name='applicants'
                        />
                    </Card>
                </div>
            </Tabs>
        </main>
    );
}
