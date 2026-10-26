---
name: 安全评测与红队
en: Safety Evals & Red Teaming
parent: alignment
order: 3
status: active
summary: 能力与风险的度量衡：从基准刷分到危害分类学、自动化红队与模型审计的可复现实践。
keyPapers:
  - Constitutional AI（2022）
  - GAIA / SWE-bench 一类能力评测（2023–2024）
  - HarmBench 与安全评测套件（2024）
keyLabs:
  - Anthropic
  - OpenAI（Preparedness）
  - METR（能力评估）
tags: [红队, 基准, 审计]
---

安全评测的困境是「测不准原理」：公开基准会被训练数据污染，闭源评测又无法被独立审计。行业在这两个拉力之间摸索折中：动态题库、私有 held-out 集、代码执行的生成式评测（SWE-bench 式真实任务）逐渐取代静态选择题。

红队（red teaming）从人工演进到自动化：用模型生成攻击 prompt、变异越狱模板、多轮社会工程学对话，人力只负责裁决。前沿实验室设立 Preparedness 一类团队，在发布前评估生物、网络、说服等危险能力阈值。学界推动的「模型审计」框架（外部独立红队 + 结构化报告）正在成为监管要求的事实标准（欧盟 AI Act 的评估条款）。

## 看点

评测永远滞后于能力。METR 的「任务时长」指标（模型能自主完成多长时程的任务）是近年最有信息量的趋势线——它衡量的是「自动化风险」而非「知识量」。
