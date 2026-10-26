---
name: 量化、蒸馏与参数高效微调
en: Compression & Efficient Tuning
parent: efficiency
order: 1
status: active
summary: 把大模型塞进小显存：量化、LoRA 家族与知识蒸馏的成本三连降。
keyPapers:
  - "LoRA: Low-Rank Adaptation（2021）"
  - QLoRA（2023）
  - LLM.int8() / AWQ / GGUF 量化生态（2022–2024）
keyLabs:
  - Microsoft
  - 华盛顿大学（Qwen 系微调生态）
  - llama.cpp / GGUF 社区
tags: [量化, LoRA, 蒸馏]
---

LoRA 的洞见是「微调改变的不是权重本身而是权重的低秩增量」：冻结原矩阵、只训练秩 16 的两个小矩阵，可训练参数骤降三个数量级，消费级显卡微调 7B 模型从此可行。QLoRA 再叠加 4bit 量化基座，把门槛压到一张 24G 卡；QLoRA 式「量化底座 + 低秩头」成为开源社区的标准微调姿势。

量化生态在民间野蛮生长：llama.cpp 的 GGUF 格式让 MacBook 跑 LLM 成为生活方式，AWQ/GPTQ 把精度损失控制到心理可接受范围，2024–2025 年 FP8/FP4 以下的原生训练量化（NVFP4）开始从部署侧反哺训练侧。蒸馏则是「数量级压缩」的另一条路——DeepSeek-R1 蒸馏版证明 7B 学生可以继承教师大部分推理人格。

## 看点

「量化——尤其是 KV cache 量化」是长上下文普及的隐形前提；而「结构化剪枝能否卷土重来」在 MoE 时代有了新的答案空间。
