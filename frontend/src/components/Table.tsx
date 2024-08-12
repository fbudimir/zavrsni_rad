'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default async function Table({ tableData }: any) {
	const [data, setData] = useState();

	const router = useRouter();

	const handleButtonClick = (id: string) => {
		router.push(`/order/${id}`);
	};

	return (
		<div>
			{tableData.map((element: any) => (
				<div>
					<button
						key={element.id}
						onClick={() => handleButtonClick(element.id)}
					>
						{element.description}
					</button>
					<br />
				</div>
			))}
		</div>
	);
}
