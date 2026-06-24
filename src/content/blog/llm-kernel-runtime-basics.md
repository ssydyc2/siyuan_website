# LLM Kernel & Runtime Basics

A learning map for the core attention and serving papers behind modern LLM performance work, followed by the kernel tools needed to make those ideas concrete.

## Contents

- [Reading Checklist](#reading-checklist) — use these questions while reading papers or docs.
- [Phase 0: Core LLM Performance Papers](#phase-0-core-llm-performance-papers) — start with the workload and systems problems.
- [Phase 1: Kernel Programming Tools](#phase-1-kernel-programming-tools) — move into Triton and JAX after the papers define what matters.

---

## Reading Checklist

For each paper or tool, track:

- **Bottleneck?** Is the problem compute, memory bandwidth, memory capacity, communication, or scheduling?
- **Data movement?** What moves between HBM, SRAM, registers, host memory, and devices?
- **Parallelism?** How is work partitioned across programs, warps, blocks, heads, tokens, or devices?
- **Compiler/runtime role?** What is handled by hand-written kernels, XLA, scheduling, paging, or batching?
- **LLM workload connection?** How does the idea affect attention, KV cache, prefill, decode, or serving throughput?

---

## Phase 0: Core LLM Performance Papers

Start with the papers so the kernel work has a concrete workload attached to it.

- **[FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness](https://arxiv.org/abs/2205.14135)** (Tri Dao et al., NeurIPS 2022)
  - Foundational paper for IO-aware exact attention.
  - Read for the tiling and memory movement argument, not just the benchmark results.
  - Focus on why standard attention is bottlenecked by HBM traffic.

- **[FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning](https://arxiv.org/abs/2307.08691)** (Tri Dao, ICLR 2024)
  - Improves attention performance through better parallelism and work partitioning.
  - Useful for seeing why the first fast kernel is rarely the final fast kernel.
  - Focus on how the same math changes shape when the hardware utilization target changes.

- **[Efficient Memory Management for Large Language Model Serving with PagedAttention](https://arxiv.org/abs/2309.06180)** (vLLM, SOSP 2023)
  - Moves from kernels into serving memory management.
  - Explains why KV cache layout and allocation are first-order inference performance problems.
  - Read this to connect attention kernels with real serving constraints.

---

## Phase 1: Kernel Programming Tools

After the papers, use Triton and JAX to build the implementation vocabulary.

- **[Learning Triton GPU Kernels](https://triton-lang.org/main/getting-started/tutorials/)** (Official tutorials)
  - Triton is the most direct bridge from Python to custom GPU kernels for deep learning primitives.
  - Focus on how programs map to tiles, memory movement, and parallel execution.
  - Use the tutorials as implementation checkpoints rather than passive reading.

- **[My Triton Implementations](https://github.com/ssydyc2/learn_triton)** (Practice repository)
  - Use this as the hands-on track for writing and comparing kernels.
  - Keep implementations small enough that memory access patterns remain visible.

- **[Learning JAX](https://jax.readthedocs.io/en/latest/tutorials.html)** (Official tutorials)
  - JAX combines NumPy-style code, automatic differentiation, and XLA compilation.
  - Read it as a way to understand compiled ML programs and accelerator portability.
  - Focus on how eager array code changes under `jit`.
