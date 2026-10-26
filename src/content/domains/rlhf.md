---
name: RLHF 与偏好学习
en: RLHF & Preference Learning
parent: reasoning
order: 0
status: active
summary: 用人类偏好信号塑造模型行为：从 PPO 三段式到 DPO 的扁平化，再到可验证奖励的 RL 复兴。
keyPapers:
  - Training language models to follow instructions（2022，InstructGPT）
  - Direct Preference Optimization（2023）
  - DeepSeekMath / GRPO（2024）
keyLabs:
  - OpenAI
  - Anthropic
  - DeepSeek
tags: [RLHF, DPO, 偏好优化]
---

RLHF 的核心洞见是：人类说不出「好答案的公式」，但认得出「哪个答案更好」。把这种比较信号训练成奖励模型，再用 RL（PPO）最大化它，InstructGPT 用 1.3B 参数 + 偏好数据打赢了 175B 的原始 GPT-3，证明对齐不是「附加项」而是能力的放大器。

2023 年 DPO 把流程压缩为一步：偏好对的似然比本身就是奖励的替身，无需 RM、无需 RL 循环，训练稳定性大增，成为开源社区事实标准。RLHF 的适用范围也在迁移：从「让回答更讨喜」的行为对齐，扩展到「让推理更正确」的能力对齐——GRPO（DeepSeek）等策略配合可验证奖励（代码跑测试、数学对答案），把 RL 从对齐工具变成了能力引擎。

## 看点

偏好数据的「 diversity 瓶颈」：人类标注偏好覆盖不了模型能力前沿，RLAIF 与可验证奖励是两条出路，各有失真。
