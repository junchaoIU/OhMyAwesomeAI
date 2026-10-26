---
name: Transformer 与注意力架构
en: Transformer & Attention
parent: foundations
order: 1
status: mature
summary: 自注意力驱动的序列建模范式，2017 年以来统一了 NLP、视觉与语音的事实标准架构。
keyPapers:
  - Attention Is All You Need（2017）
  - FlashAttention（2022）
  - Grouped-Query Attention 系列（2023）
keyLabs:
  - Google
  - Meta AI
tags: [注意力, 序列建模]
---

自注意力的本质是让序列中每个位置直接「看见」所有其他位置，信息路径长度为 O(1)，彻底绕开了 RNN 的顺序瓶颈。今天回头看，Transformer 赢下的关键有三条：并行性（训练吃满硬件）、可扩展性（损失随规模平滑下降）、通用性（一切皆 token）。

当前的主要工作不再是「改进注意力」，而是「给注意力减负」：MQA/GQA 压缩 KV 头数以省显存，FlashAttention 以算子级 IO 优化让平方注意力跑得动长序列，滑动窗口与层间 KV 共享进一步控制成本。架构层的微调在 2023 年后趋于保守——大家更愿意把创新留给数据与训练配方。

## 看点

值得警惕的是「架构即数据」的耦合：很多「更好的注意力」在放大模型与长训练下被抹平。判断一个架构改进是否真有价值，标准是它是否在 10B 以上 token、多次学习率扫描下依然成立。
