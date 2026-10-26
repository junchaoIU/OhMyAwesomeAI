---
name: 知识蒸馏与 OPD
en: Distillation & On-Policy Distillation
parent: reasoning
order: 1
status: active
summary: 从离线模仿到在线策略蒸馏：学生自己生成、教师逐 token 反馈——SFT 与 RL 之间的第三条后训练路线。
keyPapers:
  - Distilling the Knowledge in a Neural Network（2015，Hinton）
  - MiniLLM / GKD（2023，reverse KL 与 on-policy 蒸馏的学术源头）
  - On-Policy Distillation（2025-10，Thinking Machines）
  - Qwen3 Technical Report（2025，工业采用）
  - A Survey of On-Policy Distillation（2026）
keyLabs:
  - Thinking Machines
  - Qwen 团队
  - Google DeepMind
tags: [蒸馏, reverse KL, OPD, 后训练]
---

蒸馏十年的主线，是「监督信号在哪里」的三次搬家：从训练标签到教师的 soft 输出（暗知识），从教师的输出序列到学生自己的采样分布（on-policy），从最终答案的对错到每个 token 的即时反馈（过程监督）。三次搬家之后，蒸馏成为 SFT 与 RL 之外的第三条后训练路线。下面是这条线上的**高亮路线**（Highlights）——高影响力论文、范式确立之作与常用基线，按时间倒序排列，想沿演进顺序读就从底部的 Hinton 开始往上走；更完整的文献全景见下方[全景档案](#opd-全景档案230-篇)。每个条目默认折叠：收起时可见标题、第一单位、时间、发表 venue、论文与代码链接和一句话简介，点击展开核心问题、方法与结果的分点拆解与结论反思；标了「精读」的，点进去是完整的七段分析。

## 机制与边界（2026）

<details class="paper-entry">
<summary><span class="entry-line"><strong>OPD+ 与机制研究</strong> <span class="entry-meta">UIUC 等 · 2026 · arXiv</span> <a href="https://arxiv.org/abs/2606.01039">OPD+ 论文</a> <a href="https://arxiv.org/abs/2604.00626">Survey</a> <span class="entry-nocode">无代码</span></span> <span class="entry-tldr">证明 stop-gradient 的 advantage 估计有偏并给出修正——OPD 从配方研究进入机制研究的第一批系统工作。</span></summary>

- 核心问题：OPD 何时失效、为什么失效、收益的上限在哪。
- 方法：
  - OPD+ 修正 stop-gradient advantage 估计的偏差；
  - 机制研究系统考察教师-学生差距、训练动态与失效模式。
- 结果：
  - survey 把领域统一为「从模仿到交互式学习」的范式转移；
  - 教师-学生差距过大时 OPD 可能崩坏，「如何恢复失效 OPD」成为专门研究方向。
- 结论与反思：reverse KL 的 mode-seeking 让学生聚焦教师最擅长的模式——它是卓越的能力压缩器，但「学生超越教师」的空间存疑。教师-学生差距多大时 OPD 收益最大，是这个领域最值钱的实验曲线。

</details>

## 工业化（2025）

<details class="paper-entry">
<summary><span class="entry-line"><strong>On-Policy Distillation</strong> <span class="entry-meta">Thinking Machines Lab · 2025-10 · Engineering Blog</span> <a href="https://thinkingmachines.ai/blog/on-policy-distillation/">博客</a> <a href="https://github.com/thinkingmachines/tinker">代码</a> <a href="../../papers/on-policy-distillation">精读 →</a></span> <span class="entry-tldr">学生逐 token 生成、教师在线打 logprob——稠密信号与正确分布兼得的第三条后训练路线。</span></summary>

- 核心问题：SFT（信号稠密但分布错配）与 RL（分布正确但信号稀疏）之外，是否存在同时拿到两者优点的训练方式。
- 方法：
  - 学生逐 token 生成，教师同族在线打 logprob，最小化两者差异；
  - 平方差损失替代 KL——对分布外 token 更稳健（KL 的梯度会被概率比值放大）；
  - 配套 tinker 开源实现，教师在线打分的数据流可直接复用。
- 结果：
  - AIME 2025：OPD 约 68%（SFT 蒸馏约 43%、RL 约 58%、基座约 13%）；
  - 达到 RL 同等效果只用约 1/8 的采样量；
  - 聊天等不可验证任务同样适用——不依赖验证器，适用域比 RLVR 宽。
- 结论与反思：教师 logprob 就是免费的过程监督——PRM 路线被放弃后，「每一步都需要监督」的需求由更强的模型直接满足；但学生上限被教师封顶，且教师必须同族开放 logits，闭源 API 教师不可用。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Qwen3 Technical Report</strong> <span class="entry-meta">阿里 Qwen 团队 · 2025-05 · arXiv</span> <a href="https://arxiv.org/abs/2505.09388">论文</a> <a href="https://github.com/QwenLM/Qwen3">代码</a></span> <span class="entry-tldr">工业全量管线里 on-policy 与 off-policy 蒸馏的正面对照——AIME'24 相差近 20 个点。</span></summary>

- 核心问题：on-policy 蒸馏在工业级全量训练管线中的真实收益。
- 方法：同一学生模型、同一数据，对照 on-policy 与 off-policy 两种蒸馏方式。
- 结果：
  - on-policy 蒸馏 AIME'24 约 74.4% vs off-policy 约 55.0%——近 20 个点的差距，迄今最硬的工业证据；
  - 学术博客到生产管线的距离被缩短到数月。
- 结论与反思：此后（多教师）OPD 进入各家标准管线，「小模型能力突飞猛进」的第一个该问的问题变成：它的教师是谁。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>DeepSeek-R1：SFT 蒸馏的巅峰与转折</strong> <span class="entry-meta">DeepSeek-AI · 2025-01 · arXiv</span> <a href="https://arxiv.org/abs/2501.12948">论文</a> <a href="https://github.com/deepseek-ai/DeepSeek-R1">代码</a> <a href="../../papers/deepseek-r1">精读 →</a></span> <span class="entry-tldr">RL 训出的教师拒绝采样后直接 SFT 给小模型——蒸馏完胜同规模直接 RL，也暴露了 SFT 范式的天花板。</span></summary>

- 核心问题：推理能力如何下放给小模型——是继续 SFT 蒸馏，还是有更好的路。
- 方法：
  - 从 RL 训练的 R1 拒绝采样约 80 万条样本；
  - 直接 SFT 到 Qwen2.5 / Llama 3（1.5B–70B），不经过 RL。
- 结果：
  - 蒸馏完胜同规模直接 RL（R1-Distill-Qwen-32B AIME 72.6% vs 直接 RL 约 55%）；
  - 1.5B 蒸馏版在 MATH 类基准上超过 GPT-4o。
- 结论与反思：SFT 蒸馏的上限被推到极致，但长思维链「高度依赖学生自己的前文」，SeqKD 的分布错配空前刺眼——巅峰之作恰好暴露了自身范式的天花板，为 on-policy 让出了舞台。

</details>

## 范式确立与简化（2024）

<details class="paper-entry">
<summary><span class="entry-line"><strong>DistiLLM</strong> <span class="entry-meta">KAIST · 2024-02 · ICML 2024</span> <a href="https://arxiv.org/abs/2402.03898">论文</a> <a href="https://github.com/jongwooko/distillm">代码</a></span> <span class="entry-tldr">skew KL + 自适应 off-policy 调度，把 on-policy 蒸馏拉回 SFT 式的简单训练管线。</span></summary>

- 核心问题：MiniLLM/GKD 的 policy-gradient 训练管线复杂、方差控制难，工业采用门槛高。
- 方法：
  - skew KL 散度：reverse KL 的平滑变体，行为介于 forward 与 reverse 之间；
  - adaptive off-policy 策略：保留 on-policy 收益的同时，把训练管线拉回 SFT 式的简单形态。
- 结果：
  - 多个开放任务上稳定超过此前的 on-policy 蒸馏方法；
  - 成为开源社区最易上手的 OPD 实现之一。
- 结论与反思：「范式正确」走向「工程可用」的关键一步——OPD 的扩散不只靠理念正确，更靠有人把它做简单。

</details>

## 错配之痛：LLM 时代的蒸馏（2023）

<details class="paper-entry">
<summary><span class="entry-line"><strong>GKD: Generalized Knowledge Distillation</strong> <span class="entry-meta">Google DeepMind · 2023-06 · ICLR 2024</span> <a href="https://arxiv.org/abs/2306.13649">论文</a> <span class="entry-nocode">无代码</span> <a href="../../papers/gkd">精读 →</a></span> <span class="entry-tldr">散度 × 数据源的统一消融框架——证明数据来源的切换比散度的切换更关键。</span></summary>

- 核心问题：蒸馏配方（散度选择 × 数据来源）散落在各论文里，缺乏统一比较——为什么 reverse KL 更好、数据该来自教师还是学生，没有系统答案。
- 方法：
  - 统一框架：f-divergence × 数据源参数 λ，从教师序列到学生 rollout 可插值调度；
  - 在学生 rollout 上优化 reverse KL 需策略梯度估计——蒸馏与 RL 在数学上同构；
  - 散度行为分析：forward KL 的 mode-covering 逼学生覆盖教师长尾，reverse KL 的 mode-seeking 让学生聚焦教师高概率区。
- 结果：
  - reverse KL + student rollout 显著优于标准 KD；
  - **数据来源的切换比散度的切换更关键**——on-policy 收益大于 mode-seeking 收益；
  - 蒸馏学生在未见过任务上的 zero-shot 迁移更好。
- 结论与反思：把「蒸馏配方选择」从玄学变成消融实验可回答的工程问题；但实验停在 3B 以下、任务以摘要翻译为主——学术上正确的工作，产业时机晚了两年。注：arXiv v3 已更名为 *On-Policy Distillation of Language Models: Learning from Self-Generated Mistakes*。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>MiniLLM: Knowledge Distillation of Large Language Models</strong> <span class="entry-meta">清华 & 微软 · 2023-06 · ICLR 2024</span> <a href="https://arxiv.org/abs/2306.08543">论文</a> <a href="https://github.com/microsoft/LMOps/tree/main/minillm">代码</a></span> <span class="entry-tldr">第一个完整做通「蒸馏 = 学生分布上的策略优化」——reverse KL + 策略梯度，OPD 的全部要素在此就位。</span></summary>

- 核心问题：SeqKD 在教师轨迹上训练学生，学生推理时却条件于自己的历史——exposure bias 与长尾覆盖（容量有限的学生被迫学教师的高方差尾部）同时出现。
- 方法：
  - sequence-level reverse KL 作用在学生自己的分布上；
  - policy gradient 优化 + single-step decomposition 降低长序列回报的方差；
  - teacher-mixed sampling 抑制 reward hacking，长度归一化处理短输出偏置。
- 结果：
  - 120M–13B 的 GPT-2/OPT/LLaMA 学生上全面优于 KD 基线（如 LLaMA-7B 在 DollyEval 的 GPT-4 评价 76.4 vs KD 73.7）；
  - 论文自身观察到的 policy-gradient 方差、退化重复等现象，后来被后续工作扩展为系统性失效模式研究。
- 结论与反思：第一次把「蒸馏 = 学生分布上的策略优化」做完整并做通——reverse KL、学生 rollout、策略梯度，OPD 的全部要素在此就位，只欠工程东风。

</details>

## 暗知识：知识的重新定义（2014–2016）

<details class="paper-entry">
<summary><span class="entry-line"><strong>Sequence-Level Knowledge Distillation</strong> <span class="entry-meta">Harvard NLP · 2016-06 · EMNLP 2016</span> <a href="https://arxiv.org/abs/1606.07947">论文</a> <span class="entry-nocode">无代码</span></span> <span class="entry-tldr">把「模仿分布」简化为「模仿输出」——工程最划算、理论最昂贵的一步简化。</span></summary>

- 核心问题：机器翻译的输出空间是指数级的序列空间，逐词对齐教师分布不可行。
- 方法：
  - 教师先完整生成最优序列；
  - 学生在序列级做蒸馏——把「模仿分布」简化为「模仿输出」。
- 结果：
  - NMT 学生在显著更小的参数量下保持接近教师的翻译质量；
  - 蒸馏训练本身比训练教师便宜——「训练用大模型、部署用小模型」自此成为标准工程实践。
- 结论与反思：这是工程上最划算的一步简化，也是理论上最昂贵的一步——它埋下了分布错配的种子：学生学到的是「教师会说什么」，而不是「在自己所处的状态下该说什么」。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Distilling the Knowledge in a Neural Network</strong> <span class="entry-meta">Google · 2015-03 · arXiv</span> <a href="https://arxiv.org/abs/1503.02531">论文</a> <span class="entry-nocode">无代码</span> <a href="../../papers/hinton-distillation">精读 →</a></span> <span class="entry-tldr">开山之作——温度软化暴露「暗知识」，把 ensemble 压进可部署的单模型。</span></summary>

- 核心问题：ensemble 精度领先但推理成本翻几十倍，集成知识如何压进可部署的单模型。
- 方法：
  - 温度软化的 softmax（T>1）放大「错误答案的相对概率」，让藏在小概率类里的相似性结构（暗知识）可见；
  - 学生在高温下对齐教师的 soft 分布，叠加低温监督项保证正确性；
  - specialist networks：一组专家各管一簇易混淆的类，再统一蒸馏进单模型。
- 结果：
  - MNIST：参数量小一两个数量级的学生逼近 ensemble 错误率；
  - Android 语音：单模型逼近 ensemble 精度——首次做到「ensemble 精度、单模型速度」；
  - JFT（1.5 万类）：generalist + specialists 组合明显优于单一大模型。
- 结论与反思：知识的定义被改写——「对错误答案的相对判断」比正确答案本身携带更多泛化信息；但高温为何有效纯属经验，最优温度的选择十年没有公认理论。

</details>

## OPD 全景档案（230 篇）

上方高亮路线只挑改变走向的关键工作；这一节是更完整的 OPD 文献全景（整理来源：[On-Policy Distillation 相关工作](https://laip11.github.io/blog/posts/on-policy-distillation/)，共 230 篇，**按时间倒序平铺、不分类**——需要主题分类视图可查阅来源页）。**每条默认折叠，点击展开**背景与研究问题、具体方法与实验设置结果的分点；arXiv 外链用于阅读原文；标 ▲ 的已在上方高亮路线中给出深度条目。

<details class="paper-entry">
<summary><span class="entry-line"><strong>Distillation as Probability Transport: Routed On-Policy Distillation</strong> <span class="entry-meta">2026-09 · arXiv</span> <a href="https://arxiv.org/abs/2609.08337">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 DeepSeek、DeepSeek-distilled、phi；评测覆盖 MATH、Math500；正文使用 accuracy、F1 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；方法效果依赖特定教师访问权限或概率信息。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Video-MOPD: Multi-Teacher On-Policy Distillation for Video Understanding</strong> <span class="entry-meta">2026-09 · arXiv</span> <a href="https://arxiv.org/abs/2609.09300">arXiv ↗</a></span> <span class="entry-tldr">视频理解/生成 · 多教师整合与干扰控制</span></summary>

- 背景 / 研究问题：面向 视频理解/生成 中的「多教师整合与干扰控制」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：多教师路由或聚合信号；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 多教师路由：按样本、能力或状态选择和聚合专长教师；
  - 选择性门控：过滤不可靠教师信号或只干预关键状态；
  - 策略梯度更新：把教师或判别器信号作为密集/序列奖励。
- 结果：
  - 任务域为视频理解/生成；涉及模型/教师包括 Qwen3-VL-8B-Instruct、Qwen3-VL-8B-Thinking、GPT-5-judged、GPT-5、LLaVA-Video-178K；正文使用 accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：质量提升可能伴随多样性下降或模式收缩；证据集中于有限 benchmark，不能直接外推到开放环境。 § 5

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>TV-Regulated OPD: Direction Matters in On-Policy Distillation</strong> <span class="entry-meta">2026-09 · arXiv</span> <a href="https://arxiv.org/abs/2609.08341">arXiv ↗</a></span> <span class="entry-tldr">语言模型通用能力 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 语言模型通用能力 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合；
  - 跨 tokenizer 对齐：在 byte、span 或共享表示空间中传递信号。
- 结果：
  - 任务域为语言模型通用能力；涉及模型/教师包括 Qwen3-8B、Qwen3-8B-Base、Qwen-1.5B、DeepSeek-1.5B、DeepSeek-R1-Distill-Qwen；评测覆盖 MATH、AIME；正文使用 accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨 tokenizer 或跨模型族迁移可能引入额外对齐误差。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>CompassOPD: Cross-Family On-Policy Distillation via Within-Family Likelihood Shifts</strong> <span class="entry-meta">2026-09 · arXiv</span> <a href="https://arxiv.org/abs/2609.10154">arXiv ↗</a></span> <span class="entry-tldr">安全与对齐 · 跨模型族监督对齐</span></summary>

- 背景 / 研究问题：面向 安全与对齐 中的「跨模型族监督对齐」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - 跨 tokenizer 对齐：在 byte、span 或共享表示空间中传递信号。
- 结果：
  - 任务域为安全与对齐；涉及模型/教师包括 Qwen3-30B-A3B-Instruct、Qwen3-4B、Mistral；评测覆盖 MATH、AIME；正文使用 accuracy、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨 tokenizer 或跨模型族迁移可能引入额外对齐误差。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Sequential Beats Joint: On the Interplay between On-Policy Distillation and RLVR</strong> <span class="entry-meta">2026-09 · arXiv</span> <a href="https://arxiv.org/abs/2609.04108">arXiv ↗</a></span> <span class="entry-tldr">数学与通用推理 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 数学与通用推理 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师分布与 outcome/verifier 混合信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - top-k 教师分布：压缩完整 logits 的查询与存储成本；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向。
- 结果：
  - 任务域为数学与通用推理；涉及模型/教师包括 Qwen3-8B、Qwen3-1.7B-Base、Qwen3-0.6B-Base、DeepSeek-AI、GLM-5-Team；评测覆盖 MATH；正文使用 pass@1、reward、F1、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Rethinking On-Policy Distillation of Large Language Models II: One Training Example</strong> <span class="entry-meta">2026-09 · arXiv</span> <a href="https://arxiv.org/abs/2609.04172">arXiv ↗</a></span> <span class="entry-tldr">安全与对齐 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 安全与对齐 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：多教师路由或聚合信号；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合；
  - 多教师路由：按样本、能力或状态选择和聚合专长教师。
- 结果：
  - 任务域为安全与对齐；涉及模型/教师包括 Qwen-Coder-1.5B、Qwen-based、Qwen-1.5B、DeepSeek-R1-Distill-Qwen；评测覆盖 MATH、AIME、AMC、LiveCodeBench；正文使用 accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；长程、多轮状态中的误差传播与信用分配仍有限。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>What Matters in On-Policy Distillation? A Perspective on Data Efficiency and Data Selection</strong> <span class="entry-meta">2026-09 · arXiv</span> <a href="https://arxiv.org/abs/2609.05198">arXiv ↗</a></span> <span class="entry-tldr">安全与对齐 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 安全与对齐 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 选择性门控：过滤不可靠教师信号或只干预关键状态；
  - 策略梯度更新：把教师或判别器信号作为密集/序列奖励。
- 结果：
  - 任务域为安全与对齐；涉及模型/教师包括 Qwen-1.5B、DeepSeek-R1-Distill-Qwen、DeepSeek-1.5B；评测覆盖 MATH、AIME、AMC、OlympiadBench、Math500；正文使用 accuracy、reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>On-Policy Distillation Meets Off-Policy GRPO: Training Compact Instruction-Following Rerankers</strong> <span class="entry-meta">2026-09 · EMNLP 2026</span> <a href="https://arxiv.org/abs/2609.01947">arXiv ↗</a></span> <span class="entry-tldr">语言模型通用能力 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 语言模型通用能力 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师分布与 outcome/verifier 混合信号；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 策略梯度更新：把教师或判别器信号作为密集/序列奖励。
- 结果：
  - 任务域为语言模型通用能力；涉及模型/教师包括 Qwen3-Reranker-4B、Gemma；正文使用 accuracy、reward、latency 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>On-Policy Distillation for Vision-Language Model Adaptation, an Effective Paradigm on Low-Quality Multimodal Data</strong> <span class="entry-meta">2026-09 · arXiv</span> <a href="https://arxiv.org/abs/2609.10321">arXiv ↗</a></span> <span class="entry-tldr">视觉—语言或多模态 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 视觉—语言或多模态 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向。
- 结果：
  - 任务域为视觉—语言或多模态；正文使用 accuracy、F1、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>OracleZoom: On-Policy Self-Distillation Inspired Reference-Constrained Recursive Image Super Resolution</strong> <span class="entry-meta">2026-09 · arXiv</span> <a href="https://arxiv.org/abs/2609.06490">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：特权上下文条件化的自教师；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合；
  - privileged context：教师获得学生推理时不可见的额外信息；
  - 自教师：同一模型在不同上下文或历史条件下产生监督；
  - 表示蒸馏：在 token 概率之外匹配隐藏特征或中间状态。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 Qwen2.5-VL-3B-Instruct；正文使用 win rate、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>ADOPD: Reference-Privileged On-Policy Distillation for MLLM-Based Industrial Anomaly Detection</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.09789">arXiv ↗</a></span> <span class="entry-tldr">视觉—语言或多模态 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 视觉—语言或多模态 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 对比目标：显式比较候选行为、推理模式或教师与学生响应。
- 结果：
  - 任务域为视觉—语言或多模态；涉及模型/教师包括 Qwen3-VL-4B、Qwen2.5-VL-7B、Qwen3-VL、Qwen2.5-VL、Qwen3-VL-32B、LLaVA-1.5；正文使用 accuracy、reward、F1、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>DASH: Divergence-Adaptive Supervision Horizons for On-Policy Self-Distillation of Reasoning Models</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.06243">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生前缀或部分 rollout；
  - 监督来源：特权上下文条件化的自教师；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 Qwen3-1.7B、Qwen3-4B、Qwen3-8B；评测覆盖 MATH、AIME；正文使用 reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；长程、多轮状态中的误差传播与信用分配仍有限。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Latent On-Policy Self-Distillation</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.13040">arXiv ↗</a></span> <span class="entry-tldr">Agent/工具交互 · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 Agent/工具交互 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生前缀或部分 rollout；
  - 监督来源：特权上下文条件化的自教师；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新。
- 结果：
  - 任务域为Agent/工具交互；涉及模型/教师包括 Qwen3-4B、Qwen3-8B、DeepSeek-V4-Pro、deepseek-v4-flash、phi；评测覆盖 HumanEval、MBPP、LiveCodeBench；正文使用 pass@1、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：长程、多轮状态中的误差传播与信用分配仍有限；方法效果依赖特定教师访问权限或概率信息。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Self-Supervised Visual On-Policy Distillation</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.14144">arXiv ↗</a></span> <span class="entry-tldr">视觉—语言或多模态 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 视觉—语言或多模态 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - privileged context：教师获得学生推理时不可见的额外信息。
- 结果：
  - 任务域为视觉—语言或多模态；涉及模型/教师包括 Qwen3-VL、Qwen2.5-72B-Instruct、Qwen3-VL-Instruct-235B、GPT-5.4、GPT-5、phi；评测覆盖 MATH、MathVista；正文使用 accuracy、exact match、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Mitigating Rubric Interference in LLM Judges via On-Policy Self-Distillation</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.14684">arXiv ↗</a></span> <span class="entry-tldr">Agent/工具交互 · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 Agent/工具交互 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：黑盒评分、rubric 或语言反馈；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - 自教师：同一模型在不同上下文或历史条件下产生监督；
  - 选择性门控：过滤不可靠教师信号或只干预关键状态。
- 结果：
  - 任务域为Agent/工具交互；涉及模型/教师包括 Qwen3-8B、Qwen3-14B、Qwen3-32B、GPT-4.1；正文使用 accuracy、exact match、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；证据集中于有限 benchmark，不能直接外推到开放环境。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Rethinking Privileged Information in On-Policy Self-Distillation</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.18271">arXiv ↗</a></span> <span class="entry-tldr">安全与对齐 · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 安全与对齐 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新。
- 结果：
  - 任务域为安全与对齐；涉及模型/教师包括 Qwen3-8B、Qwen3-4B、Qwen3-1.7B、Qwen3-32B；评测覆盖 GSM8K、MATH、AIME、GPQA、MMLU、MMLU-Pro；正文使用 accuracy、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Video-OPSD: Exploiting Privileged Visual Evidence for On-Policy Self-Distillation in Video Large Language Models</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.27065">arXiv ↗</a></span> <span class="entry-tldr">视频理解/生成 · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 视频理解/生成 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - replay：复用历史学生轨迹，以吞吐换取一定的策略陈旧度；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新。
- 结果：
  - 任务域为视频理解/生成；涉及模型/教师包括 Qwen2.5-VL-7B、Qwen3-VL-4B、Qwen3-VL-8B、Qwen-VL；评测覆盖 MMMU；正文使用 accuracy、F1、throughput 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；证据集中于有限 benchmark，不能直接外推到开放环境。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>SR-OPSD: Self-Referenced On-Policy Self-Distillation</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.09745">arXiv ↗</a></span> <span class="entry-tldr">数学与通用推理 · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 数学与通用推理 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本。
- 结果：
  - 任务域为数学与通用推理；涉及模型/教师包括 Qwen3-8B、Qwen3-4B-Instruct-2507；评测覆盖 AIME、AMC；正文使用 accuracy、reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>On-Policy Self-Distillation without Any Supervision</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.06296">arXiv ↗</a></span> <span class="entry-tldr">既有 OPSD 仍依赖 ground truth、环境反馈或强教师，未实现严格无监督的 self-distillation。</span></summary>

- 背景 / 研究问题：既有 OPSD 仍依赖 ground truth、环境反馈或强教师，未实现严格无监督的 self-distillation。
- 方法：多 rollout 自一致性投票产生 pseudo-solution；用最短共识答案条件化教师，去纠正最长错误 completion 中的前缀。
- 结果：多个数学基准、Qwen3 4B/8B 上报告匹配或超过 OPSD/GRPO；伪标签由同一模型多数票产生，难题上的 correlated error 仍是核心风险。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Adaptive Supervised Anchoring for On-Policy Self-Distillation</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.07935">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生前缀或部分 rollout；
  - 监督来源：特权上下文条件化的自教师；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 Qwen3-1.7B、Qwen3-4B、GPT-4；评测覆盖 MATH、AIME、ARC；正文使用 pass@1、accuracy、exact match、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>OPD-V: Visual On-Policy Self-Distillation with Modality Balance</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.05131">arXiv ↗</a></span> <span class="entry-tldr">视觉—语言或多模态 · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 视觉—语言或多模态 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - top-k 教师分布：压缩完整 logits 的查询与存储成本；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本。
- 结果：
  - 任务域为视觉—语言或多模态；涉及模型/教师包括 Qwen3-VL-8B、Qwen3-VL-4B、Qwen3-VL-Instruct、Qwen3-VL、Qwen3-VL-4B-Instruct、Qwen3-VL-8B-Instruct；正文使用 accuracy、latency 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>VISTA: Verifier-Informed Student-to-Teacher Adaptation for On-Policy Self-Distillation</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.28306">arXiv ↗</a></span> <span class="entry-tldr">数学与通用推理 · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 数学与通用推理 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新。
- 结果：
  - 任务域为数学与通用推理；涉及模型/教师包括 Qwen3-1.7B、Qwen3-4B、Qwen3-8B；评测覆盖 MATH、AIME；正文使用 accuracy、reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；证据集中于有限 benchmark，不能直接外推到开放环境。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Call Neighbours Yourself: Graph Walks with Destination-Conditioned On-Policy Self-Distillation</strong> <span class="entry-meta">2026-08 · EMNLP 2026</span> <a href="https://arxiv.org/abs/2608.29588">arXiv ↗</a></span> <span class="entry-tldr">代码与形式化任务 · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 代码与形式化任务 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 自教师：同一模型在不同上下文或历史条件下产生监督；
  - 表示蒸馏：在 token 概率之外匹配隐藏特征或中间状态。
- 结果：
  - 任务域为代码与形式化任务；涉及模型/教师包括 Qwen2.5-14B-Instruct、Qwen2.5-14B、Llama2-7B、Mistral-7B、DeepSeek-R1、DeepSeek-v3；正文使用 accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：证据集中于有限 benchmark，不能直接外推到开放环境；部分结论依赖模型裁判或有限人工评测。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>One Symptom, Three Levers: A Critical Review of On-Policy Self-Distillation</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.25936">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - privileged context：教师获得学生推理时不可见的额外信息；
  - 自教师：同一模型在不同上下文或历史条件下产生监督。
- 结果：
  - 任务域为GUI agent；正文使用 accuracy 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨 tokenizer 或跨模型族迁移可能引入额外对齐误差。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Accelerating Visual On-Policy Distillation with Batched Speculative Jacobi Rollouts</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.18183">arXiv ↗</a></span> <span class="entry-tldr">视觉—语言或多模态 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 视觉—语言或多模态 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合。
- 结果：
  - 任务域为视觉—语言或多模态；正文使用 latency 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Every Coin Has Two Sides: On the Dual Nature of Generalization in On-Policy Distillation of Large Language Models</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.16647">arXiv ↗</a></span> <span class="entry-tldr">数学与通用推理 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 数学与通用推理 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：多教师路由或聚合信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合；
  - privileged context：教师获得学生推理时不可见的额外信息；
  - 多教师路由：按样本、能力或状态选择和聚合专长教师；
  - 选择性门控：过滤不可靠教师信号或只干预关键状态。
- 结果：
  - 任务域为数学与通用推理；涉及模型/教师包括 Qwen3-32B、Qwen-1.5B、Qwen-14B、Qwen3-8B-SFT、Qwen3-4B、Qwen-7B；评测覆盖 GSM8K、MATH、AIME、AMC、GPQA、LiveCodeBench、IFEval；正文使用 accuracy、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Where to Look Matters: On-Policy Self-Distillation for Long-Video Understanding</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.25356">arXiv ↗</a></span> <span class="entry-tldr">视频理解/生成 · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 视频理解/生成 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本。
- 结果：
  - 任务域为视频理解/生成；正文使用 accuracy、reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：跨任务或分布外泛化仍缺少充分验证；跨 tokenizer 或跨模型族迁移可能引入额外对齐误差。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Beyond Imitation: Filtering On-Policy Distillation by Reasoning Progress</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.19408">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：教师分布与 outcome/verifier 混合信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 Qwen-1.5B、Qwen3-1.7B、DeepSeek-R1-Distill-Qwen、DeepSeek-R1、DeepSeek-1.5B、DeepSeek；评测覆盖 MATH、AIME、OlympiadBench；正文使用 accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>On-policy Distillation with Verifiable Reward</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.24696">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：教师分布与 outcome/verifier 混合信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - top-k 教师分布：压缩完整 logits 的查询与存储成本；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 Qwen3-4B、Qwen3-4B-RL、Qwen3-1.7B-Base、Qwen3-4B-Base-RL、Qwen3-4B-nonthinking、Qwen3-4B-base；评测覆盖 MATH、AMC、OlympiadBench、Math500；正文使用 accuracy、reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；质量提升可能伴随多样性下降或模式收缩。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>SpikeOPD: Stable On-Policy Distillation for Autoregressive Spiking Language Models</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.27857">arXiv ↗</a></span> <span class="entry-tldr">语言模型通用能力 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 语言模型通用能力 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生前缀或部分 rollout；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - replay：复用历史学生轨迹，以吞吐换取一定的策略陈旧度；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本。
- 结果：
  - 任务域为语言模型通用能力；涉及模型/教师包括 OPT；评测覆盖 ARC、HellaSwag；正文使用 accuracy、latency 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；方法效果依赖特定教师访问权限或概率信息。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Beyond Teacher Likelihood: Group-Calibrated On-Policy Distillation for Long-Context Reasoning</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.19181">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：教师分布与 outcome/verifier 混合信号；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合；
  - 选择性门控：过滤不可靠教师信号或只干预关键状态。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 Qwen3-4B、Qwen3-8B、Qwen3-30B-A3B-Thinking；正文使用 reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；证据集中于有限 benchmark，不能直接外推到开放环境。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>CROP: Task Relevance via Counterfactuals for Selective On-Policy Distillation</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.13387">arXiv ↗</a></span> <span class="entry-tldr">语言模型通用能力 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 语言模型通用能力 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - top-k 教师分布：压缩完整 logits 的查询与存储成本；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本。
- 结果：
  - 任务域为语言模型通用能力；涉及模型/教师包括 Qwen3-4B、Qwen3-1.7B、Qwen3-8B、Qwen3-8B-Base、Qwen-based；评测覆盖 MATH、GPQA、HumanEval、IFEval；正文使用 accuracy 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Open-MOPD: Diagnosing and Fixing Capability Imbalance in Multi-Teacher On-Policy Distillation</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.19098">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 多教师整合与干扰控制</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「多教师整合与干扰控制」问题。
- 方法：
  - 状态与数据：当前策略附近的 replay/异步轨迹；
  - 监督来源：多教师路由或聚合信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - top-k 教师分布：压缩完整 logits 的查询与存储成本；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 Qwen3-1.7B-Base、Qwen2.5-7B-Base；评测覆盖 MATH、LiveCodeBench、IFEval；正文使用 accuracy、reward、throughput 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>On-Policy Delta Distillation for Multilingual Math Reasoning</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.05802">arXiv ↗</a></span> <span class="entry-tldr">英文中心的 OPD 是否能跨语言迁移推理，以及性能提升是否以目标语言保持为代价，尚缺直接研究。</span></summary>

- 背景 / 研究问题：英文中心的 OPD 是否能跨语言迁移推理，以及性能提升是否以目标语言保持为代价，尚缺直接研究。
- 方法：在英语、韩语、日语数学上比较 vanilla OPD 与 OPD² 的教师—基座 delta signal，并测试 English-only 与 multilingual data。
- 结果：Qwen3 上 OPD² 一致优于 OPD，韩/日语增益更明显；English-only 也可迁移性能但会把回答语言推向英语，说明语言保持必须单独评测。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>DUET: Dual-Teacher On-Policy Distillation via Same-Weight Disagreement for Prohibition Compliance</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.14644">arXiv ↗</a></span> <span class="entry-tldr">Agent/工具交互 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 Agent/工具交互 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生前缀或部分 rollout；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - top-k 教师分布：压缩完整 logits 的查询与存储成本；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本。
- 结果：
  - 任务域为Agent/工具交互；涉及模型/教师包括 Qwen2.5-7B、Qwen2.5-1.5B、Qwen3-8B、Qwen3-1.7B、Qwen3-235B-A22B、DeepSeek；评测覆盖 GSM8K、MATH、MT-Bench、IFEval；正文使用 accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；长程、多轮状态中的误差传播与信用分配仍有限。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Tail-Aware Top-$k$ On-Policy Distillation</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.14728">arXiv ↗</a></span> <span class="entry-tldr">代码与形式化任务 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 代码与形式化任务 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - top-k 教师分布：压缩完整 logits 的查询与存储成本；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新。
- 结果：
  - 任务域为代码与形式化任务；涉及模型/教师包括 Qwen3-1.7B、Qwen3-30B-A3B-Instruct、Qwen2.5-7B-Instruct、Qwen3-1.7B-Base、Qwen3-8B、Qwen3-8B-Base；评测覆盖 MATH、AMC、OlympiadBench、Math500、MMLU、MMLU-Pro、ARC；正文使用 pass@1、accuracy、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；长程、多轮状态中的误差传播与信用分配仍有限。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>When Teachers Mislead: Spurious-Signal-Aware On-Policy Distillation</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.03632">arXiv ↗</a></span> <span class="entry-tldr">视觉—语言或多模态 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 视觉—语言或多模态 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 选择性门控：过滤不可靠教师信号或只干预关键状态。
- 结果：
  - 任务域为视觉—语言或多模态；涉及模型/教师包括 Qwen3-4B-Instruct、Qwen3-1.7B、Qwen3-8B、DeepSeek-R1-0528-Qwen3、DeepSeek-AI；评测覆盖 MATH、AIME、AMC、Math500、MathVista。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Towards Understanding On-Policy Distillation through the Lens of Test-Time Scaling</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.11829">arXiv ↗</a></span> <span class="entry-tldr">常规 pass@1/avg@k 提升无法区分“正确轨迹更容易采样”和“新增可达解”。</span></summary>

- 背景 / 研究问题：常规 pass@1/avg@k 提升无法区分“正确轨迹更容易采样”和“新增可达解”。论文用大预算 pass@K 作为能力边界代理，并追踪问题级 learned/retained/forgotten 转移。
- 方法：
  - 在三种 student–teacher 设置、四个数学基准上将 K 扩至 1024；
  - 同时报告 pass@K 与 avg@K；
  - 比较 base、OPD、教师、off-policy distillation 及 EOPD/ExOPD/Direct-OPD 等变体。
- 结果：
  - AMC2023 与 AIME2024/25/26，最长输出 31,744 tokens；
  - OPD 普遍提高小 K pass@K 和各 K 的 avg@K，但 K=1024 时未超过 base；
  - retained 问题的平均正确率上升，而大 K 下 forgotten 多于 newly learned；这支持概率重排解释，但 pass@1024 仍只是有限采样下的能力代理。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Poly-OPD: Heterogeneous Multi-Teacher On-Policy Distillation for Capability-Selectable Flow Models</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.04349">arXiv ↗</a></span> <span class="entry-tldr">代码与形式化任务 · 多教师整合与干扰控制</span></summary>

- 背景 / 研究问题：面向 代码与形式化任务 中的「多教师整合与干扰控制」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：多教师路由或聚合信号；
  - 多教师路由：按样本、能力或状态选择和聚合专长教师；
  - 表示蒸馏：在 token 概率之外匹配隐藏特征或中间状态；
  - 课程调度：按难度、置信度或训练阶段改变样本与监督配置；
  - 策略梯度更新：把教师或判别器信号作为密集/序列奖励。
- 结果：
  - 任务域为代码与形式化任务；正文使用 accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；质量提升可能伴随多样性下降或模式收缩。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Step-Level On-Policy Distillation: Interpolating Between On-Policy Distillation and Supervised Fine-Tuning</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.16333">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 Qwen2.5-7B、Qwen2.5-3B-Instruct、Qwen3-4B、Qwen3-4B-Non-Thinking、Qwen2.5-7B-Instruct-ALFWorld；评测覆盖 MATH；正文使用 accuracy、success rate、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；长程、多轮状态中的误差传播与信用分配仍有限。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Distill What the Student Can See: Fisher-Projected On-Policy Distillation for Vision-Language Models</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.01263">arXiv ↗</a></span> <span class="entry-tldr">视觉—语言或多模态 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 视觉—语言或多模态 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生前缀或部分 rollout；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 表示蒸馏：在 token 概率之外匹配隐藏特征或中间状态；
  - 策略梯度更新：把教师或判别器信号作为密集/序列奖励。
- 结果：
  - 任务域为视觉—语言或多模态；涉及模型/教师包括 Qwen3-VL、Qwen3-VL-2B-Instruct、Qwen3-VL-8B-Instruct、Qwen3-VL-32B-Instruct；评测覆盖 MMMU、MathVista；正文使用 F1 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Mismatch Matters: On-Policy Distillation Beyond Token Agreement</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.09836">arXiv ↗</a></span> <span class="entry-tldr">代码与形式化任务 · token/step/turn 级信用分配</span></summary>

- 背景 / 研究问题：面向 代码与形式化任务 中的「token/step/turn 级信用分配」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师分布与 outcome/verifier 混合信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - top-k 教师分布：压缩完整 logits 的查询与存储成本；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新。
- 结果：
  - 任务域为代码与形式化任务；涉及模型/教师包括 Qwen-1.5B、Qwen3-8B、Qwen3-1.7B-Base、DeepSeek-1.5B、DeepSeek-R1-Distill-Qwen；评测覆盖 MATH、AIME、OlympiadBench；正文使用 accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨 tokenizer 或跨模型族迁移可能引入额外对齐误差。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Test-Time Self-Evolving GUI Visual Grounding via Reflection-Guided On-Policy Self-Distillation</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.11191">arXiv ↗</a></span> <span class="entry-tldr">视觉—语言或多模态 · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 视觉—语言或多模态 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生前缀或部分 rollout；
  - 监督来源：特权上下文条件化的自教师；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 对比目标：显式比较候选行为、推理模式或教师与学生响应；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - privileged context：教师获得学生推理时不可见的额外信息；
  - 自教师：同一模型在不同上下文或历史条件下产生监督。
- 结果：
  - 任务域为视觉—语言或多模态；涉及模型/教师包括 Qwen2.5-VL、Qwen3-VL、Qwen2.5-VL-3B、Qwen3-VL-2B、Qwen2.5-VL-7B、Qwen3-VL-8B；评测覆盖 MMBench、OSWorld；正文使用 accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；质量提升可能伴随多样性下降或模式收缩。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Trust Is Not Enough: Influence Calibration for On-Policy Self-Distillation in Agentic RL</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.14945">arXiv ↗</a></span> <span class="entry-tldr">Agent/工具交互 · 可信更新区域</span></summary>

- 背景 / 研究问题：面向 Agent/工具交互 中的「可信更新区域」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：特权上下文条件化的自教师；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - privileged context：教师获得学生推理时不可见的额外信息；
  - 自教师：同一模型在不同上下文或历史条件下产生监督；
  - 选择性门控：过滤不可靠教师信号或只干预关键状态。
- 结果：
  - 任务域为Agent/工具交互；涉及模型/教师包括 Qwen2.5-Instruct、Qwen3-1.7B、Qwen3-4B、Qwen2.5-7B、Qwen2.5-1.5B、Qwen3-4B-Instruct；正文使用 accuracy 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：证据集中于有限 benchmark，不能直接外推到开放环境。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>SkillLens: Visual Skill Cards for Retrieval-Augmented GUI Action Prediction and On-Policy Distillation</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.10775">arXiv ↗</a></span> <span class="entry-tldr">视觉—语言或多模态 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 视觉—语言或多模态 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：特权上下文条件化的自教师；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合；
  - privileged context：教师获得学生推理时不可见的额外信息；
  - 表示蒸馏：在 token 概率之外匹配隐藏特征或中间状态；
  - 选择性门控：过滤不可靠教师信号或只干预关键状态。
- 结果：
  - 任务域为视觉—语言或多模态；涉及模型/教师包括 Qwen3-VL-2B、GPT-5.4-mini、GPT-4o；评测覆盖 Mind2Web、OSWorld；正文使用 F1 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；长程、多轮状态中的误差传播与信用分配仍有限。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>SecOPD: Mitigating Adaptive Prompt Injections by On-Policy Distillation</strong> <span class="entry-meta">2026-08 · EMNLP 2026</span> <a href="https://arxiv.org/abs/2608.21500">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合；
  - 选择性门控：过滤不可靠教师信号或只干预关键状态；
  - 策略梯度更新：把教师或判别器信号作为密集/序列奖励。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 Qwen3-4B-Instruct-2507；评测覆盖 GSM8K、MATH、GPQA、MMLU、MMLU-Pro；正文使用 success rate、reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：跨任务或分布外泛化仍缺少充分验证；证据集中于有限 benchmark，不能直接外推到开放环境。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>SimpleOPD: Simple Tokenizer-Agnostic On-Policy Distillation for Long-Context Reasoning</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.14277">arXiv ↗</a></span> <span class="entry-tldr">数学与通用推理 · token/step/turn 级信用分配</span></summary>

- 背景 / 研究问题：面向 数学与通用推理 中的「token/step/turn 级信用分配」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本。
- 结果：
  - 任务域为数学与通用推理；涉及模型/教师包括 Qwen3-4B-thinking-2507、Qwen3-30B-A3B-Thinking、Qwen3-4B、Qwen3-30B-A3B、Qwen-Series、Qwen3-4B-OPD；评测覆盖 MATH、AIME；正文使用 reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Influence-Directed Distillation: Solving the Diversity Bottleneck in Sampled-Token OPD</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.29846">arXiv ↗</a></span> <span class="entry-tldr">sampled-token OPD 常出现 pass@1 上升而 pass@k 停滞的 diversity distillation failure。</span></summary>

- 背景 / 研究问题：sampled-token OPD 常出现 pass@1 上升而 pass@k 停滞的 diversity distillation failure。
- 方法：定义 First-Order Local Entropy Influence，把每次更新的熵效应拆为 log-prob gap 与学生局部概率结构；保留增熵更新，对减熵更新做 divergence-adaptive advantage shrinkage。
- 结果：reasoning 蒸馏中在只查询 sampled-token 教师概率的条件下改善 pass@k，并大体保持 pass@1；论文发布很新，尚无独立复现，结论应标为早期证据。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>SPOT: Sparse Probing and Outcome Calibration for On-Policy Distillation</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.04419">arXiv ↗</a></span> <span class="entry-tldr">数学与通用推理 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 数学与通用推理 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师分布与 outcome/verifier 混合信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本。
- 结果：
  - 任务域为数学与通用推理；涉及模型/教师包括 Qwen3-8B、Qwen3-0.6B-Base、Qwen3-1.7B-Base、Qwen3-4B-Base、Qwen-specific；评测覆盖 MATH、AIME、AMC、Math500、GPQA、MMLU、MMLU-Pro、AlpacaEval；正文使用 accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Not Every Divergence Should Be Suppressed: Counterfactual Recoverability in On-Policy Distillation</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.04408">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生前缀或部分 rollout；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - replay：复用历史学生轨迹，以吞吐换取一定的策略陈旧度；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 选择性门控：过滤不可靠教师信号或只干预关键状态。
- 结果：
  - 任务域为GUI agent；评测覆盖 AIME、GPQA；正文使用 accuracy 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；证据集中于有限 benchmark，不能直接外推到开放环境。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>When Teacher Guidance Misleads: Reward-Aligned On-Policy Distillation</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.27960">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生前缀或部分 rollout；
  - 监督来源：教师分布与 outcome/verifier 混合信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 Qwen3-8B-Base-GRPO、Qwen3-4B、Qwen-7B、Qwen3-4B-Base、Qwen3-8B-Base、DeepSeek-R1；评测覆盖 MATH、AIME、AMC、OlympiadBench、HumanEval、MBPP、LiveCodeBench；正文使用 accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>MemOPD: On-Policy Distillation through Memory State Alignment for Long-Horizon Agents</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.07068">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：教师分布与 outcome/verifier 混合信号；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 表示蒸馏：在 token 概率之外匹配隐藏特征或中间状态；
  - 策略梯度更新：把教师或判别器信号作为密集/序列奖励。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 phi；评测覆盖 HotpotQA、Natural Questions；正文使用 exact match、reward、F1、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：跨任务或分布外泛化仍缺少充分验证；长程、多轮状态中的误差传播与信用分配仍有限。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Long SKILL Compliance as Logical Reasoning: Closure-Grounded Detection with Scaling-Guided On-Policy Distillation</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.08146">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 表示蒸馏：在 token 概率之外匹配隐藏特征或中间状态；
  - 选择性门控：过滤不可靠教师信号或只干预关键状态。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 Qwen3-0.6b、GPT-5、DeepSeek-V4、DeepSeek-AI、DeepSeek-V4-Flash；正文使用 accuracy、reward、F1、latency 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Learning from Consensus and Disagreement: Unsupervised On-Policy Self-Distillation with Minority-Trajectory Contrast</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.08764">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：特权上下文条件化的自教师；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 Qwen3-1.7B、Qwen3-4B、phi；评测覆盖 AIME；正文使用 accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：跨任务或分布外泛化仍缺少充分验证；质量提升可能伴随多样性下降或模式收缩。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Privileged Likelihood Is Not Automatically Value: Three Checks for Token Credit in On-Policy Self-Distillation</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.09263">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · token/step/turn 级信用分配</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「token/step/turn 级信用分配」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：特权上下文条件化的自教师；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 对比目标：显式比较候选行为、推理模式或教师与学生响应。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 Qwen3-8B、gpt-5.6-luna、Phi；评测覆盖 MATH、AIME；正文使用 accuracy、reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Matching Supervision to the Student's Learning Capacity: A Unified Framework for On-Policy Self-Distillation</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.08176">arXiv ↗</a></span> <span class="entry-tldr">Agent/工具交互 · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 Agent/工具交互 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - top-k 教师分布：压缩完整 logits 的查询与存储成本；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合；
  - privileged context：教师获得学生推理时不可见的额外信息；
  - 自教师：同一模型在不同上下文或历史条件下产生监督。
- 结果：
  - 任务域为Agent/工具交互；涉及模型/教师包括 Qwen3-1.7B、Qwen3-4B、Qwen3-8B；评测覆盖 MATH、AIME；正文使用 accuracy 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；质量提升可能伴随多样性下降或模式收缩。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>PAST: Privileged Adaptation from Complete Student Trajectories for On-Policy Self-Distillation</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.08726">arXiv ↗</a></span> <span class="entry-tldr">数学与通用推理 · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 数学与通用推理 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生前缀或部分 rollout；
  - 监督来源：特权上下文条件化的自教师；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - replay：复用历史学生轨迹，以吞吐换取一定的策略陈旧度。
- 结果：
  - 任务域为数学与通用推理；涉及模型/教师包括 Qwen3-1.7B、Qwen3-4B、phi；评测覆盖 AIME；正文使用 success rate、reward、F1、throughput 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>RP-OPSD: Reasoning-Pivot-Guided On-Policy Self-Distillation for Multilingual Reasoning Transfer</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.06347">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - privileged context：教师获得学生推理时不可见的额外信息；
  - 自教师：同一模型在不同上下文或历史条件下产生监督。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 Qwen3-1.7B、Qwen3-4B、DeepSeek-V4-Flash、DeepSeek-AI；正文使用 pass@1、accuracy、reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Look Ahead Before You Distill: Future Trajectory Validation of Teacher Guidance for Agentic On-Policy Distillation</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.01953">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 课程调度：按难度、置信度或训练阶段改变样本与监督配置；
  - 选择性门控：过滤不可靠教师信号或只干预关键状态。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 Qwen3-32B、Qwen3-1.7B、Qwen3-4B、Qwen3-8B、Qwen3-8B-RL、phi；正文使用 success rate、reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；长程、多轮状态中的误差传播与信用分配仍有限。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>PCSD: Persistent Consistency for Self-Distillation in Agentic Reinforcement Learning</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.01837">arXiv ↗</a></span> <span class="entry-tldr">多轮 Agent 只获得轨迹级成功信号，而 privileged teacher 在不同 token 上也并非同样可靠。</span></summary>

- 背景 / 研究问题：多轮 Agent 只获得轨迹级成功信号，而 privileged teacher 在不同 token 上也并非同样可靠。单点师生差异容易受噪声影响，整步共享权重又会抹平位置差异。PCSD 因而用“教师优势是否在局部持续存在”作为可信度依据。
- 方法：
  - 在学生当前策略生成的 ALFWorld/WebShop 轨迹上计算教师与学生的 token 对数概率差；
  - 采用自适应窗口和指数衰减聚合多时间尺度证据，强调连续出现的教师支持；
  - 用趋势调制削弱正在下降的局部信号，再经 sigmoid 产生连续蒸馏权重；
  - 将加权蒸馏目标与轨迹奖励驱动的 GRPO 联合优化，部署时只保留学生。
- 结果：
  - 使用 Qwen2.5-3B-Instruct 和 Qwen3-1.7B-Instruct，在 ALFWorld 与 WebShop 比较 GRPO、OPSD、RLSD、SDAR 等基线；
  - PCSD 在两种模型上都取得最高 ALFWorld Overall，WebShop 的最高 normalized score 为 85.0；Qwen2.5-3B 的完整配置 Overall 达 90.6，而固定短窗口消融为 82.8；
  - 性能依赖窗口、趋势项和蒸馏系数，且仍需额外教师前向计算；跨环境布局的泛化尚未充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>OPDSearch+: On-Policy Distillation with RL Refinement for Search-Augmented Reasoning</strong> <span class="entry-meta">2026-08 · arXiv</span> <a href="https://arxiv.org/abs/2608.24310">arXiv ↗</a></span> <span class="entry-tldr">Agent/工具交互 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 Agent/工具交互 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新。
- 结果：
  - 任务域为Agent/工具交互；涉及模型/教师包括 Qwen2.5-3B、Qwen2.5-14B-Instruct；评测覆盖 HotpotQA；正文使用 accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Outcome-Confounded Local Supervision in On-Policy Distillation</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.23731">arXiv ↗</a></span> <span class="entry-tldr">安全与对齐 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 安全与对齐 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生前缀或部分 rollout；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 对比目标：显式比较候选行为、推理模式或教师与学生响应；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合；
  - 选择性门控：过滤不可靠教师信号或只干预关键状态。
- 结果：
  - 任务域为安全与对齐；涉及模型/教师包括 Qwen3-8B、Qwen3-32B、Qwen2.5-7B；评测覆盖 MATH；正文使用 pass@1、accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；证据集中于有限 benchmark，不能直接外推到开放环境。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Lightning OPD 2.0: Mitigating Style Bias in Cross-Teacher On-Policy Distillation for Large Reasoning Models</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.28449">arXiv ↗</a></span> <span class="entry-tldr">代码与形式化任务 · 在线生成与教师查询降本</span></summary>

- 背景 / 研究问题：面向 代码与形式化任务 中的「在线生成与教师查询降本」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - replay：复用历史学生轨迹，以吞吐换取一定的策略陈旧度；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 选择性门控：过滤不可靠教师信号或只干预关键状态。
- 结果：
  - 任务域为代码与形式化任务；涉及模型/教师包括 Qwen-family、Qwen3-4B、Qwen3-8B、Qwen3-30B-A3B-Thinking、Qwen3-8B-Base、Qwen3-4B-SFT；评测覆盖 MATH、AIME、LiveCodeBench；正文使用 pass@1 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Proxy OPD: On-Policy Distillation with Transferable Relative Proxy Update</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.11505">arXiv ↗</a></span> <span class="entry-tldr">代码与形式化任务 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 代码与形式化任务 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师分布与 outcome/verifier 混合信号；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 异步/near-policy：解耦生成与更新，并显式管理轨迹新鲜度；
  - 选择性门控：过滤不可靠教师信号或只干预关键状态；
  - 策略梯度更新：把教师或判别器信号作为密集/序列奖励。
- 结果：
  - 任务域为代码与形式化任务；涉及模型/教师包括 Qwen3-family、Qwen3-1.7B、Qwen3-4B、Qwen3-8B、phi；评测覆盖 MATH、HumanEval、MBPP；正文使用 accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Weak-to-Strong Generalization via Direct On-Policy Distillation</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.05394">arXiv ↗</a></span> <span class="entry-tldr">弱 RL 教师的最终策略同时包含有用的 RL 位移与小模型容量上限，直接模仿可能反向拖累更强学生。</span></summary>

- 背景 / 研究问题：弱 RL 教师的最终策略同时包含有用的 RL 位移与小模型容量上限，直接模仿可能反向拖累更强学生。
- 方法：用 post-RL teacher 与 pre-RL reference 的 token log-ratio 恢复隐式奖励，并在强学生自己的前缀上施加该方向；迁移的是 policy shift，而非教师绝对分布。
- 结果：论文在多个 Qwen3/DeepSeek 数学设置中实现 weak-to-strong 改进，并展示多种 policy shift 的顺序组合；适用前提是能取得成对的教师 checkpoints。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>ShortOPD: Recovering Pruned LLMs with Short-to-Long On-Policy Distillation</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.13124">arXiv ↗</a></span> <span class="entry-tldr">代码与形式化任务 · 短 rollout / 前缀聚焦</span></summary>

- 背景 / 研究问题：面向 代码与形式化任务 中的「短 rollout / 前缀聚焦」问题。
- 方法：
  - 状态与数据：学生前缀或部分 rollout；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - top-k 教师分布：压缩完整 logits 的查询与存储成本；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向。
- 结果：
  - 任务域为代码与形式化任务；涉及模型/教师包括 Qwen3-4B-Instruct、Qwen3-4B-Instruct-2507、Qwen3-4B-Thinking-2507、Qwen3-8B、Qwen-style、Qwen3-4B；评测覆盖 GSM8K、MATH、Math500、MMLU、HumanEval、MBPP、MT-Bench、HellaSwag；正文使用 pass@1、pass@k、accuracy、reward、perplexity 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Demystifying On-Policy Distillation: Roles, Pathologies, and Regulations</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.13399">arXiv ↗</a></span> <span class="entry-tldr">OPD 兼有 distillation 与 dense-reward RL 特征，但其增益来源和崩溃条件不清。</span></summary>

- 背景 / 研究问题：OPD 兼有 distillation 与 dense-reward RL 特征，但其增益来源和崩溃条件不清。论文将 failure 归为 student–teacher mismatch 与 length exploitation。
- 方法：
  - 用 Informativeness 衡量教师 token log-ratio 是否区分正确/错误 rollout；
  - 分析 sequence-mean advantage 如何诱发冗长填充或提前 EOS；
  - 用 hard clipping 与 log-scale compression 调节 advantage，而不额外引入模型。
- 结果：
  - Qwen3-1.7B-Base 学生、多个 Qwen3 教师，七个数学基准；
  - 在固定计算预算下，每题 1 rollout、更多不同 prompts 优于增加同题 rollout 数；
  - pass@k 在大 k 时与 base 收敛，支持“探索催化”解释，但结论仍来自单一模型家族与数学任务。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>X$^3$-OPD: Distilling Reasoning into Large Audio-Language Models via On-Policy Alignment</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.21550">arXiv ↗</a></span> <span class="entry-tldr">音频或语音 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 音频或语音 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合；
  - 跨 tokenizer 对齐：在 byte、span 或共享表示空间中传递信号；
  - 表示蒸馏：在 token 概率之外匹配隐藏特征或中间状态。
- 结果：
  - 任务域为音频或语音；涉及模型/教师包括 Qwen3-Omni-30B-A3B、Qwen3-235B-A22B-Thinking、Qwen3-Omni-Thinking、GPT-4o-Audio；正文使用 accuracy、reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>The Physics of Multi-Turn Long-Horizon Planning: From Pre-training to Post-training via Single- and Multi-Teacher On-Policy Agentic Distillation</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.24720">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 多教师整合与干扰控制</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「多教师整合与干扰控制」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：多教师路由或聚合信号；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 多教师路由：按样本、能力或状态选择和聚合专长教师；
  - 跨 tokenizer 对齐：在 byte、span 或共享表示空间中传递信号；
  - 策略梯度更新：把教师或判别器信号作为密集/序列奖励。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 Qwen2.5-100M；正文使用 pass@1、success rate、F1 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Weak-to-Strong On-Policy Distillation</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.26246">arXiv ↗</a></span> <span class="entry-tldr">代码与形式化任务 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 代码与形式化任务 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - 对比目标：显式比较候选行为、推理模式或教师与学生响应；
  - privileged context：教师获得学生推理时不可见的额外信息；
  - 多教师路由：按样本、能力或状态选择和聚合专长教师；
  - 策略梯度更新：把教师或判别器信号作为密集/序列奖励。
- 结果：
  - 任务域为代码与形式化任务；涉及模型/教师包括 Qwen3-8B、Qwen3-4B、Qwen3-0.6B、Qwen3-1.7B；评测覆盖 MATH、GPQA、HumanEval、MBPP、LiveCodeBench；正文使用 accuracy 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>On-Policy Delta Distillation</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.15161">arXiv ↗</a></span> <span class="entry-tldr">直接拟合 instruction/reasoning 教师会把教师固有偏差与真正的后训练增量一起复制给学生。</span></summary>

- 背景 / 研究问题：直接拟合 instruction/reasoning 教师会把教师固有偏差与真正的后训练增量一起复制给学生。
- 方法：以教师和其 instruction-tuning 前基座模型的概率差构造 delta signal，并加入 expectation correction 与方向 gate，在学生轨迹上训练。
- 结果：数学、科学与代码推理上的多规模实验均报告优于 vanilla OPD/ExOPD；与 Direct-OPD 共同支持“相对策略变化比绝对教师更可迁移”，但两者的理论推导和校正项不同。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Multi-Turn On-Policy Distillation with Prefix Replay</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.04763">arXiv ↗</a></span> <span class="entry-tldr">Agent/工具交互 · 短 rollout / 前缀聚焦</span></summary>

- 背景 / 研究问题：面向 Agent/工具交互 中的「短 rollout / 前缀聚焦」问题。
- 方法：
  - 状态与数据：学生前缀或部分 rollout；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - replay：复用历史学生轨迹，以吞吐换取一定的策略陈旧度；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 多教师路由：按样本、能力或状态选择和聚合专长教师；
  - 策略梯度更新：把教师或判别器信号作为密集/序列奖励。
- 结果：
  - 任务域为Agent/工具交互；涉及模型/教师包括 Qwen3-family、Qwen3-4B-Instruct-2507、Qwen3-8B、Qwen3-30B-A3B-Instruct、Qwen3-4B、Qwen3-30B-A3B；评测覆盖 MATH、OlympiadBench、Math500、HotpotQA；正文使用 accuracy 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>UI-MOPD: Multi-Platform On-Policy Distillation for Unified GUI Agents</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.04425">arXiv ↗</a></span> <span class="entry-tldr">视觉—语言或多模态 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 视觉—语言或多模态 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：多教师路由或聚合信号；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 多教师路由：按样本、能力或状态选择和聚合专长教师；
  - 表示蒸馏：在 token 概率之外匹配隐藏特征或中间状态；
  - 异步/near-policy：解耦生成与更新，并显式管理轨迹新鲜度。
- 结果：
  - 任务域为视觉—语言或多模态；涉及模型/教师包括 Qwen3-VL-8B-Thinking、Qwen3-VL-32B-Thinking、Qwen3-VL-4B-Instruct、Qwen3-VL-4B-Thinking、Qwen3-VL-8B-Instruct、Qwen3-VL-32B-Instruct；评测覆盖 OSWorld；正文使用 accuracy、success rate、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；长程、多轮状态中的误差传播与信用分配仍有限。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>H-OPD: Confidence Aware Heterogeneous Multi-Teacher Multimodal On-policy Distillation</strong> <span class="entry-meta">2026-07 · EMNLP 2026</span> <a href="https://arxiv.org/abs/2607.02592">arXiv ↗</a></span> <span class="entry-tldr">视觉—语言或多模态 · 多教师整合与干扰控制</span></summary>

- 背景 / 研究问题：面向 视觉—语言或多模态 中的「多教师整合与干扰控制」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：多教师路由或聚合信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 多教师路由：按样本、能力或状态选择和聚合专长教师；
  - 选择性门控：过滤不可靠教师信号或只干预关键状态。
- 结果：
  - 任务域为视觉—语言或多模态；涉及模型/教师包括 Qwen3-VL、Qwen3-VL-4B-Instruct、Qwen3-VL-2B-Instruct、Qwen3-4B-Instruct-2507、Qwen3-VL-8B-Instruct、Qwen3-8B；评测覆盖 MathVista、ChartQA；正文使用 accuracy、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨 tokenizer 或跨模型族迁移可能引入额外对齐误差。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Cross-Tokenizer On-Policy Distillation via Byte-Prefix Marginalization</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.22334">arXiv ↗</a></span> <span class="entry-tldr">数学与通用推理 · 跨模型族监督对齐</span></summary>

- 背景 / 研究问题：面向 数学与通用推理 中的「跨模型族监督对齐」问题。
- 方法：
  - 状态与数据：学生前缀或部分 rollout；
  - 监督来源：表示层与 token 分布联合监督；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新。
- 结果：
  - 任务域为数学与通用推理；涉及模型/教师包括 Qwen3-32B、phi、GLM-Z1-9B-0414、GLM-Z1-9B；评测覆盖 MATH、AIME、HumanEval、LiveCodeBench；正文使用 reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Med-OPD: Improving Medical Vision-Language Models via Evidence-Aware On-Policy Distillation</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.16303">arXiv ↗</a></span> <span class="entry-tldr">视觉—语言或多模态 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 视觉—语言或多模态 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - top-k 教师分布：压缩完整 logits 的查询与存储成本；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新。
- 结果：
  - 任务域为视觉—语言或多模态；涉及模型/教师包括 Qwen3-VL-2B-Instruct、Qwen3-VL-4B-Instruct、Qwen3-VL-8B-Instruct、Qwen3-VL-32B-Instruct；正文使用 accuracy、reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；证据集中于有限 benchmark，不能直接外推到开放环境。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>On-Policy Distillation for LLM Safety: A Routing Approach to Template-Robust Realignment</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.27081">arXiv ↗</a></span> <span class="entry-tldr">安全与对齐 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 安全与对齐 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - 表示蒸馏：在 token 概率之外匹配隐藏特征或中间状态。
- 结果：
  - 任务域为安全与对齐；涉及模型/教师包括 Qwen2.5-7B-Instruct、Qwen2.5-32B-Instruct、Gemma-2、Gemma-2-9B-it、Gemma；正文使用 accuracy、success rate 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；质量提升可能伴随多样性下降或模式收缩。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>VAD: Attributing Visual Evidence for Target Reconstruction in Multimodal On-Policy Distillation</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.28590">arXiv ↗</a></span> <span class="entry-tldr">视觉—语言或多模态 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 视觉—语言或多模态 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生前缀或部分 rollout；
  - 监督来源：特权上下文条件化的自教师；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 对比目标：显式比较候选行为、推理模式或教师与学生响应。
- 结果：
  - 任务域为视觉—语言或多模态；正文使用 accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>TurnOPD: Making On-Policy Distillation Turn-Aware for Efficient Long-Horizon Agent Training</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.05804">arXiv ↗</a></span> <span class="entry-tldr">Agent/工具交互 · 在线生成与教师查询降本</span></summary>

- 背景 / 研究问题：面向 Agent/工具交互 中的「在线生成与教师查询降本」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 策略梯度更新：把教师或判别器信号作为密集/序列奖励。
- 结果：
  - 任务域为Agent/工具交互；涉及模型/教师包括 Qwen3-1.7B、Qwen3-8B-GRPO、Qwen3-4B；正文使用 accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；长程、多轮状态中的误差传播与信用分配仍有限。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>EvoReason: Self-Evolving Reasoning Primitive-Guided On-Policy Distillation for Latent Reasoning in Generative Recommendation</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.29010">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：表示层与 token 分布联合监督；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 表示蒸馏：在 token 概率之外匹配隐藏特征或中间状态；
  - 选择性门控：过滤不可靠教师信号或只干预关键状态。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 Qwen3-1.7B；正文使用 success rate、reward、latency 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>SEED: Self-Evolving On-Policy Distillation for Agentic Reinforcement Learning</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.14777">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：教师分布与 outcome/verifier 混合信号；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 Qwen2.5-3B-Instruct、Qwen2.5-7B-Instruct、Qwen3-1.7B-Instruct、Qwen2.5-3B、Qwen2.5-7B、Qwen3-1.7B；评测覆盖 HotpotQA、Natural Questions；正文使用 accuracy、success rate、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>CADENCE: Closing the Reasoning Gap via Coverage-Adaptive On-Policy Distillation</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.16955">arXiv ↗</a></span> <span class="entry-tldr">数学与通用推理 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 数学与通用推理 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新。
- 结果：
  - 任务域为数学与通用推理；涉及模型/教师包括 Qwen2.5-Math、Qwen2.5-Math-1.5B-Instruct、Qwen2.5-0.5B-Instruct、Qwen2.5-3B-Instruct、phi；评测覆盖 GSM8K、MATH；正文使用 pass@1、accuracy、reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨 tokenizer 或跨模型族迁移可能引入额外对齐误差。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>RP-OPSD: Resolution-Privileged On-Policy Self-Distillation for Multimodal Large Language Models</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.24447">arXiv ↗</a></span> <span class="entry-tldr">视觉—语言或多模态 · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 视觉—语言或多模态 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新。
- 结果：
  - 任务域为视觉—语言或多模态；正文使用 reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Purified OPSD: On-Policy Self-Distillation Without Losing How to Think</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.02234">arXiv ↗</a></span> <span class="entry-tldr">数学与通用推理 · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 数学与通用推理 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - privileged context：教师获得学生推理时不可见的额外信息。
- 结果：
  - 任务域为数学与通用推理；涉及模型/教师包括 Qwen3-8B、Qwen3-4B、Qwen-7B、DeepSeek-R1-Distill-Qwen；评测覆盖 MATH、AIME；正文使用 accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；方法效果依赖特定教师访问权限或概率信息。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>OPD-IAD: From Language Judgment to Industrial Anomaly Detection via On-Policy Self-Distillation</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.18850">arXiv ↗</a></span> <span class="entry-tldr">视觉—语言或多模态 · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 视觉—语言或多模态 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：特权上下文条件化的自教师；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 对比目标：显式比较候选行为、推理模式或教师与学生响应；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合；
  - privileged context：教师获得学生推理时不可见的额外信息。
- 结果：
  - 任务域为视觉—语言或多模态；涉及模型/教师包括 Qwen3-VL-8B-Instruct；正文使用 accuracy、reward、F1 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Self-Boosting Vision-Language Models with Noisy Student On-Policy Self-Distillation</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.23125">arXiv ↗</a></span> <span class="entry-tldr">视觉—语言或多模态 · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 视觉—语言或多模态 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - 对比目标：显式比较候选行为、推理模式或教师与学生响应；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合。
- 结果：
  - 任务域为视觉—语言或多模态；涉及模型/教师包括 Qwen2.5-VL-7B、Qwen2.5-VL-72B-Instruct、Qwen3-VL-Thinking、Qwen3-VL-8B-Instruct、Qwen3-VL-8B-Thinking、GLM-4.6V-Flash；评测覆盖 MMMU、MathVista、MMBench、ChartQA、VQAv2；正文使用 pass@1、accuracy、reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Trust Region Policy Distillation</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.04751">arXiv ↗</a></span> <span class="entry-tldr">数学与通用推理 · 可信更新区域</span></summary>

- 背景 / 研究问题：面向 数学与通用推理 中的「可信更新区域」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 自教师：同一模型在不同上下文或历史条件下产生监督。
- 结果：
  - 任务域为数学与通用推理；涉及模型/教师包括 Qwen3-8B、Qwen3-30B-A3B-Instruct、Qwen3-1.7B-Base、Qwen3-8B-Base、Qwen3-14B、DeepSeek-AI；评测覆盖 MATH、AIME、AMC；正文使用 accuracy、reward、KL divergence、throughput 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；证据集中于有限 benchmark，不能直接外推到开放环境。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>SAF-OPD: Stable Advantage Fusion for On-Policy Distillation</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.29209">arXiv ↗</a></span> <span class="entry-tldr">代码与形式化任务 · token/step/turn 级信用分配</span></summary>

- 背景 / 研究问题：面向 代码与形式化任务 中的「token/step/turn 级信用分配」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师分布与 outcome/verifier 混合信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - top-k 教师分布：压缩完整 logits 的查询与存储成本；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合。
- 结果：
  - 任务域为代码与形式化任务；涉及模型/教师包括 Qwen3-1.7B、Qwen3-8B、Qwen3-4B、Qwen3-30B-A3B-Instruct；评测覆盖 MATH、AIME、HumanEval、MBPP、LiveCodeBench；正文使用 pass@1、accuracy、reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Diagnosing and Mitigating Thinking Collapse in On-Policy Self-Distillation</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.10805">arXiv ↗</a></span> <span class="entry-tldr">数学与通用推理 · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 数学与通用推理 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合；
  - privileged context：教师获得学生推理时不可见的额外信息。
- 结果：
  - 任务域为数学与通用推理；涉及模型/教师包括 Qwen3-1.7B、Qwen3-4B、Qwen-1.5B、Qwen-1.7B、Qwen-4B、DeepSeek-R1-Distill-Qwen；评测覆盖 MATH、AIME；正文使用 accuracy 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>One Student, Many Teachers: Multi-Task On-Policy Distillation via Soft-Prompt Privileged Context</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.18293">arXiv ↗</a></span> <span class="entry-tldr">Agent/工具交互 · 多教师整合与干扰控制</span></summary>

- 背景 / 研究问题：面向 Agent/工具交互 中的「多教师整合与干扰控制」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新。
- 结果：
  - 任务域为Agent/工具交互；涉及模型/教师包括 Qwen3-1.7B-Base、Qwen3-4B、Qwen3-8B、Qwen-8B、Qwen3-235B-A22B、Qwen3-1.7B；评测覆盖 MATH、MMLU、MMLU-Pro、HellaSwag、TruthfulQA；正文使用 accuracy、reward、F1 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：跨任务或分布外泛化仍缺少充分验证；方法效果依赖特定教师访问权限或概率信息。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Pass the Baton: Trajectory-Relayed On-Policy Distillation</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.26057">arXiv ↗</a></span> <span class="entry-tldr">数学与通用推理 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 数学与通用推理 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生前缀或部分 rollout；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - top-k 教师分布：压缩完整 logits 的查询与存储成本；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本。
- 结果：
  - 任务域为数学与通用推理；涉及模型/教师包括 Qwen3-4B-Instruct-2507、Qwen3-0.6B、Qwen3-1.7B-Non-Thinking、Qwen3-0.6B-Non-Thinking；评测覆盖 MATH、AIME、AMC、OlympiadBench、Math500；正文使用 pass@k、accuracy、reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Flux-OPD: On-Policy Distillation with Evolving Contexts</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.28022">arXiv ↗</a></span> <span class="entry-tldr">语言模型通用能力 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 语言模型通用能力 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师分布与 outcome/verifier 混合信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - privileged context：教师获得学生推理时不可见的额外信息。
- 结果：
  - 任务域为语言模型通用能力；涉及模型/教师包括 Qwen3-VL-Instruct、Qwen2.5-VL-Instruct、GPT-4o；正文使用 reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；方法效果依赖特定教师访问权限或概率信息。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Veritas++: Value-aware On-Policy Distillation for Perception-Enhanced AIGI Detection</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.27113">arXiv ↗</a></span> <span class="entry-tldr">视觉—语言或多模态 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 视觉—语言或多模态 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：黑盒评分、rubric 或语言反馈；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合。
- 结果：
  - 任务域为视觉—语言或多模态；涉及模型/教师包括 Qwen3-VL-8B、GPT-5.1；正文使用 accuracy、exact match、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>EasyOPD: An Easy-to-use On-Policy Distillation Framework for Large Language Models</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.11012">arXiv ↗</a></span> <span class="entry-tldr">视频理解/生成 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 视频理解/生成 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 自教师：同一模型在不同上下文或历史条件下产生监督；
  - 跨 tokenizer 对齐：在 byte、span 或共享表示空间中传递信号；
  - 异步/near-policy：解耦生成与更新，并显式管理轨迹新鲜度；
  - 策略梯度更新：把教师或判别器信号作为密集/序列奖励。
- 结果：
  - 任务域为视频理解/生成；涉及模型/教师包括 Qwen2.5-7B-Instruct、Qwen3-8B、Qwen3-1.7B、Qwen3-4B、Phi-4-mini-Instruct；评测覆盖 GSM8K、MATH、AIME、Math500、MBPP、LiveCodeBench；正文使用 pass@1、accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：长程、多轮状态中的误差传播与信用分配仍有限；方法效果依赖特定教师访问权限或概率信息。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>OPOD: On-Policy Omni Distillation</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.20918">arXiv ↗</a></span> <span class="entry-tldr">视觉—语言或多模态 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 视觉—语言或多模态 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合。
- 结果：
  - 任务域为视觉—语言或多模态；涉及模型/教师包括 Qwen3-Omni-30B-A3B、Qwen2.5-Omni、Qwen2.5-Omni-7B、Qwen2.5-Omni-3B、Qwen-vl、Qwen2-audio；评测覆盖 GPQA、MMLU、MMLU-Pro、MMMU、MathVista、ChartQA、HotpotQA；正文使用 accuracy、reward、latency 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；方法效果依赖特定教师访问权限或概率信息。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Contrastive On-Policy Distillation</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.19046">arXiv ↗</a></span> <span class="entry-tldr">视觉—语言或多模态 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 视觉—语言或多模态 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 对比目标：显式比较候选行为、推理模式或教师与学生响应；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合。
- 结果：
  - 任务域为视觉—语言或多模态；涉及模型/教师包括 Qwen3-VL-2B-Instruct、Qwen2.5-VL-32B、Qwen3-VL-8B、Qwen3-VL；评测覆盖 MMMU、MathVista；正文使用 accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>DASH-OPD: Discrepancy-Aware Switching with Hysteresis for On-Policy Distillation</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.29078">arXiv ↗</a></span> <span class="entry-tldr">Agent/工具交互 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 Agent/工具交互 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - 课程调度：按难度、置信度或训练阶段改变样本与监督配置；
  - 选择性门控：过滤不可靠教师信号或只干预关键状态；
  - 策略梯度更新：把教师或判别器信号作为密集/序列奖励。
- 结果：
  - 任务域为Agent/工具交互；涉及模型/教师包括 Qwen3-1.7B、Qwen3-4B、Qwen3-30B-A3B；正文使用 success rate 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；长程、多轮状态中的误差传播与信用分配仍有限。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Reward-Gated On-Policy Distillation</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.04037">arXiv ↗</a></span> <span class="entry-tldr">代码与形式化任务 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 代码与形式化任务 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师分布与 outcome/verifier 混合信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合；
  - 选择性门控：过滤不可靠教师信号或只干预关键状态。
- 结果：
  - 任务域为代码与形式化任务；涉及模型/教师包括 Qwen2.5-1.5B；评测覆盖 MATH、MMLU、IFEval、BBH；正文使用 reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：方法效果依赖特定教师访问权限或概率信息；证据集中于有限 benchmark，不能直接外推到开放环境。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Rethinking On-Policy Self-Distillation for Thinking Models</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.05184">arXiv ↗</a></span> <span class="entry-tldr">数学与通用推理 · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 数学与通用推理 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 对比目标：显式比较候选行为、推理模式或教师与学生响应。
- 结果：
  - 任务域为数学与通用推理；涉及模型/教师包括 Qwen3-1.7B、Qwen3-4B、Qwen3-8B、Qwen3-4B-Think-2507、Qwen3-4B-Think、Qwen3-4B-Instruct-2507；评测覆盖 MATH、AIME；正文使用 pass@1、pass@k、accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；长程、多轮状态中的误差传播与信用分配仍有限。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Trust Region On-Policy Distillation</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.01249">arXiv ↗</a></span> <span class="entry-tldr">当教师和学生分布差距大时，K1 sampled reverse-KL 在学生生成 token 上出现大 outlier，教师也可能在低质量学生前缀上给出不可靠监督。</span></summary>

- 背景 / 研究问题：当教师和学生分布差距大时，K1 sampled reverse-KL 在学生生成 token 上出现大 outlier，教师也可能在低质量学生前缀上给出不可靠监督。
- 方法：
  - 依据 teacher/student 概率比划分 on-policy trust region；
  - 对 outlier 采用 masking、clipping 或 top-k forward-KL；
  - 从教师 prefix 开始续写，以 off-policy forward-KL guidance 把学生引向可靠区域。
- 结果：
  - 统一训练 200 steps、batch 128×4 rollouts、最大 8096 tokens，评测数学、STEM、代码与指令跟随；
  - 单域中相对 OPD，数学平均 +3.06 points、通用任务 +2.63 points；
  - outlier 区采用 forward KL 的版本优于仅 mask/clip，但混合 off-policy guidance 增加了实现与教师计算复杂度。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Decomposed On-Policy Distillation for Vision-Language Reasoning: Steering Gradients for Visual Grounding</strong> <span class="entry-meta">2026-06 · ICML 2026</span> <a href="https://arxiv.org/abs/2606.00564">arXiv ↗</a></span> <span class="entry-tldr">视觉—语言或多模态 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 视觉—语言或多模态 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - 选择性门控：过滤不可靠教师信号或只干预关键状态；
  - 策略梯度更新：把教师或判别器信号作为密集/序列奖励。
- 结果：
  - 任务域为视觉—语言或多模态；涉及模型/教师包括 Qwen3-VL-8B-Instruct、Qwen3-VL-2B-Instruct、Qwen3-VL-4B-Instruct、Qwen3-VL-8B、Qwen3-VL-2B、Qwen3-VL-4B；评测覆盖 MMMU；正文使用 accuracy 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；证据集中于有限 benchmark，不能直接外推到开放环境。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Dense Supervision, Sparse Updates: On the Sparsity and Geometry of On-Policy Distillation</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.13657">arXiv ↗</a></span> <span class="entry-tldr">OPD 名义上给每个 token 密集监督，但真正主导参数变化的 token/方向可能高度稀疏。</span></summary>

- 背景 / 研究问题：OPD 名义上给每个 token 密集监督，但真正主导参数变化的 token/方向可能高度稀疏。
- 方法：分析 token 梯度贡献、参数更新几何和不同 support 区域，检验 dense feedback 是否转化为 dense learning。
- 结果：多 reasoning 配置显示更新集中于少量关键位置；该工作提供诊断而非完整替代算法，并与后续 SuRe/IDA-OPD 的重加权动机衔接。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Breaking the Tokenizer Barrier: On-Policy Distillation across Model Families</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.09456">arXiv ↗</a></span> <span class="entry-tldr">语言模型通用能力 · token/step/turn 级信用分配</span></summary>

- 背景 / 研究问题：面向 语言模型通用能力 中的「token/step/turn 级信用分配」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 跨 tokenizer 对齐：在 byte、span 或共享表示空间中传递信号；
  - 异步/near-policy：解耦生成与更新，并显式管理轨迹新鲜度。
- 结果：
  - 任务域为语言模型通用能力；涉及模型/教师包括 Qwen3-8B、Qwen-7B、Llama3.1-8B-SFT、DeepSeek-R1、DeepSeek-R1-Distill-Qwen；评测覆盖 MATH、AIME、GPQA、LiveCodeBench；正文使用 accuracy 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>On the Geometry of On-Policy Distillation</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.07082">arXiv ↗</a></span> <span class="entry-tldr">数学与通用推理 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 数学与通用推理 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：教师分布与 outcome/verifier 混合信号；
  - top-k 教师分布：压缩完整 logits 的查询与存储成本；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 策略梯度更新：把教师或判别器信号作为密集/序列奖励。
- 结果：
  - 任务域为数学与通用推理；涉及模型/教师包括 Qwen3-family、Qwen3-8B-Base、Qwen3-32B；评测覆盖 MATH、AIME、LiveCodeBench；正文使用 accuracy、reward、F1、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；证据集中于有限 benchmark，不能直接外推到开放环境。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>OPD+: Rethinking the Advantage Design for On-Policy Distillation</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.01039">arXiv ↗</a> <strong>▲上方路线已收录</strong></span> <span class="entry-tldr">Agent/工具交互 · token/step/turn 级信用分配</span></summary>

- 背景 / 研究问题：面向 Agent/工具交互 中的「token/step/turn 级信用分配」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师分布与 outcome/verifier 混合信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - privileged context：教师获得学生推理时不可见的额外信息。
- 结果：
  - 任务域为Agent/工具交互；涉及模型/教师包括 Qwen3-1.7B、Qwen3-8B、Qwen3-8B-Base；评测覆盖 MATH、AIME；正文使用 accuracy、reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Stabilizing On-Policy Distillation for MLLM Reasoning with Global Normalization</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.09091">arXiv ↗</a></span> <span class="entry-tldr">视觉—语言或多模态 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 视觉—语言或多模态 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师分布与 outcome/verifier 混合信号；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合；
  - 表示蒸馏：在 token 概率之外匹配隐藏特征或中间状态；
  - 策略梯度更新：把教师或判别器信号作为密集/序列奖励。
- 结果：
  - 任务域为视觉—语言或多模态；评测覆盖 MMMU、MathVista；正文使用 accuracy、reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；长程、多轮状态中的误差传播与信用分配仍有限。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>SAGE-OPD: Selective Agent-Guided Intervention for Multi-Turn On-Policy Distillation</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.19659">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：教师分布与 outcome/verifier 混合信号；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合；
  - 跨 tokenizer 对齐：在 byte、span 或共享表示空间中传递信号；
  - 异步/near-policy：解耦生成与更新，并显式管理轨迹新鲜度；
  - 课程调度：按难度、置信度或训练阶段改变样本与监督配置。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 Qwen3-32B、Qwen3-8B、Qwen3-0.6B、Qwen3-1.7B、phi；正文使用 exact match、success rate 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Prefix-Guided On-Policy Distillation: Mining Golden Trajectories from Rollouts</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.21994">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 短 rollout / 前缀聚焦</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「短 rollout / 前缀聚焦」问题。
- 方法：
  - 状态与数据：学生前缀或部分 rollout；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - top-k 教师分布：压缩完整 logits 的查询与存储成本；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 跨 tokenizer 对齐：在 byte、span 或共享表示空间中传递信号；
  - 选择性门控：过滤不可靠教师信号或只干预关键状态。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 Qwen-1.5B、Qwen-7B、Qwen3-4B-Base、Qwen3-4B、DeepSeek-R1-Distill-Qwen、DeepSeek-1.5B；评测覆盖 MATH、AIME、AMC；正文使用 accuracy、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；长程、多轮状态中的误差传播与信用分配仍有限。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Bridging Reasoning Trajectories in On-Policy Distillation via Near-Future Guidance</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.00305">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 自教师：同一模型在不同上下文或历史条件下产生监督。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 Qwen3-30B-A3B-Instruct、Qwen3-4B-Instruct-2507、Qwen3-4B、Qwen-3、DeepSeek-V4、DeepSeek-AI；评测覆盖 AIME；正文使用 pass@1、accuracy 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；长程、多轮状态中的误差传播与信用分配仍有限。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>OPD-Evolver: Cultivating Holistic Agent Evolver via On-Policy Distillation</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.17628">arXiv ↗</a></span> <span class="entry-tldr">Agent/工具交互 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 Agent/工具交互 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：特权上下文条件化的自教师；
  - top-k 教师分布：压缩完整 logits 的查询与存储成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - privileged context：教师获得学生推理时不可见的额外信息；
  - 自教师：同一模型在不同上下文或历史条件下产生监督；
  - 异步/near-policy：解耦生成与更新，并显式管理轨迹新鲜度。
- 结果：
  - 任务域为Agent/工具交互；涉及模型/教师包括 Qwen3-4B-Instruct-2507、Qwen3-Embedding-0.6B、Qwen3-4B、Qwen3-4B-Thinking-2507、phi；评测覆盖 MATH；正文使用 reward、F1 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：长程、多轮状态中的误差传播与信用分配仍有限；证据集中于有限 benchmark，不能直接外推到开放环境。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>SG-OPD: Sign-Gated On-Policy Distillation via Sign-Consistency Gating and Phased Teacher Sampling</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.09304">arXiv ↗</a></span> <span class="entry-tldr">安全与对齐 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 安全与对齐 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：教师分布与 outcome/verifier 混合信号；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合；
  - 跨 tokenizer 对齐：在 byte、span 或共享表示空间中传递信号。
- 结果：
  - 任务域为安全与对齐；涉及模型/教师包括 Qwen3-1.7B-Non-Thinking、Qwen3-4B-Non-Thinking、Qwen3-1.7B、Qwen3-4B-RL-Math；评测覆盖 MATH、AIME；正文使用 accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>PowerOPD: Stabilizing On-Policy Distillation with Bounded Power Transformation</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.17199">arXiv ↗</a></span> <span class="entry-tldr">数学与通用推理 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 数学与通用推理 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师分布与 outcome/verifier 混合信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担。
- 结果：
  - 任务域为数学与通用推理；涉及模型/教师包括 Qwen3-1.7B、Qwen3-4B、Qwen3-0.6B-Base、Qwen3-1.7B-Base、Qwen3-8B、Qwen3-based；评测覆盖 MATH、OlympiadBench；正文使用 accuracy、reward、F1 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；证据集中于有限 benchmark，不能直接外推到开放环境。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>V-Zero: Answer-Label-Free On-Policy Distillation with Contrastive Evidence Gating for Fine-Grained Visual Reasoning</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.25319">arXiv ↗</a></span> <span class="entry-tldr">视觉—语言或多模态 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 视觉—语言或多模态 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：教师分布与 outcome/verifier 混合信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 对比目标：显式比较候选行为、推理模式或教师与学生响应；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新。
- 结果：
  - 任务域为视觉—语言或多模态；涉及模型/教师包括 Qwen3-VL；正文使用 reward、F1、throughput 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>OPID: On-Policy Skill Distillation for Agentic Reinforcement Learning</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.26790">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：特权上下文条件化的自教师；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 Qwen2.5-3B、Qwen3-1.7B-Instruct、Qwen2.5-7B、Qwen3-1.7B、Qwen2.5-3B-Instruct；评测覆盖 HotpotQA、Natural Questions；正文使用 accuracy、success rate、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Blockwise Policy-Drift Gating for On-Policy Distillation</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.24084">arXiv ↗</a></span> <span class="entry-tldr">数学与通用推理 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 数学与通用推理 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - top-k 教师分布：压缩完整 logits 的查询与存储成本；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新。
- 结果：
  - 任务域为数学与通用推理；涉及模型/教师包括 Qwen3-1.7B-Base、Qwen3-4B-Base-GRPO、Qwen3-4B；评测覆盖 MATH、AIME、AMC、Math500；正文使用 accuracy 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Finding the Evidence: Discovering Decision-Supporting Tokens for On-Policy Reasoning Distillation</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.22830">arXiv ↗</a></span> <span class="entry-tldr">代码与形式化任务 · token/step/turn 级信用分配</span></summary>

- 背景 / 研究问题：面向 代码与形式化任务 中的「token/step/turn 级信用分配」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 表示蒸馏：在 token 概率之外匹配隐藏特征或中间状态。
- 结果：
  - 任务域为代码与形式化任务；涉及模型/教师包括 Qwen2.5-1.5B-Instruct、Qwen2.5-14B-Instruct、Qwen3-4B-Instruct、Qwen3-1.7B；评测覆盖 MATH、AIME、AMC、HumanEval、MBPP；正文使用 accuracy、reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>ATOD: Annealed Turn-Aware On-Policy Distillation for Multi-Turn Agentic Tasks</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.27814">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：教师分布与 outcome/verifier 混合信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 自教师：同一模型在不同上下文或历史条件下产生监督。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 Qwen3-0.6B、Qwen3-1.7B、Qwen3-4B、Qwen3-30B-A3B；评测覆盖 HotpotQA、Natural Questions；正文使用 success rate、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；长程、多轮状态中的误差传播与信用分配仍有限。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Beyond Absolute Imitation: Anchored Residual Guidance for Privileged On-Policy Distillation</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.10385">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 策略增量迁移</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「策略增量迁移」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合；
  - privileged context：教师获得学生推理时不可见的额外信息；
  - 自教师：同一模型在不同上下文或历史条件下产生监督。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 Qwen2.5-7B-Instruct；评测覆盖 MATH、Math500、HumanEval、MBPP；正文使用 pass@1、accuracy 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；长程、多轮状态中的误差传播与信用分配仍有限。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>On-Policy Distillation with Curriculum Turn-level Guidance for Multi-turn Agents</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.15912">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - 跨 tokenizer 对齐：在 byte、span 或共享表示空间中传递信号；
  - 课程调度：按难度、置信度或训练阶段改变样本与监督配置；
  - 选择性门控：过滤不可靠教师信号或只干预关键状态。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 Qwen3-30B-A3B、Qwen3-1.7B、Mistral；正文使用 success rate、perplexity 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>SEAD: Competence-Aware On-Policy Distillation via Entropy-Guided Supervision</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.28562">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 按教师不确定性调整蒸馏强度或 KL 方向</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「按教师不确定性调整蒸馏强度或 KL 方向」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 自教师：同一模型在不同上下文或历史条件下产生监督。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 phi；评测覆盖 MATH、AIME、AMC、OlympiadBench；正文使用 pass@1、accuracy 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>RLCSD: Reinforcement Learning with Contrastive On-Policy Self-Distillation</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.11709">arXiv ↗</a></span> <span class="entry-tldr">数学与通用推理 · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 数学与通用推理 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 对比目标：显式比较候选行为、推理模式或教师与学生响应。
- 结果：
  - 任务域为数学与通用推理；涉及模型/教师包括 Qwen3-1.7B、Qwen3-4B、Qwen3-8B、opt；评测覆盖 MATH；正文使用 reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>DanceOPD: On-Policy Generative Field Distillation</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.27377">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - top-k 教师分布：压缩完整 logits 的查询与存储成本；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 自教师：同一模型在不同上下文或历史条件下产生监督。
- 结果：
  - 任务域为GUI agent；正文使用 reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；方法效果依赖特定教师访问权限或概率信息。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>OmniOPSD: Rationale-Privileged On-Policy Self-Distillation for Affective Computing</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.15920">arXiv ↗</a></span> <span class="entry-tldr">视觉—语言或多模态 · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 视觉—语言或多模态 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：特权上下文条件化的自教师；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合；
  - privileged context：教师获得学生推理时不可见的额外信息。
- 结果：
  - 任务域为视觉—语言或多模态；涉及模型/教师包括 Qwen2.5-Omni-3B、Qwen2.5-Omni-7B、Qwen2.5-Omni、GPT-4o；正文使用 accuracy、reward、F1 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>SafeSteer: Localized On-Policy Distillation for Efficient Safety Alignment</strong> <span class="entry-meta">2026-06 · EMNLP 2026</span> <a href="https://arxiv.org/abs/2606.02530">arXiv ↗</a></span> <span class="entry-tldr">安全与对齐 · 在线生成与教师查询降本</span></summary>

- 背景 / 研究问题：面向 安全与对齐 中的「在线生成与教师查询降本」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师分布与 outcome/verifier 混合信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - 对比目标：显式比较候选行为、推理模式或教师与学生响应；
  - 自教师：同一模型在不同上下文或历史条件下产生监督；
  - 表示蒸馏：在 token 概率之外匹配隐藏特征或中间状态。
- 结果：
  - 任务域为安全与对齐；涉及模型/教师包括 Qwen2.5-7B-Instruct、Qwen3-4B-Instruct-2507、Qwen3-4B-Instruct、DeepSeek-V4-Flash、DeepSeek-AI；评测覆盖 GSM8K、MATH、Math500、MMLU、HumanEval、AlpacaEval；正文使用 success rate、win rate、reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；方法效果依赖特定教师访问权限或概率信息。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Internalize the Temperature: On-Policy Self-Distillation as Policy Reheater for Reinforcement Learning</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.00755">arXiv ↗</a></span> <span class="entry-tldr">数学与通用推理 · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 数学与通用推理 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新。
- 结果：
  - 任务域为数学与通用推理；涉及模型/教师包括 Qwen3-4B-Base、Qwen3-8B-Base、Qwen3-0.6B；评测覆盖 MATH、AIME、GPQA；正文使用 accuracy、reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；方法效果依赖特定教师访问权限或概率信息。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Filter, Then Reweight: Rethinking Optimization Granularity in On-Policy Distillation</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.02684">arXiv ↗</a></span> <span class="entry-tldr">代码与形式化任务 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 代码与形式化任务 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：多教师路由或聚合信号；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合。
- 结果：
  - 任务域为代码与形式化任务；涉及模型/教师包括 Qwen3-30B-A3B-Instruct、Qwen3-4B-Non-Thinking、Qwen3-4B；评测覆盖 MATH、AIME、AMC、OlympiadBench、HumanEval、MBPP、LiveCodeBench；正文使用 pass@1、accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Behavior Cloning is Not All You Need: The Optimality of On-Policy Distillation for Noisy Expert Feedback</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.30923">arXiv ↗</a></span> <span class="entry-tldr">语言模型通用能力 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 语言模型通用能力 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师分布与 outcome/verifier 混合信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本。
- 结果：
  - 任务域为语言模型通用能力；评测覆盖 GSM8K；正文使用 accuracy、reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；证据集中于有限 benchmark，不能直接外推到开放环境。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>AsyncOPD: How Stale Can On-Policy Distillation Be?</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.24143">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 在线生成与教师查询降本</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「在线生成与教师查询降本」问题。
- 方法：
  - 状态与数据：当前策略附近的 replay/异步轨迹；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - top-k 教师分布：压缩完整 logits 的查询与存储成本；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 Qwen3-Base、Qwen3-4B-Base、Qwen3-1.7B-Base、Qwen3-8B-Base、Qwen3-30B-A3B-Instruct；评测覆盖 MATH、AMC；正文使用 accuracy、reward、throughput 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；方法效果依赖特定教师访问权限或概率信息。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Constitutional On-Policy Safe Distillation</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.03089">arXiv ↗</a></span> <span class="entry-tldr">视觉—语言或多模态 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 视觉—语言或多模态 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合；
  - privileged context：教师获得学生推理时不可见的额外信息。
- 结果：
  - 任务域为视觉—语言或多模态；涉及模型/教师包括 Qwen3-VL-4B、Qwen3-VL-4B-Instruct、Qwen2.5-VL-7B、Qwen2.5-VL-7B-Instruct、Qwen3-VL-235B-A22B、GPT-5.4；评测覆盖 MathVista、ScienceQA、VQAv2；正文使用 reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Weak Critics Make Strong Learners: On-Policy Critique Distillation for Scalable Oversight</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.00424">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合；
  - 自教师：同一模型在不同上下文或历史条件下产生监督；
  - 选择性门控：过滤不可靠教师信号或只干预关键状态；
  - 策略梯度更新：把教师或判别器信号作为密集/序列奖励。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 Qwen3-4B-base、Qwen3-1.7B-base、Phi-4-14B、Phi-4-mini-instruct；评测覆盖 GPQA、IFEval；正文使用 accuracy、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：跨任务或分布外泛化仍缺少充分验证；证据集中于有限 benchmark，不能直接外推到开放环境。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>On-Policy Representation Distillation</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.06021">arXiv ↗</a></span> <span class="entry-tldr">LM-head 概率监督会受 tokenizer、词表尾部与输出校准限制，跨架构教师尤其困难。</span></summary>

- 背景 / 研究问题：LM-head 概率监督会受 tokenizer、词表尾部与输出校准限制，跨架构教师尤其困难。
- 方法：在学生 on-policy 状态上对齐中间表示，并用投影/层匹配处理深度与宽度差异，把监督从 output distribution 移到 latent space。
- 结果：数学、科学与代码 reasoning 上比较 output-level OPD；表示对齐提高信息带宽，但要求白盒 hidden states 和额外对齐模块。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Visual-OPSD: Cross-Modal On-Policy Self-Distillation for Efficient Unified Multimodal Reasoning</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.18974">arXiv ↗</a></span> <span class="entry-tldr">视觉—语言或多模态 · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 视觉—语言或多模态 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合；
  - privileged context：教师获得学生推理时不可见的额外信息。
- 结果：
  - 任务域为视觉—语言或多模态；涉及模型/教师包括 Qwen3-VL-8B、GPT-4o、GPT-5；评测覆盖 ChartQA；正文使用 accuracy、KL divergence、latency 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；方法效果依赖特定教师访问权限或概率信息。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>ReNIO: Reweighting Negative Trajectory Importance for LLM On-Policy Distillation</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.23104">arXiv ↗</a></span> <span class="entry-tldr">代码与形式化任务 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 代码与形式化任务 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生前缀或部分 rollout；
  - 监督来源：特权上下文条件化的自教师；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 自教师：同一模型在不同上下文或历史条件下产生监督。
- 结果：
  - 任务域为代码与形式化任务；涉及模型/教师包括 Qwen3-1.7B、Qwen-7B、Qwen-1.5B、Qwen3-8B、Qwen3-4B、DeepSeek-R1-Distill-Qwen；评测覆盖 MATH、HumanEval、MBPP；正文使用 reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；证据集中于有限 benchmark，不能直接外推到开放环境。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>A Formula-Driven Survey and Research Agenda for On-Policy Distillation</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.22793">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生前缀或部分 rollout；
  - 监督来源：教师分布与 outcome/verifier 混合信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - top-k 教师分布：压缩完整 logits 的查询与存储成本；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向。
- 结果：
  - 任务域为GUI agent；正文使用 reward、throughput 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；长程、多轮状态中的误差传播与信用分配仍有限。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>ViCuR: Visual Cues as Recoverable Privilege for Multimodal On-Policy Distillation</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.05718">arXiv ↗</a></span> <span class="entry-tldr">视觉—语言或多模态 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 视觉—语言或多模态 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - privileged context：教师获得学生推理时不可见的额外信息；
  - 自教师：同一模型在不同上下文或历史条件下产生监督；
  - 表示蒸馏：在 token 概率之外匹配隐藏特征或中间状态。
- 结果：
  - 任务域为视觉—语言或多模态；涉及模型/教师包括 Qwen3-VL-2B、Qwen3-VL-2B-Instruct、Qwen3-VL-8B-Instruct、Qwen3-VL-8B、Qwen3-VL-32B、Qwen3-VL；评测覆盖 MATH、MMMU、MathVista；正文使用 accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：跨任务或分布外泛化仍缺少充分验证；方法效果依赖特定教师访问权限或概率信息。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Thinking Without Images: Internalizing Visual Manipulation with On-Policy Self-Distillation</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.08719">arXiv ↗</a></span> <span class="entry-tldr">视觉—语言或多模态 · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 视觉—语言或多模态 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合；
  - privileged context：教师获得学生推理时不可见的额外信息；
  - 自教师：同一模型在不同上下文或历史条件下产生监督；
  - 选择性门控：过滤不可靠教师信号或只干预关键状态。
- 结果：
  - 任务域为视觉—语言或多模态；涉及模型/教师包括 Qwen2.5-VL-7B、Qwen3-VL-4B、Qwen3-VL-8B、Qwen2.5-VL-32B、Qwen3-VL-30B-Thinking、Qwen3-VL-235B-A22B；正文使用 accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；质量提升可能伴随多样性下降或模式收缩。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>OmniOPD: Logit-Free On-Policy Distillation via Speculative Verification</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.01476">arXiv ↗</a></span> <span class="entry-tldr">数学与通用推理 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 数学与通用推理 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：黑盒评分、rubric 或语言反馈；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本。
- 结果：
  - 任务域为数学与通用推理；涉及模型/教师包括 Qwen3-32B、Qwen3-1.7B、Qwen3-4B、Qwen3-30B-A3B-Instruct、Qwen3-30B-A3B-Inst、Claude-4.5-Haiku；评测覆盖 MATH、AIME、AMC、OlympiadBench、CodeContests；正文使用 pass@1、accuracy、reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Seeing Before Reasoning: Decoupling Perception and Reasoning for Shortcut-Resilient Multimodal On-Policy Self-Distillation</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.19120">arXiv ↗</a></span> <span class="entry-tldr">视觉—语言或多模态 · 短 rollout / 前缀聚焦</span></summary>

- 背景 / 研究问题：面向 视觉—语言或多模态 中的「短 rollout / 前缀聚焦」问题。
- 方法：
  - 状态与数据：学生前缀或部分 rollout；
  - 监督来源：特权上下文条件化的自教师；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - privileged context：教师获得学生推理时不可见的额外信息；
  - 自教师：同一模型在不同上下文或历史条件下产生监督。
- 结果：
  - 任务域为视觉—语言或多模态；涉及模型/教师包括 Qwen2.5-VL-3B-Instruct、Qwen2.5-VL-7B-Instruct、Qwen2.5-VL；评测覆盖 MATH、MMMU、MathVista；正文使用 accuracy 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：证据集中于有限 benchmark，不能直接外推到开放环境。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>PHF: Privileged Hidden Flow for On-Policy Self-Distillation</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.29340">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：特权上下文条件化的自教师；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合；
  - privileged context：教师获得学生推理时不可见的额外信息。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 Qwen3-1.7B、Qwen3-4B、Qwen3-8B；评测覆盖 MATH、AIME；正文使用 reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨 tokenizer 或跨模型族迁移可能引入额外对齐误差。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Be My Tutor: On-Policy Co-Distillation for Mutual LLM Improvement via Peer Feedback</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.14368">arXiv ↗</a></span> <span class="entry-tldr">语言模型通用能力 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 语言模型通用能力 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - privileged context：教师获得学生推理时不可见的额外信息；
  - 自教师：同一模型在不同上下文或历史条件下产生监督；
  - 选择性门控：过滤不可靠教师信号或只干预关键状态。
- 结果：
  - 任务域为语言模型通用能力；涉及模型/教师包括 Qwen3-8B、gpt-5-mini；正文使用 F1 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；证据集中于有限 benchmark，不能直接外推到开放环境。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>DOPD: Dual On-policy Distillation</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.30626">arXiv ↗</a></span> <span class="entry-tldr">视觉—语言或多模态 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 视觉—语言或多模态 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - top-k 教师分布：压缩完整 logits 的查询与存储成本；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - privileged context：教师获得学生推理时不可见的额外信息；
  - 自教师：同一模型在不同上下文或历史条件下产生监督。
- 结果：
  - 任务域为视觉—语言或多模态；涉及模型/教师包括 Qwen3-VL、Qwen3-8B、Qwen3-1.7B、Qwen3-VL-8B、Qwen3-VL-2B、Qwen3-0.6B；评测覆盖 MATH、Math500、MMMU。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>MOPD: Multi-Teacher On-Policy Distillation for Capability Integration in LLM Post-Training</strong> <span class="entry-meta">2026-06 · arXiv</span> <a href="https://arxiv.org/abs/2606.30406">arXiv ↗</a></span> <span class="entry-tldr">语言模型通用能力 · 多教师整合与干扰控制</span></summary>

- 背景 / 研究问题：面向 语言模型通用能力 中的「多教师整合与干扰控制」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：多教师路由或聚合信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - top-k 教师分布：压缩完整 logits 的查询与存储成本；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 多教师路由：按样本、能力或状态选择和聚合专长教师。
- 结果：
  - 任务域为语言模型通用能力；涉及模型/教师包括 Qwen3-30B-A3B、Qwen3-30B-A3B-Base、Qwen3-235B-A22B；评测覆盖 MATH、SWE-bench、IFEval；正文使用 accuracy、reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：质量提升可能伴随多样性下降或模式收缩；证据集中于有限 benchmark，不能直接外推到开放环境。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Reward-Weighted On-Policy Distillation with an Open Property-Equivalence Verifier for NL-to-SVA Generation</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.13501">arXiv ↗</a></span> <span class="entry-tldr">代码与形式化任务 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 代码与形式化任务 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师分布与 outcome/verifier 混合信号；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - replay：复用历史学生轨迹，以吞吐换取一定的策略陈旧度；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本。
- 结果：
  - 任务域为代码与形式化任务；涉及模型/教师包括 Qwen2.5-Coder-7B-Instruct、Qwen2.5-Coder-7B、Qwen3-14B-derived、Qwen3-14B、GPT-5、DeepSeek-R1-671B；正文使用 pass@1、accuracy、reward、F1 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨 tokenizer 或跨模型族迁移可能引入额外对齐误差。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Are Full Rollouts Necessary for On-Policy Distillation?</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.31490">arXiv ↗</a></span> <span class="entry-tldr">数学与通用推理 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 数学与通用推理 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师分布与 outcome/verifier 混合信号；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 课程调度：按难度、置信度或训练阶段改变样本与监督配置。
- 结果：
  - 任务域为数学与通用推理；涉及模型/教师包括 DeepSeek-AI；评测覆盖 MATH；正文使用 accuracy、success rate、reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>A Recipe for Long-Context Reasoning in Large Language Models via On-Policy Optimization and Distillation</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.12227">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师分布与 outcome/verifier 混合信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合；
  - 自教师：同一模型在不同上下文或历史条件下产生监督。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 Qwen3-1.7B、Qwen3-4B、gemma-4-E2B-it；评测覆盖 GSM8K、MATH、GPQA、MMLU、MMLU-Pro、HumanEval、IFEval；正文使用 accuracy、reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Learning to Foresee: Unveiling the Unlocking Efficiency of On-Policy Distillation</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.11739">arXiv ↗</a></span> <span class="entry-tldr">数学与通用推理 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 数学与通用推理 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 表示蒸馏：在 token 概率之外匹配隐藏特征或中间状态；
  - 选择性门控：过滤不可靠教师信号或只干预关键状态。
- 结果：
  - 任务域为数学与通用推理；涉及模型/教师包括 Qwen3-4B-Non-Thinking、Qwen2.5-7B、Qwen3-4B、Qwen3-8B-Base、Qwen3-14B-Base-DAPO、Qwen3-14B-Base；评测覆盖 MATH、Math500、GPQA；正文使用 accuracy、reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>The Many Faces of On-Policy Distillation: Pitfalls, Mechanisms, and Fixes</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.11182">arXiv ↗</a></span> <span class="entry-tldr">安全与对齐 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 安全与对齐 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生前缀或部分 rollout；
  - 监督来源：特权上下文条件化的自教师；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - top-k 教师分布：压缩完整 logits 的查询与存储成本；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - privileged context：教师获得学生推理时不可见的额外信息。
- 结果：
  - 任务域为安全与对齐；涉及模型/教师包括 Qwen3-1.7B、Qwen3-8B、Qwen3-4B-Instruct、Qwen3-14B；评测覆盖 MATH、Math500、GPQA、MMLU、MMLU-Pro；正文使用 accuracy 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：质量提升可能伴随多样性下降或模式收缩；证据集中于有限 benchmark，不能直接外推到开放环境。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Uni-OPD: Unifying On-Policy Distillation with a Dual-Perspective Recipe</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.03677">arXiv ↗</a></span> <span class="entry-tldr">视觉—语言或多模态 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 视觉—语言或多模态 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：多教师路由或聚合信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合。
- 结果：
  - 任务域为视觉—语言或多模态；涉及模型/教师包括 Qwen3-4B、Qwen3-30B-A3B-Instruct、Qwen3-VL-2B-Instruct、Qwen3-VL-4B-Instruct、Qwen3-4B-RL；评测覆盖 MATH、HumanEval、MBPP、LiveCodeBench、ChartQA、DocVQA；正文使用 accuracy、reward、throughput 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>On-Policy Distillation with Best-of-N Teacher Rollout Selection</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.09725">arXiv ↗</a></span> <span class="entry-tldr">单次教师分布或单条教师路径未必代表其最佳可迁移行为，尤其在多解推理中。</span></summary>

- 背景 / 研究问题：单次教师分布或单条教师路径未必代表其最佳可迁移行为，尤其在多解推理中。
- 方法：对学生访问状态生成多条教师续写，并用 best-of-N 选择后再形成蒸馏信号，提高被模仿轨迹的结果质量。
- 结果：reasoning 基准上研究 N 与性能/成本的权衡；教师 rollout 成本随 N 增长，且选择器质量会成为新的瓶颈。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Unmasking On-Policy Distillation: Where It Helps, Where It Hurts, and Why</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.10889">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 对比目标：显式比较候选行为、推理模式或教师与学生响应；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 自教师：同一模型在不同上下文或历史条件下产生监督；
  - 多教师路由：按样本、能力或状态选择和聚合专长教师。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 Qwen3-0.6B、Qwen3-1.7B、Qwen3-32B、Qwen3-4B、Qwen3-8B、Qwen3-14B；评测覆盖 MATH、AIME、MMLU；正文使用 success rate、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Rubric-based On-policy Distillation</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.07396">arXiv ↗</a></span> <span class="entry-tldr">安全与对齐 · 无 logits 反馈构造</span></summary>

- 背景 / 研究问题：面向 安全与对齐 中的「无 logits 反馈构造」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：黑盒评分、rubric 或语言反馈；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合；
  - 多教师路由：按样本、能力或状态选择和聚合专长教师；
  - 选择性门控：过滤不可靠教师信号或只干预关键状态。
- 结果：
  - 任务域为安全与对齐；涉及模型/教师包括 Qwen3-4B、Qwen3-30B-A3B、Gemma、GPT-5.2-chat-latest、GPT-5.2；评测覆盖 MATH、AIME、GPQA、IFEval；正文使用 pass@1、accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>ADWIN: Adaptive Windows for Horizon-Aware On-Policy Distillation</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.28396">arXiv ↗</a></span> <span class="entry-tldr">安全与对齐 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 安全与对齐 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生前缀或部分 rollout；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - top-k 教师分布：压缩完整 logits 的查询与存储成本；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合；
  - 异步/near-policy：解耦生成与更新，并显式管理轨迹新鲜度。
- 结果：
  - 任务域为安全与对齐；涉及模型/教师包括 Qwen3-4B-Non-Thinking、Qwen3-1.7B-Non-Thinking、Qwen3-30B-A3B-Instruct；评测覆盖 MATH、AIME、HumanEval、MBPP、LiveCodeBench；正文使用 accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Your Teacher Can't Help You Here: Combating Supervision Fidelity Decay in On-Policy Distillation</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.30833">arXiv ↗</a></span> <span class="entry-tldr">代码与形式化任务 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 代码与形式化任务 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生前缀或部分 rollout；
  - 监督来源：教师分布与 outcome/verifier 混合信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - top-k 教师分布：压缩完整 logits 的查询与存储成本；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向。
- 结果：
  - 任务域为代码与形式化任务；涉及模型/教师包括 Qwen-1.5B、Qwen-7B、Qwen-32B、Qwen3-32B、Qwen3-1.7B、DeepSeek-R1-Distill-Qwen；评测覆盖 MATH、AIME、LiveCodeBench；正文使用 accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；方法效果依赖特定教师访问权限或概率信息。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>KL for a KL: On-Policy Distillation with Control Variate Baseline</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.07865">arXiv ↗</a></span> <span class="entry-tldr">数学与通用推理 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 数学与通用推理 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - top-k 教师分布：压缩完整 logits 的查询与存储成本；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本。
- 结果：
  - 任务域为数学与通用推理；涉及模型/教师包括 Qwen3-1.7B、Qwen3-1.7B-Base、Qwen3-4B、Qwen3-4B-Base、Qwen3-0.6B-Base、DeepSeek-V4；评测覆盖 MATH、AIME、AMC、Math500、GPQA；正文使用 accuracy、reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Extreme Region Policy Distillation</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.25582">arXiv ↗</a></span> <span class="entry-tldr">数学与通用推理 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 数学与通用推理 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 选择性门控：过滤不可靠教师信号或只干预关键状态；
  - 策略梯度更新：把教师或判别器信号作为密集/序列奖励。
- 结果：
  - 任务域为数学与通用推理；涉及模型/教师包括 Qwen3-4B-2507-Thinking、Qwen3-4B；评测覆盖 MATH、AIME、LiveCodeBench；正文使用 avg@k、accuracy、reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；质量提升可能伴随多样性下降或模式收缩。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Learning from Language Feedback via Variational Policy Distillation</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.15113">arXiv ↗</a></span> <span class="entry-tldr">语言反馈可以把编译错误、模型 critique 或同伴轨迹转化为比二元奖励更密集的监督，但固定 self-teacher 的反馈理解能力会随学生进步而触顶。</span></summary>

- 背景 / 研究问题：语言反馈可以把编译错误、模型 critique 或同伴轨迹转化为比二元奖励更密集的监督，但固定 self-teacher 的反馈理解能力会随学生进步而触顶。VPD 将教师也纳入优化，使“解释反馈”和“吸收反馈”共同演化。
- 方法：
  - 把反馈驱动的策略学习写成变分 EM：E-step 在轨迹结果约束下以自适应 trust region 改进反馈条件化教师；
  - M-step 在学生自己的 rollout 上最小化 token 级 KL，使无反馈学生吸收更新后的教师分布；
  - 支持编译器错误、contrastive sibling rollouts 和 LLM self-critique 等不同诊断来源；
  - 通过受限教师更新避免反馈解释器漂移过快。
- 结果：
  - 在 LiveCodeBench、SciKnowEval 与 Math500/AIME 等任务上使用 Qwen3、Olmo3 等模型，对比 GRPO、SDPO 及两种 SDPO+RL 混合方式；
  - LiveCodeBench pass@1 达 49.62，SciKnowEval 上 Qwen3-8B 使用 self-critique 时为 78.14，基线 SDPO 为 74.87；
  - 在刚性数学推理中，VPD 虽延缓 SDPO 坍塌，但纯 GRPO 的 Math500 仍达 83.8%，说明语言反馈蒸馏不能替代所有环境奖励；教师与学生双重更新也增加了训练复杂度。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Reducing the Safety Tax in LLM Safety Alignment with On-Policy Self-Distillation</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.15239">arXiv ↗</a></span> <span class="entry-tldr">Agent/工具交互 · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 Agent/工具交互 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：特权上下文条件化的自教师；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新。
- 结果：
  - 任务域为Agent/工具交互；涉及模型/教师包括 Qwen3-0.6B、Qwen3-1.7B、Qwen3-8B、Mistral-7B-Instruct-v0.2、DeepSeek-R1-Distill、DeepSeek-R1-Distill-Llama；评测覆盖 GSM8K、MATH、Math500、GPQA、HumanEval、MBPP；正文使用 pass@1、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>A Brief Overview: On-Policy Self-Distillation In Large Language Models</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.18141">arXiv ↗</a></span> <span class="entry-tldr">Agent/工具交互 · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 Agent/工具交互 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新。
- 结果：
  - 任务域为Agent/工具交互；涉及模型/教师包括 DeepSeek；评测覆盖 GSM8K、MATH、AIME、AMC、HumanEval、MBPP、LiveCodeBench、MMMU；正文使用 accuracy、reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Crosslingual On-Policy Self-Distillation for Multilingual Reasoning</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.09548">arXiv ↗</a></span> <span class="entry-tldr">多语言与翻译 · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 多语言与翻译 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合；
  - privileged context：教师获得学生推理时不可见的额外信息；
  - 自教师：同一模型在不同上下文或历史条件下产生监督。
- 结果：
  - 任务域为多语言与翻译；涉及模型/教师包括 Qwen3-1.7B、Qwen3-4B、Qwen3-8B、Qwen-1.7B；评测覆盖 MATH；正文使用 pass@1、accuracy、reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Self-Supervised On-Policy Distillation for Reasoning Language Models</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.17497">arXiv ↗</a></span> <span class="entry-tldr">代码与形式化任务 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 代码与形式化任务 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生前缀或部分 rollout；
  - 监督来源：教师分布与 outcome/verifier 混合信号；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合；
  - privileged context：教师获得学生推理时不可见的额外信息；
  - 自教师：同一模型在不同上下文或历史条件下产生监督；
  - 策略梯度更新：把教师或判别器信号作为密集/序列奖励。
- 结果：
  - 任务域为代码与形式化任务；涉及模型/教师包括 Qwen3-8B、Qwen3-1.7B、Qwen3-4B；评测覆盖 AIME；正文使用 accuracy、success rate、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：证据集中于有限 benchmark，不能直接外推到开放环境。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Multi-Rollout On-Policy Distillation via Peer Successes and Failures</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.12652">arXiv ↗</a></span> <span class="entry-tldr">单 rollout sampled-token OPD 方差高，也无法利用同一问题上成功与失败样本之间的相对信息。</span></summary>

- 背景 / 研究问题：单 rollout sampled-token OPD 方差高，也无法利用同一问题上成功与失败样本之间的相对信息。
- 方法：同题生成多个学生 rollout，以 peer success/failure 构造组内条件化教师和样本权重，将 outcome 对比引入 token 蒸馏。
- 结果：数学推理上报告比单 rollout OPD 更稳定；额外 rollout 提高成本，因此应与等生成预算的 GRPO/OPD 比较。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Training with Harnesses: On-Policy Harness Self-Distillation for Complex Reasoning</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.08741">arXiv ↗</a></span> <span class="entry-tldr">代码与形式化任务 · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 代码与形式化任务 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合；
  - privileged context：教师获得学生推理时不可见的额外信息。
- 结果：
  - 任务域为代码与形式化任务；涉及模型/教师包括 Qwen3-8B、GPT-4o；评测覆盖 MATH、OlympiadBench；正文使用 pass@1、accuracy、reward、F1、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Visual-Advantage On-Policy Distillation for Vision-Language Models</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.21924">arXiv ↗</a></span> <span class="entry-tldr">视觉—语言或多模态 · token/step/turn 级信用分配</span></summary>

- 背景 / 研究问题：面向 视觉—语言或多模态 中的「token/step/turn 级信用分配」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 策略梯度更新：把教师或判别器信号作为密集/序列奖励。
- 结果：
  - 任务域为视觉—语言或多模态；涉及模型/教师包括 Qwen3-VL、Qwen3-VL-8B-Instruct、Qwen3-VL-2B-Instruct、Qwen3-VL-4B、Qwen3-VL-32B、GPT-4o；评测覆盖 MATH、MMMU、MathVista；正文使用 accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Draft-OPD: On-Policy Distillation for Speculative Draft Models</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.29343">arXiv ↗</a></span> <span class="entry-tldr">语言模型通用能力 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 语言模型通用能力 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：当前策略附近的 replay/异步轨迹；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - replay：复用历史学生轨迹，以吞吐换取一定的策略陈旧度；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新。
- 结果：
  - 任务域为语言模型通用能力；涉及模型/教师包括 Qwen3-4B、Qwen3-8B、Qwen3-30B-A3B-Thinking、phi；评测覆盖 GSM8K、MATH、AIME、HumanEval、MBPP、SWE-bench、MT-Bench；正文使用 throughput 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Prefix Teach, Suffix Fade: Local Teachability Collapse in Strong-to-Weak On-Policy Distillation</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.13643">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 短 rollout / 前缀聚焦</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「短 rollout / 前缀聚焦」问题。
- 方法：
  - 状态与数据：学生前缀或部分 rollout；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 Qwen3-30B-A3B-Instruct、Qwen3-1.7B、Qwen3-1.7B-Non-Thinking、GLM-5；评测覆盖 MATH、Math500、GPQA、HumanEval、MBPP、LiveCodeBench；正文使用 accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Self-Policy Distillation via Capability-Selective Subspace Projection</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.22675">arXiv ↗</a></span> <span class="entry-tldr">Agent/工具交互 · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 Agent/工具交互 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合；
  - privileged context：教师获得学生推理时不可见的额外信息；
  - 自教师：同一模型在不同上下文或历史条件下产生监督。
- 结果：
  - 任务域为Agent/工具交互；涉及模型/教师包括 Qwen2.5-0.5B-Instruct、Qwen3-4B-Instruct、Qwen2.5-7B-Instruct、Qwen2.5-14B-Instruct、Qwen2.5-0.5B；评测覆盖 GSM8K、MATH、MMLU、MBPP、BBH；正文使用 accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>From Fact Overwriting to Knowledge Evolution: Causal Editing via On-Policy Self-Distillation</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.28303">arXiv ↗</a></span> <span class="entry-tldr">代码与形式化任务 · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 代码与形式化任务 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 自教师：同一模型在不同上下文或历史条件下产生监督；
  - 选择性门控：过滤不可靠教师信号或只干预关键状态。
- 结果：
  - 任务域为代码与形式化任务；涉及模型/教师包括 Qwen-2.5、Qwen-2.5-7B-Instruct、Qwen-2.5-7B、DeepSeek-V4-Flash、DeepSeek-AI；评测覆盖 GSM8K、MMLU、BBH；正文使用 accuracy、KL divergence、latency 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>MAIGO: Mitigating Lost-in-Conversation with History-Cleaned On-Policy Self-Distillation</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.27186">arXiv ↗</a></span> <span class="entry-tldr">语言模型通用能力 · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 语言模型通用能力 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生前缀或部分 rollout；
  - 监督来源：特权上下文条件化的自教师；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合；
  - 自教师：同一模型在不同上下文或历史条件下产生监督。
- 结果：
  - 任务域为语言模型通用能力；涉及模型/教师包括 Qwen2.5-7B-Instruct、Qwen2.5-3B-Instruct、DeepSeek-V3.1-Terminus、DeepSeek-AI；评测覆盖 GSM8K、MATH、HumanEval；正文使用 accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Respecting Self-Uncertainty in On-Policy Self-Distillation for Efficient LLM Reasoning</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.13255">arXiv ↗</a></span> <span class="entry-tldr">自教师在不同 token 上置信度差异很大，统一权重会过度信任高熵位置。</span></summary>

- 背景 / 研究问题：自教师在不同 token 上置信度差异很大，统一权重会过度信任高熵位置。
- 方法：EGRSD 合并 reward direction、师生 likelihood-ratio 与 teacher-entropy gate；CL-EGRSD 再利用因果 lookahead 区分持续与瞬时高熵段。
- 结果：Qwen3-4B/8B thinking 模式上改善所比较方法的 accuracy–length frontier；与 EOPD 的差异是对高熵信号降权，而非在高熵处补充 mode-covering FKL。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>From Generic Correlation to Input-Specific Credit in On-Policy Self Distillation</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.11613">arXiv ↗</a></span> <span class="entry-tldr">Agent/工具交互 · token/step/turn 级信用分配</span></summary>

- 背景 / 研究问题：面向 Agent/工具交互 中的「token/step/turn 级信用分配」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：特权上下文条件化的自教师；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 对比目标：显式比较候选行为、推理模式或教师与学生响应；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新。
- 结果：
  - 任务域为Agent/工具交互；涉及模型/教师包括 Qwen3-8B；评测覆盖 LiveCodeBench；正文使用 accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；长程、多轮状态中的误差传播与信用分配仍有限。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Tailoring Teaching to Aptitude: Direction-Adaptive Self-Distillation for LLM Reasoning</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.22263">arXiv ↗</a></span> <span class="entry-tldr">统一追随 privileged self-teacher 会在高熵推理分叉处过早压缩探索，但一味偏离教师又会损害低熵执行步骤的准确性。</span></summary>

- 背景 / 研究问题：统一追随 privileged self-teacher 会在高熵推理分叉处过早压缩探索，但一味偏离教师又会损害低熵执行步骤的准确性。DASD 将问题重新表述为“不同 token 应该朝哪个方向学习”，而不是只决定蒸馏权重大小。
- 方法：
  - 用学生 token entropy 区分需要探索的高熵分叉与需要稳定执行的低熵脚手架；
  - 高熵 token 远离 solution-conditioned teacher，以保留备选推理路径；低熵 token 则向教师靠拢，减少常规步骤错误；
  - 以平滑有符号路由和可靠性门控构造 token 级 advantage，并与 RLVR 更新联合；
  - 消融比较 entropy、位置、梯度和注意力等路由变量以及相反方向映射。
- 结果：
  - 在 Qwen3 1.7B/4B/8B 上覆盖六个数学基准，并补充代码、科学、工具任务和 Olmo/Llama 跨模型族测试；
  - DASD 在三个规模上均取得最高 macro Avg@16，Pass@16 分别达到 57.9、68.0、69.0；低熵位置采用 conformity 可使 step accuracy 提升 18.3%；
  - 结果支持方向自适应而非统一模仿，但阈值、熵估计和 privileged trace 质量仍会影响稳定性。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>When Are Teacher Tokens Reliable? Position-Weighted On-Policy Self-Distillation for Reasoning</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.21606">arXiv ↗</a></span> <span class="entry-tldr">数学与通用推理 · token/step/turn 级信用分配</span></summary>

- 背景 / 研究问题：面向 数学与通用推理 中的「token/step/turn 级信用分配」问题。
- 方法：
  - 状态与数据：学生前缀或部分 rollout；
  - 监督来源：特权上下文条件化的自教师；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本。
- 结果：
  - 任务域为数学与通用推理；涉及模型/教师包括 Qwen3-4B、DeepSeek-R1-Distill-Llama、DeepSeek-AI；评测覆盖 MATH、AIME；正文使用 pass@1、accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>AMR-SD: Asymmetric Meta-Reflective Self-Distillation for Token-Level Credit Assignment</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.18529">arXiv ↗</a></span> <span class="entry-tldr">传统 RLVR 把序列奖励均匀广播到全部 token，难以定位真正决定成败的推理步骤；直接用答案或完整参考轨迹条件化自教师，又可能造成答案泄漏、教师过度条件化和训练后期坍塌。</span></summary>

- 背景 / 研究问题：传统 RLVR 把序列奖励均匀广播到全部 token，难以定位真正决定成败的推理步骤；直接用答案或完整参考轨迹条件化自教师，又可能造成答案泄漏、教师过度条件化和训练后期坍塌。AMR-SD 的目标是在不破坏环境奖励的前提下，从学生自己的轨迹中提取稀疏而可信的 token 级信用。
- 方法：
  - 学生先根据成功或失败结果生成苏格拉底式 hint/critique，将诊断信息压缩为低带宽反思，而不是直接暴露标准答案；
  - 用条件化自教师与原策略的对数似然比定义 Causal Information Gain；
  - 通过非对称 ReLU 门和阈值分别放大成功轨迹中的知识缺口与失败轨迹中的过度自信 token；
  - 随训练推进退火蒸馏强度，让后期优化逐步回到环境奖励。
- 结果：
  - 在 Qwen3-8B 与 Qwen2.5-7B-Instruct 上评测科学推理、ToolAlpaca 及 AIME/AMC/HMMT，并与 GRPO、SDPO、RLSD 比较；
  - 数学组平均分为 62.7，分别高于 GRPO 的 60.3 和 RLSD 的 57.2；用原始答案替代自生成反思时，综合科学任务由 74.3 降至 70.5；
  - 方法依赖模型自身反思质量，弱模型或非 thinking 模式下优势会消失；额外反思生成使报告训练时长由约 18 小时增至 22 小时。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>ROSD: Reflective On-Policy Self-Distillation for Language Model Reasoning across Domains</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.28014">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生前缀或部分 rollout；
  - 监督来源：特权上下文条件化的自教师；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 对比目标：显式比较候选行为、推理模式或教师与学生响应；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 Qwen3-4B、Qwen3-8B；正文使用 accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Vision-OPD: Learning to See Fine Details for Multimodal LLMs via On-Policy Self-Distillation</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.18740">arXiv ↗</a></span> <span class="entry-tldr">视觉—语言或多模态 · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 视觉—语言或多模态 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：特权上下文条件化的自教师；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - top-k 教师分布：压缩完整 logits 的查询与存储成本；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本。
- 结果：
  - 任务域为视觉—语言或多模态；涉及模型/教师包括 Qwen3-VL-Instruct、GPT-5.2、GPT-5.4、GLM-4.6V；正文使用 accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Post-Training is About States, Not Tokens: A State Distribution View of SFT, RL, and On-Policy Distillation</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.22731">arXiv ↗</a></span> <span class="entry-tldr">语言模型通用能力 · token/step/turn 级信用分配</span></summary>

- 背景 / 研究问题：面向 语言模型通用能力 中的「token/step/turn 级信用分配」问题。
- 方法：
  - 状态与数据：学生前缀或部分 rollout；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 表示蒸馏：在 token 概率之外匹配隐藏特征或中间状态。
- 结果：
  - 任务域为语言模型通用能力；涉及模型/教师包括 Qwen3-0.6B-Base；评测覆盖 GSM8K、MMLU、TruthfulQA；正文使用 reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；证据集中于有限 benchmark，不能直接外推到开放环境。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Teacher-Guided Policy Optimization for On-Policy Reasoning Distillation under Large Policy Divergence</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.13230">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：教师分布与 outcome/verifier 混合信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合；
  - 跨 tokenizer 对齐：在 byte、span 或共享表示空间中传递信号。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 Qwen2.5-Math-1.5B、Qwen2.5-Mat、Qwen2.5-Math-7B、Qwen3-30B-A3B、Qwen-32B、Qwen3-30B-A3B-generated；评测覆盖 MATH、AMC、OlympiadBench、Math500、GPQA、MMLU、MMLU-Pro、ARC；正文使用 pass@1、accuracy、reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>GAPD: Gold-Action Policy Distillation for Agentic Reinforcement Learning in Knowledge Base Question Answering</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.29584">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：教师分布与 outcome/verifier 混合信号；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合；
  - 自教师：同一模型在不同上下文或历史条件下产生监督；
  - 策略梯度更新：把教师或判别器信号作为密集/序列奖励。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 Qwen3-32B、Qwen3-14B、gpt-5.3-codex、Claude、GLM-5；正文使用 accuracy、exact match、reward、F1 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>MAD-OPD: Breaking the Ceiling in On-Policy Distillation via Multi-Agent Debate</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.01347">arXiv ↗</a></span> <span class="entry-tldr">Agent/工具交互 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 Agent/工具交互 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：多教师路由或聚合信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新。
- 结果：
  - 任务域为Agent/工具交互；涉及模型/教师包括 Qwen3-30B-A3B-Instruct、Qwen3-14B；评测覆盖 MATH、MBPP、LiveCodeBench；正文使用 pass@1、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Cornerstones or Stumbling Blocks? Deciphering the Rock Tokens in On-Policy Distillation</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.09253">arXiv ↗</a></span> <span class="entry-tldr">安全与对齐 · token/step/turn 级信用分配</span></summary>

- 背景 / 研究问题：面向 安全与对齐 中的「token/step/turn 级信用分配」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师分布与 outcome/verifier 混合信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 自教师：同一模型在不同上下文或历史条件下产生监督。
- 结果：
  - 任务域为安全与对齐；涉及模型/教师包括 Qwen3-4B-Instruct、Qwen3-30B-A3B-Instruct、Qwen3-4B-Instruct-2507、Qwen-3、DeepSeek-V4；评测覆盖 MATH、AIME、IFEval；正文使用 pass@1、accuracy、reward、F1、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨 tokenizer 或跨模型族迁移可能引入额外对齐误差。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Learn where to Click from Yourself: On-Policy Self-Distillation for GUI Grounding</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.00642">arXiv ↗</a></span> <span class="entry-tldr">视觉—语言或多模态 · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 视觉—语言或多模态 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：特权上下文条件化的自教师；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合；
  - privileged context：教师获得学生推理时不可见的额外信息。
- 结果：
  - 任务域为视觉—语言或多模态；涉及模型/教师包括 Qwen3-VL-Instruct-8B、Qwen3-VL-235B、Qwen3-VL、Qwen3-VL-8B；评测覆盖 MMBench、OSWorld；正文使用 accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>SD-Search: On-Policy Hindsight Self-Distillation for Search-Augmented Reasoning</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.18299">arXiv ↗</a></span> <span class="entry-tldr">Agent/工具交互 · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 Agent/工具交互 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：特权上下文条件化的自教师；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本。
- 结果：
  - 任务域为Agent/工具交互；涉及模型/教师包括 Qwen2.5-3B、Qwen2.5-7B、Qwen2.5-3B-Base、Qwen2.5-72B、GPT-4o-generated、GPT-4o；评测覆盖 HotpotQA；正文使用 accuracy、exact match、success rate、reward、F1 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；方法效果依赖特定教师访问权限或概率信息。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Trust-Region Behavior Blending for On-Policy Distillation</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.31159">arXiv ↗</a></span> <span class="entry-tldr">训练初期学生 rollout 很差，使教师被迫在低质量前缀上监督；直接切到教师 rollout 又失去 on-policy 性。</span></summary>

- 背景 / 研究问题：训练初期学生 rollout 很差，使教师被迫在低质量前缀上监督；直接切到教师 rollout 又失去 on-policy 性。
- 方法：在以学生为中心的 KL trust region 内求最接近教师的 behavior policy，并将 KL budget 退火到零，最终回到纯学生 rollout。
- 结果：两个数学蒸馏设置中取得所比较方法最强平均值；它改变的是 rollout policy，区别于 TrOPD 对损失 outlier 的信任区处理。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>$\boldsymbol{f}$-OPD: Stabilizing Long-Horizon On-Policy Distillation with Freshness-Aware Control</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.17862">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - replay：复用历史学生轨迹，以吞吐换取一定的策略陈旧度；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 异步/near-policy：解耦生成与更新，并显式管理轨迹新鲜度。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 Qwen3-8B、Qwen2.5-Math-7B-Instruct、Qwen2.5-Math-72B-Instruct、Qwen3-Coder-30B-A3B；评测覆盖 MATH、Math500、SWE-bench、WebArena；正文使用 accuracy、reward、latency、throughput 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；长程、多轮状态中的误差传播与信用分配仍有限。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Same Evidence, Different Answers: Canonical-Context On-Policy Distillation for Multi-Turn Language Models</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.30251">arXiv ↗</a></span> <span class="entry-tldr">数学与通用推理 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 数学与通用推理 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - privileged context：教师获得学生推理时不可见的额外信息；
  - 选择性门控：过滤不可靠教师信号或只干预关键状态。
- 结果：
  - 任务域为数学与通用推理；涉及模型/教师包括 Qwen3-8B、Qwen3-4B、Qwen3-8B-CCOPD、Llama3.1-8B、gpt-4o-mini；评测覆盖 GSM8K、MATH、HumanEval、LiveCodeBench、HotpotQA；正文使用 accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>EDGE-OPD: Internalizing Privileged Context with Evidence Guided On-Policy Distillation</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.23493">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本。
- 结果：
  - 任务域为GUI agent；评测覆盖 MATH、AIME；正文使用 pass@1、accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>TRACE: Distilling Where It Matters via Token-Routed Self On-Policy Alignment</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.10194">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · token/step/turn 级信用分配</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「token/step/turn 级信用分配」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 Qwen3-8B、Qwen3-1.7B、Qwen3-32B；评测覆盖 MATH、AIME、AMC、GPQA；正文使用 avg@k、accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Counteraction-Aware Multi-Teacher On-Policy Distillation for General Capability Recovery with Domain Preservation</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.27115">arXiv ↗</a></span> <span class="entry-tldr">医疗 · 多教师整合与干扰控制</span></summary>

- 背景 / 研究问题：面向 医疗 中的「多教师整合与干扰控制」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：多教师路由或聚合信号；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - replay：复用历史学生轨迹，以吞吐换取一定的策略陈旧度；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 多教师路由：按样本、能力或状态选择和聚合专长教师。
- 结果：
  - 任务域为医疗；涉及模型/教师包括 Qwen3-4B-Instruct-2507、Qwen3-8B；评测覆盖 MATH、GPQA、LiveCodeBench、Arena-Hard；正文使用 accuracy、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Asymmetric On-Policy Distillation: Bridging Exploitation and Imitation at the Token Level</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.06387">arXiv ↗</a></span> <span class="entry-tldr">单一 KL 方向无法同时兼顾 sampled-token exploitation 与 full-distribution imitation。</span></summary>

- 背景 / 研究问题：单一 KL 方向无法同时兼顾 sampled-token exploitation 与 full-distribution imitation。
- 方法：对不同 token 区域非对称组合 policy-gradient 与 forward-KL 信号，在低成本采样和教师分布覆盖间折中。
- 结果：Qwen3 多师生规模、AIME/HMMT 数学基准上比较标准 OPD 与自适应目标；需要 top-k/full-logit 访问，不能直接用于 API 黑盒教师。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>The Extrapolation Cliff in On-Policy Distillation of Near-Deterministic Structured Outputs</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.08737">arXiv ↗</a></span> <span class="entry-tldr">安全与对齐 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 安全与对齐 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：黑盒评分、rubric 或语言反馈；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本。
- 结果：
  - 任务域为安全与对齐；涉及模型/教师包括 Qwen3-1.7B、Qwen3-4B；评测覆盖 GSM8K、MBPP；正文使用 reward、latency 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；质量提升可能伴随多样性下降或模式收缩。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>CollectionLoRA: Collecting 50 Effects in 1 LoRA via Multi-Teacher On-Policy Distillation</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.25378">arXiv ↗</a></span> <span class="entry-tldr">视觉—语言或多模态 · 多教师整合与干扰控制</span></summary>

- 背景 / 研究问题：面向 视觉—语言或多模态 中的「多教师整合与干扰控制」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：多教师路由或聚合信号；
  - 多教师路由：按样本、能力或状态选择和聚合专长教师；
  - 表示蒸馏：在 token 概率之外匹配隐藏特征或中间状态；
  - 选择性门控：过滤不可靠教师信号或只干预关键状态。
- 结果：
  - 任务域为视觉—语言或多模态；涉及模型/教师包括 Qwen-Applications、Qwen-Image、Qwen-Image-Edit-2509、Qwen-Image-Edit-Lightning、Qwen-VL-Max-Latest；正文使用 accuracy、reward、latency 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>SimCT: Recovering Lost Supervision for Cross-Tokenizer On-Policy Distillation</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.07711">arXiv ↗</a></span> <span class="entry-tldr">Agent/工具交互 · 跨模型族监督对齐</span></summary>

- 背景 / 研究问题：面向 Agent/工具交互 中的「跨模型族监督对齐」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合；
  - 跨 tokenizer 对齐：在 byte、span 或共享表示空间中传递信号；
  - 选择性门控：过滤不可靠教师信号或只干预关键状态。
- 结果：
  - 任务域为Agent/工具交互；涉及模型/教师包括 Qwen2.5-7B-Instruct、Gemma-2-2B-IT、Gemma、Phi-4-mini-Instruct、Phi、Phi-4-mini；评测覆盖 GSM8K、MATH、MBPP、LiveCodeBench、CodeContests；正文使用 pass@1 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Step-wise On-policy Distillation for Small Language Model Agents</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.07725">arXiv ↗</a></span> <span class="entry-tldr">多步 agent 的关键决策跨越工具调用和环境转移，整段 token KL 难以定位是哪一步需要教师纠正。</span></summary>

- 背景 / 研究问题：多步 agent 的关键决策跨越工具调用和环境转移，整段 token KL 难以定位是哪一步需要教师纠正。
- 方法：按 agent step 聚合并路由 on-policy 教师信号，对不同决策步选择性蒸馏。
- 结果：小语言模型 agent 任务上比较 trajectory-level 与 step-wise 监督；环境反馈和教师策略共同影响结果，不能直接外推到纯文本 CoT。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Prune-OPD: Efficient and Reliable On-Policy Distillation for Long-Horizon Reasoning</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.07804">arXiv ↗</a></span> <span class="entry-tldr">长轨迹中大量 token 信号弱或教师已失去可靠性，全量回传既贵又会积累错误监督。</span></summary>

- 背景 / 研究问题：长轨迹中大量 token 信号弱或教师已失去可靠性，全量回传既贵又会积累错误监督。
- 方法：根据 token/段的可靠性和信息量裁剪蒸馏位置，把教师计算与更新集中在有效区域。
- 结果：长链数学推理上报告效率与可靠性同步改善；pruning 规则可能遗漏延迟信用，需要与 prefix-only 和 position weighting 区分评测。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>OGLS-SD: On-Policy Self-Distillation with Outcome-Guided Logit Steering for LLM Reasoning</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.12400">arXiv ↗</a></span> <span class="entry-tldr">privileged teacher 仍可能在错误轨迹上给出方向含混的分布，单纯 KL 会把不可靠 token 一并学习。</span></summary>

- 背景 / 研究问题：privileged teacher 仍可能在错误轨迹上给出方向含混的分布，单纯 KL 会把不可靠 token 一并学习。
- 方法：用 outcome 信号决定 logit steering 的方向和强度，再将被引导的自教师分布蒸馏到当前策略，实现结果级与 token 级监督结合。
- 结果：数学推理上与 GRPO、OPSD 类方法比较并报告效率—准确率收益；依赖可用 outcome evaluator，严格说是 verifier-guided self-distillation。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>SODA: Semi On-Policy Black-Box Distillation for Large Language Models</strong> <span class="entry-meta">2026-04 · COLM 2026 Workshop</span> <a href="https://arxiv.org/abs/2604.03873">arXiv ↗</a></span> <span class="entry-tldr">安全与对齐 · 无 logits 反馈构造</span></summary>

- 背景 / 研究问题：面向 安全与对齐 中的「无 logits 反馈构造」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：黑盒评分、rubric 或语言反馈；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 对比目标：显式比较候选行为、推理模式或教师与学生响应；
  - 表示蒸馏：在 token 概率之外匹配隐藏特征或中间状态。
- 结果：
  - 任务域为安全与对齐；涉及模型/教师包括 Qwen2.5-7B-Instruct、Qwen2.5-3B、GPT-5、GPT-5-Chat、GPT-4o、GPT-4o-mini；评测覆盖 LMSYS；正文使用 reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>DP-OPD: Differentially Private On-Policy Distillation for Language Models</strong> <span class="entry-meta">2026-04 · arXiv</span> <a href="https://arxiv.org/abs/2604.04461">arXiv ↗</a></span> <span class="entry-tldr">代码与形式化任务 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 代码与形式化任务 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本。
- 结果：
  - 任务域为代码与形式化任务；涉及模型/教师包括 GPT-2；正文使用 perplexity 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>TIP: Token Importance in On-Policy Distillation</strong> <span class="entry-meta">2026-04 · arXiv</span> <a href="https://arxiv.org/abs/2604.14084">arXiv ↗</a></span> <span class="entry-tldr">Agent/工具交互 · token/step/turn 级信用分配</span></summary>

- 背景 / 研究问题：面向 Agent/工具交互 中的「token/step/turn 级信用分配」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 选择性门控：过滤不可靠教师信号或只干预关键状态。
- 结果：
  - 任务域为Agent/工具交互；涉及模型/教师包括 Qwen3-8B、Qwen3-4B、Qwen2.5-14B-Instruct-thinking、Qwen2.5-1.5B-Instruct、Qwen3-1.7B、Qwen2-7B；评测覆盖 MATH、AIME；正文使用 reward、ROUGE-L 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；长程、多轮状态中的误差传播与信用分配仍有限。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>The Illusion of Certainty: Decoupling Capability and Calibration in On-Policy Distillation</strong> <span class="entry-meta">2026-04 · arXiv</span> <a href="https://arxiv.org/abs/2604.16830">arXiv ↗</a></span> <span class="entry-tldr">Agent/工具交互 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 Agent/工具交互 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - replay：复用历史学生轨迹，以吞吐换取一定的策略陈旧度；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合。
- 结果：
  - 任务域为Agent/工具交互；涉及模型/教师包括 Qwen3-8B；正文使用 accuracy、success rate、reward、KL divergence、latency 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>TCOD: Exploring Temporal Curriculum in On-Policy Distillation for Multi-turn Autonomous Agents</strong> <span class="entry-meta">2026-04 · arXiv</span> <a href="https://arxiv.org/abs/2604.24005">arXiv ↗</a></span> <span class="entry-tldr">Agent/工具交互 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 Agent/工具交互 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - replay：复用历史学生轨迹，以吞吐换取一定的策略陈旧度；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 异步/near-policy：解耦生成与更新，并显式管理轨迹新鲜度；
  - 课程调度：按难度、置信度或训练阶段改变样本与监督配置。
- 结果：
  - 任务域为Agent/工具交互；涉及模型/教师包括 Qwen2.5-3B、Qwen2.5-7B、Qwen3-1.7B、Qwen3-4B、Qwen3-30B-A3B-Instruct、phi；正文使用 pass@1、success rate、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Efficient Rationale-based Retrieval: On-policy Distillation from Generative Rerankers based on JEPA</strong> <span class="entry-meta">2026-04 · ICMR 2026</span> <a href="https://arxiv.org/abs/2604.23336">arXiv ↗</a></span> <span class="entry-tldr">代码与形式化任务 · 在线生成与教师查询降本</span></summary>

- 背景 / 研究问题：面向 代码与形式化任务 中的「在线生成与教师查询降本」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 对比目标：显式比较候选行为、推理模式或教师与学生响应。
- 结果：
  - 任务域为代码与形式化任务；涉及模型/教师包括 Qwen2-7B-Instruct、Qwen2-70B-Instruct、Mistral；正文使用 accuracy、latency 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Lightning OPD: Efficient Post-Training for Large Reasoning Models with Offline On-Policy Distillation</strong> <span class="entry-meta">2026-04 · arXiv</span> <a href="https://arxiv.org/abs/2604.13010">arXiv ↗</a></span> <span class="entry-tldr">在线教师服务与学生更新耦合，造成吞吐和系统复杂度瓶颈。</span></summary>

- 背景 / 研究问题：在线教师服务与学生更新耦合，造成吞吐和系统复杂度瓶颈。
- 方法：在同一教师生成的 SFT 轨迹上预缓存 teacher log-probs，再离线优化；论文在 teacher consistency 假设下讨论与在线 OPD 的最优点和梯度差异。
- 结果：数学与代码上报告约 4× 训练效率并优于 ExOPD 基线；它是“离线近似 OPD”，不是严格 current-student rollout，报告中因此单列而不与纯 OPD 混同。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Rethinking On-Policy Distillation of Large Language Models: Phenomenology, Mechanism, and Recipe</strong> <span class="entry-meta">2026-04 · ICML 2026 Workshop</span> <a href="https://arxiv.org/abs/2604.13016">arXiv ↗</a></span> <span class="entry-tldr">更强教师有时完全不能改进学生。</span></summary>

- 背景 / 研究问题：更强教师有时完全不能改进学生。论文区分教师绝对得分、与学生的 thinking-pattern compatibility，以及教师是否包含学生未见过的可学习信息。
- 方法：
  - 用 student/teacher top-k overlap、overlap mass、entropy gap 与 token advantage 描述成功动力学；
  - 失败时先用教师轨迹 SFT 做 off-policy cold start；
  - 选择与教师 post-training 一致的 prompt/template，提高学生访问状态与教师偏好的重叠。
- 结果：
  - 以 Qwen3/DeepSeek-distill/JustRL 等数学模型做正反向教师实验；
  - 成功训练中 top-token overlap 从 72% 升至 91%，共享 token 集承载 97%–99% 概率质量；
  - 所有主实验均为数学，跨领域、预训练数据差异与长轨迹 reward degradation 尚未解决。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Beyond SFT-to-RL: Pre-alignment via Black-Box On-Policy Distillation for Multimodal RL</strong> <span class="entry-meta">2026-04 · arXiv</span> <a href="https://arxiv.org/abs/2604.28123">arXiv ↗</a></span> <span class="entry-tldr">视觉—语言或多模态 · 无 logits 反馈构造</span></summary>

- 背景 / 研究问题：面向 视觉—语言或多模态 中的「无 logits 反馈构造」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：黑盒评分、rubric 或语言反馈；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合；
  - 异步/near-policy：解耦生成与更新，并显式管理轨迹新鲜度；
  - 选择性门控：过滤不可靠教师信号或只干预关键状态；
  - 策略梯度更新：把教师或判别器信号作为密集/序列奖励。
- 结果：
  - 任务域为视觉—语言或多模态；涉及模型/教师包括 Qwen3-VL、Qwen3-VL-4B、Qwen3-VL-8B、Qwen3-VL-MoE、Qwen3-VL-2B、Qwen3-30B-A3B-Instruct；评测覆盖 MMMU、MathVista；正文使用 accuracy、reward、throughput 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；方法效果依赖特定教师访问权限或概率信息。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Hybrid Policy Distillation for LLMs</strong> <span class="entry-meta">2026-04 · ICML 2026</span> <a href="https://arxiv.org/abs/2604.20244">arXiv ↗</a></span> <span class="entry-tldr">代码与形式化任务 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 代码与形式化任务 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - top-k 教师分布：压缩完整 logits 的查询与存储成本；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向。
- 结果：
  - 任务域为代码与形式化任务；涉及模型/教师包括 Qwen2.5-Coder、Qwen-Coder、Qwen2.5-7B、Qwen2.5-1.5B、Qwen3-30B-A3B、Qwen3-0.6B；评测覆盖 MATH、AIME、AMC、GPQA、HumanEval、MBPP、Arena-Hard、MT-Bench；正文使用 pass@1、reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>A Survey of On-Policy Distillation for Large Language Models</strong> <span class="entry-meta">2026-04 · arXiv</span> <a href="https://arxiv.org/abs/2604.00626">arXiv ↗</a></span> <span class="entry-tldr">GUI agent · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 GUI agent 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生前缀或部分 rollout；
  - 监督来源：教师分布与 outcome/verifier 混合信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - JSD/广义散度：在 mode-seeking 与 mode-covering 之间调节；
  - top-k 教师分布：压缩完整 logits 的查询与存储成本；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向。
- 结果：
  - 任务域为GUI agent；涉及模型/教师包括 Qwen3-4B、Qwen3-8B、Qwen-7B、Qwen-32B、Qwen2.5-32B-Base、DeepSeek-R1；评测覆盖 AIME、WMT；正文使用 pass@1、accuracy、reward、perplexity 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>OPSDL: On-Policy Self-Distillation for Long-Context Language Models</strong> <span class="entry-meta">2026-04 · arXiv</span> <a href="https://arxiv.org/abs/2604.17535">arXiv ↗</a></span> <span class="entry-tldr">语言模型通用能力 · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 语言模型通用能力 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合；
  - privileged context：教师获得学生推理时不可见的额外信息；
  - 自教师：同一模型在不同上下文或历史条件下产生监督。
- 结果：
  - 任务域为语言模型通用能力；涉及模型/教师包括 Qwen2.5-7B、Qwen2.5-7B-Instruct-1M、Qwen2.5-7B-Instruct、Qwen2.5-14B-Instruct、Qwen2.5-14B-Instruct-1M、Qwen2.5-32B-Instruct；评测覆盖 MMLU、MT-Bench、ARC、HellaSwag；正文使用 reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>SCOPE: Signal-Calibrated On-Policy Distillation Enhancement with Dual-Path Adaptive Weighting</strong> <span class="entry-meta">2026-04 · arXiv</span> <a href="https://arxiv.org/abs/2604.10688">arXiv ↗</a></span> <span class="entry-tldr">学生错误前缀上的教师分布可能不可靠，且单一 entropy 或 divergence 规则无法覆盖不同错误类型。</span></summary>

- 背景 / 研究问题：学生错误前缀上的教师分布可能不可靠，且单一 entropy 或 divergence 规则无法覆盖不同错误类型。
- 方法：以师生信号质量校准为核心，在样本/轨迹与 token 两条路径做自适应 weighting，过滤低价值监督并保留高分歧纠错位置。
- 结果：reasoning 设置中报告相对无权重 OPD 的稳定改进；新增统计量与阈值使跨数据集迁移和计算口径需要独立消融。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>CRISP: Compressed Reasoning via Iterative Self-Policy Distillation</strong> <span class="entry-meta">2026-03 · arXiv</span> <a href="https://arxiv.org/abs/2603.05433">arXiv ↗</a></span> <span class="entry-tldr">代码与形式化任务 · 自教师（信息不对称）</span></summary>

- 背景 / 研究问题：面向 代码与形式化任务 中的「自教师（信息不对称）」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本。
- 结果：
  - 任务域为代码与形式化任务；涉及模型/教师包括 Qwen3-14B、Qwen3-8B、DeepSeek-R1-Distill-Llama、DeepSeek；评测覆盖 MATH、AIME、GPQA、MMLU；正文使用 accuracy、reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>PACED: Distillation and On-Policy Self-Distillation at the Frontier of Student Competence</strong> <span class="entry-meta">2026-03 · arXiv</span> <a href="https://arxiv.org/abs/2603.11178">arXiv ↗</a></span> <span class="entry-tldr">已掌握和几乎不可能解出的题都会使跨题梯度 SNR 下降，均匀采样浪费 rollout 与教师预算。</span></summary>

- 背景 / 研究问题：已掌握和几乎不可能解出的题都会使跨题梯度 SNR 下降，均匀采样浪费 rollout 与教师预算。
- 方法：依据学生经验 pass rate 以 $p(1-p)$ 加权问题，并推广为 Beta-kernel curriculum，把训练集中到能力前沿。
- 结果：Qwen3/Qwen2.5/Llama-3、MATH-500 与 AIME 上相对均匀蒸馏最高 +8.2 points；需要持续估计题目难度，且 pass-rate estimator 本身耗费样本。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Surgical Post-Training: Proximal On-Policy Distillation for Reasoning with Knowledge Retention</strong> <span class="entry-meta">2026-03 · arXiv</span> <a href="https://arxiv.org/abs/2603.01683">arXiv ↗</a></span> <span class="entry-tldr">视觉—语言或多模态 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 视觉—语言或多模态 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师分布与 outcome/verifier 混合信号；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 对比目标：显式比较候选行为、推理模式或教师与学生响应；
  - 选择性门控：过滤不可靠教师信号或只干预关键状态；
  - 策略梯度更新：把教师或判别器信号作为密集/序列奖励。
- 结果：
  - 任务域为视觉—语言或多模态；涉及模型/教师包括 Qwen3-8B、Qwen3-1.7B、Llama3.1-8B-Instruct；评测覆盖 MATH、Math500、GPQA、MMLU、MMLU-Pro、IFEval、TruthfulQA；正文使用 accuracy、reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Revisiting On-Policy Distillation: Empirical Failure Modes and Simple Fixes</strong> <span class="entry-meta">2026-03 · arXiv</span> <a href="https://arxiv.org/abs/2603.25562">arXiv ↗</a></span> <span class="entry-tldr">sampled-token OPD 把分布匹配压缩为单 token 信号；长 rollout 的前缀漂移、特殊 token 和 tokenizer 差异会进一步破坏教师反馈。</span></summary>

- 背景 / 研究问题：sampled-token OPD 把分布匹配压缩为单 token 信号；长 rollout 的前缀漂移、特殊 token 和 tokenizer 差异会进一步破坏教师反馈。
- 方法：
  - 在每个学生前缀上选择教师 top-K support；
  - 在 support 内重新归一化教师与学生分布并计算截断 reverse KL；
  - 配合 top-p rollout 与 special-token masking，减少单 token 依赖和异常 token 影响。
- 结果：
  - Qwen2.5-7B-Instruct 学生、OpenThinker3-7B 教师，单任务数学和 ALFWorld+数学交替训练；
  - 单任务五项数学平均分从 sampled-token OPD 的 36.4 提升到 41.7（无 mask），多任务数学平均从 34.8 提升到 41.7；
  - 截断 support 引入相对 full-vocabulary reverse KL 的偏差，且 rollout top-p 与训练引擎间仍可能存在 mismatch。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Nemotron-Cascade 2: Post-Training LLMs with Cascade RL and Multi-Domain On-Policy Distillation</strong> <span class="entry-meta">2026-03 · arXiv</span> <a href="https://arxiv.org/abs/2603.19220">arXiv ↗</a></span> <span class="entry-tldr">单一联合 RL 难以把数学、代码、科学等领域专家的增益合并到小激活参数 MoE 模型。</span></summary>

- 背景 / 研究问题：单一联合 RL 难以把数学、代码、科学等领域专家的增益合并到小激活参数 MoE 模型。
- 方法：先训练领域 RL/SFT teachers，再用多域 OPD 逐阶段合并，作为 cascade post-training 的组成部分。
- 结果：30B/3B-active MoE 在竞赛数学与代码评测中验证；这是系统级采用证据，无法从整套 pipeline 中完全分离 OPD 的独立贡献。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Scaling Reasoning Efficiently via Relaxed On-Policy Distillation</strong> <span class="entry-meta">2026-03 · arXiv</span> <a href="https://arxiv.org/abs/2603.11137">arXiv ↗</a></span> <span class="entry-tldr">视觉—语言或多模态 · 在线生成与教师查询降本</span></summary>

- 背景 / 研究问题：面向 视觉—语言或多模态 中的「在线生成与教师查询降本」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：教师分布与 outcome/verifier 混合信号；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 选择性门控：过滤不可靠教师信号或只干预关键状态；
  - 策略梯度更新：把教师或判别器信号作为密集/序列奖励。
- 结果：
  - 任务域为视觉—语言或多模态；涉及模型/教师包括 Qwen-1.5B、Qwen-7B、Qwen2.5-VL-3、Qwen2.5-VL-32B-Instruct、Qwen2.5-VL-32B、Qwen2.5-VL-7B-Instruct；评测覆盖 MATH、AIME、AMC、MathVista；正文使用 pass@1、accuracy、reward、latency 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Entropy-Aware On-Policy Distillation of Language Models</strong> <span class="entry-meta">2026-03 · ICML 2026</span> <a href="https://arxiv.org/abs/2603.07079">arXiv ↗</a></span> <span class="entry-tldr">标准 reverse-KL OPD 在教师高熵决策点上倾向 mode seeking，可能丢失多个合理续写并产生不稳定更新。</span></summary>

- 背景 / 研究问题：标准 reverse-KL OPD 在教师高熵决策点上倾向 mode seeking，可能丢失多个合理续写并产生不稳定更新。论文测得教师高熵 token 占 18.5%，蒸馏学生仅保留 6.8%。
- 方法：
  - 保留 clipped sampled-token reverse KL；
  - 当教师 token entropy 超过阈值时加入 forward KL；
  - forward KL 只在教师 top-k（实验取 k=16）上归一化计算，降低完整词表代价。
- 结果：
  - Qwen3-0.6B/1.7B/4B 学生、Qwen3-8B 教师，在六个数学基准报告 Avg@8/Pass@8；
  - 相对 OPD，Pass@8 平均提高 +1.37、+2.39、+5.05 points；
  - 证据支持“高熵位置需 mode-covering”，但仍需额外 top-k 教师分布与熵查询，且 benchmark 集中于数学推理。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Video-OPD: Efficient Post-Training of Multimodal Large Language Models for Temporal Video Grounding via On-Policy Distillation</strong> <span class="entry-meta">2026-02 · arXiv</span> <a href="https://arxiv.org/abs/2602.02994">arXiv ↗</a></span> <span class="entry-tldr">视频理解/生成 · 在线生成与教师查询降本</span></summary>

- 背景 / 研究问题：面向 视频理解/生成 中的「在线生成与教师查询降本」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师分布与 outcome/verifier 混合信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 课程调度：按难度、置信度或训练阶段改变样本与监督配置；
  - 选择性门控：过滤不可靠教师信号或只干预关键状态。
- 结果：
  - 任务域为视频理解/生成；涉及模型/教师包括 Qwen3-VL-8B-Instruct、Qwen3-VL-32B、Qwen3-VL-4B-Instruct；正文使用 accuracy、reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>On-Policy Context Distillation for Language Models</strong> <span class="entry-meta">2026-02 · arXiv</span> <a href="https://arxiv.org/abs/2602.12275">arXiv ↗</a></span> <span class="entry-tldr">context distillation 通常在固定数据上内化提示或经验，仍有 train–inference 状态失配。</span></summary>

- 背景 / 研究问题：context distillation 通常在固定数据上内化提示或经验，仍有 train–inference 状态失配。
- 方法：学生生成轨迹；带历史经验或优化 system prompt 的 context-conditioned teacher 在相同前缀上提供 reverse-KL 目标；支持同模与跨规模设置。
- 结果：数学、文本游戏与领域任务上优于固定 context-distillation 基线，同时更好保持 OOD 能力；其“知识”来自上下文资源，不能与无外部信息的自提升混称。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Privileged Information Distillation for Language Models</strong> <span class="entry-meta">2026-02 · ICLR 2026 Workshop</span> <a href="https://arxiv.org/abs/2602.04942">arXiv ↗</a></span> <span class="entry-tldr">多轮工具 Agent 的前沿教师常只暴露动作、不公开完整思维链，传统 SFT 因而缺少关键的过程监督。</span></summary>

- 背景 / 研究问题：多轮工具 Agent 的前沿教师常只暴露动作、不公开完整思维链，传统 SFT 因而缺少关键的过程监督。论文把成功轨迹转成训练时 privileged information，研究如何让推理时看不到这些信息的学生仍能获得教师的策略能力。
- 方法：
  - π-Distill 让 PI-conditioned teacher 与 unconditioned student 共享参数并联合优化：教师先学习利用 PI，学生再从教师生成的轨迹中吸收能力，以缓解先训教师再离线蒸馏造成的状态分布偏移；
  - OPSD 从学生当前策略采样，并在 GRPO 奖励上加入学生相对 PI 教师的 reverse-KL 惩罚；
  - 比较工具调用、带参数工具调用和自生成提示三种信息密度不同的 PI，分析 PI utility、师生 KL 与训练塌缩之间的关系。
- 结果：在 Travel Planner、τ-Bench Retail 上训练，并在 τ-Bench Airline 与 7 个 GEM 工具任务上检验 OOD；覆盖 Qwen3-4B、Qwen3-8B 和 R1-Distill-Llama-8B。Qwen3-8B 的 π-Distill 相对带完整 CoT 的 SFT+RL，在 Travel Planner、τ-Bench Retail、τ-Bench Airline 分别提高 11.8、2.08、6.00 个百分点；OPSD 在 Qwen3-8B 上也优于基线，但在 Qwen3-4B 上明显退化，说明学生规模、PI 信息量与师生分布距离共同决定 on-policy 自蒸馏是否有效。局限是 PI 来自预先收集的成功前沿轨迹，训练仍需环境交互和可验证奖励，且 π-Distill 与 OPSD 的收益不能互相等同。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Learning beyond Teacher: Generalized On-Policy Distillation with Reward Extrapolation</strong> <span class="entry-meta">2026-02 · arXiv</span> <a href="https://arxiv.org/abs/2602.12125">arXiv ↗</a></span> <span class="entry-tldr">标准 OPD 在 KL-constrained RL 视角下把隐式奖励与正则固定为同权，并默认以教师分布为参照，可能把学生限制在教师边界内。</span></summary>

- 背景 / 研究问题：标准 OPD 在 KL-constrained RL 视角下把隐式奖励与正则固定为同权，并默认以教师分布为参照，可能把学生限制在教师边界内。
- 方法：
  - 引入可选 reference policy 与 reward scale；
  - 令 scale 大于 1 得到 ExOPD；
  - 强到弱时可用教师的 pre-RL checkpoint 做 reward correction。
- 结果：数学与代码实验显示 ExOPD 在多种师生规模组合中优于标准 OPD，并可合并多个领域 RL 教师；代价是超参数敏感，reward correction 还要求访问教师基座模型。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Fast and Effective On-policy Distillation from Reasoning Prefixes</strong> <span class="entry-meta">2026-02 · arXiv</span> <a href="https://arxiv.org/abs/2602.15260">arXiv ↗</a></span> <span class="entry-tldr">长 CoT 的在线 rollout 和教师评分占据 OPD 大部分成本，但有效信号可能集中在早期前缀。</span></summary>

- 背景 / 研究问题：长 CoT 的在线 rollout 和教师评分占据 OPD 大部分成本，但有效信号可能集中在早期前缀。
- 方法：只采样并蒸馏学生响应前缀，到设定位置提前终止；目标函数保持 OPD，只缩短训练 horizon。
- 结果：AI-for-Math 与 OOD 基准上匹配 full OPD，并报告训练 FLOPs 降低 2×–47×；该结论依赖“前缀信号集中”的任务结构。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Stable On-Policy Distillation through Adaptive Target Reformulation</strong> <span class="entry-meta">2026-01 · ACL 2026</span> <a href="https://arxiv.org/abs/2601.07155">arXiv ↗</a></span> <span class="entry-tldr">安全与对齐 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 安全与对齐 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师分布与 outcome/verifier 混合信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 选择性门控：过滤不可靠教师信号或只干预关键状态。
- 结果：
  - 任务域为安全与对齐；涉及模型/教师包括 Qwen2-0.5B-IT、Qwen2-7B-IT、GPT-4o-mini；评测覆盖 GSM8K、HumanEval；正文使用 pass@1、pass@k、accuracy、reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：跨任务或分布外泛化仍缺少充分验证；方法效果依赖特定教师访问权限或概率信息。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>OVD: On-policy Verbal Distillation</strong> <span class="entry-meta">2026-01 · arXiv</span> <a href="https://arxiv.org/abs/2601.21968">arXiv ↗</a></span> <span class="entry-tldr">安全与对齐 · 无 logits 反馈构造</span></summary>

- 背景 / 研究问题：面向 安全与对齐 中的「无 logits 反馈构造」问题。
- 方法：
  - 状态与数据：学生生成的交互轨迹；
  - 监督来源：黑盒评分、rubric 或语言反馈；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新；
  - 验证器/结果奖励：把可验证正确性与教师分布监督结合；
  - 选择性门控：过滤不可靠教师信号或只干预关键状态；
  - 策略梯度更新：把教师或判别器信号作为密集/序列奖励。
- 结果：
  - 任务域为安全与对齐；涉及模型/教师包括 Qwen-2.5-3B-Base、Qwen-2.5-3B、Qwen-2.5-7B、T5；评测覆盖 MATH、OlympiadBench、MMLU、GAIA、HotpotQA、Natural Questions；正文使用 accuracy、exact match、reward 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Self-Distilled Reasoner: On-Policy Self-Distillation for Large Language Models</strong> <span class="entry-meta">2026-01 · arXiv</span> <a href="https://arxiv.org/abs/2601.18734">arXiv ↗</a></span> <span class="entry-tldr">常规 OPD 依赖独立强教师，RLVR 的 outcome reward 又稀疏。</span></summary>

- 背景 / 研究问题：常规 OPD 依赖独立强教师，RLVR 的 outcome reward 又稀疏。OPSD 让同一模型在看到 verified reasoning trace 时作为教师，而学生只看到问题，以检验 privileged context 是否能被 on-policy soft distillation 内化。
- 方法：
  - 学生 rollout，教师条件于问题、ground-truth solution 与学生前缀；
  - 默认在每个位置计算 full-vocabulary forward KL，并做 pointwise clipping；
  - 同时分析 sampled-token policy-gradient 变体，将其解释为密集 token 奖励。
- 结果：
  - Qwen3-1.7B/4B/8B、OpenThoughts 数学子集和 AIME24/25、HMMT25，对比 SFT 与 GRPO；
  - full-logit 变体在 Qwen3-4B 上的 AIME25/HMMT25 pass@8 为 84.1/60.0，sampled-token 为 82.1/57.3；
  - 单题 1 个 rollout、1024 sampled tokens 可在约 100 steps 收敛，但论文只评到 8B，且指出超出模型理解阈值时 privileged answer 也不能保证有效监督。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>CORD: Bridging the Audio-Text Reasoning Gap via Weighted On-policy Cross-modal Distillation</strong> <span class="entry-meta">2026-01 · arXiv</span> <a href="https://arxiv.org/abs/2601.16547">arXiv ↗</a></span> <span class="entry-tldr">音频或语音 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 音频或语音 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：特权上下文条件化的自教师；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - forward KL：覆盖教师支持集，常用于高熵位置或混合目标；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 自教师：同一模型在不同上下文或历史条件下产生监督；
  - 表示蒸馏：在 token 概率之外匹配隐藏特征或中间状态。
- 结果：
  - 任务域为音频或语音；涉及模型/教师包括 Qwen2-Audio-7B-Instruct；评测覆盖 GSM8K、MATH；正文使用 accuracy、reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：跨任务或分布外泛化仍缺少充分验证；质量提升可能伴随多样性下降或模式收缩。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Black-Box On-Policy Distillation of Large Language Models</strong> <span class="entry-meta">2025-11 · arXiv</span> <a href="https://arxiv.org/abs/2511.10643">arXiv ↗</a></span> <span class="entry-tldr">API 教师只返回文本时，full/top-k/sampled-token KL 都不可用；跨模型 tokenizer 不一致也使 token 对齐困难。</span></summary>

- 背景 / 研究问题：API 教师只返回文本时，full/top-k/sampled-token KL 都不可用；跨模型 tokenizer 不一致也使 token 对齐困难。单纯在教师回答上做 SeqKD 又是 off-policy。
- 方法：
  - 把学生作为 generator，并用 Bradley–Terry loss 训练 discriminator 区分教师与学生回答；
  - 将 discriminator 的 sequence score 作为 GRPO 奖励更新学生；
  - 在线更新判别器以跟随学生分布，训练前对 generator 与 discriminator 各做一轮 warmup。
- 结果：
  - GPT-5-Chat 教师，Qwen2.5 3B/7B/14B 与 Llama 3.x 学生，LMSYS-Chat-1M-Clean 训练，GPT-4o 与人工评价；
  - 表 2 中 Qwen2.5-14B 的 LMSYS 分数由 50.0 提升到 52.1，SeqKD 为 50.6，教师为 51.7；
  - 该结果依赖 LLM-as-judge 和学习到的判别器，不等同于白盒 token-level OPD 的密集教师概率监督。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>VOLD: Reasoning Transfer from LLMs to Vision-Language Models via On-Policy Distillation</strong> <span class="entry-meta">2025-10 · arXiv</span> <a href="https://arxiv.org/abs/2510.23497">arXiv ↗</a></span> <span class="entry-tldr">视觉—语言或多模态 · 监督目标与训练流程改进</span></summary>

- 背景 / 研究问题：面向 视觉—语言或多模态 中的「监督目标与训练流程改进」问题。
- 方法：
  - 状态与数据：学生当前策略生成的 token/序列；
  - 监督来源：教师 token 分布、log-ratio 或 KL 信号；
  - reverse KL：强调学生高概率区域，减少对教师长尾的覆盖负担；
  - 熵感知控制：依据教师不确定性调整监督强度或目标方向；
  - trust region/clipping：限制异常 log-ratio 或过大的策略更新；
  - 前缀或短轨迹训练：聚焦高信息状态并减少完整 rollout 成本；
  - 优势与信用分配：把序列结果映射到 token、step 或 turn 更新。
- 结果：
  - 任务域为视觉—语言或多模态；涉及模型/教师包括 Qwen2.5-VL-3B-Instruct、Qwen3-8B、Qwen2.5-VL-3B、Qwen3-4B、Qwen3-14B、Qwen2.5-VL；评测覆盖 MATH、MMMU、MathVista；正文使用 accuracy、exact match、reward、KL divergence 等指标。 
  - 比较设计：正文围绕核心方法、相关蒸馏或强化学习基线以及关键组件消融展开，结果需结合训练预算与评测协议理解。 
  - 适用边界：额外生成、教师查询或验证器带来计算成本；跨任务或分布外泛化仍缺少充分验证。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>DistiLLM-2: A Contrastive Approach Boosts the Distillation of LLMs</strong> <span class="entry-meta">2025-03 · ICML 2025</span> <a href="https://arxiv.org/abs/2503.07067">arXiv ↗</a></span> <span class="entry-tldr">既有方法常对教师数据和学生数据使用同一损失，忽略“数据来源—优化方向”的配对关系；这使混合 on/off-policy 训练未充分利用二者互补性。</span></summary>

- 背景 / 研究问题：既有方法常对教师数据和学生数据使用同一损失，忽略“数据来源—优化方向”的配对关系；这使混合 on/off-policy 训练未充分利用二者互补性。
- 方法：
  - 对教师响应提高似然、对学生响应构造对比性抑制；
  - 联合教师生成与学生生成数据；
  - 把同一思想扩展到偏好对齐和视觉语言设置。
- 结果：
  - 覆盖 instruction following、code generation 与跨模态扩展；
  - 官方论文报告相对 DistiLLM/传统 KD 的一致改进；
  - 它是混合分布蒸馏而非严格纯 on-policy，故主要价值在“损失应适配轨迹来源”。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>DistiLLM: Towards Streamlined Distillation for Large Language Models</strong> <span class="entry-meta">2024-02 · ICML 2024</span> <a href="https://arxiv.org/abs/2402.03898">arXiv ↗</a> <strong>▲上方路线已收录</strong></span> <span class="entry-tldr">学生生成输出能缓解训练—推理失配，但频繁生成 SGO 增加成本；常用 KL 目标在教师不熟悉学生输出时也可能给出噪声反馈。</span></summary>

- 背景 / 研究问题：学生生成输出能缓解训练—推理失配，但频繁生成 SGO 增加成本；常用 KL 目标在教师不熟悉学生输出时也可能给出噪声反馈。
- 方法：
  - 用 skew KL / skew reverse KL 控制梯度与近似误差；
  - 用 replay buffer 复用学生输出；
  - 随训练进度降低 replay ratio 与 SGO 生成频率，在 on-policy 适配和计算效率间折中。
- 结果：
  - 在 instruction-following、摘要和机器翻译上比较 KD、SeqKD、ImitKD、MiniLLM 与 GKD；
  - 论文报告最高 4.3× 训练加速，并在多种 teacher–student 组合上改善 GPT-4/ROUGE-L；
  - 结果支持调度与 replay 的效率价值，但该方法主动回引 off-policy 数据，不能视为“纯 OPD 更优”的独立证据。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>On-Policy Distillation of Language Models: Learning from Self-Generated Mistakes</strong> <span class="entry-meta">2023-06 · ICLR 2024</span> <a href="https://arxiv.org/abs/2306.13649">arXiv ↗</a> <strong>▲上方路线已收录</strong></span> <span class="entry-tldr">自回归学生在固定参考/教师轨迹上训练会错过自身错误导致的前缀；单一 forward KL 也未必适合容量受限学生。</span></summary>

- 背景 / 研究问题：自回归学生在固定参考/教师轨迹上训练会错过自身错误导致的前缀；单一 forward KL 也未必适合容量受限学生。GKD 将 KD 解释为具有交互专家的 imitation learning。
- 方法：
  - 以 $\lambda$ 混合固定数据和学生生成轨迹，$\lambda=1$ 即纯 on-policy；
  - 在学生访问前缀上计算教师—学生 token 分布散度；
  - 允许 forward/reverse KL 与 generalized JSD，并可与 RL 奖励联合优化。
- 结果：
  - T5-XL 教师向 77M/250M/800M 学生蒸馏，覆盖 XSum、WMT、GSM8K 与 instruction tuning；
  - 论文报告，相对初始学生的增益中，on-policy GKD 相对基线 KD 的改进倍数在摘要、翻译、算术上平均为 2.1×、1.7×、1.9×；
  - 反向 KL/JSD 的质量收益伴随更低生成多样性，最优散度依任务与采样温度变化。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>MiniLLM: On-Policy Distillation of Large Language Models</strong> <span class="entry-meta">2023-06 · ICLR 2024</span> <a href="https://arxiv.org/abs/2306.08543">arXiv ↗</a> <strong>▲上方路线已收录</strong></span> <span class="entry-tldr">标准 forward-KL/SeqKD 让容量有限的学生覆盖教师长尾，并在教师轨迹上训练；推理时学生却条件于自己的历史，产生 exposure bias。</span></summary>

- 背景 / 研究问题：标准 forward-KL/SeqKD 让容量有限的学生覆盖教师长尾，并在教师轨迹上训练；推理时学生却条件于自己的历史，产生 exposure bias。论文把 sequence-level reverse KL 作为学生自身分布下的目标。
- 方法：
  - 用 policy gradient 优化 $KL(q_\theta\|p)$；
  - 用 single-step decomposition 降低长序列回报的方差；
  - 用 teacher-mixed sampling 抑制 reward hacking，并以长度归一化处理短输出偏置。
- 结果：
  - 在 120M–13B 的 GPT-2、OPT、LLaMA 学生上做指令跟随，使用 5 个数据集、ROUGE-L、GPT-4 与人工评价；
  - 表 1 中，LLaMA-7B 的 MiniLLM 在 DollyEval GPT-4/R-L 上为 76.4/29.0，而 KD 为 73.7/27.4；
  - 论文自身已观察到 policy-gradient 方差、退化重复和长度偏置，后续工作把这些现象扩展为系统性失效模式。

</details>

## 看点

「前沿探索、蒸馏下放」的分工已成工业常态：RL 训练前沿教师贵但只训一次，OPD 下放便宜且可对每个学生规模重复。这条路线的下一程，取决于机制研究能否把「差距-收益曲线」画出来——它将决定蒸馏是永远的二等公民，还是能力生产的主通道。
