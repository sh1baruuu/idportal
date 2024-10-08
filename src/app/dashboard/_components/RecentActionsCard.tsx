"use client";

import { trpc } from '@/app/_trpc/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Bike, UserRound } from 'lucide-react';
import { useEffect } from 'react';
import EmptyRecentAction from './EmptyRecentAction';

const RecentActionsCard = () => {
    const { data, refetch, isLoading } = trpc.getRecentActions.useQuery();

    useEffect(() => {
        refetch()
    }, [])

    const dataExist = data && data.length > 0;

    const actionItems = data?.map(({ aid, action, createdAt, name, category }) => {
        const formattedDate = format(new Date(createdAt), 'yyyy-MM-dd hh:mm a');

        return (
            <div className='flex items-center gap-4' key={aid}>
                <div className='flex items-center justify-center bg-slate-100 dark:bg-secondary rounded-full h-9 w-9 sm:flex'>
                    {category === "Tricycle" ? <Bike className='text-slate-500' size={18} /> : <UserRound className='text-slate-500' size={18} />}
                </div>
                <div className='grid gap-1'>
                    <p className='text-sm font-medium leading-none'>
                        {name}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                        {formattedDate}
                    </p>
                </div>
                <div className='ml-auto font-medium text-sm'>
                    {action}
                </div>
            </div>
        )
    })

    const loaderCount = Array(4).fill(0);

    const actionItemLoader = loaderCount.map((_, i) => {

        return (
            <div className='flex items-center gap-4' key={i}>
                <Skeleton className='flex items-center justify-center rounded-full h-9 w-9 sm:flex' />
                  
                <div className='grid gap-1 mr-auto'>
                    <Skeleton className='h-4 w-24'  />
                    <Skeleton className='h-4 w-40' />
                </div>
                <Skeleton className='h-6 w-20' />
            </div>
        )
    })

    return (
        <Card className='hidden md:block'>
            <CardHeader>
                <CardTitle>Recent Actions</CardTitle>
                <CardDescription className='sr-only'>All recent action from system</CardDescription>
            </CardHeader>
            <CardContent className='grid gap-8'>
                {isLoading ? actionItemLoader  : actionItems }
                {!isLoading && !dataExist && <EmptyRecentAction />}
            </CardContent>
        </Card>
    )
}

export default RecentActionsCard;
