'use client';

import { Button } from '@/lib/shadcn/ui/button';
import { Breadcrumbs } from '@/modules/dashboard/components/Breadcrumbs';
import {
	PageHeader,
	PageHeaderActions,
	PageHeaderContent,
	PageHeaderDescription,
	PageHeaderTitle,
} from '@/modules/dashboard/components/PageHeader';
import { OrdersTable } from '../components/OrdersTable';
import { useOrders } from '../hooks';

export const OrdersOverviewPage = () => {
	const { create, isLoading } = useOrders();

	return (
		<div>
			<PageHeader>
				<PageHeaderContent>
					<Breadcrumbs
						links={[
							{
								title: 'Dashboard',
								href: '/',
							},
							{
								title: 'Orders',
								href: '/order',
							},
						]}
					/>
					<PageHeaderTitle>Orders</PageHeaderTitle>
					<PageHeaderDescription>Manage orders here</PageHeaderDescription>{' '}
				</PageHeaderContent>
				<PageHeaderActions>
					<Button onClick={create} loading={isLoading}>
						Add new
					</Button>
				</PageHeaderActions>
			</PageHeader>

			<OrdersTable />
		</div>
	);
};
