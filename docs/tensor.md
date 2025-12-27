
# Tensor Model for the Radial AI Map

## 1) Why a tensor (and not a table)

A single table collapses multiple independent dimensions into one schema.
This map needs **orthogonality**:

* **Domain** (where a tool operates)
* **Time/Maturity** (when it becomes relevant)
* **Function/Intent** (what kind of cognitive/work act it supports)
* **Evidence/Usage** (how strongly it projects into a domain)
* **Risk/Constraint** (how brittle or regulated the domain/tool context is)

A tensor keeps these dimensions independent and composable.

---

## 2) Core objects

Let:

* Tools: ( \mathcal{T} = {t_1,\dots,t_{n}} )
* Domains (sectors): ( \mathcal{D} = {d_1,\dots,d_{m}} )
* Time bins (rings): ( \mathcal{Y} = {y_1,\dots,y_{k}} ) (e.g., 2018, 2020, 2022, 2024)
* Work/Intent types: ( \mathcal{I} = {i_1,\dots,i_{p}} )
  (examples: summarize, draft, analyze, automate, tutor, code, forecast, audit, etc.)
* Evidence channels: ( \mathcal{E} = {e_1,\dots,e_{q}} )
  (examples: actual usage logs, interviews, curated expert rating, adoption reports, your own practice)

---

## 3) The main tensor

# Tensor Model — Mathematical Definition (Markdown-Safe)


## 1. Sets and indices

```math
\mathcal{T} = \{t_1,\dots,t_n\} \quad \text{(AI tools)}
```

```math
\mathcal{D} = \{d_1,\dots,d_m\} \quad \text{(domains / sectors)}
```

```math
\mathcal{Y} = \{y_1,\dots,y_k\} \quad \text{(time bins)}
```

```math
\mathcal{I} = \{i_1,\dots,i_p\} \quad \text{(intent / work type)}
```

```math
\mathcal{E} = \{e_1,\dots,e_q\} \quad \text{(evidence channels)}
```

---

## 2. Core tensor

```math
\mathbf{X} \in \mathbb{R}^{n \times m \times k \times p \times q}
```

```math
X_{t,d,y,i,e} \ge 0
```

**Interpretation**

```math
X_{t,d,y,i,e}
\;\;=\;\;
\text{strength of evidence that tool } t
\text{ is used in domain } d
\text{ at time } y
\text{ for intent } i
\text{ under evidence } e
```

---

## 3. Domain projection (angular position)

Aggregate across time, intent, and evidence:

```math
v_t(d) = \sum_{y \in \mathcal{Y}}
         \sum_{i \in \mathcal{I}}
         \sum_{e \in \mathcal{E}}
         X_{t,d,y,i,e}
```

Normalize:

```math
\hat{v}_t(d) =
\frac{v_t(d)}{\sum_{d' \in \mathcal{D}} v_t(d')}
```

---

## 4. Angular coordinate (sector angle)

Assign each domain a fixed angle ( \theta_d \in [0, 2\pi) ).

```math
\theta(t) =
\operatorname{atan2}
\left(
\sum_{d} \hat{v}_t(d)\sin\theta_d,\;
\sum_{d} \hat{v}_t(d)\cos\theta_d
\right)
```

This yields the **angular position** of tool ( t ).

---

## 5. Time distribution (ring placement)

```math
u_t(y) =
\sum_{d \in \mathcal{D}}
\sum_{i \in \mathcal{I}}
\sum_{e \in \mathcal{E}}
X_{t,d,y,i,e}
```

Normalize:

```math
\hat{u}_t(y) =
\frac{u_t(y)}{\sum_{y' \in \mathcal{Y}} u_t(y')}
```

Expected maturity year:

```math
\mu_y(t) = \sum_{y \in \mathcal{Y}} \hat{u}_t(y)\, y
```

---

## 6. Radial coordinate (generality vs specialization)

Compute domain entropy:

```math
H(t) =
- \sum_{d \in \mathcal{D}}
  \hat{v}_t(d)\log \hat{v}_t(d)
```

Normalize entropy:

```math
H_n(t) =
\frac{H(t)}{\log |\mathcal{D}|}
\quad \in [0,1]
```

Map entropy to radius:

```math
r(t) =
r_{\min}
+
\left(1 - H_n(t)\right)
\left(r_{\max} - r_{\min}\right)
```

* High entropy → small radius (central, transversal)
* Low entropy → large radius (specialized, peripheral)

---

## 7. Trajectories (edges)

Domain projection strength:

```math
P(t \rightarrow d) =
\sum_{y,i,e} X_{t,d,y,i,e}
```

An edge is drawn if:

```math
P(t \rightarrow d) \ge \lambda
```

or if ( d ) is among the top-(K) values of ( \hat{v}_t(d) ).

---

## 8. Optional: risk-weighted projection

Let ( R_{d,i} ) be domain-intent risk.

```math
X'_{t,d,y,i,e}
=
X_{t,d,y,i,e}
\left(1 + \alpha R_{d,i}\right)
```

Use ( X' ) in place of ( X ) for risk-aware visualization.

---

# 🧩 Plain-Text Fallback (no MathJax)

If LaTeX is unavailable:

```
X[t,d,y,i,e] = evidence-weighted strength that tool t
               is used in domain d, at time y,
               for intent i, under evidence channel e

Angle(t)    = circular mean of domain weights v_t(d)
Radius(t)   = 1 − normalized entropy of v_t(d)
Ring(t)     = expected or dominant year y
Edge(t→d)   = sum_y,i,e X[t,d,y,i,e] ≥ threshold
```

---

## One-line summary for the README

> We model the AI landscape as a tensor X[t,d,y,i,e]; the radial map visualizes its marginals: domain distribution → angle, entropy → radius, time distribution → ring, and projection mass → edges.

---

If you want next:

* I can **wrap this in a single collapsible README section**
* or give you a **minimal MathJax header snippet** for GitHub Pages
* or translate this into **typed pseudocode** before Python

Just say the word.
