import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/index.html'),
        aboutus: resolve(__dirname, 'public/pages/aboutus.html'),
        blog: resolve(__dirname, 'public/pages/blog.html'),
        contact: resolve(__dirname, 'public/pages/contact.html'),
        dashboard: resolve(__dirname, 'public/pages/dashboard.html'),
        login: resolve(__dirname, 'public/pages/login.html'),
        register: resolve(__dirname, 'public/pages/register.html'),
        profile: resolve(__dirname, 'public/pages/profile.html'),
        settings: resolve(__dirname, 'public/pages/settings.html'),
        reports: resolve(__dirname, 'public/pages/reports.html'),
        // Dynamic map inclusion for all 15 static articles content pages
        ...Array.from({ length: 15 }, (_, i) => i + 1).reduce((acc, num) => {
          acc[`content_${num}`] = resolve(__dirname, `public/pages/content-${num}.html`);
          return acc;
        }, {})
      }
    }
  },
  server: {
    port: 5173,
    open: true
  }
});
