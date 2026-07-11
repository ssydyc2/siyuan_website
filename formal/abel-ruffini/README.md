# Abel–Ruffini Lean companion

This Lean 4.31.0 project is the compiled source for the proof panels in the blog post
“Why Degree Five Breaks the Formula.”

```bash
lake update
lake build
```

The explicit quintic construction is adapted from mathlib's
`Archive.Wiedijk100Theorems.AbelRuffini`, copyright Thomas Browning and released under
Apache-2.0. The `hardPolynomial` construction and the theorem for every degree `n ≥ 5`
are additions for this article.
