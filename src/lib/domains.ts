import type { CollectionEntry } from 'astro:content';

export interface RootDomainMeta {
  slug: string;
  name: string;
  en: string;
  color: string;
}

/** 十大根领域：全站颜色与排序的唯一权威定义 */
export const ROOT_DOMAINS: RootDomainMeta[] = [
  { slug: 'foundations', name: '基础与架构', en: 'Foundations & Architectures', color: '#818cf8' },
  { slug: 'pretraining', name: '预训练与数据', en: 'Pretraining & Data', color: '#38bdf8' },
  { slug: 'reasoning', name: '后训练与推理', en: 'Post-training & Reasoning', color: '#e879f9' },
  { slug: 'alignment', name: '安全与对齐', en: 'Safety & Alignment', color: '#fb7185' },
  { slug: 'multimodal', name: '多模态', en: 'Multimodal', color: '#fb923c' },
  { slug: 'agents', name: '智能体', en: 'Agents', color: '#34d399' },
  { slug: 'embodied', name: '具身智能', en: 'Embodied AI', color: '#a3e635' },
  { slug: 'efficiency', name: '效率与系统', en: 'Efficiency & Systems', color: '#facc15' },
  { slug: 'ai-for-science', name: 'AI for Science', en: 'AI for Science', color: '#22d3ee' },
  { slug: 'theory', name: '理论', en: 'Theory', color: '#94a3b8' },
];

export const ROOT_COLORS: Record<string, string> = Object.fromEntries(
  ROOT_DOMAINS.map((d) => [d.slug, d.color]),
);

export const ROOT_META: Record<string, RootDomainMeta> = Object.fromEntries(
  ROOT_DOMAINS.map((d) => [d.slug, d]),
);

export interface DomainNode {
  slug: string;
  entry: CollectionEntry<'domains'>;
  children: DomainNode[];
}

/** slug -> parent slug 映射（无父则值为 undefined） */
export function makeParentMap(entries: CollectionEntry<'domains'>[]): Map<string, string | undefined> {
  const m = new Map<string, string | undefined>();
  for (const e of entries) m.set(e.id, e.data.parent);
  return m;
}

/** 沿 parent 链上溯，返回根领域 slug */
export function rootOf(slug: string, parentMap: Map<string, string | undefined>): string {
  let cur = slug;
  let guard = 0;
  while (guard++ < 16) {
    const p = parentMap.get(cur);
    if (!p) return cur;
    cur = p;
  }
  return cur;
}

/** 将扁平的领域条目构建为树，根按 ROOT_DOMAINS 顺序、子按 order 排序 */
export function buildDomainTree(entries: CollectionEntry<'domains'>[]): DomainNode[] {
  const nodes = new Map<string, DomainNode>();
  for (const e of entries) nodes.set(e.id, { slug: e.id, entry: e, children: [] });

  const roots: DomainNode[] = [];
  for (const e of entries) {
    const node = nodes.get(e.id)!;
    const parent = e.data.parent;
    if (parent && nodes.has(parent) && parent !== e.id) {
      nodes.get(parent)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  const rootOrder = new Map(ROOT_DOMAINS.map((d, i) => [d.slug, i]));
  const byOrder = (a: DomainNode, b: DomainNode) =>
    a.entry.data.order - b.entry.data.order || a.slug.localeCompare(b.slug);
  roots.sort(
    (a, b) => (rootOrder.get(a.slug) ?? 99) - (rootOrder.get(b.slug) ?? 99) || byOrder(a, b),
  );
  for (const n of nodes.values()) n.children.sort(byOrder);
  return roots;
}

/** 某领域（含其子树）覆盖的所有 slug 集合，用于聚合查询论文/事件/问题 */
export function subtreeOf(
  slug: string,
  entries: CollectionEntry<'domains'>[],
): Set<string> {
  const childrenOf = new Map<string, string[]>();
  for (const e of entries) {
    if (e.data.parent) {
      const arr = childrenOf.get(e.data.parent) ?? [];
      arr.push(e.id);
      childrenOf.set(e.data.parent, arr);
    }
  }
  const out = new Set<string>([slug]);
  const queue = [slug];
  while (queue.length) {
    const cur = queue.shift()!;
    for (const c of childrenOf.get(cur) ?? []) {
      if (!out.has(c)) {
        out.add(c);
        queue.push(c);
      }
    }
  }
  return out;
}
