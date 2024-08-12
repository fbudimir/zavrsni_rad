import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const secretKey = process.env.JWT_SECRET;
const encryptionKey = process.env.ENCRYPTION_KEY || 'secret';
const algorithm = 'aes-256-cbc';
const ivLength = 16;

const generateIv = () => crypto.randomBytes(ivLength);

const encryptPayload = (payload: Record<string, any>) => {
	const iv = generateIv();
	const cipher = crypto.createCipheriv(
		algorithm,
		Buffer.from(encryptionKey),
		iv
	);
	let encrypted = cipher.update(JSON.stringify(payload), 'utf8', 'hex');
	encrypted += cipher.final('hex');
	return { iv: iv.toString('hex'), encryptedData: encrypted };
};

const decryptPayload = (iv: string, encryptedData: string) => {
	const decipher = crypto.createDecipheriv(
		algorithm,
		Buffer.from(encryptionKey),
		Buffer.from(iv, 'hex')
	);
	let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
	decrypted += decipher.final('utf8');
	return JSON.parse(decrypted);
};

export const encrypt = async (payload: Record<string, any>) => {
	if (!secretKey || !encryptionKey) {
		throw new Error('INTERNAL_SERVER_ERROR');
	}

	const { iv, encryptedData } = encryptPayload(payload);

	return jwt.sign({ iv, encryptedData }, secretKey, { expiresIn: 10 });
};

export const decrypt = async (input: string): Promise<any> => {
	if (!secretKey || !encryptionKey) {
		throw new Error('INTERNAL_SERVER_ERROR');
	}

	const { iv, encryptedData } = jwt.verify(input, secretKey) as {
		iv: string;
		encryptedData: string;
	};

	return decryptPayload(iv, encryptedData);
};
