import AuthProvider from '@/lib/AuthProvider';
import { FC, PropsWithChildren } from 'react';

export const Providers: FC<PropsWithChildren> = ({ children }) => {
	return (
		<>
			<AuthProvider>{children}</AuthProvider>
		</>
	);
};
