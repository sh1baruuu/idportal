import NoData from './NoData';
import NoMatches from './NoMatches';

interface Props {
    total: number;
    search: string | null;
    isLoading: boolean;
}

const EmptyTableIndicator: React.FC<Props> = ({ isLoading, total, search }) => {
    return (
        !isLoading &&
        (search === '' || (search === null && total === 0) ? (
            <NoData />
        ) : search !== '' && total == 0 ? (
            <NoMatches />
        ) : null)
    );
};

export default EmptyTableIndicator;
