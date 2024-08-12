'use client';

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/lib/shadcn/ui/card';
import Link from 'next/link';
import { useUnits } from '../hooks';

export const UnitsOverviewCard = () => {
	const { units } = useUnits();
	return (
		<Link href="/unit">
			<Card clickable>
				<CardHeader>
					<CardTitle>Units</CardTitle>
					<CardDescription>There are {units.length} units.</CardDescription>
				</CardHeader>
			</Card>
		</Link>
	);
};
