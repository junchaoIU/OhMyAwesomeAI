---
title: FlashAttention：注意力的 IO 革命
date: 2022-05-27
domain: inference-systems
importance: major
summary: Stanford 的 Tri Dao 用「分块计算 + 不落显存」的精确注意力实现，把长序列训练提速数倍且不近似，注意力优化从算法问题变成访存问题。
paperRef: "FlashAttention: Fast and Memory-Efficient Exact Attention"
tags: [FlashAttention, 系统优化]
---
聪明的洞见：注意力的数学不变，改变的是数据搬运的路线。GPU 显存带宽而非算力才是瓶颈——这一视角切换催生了此后整条「IO 感知算子」研究线，是「系统思维反哺算法」的典范。
