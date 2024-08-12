import { useSoldier } from '@/modules/soldier/hooks';
import { FC } from 'react';
import { InfoCard } from '../../dashboard/components/InfoCard';
import { useUnit } from '../hooks';
import { UnitType } from '../types/Unit';

export const UnitDetails: FC<{ unit: UnitType }> = ({ unit }) => {
	const { unit: parentUnit } = useUnit(unit.parentUnitId || undefined);
	const { soldier: leader } = useSoldier(unit.leaderId);

	return (
		<>
			<div className="grid grid-cols-2 gap-2">
				<InfoCard label="Name" value={unit.name} />
				{leader &&
					(leader ? (
						<InfoCard
							href={`/soldier/${unit.leaderId}`}
							label="Unit Leader"
							value={leader.name + ', ' + leader.rank}
						/>
					) : (
						<InfoCard
							href={`/soldier/${unit.leaderId}`}
							label="Unit Leader"
							value={unit.leaderId}
						/>
					))}
				{unit.parentUnitId && parentUnit ? (
					<InfoCard
						label="Parent Unit"
						value={parentUnit.name}
						href={`/unit/${unit.parentUnitId}`}
					/>
				) : (
					<InfoCard label="Parent Unit" value={'Not Assigned'} />
				)}
				<InfoCard label="Type" value={unit.type} />
				<InfoCard label="Status" value={unit.status} />
			</div>
			{unit.nPosition !== null &&
				unit.ePosition !== null &&
				unit.nPosition !== undefined &&
				unit.ePosition !== undefined && (
					<div className="grid grid-cols-2 gap-2">
						<InfoCard label="North Position" value={unit.nPosition} />
						<InfoCard label="East Position" value={unit.ePosition} />
					</div>
				)}
		</>
	);
};
