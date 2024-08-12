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
import { UnitsTable } from '../components/UnitsTable';
import { useUnits } from '../hooks';

export const UnitsOverview = () => {
	const { create, isLoading } = useUnits();

	return (
		<div>
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
						]}
					/>
					<PageHeaderTitle>Units</PageHeaderTitle>
					<PageHeaderDescription>Manage units here</PageHeaderDescription>{' '}
				</PageHeaderContent>
				<PageHeaderActions>
					<Button onClick={create} loading={isLoading}>
						Add new
					</Button>
				</PageHeaderActions>
			</PageHeader>

			<UnitsTable />
		</div>
	);
};
