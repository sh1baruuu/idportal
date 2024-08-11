'use client';

import {
    Bike,
    DatabaseBackup,
    Home,
    KeyRound,
    LineChart,
    Lock,
    LogOut,
    LucideProps,
    Package,
    Package2,
    PanelLeft,
    Search,
    Settings,
    Sheet as SheetIcon,
    ShoppingCart,
    SunMoon,
    User,
    Users2
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAuth } from '@/context/AuthProvider';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import UpdatePasswordDialog from './_components/UpdatePasswordDialog';
import { Label } from '@/components/ui/label';

interface Props {
    children: React.ReactNode;
}

interface NavItems {
    label: string;
    icon: React.ForwardRefExoticComponent<
        Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
    >;
    path: string;
}

const navItems: NavItems[] = [
    {
        label: 'Dashboard',
        icon: Home,
        path: '',
    },
    {
        label: 'Applicants',
        icon: User,
        path: 'applicants',
    },
    {
        label: 'Tricycles',
        icon: Bike,
        path: 'tricycles',
    },
    {
        label: 'Excel Data',
        icon: SheetIcon,
        path: 'excel-data',
    },
    {
        label: 'Data Backup and Restore',
        icon: DatabaseBackup,
        path: 'backup-and-restore',
    },

];



export default function DashboardLayout({ children }: Readonly<Props>) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const [search, setSearch] = useState<string>('');
    const [isLogOutDialogOpen, setLogOutIsDialogOpen] = useState<boolean>(false);
    const [isUpdatePasswordDialogOpen, setUpdatePasswordIsDialogOpen] = useState<boolean>(false);
    const { onSignOut } = useAuth();
    const { setTheme, theme } = useTheme();

    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        if (search) {
            params.set('s', search);
        } else {
            params.delete('s');
        }

        const delayDebounceFn = setTimeout(() => {
            router.replace(`${pathname}?${params.toString()}`);
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    useEffect(() => {
        setSearch('');
    }, [pathname]);

    const pathArr = pathname.split('/').filter((path) => path !== '');
    const currentPath =
        pathArr[pathArr.length - 1] === 'dashboard'
            ? ''
            : pathArr[pathArr.length - 1];
    const currentPathLabel =
        pathArr.length == 1
            ? 'home'
            : navItems.find((item) => item.path === currentPath)?.label || '';

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleSearchClick = () => {
        if (pathname === "/dashboard" || pathname === '/dashboard/backup-and-restore') {
            router.push("/dashboard/applicants")
        }
    }

    const toggleLogOutDialog = () => {
        setLogOutIsDialogOpen(prev => !prev);
    }

    const toggleUpdatePasswordDialog = () => {
        setUpdatePasswordIsDialogOpen(prev => !prev);
    }

    const signOut = async () => {
        try {
            await onSignOut();
            router.push('/login');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='flex min-h-screen w-full flex-col bg-muted/40'>
            <aside className='fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex'>
                <nav className='flex flex-col items-center gap-4 px-2 sm:py-4'>
                    <Link
                        href='#'
                        className='group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base'
                    >
                        <Package2 className='h-4 w-4 transition-all group-hover:scale-110' />
                        
                    </Link>
                    {navItems?.map((item, i) => {
                        return (
                            <Tooltip key={i}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={`/dashboard/${item.path}`}
                                        className={`flex h-9 w-9 items-center justify-center rounded-lg  transition-colors hover:text-foreground md:h-8 md:w-8 ${item.path === currentPath
                                            ? 'bg-accent text-foreground'
                                            : 'text-muted-foreground'
                                            }`}
                                    >
                                        <item.icon className='h-5 w-5' />
                                        <span className='sr-only'>
                                            {item.label}
                                        </span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side='right'>
                                    {item.label}
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </nav>
                <nav className='mt-auto flex flex-col items-center gap-4 px-2 sm:py-4'>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href='/'
                                className='flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8'
                            >
                                <Settings className='h-5 w-5' />
                                <span className='sr-only'>Settings</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side='right'>Settings</TooltipContent>
                    </Tooltip>
                </nav>
            </aside>
            <div className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14'>
                <header className='sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6'>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                size='icon'
                                variant='outline'
                                className='sm:hidden'
                            >
                                <PanelLeft className='h-5 w-5' />
                                <span className='sr-only'>Toggle Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side='left' className='sm:max-w-xs'>
                            <nav className='grid gap-6 text-lg font-medium'>
                                <Link
                                    href='#'
                                    className='group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base'
                                >
                                    <Package2 className='h-5 w-5 transition-all group-hover:scale-110' />
                                    <span className='sr-only'>Acme Inc</span>
                                </Link>
                                <Link
                                    href='/'
                                    className='flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground'
                                >
                                    <Home className='h-5 w-5' />
                                    Dashboard
                                </Link>
                                <Link
                                    href='#'
                                    className='flex items-center gap-4 px-2.5 text-foreground'
                                >
                                    <ShoppingCart className='h-5 w-5' />
                                    Orders
                                </Link>
                                <Link
                                    href='#'
                                    className='flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground'
                                >
                                    <Package className='h-5 w-5' />
                                    Products
                                </Link>
                                <Link
                                    href='#'
                                    className='flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground'
                                >
                                    <Users2 className='h-5 w-5' />
                                    Customers
                                </Link>
                                <Link
                                    href='#'
                                    className='flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground'
                                >
                                    <LineChart className='h-5 w-5' />
                                    Settings
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                    <Breadcrumb className='hidden md:flex'>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href='/dashboard'>Dashboard</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage className='capitalize'>
                                    {currentPathLabel}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className='relative ml-auto flex-1 md:grow-0'>
                        <Label htmlFor='search' className='sr-only' >Search</Label>
                        <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                        <Input
                            id='search'
                            type='search'
                            placeholder='Search...'
                            value={search}
                            onChange={handleSearch}
                            onClick={handleSearchClick}
                            className='w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]'
                        />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant='outline'
                                size='icon'
                                className='overflow-hidden rounded-full'
                            >
                                <Image
                                    src='/assets/slb.png'
                                    width={36}
                                    height={36}
                                    alt='Avatar'
                                    className='overflow-hidden rounded-full'
                                />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='min-w-56'>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger><SunMoon size={16} className='stroke-muted-foreground mr-2' />Themes</DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent >
                                        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                                            <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub><DropdownMenuItem onClick={toggleUpdatePasswordDialog}><Lock size={16} className='stroke-muted-foreground mr-2' />Password</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={toggleLogOutDialog}>
                                <LogOut size={16} className='stroke-muted-foreground mr-2' /> Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Dialog open={isLogOutDialogOpen} onOpenChange={toggleLogOutDialog}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Confirm Logout</DialogTitle>
                            </DialogHeader>
                            <DialogDescription>
                                Are you sure you want to log out?
                            </DialogDescription>
                            <DialogFooter>
                                <Button variant="outline" onClick={toggleLogOutDialog}>Cancel</Button>
                                <Button variant="destructive" onClick={signOut}>Logout</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <UpdatePasswordDialog open={isUpdatePasswordDialogOpen} toggleDialog={toggleUpdatePasswordDialog} />
                </header>
                {children}
            </div>
        </div>
    );
}
