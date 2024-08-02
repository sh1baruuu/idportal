import Image from 'next/image'

const EmptyRecentAction = () => {
  return (
    <div className='flex items-center gap-3 justify-center flex-col h-[30dvh] md:h-[30dvh]'>
    <Image
        className='opacity-20 grayscale-[10%]'
        src='/assets/folder.png'
        alt=''
        width={80}
        height={80}
    />
    <div>
        <p className='text-gray-500 text-center pb-2 font-medium text-sm'>
        No Recent Action
        </p>
        <p className='text-gray-400 text-center text-xs'>
        We couldn&apos;t find any recent actions.
        </p>
    </div>
</div>
  )
}

export default EmptyRecentAction