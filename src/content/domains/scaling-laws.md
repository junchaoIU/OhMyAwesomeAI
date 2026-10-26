---
name: Scaling Laws 与算力经济学
en: Scaling Laws
parent: pretraining
order: 1
status: active
summary: 损失随算力、数据、参数的幂律下降——及其修订版（Chinchilla）与测试时计算时代的新账本。
keyPapers:
  - Scaling Laws for Neural Language Models（2020，Kaplan）
  - Training Compute-Optimal LLMs（2022，Chinchilla）
  - Scaling Test-Time Compute（2024）
keyLabs:
  - OpenAI
  - DeepMind
  - Epoch AI（算力审计）
tags: [幂律, 计算最优]
---

Kaplan 曲线（2020）第一次把「堆算力」变成可外推的工程决策：损失 ∝ 算力的幂律。Chinchilla（2022）修正为「同算力下参数与数据应等比增长」，直接改写了行业的模型尺寸选择——从「大参数、欠数据」转向「小参数、足数据」。2023 年后的实际演进又偏离开 Chinchilla：推理成本占主导后，一次性多花训练算力换更小的损失摊到每次调用更划算（over-train 小模型的经济学）。

Epoch AI 一类机构把「前沿训练的算力账」做成了公开数据集：前沿模型的训练算力约每 5–6 个月翻倍，2024–2025 年已进入 10^26 FLOP 量级。算力、数据、参数的三元约束之外，2024 年加入了第四个变量：**测试时计算**——o1 式推理把「算力换能力」的兑换点从训练期搬到了推理期，Scaling 的叙事正在被重写。

## 看点

三条曲线的接力（预训练 → 后训练 RL → 测试时计算）是否存在统一的最优分配定理，是这个时代最值钱的「如果我知道」。
