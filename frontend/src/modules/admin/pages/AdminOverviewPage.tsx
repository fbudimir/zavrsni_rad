'use client';

import { Button } from '@/lib/shadcn/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/lib/shadcn/ui/dialog';
import { Input } from '@/lib/shadcn/ui/input';
import { Label } from '@/lib/shadcn/ui/label';
import { Breadcrumbs } from '@/modules/dashboard/components/Breadcrumbs';
import {
	PageHeader,
	PageHeaderActions,
	PageHeaderContent,
	PageHeaderDescription,
	PageHeaderTitle,
} from '@/modules/dashboard/components/PageHeader';
import { useState } from 'react';
import { UsersTable } from '../components/UsersTable';
import { useUsers } from '../hooks';

export const AdminOverviewPage = () => {
	const { create, isLoading } = useUsers();

	const [data, setData] = useState<{
		name: string;
		email: string;
		password: string;
	}>({
		name: '',
		email: '',
		password: '',
	});

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
									title: 'Admin Overview',
									href: '/admin',
								},
							]}
						/>
						<PageHeaderTitle>Admin Overview</PageHeaderTitle>
						<PageHeaderDescription>
							Manage administrators here
						</PageHeaderDescription>
					</PageHeaderContent>
					<PageHeaderActions>
						<Dialog>
							<DialogTrigger asChild>
								<Button onClick={() => {}} loading={isLoading}>
									Add new
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<div className="flex flex-col gap-10">
										<DialogTitle>Create User</DialogTitle>
										<div className="flex flex-col gap-4">
											<div className="flex flex-col gap-2">
												<Label>Name</Label>
												<Input
													type="text"
													onChange={(e) =>
														setData({ ...data, name: e.target.value })
													}
												/>
											</div>
											<div className="flex flex-col gap-2">
												<Label>Email</Label>
												<Input
													type="email"
													onChange={(e) =>
														setData({ ...data, email: e.target.value })
													}
												/>
											</div>
											<div className="flex flex-col gap-2">
												<Label>Password</Label>
												<Input
													type="password"
													onChange={(e) =>
														setData({ ...data, password: e.target.value })
													}
												/>
											</div>
										</div>
									</div>
								</DialogHeader>
								<DialogFooter>
									<Button
										onClick={() => {
											create(data);
										}}
									>
										Create User
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</PageHeaderActions>
				</PageHeader>

				<UsersTable />
			</div>
		</>
	);
};
