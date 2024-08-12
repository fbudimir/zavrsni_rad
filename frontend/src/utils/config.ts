export const environment = {
	NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'secret',
	JWT_SECRET: process.env.JWT_SECRET || 'secret',
	JWT_SECRET_AUTH: process.env.JWT_SECRET_AUTH || 'secret_auth',
	BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:4000',
};
