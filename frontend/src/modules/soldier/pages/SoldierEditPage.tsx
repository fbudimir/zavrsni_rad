'use client';

import { Spinner } from '@/components/Spinner';
import { Button } from '@/lib/shadcn/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@/lib/shadcn/ui/form';
import { Input } from '@/lib/shadcn/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/lib/shadcn/ui/select';
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
import { useSoldier } from '../hooks';
import { SoldierType, soldierSchema } from '../types/Soldier';

export const SoldierEditPage: FC<{ id: string }> = ({ id }) => {
	const { soldier, update, remove, isLoading: hookLoading } = useSoldier(id);

	const form = useForm<SoldierType>({
		resolver: zodResolver(soldierSchema),
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
		if (!soldier) return;
		setValue('id', soldier.id);
		setValue('name', soldier.name);
		setValue('rank', soldier.rank);
		setValue('class', soldier.class);
		setValue('status', soldier.status);
		setValue('unitId', soldier.unitId);
	}, [soldier]);

	const onError = (
		errors: UseFormReturn<SoldierType>['formState']['errors']
	) => {
		console.log('error');
		console.log(errors);
	};

	const onSubmit = (data: SoldierType) => {
		update(data);
	};

	const { units } = useUnits();

	useEffect(() => {
		const newRank = watch('rank');

		if (!newRank) return;

		if (newRank === 'PVT' || newRank === 'PFC') {
			setValue('class', 0);
		}
		if (newRank === 'CPL' || newRank === 'SGT') {
			setValue('class', 1);
		}
		if (newRank === 'SSGT' || newRank === 'SFC') {
			setValue('class', 2);
		}
		if (
			newRank === 'MSGT' ||
			newRank === 'FSG' ||
			newRank === 'SGM' ||
			newRank === 'SLT'
		) {
			setValue('class', 3);
		}
		if (newRank === 'FLT' || newRank === 'CPT' || newRank === 'MAJ') {
			setValue('class', 4);
		}
		if (
			newRank === 'LTC' ||
			newRank === 'COL' ||
			newRank === 'BG' ||
			newRank === 'MG' ||
			newRank === 'LTG' ||
			newRank === 'GEN'
		) {
			setValue('class', 5);
		}
	}, [watch('rank')]);

	// useEffect(() => {
	// 	console.log(watch());
	// }, [watch()]);

	if (!soldier) {
		return (
			<div className="flex flex-row justify-center items-center">
				<Spinner />
			</div>
		);
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
											title: 'Soldiers',
											href: '/soldier',
										},
										{
											title: soldier ? soldier.name : id,
											href: `/soldier/${id}`,
										},
										{
											title: 'Edit',
											href: `/soldier/${id}/edit`,
										},
									]}
								/>
								<PageHeaderTitle>{soldier.name}</PageHeaderTitle>
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
								name="rank"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1">
										<FormLabel>Rank</FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value || soldier.rank}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a rank" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="PVT">Private</SelectItem>
												<SelectItem value="PFC">Private First Class</SelectItem>
												<SelectItem value="CPL">Corporal</SelectItem>
												<SelectItem value="SGT">Sergeant</SelectItem>
												<SelectItem value="SSGT">Staff Sergeant</SelectItem>
												<SelectItem value="SFC">
													Sergeant First Class
												</SelectItem>
												<SelectItem value="MSGT">Master Sergeant</SelectItem>
												<SelectItem value="FSG">First Sergeant</SelectItem>
												<SelectItem value="SGM">Sergeant Major</SelectItem>
												<SelectItem value="SLT">Second Lieutenant</SelectItem>
												<SelectItem value="FLT">First Lieutenant</SelectItem>
												<SelectItem value="CPT">Captain</SelectItem>
												<SelectItem value="MAJ">Major</SelectItem>
												<SelectItem value="LTC">Lieutenant Colonel</SelectItem>
												<SelectItem value="COL">Colonel</SelectItem>
												<SelectItem value="BG">Brigadier General</SelectItem>
												<SelectItem value="MG">Major General</SelectItem>
												<SelectItem value="LTG">Lieutenant General</SelectItem>
												<SelectItem value="GEN">General</SelectItem>
											</SelectContent>
										</Select>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="class"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1">
										<FormLabel>Class</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="number"
												value={field.value || soldier.class}
												onChange={(event) =>
													field.onChange(+event.target.value)
												}
											/>
										</FormControl>
										{errors.class && (
											<FormLabel className="text-red-500">
												{errors.class.message}
											</FormLabel>
										)}
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="status"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1">
										<FormLabel>Status</FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value || soldier.status}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a status" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="ACTIVE">Active</SelectItem>
												<SelectItem value="WIA">Wounded in Action</SelectItem>
												<SelectItem value="KIA">Killed in Action</SelectItem>
												<SelectItem value="MIA">Missing in Action</SelectItem>
												<SelectItem value="RETIRED">Retired</SelectItem>
												<SelectItem value="AWOL">
													Absent Without Leave
												</SelectItem>
											</SelectContent>
										</Select>
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
