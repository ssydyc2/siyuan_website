import { Link, useParams } from 'react-router-dom';
import aiPerformanceImage from '../assets/study-plans/ai-systems-performance-engineering-2d-hd.webp';
import rlForLlmsImage from '../assets/study-plans/efficient-rl-for-llms-2d-hd.webp';
import kernelRuntimeImage from '../assets/study-plans/llm-kernel-runtime-basics-2d-hd.webp';
import studyHeroImage from '../assets/hero/study-systems-anime.webp';
import HeroScene from '../components/HeroScene';
import MarkdownDocument from '../components/MarkdownDocument';
import efficientRlMarkdown from '../content/study-plans/efficient-rl-for-llms.md?raw';

interface Resource {
  title: string;
  href: string;
  meta?: string;
  notes: string[];
}

interface Phase {
  title: string;
  period: string;
  label?: string;
  summary: string;
  groups: {
    title?: string;
    resources: Resource[];
  }[];
}

interface StudyPlan {
  id: string;
  title: string;
  eyebrow: string;
  summary: string;
  readingChecklist: string[];
  phases: Phase[];
  frameworkRows: string[][];
  practicePath: string[];
  minimalPath: string[];
  topThree: string[];
  keyConcepts: string;
}

const readingChecklist = [
  'Architecture: rollout, generation, and training worker organization',
  'Sync vs async: coupled generation-training loop or decoupled pipeline',
  'Resource management: colocated vs disaggregated GPU allocation',
  'Communication: weight and experience transfer between components',
  'Scalability: primary bottleneck and mitigation strategy',
  'Algorithm support: PPO, DPO, GRPO, or other approaches',
];

const phases: Phase[] = [
  {
    title: 'RL Foundations',
    period: 'Phase 0',
    label: 'Phase 0',
    summary: 'Build the RL vocabulary needed before reading RLHF and reasoning-RL papers.',
    groups: [
      {
        resources: [
          {
            title: 'A Long Peek into Reinforcement Learning',
            href: 'https://lilianweng.github.io/posts/2018-02-19-rl-overview/',
            meta: 'Lilian Weng',
            notes: [
              'Concise foundation for MDPs, value functions, policy gradients, and actor-critic methods.',
              'Use this to connect RL notation to the later PPO and GRPO objectives.',
            ],
          },
          {
            title: 'Hugging Face Deep RL Course',
            href: 'https://huggingface.co/learn/deep-rl-course/unit0/introduction',
            meta: 'Hugging Face',
            notes: [
              'Hands-on introduction to RL concepts and training loops.',
              'Good companion for turning formulas into implementation intuition.',
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Algorithm Foundations',
    period: 'Days 1-3',
    summary: 'Understand the core RL alignment algorithms before diving into systems.',
    groups: [
      {
        resources: [
          {
            title: 'Training language models to follow instructions with human feedback',
            href: 'https://arxiv.org/abs/2203.02155',
            meta: 'InstructGPT, OpenAI, 2022',
            notes: [
              'Foundational PPO-based RLHF paper.',
              'Covers reward model training, PPO fine-tuning, and KL penalty.',
              'Read first because later systems build on or depart from this setup.',
            ],
          },
          {
            title: 'Direct Preference Optimization: Your Language Model is Secretly a Reward Model',
            href: 'https://arxiv.org/abs/2305.18290',
            meta: 'DPO, Rafailov et al., 2023',
            notes: [
              'Eliminates the reward model and RL loop.',
              'Reparameterizes RLHF as a classification loss on preference pairs.',
              'Key insight: KL-constrained reward maximization has a closed-form policy relationship.',
            ],
          },
          {
            title: 'DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models',
            href: 'https://arxiv.org/abs/2402.03300',
            meta: 'DeepSeek, 2024',
            notes: [
              'Introduces Group Relative Policy Optimization.',
              'Removes the critic model by estimating baselines from group scores.',
              'Important context for modern reasoning RL methods such as DeepSeek-R1 and Qwen.',
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'RLHF Systems & Frameworks',
    period: 'Days 4-8',
    summary: 'Read one flexible dataflow view, one async systems view, one practical distributed stack, then lineage.',
    groups: [
      {
        title: 'Core Framework Papers',
        resources: [
          {
            title: 'HybridFlow: A Flexible and Efficient RLHF Framework',
            href: 'https://arxiv.org/abs/2409.19256',
            meta: 'verl',
            notes: [
              'Canonical paper behind the verl framework.',
              'Mixes single-controller flexibility with multi-controller efficiency.',
              'Introduces 3D-HybridEngine for colocating actor training and generation.',
            ],
          },
          {
            title: 'AReaL: A Large-Scale Asynchronous Reinforcement Learning System for Language Reasoning',
            href: 'https://arxiv.org/abs/2504.02792',
            meta: '2025',
            notes: [
              'Fully asynchronous RL system that decouples generation and training.',
              'Targets the GPU utilization problem in synchronous rollout pipelines.',
              'Read as the async alternative to HybridFlow-style colocation.',
            ],
          },
          {
            title: 'OpenRLHF: An Easy-to-use, Scalable and High-performance RLHF Framework',
            href: 'https://arxiv.org/abs/2405.11143',
            meta: '2024',
            notes: [
              'Ray and vLLM based distributed RLHF framework.',
              'Uses disaggregated placement for actor, critic, reward, and reference models.',
              'Good practical reference implementation for open-source RLHF.',
            ],
          },
          {
            title: 'ReaLHF: Optimized RLHF Training for Large Language Models through Parameter Reallocation',
            href: 'https://arxiv.org/abs/2406.14088',
            meta: '2024',
            notes: [
              'Predecessor and lineage for AReaL.',
              'Dynamically reallocates model parameters across GPUs between generation and training.',
              'Useful historical context for the evolution toward AReaL.',
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Library-Based Frameworks',
    period: 'Days 9-11',
    summary: 'These are mostly toolkits. Read docs and code, then run at least one small example.',
    groups: [
      {
        resources: [
          {
            title: 'TRL (Transformer Reinforcement Learning)',
            href: 'https://huggingface.co/docs/trl/',
            meta: 'HuggingFace',
            notes: [
              'Post-training library with DPO, PPO, GRPO, KTO, and more.',
              'Best for quick experiments and single-node or small multi-GPU setups.',
              'Action: run a DPO or GRPO example end-to-end.',
            ],
          },
          {
            title: 'NeMo-Aligner',
            href: 'https://github.com/NVIDIA/NeMo-Aligner',
            meta: 'NVIDIA',
            notes: [
              'Scalable alignment toolkit built on NeMo.',
              'Supports DPO, PPO, and RLHF at scale with Megatron parallelism.',
              'Action: understand how it handles model parallelism for RLHF.',
            ],
          },
          {
            title: 'torchtune',
            href: 'https://github.com/pytorch/torchtune',
            meta: 'PyTorch',
            notes: [
              'PyTorch-native post-training library.',
              'Includes DPO, PPO, and GRPO recipes.',
              'Action: read the recipe structure and config system.',
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Synthesis & Practice',
    period: 'Days 12-14',
    summary: 'Connect the conceptual landscape, hands-on training, scaling lessons, and code reading.',
    groups: [
      {
        title: 'Conceptual Overview & Landscape',
        resources: [
          {
            title: 'Understanding Reasoning LLMs',
            href: 'https://magazine.sebastianraschka.com/p/understanding-reasoning-llms',
            meta: 'Sebastian Raschka',
            notes: [
              'Taxonomy of inference-time scaling, pure RL, SFT plus RL, and distillation.',
              'Useful for deciding which reasoning approach fits a use case.',
            ],
          },
          {
            title: 'RLHF Book',
            href: 'https://rlhfbook.com/',
            meta: 'Nathan Lambert',
            notes: [
              'Free online book covering the RLHF pipeline end-to-end.',
              'Lecture 4 on RL implementation and practice is especially useful.',
            ],
          },
          {
            title: 'Interconnects AI - RLHF tag',
            href: 'https://www.interconnects.ai/t/rlhf',
            meta: 'Nathan Lambert',
            notes: [
              'Builder-oriented writing on PPO, DPO, GRPO, DeepSeek-R1, and infrastructure challenges.',
            ],
          },
        ],
      },
      {
        title: 'Hands-On GRPO Training',
        resources: [
          {
            title: 'Unsloth - Train Your Own R1 Reasoning Model with GRPO',
            href: 'https://unsloth.ai/blog/r1-reasoning',
            meta: 'Beginner-friendly experiment path',
            notes: [
              'End-to-end GRPO on consumer hardware with Colab notebooks.',
              'Supports Llama 3.1 8B, Qwen 2.5, and Phi-4 with QLoRA.',
              'Lowest barrier to entry for a first GRPO experiment.',
            ],
          },
          {
            title: 'TinyZero - Reproduce DeepSeek R1-Zero for Under $30',
            href: 'https://github.com/Jiayi-Pan/TinyZero',
            meta: 'Minimal R1-Zero reproduction',
            notes: [
              'Built on veRL and focused on countdown and multiplication tasks.',
              'Shows reasoning emergence from RL alone, without instruction tuning.',
            ],
          },
          {
            title: 'The One Big Beautiful Blog on GRPO',
            href: 'https://pramodith.github.io/posts/grpo-trainer/',
            meta: 'Pramodith',
            notes: [
              'Deep dive into GRPO internals with PyTorch code.',
              'Covers model architecture, rewards, group-relative advantages, and trainer behavior.',
            ],
          },
        ],
      },
      {
        title: 'Scaling & Engineering Lessons',
        resources: [
          {
            title: 'HuggingFace Open-R1: Update #1',
            href: 'https://huggingface.co/blog/open-r1/update-1',
            meta: 'GRPO at scale',
            notes: [
              'Lessons from replicating DeepSeek-R1 with GRPO via TRL.',
              'Covers vLLM scaling, GPU memory pressure, long reasoning outputs, and generation strategy.',
            ],
          },
          {
            title: 'DPO Alignment with TRL',
            href: 'https://www.philschmid.de/dpo-align-llms-in-2024-with-trl',
            meta: 'Philipp Schmid',
            notes: [
              'End-to-end DPO walkthrough covering data, quantization, LoRA training, and evaluation.',
              'Clean alignment tutorial with transferable evaluation methodology.',
            ],
          },
          {
            title: 'Training for Reasoning with GRPO',
            href: 'https://pub.towardsai.net/training-your-reasoning-model-with-grpo-a-practical-guide-for-vlms-post-training-with-trl-266411c0b844',
            meta: 'Towards AI',
            notes: [
              'GRPO post-training guide focused on vision-language models.',
              'One of the few resources covering multimodal GRPO practice.',
            ],
          },
        ],
      },
    ],
  },
];

const frameworkRows = [
  ['verl', 'HybridFlow', 'Synchronous colocated', 'Same GPUs', 'HybridFlow paper'],
  ['AReaL', 'AReaL', 'Asynchronous', 'Disaggregated', 'AReaL paper'],
  ['OpenRLHF', 'OpenRLHF', 'Synchronous disaggregated', 'Separate GPU clusters', 'OpenRLHF paper'],
  ['ReaLHF', 'ReaLHF', 'Synchronous dynamic realloc', 'Dynamically reallocated', 'ReaLHF paper'],
  ['TRL', 'No system paper', 'Single-node focused', 'Colocated', 'Docs plus DPO/PPO papers'],
  ['NeMo-Aligner', 'No system paper', 'Scale-focused toolkit', 'Megatron-scale', 'Docs plus algorithm papers'],
  ['torchtune', 'No system paper', 'Recipe-focused toolkit', 'PyTorch-native', 'Docs plus recipes'],
];

const practicePath = [
  "Raschka's overview - understand the landscape before training anything",
  'Unsloth GRPO tutorial - first hands-on experiment',
  "Pramodith's GRPO blog - understand what the trainer does",
  'Open-R1 Update #1 - learn scaling lessons before multi-GPU work',
  'TinyZero on veRL - reproduce R1-Zero and bridge to production frameworks',
];

const minimalPath = [
  'InstructGPT for PPO/RLHF background',
  'DPO for the major non-RL alternative',
  'HybridFlow for colocated synchronous systems',
  'AReaL for asynchronous systems',
  'OpenRLHF for practical disaggregated systems',
  'GRPO / DeepSeekMath for modern reasoning RL',
];

const topThree = [
  'HybridFlow for RLHF dataflow',
  'DPO for non-PPO alignment',
  'AReaL for async systems',
];

const keyConcepts = `Efficient RL for LLMs
|-- Algorithms
|   |-- PPO-based RLHF: reward model, KL-constrained policy optimization, critic
|   |-- DPO: preference pairs to classification loss
|   |-- GRPO: critic-free group-relative advantage estimation
|-- System Design Axes
|   |-- Sync vs Async: simplicity vs utilization and staleness
|   |-- Resource Placement: colocated, disaggregated, dynamic reallocation
|   |-- Communication: weights, experiences, parameter server vs all-reduce
|-- Practical Stacks
    |-- verl, OpenRLHF, TRL, NeMo-Aligner, torchtune`;

const aiPerformanceReadingChecklist = [
  'Role definition: what an AI systems performance engineer owns',
  'Hardware: GPU architecture, memory hierarchy, tensor cores, and interconnects',
  'Workloads: training vs inference performance bottlenecks',
  'Tooling: profiler-driven optimization rather than intuition-driven tuning',
  'Scale: single-node efficiency before distributed-system complexity',
];

const aiPerformancePhases: Phase[] = [
  {
    title: 'Book Spine',
    period: 'Start here',
    summary:
      'Use the book as the organizing thread, then branch into profiling and systems work as the concepts become concrete.',
    groups: [
      {
        resources: [
          {
            title: 'AI Systems Performance Engineering',
            href: 'https://www.amazon.com/Systems-Performance-Engineering-Optimizing-Inference/dp/B0F47689K8',
            meta: 'Chris Fregly',
            notes: [
              'A practical entry point for optimizing model training and inference workloads.',
              'Use Chapter 1 to frame the AI systems engineer role and the shape of large-model infrastructure.',
              'Use Chapter 2 to connect NVIDIA GPU architecture, systems topology, and workload behavior.',
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'System Mental Model',
    period: 'Core notes',
    summary:
      'Turn the reading into a performance map: hardware limits, software stacks, and bottlenecks that can be measured.',
    groups: [
      {
        resources: [
          {
            title: 'Chapter 1. Introduction and AI System Overview',
            href: 'https://www.amazon.com/Systems-Performance-Engineering-Optimizing-Inference/dp/B0F47689K8',
            meta: 'Reading note',
            notes: [
              'Clarifies why AI performance work sits between model development, infrastructure, and hardware.',
              'Frames future systems around extremely large parameter counts and the infrastructure needed to serve them.',
            ],
          },
          {
            title: 'Chapter 2. AI System Hardware Overview',
            href: 'https://www.amazon.com/Systems-Performance-Engineering-Optimizing-Inference/dp/B0F47689K8',
            meta: 'Reading note',
            notes: [
              'Focuses on NVIDIA GPU generations and what changes from H100-class systems to B200/NVL72-style systems.',
              'Connects accelerator architecture, memory capacity, bandwidth, and multi-GPU communication to model workloads.',
            ],
          },
        ],
      },
    ],
  },
];

const aiPerformancePracticePath = [
  'Read Chapter 1 and write down what the performance engineer owns in the stack',
  'Read Chapter 2 and build a hardware checklist for GPU, memory, and interconnect bottlenecks',
  'Pick one small training or inference workload and profile before changing code',
  'Separate bottlenecks into compute-bound, memory-bound, communication-bound, and scheduling-bound',
];

const aiPerformanceMinimalPath = [
  'Chapter 1 for role and system overview',
  'Chapter 2 for hardware architecture',
  'One profiler pass on a real model workload',
];

const aiPerformanceTopThree = [
  'Chapter 1 system overview',
  'Chapter 2 hardware overview',
  'Profiler-first bottleneck taxonomy',
];

const aiPerformanceConcepts = `AI Performance Engineering
|-- Workloads
|   |-- Training: throughput, memory pressure, communication
|   |-- Inference: latency, batching, KV cache, serving utilization
|-- Hardware
|   |-- GPU architecture, tensor cores, HBM, interconnect
|-- Method
    |-- Measure, classify bottleneck, optimize, re-measure`;

const kernelBasicsReadingChecklist = [
  'Programming model: blocks, warps, memory movement, and vectorized operations',
  'Compiler stack: Triton, JAX, XLA, and generated kernels',
  'Attention: IO-awareness, tiling, parallelism, and work partitioning',
  'Serving memory: KV cache layout and paging for LLM inference',
  'Practice: implement small kernels before reading production code',
];

const kernelBasicsPhases: Phase[] = [
  {
    title: 'Kernel Programming Tools',
    period: 'Foundations',
    summary:
      'Start with Triton for explicit GPU kernel thinking, then use JAX to understand compiled array programs and XLA-oriented workflows.',
    groups: [
      {
        resources: [
          {
            title: 'Learning Triton GPU Kernels',
            href: 'https://triton-lang.org/main/getting-started/tutorials/',
            meta: 'Official tutorials',
            notes: [
              'Triton is the most direct bridge from Python to custom GPU kernels for deep learning primitives.',
              'Focus on how programs map to tiles, memory movement, and parallel execution.',
              'Use the tutorials as implementation checkpoints rather than passive reading.',
            ],
          },
          {
            title: 'My Triton Implementations',
            href: 'https://github.com/ssydyc2/learn_triton',
            meta: 'Practice repository',
            notes: [
              'Use this as the hands-on track for writing and comparing kernels.',
              'Keep implementations small enough that memory access patterns remain visible.',
            ],
          },
          {
            title: 'Learning JAX',
            href: 'https://jax.readthedocs.io/en/latest/tutorials.html',
            meta: 'Official tutorials',
            notes: [
              'JAX combines NumPy-style code, automatic differentiation, and XLA compilation.',
              'Read it as a way to understand compiled ML programs and accelerator portability.',
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Attention & Serving Papers',
    period: 'Core papers',
    summary:
      'Use these papers to connect kernel-level optimization to the LLM workloads that make those kernels matter.',
    groups: [
      {
        resources: [
          {
            title: 'FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness',
            href: 'https://arxiv.org/abs/2205.14135',
            meta: 'Tri Dao et al., NeurIPS 2022',
            notes: [
              'Foundational paper for IO-aware exact attention.',
              'Read for the tiling and memory movement argument, not just the benchmark results.',
            ],
          },
          {
            title: 'FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning',
            href: 'https://arxiv.org/abs/2307.08691',
            meta: 'Tri Dao, ICLR 2024',
            notes: [
              'Improves attention performance through better parallelism and work partitioning.',
              'Use it to understand why the first fast kernel is rarely the final fast kernel.',
            ],
          },
          {
            title: 'Efficient Memory Management for Large Language Model Serving with PagedAttention',
            href: 'https://arxiv.org/abs/2309.06180',
            meta: 'vLLM, SOSP 2023',
            notes: [
              'Moves from kernels into serving memory management.',
              'Explains why KV cache layout and allocation are first-order inference performance problems.',
            ],
          },
        ],
      },
    ],
  },
];

const kernelBasicsPracticePath = [
  'Implement one Triton vector add or matmul-style kernel and inspect the memory pattern',
  'Run a JAX tutorial and inspect how jit changes execution behavior',
  'Read FlashAttention v1 for IO-awareness, then FlashAttention v2 for parallelism',
  'Read PagedAttention to connect kernels with LLM serving memory pressure',
];

const kernelBasicsMinimalPath = [
  'Triton tutorials',
  'JAX jit and array programming basics',
  'FlashAttention v1',
  'PagedAttention',
];

const kernelBasicsTopThree = [
  'Triton tutorials',
  'FlashAttention v1',
  'PagedAttention',
];

const kernelBasicsConcepts = `LLM Kernel & Runtime Basics
|-- Kernel Tools
|   |-- Triton: explicit custom GPU kernels
|   |-- JAX/XLA: compiled array programs
|-- Attention
|   |-- IO-aware tiling
|   |-- Parallelism and work partitioning
|-- Serving Runtime
    |-- KV cache layout
    |-- Memory paging and batching`;

const aiPerformanceBook = {
  title: 'AI Systems Performance Engineering',
  author: 'Chris Fregly',
  href: 'https://www.amazon.com/Systems-Performance-Engineering-Optimizing-Inference/dp/B0F47689K8',
  description:
    'This section is a reading log for one book. The goal is to turn each chapter into a practical systems-performance mental model for training and inference work.',
  focusAreas: [
    'What an AI systems performance engineer is responsible for',
    'How GPU hardware, memory, and interconnect limits shape model workloads',
    'How to move from vague slowness to measurable bottleneck categories',
  ],
  chapters: [
    {
      number: '01',
      title: 'Introduction and AI System Overview',
      status: 'Reading note',
      notes: [
        'Frames AI performance work as an engineering role between model development, infrastructure, and hardware.',
        'Introduces the scale pressure behind modern AI systems, including infrastructure for much larger future models.',
      ],
    },
    {
      number: '02',
      title: 'AI System Hardware Overview',
      status: 'Reading note',
      notes: [
        'Connects NVIDIA GPU generations, memory capacity, bandwidth, and multi-GPU topology to real model workloads.',
        'Useful for building a hardware checklist before profiling training or inference performance.',
      ],
    },
  ],
};

const kernelLearningMap = [
  {
    title: 'Triton',
    subtitle: 'Write kernels directly',
    href: 'https://triton-lang.org/main/getting-started/tutorials/',
    details:
      'Use Triton to learn tiling, memory movement, parallel execution, and the shape of custom deep learning primitives.',
    actions: ['Run official tutorials', 'Implement small kernels', 'Compare memory access patterns'],
  },
  {
    title: 'JAX',
    subtitle: 'Understand compiled array programs',
    href: 'https://jax.readthedocs.io/en/latest/tutorials.html',
    details:
      'Use JAX to understand jit, automatic differentiation, XLA compilation, and accelerator-portable ML code.',
    actions: ['Study jit behavior', 'Trace array programs', 'Connect code shape to compiler output'],
  },
  {
    title: 'Core LLM Papers',
    subtitle: 'Read why kernels matter',
    href: 'https://arxiv.org/abs/2205.14135',
    details:
      'Use FlashAttention and PagedAttention to connect kernel work with attention IO, KV cache pressure, and serving throughput.',
    actions: ['Read FlashAttention v1', 'Read FlashAttention v2', 'Read PagedAttention'],
  },
];

const kernelPaperList = [
  {
    title: 'FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness',
    href: 'https://arxiv.org/abs/2205.14135',
    meta: 'NeurIPS 2022',
    why: 'Start here for IO-aware attention and the core tiling argument.',
  },
  {
    title: 'FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning',
    href: 'https://arxiv.org/abs/2307.08691',
    meta: 'ICLR 2024',
    why: 'Read next to see how parallelism and work partitioning improve the first design.',
  },
  {
    title: 'Efficient Memory Management for Large Language Model Serving with PagedAttention',
    href: 'https://arxiv.org/abs/2309.06180',
    meta: 'SOSP 2023',
    why: 'Use this to move from kernels into KV cache layout and inference-serving memory management.',
  },
];

const kernelPracticeSequence = [
  'Implement one small Triton kernel so memory movement is visible.',
  'Run a JAX jit example and observe how eager code changes under compilation.',
  'Read FlashAttention v1 for IO-awareness, then FlashAttention v2 for work partitioning.',
  'Read PagedAttention to connect kernel-level thinking with LLM serving runtime behavior.',
];

const studyPlans: StudyPlan[] = [
  {
    id: 'efficient-rl-for-llms',
    title: 'Study Plan: Efficient RL for LLMs',
    eyebrow: 'Two-week plan',
    summary:
      'A structured plan for learning RLHF/RL systems and algorithms for LLM alignment, organized in 5 phases across ~2 weeks.',
    readingChecklist,
    phases,
    frameworkRows,
    practicePath,
    minimalPath,
    topThree,
    keyConcepts,
  },
  {
    id: 'ai-performance-engineer',
    title: 'Book Reading Notes: AI Systems Performance Engineering',
    eyebrow: 'Book notes',
    summary:
      "Reading notes for Chris Fregly's book, focused on the systems-performance mental model behind AI training and inference workloads.",
    readingChecklist: aiPerformanceReadingChecklist,
    phases: aiPerformancePhases,
    frameworkRows: [],
    practicePath: aiPerformancePracticePath,
    minimalPath: aiPerformanceMinimalPath,
    topThree: aiPerformanceTopThree,
    keyConcepts: aiPerformanceConcepts,
  },
  {
    id: 'llm-kernel-runtime-basics',
    title: 'Study Plan: LLM Kernel & Runtime Basics',
    eyebrow: 'Learning map',
    summary:
      'A learning map for Triton, JAX, and the core attention and serving papers behind modern LLM performance work.',
    readingChecklist: kernelBasicsReadingChecklist,
    phases: kernelBasicsPhases,
    frameworkRows: [],
    practicePath: kernelBasicsPracticePath,
    minimalPath: kernelBasicsMinimalPath,
    topThree: kernelBasicsTopThree,
    keyConcepts: kernelBasicsConcepts,
  },
];

const planImages: Record<string, { src: string; alt: string }> = {
  'efficient-rl-for-llms': {
    src: rlForLlmsImage,
    alt: '2D illustration of an RL pipeline for LLM training systems',
  },
  'ai-performance-engineer': {
    src: aiPerformanceImage,
    alt: '2D illustration of an AI performance engineering desk with GPU hardware and charts',
  },
  'llm-kernel-runtime-basics': {
    src: kernelRuntimeImage,
    alt: '2D illustration of GPU kernels, attention tiles, and LLM runtime cache pages',
  },
};

function PlanVisual({ planId, compact = false }: { planId: string; compact?: boolean }) {
  const image = planImages[planId] ?? planImages['efficient-rl-for-llms'];
  const className = compact
    ? 'h-28 w-full border border-[#d8cec0] bg-[#eee7da] object-cover'
    : 'aspect-[16/9] w-full border border-[#d8cec0] bg-[#eee7da] object-cover';

  return (
    <img
      src={image.src}
      alt={image.alt}
      className={className}
      loading={compact ? 'lazy' : 'eager'}
      decoding="async"
    />
  );
}

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <article className="border-b border-[#d8cec0] py-7 last:border-b-0">
      <div className="space-y-2.5">
        <a
          href={resource.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-xl font-light leading-snug text-[#20231f] transition-colors hover:text-[#0f766e]"
        >
          {resource.title}
        </a>
        {resource.meta && (
          <p className="font-mono text-xs text-[#8a9188]">{resource.meta}</p>
        )}
      </div>
      <ul className="mt-4 space-y-2.5">
        {resource.notes.map((note) => (
          <li key={note} className="flex gap-3 text-base leading-7 text-[#61685f]">
            <span className="mt-3 h-1 w-1 shrink-0 rounded-full bg-[#b7791f]" />
            <span>{note}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function PhaseSection({ phase, index }: { phase: Phase; index: number }) {
  return (
    <section id={`phase-${index + 1}`} className="scroll-mt-8 space-y-5">
      <div className="border-b border-[#958979] pb-5">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#8a9188]">{phase.period}</p>
        <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 className="font-serif text-2xl font-normal text-[#20231f]">{phase.title}</h2>
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#8a9188]">{phase.label ?? `Phase ${index + 1}`}</span>
        </div>
        <p className="mt-3 max-w-3xl text-base leading-7 text-[#61685f]">{phase.summary}</p>
      </div>
      <div className="space-y-8">
        {phase.groups.map((group) => (
          <div key={group.title ?? phase.title}>
            {group.title && (
              <h3 className="mb-1 font-mono text-xs uppercase tracking-[0.16em] text-[#8a9188]">
                {group.title}
              </h3>
            )}
            <div>
              {group.resources.map((resource) => (
                <ResourceCard key={resource.title} resource={resource} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function NumberedList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="border-t border-[#958979] pt-7">
      <h2 className="font-serif text-xl font-normal text-[#20231f]">{title}</h2>
      <ol className="mt-4 space-y-3">
        {items.map((item, index) => (
          <li key={item} className="flex gap-4 text-base leading-7 text-[#61685f]">
            <span className="w-6 shrink-0 text-right font-mono text-xs text-[#8a9188]">
              {index + 1}.
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ReadingChecklist({ items }: { items: string[] }) {
  return (
    <section className="border-y border-[#958979] bg-[#fffdf7]/60 py-7">
      <h2 className="font-serif text-xl font-normal text-[#20231f]">Reading Checklist</h2>
      <ul className="mt-4 grid gap-x-8 gap-y-3 md:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-base leading-7 text-[#61685f]">
            <span className="mt-3 h-px w-4 shrink-0 bg-[#0f766e]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function FrameworkComparison({ rows }: { rows: string[][] }) {
  return (
    <section className="space-y-4 border-t border-[#958979] pt-7">
      <h2 className="font-serif text-xl font-normal text-[#20231f]">Framework Comparison</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-y border-[#958979] bg-[#fffdf7]/70 text-left text-sm">
          <thead className="font-mono text-xs uppercase tracking-[0.14em] text-[#61685f]">
            <tr className="border-b border-[#d8cec0]">
              <th className="py-3 pr-5 font-medium">Framework</th>
              <th className="px-5 py-3 font-medium">Canonical Paper</th>
              <th className="px-5 py-3 font-medium">Sync/Async</th>
              <th className="px-5 py-3 font-medium">Placement</th>
              <th className="py-3 pl-5 font-medium">Read First</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#d8cec0] text-[#61685f]">
            {rows.map((row) => (
              <tr key={row[0]}>
                {row.map((cell, index) => (
                  <td
                    key={`${row[0]}-${cell}`}
                    className={`py-3 align-top leading-6 ${
                      index === 0 ? 'pr-5 font-mono text-[#20231f]' : index === row.length - 1 ? 'pl-5' : 'px-5'
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TopThree({ items }: { items: string[] }) {
  return (
    <section className="border-t border-[#958979] pt-7">
      <h2 className="font-serif text-xl font-normal text-[#20231f]">Top 3 If Short on Time</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {items.map((item, index) => (
          <p key={item} className="border-l border-[#d8cec0] pl-4 text-base leading-7 text-[#61685f]">
            <span className="block font-mono text-xs text-[#8a9188]">{index + 1}</span>
            {item}
          </p>
        ))}
      </div>
    </section>
  );
}

function KeyConcepts({ concepts }: { concepts: string }) {
  return (
    <section className="border-t border-[#958979] pt-7">
      <h2 className="font-serif text-xl font-normal text-[#20231f]">Key Concepts Map</h2>
      <pre className="mt-4 overflow-x-auto border-y border-[#958979] bg-[#eee7da] px-4 py-5 text-sm leading-7 text-[#454b44]">
        {concepts}
      </pre>
    </section>
  );
}

function EfficientRlDetail({ plan }: { plan: StudyPlan }) {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PlanVisual planId={plan.id} />
      <MarkdownDocument markdown={efficientRlMarkdown} />
    </div>
  );
}

function StructuredStudyPlanDetail({ plan }: { plan: StudyPlan }) {
  return (
    <article className="mx-auto max-w-3xl space-y-12">
      <PlanVisual planId={plan.id} />
      <header className="border-b border-[#958979] pb-8">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#8a9188]">{plan.eyebrow}</p>
        <h1 className="mt-3 font-serif text-4xl font-normal leading-tight text-[#20231f]">{plan.title}</h1>
        <p className="mt-4 text-lg leading-8 text-[#61685f]">{plan.summary}</p>

        <nav aria-label="Study plan phases" className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs text-[#8a9188]">
          {plan.phases.map((phase, index) => (
            <a key={phase.title} href={`#phase-${index + 1}`} className="transition-colors hover:text-[#0f766e]">
              {phase.title}
            </a>
          ))}
        </nav>
      </header>

      {plan.readingChecklist.length > 0 && (
        <ReadingChecklist items={plan.readingChecklist} />
      )}

      {plan.phases.map((phase, index) => (
        <PhaseSection key={phase.title} phase={phase} index={index} />
      ))}

      {plan.frameworkRows.length > 0 && (
        <FrameworkComparison rows={plan.frameworkRows} />
      )}

      {(plan.practicePath.length > 0 || plan.minimalPath.length > 0) && (
        <div className="grid gap-10 md:grid-cols-2">
          {plan.practicePath.length > 0 && (
            <NumberedList title="Suggested Practice Path" items={plan.practicePath} />
          )}
          {plan.minimalPath.length > 0 && (
            <NumberedList title="Minimal Path" items={plan.minimalPath} />
          )}
        </div>
      )}

      {plan.topThree.length > 0 && (
        <TopThree items={plan.topThree} />
      )}

      {plan.keyConcepts && (
        <KeyConcepts concepts={plan.keyConcepts} />
      )}
    </article>
  );
}

function AIPerformanceBookDetail({ plan }: { plan: StudyPlan }) {
  return (
    <article className="mx-auto max-w-4xl space-y-12">
      <PlanVisual planId={plan.id} />
      <header className="max-w-3xl">
        <h1 className="font-serif text-4xl font-normal leading-tight text-[#20231f]">{plan.title}</h1>
        <p className="mt-4 text-lg leading-8 text-[#61685f]">{plan.summary}</p>
      </header>

      <section className="grid gap-8 border-y border-[#958979] bg-[#fffdf7]/60 py-8 md:grid-cols-[minmax(0,1fr)_16rem]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#8a9188]">Book note</p>
          <h2 className="mt-3 font-serif text-3xl font-normal leading-tight text-[#20231f]">
            {aiPerformanceBook.title}
          </h2>
          <p className="mt-2 font-mono text-sm text-[#61685f]">by {aiPerformanceBook.author}</p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#61685f]">
            {aiPerformanceBook.description}
          </p>
          <a
            href={aiPerformanceBook.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex font-mono text-sm text-[#0f766e] transition-colors hover:text-[#0b5f59]"
          >
            View book &rarr;
          </a>
        </div>

        <aside className="border-l border-[#d8cec0] pl-6">
          <h3 className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-[#8a9188]">
            What I am extracting
          </h3>
          <ul className="mt-4 space-y-4">
            {aiPerformanceBook.focusAreas.map((area) => (
              <li key={area} className="text-sm leading-6 text-[#61685f]">
                {area}
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <section>
        <div className="flex flex-col gap-2 border-b border-[#958979] pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#8a9188]">Current notes</p>
            <h2 className="mt-2 font-serif text-2xl font-normal text-[#20231f]">Chapter Notes</h2>
          </div>
          <span className="font-mono text-xs text-[#8a9188]">{aiPerformanceBook.chapters.length} chapters</span>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {aiPerformanceBook.chapters.map((chapter) => (
            <article key={chapter.number} className="border border-[#d8cec0] bg-[#fffdf7] p-5 shadow-[3px_3px_0_#d8cec0]">
              <div className="flex items-start gap-4">
                <span className="shrink-0 font-mono text-3xl font-light text-[#b7791f]">
                  {chapter.number}
                </span>
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#8a9188]">{chapter.status}</p>
                  <h3 className="mt-2 text-lg font-medium leading-snug text-[#20231f]">
                    {chapter.title}
                  </h3>
                </div>
              </div>
              <ul className="mt-5 space-y-3">
                {chapter.notes.map((note) => (
                  <li key={note} className="border-l border-[#d8cec0] pl-4 text-sm leading-6 text-[#61685f]">
                    {note}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </article>
  );
}

function KernelBasicsDetail({ plan }: { plan: StudyPlan }) {
  return (
    <article className="mx-auto max-w-4xl space-y-12">
      <PlanVisual planId={plan.id} />
      <header className="max-w-3xl">
        <h1 className="font-serif text-4xl font-normal leading-tight text-[#20231f]">{plan.title}</h1>
        <p className="mt-4 text-lg leading-8 text-[#61685f]">{plan.summary}</p>
      </header>

      <section className="border-y border-[#958979] py-8">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#8a9188]">Learning map</p>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {kernelLearningMap.map((track) => (
            <a
              key={track.title}
              href={track.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-full flex-col border border-[#d8cec0] bg-[#fffdf7] p-5 shadow-[3px_3px_0_#d8cec0] transition-colors hover:border-[#958979]"
            >
              <p className="font-mono text-xs text-[#8a9188]">{track.subtitle}</p>
              <h2 className="mt-2 font-serif text-2xl font-normal text-[#20231f] transition-colors group-hover:text-[#0f766e]">
                {track.title}
              </h2>
              <p className="mt-4 flex-1 text-sm leading-6 text-[#61685f]">{track.details}</p>
              <ul className="mt-5 space-y-2">
                {track.actions.map((action) => (
                  <li key={action} className="font-mono text-xs leading-5 text-[#61685f]">
                    {action}
                  </li>
                ))}
              </ul>
            </a>
          ))}
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-[16rem_minmax(0,1fr)]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#8a9188]">Sequence</p>
          <h2 className="mt-2 font-serif text-2xl font-normal text-[#20231f]">How to study it</h2>
        </div>
        <ol className="space-y-4">
          {kernelPracticeSequence.map((item, index) => (
            <li key={item} className="grid gap-4 border-b border-[#d8cec0] pb-4 last:border-b-0 sm:grid-cols-[3rem_minmax(0,1fr)]">
              <span className="font-mono text-2xl font-light text-[#b7791f]">0{index + 1}</span>
              <p className="text-base leading-7 text-[#61685f]">{item}</p>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <div className="border-b border-[#958979] pb-4">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#8a9188]">Papers</p>
          <h2 className="mt-2 font-serif text-2xl font-normal text-[#20231f]">Core LLM Performance Papers</h2>
        </div>
        <div className="divide-y divide-[#d8cec0]">
          {kernelPaperList.map((paper) => (
            <article key={paper.title} className="grid gap-4 py-6 md:grid-cols-[minmax(0,1fr)_8rem]">
              <div>
                <a
                  href={paper.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl font-light leading-snug text-[#20231f] transition-colors hover:text-[#0f766e]"
                >
                  {paper.title}
                </a>
                <p className="mt-3 text-base leading-7 text-[#61685f]">{paper.why}</p>
              </div>
              <p className="font-mono text-xs text-[#8a9188] md:text-right">{paper.meta}</p>
            </article>
          ))}
        </div>
      </section>
    </article>
  );
}

function StudyPlanDetail({ plan }: { plan: StudyPlan }) {
  if (plan.id === 'efficient-rl-for-llms') {
    return <EfficientRlDetail plan={plan} />;
  }

  if (plan.id === 'ai-performance-engineer') {
    return <AIPerformanceBookDetail plan={plan} />;
  }

  if (plan.id === 'llm-kernel-runtime-basics') {
    return <KernelBasicsDetail plan={plan} />;
  }

  return <StructuredStudyPlanDetail plan={plan} />;
}

function StudyHeroScene() {
  return (
    <HeroScene
      src={studyHeroImage}
      alt="Anime-style nighttime study scene with a back-facing person working on a laptop"
      variant="study"
    />
  );
}

function StudyPlanIndex({ plans }: { plans: StudyPlan[] }) {
  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <header>
        <StudyHeroScene />
        <h1 className="font-serif text-4xl font-normal leading-tight text-[#20231f]">Blog</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[#61685f]">
          Welcome 👋, this is my Blog 📝, a place to share and learn AI 🤖
        </p>
      </header>

      <div className="border-y border-[#958979]">
        {plans.map((plan) => (
          <Link
            key={plan.id}
            to={`/blog/${plan.id}`}
            className="group grid gap-5 border-b border-[#d8cec0] py-8 transition-colors last:border-b-0 hover:bg-[#fffdf7]/70 sm:grid-cols-[9rem_minmax(0,1fr)_2rem] sm:items-center sm:px-4"
          >
            <PlanVisual planId={plan.id} compact />
            <article className="min-w-0">
              <h2 className="font-serif text-2xl font-normal leading-snug text-[#20231f] transition-colors group-hover:text-[#0f766e]">
                {plan.title}
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[#61685f]">
                {plan.summary}
              </p>
            </article>
            <span
              aria-hidden="true"
              className="font-mono text-2xl font-light text-[#8a9188] transition-all group-hover:translate-x-1 group-hover:text-[#0f766e]"
            >
              &rarr;
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function StudyPlans() {
  const { planId } = useParams();
  const activePlan = studyPlans.find((plan) => plan.id === planId);

  if (activePlan) {
    return (
      <div className="min-h-screen text-[#20231f]">
        <main className="mx-auto max-w-5xl px-6 py-12">
          <div className="space-y-8">
            <Link
              to="/blog"
              className="font-mono text-xs uppercase tracking-[0.16em] text-[#8a9188] transition-colors hover:text-[#0f766e]"
            >
              Back to blog
            </Link>
            <StudyPlanDetail plan={activePlan} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[#20231f]">
      <main className="mx-auto max-w-5xl px-6 py-12">
        <StudyPlanIndex plans={studyPlans} />
      </main>
    </div>
  );
}
