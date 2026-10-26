---
name: 后 Transformer 架构
en: Beyond Transformer
parent: foundations
order: 2
status: emerging
summary: 线性注意力、SSM/Mamba、RWKV 等挑战者：用线性复杂度换取（或超越）平方注意力的质量。
keyPapers:
  - "Mamba: Linear-Time Sequence Modeling（2023）"
  - Mamba-2 / Transformer² 系列（2024）
  - RWKV（2023）
keyLabs:
  - Princeton / CMU
  - Microsoft Research
  - RWKV 社区
tags: [SSM, 线性注意力, Mamba]
---

挑战者的共同动机：注意力的 O(n²) 复杂度让「真正长的上下文」在算力上不可持续。状态空间模型（Mamba 一系）把序列压缩进固定大小的隐状态，推理成本与序列长度解耦，长序列上速度优势可达数量级；RWKV 把 RNN 重构为可并行的线性注意力变体，社区生态活跃。

但纯线性架构在「精确检索」类任务（needle-in-haystack、induction heads 式复制）上存在系统性短板——固定状态记不住所有细节。2024 年后的共识走向混合：Jamba、Griffin、Samba 等把少量全注意力层穿插在 SSM/线性层之间，兼得两头。DeepSeek-V3 等前沿模型也部分吸收了稀疏注意力思想。

## 看点

混合架构的比例（多少层保留全注意力）正在成为一个新的「超参科学」；更根本的问题是：语言建模到底需要多少「精确回顾」能力，剩下的能否全部交给压缩状态。
