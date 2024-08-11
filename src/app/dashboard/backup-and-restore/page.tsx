'use client';

import { ChevronLeft, FileInput, FileOutput, Import, LoaderCircle, Trash2 } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { trpc } from '@/app/_trpc/client';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import Spinner from '@/components/common/Spinner';

export default function AddRegistrantPage() {
    const { push } = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const fileName = 'TP-Console-BackUp';
    const [clearDialogIsOpen, setClearDialogIspen] = useState<boolean>(false);
    const [clearDialogInput, setClearDialogInput] = useState<string>("");

    const isClearDataButtonEnabled = clearDialogInput === 'tpconsole/data';

    const getBackUpData = trpc.getBackUpData.useQuery();
    const importBackUpData = trpc.importBackUpData.useMutation();
    const clearTPData = trpc.clearAllData.useMutation();

    useEffect(() => {
        getBackUpData.refetch();
    }, [])

    useEffect(() => {
        setClearDialogInput("");
    }, [clearDialogIsOpen])

    const toggleClearAllDataDialog = () => {
        setClearDialogIspen(prev => !prev)
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    const importData = () => {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const content = e.target?.result as string;
                const jsonData = JSON.parse(content);

                if (jsonData.applicantData && jsonData.tricycleData) {
                    await importBackUpData.mutateAsync(jsonData);
                    toast({
                        title: 'Data Imported',
                        description: 'Data successfully uploaded and inserted!',
                    });
                    getBackUpData.refetch();
                } else {
                    toast({
                        title: 'Invalid File',
                        description: 'Invalid JSON structure in the file.',
                        variant: 'destructive',
                    });
                }
            } catch (error) {
                toast({
                    title: 'Import Error',
                    description: 'Failed to read or parse the file.',
                    variant: 'destructive',
                });
            } finally {
                setFile(null);
                const inputElement = document.querySelector('input[type="file"]');
                if (inputElement) {
                    (inputElement as HTMLInputElement).value = '';
                }
            }
        };
        reader.readAsText(file);
    };

    const exportData = () => {
        const currentDate = new Date().toISOString().split('T')[0];
        const fileNameEx = `${fileName}-${currentDate}.json`;
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(getBackUpData.data)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = fileNameEx;

        link.click();
    };

    const clearAllData = async () => {
        try {
            await clearTPData.mutateAsync();
            toggleClearAllDataDialog();

            toast({
                title: 'Data Cleared',
                description: 'All data has been successfully cleared.',
            });

            getBackUpData.refetch();
        } catch (error) {
            toast({
                title: 'Uh oh! Something went wrong.',
                description: 'Failed to clear data. Please try again.',
                variant: "destructive"
            });
            console.error(error)
        }
    }


    return (
        <div
            className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 w-full'
        >
            <div className='mx-auto grid max-w-[59rem] flex-1 auto-rows-max w-full lg:min-w-[942px] gap-4'>
                <div className='flex items-center gap-4'>
                    <Button
                        type='button'
                        variant='outline'
                        size='icon'
                        onClick={() => push('/dashboard')}
                        className='h-7 w-7'
                    >
                        <ChevronLeft className='h-4 w-4' />
                        <span className='sr-only'>Back</span>
                    </Button>
                    <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight uppercase sm:grow-0'>
                        Data Backup and Restore
                    </h1>

                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Import data</CardTitle>
                        <CardDescription>
                            To import data, select a correctly formatted JSON file from your computer.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <Input
                                className="grid flex-1 gap-2 cursor-pointer"
                                type="file"
                                accept=".json"
                                onChange={handleFileChange}
                            />
                        </form>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button disabled={!file || importBackUpData.isPending} onClick={importData} className='flex gap-1'> {importBackUpData.isPending ? <><LoaderCircle className="h-4 w-4 animate-spin" /><span>Importing data</span></> : <><FileInput className="h-4 w-4" /><span>Import data</span></>}</Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Export data</CardTitle>
                        <CardDescription>
                            The backup file will be downloaded to your local machine.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <Input
                                id="link"
                                defaultValue={fileName + ".json"}
                                disabled
                            />
                        </form>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button disabled={getBackUpData.isLoading || getBackUpData.data && getBackUpData.data.applicantData.length === 0} onClick={exportData} className='flex gap-1'> <FileOutput className="h-4 w-4" /><span>Export data</span></Button>
                    </CardFooter>
                </Card>

                <Card className='border-red-300 dark:border-destructive shadow-none'>
                    <CardHeader>
                        <CardTitle>Clear all data</CardTitle>
                        <CardDescription>
                            This will permanently delete all tricycle permit console data, including information about applicants, tricycles, and activities.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="border-t px-6 py-4">
                        <Button variant="outline" onClick={toggleClearAllDataDialog} className='group flex gap-1 text-red-500 hover:bg-red-500 hover:text-white'> <Trash2 className="group-hover:stroke-white h-4 w-4 stroke-red-500" /><span>Clear all data</span></Button>
                    </CardFooter>
                </Card>

                <Dialog open={clearDialogIsOpen} onOpenChange={toggleClearAllDataDialog}>
                    <DialogContent className="sm:max-w-[425px] p-4">
                        <DialogHeader>
                            <DialogTitle>Clear all data</DialogTitle>
                            <DialogDescription> Are you sure you want to clear all data?</DialogDescription>
                        </DialogHeader>
                        <div className="flex items-center space-x-2 ">
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="clearDataInput" className='font-medium'>
                                    To confirm, type "tpconsole/data" in the box below
                                </Label>
                                <Input
                                    className='border-red-400 focus:border-none focus:outline-2'
                                    id="clearDataInput"
                                    autoComplete='off'
                                    value={clearDialogInput}
                                    onChange={(e) => { setClearDialogInput(e.target.value) }}
                                    disabled={clearTPData.isPending}
                                />
                                {clearTPData.isPending ? <Button variant="destructive" >Clearing data...</Button> : <Button onClick={clearAllData} className='w-full text-red-500 hover:bg-destructive hover:text-white border' disabled={!isClearDataButtonEnabled} variant="secondary" type="button">Clear all data</Button>}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

            </div>
        </div>
    );
}
