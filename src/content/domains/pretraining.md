---
name: 预训练与数据
en: Pretraining & Data
order: 2
status: active
summary: 大模型能力的第一性来源：Scaling Laws、数据配比与清洗、开源模型生态，以及「数据墙」之下的下一阶段预训练范式。
keyPapers:
  - Scaling Laws for Neural Language Models（2020，Kaplan）
  - Training Compute-Optimal Large Language Models（2022，Chinchilla）
  - Language Models are Few-Shot Learners（2020，GPT-3）
keyLabs:
  - OpenAI
  - DeepMind
  - Meta AI
  - DeepSeek
tags: [Scaling Laws, 数据工程, 开源模型]
---

## 解决什么问题

模型的智能从哪里来？这个领域的答案是：**从算力、数据与参数的幂律关系中「买」来**。预训练与数据研究的是怎么花最少的钱买到最多的能力，以及当「原料」（互联网文本）耗尽时接下来买什么。

## 当前图景

Kaplan 2020 年给出损失-算力-数据的幂律，Chinchilla 2022 年修正了最优参数/数据配比，此后两年行业沿着「Chinchilla-optimal 之后继续超采数据」的方向演进（Llama 3、Qwen 2.5 均为数据远超参数最优配比）。数据侧的重心从「收集」转向「工程」：去重、质量分类器、领域配比、课程式训练、合成数据回流。

2024–2025 年，Llama、Qwen、DeepSeek 等开源（权重）模型把前沿能力持续下放，开源与闭源的差距被压缩到以月计。与此同时，「数据墙」成为共识性焦虑——公开文本的总量上限逼近，合成数据与强化学习阶段（后训练）承担起越来越多的能力增益。

## 开放问题

- 数据墙之后，预训练的边际收益靠什么维持：合成数据、多模态语料，还是把预算挪给后训练？
- Scaling Laws 在测试时计算时代是否需要重写（算力从预训练转移到推理）？
- 开源模型能否长期保持与闭源前沿的「可追距离」？
