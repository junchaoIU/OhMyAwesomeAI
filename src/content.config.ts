import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * 领域地图节点。
 * 根领域不带 parent；子领域通过 parent（父节点 slug）挂接成树。
 */
const domains = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/domains' }),
  schema: z.object({
    name: z.string(),
    en: z.string().optional(),
    parent: z.string().optional(),
    order: z.number().default(0),
    status: z.enum(['active', 'emerging', 'mature', 'cooling']).default('active'),
    summary: z.string(),
    keyPapers: z.array(z.string()).default([]),
    keyLabs: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
  }),
});

/** 时间线事件：领域演进的关键节点 */
const timeline = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/timeline' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    domain: z.string(),
    importance: z.enum(['key', 'major', 'minor']).default('major'),
    summary: z.string(),
    paperRef: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

/** 论文精读 */
const papers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/papers' }),
  schema: z.object({
    title: z.string(),
    authors: z.string(),
    venue: z.string().optional(),
    year: z.number(),
    url: z.string().url().optional(),
    domain: z.string(),
    rating: z.number().min(1).max(5),
    oneLiner: z.string(),
    takeaways: z.array(z.string()).default([]),
  }),
});

/** 重要研究问题追踪 */
const questions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/questions' }),
  schema: z.object({
    title: z.string(),
    domain: z.string(),
    status: z.enum(['open', 'progressing', 'contested', 'partially-solved']),
    whyMatters: z.string(),
    keyWorks: z.array(z.string()).default([]),
  }),
});

/** 综述长文 */
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    domain: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

/** 日志速记：短内容流，正文即全部内容 */
const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    date: z.coerce.date(),
    title: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { domains, timeline, papers, questions, posts, notes };
