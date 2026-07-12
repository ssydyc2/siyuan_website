# Why Can't Equations of Degree Five or Higher Be Solved by Radicals?

## Contents

- [1. The problem and counterexample](#1-the-problem-and-counterexample)
- [2. Mathematical prerequisites](#2-mathematical-prerequisites)
  - [I. Algebraic structures](#i-algebraic-structures)
  - [II. Group](#ii-group)
  - [III. Semigroup](#iii-semigroup)
  - [IV. Monoid](#iv-monoid)
  - [V. Commutative monoid](#v-commutative-monoid)
  - [VI. Abelian group](#vi-abelian-group)
  - [VII. Ring](#vii-ring)
  - [VIII. Commutative ring](#viii-commutative-ring)
  - [IX. Field](#ix-field)
  - [X. Polynomials, roots, and irreducibility](#x-polynomials-roots-and-irreducibility)
  - [XI. Polynomial](#xi-polynomial)
  - [XII. Units and factorization](#xii-units-and-factorization)
  - [XIII. Minimal polynomial](#xiii-minimal-polynomial)
  - [XIV. Separable polynomial](#xiv-separable-polynomial)
  - [XV. Field extensions and Galois groups](#xv-field-extensions-and-galois-groups)
  - [XVI. Commutators, derived series, and solvable groups](#xvi-commutators-derived-series-and-solvable-groups)
  - [XVII. What solvable by radicals means](#xvii-what-solvable-by-radicals-means)
- [3. Build the proof step by step](#3-build-the-proof-step-by-step)
  - [I. Define the hard quintic](#i-define-the-hard-quintic)
  - [II. Verify the polynomial bookkeeping](#ii-verify-the-polynomial-bookkeeping)
  - [III. Prove irreducibility by Eisenstein](#iii-prove-irreducibility-by-eisenstein)
  - [IV. Exhibit two real roots](#iv-exhibit-two-real-roots)
  - [V. At most three real roots](#v-at-most-three-real-roots)
  - [VI. Count all complex roots](#vi-count-all-complex-roots)
  - [VII. Inspect the imported bridges](#vii-inspect-the-imported-bridges)
  - [VIII. Why the Galois group is S5](#viii-why-the-galois-group-is-s5)
  - [IX. The Galois obstruction](#ix-the-galois-obstruction)
  - [X. Specialize the hard quintic](#x-specialize-the-hard-quintic)
  - [XI. Recover the algebraic counterexample](#xi-recover-the-algebraic-counterexample)
  - [XII. Preserve the hard root](#xii-preserve-the-hard-root)
  - [XIII. Manufacture degree n from degree five](#xiii-manufacture-degree-n-from-degree-five)
  - [XIV. The final theorem](#xiv-the-final-theorem)
- [4. Sources](#4-sources)

## Overview and approach

This article explains why equations of degree five or higher cannot always be solved by radicals. It has two stages. First, we introduce the mathematical prerequisites—groups, fields, polynomials, field extensions, Galois groups, solvable groups, and radical towers. Then we build an explicit counterexample in dependency order, with each step supported by results already established.

Each stage of the main argument presents a pure mathematical proof beside the exact compiled Lean code that verifies the same logical step. The explanation below the code shows how the formal statement corresponds to the mathematics.

Why this approach?

1. **It is more intuitive.** Starting from the result tells us why each abstract concept is needed before we introduce it.
2. **Lean checks the proof and its logical dependencies.** Every formal step beside the mathematics is compiled, so missing assumptions and invalid deductions cannot quietly slip through—which is especially comforting when most of this article was generated with the help of AI. Lean, fortunately, is less impressed by confident prose than we are.

This article is written for readers learning abstract algebra who may otherwise lose the main argument behind a wall of definitions. Its aim is to make the purpose of each construction visible as it enters the proof, so that readers can understand what the mathematics is doing without giving up mathematical precision. The article gives the complete framework of the proof and fully verifies the explicit counterexample, but it does not re-prove every foundational theorem in Galois theory or mathlib from first principles; doing so would turn one article into a book. Those deeper results are stated precisely, linked to their formal sources, and used as named dependencies. Lean certifies the formal proof shown here; the surrounding explanations are still meant to be read critically by humans.

---

## 1. The problem and counterexample

There is a familiar claim about equations: **“Once the degree reaches five, there is no solution.”** It is memorable—and wrong. Every nonconstant polynomial has complex roots. What breaks at degree five is something more subtle: there is no formula that can always build those roots from the coefficients using only finitely many additions, subtractions, multiplications, divisions, and radicals.

Quadratic, cubic, and quartic equations have such formulas. Why does the pattern stop exactly at five? Instead of beginning with an abstract impossibility theorem, we follow one concrete polynomial all the way down.

The counterexample is

```latex
\Phi(X)=X^5-4X+2\in\mathbb Q[X].
```

Its five complex roots certainly exist. Yet none of them can be reached by radicals over \(\mathbb Q\). That tension—existence without a radical expression—is the real content of Abel–Ruffini.

One quintic is enough to reach every higher degree. For \(n\ge5\), define

```latex
P_n(X)=X^{n-5}\Phi(X).
```

The factor \(X^{n-5}\) adds zero roots, but it does not remove the hard roots of \(\Phi\). Thus \(P_n\) has degree \(n\) and still contains a root that radicals cannot express. The precise theorem is:

```latex
\forall n \ge 5,\ \exists P_n \in \mathbb{Q}[X],\quad
\deg P_n=n
\quad\text{and}\quad
\exists \alpha\in\mathbb C,
\ P_n(\alpha)=0,
\ \alpha\text{ is not solvable by radicals over }\mathbb Q.
```

The proof is assembled from the ground up. We define the polynomial, verify its elementary properties, prove irreducibility and count its roots, identify its Galois group, and only then derive the obstruction to solving its roots by radicals. This order keeps both the mathematical dependencies and the Lean declarations visible from one step to the next.

Every mathematical step is paired with the exact Lean code compiled by the companion project. The goal is not merely to verify the theorem, but to make the mathematical dependency chain and the Lean proof structure visible at the same time.

---

## 2. Mathematical prerequisites

### I. Algebraic structures

Each structure gets its own definition. We begin with groups, the structure that will later describe symmetries of polynomial roots.

### II. Group

A group is a tuple \((G,\star,e,(-)^{-1})\) consisting of a set \(G\), a binary operation \(\star:G\times G\to G\), an identity element \(e\in G\), and an inverse operation \((-)^{-1}:G\to G\). For every \(a,b,c\in G\), it satisfies:

- **Associativity:** \((a\star b)\star c=a\star(b\star c)\).
- **Identity:** \(e\star a=a=a\star e\).
- **Inverses:** \(a^{-1}\star a=e=a\star a^{-1}\).

### III. Semigroup

A semigroup is a pair \((S,\star)\) consisting of a set \(S\) and a binary operation \(\star:S\times S\to S\) satisfying associativity. For every \(a,b,c\in S\),

```latex
(a\star b)\star c=a\star(b\star c).
```

### IV. Monoid

A monoid is a semigroup \((M,\star)\) together with an identity element \(e\in M\) satisfying, for every \(a\in M\),

```latex
e\star a=a=a\star e.
```

### V. Commutative monoid

A commutative monoid is a monoid whose operation also satisfies, for every \(a,b\in M\),

```latex
a\star b=b\star a.
```

### VI. Abelian group

An abelian group, also called a commutative group, is a group whose operation is commutative:

```latex
a\star b=b\star a
\qquad\text{for every }a,b\in G.
```

### VII. Ring

A ring is a tuple \((R,+,\cdot,-,0,1)\) such that:

- \((R,+,0,-)\) is an abelian group;
- \((R,\cdot,1)\) is a monoid; and
- multiplication distributes over addition on both sides:

```latex
a\cdot(b+c)=a\cdot b+a\cdot c,
\qquad
(a+b)\cdot c=a\cdot c+b\cdot c.
```

The additive inverse of \(a\) is written \(-a\), and subtraction is the derived operation \(a-b:=a+(-b)\). Multiplication in a ring need not be commutative.

### VIII. Commutative ring

A commutative ring is a ring whose multiplication is commutative. Equivalently, its multiplicative structure \((R,\cdot,1)\) is a commutative monoid.

### IX. Field

A field is a commutative ring \(F\) satisfying \(0\ne1\) in which every nonzero element has a multiplicative inverse. Equivalently, \((F\setminus\{0\},\cdot,1)\) is an abelian group.

### X. Polynomials, roots, and irreducibility

### XI. Polynomial

Let \(F\) be a field. A polynomial over \(F\) is a finite formal sum

```latex
p(X)=a_0+a_1X+\cdots+a_nX^n
=\sum_{i=0}^{n}a_iX^i,
\qquad a_i\in F.
```

The word **formal** matters: \(X\) is an indeterminate, not yet a number. Two polynomials are equal exactly when all corresponding coefficients are equal. The set of polynomials over \(F\), with coefficientwise addition and the usual convolution product, is denoted by \(F[X]\).

### XII. Units and factorization

A **unit** in a ring is an element with a multiplicative inverse. The units of \(F[X]\) are exactly the nonzero constant polynomials. Consequently, multiplying a polynomial by a nonzero scalar does not create a mathematically meaningful factorization.

A nonzero, nonunit polynomial \(p\in F[X]\) is **reducible over \(F\)** if there exist nonunit polynomials \(f,g\in F[X]\) such that

```latex
p=fg.
```

Otherwise, \(p\) is **irreducible over \(F\)**. Equivalently, \(p\) is irreducible if every factorization \(p=fg\) forces either \(f\) or \(g\) to be a nonzero constant. For a polynomial of positive degree, this means it has no factor whose degree lies strictly between \(0\) and \(\deg p\).

Irreducibility depends on the coefficient field. For example, \(X^2-2\) is irreducible in \(\mathbb Q[X]\), but it factors in \(\mathbb R[X]\):

```latex
X^2-2=(X-\sqrt2)(X+\sqrt2).
```

### XIII. Minimal polynomial

An element \(\alpha\in E\) is **algebraic over \(F\)** if it is a root of some nonzero polynomial in \(F[X]\). For every algebraic \(\alpha\), there is a unique monic irreducible polynomial \(m_{\alpha,F}\in F[X]\) satisfying

```latex
m_{\alpha,F}(\alpha)=0.
```

This is the **minimal polynomial** of \(\alpha\) over \(F\). It divides every polynomial \(q\in F[X]\) for which \(q(\alpha)=0\). Therefore, if an irreducible polynomial \(p\in F[X]\) has \(\alpha\) as a root, then its monic normalization is the minimal polynomial:

```latex
m_{\alpha,F}=\frac{1}{\operatorname{leadingCoeff}(p)}p.
```

Why is the minimal polynomial not always \(X-\alpha\)? Its coefficients must lie in the **base field** \(F\), and \(X-\alpha\) belongs to \(F[X]\) only when \(\alpha\in F\).

For example, take \(F=\mathbb Q\) and \(\alpha=\sqrt2\). The linear polynomial

```latex
X-\sqrt2
```

has \(\sqrt2\) as a root, but it is not an element of \(\mathbb Q[X]\), because its constant coefficient \(-\sqrt2\) is not rational. The polynomial

```latex
X^2-2\in\mathbb Q[X]
```

does have \(\sqrt2\) as a root, is monic, and is irreducible over \(\mathbb Q\). Therefore

```latex
m_{\sqrt2,\mathbb Q}(X)=X^2-2.
```

If we change the base field to \(\mathbb R\), then \(\sqrt2\in\mathbb R\), so the minimal polynomial becomes

```latex
m_{\sqrt2,\mathbb R}(X)=X-\sqrt2.
```

Thus the minimal polynomial depends not only on \(\alpha\), but also on the chosen base field.

### XIV. Separable polynomial

A nonzero polynomial is **separable over \(F\)** if, in a field where it splits completely into linear factors, no root occurs with multiplicity greater than one. Equivalently,

```latex
\gcd(p,p')=1,
```

where \(p'\) is the formal derivative. Every irreducible polynomial over a field of characteristic zero is separable. In particular, every irreducible polynomial in \(\mathbb Q[X]\) is separable.

### XV. Field extensions and Galois groups

A **field homomorphism** \(\iota:F\to E\) is a function preserving \(0\), \(1\), addition, and multiplication. Such a map is automatically injective: its kernel is an ideal of the field \(F\), so it is either \(\{0\}\) or all of \(F\), and preservation of \(1\) rules out the latter. We may therefore identify \(F\) with its image inside \(E\).

A **field extension** of \(F\) is a field \(E\) equipped with a specified field homomorphism \(F\to E\). We write \(E/F\), meaning that \(E\) is the larger field and \(F\) is the base field. For example, the usual inclusion \(\mathbb Q\hookrightarrow\mathbb C\) makes \(\mathbb C/\mathbb Q\) a field extension.

Because elements of \(F\) act on elements of \(E\) by scalar multiplication,

```latex
a\cdot x=\iota(a)x,
\qquad a\in F,\ x\in E,
```

the field \(E\) is also a vector space over \(F\). The **degree of the extension** is its vector-space dimension

```latex
[E:F]=\dim_F E,
```

which may be finite or infinite. For example, \([\mathbb Q(\sqrt2):\mathbb Q]=2\), with basis \(1,\sqrt2\).

An **intermediate field** is a field \(K\) lying between the base and extension fields:

```latex
F\subseteq K\subseteq E.
```

If \(S\subseteq E\), then \(F(S)\), read “\(F\) adjoin \(S\),” is the smallest intermediate field containing both \(F\) and every element of \(S\). For one element we write \(F(\alpha)\). Thus

```latex
\mathbb Q(\sqrt2)=\{a+b\sqrt2:a,b\in\mathbb Q\}.
```

An element \(\alpha\in E\) is **algebraic over \(F\)** if some nonzero polynomial \(p\in F[X]\) satisfies \(p(\alpha)=0\). The extension \(E/F\) is **algebraic** if every element of \(E\) is algebraic over \(F\). It is **finite** if \([E:F]<\infty\); every finite extension is algebraic.

Let \(p\in F[X]\). We say that \(p\) **splits over \(E\)** if it factors there entirely into linear terms:

```latex
p(X)=c\prod_{i=1}^{d}(X-\alpha_i),
\qquad c\in F,\ \alpha_i\in E.
```

A **splitting field** of \(p\) over \(F\) is an extension \(L/F\) satisfying two conditions:

1. \(p\) splits over \(L\); and
2. \(L\) is generated over \(F\) by the roots of \(p\).

The second condition is a minimality condition: no unrelated field elements have been added. For example, \(X^2-2\) has splitting field \(\mathbb Q(\sqrt2)\) over \(\mathbb Q\), because its roots are \(\sqrt2\) and \(-\sqrt2\). Inside a fixed algebraic closure, splitting fields exist and are unique up to an isomorphism that fixes \(F\).

An **\(F\)-automorphism of \(L\)** is a bijective field homomorphism

```latex
\sigma:L\to L
```

that fixes the base field pointwise: \(\sigma(a)=a\) for every \(a\in F\). These automorphisms form a group under composition, denoted

```latex
\operatorname{Aut}_F(L).
```

If \(L\) is the splitting field of \(p\), the **Galois group of \(p\) over \(F\)** is

```latex
\operatorname{Gal}(p/F)=\operatorname{Aut}_F(L).
```

Why does this group act on the roots? If \(p(X)=\sum_i a_iX^i\) and \(p(\alpha)=0\), then for every \(F\)-automorphism \(\sigma\),

```latex
p(\sigma(\alpha))
=\sum_i a_i\sigma(\alpha)^i
=\sigma\!\left(\sum_i a_i\alpha^i\right)
=\sigma(0)=0.
```

So \(\sigma\) sends roots to roots. If \(R\) is the set of distinct roots, restriction gives the **Galois action homomorphism**

```latex
\rho:\operatorname{Gal}(p/F)\longrightarrow \operatorname{Sym}(R),
```

where \(\operatorname{Sym}(R)\) is the group of all permutations of \(R\). The map \(\rho\) is injective: an automorphism fixing every root fixes the field generated by those roots, which is all of \(L\). This is what it means for the action to be **faithful**.

Separability has a different role. If \(p\) is separable of degree \(d\), then it has exactly \(d\) distinct roots in its splitting field, so \(\operatorname{Sym}(R)\cong S_d\). If \(\rho\) is also **surjective**, every permutation of those roots comes from a field automorphism. Since \(\rho\) is then both injective and surjective,

```latex
\operatorname{Gal}(p/F)\cong S_d.
```

For our quintic, the target is therefore \(S_5\). The decisive fact later will be that \(S_5\) is not a solvable group.

### XVI. Commutators, derived series, and solvable groups

A **subgroup** \(H\le G\) is a subset of a group \(G\) that is itself a group under the same operation. Concretely, \(H\) contains the identity and is closed under multiplication and inverses. For example, the even permutations form a subgroup \(A_n\le S_n\).

A subgroup \(N\le G\) is **normal**, written \(N\trianglelefteq G\), if

```latex
gNg^{-1}=N\qquad\text{for every }g\in G.
```

Equivalently, \(gng^{-1}\in N\) for every \(g\in G\) and \(n\in N\). Normality is exactly the condition needed to form the **quotient group** \(G/N\), whose elements are cosets \(gN\) and whose multiplication is

```latex
(gN)(hN)=(gh)N.
```

Now take two elements \(g,h\in G\). We use the convention that their **commutator** is

```latex
[g,h]=ghg^{-1}h^{-1}.
```

Some books use its inverse instead; either convention generates the same subgroup. The important calculation is

```latex
[g,h]=e
\quad\Longleftrightarrow\quad
gh=hg.
```

Indeed, if \(g\) and \(h\) commute, then \(ghg^{-1}h^{-1}=e\). Conversely, \(ghg^{-1}h^{-1}=e\) implies \(gh=hg\) after multiplying on the right by \(h\) and then by \(g\). Thus a commutator records the failure of one particular pair to commute.

The notation \([G,G]\) does **not** mean one commutator. It denotes the **commutator subgroup**, also called the **derived subgroup**:

```latex
[G,G]
=\left\langle [g,h]:g,h\in G\right\rangle.
```

The angle brackets mean “the subgroup generated by.” If \(S\subseteq G\), then \(\langle S\rangle\) is the smallest subgroup of \(G\) containing \(S\). Its elements are all finite products

```latex
s_1^{\varepsilon_1}s_2^{\varepsilon_2}\cdots s_r^{\varepsilon_r},
\qquad s_i\in S,\quad \varepsilon_i\in\{1,-1\},
```

together with the empty product \(e\). Consequently, \([G,G]\) contains not only individual commutators but every finite product of commutators and their inverses.

The subgroup \([G,G]\) is normal in \(G\). More importantly, the quotient

```latex
G/[G,G]
```

is abelian. It is called the **abelianization** of \(G\). Moreover, \([G,G]\) is the smallest normal subgroup with this property: if \(N\trianglelefteq G\) and \(G/N\) is abelian, then \([G,G]\subseteq N\). So \([G,G]\) is precisely the part of \(G\) that must be removed to make the group commute.

We can repeat the construction inside the subgroup that remains. The **derived series** of \(G\) is defined recursively by

```latex
G^{(0)}=G,
\qquad
G^{(k+1)}=[G^{(k)},G^{(k)}].
```

Thus

```latex
G\supseteq [G,G]\supseteq [[G,G],[G,G]]\supseteq\cdots.
```

Each term is a normal subgroup of the preceding term. At every step we discard the abelian quotient and retain the remaining noncommutative part.

A group \(G\) is **solvable** if this process eventually reaches the trivial subgroup \(\{e\}\): there is some \(m\ge0\) such that

```latex
G^{(m)}=\{e\}.
```

For an abelian group, every pair commutes, so every commutator equals \(e\). Hence \([G,G]=\{e\}\), and every abelian group is solvable in one step. A nonabelian group may still be solvable. For example,

```latex
S_3^{(0)}=S_3,
\qquad
S_3^{(1)}=[S_3,S_3]=A_3,
\qquad
S_3^{(2)}=[A_3,A_3]=\{e\},
```

because \(A_3\) is cyclic and therefore abelian.

By contrast,

```latex
[S_5,S_5]=A_5
\qquad\text{and}\qquad
[A_5,A_5]=A_5.
```

The second equality says that \(A_5\) is **perfect**: it equals its own commutator subgroup. The derived series therefore gets stuck at \(A_5\) and never reaches \(\{e\}\). This is why \(S_5\) is not solvable.

Finally, solvability is preserved by subgroups and quotient groups. In particular, if \(f:G\to H\) is a surjective group homomorphism and \(G\) is solvable, then \(H\) is solvable: by the first isomorphism theorem, \(H\cong G/\ker f\). We will use the contrapositive later. Since \(S_5\) is not solvable, no solvable Galois group can map onto \(S_5\).

### XVII. What solvable by radicals means

Fix a base field \(F\) inside a larger field \(E\), such as \(\mathbb Q\subseteq\mathbb C\). A **radical tower over \(F\)** is a finite chain of field extensions

```latex
F=K_0\subseteq K_1\subseteq\cdots\subseteq K_r\subseteq E
```

such that, for every \(i=1,\ldots,r\), there are an element \(\beta_i\in K_i\) and an integer \(n_i\ge1\) satisfying

```latex
K_i=K_{i-1}(\beta_i)
\qquad\text{and}\qquad
\beta_i^{n_i}\in K_{i-1}.
```

The notation \(K_{i-1}(\beta_i)\) means the smallest field containing \(K_{i-1}\) and \(\beta_i\). The equation \(\beta_i^{n_i}=a_i\in K_{i-1}\) says that the new generator is an \(n_i\)-th root of something already available at the preceding level. Each level therefore permits exactly one new radical, followed by arbitrary field operations inside the enlarged field.

For example,

```latex
\mathbb Q
\subseteq \mathbb Q(\sqrt2)
\subseteq \mathbb Q(\sqrt2,\sqrt[3]{3})
```

is a radical tower: \((\sqrt2)^2=2\in\mathbb Q\), and \((\sqrt[3]{3})^3=3\in\mathbb Q(\sqrt2)\). The element

```latex
\alpha=\frac{1+\sqrt2}{\sqrt[3]{3}}
```

lies in the top field, so it can be constructed from rational numbers using arithmetic and radicals.

An element \(\alpha\in E\) is **solvable by radicals over \(F\)** if there exists some radical tower over \(F\) whose top field contains \(\alpha\):

```latex
\alpha\in K_r.
```

The element does not have to be one of the generators \(\beta_i\); it may be any field expression made from them. A polynomial is called **solvable by radicals** if a radical extension contains all of its roots, or equivalently its splitting field embeds into such an extension.

Roots of unity often need to be adjoined when connecting radical towers to Galois groups. A primitive \(n\)-th root of unity is an element \(\zeta_n\) satisfying

```latex
\zeta_n^n=1
```

and no smaller positive power equals \(1\). Adjoining it is itself a permitted radical step because \(1\) already lies in the preceding field. These roots of unity do not change what “constructible by radicals” means; they make the Galois structure of each radical step manageable.

The bridge to group theory is the deep direction used here:

**If an irreducible polynomial has a root solvable by radicals, then its Galois group is solvable.**

---

## 3. Build the proof step by step

We now assemble the proof in dependency order. Each Lean declaration uses only definitions and results that have already appeared, so the argument can be read—and compiled—from top to bottom.

### I. Define the hard quintic

::: proof-lean hard-quintic
For any commutative ring \(R\) containing the natural numbers, define

```latex
\Phi_{a,b}(X)=X^5-aX+b\in R[X].
```

Specializing to \(R=\mathbb Q\), \(a=4\), and \(b=2\) gives the hard quintic used throughout the proof.

::: lean-explanation
`variable (R : Type*) [CommRing R] (a b : ℕ)` means: let `R` be an arbitrary commutative ring, and let `a` and `b` be natural numbers. The square brackets tell Lean to infer the commutative-ring structure on `R` automatically. For this proof, `Type*` can simply be read as “some type.” When `a` and `b` occur in a polynomial over `R`, Lean coerces them from natural numbers to elements of `R`.

`noncomputable` permits classical choices that may occur downstream; it does not mean the displayed polynomial cannot be evaluated. The notation `C r` embeds a scalar as a constant polynomial, and `X` is the polynomial variable.

The parameters are natural numbers but are coerced into `R`. Specializing `R = ℚ`, `a = 4`, and `b = 2` gives exactly \(X^5-4X+2\).
:::

### II. Verify the polynomial bookkeeping

::: proof-lean polynomial-bookkeeping
For \(\Phi_{a,b}(X)=X^5-aX+b\), direct inspection gives:

- the constant coefficient is \(b\);
- the coefficient of \(X^5\) is \(1\);
- its degree is five;
- its leading coefficient is \(1\), so it is monic and nonzero;
- applying a coefficient homomorphism preserves the displayed expression.

These elementary facts justify the later degree, coefficient, and nonzeroness calculations.

::: lean-explanation
Lean records each fact as a separate reusable lemma.

The generic parameters `R`, `a`, and `b` make these lemmas reusable over integers, rationals, reals, and complex numbers. `WithBot ℕ` in the ordinary degree accommodates the degree of the zero polynomial; `natDegree` instead returns a natural number.
:::

### III. Prove irreducibility by Eisenstein

::: proof-lean eisenstein
Eisenstein's criterion says that an integer polynomial is irreducible over \(\mathbb Q\) if some prime \(p\):

1. does not divide the leading coefficient;
2. divides every other coefficient;
3. has \(p^2\) not dividing the constant coefficient.

For \(X^5-aX+b\), the assumptions \(p\mid a\), \(p\mid b\), and \(p^2\nmid b\) give exactly those conditions. The zero coefficients are automatically divisible by \(p\), and a prime cannot divide the leading coefficient \(1\). Therefore the polynomial is irreducible over \(\mathbb Q\). For \(a=4\), \(b=2\), and \(p=2\), every hypothesis holds.

::: lean-explanation
The proof first moves to \(\mathbb Z[X]\), applies mathlib's ideal-valued Eisenstein criterion, checks coefficients by a finite `interval_cases`, then transfers irreducibility back to \(\mathbb Q[X]\). `all_goals` supplies monicity-derived primitiveness to the remaining transfer goals.
:::

For the concrete values \(a=4,b=2,p=2\), all hypotheses hold. This is why the apparently arbitrary polynomial \(X^5-4X+2\) is such an efficient witness.

### IV. Exhibit two real roots

::: proof-lean real-root-existence
Let \(f(x)=x^5-ax+b\), with natural numbers \(b<a\). We know \(f(0)=b\ge0\). The proof splits according to the sign of \(f(1)=1-a+b\).

- If \(f(1)<0\), the intermediate value theorem gives one zero between \(0\) and \(1\). It also shows \(f(a)\ge0\), giving a second zero between \(1\) and \(a\).
- If \(f(1)\not<0\), the integrality and inequality \(b<a\) force \(b=a-1\), so \(f(1)=0\). A separate estimate shows \(f(-a)\le0\), while \(f(0)\ge0\), producing another zero at or left of zero.

The intervals are chosen half-open in the first branch, so the two roots cannot coincide. Therefore \(f\) has at least two distinct real roots.

::: lean-explanation
Lean records distinctness as `x ≠ y`. Continuity comes from polynomial evaluation, and `linarith`, `nlinarith`, and `ring` discharge the ordered-ring calculations.
:::

The auxiliary lemma returns two actual witnesses. The next lemma converts them into a cardinality statement.

::: proof-lean real-root-lower-bound
Let \(x\ne y\) be the two real roots constructed above. Then \(\{x,y\}\) is a two-element subset of the real root set. Hence

```latex
2=|\{x,y\}|\le |R_{\mathbb R}|.
```

Together with the upper bound, this proves \(2\le|R_{\mathbb R}|\le3\).

::: lean-explanation
Because the polynomial is monic, Lean first records that it is nonzero. The two witnesses define a finite set contained in `rootSet ℝ`; inclusion gives an embedding and hence a cardinality inequality. The hypothesis `x ≠ y` proves that the finite set has cardinality two.

This separation between “construct roots” and “count roots” is typical of formal proofs: each change of representation is made explicit.
:::

Combining the two witness construction with the cardinality argument gives at least two real roots. Together with the next upper bound, the polynomial has two or three real roots. Once we also know that it has five distinct complex roots, the inequalities required by the prime-degree criterion follow.

### V. At most three real roots

::: proof-lean real-root-upper-bound
If a real polynomial has \(r\) distinct roots, Rolle's theorem implies that its derivative has at least \(r-1\) distinct roots. Applying this twice to

```latex
f(X)=X^5-aX+b
```

reduces the problem to the second derivative \(20X^3\), whose real root set is the singleton \(\{0\}\). Therefore the first derivative has at most two distinct real roots and \(f\) has at most three.

::: lean-explanation
The proof maps the integer-coefficient expression into \(\mathbb Q[X]\), differentiates through `card_rootSet_le_derivative`, and finishes the monomial root-set computation with normalization. The scoped attribute line changes simplification behavior only inside this theorem.
:::

This bound is uniform in \(a,b\); the lower bound needs the inequality \(b<a\).

### VI. Count all complex roots

::: proof-lean complex-root-count
Let \(p=\Phi_{a,b}\). Because \(p\) is irreducible over the characteristic-zero field \(\mathbb Q\), it is separable. The Fundamental Theorem of Algebra says that \(p\) splits over \(\mathbb C\). A separable polynomial of degree five that splits has five distinct roots. Therefore

```latex
|R_{\mathbb C}|=5.
```

::: lean-explanation
`card_rootSet_eq_natDegree` says that a separable polynomial which splits has as many distinct roots as its natural degree. `natDegree_Phi` replaces that degree by five.

The hypothesis is written explicitly as `h : (Φ ℚ a b).Separable`. Later it is supplied by `h_irred.separable`, using the fact that irreducible polynomials over \(\mathbb Q\) are separable.
:::

This is the formal location of the Fundamental Theorem of Algebra in the Galois-group calculation.

### VII. Inspect the imported bridges

::: proof-lean library-bridge
The contradiction uses four mathematical results:

1. If an irreducible polynomial has a root solvable by radicals, its Galois group is solvable.
2. An irreducible rational polynomial of prime degree whose real-root count is between one and three below its complex-root count has full symmetric Galois action.
3. Every surjective homomorphic image of a solvable group is solvable.
4. The permutation group on at least five elements is not solvable.

Together they turn root-count information about our quintic into an obstruction to radical expressions.

::: lean-explanation
These are the four library results on which the short Lean contradiction rests.

- The first is the radicals-to-solvable-Galois bridge. Its first argument is membership in the intermediate field `solvableByRad F E`.
- The second recognizes a full Galois action for an irreducible prime-degree rational polynomial whose real and complex root counts differ by one to three.
- The third says a surjective image of a solvable group is solvable.
- The fourth says the permutation group of any type with cardinality at least five is not solvable.

`#check` asks Lean to print an expression's inferred type. It changes no theorem; it is a precise way to inspect the contract that later code must satisfy.
:::

Mathlib proves the first bridge by induction through the operations that generate `solvableByRad`. The radical case adjoins roots of unity, studies the Galois group of \(X^m-c\), and passes solvability through a field tower. Mathlib proves the non-solvability of permutation groups beginning with an explicit nontrivial element that remains in every term of the derived series of `Perm (Fin 5)`, then embeds that group into larger permutation groups.

Those developments are deep reusable libraries. Our companion calls them by their public theorem statements, while rebuilding every lemma specific to the polynomial \(X^5-4X+2\).

### VIII. Why the Galois group is S5

::: proof-lean full-galois-group
Let \(R_{\mathbb R}\) and \(R_{\mathbb C}\) be the real and complex root sets of \(\Phi_{a,b}\). We prove:

1. \(\Phi_{a,b}\) is irreducible over \(\mathbb Q\);
2. its degree is the prime number five;
3. \(|R_{\mathbb C}|=5\);
4. \(2\le |R_{\mathbb R}|\le3\).

Thus the number of complex roots is between one and three larger than the number of real roots. The prime-degree Galois criterion therefore makes the Galois action bijective. Since its target is the permutation group of five roots, the Galois group is isomorphic to \(S_5\).

::: lean-explanation
`galActionHom_bijective_of_prime_degree'` packages the prime-degree criterion. The degree lemma reduces primality to the concrete fact that five is prime, which `decide` proves. Separability and algebraic closure supply the five complex roots, while the real-root lemmas supply the required inequalities.

`Bijective` packages injectivity and surjectivity. The Galois obstruction in the next step uses `.2`, the surjective half.
:::

Why does this criterion force all of \(S_5\)? Irreducibility makes the Galois action transitive. Prime degree strongly restricts transitive subgroups. A small number of nonreal roots supplies a transposition through complex conjugation. The resulting transitive subgroup contains enough cycles and a transposition to be the full symmetric group.

### IX. The Galois obstruction

We now state the Galois objects used in the contradiction.

::: proof-lean galois-interfaces
Let \(p\in F[X]\), let \(L\) be its splitting field, and let \(R\) be its root set. The Galois action is the homomorphism

```latex
\rho:\operatorname{Gal}(p/F)\longrightarrow\operatorname{Sym}(R).
```

The contradiction compares solvability of this Galois group with solvability of its permutation image. It also uses the radical closure of \(F\) in \(E\), whose elements are exactly those obtainable inside \(E\) by radical towers over \(F\).

::: lean-explanation
`Polynomial.Gal p` is the Galois group attached to `p`. The homomorphism `galActionHom p E` sends an automorphism to its permutation of `p.rootSet E`.

`derivedSeries G` assigns a subgroup to each natural number, while `IsSolvable G` asserts that this series eventually reaches the trivial subgroup. Finally, `x ∈ solvableByRad F E` is the formal statement that `x` can be constructed by radicals over `F` inside `E`.
:::

::: proof-lean radical-contradiction
Let \(x\) be a root of an irreducible polynomial \(\Phi_{a,b}=X^5-aX+b\) satisfying the hypotheses established above. Suppose for contradiction that \(x\) is solvable by radicals over \(\mathbb Q\).

The radicals-to-Galois theorem implies that \(\operatorname{Gal}(\Phi_{a,b}/\mathbb Q)\) is solvable. Its Galois action is surjective onto \(\operatorname{Sym}(R)\), where \(R\) is the set of its five complex roots. A surjective image of a solvable group is solvable, so \(\operatorname{Sym}(R)\cong S_5\) would be solvable. But \(S_5\) is not solvable. This contradiction proves that \(x\) is not solvable by radicals.

::: lean-explanation
1. `isSolvable_gal_of_irreducible` turns that assumption, irreducibility, and the root equation into solvability of the polynomial's Galois group.
2. `gal_Phi` says the Galois action on the five roots is bijective, so in particular it is surjective onto their full permutation group.
3. `solvable_of_surjective` transfers solvability through that surjection.
4. `Equiv.Perm.not_solvable` says a symmetric group on at least five objects is not solvable.

The tactic `mt` is modus tollens: from `A → B` it produces `¬B → ¬A`. Here it converts “radical root implies solvable Galois group” into “non-solvable Galois group implies non-radical root.” The cardinality calculation at the end identifies the root set as a five-element type.
:::

This is the conceptual heart of Abel–Ruffini. A radical formula can create only solvable symmetry, while the roots of this quintic exhibit all of \(S_5\), a symmetry group too complicated to be solvable.

### X. Specialize the hard quintic

::: proof-lean concrete-quintic
The general family is \(X^5-aX+b\). We choose \(a=4\), \(b=2\), and the Eisenstein prime \(p=2\). The remaining hypotheses are finite arithmetic facts:

- \(2<4\), needed by the real-root argument;
- \(2\) is prime;
- \(2\mid4\) and \(2\mid2\);
- \(2^2\nmid2\).

These facts satisfy the hypotheses of the general theorem just proved, so every root of \(X^5-4X+2\) is not solvable by radicals over \(\mathbb Q\).

::: lean-explanation
The tactic `decide` proves each because these propositions are decidable and concrete. The combinator `<;>` applies it to every goal created by `apply`.
:::

We have now turned the general Galois obstruction into a statement about the concrete polynomial used in the rest of the article.

### XI. Recover the algebraic counterexample

::: proof-lean quintic-hard-root
By the Fundamental Theorem of Algebra, \(\Phi\) has a complex root \(x\). Since \(\Phi\in\mathbb Q[X]\) is nonzero and \(\Phi(x)=0\), the number \(x\) is algebraic over \(\mathbb Q\). The Galois obstruction already proved shows that \(x\) is not solvable by radicals over \(\mathbb Q\). Thus there exists an algebraic complex number that is not solvable by radicals.

Our stronger final theorem keeps the root equation visible, then pads the same polynomial to every degree at least five.

::: lean-explanation
The polynomial itself witnesses `IsAlgebraic ℚ x`; monicity proves that witness is nonzero; and `not_solvable_by_rad'` supplies the obstruction.
:::

### XII. Preserve the hard root

::: proof-lean root-preservation
The polynomial \(\Phi\in\mathbb Q[X]\) has degree five. Viewed over \(\mathbb C\), it therefore has a root \(x\in\mathbb C\) by the Fundamental Theorem of Algebra, so \(\Phi(x)=0\). The Galois argument above proves that every complex root of \(\Phi\) is not solvable by radicals over \(\mathbb Q\). Hence this chosen \(x\) has both required properties.

::: lean-explanation
`IsAlgClosed.splits` states that the polynomial splits over \(\mathbb C\), and positive degree then supplies `x` and its root equation. Because the polynomial was defined over \(\mathbb Q\), `map_Phi` and `eval_map` transport the equation through `algebraMap ℚ ℂ`. The final component invokes the specialized non-radical-root theorem.
:::

Notice the logical shape: algebraic closure proves that a root **does** exist; Galois theory proves that the same root **cannot** be expressed by radicals. These are complementary statements, not competing ones.

### XIII. Manufacture degree n from degree five

::: proof-lean degree-n-construction
Define \(P_n=X^{n-5}\Phi\). Both factors are monic, so their product is monic and in particular nonzero. The natural degree of a product of nonzero polynomials is the sum of their natural degrees:

```latex
\operatorname{natDegree}(P_n)
=(n-5)+5=n.
```

The assumption \(n\ge5\) gives \((n-5)+5=n\), completing the degree calculation.

::: lean-explanation
In Lean, `monic_X.pow (n - 5)` proves that the first factor is monic, while `monic_Phi 4 2` proves the same for the quintic. The explicit nonzero proofs passed to `natDegree_mul` prevent the zero-polynomial exception.

Natural-number subtraction truncates at zero, so Lean uses `Nat.sub_add_cancel hn` with the hypothesis `hn : 5 ≤ n` for the final equality.
:::

The construction need not be irreducible for \(n>5\). It only needs to retain one root that no radical formula can express. If one wanted an irreducible hard example in every degree, that would be a stronger and substantially different theorem.

### XIV. The final theorem

All the required pieces are now available. The theorem does not claim that every degree-\(n\) polynomial is hard. It claims that for each \(n\ge5\) there exists at least one counterexample.

::: proof-lean final-theorem
Fix \(n\ge5\), and define

```latex
\Phi(X)=X^5-4X+2,
\qquad
P_n(X)=X^{n-5}\Phi(X).
```

The preceding lemmas give a complex number \(x\) such that \(\Phi(x)=0\) and \(x\) is not solvable by radicals over \(\mathbb Q\). They also give \(\deg P_n=n\). Finally,

```latex
P_n(x)=x^{n-5}\Phi(x)=x^{n-5}\cdot0=0.
```

Thus \(P_n\in\mathbb Q[X]\) has degree \(n\) and has a complex root not solvable by radicals over \(\mathbb Q\).

::: lean-explanation
The nested existential statement follows the mathematical proof directly: extract a non-radical root of the hard quintic, choose the padded polynomial, and supply its degree and the chosen root. The only remaining goal is the root equation for the product; polynomial evaluation respects multiplication, so it reduces to the known equation \(\Phi(x)=0\).
:::

The final Lean theorem is short because every difficult point has already been packaged in a declaration that was compiled earlier in the file.

---

## 4. Sources

- [Companion Lean source for this article](https://github.com/ssydyc2/personal_website/tree/main/formal/abel-ruffini)
- [Mathlib: Construction of an algebraic number that is not solvable by radicals](https://leanprover-community.github.io/mathlib4_docs/Archive/Wiedijk100Theorems/AbelRuffini.html)
- [Mathlib: The Abel–Ruffini theorem and solvability by radicals](https://leanprover-community.github.io/mathlib4_docs/Mathlib/FieldTheory/AbelRuffini.html)
- [Mathlib: Polynomial Galois groups](https://leanprover-community.github.io/mathlib4_docs/Mathlib/FieldTheory/PolynomialGaloisGroup.html)
- [Mathlib: Solvable groups and permutation groups](https://leanprover-community.github.io/mathlib4_docs/Mathlib/GroupTheory/Solvable.html)
- The adapted companion code retains Thomas Browning's attribution and is distributed under mathlib's Apache-2.0 license.
