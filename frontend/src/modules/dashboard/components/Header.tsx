'use client';

import { BodySmall } from '@/components/Typography';
import { Button } from '@/lib/shadcn/ui/button';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC, useEffect, useState } from 'react';

const PageButton: FC<{ href: string; title: string }> = ({ href, title }) => {
	const [isActive, setIsActive] = useState(false);

	const pathname = usePathname();

	useEffect(() => {
		if (pathname === href) {
			setIsActive(true);
		} else {
			setIsActive(false);
		}
	}, [href, pathname]);

	return (
		<Link href={href}>
			<Button variant={isActive ? 'linkActive' : 'link'} size={'sm'}>
				{title}
			</Button>
		</Link>
	);
};

export const Header = () => {
	const { data: session } = useSession();
	const handleLogout = async () => {
		await signOut();
	};

	return (
		<header className="w-full px-4 py-2 flex flex-row justify-between border-b">
			<div className="flex flex-row gap-2 items-center">
				<Link href={'/'}>
					<h1 className="mr-4 font-bold">Parnassus</h1>
				</Link>
				<PageButton href={'/'} title={'Dashboard'} />
				<PageButton href={'/analytics'} title={'Analytics'} />
				<PageButton href={'/admin'} title={'Admin'} />
			</div>
			<div className="flex flex-row gap-2 items-center">
				{session && (
					<>
						<BodySmall>{session.user?.name}</BodySmall>
						<Button variant={'outline'} size={'sm'} onClick={handleLogout}>
							Logout
						</Button>
					</>
				)}
				{!session && (
					<Link href={'/login'}>
						<Button variant={'outline'} size={'sm'}>
							Log in
						</Button>
					</Link>
				)}
			</div>
		</header>
	);
};
