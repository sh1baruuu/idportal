'use client';

import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';


const ExportPage = () => {
    const { push } = useRouter();
    const { isLoading, data } = trpc.getBackUpData.useQuery();
    const fileName = 'TP-Console-BackUp';

    const routeToDashBoard = () => push("/dashboard")

    if (isLoading) {
        return <Loader />
    }
    const exportData = () => {
        const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
        const fileNameEx = `${fileName}-${currentDate}.json`;
    
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(data)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = fileNameEx;
    
        link.click();
    };
    
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
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                            Link
                        </Label>
                        <Input
                            id="link"
                            defaultValue={fileName+".json"}
                            readOnly
                        />
                    </div>
                    <Button type="submit" size="sm" className="px-3" onClick={exportData}>
                        <span className="sr-only">Export</span>
                        <Download className="h-4 w-4" />
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
