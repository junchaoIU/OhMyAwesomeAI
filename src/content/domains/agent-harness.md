---
name: Agent Harness 与脚手架
en: Agent Harness
parent: agents
order: 0
status: active
summary: 模型外围的工程骨架：工具循环、上下文工程、权限与沙箱——「产品是 harness，模型是可替换的引擎」。
keyPapers:
  - SWE-agent（2024，Agent-Computer Interface）
  - Building Effective Agents（2024，Anthropic 工程博客）
  - Claude Code（2025，产品级 harness 标杆）
keyLabs:
  - Anthropic
  - OpenAI（Codex CLI）
  - OpenHands 等开源社区
tags: [harness, 上下文工程, 沙箱]
---

模型不等于智能体：模型是引擎，harness 才是车。harness 指包裹模型的那层工程骨架——系统提示、工具定义、执行循环（调工具 → 看结果 → 继续）、上下文管理（每轮往窗口里塞什么）、权限与沙箱（哪些动作需要人确认）、失败恢复。Claude Code、Codex CLI、OpenHands 本质上都是 harness，模型在其中可替换。

SWE-agent（2024）给这个方向提供了第一个严肃的学术刻度：Agent-Computer Interface（ACI）的设计——工具输出多简洁、报错信息怎么措辞、防呆怎么内置——对任务成功率的影响不亚于模型本身的升级。给 agent 用的「界面」需要专门设计，如同给人用的 UI 需要专门设计。2025 年的共识随之成形：**同一模型，换个 harness，表现差数倍**——「the harness is the product」。

harness 与模型能力呈跷跷板关系：模型越强，harness 越薄。2023 年需要复杂的规划框架与多角色编排，2025 年一个「循环 + 好工具 + 大窗口」的极简主循环反而胜出（Claude Code 的架构反常识地简单）；上下文工程（context engineering）随之取代 prompt engineering 成为热词——agent 的成败越来越取决于每一轮塞进窗口的是什么，而非单条 prompt 写得多漂亮。

## 看点

harness 中永远无法沉进模型的部分——权限模型、审计日志、恢复与检查点——正在长成「agent 操作系统」的雏形。harness 会不会出现类似浏览器的标准化层（可移植的 agent 运行时），是下一阶段生态之争的主线。
