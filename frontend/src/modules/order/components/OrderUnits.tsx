'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/lib/shadcn/ui/button';
import { DataTable } from '@/lib/shadcn/ui/datatable';
import { ArrowRightIcon, PlusCircleIcon, Trash2Icon } from 'lucide-react';

import { BodyMuted, BodySmall, Heading4 } from '@/components/Typography';
import { RichSelector } from '@/components/rich-selector';
import { useUnits } from '@/modules/unit/hooks';
import { UnitType } from '@/modules/unit/types/Unit';
import Link from 'next/link';
import { FC, useState } from 'react';
import { useOrder } from '../hooks';

export const makeColumns: (
	removeUnit: (unitId: string) => void
) => ColumnDef<UnitType>[] = (removeUnit) => [
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
					<Button
						size="sm"
						variant={'destructive'}
						onClick={() => removeUnit(unit.id)}
					>
						<Trash2Icon size={16} />
					</Button>
					<Link href={`/unit/${unit.id}`}>
						<Button size="sm" variant={'secondary'}>
							<ArrowRightIcon size={16} />
						</Button>
					</Link>
				</div>
			);
		},
	},
];

export const OrderUnits: FC<{ unitId: string }> = ({ unitId }) => {
	const { isLoading, units, addUnits, removeUnit } = useOrder(unitId);
	const { availableUnits } = useUnits();

	const [selectedUnits, setSelectedUnits] = useState<string[]>([]);

	const handleAddSubUnit = () => {
		addUnits(selectedUnits);
	};

	const removeUnitHandler = (unitId: string) => {
		removeUnit(unitId);
	};

	return (
		<>
			<div className="flex flex-col gap-4">
				<div className="flex flex-row justify-between items-center">
					<Heading4>Subunits</Heading4>
					<div className="flex flex-row gap-2 max-w-72">
						<RichSelector
							data={availableUnits.filter(
								(unit) => !units.find((u) => u.id === unit.id)
							)}
							identifier={'id'}
							displayKey={'name'}
							row={(unit) => (
								<>
									<BodySmall>{unit.name}</BodySmall>
									<BodyMuted>
										{unit.type} - {unit.id}
									</BodyMuted>
								</>
							)}
							selectedIds={selectedUnits}
							placeholder="Add subunits..."
							onChange={(ids) => {
								setSelectedUnits(ids);
							}}
							multiselect
						/>
						<Button variant={'secondary'} onClick={handleAddSubUnit}>
							Add
							<PlusCircleIcon size={20} />
						</Button>
					</div>
				</div>
				<DataTable
					columns={makeColumns(removeUnitHandler)}
					data={units}
					loading={isLoading}
				/>
			</div>
		</>
	);
};
