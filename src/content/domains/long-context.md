---
name: 长上下文
en: Long Context
parent: reasoning
order: 4
status: active
summary: 从 2K 到百万 token：塞得进只是及格线，用得好（跨文档聚合、库级理解）才是前沿。
keyPapers:
  - FlashAttention 系列（2022–2023）
  - YaRN / RoPE 外推（2023）
  - RULER 与 LongBench（2024，评测）
keyLabs:
  - Google（Gemini 1M 上下文）
  - Moonshot AI（Kimi）
  - Meta AI
tags: [长上下文, 位置编码, RAG]
---

上下文窗口的扩张速度超过摩尔定律：2023 年初主流还是 4K，2024 年 Gemini 与 Kimi 已把 1M–2M token 做成产品。技术拼图包括位置编码外推（RoPE 缩放、YaRN）、注意力 IO 优化（FlashAttention-2/3）、KV 压缩与量化、以及「针在 haystack」式检索评测。

但 2024 年的集体反思是：**长上下文 ≠ 长理解**。RULER 等评测显示，很多模型在窗口内 64K 处的检索与聚合能力已开始衰减；「lost in the middle」现象（中间位置信息利用率低）依旧普遍。真正的战场从「窗口大小」转向「窗口内的注意力分配」——多跳聚合、跨文档冲突消解、库级代码理解是当前的试金石。

## 看点

长上下文与 RAG 的边界正在重画：全量进窗 vs 检索进窗的成本曲线交叉点持续右移。当窗口大到能装下整个代码库，「检索」还剩多少必要性，是应用架构的关键变量。
