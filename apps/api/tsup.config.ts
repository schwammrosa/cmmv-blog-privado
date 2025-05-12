import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/main.ts'],
    format: ['esm', 'cjs'],
    sourcemap: false,
    clean: true,
    skipNodeModulesBundle: true,
});
