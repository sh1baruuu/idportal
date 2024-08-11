'use client';

import { useAuth } from '@/context/AuthProvider';
import { useKeepMeLoggedInStore } from '@/zustand';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import { MdLock, MdPerson } from 'react-icons/md';
import Spinner from '../common/Spinner';
import { LogInCredential } from '@/types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import ForgotPasswordDialog from '@/app/dashboard/_components/ForgotPasswordDialog';

const emptyUserCredential: LogInCredential = {
    email: '',
    password: '',
};

const SignInForm = () => {
    const router = useRouter();
    const { onLogIn } = useAuth();
    const [logInCredential, setLogInCredential] =
        useState<LogInCredential>(emptyUserCredential);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const { toggleKeepMeLoggedIn, keepMeLoggedIn } = useKeepMeLoggedInStore();
    const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
    const [ forgotPasswordmodalIsOpen, setForgotPasswordmodalIsOpen ]= useState<boolean>(false);


    const toggleShowPassword = (): void => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setLogInCredential((prev: LogInCredential) => ({
            ...prev,
            [name]: value,
        }));
    };

    const toggleForgotPasswordModal = () => setForgotPasswordmodalIsOpen(prev => !prev);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement> ): Promise<void> => {
        e.preventDefault();
        try {
            setIsLoggingIn(true);
            await toast.promise(onLogIn(logInCredential), {
                loading: 'Logging in...',
                success: <b className='text-sm'>Logged in successfully!</b>,
                error: (err) => <span className='text-sm'>{err.message}</span>,
            });
            router.push('/dashboard');
        } catch (error) {
            return;
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <>

            <form
                className='flex p-2  flex-col gap-4 w-[340px] rounded-2xl'
                onSubmit={handleSubmit}
            >
                <div className='relative w-full'>
                    <MdPerson className='absolute left-4 top-2/4 -translate-y-2/4 text-gray-400 text-lg' />
                    <Input
                        required
                        type='email'
                        name='email'
                        placeholder='Email'
                        autoComplete='on'
                        onChange={handleChange}
                        value={logInCredential.email}
                        maxLength={254}
                        className='border-slate-300 pl-11 pr-6'
                    />
                </div>
                <div className='relative w-full'>
                    <MdLock className='absolute left-4  top-2/4 -translate-y-2/4 text-gray-400' />
                    <Input
                        required
                        type={showPassword ? 'text' : 'password'}
                        name='password'
                        placeholder='Password'
                        autoComplete='on'
                        onChange={handleChange}
                        value={logInCredential.password}
                        maxLength={64}
                        className='border-slate-300 pl-11 pr-6'
                    />
                    <button
                        type='button'
                        onClick={toggleShowPassword}
                        className='absolute right-5 text-gray-400 top-2/4 ark:text-muted-foreground -translate-y-2/4'
                    >
                        {showPassword ? <LuEye /> : <LuEyeOff />}
                    </button>
                </div>

                <div className='flex py-1 select-none w-fit'>
                    <input
                        type='checkbox'
                        name='keepMeLoggedIn'
                        id='keepMeLoggedIn'
                        onChange={toggleKeepMeLoggedIn}
                        checked={keepMeLoggedIn}
                        className='ml-2 mr-1'
                    />
                    <Label
                        className='text-xs'
                        htmlFor='keepMeLoggedIn'
                    >
                        Keep me logged in
                    </Label>
                </div>
                <Button
                    type='submit'
                    disabled={isLoggingIn}
                >
                    {isLoggingIn ? <Spinner /> : 'Log in'}
                </Button>
                <p onClick={toggleForgotPasswordModal} className='text-xs select-none cursor-pointer text-blue-600 hover:underline w-full text-center font-bold'>
                    Forgot password?
                </p>
            </form>
            <ForgotPasswordDialog open={forgotPasswordmodalIsOpen} toggleModal={toggleForgotPasswordModal} />
        </>
    );
};

export default SignInForm;
