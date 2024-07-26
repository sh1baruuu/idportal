import Image from "next/image";

const NoMatches: React.FC = () => {
    return (
        <div className='flex items-center gap-3 pt-10 justify-center flex-col h-[55dvh] md:h-[50dvh]'>
            <Image
                className='opacity-20 grayscale'
                src='/assets/no-matches.png'
                alt=''
                width={110}
                height={110}
            />
            <div>
                <p className='text-gray-500 text-center pb-2 font-medium text-sm'>
                    Whoops, no matches
                </p>
                <p className='text-gray-400 text-center text-xs'>
                    We couldn&apos;t find any search results. <br />
                    Give it another go
                </p>
            </div>
        </div>
    );
};

export default NoMatches;
