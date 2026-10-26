---
name: 思维链与提示推理
en: Chain-of-Thought
parent: reasoning
order: 2
status: mature
summary: 「一步步想」如何把概率接龙变成推理机：CoT、自一致性、分解式提示，以及推理忠实性之辩。
keyPapers:
  - Chain-of-Thought Prompting（2022）
  - Self-Consistency（2022）
  - Large Language Models are Zero-Shot Reasoners（2022）
keyLabs:
  - Google Research
  - OpenAI
tags: [CoT, 提示工程, 忠实性]
---

2022 年的两篇论文改变了交互范式：Zero-shot CoT 发现一句「Let's think step by step」就能解锁多步推理，Wei 等人的 few-shot CoT 则证明中间步骤的质量随模型规模涌现。之后的扩展沿三个方向：搜索（自一致性投票、树搜索）、分解（ Least-to-Most、Plan-and-Solve）、反思（Self-Refine、 verifier 校验）。

「忠实性」（faithfulness）是这条线上的哲学难题：写出来的推理链是真实的因果路径，还是事后编造的合理化说辞？证据两面都有——干预中间步骤会系统性改变结论（支持真实性），但模型也常在链中「先有答案后补理由」。这个争论直接关系到 CoT 监控能否作为安全手段（如果 CoT 不忠实，读心就失效）。

## 看点

提示侧的推理工程正在被训练侧吸收：o1/R1 时代，「教模型想」取代了「求模型想」。CoT 从技巧变成默认行为，提示工程师的红利期结束了。
