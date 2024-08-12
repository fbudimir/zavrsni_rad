import { useUnit } from '@/modules/unit/hooks';
import { FC } from 'react';
import { InfoCard } from '../../dashboard/components/InfoCard';
import { SoldierType } from '../types/Soldier';

export const SoldierDetails: FC<{ soldier: SoldierType }> = ({ soldier }) => {
	const { unit: unitMember } = useUnit(soldier.unitId);
	const { unit: leadsUnit } = useUnit(soldier.leadsUnit?.id);

	return (
		<>
			<div className="grid grid-cols-2 gap-2">
				<InfoCard label="Name" value={soldier.name} />
				<InfoCard label="Rank" value={soldier.rank} />
				<InfoCard label="Class" value={soldier.class.toString()} />
				<InfoCard label="Status" value={soldier.status} />
			</div>
			<div className="grid grid-cols-2 gap-2">
				{/* {soldier.unitId && unitMember && (
					<InfoCard label="Unit Member" value={unitMember.name} />
				)} */}
				{soldier.leadsUnit ? (
					<InfoCard
						href={`/unit/${soldier.leadsUnit.id}`}
						label="Leads Unit"
						value={leadsUnit ? leadsUnit.name : soldier.leadsUnit.id}
					/>
				) : soldier.unitId ? (
					<InfoCard
						href={`/unit/${soldier.unitId}`}
						label="Unit Member"
						value={unitMember ? unitMember.name : soldier.unitId}
					/>
				) : (
					<></>
				)}
			</div>
		</>
	);
};
