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
import { SoldierDetails } from '../components/SoldierDetails';
import { useSoldier } from '../hooks';

export const SoldierPage: FC<{ id: string }> = ({ id }) => {
	const { soldier, remove } = useSoldier(id);

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
									title: 'Soldiers',
									href: '/soldier',
								},
								{
									title: soldier ? soldier.name : id,
									href: `/soldier/${id}`,
								},
							]}
						/>
						<PageHeaderTitle>
							{soldier ? soldier.name : 'Soldier'}
						</PageHeaderTitle>
						<PageHeaderDescription>{id}</PageHeaderDescription>
					</PageHeaderContent>
					<PageHeaderActions>
						<Button variant={'destructive'} onClick={remove}>
							Delete
						</Button>
						<Link href={`/soldier/${id}/edit`}>
							<Button>Edit</Button>
						</Link>
					</PageHeaderActions>
				</PageHeader>

				{soldier && <SoldierDetails soldier={soldier} />}
			</div>
		</>
	);
};
