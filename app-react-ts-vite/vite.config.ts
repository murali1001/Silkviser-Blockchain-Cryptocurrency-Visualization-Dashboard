import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default () => {
  return defineConfig({
    css: {
      modules: {
        scopeBehaviour: 'local',
        localsConvention: 'camelCaseOnly',
        generateScopedName: `[name]_[local]___[hash:base64:5]`,
      },
    },
    plugins: [react()],
  });
};
