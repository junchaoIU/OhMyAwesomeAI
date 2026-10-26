---
name: 工具使用与函数调用
en: Tool Use & Function Calling
parent: agents
order: 1
status: active
summary: 让模型调 API、搜网页、执行代码：从 Toolformer 到 MCP 的工具生态标准化。
keyPapers:
  - Toolformer（2023）
  - ReAct（2022）
  - MCP 协议（2024，Anthropic）
keyLabs:
  - Anthropic
  - OpenAI
  - 开源生态（LangChain 等）
tags: [函数调用, MCP, 代码执行]
---

工具使用把模型从「闭卷考试」变成「开卷实操」。技术演化分三步：ReAct（2022）确立了「推理-行动-观察」循环的提示范式；Toolformer（2023）证明模型可以在预训练中自学「何时插入哪个 API 调用」；2023 年 6 月 OpenAI function calling 把结构化工具调用做进模型 API，从此 JSON 出参的可靠性成为各家模型的硬指标。

2024 年 11 月 Anthropic 发布 MCP（Model Context Protocol），意图成为「AI 的 USB-C」：统一模型与外部工具/数据源的连接协议。半年内 OpenAI、Google 相继兼容，工具生态从「每家一套插件格式」走向事实标准——这可能是 Agent 领域近两年最重要的基础设施事件。

## 看点

工具调用的瓶颈已从「格式对不对」转向「选择对不对」：给模型 50 个工具，选哪个、何时用、参数从哪取，是规划问题而非解析问题。工具检索（tool RAG）悄然成为新的子问题。
