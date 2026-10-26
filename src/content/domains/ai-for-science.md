---
name: AI for Science
en: AI for Science
order: 9
status: active
summary: 把模型变成科学仪器：蛋白质结构预测、材料与化学发现、数学证明，以及「AI 发现」与「AI 验证」的分界。
keyPapers:
  - Highly accurate protein structure prediction（2021，AlphaFold2）
  - AlphaFold 3（2024）
  - Ranked List of Problems（与 IMO 级数学证明系列工作）
keyLabs:
  - Google DeepMind (Isomorphic Labs)
  - Microsoft Research (AI4Science)
  - Meta FAIR (ESM)
tags: [蛋白质, 材料, 数学]
---

## 解决什么问题

科学发现的瓶颈往往不是「假设不够聪明」，而是**搜索空间太大、验证太慢**。AI for Science 研究如何用模型压缩这两者：预测（代替昂贵实验）、生成（直接给出候选）、证明（穷举逻辑空间）。这是 AI 少数「几乎无争议有益」的应用方向。

## 当前图景

蛋白质是标杆战场：AlphaFold2（2021）把 50 年的结构生物学难题变成「可查询的服务」，AlphaFold3（2024）扩展到配体-蛋白相互作用，直接瞄准药物设计。蛋白质语言模型（ESM 系列）证明「序列即足够」的表征学习路线同样能折叠蛋白。材料与化学侧，GNoME 式大规模筛选把候选材料库扩大几个数量级，自动化实验室（A-Lab）开始闭环「预测-合成-验证」。

数学是 2024 年后的新前线：AlphaProof / AlphaGeometry 把 IMO 几何与代数证明推到奖牌水平，Lean 一类形式化验证器成为「AI 生成证明」的可信出口。方法论上，整个领域正从「预测器」走向「发现闭环」——生成、评估、实验（或证明）、回流的飞轮。

## 开放问题

- AI 的「发现」如何验证：湿实验与形式化证明哪条路线更可规模化？
- 科学大模型的数据瓶颈：文献是滞后的、实验是昂贵的，合成数据在科学里可信吗？
- 领域知识该嵌进架构（物理先验），还是让通用模型自己学出来？
