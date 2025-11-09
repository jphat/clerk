import { clerkMiddleware, clerkClient } from '@clerk/astro/server';
import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = clerkMiddleware(
);