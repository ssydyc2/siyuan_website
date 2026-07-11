# Why Degree Five Breaks the Formula

## Abel–Ruffini backwards, with Lean at every step

There is a sentence about equations that is repeated so often that it is easy to repeat it incorrectly:

**“Equations of degree five or more do not have solutions.”**

That sentence is false. Every nonconstant polynomial with complex coefficients has a complex root, and in fact splits completely over \(\mathbb C\). What fails at degree five is not the existence of roots. What fails is the existence of a formula that obtains every root from the coefficients using only finitely many additions, subtractions, multiplications, divisions, and radicals.

This article proves a precise counterexample theorem:

```latex
\forall n \ge 5,\ \exists P_n \in \mathbb{Q}[X],\quad
\deg P_n=n
\quad\text{and}\quad
\exists \alpha\in\mathbb C,
\ P_n(\alpha)=0,
\ \alpha\text{ is not solvable by radicals over }\mathbb Q.
```

The presentation runs in the opposite direction from a textbook. We begin with that conclusion, inspect what Lean needs in order to accept it, and repeatedly ask: **what earlier fact makes this line possible?** Only after seeing the target do we descend through the Galois group, solvable groups, irreducibility, root counting, and the elementary algebra underneath them.

The Lean code is not decorative pseudocode. Every panel on the right is extracted directly from the companion file compiled with Lean 4.31.0 and mathlib 4.31.0. The mathematical column explains the same declaration at the level of an algebra reader who is learning Lean.

## Contents

- [Part I: What actually fails at degree five?](#part-i-what-actually-fails-at-degree-five)
- [Part II: Prerequisites in mathematics and Lean](#part-ii-prerequisites-in-mathematics-and-lean)
- [Part III: Read the proof backwards](#part-iii-read-the-proof-backwards)
- [The dependency chain forward](#the-dependency-chain-forward)
- [What has and has not been formalized](#what-has-and-has-not-been-formalized)

---

## Part I: What actually fails at degree five?

### Three different meanings of solve

For a polynomial equation, “solve” can mean at least three things.

1. **Existence:** does a root exist in a chosen field? The equation \(X^2+1=0\) has no root in \(\mathbb R\), but it has roots \(\pm i\) in \(\mathbb C\).
2. **Approximation:** can we compute roots numerically to arbitrary precision? For ordinary polynomials the answer is yes; numerical root finding does not stop at degree five.
3. **Expression by radicals:** can each root be built from the coefficients using field operations and repeated extraction of \(m\)-th roots? This is the meaning in Abel–Ruffini.

The Fundamental Theorem of Algebra settles the first question over \(\mathbb C\). Abel–Ruffini gives a negative answer to the third question for the general equation of degree at least five. There is no contradiction because a number may exist, be approximable, and still have no radical expression.

### The hard quintic

The entire proof will pivot around one polynomial:

```latex
\Phi(X)=X^5-4X+2\in\mathbb Q[X].
```

It has five complex roots. The strong fact is that **none of those roots is solvable by radicals over \(\mathbb Q\)**. Once we have one such root \(\alpha\), the extension to every degree \(n\ge5\) is simple:

```latex
P_n(X)=X^{n-5}\Phi(X).
```

The factor \(X^{n-5}\) adds zero roots but does not remove the roots of \(\Phi\). Thus \(P_n\) has degree \(n\) and still has the hard root \(\alpha\).

### The reverse dependency ladder

Starting at the theorem and walking downward, the questions are:

1. Why does padding the quintic produce every degree \(n\ge5\)?
2. Why does \(X^5-4X+2\) have a root not obtainable by radicals?
3. Why would a radical expression force its Galois group to be solvable?
4. Why is its Galois group the full symmetric group \(S_5\)?
5. Why is \(S_5\) not solvable?
6. Why is the polynomial irreducible, and why does it have the required distribution of real and complex roots?

Part III answers those questions in exactly that order. First, however, we need a compact dictionary between the mathematical nouns and their Lean types.

---

## Part II: Prerequisites in mathematics and Lean

### Groups, rings, fields, and type classes

A **group** is a set with an associative multiplication, an identity, and inverses. A **commutative ring** has addition, subtraction, and multiplication with the usual compatibility laws. A **field** is a commutative ring in which every nonzero element has a multiplicative inverse.

Lean separates the carrier type from the structure placed on it. In `[Field F]`, the square brackets ask type-class inference to supply a field structure on the type `F`. A theorem written for an arbitrary `F : Type*` with `[Field F]` therefore works for \(\mathbb Q\), \(\mathbb R\), finite fields, and many other fields without repeating their axioms.

::: proof-lean algebra-interfaces
`Type*` means a type living in some universe whose level Lean should infer. `Polynomial R` is available once `R` is at least a semiring; the notation `R[X]` is a readable synonym. `Algebra R A` says that `A` contains a compatible image of `R`. The expression `Polynomial.aeval x p` evaluates `p : R[X]` at `x : A` through that algebra structure.

The declarations ending in `: Prop` are propositions, not data. Thus `Irreducible p` and `p.Separable` are statements that can be assumed or proved.
:::

### Polynomials, roots, and irreducibility

For a field \(F\), a polynomial \(p\in F[X]\) is **irreducible** if it is nonzero, not a unit, and cannot be factored into two nonunits. If \(p\) is irreducible and \(\alpha\) is a root, then \(p\) is, up to normalization, the minimal polynomial of \(\alpha\) over \(F\).

A polynomial is **separable** if its roots in a splitting field are distinct. Every irreducible polynomial over \(\mathbb Q\) is separable because \(\mathbb Q\) has characteristic zero.

Lean writes a root condition as `(aeval x) p = 0`. Parentheses are optional in many places, so `aeval x p = 0` means the same thing. The type of `x` determines the codomain of evaluation.

### Field extensions and Galois groups

If \(E/F\) is a field extension and \(p\in F[X]\), a **splitting field** contains every root of \(p\) and is generated by those roots. The **Galois group** consists of the automorphisms of the splitting field that fix \(F\). Every such automorphism permutes the roots, producing a homomorphism from the Galois group to a symmetric group.

For a separable polynomial the action is faithful. If the action is also surjective, the Galois group realizes every permutation of the roots and is isomorphic to the full symmetric group.

### Commutators, derived series, and solvable groups

For elements \(g,h\) of a group, their commutator measures failure to commute. The commutator subgroup \([G,G]\) is generated by all commutators. Iterating gives the derived series

```latex
G^{(0)}=G,
\qquad
G^{(k+1)}=[G^{(k)},G^{(k)}].
```

The group is **solvable** if some term of this series is the trivial subgroup. Abelian groups are solvable immediately because their first commutator subgroup is trivial. Solvability is preserved by subgroups, quotients, and in particular by surjective homomorphic images.

::: proof-lean galois-interfaces
`Polynomial.Gal p` is mathlib's Galois group attached to `p`. The homomorphism `galActionHom p E` sends a Galois automorphism to its permutation of `p.rootSet E`.

`derivedSeries G` is a function from natural numbers to subgroups of `G`. `IsSolvable G : Prop` asserts that this sequence eventually becomes bottom, the trivial subgroup. Finally, `solvableByRad F E` is an `IntermediateField F E`; membership `x ∈ solvableByRad F E` is the formal statement that `x` can be built by radicals over `F` inside `E`.
:::

### What solvable by radicals means

Begin with a base field \(F\). We may perform arithmetic inside it. We may then adjoin an element \(\beta\) whose positive integer power \(\beta^m\) already belongs to the field constructed so far. Repeating this finitely many times gives a **radical tower**. An element is solvable by radicals if it lies in some such construction, allowing the necessary roots of unity.

The bridge to group theory is the deep direction used here:

**If an irreducible polynomial has a root solvable by radicals, then its Galois group is solvable.**

The reason is structural. After roots of unity are present, adjoining one radical produces a cyclic, hence abelian, Galois layer. A tower of radical adjunctions therefore produces a tower whose successive Galois quotients are abelian. That is precisely the normal-series characterization of a solvable group.

### Four Lean proof idioms used below

- `by` opens tactic mode; indented lines transform the current goal.
- `have h : P := ...` records an intermediate proposition. Lean can often infer `P`, giving `have h := ...`.
- `obtain ⟨x, hx⟩ := h` eliminates an existential statement and names its witness and proof.
- `refine ⟨..., ?_, ...⟩` constructs a conjunction or existential result while leaving `_`-marked goals for subsequent lines.

The centered dot `·` begins a branch when one tactic creates several goals. The placeholder `·` appearing as an argument, as in `f · h`, is different: it is function-section syntax and means “insert the missing argument here.”

---

## Part III: Read the proof backwards

### Step 0: the final theorem

We start at the end. The theorem does not claim that every degree-\(n\) polynomial is hard. It claims that for each \(n\ge5\) there exists at least one counterexample.

::: proof-lean final-theorem
Fix a natural number \(n\) with \(5\le n\). We must produce a polynomial `p`, prove its natural degree is `n`, then produce a complex root `x`, prove the root equation, and prove non-membership in the radical subfield.

The nested existential statement mirrors that checklist exactly. `obtain` extracts the hard quintic root. `refine` supplies the padded polynomial, the degree theorem, the root, and the non-radical proof. Only the evaluation goal remains. Because polynomial evaluation respects multiplication, `simp` reduces it to the already-known equation \(\Phi(x)=0\).
:::

This compact proof is possible only because the preceding declarations have already packaged every difficult point. We now walk to those declarations.

### Step 1: manufacture degree n from degree five

::: proof-lean degree-n-construction
Define \(P_n=X^{n-5}\Phi\). Both factors are monic, so their product is monic and in particular nonzero. The natural degree of a product of nonzero polynomials is the sum of their natural degrees:

```latex
\operatorname{natDegree}(P_n)
=(n-5)+5=n.
```

The last equality is not true for arbitrary `n`: natural-number subtraction truncates at zero. That is exactly why the hypothesis `hn : 5 ≤ n` is passed to `Nat.sub_add_cancel hn`.

In Lean, `monic_X.pow (n - 5)` proves that the first factor is monic, while `monic_Phi 4 2` proves the same for the quintic. The explicit nonzero proofs passed to `natDegree_mul` prevent the zero-polynomial exception.
:::

The construction need not be irreducible for \(n>5\). It only needs to retain one root that no radical formula can express. If one wanted an irreducible hard example in every degree, that would be a stronger and substantially different theorem.

### Step 2: preserve the hard root

::: proof-lean root-preservation
The Fundamental Theorem of Algebra enters through `IsAlgClosed.splits`: over \(\mathbb C\), the quintic splits. A positive-degree polynomial that splits has a root, so Lean obtains `x` and an evaluation equation over \(\mathbb C\).

The polynomial was defined over \(\mathbb Q\), so `map_Phi` and `eval_map` transport the equation across `algebraMap ℚ ℂ`. The final component invokes the specialized theorem that this root is not in `solvableByRad ℚ ℂ`.
:::

Notice the logical shape: algebraic closure proves that a root **does** exist; Galois theory proves that the same root **cannot** be expressed by radicals. These are complementary statements, not competing ones.

### Step 3: specialize the hard quintic

::: proof-lean concrete-quintic
The general family is \(X^5-aX+b\). We choose \(a=4\), \(b=2\), and the Eisenstein prime \(p=2\). The remaining hypotheses are finite arithmetic facts:

- \(2<4\), needed by the real-root argument;
- \(2\) is prime;
- \(2\mid4\) and \(2\mid2\);
- \(2^2\nmid2\).

The tactic `decide` proves each because these propositions are decidable and concrete. The combinator `<;>` applies it to every goal created by `apply`.
:::

So what is the general theorem being specialized?

### Step 4: the Galois obstruction

::: proof-lean radical-contradiction
Assume `x` is a root of an irreducible member \(X^5-aX+b\). Suppose, for contradiction, that `x` is solvable by radicals.

1. `isSolvable_gal_of_irreducible` turns that assumption, irreducibility, and the root equation into solvability of the polynomial's Galois group.
2. `gal_Phi` says the Galois action on the five roots is bijective, so in particular it is surjective onto their full permutation group.
3. `solvable_of_surjective` transfers solvability through that surjection.
4. `Equiv.Perm.not_solvable` says a symmetric group on at least five objects is not solvable.

The tactic `mt` is modus tollens: from `A → B` it produces `¬B → ¬A`. Here it converts “radical root implies solvable Galois group” into “non-solvable Galois group implies non-radical root.” The cardinality calculation at the end identifies the root set as a five-element type.
:::

This is the conceptual heart of Abel–Ruffini. A radical formula can create only solvable symmetry, while the roots of this quintic exhibit all of \(S_5\), a symmetry group too complicated to be solvable.

### Step 5: inspect the imported bridges

::: proof-lean library-bridge
These are the four library results on which the short contradiction rests.

- The first is the radicals-to-solvable-Galois bridge. Its first argument is membership in the intermediate field `solvableByRad F E`.
- The second recognizes a full Galois action for an irreducible prime-degree rational polynomial whose real and complex root counts differ by one to three.
- The third says a surjective image of a solvable group is solvable.
- The fourth says the permutation group of any type with cardinality at least five is not solvable.

`#check` asks Lean to print an expression's inferred type. It changes no theorem; it is a precise way to inspect the contract that later code must satisfy.
:::

Mathlib proves the first bridge by induction through the operations that generate `solvableByRad`. The radical case adjoins roots of unity, studies the Galois group of \(X^m-c\), and passes solvability through a field tower. Mathlib proves the non-solvability of permutation groups beginning with an explicit nontrivial element that remains in every term of the derived series of `Perm (Fin 5)`, then embeds that group into larger permutation groups.

Those developments are deep reusable libraries. Our companion calls them by their public theorem statements, while rebuilding every lemma specific to the polynomial \(X^5-4X+2\).

### Step 6: why the Galois group is S5

::: proof-lean full-galois-group
The theorem `galActionHom_bijective_of_prime_degree'` asks for four facts:

1. the polynomial is irreducible;
2. its natural degree is prime;
3. the complex root count is at least one larger than the real root count;
4. the complex root count is at most three larger than the real root count.

For our family, the degree is five and `decide` proves that five is prime. Separability plus algebraic closure gives five distinct complex roots. The next lemmas show that the number of real roots lies between two and three. Hence the difference between complex and real root counts lies between two and three, exactly the range required by the prime-degree Galois criterion.

`Bijective` packages injectivity and surjectivity. The contradiction in Step 4 uses `.2`, the surjective half.
:::

Why does this criterion force all of \(S_5\)? Irreducibility makes the Galois action transitive. Prime degree strongly restricts transitive subgroups. A small number of nonreal roots supplies a transposition through complex conjugation. The resulting transitive subgroup contains enough cycles and a transposition to be the full symmetric group.

### Step 7: count all complex roots

::: proof-lean complex-root-count
For a separable polynomial that splits, the number of distinct roots equals its natural degree. The field \(\mathbb C\) is algebraically closed, so every polynomial over it splits. `card_rootSet_eq_natDegree` therefore gives the root count, and `natDegree_Phi` replaces the degree by five.

The hypothesis is written explicitly as `h : (Φ ℚ a b).Separable`. Later it is supplied by `h_irred.separable`, using the fact that irreducible polynomials over \(\mathbb Q\) are separable.
:::

This is the formal location of the Fundamental Theorem of Algebra in the Galois-group calculation.

### Step 8: at most three real roots

::: proof-lean real-root-upper-bound
If a real polynomial has \(r\) distinct roots, Rolle's theorem implies that its derivative has at least \(r-1\) distinct roots. Applying this twice to

```latex
f(X)=X^5-aX+b
```

reduces the problem to the second derivative \(20X^3\), whose real root set is the singleton \(\{0\}\). Therefore the first derivative has at most two distinct real roots and \(f\) has at most three.

The proof maps the integer-coefficient expression into \(\mathbb Q[X]\), differentiates through `card_rootSet_le_derivative`, and finishes the monomial root-set computation with normalization. The scoped attribute line changes simplification behavior only inside this theorem.
:::

This bound is uniform in \(a,b\); the lower bound needs the inequality \(b<a\).

### Step 9: exhibit two real roots

::: proof-lean real-root-existence
Let \(f(x)=x^5-ax+b\), with natural numbers \(b<a\). We know \(f(0)=b\ge0\). The proof splits according to the sign of \(f(1)=1-a+b\).

- If \(f(1)<0\), the intermediate value theorem gives one zero between \(0\) and \(1\). It also shows \(f(a)\ge0\), giving a second zero between \(1\) and \(a\).
- If \(f(1)\not<0\), the integrality and inequality \(b<a\) force \(b=a-1\), so \(f(1)=0\). A separate estimate shows \(f(-a)\le0\), while \(f(0)\ge0\), producing another zero at or left of zero.

The intervals are chosen half-open in the first branch so the two witnesses cannot coincide. Lean records this as `x ≠ y`. Continuity comes from polynomial evaluation, and `linarith`, `nlinarith`, and `ring` discharge the ordered-ring algebra.
:::

The auxiliary lemma returns two actual witnesses. The next lemma converts them into a cardinality statement.

::: proof-lean real-root-lower-bound
Because the polynomial is monic, it is nonzero. The two witnesses define a two-element finite set contained in the polynomial's real root set. Inclusion gives an embedding, and an embedding gives a cardinality inequality. The hypothesis `x ≠ y` proves that the finite set really has cardinality two.

This separation between “construct roots” and “count roots” is typical of formal proofs: each change of representation is made explicit.
:::

Combining Steps 8 and 9 gives two or three real roots. Since there are five distinct complex roots, there are two or three nonreal roots at the level needed by the library's prime-degree criterion. Complex conjugate pairing rules out an odd number in the concrete situation, but the criterion only needs the stated inequalities.

### Step 10: prove irreducibility by Eisenstein

::: proof-lean eisenstein
Eisenstein's criterion says that an integer polynomial is irreducible over \(\mathbb Q\) if some prime \(p\):

1. does not divide the leading coefficient;
2. divides every other coefficient;
3. has \(p^2\) not dividing the constant coefficient.

For \(X^5-aX+b\), the assumptions `p ∣ a`, `p ∣ b`, and `¬p^2 ∣ b` give exactly those conditions. The zero coefficients are automatically divisible by `p`, and a prime cannot divide the leading coefficient one.

The proof first moves to \(\mathbb Z[X]\), applies mathlib's ideal-valued Eisenstein criterion, checks coefficients by a finite `interval_cases`, then transfers irreducibility back to \(\mathbb Q[X]\). `all_goals` supplies monicity-derived primitiveness to the remaining transfer goals.
:::

For the concrete values \(a=4,b=2,p=2\), all hypotheses hold. This is why the apparently arbitrary polynomial \(X^5-4X+2\) is such an efficient witness.

### Step 11: verify the polynomial bookkeeping

::: proof-lean polynomial-bookkeeping
Before Eisenstein or root counting can run, Lean needs the elementary facts that are often left implicit on paper:

- mapping coefficients across a ring homomorphism preserves the shape of \(\Phi\);
- the constant coefficient is \(b\);
- the coefficient of \(X^5\) is one;
- the degree and natural degree are five;
- the leading coefficient is one, so the polynomial is monic and nonzero.

The generic parameters `R`, `a`, and `b` make these lemmas reusable over integers, rationals, reals, and complex numbers. `WithBot ℕ` in the ordinary degree accommodates the degree of the zero polynomial; `natDegree` instead returns a natural number.
:::

At the very bottom sits the definition that all those simplifiers unfold.

::: proof-lean hard-quintic
`noncomputable` permits classical choices that may occur downstream; it does not mean the displayed polynomial cannot be evaluated. The notation `C r` embeds a scalar as a constant polynomial, and `X` is the polynomial variable.

The parameters are natural numbers but are coerced into `R`. Specializing `R = ℚ`, `a = 4`, and `b = 2` gives exactly \(X^5-4X+2\).
:::

### Step 12: recover the algebraic counterexample

::: proof-lean quintic-hard-root
The archived form of Abel–Ruffini packages the quintic result as the existence of an algebraic complex number not solvable by radicals. Algebraic closure supplies a root `x`; the polynomial itself witnesses `IsAlgebraic ℚ x`; monicity proves that witness is nonzero; and `not_solvable_by_rad'` supplies the obstruction.

Our stronger final theorem keeps the root equation visible, then pads the same polynomial to every degree at least five.
:::

---

## The dependency chain forward

We read the proof backwards, but Lean checks declarations in a forward order. Reassembled from foundations to conclusion, the argument is:

1. Define \(\Phi_{a,b}=X^5-aX+b\) and prove it is monic of degree five.
2. Apply Eisenstein to make \(\Phi_{4,2}\) irreducible over \(\mathbb Q\).
3. Use Rolle's theorem twice to show at most three real roots.
4. Use sign changes and the intermediate value theorem to show at least two real roots.
5. Use separability and algebraic closure to obtain five distinct complex roots.
6. Apply the prime-degree criterion to identify the Galois action with the full permutation group of five roots.
7. Use the fact that \(S_5\) is not solvable.
8. Use “radical root implies solvable Galois group” contrapositively to show every root of \(\Phi_{4,2}\) is not solvable by radicals.
9. Choose one complex root and multiply \(\Phi_{4,2}\) by \(X^{n-5}\) to obtain a counterexample in every degree \(n\ge5\).

The threshold five is therefore a group-theoretic threshold. The symmetric groups \(S_2,S_3,S_4\) are solvable; \(S_5\) is not. Classical quadratic, cubic, and quartic formulas are possible because their generic Galois groups remain on the solvable side of that boundary.

## What has and has not been formalized

The compiled theorem in this article is an explicit existential statement about polynomials and radical elements. It proves that every degree at least five has a counterexample. That is enough to refute any proposed radical procedure claimed to solve **all** rational polynomials of that degree.

We have not defined a programming language of symbolic formulas and then proved that no program in that syntax is universal. Such a formalization would be a different metamathematical project. Mathlib instead formalizes the invariant used by the classical proof: membership in a radical extension forces solvability of the Galois group, while this explicit quintic has non-solvable Galois group.

The polynomial still has five complex roots. They can be approximated numerically. What does not exist is a construction of those roots from rational numbers by a finite tower of arithmetic operations and radicals.

## Lean reading notes

- Read theorem signatures before tactic bodies. The signature is the mathematical contract.
- Follow named hypotheses such as `h_irred`, `hx`, and `hab`; their names are a map of the paper proof.
- When a one-line tactic looks magical, inspect the theorem supplied to it with `#check` and read its hypotheses as a checklist.
- Distinguish mathematical compression from formal omission. A short final proof can be rigorous because earlier declarations have isolated every obligation.

## Sources

- [Mathlib: Construction of an algebraic number that is not solvable by radicals](https://leanprover-community.github.io/mathlib4_docs/Archive/Wiedijk100Theorems/AbelRuffini.html)
- [Mathlib: The Abel–Ruffini theorem and solvability by radicals](https://leanprover-community.github.io/mathlib4_docs/Mathlib/FieldTheory/AbelRuffini.html)
- [Mathlib: Polynomial Galois groups](https://leanprover-community.github.io/mathlib4_docs/Mathlib/FieldTheory/PolynomialGaloisGroup.html)
- [Mathlib: Solvable groups and permutation groups](https://leanprover-community.github.io/mathlib4_docs/Mathlib/GroupTheory/Solvable.html)
- The adapted companion code retains Thomas Browning's attribution and is distributed under mathlib's Apache-2.0 license.
