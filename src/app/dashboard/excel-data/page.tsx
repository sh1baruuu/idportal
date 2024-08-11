'use client';

import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as Filesaver from "file-saver";
import { Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import XLSX from "sheetjs-style";
import Loader from '../_components/Loader';


interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    excelData: any;
    fileName: string;
}

const ExportExcelButton: React.FC<Props> = ({ excelData, fileName, ...props }) => {
    const { push } = useRouter();

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;chartset=UTF-8';
    const fileExtenstion = '.xlsx';

    const exportToExcel = async () => {
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        Filesaver.saveAs(data, fileName + fileExtenstion);

        push("/dashboard");
    }

    return (
        <Button type="submit" size="sm" className="px-3" onClick={exportToExcel}>
            <span className="sr-only">Export</span>
            <Download className="h-4 w-4" />
        </Button>
    )
}

const DataPage = () => {
    const { push } = useRouter();
    const exportTPData = trpc.exportTPData.useQuery();
    const fileName = 'Tricycle Permit Data';

    const routeToDashBoard = () => push("/dashboard")

    if (exportTPData.isLoading) {
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
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                            Link
                        </Label>
                        <Input
                            id="link"
                            defaultValue={fileName + ".xlsx"}
                            readOnly
                        />
                    </div>
                    <ExportExcelButton excelData={exportTPData.data} fileName={fileName} />
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

export default DataPage;
