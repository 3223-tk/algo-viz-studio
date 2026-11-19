import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base: './'` keeps every asset URL relative, so the same build works both
// locally and on GitHub Pages under /<repo-name>/ without extra configuration.
export default defineConfig({
  base: './',
  plugins: [react()],
});
