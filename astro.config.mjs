// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages 地址（用户名小写）
  site: 'https://junchaoiu.github.io',
  // GitHub Pages 仓库名作为 base 路径；
  // 若部署到 <用户名>.github.io 主仓库，请改为 '/'
  base: '/OhMyAwesomeAI',
  // 页面 URL 统一为目录式（带尾斜杠），与构建产物（<slug>/index.html）
  // 及 GitHub Pages 的重定向行为一致；dev/preview 也会把无尾斜杠请求
  // 301 到带斜杠版本，保证 Markdown 正文里的相对链接解析基准一致
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()],
  },
});
