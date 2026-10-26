---
title: Chinchilla：重新计算 Scaling 的账本
date: 2022-03-29
domain: scaling-laws
importance: major
summary: DeepMind 证明同算力下「更小模型 × 更多数据」优于 Kaplan 曲线的建议，70B 参数的 Chinchilla 打败 280B 的 Gopher，行业模型尺寸策略随之改写。
paperRef: Training Compute-Optimal Large Language Models
tags: [Chinchilla, 计算最优]
---
Kaplan 说「参数优先」，Chinchilla 说「数据与参数并重」——修正的核心是学习率调度与训练预算的耦合。此后所有大模型的 token 数都按新账本重新计算，Llama 系列是它的直接受益者。
