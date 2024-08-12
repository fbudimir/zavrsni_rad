import { EquipmentOverviewCard } from '@/modules/equipment/components/EquipmentOverviewCard';
import { OrdersOverviewCard } from '@/modules/order/components/OrdersOverviewCard';
import { SoldiersOverviewCard } from '@/modules/soldier/components/SoldiersOverviewCard';
import { UnitsOverviewCard } from '@/modules/unit/components/UnitsOverviewCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import {
	PageHeader,
	PageHeaderContent,
	PageHeaderTitle,
} from '../components/PageHeader';

export const DashboardHome = () => {
	return (
		<div className="flex flex-col gap-10">
			<PageHeader>
				<PageHeaderContent>
					<Breadcrumbs
						links={[
							{
								title: 'Dashboard',
								href: '/',
							},
						]}
					/>
					<PageHeaderTitle>Parnassus Dashboard</PageHeaderTitle>
				</PageHeaderContent>
			</PageHeader>
			<div className="grid grid-cols-2 gap-4">
				<OrdersOverviewCard />
				<UnitsOverviewCard />
				<SoldiersOverviewCard />
				<EquipmentOverviewCard />
			</div>
		</div>
	);
};
