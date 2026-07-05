# LLM Kernel & Runtime Basics

A learning map for the core attention and serving papers behind modern LLM performance work, followed by kernel tools, serving frameworks, and practice.

## Contents

- [Reading Checklist](#reading-checklist) — use these questions while reading papers or docs.
- [Phase 1: Core LLM Performance Papers](#phase-1-core-llm-performance-papers) — start with the workload and systems problems.
- [Phase 2: Kernel Programming Tools](#phase-2-kernel-programming-tools) — move into Triton and JAX after the papers define what matters.
- [Phase 3: Serving Frameworks: vLLM & SGLang](#phase-3-serving-frameworks-vllm-sglang) — connect kernels and KV-cache ideas to production inference engines.
- [Phase 4: Practice & Further Reading](#phase-4-practice-further-reading) — turn the map into serving experiments, benchmarks, and deeper reading.

---

## Reading Checklist

For each paper or tool, track:

- **Bottleneck?** Is the problem compute, memory bandwidth, memory capacity, communication, or scheduling?
- **Data movement?** What moves between HBM, SRAM, registers, host memory, and devices?
- **Parallelism?** How is work partitioned across programs, warps, blocks, heads, tokens, or devices?
- **Compiler/runtime role?** What is handled by hand-written kernels, XLA, scheduling, paging, or batching?
- **LLM workload connection?** How does the idea affect attention, KV cache, prefill, decode, or serving throughput?

---

## Phase 1: Core LLM Performance Papers

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

- **[SGLang: Efficient Execution of Structured Language Model Programs](https://arxiv.org/abs/2312.07104)** (SGLang, NeurIPS 2024)
  - Framework paper for SGLang's frontend language and runtime.
  - Read for RadixAttention, KV-cache reuse across structured programs, and constrained decoding.
  - Use this as the theory bridge from single-request serving to structured multi-call programs.

---

## Phase 2: Kernel Programming Tools

After the papers, use Triton and JAX to build the implementation vocabulary.

- **[Learning Triton GPU Kernels](https://triton-lang.org/main/getting-started/tutorials/)** (Official tutorials)
  - Triton is the most direct bridge from Python to custom GPU kernels for deep learning primitives.
  - Focus on how programs map to tiles, memory movement, and parallel execution.
  - Use the tutorials as implementation checkpoints rather than passive reading.

- **[Learning JAX](https://jax.readthedocs.io/en/latest/tutorials.html)** (Official tutorials)
  - JAX combines NumPy-style code, automatic differentiation, and XLA compilation.
  - Read it as a way to understand compiled ML programs and accelerator portability.
  - Focus on how eager array code changes under `jit`.

---

## Phase 3: Serving Frameworks: vLLM & SGLang

After the kernel and compiler tools, study the serving frameworks that make the same constraints visible at runtime scale.

- **[vLLM Quickstart](https://docs.vllm.ai/en/latest/getting_started/quickstart/)** (Official docs)
  - Start with offline batched inference, then move to online serving.
  - Use this to connect the PagedAttention paper to the actual user-facing engine.

- **[vLLM OpenAI-Compatible Server](https://docs.vllm.ai/en/latest/serving/online_serving/openai_compatible_server/)** (Official docs)
  - Learn the serving path through the OpenAI-compatible HTTP API.
  - Focus on request shape, batching behavior, and how a model becomes a production endpoint.

- **[vLLM Automatic Prefix Caching](https://docs.vllm.ai/en/latest/features/automatic_prefix_caching/)** (Official docs)
  - Study how shared prompt prefixes reuse KV cache instead of recomputing the same context.
  - Connect this to prompt-heavy workloads such as RAG, agents, and multi-turn chat.

- **[vLLM Paged Attention Design Note](https://docs.vllm.ai/en/latest/design/paged_attention/)** (Official docs)
  - Read after the paper for a kernel-oriented view of paged KV cache layout.
  - Focus on how attention kernels change when KV blocks are managed by the runtime.

- **[vLLM Benchmark CLI](https://docs.vllm.ai/en/latest/benchmarking/cli/)** (Official docs)
  - Use benchmark commands to separate throughput, latency, prompt length, and output length effects.
  - Treat benchmark design as part of learning the runtime, not just a scoreboard.

- **[SGLang Quickstart](https://docs.sglang.io/docs/get-started/quickstart)** (Official docs)
  - Launch a first model server and send requests through the OpenAI-compatible API.
  - Use this as the fastest route from paper concepts to a running inference engine.

- **[SGLang Offline Engine API](https://docs.sglang.io/docs/basic_usage/offline_engine_api)** (Official docs)
  - Use the direct engine path when an HTTP server adds unnecessary overhead.
  - Focus on batch inference, custom server patterns, and scheduling behavior.

- **[SGLang Structured Outputs](https://docs.sglang.io/docs/advanced_features/structured_outputs)** (Official docs)
  - Study JSON schema, regex, and grammar-constrained generation.
  - Connect structured decoding to runtime scheduling and output validation.

- **[SGLang Speculative Decoding](https://docs.sglang.io/docs/advanced_features/speculative_decoding)** (Official docs)
  - Read for EAGLE, draft-model, MTP, and n-gram speculative decoding options.
  - Focus on the tradeoff between extra draft work and lower time per generated token.

- **[SGLang Bench Serving Guide](https://docs.sglang.io/docs/developer_guide/bench_serving)** (Official docs)
  - Benchmark online serving throughput and latency with OpenAI-compatible and native endpoints.
  - Compare metrics against vLLM using similar prompts, concurrency, and output lengths.

---

## Phase 4: Practice & Further Reading

Use this section as a short launch point for hands-on implementation and deeper systems reading.

- **Implement core components of LLM serving**
  - Implement a minimal Transformer block so the model-side data flow is concrete.
  - Implement FlashAttention-style tiled attention to understand IO-aware memory movement.
  - Implement KV cache prefill and decode paths to make serving-time state management explicit.

- **Read the vLLM and SGLang source code**
  - [vLLM source code](https://github.com/vllm-project/vllm)
  - [SGLang source code](https://github.com/sgl-project/sglang)

- **[LMSYS Blog](https://www.lmsys.org/blog/)**
  - Follow the broader LMSYS systems writing around serving, evaluation, and inference infrastructure.
