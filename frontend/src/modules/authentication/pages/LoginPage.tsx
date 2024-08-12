'use client';

import { BodySmall, Heading1 } from '@/components/Typography';
import { Button } from '@/lib/shadcn/ui/button';
import { Input } from '@/lib/shadcn/ui/input';
import { Container } from '@/modules/dashboard/components/Container';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

const LoginPage = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		setLoading(true);
		const result = await signIn('credentials', {
			redirect: false,
			email,
			password,
		});
		setLoading(false);

		if (result && result.error) {
			setError(result.error);
		} else {
			// to home or protected page
			window.location.href = '/';
		}
	};

	return (
		<Container narrow>
			<div className="flex flex-col gap-10 justify-center">
				<Heading1>Login</Heading1>
				<form onSubmit={handleSubmit} className="flex flex-col gap-2">
					<Input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Email"
						required
					/>
					<Input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Password"
						required
					/>
					<Button loading={loading} type="submit">
						Login
					</Button>
				</form>
				{error && <BodySmall className="text-red-500">{error}</BodySmall>}
			</div>
		</Container>
	);
};

export default LoginPage;
