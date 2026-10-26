/**
 * 在 base 路径（GitHub Pages 仓库名）下拼接站内链接。
 * 页面路由（目录式，trailingSlash: 'always'）统一输出尾斜杠，
 * 保证与 dev/preview/GitHub Pages 的规范化 URL 一致，
 * Markdown 正文里的相对链接才能稳定解析；
 * 静态资源（含扩展名，如 favicon.svg）不加斜杠。
 */
export function u(path: string): string {
  const base = (import.meta.env.BASE_URL ?? '/').replace(/\/+$/, '');
  const p = path.replace(/^\/+/, '').replace(/\/+$/, '');
  if (!p) return `${base}/`;
  const last = p.split('/').pop() ?? '';
  const isAsset = /\.[a-z0-9]+$/i.test(last);
  return isAsset ? `${base}/${p}` : `${base}/${p}/`;
}

/** 2026 年 9 月 20 日 */
export function formatDate(d: Date): string {
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
}

/** 提取可用于页内目录的标题（h2/h3） */
export function tocItems(headings: { depth: number; slug: string; text: string }[]) {
  return headings.filter((h) => h.depth >= 2 && h.depth <= 3);
}

/** 9 月 20 日（同年内的时间线用） */
export function formatMonthDay(d: Date): string {
  return `${d.getMonth() + 1} 月 ${d.getDate()} 日`;
}

/** 领域生命周期状态 */
export const DOMAIN_STATUS_META: Record<string, { label: string; cls: string }> = {
  active: { label: '活跃前沿', cls: 'text-emerald-300 bg-emerald-500/10 ring-emerald-400/30' },
  emerging: { label: '新兴方向', cls: 'text-sky-300 bg-sky-500/10 ring-sky-400/30' },
  mature: { label: '成熟领域', cls: 'text-amber-300 bg-amber-500/10 ring-amber-400/30' },
  cooling: { label: '热度转移', cls: 'text-slate-400 bg-slate-500/10 ring-slate-400/30' },
};

/** 研究问题状态 */
export const QUESTION_STATUS_META: Record<string, { label: string; cls: string }> = {
  open: { label: '悬而未决', cls: 'text-rose-300 bg-rose-500/10 ring-rose-400/30' },
  progressing: { label: '稳步推进', cls: 'text-sky-300 bg-sky-500/10 ring-sky-400/30' },
  contested: { label: '存在争议', cls: 'text-amber-300 bg-amber-500/10 ring-amber-400/30' },
  'partially-solved': { label: '部分解决', cls: 'text-emerald-300 bg-emerald-500/10 ring-emerald-400/30' },
};

/** 时间线事件重要度 */
export const IMPORTANCE_META: Record<string, { label: string; dotCls: string }> = {
  key: { label: '关键里程碑', dotCls: 'h-4 w-4 ring-4' },
  major: { label: '重要', dotCls: 'h-2.5 w-2.5 ring-2' },
  minor: { label: '注脚', dotCls: 'h-2 w-2 ring-1 opacity-70' },
};

/** 内容流类型标签 */
export const FEED_KIND_META: Record<string, { label: string; cls: string }> = {
  post: { label: '综述', cls: 'text-indigo-300 bg-indigo-500/10 ring-indigo-400/30' },
  paper: { label: '精读', cls: 'text-sky-300 bg-sky-500/10 ring-sky-400/30' },
  question: { label: '问题', cls: 'text-amber-300 bg-amber-500/10 ring-amber-400/30' },
  note: { label: '速记', cls: 'text-slate-300 bg-slate-500/10 ring-slate-400/30' },
};
