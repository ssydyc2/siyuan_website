/-
Copyright (c) 2021 Thomas Browning. All rights reserved.
Released under Apache 2.0 license as described in the file LICENSE.
Authors: Thomas Browning
-/
import Mathlib.Analysis.Calculus.LocalExtr.Polynomial
import Mathlib.Analysis.Complex.Polynomial.Basic
import Mathlib.FieldTheory.AbelRuffini
import Mathlib.RingTheory.Polynomial.Eisenstein.Criterion
import Mathlib.RingTheory.Int.Basic
import Mathlib.RingTheory.RootsOfUnity.Minpoly

/-!
# Construction of an algebraic number that is not solvable by radicals

The main ingredients are:

* `isSolvable_gal_of_irreducible` in `Mathlib/FieldTheory/AbelRuffini.lean`:
  an irreducible polynomial with an `IsSolvableByRad` root has solvable Galois group.
* `galActionHom_bijective_of_prime_degree'` in `Mathlib/FieldTheory/PolynomialGaloisGroup.lean` :
  an irreducible polynomial of prime degree with 1-3 non-real roots has full Galois group.
* `Equiv.Perm.not_solvable` in `Mathlib/GroupTheory/Solvable.lean` : the symmetric group is not
  solvable.

Then all that remains is the construction of a specific polynomial satisfying the conditions of
`galActionHom_bijective_of_prime_degree'`, which is done in this file.
-/

namespace AbelRuffiniBackwards

open Function Polynomial Polynomial.Gal Ideal

attribute [local instance] splits_ℚ_ℂ

-- region algebra-interfaces
#check Semigroup
#check Monoid
#check CommMonoid
#check Group
#check CommGroup
#check Ring
#check CommRing
#check Field
#check Polynomial
#check Algebra
#check Polynomial.aeval
#check Irreducible
#check Polynomial.Separable
-- endregion algebra-interfaces

-- region galois-interfaces
#check Polynomial.Gal
#check Polynomial.Gal.galActionHom
#check derivedSeries
#check IsSolvable
#check solvableByRad
-- endregion galois-interfaces

-- region library-bridge
#check isSolvable_gal_of_irreducible
#check galActionHom_bijective_of_prime_degree'
#check solvable_of_surjective
#check Equiv.Perm.not_solvable
-- endregion library-bridge

-- region hard-quintic
/-- The concrete quintic used in the Abel–Ruffini counterexample. -/
noncomputable def Φ : ℚ[X] :=
  X ^ 5 - C 4 * X + C 2
-- endregion hard-quintic

theorem hardQuintic_degree : Φ.degree = ((5 : ℕ) : WithBot ℕ) := by
  suffices degree (X ^ 5 - C (4 : ℚ) * X) = ((5 : ℕ) : WithBot ℕ) by
    rwa [Φ, degree_add_eq_left_of_degree_lt]
    convert! (degree_C_le (R := ℚ)).trans_lt (WithBot.coe_lt_coe.mpr (show 0 < 5 by simp))
  rw [degree_sub_eq_left_of_degree_lt] <;> rw [degree_X_pow]
  exact (degree_C_mul_X_le (4 : ℚ)).trans_lt (WithBot.coe_lt_coe.mpr (show 1 < 5 by simp))

-- region polynomial-bookkeeping
@[simp]
theorem hardQuintic_natDegree : Φ.natDegree = 5 :=
  natDegree_eq_of_degree_eq_some hardQuintic_degree

theorem hardQuintic_monic : Φ.Monic := by
  show Φ.leadingCoeff = 1
  rw [Polynomial.leadingCoeff, hardQuintic_natDegree]
  simp [Φ]
-- endregion polynomial-bookkeeping

-- region eisenstein
private noncomputable def Φℤ : ℤ[X] :=
  X ^ 5 - C 4 * X + C 2

private theorem Φℤ_degree : Φℤ.degree = ((5 : ℕ) : WithBot ℕ) := by
  suffices degree (X ^ 5 - C (4 : ℤ) * X) = ((5 : ℕ) : WithBot ℕ) by
    rwa [Φℤ, degree_add_eq_left_of_degree_lt]
    convert! (degree_C_le (R := ℤ)).trans_lt (WithBot.coe_lt_coe.mpr (show 0 < 5 by simp))
  rw [degree_sub_eq_left_of_degree_lt] <;> rw [degree_X_pow]
  exact (degree_C_mul_X_le (4 : ℤ)).trans_lt (WithBot.coe_lt_coe.mpr (show 1 < 5 by simp))

private theorem Φℤ_monic : Φℤ.Monic := by
  show Φℤ.leadingCoeff = 1
  rw [Polynomial.leadingCoeff, natDegree_eq_of_degree_eq_some Φℤ_degree]
  norm_num [Φℤ, coeff_X_pow, coeff_X]

private theorem hardQuintic_irreducible_aux : Irreducible Φ := by
  have hmap : Φℤ.map (Int.castRingHom ℚ) = Φ := by
    simp [Φℤ]
    rw [Φ, ← C_ofNat (R := ℚ) 4, ← C_ofNat (R := ℚ) 2]
  rw [← hmap, ← IsPrimitive.Int.irreducible_iff_irreducible_map_cast]
  on_goal 1 =>
    apply irreducible_of_eisenstein_criterion (P := span ({2} : Set ℤ))
    · rw [span_singleton_prime (by norm_num), Int.prime_iff_natAbs_prime]
      decide
    · rw [Φℤ_monic.leadingCoeff, mem_span_singleton]
      norm_num
    · intro n hn
      rw [Φℤ_degree] at hn
      norm_cast at hn
      interval_cases n <;>
        norm_num [Φℤ, coeff_X_pow, mem_span_singleton, dvd_mul_of_dvd_left]
    · norm_num [Φℤ_degree]
    · norm_num [Φℤ, span_singleton_pow, mem_span_singleton]
  all_goals exact Φℤ_monic.isPrimitive

theorem hardQuintic_irreducible : Irreducible Φ :=
  hardQuintic_irreducible_aux
-- endregion eisenstein

-- region real-root-existence
theorem hardQuintic_has_two_real_roots :
    ∃ x y : ℝ, x ≠ y ∧ aeval x Φ = 0 ∧ aeval y Φ = 0 := by
  let f : ℝ → ℝ := fun x => aeval x Φ
  have hf : f = fun x : ℝ => x ^ 5 - 4 * x + 2 := by simp [f, Φ]
  have hc : ∀ s : Set ℝ, ContinuousOn f s := fun s => Φ.continuousOn_aeval
  have hf0 : 0 < f 0 := by norm_num [hf]
  have hf1 : f 1 < 0 := by norm_num [hf]
  have hf2 : 0 < f 2 := by norm_num [hf]
  obtain ⟨x, ⟨-, hx1⟩, hx2⟩ :=
    intermediate_value_Ico' zero_le_one (hc _) (Set.mem_Ioc.mpr ⟨hf1, hf0.le⟩)
  obtain ⟨y, ⟨hy1, -⟩, hy2⟩ :=
    intermediate_value_Ioc one_le_two (hc _) (Set.mem_Ioc.mpr ⟨hf1, hf2.le⟩)
  exact ⟨x, y, (hx1.trans hy1).ne, hx2, hy2⟩
-- endregion real-root-existence

-- region real-root-lower-bound
theorem hardQuintic_real_roots_ge : 2 ≤ Fintype.card (Φ.rootSet ℝ) := by
  obtain ⟨x, y, hxy, hx, hy⟩ := hardQuintic_has_two_real_roots
  have key : ↑({x, y} : Finset ℝ) ⊆ Φ.rootSet ℝ := by
    simp [Set.insert_subset, mem_rootSet_of_ne hardQuintic_monic.ne_zero, hx, hy]
  convert! Fintype.card_le_of_embedding (Set.embeddingOfSubset _ _ key)
  simp only [Finset.coe_sort_coe, Fintype.card_coe, Finset.card_singleton,
    Finset.card_insert_of_notMem (mt Finset.mem_singleton.mp hxy)]
-- endregion real-root-lower-bound

-- region real-root-upper-bound
attribute [local simp] map_ofNat in
theorem hardQuintic_real_roots_le : Fintype.card (Φ.rootSet ℝ) ≤ 3 := by
  rw [Φ, ← one_mul (X ^ 5), ← C_1]
  apply (card_rootSet_le_derivative _).trans
    (Nat.succ_le_succ ((card_rootSet_le_derivative _).trans (Nat.succ_le_succ _)))
  suffices (Polynomial.rootSet (C (20 : ℚ) * X ^ 3) ℝ).Subsingleton by
    norm_num [Fintype.card_le_one_iff_subsingleton, ← mul_assoc] at *
    exact this
  rw [rootSet_C_mul_X_pow] <;> norm_num
-- endregion real-root-upper-bound

-- region complex-root-count
theorem hardQuintic_complex_roots : Fintype.card (Φ.rootSet ℂ) = 5 :=
  (card_rootSet_eq_natDegree hardQuintic_irreducible.separable
    (IsAlgClosed.splits _)).trans hardQuintic_natDegree
-- endregion complex-root-count

-- region full-galois-group
theorem hardQuintic_galoisAction_bijective : Bijective (galActionHom Φ ℂ) := by
  apply galActionHom_bijective_of_prime_degree' hardQuintic_irreducible
  · rw [hardQuintic_natDegree]; decide
  · rw [hardQuintic_complex_roots, Nat.succ_le_succ_iff]
    exact hardQuintic_real_roots_le.trans (Nat.le_succ 3)
  · rw [hardQuintic_complex_roots, Nat.succ_le_succ_iff]
    have := hardQuintic_real_roots_ge
    omega
-- endregion full-galois-group

-- region radical-contradiction
theorem not_solvable_by_rad' (x : ℂ) (hx : aeval x Φ = 0) : x ∉ solvableByRad ℚ ℂ := by
  apply mt (isSolvable_gal_of_irreducible · hardQuintic_irreducible hx)
  intro h
  refine Equiv.Perm.not_solvable _ (le_of_eq ?_)
    (solvable_of_surjective hardQuintic_galoisAction_bijective.2)
  rw_mod_cast [Cardinal.mk_fintype, hardQuintic_complex_roots]
-- endregion radical-contradiction

/-- **Abel-Ruffini Theorem** -/
-- region quintic-hard-root
theorem exists_not_solvable_by_rad : ∃ x : ℂ, IsAlgebraic ℚ x ∧ x ∉ solvableByRad ℚ ℂ := by
  obtain ⟨x, hx⟩ := IsAlgClosed.exists_aeval_eq_zero ℂ Φ (by
    rw [hardQuintic_degree]
    norm_num)
  exact ⟨x, ⟨Φ, hardQuintic_monic.ne_zero, hx⟩, not_solvable_by_rad' x hx⟩
-- endregion quintic-hard-root

-- region degree-n-construction
/-- Pad the hard quintic with zero roots to obtain a polynomial of any degree at least five. -/
noncomputable def hardPolynomial (n : ℕ) : ℚ[X] :=
  X ^ (n - 5) * Φ

theorem hardPolynomial_monic (n : ℕ) : (hardPolynomial n).Monic := by
  exact (monic_X.pow (n - 5)).mul hardQuintic_monic

theorem hardPolynomial_natDegree (n : ℕ) (hn : 5 ≤ n) :
    (hardPolynomial n).natDegree = n := by
  rw [hardPolynomial,
    natDegree_mul (monic_X.pow (n - 5)).ne_zero hardQuintic_monic.ne_zero,
    natDegree_pow, natDegree_X,
    hardQuintic_natDegree, mul_one, Nat.sub_add_cancel hn]
-- endregion degree-n-construction

-- region root-preservation
theorem quintic_has_hard_root :
    ∃ x : ℂ, aeval x Φ = 0 ∧ x ∉ solvableByRad ℚ ℂ := by
  obtain ⟨x, hx⟩ := IsAlgClosed.exists_aeval_eq_zero ℂ Φ (by
    rw [hardQuintic_degree]
    norm_num)
  exact ⟨x, hx, not_solvable_by_rad' x hx⟩
-- endregion root-preservation

-- region final-theorem
/-- For every degree at least five, some rational polynomial has a complex root
that cannot be obtained from rational numbers by arithmetic and radicals. -/
theorem exists_degree_not_solvable_by_rad (n : ℕ) (hn : 5 ≤ n) :
    ∃ p : ℚ[X], p.natDegree = n ∧
      ∃ x : ℂ, aeval x p = 0 ∧ x ∉ solvableByRad ℚ ℂ := by
  obtain ⟨x, hx, hxrad⟩ := quintic_has_hard_root
  refine ⟨hardPolynomial n, hardPolynomial_natDegree n hn, x, ?_, hxrad⟩
  simp [hardPolynomial, hx]
-- endregion final-theorem

end AbelRuffiniBackwards
