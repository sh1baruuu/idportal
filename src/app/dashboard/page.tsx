import DashboardCards from './_components/DashboardCards';
import RecentActionsCard from './_components/RecentActionsCard';
import RecentApplicantCard from './_components/RecentApplicantCard';

export default function DashboardPage() {
    return (
        <main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8'>
            <DashboardCards />
            <div className='grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3'>
                <RecentApplicantCard />
                <RecentActionsCard />
            </div>
        </main>
    );
}
