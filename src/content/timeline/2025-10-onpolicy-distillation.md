---
title: On-Policy Distillation——SFT 与 RL 之间的第三条路
date: 2025-10-26
domain: distillation
importance: major
summary: Thinking Machines 发表在线策略蒸馏：学生模型自己生成序列、教师逐 token 反馈（reverse KL），以远少于 RL 的采样量达到同等效果——后训练工具箱自此三足鼎立。
tags: [蒸馏, OPD, 后训练]
---

蒸馏从「抄老师的作业」（SFT，forward KL）变成「自己做题、老师逐笔批改」（reverse KL 作用在学生自己的 rollout 上）。它同时补上了 SFT 的分布错配与 RL 的信号稀疏两个短板。Qwen3 等工业管线随即采用（AIME'24 上 on-policy 蒸馏约 74.4% vs off-policy 约 55.0%），2026 年的 survey 与 OPD+ 等工作把它推成后训练技术报告的标准章节。
