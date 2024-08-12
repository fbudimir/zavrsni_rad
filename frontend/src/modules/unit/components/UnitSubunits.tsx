'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/lib/shadcn/ui/button';
import { DataTable } from '@/lib/shadcn/ui/datatable';
import { ArrowRightIcon, PlusCircleIcon, Trash2Icon } from 'lucide-react';

import { BodyMuted, BodySmall, Heading4 } from '@/components/Typography';
import { RichSelector } from '@/components/rich-selector';
import Link from 'next/link';
import { FC, useState } from 'react';
import { useUnit } from '../hooks';
import { UnitType } from '../types/Unit';

export const makeColumns: (
	removeSubUnit: (unitId: string) => void
) => ColumnDef<UnitType>[] = (removeSubUnit) => [
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
						onClick={() => removeSubUnit(unit.id)}
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

export const UnitSubunits: FC<{ unitId: string }> = ({ unitId }) => {
	const { isLoading, subunits, eligibleSubUnits, addSubUnit, removeSubUnit } =
		useUnit(unitId);

	const [selectedSoldierIds, setSelectedSoldierIds] = useState<string[]>([]);

	const handleAddSubUnit = () => {
		addSubUnit(selectedSoldierIds);
	};

	return (
		<>
			<div className="flex flex-col gap-4">
				<div className="flex flex-row justify-between items-center">
					<Heading4>Subunits</Heading4>
					<div className="flex flex-row gap-2 max-w-72">
						<RichSelector
							data={eligibleSubUnits}
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
							selectedIds={selectedSoldierIds}
							placeholder="Add subunits..."
							onChange={(ids) => {
								setSelectedSoldierIds(ids);
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
					columns={makeColumns(removeSubUnit)}
					data={subunits}
					loading={isLoading}
				/>
			</div>
		</>
	);
};
