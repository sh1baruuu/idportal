import SignInForm from '@/components/form/SignInForm';

export default function SignInPage() {

    return (
        <div className='flex flex-col items-center h-screen justify-center'>
            <div className='w-80 pb-8 select-none'>
                <h1 className='font-bold text-gray-800 text-center text-3xl tracking-wide' >Welcome to <span className='text-blue-700'>IDPortal</span></h1>
                <p className='text-gray-600 text-sm text-center py-2'>Fill the credentials below to log into IDPortal</p>
            </div>
            <SignInForm />
        </div>
    );
}


