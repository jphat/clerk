// @ts-check
import { defineConfig } from 'astro/config';

import { shadcn } from '@clerk/themes';
import clerk from '@clerk/astro';
// import { astroExpressiveCode } from 'astro-expressive-code';
import expressiveCode from 'astro-expressive-code';
import mdx from '@astrojs/mdx';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';
import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
	adapter: node({
		mode: 'standalone',
	}),

	experimental: {
		contentIntellisense: true,
		fonts: [
			{
				provider: 'local',
				name: 'JetBrains Mono',
				cssVariable: '--font-jetbrains-mono',
				variants: [
					{
						weight: '100 800',
						style: 'normal',
						src: [
							'./src/assets/fonts/jetbrains_mono/jetbrains_mono-variablefont_wght.ttf',
						],
					},
					{
						weight: '100 900',
						style: 'italic',
						src: [
							'./src/assets/fonts/jetbrains_mono/jetbrains_mono-italic-variablefont_wght.ttf',
						],
					},
				],
			},
		],
	},

	integrations: [
		clerk({
			appearance: {
				baseTheme: shadcn,
				elements: {
					userButtonPopoverFooter: 'hidden',
				},
				signIn: {},
				signUp: {},
			},
		}),
		expressiveCode(),
		// astroExpressiveCode({
		//     frames: {
		//         showCopyToClipboardButton: true,
		//     },
		// }),
		mdx(),
		vue(),
	],

	output: 'server',

	site: process.env.SITE_URL ?? 'http://localhost:4321',

	vite: {
		plugins: [tailwindcss()],
	},
});
