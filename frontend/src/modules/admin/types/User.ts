import { z } from 'zod';

export const userSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
});
export type UserType = z.infer<typeof userSchema>;

export const userListSchema = z.array(userSchema);
export type UserListType = z.infer<typeof userListSchema>;
