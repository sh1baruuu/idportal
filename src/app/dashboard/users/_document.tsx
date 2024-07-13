"use client";


import { Button } from '@/components/ui/button';
import Barangay from '@/types/Barangay';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Create styles
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
});

// Create Document Component
const MyDocument = ({data}: {data: Barangay[] | undefined}) => {

    return (
        <Document>
            {data?.map(({name}) => {
                return (
                    <Page size='LETTER' style={styles.page}>
                        <View style={styles.section}>
                            <Text>{name.toUpperCase()}</Text>
                            <Button>Hello</Button>
                        </View>
                    </Page>
                );
            })}
        </Document>
    );
};

export default MyDocument;
