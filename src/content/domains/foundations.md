---
name: 基础与架构
en: Foundations & Architectures
order: 1
status: mature
summary: 神经网络的骨架与训练原理：从感知机、CNN/RNN 到 Transformer，以及后 Transformer 时代对新架构的持续探索。
keyPapers:
  - Attention Is All You Need（2017，Transformer 原始论文）
  - Deep Residual Learning（2015，ResNet）
  - Long Short-Term Memory（1997，LSTM）
  - "Mamba: Linear-Time Sequence Modeling（2023）"
keyLabs:
  - Google Brain / DeepMind
  - Meta AI (FAIR)
  - MIT CSAIL
tags: [架构, 注意力, 表示学习]
---

## 解决什么问题

一切上层能力都压在「架构」这块地基上：用什么计算结构处理数据、如何训练得动、如何堆到足够大的规模。这个领域回答的是**骨架问题**——序列该怎样建模、梯度该怎样流动、算力该怎样花。

## 当前图景

Transformer 自 2017 年以来统一了语言、视觉、语音乃至蛋白质序列的建模，是当之无愧的「通用架构」。它的核心优势不是注意力本身，而是**完美的硬件亲和性**：稠密矩阵乘法吃满了 GPU/TPU 的算力，使规模化的成本曲线可控。

但稠密注意力的平方复杂度始终是天花板，于是出现了两条路线：一条在 Transformer 内部做近似（稀疏注意力、线性注意力、FlashAttention 式的 IO 优化）；另一条干脆换骨架——SSM/Mamba 及其混合架构在长序列上给出了线性复杂度，RWV 等也各有拥趸。目前的共识正在向「混合架构」（少量全注意力层 + 大量线性层）收敛。

## 开放问题

- Transformer 的成功有多少来自归纳偏置，多少来自可扩展性？换掉注意力到底损失了什么？
- 长上下文的「架构解」与「系统解」（KV Cache 优化、检索）会在哪一层汇合？
- 是否存在下一个「统一架构」，能原生处理离散 token 与连续控制信号？
