---
name: 仿真到现实迁移
en: Sim-to-Real Transfer
parent: embodied
order: 2
status: active
summary: 在模拟器里学会、在物理世界里活下来：域随机化、GPU 并行仿真与视觉策略迁移的百年工程。
keyPapers:
  - Domain Randomization（2017，Tobin et al.）
  - Isaac Gym / Isaac Lab（2021–2024，GPU 并行仿真）
  - DexPBT / 灵巧手系列（2022–2024）
keyLabs:
  - NVIDIA
  - UC Berkeley
  - Agility / Figure 等本体厂商
tags: [仿真, 域随机化, 并行训练]
---

仿真的诱惑是显而易见的：GPU 里摔倒一百万次不花一分钱。Isaac Gym 一类 GPU 并行仿真器把数千个环境塞进一张卡，PPO 训练四足步态从「数周真机调试」压缩到「数小时仿真训练」，域随机化（把摩擦、质量、延迟随机抖动）逼出鲁棒策略——波士顿动力之外的第二条通向稳定行走的路，也是强化学习给机器人领域最大的礼物。

但 Sim2Real 的裂缝始终存在：接触动力学、材质形变、传感器噪声的「现实长尾」无法穷举。视觉侧的差距更棘手，逼出了「仿真渲染 → 真实图像」的翻译器（domain adaptation）。2024 年后的新思路是双轨制：仿真练「底层反射」（步态、抓取），真机与 VLA 学「高层语义」，两层各取所长。

## 看点

世界模型若能给出「足够真实的可微模拟器」，Sim2Real 可能被「Sim-is-Real」取代——在那之前，随机化与保守控制仍是过桥的护栏。
