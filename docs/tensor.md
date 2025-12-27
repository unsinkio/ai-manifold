
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

Define a 5D tensor:

[
\mathbf{X} \in \mathbb{R}^{n \times m \times k \times p \times q}
]

Where:

[
X_{t,d,y,i,e} \ge 0
]

**Meaning:** “Evidence-weighted strength that tool (t) is used in domain (d), at time (y), for intent (i), supported by evidence channel (e).”

This is your ground truth substrate.

---

## 4) Aggregations that produce the map

### 4.1 Sector placement (angular position)

We need a domain distribution per tool:

[
\mathbf{v}*t(d) = \sum*{y,i,e} X_{t,d,y,i,e}
]

Normalize:

[
\hat{\mathbf{v}}_t = \frac{\mathbf{v}*t}{\sum*{d}\mathbf{v}_t(d)}
]

**Interpretation:** the tool’s domain “mass function” across sectors.

To convert to an angle, assign each domain (d) a fixed sector angle (\theta_d) (e.g., equally spaced). Then compute a circular mean:

[
\theta(t) = \text{atan2}\left(\sum_d \hat{v}_t(d)\sin\theta_d,\ \sum_d \hat{v}_t(d)\cos\theta_d\right)
]

This yields the **tool’s angular position**.

---

### 4.2 Ring placement (time / maturity)

Compute a time distribution:

[
u_t(y) = \sum_{d,i,e} X_{t,d,y,i,e}
\quad,\quad
\hat{u}_t = \frac{u_t}{\sum_y u_t(y)}
]

Then choose a maturity statistic. Two good options:

**Expected maturity year:**
[
\mu_y(t) = \sum_y \hat{u}_t(y)\cdot y
]

**Or “latest strong year”** (more robust if you want “current positioning”):
[
y^*(t) = \max{y: \hat{u}_t(y)\ge \tau}
]

This determines which ring (2018/2020/2022/2024) the tool sits in.

---

### 4.3 Radial distance (generality vs specialization)

Your map’s center/outward meaning can be formalized as **domain entropy**.

Compute entropy of domain distribution:

[
H(t) = -\sum_d \hat{v}_t(d)\log \hat{v}_t(d)
]

Normalize:

[
H_n(t) = \frac{H(t)}{\log m}
\quad \in [0,1]
]

* (H_n(t)\approx 1): spread across many domains → **general / central**
* (H_n(t)\approx 0): concentrated in one domain → **specialized / peripheral**

Define radius:

[
r(t)= r_{\min} + (1 - H_n(t))\cdot (r_{\max}-r_{\min})
]

So:

* **High entropy ⇒ small radius (near center)**
* **Low entropy ⇒ large radius (toward domain arcs)**

This is the cleanest formal definition of “center = transversal.”

---

## 5) Lines as trajectories (not dependencies)

A “line” from tool (t) to domain (d) exists if the aggregated projection exceeds a threshold:

[
P(t\rightarrow d) = \sum_{y,i,e} X_{t,d,y,i,e}
]

Draw edge (t\to d) if:
[
P(t\rightarrow d)\ge \lambda
]
or if (d) is in the top-(K) domains of (\mathbf{v}_t).

**Line weight** can be proportional to (P(t\to d)) (for thickness), or to a normalized share (\hat{v}_t(d)).

If you want directionality that reflects “tool originates central but specializes outward,” you can define:

* centrality score (C(t)=1-H_n(t))
* draw arrows toward domains where (\hat{v}_t(d)) is high and domain risk is high (see below)

---

## 6) Optional: add “risk” as a second tensor

A domain often imposes constraints (auditability, privacy, regulation, brittleness).

Define:

[
\mathbf{R} \in \mathbb{R}^{m \times p}
]

Where (R_{d,i}) is “risk/constraint intensity” of doing intent (i) inside domain (d).

Then the **effective projection** becomes:

[
X'*{t,d,y,i,e} = X*{t,d,y,i,e}\cdot (1+\alpha R_{d,i})
]

This makes your visualization show not just “where it is used,” but “where it matters / becomes brittle.”

---

## 7) Heat maps and “color energy”

You mentioned a thermal notion. With the tensor, it’s trivial:

**Domain heat at time (y):**
[
\text{Heat}(d,y)=\sum_{t,i,e} X_{t,d,y,i,e}
]

**Tool heat (overall):**
[
\text{Heat}(t)=\sum_{d,y,i,e} X_{t,d,y,i,e}
]

**Intent heat within a domain:**
[
\text{Heat}(d,i)=\sum_{t,y,e} X_{t,d,y,i,e}
]

This lets you:

* color arcs by adoption intensity (domain heat),
* color tools by total usage,
* color connections by intent-weighted load.

---

## 8) Minimal JSON schema (implementable)

```json
{
  "tools": ["Notion AI", "GoHighLevel AI", "Cengage MindTap AI", "Fathom AI"],
  "domains": ["Education", "Productivity", "Sales", "Finance", "Engineering", "Design", "Research", "Health"],
  "years": [2018, 2020, 2022, 2024],
  "intents": ["draft", "summarize", "analyze", "automate", "teach", "code", "audit"],
  "evidence": ["self_report", "usage_logs", "expert_rating"],
  "tensor_entries": [
    {
      "tool": "Notion AI",
      "domain": "Productivity",
      "year": 2024,
      "intent": "draft",
      "evidence": "self_report",
      "value": 0.82
    }
  ]
}
```

From this you can build (X) sparsely and compute (\theta(t)), (r(t)), ring (y^*(t)), and edges.

---

## 9) Interpretation guardrails (to avoid collapse)

To preserve the philosophy of the map:

* **Do not treat edges as integrations.** They are *projection trajectories*.
* **Do not treat rings as “better.”** They are *time bins*.
* **Do not treat center as “best.”** Center means *general + higher responsibility*.
* **Keep domain and intent orthogonal.** The same tool can “teach” in Education and “audit” in Finance without conflating the two.

---

## 10) One-line definition for the repo

> We model the AI landscape as a tensor (X_{t,d,y,i,e}) capturing tool–domain–time–intent relationships under multiple evidence channels; the radial map is a visualization of tensor marginals (domain distribution → angle, entropy → radius, time distribution → ring, projection mass → edges).

