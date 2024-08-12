'use client';

import { Spinner } from '@/components/Spinner';
import { BodyMuted, BodySmall } from '@/components/Typography';
import { RichSelector } from '@/components/rich-selector';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useEffect } from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';
import { useUnit } from '../hooks';
import { UnitType, unitSchema } from '../types/Unit';

export const UnitEditPage: FC<{ id: string }> = ({ id }) => {
	const {
		unit,
		update,
		remove,
		isLoading: hookLoading,
		eligibleLeaders,
		eligibleParentUnits,
	} = useUnit(id);

	// useEffect(() => {
	// 	console.log(unit);
	// }, [unit]);

	const form = useForm<Omit<UnitType, 'leader'>>({
		resolver: zodResolver(unitSchema.omit({ leader: true })),
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
		if (!unit) return;

		setValue('id', unit.id);
		setValue('name', unit.name);
		setValue('type', unit.type);
		setValue('class', unit.class);
		setValue('parentUnitId', unit.parentUnitId);
		setValue('status', unit.status);
		setValue('leaderId', unit.leaderId);
		setValue('nPosition', unit.nPosition);
		setValue('ePosition', unit.ePosition);
	}, [unit]);

	useEffect(() => {
		const newType = watch('type');

		if (!newType) return;

		if (newType === 'TEAM') {
			setValue('class', 1);
		}

		if (newType === 'SQUAD') {
			setValue('class', 2);
		}

		if (newType === 'PLATOON') {
			setValue('class', 3);
		}

		if (newType === 'COMPANY') {
			setValue('class', 4);
		}

		if (newType === 'BATTALION') {
			setValue('class', 5);
		}

		if (newType === 'TASK_FORCE') {
			setValue('class', 6);
		}
	}, [watch('type')]);

	const onError = (
		errors: UseFormReturn<Omit<UnitType, 'leader'>>['formState']['errors']
	) => {
		console.log('error');
		console.log(errors);
	};

	const onSubmit = (data: UnitType) => {
		update(data);
	};

	if (!unit) {
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
											title: 'Units',
											href: '/unit',
										},
										{
											title: unit ? unit.name : id,
											href: `/unit/${id}`,
										},
										{
											title: 'Edit',
											href: `/unit/${id}/edit`,
										},
									]}
								/>
								<PageHeaderTitle>{unit.name}</PageHeaderTitle>
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
								name="type"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1">
										<FormLabel>Type</FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value || unit.type}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a type" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="TEAM">Team</SelectItem>
												<SelectItem value="SQUAD">Squad</SelectItem>
												<SelectItem value="PLATOON">Platoon</SelectItem>
												<SelectItem value="COMPANY">Company</SelectItem>
												<SelectItem value="BATTALION">Battalion</SelectItem>
												<SelectItem value="TASK_FORCE">Task Force</SelectItem>
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
												value={field.value || unit.class}
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
								name="parentUnitId"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1">
										<FormLabel>Parent Unit</FormLabel>
										<FormControl>
											<RichSelector
												data={eligibleParentUnits}
												selectedIds={field.value ? [field.value] : []}
												onChange={(ids) => {
													form.setValue('parentUnitId', ids[0]);
												}}
												identifier="id"
												displayKey="name"
												row={(unit) => (
													<>
														<BodySmall>{unit.name}</BodySmall>
														<BodyMuted>
															{unit.type} - {unit.id}
														</BodyMuted>
													</>
												)}
												filter={(unit, search) =>
													unit.id
														.toLowerCase()
														.includes(search.toLowerCase()) ||
													unit.name
														.toLowerCase()
														.includes(search.toLowerCase()) ||
													unit.type.toLowerCase().includes(search.toLowerCase())
												}
											/>
										</FormControl>
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
											value={field.value || unit.status}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a status" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="ACTIVE">Active</SelectItem>
												<SelectItem value="DECOMMISSIONED">
													Decommissioned
												</SelectItem>
											</SelectContent>
										</Select>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="leaderId"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1">
										<FormLabel>Leader</FormLabel>
										<FormControl>
											<RichSelector
												data={eligibleLeaders}
												selectedIds={field.value ? [field.value] : []}
												onChange={(ids) => {
													form.setValue('leaderId', ids[0]);
												}}
												identifier="id"
												displayKey="name"
												row={(soldier) => (
													<>
														<BodySmall>
															{soldier.name}, {soldier.rank} ({soldier.class})
														</BodySmall>
														<BodyMuted>{soldier.id}</BodyMuted>
													</>
												)}
												filter={(soldier, search) =>
													soldier.id
														.toLowerCase()
														.includes(search.toLowerCase()) ||
													soldier.name
														.toLowerCase()
														.includes(search.toLowerCase()) ||
													soldier.rank
														.toLowerCase()
														.includes(search.toLowerCase())
												}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="nPosition"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1">
										<FormLabel>North Position</FormLabel>
										<FormControl>
											<Input
												{...field}
												onChange={(event) =>
													field.onChange(+event.target.value)
												}
												type="number"
												step="0.001"
												value={field.value || '0'}
											/>
										</FormControl>
										{errors.nPosition && (
											<FormLabel className="text-red-500">
												{errors.nPosition.message}
											</FormLabel>
										)}
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="ePosition"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1">
										<FormLabel>East Position</FormLabel>
										<FormControl>
											<Input
												{...field}
												onChange={(event) =>
													field.onChange(+event.target.value)
												}
												type="number"
												step="0.001"
												value={field.value || '0'}
											/>
										</FormControl>
										{errors.ePosition && (
											<FormLabel className="text-red-500">
												{errors.ePosition.message}
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
