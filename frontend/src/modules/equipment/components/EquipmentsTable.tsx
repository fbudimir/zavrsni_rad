'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/lib/shadcn/ui/button';
import { DataTable } from '@/lib/shadcn/ui/datatable';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEquipments } from '../hooks';
import { EquipmentType } from '../types/Equipment';
// import { useOrders } from '../hooks';
// import { OrderType } from '../types/Order';

export const columns: ColumnDef<EquipmentType>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'description',
		header: 'Description',
	},
	{
		accessorKey: 'type',
		header: 'Type',
	},
	{
		accessorKey: 'status',
		header: 'Status',
	},

	{
		id: 'action-open',
		cell: ({ row }) => {
			const equipment = row.original;

			return (
				<div className="flex flex-row gap-1 justify-end">
					<Link href={`/equipment/${equipment.id}`}>
						<Button size="sm" variant={'secondary'}>
							<ArrowRight className="h-4 w-4" />
						</Button>
					</Link>
				</div>
			);
		},
	},
];

export const EquipmentsTable = () => {
	const { equipments, isLoading } = useEquipments();

	return <DataTable columns={columns} data={equipments} loading={isLoading} />;
};
