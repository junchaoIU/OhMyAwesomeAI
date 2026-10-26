---
name: 数据工程与语料构建
en: Data Engineering
parent: pretraining
order: 2
status: active
summary: 从 Common Crawl 到「数据飞轮」：去重、质量分类、配比与课程、合成数据——大模型时代的炼油学。
keyPapers:
  - The RefinedWeb Dataset（2023，Falcon）
  - Textbooks Are All You Need（2023，Phi 系列）
  - Llama 3 技术报告的数据章节（2024）
keyLabs:
  - Meta AI
  - Microsoft（Phi 系列）
  - Cohere / Dolma（AI2）
tags: [去重, 数据质量, 合成数据]
---

行业内部流传一句话：**模型的质量上限在数据管道里就定死了**。Common Crawl 级别的原始语料 90% 以上是噪声，真正决定基座素质的是那套不可见的流水线：多级去重（精确 + 模糊 + 语义）、质量分类器（从 fastText 到 LLM-as-judge）、语言与领域配比（代码、数学、多语的黄金比例）、以及按训练阶段调整的课程。

Phi 系列把「教科书级数据」做成了旗帜：模型可以更小，只要数据密度够高。2024 年后合成数据从禁忌变成标配——Llama 3 的后训练、各类数学与代码语料大量依赖模型自产，配合严格的去污染与验证闭环。「合成数据自噬」（模型吃自己输出导致退化）是最大风险，目前的答案是用强模型生成 + 弱模型验证 + 外部信号锚定。

## 看点

数据配比细节几乎从不公开，是各家最深的护城河。Dolma、RefinedWeb、FineWeb 这类开放语料的价值，在于让「炼油学」第一次可以被学术复现。
