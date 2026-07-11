import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import RpgHeroScene from '../components/RpgHeroScene';

interface TimelineItem {
  period: string;
  title: string;
  company?: string;
  description: string;
  tags: string[];
}

const timelineData: TimelineItem[] = [
  {
    period: "2025 - Present",
    title: "Software Engineer, Machine Learning",
    company: "Meta Inc.",
    description: "On the AI Platform team, working on LLM inference and training supporting other teams, especially for TPU.",
    tags: ["LLM", "Infra", "Performance Optimization"]
  },
  {
    period: "2022 - 2025",
    title: "Software Engineer, Machine Learning",
    company: "Meta Inc.",
    description: "Trained and deployed machine learning models for users' languages, advertiser's subsidy and ads notifications that are running in Meta's ads systems",
    tags: ["ML Systems", "Ads"]
  },
  {
    period: "2020 - 2022",
    title: "Machine Learning Engineer",
    company: "Snap Inc.",
    description: "Developed machine learning models for friend recommendations and notification optimization, directly impacting user engagement and retention.",
    tags: ["ML Systems", "Recommendation Systems"]
  },
  {
    period: "2018 - 2020",
    title: "Software Engineer, Infrastructure",
    company: "Snap Inc.",
    description: "Built service mesh infrastructure powering real-time communication for hundreds of millions of users.",
    tags: ["Distributed Systems", "Infrastructure"]
  },
  {
    period: "2013 - 2018",
    title: "Ph.D. in Operations Research\nM.S. in Computer Science",
    company: "University of Southern California",
    description: "Focused on theoretical optimization and algorithmic research",
    tags: ["Optimization", "Mathematical Modeling", "Research"]
  },
  {
    period: "2010 - 2013",
    title: "M.A. in Mathematics",
    company: "Indiana University Bloomington",
    description: "Ph.D dropout",
    tags: ["Mathematics", "Graduate Study"]
  },
  {
    period: "2006 - 2010",
    title: "B.S. in Mathematics and Applied Mathematics",
    company: "University of Science and Technology of China",
    description: "",
    tags: ["Mathematics", "Applied Mathematics"]
  }
];

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
  const nodeColor = isActive ? 'var(--amber)' : 'var(--rule-strong)';

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
            {/* Period badge */}
            <div className="mb-2 inline-flex items-center border border-[var(--rule)] bg-[var(--paper-muted)] px-2 py-0.5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--accent)]">
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-[var(--amber)]" />
              {item.period}
            </div>

            {/* Title & Company */}
            <h3 className="mb-0.5 whitespace-pre-line text-base font-semibold text-[var(--ink)]">{item.title}</h3>
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
