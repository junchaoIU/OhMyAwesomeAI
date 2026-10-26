---
name: 测试时计算与推理模型
en: Test-Time Compute
parent: reasoning
order: 3
status: active
summary: 把算力从训练挪到推理：o1 开创、DeepSeek-R1 民主化的「想得越久答得越好」范式。
keyPapers:
  - Let's Verify Step by Step（2023，OpenAI）
  - o1 系统卡与 Scaling Test-Time Compute（2024）
  - DeepSeek-R1（2025）
keyLabs:
  - OpenAI
  - DeepSeek
  - Google DeepMind (Gemini Thinking)
tags: [o1, 强化学习, 推理模型]
---

o1（2024）确立了一个此前只在小规模验证过的范式：给模型「思考预算」，用 RL 优化长推理轨迹，测试时算力与答案质量近似单调相关。数学、代码、科学推理的基准曲线被整体抬升——AIME、IOI 级别任务从「模型做不对」变成「模型想一会儿就能对」。

DeepSeek-R1（2025）的冲击在于两点：其一，纯可验证奖励的 RL（GRPO）无需人工过程标注即可诱发反思、验证、回溯等「自发行为」，甚至出现被社区称为「顿悟」的 mid-trajectory 转向；其二，MIT 协议开源把这套能力免费交给了全世界，直接改写了推理 API 的价格体系。

范式也带来新成本：推理算力成为新的预算大头，「何时停止思考」成为优化目标本身；过度思考（overthinking）与奖励作弊（reward hacking）是当前的两大工程敌人。

## 看点

测试时计算的 Scaling 曲线在哪些任务上会饱和（数学已近高原，开放式研究问题还远）、能否教会模型「分配思考预算」而非一味多想，决定这条路线的天花板。
