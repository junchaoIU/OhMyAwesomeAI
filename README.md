# OhMyAwesomeAI — AI 世界地图研究博客

个人的 AI 研究综述站点：以「世界地图 + 时间线」两条主线梳理 AI 领域——领域地图回答「现在有什么」，时间线回答「怎么走到今天」，论文精读与研究问题提供纵深。

## 技术栈

- [Astro 5](https://astro.build) — 静态站点框架，内容全部由 Content Collections（Markdown + zod schema）驱动
- [Tailwind CSS v4](https://tailwindcss.com) + Typography 插件 — 深色「星图」学术风
- 零客户端框架依赖，页面交互（地图树、时间线/论文过滤）为少量原生 JS

## 本地开发

```bash
npm install
npm run dev      # 开发服务器 http://localhost:4321
npm run build    # 产出静态站点到 dist/
npm run preview  # 本地预览构建结果
```

> Windows + PowerShell 若提示无法运行 npm.ps1，请改用 `npm.cmd run dev` 等命令。

## 内容模型

所有内容在 `src/content/` 下，schema 定义于 `src/content.config.ts`（写错 frontmatter 会在构建时报错）：

| 集合 | 路径 | 用途 | 关键字段 |
| --- | --- | --- | --- |
| `domains` | `src/content/domains/` | 世界地图节点（树结构） | `name` `parent` `order` `status` `summary` `keyPapers` |
| `timeline` | `src/content/timeline/` | 演进事件 | `date` `domain` `importance` `summary` `paperRef` |
| `papers` | `src/content/papers/` | 论文精读 | `title` `domain` `rating` `oneLiner` `takeaways` |
| `questions` | `src/content/questions/` | 研究问题追踪 | `title` `domain` `status` `whyMatters` `keyWorks` |
| `posts` | `src/content/posts/` | 综述长文 | `title` `date` `description` `domain` `tags` |
| `notes` | `src/content/notes/` | 日志速记（正文即内容） | `date` `title` `tags` |

### 写作流程示例

新增一篇论文精读，请新建 `src/content/papers/<slug>.md`：

```markdown
---
title: 论文标题
authors: [A. Author, B. Author]
venue: NeurIPS
year: 2023
url: https://arxiv.org/abs/xxxx.xxxxx
domain: transformer        # 指向 domains 集合中的 slug
rating: 4                  # 1–5
oneLiner: 一句话总结
takeaways:
  - 要点一
  - 要点二
---

## 背景
...
## 动机
...
## 方法
...
## 实验设置
...
## 结果
...
## 有趣的洞见
...
## 批判性评价
...
```

其余集合同理。文件名即 URL slug。

### 领域与颜色

十个根领域在 `src/lib/domains.ts` 的 `ROOT_DOMAINS` 中定义（slug、名称、主题色）。子领域通过 frontmatter 的 `parent` 字段挂到任一节点下，颜色自动继承根领域。新增根领域只需在该数组追加一项。

子领域页正文支持「相关工作路线」形态：分两层——上方**高亮路线**（高影响力论文、范式确立之作与常用基线，条目按时间倒序、默认折叠，summary 收起时即见七件套：标题、第一单位、时间、发表 venue、论文链接、代码链接与一句话简介，展开是核心问题/方法/结果/结论反思的分点）；下方可选**全景档案**（大量条目同样用 `<details class="paper-entry">` 折叠，按时间倒序平铺、不分类，展开是背景与研究问题/具体方法/实验设置和结果的三段分点；来源页的模板化描述可解码为「领域 · 问题短标签」）。样式见 `global.css` 的 `.paper-entry`，有站内精读的条目互链——条目再多页面也只是变长的折叠清单，不会变成长文（参考 `domains/distillation.md`，含 230 篇档案）。

### 正文内链

Markdown 正文里的站内链接请使用**相对路径**（如 `../questions/foo`、`../../map/bar`），这样本地 dev 与带 base 前缀的 GitHub Pages 都能正确解析；页面模板中的链接一律走 `src/lib/utils.ts` 的 `u()` 辅助函数。

## 部署到 GitHub Pages

站点通过仓库内的 GitHub Actions workflow（`.github/workflows/deploy.yml`）自动构建部署，推送到 `main` 分支即触发。

### 首次部署 checklist

1. **修改 `astro.config.mjs`**：
   - `site` 改为你的实际地址，如 `https://<用户名>.github.io`；
   - 若仓库名不是 `OhMyAwesomeAI`，`base` 需改为 `/<仓库名>`；
   - 若部署到 `<用户名>.github.io` 主仓库（根站点），把 `base` 改为 `'/'`。
2. **仓库设置**：Settings → Pages → Build and deployment → Source 选择 **GitHub Actions**。
3. 推送到 `main`，Actions 完成后访问 `https://<用户名>.github.io/OhMyAwesomeAI/`。

### 自定义域名（可选）

在 `public/` 下放置 `CNAME` 文件（内容为你的域名），并将 `astro.config.mjs` 的 `site` 改为自定义域名、`base` 改为 `'/'`。

## 目录速览

```
src/
├── content/          # 全部内容（6 个集合，见上表）
├── components/       # BaseLayout / Header / Footer / 卡片与领域树组件
├── layouts/          # （无，布局位于 components/BaseLayout.astro）
├── lib/              # domains.ts（树构建与根领域色）、utils.ts（路径与格式化）
├── pages/            # / 、/map、/timeline、/papers、/questions、/blog、/notes、/about
└── styles/global.css # Tailwind v4 主题与星图样式
```

## License

内容（`src/content/`）与代码分别保留权利；引用请注明出处。
