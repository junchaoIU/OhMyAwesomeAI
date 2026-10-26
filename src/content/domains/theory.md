---
name: 理论
en: Theory
order: 10
status: active
summary: 深度学习为什么有效：泛化之谜、涌现现象的理论刻画、上下文学习的机制，以及追赶工程实践的解释学。
keyPapers:
  - Reconciling modern ML practice and the bias-variance trade-off（2019，双重下降）
  - Tensor Programs V（μP，跨尺度的超参迁移理论）
  - Birth of a Transformer（2024，ICL 的梯度流视角）
keyLabs:
  - Stanford (Statistics/Theory)
  - MIT Theory of Deep Learning 组
  - Microsoft Research
tags: [泛化, 涌现, 学习理论]
---

## 解决什么问题

工程界以月为单位改写实践，理论界还在解释五年前的现象。这个领域试图回答深度学习最根本的问题：**为什么过参数化的模型不爆炸反而泛化？为什么规模会带来新能力？训练动力学里藏着什么结构？** 理论未必指导工程，但它决定我们对这门学科的「理解深度」。

## 当前图景

经典学习理论（VC 维、Rademacher 复杂度）在过参数化世界里基本失效，取而代之的叙事是：双重下降与插值阈值、隐式正则化（SGD 偏向平坦极小值与低秩解）、NTK（神经正切核）给出的小规模解析近似。对 LLM 时代两大经验现象——涌现与上下文学习（ICL）——理论阵营分别给出了「度量假象」（离散指标的不连续性）与「隐式贝叶斯推断 / 梯度流学习算法」两套候选解释，均未定论。

Scaling Laws 本身也成为理论对象：损失幂律与语言熵的结构关联、预训练与后训练阶段的统一优化视角。批评者指出当前理论多为「事后合理化」；辩护者回应：热力学也先于统计力学。折中的共识是，机制可解释性（alignment 侧的 SAE/电路分析）正在成为「理论的实验分支」。

## 开放问题

- 涌现是真实的相变，还是指标选取造成的假象？若是相变，序参量是什么？
- ICL 是「学到的算法」还是「检索到的模式」？
- 能否建立 LLM 时代的「统计力学」——把 Scaling Laws 从经验曲线升级为定理？
