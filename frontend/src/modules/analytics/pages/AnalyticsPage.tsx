import { Breadcrumbs } from '@/modules/dashboard/components/Breadcrumbs';
import {
	PageHeader,
	PageHeaderContent,
	PageHeaderTitle,
} from '@/modules/dashboard/components/PageHeader';
import AnalyticsCharts from '@/components/AnalyticsCharts';

export const AnalyticsPage = () => {
	return (
		<>
			<div className="flex flex-col gap-10">
				<PageHeader>
					<PageHeaderContent>
						<Breadcrumbs
							links={[
								{
									title: 'Dashboard',
									href: '/',
								},
								{
									title: 'Analytics',
									href: '/analytics',
								},
							]}
						/>
						<PageHeaderTitle>Analytics</PageHeaderTitle>
					</PageHeaderContent>
				</PageHeader>
				<div>
					<AnalyticsCharts />
				</div>
			</div>
		</>
	);
};
