---
name: 后训练与推理
en: Post-training & Reasoning
order: 3
status: active
summary: 预训练之后的全部工序与产出：SFT、偏好对齐（RLHF/DPO）、知识蒸馏（OPD）到可验证奖励的 RL，以及思维链、测试时计算、长上下文等能力范式。
keyPapers:
  - Training language models to follow instructions（2022，InstructGPT）
  - Chain-of-Thought Prompting Elicits Reasoning（2022）
  - Direct Preference Optimization（2023）
  - On-Policy Distillation（2025，Thinking Machines）
  - DeepSeek-R1（2025，RL 诱发推理）
keyLabs:
  - OpenAI
  - DeepSeek
  - Anthropic
  - Google DeepMind
tags: [后训练, RLHF, 推理模型, 长上下文]
---

## 解决什么问题

预训练给出一个「会接龙的文明」，这个领域负责其后的一切：**工序**——SFT 教格式与指令、偏好对齐教取舍、RL 教推理——把基座变成可用的产品；以及**产出**——模型如何「想清楚再回答」，能力边界在哪里。工序与能力在 2024 年后合流为一门工程学科：同一条 RL 管线，奖励换成人类偏好是行为对齐，换成可验证结果就是能力引擎。

## 当前图景

行为侧：InstructGPT 确立 SFT → RM → PPO 的三段式，DPO 把流程压缩为一步、成为开源社区主流；蒸馏则在 2025 年后从离线模仿升级为在线策略蒸馏（OPD）——学生自己生成、教师逐 token 反馈，成为 SFT 与 RL 之间的第三条路。能力侧：2022 年思维链（CoT）证明「写出中间步骤」即可显著提升推理；2024 年 o1 把测试时计算变成产品——推理时间越长，答案越好，算力从训练侧挪到推理侧；2025 年 DeepSeek-R1 证明纯可验证奖励的 RL（无人工过程标注）即可诱发长链推理与自我修正，「教模型想」正式取代「求模型想」。

与此同时，能力边界的刻画也在精细化：长上下文从「塞得进」走向「用得好」（needle-in-haystack 之后是跨文档聚合），世界模型之辩（LLM 是否有连贯的环境表征）成为检验推理深度的试金石。

## 开放问题

- 奖励黑客与过度思考：RL 优化代理目标的两大工程天敌，收益边界在哪、何时反而跑偏？
- RL 诱发的推理是真正的「搜索」还是范式记忆的展开？
- 蒸馏的能力上限：学生能否超越教师，还是 reverse KL 注定只能压缩不能创造？
- 行为对齐与能力 RL 共用一条管线时的相互作用——对齐税在推理模型时代的新形态？
- System 1 / System 2 能否在同一个模型内按需切换，而不是分属两个产品档位？
