---
name: 泛化与训练动力学
en: Generalization & Dynamics
parent: theory
order: 1
status: active
summary: 过参数化为什么不过拟合：双重下降、隐式正则化与 NTK——旧理论的失效清单与新叙事。
keyPapers:
  - Reconciling modern ML practice and the bias-variance trade-off（2019）
  - Understanding Deep Learning Requires Rethinking Generalization（2017）
keyLabs:
  - Stanford
  - MIT
  - Berkeley
tags: [双重下降, 隐式正则化, NTK]
---

经典统计学习理论的核心预言——「参数越多，泛化越差」——在深度学习时代被系统性证伪：百万倍过参数化的网络可以完美拟合随机标签（说明容量足够爆炸），却在真实数据上泛化极佳。Zhang et al.（2017）的这记耳光开启了理论界的补丁竞赛：双重下降（测试误差在插值点后再次下降）、隐式正则化（SGD 天然偏好平坦/低秩解）、NTK 核近似（无限宽极限下网络退化为线性模型，可解析）。

这些叙事各自照亮一角，但没有一个能回答工程师最关心的问题：「给我这个架构与数据，我的模型会犯哪种错？」深度网络在分布偏移下的脆弱泛化（OOD）与训练动力学的相变行为（grokking：先记忆后泛化的延迟顿悟）是当前最活跃的两个实证—理论接口。

## 看点

理论界正在接受一个尴尬分工：解释性理论退居「自然哲学」，可操作的理论以 scaling laws 与 μP 这类「现象学定律」的形式活在工程里。
