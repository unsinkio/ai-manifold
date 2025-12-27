# Tensor Formalization of the Radial AI Map

This section defines the radial map as a **tensor-based model**.
The visualization is a projection of tensor marginals; it is not the model itself.

---

## 1) Index Sets (Core Objects)

Let the following sets define the model space.

```math
\mathcal{T} = \{ t_1, \dots, t_n \}
```

**AI tools**
Individual AI systems or products.

---

```math
\mathcal{D} = \{ d_1, \dots, d_m \}
```

**Domains (sectors)**
Fields of human activity (e.g., Education, Productivity, Sales, Finance, etc.).

---

```math
\mathcal{Y} = \{ y_1, \dots, y_k \}
```

**Time bins (rings)**
Discrete periods representing emergence or consolidation
(e.g., 2018, 2020, 2022, 2024).

---

```math
\mathcal{I} = \{ i_1, \dots, i_p \}
```

**Work / Intent types**
Cognitive or operational actions (e.g., summarize, draft, analyze, automate, tutor, code, audit).

---

```math
\mathcal{E} = \{ e_1, \dots, e_q \}
```

**Evidence channels**
Sources supporting observed usage (e.g., logs, interviews, expert ratings, reports).

---

## 2) Core Tensor Definition

The AI landscape is represented as a **five-dimensional tensor**:

```math
\mathbf{X} \in \mathbb{R}^{n \times m \times k \times p \times q}
```

with elements:

```math
X_{t,d,y,i,e} \ge 0
```

### Interpretation

```math
X_{t,d,y,i,e}
```

denotes the **evidence-weighted strength** that:

* tool ( t \in \mathcal{T} )
* is used in domain ( d \in \mathcal{D} )
* at time ( y \in \mathcal{Y} )
* for intent ( i \in \mathcal{I} )
* supported by evidence channel ( e \in \mathcal{E} )

This tensor is the **only source of truth**.
All geometry is derived from it.

---

## 3) Domain Projection (Angular Structure)

Aggregate the tensor over time, intent, and evidence:

```math
v_t(d)
=
\sum_{y \in \mathcal{Y}}
\sum_{i \in \mathcal{I}}
\sum_{e \in \mathcal{E}}
X_{t,d,y,i,e}
```

Normalize to obtain a domain distribution:

```math
\hat{v}_t(d)
=
\frac{v_t(d)}{\sum_{d' \in \mathcal{D}} v_t(d')}
```

---

## 4) Angular Coordinate (Sector Position)

Assign each domain a fixed angular coordinate:

```math
\theta_d \in [0, 2\pi)
```

The angular position of tool ( t ) is the circular mean:

```math
\theta(t)
=
\operatorname{atan2}
\left(
\sum_{d \in \mathcal{D}} \hat{v}_t(d)\sin\theta_d,\;
\sum_{d \in \mathcal{D}} \hat{v}_t(d)\cos\theta_d
\right)
```

**Meaning**
The angle represents the **dominant domain orientation** of the tool.

---

## 5) Time Projection (Ring Structure)

Aggregate the tensor over domains, intents, and evidence:

```math
u_t(y)
=
\sum_{d \in \mathcal{D}}
\sum_{i \in \mathcal{I}}
\sum_{e \in \mathcal{E}}
X_{t,d,y,i,e}
```

Normalize:

```math
\hat{u}_t(y)
=
\frac{u_t(y)}{\sum_{y' \in \mathcal{Y}} u_t(y')}
```

Define the expected maturity time:

```math
\mu_y(t)
=
\sum_{y \in \mathcal{Y}} \hat{u}_t(y)\, y
```

This value determines the **radial ring** (time bin) in the visualization.

---

## 6) Radial Coordinate (Generality vs. Specialization)

Compute the entropy of the domain distribution:

```math
H(t)
=
-
\sum_{d \in \mathcal{D}}
\hat{v}_t(d)\log \hat{v}_t(d)
```

Normalize entropy:

```math
H_n(t)
=
\frac{H(t)}{\log |\mathcal{D}|}
\quad \in [0,1]
```

Map entropy to radial distance:

```math
r(t)
=
r_{\min}
+
\left(1 - H_n(t)\right)
\left(r_{\max} - r_{\min}\right)
```

### Interpretation

* High entropy → small radius → **transversal / central tool**
* Low entropy → large radius → **specialized / peripheral tool**

---

## 7) Trajectories (Edges)

Define projection strength from tool ( t ) into domain ( d ):

```math
P(t \rightarrow d)
=
\sum_{y \in \mathcal{Y}}
\sum_{i \in \mathcal{I}}
\sum_{e \in \mathcal{E}}
X_{t,d,y,i,e}
```

A trajectory (edge) is drawn if:

```math
P(t \rightarrow d) \ge \lambda
```

or if ( d ) is among the top-(K) values of ( \hat{v}_t(d) ).

**Edges represent usage trajectories, not dependencies.**

---

## 8) Optional Extension: Risk-Weighted Tensor

Let:

```math
R_{d,i} \ge 0
```

represent the **risk or constraint intensity** of performing intent ( i ) in domain ( d ).

Define a risk-weighted tensor:

```math
X'_{t,d,y,i,e}
=
X_{t,d,y,i,e}
\left(1 + \alpha R_{d,i}\right)
```

Using ( \mathbf{X}' ) emphasizes domains where usage is cognitively or institutionally fragile.

---

## 9) Visualization Principle

The radial map is a projection of tensor marginals:

| Visual element | Tensor quantity                        |
| -------------- | -------------------------------------- |
| Angle          | domain distribution ( \hat{v}_t(d) )   |
| Radius         | entropy ( H_n(t) )                     |
| Ring           | time expectation ( \mu_y(t) )          |
| Edge           | projection mass ( P(t \rightarrow d) ) |

---

## 10) Core Statement

```math
\text{The model is the tensor } \mathbf{X}.
\text{ The map is a projection.}
```

The visualization does not rank tools.
It preserves **orthogonality between domain, time, intent, and evidence**, enabling navigation without epistemic collapse.

