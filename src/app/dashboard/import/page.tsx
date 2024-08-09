'use client';

import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as Filesaver from "file-saver";
import { Download, Import, Loader, LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import XLSX from "sheetjs-style";


const ExportPage = () => {
    const { push } = useRouter();
    const { isLoading, data } = trpc.getBackUpData.useQuery();
    const fileName = 'TP-Console-BackUp';

    const routeToDashBoard = () => push("/dashboard")


    const [file, setFile] = useState<File | null>(null);
    const { isPending, mutateAsync } = trpc.importBackUpData.useMutation();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const content = e.target?.result as string;
                const jsonData = JSON.parse(content);

                if (jsonData.applicantData && jsonData.tricycleData) {
                    await mutateAsync(jsonData);
                    alert('Data successfully uploaded and inserted!');
                } else {
                    alert('Invalid JSON structure.');
                }
            } catch (error) {
                alert('Failed to read or parse the file.');
            }
        };
        reader.readAsText(file);
    };

    if (isLoading) {
        return <Loader />
    }


    return (
        <Dialog open={true} defaultOpen onOpenChange={routeToDashBoard} >
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Export data</DialogTitle>
                    <DialogDescription>
                        The file will be downloaded to your local machine.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <Input
                        className="grid flex-1 gap-2"
                        type="file"
                        accept=".json"
                        onChange={handleFileChange}
                    />
                    <Button type="submit" size="sm" className="px-3" onClick={handleUpload}>
                        <span className="sr-only">Export</span>
                        <Import className="h-4 w-4" />
                    </Button>
                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ExportPage;
