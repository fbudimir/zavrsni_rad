'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/lib/shadcn/ui/button';
import { DataTable } from '@/lib/shadcn/ui/datatable';
import { ArrowRightIcon } from 'lucide-react';

import { Heading4 } from '@/components/Typography';
import { OrderType } from '@/modules/order/types/Order';
import { formatDistance, subDays } from 'date-fns';
import Link from 'next/link';
import { FC } from 'react';
import { useUnitOrders } from '../hooks';

export const columns: ColumnDef<OrderType>[] = [
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
		accessorKey: 'description',
		header: 'Description',
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
							<ArrowRightIcon size={16} />
						</Button>
					</Link>
				</div>
			);
		},
	},
];

export const UnitOrders: FC<{ unitId: string }> = ({ unitId }) => {
	const { directActiveOrders, indirectActiveOrders, isLoading } =
		useUnitOrders(unitId);

	return (
		<>
			<div className="flex flex-col gap-4">
				<div className="flex flex-row justify-between items-center">
					<Heading4>Direct Active Orders</Heading4>
				</div>
				<DataTable
					columns={columns}
					data={directActiveOrders}
					loading={isLoading}
				/>
			</div>
			<div className="flex flex-col gap-4">
				<div className="flex flex-row justify-between items-center">
					<Heading4>Indirect Active Orders</Heading4>
				</div>
				<DataTable
					columns={columns}
					data={indirectActiveOrders}
					loading={isLoading}
				/>
			</div>
		</>
	);
};
