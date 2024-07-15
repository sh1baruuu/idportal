'use client';

import {
    ChevronLeft,
    ChevronRight,
    File,
    ListFilter,
    PlusCircle,
} from 'lucide-react';

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
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import ApplicantTable from '../_components/ApplicantTable';

export default function ApplicantsTab() {
    const router = useRouter();
    const allApplicants = trpc.allApplicants.useQuery();

    return (
        <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
            <Tabs defaultValue='all'>
                <div className='flex items-center'>
                    <TabsList>
                        <TabsTrigger value='all'>All</TabsTrigger>
                        <TabsTrigger value='operator'>Operator</TabsTrigger>
                        <TabsTrigger value='driver/operator'>Driver/Operator</TabsTrigger>
                    </TabsList>
                    <div className='ml-auto flex items-center gap-2'>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    className='h-7 gap-1'
                                >
                                    <ListFilter className='h-3.5 w-3.5' />
                                    <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                                        Filter
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem checked>
                                    Active
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>
                                    Draft
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>
                                    Archived
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
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
                <TabsContent value='all'>
                    <Card x-chunk='dashboard-06-chunk-0'>
                        <CardHeader>
                            <CardTitle>Applicants</CardTitle>
                            <CardDescription>
                                Manage and view applicant permit records.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            
                            {allApplicants.isLoading ? "Loading" : <ApplicantTable data={allApplicants.data} />}
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
                </TabsContent>
            </Tabs>
        </main>
    );
}
