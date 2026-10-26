---
name: 机制可解释性
en: Mechanistic Interpretability
parent: alignment
order: 2
status: active
summary: 打开黑箱做逆向工程：稀疏自编码器、特征电路、表征几何——把神经网络的内部变成可读的机制图。
keyPapers:
  - Toy Models of Superposition（2022）
  - Towards Monosemanticity（2023，SAE）
  - Circuit Tracing / Attribution Graphs（2025，Anthropic）
keyLabs:
  - Anthropic
  - DeepMind
  - Neel Nanda 一系独立研究者
tags: [SAE, 电路, 透明性]
---

机制可解释性的纲领是：神经网络是可逆向工程的程序，而不是不可知的巫术。路线图分三层——**特征**（神经元的叠加编码是什么概念）、**电路**（特征之间如何组合计算）、**行为**（电路如何导致可观察输出）。

2023 年稀疏自编码器（SAE）成为突破口：在激活空间上训练一个过完备字典，把纠缠的神经元拆成单义的「特征」（金门大桥特征、欺骗性道歉特征均被真实定位并可干预）。2025 年 Anthropic 的归因图工作开始追踪多步推理的电路轨迹，验证了「模型内部存在可读的中间步骤」这一猜想。

局限同样明显：SAE 不完整（字典永远拆不完）、电路分析在真实规模模型上成本高昂、干预实验的因果解释力仍受质疑。它更像神经科学式的「模式生物」阶段——离「安全审计工具」还有工程化距离。

## 看点

如果可解释性能提前一个版本周期发现「欺骗性对齐」的内部征兆，它就是最值钱的安全技术；反之它可能永远停留在「有趣的科学」。
