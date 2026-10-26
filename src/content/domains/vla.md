---
name: 视觉-语言-动作模型
en: Vision-Language-Action Models
parent: embodied
order: 1
status: emerging
summary: 机器人版的多模态大模型：把图像与指令直接映射为连续控制信号，通用机器人策略的赌注。
keyPapers:
  - RT-2（2023，Google DeepMind）
  - OpenVLA（2024，7B 开源 VLA）
  - π0（2024，Physical Intelligence）
keyLabs:
  - Google DeepMind Robotics
  - Physical Intelligence
  - 斯坦福 / 伯克利（OpenVLA）
tags: [VLA, 机器人学习, 通用策略]
---

RT-2 的核心实验是「机器人数据不多，但可以蹭互联网的常识」：把机器人动作离散化为 token，与图文联合训练，模型展现出**语义泛化**——训练里从没见过「把灭霸的手套拿给我」，但认识灭霸、认识手套，就能执行。这证明了 VLA 路线的想象力：机器人技能不再逐个编程，而是从语言模型的常识里「继承」。

2024–2025 年生态成型：OpenVLA（7B，全开源）成为学术基线；π0 用流匹配（flow matching）动作头输出连续控制，在折叠衣物等长程灵巧任务上树立新标准；国内 RDT、Galbot 等沿多本体数据合并路线推进。共同瓶颈依旧：真机数据以百万计的演示仍然太贵，各家或建遥操作工厂、或转向仿真合成。

## 看点

VLA 的 Scaling Law 还没有被确证——数据量从 1 万到 100 万演示，能力曲线是平滑还是跃迁，是这个领域未来两年最重要的问题。
