import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
    title: string;
    description: string;
}

const CardCustomHeader: React.FC<Props> = ({ title, description }) => {
    return (
        <CardHeader className='px-7'>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
    );
};

export default CardCustomHeader;
