export type NavItem = {
	children?: NavItem[] | null;
	description?: string;
	href: string;
	icon?: string;
	permissions?: string[];
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
	headerClassList?: string[];
	title: string;
	description?: string;
};

// Re-export auth types for convenience
export type {
	Role,
	Permission,
	RoleConfig,
	UserContext,
	MenuItem,
	RouteConfig,
} from './auth';
