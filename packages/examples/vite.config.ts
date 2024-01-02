import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.gltf', '**/*.glb', '**/*.pdb'],
  server: {
    host: '0.0.0.0',
  },
});
