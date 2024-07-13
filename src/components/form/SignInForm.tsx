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

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
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
        <form
            className='flex p-2  flex-col gap-4 w-[340px] rounded-2xl'
            onSubmit={handleSubmit}
        >
            <div className='relative w-full'>
                <MdPerson className='absolute left-4     top-2/4 -translate-y-2/4 text-gray-400 text-lg' />
                <input
                    required
                    type='email'
                    name='email'
                    placeholder='Email'
                    autoComplete='on'
                    onChange={handleChange}
                    value={logInCredential.email}
                    maxLength={254}
                    className='border border-gray-400 rounded-full w-full focus:outline-blue-400 text-sm py-[10px] pl-11 pr-6 text-gray-800'
                />
            </div>
            <div className='relative w-full'>
                <MdLock className='absolute left-4  top-2/4 -translate-y-2/4 text-gray-400' />
                <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    placeholder='Password'
                    autoComplete='on'
                    onChange={handleChange}
                    value={logInCredential.password}
                    maxLength={64}
                    className='border border-gray-400 rounded-full w-full focus:outline-blue-400 text-sm py-[10px] px-11 text-gray-800'
                />
                <button
                    type='button'
                    onClick={toggleShowPassword}
                    className='absolute right-5 text-gray-700 top-2/4 -translate-y-2/4'
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
                <label
                    className='text-xs text-gray-800 font-semibold'
                    htmlFor='keepMeLoggedIn'
                >
                    Keep me logged in
                </label>
            </div>
            <button
                type='submit'
                disabled={isLoggingIn}
                className={`flex items-center justify-center transition-all rounded-full select-none  text-white text-sm py-2 mt-2 ${isLoggingIn ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600'}`}
            >
                {isLoggingIn ? <Spinner /> : 'Log in'}
            </button>
            <p className='text-xs select-none text-blue-600 w-full text-center font-bold'>
                Forgot password?
            </p>
        </form>
    );
};

export default SignInForm;
