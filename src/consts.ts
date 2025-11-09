import type { NavItem } from '@/types';
import ogImage from '@/assets/images/purple.png';

export const NAV_FOOTER: NavItem[] = [];
export const NAV_MAIN: NavItem[] = [];
export const NAV_TEST: NavItem[] = [
	{
		children: null,
		description: 'Admin access test page',
		href: '/test/admin',
		permissions: ['admin'],
		title: 'Admin Test',
	},
	{
		children: null,
		description: 'Editor access test page',
		href: '/test/editor',
		permissions: ['editor'],
		title: 'Editor Test',
	},
	{
		children: null,
		description: 'Viewer access test page',
		href: '/test/viewer',
		permissions: ['viewer'],
		title: 'Viewer Test',
	},
	{
		children: null,
		description: 'Component access test page',
		href: '/test/components',
		permissions: ['admin', 'editor', 'viewer'],
		title: 'Components Test',
	},
];
export const NAV_USER: NavItem[] = [];

export const MENUS = {
	NAV_FOOTER: [],
	NAV_MAIN: [],
	NAV_TEST: [
		{
			children: [
				{
					children: null,
					description: 'Admin access test page',
					href: '/test/admin',
					permissions: ['admin'],
					title: 'Admin Test',
				},
				{
					children: null,
					description: 'Editor access test page',
					href: '/test/editor',
					permissions: ['editor'],
					title: 'Editor Test',
				},
				{
					children: null,
					description: 'Viewer access test page',
					href: '/test/viewer',
					permissions: ['viewer'],
					title: 'Viewer Test',
				},
				{
					children: null,
					description: 'Component access test page',
					href: '/test/components',
					permissions: ['admin', 'editor', 'viewer'],
					title: 'Components Test',
				},
			],
			description: 'A list of RBAC Test Pages',
			href: '/test',
			permissions: [],
			title: 'RBAC Test',
		},

	],
	NAV_USER: [],
}

export const SITE_DESCRIPTION =
	'Astro builds fast content sites, powerful web applications, dynamic server APIs, and everything in-between.';
export const SITE_EMAILS = { technical: 'eric@josephat.me' };
export const SITE_EVERGREEN_IMAGE = { alt: '', ...ogImage };
export const SITE_LANGUAGE = import.meta.env.SITE_LANGUAGE ?? 'en';
export const SITE_LOCALE = import.meta.env.SITE_LOCALE ?? 'en-US';
export const SITE_LOGO = {};
export const SITE_TITLE = 'Astro';
export const SITE_URL = import.meta.env.SITE_URL ?? 'http://localhost:4321';
