---
name: 涌现与上下文学习
en: Emergence & In-Context Learning
parent: theory
order: 2
status: active
summary: 规模的魔法还是度量的假象？两大 LLM 时代标志现象的理论竞技场。
keyPapers:
  - Emergent Abilities of Large Language Models（2022）
  - Are Emergent Abilities a Mirage?（2023）
  - Birth of a Transformer（2024，ICL 梯度流分析）
keyLabs:
  - Stanford
  - Google DeepMind
  - Anthropic（机制视角）
tags: [涌现, ICL, 相变]
---

「涌现能力」论文（2022）列出了几十个「小模型随机、大模型跳变」的能力，成为 Scaling 信仰的理论图腾；次年「海市蜃楼」论文反手一击：改用连续度量（如 token 级对数似然），跳变大多平滑化——涌现可能是**离散指标的测量假象**。两种解释并非互斥：指标非线性放大了平滑的底层变化，但「相变式」的能力获得（如 grokking）也真实存在。争论的实质是：我们对「能力」的定义本身就是度量依赖的。

上下文学习（ICL）的理论候选同样拥挤：贝叶斯推断说（模型隐式做后验，把任务当作隐变量）、隐式梯度说（前向传播等价于在内层执行了几步 SGD）、归纳头说（Anthropic 定位到的「复制-扩展」电路）。三种视角在不同实验设置下各有胜绩，机制可解释性正把这场争论从口头辩论变成解剖实验。

## 看点

ICL 是「权重里的算法」还是「激活里的检索」——这个问题的答案直接决定「上下文即学习」能走多远，以及模型能多大程度「当场学会」训练分布之外的东西。
