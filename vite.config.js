import { defineConfig } from 'vite';

const customDashboardLinksPlugin = () => {
  return {
    name: 'custom-dashboard-links',
    configureServer(server) {
      if (!server.httpServer) return;
      server.httpServer.on('listening', () => {
        const address = server.httpServer.address();
        // Always use localhost for terminal links to avoid IPv6 issues like http://::1:5173/
        const host = 'localhost';
        const port = address.port;
        const baseUrl = `http://${host}:${port}`;
        
        setTimeout(() => {
          console.log('\n  \x1b[32m➜\x1b[0m  \x1b[1mDashboard Links:\x1b[0m');
          console.log(`  \x1b[36m🛍️  Customer Dashboard: \x1b[0m ${baseUrl}/`);
          console.log(`  \x1b[36m🧑‍🍳 Partner Dashboard:  \x1b[0m ${baseUrl}/#partner`);
          console.log(`  \x1b[36m🛵 Rider Dashboard:    \x1b[0m ${baseUrl}/#rider\n`);
          console.log(`  \x1b[33m⚠️  Note: If clicking the links opens File Explorer, please COPY and PASTE them directly into Chrome.\x1b[0m\n`);
        }, 100);
      });
    }
  };
};

export default defineConfig({
  root: '.',
  publicDir: 'public',
  plugins: [customDashboardLinksPlugin()],
  server: {
    port: 5173,
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
