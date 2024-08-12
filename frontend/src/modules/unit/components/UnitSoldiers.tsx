'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/lib/shadcn/ui/button';
import { DataTable } from '@/lib/shadcn/ui/datatable';
import { ArrowRight, PlusCircleIcon, StarIcon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';

import { BodyMuted, BodySmall, Heading4 } from '@/components/Typography';
import { RichSelector } from '@/components/rich-selector';
import { SoldierType } from '@/modules/soldier/types/Soldier';
import { FC, useState } from 'react';
import { useUnit } from '../hooks';
const makeMemberColumns: (
	promote: (soldierId: string) => void,
	removeSoldier: (soldierId: string) => void
) => ColumnDef<SoldierType>[] = (promote, removeSoldier) => [
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
		id: 'actions',
		cell: ({ row }) => {
			const soldier = row.original;

			return (
				<div className="flex flex-row gap-1 justify-end">
					<Button
						size="sm"
						variant={'destructive'}
						onClick={() => {
							removeSoldier(soldier.id);
						}}
					>
						<Trash2Icon size={16} />
					</Button>
					<Button
						size="sm"
						variant={'secondary'}
						onClick={() => {
							promote(soldier.id);
						}}
					>
						<StarIcon size={16} />
					</Button>
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
const leaderColumns: ColumnDef<SoldierType>[] = [
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

export const UnitSoldiers: FC<{ unitId: string }> = ({ unitId }) => {
	const {
		soldiers,
		isLoading,
		unit,
		availableSoldiers,
		addSoldiers,
		makeSoldierLeader,
		removeSoldier,
	} = useUnit(unitId);

	const leader = soldiers.find((s) => s.id === unit?.leaderId);
	const members = soldiers.filter((s) => s.id !== unit?.leaderId);

	const [selectedSoldierIds, setSelectedSoldierIds] = useState<string[]>([]);

	const handleAddSoldiers = () => {
		addSoldiers(selectedSoldierIds);
	};

	return (
		<>
			<div className="flex flex-col gap-4">
				<Heading4>Leader</Heading4>
				<DataTable
					columns={leaderColumns}
					data={leader ? [leader] : []}
					loading={isLoading}
				/>
			</div>
			<div className="flex flex-col gap-4">
				<div className="flex flex-row justify-between items-center">
					<Heading4>Direct Members</Heading4>
					<div className="flex flex-row gap-2 max-w-72">
						<RichSelector
							data={availableSoldiers}
							identifier={'id'}
							displayKey={'name'}
							row={(soldier) => (
								<>
									<BodySmall>
										{soldier.rank} {soldier.name}
									</BodySmall>
									<BodyMuted>{soldier.id}</BodyMuted>
								</>
							)}
							selectedIds={selectedSoldierIds}
							placeholder="Add soldiers..."
							onChange={(ids) => {
								setSelectedSoldierIds(ids);
							}}
							multiselect
						/>
						<Button variant={'secondary'} onClick={handleAddSoldiers}>
							Add
							<PlusCircleIcon size={20} />
						</Button>
					</div>
				</div>
				<DataTable
					columns={makeMemberColumns(makeSoldierLeader, removeSoldier)}
					data={members}
					loading={isLoading}
				/>
			</div>
		</>
	);
};
