<script setup lang="ts">
import { Sun, Moon, Monitor } from 'lucide-vue-next';
import { ref, onMounted } from 'vue';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';

const currentMode = ref('auto');

const getThemePreference = () => {
	if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
		return localStorage.getItem('theme');
	}
	return 'auto';
};

const setTheme = (mode: string) => {
	currentMode.value = mode;

	if (mode === 'auto') {
		localStorage.removeItem('theme');
		const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
	} else {
		localStorage.setItem('theme', mode);
		document.documentElement.classList[mode === 'dark' ? 'add' : 'remove'](
			'dark',
		);
	}
};

onMounted(() => {
	currentMode.value = getThemePreference() || 'auto';
});
</script>

<template>
	<ButtonGroup>
		<Button
			id="mode_dark"
			variant="ghost"
			size="sm"
			:class="{ 'bg-accent': currentMode === 'dark' }"
			@click="setTheme('dark')"
		>
			<Moon class="h-4 w-4" />
			<span class="sr-only">Dark mode</span>
		</Button>
		<Button
			id="mode_light"
			variant="ghost"
			size="sm"
			:class="{ 'bg-accent': currentMode === 'light' }"
			@click="setTheme('light')"
		>
			<Sun class="h-4 w-4" />
			<span class="sr-only">Light mode</span>
		</Button>
		<Button
			id="mode_system"
			variant="ghost"
			size="sm"
			:class="{ 'bg-accent': currentMode === 'auto' }"
			@click="setTheme('auto')"
		>
			<Monitor class="h-4 w-4" />
			<span class="sr-only">System mode</span>
		</Button>
	</ButtonGroup>
</template>
