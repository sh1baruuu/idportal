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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import CustomInputMessage from './CustomInputMessage';
import { resetUserPassword } from '@/services/firebaseAuthService';
import { ToastAction } from '@/components/ui/toast';
import { toast } from '@/components/ui/use-toast';
import Spinner from '@/components/common/Spinner';
import { ForgotPasswordFormSchema } from '@/types/schema';
import { ForgotPasswordFormData } from '@/types';

interface Props {
    toggleModal: () => void;
    open: boolean;
}

const ForgotPasswordDialog: React.FC<Props> = ({ toggleModal, open }) => {
    const [isSending, setIsSending] = useState<boolean>(false);

    const { register, handleSubmit, formState: { errors }, setError, reset } = useForm<ForgotPasswordFormData>({
        defaultValues: {
            email: "",
        },
        resolver: zodResolver(ForgotPasswordFormSchema),
    });

    useEffect(() => reset(), [open])

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsSending(true);
        try {
            await resetUserPassword(data.email);
            toast({
                title: "Email Sent Successfully",
                description: "We've sent you an email with a link to reset your password.",
                action: (
                    <ToastAction altText="Check your email for the reset link">Done</ToastAction>
                ),
            })

            toggleModal();
            reset();

        } catch (error: any) {
            if (error.code === "auth/user-not-found") {
                setError("email", { type: "manual", message: "User not found" });
            } else if (error.code === "auth/too-many-requests") {
                setError("email", { type: "manual", message: "Too may requests. Please try again later." });
            } else {
                setError("email", { type: "manual", message: error.message });
            }
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Dialog onOpenChange={toggleModal} open={open}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Forgot password?
                    </DialogTitle>
                    <DialogDescription>
                        Enter your email address in the form below and we
                        will send you a link to reset your password
                    </DialogDescription>
                </DialogHeader>
                <form>
                    <Label className='sr-only'>Email Address</Label>
                    <Input type='email' placeholder='Email adress' className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""} {...register('email')} />
                    {errors.email && <CustomInputMessage message={errors.email.message} />}
                </form>
                <DialogFooter className='grid md:grid-cols-2'>
                    <Button disabled={isSending} variant="secondary" onClick={toggleModal}>Cancel</Button>
                    <Button disabled={isSending} onClick={handleSubmit(onSubmit)}>
                        {isSending ? <Spinner /> : 'Confirm'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ForgotPasswordDialog
