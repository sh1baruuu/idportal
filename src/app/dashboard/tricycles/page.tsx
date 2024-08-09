'use client';

import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent
} from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs';
import { File, RefreshCw } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import CardCustomHeader from '../_components/CardCustomHeader';
import CardCustomFooter from '../_components/CardFooter';
import EmptyTableIndicator from '../_components/EmptyTableIndicator';
import SortDropdownMenu from '../_components/SortDropdownMenu';
import TricycleTable from '../_components/TricycleTable';
import ExportExcelButton from '@/components/ExportExcelButton';

export default function TricyclesTab() {
    const searchParams = useSearchParams();
    const [page, setPage] = useState<number>(1);
    const [order, setOrder] = useState<string>('');
    const search = searchParams.get('s');
    const pageSize = 10;

    const exportTricycles = trpc.exportTricycles.useQuery();
    const { data, isLoading, refetch, isRefetching } = trpc.getAllTricycles.useQuery({
        search,
        page,
        pageSize,
        order,
    });

    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, data?.total ?? 0);
    const total = data?.total ?? 0;

    useEffect(() => {
        exportTricycles.refetch();
        refetch();
    }, [])

    return (
        <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3'>
            <div className='grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-3'>
                <Tabs>
                    <div className='flex items-center'>
                        <div className='ml-auto flex items-center gap-2'>
                            <Button
                                size='sm'
                                variant='outline'
                                className='h-7 gap-1'
                                onClick={() => refetch()}
                            >
                                <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? "animate-spin" : ""}`} />
                            </Button>
                            <SortDropdownMenu sort={order} sortBy={setOrder} />
                            <ExportExcelButton disabled={exportTricycles.isLoading}  excelData={exportTricycles.data} fileName='TP Tricycle' />
                            </div>
                    </div>
                    <div className='mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'>
                        <Card>
                            <CardCustomHeader
                                title='Tricycles'
                                description='View and manage the list of registered tricycle.'
                            />
                            <CardContent>
                                <TricycleTable
                                    isLoading={isLoading}
                                    data={data?.tricycles}
                                    pageSize={pageSize}
                                    refetch={refetch}
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
                                name='tricycles'
                            />
                        </Card>
                    </div>
                </Tabs>
            </div>
        </main>
    );
}
