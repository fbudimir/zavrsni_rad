import options from '@/lib/authOptions';
import { getServerSession } from 'next-auth/next';
import { environment } from './config';
import { decrypt, encrypt } from './encryption';
import jwt from 'jsonwebtoken';

const secret_auth = environment.JWT_SECRET_AUTH;

export const secureFetch = async (
	endpoint: string,
	method: string,
	data?: any,
	auth: boolean = true
) => {
	let headers: any = {
		'Content-Type': 'application/json',
		session: null,
	};

	if (auth) {
		const session = await getServerSession(options);

		if (!session) {
			return { status: 403, message: 'UNAUTHORIZED' };
		}

		const token = jwt.sign(session, secret_auth, { expiresIn: 10 });
		headers['Authorization'] = `Bearer ${token}`;
	}

	let encryptedData = null;
	if (data) {
		encryptedData = await encrypt({ data });
	}

	let fetchOptions: any = {
		method: method,
		headers,
	};

	if (encryptedData) {
		fetchOptions = {
			...fetchOptions,
			body: JSON.stringify({ encryptedData }),
		};
	}

	const response = await fetch(
		`${environment.BACKEND_URL}${endpoint}`,
		fetchOptions
	);
	const responseObject = await response.json();

	if (responseObject.encryptedData) {
		const decryptedData = await decrypt(responseObject.encryptedData);
		delete responseObject.encryptedData;
		responseObject.data = decryptedData.data;
	}

	return responseObject;
};
