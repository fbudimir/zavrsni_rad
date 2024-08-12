'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/lib/shadcn/ui/button';
import { DataTable } from '@/lib/shadcn/ui/datatable';
import { ArrowRightIcon, PlusCircleIcon, Trash2Icon } from 'lucide-react';

import { BodyMuted, BodySmall, Heading4 } from '@/components/Typography';
import { RichSelector } from '@/components/rich-selector';
import { EquipmentType } from '@/modules/equipment/types/Equipment';
import Link from 'next/link';
import { FC, useState } from 'react';
import { useUnit } from '../hooks';

export const makeColumns: (
	removeEquipment: (equipmentId: string) => void
) => ColumnDef<EquipmentType>[] = (removeEquipment) => [
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'description',
		header: 'Description',
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
			const equipment = row.original;

			return (
				<div className="flex flex-row gap-1 justify-end">
					<Button
						size="sm"
						variant={'destructive'}
						onClick={() => removeEquipment(equipment.id)}
					>
						<Trash2Icon size={16} />
					</Button>
					<Link href={`/equipment/${equipment.id}`}>
						<Button size="sm" variant={'secondary'}>
							<ArrowRightIcon size={16} />
						</Button>
					</Link>
				</div>
			);
		},
	},
];

export const UnitEquipments: FC<{ unitId: string }> = ({ unitId }) => {
	const {
		isLoading,
		subunits,
		addEquipment,
		removeEquipment,
		equipments,
		eligibleEquipment,
	} = useUnit(unitId);

	const [selectedSoldierIds, setSelectedSoldierIds] = useState<string[]>([]);

	const handleAddSubUnit = () => {
		addEquipment(selectedSoldierIds);
	};

	return (
		<>
			<div className="flex flex-col gap-4">
				<div className="flex flex-row justify-between items-center">
					<Heading4>Equipment</Heading4>
					<div className="flex flex-row gap-2 max-w-72">
						<RichSelector
							data={eligibleEquipment}
							identifier={'id'}
							displayKey={'name'}
							row={(equipment) => (
								<>
									<BodySmall>{equipment.name}</BodySmall>
									<BodyMuted>
										{equipment.type} - {equipment.id}
									</BodyMuted>
								</>
							)}
							selectedIds={selectedSoldierIds}
							placeholder="Add equipment..."
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
					columns={makeColumns(removeEquipment)}
					data={equipments}
					loading={isLoading}
				/>
			</div>
		</>
	);
};
