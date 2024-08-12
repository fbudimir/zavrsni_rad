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
import { EquipmentsTable } from '../components/EquipmentsTable';
import { useEquipments } from '../hooks';

export const EquipmentsOverviewPage = () => {
	const { create, isLoading } = useEquipments();

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
							]}
						/>
						<PageHeaderTitle>Equipment Overview</PageHeaderTitle>
						<PageHeaderDescription>Manage equipment here</PageHeaderDescription>
					</PageHeaderContent>
					<PageHeaderActions>
						<Button onClick={create} loading={isLoading}>
							Add new
						</Button>
					</PageHeaderActions>
				</PageHeader>

				<EquipmentsTable />
			</div>
		</>
	);
};
