---
name: 优化与训练动力学
en: Optimization & Training Dynamics
parent: foundations
order: 3
status: mature
summary: AdamW 之后几乎冻结的优化器地层，与训练稳定性、学习率调度、梯度流诊断的工程科学。
keyPapers:
  - Decoupled Weight Decay Regularization（AdamW，2017/2019）
  - Scaling Laws 与 μP（超参跨尺度迁移）
  - Muon / 优化器新浪潮（2024–2025）
keyLabs:
  - Meta AI
  - DeepSeek
  - Keller Jordan 的 modded-nanogpt 社区
tags: [优化器, 训练稳定性]
---

一个反直觉的事实：深度学习用着 2014 年的优化器（Adam 系）达到了 2025 年的能力。AdamW + 余弦学习率 + warmup 几乎是十年不变的默认配方，真正推动训练的是数据、规模与稳定性工程（loss spike 的预防与恢复、混合精度下的数值策略、z-loss 一类的正则）。

变化正在发生。μP（maximal update parametrization）给出了跨参数规模迁移超参的理论框架——小模型调参、大模型直接用，极大降低了大训练的试错成本；Muon 等新优化器在 2024–2025 年由社区（如 modded-nanogpt 速度赛）推动进入主流视野，DeepSeek 等也开始在大规模训练中验证非 Adam 路线。训练动力学诊断（梯度噪声尺度、损失曲面可视化）则从学术好奇变成大厂训练团队的日常工具。

## 看点

「loss spike 复盘」几乎从不发论文，但它是前沿训练最贵的知识。谁先把训练稳定性从玄学变成科学，谁就能把万卡集群的利用率抬高一个点。
