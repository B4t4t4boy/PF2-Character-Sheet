import { defineConfig, presetUno, presetAttributify } from 'unocss'

// Safelist all custom color utility classes to ensure they're generated
function buildSafelist(): string[] {
	const colorNames = [
		'parchment', 'parchment-dark', 'cream', 'ink', 'ink-light',
		'burgundy', 'burgundy-light', 'burgundy-dark',
		'gold', 'gold-light', 'gold-dark',
		'warm-50', 'warm-100', 'warm-200', 'warm-300', 'warm-400', 'warm-500',
	];
	const list: string[] = [];
	for (const c of colorNames) {
		list.push(`bg-${c}`);
		list.push(`text-${c}`);
		list.push(`border-${c}`);
		list.push(`border-b-${c}`);
		list.push(`accent-${c}`);
		// opacity variants used in components
		list.push(`bg-${c}/50`);
		list.push(`bg-${c}/70`);
		list.push(`bg-${c}/40`);
		list.push(`ring-${c}/30`);
		// hover variants
		list.push(`hover:bg-${c}`);
		list.push(`hover:text-${c}`);
		list.push(`hover:border-${c}`);
	}
	return list;
}

export default defineConfig({
	presets: [
		presetUno(),
		presetAttributify()
	],
	safelist: buildSafelist(),
	rules: [
		// Card depth shadows
		['shadow-card', { 'box-shadow': '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)' }],
		['shadow-card-hover', { 'box-shadow': '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)' }],
		['shadow-section', { 'box-shadow': 'inset 0 1px 0 rgba(255,255,255,0.15), 0 1px 2px rgba(0,0,0,0.15)' }],
	],
	shortcuts: {
		// Input fields — cream bg, warm border
		'grid-input':
			'w-full border border-warm-300 bg-cream px-1.5 py-0.5 text-xs text-center text-ink transition-colors '
			+ 'focus:border-gold focus:outline-none',
		// Read-only fields
		'readonly-field':
			'w-full border border-warm-300 bg-parchment-dark px-1.5 py-0.5 text-xs text-center text-ink',
		// Labels
		'stat-label':
			'text-[10px] font-semibold text-ink-light text-center uppercase tracking-wide',
		// Section headers — burgundy with gold text
		'section-header':
			'bg-burgundy text-gold text-xs font-bold px-2 py-1 text-center uppercase tracking-wider shadow-section',
		'section-subheader':
			'bg-burgundy-light text-gold-light text-[10px] font-semibold px-1 py-0.5 text-center uppercase',
		// Cards
		'section-card':
			'border border-warm-300 bg-parchment rounded-sm shadow-card',
		// Grid
		'grid-cell': 'border border-warm-300',
		'grid-row': 'flex',
		'grid-row-alt': 'flex bg-parchment-dark',
		// Buttons
		'btn':
			'px-2.5 py-1 text-xs font-medium rounded-sm border transition-all duration-150 '
			+ 'cursor-pointer select-none active:scale-[0.98]',
		'btn-primary':
			'btn bg-burgundy text-gold border-burgundy-dark '
			+ 'hover:bg-burgundy-light hover:text-gold-light hover:shadow-card-hover',
		'btn-secondary':
			'btn bg-warm-100 text-ink border-warm-300 '
			+ 'hover:bg-warm-200 hover:border-warm-400 hover:shadow-card',
		'btn-danger':
			'btn bg-red-700 text-white border-red-800 hover:bg-red-600',
		// Tabs
		'tab-active':
			'bg-parchment text-burgundy border-b-2 border-burgundy px-3 py-1.5 '
			+ 'text-xs font-bold rounded-t-sm shadow-card',
		'tab-inactive':
			'bg-warm-200 text-ink-light px-3 py-1.5 text-xs font-medium rounded-t-sm '
			+ 'hover:bg-warm-200 hover:text-ink cursor-pointer transition-colors',
		// Modifier display box
		'mod-box':
			'border border-warm-300 bg-parchment-dark px-1 py-0.5 text-xs font-bold text-center text-burgundy',
	},
	theme: {
		colors: {
			// Parchment palette
			parchment: '#faf6ef',
			'parchment-dark': '#f0e9d8',
			cream: '#fdfaf3',
			ink: '#2c1810',
			'ink-light': '#6b4c3b',
			// Warm neutrals
			warm: {
				50: '#fdf8f0',
				100: '#f5ede0',
				200: '#e8dccc',
				300: '#d4c5a9',
				400: '#b8a585',
				500: '#9a8768',
			},
			// Burgundy/red
			burgundy: '#7b2d2d',
			'burgundy-light': '#9a3d3d',
			'burgundy-dark': '#5a1e1e',
			// Gold accents
			gold: '#d4a853',
			'gold-light': '#e0c078',
			'gold-dark': '#b8923e',
		},
		fontFamily: {
			sans: ['"Segoe UI"', 'system-ui', '-apple-system', 'sans-serif'],
			mono: ['"Cascadia Code"', '"Fira Code"', 'monospace'],
		},
	}
})
