---
name: 效率与系统
en: Efficiency & Systems
order: 8
status: active
summary: 让大模型跑得动、跑得便宜：量化与蒸馏、MoE 稀疏化、推理系统与 KV Cache 优化——算力经济学的工程支点。
keyPapers:
  - "LoRA: Low-Rank Adaptation（2021）"
  - FlashAttention（2022）
  - The Case for Co-Designed Neural Model and Hardware（与 MoE 系列工作）
keyLabs:
  - DeepSeek
  - NVIDIA
  - Microsoft (SysML 社区)
tags: [量化, MoE, 推理系统]
---

## 解决什么问题

GPT-4 级能力的原始形态是「一机房 GPU、一次查询几秒」。效率研究回答：**如何把前沿能力的单位成本压缩几个数量级**——训练侧（用更少的算力到同等能力）、推理侧（更低延迟、更高吞吐、更低显存）。在商业化里，这直接决定毛利与可达性。

## 当前图景

推理侧的最大红利来自 DeepSeek 式的 MoE + 注意力优化组合：稀疏激活（每 token 只走少量专家）把参数与算力解耦，MLA（隐空间压缩 KV）把长上下文的显存账单砍到可付，FlashAttention 一类 IO 感知算子把注意力从「访存受限」拉回「算力受限」。部署侧，INT4/FP8 量化已使单卡跑 70B 级模型成为日常；投机解码用小模型起草、大模型裁决，把解码延迟再压一截。

训练侧，LoRA 把微调成本降了两个数量级，催生了开源社区的「人人可调」生态；蒸馏则让小模型继承大模型的判断力（DeepSeek-V3 的蒸馏 R1 是教科书案例）。系统与算法的共设计（co-design）成为顶会常客——注意力变体、并行策略、通信压缩互相咬合，纯算法或纯系统的单点优化空间正在收窄。

## 开放问题

- MoE 的负载均衡与专家坍缩：稀疏性的天花板在哪？
- 推理成本的尽头：token 单价还能降几个数量级，瓶颈会转移到哪（电力？互连？）
- 量化的「感度损失」能否被训练期量化感知彻底抹平？
