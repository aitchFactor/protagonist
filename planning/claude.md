Two separate problems worth untangling:

---

## The State Machine Structure

Your instinct that "states similar but differing only by transition effect" is a smell is correct. The fix is to make **transitions first-class citizens** rather than burying their logic inside states.

Instead of:
```
state → big if block → determines animation based on state + previous state + custom code
```

Think of it as a **transition table**:
```
(from_state, to_state) → transition_effect
```

Each state object/struct gets:
- `can_enter(context)` — the guard condition
- `on_enter(from_state)` — what fires when you arrive
- `on_exit(to_state)` — what fires when you leave

And separately, a transition map holds the *between-state* effects (animations, sounds, whatever). This lets many states share identical internal logic while having unique transition behavior, without duplicating anything.

A minimal sketch:
```python
transitions = {
    (StateA, StateB): play_animation_X,
    (StateA, StateC): play_animation_Y,
    (StateB, StateC): play_animation_Z,
}

def transition_to(new_state):
    current.on_exit(new_state)
    effect = transitions.get((type(current), type(new_state)))
    if effect: effect()
    new_state.on_enter(current)
    current = new_state
```

If you find many `(from, to)` pairs share the same effect, you can group them — key by `to_state` only, or use a fallback chain.

---

## Cooldowns

Cooldowns are **orthogonal to your state machine** — treat them that way. They shouldn't live inside state logic; they should be a separate named-timer registry that states and transitions can read and write.

```python
cooldowns = {
    "dash": 0.0,
    "heavy_attack": 0.0,
    "parry": 0.0,
}
```

Then your state/transition logic just declares its relationship to cooldowns:

- **Guard condition**: `can_enter` checks `cooldowns["dash"] <= 0`
- **On enter**: resets or starts specific cooldowns
- **Transition effect**: might reset some cooldowns but not others

The flexibility you want comes from the fact that cooldown interactions are just data or small callables attached to states and transitions. A state doesn't need to know about every cooldown — only the ones it cares about. States that reset *some* cooldowns just explicitly name those ones.

```python
class DashState:
    required_cooldowns = ["dash"]  # must be ready to enter
    resets_on_enter = ["dash"]     # starts the cooldown timer on use
    # parry cooldown untouched
```

The cooldown manager ticks independently every frame. States query it; they don't own it.

---

## The Root Principle

Your current pain comes from state logic, transition logic, and cooldown logic all being tangled together. Separate them into three distinct layers with clean interfaces between them, and each becomes manageable on its own. The complexity doesn't disappear, but it stops compounding.