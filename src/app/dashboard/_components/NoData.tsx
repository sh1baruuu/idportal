import Image from "next/image";

const NoData: React.FC = () => {
    return (
        <div className='flex items-center pt-10 gap-3 justify-center flex-col h-[55dvh] md:h-[50dvh]'>
            <Image
                className='opacity-20 grayscale'
                src='/assets/no-data.png'
                alt=''
                width={110}
                height={110}
            />
            <div>
                <p className='text-gray-500 text-center pb-2 font-medium text-sm'>
                    No data availbale
                </p>
                <p className='text-gray-400 text-center text-xs'>
                    There is no data to show you <br />
                    right now
                </p>
            </div>
        </div>
    );
};

export default NoData;
