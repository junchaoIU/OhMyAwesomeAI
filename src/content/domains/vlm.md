---
name: 视觉语言模型
en: Vision-Language Models
parent: multimodal
order: 1
status: active
summary: 从 CLIP 对齐到原生多模态：让语言模型睁眼理解图像、视频与界面的技术主线。
keyPapers:
  - Learning Transferable Visual Models（2021，CLIP）
  - Visual Instruction Tuning（2023，LLaVA）
  - Flamingo（2022）
keyLabs:
  - OpenAI
  - Google DeepMind
  - Apple
tags: [CLIP, VLM, 视觉指令微调]
---

VLM 的技术史可以浓缩为三步：CLIP（2021）用 4 亿图文对做对比学习，得到第一个「视觉-语言共享嵌入空间」，至今仍是大多数 VLM 的视觉底座；Flamingo（2022）证明了「冻结 LLM + 交叉注意力适配器」即可获得强 few-shot 视觉对话能力；LLaVA（2023）用 GPT-4 生成的图文指令数据把整个配方压缩到两张卡能跑，引爆了开源 VLM 生态。

2024 年后的走向是「原生多模态」：不再外挂视觉编码器，而是在预训练之初就混合图文（甚至音视频）token，GPT-4o、Gemini 代表了这条路线的产品形态——低延迟、流式、听看说一体。理解任务的短板从识别转向空间推理与精细 grounding（数不清物体、看不懂图表结构、指代歧义）。

## 看点

视觉 token 的「经济问题」：一张高清图动辄上千 token，分辨率与成本的权衡（动态裁剪、token 压缩）是 VLM 落地的隐形战场。
