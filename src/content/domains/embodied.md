---
name: 具身智能
en: Embodied AI
order: 7
status: emerging
summary: 给智能一个身体：视觉-语言-动作模型、仿真到现实迁移，以及机器人领域的数据鸿沟之辩。
keyPapers:
  - "RT-2: Vision-Language-Action Models（2023）"
  - "Octo: An Open-Source Generalist Robot Policy（2024）"
  - π0（2024，Physical Intelligence）
keyLabs:
  - Google DeepMind Robotics
  - Physical Intelligence
  - Stanford / Berkeley
  - Tesla Optimus
tags: [机器人, VLA, 仿真]
---

## 解决什么问题

语言模型读过整个人类文明，机器人却连「把桌上的杯子递给我」都做不稳。具身智能研究**智能与物理世界的接口**：感知真实场景、理解自然语言指令、输出连续控制信号，并在现实的混乱与不可逆中存活。

## 当前图景

2022 年前，机器人学习的主流还是「每个任务一套专用策略」；RT-1/RT-2 之后，范式转向 VLA（视觉-语言-动作）大模型：把机器人数据与互联网图文语料联合训练，让「开抽屉」继承「抽屉是什么」的常识。2024–2025 年，π0、RDT、OpenVLA 等把这条路线推向开源，diffusion 式动作头成为输出连续控制的标准做法。

数据的获取是核心瓶颈：真机遥操作昂贵（每小时数据成本以百美元计），仿真有 Sim2Real 鸿沟。两条缓解路线并行：一是规模化仿真（Isaac Lab、MuJoCo 并行化）加域随机化；二是把互联网视频当作「观察数据」预训练世界模型。人形机器人本体在 2024 年后迎来资本热潮，但「本体热、大脑冷」的批评不绝于耳。

## 开放问题

- 机器人领域有没有自己的「互联网级数据集」，VLA 的 Scaling Law 在哪交汇？
- 世界模型（视频预测）能否成为机器人的「预训练」，还是控制信号必须来自真机？
- Sim2Real 是工程问题，还是存在原理性的「现实不可压缩」？
