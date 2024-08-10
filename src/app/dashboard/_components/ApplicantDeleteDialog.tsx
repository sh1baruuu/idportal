import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface Props {
    onDelete: (applicantId: string, fullname: string) => Promise<void>;
    onOpenChange: () => void;
    open: boolean;
    description: string;
    id: string;
    name: string;
}

const ApplicantDeleteDialog: React.FC<Props> = ({
    onDelete,
    onOpenChange,
    open,
    description,
    id,
    name
}) => {
    return (
        <Dialog onOpenChange={onOpenChange} open={open}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Are you absolutely sure?
                    </DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose>Cancel</DialogClose>
                    <Button className='bg-destructive dark:text-white hover:bg-red-400' onClick={() => onDelete(id ?? "", name)}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ApplicantDeleteDialog;
