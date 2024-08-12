'use client';

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/lib/shadcn/ui/card';
import Link from 'next/link';
import { useOrders } from '../hooks';

export const OrdersOverviewCard = () => {
	const { orders } = useOrders();
	return (
		<Link href="/order">
			<Card clickable>
				<CardHeader>
					<CardTitle>Orders</CardTitle>
					<CardDescription>There are {orders.length} orders.</CardDescription>
				</CardHeader>
			</Card>
		</Link>
	);
};
