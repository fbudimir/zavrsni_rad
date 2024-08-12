'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/lib/shadcn/ui/button';
import { DataTable } from '@/lib/shadcn/ui/datatable';
import { formatDistance, subDays } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useOrders } from '../hooks';
import { OrderType } from '../types/Order';

export const columns: ColumnDef<OrderType>[] = [
	{
		accessorKey: 'description',
		header: 'Description',
	},
	{
		accessorKey: 'createdAt',
		header: 'Created At',
		cell: ({ row }) => {
			return formatDistance(
				subDays(new Date(row.original.createdAt), 3),
				new Date(),
				{
					addSuffix: true,
				}
			);
		},
	},
	{
		accessorKey: 'priority',
		header: 'Priority',
	},
	{
		accessorKey: 'status',
		header: 'Status',
	},
	{
		id: 'action-open',
		cell: ({ row }) => {
			const order = row.original;

			return (
				<div className="flex flex-row gap-1 justify-end">
					<Link href={`/order/${order.id}`}>
						<Button size="sm" variant={'secondary'}>
							<ArrowRight className="h-4 w-4" />
						</Button>
					</Link>
				</div>
			);
		},
	},
];

export const OrdersTable = () => {
	const { orders, isLoading } = useOrders();

	return <DataTable columns={columns} data={orders} loading={isLoading} />;
};
