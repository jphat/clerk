/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

import type { UserContext } from '@/types';
/**
 * Extend Astro's App namespace to include user context in locals
 */
declare global {
	namespace App {
		interface Locals {
			user?: UserContext;
		}
		// TODO: clean up
		// interface SessionData {
		//     user?: UserContext;
		// }
	}
}
