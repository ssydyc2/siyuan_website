# Why Can't Equations of Degree Five or Higher Be Solved by Radicals?

## Contents

- [1. The problem and counterexample](#1-the-problem-and-counterexample)
- [2. Mathematical prerequisites](#2-mathematical-prerequisites)
  - [I. Group](#i-group)
  - [II. Abelian group](#ii-abelian-group)
  - [III. Semigroups, monoids, and rings](#iii-semigroups-monoids-and-rings)
  - [IV. Field](#iv-field)
  - [V. Polynomial](#v-polynomial)
  - [VI. Units and factorization](#vi-units-and-factorization)
  - [VII. Separable polynomial](#vii-separable-polynomial)
  - [VIII. Homomorphisms and automorphisms](#viii-homomorphisms-and-automorphisms)
  - [IX. Field extensions and Galois groups](#ix-field-extensions-and-galois-groups)
  - [X. Commutators, derived series, and solvable groups](#x-commutators-derived-series-and-solvable-groups)
  - [XI. Solvable by radicals and the radical closure](#xi-solvable-by-radicals-and-the-radical-closure)
- [3. Build the proof step by step](#3-build-the-proof-step-by-step)
  - [I. Define the hard quintic](#i-define-the-hard-quintic)
  - [II. Verify the polynomial bookkeeping](#ii-verify-the-polynomial-bookkeeping)
  - [III. Prove irreducibility by Eisenstein](#iii-prove-irreducibility-by-eisenstein)
  - [IV. Exhibit two real roots](#iv-exhibit-two-real-roots)
  - [V. At most three real roots](#v-at-most-three-real-roots)
  - [VI. Count all complex roots](#vi-count-all-complex-roots)
  - [VII. The core lemmas](#vii-the-core-lemmas)
  - [VIII. Why the Galois group is S5](#viii-why-the-galois-group-is-s5)
  - [IX. The Galois obstruction](#ix-the-galois-obstruction)
  - [X. Recover the algebraic counterexample](#x-recover-the-algebraic-counterexample)
  - [XI. Preserve the hard root](#xi-preserve-the-hard-root)
  - [XII. Manufacture degree n from degree five](#xii-manufacture-degree-n-from-degree-five)
  - [XIII. The final theorem](#xiii-the-final-theorem)
- [4. Sources](#4-sources)
- [5. Appendix: why radicals imply a solvable Galois group](#5-appendix-why-radicals-imply-a-solvable-galois-group)
  - [I. The radicals-to-Galois theorem](#i-the-radicals-to-galois-theorem)
  - [II. Prerequisites for the Appendix](#ii-prerequisites-for-the-appendix)
  - [III. Group-theoretic and splitting-field lemmas](#iii-group-theoretic-and-splitting-field-lemmas)
  - [IV. Lemma: induction on the radical closure](#iv-lemma-induction-on-the-radical-closure)
  - [V. Lemma: extracting one radical](#v-lemma-extracting-one-radical)
  - [VI. Theorem: the minimal polynomial has solvable Galois group](#vi-theorem-the-minimal-polynomial-has-solvable-galois-group)
  - [VII. Proof of the radicals-to-Galois theorem](#vii-proof-of-the-radicals-to-galois-theorem)

## Overview and approach

**What this article is about.** This article explains why equations of degree five or higher cannot always be solved by radicals. Each stage of the main argument presents a pure mathematical proof beside the exact compiled Lean code that verifies the same logical step, with short explanations connecting the formal statement back to the mathematics.

**Goal.** When I was learning abstract algebra, one of my biggest frustrations was encountering an endless stream of definitions and concepts without understanding what they were trying to accomplish. This article is written for readers who may otherwise lose the main argument behind a wall of definitions. Its aim is to make the purpose of each construction visible as it enters the proof, so that readers can understand what the mathematics is doing without giving up mathematical precision.

**Approach.** The article has three stages. First, we state the problem precisely and introduce the concrete counterexample. Second, we develop only the mathematical prerequisites the proof needs. Third, we build the proof in dependency order, with each step supported by results already established. This order keeps each abstract concept tied to the moment where it becomes useful, while Lean checks that the formal dependencies really line up. The article gives the complete framework of the proof and fully verifies the explicit counterexample, but it does not re-prove every foundational theorem in Galois theory or mathlib from first principles; those deeper results are stated precisely, linked to their formal sources, and used as named dependencies.

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

This section contains only the definitions used directly by the main argument in Sections 1–3. The additional algebraic language needed only for the detailed radicals-to-Galois proof is collected separately in Appendix II.

### I. Group

A group is a tuple \((G,\star,e,(-)^{-1})\) consisting of a set \(G\), a binary operation \(\star:G\times G\to G\), an identity element \(e\in G\), and an inverse operation \((-)^{-1}:G\to G\). For every \(a,b,c\in G\), it satisfies:

- **Associativity:** \((a\star b)\star c=a\star(b\star c)\).
- **Identity:** \(e\star a=a=a\star e\).
- **Inverses:** \(a^{-1}\star a=e=a\star a^{-1}\).

A group is **cyclic** if all of its elements are integer powers of one element. Every cyclic group is abelian.

### II. Abelian group

An abelian group, also called a commutative group, is a group whose operation is commutative:

```latex
a\star b=b\star a
\qquad\text{for every }a,b\in G.
```

### III. Semigroups, monoids, and rings

A **semigroup** is a set \(S\) with an associative binary operation \(\star\):

```latex
(a\star b)\star c=a\star(b\star c)
\qquad(a,b,c\in S).
```

A **monoid** is a semigroup with an identity element \(e\) satisfying \(e\star a=a=a\star e\). It is **commutative** if \(a\star b=b\star a\) for all \(a,b\).

A **ring** is a tuple \((R,+,\cdot,-,0,1)\) such that \((R,+,0,-)\) is an abelian group, \((R,\cdot,1)\) is a monoid, and multiplication distributes over addition:

```latex
a(b+c)=ab+ac,
\qquad
(a+b)c=ac+bc.
```

A **commutative ring** is a ring whose multiplication is commutative. These definitions are the ambient algebraic structure behind polynomial rings, ideals, kernels, and fields.

### IV. Field

A field is a set \(F\) with addition, multiplication, additive inverses, distinguished elements \(0,1\), and multiplicative inverses for nonzero elements, such that:

- \((F,+,0,-)\) is an abelian group;
- \((F\setminus\{0\},\cdot,1,(-)^{-1})\) is an abelian group;
- multiplication distributes over addition; and
- \(0\ne1\).

Examples include \(\mathbb Q\), \(\mathbb R\), and \(\mathbb C\). Division by a nonzero element is defined by \(a/b:=ab^{-1}\).

A field has **characteristic zero** if no positive integer sum \(1+\cdots+1\) equals \(0\). Equivalently, the natural map \(\mathbb Z\to F\) never sends two different integers to the same field element. The fields \(\mathbb Q\), \(\mathbb R\), and \(\mathbb C\) all have characteristic zero.

### V. Polynomial

Let \(F\) be a field. A polynomial over \(F\) is a finite formal sum

```latex
p(X)=a_0+a_1X+\cdots+a_nX^n
=\sum_{i=0}^{n}a_iX^i,
\qquad a_i\in F.
```

The word **formal** matters: \(X\) is an indeterminate, not yet a number. Two polynomials are equal exactly when all corresponding coefficients are equal. The set of polynomials over \(F\), with coefficientwise addition and the usual convolution product, is denoted by \(F[X]\).

For a nonzero polynomial \(p(X)=\sum_i a_iX^i\), its **degree** is the largest \(i\) for which \(a_i\ne0\), and its **leading coefficient**, written \(\operatorname{lc}(p)\), is that \(a_i\). The polynomial is **monic** if \(\operatorname{lc}(p)=1\). Lean's `natDegree` is the degree as a natural number; it agrees with the ordinary degree for nonzero polynomials and is defined to be \(0\) for the zero polynomial. Lean's `degree` instead gives the zero polynomial a special bottom value.

If \(E/F\) is a field extension and \(\alpha\in E\), the **evaluation** of \(p\) at \(\alpha\) is

```latex
p(\alpha)=\sum_i a_i\alpha^i,
```

where each coefficient is viewed in \(E\). The element \(\alpha\) is a **root** if \(p(\alpha)=0\). The set of distinct roots in \(E\) is denoted by \(\operatorname{Roots}_E(p)\); when it is finite, \(|\operatorname{Roots}_E(p)|\) denotes its number of elements.

The **formal derivative** of \(p\) is

```latex
p'(X)=\sum_{i\ge1} i\,a_iX^{i-1}.
```

### VI. Units and factorization

A **unit** of \(F[X]\) is a polynomial \(u\) for which some \(v\in F[X]\) satisfies \(uv=1\). The units of \(F[X]\) are exactly the nonzero constant polynomials. Consequently, multiplying a polynomial by a nonzero scalar does not create a mathematically meaningful factorization.

For \(p,q\in F[X]\), we say that \(p\) **divides** \(q\), written \(p\mid q\), if there is some \(r\in F[X]\) with \(q=pr\).

A nonzero, nonunit polynomial \(p\in F[X]\) is **reducible over \(F\)** if there exist nonunit polynomials \(f,g\in F[X]\) such that

```latex
p=fg.
```

Otherwise, \(p\) is **irreducible over \(F\)**. Equivalently, \(p\) is irreducible if every factorization \(p=fg\) forces either \(f\) or \(g\) to be a nonzero constant. For a polynomial of positive degree, this means it has no factor whose degree lies strictly between \(0\) and \(\deg p\).

Irreducibility depends on the coefficient field. For example, \(X^2-2\) is irreducible in \(\mathbb Q[X]\), but it factors in \(\mathbb R[X]\):

```latex
X^2-2=(X-\sqrt2)(X+\sqrt2).
```

### VII. Separable polynomial

A nonzero polynomial is **separable over \(F\)** if, in a field where it splits completely into linear factors, no root occurs with multiplicity greater than one. Equivalently, \(p\) and its formal derivative \(p'\) have no common nonconstant factor. Every irreducible polynomial over a field of characteristic zero is separable. In particular, every irreducible polynomial in \(\mathbb Q[X]\) is separable.

### VIII. Homomorphisms and automorphisms

A **homomorphism** is a function that preserves structure. The structure depends on the kind of object: for groups it must preserve the group operation; for fields it must preserve addition, multiplication, \(0\), and \(1\).

A function \(f:A\to B\) is **injective** if different inputs never collapse to the same output:

```latex
f(a)=f(a')\Longrightarrow a=a'.
```

It is **surjective** if every element of \(B\) is hit by some element of \(A\):

```latex
\text{for every }b\in B\text{ there exists }a\in A
\text{ such that }f(a)=b.
```

A function is **bijective** if it is both injective and surjective.

Let \((G,\star)\) and \((H,\diamond)\) be groups. A **group homomorphism** is a function \(f:G\to H\) preserving the group operation:

```latex
f(a\star b)=f(a)\diamond f(b)
\qquad(a,b\in G).
```

A **group isomorphism** is a bijective group homomorphism. If one exists, we write \(G\cong H\); the two groups may have differently named elements, but they have the same group structure.

A **group automorphism** is a group isomorphism from a group to itself. It is a symmetry of that group.

Let \(F\) and \(E\) be fields. A **field homomorphism**

```latex
\varphi:F\longrightarrow E
```

is a function that preserves the field operations:

```latex
\varphi(a+b)=\varphi(a)+\varphi(b),
\qquad
\varphi(ab)=\varphi(a)\varphi(b),
\qquad
\varphi(0)=0,
\qquad
\varphi(1)=1.
```

In words, it sends arithmetic in \(F\) to the same arithmetic in \(E\). This is the same data as a unital ring homomorphism between fields. We do not separately require preservation of inverses, because it follows automatically: if \(a\ne0\), then

```latex
\varphi(a)\varphi(a^{-1})
=\varphi(aa^{-1})
=\varphi(1)
=1,
```

so \(\varphi(a^{-1})=\varphi(a)^{-1}\). For example, the usual inclusion \(\mathbb Q\hookrightarrow\mathbb C\) is a field homomorphism.

A **field isomorphism** is a bijective field homomorphism. It says two fields have the same field structure, even if their elements are named or represented differently.

A **field automorphism** of a field \(L\) is an isomorphism from \(L\) to itself:

```latex
\sigma:L\longrightarrow L.
```

It is a symmetry of the field \(L\) that preserves addition, multiplication, \(0\), and \(1\). For instance, complex conjugation

```latex
z\longmapsto \overline z
```

is a field automorphism of \(\mathbb C\).

If \(F\subseteq L\), an **\(F\)-automorphism of \(L\)** is a field automorphism that fixes every element of the base field \(F\):

```latex
\sigma(a)=a
\qquad(a\in F).
```

This means the automorphism is allowed to move the new elements of \(L\), but it must leave the scalars from \(F\) unchanged. The \(F\)-automorphisms of \(L\) form a group under composition, denoted

```latex
\operatorname{Aut}_F(L).
```

This definition is the symmetry language used by Galois groups.

### IX. Field extensions and Galois groups

For the main proof, a **field extension** is an inclusion of fields

```latex
F\subseteq E.
```

We write \(E/F\), where \(F\) is the **base field** and \(E\) is the **extension field**. The slash records the inclusion and does not denote a quotient. For example, \(\mathbb C/\mathbb Q\) denotes the usual inclusion \(\mathbb Q\subseteq\mathbb C\). More abstractly, a field extension can be described by a chosen field homomorphism \(F\to E\); Appendix II explains why this agrees with the concrete inclusion picture after identifying \(F\) with its image.

An **intermediate field** of \(E/F\) is a field \(K\) lying between them:

```latex
F\subseteq K\subseteq E.
```

An element \(\alpha\in E\) is **algebraic over \(F\)** if some nonzero polynomial \(p\in F[X]\) satisfies \(p(\alpha)=0\).

The extension \(E/F\) is an **algebraic extension** if every element of \(E\) is algebraic over \(F\). In other words, no element of \(E\) is freely transcendental over \(F\); each one satisfies some polynomial equation with coefficients in \(F\).

A field \(E\) is **algebraically closed** if every nonconstant polynomial in \(E[X]\) has a root in \(E\). Equivalently, every polynomial in \(E[X]\) splits into linear factors over \(E\). The Fundamental Theorem of Algebra says precisely that \(\mathbb C\) is algebraically closed.

Let \(p\in F[X]\). We say that \(p\) **splits over \(E\)** if it factors there entirely into linear terms:

```latex
p(X)=c\prod_{i=1}^{d}(X-\alpha_i),
\qquad c\in F,\ \alpha_i\in E.
```

A **splitting field** of \(p\) over \(F\) is an extension \(L/F\) satisfying two conditions:

1. \(p\) splits over \(L\); and
2. \(L\) is generated over \(F\) by the roots of \(p\).

The second condition is a minimality condition: no unrelated field elements have been added. For example, \(X^2-2\) has splitting field \(\mathbb Q(\sqrt2)\) over \(\mathbb Q\), because its roots are \(\sqrt2\) and \(-\sqrt2\). Inside a fixed algebraic closure, splitting fields exist and are unique up to an isomorphism that fixes \(F\).

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

The notation \(\operatorname{Perm}(R)\) used later means the same permutation group as \(\operatorname{Sym}(R)\). When \(|R|=d\), this group is isomorphic to the usual symmetric group \(S_d\).

Separability has a different role. If \(p\) is separable of degree \(d\), then it has exactly \(d\) distinct roots in its splitting field, so \(\operatorname{Sym}(R)\cong S_d\). If \(\rho\) is also **surjective**, every permutation of those roots comes from a field automorphism. Since \(\rho\) is then both injective and surjective,

```latex
\operatorname{Gal}(p/F)\cong S_d.
```

For our quintic, the target is therefore \(S_5\). The decisive fact later will be that \(S_5\) is not a solvable group.

### X. Commutators, derived series, and solvable groups

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

Finally, solvability is preserved by subgroups and quotient groups. We will use the following imported consequence without proving it: if \(f:G\to H\) is a surjective group homomorphism and \(G\) is solvable, then \(H\) is solvable. This is cited theorem 3 in the main proof and is exactly the theorem `solvable_of_surjective` used by Lean. Its contrapositive says that no solvable group can map surjectively onto \(S_5\).

### XI. Solvable by radicals and the radical closure

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

The element does not have to be one of the generators \(\beta_i\); it may be any field expression made from them.

The set of all elements of \(E\) obtainable this way is the **radical closure of \(F\) inside \(E\)**, denoted

```latex
\mathcal R(F,E).
```

Equivalently, \(\mathcal R(F,E)\) is the smallest intermediate field \(K\), \(F\subseteq K\subseteq E\), that is closed under extracting radicals inside \(E\):

```latex
y\in E,\quad n\ge1,\quad y^n\in K
\quad\Longrightarrow\quad
y\in K.
```

Formally, this smallest field is constructed by intersecting every intermediate field with that closure property:

```latex
\mathcal R(F,E)
=
\bigcap
\left\{
K:
F\subseteq K\subseteq E,\quad
\forall y\in E,\ \forall n\ge1,
y^n\in K\Rightarrow y\in K
\right\}.
```

The family being intersected is nonempty because \(E\) itself belongs to it. Intersections of intermediate fields are intermediate fields, so \(\mathcal R(F,E)\) is a field. It is contained in every radical-closed intermediate field and is therefore the unique smallest one.

Thus

```latex
\alpha\text{ is solvable by radicals over }F
\quad\Longleftrightarrow\quad
\alpha\in\mathcal R(F,E).
```

A polynomial is called **solvable by radicals** if a radical extension contains all of its roots, or equivalently its splitting field embeds into such an extension.

The group-theoretic consequence needed later is:

**If an irreducible polynomial has a root solvable by radicals, then its Galois group is solvable.**

We use this theorem in the main proof. Its rigorous proof, together with the corresponding mathlib source, is given in [Appendix 5](#5-appendix-why-radicals-imply-a-solvable-galois-group); no part of that proof is required as a prerequisite here.

---

## 3. Build the proof step by step

We now assemble the proof in dependency order. Each Lean declaration uses only definitions and results that have already appeared, so the argument can be read—and compiled—from top to bottom.

### I. Define the hard quintic

::: proof-lean hard-quintic
Define the concrete rational polynomial

```latex
\Phi(X)=X^5-4X+2\in\mathbb Q[X].
```

This is the only polynomial needed for the final counterexample.

::: lean-explanation
`ℚ[X]` is Lean's notation for polynomials with rational coefficients, `X` is the polynomial variable, and `C` embeds a rational number as a constant polynomial. Mathlib's polynomial arithmetic uses noncomputable instances, so Lean requires the `noncomputable` marker here even though the polynomial itself is completely explicit.
:::

### II. Verify the polynomial bookkeeping

::: proof-lean polynomial-bookkeeping
For \(\Phi(X)=X^5-4X+2\), direct inspection gives:

- its degree is five;
- its leading coefficient is \(1\), so it is monic and nonzero.

These are the two concrete facts about \(\Phi\) that the final construction will reuse.

::: lean-explanation
`hardQuintic_natDegree` records that the natural degree is five. `hardQuintic_monic` records that the leading coefficient is one. Monicity also implies that the polynomial is nonzero.
:::

### III. Prove irreducibility by Eisenstein

::: proof-lean eisenstein
Eisenstein's criterion says that an integer polynomial is irreducible over \(\mathbb Q\) if some prime \(p\):

1. does not divide the leading coefficient;
2. divides every other coefficient;
3. has \(p^2\) not dividing the constant coefficient.

For \(\Phi=X^5-4X+2\), choose \(p=2\). The prime divides every nonleading coefficient: it divides \(-4\), \(2\), and all the zero coefficients. Its square \(4\) does not divide the constant coefficient \(2\), and \(2\) does not divide the leading coefficient \(1\). Eisenstein's criterion therefore proves that \(\Phi\) is irreducible over \(\mathbb Q\).

::: lean-explanation
Eisenstein's criterion is a statement about divisibility of integer coefficients, so the Lean proof temporarily defines `Φℤ : ℤ[X]` with the same expression. `Φℤ_degree` and `Φℤ_monic` record the two facts needed to apply the criterion.

`hardQuintic_irreducible_aux` proves that mapping the integer coefficients into \(\mathbb Q\) recovers `Φ`, then applies mathlib's Eisenstein criterion at the prime \(2\). The coefficient cases are finite because the degree is five. Finally, `hardQuintic_irreducible` exposes the result in the simple form used by the rest of the article: `Irreducible Φ`.
:::

This is why the apparently arbitrary polynomial \(X^5-4X+2\) is such an efficient witness.

### IV. Exhibit two real roots

::: proof-lean real-root-existence
Let \(f(x)=x^5-4x+2\). Direct calculation gives

```latex
f(0)=2>0,\qquad f(1)=-1<0,\qquad f(2)=26>0.
```

By continuity, there is one root between \(0\) and \(1\), and another between \(1\) and \(2\). The intervals are disjoint, so the two roots are distinct.

::: lean-explanation
`hardQuintic_has_two_real_roots` records the two witnesses, their root equations, and the fact that they are distinct. The intermediate value theorem supplies both roots from the three sign calculations above.
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
\Phi(X)=X^5-4X+2
```

reduces the problem to the second derivative \(20X^3\), whose real root set is the singleton \(\{0\}\). Therefore the first derivative has at most two distinct real roots and \(f\) has at most three.

::: lean-explanation
The proof maps the integer-coefficient expression into \(\mathbb Q[X]\), differentiates through `card_rootSet_le_derivative`, and finishes the monomial root-set computation with normalization. The scoped attribute line changes simplification behavior only inside this theorem.
:::

Together with the two roots already exhibited, this gives exactly the range needed later: \(2\le |R_{\mathbb R}|\le3\).

### VI. Count all complex roots

::: proof-lean complex-root-count
Because \(\Phi\) is irreducible over the characteristic-zero field \(\mathbb Q\), it is separable. The Fundamental Theorem of Algebra says that \(\Phi\) splits over \(\mathbb C\). A separable polynomial of degree five that splits has five distinct roots. Therefore

```latex
|R_{\mathbb C}|=5.
```

::: lean-explanation
`hardQuintic_complex_roots` combines irreducibility, separability, splitting over \(\mathbb C\), and `hardQuintic_natDegree` to obtain the concrete root count five.
:::

This is the formal location of the Fundamental Theorem of Algebra in the Galois-group calculation.

### VII. The core lemmas

::: proof-lean core-lemmas
We use the following four theorems as cited results. Their precise statements are recorded here; their proofs are not part of the main argument.

**Cited theorem 1 (radicals imply solvable Galois group).** Let \(F\subseteq E\) be a field extension—equivalently, in Lean's abstract language, let \(E\) have an \(F\)-algebra structure as defined in Appendix II.E. Let \(x\in E\) and \(q\in F[X]\). If

```latex
x\in\mathcal R(F,E),\qquad q\text{ is irreducible},\qquad q(x)=0,
```

where \(\mathcal R(F,E)\) is the radical closure defined in prerequisite XI. Then

```latex
\operatorname{Gal}(q/F)\text{ is solvable}.
```

**Cited theorem 2 (prime-degree Galois action).** Let \(p\in\mathbb Q[X]\) be irreducible, and suppose that its natural degree is prime. Write

```latex
r=|\operatorname{Roots}_{\mathbb R}(p)|,
\qquad
c=|\operatorname{Roots}_{\mathbb C}(p)|.
```

If

```latex
r+1\le c\le r+3,
```

then the natural homomorphism

```latex
\operatorname{Gal}(p/\mathbb Q)
\longrightarrow
\operatorname{Perm}(\operatorname{Roots}_{\mathbb C}(p))
```

is bijective.

**Cited theorem 3 (surjective transfer of solvability).** Let \(G\) and \(H\) be groups and let \(f:G\to H\) be a surjective group homomorphism. If \(G\) is solvable, then \(H\) is solvable.

**Cited theorem 4 (non-solvability of the symmetric group).** If \(X\) is a type satisfying

```latex
5\le |X|,
```

where \(|X|\) denotes its cardinality, then the full permutation group \(\operatorname{Perm}(X)\) is not solvable.

::: lean-explanation
The four `#check` commands correspond, in order, to cited theorems 1–4. They introduce no proofs or new declarations: `#check` only asks Lean to elaborate and report the imported declaration's type. Thus the mathematics on the left states exactly the results cited by this Lean region and deliberately supplies no independent proofs.
:::

Cited theorem 1 is proved in [Appendix 5](#5-appendix-why-radicals-imply-a-solvable-galois-group) by following the actual mathlib source from `solvableByRad` through `isSolvable_gal_minpoly` to `isSolvable_gal_of_irreducible`. Cited theorems 2–4 remain imported without proof, exactly as they do in the displayed Lean file.

### VIII. Why the Galois group is S5

::: proof-lean full-galois-group
Let \(R_{\mathbb R}\) and \(R_{\mathbb C}\) be the real and complex root sets of \(\Phi\). We have proved:

1. \(\Phi\) is irreducible over \(\mathbb Q\);
2. its degree is the prime number five;
3. \(|R_{\mathbb C}|=5\);
4. \(2\le |R_{\mathbb R}|\le3\).

Thus the number of complex roots is between one and three larger than the number of real roots. Cited theorem 2 therefore makes the Galois action bijective. This bijectivity is the exact conclusion proved by the Lean declaration. Its target is the permutation group of a five-element root set, which is abstractly isomorphic to \(S_5\); the next step uses only the surjective half of the bijectivity statement.

::: lean-explanation
`galActionHom_bijective_of_prime_degree'` packages the prime-degree criterion. The degree lemma reduces primality to the concrete fact that five is prime, which `decide` proves. Separability and algebraic closure supply the five complex roots, while the real-root lemmas supply the required inequalities.

`Bijective` packages injectivity and surjectivity. The Galois obstruction in the next step uses `.2`, the surjective half.
:::

The internal proof of the prime-degree criterion is not reproduced here, because the Lean region also imports `galActionHom_bijective_of_prime_degree'` rather than proving it. Both columns use that result as cited theorem 2.

### IX. The Galois obstruction

::: proof-lean radical-contradiction
Let \(x\in\mathbb C\) satisfy \(\Phi(x)=0\), and let

```latex
R=\operatorname{Roots}_{\mathbb C}(\Phi).
```

Here \(\mathcal R(\mathbb Q,\mathbb C)\) is the radical closure of \(\mathbb Q\) inside \(\mathbb C\): the set of complex numbers obtainable from rational numbers by field operations and radical extractions, as defined in prerequisite XI. We prove that

```latex
x\notin\mathcal R(\mathbb Q,\mathbb C).
```

By cited theorem 1, irreducibility of \(\Phi\), and the equality \(\Phi(x)=0\), we have the implication

```latex
x\in\mathcal R(\mathbb Q,\mathbb C)
\quad\Longrightarrow\quad
\operatorname{Gal}(\Phi/\mathbb Q)\text{ is solvable}.
```

It therefore suffices, by contraposition, to prove that \(\operatorname{Gal}(\Phi/\mathbb Q)\) is not solvable. Suppose instead that it is solvable. Section VIII proves that the Galois-action homomorphism

```latex
\rho:\operatorname{Gal}(\Phi/\mathbb Q)\longrightarrow\operatorname{Perm}(R)
```

is bijective, hence surjective. Cited theorem 3 applied to \(\rho\) would then imply that \(\operatorname{Perm}(R)\) is solvable.

On the other hand, Section VI gives \(|R|=5\), hence \(5\le |R|\). Cited theorem 4 therefore says that \(\operatorname{Perm}(R)\) is not solvable, a contradiction. Thus \(\operatorname{Gal}(\Phi/\mathbb Q)\) is not solvable, and contraposition yields

```latex
x\notin\mathcal R(\mathbb Q,\mathbb C).
```

::: lean-explanation
The proof follows the mathematical argument in the same order.

1. `isSolvable_gal_of_irreducible · hardQuintic_irreducible hx` is the implication from radical membership to solvability of `Gal Φ`.
2. `apply mt` takes its contrapositive, leaving the goal that `Gal Φ` is not solvable.
3. Under the temporary assumption `h : IsSolvable (Gal Φ)`, `hardQuintic_galoisAction_bijective.2` supplies surjectivity of the Galois action, and `solvable_of_surjective` makes the permutation group of the complex root type solvable.
4. `rw_mod_cast [Cardinal.mk_fintype, hardQuintic_complex_roots]` proves that this root type has cardinality five. `Equiv.Perm.not_solvable` then contradicts its solvability.

In particular, neither column constructs an explicit isomorphism with \(S_5\): both apply the imported non-solvability theorem directly to the five-element complex root type.
:::

This is the conceptual heart of Abel–Ruffini. A radical formula can create only solvable symmetry, while the roots of this quintic exhibit all of \(S_5\), a symmetry group too complicated to be solvable.

### X. Recover the algebraic counterexample

::: proof-lean quintic-hard-root
By the Fundamental Theorem of Algebra, \(\Phi\) has a complex root \(x\). Since \(\Phi\in\mathbb Q[X]\) is nonzero and \(\Phi(x)=0\), the number \(x\) is algebraic over \(\mathbb Q\). The Galois obstruction already proved shows that \(x\) is not solvable by radicals over \(\mathbb Q\). Thus there exists an algebraic complex number that is not solvable by radicals.

Our stronger final theorem keeps the root equation visible, then pads the same polynomial to every degree at least five.

::: lean-explanation
The polynomial itself witnesses `IsAlgebraic ℚ x`; monicity proves that witness is nonzero; and `not_solvable_by_rad'` supplies the obstruction.
:::

### XI. Preserve the hard root

::: proof-lean root-preservation
The polynomial \(\Phi\in\mathbb Q[X]\) has degree five. Viewed over \(\mathbb C\), it therefore has a root \(x\in\mathbb C\) by the Fundamental Theorem of Algebra, so \(\Phi(x)=0\). The Galois argument above proves that every complex root of \(\Phi\) is not solvable by radicals over \(\mathbb Q\). Hence this chosen \(x\) has both required properties.

::: lean-explanation
`IsAlgClosed.exists_aeval_eq_zero` applies algebraic closure directly to the rational polynomial \(\Phi\) and supplies `x` with its root equation. The final component invokes the concrete non-radical-root theorem.
:::

Notice the logical shape: algebraic closure proves that a root **does** exist; Galois theory proves that the same root **cannot** be expressed by radicals. These are complementary statements, not competing ones.

### XII. Manufacture degree n from degree five

::: proof-lean degree-n-construction
Define \(P_n=X^{n-5}\Phi\). Both factors are monic, so their product is monic and in particular nonzero. The natural degree of a product of nonzero polynomials is the sum of their natural degrees:

```latex
\operatorname{natDegree}(P_n)
=(n-5)+5=n.
```

The assumption \(n\ge5\) gives \((n-5)+5=n\), completing the degree calculation.

::: lean-explanation
In Lean, `monic_X.pow (n - 5)` proves that the first factor is monic, while `hardQuintic_monic` proves the same for \(\Phi\). The explicit nonzero proofs passed to `natDegree_mul` prevent the zero-polynomial exception.

Natural-number subtraction truncates at zero, so Lean uses `Nat.sub_add_cancel hn` with the hypothesis `hn : 5 ≤ n` for the final equality.
:::

The construction need not be irreducible for \(n>5\). It only needs to retain one root that no radical formula can express. If one wanted an irreducible hard example in every degree, that would be a stronger and substantially different theorem.

### XIII. The final theorem

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

---

## 5. Appendix: why radicals imply a solvable Galois group

This appendix proves the first core lemma in substantially more detail. Its hypotheses match the mathlib theorem: no characteristic-zero assumption is needed. The Lean excerpts below are from `Mathlib.FieldTheory.AbelRuffini` in the mathlib version used by the companion project. They are library source code, not code written specifically for our quintic.

### I. The radicals-to-Galois theorem

**Theorem.** Let \(F\subseteq E\) be fields. Let \(q\in F[X]\) be irreducible, and suppose \(x\in E\) satisfies

```latex
q(x)=0
\qquad\text{and}\qquad
x\text{ is solvable by radicals over }F.
```

Then the Galois group of the splitting field of \(q\) over \(F\) is solvable:

```latex
\operatorname{Gal}(q/F)\text{ is solvable}.
```

The proof is given in Sections III–VII. The complete mathlib theorem body appears beside the final mathematical step in Section VII.

### II. Prerequisites for the Appendix

#### A. Homomorphism arrow notation

For a homomorphism \(f:G\to H\), we use the following arrow notation:

```latex
G\longrightarrow H
\quad\text{for a homomorphism},
\qquad
G\hookrightarrow H
\quad\text{for an injective homomorphism},
\qquad
G\twoheadrightarrow H
\quad\text{for a surjective homomorphism}.
```

Thus a double-headed arrow \(G\twoheadrightarrow H\) asserts that every element of \(H\) is the image of at least one element of \(G\).

#### B. Ideals, kernels, and field homomorphisms

The purpose of this subsection is to prove that a field homomorphism places its domain inside its codomain as a subfield.

**Definition 1 (field homomorphism).** Let \(F\) and \(E\) be fields. A field homomorphism \(\iota:F\to E\) is a function satisfying

```latex
\iota(0)=0,\qquad \iota(1)=1,
\qquad
\iota(a+b)=\iota(a)+\iota(b),
\qquad
\iota(ab)=\iota(a)\iota(b)
```

for all \(a,b\in F\).

This definition does not separately mention inverses. They are preserved automatically: if \(a\ne0\), then

```latex
\iota(a)\iota(a^{-1})
=\iota(aa^{-1})
=\iota(1)
=1.
```

Thus \(\iota(a^{-1})=\iota(a)^{-1}\).

**Definition 2 (ideal).** Let \(R\) be a commutative ring. An ideal of \(R\) is a subset \(I\subseteq R\) such that:

1. \(0\in I\);
2. if \(a,b\in I\), then \(a-b\in I\);
3. if \(r\in R\) and \(a\in I\), then \(ra\in I\).

**Definition 3 (proper and prime ideals).** An ideal \(I\) is proper if \(I\ne R\). A proper ideal \(I\) is prime if, for every \(a,b\in R\),

```latex
ab\in I
\quad\Longrightarrow\quad
a\in I\text{ or }b\in I.
```

For example, if \(p\) is a prime integer, then \(p\mathbb Z\) is a prime ideal of \(\mathbb Z\), because \(p\mid ab\) implies \(p\mid a\) or \(p\mid b\).

**Definition 4 (kernel).** The kernel of \(\iota:F\to E\) is

```latex
\ker(\iota)=\{a\in F:\iota(a)=0\}.
```

**Lemma (the kernel is an ideal).** The kernel \(\ker(\iota)\) is an ideal of \(F\).

**Proof.** Since \(\iota(0)=0\), the kernel contains \(0\). If \(a,b\in\ker(\iota)\), then \(\iota(-b)=-\iota(b)\), because

```latex
\iota(b)+\iota(-b)=\iota(b-b)=\iota(0)=0.
```

Therefore \(\iota(a-b)=\iota(a)-\iota(b)=0\), so \(a-b\in\ker(\iota)\). If \(r\in F\) and \(a\in\ker(\iota)\), then

```latex
\iota(ra)=\iota(r)\iota(a)=0,
```

so \(ra\in\ker(\iota)\). Thus all three ideal axioms hold. \(\square\)

**Lemma (the kernel is prime).** The kernel \(\ker(\iota)\) is a prime ideal of \(F\).

**Proof.** It is proper because \(\iota(1)=1\ne0\). If \(ab\in\ker(\iota)\), then

```latex
0=\iota(ab)=\iota(a)\iota(b).
```

A field has no zero divisors: if \(uv=0\) and \(u\ne0\), multiplying by \(u^{-1}\) gives \(v=0\). Hence \(\iota(a)=0\) or \(\iota(b)=0\), so \(a\in\ker(\iota)\) or \(b\in\ker(\iota)\). \(\square\)

The prime-kernel lemma explains the connection with prime ideals, but the injectivity theorem below needs only the ideal-kernel lemma and the next classification.

**Lemma (ideals of a field).** The only ideals of a field \(F\) are \(\{0\}\) and \(F\).

**Proof.** Let \(I\) be an ideal of \(F\). If \(I\) contains a nonzero element \(a\), then

```latex
1=a^{-1}a\in I.
```

Thus every \(r\in F\) satisfies \(r=r\cdot1\in I\), so \(I=F\). If \(I\) contains no nonzero element, then \(I=\{0\}\). \(\square\)

**Theorem.** Every field homomorphism \(\iota:F\to E\) is injective.

**Proof.** The ideal-kernel lemma shows that \(\ker(\iota)\) is an ideal of \(F\). The classification of ideals in a field therefore gives \(\ker(\iota)=\{0\}\) or \(\ker(\iota)=F\). The second alternative is impossible because \(1\notin\ker(\iota)\). Hence \(\ker(\iota)=\{0\}\).

If \(\iota(a)=\iota(b)\), then \(\iota(a-b)=0\), so \(a-b\in\ker(\iota)=\{0\}\). Therefore \(a=b\). \(\square\)

#### C. Abstract field extensions, intermediate fields, and adjoining

Fix a field \(F\). An **abstract field extension of \(F\)** is a pair \((E,\iota)\), where \(E\) is a field and \(\iota:F\to E\) is a field homomorphism. The chosen map is part of the data: it specifies which element of \(E\) represents each scalar of \(F\). For example, there are two embeddings

```latex
\mathbb Q(\sqrt2)\longrightarrow\mathbb C,
\qquad
\sqrt2\longmapsto\sqrt2
\quad\text{or}\quad
\sqrt2\longmapsto-\sqrt2.
```

By the preceding theorem, \(\iota\) is injective. Its image

```latex
\iota(F)=\{\iota(a):a\in F\}
```

is a subfield of \(E\). Indeed, preservation of the field operations gives closure under addition, subtraction, and multiplication; and if \(a\ne0\), then

```latex
\iota(a)\iota(a^{-1})=\iota(1)=1,
```

so the image is closed under inverses of nonzero elements. Thus \(F\) is isomorphic to \(\iota(F)\subseteq E\), and after making this identification we may write \(F\subseteq E\). Conversely, an inclusion of fields is a field homomorphism. Hence the abstract and concrete definitions agree up to identifying \(F\) with its image.

An **intermediate field** is a field \(K\) satisfying \(F\subseteq K\subseteq E\). If \(S\subseteq E\), then \(F(S)\), read “\(F\) adjoin \(S\),” is the intersection of all intermediate fields containing \(S\). It is therefore the unique smallest intermediate field containing both \(F\) and \(S\). For one element, write \(F(\alpha)\). For example,

```latex
\mathbb Q(\sqrt2)=\{a+b\sqrt2:a,b\in\mathbb Q\}.
```

An extension \(E/F\) is **algebraic** if every element of \(E\) is algebraic over \(F\).

#### D. Minimal polynomials

Let \(E/F\) be a field extension and let \(\alpha\in E\) be algebraic over \(F\). There is a unique monic irreducible polynomial \(m_{\alpha,F}\in F[X]\) satisfying

```latex
m_{\alpha,F}(\alpha)=0.
```

It is called the **minimal polynomial** of \(\alpha\) over \(F\). It divides every polynomial \(q\in F[X]\) for which \(q(\alpha)=0\). Consequently, if an irreducible polynomial \(p\in F[X]\) has \(\alpha\) as a root, then

```latex
m_{\alpha,F}=\frac{1}{\operatorname{leadingCoeff}(p)}p.
```

The coefficients of the minimal polynomial must lie in the base field. For example, \(X-\sqrt2\notin\mathbb Q[X]\), whereas \(X^2-2\in\mathbb Q[X]\) is monic, irreducible, and vanishes at \(\sqrt2\). Hence

```latex
m_{\sqrt2,\mathbb Q}(X)=X^2-2.
```

Over \(\mathbb R\), however, \(\sqrt2\) already belongs to the base field, so

```latex
m_{\sqrt2,\mathbb R}(X)=X-\sqrt2.
```

Thus the minimal polynomial depends on both the element and the chosen base field.

The **conjugates of \(\alpha\) over \(F\)** are the roots of its minimal polynomial in a field where that polynomial splits. Thus, when we later factor

```latex
\operatorname{minpoly}_F(\alpha)
=c\prod_i(X-\alpha_i),
```

the elements \(\alpha_i\) are precisely the conjugates of \(\alpha\), counted with multiplicity when a multiset is used.

#### E. Algebra structures, algebra homomorphisms, and subalgebras

For groups \(G\) and \(H\), the **direct product** \(G\times H\) is the group with coordinatewise multiplication:

```latex
(g_1,h_1)(g_2,h_2)=(g_1g_2,h_1h_2).
```

An **\(F\)-algebra structure** on a field \(E\) is the chosen field homomorphism \(\iota_E:F\to E\) that tells us how scalars from \(F\) live in \(E\). When we write an inclusion \(F\subseteq E\), this map is the inclusion.

If \(K\) and \(S\) are fields with \(F\)-algebra structures, an **\(F\)-algebra homomorphism**

```latex
f:K\longrightarrow S
```

is a field homomorphism that fixes the chosen copy of \(F\):

```latex
f(\iota_K(a))=\iota_S(a)
\qquad(a\in F).
```

Every field homomorphism is injective, so such a map is also called an \(F\)-**embedding**. An \(F\)-algebra isomorphism is a bijective \(F\)-algebra homomorphism.

An **\(F\)-subalgebra** \(A\subseteq E\) is a subset containing the image of \(F\) and closed under \(0,1\), addition, subtraction, and multiplication. Unlike an intermediate field, a subalgebra is not initially required to contain the inverse of each nonzero element. This distinction is why Appendix IV needs a theorem to promote an algebraic subalgebra to an intermediate field.

A **predicate** on a set \(S\) is a statement \(P(x)\) that is either true or false for each \(x\in S\). Equivalently, it is a function \(P:S\to\{\mathrm{true},\mathrm{false}\}\).

#### F. Integral elements and normal extensions

An element \(\alpha\in E\) is **integral over \(F\)** if it is a root of a monic polynomial in \(F[X]\). Over a field, integrality is equivalent to algebraicity: any nonzero annihilating polynomial can be divided by its leading coefficient to make it monic.

An algebraic extension \(L/F\) is **normal** if it contains all conjugate roots forced by \(F\). More precisely: whenever an irreducible polynomial \(p\in F[X]\) has one root in \(L\), then \(p\) must split completely over \(L\). Equivalently:

```latex
\text{one root of }p\text{ lies in }L
\quad\Longrightarrow\quad
\text{all roots of }p\text{ lie in }L,
```

as long as \(p\) is irreducible over the base field \(F\). The irreducibility condition matters because the roots of one irreducible polynomial are the algebraic conjugates that \(F\) cannot distinguish from one another.

The minimal polynomial is unique: for an algebraic element \(z\), there is exactly one monic irreducible polynomial in \(F[X]\) having \(z\) as a root.

**Theorem.** Every splitting field is normal over its base field.

**Proof idea.** Let \(L\) be the splitting field of \(f\in F[X]\), and let \(\Omega\) be an algebraic closure containing \(L\). Since \(L\) is generated by all roots of \(f\), any \(F\)-embedding \(L\to\Omega\) must send each root of \(f\) to another root of \(f\). But all roots of \(f\) already lie in \(L\), so the embedding sends the generators of \(L\) back into \(L\). Therefore it sends all of \(L\) back into \(L\).

Now suppose an irreducible polynomial \(q\in F[X]\) has one root \(z\in L\). The other roots of \(q\) are the possible \(F\)-conjugates of \(z\). By the embedding argument above, those conjugates also lie in \(L\). Hence \(q\) splits over \(L\), so \(L/F\) is normal.

**Where this is used later.** If \(L/F\) is normal and \(z\in L\), then the minimal polynomial of \(z\) over \(F\) splits over \(L\): that minimal polynomial is irreducible over \(F\), and it already has one root in \(L\), namely \(z\). Later, in Lemma 9, we put several elements inside a splitting field \(S\). Normality then tells us that the minimal polynomial of any element we build inside \(S\) also splits in \(S\), which lets us compare its Galois group with the larger splitting-field Galois group.

**Counterexample.** Not every algebraic extension is normal. Let \(L=\mathbb Q(\sqrt[3]{2})\). The polynomial \(X^3-2\) is irreducible over \(\mathbb Q\) and has one root \(\sqrt[3]{2}\in L\). But its other roots are

```latex
\zeta_3\sqrt[3]{2}
\quad\text{and}\quad
\zeta_3^2\sqrt[3]{2},
```

which are not real, while \(L\subseteq\mathbb R\). Thus \(X^3-2\) has one root in \(L\) but does not split over \(L\). So \(\mathbb Q(\sqrt[3]{2})/\mathbb Q\) is algebraic but not normal; it is not the splitting field of \(X^3-2\).

Now we define a bookkeeping operation called **restriction**. Suppose

```latex
F\subseteq K\subseteq L
```

and let \(\sigma:L\to L\) be an \(F\)-automorphism of the large field \(L\). To restrict \(\sigma\) to the smaller field \(K\), we want to use the same function but only on inputs from \(K\):

```latex
\sigma|_K(x)=\sigma(x)
\qquad(x\in K).
```

This is only an automorphism of \(K\) if \(\sigma\) **preserves \(K\)**, meaning \(\sigma(K)=K\). In words: elements of \(K\) must be sent back to elements of \(K\). Under that assumption, restriction gives an \(F\)-automorphism

```latex
\sigma|_K:K\longrightarrow K.
```

This is not automatic for every intermediate field. For example, inside \(\mathbb C/\mathbb Q\), complex conjugation preserves \(\mathbb Q(i)\), but an automorphism of a larger splitting field might send one chosen root to another root and thereby move a smaller field generated by that chosen root to a different subfield. In that case, the formula \(\sigma|_K\) still gives a function \(K\to L\), but not an automorphism \(K\to K\).

**Where this is used later.** Restriction lets us compare symmetries of a large splitting field with symmetries of a smaller one. Later cited theorems say that particular restriction maps are injective or surjective; those facts are special theorems, not consequences of the definition alone. The basic definition only says what the map is once preservation of the smaller field is known.

#### G. Coefficient extension, roots of unity, and multisets

Given an embedding \(i:F\to K\) and a polynomial

```latex
q(X)=\sum_j a_jX^j\in F[X],
```

its **coefficient extension** or **map to \(K\)** is

```latex
q_K(X)=\sum_j i(a_j)X^j\in K[X].
```

This is the polynomial denoted by `q.map (algebraMap F K)` in Lean.

For polynomials \(p,q\in F[X]\), the **composition** \(p\circ q\) is obtained by substituting \(q(X)\) for \(X\):

```latex
(p\circ q)(X)=p(q(X)).
```

Thus \(p(X^n)\) means \(p\circ X^n\).

For the zero polynomial, a nonzero constant polynomial, and a monomial \(X^n\), mathlib's chosen splitting field adds no new elements to the base field; the corresponding Galois group is therefore trivial. These are the base cases used later when \(n=0\) or \(a=0\).

For \(n\ge1\), an **\(n\)-th root of unity** is an element \(\zeta\) satisfying \(\zeta^n=1\). The roots of \(X^n-1\) are exactly the \(n\)-th roots of unity.

A **multiset** is a finite collection in which order is ignored but repetition is retained. Polynomial roots are represented by a multiset when multiplicity matters: for example, \((X-a)^2\) has the root multiset \(\{a,a\}\), even though its set of distinct roots is only \(\{a\}\). Products indexed by a root multiset therefore reproduce the polynomial with the correct multiplicities.

### III. Group-theoretic and splitting-field lemmas

Suppose, contrary to what we want to prove, that a root \(x\) of our quintic \(\Phi\) were given by a radical expression. That expression would not immediately tell us anything about \(\operatorname{Gal}(\Phi/\mathbb Q)\). Instead, it would produce several auxiliary fields and auxiliary polynomials—one for each radical introduced.

This section supplies the bookkeeping that lets us return from those auxiliary objects to \(\Phi\). If a large splitting field contains the roots of a smaller polynomial, its automorphisms restrict to the smaller splitting field, so solvability can pass downward. If the construction passes through an intermediate field, we can analyze the symmetries below and above that field separately and then combine them. If an auxiliary polynomial factors, we can control its factors separately and then reassemble them.

The practical effect is that later sections may replace the unknown minimal polynomial of \(x\) by larger polynomials that factor more conveniently. Once a larger polynomial has a solvable Galois group, the lemmas below carry solvability back down to the minimal polynomial of \(x\), and eventually to \(\Phi\).

::: proof-lean appendix-tower
**Cited theorem A (injective transfer).** If \(i:G\to H\) is an injective group homomorphism and \(H\) is solvable, then \(G\) is solvable.

**Cited theorem B (surjective transfer).** If \(r:G\to H\) is a surjective group homomorphism and \(G\) is solvable, then \(H\) is solvable.

**Cited theorem C (solvability along a normal field tower).** Let \(F\subseteq K\subseteq L\), with \(K/F\) normal. If

```latex
\operatorname{Aut}_F(K)
\quad\text{and}\quad
\operatorname{Aut}_K(L)
```

are solvable, then \(\operatorname{Aut}_F(L)\) is solvable.

**Cited theorem D (direct products).** If \(G\) and \(H\) are solvable groups, then \(G\times H\) is solvable.

**Cited restriction theorem for a product.** Restricting an automorphism of the splitting field of \(pq\) to the splitting fields of \(p\) and \(q\) gives an injective homomorphism

```latex
\operatorname{Gal}(pq/F)
\hookrightarrow
\operatorname{Gal}(p/F)\times\operatorname{Gal}(q/F).
```

This is `Gal.restrictProd_injective` in the Lean proof.

**Cited normal-restriction theorem.** If \(p\) splits over the splitting field \(L_q\), restriction gives a surjective homomorphism

```latex
\operatorname{Aut}_F(L_q)
\twoheadrightarrow
\operatorname{Gal}(p/F).
```

This is `AlgEquiv.restrictNormalHom_surjective` in the Lean proof.

**Cited splitting-field identification.** Under the hypotheses of Lemma 2, the splitting-field universal property gives an isomorphism

```latex
\operatorname{Aut}_K(L)
\cong
\operatorname{Gal}(q_K/K).
```

This is the isomorphism constructed from `IsSplittingField.algEquiv` in Lean.

**Lemma 1 (a polynomial that splits in a solvable splitting field).** Let \(p,q\in F[X]\). Assume \(p\) splits over the splitting field \(L_q\) of \(q\), and \(\operatorname{Gal}(q/F)\) is solvable. Then \(\operatorname{Gal}(p/F)\) is solvable.

**Proof.** The cited normal-restriction theorem gives a surjective homomorphism

```latex
\operatorname{Aut}_F(L_q)
\twoheadrightarrow
\operatorname{Gal}(p/F).
```

The domain is \(\operatorname{Gal}(q/F)\), which is solvable by assumption. Cited theorem B gives the conclusion. \(\square\)

**Lemma 2 (splitting-field tower).** Let \(p,q\in F[X]\), let \(K=L_p\) be the splitting field of \(p\), and let \(L=L_q\) be the splitting field of \(q\). Assume:

1. \(p\) splits over \(L\);
2. \(\operatorname{Gal}(p/F)=\operatorname{Aut}_F(K)\) is solvable;
3. the Galois group over \(K\) of the coefficient extension \(q_K\in K[X]\) is solvable.

Then \(\operatorname{Gal}(q/F)=\operatorname{Aut}_F(L)\) is solvable.

**Proof.** Since \(p\) splits over \(L\), the splitting-field universal property identifies \(K\) with an intermediate field of \(L/F\). The cited splitting-field identification gives an isomorphism

```latex
\operatorname{Aut}_K(L)
\cong
\operatorname{Gal}(q_K/K).
```

The group on the right is solvable by assumption. By cited theorem A, the isomorphic group \(\operatorname{Aut}_K(L)\) is solvable. The group \(\operatorname{Aut}_F(K)\) is solvable by assumption 2. Cited theorem C applied to \(F\subseteq K\subseteq L\) now proves that \(\operatorname{Aut}_F(L)\) is solvable. \(\square\)

**Lemma 3 (product).** If \(p,q\in F[X]\) have solvable Galois groups, then \(pq\) has solvable Galois group.

**Proof.** The cited restriction theorem for a product gives an injective homomorphism

```latex
\operatorname{Gal}(pq/F)
\hookrightarrow
\operatorname{Gal}(p/F)\times\operatorname{Gal}(q/F).
```

The direct product on the right is solvable by cited theorem D. Cited theorem A gives the conclusion. \(\square\)

**Finite-product corollary.** If every polynomial in a finite multiset \(p_1,\ldots,p_r\) has solvable Galois group, then \(\prod_i p_i\) has solvable Galois group.

**Proof.** Induct on the number of factors. The empty product is \(1\), whose splitting field is \(F\) and whose Galois group is trivial. The induction step is Lemma 3. \(\square\)

::: lean-explanation
The four general solvability results are `solvable_of_solvable_injective`, `solvable_of_surjective`, the `solvable_prod` instance, and `isSolvable_of_isScalarTower`. The three restriction or identification results stated on the left correspond to `Gal.restrictProd_injective`, `AlgEquiv.restrictNormalHom_surjective`, and `IsSplittingField.algEquiv`. The displayed declarations follow the same order as the mathematics: `gal_mul_isSolvable` is Lemma 3, `gal_prod_isSolvable` is the finite-product corollary, `gal_isSolvable_of_splits` is Lemma 1, and `gal_isSolvable_tower` is Lemma 2. In the tower proof, `ϕ` is exactly the cited splitting-field identification, and the final line invokes cited theorem C.
:::

### IV. Lemma: induction on the radical closure

For the definition of \(\mathcal R(F,E)\), see [Section 2.XI](#xi-solvable-by-radicals-and-the-radical-closure). In this section we use that definition to prove an induction principle for all elements of the radical closure.

There are infinitely many possible radical formulas and many ways to arrange them into towers. Following one hypothetical formula for a root of \(\Phi\) would make the argument depend on arbitrary choices. Instead, \(\mathcal R(F,E)\) collects every element that can be built from \(F\) using field operations and finitely many radical extractions.

Here is the operational picture. Begin with the elements of \(F\). At any stage, one may use the four field operations on elements already obtained, or add an element \(y\in E\) when \(y^n\) has already been obtained for some \(n\ge1\). Repeating these rules finitely many times produces exactly the elements represented by finite radical expressions. The resulting field is called the **radical closure of \(F\) inside \(E\)** and is denoted by \(\mathcal R(F,E)\).

For example, when \(F=\mathbb Q\) and \(E=\mathbb C\),

```latex
\sqrt2\in\mathcal R(\mathbb Q,\mathbb C)
\quad\text{because}\quad
(\sqrt2)^2=2\in\mathbb Q,
```

and then

```latex
\sqrt[3]{1+\sqrt2}\in\mathcal R(\mathbb Q,\mathbb C)
\quad\text{because}\quad
\left(\sqrt[3]{1+\sqrt2}\right)^3=1+\sqrt2
\in\mathcal R(\mathbb Q,\mathbb C).
```

This example also shows why the definition is recursive: a new radical may be taken from an expression that itself contains radicals.

We want to attach one certificate to every \(z\in\mathcal R(F,E)\): the Galois group of \(\operatorname{minpoly}_F(z)\) is solvable. The induction principle says that we do not need to inspect every radical formula separately. It is enough to check the ways such a formula can be constructed: start with elements of \(F\), combine previously constructed elements by field operations, and extract a new radical.

Algebraicity is essential here, not decorative. It guarantees that every \(z\in\mathcal R(F,E)\) has a minimal polynomial, so the certificate is even defined. The final effect of this section is that any property surviving those construction rules automatically holds for a hypothetical radical expression for a root of \(\Phi\), regardless of how deeply nested that expression is.

::: proof-lean appendix-solvable-by-rad
Recall from prerequisite XI that \(\mathcal R(F,E)\) is defined as the intersection of all intermediate fields \(K\) with

```latex
F\subseteq K\subseteq E
```

that are closed under extracting radicals inside \(E\). This family is nonempty because \(E\) itself has the required closure property: every \(y\) under consideration already belongs to \(E\). Equivalently, \(\mathcal R(F,E)\) is the smallest intermediate field satisfying


```latex
x^n\in K,\ n\ge1
\quad\Longrightarrow\quad
x\in K.
```

“Smallest” means that \(\mathcal R(F,E)\) contains only what every radical-closed intermediate field is forced to contain. The intersection definition is a concise, nonrecursive way to construct that field; the operational description above explains what its elements look like.

Because intersections of intermediate fields are intermediate fields, \(\mathcal R(F,E)\) contains \(F\) and is closed under addition, subtraction, multiplication, and inversion. By construction it is also closed under the displayed radical rule.

Its minimality has the following precise form.

**Radical-minimality lemma.** If \(T\) is an intermediate field with

```latex
y^n\in T,\ n\ge1\Longrightarrow y\in T,
```

then \(\mathcal R(F,E)\subseteq T\).

**Proof.** The field \(T\) is one of the members of the family whose intersection defines \(\mathcal R(F,E)\). An intersection is contained in each member of the intersected family. Hence \(\mathcal R(F,E)\subseteq T\). \(\square\)

**Lemma 4 (radical closure contains only algebraic elements).** Every element of \(\mathcal R(F,E)\) is algebraic over \(F\); see the definition in [Section 2.IX](#ix-field-extensions-and-galois-groups).

**Proof.** Let \(A\subseteq E\) be the intermediate field of elements algebraic over \(F\). We show that \(A\) is closed under radicals. Suppose \(y^n\in A\), with \(n\ge1\). Choose a nonzero polynomial \(p\in F[X]\) with

```latex
p(y^n)=0.
```

Set \(r(X)=p(X^n)\). Then \(r(y)=p(y^n)=0\). Moreover, \(r\ne0\): since \(n\ge1\), \(X^n\) is nonconstant, and the leading coefficient of \(p(X^n)\) equals the nonzero leading coefficient of \(p\). Thus \(y\) is algebraic over \(F\), so \(y\in A\). The radical-minimality lemma gives \(\mathcal R(F,E)\subseteq A\). \(\square\)

**Cited algebraic-to-integral theorem.** Over a field, an element is integral if and only if it is algebraic.

**Corollary.** Every element of \(\mathcal R(F,E)\) is integral over \(F\).

**Proof.** Apply the cited algebraic-to-integral theorem to Lemma 4. This is the imported implication `IsAlgebraic.isIntegral` used by Lean. \(\square\)

Using the definition from Appendix II.E, a predicate on \(\mathcal R(F,E)\) is a function

```latex
P:\mathcal R(F,E)\longrightarrow\{\mathrm{true},\mathrm{false}\}.
```

The assertion \(P(x)\) means that this function takes the value \(\mathrm{true}\) at \(x\).

**Lemma.** Let \(P\) be a predicate on \(\mathcal R(F,E)\). Suppose:

1. \(P(a)\) holds for every \(a\in F\);
2. for all \(x,y\in\mathcal R(F,E)\), \(P(x)\) and \(P(y)\) imply \(P(x+y)\) and \(P(xy)\);
3. for \(x\in E\) and \(n\ge1\), if \(x^n\in\mathcal R(F,E)\) and \(P(x^n)\) holds, then \(P(x)\) holds. Here \(x\in\mathcal R(F,E)\) follows from radical closure, so the conclusion is well-defined.

Then \(P(x)\) holds for every \(x\in\mathcal R(F,E)\).

**Proof.** Define

```latex
S=\{x\in\mathcal R(F,E):P(x)\}.
```

The first two assumptions make \(S\) an \(F\)-subalgebra of \(E\): it contains \(F\) and is closed under addition and multiplication; it is closed under negation because \(-x=(-1)x\) and \(-1\in F\).

By Lemma 4, every element of \(S\) is algebraic over \(F\). We now cite exactly the field-theoretic result used at this point:

**Cited theorem E (algebraic subalgebra-to-field theorem).** An \(F\)-subalgebra of a field whose elements are all algebraic over \(F\) is an intermediate field.

Applying cited theorem E promotes \(S\) to an intermediate field. The third assumption says that this intermediate field is closed under radicals. The radical-minimality lemma therefore gives

```latex
\mathcal R(F,E)\subseteq S.
```

The reverse inclusion is part of the definition of \(S\), so \(S=\mathcal R(F,E)\). Thus \(P\) holds throughout \(\mathcal R(F,E)\). \(\square\)

::: lean-explanation
`solvableByRad_le` is the radical-minimality lemma; its one-line proof is the intersection argument given on the left. `solvableByRad_le_algClosure` proves Lemma 4 with the same composed polynomial `p.comp (X ^ n)`. `isIntegral_of_mem_solvableByRad` applies the cited algebraic-to-integral theorem to obtain the corollary. `Subalgebra.IsAlgebraic.toIntermediateField` is cited theorem E. The body of `solvableByRad.induction` then follows the mathematical proof in the same order: construct `s`, promote it to `t`, prove `ht` (radical closure), and apply `solvableByRad_le`.
:::

### V. Lemma: extracting one radical

This is where a radical extraction becomes a statement about a Galois group. Consider \(x=\sqrt[3]{2+\sqrt5}\). Once the preceding stage has constructed \(x^3=2+\sqrt5\), the new element \(x\) satisfies \(X^3-(2+\sqrt5)=0\). In general, adjoining an \(n\)-th root leads to a binomial \(X^n-a\).

Any two nonzero roots of \(X^n-a\) differ by an \(n\)-th root of unity. An automorphism therefore cannot move a chosen root arbitrarily: it can only multiply it by one of those roots of unity. Lemmas 5–7 show that these possible symmetries form a solvable group even when the base field did not initially contain the required roots of unity.

For the induction, we know the minimal polynomial \(p\) of \(x^n\), rather than only the single value \(a=x^n\). If \(a_1,\ldots,a_r\) are the conjugates of \(x^n\), then \(p(X^n)=c\prod_i(X^n-a_i)\). Each factor is a binomial of the type just analyzed. The product and tower lemmas combine their solvable Galois groups, and minimal-polynomial divisibility passes the conclusion from \(p(X^n)\) down to \(\operatorname{minpoly}_F(x)\).

Thus the entire section has one concrete effect: solvability for \(x^n\) implies solvability for \(x\). This is what allows each additional radical in a formula to preserve solvability.

::: proof-lean appendix-radical-step
**Cited theorem G (automorphisms of roots of unity).** If \(a^n=1\) and \(\sigma\) is a field homomorphism, then \(\sigma(a)=a^m\) for some natural number \(m\).

**Cited abelian-to-solvable theorem.** Every abelian group is solvable. This is `isSolvable_of_comm` in Lean.

**Lemma 5.** The Galois group of \(X^n-1\) is abelian, hence solvable.

**Proof.** The case \(n=0\) is the zero polynomial, whose Galois group is trivial. Assume \(n\ge1\), and let \(a\) be any root of \(X^n-1\) in its splitting field. For every Galois automorphism \(\sigma\), cited theorem G gives an integer \(c\) such that

```latex
\sigma(a)=a^c.
```

Given \(\sigma,\tau\), choose \(c,d\) with \(\sigma(a)=a^c\) and \(\tau(a)=a^d\). Then

```latex
(\sigma\tau)(a)=(a^d)^c=a^{dc}=a^{cd}=(a^c)^d=(\tau\sigma)(a).
```

The two automorphisms agree on every root, and the roots generate the splitting field; therefore \(\sigma\tau=\tau\sigma\). Thus the Galois group is abelian, and the cited abelian-to-solvable theorem makes it solvable. \(\square\)

**Lemma 6.** Suppose \(X^n-1\) splits over a field \(K\). Then, for every \(a\in K\), the Galois group over \(K\) of \(X^n-a\) is abelian.

**Proof.** The cases \(a=0\) and \(n=0\) reduce respectively to \(X^n\) and a constant polynomial, whose Galois groups are trivial. Assume \(a\ne0\) and \(n\ge1\). Let \(b\) be a root of \(X^n-a\) in its splitting field, so \(b^n=a\) and \(b\ne0\). For an automorphism \(\sigma\),

```latex
\left(\frac{\sigma(b)}b\right)^n
=\frac{\sigma(b^n)}{b^n}
=\frac aa=1.
```

Because \(X^n-1\) splits over \(K\), this quotient lies in \(K\). Hence there is \(c_\sigma\in K\) with

```latex
\sigma(b)=b c_\sigma.
```

For \(\sigma,\tau\), both fix \(c_\sigma,c_\tau\), so

```latex
(\sigma\tau)(b)=b c_\tau c_\sigma
=b c_\sigma c_\tau=(\tau\sigma)(b).
```

Again the automorphisms agree on every root, so they commute. Thus the Galois group is abelian, and the cited abelian-to-solvable theorem makes it solvable. \(\square\)

**Lemma 7.** Let \(i:K\hookrightarrow M\) be a field embedding, let \(a\ne0\), and suppose \(X^n-a\) splits over \(M\). Then \(X^n-1\) also splits over \(M\).

**Proof.** If \(n=0\), then \(X^n-1=0\), which splits over every field; this is the first case split in the Lean proof. Now assume \(n\ge1\). Since \(X^n-i(a)\) has positive degree and splits over \(M\), it has a root \(b\in M\). The injectivity of \(i\) and the assumption \(a\ne0\) imply \(i(a)\ne0\), so \(b^n=i(a)\ne0\) and hence \(b\ne0\). If \(s\) is the multiset of all \(n\) roots of that polynomial, counted with multiplicity, then

```latex
\{c/b:c\in s\}
```

is a multiset of \(n\)-th roots of unity. Conversely, multiplying these normalized roots by \(b\) recovers every root of \(X^n-i(a)\). Comparing the monic degree-\(n\) products gives

```latex
X^n-1=\prod_{c\in s}\left(X-\frac cb\right).
```

Thus \(X^n-1\) splits over \(M\). \(\square\)

**Corollary.** For every \(a\in K\), the Galois group of \(X^n-a\) over \(K\) is solvable.

**Proof.** The case \(a=0\) is trivial. Assume \(a\ne0\). Apply Lemma 2 with

```latex
p=X^n-1,
\qquad
q=X^n-a.
```

Lemma 7 supplies assumption 1 of Lemma 2; Lemma 5 supplies assumption 2; and, over the splitting field of \(p\), Lemma 6 supplies assumption 3. Therefore \(\operatorname{Gal}(X^n-a/K)\) is solvable. \(\square\)

**Cited composition-splitting theorem.** If \(p,q\in F[X]\) and \(q\) is nonconstant, then \(p\) splits over the splitting field of \(p\circ q\). This is `Gal.splits_in_splittingField_of_comp` in Lean.

We now prove the radical step.

**Lemma 8.** Let \(x\in\mathcal R(F,E)\), let \(n\ge1\), and suppose

```latex
\operatorname{Gal}(\operatorname{minpoly}_F(x^n)/F)
\text{ is solvable}.
```

Then \(\operatorname{Gal}(\operatorname{minpoly}_F(x)/F)\) is solvable.

**Proof.** Put \(p=\operatorname{minpoly}_F(x^n)\). The polynomial \(p(X^n)\) is nonzero: \(p\ne0\), \(n\ge1\), and composition with the nonconstant monomial \(X^n\) preserves the nonzero leading coefficient.

Since

```latex
p(x^n)=0,
```

the minimal-polynomial divisibility theorem gives

```latex
\operatorname{minpoly}_F(x)\mid p(X^n).
```

Therefore Lemma 1 reduces the desired conclusion to proving that the Galois group of \(p(X^n)\) is solvable.

Let \(K\) be the splitting field of \(p\). Since \(n\ge1\), the monomial \(X^n\) is nonconstant, so the cited composition-splitting theorem says that \(p\) splits over the splitting field of \(p(X^n)\). Over \(K\), write

```latex
p(X)=c\prod_i(X-a_i).
```

After composition with \(X^n\),

```latex
p(X^n)=c\prod_i(X^n-a_i).
```

The constant factor has trivial Galois group. Each binomial factor has solvable Galois group by the corollary. The finite-product corollary after Lemma 3 therefore shows that the Galois group over \(K\) of \(p(X^n)\) is solvable; this is the call to `gal_prod_isSolvable` in Lean. The hypothesis gives solvability of \(\operatorname{Gal}(p/F)\). Lemma 2, applied to \(p\) and \(p(X^n)\), now gives solvability of \(\operatorname{Gal}(p(X^n)/F)\). Finally, Lemma 1 and the displayed divisibility give solvability of \(\operatorname{Gal}(\operatorname{minpoly}_F(x)/F)\). \(\square\)

::: lean-explanation
The right column now includes every helper proved in this mathlib file. `map_rootsOfUnity_eq_pow_self` is cited theorem G. `gal_X_pow_sub_one_isSolvable`, `gal_X_pow_sub_C_isSolvable_aux`, and `splits_X_pow_sub_one_of_X_pow_sub_C` are Lemmas 5–7. `gal_X_pow_sub_C_isSolvable` is their corollary and calls `gal_isSolvable_tower` exactly as on the left. `induction_rad` is Lemma 8: it checks nonzeroness, applies minimal-polynomial divisibility, factors `p.comp (X ^ n)`, calls `gal_prod_isSolvable` on the binomial factors, and finishes through `gal_isSolvable_tower` and `gal_isSolvable_of_splits`.
:::

### VI. Theorem: the minimal polynomial has solvable Galois group

We can now follow the way an actual radical expression is assembled. For example, \((1+\sqrt2)/\sqrt[3]{3}\) is built from rational numbers by two radical extractions and ordinary arithmetic.

Let \(P(z)\) mean that the minimal polynomial of \(z\) has a solvable Galois group. Elements already in \(F\) satisfy \(P\) because their minimal polynomials are linear, and Section V shows that extracting a radical preserves \(P\).

The remaining difficulty is arithmetic. Even if \(P(x)\) and \(P(y)\) are known, the minimal polynomial of \(x+y\) or \(xy\) is usually not visible from the two original minimal polynomials. Lemma 9 avoids computing it. It embeds the whole field \(F(x,y)\) into one splitting field containing all conjugates of both \(x\) and \(y\). Since that splitting field has a solvable Galois group, the elements formed inside \(F(x,y)\), including \(x+y\) and \(xy\), inherit the required certificate.

The induction principle from Section IV now follows the construction process itself. Its payoff for our example is immediate: if a root \(x\) of \(\Phi\) had any radical expression over \(\mathbb Q\), however complicated, then \(\operatorname{Gal}(\operatorname{minpoly}_{\mathbb Q}(x)/\mathbb Q)\) would be solvable.

::: proof-lean appendix-main-induction
**Theorem.** If \(z\in\mathcal R(F,E)\), then

```latex
\operatorname{Gal}(\operatorname{minpoly}_F(z)/F)
\text{ is solvable}.
```

**Proof.** Define a predicate \(P:\mathcal R(F,E)\to\{\mathrm{true},\mathrm{false}\}\) by

```latex
P(z):\Longleftrightarrow
\operatorname{Gal}(\operatorname{minpoly}_F(z)/F)
\text{ is solvable}.
```

We verify the three hypotheses of the radical-closure induction lemma.

First, if \(z\in F\), then \(\operatorname{minpoly}_F(z)=X-z\), whose splitting field is \(F\); hence \(P(z)\) holds.

For the addition and multiplication cases, we prove the exact auxiliary lemma used by the Lean code.

**Cited theorem F (embedding an adjoin into a splitting field).** Let \(x,y\) be algebraic over \(F\), with minimal polynomials \(p,q\). If both \(p\) and \(q\) split over \(S\), then there exists an \(F\)-algebra homomorphism

```latex
f:F(x,y)\longrightarrow S.
```

**Lemma 9.** Suppose \(P(x)\), \(P(y)\), and \(z\in F(x,y)\). Then \(P(z)\).

**Proof.** Put

```latex
p=\operatorname{minpoly}_F(x),
\qquad
q=\operatorname{minpoly}_F(y),
```

and let \(S\) be the splitting field of \(pq\). Then \(p\) and \(q\) both split in \(S\). Lemma 4 shows that \(x\) and \(y\) are algebraic, so cited theorem F gives an \(F\)-algebra homomorphism

```latex
f:F(x,y)\longrightarrow S.
```

Write \(z'=f(z)\). We claim that

```latex
\operatorname{minpoly}_F(z)=\operatorname{minpoly}_F(z').
```

Indeed, \(\operatorname{minpoly}_F(z)\) is monic and irreducible. Its value at \(z\) is zero. Applying the \(F\)-algebra homomorphism \(f\) to this equality shows that its value at \(z'=f(z)\) is also zero. The uniqueness theorem for monic irreducible polynomials annihilating an algebraic element therefore gives the claimed equality.

The extension \(S/F\) is normal. Hence the minimal polynomial of \(z'\) splits in \(S\). By \(P(x)\), \(P(y)\), and Lemma 3, the Galois group of \(pq\) is solvable. Lemma 1 now shows that the Galois group of \(\operatorname{minpoly}_F(z')\), and therefore that of \(\operatorname{minpoly}_F(z)\), is solvable. Thus \(P(z)\). \(\square\)

Now \(x+y\in F(x,y)\) and \(xy\in F(x,y)\). Applying Lemma 9 with \(z=x+y\) and \(z=xy\) proves the addition and multiplication clauses of the radical-closure induction lemma.

Finally, if \(n\ge1\) and \(P(y^n)\) holds, Lemma 8 gives \(P(y)\).

All hypotheses of the induction lemma are satisfied. Therefore \(P(z)\) holds for every \(z\in\mathcal R(F,E)\). \(\square\)

::: lean-explanation
`nonempty_algHom_adjoin_of_splits` is cited theorem F. `induction_step` is Lemma 9 and follows the same sequence: define `p` and `q`; obtain `f`; prove `key`, the equality of minimal polynomials; use normality to split the transported minimal polynomial; use `gal_mul_isSolvable`; then apply `gal_isSolvable_of_splits`. `isSolvable_gal_minpoly` performs the four induction cases in exactly the order stated on the left: base, addition, multiplication, radical.
:::

### VII. Proof of the radicals-to-Galois theorem

Section VI speaks about the minimal polynomial of the radical element, while the theorem in Section I starts with a given irreducible polynomial \(q\). These are nearly the same polynomial. Because \(q\) is irreducible and \(q(x)=0\), its monic normalization is exactly \(\operatorname{minpoly}_F(x)\). Multiplying by a nonzero constant does not change the roots, so it introduces no new splitting-field symmetries.

For our quintic there is no normalization issue: \(\Phi(X)=X^5-4X+2\) is already monic and irreducible. Hence, for any root \(x\) of \(\Phi\), we have \(\operatorname{minpoly}_{\mathbb Q}(x)=\Phi\). Section VI would therefore say directly that a radical expression for \(x\) forces \(\operatorname{Gal}(\Phi/\mathbb Q)\) to be solvable.

The proof below handles the slightly more general case in which \(q\) is not monic. It normalizes \(q\) and transfers solvability through the resulting restriction map. This is the final bridge from “the element is expressible by radicals” to “the Galois group of the original polynomial is solvable.”

::: proof-lean appendix-normalization
**Proof of the theorem in Section I.** Since \(x\) is solvable by radicals, \(x\in\mathcal R(F,E)\). The theorem of the preceding section gives

```latex
\operatorname{Gal}(\operatorname{minpoly}_F(x)/F)
\text{ is solvable}.
```

Because \(q\) is irreducible and \(q(x)=0\), the irreducible-root characterization of the minimal polynomial gives

```latex
\operatorname{minpoly}_F(x)=q\,\operatorname{lc}(q)^{-1},
```

where the scalar is regarded as a constant polynomial. Substituting this equality into the preceding solvability statement shows that

```latex
\operatorname{Gal}\bigl(q\,\operatorname{lc}(q)^{-1}/F\bigr)
```

is solvable.

The polynomial \(q\) divides \(q\,\operatorname{lc}(q)^{-1}\), with quotient the nonzero constant polynomial \(\operatorname{lc}(q)^{-1}\). The restriction theorem for splitting fields of a divisor gives a surjective homomorphism

```latex
\operatorname{Gal}\bigl(q\,\operatorname{lc}(q)^{-1}/F\bigr)
\twoheadrightarrow
\operatorname{Gal}(q/F).
```

Cited theorem B transfers solvability through this surjection. Hence \(\operatorname{Gal}(q/F)\) is solvable. \(\square\)

::: lean-explanation
`minpoly.eq_of_irreducible` is the irreducible-root characterization used in the first displayed equality. `isSolvable_gal_minpoly` supplies solvability for the normalization. `Gal.restrictDvd_surjective` is the divisor restriction theorem in the final paragraph, and `solvable_of_surjective` is cited theorem B. Thus every mathematical step on the left corresponds to one line of the displayed theorem body.
:::
