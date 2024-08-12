'use client';

import { Button } from '@/lib/shadcn/ui/button';
import { Breadcrumbs } from '@/modules/dashboard/components/Breadcrumbs';
import {
	PageHeader,
	PageHeaderActions,
	PageHeaderContent,
	PageHeaderDescription,
	PageHeaderTitle,
} from '@/modules/dashboard/components/PageHeader';
import Link from 'next/link';
import { FC } from 'react';
import { EquipmentDetails } from '../components/EquipmentDetails';
import { useEquipment } from '../hooks';

export const EquipmentPage: FC<{ id: string }> = ({ id }) => {
	const { equipment, remove } = useEquipment(id);

	return (
		<>
			<div className="flex flex-col gap-10">
				<PageHeader>
					<PageHeaderContent>
						<Breadcrumbs
							links={[
								{
									title: 'Dashboard',
									href: '/',
								},
								{
									title: 'Equipment',
									href: '/equipment',
								},
								{
									title: equipment ? equipment.name : id,
									href: `/equipment/${id}`,
								},
							]}
						/>
						<PageHeaderTitle>
							{equipment ? equipment.name : 'Equipment'}
						</PageHeaderTitle>
						<PageHeaderDescription>{id}</PageHeaderDescription>
					</PageHeaderContent>
					<PageHeaderActions>
						<Button variant={'destructive'} onClick={remove}>
							Delete
						</Button>
						<Link href={`/equipment/${id}/edit`}>
							<Button>Edit</Button>
						</Link>
					</PageHeaderActions>
				</PageHeader>

				{equipment && <EquipmentDetails equipment={equipment} />}
			</div>
		</>
	);
};
