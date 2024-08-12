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
import { UnitDetails } from '../components/UnitDetails';
import { UnitEquipments } from '../components/UnitEquipment';
import { UnitOrders } from '../components/UnitOrders';
import { UnitSoldiers } from '../components/UnitSoldiers';
import { UnitSubunits } from '../components/UnitSubunits';
import { useUnit } from '../hooks';

export const UnitPage: FC<{ id: string }> = ({ id }) => {
	const { unit, remove } = useUnit(id);

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
									title: 'Units',
									href: '/unit',
								},
								{
									title: unit ? unit.name : id,
									href: `/unit/${id}`,
								},
							]}
						/>
						<PageHeaderTitle>{unit ? unit.name : 'Unit'}</PageHeaderTitle>
						<PageHeaderDescription>{id}</PageHeaderDescription>
					</PageHeaderContent>
					<PageHeaderActions>
						<Button variant={'destructive'} onClick={remove}>
							Delete
						</Button>
						<Link href={`/unit/${id}/edit`}>
							<Button>Edit</Button>
						</Link>
					</PageHeaderActions>
				</PageHeader>

				{unit && <UnitDetails unit={unit} />}

				<UnitSoldiers unitId={id} />

				<UnitSubunits unitId={id} />

				<UnitEquipments unitId={id} />

				<UnitOrders unitId={id} />
			</div>
		</>
	);
};
