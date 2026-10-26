---
name: 智能体
en: Agents
order: 6
status: active
summary: 从聊天框走向工作流：harness 脚手架、工具与技能包、规划与记忆、多智能体协作——把 LLM 组装成可靠自动机的系统工程。
keyPapers:
  - ReAct（2022，推理与行动交织）
  - SWE-agent（2024，Agent-Computer Interface）
  - Agent Skills 开放标准（2025，SKILL.md）
keyLabs:
  - OpenAI
  - Anthropic
  - Google DeepMind
tags: [工具调用, 规划, 多智能体]
---

## 解决什么问题

ChatGPT 是一个「会说的话痨同事」，Agent 要造的是「会做事的实习生」：接目标、拆任务、调工具、看结果、纠偏差、交作业。这个领域研究**能力到行动的最后一公里**——也是当前工程界投入最猛、翻车最多的方向。

## 当前图景

技术栈已收敛出清晰分层：底层是函数调用与 MCP 一类的工具协议（把 API 生态标准化地暴露给模型），以及 2025 年兴起的 harness 意识与技能包（SKILL.md 开放标准）——模型是可替换的引擎，工程骨架与任务知识成为独立的生产资料；中层是规划与记忆（ReAct 式思考-行动循环、检索式外部记忆、子代理分解）；上层是多智能体编排（CrewAI/AutoGen 式框架）与 Computer Use（直接操作浏览器与桌面）。2023 年 AutoGPT 一波「自主智能体」泡沫破裂后，行业转向务实路线：窄域、有人类断点、以评测兜底——Claude Code、Devin、Cursor 一类编程智能体成为第一个真正跑通的商业场景，因为代码天然自带可验证奖励。

## 开放问题

- 长时程可靠性：错误随步骤复合，50 步任务 1% 的单步错误率意味着 40% 的整体失败率——如何破？
- Agent 的记忆该长什么样：文件系统、向量库，还是模型的上下文本身？
- 多智能体是真分工，还是把 prompt 工程包装成架构？
