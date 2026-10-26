---
name: 扩散模型与图像生成
en: Diffusion & Image Generation
parent: multimodal
order: 2
status: active
summary: 从 DDPM 到 latent diffusion 再到流匹配：概率去噪如何成为视觉生成的主流物理。
keyPapers:
  - Denoising Diffusion Probabilistic Models（2020）
  - High-Resolution Image Synthesis with Latent Diffusion（2022）
  - Flow Matching / SD3（2023–2024）
keyLabs:
  - Stability AI
  - OpenAI（DALL·E 系列）
  - Black Forest Labs（FLUX）
tags: [扩散模型, 文生图, 流匹配]
---

扩散模型的想法朴素得惊人：给图像逐步加噪，再学习逆向去噪。DDPM（2020）证明了这条路在质量上能打，Latent Diffusion（2022）把过程搬进 VAE 隐空间让它在消费级显卡上跑通，配合 Stable Diffusion 的开源，直接造就了全民文生图的时代。

2023–2024 年的两大主线：一是**可控性**——ControlNet 把姿态、边缘、深度图变成硬约束，LoRA 让个人风格定制成为十分钟教程；二是**底层替换**——DiT 架构（U-Net → Transformer）与流匹配（flow matching）训练更稳、路径更直，SD3 与 FLUX 代表了新范式。DALL·E/GPT-4o 的路线则把生成塞进自回归 token 框架，与扩散分庭抗礼。

## 看点

文生图的战场正从「像不像」转向「听不听话」：长 prompt 的组合语义遵循（画七个杯子、三个倒扣）仍是失败重灾区，也是各家刷榜的新前线。
