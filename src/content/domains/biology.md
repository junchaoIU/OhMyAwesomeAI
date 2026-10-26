---
name: 蛋白质与生命科学
en: Proteins & Life Science
parent: ai-for-science
order: 1
status: active
summary: AlphaFold 革命之后：结构预测的产业级落地、蛋白质语言模型与 AI 药物设计的现实检验。
keyPapers:
  - Highly accurate protein structure prediction（2021，AlphaFold2）
  - Language models of protein sequences at scale（2022，ESM-2）
  - AlphaFold 3（2024）
keyLabs:
  - Google DeepMind / Isomorphic Labs
  - Meta FAIR（ESM）
  - Baker Lab（蛋白质设计）
tags: [蛋白质折叠, 药物设计, 蛋白质语言模型]
---

AlphaFold2 在 CASP14（2020）上把结构预测精度推到「实验可替代」级别，2021 年论文加开放代码引爆整个领域；2022 年 DeepMind 公开 2 亿+ 蛋白质结构数据库，相当于把 50 年的 X 射线晶体学工作量变成一次搜索。方法论上它示范了 AI4S 的完整剧本：注意力机制处理残基对关系 + 几何先验约束 + 端到端学习。

两条后续主线：一是蛋白质语言模型（ESM 系列）证明「仅凭序列」的预训练就能学出结构与功能信息，路线更轻、更「LLM 味」；二是从「预测」走向「设计」——Baker 实验室的 RFdiffusion 直接生成全新蛋白质，配合 AlphaFold3 对蛋白-配体复合物的预测，AI 药物设计（AIDD）从叙事走进管线。冷静的声音也存在：临床失败的终审权仍在湿实验，AI 改变的是「找到候选」的成本，不是「验证候选」的成本。

## 看点

AlphaFold 系列选择只发 Nature/Science 而不占会议版面，定义了 AI4S 的发表范本。下一个等价的「结构生物学时刻」会出现在 RNA、代谢网络还是脑连接组？
