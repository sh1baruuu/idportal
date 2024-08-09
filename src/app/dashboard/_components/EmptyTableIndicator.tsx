import NoData from './NoData';
import NoMatches from './NoMatches';

interface Props {
    total: number;
    search: string | null;
    isLoading: boolean;
}

const EmptyTableIndicator: React.FC<Props> = ({ isLoading, total, search }) => {
    if (isLoading) return null;
    
    if (!search && total == 0) {
        return <NoData />;
    }

    if (search && total == 0) {
        return <NoMatches />;
    }

    return null;
};

export default EmptyTableIndicator;
