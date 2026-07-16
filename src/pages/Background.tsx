import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import RpgHeroScene from '../components/RpgHeroScene';

type ExperienceIcon = 'ai' | 'ads' | 'ml' | 'network' | 'research' | 'math' | 'applied-math';

interface TimelineItem {
  period: string;
  title: string;
  company?: string;
  icon: ExperienceIcon;
  description: string;
  tags: string[];
}

const timelineData: TimelineItem[] = [
  {
    period: "2025 - Present",
    title: "Software Engineer, Machine Learning",
    company: "Meta Inc.",
    icon: "ai",
    description: "On the AI Platform team, working on LLM inference and training supporting other teams, especially for TPU.",
    tags: ["LLM", "Infra", "Performance Optimization"]
  },
  {
    period: "2022 - 2025",
    title: "Software Engineer, Machine Learning",
    company: "Meta Inc.",
    icon: "ads",
    description: "Trained and deployed machine learning models for users' languages, advertiser's subsidy and ads notifications that are running in Meta's ads systems",
    tags: ["ML Systems", "Ads"]
  },
  {
    period: "2020 - 2022",
    title: "Machine Learning Engineer",
    company: "Snap Inc.",
    icon: "ml",
    description: "Developed machine learning models for friend recommendations and notification optimization, directly impacting user engagement and retention.",
    tags: ["ML Systems", "Recommendation Systems"]
  },
  {
    period: "2018 - 2020",
    title: "Software Engineer, Infrastructure",
    company: "Snap Inc.",
    icon: "network",
    description: "Built service mesh infrastructure powering real-time communication for hundreds of millions of users.",
    tags: ["Distributed Systems", "Infrastructure"]
  },
  {
    period: "2013 - 2018",
    title: "Ph.D. in Operations Research\nM.S. in Computer Science",
    company: "University of Southern California",
    icon: "research",
    description: "Focused on theoretical optimization and algorithmic research",
    tags: ["Optimization", "Mathematical Modeling", "Research"]
  },
  {
    period: "2010 - 2013",
    title: "M.A. in Mathematics",
    company: "Indiana University Bloomington",
    icon: "math",
    description: "Ph.D dropout",
    tags: ["Mathematics", "Graduate Study"]
  },
  {
    period: "2006 - 2010",
    title: "B.S. in Mathematics and Applied Mathematics",
    company: "University of Science and Technology of China",
    icon: "applied-math",
    description: "",
    tags: ["Mathematics", "Applied Mathematics"]
  }
];

function ExperienceGlyph({ type, isActive }: { type: ExperienceIcon; isActive: boolean }) {
  const glyphs: Record<ExperienceIcon, React.ReactNode> = {
    ai: <><path fill="#28356f" d="M5 6h14v12H5z"/><path fill="#637cf4" d="M7 8h10v8H7z"/><path fill="#f5c45e" d="M10 13l1.5-4h1L14 13h-1.2l-.25-.8h-2.1l-.25.8zm.8-1.8h1.4l-.7-1.9z"/><path stroke="#dc6b4d" d="M8 3v3m4-3v3m4-3v3M8 18v3m4-3v3m4-3v3M2 9h3m14 0h3M2 15h3m14 0h3"/></>,
    ads: <><circle fill="#5b78c9" cx="15.5" cy="9" r="7"/><circle fill="#f2c24f" cx="15.5" cy="9" r="4.3"/><circle fill="#df6a5f" cx="15.5" cy="9" r="1.8"/><path fill="#58a78e" d="M3 12h9v10H3z"/><path fill="#f7e7bd" d="M5 14h5v6H5z"/><path stroke="#314361" strokeWidth="1.5" d="M7.5 13v8m2-6.2c-.5-.5-1.2-.8-2-.8-1.1 0-2 .6-2 1.4 0 2.3 4 1 4 3.2 0 .8-.9 1.4-2 1.4-.9 0-1.7-.3-2.2-.9"/><path stroke="#314361" strokeWidth="1.6" d="M8 11l4-3 3.5 1 5-5m-2 0h2v2"/></>,
    ml: <><path stroke="#7c5ac7" strokeWidth="1.4" d="M6 6l6 3 6-4M6 6l1 11m5-8l-5 8m5-8l5 8m1-12l-1 12"/><circle fill="#ed7d5e" cx="6" cy="6" r="3"/><circle fill="#58a6a6" cx="18" cy="5" r="3"/><circle fill="#f0b84f" cx="12" cy="9" r="2.5"/><circle fill="#637cf4" cx="7" cy="17" r="3"/><circle fill="#cf6793" cx="17" cy="17" r="3"/><circle fill="#fff4d9" cx="12" cy="9" r=".8"/></>,
    network: <><path fill="#e5c86e" d="M2 3h8v7H2z"/><path fill="#73a8d7" d="M14 3h8v7h-8z"/><path fill="#cf745f" d="M8 15h8v7H8z"/><path fill="#fff7dc" d="M4 5h4v1H4zm0 2h3v1H4zm12-2h4v1h-4zm0 2h3v1h-3zm-6 10h4v1h-4zm0 2h3v1h-3z"/><path stroke="#53617d" strokeWidth="1.5" d="M6 10v2h12v-2m-6 2v3"/></>,
    research: <><path fill="#eee5ce" stroke="#58627d" strokeWidth="1.3" d="M9 2h6m-5 0v7L5 19a2 2 0 002 3h10a2 2 0 002-3L14 9V2"/><path fill="#67b7aa" d="M7.5 16l2-4h5l2 4z"/><path fill="#4e8fc3" d="M6.5 18h11l.8 1.6c.3.6-.1 1.4-.9 1.4H6.6c-.8 0-1.2-.8-.9-1.4z"/><circle fill="#f2b84b" cx="14" cy="13" r="1"/><circle fill="#dc6b74" cx="10" cy="17" r=".8"/></>,
    math: <><path fill="#9a633f" d="M1 3h22v17H1z"/><path fill="#d59a5f" d="M2.5 4.5h19v14H2.5z"/><path fill="#244f49" d="M4 6h16v11H4z"/><path fill="#f7eed4" d="M6.4 8.2c1.1-.9 2.7-.9 3.4-.1.6.7.3 1.7-.2 3-.7 1.8-1.3 3.5-.2 4.4.4.3.9.3 1.4.1l.3.7c-.9.5-1.9.4-2.5-.2-1.5-1.3-.7-3.4 0-5.3.4-1.1.7-1.8.3-2.2-.3-.4-1.2-.3-1.9.3z"/><path fill="#f2c14f" d="M12 9h5v1h-1v4.6h-1V10h-1.5v4.6h-1V10H12z"/><path stroke="#79bce0" strokeWidth="1.1" d="M5.5 14.5c1.5-1.7 2.8-1.6 4-.2s2.8 1.5 4.1-.7 3-2.2 4.9-.7"/><path fill="#f4e6bc" d="M5 18.2h6v1H5z"/><path fill="#df6d69" d="M12 18.2h4v1h-4z"/><path fill="#68aeb0" d="M17 18.2h3v1h-3z"/></>,
    'applied-math': <><path stroke="#54617b" strokeWidth="1.3" d="M3 2v19h19M6 5v16m4-16v16m4-16v16m4-16v16M3 17h19M3 13h19M3 9h19" opacity=".38"/><path fill="#f4be4f" d="M4 18l4-9 4 6 4-10 5 13h-2l-3-8-4 9-4-6-2 5z"/><path stroke="#d85f68" strokeWidth="1.8" d="M4 16c3-8 6 3 9-5s5 5 8-4"/><circle fill="#5b77cf" cx="13" cy="11" r="1.7"/></>
  };

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      strokeLinecap="square"
      strokeLinejoin="miter"
    >
      <defs>
        <filter id={`timeline-icon-muted-${type}`} colorInterpolationFilters="sRGB">
          <feColorMatrix in="SourceGraphic" type="saturate" values="0" />
        </filter>
        <filter id={`timeline-icon-active-${type}`} colorInterpolationFilters="sRGB">
          <feColorMatrix in="SourceGraphic" type="saturate" values="0" result="luminosity" />
          <feFlood floodColor="var(--accent)" result="accentColor" />
          <feBlend in="luminosity" in2="accentColor" mode="multiply" result="tintedIcon" />
          <feComposite in="tintedIcon" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      <g
        filter={`url(#timeline-icon-muted-${type})`}
        className="transition-opacity duration-200"
        opacity={isActive ? 0 : 1}
      >
        {glyphs[type]}
      </g>
      <g
        filter={`url(#timeline-icon-active-${type})`}
        className="transition-opacity duration-200"
        opacity={isActive ? 1 : 0}
      >
        {glyphs[type]}
      </g>
    </svg>
  );
}

function TimelineCard({
  item,
  isActive,
  reduceMotion,
  cardRef,
  onActivate
}: {
  item: TimelineItem;
  isActive: boolean;
  reduceMotion: boolean;
  cardRef: (node: HTMLDivElement | null) => void;
  onActivate: () => void;
}) {
  const itemRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress: itemScrollProgress } = useScroll({
    target: itemRef,
    offset: ['start 92%', 'end 18%']
  });
  const scrollYDrift = useTransform(itemScrollProgress, [0, 0.5, 1], [24, 0, -14]);
  const cardTransition = reduceMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 280, damping: 30, mass: 0.7 };
  const accentTransition = reduceMotion ? { duration: 0 } : { duration: 0.22, ease: 'easeOut' as const };
  const cardOpacity = isActive ? 1 : 0.42;
  const cardFilter = isActive ? 'grayscale(0) saturate(1.08)' : 'grayscale(0.72) saturate(0.58)';
  const nodeColor = isActive ? 'var(--secondary-accent)' : 'var(--rule-strong)';

  return (
    <motion.div
      ref={(node) => {
        itemRef.current = node;
        cardRef(node);
      }}
      className="timeline-item relative mb-5 flex min-h-28 items-stretch pl-16"
      style={{
        y: reduceMotion ? 0 : scrollYDrift
      }}
    >
      {/* Node on center line */}
      <motion.div
        className={`timeline-node absolute left-6 top-7 z-10 h-4 w-4 rounded-full border-2 bg-[var(--paper-elevated)] ${
          isActive ? 'timeline-node--active' : ''
        }`}
        style={{ x: '-50%', y: '-50%' }}
        animate={{
          borderColor: isActive ? 'var(--accent)' : 'var(--rule)',
          scale: isActive && !reduceMotion ? 1.28 : 0.86,
          opacity: isActive ? 1 : 0.42
        }}
        transition={cardTransition}
      >
        <motion.div
          className="absolute inset-0.5 rounded-full"
          animate={{
            backgroundColor: nodeColor
          }}
          transition={accentTransition}
        />
      </motion.div>

      {/* Connector to center line */}
      <motion.div
        className="timeline-connector absolute left-6 top-7 h-px w-6 origin-left bg-[var(--rule-strong)]"
        animate={{
          opacity: isActive ? 1 : 0.24,
          scaleX: isActive && !reduceMotion ? 1 : 0.72,
          backgroundColor: isActive ? 'var(--accent)' : 'var(--rule-strong)'
        }}
        transition={cardTransition}
      />

      {/* Card */}
      <motion.div
        className="timeline-card-shell w-full"
        animate={{
          opacity: cardOpacity,
          scale: isActive && !reduceMotion ? 1.012 : 1,
          filter: cardFilter
        }}
        transition={cardTransition}
      >
        <div className="timeline-card-interactive group relative">
          <button
            type="button"
            className="timeline-card-hitbox absolute inset-0 z-10 cursor-pointer"
            aria-label={`Highlight and center ${item.title.replace(/\n/g, ' ')} at ${item.company ?? item.period}`}
            aria-pressed={isActive}
            onClick={onActivate}
          />
          <motion.div
            className="rpg-panel timeline-card-panel relative border p-4 transition-colors duration-300 group-hover:border-[var(--rule-strong)]"
            animate={{
              borderColor: isActive ? 'var(--accent)' : 'var(--rule)',
              backgroundColor: isActive ? 'color-mix(in srgb, var(--paper-elevated) 88%, var(--accent-soft))' : 'var(--paper-elevated)',
              boxShadow: isActive
                ? '5px 6px 0 color-mix(in srgb, var(--shadow-rule) 95%, transparent), 0 12px 28px color-mix(in srgb, var(--accent) 14%, transparent)'
                : '2px 2px 0 color-mix(in srgb, var(--shadow-rule) 56%, transparent)'
            }}
            transition={accentTransition}
            whileHover={reduceMotion ? undefined : { y: -2 }}
          >
            <motion.div
              aria-hidden="true"
              className="absolute right-3 top-3 flex h-13 w-13 items-center justify-center border border-[var(--rule-strong)] bg-[var(--paper-muted)] p-1.5 shadow-[3px_3px_0_var(--shadow-rule)]"
              animate={{
                opacity: isActive ? 0.96 : 0.46,
                scale: isActive && !reduceMotion ? 1.04 : 1
              }}
              transition={accentTransition}
            >
              <ExperienceGlyph type={item.icon} isActive={isActive} />
            </motion.div>

            {/* Period badge */}
            <div className="mb-2 inline-flex items-center border border-[var(--rule)] bg-[var(--paper-muted)] px-2 py-0.5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--accent)]">
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-[var(--secondary-accent)]" />
              {item.period}
            </div>

            {/* Title & Company */}
            <h3 className="mb-0.5 max-w-[calc(100%-3.75rem)] whitespace-pre-line text-base font-semibold text-[var(--ink)]">{item.title}</h3>
            {item.company && (
              <p className="mb-1 font-mono text-xs text-[var(--accent)]">{item.company}</p>
            )}

            {/* Description */}
            {item.description && (
              <p className="mb-2 text-xs leading-relaxed text-[var(--ink-muted)]">{item.description}</p>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-[var(--rule)] bg-[var(--paper)] px-1.5 py-0.5 font-mono text-[0.68rem] text-[var(--ink-muted)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AboutHeroScene({ isVisible }: { isVisible: boolean }) {
  return (
    <div
      className="about-hero-enter"
      aria-hidden="true"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(-10px)',
        transition: 'all 0.6s ease-out',
        transitionDelay: '0.05s'
      }}
    >
      <RpgHeroScene variant="about" />
    </div>
  );
}

export default function Background() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTimelineIndex, setActiveTimelineIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const timelineRefs = useRef<Array<HTMLDivElement | null>>([]);
  const timelinePathRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  const updateActiveTimelineItem = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const focalLine = window.innerHeight * 0.52;
    let nextActiveIndex = 0;
    let shortestDistance = Number.POSITIVE_INFINITY;

    timelineRefs.current.forEach((node, index) => {
      if (!node) {
        return;
      }

      const rect = node.getBoundingClientRect();
      const nodeCenter = rect.top + rect.height / 2;
      const distance = Math.abs(nodeCenter - focalLine);

      if (distance < shortestDistance) {
        shortestDistance = distance;
        nextActiveIndex = index;
      }
    });

    setActiveTimelineIndex((current) => {
      return current === nextActiveIndex ? current : nextActiveIndex;
    });
  }, []);

  useMotionValueEvent(scrollY, 'change', updateActiveTimelineItem);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(updateActiveTimelineItem);
    window.addEventListener('resize', updateActiveTimelineItem);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', updateActiveTimelineItem);
    };
  }, [updateActiveTimelineItem]);

  const activateTimelineItem = useCallback((index: number) => {
    setActiveTimelineIndex(index);
    timelineRefs.current[index]?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'center'
    });
  }, [reduceMotion]);

  const prefersReducedMotion = reduceMotion ?? false;

  return (
    <div className="relative min-h-screen">
      <div className="relative space-y-4">
        {/* Header */}
        <div className="text-center mb-8">
          <AboutHeroScene isVisible={isVisible} />
          <h1
            className="rpg-page-title mb-2 font-serif text-3xl font-normal text-[var(--ink)]"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
              transition: 'all 0.6s ease-out'
            }}
          >
            About Me
          </h1>
        </div>

        {/* Summary */}
        <section
          className="rpg-panel mx-auto mb-10 max-w-3xl border border-[var(--rule)] bg-[var(--paper-elevated)] px-6 py-6"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.6s ease-out',
            transitionDelay: '0.15s'
          }}
        >
          <p className="text-base leading-8 text-[var(--ink-soft)]">
            I earned my Ph.D. from the University of Southern California, where my research
            focused on theoretical optimization problems and algorithmic methods. I have 8
            years of industry experience spanning product-facing machine learning models and AI
            platform infrastructure, including recommendation systems, ads models, notification
            optimization, and recent work on LLM post-training, serving frameworks, and
            performance optimization.
          </p>
          <p className="mt-4 font-mono text-sm text-[var(--ink-muted)]">
            Contact:{' '}
            <a
              href="mailto:ssydyc@gmail.com"
              className="font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)]"
            >
              ssydyc@gmail.com
            </a>
          </p>
        </section>

        {/* Timeline */}
        <div ref={timelinePathRef} className="timeline-path relative mx-auto max-w-3xl">
          {/* Center path */}
          <div
            className="timeline-path__line absolute bottom-3 left-6 top-3 w-[3px] rounded-full bg-[var(--rule)]"
            style={{
              opacity: isVisible ? 1 : 0,
              transition: 'opacity 0.5s ease-out'
            }}
          />

          {/* Cards */}
          {timelineData.map((item, index) => (
            <TimelineCard
              key={index}
              item={item}
              isActive={activeTimelineIndex === index}
              reduceMotion={prefersReducedMotion}
              cardRef={(node) => {
                timelineRefs.current[index] = node;
              }}
              onActivate={() => activateTimelineItem(index)}
            />
          ))}
        </div>
        <div aria-hidden="true" className="h-[46vh]" />
      </div>
    </div>
  );
}
