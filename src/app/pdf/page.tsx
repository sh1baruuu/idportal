"use client";

import { PDFViewer } from '@react-pdf/renderer'
import MyDocument from '../dashboard/users/_document'
import { trpc } from '../_trpc/client';

function page() {
    const { data } = trpc.exportTPData.useQuery()

  return (
    <PDFViewer className='h-screen w-screen'>
        <MyDocument data={data} />
    </PDFViewer>
    )
}

export default page