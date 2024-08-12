import { secureFetch } from '@/utils/secureFetch';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	const params: {
		endpoint: string;
		method: string;
		data?: any;
	} = await req.json();

	const response: any = await secureFetch(
		params.endpoint,
		params.method,
		params.data
	);
	return NextResponse.json(response);
}

// disable caching
export const dynamic = 'force-dynamic';
