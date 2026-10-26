---
title: "FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness"
authors: Dao et al. (Stanford)
venue: NeurIPS 2022
year: 2022
url: https://arxiv.org/abs/2205.14135
domain: inference-systems
rating: 4
oneLiner: 不改注意力的数学，只改数据的搬运路线——分块计算 + SRAM 内完成 softmax，长序列训练提速数倍的精确注意力。
takeaways:
  - 重新定位问题：注意力的瓶颈不是 FLOPs 而是显存 IO——HBM 读写次数决定速度，把「计算复杂度」问题改写成「访存复杂度」问题。
  - 分块（tiling）+ 在线 softmax（数值稳定的增量归一化）让注意力矩阵永不完整落显存：O(n²) 的计算保留了，O(n²) 的存储消失了。
  - 「精确而非近似」是与此前长序列工作（Linformer、Performer）的分水岭：无损加速没有采用成本，部署侧无需选择。
  - 开创了「IO 感知算法设计」研究线：后续 FlashAttention-2/3、FlashDecoding、Mamba 的 scan 核都沿同一哲学——为存储层级重写算法。
---

## 背景

2021-2022 年的长上下文军备赛里，主流叙事是「注意力的 O(n²) 计算必须被打掉」：Linformer、Performer、Reformer、Sparse Transformer…… 全都冲着「近似注意力」去——用低秩/核方法/稀疏化把计算降到线性，代价是或多或少的质量损失。

Tri Dao（Stanford）注意到一个被所有人忽略的事实：**注意力在 GPU 上根本不是计算受限（compute-bound），而是访存受限（memory-bound）**。GPU 的算力（FLOPs/s）增长远快于显存带宽（HBM TB/s），中间矩阵在 HBM 里的来回搬运才是真正的时间大头。A100 的算力/带宽比已经到了「每次从显存搬 1 字节，够做几百次浮点运算」的程度。

## 动机

论文的问题重构一句话讲完：**别数 FLOPs，数 HBM 访问次数**。如果注意力的慢来自中间矩阵（S = QKᵀ、P = softmax(S)，各 n×n）在 HBM 的往返，那么目标就是把它们彻底消灭——注意力矩阵从头到尾不完整出现在显存里。只要做到这一点，加速不需要任何近似：数学上完全精确。这是与「近似注意力」路线的根本分野——**不是让计算变少，是让数据搬运变少**。

## 方法

**存储层级的事实**：A100 上 HBM 带宽约 1.5-2TB/s、片上 SRAM 带宽约 19TB/s（~10-15 倍差距）但只有 ~20MB 容量。朴素 attention 的实现要读 Q/K/V、写 S、读 S、写 P、读 P…… HBM 访问量是 O(n² + nd)。

**三件套技术**：

**1. 分块（Tiling）**。把 Q、K、V 切成能塞进 SRAM 的小块（如 128×128），逐块载入：Q 块与 K 块在 SRAM 里算出局部 S 块，立刻做局部 softmax，与 V 块相乘得到部分输出——全程不把任何 n×n 矩阵写回 HBM，只写最终 O(n) 的输出。

**2. 在线 softmax（Online Softmax）**。难点：softmax 的分母是全行的 exp 和，分块算的局部 softmax 拼不起来。解法（flash 技巧）：维护两个 running 量——当前块的最大值 m（数值稳定）与指数和 ℓ，新块到来时用缩放因子修正旧的累积输出（乘 exp(m_old - m_new)），再累加新块贡献。这是一个数值稳定的**流式 softmax**，数学上与整体 softmax 完全等价。

**3. 反向传播重计算**。标准自动微分会存 S 和 P 供反向用（显存 O(n²)）。FlashAttention 反传时**重新计算**这两个矩阵（从 QKV 块再算一遍），用约一倍的前向 FLOPs 换掉 O(n²) 的存储——activation memory 从 O(n²) 降到 O(n)。因为前向已经省了大量 HBM 访问，加一次重计算的总时间仍然大幅缩短。

**理论结果**：HBM 访问从 O(n² + nd) 降到 O(n²d²/M)（M 为 SRAM 大小）——对典型 d（64-128）是显著缩减；且给出了「任何精确注意力算法至少需要 Ω(n²d²/M) 次访存」的下界——FlashAttention 在常数因子内达到下界，**不是工程 hack 而是渐近最优**。

**CUDA 实现细节**（性能的另一半）：一个 kernel 融合完成整个 attention（不切 launch）、warp 分工协作（softmax 归约用 warp shuffle 而非共享内存往返）、消除 padding（按序列真实长度处理）。

## 实验设置

- **速度基准**：注意力 kernel 单独计时（不同 seq len 64-64K、不同 head dim）vs PyTorch 标准实现与近似注意力（Linformer/Performer/Sparse）
- **端到端训练**：BERT-large（MLPerf 1.1 训练赛道）、GPT-2 small/medium（128-4K 序列长度）训练提速；长序列自回归（1K-16K）
- **显存**：activation 峰值随 seq len 的曲线（线性 vs 平方）
- **质量**：精确性是构造性保证（bit-level 等价于标准 attention 的数值稳定版），另在 LRA（Long Range Arena）上跑分数确认无损

## 结果

- **GPT-2 训练（seq 1K）端到端加速 3×**；序列越长加速比越大（4K 时更显著）——「存储消灭，墙钟时间塌缩」
- BERT-large 端到端加速 ~15%（MLPerf 1.1 上训练速度纪录的组件）
- 显存：activation 从 O(n²) 降到 O(n)——GPT-2 medium 在 64K 序列上跑得动（朴素实现直接 OOM）
- 对比近似注意力：在相同硬件上 FlashAttention 经常**比近似方法更快**（Performer/Linformer 的 kernel 效率低）且零质量损失——近似路线的核心卖点（快）被精确路线反超，**这条赛道随后整体死亡**
- 长上下文收益：因为序列长度的墙被推远，当时把 1K→4K→8K 的训练实验变成日常操作

## 有趣的洞见

**「算法问题其实是系统问题」**。FlashAttention 没有提出任何新数学（online softmax 是 2017 年的已知技巧，tiling 是 HPC 的基本功），它的贡献是**把深度学习的注意力放到存储层级模型里重新审计了一遍**。很多「近似注意力」论文解决的是 FLOPs——但 FLOPs 在 GPU 上几乎免费，真正贵的是数据移动。这个视角迁移到今天：KV Cache 量化（搬得更少）、MoE 的 all-to-all（通信即访存）、长上下文的 offloading——全是同一哲学的后续。

**反向传播重计算是个「违反直觉的正确决策」**。教科书里「存激活、免重算」是金科玉律；在访存受限的世界里恰好相反——**计算是廉价资源，存储是稀缺资源，用便宜的资源换贵的**。这个 trade-off 思维（recompute vs store）此后出现在梯度检查点（gradient checkpointing，大模型训练标配）等无数场景。

**kernel 即护城河**。FlashAttention 的 CUDA 实现极难写对（数值稳定性 + warp 协同 + 平台差异），一年后 FlashAttention-2（2023，并行度与 occupancy 优化再加速 ~2×）与 Hopper 上的 FlashAttention-3 才逐步榨干硬件。深度学习框架（PyTorch SDPA、vLLM、SGLang）全部内置——它成为「所有 LLM 都在跑」但「没人在论文里引用它」的地基软件。

## 批判性评价

**最弱的一环**：它解决的是「平方注意力的存储」，不是「平方注意力的计算」——FLOPs 仍是 O(n²)，超长序列（100K+）的算力账依然高昂，这是线性注意力/SSM 生态（Mamba 等）继续存在的理由。实现深度绑定硬件参数（SRAM 大小、warp 数、每代 GPU 的特性），每代硬件都要重写调优——「快」的代价是维护成本，Triton 等编译器路线在降低这个门槛。长序列的 KV Cache 推理瓶颈也没被它解决（那是另一个访存问题）。

**依然重要的理由**：它是「系统研究者降维打击算法领域」的标志性案例——在满屏新注意力变体的年代证明最大的红利在算法与硬件的缝合处。对实践者的思维工具是 roofline 模型：看到任何算子先问「计算受限还是访存受限」，这个习惯对理解一切现代系统瓶颈（KV Cache、MoE 通信、分布式训练）都直接适用。
