export interface PaymentStatuses {
    label: string;
    value: string;
}

export const paymentStatuses: PaymentStatuses[] = [
    { label: 'Paid', value: 'paid' },
    { label: 'Not Paid', value: 'unpaid' },
    { label: '-', value: 'notApplicable' }
]



export function getPaymentStatusLabel(value: string): string | undefined {
    const option = paymentStatuses.find(option => option.value === value);
    return option?.label;
}

        
