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
import { useOrder } from '../hooks';
import { OrderType, orderSchema } from '../types/Order';

export const OrderEditPage: FC<{ id: string }> = ({ id }) => {
	const { order, update, remove, isLoading: hookLoading } = useOrder(id);

	const form = useForm<OrderType>({
		resolver: zodResolver(orderSchema),
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
		if (!order) return;
		setValue('id', order.id);
		setValue('description', order.description);
		setValue('priority', order.priority);
		setValue('status', order.status);
		setValue('createdAt', order.createdAt);
		setValue('mapData', order.mapData);
	}, [order]);

	const onError = (errors: UseFormReturn<OrderType>['formState']['errors']) => {
		console.log('error');
		console.log(errors);
	};

	const onSubmit = (data: OrderType) => {
		update(data);
	};

	const { units } = useUnits();

	if (!order) {
		return <div>Order not found</div>;
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
											title: 'Orders',
											href: '/order',
										},
										{
											title: order
												? order.description.substring(0, 16) +
												  (order.description.length > 16 ? '...' : '')
												: id,
											href: `/order/${id}`,
										},
										{
											title: 'Edit',
											href: `/order/${id}/edit`,
										},
									]}
								/>
								<PageHeaderTitle>
									{order ? order.description : 'Order'}
								</PageHeaderTitle>
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
								name="priority"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1">
										<FormLabel>Priority</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a priority" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="LOW">Low</SelectItem>
												<SelectItem value="MEDIUM">Medium</SelectItem>
												<SelectItem value="HIGH">High</SelectItem>
											</SelectContent>
										</Select>
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
												<SelectItem value="PENDING">Pending</SelectItem>
												<SelectItem value="IN_PROGRESS">In Progress</SelectItem>
												<SelectItem value="COMPLETED">Completed</SelectItem>
												<SelectItem value="FAILED">Failed</SelectItem>
												<SelectItem value="CANCELLED">Cancelled</SelectItem>
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
