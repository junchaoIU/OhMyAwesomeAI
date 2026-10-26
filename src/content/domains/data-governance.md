---
name: 数据治理与内容溯源
en: Data Governance & Provenance
parent: alignment
order: 4
status: active
summary: 训练数据与生成内容两端的合规审计：成员推断攻击（MIAs）、机器遗忘、LLM 水印与 AI 生成检测——「数据从哪来、内容谁生成、隐私如何证明」的三重治理。
keyPapers:
  - Membership Inference Attacks Against ML Models（2017，Shokri，Cornell Tech）
  - Machine Unlearning / SISA（2019，Bourtoule，多伦多）
  - Extracting Training Data from LLMs（2021，Carlini，Google）
  - A Watermark for Large Language Models（2023，Kirchenbauer，马里兰）
  - DetectGPT（2023，Mitchell，斯坦福）
  - Detecting Pretraining Data from LLMs（2023，Min-K% Prob，华盛顿大学）
  - TOFU 与 WMDP（2024，遗忘基准化）
  - SynthID-Text（2024，DeepMind，Nature）
keyLabs:
  - Google DeepMind（SynthID）
  - 马里兰大学（Goldstein 组）
  - ETH Zürich（Tramèr 组）
tags: [隐私, 水印, 溯源, machine unlearning]
---

生成式模型把两个古老的出版业问题搬进了训练管线：**数据从哪来**（版权、隐私、授权）与**内容是谁生成的**（鉴伪、溯源、问责）。这个领域在输入与输出两端做审计技术——输入侧，成员推断攻击（MIA）判断「这条样本是否进过训练集」，是隐私泄露的实证度量；机器遗忘（machine unlearning）把 GDPR 的被遗忘权变成算法问题。输出侧，LLM 水印在采样分布里埋统计暗记，AI 生成检测不依赖暗记、纯看文本特征判机器手笔——前者可证伪、后者免协作，构成内容溯源的攻防两翼。

下面把这条线上的代表工作梳理成两轨论文清单：**输出侧溯源**（水印与检测）与**输入侧审计**（隐私、记忆化与遗忘），各自按时间倒序排列——想沿演进顺序读，从输入侧底部的 Shokri（2017）开始往上走。每个条目默认折叠：收起时可见标题、第一单位、时间、发表 venue、论文与代码链接和一句话简介，点击展开核心问题、方法与结果的分点拆解与结论反思。输出侧的更完整文献全景见下方[检测全景档案](#llm-生成文本检测全景档案121-篇)。

## 输出侧溯源：水印与检测（2023–2024）

<details class="paper-entry">
<summary><span class="entry-line"><strong>SynthID-Text：水印走进产品</strong> <span class="entry-meta">Google DeepMind · 2024-10 · Nature</span> <a href="https://www.nature.com/articles/s41586-024-08025-4">论文</a> <a href="https://github.com/google-deepmind/synthid-text">代码</a></span> <span class="entry-tldr">锦标赛采样在 Gemini 生产流量上埋水印并通过千万级用户 A/B 检验——登上 Nature，检测器开源进 HuggingFace。</span></summary>

- 核心问题：水印能否以可忽略的质量代价部署到生产规模，并通过真实产品的检验。
- 方法：
  - 锦标赛采样：每步生成若干候选 token，由检测函数打分，在质量与暗记强度之间取最优；
  - 检测器输出「水印 / 无水印 / 不确定」三态判定；
  - 检测器开源并集成进 HuggingFace Transformers（v4.46 起，logits processor 形式）。
- 结果：
  - Gemini 与 AI Studio 千万级用户的真实流量 A/B 实验：输出质量与产品指标无可测影响；
  - 假阳性率按可作证据使用的标准设计，远低于司法级阈值；
  - 水印第一次从论文跑通到工业规模。
- 结论与反思：算法内核是绿名单范式的工程化，真正的贡献是部署证据——水印从此是产品决策而非论文问题；密钥托管与「水印能否被清洗」成为新的治理议题。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Spotting LLMs with Binoculars</strong> <span class="entry-meta">马里兰大学 · 2024-01 · ICML 2024</span> <a href="https://arxiv.org/abs/2401.12070">论文</a> <a href="https://github.com/ahans30/Binoculars">代码</a></span> <span class="entry-tldr">两个相近模型的交叉困惑率比值做零样本检测——不训练、不埋水印，0.01% 假阳性下检出 90%+ 的机器文本。</span></summary>

- 核心问题：不依赖水印、不收集训练数据，纯零样本能否稳定识别机器文本。
- 方法：
  - 双「镜筒」：performer 语言模型对文本打分、observer 对混淆文本打分；
  - 交叉困惑率比值作统计量，捕捉人机文本在模型眼中的分布差。
- 结果：
  - 0.01% 假阳性率下检出 ChatGPT 等模型 90%+ 的生成样本；
  - 无需针对特定模型改动，对未见过的生成模型直接可用。
- 结论与反思：纯统计检测的窗口在收窄——模型越强、人写文本越「AI 腔」，两个分布重叠越大；它适合低价值场景的粗筛，司法级判定仍需生成端配合。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Robust Distortion-free Watermarks</strong> <span class="entry-meta">斯坦福 CRFM · 2023-07 · TMLR 2024</span> <a href="https://arxiv.org/abs/2307.15593">论文</a> <a href="https://github.com/jthickstun/watermark">代码</a></span> <span class="entry-tldr">从伪随机序列逆向构造带记文本——分布零偏移、检测不依赖密钥，对改写与裁剪攻击更鲁棒。</span></summary>

- 核心问题：软水印轻微偏移采样分布、低熵文本上信号弱；能否不扭曲分布、且扛住扰动攻击。
- 方法：
  - distortion-free 路线：先由密钥生成伪随机 token 序列，再逆向构造与该序列吻合的带记文本；
  - 检测统计量 key-free——不依赖密钥即可判定，密钥只用于埋记。
- 结果：
  - 对裁剪、同义替换等攻击的鲁棒性显著强于绿名单软水印；
  - 低熵文本（代码、翻译）也能埋记——补上软水印的短板。
- 结论与反思：鲁棒性换检出率，权衡没有免费午餐；distortion-free 与 key-free 从此成为水印设计的标配约束。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>DetectGPT</strong> <span class="entry-meta">斯坦福 · 2023-01 · ICML 2023</span> <a href="https://arxiv.org/abs/2301.11305">论文</a> <a href="https://github.com/eric-mitchell/detect-gpt">代码</a></span> <span class="entry-tldr">概率曲率检测——机器文本处在 log 概率的局部极大，小扰动后掉得比人写文本更陡；零样本检测的代表作。</span></summary>

- 核心问题：不修改生成过程、不训练分类器，能否纯靠源模型零样本判定机器文本。
- 方法：对文本做小扰动后比较 log 概率变化——机器采样自概率峰值附近，扰动必然「下坡」，人写文本则不然。
- 结果：零样本检测显著优于此前基线；同文警示——轻度改写即可大幅降低检出率。
- 结论与反思：依赖对源模型的访问限制了黑盒场景；OpenAI 自家的文本分类器 2023-07 因准确率不足下线——纯检测的现实比论文光谱严峻，社区重心此后转向生成端水印。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>A Watermark for Large Language Models</strong> <span class="entry-meta">马里兰大学 · 2023-01 · ICML 2023</span> <a href="https://arxiv.org/abs/2301.10226">论文</a> <a href="https://github.com/jwkirchenbauer/lm-watermarking">代码</a></span> <span class="entry-tldr">绿名单软水印——采样时暗中偏好哈希选出的绿色 token，z 检验即可检出；LLM 水印的范式起点。</span></summary>

- 核心问题：能否给生成文本埋入人不可见、算法可检、且无需模型权重即可验证的信号。
- 方法：
  - 每步生成前用密钥哈希前文划分绿/红名单，采样时给绿 token 加偏置；
  - 检测端统计绿 token 占比做 z 检验，输出带 p 值的判定，开源算法可独立验证。
- 结果：
  - 质量损失可忽略（困惑度几乎不变），数百 token 即可低假阳性检出；
  - 检测不需访问模型参数或 API 内部——此后所有 LLM 水印工作以此为基线。
- 结论与反思：低熵文本可埋空间小、改写攻击削弱信号——水印与清洗的军备竞赛由此开场，「可证伪」与「可证鲁棒」来回拉锯两年。

</details>

## 输入侧审计：隐私、记忆化与遗忘（2017–2024）

<details class="paper-entry">
<summary><span class="entry-line"><strong>WMDP：危险知识的度量与删除</strong> <span class="entry-meta">斯坦福 & CAIS · 2024-03 · NeurIPS 2024</span> <a href="https://arxiv.org/abs/2403.03218">论文</a> <a href="https://github.com/centerforaisafety/wmdp">代码</a></span> <span class="entry-tldr">3,668 道生物/网络/化学危害多选题 + RMU 遗忘方法——「能力删除」第一次有了公开基准。</span></summary>

- 核心问题：危险知识（生物安全、网络安全、化学安全）的遗忘缺乏可度量、可公开评测的基准。
- 方法：
  - 专家审核的 3,668 道多选题构成 WMDP，作为危险知识的代理度量；
  - RMU（representation misdirection for unlearning）在激活层干预危险概念的表征方向。
- 结果：RMU 大幅压低 WMDP 得分、同时基本保持 MMLU 等通用能力；成为危险知识遗忘的参考实现。
- 结论与反思：遗忘评测是「真删除 vs 伪装删除」的博弈——后续工作证明多种攻击可部分恢复被 RMU 抑制的知识；公开危险知识以评测遗忘，本身也是双重用途争议。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>TOFU：虚构遗忘基准</strong> <span class="entry-meta">CMU & MIT · 2024-01 · COLM 2024</span> <a href="https://arxiv.org/abs/2401.06121">论文</a> <a href="https://github.com/locuslab/tofu">代码</a></span> <span class="entry-tldr">200 位虚构作者的 4,000 条问答——绕开隐私争议，「忘得干不干净」第一次有了公开沙盒。</span></summary>

- 核心问题：真实人物数据的遗忘评测有法律障碍，「忘干净没有」也缺乏统一度量。
- 方法：
  - GPT-4 合成 200 位虚构作者 × 20 条问答共 4,000 条虚构事实，微调进模型；
  - forget set 按 1%/5%/10%（2/10/20 位作者）划分，同时评测遗忘质量与模型效用；
  - 用成员推断做「是否真忘」的量尺——攻击工具反哺审计。
- 结果：现有遗忘方法在遗忘-效用权衡上无一合格——要么忘不掉、要么连不该忘的也一起忘掉。
- 结论与反思：虚构数据让评测可公开复现，TOFU 成为遗忘研究的标准沙盒；「MIA 度量遗忘彻底性」是本领域审计与攻击同源的最佳注脚。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Min-K% Prob</strong> <span class="entry-meta">华盛顿大学 · 2023-10 · ICLR 2024</span> <a href="https://arxiv.org/abs/2310.16789">论文</a> <a href="https://github.com/swj0419/detect-pretrain-code">代码</a></span> <span class="entry-tldr">最低 k% token 概率之和做成员判定 + WikiMIA 公开基准——预训练数据审计从此有标准工具。</span></summary>

- 核心问题：LLM 预训练数据的成员判定没有公开可复现的方法（此前 MIA 面向分类模型或依赖影子模型）。
- 方法：
  - 假设：没见过的文本大概率含几个「离群低概率词」，背过的文本不会有——取序列中概率最低 k% token 的对数概率和作统计量；
  - WikiMIA 动态基准：用模型训练截止日期前后产生的数据构造天然正负例。
- 结果：无需训练参考模型、开销极小，较此前方法提升 7.4%；落地版权书籍检测、下游基准污染检测、遗忘隐私审计三个场景。
- 结论与反思：把 MIA 从隐私攻击变成数据审计工具——版权取证、污染筛查、记忆化度量自此共用这把尺子。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Extracting Training Data from LLMs</strong> <span class="entry-meta">Google 等 · 2021 · USENIX Security 2021</span> <a href="https://arxiv.org/abs/2012.07805">论文</a> <span class="entry-nocode">无代码</span></span> <span class="entry-tldr">让 GPT-2 逐字吐出训练语料——姓名、电话、地址与 URL，「记忆化」从理论风险变成可复现攻击。</span></summary>

- 核心问题：语言模型是否真的逐字记住训练数据，并可以被诱导提取出来。
- 方法：
  - 注入含个人信息的 canary 序列，度量成员推断与提取成功率；
  - 自训 1.5B 参数系列模型，控制训练数据重复度，分析记忆化规律；
  - 多样化提示词引导输出发散，最大化提取产量。
- 结果：
  - 从 GPT-2 XL 提取出数百段逐字训练样本，含姓名、电话号码、邮箱与 URL；
  - 记忆量随模型规模与样本重复度上升；模型越大，提取反而越容易。
- 结论与反思：「模型即数据库」自此有了实证注脚——预训练语料去重与版权审计随后成为标准实践。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Machine Unlearning（SISA）</strong> <span class="entry-meta">多伦多大学 & Vector · 2019-12 · IEEE S&P 2021</span> <a href="https://arxiv.org/abs/1912.03817">论文</a> <a href="https://github.com/cleverhans-lab/machine-unlearning">代码</a></span> <span class="entry-tldr">训练集分片、每片独立子模型——删除请求只需重训一个分片，被遗忘权的第一个系统性架构方案。</span></summary>

- 核心问题：数据已经「焊进」模型权重，被遗忘权要求数据删除时，除了全量重训还有什么办法。
- 方法：SISA（Sharded, Isolated, Sliced, Aggregated）——训练集随机分片，每片独立训练子模型；删除请求只重训对应分片；推理时子模型投票聚合。
- 结果：删除成本从全量重训降低一个数量级，精度损失可控。
- 结论与反思：面向「尚未开始训练」的架构级方案，对已训好的模型无法回溯适用——LLM 时代的遗忘转向事后权重编辑，但「全量重训仍是唯一金标准」的尴尬延续至今。

</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Membership Inference Attacks against ML Models</strong> <span class="entry-meta">Cornell Tech & Cornell · 2017-05 · IEEE S&P 2017</span> <a href="https://arxiv.org/abs/1610.05820">论文</a> <a href="https://github.com/csong27/membership-inference">代码</a></span> <span class="entry-tldr">影子模型训练攻击分类器——只靠黑盒置信度接口就能判断「这条数据在不在训练集里」，训练数据隐私自此有了实证度量。</span></summary>

- 核心问题：机器学习即服务的预测 API，会否泄露训练数据本身的成员信息。
- 方法：
  - 训练影子模型模仿目标模型的行为分布，在影子数据上训练二分攻击器；
  - 攻击者无需了解目标训练数据——合成数据、统计分布、噪声真实数据三种来源均可。
- 结果：
  - Google Prediction API 的 100 类购买数据集上攻击 precision 达 94%，纯合成数据也有 90%；
  - 过拟合程度（train-test gap）与攻击成功率强相关；医院住院记录等敏感数据同样沦陷。
- 结论与反思：此后每种隐私技术（差分隐私、联邦学习、遗忘）都以 MIA 抗性为标准评估项——隐私研究自此有了统一靶子；十年后它反过来成为遗忘彻底性的量尺。

</details>

三条张力定义这个领域。其一，**水印的三角权衡**——质量、检出率、鲁棒性不可兼得：低熵文本（代码、翻译）难埋水印，改写与翻译攻击让暗记存活率骤降。其二，**检测的假阳性代价不对称**——把学生的原创作业冤枉成 AI 生成，比漏检一条机器文本伤害更大，这也是水印派主张「生成端埋记」的产品论据。其三，**遗忘的验证悖论**——证明模型「真的忘了」某条数据，最自然的方法又是一次成员推断：审计工具与攻击工具是同一把尺子。

## LLM 生成文本检测全景档案（121 篇）

上方两轨是挑出的关键工作与代表基线；这一节是 LLM 生成文本检测更完整的文献全景（整理来源：[Awesome LLM-generated Text Detection](https://github.com/junchaoIU/LLM-generated-Text-Detection)——澳门大学 Junchao Wu 等人的综述 *A Survey on LLM-Generated Text Detection*（Computational Linguistics, 2025）的配套清单，共 121 篇，**按时间倒序平铺、不分类**——需要水印 / 统计 / 神经 / 攻击等分类视图可查阅来源仓库）。每条默认折叠，收起时可见标题、年月、venue、论文与代码链接及分类标签；标 ▲ 的已在上方两轨清单中给出深度条目。

<details class="paper-entry">
<summary><span class="entry-line"><strong>The Second Shared Task on LLM-Generated Text Detection (NLPCC 2026 Task 6)</strong> <span class="entry-meta">2026-11 · NLPCC 2026</span> <a href="https://github.com/NLP2CT/NLPCC-2026-Task6-Detection">论文 ↗</a> <a href="https://github.com/NLP2CT/NLPCC-2026-Task6-Detection">代码</a></span> <span class="entry-tldr">共享任务评测</span></summary>

- 背景 / 研究问题：LLM 生成文本检测的相关研究绝大多数面向英文，中文场景的系统探索稀缺，而虚假信息、有害内容等滥用压力同样紧迫。
- 方法：澳门大学 NLP2CT 组织的第二届中文检测共享任务：分类从二元升级为三元（人类撰写 HWT / LLM 生成 LGT / LLM 润色 HLT）；训练集取自 CUDRT 中文子集——4 个 LLM（GPT-4、Qwen、ChatGLM、Baichuan）× 新闻与学术两域、20,370 对样本；评测基于 DetectRL（NeurIPS 2024）框架扩展，分开放与封闭两阶段。
- 结果：更贴近真实使用场景的三元 formulation（「润色」是此前二分类完全忽略的中间态）；完整训练与测试数据、评分脚本已在 GitHub 公开，最终排行榜已发布。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>A Survey on LLM Watermarking: Theory and Deployment</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.10103">arXiv ↗</a></span> <span class="entry-tldr">综述</span></summary>

- 背景 / 研究问题：LLM 输出可被无据拷贝、变换与再分发，信任、问责、知识产权与高风险决策都缺乏来源证据；现有水印方法在设计假设、威胁模型与评测口径上各说各话。
- 方法：把 LLM 水印系统化为大规模数据生态的溯源基础设施，沿四个部署维度组织全部方法：插入点（生成时 / 生成后）、验证权属、运行状态、变换威胁模型（arXiv 条目现名 LLM Watermarking as Big Data Provenance）。
- 结果：部署选择——水印位置、检测权与密钥管理——直接决定可靠性、安全性与可扩展性的三角权衡，为「水印作为数据溯源层」给出工程化路线图。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>AI Watermark Evidence Fails Forensic Readiness: An Empirical Evaluation</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.16010">arXiv ↗</a></span> <span class="entry-tldr">对抗攻击</span></summary>

- 背景 / 研究问题：EU AI Act 要求 AI 内容标注「足够可靠且鲁棒」、加州 SB 942 要求「永久或极难移除」——两者都建立在「水印证据可靠到能进法庭」这一未经检验的假设上。
- 方法：对三种代表性水印（KGW、Unigram、MarkLLM 实现的 SynthID-Text）按 Daubert 证据可采性标准与 NIST SP 800-86 数字取证流程做实证评估；提出 12 项标准、3 个强制门、60 分制的水印司法就绪度评分框架（FRS），以保义改写为攻击向量。
- 结果：现有水印证据的取证就绪度整体不足——距「能当法庭证据用」还有明显差距，为监管合规敲响警钟。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Detecting LLM-Generated Tokens in Human–LLM Coauthored Text</strong> <span class="entry-meta">2026-07 · arXiv</span> <a href="https://arxiv.org/abs/2607.21458">arXiv ↗</a></span> <span class="entry-tldr">零样本统计检测</span></summary>

- 背景 / 研究问题：人机协作写作越来越普遍，需要的是「定位文档里哪些部分出自 LLM」的细粒度检测，而现有方法只做文档级二分类。
- 方法：在 token 级（语言模型的自然单元）展开：对既有 token 级检测分数做相邻平滑以降低方差，用 Lepski 型自适应规则按局部作者结构选带宽；无需任何 token 级标注即可训练。
- 结果：理论上刻画了平滑与定位精度的权衡，方法简单、零标注依赖，是人机合著文本溯源的直接可用工具。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>GigaCheck: Detecting LLM-generated Content via Object-Centric Span Localization</strong> <span class="entry-meta">2026-07 · ACL 2026 Findings</span> <a href="https://aclanthology.org/2026.findings-acl.213/">论文 ↗</a></span> <span class="entry-tldr">有监督神经检测</span></summary>

- 背景 / 研究问题：LLM 助手内容量激增且在很多任务上已与人类写作不可分辨，检测方法的进展速度落后于生成模型。
- 方法：双策略框架：文档级用微调 LLM 的表示学习高效判别作者；span 级提出「对象中心」的结构化适配——把生成文本段当作检测对象，将 DETR 式视觉目标检测架构与语言编码器结合，做 AI 片段的精确定位。
- 结果：3 个分类 + 3 个定位基准上验证鲁棒；共享的微调主干在两类任务上都表现强劲，证明视觉检测架构可从像素空间成功迁移到文本 span 定位；代码开源。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Triospect: A Three-Dimensional Framework for Robust Statistical AI-Generated Text Detection Against Diverse Attacks</strong> <span class="entry-meta">2026-06 · TACL 2026</span> <a href="https://arxiv.org/abs/2606.31074">arXiv ↗</a> <a href="https://github.com/baoguangsheng/triospect">代码</a></span> <span class="entry-tldr">零样本统计检测</span></summary>

- 背景 / 研究问题：现有 AI 生成文本检测器对操纵文本特征（风格、句式）的攻击普遍脆弱。
- 方法：从文本中内容（核心观点）与表达（风格要素）两个额外视角构造三维统计检测框架 Triospect，突破仅依赖表层统计量的局限。
- 结果：两基准上 17 种攻击 × 12 域 × 17 源模型验证：Humanize-16K 攻击后子集 AUROC 较强基线 +22.3%、TPR@1%FPR +13%，adversarial RAID 上 +9.1%——统计方法对抗攻击可靠性的先行工作；数据代码开源。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>DetectRL-X</strong> <span class="entry-meta">2026-05 · ACL 2026</span> <a href="https://arxiv.org/abs/2605.15518">arXiv ↗</a></span> <span class="entry-tldr">检测基准</span></summary>

- 背景 / 研究问题：现有检测器号称高性能，但在多语言、真实使用场景下的可靠性基本未被探索。
- 方法：构建覆盖 8 种商用语言 × 6 个高误用风险领域（人写文本）× 4 个商用 LLM 的多语言基准，并纳入润色、扩写、缩写等真实 AI 辅助写作操作，按 8 个维度系统评测。
- 结果：暴露先进检测器在多语言真实场景下的可靠性缺口——与 DetectRL 一起构成「真实世界检测」系列基准；该基准同时被 NLPCC 2026 共享任务用作测试集来源。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Findings of the Counter Turing Test (CT2): AI-Generated Text Detection</strong> <span class="entry-meta">2026-05 · DeFactify 2025</span> <a href="https://arxiv.org/abs/2605.20761">arXiv ↗</a></span> <span class="entry-tldr">共享任务评测</span></summary>

- 背景 / 研究问题：GPT-4、Claude 3.5、Llama 等模型产出的文本高度拟人，真实性保障体系承受的压力与日俱增。
- 方法：DeFactify 2025 的 CT2 共享任务总览：Task A 人机二分类，Task B 识别文本由哪个模型生成；对 SOTA 检测技术做全面分析并评测参赛系统。
- 结果：系统报告跨任务、跨模型的检测能力边界，为社区提供统一参照。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Segmenting Human–LLM Co-authored Text via Change Point Detection</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.03723">arXiv ↗</a> <a href="https://github.com/Mamba413/DetectLLMSegmentation">代码</a></span> <span class="entry-tldr">零样本统计检测</span></summary>

- 背景 / 研究问题：人机合著文本需要定位「人类写的段」与「LLM 写的段」，而现有检测器只给整篇二分类结论。
- 方法：关键观察：该分割任务在结构上等价于时序分析的经典变点检测；据此提出加权算法与广义算法以适应异方差的检测分数序列，并建立 minimax 最优性理论。
- 结果：理论上保证最优速率，实证验证分割精度——把统计检验工具箱整体搬进人机合著文本分析。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Vaporizer: Breaking Watermarking Schemes for Large Language Model Outputs</strong> <span class="entry-meta">2026-05 · arXiv</span> <a href="https://arxiv.org/abs/2605.07481">arXiv ↗</a></span> <span class="entry-tldr">对抗攻击</span></summary>

- 背景 / 研究问题：最新一批水印方案宣称鲁棒、可扩展、达到生产级，是「负责任使用 LLM」的支柱技术。
- 方法：系统评估这些方案对抗「保持语义的定向修改攻击」的能力：词法改写、机器翻译、神经改写多路攻击，以水印移除成功与语义保留双指标衡量，语义保留用 BERTScore、文本复杂度、语法错误率与 Flesch 阅读难度度量。
- 结果：实验揭示多种水印方案在语义基本不变的攻击下检测力显著退化——「生产级鲁棒」的说法需要打折扣。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Breaking the Generator Barrier: Disentangled Representation for Generalizable AI-Text Detection (DRGD)</strong> <span class="entry-meta">2026-04 · arXiv</span> <a href="https://arxiv.org/abs/2604.13692">arXiv ↗</a> <a href="https://github.com/PuXiao06/DRGD">代码</a></span> <span class="entry-tldr">有监督神经检测</span></summary>

- 背景 / 研究问题：依赖生成器特有伪影的检测器天然不稳定——新模型不断涌现，见过的伪影很快过时；对未见生成器的泛化是检测的核心难题。
- 方法：渐进式解耦框架：紧凑潜在编码鼓励「检测语义」的最小化表达，扰动正则削减与生成器相关的残余纠缠，最后判别式适配对齐任务目标——把「什么像 AI」与「哪个模型写的」分开。
- 结果：在 MAGE 基准的未见生成器设定下验证泛化提升，直面检测领域最痛的迁移问题。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Detecting the Machine</strong> <span class="entry-meta">2026-03 · arXiv</span> <a href="https://arxiv.org/abs/2603.17522">arXiv ↗</a></span> <span class="entry-tldr">检测基准</span></summary>

- 背景 / 研究问题：现有评测多是「单检测器 × 单数据集 × 理想条件」，跨域迁移、跨 LLM 泛化与对抗鲁棒性三类问题悬而未决。
- 方法：在 HC3（23,363 对人类-ChatGPT 问答）与 ELI5（15,000 对人类-Mistral-7B）两语料上横向评测：经典分类器、五种微调 transformer 编码器、CNN、XGBoost 文体模型、困惑度检测器与 LLM 提示式检测。
- 结果：transformer 系同分布近满分但域移位明显退化；XGBoost 文体模型以极低成本匹配其跨域表现——给「重模型才有泛化」泼了冷水。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Exons-Detect: Identifying and Amplifying Exonic Tokens via Hidden-State Discrepancy for Robust AI-Generated Text Detection</strong> <span class="entry-meta">2026-03 · ACL 2026</span> <a href="https://arxiv.org/abs/2603.24981">arXiv ↗</a></span> <span class="entry-tldr">零样本统计检测</span></summary>

- 背景 / 研究问题：免训练检测方法把 token 级信号聚合成全局分数，但默认所有 token 贡献均等——短文本或局部篡改下鲁棒性不足。
- 方法：借鉴生物学的「外显子」视角：双模型设定下度量隐状态差异，识别信息量大的 exonic token 并放大其权重，其余 token 降权。
- 结果：免训练、短序列与局部修改场景下的鲁棒检测新路径（ACL 2026）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>NOTAI.AI: Explainable Detection of Machine-Generated Text via Curvature and Feature Attribution</strong> <span class="entry-meta">2026-03 · arXiv</span> <a href="https://arxiv.org/abs/2603.05617">arXiv ↗</a> <a href="https://github.com/TenderChasm/Notai.ai">代码</a></span> <span class="entry-tldr">有监督神经检测</span></summary>

- 背景 / 研究问题：检测系统只输出二分类标签或置信分，无法向使用者解释「为什么判为机器文本」。
- 方法：组合三类特征：句子级条件概率曲率、神经检测器分数、可解释文体与可读性特征，用 XGBoost 元分类器融合；TreeSHAP 特征归因生成证据链并可转化为自然语言解释。
- 结果：在 RAID 类别平衡子集（人写 / 干净 AI / 被攻击 AI）上 held-out F1 达 0.9685，超过任一单特征族——把「可解释」做成检测器的标配能力。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Detecting LLM-Generated Text with Performance Guarantees</strong> <span class="entry-meta">2026-01 · arXiv</span> <a href="https://arxiv.org/abs/2601.06586">arXiv ↗</a></span> <span class="entry-tldr">零样本统计检测</span></summary>

- 背景 / 研究问题：LLM 已渗入对话、邮件、教学、编码等日常场景，假新闻、误导性报告与学术不端使可靠检测成为刚需。
- 方法：训练一个不依赖任何辅助信息（水印、源模型知识）的分类器，并提供真阳性 / 假阳性 / 真阴性 / 假阴性四率的统计性能保证；部署为 CPU 上的在线平台 StatDetectLLM（HuggingFace Spaces）。
- 结果：带性能保证 + 纯 CPU 部署的实用检测器——统计保证使误判率可被工程化承诺。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>MASH: Evading Black-Box AI-Generated Text Detectors via Style Humanization</strong> <span class="entry-meta">2026-01 · ACL 2026 Findings</span> <a href="https://arxiv.org/abs/2601.08564">arXiv ↗</a> <a href="https://github.com/githigher/MASH">代码</a></span> <span class="entry-tldr">对抗攻击</span></summary>

- 背景 / 研究问题：AIGT 检测器对规避攻击依然脆弱；现有攻击多依赖白盒假设或高昂的计算与交互成本，黑盒实用场景下不好使。
- 方法：多阶段对齐做「风格人性化」：风格注入监督微调 → 直接偏好优化（DPO）→ 推理时精炼，逐级把 AI 生成文本的分布塑形到人类文本分布附近。
- 结果：6 个数据集 × 5 个检测器上超越 11 个攻击基线——黑盒、无目标模型访问条件下的强攻击（ACL 2026 Findings）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>AdaDetectGPT: Adaptive Detection of LLM-Generated Text with Statistical Guarantees</strong> <span class="entry-meta">2025-10 · NeurIPS 2025</span> <a href="https://arxiv.org/abs/2510.01268">arXiv ↗</a> <a href="https://github.com/Mamba413/AdaDetectGPT">代码</a></span> <span class="entry-tldr">零样本统计检测</span></summary>

- 背景 / 研究问题：SOTA 的 logits 检测器只用观测文本在源 LLM 分布下的对数概率统计量——单纯依赖 log 概率是次优的。
- 方法：从训练数据中自适应学习 witness function 来增强 logits 检测器，并对真阳性率、假阳性率、真阴性率、假阴性率提供统计保证。
- 结果：多种数据集 × LLM 组合下几乎一致地改进 SOTA，最高提升达 37%——「自适应 + 保证」双升级（NeurIPS 2025）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Human Texts Are Outliers: Detecting LLM-generated Texts via Out-of-distribution Detection</strong> <span class="entry-meta">2025-10 · NeurIPS 2025</span> <a href="https://arxiv.org/abs/2510.08602">arXiv ↗</a> <a href="https://github.com/cong-zeng/ood-llm-detect">代码</a></span> <span class="entry-tldr">有监督神经检测</span></summary>

- 背景 / 研究问题：零样本与有监督检测器都把任务当二分类，隐含「人类文本是统一分布」的假设——实际上人类文本高度多样、无法靠有限采样刻画，导致分类器记忆训练集分布、跨域泛化差。
- 方法：主张把检测重新表述为分布外（OOD）检测：人类文本是彼此异质的离群集合，LLM 文本反而共享「同源生成分布」。
- 结果：基于该 formulation 的方法在跨域、跨模型设定下超越现有零样本与有监督分类器——换问题定义来解泛化难题（NeurIPS 2025）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Overview of the NLPCC 2025 Shared Task 1: LLM-Generated Text Detection</strong> <span class="entry-meta">2025-08 · NLPCC 2025</span> <a href="https://doi.org/10.1007/978-981-95-3352-7_21">论文 ↗</a> <a href="https://github.com/NLP2CT/NLPCC-2025-Task1">代码</a></span> <span class="entry-tldr">共享任务评测</span></summary>

- 背景 / 研究问题：LLM 生成文本检测研究集中于英文，中文缺乏系统性、技术性的探索。
- 方法：首届中文 LLM 生成文本检测共享任务：二元分类，提供成对的人机文本训练与测试数据（测试 2000 对），评测参赛系统并做深入分析；由 NLPCC 2026 Task 6 的同一团队（澳门大学 NLP2CT）组织。
- 结果：给出中文检测的系统基线与参赛系统全景，直接催生 2026 年三元分类升级版。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>RepreGuard: Detecting LLM-Generated Text by Revealing Hidden Representation Patterns</strong> <span class="entry-meta">2025-08 · TACL 2025</span> <a href="https://arxiv.org/abs/2508.13152">arXiv ↗</a> <a href="https://github.com/NLP2CT/RepreGuard">代码</a></span> <span class="entry-tldr">零样本统计检测</span></summary>

- 背景 / 研究问题：现有检测方法在分布外（OOD）场景下的鲁棒性不足；假说：LLM 内部表示包含比现有特征更全面、更原始的统计模式差异。
- 方法：用代理模型收集文本的内部表示，验证人机文本在神经激活模式上的显著差异，再基于表示统计量构建高效检测器。
- 结果：跨 LLM 验证激活差异显著，统计式检测在 OOD 场景下更稳（TACL 2025）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>MultiSocial</strong> <span class="entry-meta">2025-07 · ACL 2025</span> <a href="https://arxiv.org/abs/2406.12549">arXiv ↗</a></span> <span class="entry-tldr">检测基准</span></summary>

- 背景 / 研究问题：检测研究集中于英文与长文本（新闻、论文、作文）；社媒文本短、非正式、带表情与标签，且缺乏多语言基准。
- 方法：首个多语言（22 语言）× 多平台（5 个社交平台）的社媒机器文本检测基准，共 472,097 条文本、约 5.8 万条人写。
- 结果：填补社媒短文本检测的基准空白，暴露现有方法在非正式短文本上的能力缺口（ACL 2025）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Adversarial Paraphrasing: A Universal Attack for Humanizing AI-Generated Text</strong> <span class="entry-meta">2025-06 · NeurIPS 2025</span> <a href="https://arxiv.org/abs/2506.07001">arXiv ↗</a></span> <span class="entry-tldr">对抗攻击</span></summary>

- 背景 / 研究问题：检测器对简单改写脆弱，但新一代检测器对基础改写攻击已更鲁棒——攻击方需要更强的通用武器。
- 方法：免训练的通用攻击框架：现成指令跟随 LLM 在 AI 文本检测器的分数反馈指导下迭代改写，生成专门优化过「绕过该检测器」的对抗样本。
- 结果：跨多个检测器广泛有效且迁移性强——检测器反馈本身成了攻击者的免费监督信号（NeurIPS 2025）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Attacks on Machine-Text Detectors Retain Stylistic Fingerprints</strong> <span class="entry-meta">2025-05 · arXiv</span> <a href="https://arxiv.org/abs/2505.14608">arXiv ↗</a></span> <span class="entry-tldr">对抗攻击</span></summary>

- 背景 / 研究问题：规避攻击的轻易成功让人怀疑机器文本检测「本质不可行」；本文研究这类规避的边界在哪里。
- 方法：证明现有攻击（从提示工程到检测器引导优化）虽能打垮标准检测器，却抹不掉机器文本的风格「指纹」；利用风格特征空间的 few-shot 检测器对此类攻击鲁棒——随后又提出新的针对性改写攻击，反证风格不是万能防御。
- 结果：「风格指纹」是当前最稳的检测信号之一，但也存在专门绕过它的反例——攻防在风格维度进入拉锯。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>CoPA: Contrastive Paraphrase Attacks on LLM-Generated Text Detectors</strong> <span class="entry-meta">2025-05 · EMNLP 2025</span> <a href="https://arxiv.org/abs/2505.15337">arXiv ↗</a></span> <span class="entry-tldr">对抗攻击</span></summary>

- 背景 / 研究问题：改写攻击通常要训练专用改写器（数据与算力门槛高），且面对先进检测算法时攻击效力大打折扣。
- 方法：免训练的对比改写攻击：精心设计指令引导现成 LLM 产出更像人类的文本，再用对比机制对冲 LLM 固有的统计偏差（自带的机器味）。
- 结果：零训练成本下欺骗主流文本检测器，把「攻击门槛」拉到人人可复现（EMNLP 2025）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Revealing Weaknesses in Text Watermarking Through Self-Information Rewrite Attacks (SIRA)</strong> <span class="entry-meta">2025-05 · ICML 2025</span> <a href="https://arxiv.org/abs/2505.05190">arXiv ↗</a> <a href="https://github.com/YixinCheng/SIRA">代码</a></span> <span class="entry-tldr">对抗攻击</span></summary>

- 背景 / 研究问题：当前文本水印普遍把信号嵌入高熵 token 以保证质量——这个看似无害的设计选择本身埋着漏洞。
- 方法：自信息改写攻击（SIRA）：计算每个 token 的自信息以识别潜在的模式 token，只对这些 token 做定向改写，精准命中水印载体。
- 结果：暴露当前水印方案的一个广泛存在的脆弱点——「挑高熵 token 埋水印」的共识设计成了可预测的攻击面（ICML 2025）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Watermarking for AI Content Detection: A Review</strong> <span class="entry-meta">2025-04 · ICLR 2025 Workshop</span> <a href="https://arxiv.org/abs/2504.03765">arXiv ↗</a></span> <span class="entry-tldr">综述</span></summary>

- 背景 / 研究问题：生成式 AI 革命了文本、视觉、音频的内容创作，也带来错误信息、身份欺诈与内容篡改风险。
- 方法：面向实用场景的水印综述：建立文本 / 视觉 / 音频三模态水印方法的结构化分类法，按有效性、鲁棒性与实用性三轴批判性评估。
- 结果：识别出抗对抗攻击不足、跨内容类型缺乏标准化、隐私与所有权伦理三大挑战，并给出增强水印策略的研究议程（ICLR 2025 Workshop）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>DAMAGE: Detecting Adversarially Modified AI Generated Text</strong> <span class="entry-meta">2025-01 · arXiv</span> <a href="https://arxiv.org/abs/2501.03437">arXiv ↗</a></span> <span class="entry-tldr">有监督神经检测</span></summary>

- 背景 / 研究问题：「AI humanizer」在线工具专门把 AI 生成文本改写得能绕过检测软件——检测器面对的是被二次加工过的机器文本。
- 方法：定性评估 19 种 humanizer 与改写工具的语义保真度，证明许多现有检测器在人化文本上失效；继而用数据为中心的增强方法训练鲁棒检测器，并主动攻击自家检测器（微调模型专门对抗其预测）来检验跨 humanizer 泛化。
- 结果：增强后的检测器在保持低误报率的同时有效检测人化 AI 文本，且经受住自攻击考验。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>GenAI Content Detection Task 1: English and Multilingual Machine-Generated Text Detection</strong> <span class="entry-meta">2025-01 · COLING 2025</span> <a href="https://arxiv.org/abs/2501.11012">arXiv ↗</a> <a href="https://github.com/mbzuai-nlp/COLING-2025-Workshop-on-MGT-Detection-Task1">代码</a></span> <span class="entry-tldr">共享任务评测</span></summary>

- 背景 / 研究问题：COLING 2025 GenAI Workshop 的二分类机器文本检测共享任务，回应 AIGT 检测的社区评测需求。
- 方法：设单语（英语）与多语两个子任务；提供数据、系统排名与性能分数、参赛系统详述与提交深度分析。
- 结果：36 队参加单语、26 队参加多语子任务——大规模社区参与给出当前检测能力的截面。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>The Imitation Game Revisited: A Comprehensive Survey on Recent Advances in AI-generated Text Detection</strong> <span class="entry-meta">2025-01 · ESWA 2025</span> <a href="https://doi.org/10.1016/j.eswa.2025.126694">论文 ↗</a> <a href="https://github.com/Nicozwy/AIGTD-Survey">代码</a></span> <span class="entry-tldr">综述</span></summary>

- 背景 / 研究问题：AI 生成文本检测（AIGTD）方法爆发式增长，需要一篇承上启下的系统综述。
- 方法：暨南大学杨志伟等对 AIGTD 近年进展的全面综述：以「模仿游戏」为线索梳理检测方法谱系，配套 GitHub 论文清单（Nicozwy/AIGTD-Survey）持续维护。
- 结果：发表于 Expert Systems with Applications（272 卷, 2025，中科院一区 TOP），成为该领域引用最集中的综述之一。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>SoK: Watermarking for AI-Generated Content</strong> <span class="entry-meta">2024-11 · arXiv</span> <a href="https://arxiv.org/abs/2411.18479">arXiv ↗</a></span> <span class="entry-tldr">综述</span></summary>

- 背景 / 研究问题：生成式 AI 输出质量逼近人类创作，人机内容边界失守；水印是当前最有希望的区分手段，但缺一篇系统化的知识整理。
- 方法：SoK（知识系统化）论文：从历史与监管视角论证水印必要性，形式化水印方案的定义与期望属性，系统考察现有方法的关键目标与威胁模型。
- 结果：给 GenAI 水印领域立下统一的概念框架与威胁模型分类——后续水印论文的常引基准。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Text Fluoroscopy: Detecting LLM-Generated Text through Intrinsic Features</strong> <span class="entry-meta">2024-11 · EMNLP 2024</span> <a href="https://aclanthology.org/2024.emnlp-main.885/">论文 ↗</a> <a href="https://github.com/Fish-and-Sheep/Text-Fluoroscopy">代码</a></span> <span class="entry-tldr">有监督神经检测</span></summary>

- 背景 / 研究问题：现有检测方法用最后一层的语义特征，容易过拟合训练域、泛化能力不足。
- 方法：中科大团队提出的黑盒方法：改用文本的内在特征——投影到词表空间后，定位与首末层分布差异最大的中间层，从该层捕获人机文本的本质差异（「透视」因此得名）。
- 结果：检测 GPT-4 与 Claude3 跨域生成文本时平均分别提升 7.36% 与 2.84%，泛化性更好（EMNLP 2024）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>DE-MARK: Watermark Removal in Large Language Models</strong> <span class="entry-meta">2024-10 · ICML 2025</span> <a href="https://arxiv.org/abs/2410.13808">arXiv ↗</a> <a href="https://github.com/RayRuiboChen/De-mark">代码</a></span> <span class="entry-tldr">对抗攻击</span></summary>

- 背景 / 研究问题：n-gram 类水印（如绿名单）的鲁棒性尚未被充分探索。
- 方法：去水印框架：用「随机选择探测」的查询策略评估水印强度并识别 n-gram 水印中的红绿名单，从而精准移除或利用水印。
- 结果：在 Llama3、ChatGPT 等流行模型上高效完成水印移除与利用——水印方与攻击方的军备竞赛又一回合（ICML 2025）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>DeTeCtive: Detecting AI-generated Text via Multi-Level Contrastive Learning</strong> <span class="entry-meta">2024-10 · NeurIPS 2024</span> <a href="https://arxiv.org/abs/2410.20964">arXiv ↗</a> <a href="https://github.com/heyongxin233/DeTeCtive">代码</a></span> <span class="entry-tldr">有监督神经检测</span></summary>

- 背景 / 研究问题：手工特征 + 有监督二分类的范式遇到性能瓶颈与泛化困境，对 OOD 数据与新 LLM 基本失效。
- 方法：把检测重新定义为「区分不同作者写作风格」：多任务辅助 + 多层级对比学习框架学风格表示，配稠密信息检索管线做检测，无需针对新模型重训。
- 结果：OOD 与新 LLM 场景下显著泛化，即插即用（NeurIPS 2024）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>DetectRL</strong> <span class="entry-meta">2024-10 · NeurIPS 2024 D&amp;B</span> <a href="https://arxiv.org/abs/2410.23746">arXiv ↗</a></span> <span class="entry-tldr">检测基准</span></summary>

- 背景 / 研究问题：DetectGPT 等零样本方法在基准上表现亮眼，但真实使用场景（真实提示、人工修改、拼写噪声）下的可靠性未被检验。
- 方法：从 LLM 高误用风险领域收集人写数据，用流行 LLM 生成贴近真实应用的文本，再用启发式规则制造对抗样本——模拟各种提示用法、人工修订（如换词）与写作噪声（如拼写错误）。
- 结果：SOTA 检测技术在真实场景设定下明显掉分——该基准成为「实验室精度 ≠ 实战精度」的代表证据（NeurIPS 2024 D&B）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>RAFT: Realistic Attacks to Fool Text Detectors</strong> <span class="entry-meta">2024-10 · EMNLP 2024</span> <a href="https://arxiv.org/abs/2410.03658">arXiv ↗</a> <a href="https://github.com/JamesLWang/RAFT">代码</a></span> <span class="entry-tldr">对抗攻击</span></summary>

- 背景 / 研究问题：LLM 检测器的鲁棒性与可靠性不明，需要现实可行、不破坏文本质量的黑盒攻击来压测。
- 方法：RAFT：无语法错误的黑盒攻击——利用 LLM 词嵌入的可迁移性，在词级贪心选择候选扰动词，保持原文质量的同时 Fool 检测器。
- 结果：研究中所有检测器被攻破、最高降 99%，且攻击可跨源模型迁移；人工评估确认文本质量未受损（EMNLP 2024）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>SynthID-Text: Identifying AI-Generated Text Content</strong> <span class="entry-meta">2024-10 · Nature 2024</span> <a href="https://www.nature.com/articles/s41586-024-08025-4">论文 ↗</a> <span class="entry-meta">▲</span></span> <span class="entry-tldr">水印</span></summary>

- 背景 / 研究问题：水印能否以可忽略的质量代价部署到生产规模，并通过真实产品的检验。
- 方法：Google DeepMind 的锦标赛采样：每步生成若干候选 token，由检测函数打分，在质量与暗记强度间取最优；检测器输出三态判定，开源进 HuggingFace Transformers。
- 结果：登上 Nature：在 Gemini 生产流量上经千万级用户 A/B 检验，质量损失可忽略——水印从论文走向产品的里程碑。▲ 已在上方两轨给出深度条目。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>BiScope: AI-generated Text Detection by Checking Memorization of Preceding Tokens</strong> <span class="entry-meta">2024-06 · NeurIPS 2024</span> <a href="https://openreview.net/forum?id=Hew2JSDycr">论文 ↗</a> <a href="https://github.com/MarkGHX/BiScope">代码</a></span> <span class="entry-tldr">零样本统计检测</span></summary>

- 背景 / 研究问题：现有检测方法通过「LLM 从前缀预测下一个 token 的难度」取信号——只用了前向预测一个方向。
- 方法：普渡大学团队的关键观察：当前 token 的输出 logits 对紧邻前置 token 的「记忆」程度也携带强信号（自回归注意力对刚生成内容的残留）；据此双向利用 preceding token（记忆）与 next token（预测）信息做检测。
- 结果：检测精度与鲁棒性优于九个现有基线、超过 SOTA 非商业检测器（NeurIPS 2024）；代码开源（MarkGHX/BiScope）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Humanizing Machine-Generated Content: Evading AI-Text Detection through Adversarial Attack</strong> <span class="entry-meta">2024-05 · LREC-COLING 2024</span> <a href="https://aclanthology.org/2024.lrec-main.739/">论文 ↗</a></span> <span class="entry-tldr">对抗攻击</span></summary>

- 背景 / 研究问题：训练良好的检测器在未见数据上表现可靠，但面对改写等对抗攻击存在脆弱性。
- 方法：中科院软件所团队提出更广的一类对抗攻击：对机器生成内容做微小扰动以规避检测，分白盒与黑盒两种设定，并用动态场景下的对抗学习检验检测模型鲁棒性的提升空间。
- 结果：现有检测模型最快 10 秒内即可被攻破（机器文本被误判为人类写作）；迭代对抗学习能部分提升鲁棒性，但实用场景仍挑战巨大（LREC-COLING 2024）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>People cannot distinguish GPT-4 from a human in a Turing test</strong> <span class="entry-meta">2024-05 · arXiv</span> <a href="https://arxiv.org/abs/2405.08007">arXiv ↗</a></span> <span class="entry-tldr">人机协作检测</span></summary>

- 背景 / 研究问题：大模型通过图灵测试了吗？此前的测试缺乏随机对照与预注册，结论不牢。
- 方法：UCSD 团队的随机、对照、预注册图灵测试：参与者与人类 / ELIZA / GPT-3.5 / GPT-4 进行 5 分钟对话后判断对方是否人类。
- 结果：GPT-4 被判为人类的比例 54%（人类对照 67%、ELIZA 22%）——首个严格证明 AI 系统能通过交互式双人图灵测试的实证；通过策略分析发现风格与社交情感因素比「智能」更起作用。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>RAID</strong> <span class="entry-meta">2024-05 · ACL 2024</span> <a href="https://arxiv.org/abs/2405.07940">arXiv ↗</a></span> <span class="entry-tldr">检测基准</span></summary>

- 背景 / 研究问题：商用与开源检测器号称 99%+ 准确率，但极少在共享基准上评测，且既有基准不够难——缺采样策略变化、对抗攻击与开源生成器。
- 方法：当时最大最难的检测基准：600 万+ 生成文本，覆盖 11 个生成模型、8 个领域、11 种对抗攻击、4 种解码策略；据此评测 8 个开源 + 4 个闭源检测器。
- 结果：现有检测器被对抗攻击、采样策略变化、重复惩罚与未见生成器轻易愚弄——基准上的高分与真实鲁棒性是两回事（ACL 2024）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>ReMoDetect: Reward Modified Detection of LLM-Generated Text</strong> <span class="entry-meta">2024-05 · arXiv</span> <a href="https://arxiv.org/abs/2405.17382">arXiv ↗</a></span> <span class="entry-tldr">有监督神经检测</span></summary>

- 背景 / 研究问题：LLM 数量太多，逐个建模不现实——需要找所有对齐 LLM 的共同特征。
- 方法：关键发现：对齐训练让 LLM 生成的文本获得比人类文本更高的奖励模型偏好分——直接用奖励模型（RLHF 的 RM）做检测器，专吃「对齐味」。
- 结果：以对齐伪影为共同信号检测各类对齐 LLM 的生成文本，无需逐模型适配——「对齐本身留了指纹」。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Who Wrote This? The Key to Zero-Shot LLM-Generated Text Detection Is GECScore</strong> <span class="entry-meta">2024-05 · COLING 2025</span> <a href="https://arxiv.org/abs/2405.04286">arXiv ↗</a> <a href="https://github.com/NLP2CT/GECScore">代码</a></span> <span class="entry-tldr">零样本统计检测</span></summary>

- 背景 / 研究问题：白盒零样本检测器受限于源模型可访问性；黑盒零样本需要新的通用信号。
- 方法：观察：从 LLM 视角看，人类文本通常含更多语法错误——计算文本的语法纠错得分（GECScore：对文本做 GEC 修订再计算修改幅度）作检测统计量。
- 结果：XSum 与 Writing Prompts 上平均 AUROC 98.62%，超过现有零样本与有监督 SOTA——「语法正确度」这个朴素信号出奇地强（COLING 2025）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>SemEval-2024 Task 8: Multigenerator, Multidomain, and Multilingual Black-Box Machine-Generated Text Detection</strong> <span class="entry-meta">2024-04 · SemEval 2024</span> <a href="https://arxiv.org/abs/2404.14183">arXiv ↗</a> <a href="https://github.com/mbzuai-nlp/SemEval2024-task8">代码</a></span> <span class="entry-tldr">共享任务评测</span></summary>

- 背景 / 研究问题：社区需要覆盖多生成器、多领域、多语言的黑盒检测统一评测。
- 方法：SemEval-2024 Task 8 三子任务：A 人机二分类（单语 / 多语双轨）、B 识别具体生成模型、C 定位文本中人机切换点。
- 结果：参赛规模空前（A 单语 126 队、多语 59 队、B 70 队、C 30 队）——给出黑盒检测能力与任务难度的全景图。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>A Survey of AI-generated Text Forensic Systems</strong> <span class="entry-meta">2024-03 · arXiv</span> <a href="https://arxiv.org/abs/2403.01152">arXiv ↗</a></span> <span class="entry-tldr">综述</span></summary>

- 背景 / 研究问题：LLM 高质量文本带来宣传、错误信息与虚假信息风险，检测之外的取证能力（谁写的、怎么写的）被系统性忽视。
- 方法：综述 AI 生成文本取证系统：以检测（detection）、归属（attribution）、刻画（characterization）三大支柱建立分类学。
- 结果：把「检测」扩展为完整取证链条的框架性梳理——从「是不是 AI」走向「哪个 AI、什么性质」。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>M4GT-Bench</strong> <span class="entry-meta">2024-02 · ACL 2024</span> <a href="https://arxiv.org/abs/2402.11175">arXiv ↗</a></span> <span class="entry-tldr">检测基准</span></summary>

- 背景 / 研究问题：机器生成文本激增，需要多语言、多领域、多生成器的黑盒检测基准。
- 方法：基于 M4 语料库的基准：三个任务——单语与多语二分类、多路模型识别（判断具体由哪个模型生成）、混合人机文本检测（定位词级边界）。
- 结果：揭示检测器在多语言与混合文本上的短板——「哪一段是机器写的」从此成为标准评测维度（ACL 2024）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Ten Words Only Still Help: Improving Black-Box AI-Generated Text Detection via Proxy-Guided Efficient Re-Sampling (POGER)</strong> <span class="entry-meta">2024-02 · IJCAI 2024</span> <a href="https://arxiv.org/abs/2402.09199">arXiv ↗</a> <a href="https://github.com/ICTMCG/POGER">代码</a></span> <span class="entry-tldr">零样本统计检测</span></summary>

- 背景 / 研究问题：白盒方法性能好但需要模型内部状态；黑盒方法性能差——能不能在黑盒条件下估算出「伪白盒」特征？
- 方法：POGER：用代理模型引导的高效重采样估计词生成概率作为伪白盒特征——只需对文本中约 10 个代表性词做多次重采样。
- 结果：黑盒条件下显著逼近白盒方法性能，重采样开销被压到实用水平（IJCAI 2024）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Watermarking Makes Language Models Radioactive</strong> <span class="entry-meta">2024-02 · arXiv</span> <a href="https://arxiv.org/abs/2402.14904">arXiv ↗</a></span> <span class="entry-tldr">水印</span></summary>

- 背景 / 研究问题：能否检测出一个模型是否用（水印记号的）合成数据训练过？成员推断只适用于「已知可疑文本」且无统计保证。
- 方法：发现水印文本有「放射性」：用水印 LLM 的输出训练后续模型，水印信号会残留在模型权重中；提出专用于放射性检测的方法，以可证置信度检出微调模型里的水印残余，并把污染水平与水印鲁棒性、训练占比、微调过程关联。
- 结果：开放权重模型上可给出带统计保证的「用过水印数据」判定——合成数据追踪从文本层延伸到模型层。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>An Adaptive Watermark for Large Language Models</strong> <span class="entry-meta">2024-01 · ICML 2024</span> <a href="https://arxiv.org/abs/2401.13927">arXiv ↗</a></span> <span class="entry-tldr">水印</span></summary>

- 背景 / 研究问题：水印要在文本质量、安全性、鲁棒性与免提示免模型检测之间取平衡——固定绿名单方案容易被破解。
- 方法：自适应水印策略：只在用辅助模型测得的高熵 token 分布上加水印（低熵不动以保质量）；以「语义组」替代随机绿红名单——同义 token 共同进退，安全性更高。
- 结果：质量、鲁棒性与安全性的同时改进（ICML 2024）——绿名单水印谱系的重要进化。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Binoculars: Zero-Shot Detection of Machine-Generated Text</strong> <span class="entry-meta">2024-01 · ICML 2024</span> <a href="https://arxiv.org/abs/2401.12070">arXiv ↗</a> <span class="entry-meta">▲</span></span> <span class="entry-tldr">零样本统计检测</span></summary>

- 背景 / 研究问题：检测现代 LLM 文本被认为很难——LLM 与人的行为分布都太复杂。
- 方法：马里兰团队的「双筒望远镜」：对比两个密切相关语言模型（观测模型 + 性能模型）对同一文本的困惑度比值（Perplexity × 交叉困惑度），无需训练数据。
- 结果：0.01% 误报率下检出 90%+ 的 ChatGPT 及其他现代 LLM 样本，无需针对模型适配——零样本检测的新标杆（ICML 2024）。▲ 已在上方两轨给出深度条目。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Raidar: geneRative AI Detection viA Rewriting</strong> <span class="entry-meta">2024-01 · ICLR 2024</span> <a href="https://arxiv.org/abs/2401.12970">arXiv ↗</a></span> <span class="entry-tldr">有监督神经检测</span></summary>

- 背景 / 研究问题：黑盒 LLM 无 token 概率可取，Embedding 类方法又不适用于纯 API 场景。
- 方法：发现 LLM 改写人类文本的幅度显著大于改写 AI 文本的幅度（AI 文本被它视为「已经很好」）——让 LLM 重写待检文本、计算编辑距离即可判作者。
- 结果：跨新闻、创意写作、学生作文、代码、Yelp 评论与 arXiv 论文六域，使现有检测器 F1 最高提升 29 点；纯符号操作、天然适配黑盒（ICLR 2024）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Beat LLMs at Their Own Game: Zero-Shot LLM-Generated Text Detection via Querying ChatGPT</strong> <span class="entry-meta">2023-12 · EMNLP 2023</span> <a href="https://aclanthology.org/2023.emnlp-main.463/">论文 ↗</a> <a href="https://github.com/thunlp/LLM-generated-text-detection">代码</a></span> <span class="entry-tldr">有监督神经检测</span></summary>

- 背景 / 研究问题：LLM 滥用（学术作弊已有实案）使检测成为紧迫问题；有监督检测器泛化差。
- 方法：清华团队的零样本黑盒方法：让 ChatGPT 修订待检文本——直觉是 LLM 对「符合自身生成逻辑与统计模式」的文本改动更少；计算原文与修订版的相似度，越高越可能是机器文本。
- 结果：多数据集多任务上有效检测，泛化性与跨数据集稳定性优于对比方法（EMNLP 2023）；代码开源。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>A Ship of Theseus: Paraphrasing Capabilities for Detecting LLM-Generated Text</strong> <span class="entry-meta">2023-11 · ACL 2024</span> <a href="https://arxiv.org/abs/2311.08374">arXiv ↗</a></span> <span class="entry-tldr">有监督神经检测</span></summary>

- 背景 / 研究问题：忒修斯之船问题：文本被 LLM 反复改写后，作者身份归人类还是 AI？改写恰恰是规避检测的主要手段。
- 方法：系统研究 LLM 的改写能力与检测的关系：用改写工具多次迭代改写文本，考察作者身份在多次变换中的保持与漂移，并据此设计检测。
- 结果：揭示改写对人机文本的不同影响规律——「以改写对抗改写」的检测思路（ACL 2024）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>DEMASQ: Unmasking the ChatGPT Wordsmith</strong> <span class="entry-meta">2023-11 · NDSS 2024</span> <a href="https://arxiv.org/abs/2311.05019">arXiv ↗</a></span> <span class="entry-tldr">有监督神经检测</span></summary>

- 背景 / 研究问题：现有检测方法精度不足且局限于特定任务或领域，难以应对 ChatGPT 生成的真实内容。
- 方法：基于能量的检测模型 DEMASQ：同时建模人机文本在组成上的固有偏差，并显式纳入「人类为规避检测所做的修改」这一因素。
- 结果：准确识别 ChatGPT 生成内容，兼顾对人工规避手段的鲁棒性（NDSS 2024）——安全顶会对文本检测的背书。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>WaterBench: A Benchmark for LLM Watermarking</strong> <span class="entry-meta">2023-11 · ACL 2024</span> <a href="https://arxiv.org/abs/2311.07138">arXiv ↗</a></span> <span class="entry-tldr">水印</span></summary>

- 背景 / 研究问题：水印评测通常把生成与检测割裂开分别评——无法做无偏、全面、可比的评估。
- 方法：首个 LLM 水印综合基准：先把各方法的超参调到相同水印强度再做联合「生成-检测」评估；输入输出长度变化构成五类任务共 9 项；兼顾质量-强度-可检测性三维。
- 结果：为水印方法提供 apples-to-apples 的统一赛道（ACL 2024）——「调参到同强度再比」成为后续水印评测惯例。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Fast-DetectGPT: Efficient Zero-Shot Detection of Machine-Generated Text via Conditional Probability Curvature</strong> <span class="entry-meta">2023-10 · ICLR 2024</span> <a href="https://arxiv.org/abs/2310.05130">arXiv ↗</a> <a href="https://github.com/baoguangsheng/fast-detect-gpt">代码</a></span> <span class="entry-tldr">零样本统计检测</span></summary>

- 背景 / 研究问题：DetectGPT 性能好但计算贵——检测一段文本要对源 LLM 做上百次扰动查询。
- 方法：提出条件概率曲率：模型采样点处对数概率的曲率差异直接对应人机选词差异；据此用「采样替代扰动」，把 DetectGPT 的扰动步换成条件概率曲率计算。
- 结果：相对 DetectGPT 检测速度提升约 340 倍、AUROC 提升约 75%——零样本检测进入实用区间（ICLR 2024）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>GPT-who: An Information Density-based Machine-Generated Text Detector</strong> <span class="entry-meta">2023-10 · arXiv</span> <a href="https://arxiv.org/abs/2310.06202">arXiv ↗</a></span> <span class="entry-tldr">零样本统计检测</span></summary>

- 背景 / 研究问题：心理语言学的均匀信息密度（UID）原理指出人类倾向均匀铺开信息——这个原理能否区分人机文本？
- 方法：首个心理语言学启发的域无关统计检测器：用 UID 特征建模每个 LLM 与人类作者的独特统计签名。
- 结果：4 个大规模基准上超过 GLTR、GPTZero、DetectGPT、OpenAI 检测器与 ZeroGPT 等 SOTA 超过 20%（跨域平均），计算便宜、表示可解释。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>MULTITuDE</strong> <span class="entry-meta">2023-10 · EMNLP 2023</span> <a href="https://arxiv.org/abs/2310.13606">arXiv ↗</a></span> <span class="entry-tldr">检测基准</span></summary>

- 背景 / 研究问题：LLM 生成非英文逼真文本的能力与多语场景下检测器的表现都缺乏研究，现有基准缺真实多语文本、生成器偏旧。
- 方法：多语检测基准：11 种语言（含中文、阿拉伯语、捷克语等）、8 个多语 LLM 的 74,081 条真实与机器文本；对比零样本（统计 / 黑盒）与微调检测器在未见语言上的泛化。
- 结果：揭示检测器对语言学上相近与迥异语言的泛化差异——多语检测成为独立研究维度（EMNLP 2023）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>SeqXGPT: Sentence-Level AI-Generated Text Detection</strong> <span class="entry-meta">2023-10 · EMNLP 2023</span> <a href="https://arxiv.org/abs/2310.08903">arXiv ↗</a></span> <span class="entry-tldr">有监督神经检测</span></summary>

- 背景 / 研究问题：现有工作只做文档级检测；真实场景里 LLM 常被用来「润色」——文档中人与机器句子混杂。
- 方法：构造含 LLM 润色句的句级检测数据集；SeqXGPT 用白盒 LLM 的对数概率列表作特征（形如语音中的波形），用卷积 + 自注意力网络建模。
- 结果：句级与文档级检测都验证有效——「哪句是机器写的」从此可答（EMNLP 2023）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>ConDA: Contrastive Domain Adaptation for AI-generated Text Detection</strong> <span class="entry-meta">2023-09 · IJCNLP-AACL 2023</span> <a href="https://arxiv.org/abs/2309.03992">arXiv ↗</a> <a href="https://github.com/AmritaBh/ConDA-gen-text-detection">代码</a></span> <span class="entry-tldr">有监督神经检测</span></summary>

- 背景 / 研究问题：新 LLM 层出不穷，为每个生成器收集标注数据不现实；但未标注文本充足。
- 方法：把「跨生成器检测」表述为无监督域自适应：源域有标注、目标域（新 LLM 的文本）无标注，用对比域适应框架做对齐。
- 结果：AI 新闻文本检测上有效适配未见过的新生成器（IJCNLP-AACL 2023）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>J-Guard: Robust Guardrails against Unreliable Text Generation by LLMs</strong> <span class="entry-meta">2023-09 · IJCNLP-AACL 2023</span> <a href="https://arxiv.org/abs/2309.03164">arXiv ↗</a></span> <span class="entry-tldr">有监督神经检测</span></summary>

- 背景 / 研究问题：AI 生成新闻是错误信息的重要源头；通用检测器直接用于新闻易误报（损害媒体声誉），且对简单对抗攻击脆弱。
- 方法：跨学科框架 J-Guard：以新闻写作风格的领域知识引导现有监督检测器，提升对 AI 新闻的检测与对抗鲁棒性。
- 结果：在 AI 生成新闻上提高检测可靠性与抗攻击性（IJCNLP-AACL 2023）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Fighting fire with fire: Can chatgpt detect ai-generated text?</strong> <span class="entry-meta">2023-08 · SIGKDD Explorations</span> <a href="https://arxiv.org/abs/2308.01284">arXiv ↗</a> <a href="https://github.com/amritabh/chatgpt-as-detector">代码</a></span> <span class="entry-tldr">有监督神经检测</span></summary>

- 背景 / 研究问题：ChatGPT 被越来越多地用作数据标注器，但它自己能否充当 AI 生成文本的检测器，此前无人系统检验。
- 方法：评测 ChatGPT 在公开数据集上的零样本人机文本检测表现，重点考察它对「AI 生成」与「人类撰写」两个方向的检测是否对称。
- 结果：给出 ChatGPT 嵌入自动化检测管线的可行路径——只需解决任务的一个侧面、其余由此推导；代码与数据开源（SIGKDD Explorations）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>A Private Watermark for Large Language Models</strong> <span class="entry-meta">2023-07 · ICLR 2024</span> <a href="https://arxiv.org/abs/2307.16230">arXiv ↗</a> <a href="https://github.com/THU-BPM/private_watermark">代码</a></span> <span class="entry-tldr">水印</span></summary>

- 背景 / 研究问题：现有水印的公开检测需要使用生成时的同一密钥——密钥一旦泄露，任何人都能伪造水印，安全性与防伪性不足。
- 方法：清华团队提出不可伪造的公开可验证水印 UPV：生成与检测使用两个不同的神经网络，共享 token 嵌入参数使检测高效；伪造者必须攻破检测网络才能伪造。
- 结果：高检测精度与计算效率；后续分析证实从检测网络伪造水印的复杂度极高；代码开源并集成进 MarkLLM 框架（ICLR 2024）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Is ChatGPT Involved in Texts? Measure the Polish Ratio to Detect ChatGPT-Generated Text</strong> <span class="entry-meta">2023-07 · arXiv</span> <a href="https://arxiv.org/abs/2307.11380">arXiv ↗</a></span> <span class="entry-tldr">零样本统计检测</span></summary>

- 背景 / 研究问题：既有检测器只区分「纯 ChatGPT 生成」与「纯人类撰写」，对人机协作文本（如 ChatGPT 润色）束手无策。
- 方法：发布 HPPT 数据集（ChatGPT 润色的学术摘要对照对）；提出 Polish Ratio 指标——量化 ChatGPT 相对人写原文的修改幅度，度量其「参与度」。
- 结果：模型在 HPPT、HC3、CDB 上更鲁棒；Polish Ratio 为判定提供可解释的量化依据——「润色检测」问题的早期提出者。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>OUTFOX: LLM-generated Essay Detection through In-context Learning with Adversarially Generated Examples</strong> <span class="entry-meta">2023-07 · AAAI 2024</span> <a href="https://arxiv.org/abs/2307.11729">arXiv ↗</a> <a href="https://github.com/ryuryukke/OUTFOX">代码</a></span> <span class="entry-tldr">有监督神经检测</span></summary>

- 背景 / 研究问题：检测器对简单改写已脆弱；更现实的威胁是恶意用户根据检测结果迭代规避——但此前研究未假设这种「互看输出」的自适应攻防。
- 方法：OUTFOX 框架让双方互为教材：攻击者拿检测器的预测标签做 in-context learning 生成更难检测的文章，检测器再拿这些对抗样本做 in-context learning 学会检测强攻击者。
- 结果：学生作文域上，对攻击者生成文本的检测最多提升 41.3 F1；对非攻击文本达 96.9 F1 的 SOTA 检测（AAAI 2024）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>RADAR: Robust AI-Text Detection via Adversarial Learning</strong> <span class="entry-meta">2023-07 · NeurIPS 2023</span> <a href="https://arxiv.org/abs/2307.03838">arXiv ↗</a></span> <span class="entry-tldr">有监督神经检测</span></summary>

- 背景 / 研究问题：现有 AI 文本检测器被证明对 LLM 改写不鲁棒。
- 方法：RADAR 联合对抗训练改写器与检测器：改写器以生成规避检测的现实内容为目标，双方以对方反馈持续更新，形成攻防共进化。
- 结果：8 个 LLM（Pythia、Dolly、GPT-J、LLaMA、Vicuna 等）× 4 数据集上显著超越现有方法，改写场景下优势最明显；从指令微调 LLM 到其他 LLM 有强迁移性（NeurIPS 2023）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Check Me If You Can: Detecting ChatGPT-Generated Academic Writing using CheckGPT</strong> <span class="entry-meta">2023-06 · arXiv</span> <a href="https://arxiv.org/abs/2306.05524">arXiv ↗</a></span> <span class="entry-tldr">有监督神经检测</span></summary>

- 背景 / 研究问题：ChatGPT 用于学术写作引发巨大争议，学界对其生成内容可检测性的系统研究缺失。
- 方法：先考察现有检测工具与人类评估者（240+ 研究者/学生）的双重不足，再提出深度神经框架 CheckGPT 捕获 ChatGPT 学术文本中细微而深层的语义与语言模式。
- 结果：在各学科、各检测任务上全面验证有效——学术场景 ChatGPT 检测的系统方案；与 GPABench2 基准同文发布。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>GPABenchmark</strong> <span class="entry-meta">2023-06 · arXiv</span> <a href="https://arxiv.org/abs/2306.05524">arXiv ↗</a></span> <span class="entry-tldr">检测基准</span></summary>

- 背景 / 研究问题：学术写作场景的 ChatGPT 检测需要大规模、多学科的人机对照语料。
- 方法：GPABench2：280 万+对比样本，覆盖人写、GPT 全写、GPT 续写、GPT 润色四类摘要，横跨计算机、物理、人文社科三学科。
- 结果：为检测算法开发与 LLM 学术政策制定提供实证基础；「续写」「润色」两类使基准贴近真实学术使用方式。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Intrinsic Dimension Estimation for Robust Detection of AI-Generated Texts</strong> <span class="entry-meta">2023-06 · arXiv</span> <a href="https://arxiv.org/abs/2306.04723">arXiv ↗</a></span> <span class="entry-tldr">零样本统计检测</span></summary>

- 背景 / 研究问题：需要一个跨文本域、跨写手水平、跨生成模型与采样方法都稳定不变的人机判别信号。
- 方法：提出人类文本的不变量——文本嵌入集合所张流形的内在维度：字母语言的流畅人写文本平均约 9（中文约 7），AI 生成文本一致地低约 1.5；据此构建分数型检测器。
- 结果：检测精度对文本域、生成模型与写手水平稳定，在模型无关与跨域场景下大幅超越 SOTA 检测器——「几何量做检测」的代表作。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>On the Reliability of Watermarks for Large Language Models</strong> <span class="entry-meta">2023-06 · ICLR 2024</span> <a href="https://arxiv.org/abs/2306.04634">arXiv ↗</a> <a href="https://github.com/jwkirchenbauer/lm-watermarking">代码</a></span> <span class="entry-tldr">水印</span></summary>

- 背景 / 研究问题：水印被寄予厚望，但真实野外场景下——文本被用户修改、被完全改写、或混入长人写文档——水印还可靠吗？
- 方法：系统研究水印文本经人工改写、无水印 LLM 改写、混入人写长文后的可检测性；并提出对大文档内嵌短水印 span 敏感的新检测方案。
- 结果：改写后水印仍可检测——改写统计上倾向于泄漏原文 n-gram 乃至更长片段；强人工改写下设 1e-5 假阳性率，平均观测 800 token 即可高置信检出（ICLR 2024）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Towards a Robust Detection of Language Model Generated Text: Is ChatGPT that Easy to Detect?</strong> <span class="entry-meta">2023-06 · TALN 2023</span> <a href="https://arxiv.org/abs/2306.05871">arXiv ↗</a></span> <span class="entry-tldr">有监督神经检测</span></summary>

- 背景 / 研究问题：法语等非英语场景的 ChatGPT 检测器开发方法与鲁棒性检验缺失。
- 方法：把英文数据集翻译为法语训练分类器，重点检验域外数据与常见攻击方案下的鲁棒性。
- 结果：域内检测有效且对基础攻击有一定鲁棒性，但域外场景明显脆弱——域内测试结论不可贸然外推；翻译数据集与模型开源（Inria，TALN 2023）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>DeepfakeText-Dataset</strong> <span class="entry-meta">2023-05 · ACL 2024</span> <a href="https://arxiv.org/abs/2305.13242">arXiv ↗</a></span> <span class="entry-tldr">检测基准</span></summary>

- 背景 / 研究问题：既有评测局限于特定领域或特定 LLM；实用中检测器面对的是不知来源、跨域跨模型的文本。
- 方法：MAGE：汇聚多域人写文本与多个 LLM 生成文本的综合测试床，系统评测各种真实场景下的检测难度。
- 结果：跨域尤其分布外（OOD）区分难度大——两源的语言学差异在缩小；但最强检测器仍能识别 86.54% 的新 LLM 生成 OOD 文本，给出可行性的底线参照（ACL 2024，代码开源）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>DetectLLM: Leveraging Log Rank Information for Zero-Shot Detection of Machine-Generated Text</strong> <span class="entry-meta">2023-05 · arXiv</span> <a href="https://arxiv.org/abs/2306.05540">arXiv ↗</a> <a href="https://github.com/mbzuai-nlp/detectllm">代码</a></span> <span class="entry-tldr">零样本统计检测</span></summary>

- 背景 / 研究问题：零样本检测方法表现尚可，但仍有可观改进空间。
- 方法：两个利用对数秩信息的新零样本方法：DetectLLM-LRR（快速高效）与 DetectLLM-NPR（更准但需扰动）；并给出效率—性能权衡的使用指南。
- 结果：3 个数据集 × 7 个语言模型上分别以 3.9 与 1.75 AUROC 绝对提升超越 SOTA；NPR 需要的扰动次数更少、更实用（代码开源）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>DNA-GPT: Divergent N-Gram Analysis for Training-Free Detection of GPT-Generated Text</strong> <span class="entry-meta">2023-05 · ICLR 2024</span> <a href="https://arxiv.org/abs/2305.17359">arXiv ↗</a> <a href="https://github.com/Xianjun-Yang/DNA-GPT">代码</a></span> <span class="entry-tldr">零样本统计检测</span></summary>

- 背景 / 研究问题：训练型检测器适应新域不灵活且缺乏解释力；检测方法进步赶不上 LLM 迭代速度。
- 方法：免训练的散度 N 元分析：把文本在中途截断，仅用前半部分让 LLM 重新生成后半部分，再对比原文与新后半——黑盒下用 N-gram 分析、白盒下用概率散度度量差异。
- 结果：在 text-davinci-003、GPT-3.5-turbo、GPT-4、GPT-NeoX-20B、Llama-13B 上，4 个英文 + 1 个德文数据集零样本 SOTA，超越 OpenAI 自家分类器（ICLR 2024）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Efficient Detection of LLM-generated Texts with a Bayesian Surrogate Model</strong> <span class="entry-meta">2023-05 · arXiv</span> <a href="https://arxiv.org/abs/2305.16617">arXiv ↗</a></span> <span class="entry-tldr">零样本统计检测</span></summary>

- 背景 / 研究问题：DetectGPT 检测单篇文本需向源 LLM 发起数百次扰动查询——效率是其走向实用的最大瓶颈。
- 方法：引入贝叶斯代理模型：基于贝叶斯不确定性挑选典型样本、再把典型样本的分数插值到其余样本，大幅压缩查询次数。
- 结果：低查询预算下显著超越现有方法——检测 Llama 系生成文本时 2–3 次查询即可超过 DetectGPT 的 200 次查询。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Ghostbuster: Detecting Text Ghostwritten by Large Language Models</strong> <span class="entry-meta">2023-05 · arXiv</span> <a href="https://arxiv.org/abs/2305.15047">arXiv ↗</a></span> <span class="entry-tldr">零样本统计检测</span></summary>

- 背景 / 研究问题：多数检测方法依赖目标模型的 token 概率，对黑盒模型或未知版本失效。
- 方法：把文档送入一系列较弱语言模型，对其特征组合做结构化搜索，再在选定特征上训练分类器；同步发布学生作文、创意写作、新闻三个领域的新基准。
- 结果：跨域评测 99.0 F1（比此前最佳 +5.9）；跨写作域 +7.5、跨提示策略 +2.1、跨语言模型 +4.4 F1；并分析扰动、改写攻击与非母语者文本上的鲁棒性。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>GPT Paternity Test: GPT Generated Text Detection with GPT Genetic Inheritance</strong> <span class="entry-meta">2023-05 · arXiv</span> <a href="https://arxiv.org/abs/2305.12519">arXiv ↗</a></span> <span class="entry-tldr">有监督神经检测</span></summary>

- 背景 / 研究问题：高质量检测通常要访问模型内部特征；黑盒模型只能靠代理模型，检测质量受损——如何提取黑盒模型生成文本的深层内在特征？
- 方法：把生成过程视为 prompt 与模型内在特性的耦合：DPIC 用辅助 LLM 先重建候选文本的 prompt，再用该 prompt 让辅助 LLM 重新生成文本，以候选与再生成的相似度为检测特征，从而解耦 prompt 的干扰。
- 结果：黑盒场景下实现高质量检测——「GPT 亲子鉴定」的遗传继承视角（arXiv 现名 DPIC）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>GPT-Sentinel: Distinguishing Human and ChatGPT Generated Content</strong> <span class="entry-meta">2023-05 · arXiv</span> <a href="https://arxiv.org/abs/2305.07969">arXiv ↗</a></span> <span class="entry-tldr">有监督神经检测</span></summary>

- 背景 / 研究问题：ChatGPT 生成内容的检测需要公开数据与基线模型。
- 方法：发布 OpenGPTText 数据集（ChatGPT 改写的内容）；设计并训练 RoBERTa 与 T5 两个分类器，另做可解释性研究。
- 结果：测试集准确率 97%+；可解释性分析展示模型区分人机文本关键特征的能力。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>HowkGPT: Investigating the Detection of ChatGPT-generated University Student Homework through Context-Aware Perplexity Analysis</strong> <span class="entry-meta">2023-05 · arXiv</span> <a href="https://arxiv.org/abs/2305.18226">arXiv ↗</a></span> <span class="entry-tldr">零样本统计检测</span></summary>

- 背景 / 研究问题：教育界正为区分学生自写与 AI 生成的作业而挣扎，需要可落地的作业检测方案。
- 方法：HowkGPT：基于学术作业数据集及元数据，用预训练 LLM 计算困惑度得分，再按作业类目设定类别特定阈值——语境感知的困惑度分析。
- 结果：类目特定阈值显著提升检测精度——学术诚信场景的轻量、可解释方案。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>LLMDet: A Third Party Large Language Models Generated Text Detection Tool</strong> <span class="entry-meta">2023-05 · EMNLP 2023 Findings</span> <a href="https://arxiv.org/abs/2305.15004">arXiv ↗</a></span> <span class="entry-tldr">零样本统计检测</span></summary>

- 背景 / 研究问题：现有工具依赖对 LLM 的访问、只能二分人机，无法满足细粒度溯源、中介判断与快速检测的需求。
- 方法：第三方检测工具：记录显著 n-gram 的下一 token 概率作特征，为每个 LLM 计算代理困惑度，联合分析定位文本来源模型（GPT-2、OPT、Llama 等）。
- 结果：识别人类文本精度 98.54%、速度快 5 倍；可轻松扩展到新的开源模型（EMNLP 2023 Findings，开源）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>M4</strong> <span class="entry-meta">2023-05 · arXiv</span> <a href="https://arxiv.org/abs/2305.14902">arXiv ↗</a></span> <span class="entry-tldr">检测基准</span></summary>

- 背景 / 研究问题：LLM 文本在新闻、教育、学术领域的误用风险上升，需要多生成器、多领域、多语言的检测基准。
- 方法：M4：大规模多生成器、多领域、多语言机器文本检测语料，并开展广泛的实证研究。
- 结果：检测器在未见域或未见 LLM 上泛化困难、倾向把机器文本误判为人写——问题远未解决；M4 后来衍生出 M4GT-Bench，成为该领域最常用基准之一。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Multiscale Positive-Unlabeled Detection of AI-Generated Texts</strong> <span class="entry-meta">2023-05 · ICLR 2024 (Spotlight)</span> <a href="https://arxiv.org/abs/2305.18149">arXiv ↗</a> <a href="https://github.com/yuchuantian/aigc_text_detector">代码</a></span> <span class="entry-tldr">有监督神经检测</span></summary>

- 背景 / 研究问题：主流检测器在短信、推文、评论等短文本上普遍失效——短机器文本太像人类写作。
- 方法：MPU 框架：承认短机器文本的「类人性」，把检测重述为部分正例-未标注（PU）学习问题——长度敏感的多尺度 PU 损失 + 用抽象循环模型估计尺度可变语料的正例先验 + 文本多尺度模块扩充训练语料。
- 结果：长文本检测增强的同时，短文本检测显著改进；在各类长短文本基准上超越现有检测器（ICLR 2024 Spotlight）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Red Teaming Language Model Detectors with Language Models</strong> <span class="entry-meta">2023-05 · TACL 2023</span> <a href="https://arxiv.org/abs/2305.19713">arXiv ↗</a> <a href="https://github.com/shizhouxing/LLM-Detector-Robustness">代码</a></span> <span class="entry-tldr">对抗攻击</span></summary>

- 背景 / 研究问题：LLM 检测器自身的鲁棒性缺乏系统压测；且此前攻击未考虑「辅助攻击的 LLM 也被检测器保护」这一更难设定。
- 方法：两类攻击：按上下文做同义词替换、自动搜索改变写作风格的指令提示——均由辅助 LLM 生成；攻击者可在辅助 LLM 也被保护的情况下完成规避。
- 结果：研究中的所有检测器均被有效攻破且生成文本仍流畅可信——检测系统鲁棒性亟待改进（TACL 2023）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Smaller Language Models are Better Black-box Detectors</strong> <span class="entry-meta">2023-05 · EACL 2024</span> <a href="https://arxiv.org/abs/2305.09859">arXiv ↗</a></span> <span class="entry-tldr">有监督神经检测</span></summary>

- 背景 / 研究问题：多数检测方法需要目标模型的 logits 或采样能力；黑盒检测缺乏好方案。
- 方法：基于「生成文本在其生成器似然下局部最优、人类文本不是」的观察，系统考察小模型与部分训练模型充当通用黑盒检测器的效果。
- 结果：反直觉发现：更小、欠训练的模型反而是更好的通用检测器；检测器与生成器是否同源数据并不关键——OPT-125M 检 ChatGPT 生成 AUC 达 0.81，GPTJ-6B 仅 0.45（EACL 2024）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>ArguGPT</strong> <span class="entry-meta">2023-04 · arXiv</span> <a href="https://arxiv.org/pdf/2304.07666.pdf">arXiv ↗</a></span> <span class="entry-tldr">检测基准</span></summary>

- 背景 / 研究问题：英语教学界既要检测 GPT 生成的作文，也需要理解 AIGC 的词汇、句法与风格特征。
- 方法：ArguGPT：4,038 篇 7 个 GPT 模型生成的议论文平衡语料（提示来自课堂作业、TOEFL、GRE 三源），配对分数匹配的等量人写作文；并请英语教师做人工甄别。
- 结果：教师初判准确率仅 61%、一轮简单自训后升至 67%——教师裸检不可靠；语料免费公开，成为教育场景检测研究的常用基准。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>ArguGPT: evaluating, understanding and identifying argumentative essays generated by GPT models</strong> <span class="entry-meta">2023-04 · arXiv</span> <a href="https://arxiv.org/abs/2304.07666">arXiv ↗</a> <a href="https://github.com/huhailinguist/ArguGPT">代码</a></span> <span class="entry-tldr">有监督神经检测</span></summary>

- 背景 / 研究问题：检测之外，教学界还需要「理解」GPT 作文与人类作文差在哪里。
- 方法：对 ArguGPT 语料做语言学分析（词汇复杂度、句法结构、风格），测试现有检测器并构建 SVM 与 RoBERTa 检测器。
- 结果：语言学发现：机器句法更复杂、人类词汇更复杂；RoBERTa 微调后达 90%+ 准确率——「分析 + 检测」双产出的教育场景工作。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>CHEAT</strong> <span class="entry-meta">2023-04 · arXiv</span> <a href="https://arxiv.org/abs/2304.12008">arXiv ↗</a></span> <span class="entry-tldr">检测基准</span></summary>

- 背景 / 研究问题：恶意用户可用 ChatGPT 合成虚假学术内容，检测算法开发亟需大规模数据集。
- 方法：CHEAT：35,304 条 ChatGPT 写的论文摘要，覆盖纯生成、润色、混合三种代表模式；先分析 ChatGPT 对学术界的潜在负面影响，再据此透彻评测现有检测算法。
- 结果：ChatGPT 摘要可检测，但人类参与度越高（润色、混合）检测越难——「人机混合」难度的早期量化证据；数据集开源。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Does Human Collaboration Enhance the Accuracy and Reliability of AI-Generated Text Detection?</strong> <span class="entry-meta">2023-04 · HCOMP 2023</span> <a href="https://arxiv.org/abs/2304.01002">arXiv ↗</a></span> <span class="entry-tldr">人机协作检测</span></summary>

- 背景 / 研究问题：此前研究只考察个体人类检测 deepfake 文本的能力，「人类协作」能否提升检测从未被检验。
- 方法：两组对照实验：AMT 非专家与 Upwork 写作专家，比较协作与个体的检测准确率，并分析人类使用的判别解释。
- 结果：协作提升两组检测准确率——非专家 +6.36%、专家 +12.76%；最强调试线索是文本缺乏连贯性与一致性（HCOMP 2023）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Origin Tracing and Detecting of Large Language Models</strong> <span class="entry-meta">2023-04 · arXiv</span> <a href="https://arxiv.org/abs/2304.14072">arXiv ↗</a></span> <span class="entry-tldr">有监督神经检测</span></summary>

- 背景 / 研究问题：机构竞相发布 LLM，文本来源难以追溯；类似人类学的起源追踪，LLM 的「出身」溯源同样重要。
- 方法：提出利用 LLM 间的对比特征、提取模型级特征的溯源算法：白盒黑盒均可用，只需少量数据，并可扩展到新出现的模型。
- 结果：无需访问 GPT-3 即可检测 GPT-3 文本；给出溯源难度与模型间相似度的观察，并呼吁 LLM 提供商关注伦理问题。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Can AI-Generated Text be Reliably Detected?</strong> <span class="entry-meta">2023-03 · arXiv</span> <a href="https://arxiv.org/abs/2303.11156">arXiv ↗</a> <a href="https://github.com/vinusankars/Reliability-of-AI-text-detectors">代码</a></span> <span class="entry-tldr">对抗攻击</span></summary>

- 背景 / 研究问题：检测器在各自设定下有效，但面对主动攻击者时的可靠性未经压测。
- 方法：递归改写攻击系统压测各类检测方案——水印、神经网络检测器、零样本分类器、检索式检测器（约 300 token 段落）；并研究对水印 LLM 的欺骗攻击（让人写文本被误判为 AI）。
- 结果：递归改写可显著降低检测率而文本质量仅轻微退化；攻击者无需白盒访问即可推断隐藏的 AI 文本签名——「可靠检测」远未达成。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>MGTBench</strong> <span class="entry-meta">2023-03 · arXiv</span> <a href="https://arxiv.org/abs/2303.14822">arXiv ↗</a></span> <span class="entry-tldr">检测基准</span></summary>

- 背景 / 研究问题：既有检测方法各自用不同架构、数据集与实验设置评测，缺乏统一框架；对 ChatGPT 等强 LLM 的检测表现也不明。
- 方法：MGTBench：首个面向强 LLM（ChatGPT-turbo、Claude 等）的机器文本检测基准框架，在公开数据集与策划生成文本上做广泛评测。
- 结果：消融显示：文本更长通常检测更好；多数方法用少得多的训练样本即可达到相近性能；并深入更难的文本归属任务。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Paraphrasing evades detectors of AI-generated text, but retrieval is an effective defense</strong> <span class="entry-meta">2023-03 · NeurIPS 2023</span> <a href="https://arxiv.org/abs/2303.13408">arXiv ↗</a> <a href="https://github.com/martiansideofthemoon/ai-detection-paraphrases">代码</a></span> <span class="entry-tldr">对抗攻击</span></summary>

- 背景 / 研究问题：检测算法对「AI 文本被改写」的鲁棒性不清。
- 方法：构建 11B 参数改写模型 DIPPER（可段落级改写、条件化上下文、控制词汇多样性与内容重排），用它改写 3 个 LLM（含 GPT-3.5-davinci-003）的生成文本来压测检测器；再提出检索式防御——API 提供方维护生成数据库，候选文本命中阈值内即判 AI。
- 结果：DIPPER 成功规避水印、GPTZero、DetectGPT 与 OpenAI 分类器——DetectGPT 从 70.3% 跌至 4.6%（1% 假阳性）且语义几乎不变；检索防御实证有效（NeurIPS 2023）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Stylometric Detection of AI-Generated Text in Twitter Timelines</strong> <span class="entry-meta">2023-03 · arXiv</span> <a href="https://arxiv.org/abs/2303.03697">arXiv ↗</a></span> <span class="entry-tldr">有监督神经检测</span></summary>

- 背景 / 研究问题：威胁场景：攻击者劫持可信账号并用语言生成器发布错误信息；推文短，SOTA 检测器难以定位「时间线中 AI 从哪条开始接管」。
- 方法：文体计量信号辅助检测，两个任务：区分人与 AI 推文、检测时间线中 AI 开始生成的时点。
- 结果：文体特征有效增强 SOTA 预训练检测器——短文本与时间线场景的信号补充。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>The Science of Detecting LLM-Generated Texts</strong> <span class="entry-meta">2023-02 · arXiv</span> <a href="https://arxiv.org/abs/2303.07205">arXiv ↗</a></span> <span class="entry-tldr">综述</span></summary>

- 背景 / 研究问题：检测方法虽多，但对成果与挑战的全局理解仍然缺乏。
- 方法：综述现有 LLM 生成文本检测技术，强调未来研究的关键考量。
- 结果：指出全面评测指标的开发与开源 LLM 带来的威胁两大方向——方法论层面的梳理与议程设定。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>A watermark for large language models</strong> <span class="entry-meta">2023-01 · ICML 2023</span> <a href="https://arxiv.org/abs/2301.10226">arXiv ↗</a> <a href="https://github.com/jwkirchenbauer/lm-watermarking">代码</a> <span class="entry-meta">▲</span></span> <span class="entry-tldr">水印</span></summary>

- 背景 / 研究问题：LLM 输出的潜在危害可通过水印缓解——把人眼不可见、算法可检测的信号埋进生成文本。
- 方法：KGW 框架：生成每个词前用哈希随机选「绿名单」token、采样时软性偏向绿色 token；开源算法即可检测（无需模型 API 或参数），配可解释 p 值的统计检验与信息论敏感性分析。
- 结果：水印对文本质量影响可忽略；在 OPT 家族多十亿参数模型上验证并讨论鲁棒性与安全性——LLM 文本水印的范式起点（ICML 2023）。▲ 已在上方两轨给出深度条目。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>DetectGPT: Zero-Shot Machine-Generated Text Detection using Probability Curvature</strong> <span class="entry-meta">2023-01 · ICML 2023</span> <a href="https://arxiv.org/abs/2301.11305">arXiv ↗</a> <a href="https://github.com/eric-mitchell/detect-gpt">代码</a> <span class="entry-meta">▲</span></span> <span class="entry-tldr">零样本统计检测</span></summary>

- 背景 / 研究问题：LLM 流畅度与使用量俱增，零样本检测工具成为刚需。
- 方法：关键发现：LLM 采样文本倾向落在模型 log 概率函数的负曲率区；据此定义曲率判据——只需目标模型的 log 概率与另一通用模型（如 T5）的随机扰动，无需训练分类器、无需收集数据、无需水印。
- 结果：判别力超越现有零样本方法——20B GPT-NeoX 生成假新闻的检测从最强基线 0.81 AUROC 提升至 0.95（ICML 2023）。▲ 已在上方两轨给出深度条目。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>HC3</strong> <span class="entry-meta">2023-01 · arXiv</span> <a href="https://arxiv.org/abs/2301.07597">arXiv ↗</a></span> <span class="entry-tldr">检测基准</span></summary>

- 背景 / 研究问题：ChatGPT 一方面令人好奇它与人类专家的差距，另一方面引发假新闻、剽窃等社会担忧——两者都需要人机对比语料。
- 方法：HC3：数万条人类专家与 ChatGPT 对同一问题的对比回答，覆盖开放域、金融、医疗、法律、心理五大领域；开展人类评估与语言学分析。
- 结果：揭示 ChatGPT 回答的多项特征与局限，并附检测实验——英文 ChatGPT 检测研究最常用的对照语料之一。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>HC3-Chinese</strong> <span class="entry-meta">2023-01 · arXiv</span> <a href="https://arxiv.org/abs/2301.07597">arXiv ↗</a></span> <span class="entry-tldr">检测基准</span></summary>

- 背景 / 研究问题：ChatGPT 检测研究集中于英文，中文场景缺乏公开人机对照语料。
- 方法：HC3 的中文子集：中文问题的人类与 ChatGPT 对比回答（与 HC3 同篇论文发布）。
- 结果：为中文 ChatGPT 检测提供首批公开对照语料——后续多个中文检测工作（如 Polish Ratio 的 CDB 基准）的数据源。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>How Close is ChatGPT to Human Experts? Comparison Corpus, Evaluation, and Detection</strong> <span class="entry-meta">2023-01 · arXiv</span> <a href="https://arxiv.org/abs/2301.07597">arXiv ↗</a> <a href="https://github.com/hello-simpleai/chatgpt-comparison-detection">代码</a></span> <span class="entry-tldr">有监督神经检测</span></summary>

- 背景 / 研究问题：ChatGPT 离人类专家有多远、其文本能否被有效检测，两个问题都需系统回答。
- 方法：收集跨五领域的人机对比回答，做人类评估、语言学分析与检测实验（构建多种检测器系统比较），论文题目即「ChatGPT 离人类专家有多近」。
- 结果：给出 ChatGPT 回答特征、与人类专家的差异与差距的系统画像，以及检测有效性的实证结论——早期 ChatGPT 研究的常引参照。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Scientific-articles Benchmark</strong> <span class="entry-meta">2023 · TrustNLP 2023</span> <a href="https://aclanthology.org/2023.trustnlp-1.17/">论文 ↗</a></span> <span class="entry-tldr">检测基准</span></summary>

- 背景 / 研究问题：生成式 NLP 产出的内容已与人类写作几乎无差，学术出版中真实研究贡献难辨，且生成信息可能事实错误甚至全然虚构。
- 方法：TUM 团队的科学论文人机对照基准：人类撰写与 SCIgen、GPT-2、GPT-3、ChatGPT、Galactica 生成的论文；描述生成与提取管线，以四种分类器为基线，重点考察泛化能力与可解释性。
- 结果：凸显检测器的强弱项，迈向更鲁棒的科学文献真伪甄别——守护科学文献完整性的一步（TrustNLP 2023）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>CoCo: Coherence-Enhanced Machine-Generated Text Detection</strong> <span class="entry-meta">2022-12 · EMNLP 2023</span> <a href="https://arxiv.org/abs/2212.10341">arXiv ↗</a></span> <span class="entry-tldr">有监督神经检测</span></summary>

- 背景 / 研究问题：既有检测器以粗粒度序列为输入、标准交叉熵微调——忽视文本的语言结构，也难以应对线上海量数据下的低资源场景。
- 方法：CoCo：把连贯性信息以图的形式编码进文本表示；对比学习框架 + 改进的对比损失防止简单样本拖垮性能。
- 结果：两个公开 + 两个自建数据集上显著超越 SOTA；意外发现最新 LM 生成的文本反而可能比旧模型更易检测，并给出初步解释（EMNLP 2023）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Real or Fake Text? Investigating the Abilities of Language Models to Detect AI-Generated Text</strong> <span class="entry-meta">2022-12 · AAAI 2023</span> <a href="https://arxiv.org/abs/2212.12672">arXiv ↗</a></span> <span class="entry-tldr">人机协作检测</span></summary>

- 背景 / 研究问题：既有研究只考察整篇人写或整篇机器的设定；更现实的是文本以人写开头、中途转入模型生成。
- 方法：大规模人类研究：分析标注者能力差异、激励机制与模型规模、解码策略、微调、体裁等变量对人类检测的影响；收集错误标注并分析句级特征与模型错误类型的关联。
- 结果：标注者普遍吃力但个体差异大、有激励可随时间进步；不同体裁诱发模型不同类型的错误；发布 RoFT 数据集——21,000+ 人类标注与错误分类（AAAI 2023）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Attribution and Obfuscation of Neural Text Authorship: A Data Mining Perspective</strong> <span class="entry-meta">2022-10 · ACM SIGKDD Explorations</span> <a href="https://arxiv.org/abs/2210.10488">arXiv ↗</a></span> <span class="entry-tldr">综述</span></summary>

- 背景 / 研究问题：作者归属（AA）与作者混淆（AO）是隐私研究的双生问题；神经文本生成爆发后，作者身份必须考虑人类、机器及其混合三种情形。
- 方法：从数据挖掘视角系统综述神经文本作者归属与混淆的近期文献，考察传统 AA/AO 方案在神经文本上的局限。
- 结果：给出该交叉方向的局限分析与研究议程——检测与反检测的对称视角（ACM SIGKDD Explorations）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Deepfake Text Detection: Limitations and Opportunities</strong> <span class="entry-meta">2022-10 · S&amp;P 2023</span> <a href="https://arxiv.org/abs/2210.09421">arXiv ↗</a></span> <span class="entry-tldr">综述</span></summary>

- 背景 / 研究问题：已有 deepfake 文本检测防御的真实世界适用性缺乏透彻理解。
- 方法：从 4 个在线服务（Transformer 工具驱动）收集真实在野 deepfake 文本评测泛化能力；开发多种低成本对抗攻击，考察自适应攻击者下的鲁棒性。
- 结果：许多防御在实测场景下相比原始报告性能显著退化；利用文本内容的语义信息是提升鲁棒性与泛化的有前景方向（IEEE S&P 2023）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Distillation-Resistant Watermarking for Model Protection in NLP</strong> <span class="entry-meta">2022-10 · arXiv</span> <a href="https://arxiv.org/abs/2210.03312">arXiv ↗</a> <a href="https://github.com/xuandongzhao/drw">代码</a></span> <span class="entry-tldr">水印</span></summary>

- 背景 / 研究问题：NLP 模型可被查询-蒸馏式窃取；已有水印保护只适用于图像，文本模型缺乏手段。
- 方法：DRW：向受害者模型的预测概率注入与密钥对应的水印，通过探测嫌疑模型检出密钥；理论上证明受保护模型精度保持在界内。
- 结果：文本分类、词性标注、命名实体识别等任务上以 100% 平均精度检出窃取嫌疑（此前方法在两个任务上失败）——文本域的模型层水印。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Machine Generated Text: A Comprehensive Survey of Threat Models and Detection Methods</strong> <span class="entry-meta">2022-10 · ACM Trustworthy AI</span> <a href="https://arxiv.org/abs/2210.07321">arXiv ↗</a></span> <span class="entry-tldr">综述</span></summary>

- 背景 / 研究问题：机器生成文本越来越难辨；强力开源模型免费可得、易用工具扩散（ChatGPT 为典型），滥用渠道众多。
- 方法：双支柱综述：当代 NLG 系统威胁模型的系统分析 + 当时最完整的机器文本检测方法综述；把检测置于网络安全与社会语境之中。
- 结果：为最关键威胁模型与检测系统自身的可信性（公平、鲁棒、问责）给出强指导——检测领域引用最集中的全面综述之一（ACM Trustworthy AI）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Watermarking Pre-trained Language Models with Backdooring</strong> <span class="entry-meta">2022-10 · arXiv</span> <a href="https://arxiv.org/abs/2210.07543">arXiv ↗</a></span> <span class="entry-tldr">水印</span></summary>

- 背景 / 研究问题：PLM 经下游微调后所有权难以主张——灾难性遗忘让传统指纹失效。
- 方法：多任务学习框架给 PLM 嵌入后门水印：由所有者定义的特定输入触发；除稀有词外，常用词的组合也可作触发，避免被轻易察觉。
- 结果：多个数据集上水印高成功率鲁棒提取，受后续微调影响小——PLM 所有权保护的早期可行方案。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>CATER: Intellectual Property Protection on Text Generation APIs via Conditional Watermarks</strong> <span class="entry-meta">2022-09 · NeurIPS 2022</span> <a href="https://arxiv.org/abs/2209.08773">arXiv ↗</a> <a href="https://github.com/xlhex/cater_neurips">代码</a></span> <span class="entry-tldr">水印</span></summary>

- 背景 / 研究问题：文本生成 API 可被模仿攻击窃取；此前水印方案可被词频统计侦破。
- 方法：条件水印框架 CATER：优化决定水印规则，最小化整体词分布失真的同时最大化条件选词的变化；理论上证明即使完全知晓 CATER 机制的攻击者也无法从大量候选词对中经统计检视揭示水印。
- 结果：高阶条件使可疑（未使用）水印呈指数增长——更隐蔽；在架构不匹配与跨域模仿攻击下仍能有效认定侵权，对生成质量影响可忽略（NeurIPS 2022）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Findings of the RuATD Shared Task 2022 on Artificial Text Detection in Russian</strong> <span class="entry-meta">2022-06 · Dialogue 2022</span> <a href="https://arxiv.org/abs/2206.01583">arXiv ↗</a> <a href="https://github.com/dialogue-evaluation/RuATD">代码</a></span> <span class="entry-tldr">共享任务评测</span></summary>

- 背景 / 研究问题：俄语人工文本检测缺乏社区级系统评测。
- 方法：RuATD 共享任务（Dialogue 2022）：13 个微调于翻译、改写、摘要、简化等任务的生成模型 + 回译与零样本生成，配多域真实俄语文本；两个子任务——人机二元分类与作者识别；提供计数与 BERT 基线及人类评估。
- 结果：二元分类 30 队、作者识别 8 队提交，多数队伍大幅超越基线；代码与人类评估结果公开——非英语检测的早期社区评测。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Human Heuristics for AI-Generated Language Are Flawed</strong> <span class="entry-meta">2022-06 · arXiv</span> <a href="https://arxiv.org/abs/2206.07271">arXiv ↗</a></span> <span class="entry-tldr">人机协作检测</span></summary>

- 背景 / 研究问题：AI 语言日益混入聊天、邮件与社媒，且常被冒充人写——新型欺骗与操纵风险上升。
- 方法：六个实验（N=4,600）：参与者辨别专业、款待、约会场景中 AI 生成的自我陈述；计算分析人类判断所依据的语言特征。
- 结果：参与者无法识别 SOTA 语言模型的生成；人类依赖直觉但有缺陷的启发式（第一人称代词、缩略词、家庭话题 → 人写），这些启发式可被利用，使 AI 文本「比人更像人」；建议「AI 口音」等对策。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>TuringBench</strong> <span class="entry-meta">2021 · EMNLP 2021 Findings</span> <a href="https://aclanthology.org/2021.findings-emnlp.172/">论文 ↗</a></span> <span class="entry-tldr">检测基准</span></summary>

- 背景 / 研究问题：神经文本生成时代，缺乏系统研究「图灵测试」问题的统一基准环境。
- 方法：TURINGBENCH：200K 人写或机器生成样本、20 个标签（人类、GPT-1、GPT-2 全系、GPT-3、GROVER×3、CTRL、XLM、XLNet×2、FAIR_wmt19/20、Transformer-XL、PPLM×2）；图灵测试（TT）与作者归属（AA）两个任务；网站与排行榜。
- 结果：GPT-3 与 FAIR_wmt20 是「赢家」——在五个 SOTA 检测模型下 F1 最低、生成文本最像人；PSU 团队持续维护（EMNLP 2021 Findings）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Automatic Detection of Machine Generated Text: A Critical Survey</strong> <span class="entry-meta">2020-11 · COLING 2020</span> <a href="https://arxiv.org/abs/2011.01314">arXiv ↗</a></span> <span class="entry-tldr">综述</span></summary>

- 背景 / 研究问题：文本生成模型可被滥用于假新闻、假评论；NLP 与 ML 社区检测工作爆发，但缺乏批判性综述为新人引路。
- 方法：对该快速膨胀文献的批判性综述；并对 SOTA 检测器做深入的错误分析。
- 结果：给出该问题的全面理解与研究方向指引——机器文本检测领域最早的系统性批判综述之一（COLING 2020）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Neural Deepfake Detection with Factual Structure of Text</strong> <span class="entry-meta">2020-10 · EMNLP 2020</span> <a href="https://arxiv.org/abs/2010.07475">arXiv ↗</a></span> <span class="entry-tldr">有监督神经检测</span></summary>

- 背景 / 研究问题：既有方法用粗粒度表示，难以捕获文档的事实结构——而统计分析表明这正是人机文本的判别性因素。
- 方法：图模型：把文档的事实结构表示为实体图，用图神经网络学习句表示，组合成文档表示做预测，并对相邻句子间的关系做序列建模。
- 结果：两个公开 deepfake 数据集上显著超越以 RoBERTa 为骨干的强基线；模型分析证实它能捕捉人机文本事实结构的差异（EMNLP 2020）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>RoFT: A Tool for Real vs Fake Text Detection</strong> <span class="entry-meta">2020-10 · EMNLP 2020 Demo</span> <a href="https://aclanthology.org/2020.emnlp-demos.25/">论文 ↗</a></span> <span class="entry-tldr">人机协作检测</span></summary>

- 背景 / 研究问题：NLG 系统质量评估与「人类如何感知生成文本」都困难且关键——需要把公众拉进检测任务。
- 方法：RoFT 网站：邀请用户在多领域尝试检测机器文本；提出新颖的评估任务——定位「人写开头、中途转入机器生成」的边界句。
- 结果：给出机器生成新闻文章检测的初步人类评估结果；后来扩展为 AAAI 2023 的 21K 标注 RoFT 数据集（见 2022-12 条目）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>TweepFake</strong> <span class="entry-meta">2020-07 · PLoS ONE</span> <a href="https://arxiv.org/abs/2008.00036">arXiv ↗</a></span> <span class="entry-tldr">检测基准</span></summary>

- 背景 / 研究问题：社交网络上的机器生成文本检测此前无人涉足；深度伪造推文可能污染公共讨论。
- 方法：首个真实 deepfake 推文数据集：23 个真实活跃于 Twitter 的 bot 账号（模仿 17 个人类账号）的推文，生成技术涵盖 Markov 链、RNN、RNN+Markov、LSTM、GPT-2；配对被模仿者的推文，共 25,572 条平衡语料；评测 13 种检测器。
- 结果：公开于 Kaggle，给出社媒短文本 deepfake 检测的基线与挑战——「真实在野」deepfake 语料的先例（PLoS ONE）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Automatic Detection of Generated Text is Easiest when Humans are Fooled</strong> <span class="entry-meta">2019-11 · ACL 2020</span> <a href="https://arxiv.org/abs/1911.00650">arXiv ↗</a></span> <span class="entry-tldr">有监督神经检测</span></summary>

- 背景 / 研究问题：人与自动判别器依据不同线索做判断；解码策略的改进对两类检测者的影响需要细致的基准分析。
- 方法：对 top-k、核采样、未截断随机采样三种解码策略做细致基准化，分别考察人类与自动判别器的表现随摘录长度的变化。
- 结果：解码方法的改进主要优化「骗过人类」，代价是引入统计异常使自动检测更容易；多句摘录仍能骗过专家人类评估者 30%+ 的时间——评估生成系统的人机检测须并用（ACL 2020）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>GLTR: Statistical Detection and Visualization of Generated Text</strong> <span class="entry-meta">2019-06 · ACL 2019 Demo</span> <a href="https://arxiv.org/abs/1906.04043">arXiv ↗</a> <a href="https://github.com/HendrikStrobelt/detecting-fake-text">代码</a></span> <span class="entry-tldr">零样本统计检测</span></summary>

- 背景 / 研究问题：语言模型的快速进步带来滥用隐忧，需要非专家也能用、能看懂的解释性检测工具。
- 方法：GLTR：一套基线统计方法检测跨常见采样方案的生成痕迹，并把每个 token 按其在该模型下的似然做可视化标注，辅助人工判读。
- 结果：人类受试实验中，GLTR 的标注方案把假文本人工检出率从 54% 提升到 72%（无需任何训练）；开源并公开部署，被广泛使用（ACL 2019 Demo）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Real or fake? Learning to discriminate machine from human generated text</strong> <span class="entry-meta">2019-06 · arXiv</span> <a href="https://arxiv.org/abs/1906.03351">arXiv ↗</a></span> <span class="entry-tldr">有监督神经检测</span></summary>

- 背景 / 研究问题：能量模型（EBM）在连续空间成功，但难以直接建模文本序列——高维离散输入下负样本难挖。
- 方法：旁路方案：用预训练自回归语言模型生成负样本，EBM 在语言模型的「残差」上工作，训练区分真实文本与自回归模型的生成文本。
- 结果：EBM 对生成器架构变化的泛化出奇地好，但对生成器所用训练集更敏感——检测器泛化维度的早期实证。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Defending Against Neural Fake News by Removing LLMs' Greatest Weakness</strong> <span class="entry-meta">2019-05 · NeurIPS 2019</span> <a href="https://arxiv.org/abs/1905.12616">arXiv ↗</a> <a href="https://github.com/rowanz/grover">代码</a></span> <span class="entry-tldr">有监督神经检测</span></summary>

- 背景 / 研究问题：自然语言生成的双用途担忧：底层技术可生成模仿真实新闻风格的定向宣传（神经假新闻）；防御研究需要威胁建模式的系统方法。
- 方法：先造矛：可控生成模型 Grover——给定标题生成全文，人类认为其生成比人写谣言更可信；再铸盾：系统研究用 Grover 检测 Grover——强生成器本身是否最佳防御。
- 结果：最好判别器 73% 准确率（中等训练数据）；Grover 自检 Grover 达 92%——证明公开释放强生成器对防御的重要性，并披露其最大弱点（NeurIPS 2019）。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>GROVER Dataset</strong> <span class="entry-meta">2019-05 · NeurIPS 2019</span> <a href="https://arxiv.org/abs/1905.12616">arXiv ↗</a></span> <span class="entry-tldr">检测基准</span></summary>

- 背景 / 研究问题：神经假新闻检测需要真实新闻与机器生成新闻的大规模对照语料。
- 方法：GROVER 论文配套数据集：真实新闻与 Grover 各规格模型生成的新闻文章对照（与 Grover 自检 92% 的结论同源）。
- 结果：成为 deepfake 文本检测研究的经典基准之一——「生成器即检测器」范式的数据基础。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>Computer-Generated Text Detection Using Machine Learning: A Systematic Review</strong> <span class="entry-meta">Springer</span> <a href="https://link.springer.com/chapter/10.1007/978-3-319-41754-7_43">论文 ↗</a></span> <span class="entry-tldr">综述</span></summary>

- 背景 / 研究问题：深度学习之前的机器生成文本（模板、规则、统计系统）已被讨论多年，但检测文献散乱、缺乏系统梳理。
- 方法：Beresneva 的系统综述：全面梳理基于机器学习的计算机生成文本检测方法（NLDB/NLPIS 2016，LNCS 9612）。
- 结果：领域最早的系统综述之一——为「统计特征 + 分类器」时代的检测研究绘出文献地图，深度学习检测时代的参照原点。
</details>

<details class="paper-entry">
<summary><span class="entry-line"><strong>GPT-2 Output Dataset</strong> <span class="entry-meta">GitHub</span> <a href="https://github.com/openai/gpt-2-output-dataset">论文 ↗</a></span> <span class="entry-tldr">检测基准</span></summary>

- 背景 / 研究问题：GPT-2 发布策略争议背景下，OpenAI 需要研究「能否可靠检测 GPT-2 输出」来支撑其分阶段发布决策（配套论文 Release Strategies and the Social Impacts of Language Models）。
- 方法：发布 WebText 人写文本 + GPT-2 四个尺寸（small/medium/large/xl）各 250K 生成样本（随机与 top-k 采样），附检测器训练代码；系统评测检测器在不同模型尺寸、采样策略与训练样本量下的表现。
- 结果：GPT-2 检测器在 top-k 采样文本上检出率 90%+（少量样本即可训练），随机采样下降至约 70–80%——采样策略决定可检测性；成为机器文本检测研究的事实标准语料。
</details>

## 看点

欧盟 AI Act 的透明度条款把「AI 生成内容须可识别」变成合规义务，水印从学术玩具升格为产品需求；但对抗鲁棒性决定它是真治理还是安慰剂——能被一次同义替换洗掉的水印，只是把责任转嫁给了检测方。
