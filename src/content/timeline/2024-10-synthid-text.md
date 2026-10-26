---
title: SynthID-Text：水印从论文走进产品
date: 2024-10-23
domain: data-governance
importance: major
summary: Google DeepMind 的 SynthID-Text 登上 Nature：锦标赛式采样在生产流量（Gemini 与 AI Studio）上部署水印，假阳性率压到远低于司法证据标准的水平——水印第一次达到工业规模。
tags: [水印, 溯源, DeepMind]
---

SynthID-Text 把「绿名单偏置」升级为锦标赛采样：每步让模型生成若干候选，用检测函数打分、挑暗记最深的一个——质量与检出率的权衡从此可以显式调参。真正的分水岭不在算法而在部署：论文报告了 Gemini 与 AI Studio 真实流量上的 A/B 实验（数千万用户），证明水印对输出质量与产品指标无可测影响。登上 Nature 标志着这个方向从对抗性安全研究走向工程成熟；此后水印成为主流模型的标配讨论项，检测器开源、密钥托管与「水印会不会反被用来免费蒸馏」成为新的治理议题。
