# persist.io: Addressing Digital Permanence Through Interactive Art

## James B. Pollack | MFA Digital Arts and New Media | UC Santa Cruz | 2012

---

### Abstract

*persist.io* (originally titled *bethere.io*) is an interactive virtual environment created as a graduate thesis project exploring themes of digital permanence, collective memory, and technological obsolescence. The work responds directly to concerns from art collectors who refused to purchase digital art due to fears of format decay and hardware dependency.

---

### The Artist

James B. Pollack completed his Master of Fine Arts in Digital Arts and New Media at the University of California, Santa Cruz. His practice engages with the intersection of code, philosophy, and interactive experience. *persist.io* represents his exploration of how digital artworks might outlive the technological ecosystems that birth them—a question increasingly relevant as our cultural output becomes predominantly digital.

---

### Conceptual Framework

The project emerged from a specific provocation: collectors dismissing digital art with the phrase "floppy disks, you know?" Rather than argue against this skepticism, Pollack embraced it. He designed *persist.io* to acknowledge its own eventual supersession while engineering a path to longevity through emulation.

The solution was elegant: package the entire runtime environment—operating system, browser, server, and application—as a self-contained unit. As long as more powerful computers can simulate less powerful ones, the work persists. This approach predated modern containerization technologies like Docker by several years, demonstrating conceptual foresight in addressing digital preservation.

The work incorporates the Latin phrase *"Was ihr seid, das waren wir. Was wir sind, das werdet ihr"* ("What you are, we were. What we are, you will be.")—a meditation on generational continuity drawn from medieval ossuary inscriptions. This classical memento mori tradition finds new expression in the digital realm.

---

### Technical Implementation

Built entirely in JavaScript using THREE.js for WebGL rendering, *persist.io* creates an immersive 3D environment featuring:

- **Procedural generation**: Recursive tree structures with configurable branching and dynamic particle systems
- **Spatial audio**: Distance-based gain calculation and positional panning using the Web Audio API
- **Multi-scene architecture**: Independent render contexts allowing transformation between spaces ("Above" and "Beyond")
- **GLSL shaders**: Custom Simplex noise implementations for terrain and animated visual effects
- **Character systems**: MD2-based animation with full state machines for avatar control
- **Collective persistence**: Server-side storage of visitor contributions, incorporating user desires into the evolving artwork

---

### Participatory Element

Visitors encounter the prompt: "What do you want from life, ultimately?" Their responses are stored and displayed within the environment, transforming passive viewers into active contributors. The accumulated desires of all visitors become part of the work's persistent memory—a collective archive that grows over time, embodying the very permanence the project seeks to achieve.

---

### Significance

*persist.io* succeeds as both technical demonstration and philosophical inquiry. It addresses a genuine problem in digital art markets while creating an aesthetically and conceptually rich experience. The work's continued functionality over a decade after its creation validates its central thesis: thoughtful engineering combined with clear conceptual vision can produce digital art that endures.

Released under Creative Commons Attribution-ShareAlike 3.0, the project invites others to fork, modify, and extend the work—ensuring its ideas propagate beyond any single implementation.

---

*persist.io is available at [GitHub](https://github.com) under open-source license.*
