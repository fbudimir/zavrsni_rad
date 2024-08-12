'use client';

import { Button } from '@/lib/shadcn/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@/lib/shadcn/ui/form';
import { Input } from '@/lib/shadcn/ui/input';
import { Breadcrumbs } from '@/modules/dashboard/components/Breadcrumbs';
import {
	PageHeader,
	PageHeaderActions,
	PageHeaderContent,
	PageHeaderDescription,
	PageHeaderTitle,
} from '@/modules/dashboard/components/PageHeader';
import { useUnits } from '@/modules/unit/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useEffect } from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';
import { useUser } from '../hooks';
import { UserType, userSchema } from '../types/User';

export const UserEditPage: FC<{ id: string }> = ({ id }) => {
	const { user, update, remove, isLoading: hookLoading } = useUser(id);

	const form = useForm<UserType>({
		resolver: zodResolver(userSchema),
	});
	const {
		handleSubmit,
		formState: { errors, isValid, isLoading, isDirty },
		setValue,
		watch,
		register,
	} = form;

	const loading = isLoading || hookLoading;

	useEffect(() => {
		if (!user) return;
		setValue('id', user.id);
		setValue('name', user.name);
		setValue('email', user.email);
	}, [user]);

	const onError = (errors: UseFormReturn<UserType>['formState']['errors']) => {
		console.log('error');
		console.log(errors);
	};

	const onSubmit = (data: UserType) => {
		update(data);
	};

	const { units } = useUnits();

	if (!user) {
		return <div>User not found</div>;
	}

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit, onError)}>
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
										{
											title: 'Users',
											href: '/admin',
										},
										{
											title: user ? user.name : id,
											href: `/admin/user/${id}`,
										},
										{
											title: 'Edit',
											href: `/admin/user/${id}/edit`,
										},
									]}
								/>
								<PageHeaderTitle>{user.name}</PageHeaderTitle>
								<PageHeaderDescription>{id}</PageHeaderDescription>
							</PageHeaderContent>
							<PageHeaderActions>
								<Button
									variant={'destructive'}
									onClick={remove}
									loading={loading}
								>
									Delete
								</Button>
								<Button disabled={!isDirty} loading={loading} type="submit">
									Save
								</Button>
							</PageHeaderActions>
						</PageHeader>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="id"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1">
										<FormLabel>ID</FormLabel>
										<FormControl>
											<Input
												{...field}
												disabled
												type="text"
												value={field.value || ''}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1">
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input {...field} type="text" value={field.value || ''} />
										</FormControl>
										{errors.name && (
											<FormLabel className="text-red-500">
												{errors.name.message}
											</FormLabel>
										)}
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1">
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input {...field} type="text" value={field.value || ''} />
										</FormControl>
										{errors.email && (
											<FormLabel className="text-red-500">
												{errors.email.message}
											</FormLabel>
										)}
									</FormItem>
								)}
							/>
						</div>
					</div>
				</form>
			</Form>
		</>
	);
};
