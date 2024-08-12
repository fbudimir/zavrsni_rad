import { environment } from '@/utils/config';
import { secureFetch } from '@/utils/secureFetch';
import { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
	pages: {
		signIn: '/login',
	},
	session: { maxAge: 4 * 60 * 60, strategy: 'jwt' }, // 4h
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'text' },
				password: { label: 'Password', type: 'password' },
			},
			authorize: async (credentials) => {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				try {
					const response = await secureFetch(
						'/auth/login',
						'POST',
						JSON.stringify({
							email: credentials.email,
							password: credentials.password,
						}),
						false
					).catch((err: any) => {
						throw err;
					});

					if (!response || response.status !== 200) {
						return null;
					}

					const user = response.data;

					if (user) {
						return user;
					} else {
						return null;
					}
				} catch (error) {
					console.error('Error in authorize:', error);
					return null;
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
			}
			return token;
		},
		async session({ session, token }: { session: any; token: JWT }) {
			if (session.user) {
				session.user.id = token.id as string;
			}
			return session;
		},
	},
	secret: environment.NEXTAUTH_SECRET,
};

export default authOptions;
