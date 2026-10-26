---
name: 混合专家模型
en: Mixture-of-Experts
parent: efficiency
order: 2
status: active
summary: 参数与算力解耦的稀疏架构：每 token 只激活少数专家，用路由器换「大而不贵」。
keyPapers:
  - Switch Transformers（2021，Google）
  - Mixtral of Experts（2023，Mistral）
  - DeepSeek-V2/V3（2024，细粒度专家 + 无辅助损失负载均衡）
keyLabs:
  - Mistral AI
  - DeepSeek
  - Google
tags: [MoE, 稀疏激活, 路由]
---

MoE 把 FFN 层切成 N 个「专家」，每个 token 只被路由到其中少数几个（如 DeepSeek-V3：671B 总参数、每 token 激活 37B）。效果是参数容量与计算成本解耦——模型可以「博览群书」但每次只「请教相关的几位先生」。Mixtral（2023）用 8×7B 的开放权重第一次让大众看到 MoE 的性价比；DeepSeek 系列则把工程细节打磨成教科书：细粒度专家切分、共享专家隔离、无辅助损失的负载均衡（让路由自然均衡而不靠惩罚项硬掰）。

代价同样结构化：显存占用按总参数计（所有专家都要驻留显存），训练的路由不稳定与专家坍缩（热门专家通吃、冷门专家退化）需要精细的均衡策略，推理的 batch 内路由碎片化让算子优化变成系统难题。

## 看点

MoE 已成前沿模型的默认形态。下一个问题是「专家们到底分工了什么」——初步证据显示专家分化与语法、主题、领域相关，但离「可解释的模块化」还很远。
