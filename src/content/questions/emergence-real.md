---
title: 涌现能力：真实相变还是度量假象
domain: emergence-icl
status: contested
whyMatters: 「规模会解锁新能力」是 Scaling 信仰的心理学支点。如果涌现只是离散指标制造的测量幻觉，我们的能力预测、安全评估（"多大模型会变得危险"）就建立在一个被夸大的现象上；如果它是真实相变，那么能力预测在原理上就不可外推——两种答案都重要。
keyWorks:
  - Emergent Abilities of LLMs（Wei et al. 2022）
  - Are Emergent Abilities of LLMs a Mirage?（Schaeffer et al. 2023）
  - "Grokking: Generalization Beyond Overfitting on Small Algorithmic Datasets（Power et al. 2022）"
---

## 争论的两面

**假象论**：Schaeffer 等人证明，把不连续指标（精确匹配、多选题对错）换成连续指标（token 对数似然、编辑距离），几十个「涌现」能力全部平滑化——跳变是指标的非线性放大，不是模型的相变。

**真实论**：即使度量连续，某些行为（系统性地开始用上下文学习、grokking 的突然泛化、CoT 有效性在 ~100B 的门槛）仍呈现陡峭的非线性；而且从应用视角看，「指标上的跳变」本身就意味着产品能力的质变——假象论解释了机制，但没有消解后果。

## 我的判断

两层结论可以同时成立：底层能力连续增长（支持假象论），但「能力的经济价值」随能力值非线性放大（涌现体感真实）。类比：水加热是连续过程，但「能泡茶」是阈值事件。真正值得研究的是阈值的位置与成因，而不是「真/假」的站队。

## 值得追踪的信号

grokking 与相变动力学的新理论工作；能力指标从 benchmark 分数向「任务时长 / 自主性」演进的评测趋势；机制可解释性对「能力开关」（如归纳头形成）的定位实验。
