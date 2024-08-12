'use client';

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/lib/shadcn/ui/card';
import Link from 'next/link';
import { useSoldiers } from '../hooks';

export const SoldiersOverviewCard = () => {
	const { soldiers } = useSoldiers();
	return (
		<Link href="/soldier">
			<Card clickable>
				<CardHeader>
					<CardTitle>Soldiers</CardTitle>
					<CardDescription>
						There are {soldiers.length} soldiers.
					</CardDescription>
				</CardHeader>
			</Card>
		</Link>
	);
};
