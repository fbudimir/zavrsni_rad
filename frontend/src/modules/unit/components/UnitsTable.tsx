'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/lib/shadcn/ui/button';
import { DataTable } from '@/lib/shadcn/ui/datatable';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useUnits } from '../hooks';
import { UnitType } from '../types/Unit';

export const columns: ColumnDef<UnitType>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
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
		accessorKey: 'type',
		header: 'Type',
	},
	{
		id: 'action-open',
		cell: ({ row }) => {
			const unit = row.original;

			return (
				<div className="flex flex-row gap-1 justify-end">
					<Link href={`/unit/${unit.id}`}>
						<Button size="sm" variant={'secondary'}>
							<ArrowRight className="h-4 w-4" />
						</Button>
					</Link>
				</div>
			);
		},
	},
];

export const UnitsTable = () => {
	const { units, isLoading } = useUnits();

	return <DataTable columns={columns} data={units} loading={isLoading} />;
};
