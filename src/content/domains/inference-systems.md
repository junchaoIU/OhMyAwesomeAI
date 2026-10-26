---
name: 推理系统
en: Inference Systems
parent: efficiency
order: 3
status: active
summary: 让 token 吐得更快更便宜：KV Cache 管理、连续批处理、PagedAttention、投机解码的工程进化。
keyPapers:
  - "Orca: Continuous Batching（2022）"
  - vLLM / PagedAttention（2023）
  - Speculative Decoding（2022–2023）
keyLabs:
  - UC Berkeley（vLLM）
  - NVIDIA（TensorRT-LLM）
  - DeepSeek / SGLang 社区
tags: [vLLM, KV Cache, 投机解码]
---

推理系统的第一性原理：LLM 解码是**访存受限**的——每生成一个 token 都要把全部权重与 KV Cache 从显存搬一遍，GPU 大部分时间在等数据。于是整个领域的优化都围绕「少搬」展开：PagedAttention（vLLM）把 KV Cache 做成操作系统的分页管理，显存碎片浪费从 60%+ 压到个位数；连续批处理（continuous batching）让不同长度的请求动态拼车，吞吐翻倍级提升。

延迟侧的两把快刀：投机解码用小模型起草、大模型并行验证（草稿接受率决定加速比）；预填充-解码分离（prefill/decode disaggregation）把长 prompt 的计算密集阶段与生成阶段的显存密集阶段拆到不同机器。MLA（DeepSeek）则从模型侧把 KV 压进低秩隐空间，与系统侧优化形成乘法效应。

## 看点

推理系统的「摩尔定律」由社区驱动：vLLM/SGLang 一年一个数量级的吞吐提升，等于给所有 AI 应用隐式续费。当推理算力占比超过训练（业界预测 2025–2026 年内发生），这个领域就是新的主战场。
