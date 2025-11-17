import type { Role, Permissions } from '@/types/auth';

export type NavItem = {
	children?: NavItem[] | null;
	description?: string;
	href: string;
	icon?: string;
	permissions?: Role[] | Permissions[];
	title: string;
};

export type PageMeta = {
	bodyClassList?: string[];
	description: string;
	image?: {
		src: string;
		alt?: string;
		width?: number;
		height?: number;
	};
	language?: string;
	title: string;
};

export type TitleBar = {
	breadcrumbs?: Array<{ title: string; url: string }>;
	description?: string;
	headerClassList?: string[];
	title: string;
};
