// @ts-check
import { defineConfig } from 'astro/config';

import clerk from '@clerk/astro';
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

	integrations: [clerk(), mdx(), vue()],

	output: 'server',

	site: process.env.SITE_URL ?? 'http://localhost:4321',

	vite: {
		plugins: [tailwindcss()],
	},
});