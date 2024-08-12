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
import { Textarea } from '@/lib/shadcn/ui/textarea';
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
import { useEquipment } from '../hooks';
import { EquipmentType, equipmentSchema } from '../types/Equipment';

export const EquipmentEditPage: FC<{ id: string }> = ({ id }) => {
	const {
		equipment,
		update,
		remove,
		isLoading: hookLoading,
	} = useEquipment(id);

	const form = useForm<EquipmentType>({
		resolver: zodResolver(equipmentSchema),
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
		if (!equipment) return;
		setValue('id', equipment.id);
		setValue('name', equipment.name);
		setValue('type', equipment.type);
		setValue('description', equipment.description);
		setValue('status', equipment.status);
		setValue('assignedToId', equipment.assignedToId);
	}, [equipment]);

	const onError = (
		errors: UseFormReturn<EquipmentType>['formState']['errors']
	) => {
		console.log('error');
		console.log(errors);
	};

	const onSubmit = (data: EquipmentType) => {
		update(data);
	};

	const { units } = useUnits();

	if (!equipment) {
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
											title: 'Equipment',
											href: '/equipment',
										},
										{
											title: equipment ? equipment.name : id,
											href: `/equipment/${id}`,
										},
										{
											title: 'Edit',
											href: `/equipment/${id}/edit`,
										},
									]}
								/>
								<PageHeaderTitle>{equipment.name}</PageHeaderTitle>
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
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a type" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="VEHICLE">Vehicle</SelectItem>
												<SelectItem value="WEAPON">Weapon</SelectItem>
												<SelectItem value="OTHER">Other</SelectItem>
											</SelectContent>
										</Select>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1">
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Textarea {...field} value={field.value || ''} />
										</FormControl>
										{errors.description && (
											<FormLabel className="text-red-500">
												{errors.description.message}
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
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a status" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="ACTIVE">Active</SelectItem>
												<SelectItem value="UNDER_MAINTENANCE">
													Under Maintenance
												</SelectItem>
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
								name="assignedToId"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1">
										<FormLabel>Assigned To</FormLabel>
										<FormControl>
											<RichSelector
												data={units}
												selectedIds={field.value ? [field.value] : []}
												onChange={(ids) => {
													form.setValue('assignedToId', ids[0]);
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
						</div>
					</div>
				</form>
			</Form>
		</>
	);
};
