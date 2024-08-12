'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/lib/shadcn/ui/button';
import { DataTable } from '@/lib/shadcn/ui/datatable';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useSoldiers } from '../hooks';
import { SoldierType } from '../types/Soldier';

export const columns: ColumnDef<SoldierType>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'rank',
		header: 'Rank',
	},
	{
		accessorKey: 'class',
		header: 'Class',
	},
	{
		accessorKey: 'status',
		header: 'Status',
	},
	{
		accessorKey: 'unitId',
		header: 'Unit ID',
	},
	{
		id: 'action-open',
		cell: ({ row }) => {
			const soldier = row.original;

			return (
				<div className="flex flex-row gap-1 justify-end">
					<Link href={`/soldier/${soldier.id}`}>
						<Button size="sm" variant={'secondary'}>
							<ArrowRight className="h-4 w-4" />
						</Button>
					</Link>
				</div>
			);
		},
	},
];

export const SoldiersTable = () => {
	const { soldiers, isLoading } = useSoldiers();

	return <DataTable columns={columns} data={soldiers} loading={isLoading} />;
};
