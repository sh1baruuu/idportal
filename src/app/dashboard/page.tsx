import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';
import DashboardCards from './_components/DashboardCards';
import DashboardApplicantTable from './_components/DashboardApplicantTable';

export default function DashboardPage() {
    return (
        <main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8'>
            <DashboardCards />
            <div className='grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3'>
                <Card className='xl:col-span-2' x-chunk='dashboard-01-chunk-4'>
                    <CardHeader className='flex flex-row items-center'>
                        <div className='grid gap-2'>
                            <CardTitle>Applicants</CardTitle>
                            <CardDescription>
                                Recent applicants from portal.
                            </CardDescription>
                        </div>
                        <Button asChild size='sm' className='ml-auto gap-1'>
                            <Link href='http://localhost:3000/dashboard/applicants'>
                                View All
                                <ArrowUpRight className='h-4 w-4' />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <DashboardApplicantTable />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Actions</CardTitle>
                    </CardHeader>
                    <CardContent className='grid gap-8'>
                        <div className='flex items-center gap-4'>
                            <Avatar className='hidden h-9 w-9 sm:flex'>
                                <AvatarImage
                                    src='/avatars/01.png'
                                    alt='Avatar'
                                />
                                <AvatarFallback>OM</AvatarFallback>
                            </Avatar>
                            <div className='grid gap-1'>
                                <p className='text-sm font-medium leading-none'>
                                    Olivia Martin
                                </p>
                                <p className='text-sm text-muted-foreground'>
                                2024-07-31
                                </p>
                            </div>
                            <div className='ml-auto font-medium text-sm'>
                               UPDATE
                            </div>
                        </div>
                        <div className='flex items-center gap-4'>
                            <Avatar className='hidden h-9 w-9 sm:flex'>
                                <AvatarImage
                                    src='/avatars/01.png'
                                    alt='Avatar'
                                />
                                <AvatarFallback>OM</AvatarFallback>
                            </Avatar>
                            <div className='grid gap-1'>
                                <p className='text-sm font-medium leading-none'>
                                    Olivia Martin
                                </p>
                                <p className='text-sm text-muted-foreground'>
                                2024-07-31
                                </p>
                            </div>
                            <div className='ml-auto font-medium text-sm'>
                               INSERT
                            </div>
                        </div>
                        <div className='flex items-center gap-4'>
                            <Avatar className='hidden h-9 w-9 sm:flex'>
                                <AvatarImage
                                    src='/avatars/01.png'
                                    alt='Avatar'
                                />
                                <AvatarFallback>OM</AvatarFallback>
                            </Avatar>
                            <div className='grid gap-1'>
                                <p className='text-sm font-medium leading-none'>
                                    Olivia Martin
                                </p>
                                <p className='text-sm text-muted-foreground'>
                                2024-07-31
                                </p>
                            </div>
                            <div className='ml-auto font-medium text-sm'>
                               DELETE
                            </div>
                        </div>
                        <div className='flex items-center gap-4'>
                            <Avatar className='hidden h-9 w-9 sm:flex'>
                                <AvatarImage
                                    src='/avatars/01.png'
                                    alt='Avatar'
                                />
                                <AvatarFallback>OM</AvatarFallback>
                            </Avatar>
                            <div className='grid gap-1'>
                                <p className='text-sm font-medium leading-none'>
                                    Olivia Martin
                                </p>
                                <p className='text-sm text-muted-foreground'>
                                2024-07-31
                                </p>
                            </div>
                            <div className='ml-auto font-medium text-sm'>
                               UPDATE
                            </div>
                        </div>
                     
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
