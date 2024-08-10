import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { auth } from '@/config/firebaseConfig';
import { UpdatePasswordForm } from '@/types';
import { UpdatePasswordFormSchema } from '@/types/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogProps } from '@radix-ui/react-dialog';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

interface Props {
    toggleDialog: () => void;
    open: boolean;
}

const UpdatePasswordDialog: React.FC<Props> = ({ toggleDialog, open }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { register, handleSubmit, reset, formState: { errors }, setError } = useForm<UpdatePasswordForm>({
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        },
        resolver: zodResolver(UpdatePasswordFormSchema)
    });


    const onSubmit = async ({ newPassword, currentPassword }: UpdatePasswordForm) => {
        const user = auth.currentUser;
        const email = user?.email ?? "";

        if (user) {
            setIsLoading(true);
            const credentials = EmailAuthProvider.credential(email, currentPassword);
            try {
                await reauthenticateWithCredential(user, credentials);

                if (newPassword === currentPassword) {
                    throw new Error("auth/same-password");
                }

                await updatePassword(user, newPassword);

                toast({
                    title: 'Password Updated',
                    description: 'Your password has been successfully updated.',
                });

                toggleDialog();
                reset();

            } catch (error: any) {

                if (error.code === "auth/missing-password") {
                    setError("currentPassword", { type: "manual", message: "This field cannot be empty" });
                } else if (error.code === "auth/invalid-login-credentials" || error.code === "auth/invalid-credential") {
                    setError("currentPassword", { type: "manual", message: "Incorrect password. Please try again" });
                } else if (error.message === "auth/same-password") {
                    setError("newPassword", { type: "manual", message: "New password must be different from the current password" });
                } else if (error.code === "auth/too-many-requests") {
                    setError("currentPassword", { type: "manual", message: "Too many requests. Please try again later" });
                } else {
                    toast({
                        variant: 'destructive',
                        title: 'Uh oh! Something went wrong.',
                        description: 'There was an issue updating your password. Please try again.',
                    });
                }
            } finally {
                setIsLoading(false);
            }
        }

    };


    return (
        <Dialog onOpenChange={toggleDialog} open={open}>
            <DialogContent className="grid gap-4">
                <DialogHeader>
                    <DialogTitle>
                        Are you absolutely sure?
                    </DialogTitle>
                    <DialogDescription>
                        {/* Add any description here if needed */}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" {...register('currentPassword')} />
                    {errors.currentPassword && <span>{errors.currentPassword.message}</span>}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" {...register('newPassword')} />
                    {!errors.currentPassword && errors.newPassword && <span>{errors.newPassword.message}</span>}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" {...register('confirmPassword')} />
                    {!errors.newPassword && errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}
                </div>

                <DialogFooter>
                    <Button onClick={handleSubmit(onSubmit)} className="w-full">
                        {isLoading ? "Updating password..." : "Update Password"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default UpdatePasswordDialog
