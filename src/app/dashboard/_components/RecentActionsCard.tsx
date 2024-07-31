"use client";

import { trpc } from '@/app/_trpc/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect } from 'react';

const RecentActionsCard = () => {
    const { data, refetch } = trpc.getRecentActions.useQuery();

    useEffect(() => {
        refetch()
    }, [])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Actions</CardTitle>
            </CardHeader>
            <CardContent className='grid gap-8'>
                {data?.map(({ aid, action, createdAt, name }) => {
                    return (
                        <div className='flex items-center gap-4' key={aid}>
                            <Avatar className='hidden h-9 w-9 sm:flex'>
                                <AvatarImage
                                    src='/avatars/01.png'
                                    alt='Avatar'
                                />
                                <AvatarFallback>OM</AvatarFallback>
                            </Avatar>
                            <div className='grid gap-1'>
                                <p className='text-sm font-medium leading-none'>
                                    {name}
                                </p>
                                <p className='text-sm text-muted-foreground'>
                                    {createdAt}
                                </p>
                            </div>
                            <div className='ml-auto font-medium text-sm'>
                                {action}
                            </div>
                        </div>
                    )
                })
                }



            </CardContent>
        </Card>
    )
}

export default RecentActionsCard