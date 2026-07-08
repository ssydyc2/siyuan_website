# Efficient RL for LLMs

A structured guide for learning RLHF/RL systems and algorithms for LLM alignment, organized as a set of phases readers can move through at their own pace.

## Contents

- [Phase 0: RL Foundations](#phase-0-rl-foundations) — build the RL vocabulary and formulas used by PPO and GRPO.
- [Phase 1: Algorithm Foundations](#phase-1-algorithm-foundations) — read PPO/RLHF, DPO, and GRPO before systems papers.
- [Phase 2: RLHF Systems & Frameworks](#phase-2-rlhf-systems-frameworks) — compare colocated, async, disaggregated, and dynamic allocation designs.
- [Phase 3: Popular RLHF/RL Post-Training Frameworks](#phase-3-popular-rlhfrl-post-training-frameworks) — compare the top current frameworks by visibility and practical relevance.
- [Phase 4: Practice & Further Reading](#phase-4-practice-further-reading) — turn the map into starter exercises, advanced lessons, and further reading/code.

---

## Reading Checklist (per paper)

For each paper, track:
- **Architecture?** How are rollout (generation) and training workers organized?
- **Sync vs async?** Synchronous generation-training loop, or decoupled/async?
- **Resource management?** Colocated vs disaggregated GPU allocation for actor/critic/ref/reward?
- **Communication?** How are weights and experiences transferred between components?
- **Scalability story?** What's the bottleneck and how is it addressed?
- **Algorithm support?** PPO, DPO, GRPO, or others?

---

## Phase 0: RL Foundations

Build the RL vocabulary needed before reading RLHF and reasoning-RL papers.

- **[A Long Peek into Reinforcement Learning](https://lilianweng.github.io/posts/2018-02-19-rl-overview/)** (Lilian Weng)
  - Foundation for MDPs, value functions, policy gradients, and actor-critic methods
  - Use this to connect RL notation to the later PPO and GRPO objectives

- **[Hugging Face Deep RL Course](https://huggingface.co/learn/deep-rl-course/unit0/introduction)** (Hugging Face)
  - Hands-on introduction to RL concepts and training loops
  - Good companion for turning formulas into implementation intuition

### Important Formulas

#### 1. Policy Gradient Theorem

```latex
J(\theta) = \mathbb{E}_{\tau \sim \pi_\theta}
\left[\sum_{t=0}^{T} \gamma^t r_t\right]

\nabla_\theta J(\theta)
= \mathbb{E}_{s_t \sim d^{\pi_\theta}, a_t \sim \pi_\theta}
\left[
  \nabla_\theta \log \pi_\theta(a_t \mid s_t)
  Q^{\pi_\theta}(s_t, a_t)
\right]

\nabla_\theta J(\theta)
= \mathbb{E}_{t}
\left[
  \nabla_\theta \log \pi_\theta(a_t \mid s_t)
  A^{\pi_\theta}(s_t, a_t)
\right]
```

High-level meaning: instead of differentiating through \(Q^{\pi}(s,a)\) or the environment dynamics, the theorem rewrites the objective gradient as a gradient of the policy log-probability weighted by \(Q^{\pi}(s,a)\) or advantage. In practice, \(Q\) / advantage tells the update direction, while \(\nabla_\theta \log \pi_\theta(a \mid s)\) is the differentiable part.

#### 2. Actor-Critic

```latex
\delta_t = r_t + \gamma V_\phi(s_{t+1}) - V_\phi(s_t)

\hat{A}_t \approx \delta_t
\quad \text{or} \quad
\hat{A}^{\mathrm{GAE}}_t
= \sum_{l=0}^{\infty}(\gamma \lambda)^l \delta_{t+l}

\mathcal{L}_{\mathrm{actor}}(\theta)
= -\mathbb{E}_t
\left[
  \log \pi_\theta(a_t \mid s_t) \hat{A}_t
\right]

\mathcal{L}_{\mathrm{critic}}(\phi)
= \mathbb{E}_t
\left[
  \left(V_\phi(s_t) - \hat{R}_t\right)^2
\right]
```

High-level meaning: the actor updates the policy using the critic's advantage estimate; the critic learns to predict future return.

#### 3. PPO

```latex
r_t(\theta)
= \frac{\pi_\theta(a_t \mid s_t)}
       {\pi_{\theta_{\mathrm{old}}}(a_t \mid s_t)}

\mathcal{L}^{\mathrm{CLIP}}_{\mathrm{PPO}}(\theta)
= \mathbb{E}_t
\left[
  \min
  \left(
    r_t(\theta)\hat{A}_t,
    \operatorname{clip}(r_t(\theta), 1-\epsilon, 1+\epsilon)\hat{A}_t
  \right)
\right]

\hat{R}_t
= \hat{A}_t + V_{\phi_{\mathrm{old}}}(s_t)

\mathcal{L}^{\mathrm{value}}_{\mathrm{PPO}}(\phi)
= \frac{1}{2}\mathbb{E}_t
\left[
  \left(V_\phi(s_t) - \hat{R}_t\right)^2
\right]

\mathcal{J}_{\mathrm{actor}}^{\mathrm{RLHF}}(\theta)
\approx
\mathcal{L}^{\mathrm{CLIP}}_{\mathrm{PPO}}(\theta)
- \beta \,
D_{\mathrm{KL}}
\left(
  \pi_\theta(\cdot \mid x)
  \,\|\, \pi_{\mathrm{ref}}(\cdot \mid x)
\right)

\mathcal{L}_{\mathrm{actor}}^{\mathrm{min}}(\theta)
= -\mathcal{L}^{\mathrm{CLIP}}_{\mathrm{PPO}}(\theta)
+ \beta D_{\mathrm{KL}}
\left(
  \pi_\theta(\cdot \mid x)
  \,\|\, \pi_{\mathrm{ref}}(\cdot \mid x)
\right)
```

High-level meaning: PPO takes policy-gradient steps but clips the probability ratio so the new policy cannot move too far from the rollout policy. The actor maximizes \(\mathcal{J}_{\mathrm{actor}}^{\mathrm{RLHF}}\), or equivalently minimizes \(\mathcal{L}_{\mathrm{actor}}^{\mathrm{min}}\) with the signs flipped. The critic/value model is a separate regression problem: it minimizes \(\mathcal{L}^{\mathrm{value}}_{\mathrm{PPO}}\) toward the estimated return target \(\hat{R}_t\), usually computed from GAE. If the actor and value model share parameters, implementations often combine these terms into one weighted training loss; if they are separate models, they can be optimized as separate losses.

#### 4. GRPO

For one prompt \(x\), sample a group of completions \(\{y_i\}_{i=1}^{G}\), score them with rewards \(\{r_i\}_{i=1}^{G}\), then normalize rewards inside the group:

```latex
\hat{A}_i
= \frac{r_i - \operatorname{mean}(\{r_j\}_{j=1}^{G})}
       {\operatorname{std}(\{r_j\}_{j=1}^{G})}

\rho_{i,t}(\theta)
=
\frac{
  \pi_\theta(y_{i,t} \mid x, y_{i,<t})
}{
  \pi_{\theta_{\mathrm{old}}}(y_{i,t} \mid x, y_{i,<t})
}

\mathcal{J}_{\mathrm{GRPO}}(\theta)
=
\mathbb{E}_{x, \{y_i\}_{i=1}^{G}}
\left[
  \frac{1}{G}
  \sum_{i=1}^{G}
  \frac{1}{|y_i|}
  \sum_{t=1}^{|y_i|}
  \min
  \left(
    \rho_{i,t}(\theta)\hat{A}_i,
    \operatorname{clip}(\rho_{i,t}(\theta), 1-\epsilon, 1+\epsilon)\hat{A}_i
  \right)
  - \beta D_{\mathrm{KL}}(\pi_\theta \,\|\, \pi_{\mathrm{ref}})
\right]
```

High-level meaning: GRPO removes the learned critic by using relative rewards within a group of completions as the advantage signal.

---

## Phase 1: Algorithm Foundations

Understand the core RL alignment algorithms before diving into systems.

- **[Training language models to follow instructions with human feedback (InstructGPT)](https://arxiv.org/abs/2203.02155)** (OpenAI, Mar 2022, NeurIPS 2022)
  - The foundational PPO-based RLHF paper
  - Covers reward model training, PPO fine-tuning pipeline, and KL penalty
  - *Why first*: everything else builds on or departs from this setup

- **[Direct Preference Optimization: Your Language Model is Secretly a Reward Model (DPO)](https://arxiv.org/abs/2305.18290)** (Rafailov et al., May 2023, NeurIPS 2023)
  - Eliminates the reward model and RL loop entirely
  - Reparameterizes the RLHF objective as a classification loss on preference pairs
  - *Key insight*: the optimal policy under KL-constrained reward maximization has a closed-form relationship to the reward

- **[DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models](https://arxiv.org/abs/2402.03300)** (DeepSeek, Feb 2024, arXiv preprint)
  - Introduces Group Relative Policy Optimization (GRPO)
  - Removes the critic model — estimates baselines from group scores instead
  - *Why it matters*: GRPO is the modern reasoning-RL method (used in DeepSeek-R1, Qwen, etc.)

---

## Phase 2: RLHF Systems & Frameworks

Read in this order: one flexible dataflow view, one async systems view, one practical distributed stack, then lineage.

### Core Framework Papers

- **[HybridFlow: A Flexible and Efficient RLHF Framework](https://arxiv.org/abs/2409.19256)** (verl, Sep 2024, EuroSys 2025)
  - Canonical paper behind the `verl` framework
  - Key contribution: hybrid programming model mixing single-controller (flexibility) and multi-controller (efficiency)
  - Introduces 3D-HybridEngine for colocating actor training and generation on the same GPUs
  - *Read for*: understanding the design space of RLHF dataflow and resource allocation

- **[AReaL: A Large-Scale Asynchronous Reinforcement Learning System for Language Reasoning](https://arxiv.org/abs/2505.24298)** (May 2025, arXiv preprint)
  - Fully asynchronous RL system — decouples generation and training
  - Addresses the GPU utilization problem: sync systems waste compute waiting for slowest rollout
  - *Read for*: the async alternative to HybridFlow's colocated approach

- **[OpenRLHF: An Easy-to-use, Scalable and High-performance RLHF Framework](https://arxiv.org/abs/2405.11143)** (May 2024, arXiv preprint)
  - Ray + vLLM based distributed RLHF
  - Disaggregated placement: separate GPU clusters for actor, critic, reward, reference
  - *Read for*: practical open-source RLHF stack, good reference implementation

- **[ReaL: Efficient RLHF Training of Large Language Models with Parameter Reallocation](https://arxiv.org/abs/2406.14088)** (Jun 2024, MLSys 2025)
  - Predecessor/lineage to AReaL
  - Key idea: dynamically reallocate model parameters across GPUs between generation and training phases
  - *Read for*: historical context and understanding the evolution toward AReaL

---

## Phase 3: Popular RLHF/RL Post-Training Frameworks

This list is ranked by current visibility plus practical relevance: stars, active maintenance, ecosystem usage, and systems importance.

- **1. [verl](https://github.com/verl-project/verl)**
  - Strongest current open RL post-training systems framework
  - Canonical paper: HybridFlow
  - Good for studying colocated rollout/training, 3D-HybridEngine, and production-scale RL dataflow
  - *Action*: read the HybridFlow paper, then trace one GRPO or PPO example in the repo

- **2. [TRL (Transformer Reinforcement Learning)](https://huggingface.co/docs/trl/)**
  - HuggingFace post-training library
  - Supports DPO, PPO, GRPO, KTO, and more
  - Best for quick experiments, single-node, or small-scale multi-GPU work
  - *Action*: read the docs, run a DPO or GRPO example end-to-end

- **3. [OpenRLHF](https://github.com/OpenRLHF/OpenRLHF)**
  - Practical Ray + vLLM distributed RLHF stack
  - Strong reference for disaggregated actor, critic, reward, and reference placement
  - Good bridge from paper concepts to runnable open-source infrastructure
  - *Action*: compare its Ray/vLLM pipeline with verl's colocated design

- **4. [slime](https://github.com/THUDM/slime)**
  - Rising Megatron + SGLang large-scale RL framework
  - Focuses on high-performance training plus flexible rollout/data generation workflows
  - Useful for understanding the SGLang side of modern RL post-training systems
  - *Action*: read the architecture docs and compare its Megatron/SGLang path with OpenRLHF's Ray/vLLM path

- **5. [AReaL](https://github.com/areal-project/AReaL)**
  - Important async RL framework for reasoning and agentic training
  - Decouples generation from training to improve utilization
  - Best read as the async counterpart to synchronous colocated/disaggregated frameworks
  - *Action*: read the AReaL paper and inspect how it bounds staleness in async training

### Framework Comparison Table

| Framework | Canonical Paper | Sync/Async | Actor-Critic Placement | Read First |
|-----------|----------------|------------|----------------------|------------|
| verl | HybridFlow | Synchronous (colocated) | Colocated on same GPUs | HybridFlow paper |
| TRL | (no system paper) | Single-node / small-cluster focused | Colocated | Docs + DPO/PPO/GRPO recipes |
| OpenRLHF | OpenRLHF | Synchronous (disaggregated) | Separate GPU clusters | OpenRLHF paper |
| slime | (no system paper) | Large-scale RL post-training | Megatron + SGLang | Docs + source |
| AReaL | AReaL | Asynchronous | Disaggregated | AReaL paper |

---

## Phase 4: Practice & Further Reading

Use this section to move from reading papers to actually training, debugging, and reading real RL post-training systems.

### 4A: Hands-On Starter Exercises

- **[Unsloth — Train Your Own R1 Reasoning Model with GRPO](https://unsloth.ai/blog/r1-reasoning)** ([step-by-step tutorial](https://unsloth.ai/docs/get-started/reinforcement-learning-rl-guide/tutorial-train-your-own-reasoning-model-with-grpo))
  - End-to-end GRPO on consumer hardware — Colab notebooks included
  - Supports Llama 3.1 8B, Qwen 2.5 (1.5B–7B), Phi-4 14B with QLoRA
  - Only 7GB VRAM required (80% less than stock HuggingFace)
  - *Lowest barrier to entry — start here for first GRPO experiment*

- **[TinyZero — Reproduce DeepSeek R1-Zero for Under $30](https://github.com/Jiayi-Pan/TinyZero)**
  - Minimal R1-Zero reproduction built on veRL
  - Trains a 3B base model to develop self-verification on countdown/multiplication tasks
  - Shows reasoning emergence from RL alone, no instruction tuning
  - *The canonical "hello world" for RL-driven reasoning*

- **[The One Big Beautiful Blog on GRPO — Pramodith](https://pramodith.github.io/posts/grpo-trainer/)**
  - Deep-dive into GRPO internals with PyTorch code
  - Covers the three-model architecture, custom reward functions, group-relative advantage calculation
  - Non-obvious insight: why μ=1 gives zero policy loss but training still works via non-zero gradients
  - *Best resource for understanding what GRPOTrainer does under the hood*

- **[DPO Alignment with TRL — Philipp Schmid](https://www.philschmid.de/dpo-align-llms-in-2024-with-trl)**
  - End-to-end DPO walkthrough: dataset formatting, quantization, LoRA training, MT-Bench evaluation with GPT-4 as judge
  - *Cleanest alignment tutorial — transferable evaluation methodology*

### 4B: Advanced Lessons

- **[HuggingFace Open-R1: Update #1](https://huggingface.co/blog/open-r1/update-1)**
  - Documents HuggingFace's attempt to replicate DeepSeek-R1 with GRPO via TRL
  - Hard-won infra lessons: scaling vLLM from 2→4 nodes of 8xH100s, GPU memory challenges with 6k–20k token reasoning outputs, batched vs streaming generation
  - *Gold-standard "lessons learned" post for GRPO at scale*

- **[Training for Reasoning with GRPO (Towards AI)](https://pub.towardsai.net/training-your-reasoning-model-with-grpo-a-practical-guide-for-vlms-post-training-with-trl-266411c0b844)** ([Part II](https://medium.com/@lucamassaron/training-for-reasoning-with-grpo-part-ii-a-step-by-step-explanation-f80c219e2059))
  - GRPO post-training guide with a focus on Vision-Language Models
  - Part II: step-by-step training loop explanation
  - *One of the few resources covering GRPO for multimodal models*

- **[Understanding Reasoning LLMs — Sebastian Raschka](https://magazine.sebastianraschka.com/p/understanding-reasoning-llms)**
  - Taxonomy of four approaches: inference-time scaling, pure RL (R1-Zero), SFT+RL (R1), distillation
  - Practical cost comparisons: Sky-T1 ~$450, TinyZero under $30
  - *Use it to place GRPO practice inside the broader reasoning-model landscape*

### 4C: Further Reading & Code

- **[RLHF Book — Nathan Lambert](https://rlhfbook.com/)**
  - Free online book covering the full RLHF pipeline end-to-end
  - Companion course with 4 lectures — Lecture 4 on RL Implementation & Practice is especially useful
  - *The single most comprehensive practitioner resource on RLHF*

- **[Interconnects AI — RLHF tag](https://www.interconnects.ai/t/rlhf)** (Nathan Lambert's blog)
  - Ongoing deep-dives: PPO vs DPO vs GRPO tradeoffs, DeepSeek R1 training recipe analysis, infra challenges
  - Written from a builder's perspective (formerly HuggingFace, now AI2)

- **[verl source code](https://github.com/verl-project/verl)**
  - Trace one PPO or GRPO step end-to-end through the codebase
  - Understand: how rollouts are batched, how advantages are computed, how colocated rollout/training works

- **[OpenRLHF source code](https://github.com/OpenRLHF/OpenRLHF)**
  - Trace one PPO or GRPO step end-to-end through the codebase
  - Understand: how Ray/vLLM workers are organized, how model components are placed, and how weight sync works
