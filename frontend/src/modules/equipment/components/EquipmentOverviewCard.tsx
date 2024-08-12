'use client';

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/lib/shadcn/ui/card';
import Link from 'next/link';
import { useEquipments } from '../hooks';

export const EquipmentOverviewCard = () => {
	const { equipments } = useEquipments();

	return (
		<Link href="/equipment">
			<Card clickable>
				<CardHeader>
					<CardTitle>Equipment</CardTitle>
					<CardDescription>
						There is {equipments.length} equipment.
					</CardDescription>
				</CardHeader>
			</Card>
		</Link>
	);
};
