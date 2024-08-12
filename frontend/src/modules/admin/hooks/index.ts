import axios from 'axios';
import { useEffect, useState } from 'react';
import { UserType, userListSchema, userSchema } from '../types/User';

export const useUsers = () => {
	const [users, setUsers] = useState<UserType[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchUsers = async () => {
		try {
			const _users = await (
				await axios.post('http://localhost:3000/api/handler', {
					endpoint: '/users',
					method: 'GET',
				})
			).data;

			// _users.status za error handling

			const users = userListSchema.parse(_users.data);

			if (users) setUsers(users);
		} catch (error) {
			console.error(error);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const create = async (data: {
		email: string;
		name: string;
		password: string;
	}) => {
		try {
			const _user = await (
				await axios.post('http://localhost:3000/api/handler', {
					endpoint: '/users',
					method: 'POST',
					data,
				})
			).data.data;

			// hard refresh
			window.location.reload();
		} catch (error) {
			console.error(error);
		}
	};

	return {
		users,
		isLoading,
		create,
	};
};

export const useUser = (id: string) => {
	const [user, setUser] = useState<UserType | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const fetchUser = async () => {
		try {
			const _user = await (
				await axios.post('http://localhost:3000/api/handler', {
					endpoint: `/users/${id}`,
					method: 'GET',
				})
			).data.data;

			console.log(_user);

			// _user.status za error handling

			const user = userSchema.parse(_user);

			if (user) setUser(user);
		} catch (error) {
			console.error(error);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		fetchUser();
	}, []);

	const update = async (data: Partial<UserType>) => {
		try {
			const _user = await (
				await axios.post('http://localhost:3000/api/handler', {
					endpoint: `/users/${id}`,
					method: 'PUT',
					data,
				})
			).data.data;

			const user = userSchema.parse(_user);

			if (user) setUser(user);

			// hard refresh
			window.location.reload();
		} catch (error) {
			console.error(error);
		}
	};

	const remove = async () => {
		try {
			const _order = await (
				await axios.post('http://localhost:3000/api/handler', {
					endpoint: `/users/${id}`,
					method: 'DELETE',
				})
			).data.data;

			// hard refresh
			window.location.href = '/admin';
		} catch (error) {
			console.error(error);
		}
	};

	return {
		user,
		isLoading,
		update,
		remove,
	};
};
