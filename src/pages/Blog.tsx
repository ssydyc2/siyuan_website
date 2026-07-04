import { Link, useParams } from 'react-router-dom';
import aiPerformanceImage from '../assets/blog/ai-systems-performance-engineering-2d-hd.webp';
import rlForLlmsImage from '../assets/blog/efficient-rl-for-llms-2d-hd.webp';
import kernelRuntimeImage from '../assets/blog/llm-kernel-runtime-basics-2d-hd.webp';
import blogHeroImage from '../assets/hero/study-systems-anime.webp';
import HeroScene from '../components/HeroScene';
import MarkdownDocument from '../components/MarkdownDocument';
import ThemeToggle from '../components/ThemeToggle';
import efficientRlMarkdown from '../content/blog/efficient-rl-for-llms.md?raw';
import kernelBasicsMarkdown from '../content/blog/llm-kernel-runtime-basics.md?raw';

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

interface BlogPost {
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
    period: 'Core algorithms',
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
    period: 'Systems papers',
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
    period: 'Tooling',
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
    period: 'Practice',
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

const aiPerformanceBook = {
  href: 'https://www.amazon.com/Systems-Performance-Engineering-Optimizing-Inference/dp/B0F47689K8',
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

const kernelRuntimePhases: Phase[] = [
  {
    title: 'Core LLM Performance Papers',
    period: 'Phase 1',
    label: 'Phase 1',
    summary: 'Start with FlashAttention, FlashAttention-2, and PagedAttention to connect attention kernels with serving constraints.',
    groups: [],
  },
  {
    title: 'Kernel Programming Tools',
    period: 'Phase 2',
    label: 'Phase 2',
    summary: 'Move into Triton and JAX after the papers define the memory movement and compiler/runtime problems that matter.',
    groups: [],
  },
  {
    title: 'Implementation Practice',
    period: 'Phase 3',
    label: 'Phase 3',
    summary: 'Use small Triton implementations to turn paper concepts into concrete memory-access patterns.',
    groups: [],
  },
];

const blogPosts: BlogPost[] = [
  {
    id: 'efficient-rl-for-llms',
    title: 'Study Guide: Efficient RL for LLMs',
    eyebrow: 'Learning guide',
    summary:
      'A structured guide for learning RLHF/RL systems and algorithms for LLM alignment, organized as phases readers can move through at their own pace.',
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
      'A learning map for the core attention and serving papers behind modern LLM performance work, followed by Triton and JAX practice.',
    readingChecklist: [],
    phases: kernelRuntimePhases,
    frameworkRows: [],
    practicePath: [],
    minimalPath: [],
    topThree: [],
    keyConcepts: '',
  },
];

const blogPostImages: Record<string, { src: string; alt: string }> = {
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

function BlogPostVisual({ postId, compact = false }: { postId: string; compact?: boolean }) {
  const image = blogPostImages[postId] ?? blogPostImages['efficient-rl-for-llms'];
  const className = compact
    ? 'blog-post-visual blog-post-visual--compact h-28 w-full border border-[var(--rule)] bg-[var(--paper-muted)]'
    : 'blog-post-visual aspect-[16/9] w-full border border-[var(--rule)] bg-[var(--paper-muted)]';

  return (
    <span className={className}>
      <img
        src={image.src}
        alt={image.alt}
        className="blog-post-visual__image h-full w-full object-cover"
        loading={compact ? 'lazy' : 'eager'}
        decoding="async"
      />
    </span>
  );
}

function getBlogPreviewItems(post: BlogPost): { label: string; title: string; summary: string }[] {
  if (post.id === 'ai-performance-engineer') {
    return aiPerformanceBook.chapters.map((chapter) => ({
      label: `Chapter ${chapter.number}`,
      title: chapter.title,
      summary: '',
    }));
  }

  if (post.phases.length > 0) {
    return post.phases.map((phase, index) => ({
      label: phase.label ?? phase.period ?? `Phase ${index + 1}`,
      title: phase.title,
      summary: phase.summary,
    }));
  }

  if (post.topThree.length > 0) {
    return post.topThree.slice(0, 3).map((item, index) => ({
      label: `Note ${index + 1}`,
      title: item,
      summary: '',
    }));
  }

  if (post.readingChecklist.length > 0) {
    return post.readingChecklist.slice(0, 3).map((item, index) => ({
      label: `Check ${index + 1}`,
      title: item,
      summary: '',
    }));
  }

  return [{ label: 'Overview', title: post.summary, summary: '' }];
}

function BlogPostPreview({ post }: { post: BlogPost }) {
  const previewItems = getBlogPreviewItems(post);

  return (
    <div className="blog-post-preview" aria-label={`${post.title} preview`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="border border-[var(--rule)] bg-[var(--paper)] px-2 py-0.5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--accent)]">
          {post.eyebrow}
        </span>
        <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
          Reading path
        </span>
      </div>
      <ol className="blog-post-preview__list">
        {previewItems.map((item) => (
          <li key={`${item.label}-${item.title}`} className="blog-post-preview__item">
            <span className="blog-post-preview__marker" aria-hidden="true" />
            <div className="min-w-0">
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
                {item.label}
              </span>
              <p className="mt-1 text-sm font-medium leading-5 text-[var(--ink)]">{item.title}</p>
              {item.summary && (
                <p className="mt-1 text-sm leading-6 text-[var(--ink-muted)]">{item.summary}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <article className="border-b border-[var(--rule)] py-7 last:border-b-0">
      <div className="space-y-2.5">
        <a
          href={resource.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-xl font-light leading-snug text-[var(--ink)] transition-colors hover:text-[var(--accent)]"
        >
          {resource.title}
        </a>
        {resource.meta && (
          <p className="font-mono text-xs text-[var(--ink-faint)]">{resource.meta}</p>
        )}
      </div>
      <ul className="mt-4 space-y-2.5">
        {resource.notes.map((note) => (
          <li key={note} className="flex gap-3 text-base leading-7 text-[var(--ink-muted)]">
            <span className="mt-3 h-1 w-1 shrink-0 rounded-full bg-[var(--amber)]" />
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
      <div className="border-b border-[var(--rule-strong)] pb-5">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--ink-faint)]">{phase.period}</p>
        <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 className="font-serif text-2xl font-normal text-[var(--ink)]">{phase.title}</h2>
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--ink-faint)]">{phase.label ?? `Phase ${index + 1}`}</span>
        </div>
        <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--ink-muted)]">{phase.summary}</p>
      </div>
      <div className="space-y-8">
        {phase.groups.map((group) => (
          <div key={group.title ?? phase.title}>
            {group.title && (
              <h3 className="mb-1 font-mono text-xs uppercase tracking-[0.16em] text-[var(--ink-faint)]">
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
    <section className="border-t border-[var(--rule-strong)] pt-7">
      <h2 className="font-serif text-xl font-normal text-[var(--ink)]">{title}</h2>
      <ol className="mt-4 space-y-3">
        {items.map((item, index) => (
          <li key={item} className="flex gap-4 text-base leading-7 text-[var(--ink-muted)]">
            <span className="w-6 shrink-0 text-right font-mono text-xs text-[var(--ink-faint)]">
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
    <section className="border-y border-[var(--rule-strong)] bg-[var(--paper-elevated)] py-7">
      <h2 className="font-serif text-xl font-normal text-[var(--ink)]">Reading Checklist</h2>
      <ul className="mt-4 grid gap-x-8 gap-y-3 md:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-base leading-7 text-[var(--ink-muted)]">
            <span className="mt-3 h-px w-4 shrink-0 bg-[var(--accent)]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function FrameworkComparison({ rows }: { rows: string[][] }) {
  return (
    <section className="space-y-4 border-t border-[var(--rule-strong)] pt-7">
      <h2 className="font-serif text-xl font-normal text-[var(--ink)]">Framework Comparison</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-y border-[var(--rule-strong)] bg-[var(--paper-elevated)] text-left text-sm">
          <thead className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--ink-muted)]">
            <tr className="border-b border-[var(--rule)]">
              <th className="py-3 pr-5 font-medium">Framework</th>
              <th className="px-5 py-3 font-medium">Canonical Paper</th>
              <th className="px-5 py-3 font-medium">Sync/Async</th>
              <th className="px-5 py-3 font-medium">Placement</th>
              <th className="py-3 pl-5 font-medium">Read First</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--rule)] text-[var(--ink-muted)]">
            {rows.map((row) => (
              <tr key={row[0]}>
                {row.map((cell, index) => (
                  <td
                    key={`${row[0]}-${cell}`}
                    className={`py-3 align-top leading-6 ${
                      index === 0 ? 'pr-5 font-mono text-[var(--ink)]' : index === row.length - 1 ? 'pl-5' : 'px-5'
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
    <section className="border-t border-[var(--rule-strong)] pt-7">
      <h2 className="font-serif text-xl font-normal text-[var(--ink)]">Top 3 If Short on Time</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {items.map((item, index) => (
          <p key={item} className="border-l border-[var(--rule)] pl-4 text-base leading-7 text-[var(--ink-muted)]">
            <span className="block font-mono text-xs text-[var(--ink-faint)]">{index + 1}</span>
            {item}
          </p>
        ))}
      </div>
    </section>
  );
}

function KeyConcepts({ concepts }: { concepts: string }) {
  return (
    <section className="border-t border-[var(--rule-strong)] pt-7">
      <h2 className="font-serif text-xl font-normal text-[var(--ink)]">Key Concepts Map</h2>
      <pre className="mt-4 overflow-x-auto border-y border-[var(--rule-strong)] bg-[var(--paper-muted)] px-4 py-5 text-sm leading-7 text-[var(--ink-soft)]">
        {concepts}
      </pre>
    </section>
  );
}

function EfficientRlDetail({ post }: { post: BlogPost }) {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <BlogPostVisual postId={post.id} />
      <MarkdownDocument markdown={efficientRlMarkdown} />
    </div>
  );
}

function StructuredBlogPostDetail({ post }: { post: BlogPost }) {
  return (
    <article className="mx-auto max-w-3xl space-y-12">
      <BlogPostVisual postId={post.id} />
      <header className="border-b border-[var(--rule-strong)] pb-8">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--ink-faint)]">{post.eyebrow}</p>
        <h1 className="mt-3 font-serif text-4xl font-normal leading-tight text-[var(--ink)]">{post.title}</h1>
        <p className="mt-4 text-lg leading-8 text-[var(--ink-muted)]">{post.summary}</p>

        <nav aria-label="Blog post sections" className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs text-[var(--ink-faint)]">
          {post.phases.map((phase, index) => (
            <a key={phase.title} href={`#phase-${index + 1}`} className="transition-colors hover:text-[var(--accent)]">
              {phase.title}
            </a>
          ))}
        </nav>
      </header>

      {post.readingChecklist.length > 0 && (
        <ReadingChecklist items={post.readingChecklist} />
      )}

      {post.phases.map((phase, index) => (
        <PhaseSection key={phase.title} phase={phase} index={index} />
      ))}

      {post.frameworkRows.length > 0 && (
        <FrameworkComparison rows={post.frameworkRows} />
      )}

      {(post.practicePath.length > 0 || post.minimalPath.length > 0) && (
        <div className="grid gap-10 md:grid-cols-2">
          {post.practicePath.length > 0 && (
            <NumberedList title="Suggested Practice Path" items={post.practicePath} />
          )}
          {post.minimalPath.length > 0 && (
            <NumberedList title="Minimal Path" items={post.minimalPath} />
          )}
        </div>
      )}

      {post.topThree.length > 0 && (
        <TopThree items={post.topThree} />
      )}

      {post.keyConcepts && (
        <KeyConcepts concepts={post.keyConcepts} />
      )}
    </article>
  );
}

function AIPerformanceBookDetail({ post }: { post: BlogPost }) {
  return (
    <article className="mx-auto max-w-4xl space-y-12">
      <BlogPostVisual postId={post.id} />
      <header className="max-w-3xl">
        <h1 className="font-serif text-4xl font-normal leading-tight text-[var(--ink)]">{post.title}</h1>
        <p className="mt-4 text-lg leading-8 text-[var(--ink-muted)]">{post.summary}</p>
        <a
          href={aiPerformanceBook.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex font-mono text-sm text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)]"
        >
          View book &rarr;
        </a>
      </header>

      <section>
        <div className="flex flex-col gap-2 border-b border-[var(--rule-strong)] pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--ink-faint)]">Current notes</p>
            <h2 className="mt-2 font-serif text-2xl font-normal text-[var(--ink)]">Chapter Notes</h2>
          </div>
          <span className="font-mono text-xs text-[var(--ink-faint)]">{aiPerformanceBook.chapters.length} chapters</span>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {aiPerformanceBook.chapters.map((chapter) => (
            <article key={chapter.number} className="border border-[var(--rule)] bg-[var(--paper-elevated)] p-5 shadow-[3px_3px_0_var(--shadow-rule)]">
              <div className="flex items-start gap-4">
                <span className="shrink-0 font-mono text-3xl font-light text-[var(--amber)]">
                  {chapter.number}
                </span>
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--ink-faint)]">{chapter.status}</p>
                  <h3 className="mt-2 text-lg font-medium leading-snug text-[var(--ink)]">
                    {chapter.title}
                  </h3>
                </div>
              </div>
              <ul className="mt-5 space-y-3">
                {chapter.notes.map((note) => (
                  <li key={note} className="border-l border-[var(--rule)] pl-4 text-sm leading-6 text-[var(--ink-muted)]">
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

function KernelBasicsDetail({ post }: { post: BlogPost }) {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <BlogPostVisual postId={post.id} />
      <MarkdownDocument markdown={kernelBasicsMarkdown} />
    </div>
  );
}

function BlogPostDetail({ post }: { post: BlogPost }) {
  if (post.id === 'efficient-rl-for-llms') {
    return <EfficientRlDetail post={post} />;
  }

  if (post.id === 'ai-performance-engineer') {
    return <AIPerformanceBookDetail post={post} />;
  }

  if (post.id === 'llm-kernel-runtime-basics') {
    return <KernelBasicsDetail post={post} />;
  }

  return <StructuredBlogPostDetail post={post} />;
}

function BlogHeroScene() {
  return (
    <HeroScene
      src={blogHeroImage}
      alt="Anime-style nighttime study scene with a back-facing person working on a laptop"
      variant="study"
    />
  );
}

function BlogPostIndex({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <header>
        <BlogHeroScene />
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-4xl font-normal leading-tight text-[var(--ink)]">Blog</h1>
          <ThemeToggle />
        </div>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--ink-muted)]">
          Welcome 👋, this is my Blog 📝, a place to share and learn AI 🤖.
        </p>
        <p className="mt-2">
          <Link
            to="/"
            className="font-mono text-sm uppercase tracking-[0.16em] text-[var(--accent)] underline decoration-[var(--accent-decoration)] decoration-1 underline-offset-4 transition-colors hover:text-[var(--accent-strong)]"
          >
            More about me
          </Link>
        </p>
      </header>

      <div className="blog-post-list border-y border-[var(--rule-strong)]">
        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.id}`}
            className="blog-post-list__item group grid gap-5 border-b border-[var(--rule)] py-8 transition-colors last:border-b-0 hover:bg-[var(--paper-elevated)] focus-visible:bg-[var(--paper-elevated)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] sm:grid-cols-[9rem_minmax(0,1fr)_2rem] sm:items-start sm:px-4"
          >
            <BlogPostVisual postId={post.id} compact />
            <article className="min-w-0">
              <h2 className="font-serif text-2xl font-normal leading-snug text-[var(--ink)] transition-colors group-hover:text-[var(--accent)]">
                {post.title}
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--ink-muted)]">
                {post.summary}
              </p>
              <BlogPostPreview post={post} />
            </article>
            <span
              aria-hidden="true"
              className="font-mono text-2xl font-light text-[var(--ink-faint)] transition-all group-hover:translate-x-1 group-hover:text-[var(--accent)]"
            >
              &rarr;
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Blog() {
  const { postId } = useParams();
  const activePost = blogPosts.find((post) => post.id === postId);

  if (activePost) {
    return (
      <div className="min-h-screen text-[var(--ink)]">
        <main className="mx-auto max-w-5xl px-6 py-12">
          <div className="space-y-8">
            <Link
              to="/blog"
              className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--ink-faint)] transition-colors hover:text-[var(--accent)]"
            >
              Back to blog
            </Link>
            <BlogPostDetail post={activePost} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[var(--ink)]">
      <main className="mx-auto max-w-5xl px-6 py-12">
        <BlogPostIndex posts={blogPosts} />
      </main>
    </div>
  );
}
