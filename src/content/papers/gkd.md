---
title: "GKD: Generalized Knowledge Distillation for Auto-regressive Sequence Models"
authors: Agarwal et al. (DeepMind)
venue: arXiv 2023
year: 2023
url: https://arxiv.org/abs/2306.13649
domain: distillation
rating: 4
oneLiner: 把自回归语言模型的蒸馏统一成「散度 × 数据分布」的设计空间，并证明关键结论：在学生自己生成的序列上用 mode-seeking 散度（reverse KL）最优——On-Policy Distillation 的直接学术源头。
takeaways:
  - 分布错配的首次系统刻画：标准 KD 在 teacher 生成的序列上训练学生，而学生推理时跑的是自己的分布——训练与部署的错配随自回归采样逐步放大。
  - mode-seeking vs mode-covering 的行为差异：forward KL 逼学生覆盖 teacher 的一切模式（包括高方差尾部 = 幻觉来源），reverse KL 让学生聚焦 teacher 最可信的模式。
  - 「蒸馏 = RL 的特例」的数学雏形：在 student rollouts 上优化 reverse KL 需要策略梯度式估计——这正是两年后 OPD 管线与 GRPO 共享的骨架。
---

## 背景

[Hinton 蒸馏](../hinton-distillation)诞生后的八年，蒸馏在分类任务上成熟，但搬到自回归语言模型（2023 年的 T5、GPT-2）时暴露出三个新问题：其一，**序列生成的分布错配**——学生最终的部署形态是「从自己的分布采样」，训练却发生在 teacher 的输出分布上；其二，**散度选择**——标准 KD 用的 forward KL（mode-covering）会让学生硬学 teacher 输出分布的整个支撑集，包括低概率的「胡言乱语」尾巴；其三，**白盒假设失效**——API 模型不给 logits，只有输出序列。同期 MiniLLM（Gu et al. 2023）已提出用 reverse KL + 策略梯度做 LLM 蒸馏，但各方法散落、缺乏统一比较。DeepMind 的 GKD 团队（Agarwal 等，RL 背景深厚——Agarwal 是 RL 教材作者之一）决定把这个问题摆上解剖台。

## 动机

GKD 不发明单一方法，而是搭一个**统一框架**回答三个设计问题：蒸馏损失该用哪个散度（forward KL / reverse KL / JSD，乃至一般 f-divergence）？训练数据该来自 teacher 的输出、学生的 rollout、还是两者插值？两者如何组合与调度？在自回归 LM 的真实任务上，哪个组合赢、为什么——把「蒸馏配方选择」从玄学变成消融实验可以回答的工程问题。

## 方法

**统一的损失形式**。GKD 把蒸馏目标写成：student 在序列层面优化一个 f-divergence，数据源由参数 λ 控制——λ=0 时全用固定数据（teacher 输出/训练集），λ=1 时全用 student 自己采样（on-policy rollout），中间值做课程式混合。

**On-policy 反向 KL 的实现是 RL 式的**。在 student rollout 上优化 reverse KL 无法直接算期望（学生分布覆盖不了），必须用策略梯度估计：student 采样、teacher 与 student 分别打分、按优势加权更新——这个结构与 PPO/GRPO 的 actor-critic 循环同构。GKD 因此在论文里明确把「蒸馏」与「策略优化」连接起来：**数据来自谁，就优化谁视角下的散度**。

**散度行为分析**。论文从统计角度解释两类散度的行为差异：forward KL 的零点要求 student 覆盖 teacher 所有非零概率的模式（mode-covering，代价是稀释质量），reverse KL 的零点只要求 student 的支撑集落在 teacher 高概率区（mode-seeking，代价是可能漏掉部分模式）——对「teacher 偶尔输出垃圾」的 LLM 场景，mode-seeking 是正确先验。

## 实验设置

- **学生模型**：T5-base/large/xl（60M–770M）、GPT-2；teacher 为对应的更大模型
- **任务族**：摘要（CNN/DM、XSum）、翻译（WMT）、GPT-2 语言建模
- **核心消融**：散度（FKL/RKL/JSD）× 数据源（teacher 序列 / student rollout / 混合）的网格
- **任务迁移评测**：在一个任务上蒸馏，zero-shot 测新任务——检验学到的是「能力」还是「任务记忆」
- **基线**：监督微调、vanilla KD（Hinton 式在 teacher 数据上的 forward KL）、MiniLLM 路线

## 结果

- **reverse KL + student rollouts 显著优于标准 KD**：摘要等任务上质量与对齐度一致改善——on-policy 数据比散度选择本身更关键，两者有协同
- JSD 作为折中在部分设置下最优：既不过度覆盖尾部、又不激进丢弃模式
- 任务迁移：GKD 蒸馏的学生在未见过任务上的 zero-shot 表现更好——on-policy 训练学的是「怎么生成」而非「teacher 说过什么」
- 消融确认分布错配是真实的：teacher 数据训练的 student 在自采样评测下系统性退化（具体数字以原文表格为准）

## 有趣的洞见

**「数据来自谁」比「用什么损失」更根本**。GKD 最重要的实证发现：把训练数据从 teacher 输出换成 student rollout，收益大于换散度。这与 RL 的 on-policy 原理完全同构——策略评估必须在策略自身的分布上进行，否则学到的是另一个策略的价值。两年后 Thinking Machines 的 OPD 博客把这一点工程化到极致（见 [On-Policy Distillation](../on-policy-distillation)），并在文中直接把 GKD 列为先驱。

**幻觉的散度解释**。mode-covering 要求学生给 teacher 一切输出分配概率质量，包括 teacher 偶发的低质量样本——学生「学会了胡说」不是能力问题，是散度的优化目标如此要求。这个视角把「蒸馏模型的幻觉」从玄学变成可操作的设计变量：想要更少幻觉，换 mode-seeking 目标。它同样解释了 RLHF 后模型的保守倾向——RLHF 的目标也是 mode-seeking 类的。

**OPD 与 GRPO 共享一副骨架不是巧合**。GKD 的 reverse-KL-on-rollouts 用策略梯度估计，PPO 家族的价值估计用同一套 actor-critic 机制——蒸馏与 RL 在数学上只差「外部信号是 teacher logprob 还是环境奖励」。2025 年后「OPD 是 SFT 与 RL 之间的第三条路」的说法，其合法性论证在 GKD 已经完成：三者是同一框架的三个特例。

## 批判性评价

**最弱的一环**：规模与生态位。实验停在 3B 以下、任务以摘要翻译为主，离前沿 LLM 的推理蒸馏场景（长思维链、多轮工具调用）有两步距离；on-policy 训练需要 teacher 全程在线打分，工程成本在 API-only teacher 场景不可行；λ 课程与散度选择仍需按任务调参，没有给出可迁移的自动选择机制。它也生不逢时：发布于 2023 年中，当时工业界的 RL 基建尚未普及，on-policy 蒸馏的工程前提（大规模 rollout + 在线打分）要等推理模型时代才成熟——学术上正确的工作，产业时机晚了两年。

**依然重要的理由**：它是 OPD 的直接学术源头，第一个把「散度 × 数据分布」设计空间摆清楚的系统研究，也是「蒸馏与 RL 同构」这一当代共识的奠基文献。读它能明白 OPD 博客里每一个设计选择的来龙去脉——工程突破是学术铺垫的利息。
