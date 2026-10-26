---
name: 多模态
en: Multimodal
order: 5
status: active
summary: 让模型睁眼看世界、动手作画：视觉语言模型、扩散生成与视频生成，以及「理解与生成为何长期分家」的合流趋势。
keyPapers:
  - An Image is Worth 16x16 Words（2021，ViT）
  - Learning Transferable Visual Models（2021，CLIP）
  - High-Resolution Image Synthesis with Latent Diffusion（2022）
keyLabs:
  - OpenAI
  - Google DeepMind
  - Stability AI
tags: [VLM, 扩散模型, 视频生成]
---

## 解决什么问题

语言只是人类经验的压缩包，原始经验是视觉、听觉与运动的。多模态研究如何让模型**消费**（理解图像/视频/音频）与**生产**（生成像素/波形）非语言信号，并追问：统一的 token 序列能否覆盖全部模态？

## 当前图景

理解侧，CLIP 用对比学习对齐了图文表征，ViT 把图像切成 patch 塞进 Transformer，二者合流成今天的 VLM 范式：视觉编码器 + 投影层 + 语言模型（LLaVA 式开源配方），GPT-4V/4o、Gemini 进一步走向原生多模态与流式交互。生成侧，扩散模型自 2020 年起取代 GAN 成为图像生成主流，Latent Diffusion 把计算压进隐空间使消费级显卡可玩，DiT（扩散 Transformer）架构接管视频生成后，Sora 展示了「视频即时空 patch 的生成」这条路的上限。

2024 年后两条线开始合流：统一模型既做理解又做生成（自回归与扩散作为解码头并存），多模态不再是一个「附加能力」而是前沿模型的默认形态。

## 开放问题

- 理解与生成的统一：自回归 token 与连续扩散，哪个才是通用生成底座？
- 视频生成的「物理一致性」瓶颈是数据问题还是归纳偏置问题？
- 模态对齐到什么程度才算「理解」——grounding、指代、空间推理仍是大短板。
