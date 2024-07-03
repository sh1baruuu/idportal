export interface PaymentStatuses {
    label: string;
    value: string;
}

export const paymentStatuses: PaymentStatuses[] = [
    { label: 'Paid', value: 'paid' },
    { label: 'Unpaid', value: 'unpaid' },
    { label: 'N/A', value: 'notApplicable' }
]