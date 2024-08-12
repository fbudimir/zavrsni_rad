import { z } from 'zod';

export const orderPrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH']);
export type OrderPriorityType = z.infer<typeof orderPrioritySchema>;

export const orderStatusSchema = z.enum([
	'PENDING',
	'IN_PROGRESS',
	'COMPLETED',
	'FAILED',
	'CANCELLED',
]);
export type OrderStatusType = z.infer<typeof orderStatusSchema>;

export const orderSchema = z.object({
	id: z.string(),
	priority: orderPrioritySchema,
	status: orderStatusSchema,
	createdAt: z.string(),
	description: z.string(),
	// assignedUnits: z.array(z.any()),
	mapData: z.string(),
});

export type OrderType = z.infer<typeof orderSchema>;

export const orderListSchema = z.array(orderSchema);
export type OrderListType = z.infer<typeof orderListSchema>;
