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

Good catch — you’ve hit **two real Markdown/MathJax pain points**:

1. **Mixed prose + inline math breaks rendering**
2. The **conceptual justification (“why a tensor”) must live *outside* math blocks**

Below is a **corrected, normalized version** that:

* Renders **cleanly in GitHub-compatible MathJax**
* Avoids inline-math fragmentation
* Restores a **formal “Why a tensor (not a table)” section**
* Keeps the document stylistically consistent

You can paste this **directly over the problematic section**.

---

## 2) Core Tensor Definition

```math
\mathbf{X} \in \mathbb{R}^{n \times m \times k \times p \times q}
```

```math
X_{t,d,y,i,e} \ge 0
```

### Interpretation

```math
X_{t,d,y,i,e}
```

denotes the **evidence-weighted strength** of the following statement:
- tool 
```math
t \in \mathcal{T} \quad \text{(tool)}
```
- is used in domain 
```math
d \in \mathcal{D} \quad \text{(domain)}
```
- at time 
```math
y \in \mathcal{Y} \quad \text{(time)}
```
- for intent 
```math
i \in \mathcal{I} \quad \text{(intent)}
```
- supported by evidence channel 
```math
e \in \mathcal{E} \quad \text{(evidence channel)}
```

> **Rendering rule**
> Explanatory text is kept outside math blocks.
> Math blocks define symbols; prose binds them to meaning.

---

## 3) Why a Tensor (and Not a Table)

A flat table forces **implicit coupling** between independent dimensions.

### The table problem

A typical table requires columns like:

```
Tool | Domain | Year | Intent | Evidence | Score
```

This structure assumes:

* a single dominant domain per row
* a single intent per observation
* a single time context
* a single evidence source

To represent reality, you must duplicate rows, average values, or collapse distinctions.

This causes **category collapse**.

---

### The tensor solution

A tensor preserves **orthogonality**:

| Dimension | Meaning                         |
| --------- | ------------------------------- |
| ( t )     | *What system exists*            |
| ( d )     | *Where it operates*             |
| ( y )     | *When it matters*               |
| ( i )     | *What kind of work it performs* |
| ( e )     | *Why we believe this is true*   |

No dimension dominates another.
No aggregation is forced prematurely.

---

### Formal advantage

With a tensor:

* Domains can be summed **without erasing time**
* Time can be analyzed **without collapsing intent**
* Evidence can be weighted **without redefining usage**
* Geometry emerges from **marginals**, not assumptions

Formally:

```math
\text{Visualization} = \text{projection of tensor marginals}
```

not

```math
\text{Visualization} = \text{direct encoding of rows}
```

---

### Conceptual advantage

A table answers:

> *What is this tool?*

A tensor allows you to ask:

> *How does this tool behave across contexts, time, and intent?*

That distinction is **the point of the map**.

---

## 4) Design Constraint (Non-Negotiable)

> **Domain, time, intent, and evidence must remain orthogonal.**

Any representation that violates this:

* collapses navigation into classification
* turns exploration into ranking
* destroys transferability across domains

The tensor prevents this by construction.

---

## 5) One-line summary 

> We use a tensor instead of a table to preserve orthogonality between domain, time, intent, and evidence; the radial map is a geometric projection of tensor marginals, not a categorical listing.


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

