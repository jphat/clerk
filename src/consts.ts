import type { NavItem } from '@/types';
import ogImage from '@/assets/images/purple.png';

export const NAV_FOOTER: NavItem[] = [];
export const NAV_MAIN: NavItem[] = [];
export const NAV_USER: NavItem[] = [];

export const SITE_DESCRIPTION =
	'Astro builds fast content sites, powerful web applications, dynamic server APIs, and everything in-between.';
export const SITE_EMAILS = { technical: 'eric@josephat.me' };
export const SITE_EVERGREEN_IMAGE = { alt: '', ...ogImage };
export const SITE_LANGUAGE = import.meta.env.SITE_LANGUAGE ?? 'en';
export const SITE_LOCALE = import.meta.env.SITE_LOCALE ?? 'en-US';
export const SITE_LOGO = {};
export const SITE_TITLE = 'Astro';
export const SITE_URL = import.meta.env.SITE_URL ?? 'http://localhost:4321';
