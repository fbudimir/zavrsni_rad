import { useUnit } from '@/modules/unit/hooks';
import { FC } from 'react';
import { InfoCard } from '../../dashboard/components/InfoCard';
import { EquipmentType } from '../types/Equipment';

export const EquipmentDetails: FC<{ equipment: EquipmentType }> = ({
	equipment,
}) => {
	const { unit } = useUnit(equipment.assignedToId!);

	return (
		<div className="grid grid-cols-2 gap-2">
			<InfoCard label="Name" value={equipment.name} />
			<InfoCard label="Type" value={equipment.type} />
			<InfoCard label="Description" value={equipment.description} />
			<InfoCard label="Status" value={equipment.status} />
			{unit ? (
				<InfoCard
					label="Assinged Unit"
					value={unit.name}
					href={`/unit/${unit.id}`}
				/>
			) : (
				<InfoCard label="Assinged Unit" value={'No unit'} />
			)}
		</div>
	);
};
