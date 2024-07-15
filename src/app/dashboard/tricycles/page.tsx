'use client';

import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, ChevronRight, File } from 'lucide-react';
import { useState } from 'react';
import FilterDropdownMenu from '../_components/FilterDropdownMenu';
import SortDropdownMenu from '../_components/SortDropdownMenu';
import TricycleTable from '../_components/TricycleTable';

export default function TricyclesTab() {
    const allTricycles = trpc.allTricycles.useQuery();

    const [selectedFilter, setSelectedFilter] = useState<string>('');
    const [selectedSort, setSelectedSort] = useState<string>('AZ');


    return (
        <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3'>
            <div className='grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-3'>
                <Tabs defaultValue='all'>
                    <div className='flex items-center'>
                        <TabsList>
                            <TabsTrigger value='all'>All</TabsTrigger>
                            <TabsTrigger value='month'>Paid</TabsTrigger>
                            <TabsTrigger value='year'>Unpaid</TabsTrigger>
                        </TabsList>
                        <div className='ml-auto flex items-center gap-2'>
                            <FilterDropdownMenu
                                selectedFilter={selectedFilter}
                                setSelectedFilter={setSelectedFilter}
                            />
                            <SortDropdownMenu
                                selectedSort={selectedSort}
                                setSelectedSort={setSelectedSort}
                            />
                            <Button
                                size='sm'
                                variant='outline'
                                className='h-7 gap-1 text-sm'
                            >
                                <File className='h-3.5 w-3.5' />
                                <span className='sr-only sm:not-sr-only'>
                                    Export
                                </span>
                            </Button>
                        </div>
                    </div>
                    <div className='mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'>
                        <Card>
                            <CardHeader className='px-7'>
                                <CardTitle>Tricycles</CardTitle>
                                <CardDescription>
                                    View and manage the list of registered tricycle.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <TricycleTable data={allTricycles.data} />
                            </CardContent>
                            <CardFooter>
                            <div className='text-xs text-muted-foreground'>
                                Showing <strong>1-10</strong> of{' '}
                                <strong>32</strong> registrants
                            </div>
                            <div className='ml-auto flex gap-3'>
                                <Button
                                    size='icon'
                                    variant='outline'
                                    className='h-7 w-7'
                                >
                                    <ChevronLeft className='h-5 w-5' />
                                    <span className='sr-only'>
                                        Previous Order
                                    </span>
                                </Button>
                                <Button
                                    size='icon'
                                    variant='outline'
                                    className='h-7 w-7'
                                >
                                    <ChevronRight className='h-5 w-5' />
                                    <span className='sr-only'>Next Order</span>
                                </Button>
                            </div>
                        </CardFooter>
                        </Card>
                    </div>
                </Tabs>
            </div>
        </main>
    );
}
