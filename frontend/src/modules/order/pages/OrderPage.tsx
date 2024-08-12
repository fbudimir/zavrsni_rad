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
import Link from 'next/link';
import { FC } from 'react';
import { OrderDetails } from '../components/OrderDetails';
import { OrderUnits } from '../components/OrderUnits';
import { useOrder } from '../hooks';

export const OrderPage: FC<{ id: string }> = ({ id }) => {
	const { order, remove, units } = useOrder(id);

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
									title: 'Orders',
									href: '/order',
								},
								{
									title: order
										? order.description.substring(0, 16) +
										  (order.description.length > 16 ? '...' : '')
										: id,
									href: `/order/${id}`,
								},
							]}
						/>
						<PageHeaderTitle>
							{order ? order.description : 'Order'}
						</PageHeaderTitle>
						<PageHeaderDescription>{id}</PageHeaderDescription>
					</PageHeaderContent>
					<PageHeaderActions>
						<Button variant={'destructive'} onClick={remove}>
							Delete
						</Button>
						<Link href={`/order/${id}/edit`}>
							<Button>Edit</Button>
						</Link>
					</PageHeaderActions>
				</PageHeader>

				<OrderDetails order={order} />

				<OrderUnits unitId={id} />
			</div>
		</>
	);
};
