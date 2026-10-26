---
name: Agent Skills
en: Agent Skills
parent: agents
order: 2
status: emerging
summary: SKILL.md 开放标准：把「怎么做一类任务」打包成渐进披露的技能文件夹——知识复用从 prompt 复制走向「agent 时代的软件包」。
keyPapers:
  - Agent Skills（2025-10，Anthropic）
  - SKILL.md 开放标准（2025-12）
  - Claude Code 技能生态（2025–2026）
keyLabs:
  - Anthropic
  - 开源 skills 社区
tags: [技能, SKILL.md, 渐进式披露]
---

一个文件夹就是一项技能：SKILL.md 是模型最先读的「说明书」，旁边可以放脚本（确定性执行的代码）与资源文件（模板、参考文档）。加载遵循渐进式披露（progressive disclosure）——先读名称与元数据，需要时才读全文，再需要时才执行脚本——上下文成本随需扩展。2025 年 10 月 Anthropic 随 Claude 发布 Agent Skills，12 月把 SKILL.md 规范开源为跨平台开放标准，复制了 MCP 的标准缔造路径。

它填的是知识复用的结构性空缺：prompt 里的任务知识不可复用（每个项目重写一遍）、RAG 检索缺结构与行为约定、微调重而慢。skills 是中间粒度——声明式知识与命令式脚本的组合体，可版本化、可分发、可热加载。与 MCP 的分工就此清晰：**MCP 给 agent 接工具（运行时能力），skills 教 agent 做事（任务知识）**——驱动与说明书。

## 看点

skills 能否成为「agent 时代的 npm」取决于三件事：版本与依赖管理、跨 harness 可移植性（开放标准正是为此）、以及安全审计——恶意 SKILL.md 是新的供应链攻击面，agent 读进上下文的每一份「说明书」都是注入向量。
