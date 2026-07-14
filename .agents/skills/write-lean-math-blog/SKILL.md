---
name: write-lean-math-blog
description: Author, revise, or audit mathematical blog posts that present human-readable proofs beside Lean 4 code. Use for paired proof/Lean articles, proof-lean regions, missing-prerequisite reviews, theorem-dependency audits, or any request to keep mathematical prose exactly aligned with compiled Lean declarations.
---

# Write Lean Math Blog

Treat the compiled Lean source as the authority for theorem statements, hypotheses, proof structure, cited results, and edge cases. Make the mathematical column a readable rendering of that source, not an independent proof.

## Apply the core standard

1. Make every mathematical proof follow its paired Lean declaration in the same logical order.
2. When Lean imports or calls a theorem without proving it, state that theorem as a cited result on the mathematical side and do not prove it there.
3. When the displayed Lean region proves a helper, give that helper a corresponding mathematical lemma or corollary.
4. Define every nonstandard concept before its first proof use:
   - Put concepts needed by the main argument in **Mathematical prerequisites**.
   - Put concepts used only by the detailed appendix or Lean-facing algebraic machinery in **Prerequisites for the Appendix**.
   - Keep local choices such as “put \(p=\operatorname{minpoly}_F(x)\)” inside the proof; these are not prerequisite concepts.
5. Preserve Lean's exact generality. Do not add characteristic-zero, nonzero, finiteness, separability, or other assumptions unless the Lean declaration has or derives them.

## Audit the proof–code pairing

For each proof-lean block:

1. Locate the Lean region with the same identifier.
2. Record:
   - the theorem being proved;
   - helper declarations proved in that region;
   - imported theorems called by the proof;
   - definitions and notation required to understand the mathematical side;
   - explicit case splits and exceptional values.
3. Compare the mathematical proof line by line with the Lean proof.
4. Fix prose that:
   - skips a Lean branch such as \(n=0\), \(a=0\), or the zero-polynomial case;
   - silently proves an imported theorem instead of citing it;
   - claims a stronger result than Lean establishes;
   - changes the order or role of intermediate lemmas;
   - uses a concept before its prerequisite definition.

Do not modify Lean merely to make existing prose look correct unless the user asks to change the formal proof. When the two disagree, default to correcting the prose to match the compiled source.

## Build the prerequisite ledger

Classify terminology by where it is first needed.

Main-prerequisite examples include polynomial degree and natDegree, leading coefficient, monic polynomial, evaluation, root set, separability, field extension, algebraically closed field, Galois action, solvable group, and radical closure when the main proof uses them.

Appendix-prerequisite examples include abstract algebra structures, ideals and kernels, algebra homomorphisms, subalgebras, integrality, normal extensions, coefficient extension, polynomial composition, restriction maps, conjugates, roots of unity, multisets, adjoining, minimal polynomials, and the formal intersection construction of a closure.

Prefer removing an unused concept over defining it. Do not move implementation-only material into the main prerequisites.

## Write cited results faithfully

- State the mathematical content of each imported Lean result with the assumptions actually used.
- Name the corresponding Lean declaration in the explanation when that helps verification.
- Keep “cited theorem” separate from “lemma proved here.”
- If Lean proves only bijectivity or surjectivity, do not present a separate internal proof of a stronger classification theorem.
- Put optional intuition outside the proof and label it as motivation; never let it replace the formal dependency.

Pay special attention to:

- degree versus natDegree;
- root sets versus root multisets;
- field homomorphisms versus \(F\)-algebra homomorphisms;
- injective, surjective, and bijective conclusions;
- zero and constant polynomial conventions;
- coefficient mapping and base-field changes;
- normalization by a leading coefficient;
- divisibility followed by restriction between splitting fields.

## Keep explanations traceable

In each Lean explanation:

- map mathematical lemma names to Lean declaration names;
- say which imported theorem closes each nontrivial step;
- describe tactics only when they clarify the mathematical correspondence;
- avoid claiming that #check proves anything;
- distinguish compiled companion code from copied presentation excerpts.

## Validate

Run the checks available in the repository. For this project, use:

~~~bash
bun run verify:lean-regions
bun run lint
bun run build
cd formal/abel-ruffini && lake build
~~~

Also run git diff --check.

When the local article is available, reload it and verify:

- new prerequisite headings render in the intended hierarchy;
- all KaTeX expressions render without .katex-error;
- cited Lean names appear as code rather than broken Markdown;
- proof and Lean panels still pair by region;
- removed terminology no longer appears.

Report any unrelated pre-existing worktree changes without modifying or deleting them.
