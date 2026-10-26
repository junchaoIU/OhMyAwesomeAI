---
name: 记忆与规划
en: Memory & Planning
parent: agents
order: 3
status: active
summary: Agent 的时间维度：上下文之外的持久记忆、任务分解与自我反思的工程学。
keyPapers:
  - Generative Agents（2023，斯坦福小镇）
  - Voyager（2023，技能库与终身学习）
  - MemGPT / Letta（2023–2024）
keyLabs:
  - Stanford
  - Anthropic（Claude 的 memory 功能）
  - Letta / Mem0 等创业生态
tags: [记忆, 规划, 反思]
---

记忆的本质矛盾：上下文窗口是易失的 RAM，而任务需要硬盘。2023 年斯坦福 Generative Agents（25 个 AI 代理的小镇）给出了经典架构——记忆流 + 重要性打分 + 反思合成（「我注意到我和 Klaus 讨论过三次樱花」），这套思想至今仍是 Agent 记忆系统的原型。MemGPT 把操作系统的分页思想搬进 LLM，Claude 的 memory 功能则把「记住用户偏好」做成产品级功能。

规划侧的实践收敛在两个极端之间：一端是 Planner-Executor 分层（先出计划、逐步执行、失败重规划），另一端是 Claude Code 式的「不规划、循环干、靠上下文窗口兜底」。后者出乎意料地有效——当模型足够强、窗口足够大，「显式规划」的部分价值被上下文内隐式规划吸收了。

## 看点

「上下文工程」（context engineering）正在取代 prompt engineering 成为热词：Agent 的成败越来越取决于每一轮塞进窗口的是什么，而非单条 prompt 写得多漂亮。
