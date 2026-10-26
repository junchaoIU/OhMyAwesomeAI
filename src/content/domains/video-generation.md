---
name: 视频生成
en: Video Generation
parent: multimodal
order: 3
status: emerging
summary: Sora 开启的「视频即 token」路线：时空 patch、DiT 骨架，以及物理一致性这道真正的高墙。
keyPapers:
  - Sora 技术报告（2024，Video as a Patch Sequence）
  - W.A.L.T / Movie Gen / Veo 系列（2024）
  - HunyuanVideo / Wan（2024–2025，开源）
keyLabs:
  - OpenAI
  - Google DeepMind（Veo）
  - Meta（Movie Gen）
  - 快手 / 阿里（开源系）
tags: [Sora, DiT, 世界模拟器]
---

Sora（2024）的贡献与其说是画质，不如说是范式宣言：把视频统一为时空 patch 的序列，用 DiT 大规模训练——视频生成从此是「序列生成问题」，可以直接继承语言模型的一切规模化经验。此后 Veo、Movie Gen 与开源的 HunyuanVideo、Wan 沿这条路线快速迭代，几秒到几十秒的文生视频已进入产品化（广告、短视频素材、电影预演）。

真正的护城河不是分辨率而是**一致性**：角色跨镜头的同一性、物体永久性（object permanence）、因果物理（液体倒进杯子）。这类失败被普遍解读为「缺世界模型」——模型在拟合像素统计而非物理规律。LeCun 一系因此主张放弃生成式路线转向 JEPA 式预测；主流工程派则押注规模与数据（合成 3D、物理引擎渲染）能隐式学出物理。

## 看点

「视频生成是通向世界模拟器的路径」还是「昂贵的像素幻觉机」——这场赌局的结果将同时决定具身智能的预训练方案。
