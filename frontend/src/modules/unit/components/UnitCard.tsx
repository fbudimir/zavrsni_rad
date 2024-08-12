import { Card, CardDescription, CardHeader } from '@/lib/shadcn/ui/card';
import Link from 'next/link';
import { FC } from 'react';
import { UnitType } from '../types/Unit';

export const UnitCard: FC<{ unit: Pick<UnitType, 'id' | 'name'> }> = ({
	unit,
}) => {
	return (
		<Link href={`/unit/${unit.id}`}>
			<Card>
				<CardHeader>
					<CardDescription>{unit.name}</CardDescription>
				</CardHeader>
			</Card>
		</Link>
	);
};
