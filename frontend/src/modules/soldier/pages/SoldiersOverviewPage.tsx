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
import { SoldiersTable } from '../components/SoldiersTable';
import { useSoldiers } from '../hooks';

export const SoldiersOverviewPage = () => {
	const { create, isLoading } = useSoldiers();

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
							]}
						/>
						<PageHeaderTitle>Soldiers</PageHeaderTitle>
						<PageHeaderDescription>Manage soldiers here</PageHeaderDescription>
					</PageHeaderContent>
					<PageHeaderActions>
						<Button onClick={create} loading={isLoading}>
							Add new
						</Button>
					</PageHeaderActions>
				</PageHeader>

				<SoldiersTable />
			</div>
		</>
	);
};
