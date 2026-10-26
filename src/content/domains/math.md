---
name: 数学证明与科学发现
en: Math & Discovery
parent: ai-for-science
order: 3
status: emerging
summary: 从 IMO 奖牌到研究级定理：AlphaProof 的搜索-学习混合范式，与形式化验证的可信出口。
keyPapers:
  - AlphaGeometry（2024，NeurIPS）
  - AlphaProof（2024，IMO 银牌水平）
  - DeepMind 与陶哲轩等合作的 FunSearch（2023）
keyLabs:
  - Google DeepMind
  - Lean 社区（mathlib）
  - Harmonic / MathInc 等创业公司
tags: [自动证明, Lean, 搜索]
---

数学是「完美可验证」的领域——对错不靠审稿人而靠机械检查，因此天然适配 RL 的可验证奖励范式。AlphaGeometry（2024）用符号演绎引擎 + 神经语言模型分工，把 IMO 几何做到金牌选手平均水准；AlphaProof 把形式化数学（Lean）+ AlphaZero 式自博弈推广到代数与数论，2024 年 IMO 六题解出四题，达到银牌线。

研究级进展也已开张：FunSearch 用 LLM 迭代生成程序，在 cap set 问题上改进了二十年的已知界——第一个「LLM 参与发现新数学」的案例；陶哲轩大力推动 Lean 形式化，让「AI 生成、人类审计」的协作流程在真正的数学研究中扎根。这条路线的意义超出数学本身：它演示了「可验证域内 AI 自主探索」的完整回路。

## 看点

自动证明的「摩尔曲线」与模型规模解耦（搜索 + 领域引擎的贡献巨大）。真正的研究级定理（而非竞赛题）何时被独立攻克，将是这条线的下一个头条。
