import * as Filesaver from "file-saver";
import { File } from 'lucide-react';
import XLSX from "sheetjs-style";
import { Button } from "./ui/button";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    excelData: any;
    fileName: string;
}

const ExportExcelButton: React.FC<Props> = ({ excelData, fileName, ...props}) => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;chartset=UTF-8';
    const fileExtenstion = '.xlsx';

    const exportToExcel = async () => {
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        Filesaver.saveAs(data, fileName + fileExtenstion);
    }

    return (
        <Button
            size='sm'
            variant='outline'
            className='h-7 gap-1'
            onClick={exportToExcel}
            {...props}
        >
            <File className='h-3.5 w-3.5' />
            <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                Export
            </span>
        </Button>
    )
}

export default ExportExcelButton;
