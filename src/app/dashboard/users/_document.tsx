"use client";

import { Button } from '@/components/ui/button';
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: 'white',
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
    qrCode: {
        width: 100,
        height: 100,
    }
});

const generateQRCode = async (text: string) => {
    try {
        const qrCodeDataUrl = await QRCode.toDataURL(text);
        return qrCodeDataUrl;
    } catch (error) {
        console.error('Error generating QR code:', error);
        return '';
    }
};

// Create Document Component
const MyDocument = ({data}: {data: any[] | undefined}) => {
    const [qrCodes, setQrCodes] = useState<string[]>([]);

    useEffect(() => {
        const generateQrCodes = async () => {
            if (data) {
                const qrCodePromises = data.map(({applicationNo}) => generateQRCode(`https://localhost:3000/dashboard/applicant?id=${applicationNo}`));
                const qrCodeResults = await Promise.all(qrCodePromises);
                setQrCodes(qrCodeResults);
            }
        };

        generateQrCodes();
    }, [data]);

    return (
        <Document>
            {data?.map(({name}, i) => (
                <Page size='LETTER' style={styles.page} key={i}>
                    <View style={styles.section}>
                        <Text>Name: {name}</Text>
                        <Button>Hello</Button>
                        {/* {qrCodes[i] && <Image src={qrCodes[i]} style={styles.qrCode} />} */}
                    </View>
                </Page>
            ))}
        </Document>
    );
};

export default MyDocument;
