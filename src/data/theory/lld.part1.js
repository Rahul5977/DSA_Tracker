// Low-Level System Design — Part 1 (Days 1-5): foundations.
// OOP relationships, UML, SOLID, core design principles, and the machine-coding
// interview playbook. Diagram-driven content for placement LLD/machine-coding
// rounds. Schema mirrors the theory modules consumed by ./index.js:
// each day = { focus, concepts: [...] }.

export const DAYS = [
  {
    focus: 'OOP for Design & Object Relationships',
    concepts: [
      {
        id: 'lld-oop-for-design',
        topic: 'Applying OOP to Design (Abstraction, Encapsulation, Inheritance, Polymorphism)',
        summary: 'The four OOP pillars are the vocabulary you use to turn requirements into a clean class model.',
        explanation:
          'Low-level design is the act of translating a fuzzy requirement ("build a parking lot system") into a precise set of classes, their data, their behaviour, and how they collaborate. Object-oriented programming gives you the four building blocks for that translation: abstraction, encapsulation, inheritance, and polymorphism. In an LLD interview you are not graded on knowing the definitions but on using them to produce a model that is easy to extend and hard to break.\n\nAbstraction means exposing only what a caller needs and hiding the rest. A PaymentGateway exposes pay(amount) and refund(txnId); the caller never sees the HTTP retries or the encryption inside. Good abstraction is about picking the right interface — the smallest, most stable set of operations a client depends on. Encapsulation is the mechanism that protects an abstraction: you make fields private and expose behaviour through methods so that invariants (e.g. balance can never go negative) are enforced in one place rather than scattered across callers.\n\nInheritance models an IS-A relationship and lets a subclass reuse and specialise a base type. It is powerful but dangerous: it creates the tightest coupling in OOP because the subclass depends on the parent internals. Polymorphism is the payoff of good abstraction and inheritance — a caller holds a reference of the base/interface type and the correct overridden method runs at runtime (dynamic dispatch). This is what lets you add a new Shape or a new NotificationChannel without touching the code that uses them.\n\nIn practice an LLD answer is mostly abstraction plus encapsulation, with polymorphism used at the seams where behaviour varies, and inheritance used sparingly. A common rookie mistake is to reach for deep inheritance trees; senior candidates reach for small interfaces and composition. Keep the pillars in mind as a checklist: Is each class hiding its data? Does each class expose a clean, minimal interface? Where does behaviour vary, and have I made that a polymorphic seam?',
        diagram: `Four OOP pillars mapped to design intent

  ┌──────────────┐   exposes only what callers need
  │ ABSTRACTION  │── PaymentGateway.pay() / .refund()
  └──────────────┘   (hide retries, crypto, sockets)

  ┌──────────────┐   private state + methods guard
  │ENCAPSULATION │── Account{ -balance; +withdraw() }
  └──────────────┘   invariant: balance >= 0 in ONE place

  ┌──────────────┐   IS-A reuse + specialise (tight!)
  │ INHERITANCE  │── SavingsAccount ▷ Account
  └──────────────┘

  ┌──────────────┐   one call, many runtime behaviours
  │POLYMORPHISM  │── Shape s; s.area()  ◄ dynamic dispatch
  └──────────────┘    Circle / Rectangle override area()`,
        keyPoints: [
          'Abstraction = pick the smallest stable interface a client depends on',
          'Encapsulation = private fields + methods so invariants live in one place',
          'Inheritance models IS-A but is the tightest coupling — use sparingly',
          'Polymorphism (dynamic dispatch) is the seam for behaviour that varies',
          'A strong LLD model is mostly abstraction + encapsulation + composition',
        ],
        videos: [
          { label: 'Concept && Coding — LLD Playlist (OOP basics)', url: 'https://www.youtube.com/playlist?list=PL6W8uoQQ2c61X_9e6Net0WdYZidm7zooW' },
          { label: 'Gaurav Sen — Channel', url: 'https://www.youtube.com/channel/UCRPMAqdtSgd0Ipeef7iFsKw' },
        ],
        links: [
          { label: 'refactoring.guru — OOP basics', url: 'https://refactoring.guru/design-patterns/what-is-pattern' },
          { label: 'GeeksforGeeks — OOP concepts', url: 'https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/' },
        ],
        interview: [
          { q: 'What is the difference between abstraction and encapsulation?', a: 'Abstraction is a design concern — exposing only the relevant operations and hiding the rest (the "what"). Encapsulation is the implementation mechanism — bundling data with the methods that operate on it and restricting direct access via private fields (the "how it is protected"). Abstraction decides the interface; encapsulation enforces it.' },
          { q: 'What is polymorphism and how does the runtime pick the method?', a: 'Polymorphism lets one interface refer to many concrete types; with method overriding the JVM/runtime uses dynamic dispatch (a vtable lookup) to call the actual object\'s method at runtime rather than the declared type\'s. This decouples callers from concrete classes.' },
          { q: 'Why is inheritance considered the tightest form of coupling?', a: 'A subclass depends on the parent\'s implementation details and protected members, not just its public contract. A change in the parent can silently break subclasses (the fragile base class problem), so inheritance binds two classes more tightly than composition does.' },
          { q: 'How do the OOP pillars help in an LLD interview?', a: 'They are a checklist for turning requirements into classes: abstraction picks interfaces, encapsulation hides state and protects invariants, polymorphism marks where behaviour varies, and inheritance models true IS-A. A good model is mostly abstraction + encapsulation with polymorphic seams.' },
          { q: 'Give an example where polymorphism removes an if-else chain.', a: 'Instead of switch(shape.type) computing area, define an abstract Shape.area() and let Circle/Rectangle override it. Adding a Triangle means adding one class, not editing the switch — this also satisfies the Open/Closed principle.' },
        ],
      },
      {
        id: 'lld-has-a-relationships',
        topic: 'HAS-A Relationships: Association vs Aggregation vs Composition vs Dependency',
        summary: 'Four flavours of "one object uses/owns another", ranked by how strong the ownership is.',
        explanation:
          'When one class holds or uses another, that is a HAS-A relationship, and interviewers love to test whether you can distinguish its four strengths. From weakest to strongest they are: dependency, association, aggregation, and composition. The distinction is about lifetime ownership and how tightly the objects are bound, and UML draws each with a different arrow.\n\nA dependency is the weakest: class A uses class B transiently, usually as a method parameter, local variable, or return type, but does not keep a reference. Example: Order.calculateTax(TaxCalculator calc) — Order depends on TaxCalculator only for the duration of the call. UML draws it as a dashed arrow. An association is stronger: A keeps a long-lived reference to B as a field, but neither owns the other and they have independent lifetimes. Example: a Teacher object has a reference to Student objects and vice versa. UML draws a solid line (with optional direction arrow and multiplicity).\n\nAggregation is a "whole-part" association where the whole holds parts but does not own their lifecycle — the parts can exist independently and can be shared. Example: a Department aggregates Professors; deleting the Department does not delete the Professors, and a Professor could belong to another Department. UML draws a hollow diamond ◇ on the whole side. Composition is the strongest whole-part: the part cannot exist without the whole and is exclusively owned, so when the whole is destroyed its parts are destroyed too. Example: a House composes Rooms — destroy the House and the Rooms cease to exist; a Room belongs to exactly one House. UML draws a filled diamond ◆ on the whole side.\n\nThe practical test in an interview: ask "if the container is destroyed, should the contained object also be destroyed, and can the contained object be shared?" If destroyed together and not shared, it is composition. If it survives independently or is shared, it is aggregation. If there is only a transient use with no stored reference, it is dependency. Choosing correctly affects constructor design (composition usually creates its parts internally) and cascade-delete logic in real systems.',
        diagram: `HAS-A strength ladder (weak ──► strong)

 Dependency   A ----►  B      (dashed) uses transiently
   class Order { tax(TaxCalc c){...} }  // no field kept

 Association  A ─────►  B      (solid) keeps a reference
   class Driver { Car car }   independent lifetimes

 Aggregation  A ◇─────  B      hollow diamond = shared part
   ┌────────────┐        ┌───────────┐
   │ Department │◇──────▶│ Professor │  prof survives if
   └────────────┘  0..*  └───────────┘  dept is deleted

 Composition  A ◆─────  B      filled diamond = owned part
   ┌────────┐            ┌────────┐
   │ House  │◆──────────▶│  Room  │  room dies WITH house
   └────────┘    1..*    └────────┘  exactly one owner`,
        keyPoints: [
          'Dependency: transient use (parameter/local), no stored field — dashed arrow',
          'Association: long-lived reference, independent lifetimes — solid line',
          'Aggregation: whole-part, part can be shared & outlives whole — hollow diamond ◇',
          'Composition: whole-part, part exclusively owned & dies with whole — filled diamond ◆',
          'Decision test: destroyed together + not shared = composition, else aggregation',
        ],
        videos: [
          { label: 'Concept && Coding — LLD Playlist (relationships)', url: 'https://www.youtube.com/playlist?list=PL6W8uoQQ2c61X_9e6Net0WdYZidm7zooW' },
          { label: 'Concept && Coding — Channel', url: 'https://www.youtube.com/@ConceptAndCodingByShrayansh' },
        ],
        links: [
          { label: 'GeeksforGeeks — Association, composition, aggregation', url: 'https://www.geeksforgeeks.org/association-composition-aggregation-java/' },
          { label: 'Baeldung — Composition vs aggregation', url: 'https://www.baeldung.com/cs/aggregation-vs-composition' },
        ],
        interview: [
          { q: 'What is the difference between aggregation and composition?', a: 'Both are whole-part associations, but composition is exclusive ownership with a shared lifecycle — the part cannot exist without the whole and dies with it (House–Room). Aggregation is a weaker whole-part where the part has an independent lifetime and can be shared (Department–Professor). UML: filled diamond for composition, hollow diamond for aggregation.' },
          { q: 'How do association and dependency differ?', a: 'An association is a structural relationship where the object stores a long-lived reference to another as a field. A dependency is transient — the class merely uses another type as a method parameter, local variable, or return type without keeping a reference. UML draws association as a solid line and dependency as a dashed arrow.' },
          { q: 'Give a quick test to decide composition vs aggregation.', a: 'Ask two questions: (1) if the container is destroyed, must the contained object also be destroyed? (2) can the contained object be shared by multiple containers? If destroyed-together and not-shared, it is composition; if it survives independently or is shared, it is aggregation.' },
          { q: 'How does composition usually show up in constructor design?', a: 'In composition the whole typically creates and owns its parts internally (e.g. House builds its Rooms in its constructor), so the part reference is never passed in or shared. In aggregation the part is usually passed into the constructor or a setter because it is created elsewhere and may be shared.' },
          { q: 'Why does the relationship type matter beyond UML diagrams?', a: 'It drives real behaviour: cascade deletes (composition cascades, aggregation does not), serialization boundaries, ownership of cleanup, and coupling. Picking the wrong one leads to dangling references or accidental deletion of shared objects.' },
          { q: 'Is a wallet-and-money relationship composition or aggregation?', a: 'Typically composition if the money is conceptually part of the wallet and meaningless without it; but if money is a shared/transferable entity that can move between wallets, model it as aggregation. The right answer depends on the domain — interviewers want you to justify the choice, not memorise it.' },
        ],
      },
      {
        id: 'lld-inheritance-vs-composition',
        topic: 'IS-A vs HAS-A: Inheritance vs Composition & Multiplicity',
        summary: 'Inheritance models IS-A; composition models HAS-A. Multiplicity quantifies how many.',
        explanation:
          'Two relationships dominate class diagrams: IS-A (inheritance) and HAS-A (composition/aggregation). Inheritance expresses that a subtype is a specialised kind of a supertype — a SavingsAccount IS-A Account, a Car IS-A Vehicle. The subtype inherits the supertype\'s contract and can be substituted wherever the supertype is expected (this is what the Liskov Substitution Principle protects). UML draws inheritance with a hollow triangle ▷ pointing at the parent, and interface realisation with a dashed line and hollow triangle.\n\nComposition expresses that an object is built out of other objects — a Car HAS-A Engine, an Order HAS-A list of LineItems. The classic LLD guidance is "favour composition over inheritance" because composition is more flexible: you can swap the contained object at runtime, you only depend on its public interface, and you avoid the fragile-base-class problem where a parent change breaks all subclasses. Inheritance is a compile-time, all-or-nothing reuse mechanism; composition is a runtime, pick-what-you-need mechanism.\n\nA reliable heuristic: use inheritance only when the IS-A relationship is genuine, stable, and you truly want substitutability and polymorphism through the base type. If you are inheriting just to reuse a few methods, that is a code smell — use composition (delegate to a contained object) instead. A famous example: a Stack should NOT extend ArrayList (a Stack is not a list — you would inherit push/pop and also expose get(index) and add(index), violating the Stack abstraction); instead a Stack should HAS-A list and delegate.\n\nMultiplicity (cardinality) annotates the ends of an association to say how many instances participate: 1 (exactly one), 0..1 (optional), * or 0..* (zero or more), 1..* (one or more), or a fixed n. Example: an Order 1 ──► 1..* LineItem means one order has at least one line item, and a Customer 1 ──► 0..* Order means a customer may have any number of orders including none. Getting multiplicity right communicates business rules directly on the diagram and tells the reader whether to use a single reference or a collection field.',
        diagram: `IS-A (inheritance)            HAS-A (composition)

      ┌──────────┐               ┌──────────┐
      │ Vehicle  │               │   Car    │
      │ +start() │               │ +drive() │
      └────▲─────┘               └────┬─────┘
           │ ▷ (extends)              │ ◆ (owns)
   ┌───────┴───────┐                  ▼
┌──────┐      ┌────────┐         ┌──────────┐
│ Car  │      │ Truck  │         │  Engine  │
└──────┘      └────────┘         │ +ignite()│
 "Car IS-A Vehicle"              └──────────┘
                                 "Car HAS-A Engine"

Interface realisation:  Bird ┄┄▷ Flyable (dashed ▷)

Multiplicity on associations:
   Customer 1 ─────► 0..*  Order      (none..many)
   Order    1 ─────► 1..*  LineItem   (at least one)
   User     1 ─────► 0..1  Profile    (optional)`,
        keyPoints: [
          'Inheritance = IS-A, hollow triangle ▷ to parent; interface = dashed ▷',
          'Composition = HAS-A, build objects out of other objects (delegate)',
          'Favour composition: runtime-flexible, no fragile base class, depends on interface only',
          'Use inheritance only for genuine, stable IS-A needing substitutability',
          'Multiplicity: 1, 0..1, 1..*, 0..* (*) annotates how many objects participate',
          'Stack extends ArrayList is the classic bad inheritance; HAS-A list instead',
        ],
        videos: [
          { label: 'Concept && Coding — Composition over Inheritance', url: 'https://www.youtube.com/playlist?list=PL6W8uoQQ2c61X_9e6Net0WdYZidm7zooW' },
          { label: 'ByteByteGo — Channel', url: 'https://www.youtube.com/@ByteByteGo' },
        ],
        links: [
          { label: 'refactoring.guru — Composition over inheritance', url: 'https://refactoring.guru/design-patterns/composite/java/example' },
          { label: 'GeeksforGeeks — Inheritance vs composition', url: 'https://www.geeksforgeeks.org/inheritance-and-composition-in-java/' },
        ],
        interview: [
          { q: 'Why prefer composition over inheritance?', a: 'Composition is more flexible: you depend only on a contained object\'s public interface, you can swap the implementation at runtime, and you avoid the fragile base class problem where changing a parent breaks all subclasses. Inheritance is compile-time, all-or-nothing reuse that creates the tightest coupling. Use inheritance only for a genuine, stable IS-A that needs substitutability.' },
          { q: 'When is inheritance the right choice?', a: 'When the relationship is a true IS-A that is stable over time, when you want polymorphic substitution through the base type, and when subclasses honour the base contract (LSP). If you are subclassing merely to reuse code, prefer composition/delegation instead.' },
          { q: 'Why is "Stack extends ArrayList" a bad design?', a: 'A Stack is not a list — by extending ArrayList it inherits add(index), get(index), remove(index), which break the LIFO abstraction and let callers corrupt the stack. The fix is composition: Stack HAS-A internal list and exposes only push/pop/peek, delegating to it.' },
          { q: 'What is multiplicity / cardinality in UML?', a: 'It annotates the ends of an association to specify how many instances participate: 1 (exactly one), 0..1 (optional), 1..* (one or more), 0..* or * (zero or more), or a fixed number. It encodes business rules (e.g. an Order has 1..* LineItems) and tells you whether to use a single field or a collection.' },
          { q: 'How do you represent an optional one-to-one and a one-to-many in code?', a: 'A 0..1 multiplicity becomes a nullable single reference (e.g. User.profile may be null). A 1..* or 0..* becomes a collection field (e.g. Order.lineItems is a List), often with an invariant that it is non-empty for 1..*.' },
          { q: 'What is the fragile base class problem?', a: 'It is when seemingly safe changes to a base class break derived classes because subclasses depend on the base\'s internal behaviour, not just its contract. It is a key reason composition is preferred — composition depends only on a stable public interface.' },
        ],
      },
      {
        id: 'lld-coupling-cohesion',
        topic: 'Coupling & Cohesion',
        summary: 'Aim for low coupling (few, weak dependencies) and high cohesion (each class does one thing).',
        explanation:
          'Coupling and cohesion are the two quality metrics that underlie almost every design principle. Coupling measures how dependent modules are on each other; cohesion measures how focused and related the responsibilities inside a single module are. The golden rule of design is "low coupling, high cohesion" — and nearly every SOLID/GRASP principle is just a specific tactic to achieve it.\n\nLow coupling means a class depends on as few other classes as possible, and those dependencies are on stable abstractions (interfaces) rather than concrete implementations. Tightly coupled code is brittle: a change in one class ripples into many others, it is hard to test in isolation (you must construct a web of collaborators), and it is hard to reuse. You reduce coupling by depending on interfaces (DIP), passing dependencies in rather than constructing them internally (dependency injection), and limiting how much one object reaches into another (Law of Demeter).\n\nHigh cohesion means everything in a class belongs together and serves a single, well-defined purpose. A cohesive UserAuthenticator only authenticates; a low-cohesion "GodClass" or "UtilityManager" does authentication, logging, emailing, and report generation, which makes it large, hard to name, and a magnet for change. High cohesion is essentially the Single Responsibility Principle viewed from the class\'s perspective: one reason to change. Cohesive classes are easier to name (the name describes exactly one job), easier to test, and easier to reuse.\n\nThe two are related: pushing for high cohesion tends to lower coupling, because focused classes have fewer reasons to reach into others. Interviewers probe this with questions like "your class is doing too much — how would you split it?" or "this change touched ten files, what does that tell you about the design?" (answer: high coupling). When you justify a design decision, framing it as "this lowers coupling" or "this raises cohesion" signals senior-level reasoning.',
        diagram: `Goal: LOW coupling, HIGH cohesion

 HIGH coupling (bad)        LOW coupling (good)
 ┌───┐  ┌───┐  ┌───┐        ┌───┐    ┌───────────┐
 │ A │──│ B │──│ C │        │ A │───►│ «iface» I │
 └─┬─┘\\ └─┬─┘ /└─┬─┘        └───┘    └─────▲─────┘
   │  \\   │   /  │                         │
   └───╳──┴──╳───┘          ┌───┐  ┌───┐  ┌┴──┐
   tangled web, one         │ B │  │ C │  │ D │
   change ripples           depend on I, swap freely

 LOW cohesion (bad)         HIGH cohesion (good)
 ┌────────────────────┐     ┌─────────────┐
 │   GodManager       │     │ Authenticator│ one job
 │ +authenticate()    │     └─────────────┘
 │ +sendEmail()       │     ┌─────────────┐
 │ +generateReport()  │     │ EmailService │ one job
 │ +log()             │     └─────────────┘
 └────────────────────┘     ┌─────────────┐
   many reasons to change   │ ReportMaker │ one job
                            └─────────────┘`,
        keyPoints: [
          'Coupling = degree of dependency between modules; aim LOW',
          'Cohesion = how focused one module is; aim HIGH (one purpose)',
          'Low coupling via interfaces (DIP), dependency injection, Law of Demeter',
          'High cohesion via Single Responsibility — one reason to change',
          'A change touching many files signals high coupling; a GodClass signals low cohesion',
          'Most SOLID/GRASP principles are tactics for low coupling + high cohesion',
        ],
        videos: [
          { label: 'Concept && Coding — Coupling & Cohesion (LLD)', url: 'https://www.youtube.com/playlist?list=PL6W8uoQQ2c61X_9e6Net0WdYZidm7zooW' },
          { label: 'Gaurav Sen — Channel', url: 'https://www.youtube.com/channel/UCRPMAqdtSgd0Ipeef7iFsKw' },
        ],
        links: [
          { label: 'GeeksforGeeks — Coupling and cohesion', url: 'https://www.geeksforgeeks.org/software-engineering-coupling-and-cohesion/' },
          { label: 'Baeldung — Cohesion and coupling', url: 'https://www.baeldung.com/cs/cohesion-vs-coupling' },
        ],
        interview: [
          { q: 'What is the difference between coupling and cohesion?', a: 'Coupling is between modules — how much one class depends on others. Cohesion is within a module — how focused and related its responsibilities are. The design goal is low coupling (independent, swappable modules) and high cohesion (each class does one well-defined job).' },
          { q: 'How do you reduce coupling in a design?', a: 'Depend on abstractions/interfaces instead of concrete classes (DIP), inject dependencies rather than constructing them internally, apply the Law of Demeter so objects don\'t reach through chains of others, and keep interfaces small (ISP). This lets modules vary independently and be tested in isolation.' },
          { q: 'What is a sign of low cohesion in code?', a: 'A class with an unfocused name (Manager, Helper, Util), many unrelated methods, lots of fields used by only some methods, and many reasons to change. It typically grows into a GodClass. The fix is to split it by responsibility.' },
          { q: 'Why is high coupling bad for testing?', a: 'To test a tightly coupled class you must construct its whole web of concrete collaborators, and you cannot easily substitute fakes/mocks. Low coupling on interfaces lets you inject test doubles, so the unit can be tested in isolation.' },
          { q: 'How are coupling/cohesion related to SOLID?', a: 'They are the underlying objectives. SRP and ISP raise cohesion; DIP and OCP lower coupling; LSP keeps polymorphic coupling safe. SOLID is essentially a concrete recipe for achieving low coupling and high cohesion.' },
        ],
      },
    ],
  },
  {
    focus: 'UML Diagrams for LLD',
    concepts: [
      {
        id: 'lld-uml-class-diagram',
        topic: 'UML Class Diagram Notation in Depth',
        summary: 'The class diagram is the core LLD artifact: boxes for classes, lines for relationships.',
        explanation:
          'The class diagram is the single most important UML diagram for low-level design — it is what you draw on the whiteboard to communicate your model. A class is a rectangle with three compartments: the class name on top, attributes (fields) in the middle, and operations (methods) at the bottom. You can omit compartments to reduce clutter, but the name is mandatory.\n\nEach member has a visibility marker: + for public, - for private, # for protected, and ~ for package/default. Attributes are written as visibility name : Type (e.g. - balance : double) and methods as visibility name(params) : ReturnType (e.g. + withdraw(amount : double) : boolean). Static members are underlined, and abstract members are shown in italics. An abstract class has its name in italics (or a {abstract} tag); an interface is marked with the «interface» stereotype above its name and typically lists only operations.\n\nRelationships are the lines connecting classes, and each has a precise arrowhead. Inheritance (generalisation) uses a solid line with a hollow triangle ▷ pointing at the parent. Interface realisation uses a dashed line with a hollow triangle ▷. Association is a solid line (optionally directed with an open arrow ►). Aggregation is a solid line with a hollow diamond ◇ at the owner end. Composition is a solid line with a filled diamond ◆ at the owner end. Dependency is a dashed line with an open arrow ► (used for transient use like method parameters).\n\nMultiplicities sit at the line ends (1, 0..1, *, 1..*) and role names can label what each end represents. Reading a class diagram fluently — and drawing one quickly and correctly — is a baseline expectation in LLD rounds; interviewers often ask you to sketch the class diagram before you write any code, and a clean diagram with correct arrows is itself a strong signal. Practise drawing the six relationship arrows from memory.',
        diagram: `Anatomy of a class box + relationship arrows

 ┌─────────────────────────────┐   «interface»
 │        BankAccount          │  ┌────────────┐
 ├─────────────────────────────┤  │  Payable   │
 │ - balance : double          │  ├────────────┤
 │ - owner   : String          │  │ +pay():void│
 │ # type    : AccountType     │  └─────▲──────┘
 ├─────────────────────────────┤        ┊ (realises)
 │ + withdraw(amt:double):bool │  ┌─────┴──────┐
 │ + deposit(amt:double):void  │  │  Invoice   │
 │ + getBalance():double       │  └────────────┘
 └─────────────────────────────┘
   + public  - private  # protected  ~ package
   static = underlined   abstract = italics

 Relationship arrow cheat-sheet:
   Generalisation (extends)   ───────▷   solid + hollow ▷
   Realisation   (implements) ┄┄┄┄┄┄▷   dashed + hollow ▷
   Association                ────────►  solid line
   Aggregation                ◇────────  hollow diamond
   Composition                ◆────────  filled diamond
   Dependency                 ┄┄┄┄┄┄►   dashed + open ►`,
        keyPoints: [
          'Class box = 3 compartments: name | attributes | operations',
          'Visibility: + public, - private, # protected, ~ package',
          'Member format: -name : Type and +method(p : T) : Ret; static underlined, abstract italic',
          'Interface = «interface» stereotype; abstract class name in italics',
          'Six arrows: ▷ extends (solid), ▷ implements (dashed), ─► assoc, ◇ aggregation, ◆ composition, ┄► dependency',
          'Multiplicities (1, 0..1, *, 1..*) go at the line ends',
        ],
        videos: [
          { label: 'Concept && Coding — UML Class Diagram (LLD)', url: 'https://www.youtube.com/playlist?list=PL6W8uoQQ2c61X_9e6Net0WdYZidm7zooW' },
          { label: 'ByteByteGo — Channel', url: 'https://www.youtube.com/@ByteByteGo' },
        ],
        links: [
          { label: 'GeeksforGeeks — UML class diagrams', url: 'https://www.geeksforgeeks.org/unified-modeling-language-uml-class-diagrams/' },
          { label: 'refactoring.guru — UML relations', url: 'https://refactoring.guru/design-patterns/catalog' },
        ],
        interview: [
          { q: 'What are the three compartments of a UML class box?', a: 'Top: the class name (mandatory, italics if abstract, «interface» stereotype if an interface). Middle: attributes/fields as visibility name : Type. Bottom: operations/methods as visibility name(params) : ReturnType. Static members are underlined; abstract members are italic.' },
          { q: 'What do +, -, #, and ~ mean in a class diagram?', a: 'They are visibility markers: + public (accessible everywhere), - private (only within the class), # protected (class and subclasses), and ~ package/default (same package).' },
          { q: 'How do you draw inheritance versus interface implementation?', a: 'Inheritance (generalisation) is a solid line with a hollow triangle pointing at the parent. Interface realisation is a dashed line with a hollow triangle pointing at the interface. The triangle always points to the more general type.' },
          { q: 'How are aggregation and composition drawn differently?', a: 'Both are solid lines with a diamond at the owner (whole) end. Aggregation uses a hollow/open diamond (shared, independent lifetime); composition uses a filled/solid diamond (exclusive ownership, shared lifetime).' },
          { q: 'When would you use a dependency arrow?', a: 'For a transient use rather than a stored reference — typically when a class uses another only as a method parameter, local variable, or return type. It is drawn as a dashed line with an open arrowhead.' },
          { q: 'Why draw a class diagram before coding in an interview?', a: 'It forces you to fix the entities, their data, behaviour, and relationships up front, surfaces missing pieces early, and gives the interviewer a clear contract to react to before you spend time writing code. A clean, correct diagram is itself a strong scoring signal.' },
        ],
      },
      {
        id: 'lld-uml-sequence-diagram',
        topic: 'Sequence Diagrams: Lifelines, Messages & Activation',
        summary: 'Sequence diagrams show how objects collaborate over time to fulfil one scenario.',
        explanation:
          'Where a class diagram shows the static structure, a sequence diagram shows dynamic behaviour — the time-ordered exchange of messages between objects to accomplish one specific scenario (e.g. "user places an order"). It is the second most useful UML diagram in LLD and is excellent for explaining a flow during an interview.\n\nThe key elements: each participating object is drawn at the top as a box (Actor : Class) with a vertical dashed line dropping down called its lifeline, representing the object\'s existence over time. Time flows downward. A message is a horizontal arrow from the caller\'s lifeline to the callee\'s. A synchronous (blocking) call uses a solid line with a filled arrowhead ►; the caller waits for it to return. A return is drawn as a dashed line with an open arrowhead ◄. An asynchronous message (fire-and-forget) uses a solid line with an open arrowhead.\n\nWhen an object is actively processing a message, a thin vertical rectangle called an activation bar (or focus of control) is drawn on its lifeline. Nested activation bars show a method calling another method that is still in progress. Object creation is shown by a message arrow pointing to a participant box drawn lower down (not at the top), and object destruction is marked with a large X at the bottom of its lifeline.\n\nSequence diagrams also support combined fragments for control flow: alt for if/else alternatives, opt for an optional block, loop for repetition, and par for parallel execution, each drawn as a labelled box around the relevant messages. In an interview, sketching a sequence diagram for the main happy path (and maybe one error path) demonstrates that you understand the runtime collaboration and not just the static classes — it is a great way to walk the interviewer through your design.',
        diagram: `Sequence: user places an order (time flows down)

 :Customer    :OrderService   :Inventory   :Payment
    │              │              │            │
    │ placeOrder() │              │            │
    │─────────────►│▓             │            │   ▓ = activation
    │              │ reserve(sku) │            │       bar
    │              │─────────────►│▓           │
    │              │   ok / fail  │            │
    │              │◄ ─ ─ ─ ─ ─ ─ │            │   ◄┄ = return
    │              │       charge(amount)       │
    │              │───────────────────────────►│▓
    │   ┌─ alt ─ [payment ok] ───────────────┐  │
    │   │          │  confirm  │              │  │
    │   │◄ ─ ─ ─ ─ │           │              │  │
    │   ├─ [payment failed] ──────────────────┤  │
    │   │  releaseReservation()│              │  │
    │   │          │──────────►│              │  │
    │   └──────────────────────────────────── ┘  │
    │              │              │            │
   ► solid+filled = sync call   ┄► dashed = return
   X at lifeline bottom = object destroyed`,
        keyPoints: [
          'Lifeline = dashed vertical line under each participant; time flows downward',
          'Sync call: solid line + filled arrow ►; return: dashed line + open arrow ◄',
          'Async message: solid line + open arrowhead (no waiting)',
          'Activation bar = thin rectangle showing an object is processing a call',
          'Combined fragments: alt (if/else), opt (optional), loop, par (parallel)',
          'Object creation points to a lowered box; destruction marked with an X',
        ],
        videos: [
          { label: 'Concept && Coding — Sequence Diagram (LLD)', url: 'https://www.youtube.com/playlist?list=PL6W8uoQQ2c61X_9e6Net0WdYZidm7zooW' },
          { label: 'ByteByteGo — Channel', url: 'https://www.youtube.com/@ByteByteGo' },
        ],
        links: [
          { label: 'GeeksforGeeks — Sequence diagrams', url: 'https://www.geeksforgeeks.org/unified-modeling-language-uml-sequence-diagrams/' },
          { label: 'Visual Paradigm — Sequence diagram guide', url: 'https://www.visual-paradigm.com/guide/uml-unified-modeling-language/what-is-sequence-diagram/' },
        ],
        interview: [
          { q: 'What does a sequence diagram show that a class diagram does not?', a: 'A class diagram shows static structure (classes, fields, relationships). A sequence diagram shows dynamic behaviour — the time-ordered messages exchanged between objects to carry out one specific scenario, including order of calls, returns, and control flow like loops and alternatives.' },
          { q: 'What is a lifeline and an activation bar?', a: 'A lifeline is the vertical dashed line beneath a participant representing its existence over time (time flows downward). An activation bar (focus of control) is the thin rectangle on a lifeline indicating the object is actively executing a call at that moment.' },
          { q: 'How do you represent a synchronous vs asynchronous message?', a: 'A synchronous (blocking) call is a solid line with a filled arrowhead and the caller waits; the response is a dashed line with an open arrowhead. An asynchronous (fire-and-forget) message is a solid line with an open arrowhead and no waiting for a return.' },
          { q: 'How do you show conditional or repeated behaviour?', a: 'With combined fragments — labelled boxes around the relevant messages: alt for if/else alternatives, opt for an optional block, loop for repetition, and par for parallel execution.' },
          { q: 'How is object creation and destruction shown?', a: 'Creation is a message arrow pointing to the participant box drawn lower on the page (rather than at the top). Destruction is marked with a large X at the bottom of that object\'s lifeline.' },
          { q: 'When would you draw a sequence diagram in an interview?', a: 'After the class diagram, to walk through the main happy-path scenario (and possibly an error path). It demonstrates you understand the runtime collaboration between objects and helps the interviewer follow your design before/while you code.' },
        ],
      },
      {
        id: 'lld-uml-usecase-activity',
        topic: 'Use-Case & Activity Diagrams (Brief)',
        summary: 'Use-case diagrams capture WHO does WHAT; activity diagrams capture the workflow/flowchart.',
        explanation:
          'Beyond class and sequence diagrams, two more UML diagrams come up in LLD discussions, usually briefly. A use-case diagram captures functional requirements from the user\'s point of view: which actors interact with the system and what goals (use cases) they can achieve. Actors are stick figures (a human role like Customer, or an external system); use cases are ovals labelled with a verb phrase like "Place Order"; the system boundary is a box around the use cases. Lines connect actors to the use cases they participate in.\n\nUse-case relationships add nuance: «include» means one use case always uses another (e.g. "Place Order" includes "Validate Cart"), drawn as a dashed arrow labelled «include». «extend» means a use case optionally adds behaviour to another under a condition (e.g. "Apply Coupon" extends "Place Order"), drawn as a dashed arrow labelled «extend». Generalisation between actors (e.g. PremiumCustomer is a Customer) uses a hollow triangle. Use-case diagrams are a requirements-gathering tool — in an interview they map cleanly onto the "identify actors and their actions" step.\n\nAn activity diagram is essentially a UML flowchart that models the flow of control through a process or algorithm. It uses a filled circle for the start node, rounded rectangles for activities/actions, diamonds for decisions (with guard conditions like [valid] / [invalid] on the outgoing edges), arrows for transitions, and a filled circle inside a ring for the end node. A horizontal or vertical bar represents a fork (split into parallel flows) and a join (synchronise parallel flows back together).\n\nActivity diagrams can also use swimlanes (partitions) to show which actor or component is responsible for each activity — useful for modelling a multi-party workflow like an order-fulfilment pipeline. In LLD interviews these two diagrams are secondary to class and sequence diagrams, but knowing them lets you pick the right tool: use cases to nail down scope, activity diagrams to reason about a complex algorithm or workflow with branches and parallelism.',
        diagram: `Use-case diagram          Activity diagram

 ┌── Shopping System ───┐    ● start
 │                      │    │
 │   ( Browse Items )   │    ▼
 │        ▲             │  ┌──────────────┐
 │        │             │  │ Add to Cart  │
 ☺────────┤             │  └──────┬───────┘
Customer  │             │         ▼
 │   ( Place Order )    │      ◇ valid? ◇
 │        ┊«include»    │   [no]│      │[yes]
 │        ▼             │       ▼      ▼
 │   ( Validate Cart )  │  ┌────────┐ ┌─────────┐
 │                      │  │ Notify │ │ Checkout│
 │   ( Apply Coupon )   │  └───┬────┘ └────┬────┘
 │     ┊«extend»        │      │           ▼
 └──────────────────────┘      ▼          ◉ end
   ☺ actor  (...) use case      ◉ end
   ◇ = decision   ━━ = fork/join (parallel)`,
        keyPoints: [
          'Use-case diagram: actors (☺) + use cases (ovals) inside a system boundary box',
          '«include» = always-used sub-case; «extend» = conditional optional behaviour',
          'Use-case maps to the "identify actors and their actions" LLD step',
          'Activity diagram = UML flowchart: start ●, actions, decision ◇, end ◉',
          'Fork/join bars model parallel flows; swimlanes assign activities to actors',
          'Class + sequence are primary in LLD; use-case/activity are secondary',
        ],
        videos: [
          { label: 'Concept && Coding — UML Diagrams (LLD)', url: 'https://www.youtube.com/playlist?list=PL6W8uoQQ2c61X_9e6Net0WdYZidm7zooW' },
          { label: 'ByteByteGo — Channel', url: 'https://www.youtube.com/@ByteByteGo' },
        ],
        links: [
          { label: 'GeeksforGeeks — Use case diagrams', url: 'https://www.geeksforgeeks.org/use-case-diagram/' },
          { label: 'GeeksforGeeks — Activity diagrams', url: 'https://www.geeksforgeeks.org/unified-modeling-language-uml-activity-diagrams/' },
        ],
        interview: [
          { q: 'What does a use-case diagram capture?', a: 'It captures functional requirements from the user\'s perspective — which actors (human roles or external systems) interact with the system and which goals (use cases) they can accomplish, enclosed by a system boundary. It is a requirements/scope tool, not an implementation tool.' },
          { q: 'What is the difference between «include» and «extend»?', a: '«include» means a use case always invokes another as part of its flow (mandatory reuse, e.g. Place Order includes Validate Cart). «extend» means optional behaviour conditionally added to a base use case at an extension point (e.g. Apply Coupon extends Place Order).' },
          { q: 'What is an activity diagram used for?', a: 'It models the flow of control through a process or algorithm — essentially a UML flowchart with a start node, actions, decision diamonds with guard conditions, transitions, fork/join bars for parallelism, and an end node. It is useful for reasoning about workflows with branches.' },
          { q: 'What do fork and join represent in an activity diagram?', a: 'A fork (a bar with one incoming and multiple outgoing flows) splits control into concurrent parallel activities. A join (multiple incoming, one outgoing) synchronises those parallel flows back together before continuing.' },
          { q: 'What are swimlanes?', a: 'Swimlanes (partitions) divide an activity diagram into lanes, each representing an actor or component responsible for the activities in it — useful for showing who does what in a multi-party workflow.' },
          { q: 'Which UML diagrams matter most in an LLD interview?', a: 'The class diagram (static structure) and the sequence diagram (runtime collaboration) are primary. Use-case and activity diagrams are secondary — handy for clarifying scope and complex workflows respectively, but rarely the core deliverable.' },
        ],
      },
    ],
  },
  {
    focus: 'SOLID Principles (Deep)',
    concepts: [
      {
        id: 'lld-srp',
        topic: 'Single Responsibility Principle (SRP)',
        summary: 'A class should have only one reason to change — one responsibility, one actor.',
        explanation:
          'The Single Responsibility Principle states that a class should have only one reason to change. Robert C. Martin sharpens "reason to change" to mean "one actor" — a single source of requirements/stakeholders that drives changes to that class. If two different stakeholders (say the accounting team and the reporting team) can both force you to edit the same class, it has two responsibilities and violates SRP.\n\nThe smell SRP prevents is the GodClass / "Swiss-army-knife" class that mixes unrelated concerns. Consider a bad design: an Employee class with calculatePay(), saveToDatabase(), and generateReport(). These belong to three different actors — finance owns pay rules, the DBA owns persistence, and reporting owns formatting. A change requested by any one of them risks breaking the others, merge conflicts pile up, and the class becomes hard to test because you must drag in a database and a report engine just to test pay logic.\n\nThe refactored good design splits responsibilities into focused collaborators: an Employee holds data and pay-policy logic, an EmployeeRepository handles persistence, and an EmployeeReportFormatter handles report generation. Now each class has one actor and one reason to change; you can test pay logic with no database, swap the persistence layer without touching pay rules, and change the report format independently. This is high cohesion in action.\n\nA practical caution: SRP is about reasons to change, not about making every class tiny or having exactly one method. Over-applying it produces an explosion of anaemic one-method classes that are themselves hard to follow. The skill is identifying genuine responsibility boundaries — usually along stakeholder/actor lines. In interviews, when a class name contains "and" or a vague word like Manager/Processor/Util, that is your cue to ask whether it is violating SRP.',
        diagram: `SRP: split a GodClass by actor / reason-to-change

 BEFORE (violates SRP)        AFTER (one reason each)
 ┌──────────────────────┐     ┌──────────────────┐
 │      Employee        │     │     Employee     │  actor: HR
 ├──────────────────────┤     │ +calculatePay()  │
 │ +calculatePay()  ◄ finance └──────────────────┘
 │ +saveToDB()      ◄ DBA      ┌──────────────────┐
 │ +generateReport()◄ report   │EmployeeRepository│  actor: DBA
 └──────────────────────┘      │ +save(e:Employee)│
   3 actors → 3 reasons        └──────────────────┘
   to change → fragile         ┌──────────────────┐
                               │ ReportFormatter  │  actor: report
                               │ +format(e):String│
                               └──────────────────┘`,
        keyPoints: [
          'One class = one responsibility = one reason (one actor) to change',
          'Smell it prevents: GodClass mixing unrelated concerns',
          'Bad: Employee does pay + persistence + reporting (3 actors)',
          'Good: Employee | EmployeeRepository | ReportFormatter',
          'SRP raises cohesion and makes each piece independently testable',
          'Cue: class names with "and" or Manager/Util may violate SRP',
        ],
        videos: [
          { label: 'Concept && Coding — SOLID: SRP (Live LLD)', url: 'https://www.youtube.com/watch?v=-UjjfzJ574w' },
          { label: 'Concept && Coding — LLD Playlist', url: 'https://www.youtube.com/playlist?list=PL6W8uoQQ2c61X_9e6Net0WdYZidm7zooW' },
        ],
        links: [
          { label: 'GeeksforGeeks — SOLID with real-life examples', url: 'https://www.geeksforgeeks.org/system-design/solid-principle-in-programming-understand-with-real-life-examples/' },
          { label: 'Baeldung — SRP', url: 'https://www.baeldung.com/java-single-responsibility-principle' },
        ],
        interview: [
          { q: 'What is the Single Responsibility Principle?', a: 'A class should have only one reason to change — i.e. one responsibility owned by a single actor/stakeholder. If two different stakeholders could force edits to the same class, it has more than one responsibility and should be split.' },
          { q: 'What does "reason to change" really mean?', a: 'Uncle Bob refines it as "one actor" — a single source of requirements. The point is not the number of methods but whether different groups of people (finance, DBA, reporting) can independently drive changes to the same class.' },
          { q: 'Give an example of an SRP violation and its fix.', a: 'An Employee class with calculatePay(), saveToDatabase(), and generateReport() serves three actors. Fix by splitting into Employee (pay logic/data), EmployeeRepository (persistence), and ReportFormatter (reporting), so each has one reason to change.' },
          { q: 'What problems does violating SRP cause?', a: 'Tight coupling of unrelated concerns, merge conflicts, fragile code where a change for one stakeholder breaks another, and poor testability because unrelated dependencies must be set up together.' },
          { q: 'Can SRP be over-applied?', a: 'Yes — splitting too aggressively yields many anaemic one-method classes that are hard to navigate. The goal is genuine responsibility boundaries (usually along actor lines), not minimal class size.' },
        ],
      },
      {
        id: 'lld-ocp',
        topic: 'Open/Closed Principle (OCP)',
        summary: 'Software entities should be open for extension but closed for modification.',
        explanation:
          'The Open/Closed Principle states that software entities (classes, modules, functions) should be open for extension but closed for modification — you should be able to add new behaviour by adding new code, not by editing existing, tested code. The motivation is risk: every time you modify working code you risk introducing regressions, so a design that lets you extend via new classes is safer and more maintainable.\n\nThe smell OCP prevents is the ever-growing if-else / switch on a type. Consider a bad design: an AreaCalculator with computeArea(Shape s) that does if (s is Circle) ... else if (s is Rectangle) ... else if (s is Triangle).... Every time a new shape is added you must crack open and re-test this method, and the same switch tends to get copy-pasted (perimeter, draw, etc.), so one new shape touches many places. This is closed for extension and open for modification — exactly backwards.\n\nThe refactored good design uses polymorphism. Define an abstract Shape with an abstract area() method, and let each concrete shape (Circle, Rectangle, Triangle) implement its own area(). The AreaCalculator now just calls shape.area() with no type checks. Adding a Hexagon means writing one new class that extends Shape — the calculator and all existing shapes are untouched and need no re-testing. The system is open for extension (new shape classes) and closed for modification (existing code unchanged).\n\nThe enabling mechanisms for OCP are abstraction and polymorphism: program against an interface/abstract base, and inject the concrete behaviour. The Strategy, Template Method, and Decorator patterns are concrete realisations of OCP. A caveat: you cannot make everything open to every kind of change — you anticipate the likely axis of variation (here, "new shapes") and design the abstraction around it. Guessing wrong leads to needless abstraction (YAGNI). Interviewers often probe OCP by asking "now add a new type — how much existing code do you change?" The ideal answer is "none, I add a class."',
        diagram: `OCP: replace a type-switch with polymorphism

 BEFORE (modify to extend)     AFTER (extend by adding)
 ┌────────────────────────┐    ┌──────────────┐
 │   AreaCalculator       │    │ «abstract»   │
 │ +area(s:Shape):double  │    │   Shape      │
 │  if circle ...         │    │ +area():double│ (abstract)
 │  else if rect ...      │    └──────▲───────┘
 │  else if triangle ...  │           │ ▷
 │  // edit for EVERY new  │   ┌───────┼────────┬─────────┐
 │  // shape (re-test!)    │ ┌─┴───┐┌──┴────┐┌──┴─────┐
 └────────────────────────┘ │Circle││Rectang││Hexagon │◄ just
                            │area()││area() ││area()  │  add!
   open for modification    └──────┘└───────┘└────────┘
   = risky                  AreaCalc just calls s.area()`,
        keyPoints: [
          'Open for extension, closed for modification — add code, don\'t edit code',
          'Smell it prevents: growing if-else/switch on a type',
          'Bad: AreaCalculator with if(circle)/else if(rect)... edited per new shape',
          'Good: abstract Shape.area(), each shape overrides; add a class to extend',
          'Enabled by abstraction + polymorphism (Strategy, Template Method, Decorator)',
          'Design the abstraction around the anticipated axis of change',
        ],
        videos: [
          { label: 'Concept && Coding — SOLID: OCP (Live LLD)', url: 'https://www.youtube.com/watch?v=-UjjfzJ574w' },
          { label: 'Concept && Coding — LLD Playlist', url: 'https://www.youtube.com/playlist?list=PL6W8uoQQ2c61X_9e6Net0WdYZidm7zooW' },
        ],
        links: [
          { label: 'GeeksforGeeks — Open/Closed Principle', url: 'https://www.geeksforgeeks.org/open-closed-principle-in-java-with-examples/' },
          { label: 'Baeldung — Open/Closed Principle', url: 'https://www.baeldung.com/java-open-closed-principle' },
        ],
        interview: [
          { q: 'What is the Open/Closed Principle?', a: 'Software entities should be open for extension but closed for modification — you add new behaviour by adding new code (e.g. a new subclass/strategy), not by editing existing, tested code, which reduces the risk of regressions.' },
          { q: 'What design smell does OCP target?', a: 'The growing if-else or switch on a type discriminant. Each new type forces you to edit and re-test that branch, and the switch tends to be duplicated across the codebase, so one new type ripples through many files.' },
          { q: 'How do you refactor a type-switch to satisfy OCP?', a: 'Introduce an abstraction (interface/abstract class) with the varying operation, give each concrete type its own implementation, and have callers depend on the abstraction. Adding a new type then means adding one class, leaving existing code untouched.' },
          { q: 'Which patterns implement OCP?', a: 'Strategy (inject interchangeable algorithms), Template Method (fixed skeleton, overridable steps), Decorator (add behaviour by wrapping), and Factory (create new types without changing client code) all enable extension without modification.' },
          { q: 'Can you make code open to every kind of change?', a: 'No — you anticipate the most likely axis of variation and design an abstraction around it. Trying to make everything extensible leads to over-engineering (violating YAGNI), so OCP is applied where change is expected.' },
        ],
      },
      {
        id: 'lld-lsp',
        topic: 'Liskov Substitution Principle (LSP)',
        summary: 'Subtypes must be substitutable for their base type without breaking correctness.',
        explanation:
          'The Liskov Substitution Principle states that objects of a subclass must be usable anywhere objects of the superclass are expected, without altering the correctness of the program. In other words, a subtype must honour the behavioural contract of its base type — same (or weaker) preconditions, same (or stronger) postconditions, preserved invariants, and no surprising exceptions. LSP is what makes polymorphism safe; if a subclass can break callers that hold a base reference, your inheritance is lying.\n\nThe classic violation is the Rectangle/Square problem. Geometrically a square is a rectangle, so one models class Square extends Rectangle. But Rectangle has independent setWidth() and setHeight(); Square must keep width == height, so its setWidth() also changes height. Now any code written against Rectangle — e.g. "set width to 5, set height to 4, assert area == 20" — breaks when handed a Square (it gets 16). The Square cannot be substituted for a Rectangle, so the inheritance violates LSP even though "a square IS-A rectangle" sounds true.\n\nAnother common violation is throwing or no-op-ing an inherited method. If Bird has fly() and you make Penguin extends Bird, Penguin.fly() must either misbehave or throw UnsupportedOperationException — code iterating birds and calling fly() breaks. The smell LSP prevents is exactly this: subclasses that weaken the base contract, throw on inherited operations, return degenerate values, or require type checks (if (x instanceof Square)) at call sites.\n\nThe fix is usually to rethink the hierarchy with composition or better abstractions. For shapes, drop the inheritance and have both Square and Rectangle implement an immutable Shape interface with area(), removing the mutating setters that caused the conflict. For birds, separate capabilities: a Flyable interface implemented only by birds that actually fly, so Penguin simply does not implement it. The litmus test in interviews: "can I replace the parent with any child everywhere and have all existing tests still pass?" If not, LSP is violated and the hierarchy is wrong.',
        diagram: `LSP: Square/Rectangle violation and the fix

 BAD: Square ▷ Rectangle (breaks substitution)
 ┌──────────────────┐
 │   Rectangle      │   client expects:
 │ +setWidth(w)     │     r.setW(5); r.setH(4);
 │ +setHeight(h)    │     assert area()==20  ✔ for Rectangle
 │ +area()          │                         ✘ for Square(16)
 └────────▲─────────┘
          │ ▷
 ┌────────┴─────────┐  Square.setWidth() also sets height
 │     Square       │  → caller written for Rectangle breaks
 └──────────────────┘

 GOOD: drop mutation, share an interface
        ┌──────────────┐
        │ «interface»  │
        │   Shape      │
        │ +area():double│
        └──────▲───────┘
          ┌────┴─────┐
   ┌──────┴───┐  ┌───┴──────┐  both substitutable
   │ Rectangle│  │  Square  │  for Shape, no surprises
   └──────────┘  └──────────┘`,
        keyPoints: [
          'A subtype must be substitutable for its base type without breaking callers',
          'Contract rules: no stronger preconditions, no weaker postconditions, invariants preserved',
          'Classic violation: Square extends Rectangle (setWidth changes height)',
          'Also a violation: Penguin.fly() throwing or no-op-ing an inherited method',
          'Smell it prevents: subclasses that throw/weaken contract or need instanceof checks',
          'Fix: rethink hierarchy with interfaces/composition (e.g. immutable Shape, Flyable)',
        ],
        videos: [
          { label: 'Concept && Coding — SOLID: LSP (Live LLD)', url: 'https://www.youtube.com/watch?v=-UjjfzJ574w' },
          { label: 'Concept && Coding — LLD Playlist', url: 'https://www.youtube.com/playlist?list=PL6W8uoQQ2c61X_9e6Net0WdYZidm7zooW' },
        ],
        links: [
          { label: 'GeeksforGeeks — Liskov Substitution Principle', url: 'https://www.geeksforgeeks.org/liskov-substitution-principle-in-system-design/' },
          { label: 'Baeldung — Liskov Substitution Principle', url: 'https://www.baeldung.com/java-liskov-substitution-principle' },
        ],
        interview: [
          { q: 'What is the Liskov Substitution Principle?', a: 'Objects of a subclass must be replaceable for objects of the superclass without changing the correctness of the program. A subtype must honour the base type\'s behavioural contract — equal-or-weaker preconditions, equal-or-stronger postconditions, preserved invariants, and no unexpected exceptions.' },
          { q: 'Give a concrete LSP violation.', a: 'Square extends Rectangle: Rectangle allows independent setWidth/setHeight, but Square forces width==height, so setWidth also changes height. Client code that relies on Rectangle\'s behaviour (set width 5, height 4, expect area 20) breaks when given a Square. The IS-A is true geometrically but the behavioural contract is violated.' },
          { q: 'How is throwing UnsupportedOperationException related to LSP?', a: 'If a subclass overrides an inherited method just to throw or no-op (e.g. Penguin.fly()), it cannot be substituted for the base wherever that method is called — that is an LSP violation. The hierarchy or interface segregation is wrong.' },
          { q: 'How do you fix the Rectangle/Square violation?', a: 'Remove the problematic inheritance and the mutating setters that caused the conflict: have both Rectangle and Square implement an immutable Shape interface (with area()), constructed with their dimensions. Now both are fully substitutable for Shape.' },
          { q: 'What is a quick test for LSP compliance?', a: 'Ask: can I replace the parent type with any of its subtypes everywhere it is used and have all existing behaviour/tests still pass? If callers need instanceof checks or special-casing for a subtype, LSP is broken.' },
          { q: 'How does LSP relate to polymorphism?', a: 'LSP is the rule that makes polymorphism safe. Polymorphism lets you treat subtypes through the base reference; LSP guarantees those subtypes actually behave like the base, so the substitution does not surprise callers.' },
        ],
      },
      {
        id: 'lld-isp',
        topic: 'Interface Segregation Principle (ISP)',
        summary: 'No client should be forced to depend on methods it does not use — prefer small interfaces.',
        explanation:
          'The Interface Segregation Principle states that clients should not be forced to depend on interface methods they do not use. Big, "fat" interfaces couple unrelated clients together and force implementers to provide methods that make no sense for them. The remedy is to split a fat interface into several small, role-specific interfaces so each client depends only on what it actually needs.\n\nThe smell ISP prevents is the fat interface implemented with empty bodies or thrown exceptions. The textbook example: an interface Machine { print(); scan(); fax(); }. A modern AllInOnePrinter implements all three happily. But an OldPrinter that can only print is now forced to implement scan() and fax() too — typically by throwing UnsupportedOperationException or doing nothing. That is the same smell as an LSP violation, and it means every change to fax() forces recompilation/retesting of clients that only ever print.\n\nThe refactored good design segregates the fat interface into role interfaces: Printer { print(); }, Scanner { scan(); }, and Fax { fax(); }. The AllInOnePrinter implements all three; the OldPrinter implements only Printer. Clients now depend on the narrow interface they need — a function that only prints takes a Printer, so it is completely insulated from changes to scanning or faxing. This reduces coupling and removes the meaningless stub implementations.\n\nISP and SRP are closely related but operate at different levels: SRP is about a class having one responsibility; ISP is about an interface (a contract) being focused so its clients are not over-coupled. A good rule of thumb: if implementers of an interface routinely leave some methods empty or throwing, or if different callers use disjoint subsets of its methods, the interface is too fat and should be split. In interviews, spotting a fat interface and proposing role interfaces is a clean, high-signal answer.',
        diagram: `ISP: split a fat interface into role interfaces

 BEFORE (fat interface)        AFTER (segregated roles)
 ┌──────────────────┐          ┌─────────┐ ┌─────────┐
 │ «interface»      │          │«iface»  │ │«iface»  │
 │   Machine        │          │ Printer │ │ Scanner │
 │ +print()         │          │+print() │ │+scan()  │
 │ +scan()          │          └────▲────┘ └────▲────┘
 │ +fax()           │          ┌────┴───┐       │
 └────────▲─────────┘          │«iface» │       │
   ┌──────┴──────┐             │  Fax   │       │
 ┌─┴────────┐ ┌──┴────────┐    │+fax()  │       │
 │AllInOne  │ │OldPrinter │    └────▲───┘       │
 │ (ok)     │ │ scan()/fax│         │           │
 │          │ │ THROW ✘   │   AllInOnePrinter ┄▷ all 3
 └──────────┘ └───────────┘   OldPrinter ┄┄┄┄┄▷ Printer only`,
        keyPoints: [
          'Clients must not depend on interface methods they do not use',
          'Smell it prevents: fat interface with empty/throwing stub methods',
          'Bad: Machine{print;scan;fax} forces OldPrinter to stub scan/fax',
          'Good: split into Printer / Scanner / Fax role interfaces',
          'Clients depend only on the narrow interface they need → lower coupling',
          'ISP is SRP applied to interfaces/contracts',
        ],
        videos: [
          { label: 'Concept && Coding — SOLID: ISP (Live LLD)', url: 'https://www.youtube.com/watch?v=-UjjfzJ574w' },
          { label: 'Concept && Coding — LLD Playlist', url: 'https://www.youtube.com/playlist?list=PL6W8uoQQ2c61X_9e6Net0WdYZidm7zooW' },
        ],
        links: [
          { label: 'GeeksforGeeks — Interface Segregation Principle', url: 'https://www.geeksforgeeks.org/interface-segregation-principle-in-system-design/' },
          { label: 'Baeldung — Interface Segregation Principle', url: 'https://www.baeldung.com/java-interface-segregation' },
        ],
        interview: [
          { q: 'What is the Interface Segregation Principle?', a: 'No client should be forced to depend on methods it does not use. Instead of one fat interface, define several small, role-specific interfaces so each client depends only on the operations relevant to it, reducing coupling.' },
          { q: 'What smell does ISP prevent?', a: 'Fat interfaces whose implementers leave methods empty or throw UnsupportedOperationException because those methods do not apply to them — and clients being coupled to (and recompiled by) parts of an interface they never call.' },
          { q: 'Give an example of an ISP violation and the fix.', a: 'A Machine interface with print(), scan(), fax() forces an OldPrinter (print-only) to stub scan/fax. Fix by splitting into Printer, Scanner, and Fax interfaces; AllInOnePrinter implements all three, OldPrinter implements only Printer.' },
          { q: 'How is ISP related to SRP?', a: 'They are the same idea at different levels: SRP keeps a class focused on one responsibility, while ISP keeps an interface (a contract) focused so its clients are not coupled to unrelated capabilities. Both raise cohesion and lower coupling.' },
          { q: 'How do you detect a fat interface?', a: 'If implementers routinely leave some methods empty or throwing, or if different callers use disjoint subsets of the interface\'s methods, it is too broad and should be segregated into role interfaces.' },
        ],
      },
      {
        id: 'lld-dip',
        topic: 'Dependency Inversion Principle (DIP)',
        summary: 'Depend on abstractions, not concretions; high-level modules should not depend on low-level ones.',
        explanation:
          'The Dependency Inversion Principle has two parts: (1) high-level modules should not depend on low-level modules — both should depend on abstractions; and (2) abstractions should not depend on details — details should depend on abstractions. The word "inversion" refers to flipping the traditional dependency direction: instead of business logic depending directly on a concrete database/email/SMS class, both the business logic and the concrete class depend on an interface in the middle.\n\nThe smell DIP prevents is high-level policy hard-wired to a concrete low-level detail. Bad design: a NotificationService that does new EmailSender() inside itself and calls emailSender.send(...). The high-level notification policy now depends on a specific concrete EmailSender. To add SMS you must edit NotificationService, you cannot unit-test it without sending real email, and you cannot reuse it with a different transport. The dependency arrow points from the important high-level class down to a volatile detail.\n\nThe refactored good design introduces an abstraction the high-level module owns: an interface MessageSender { send(msg); }. NotificationService depends on MessageSender (injected via its constructor), and concrete EmailSender and SmsSender implement MessageSender. Now the high-level module depends only on the abstraction; the details depend on that same abstraction. You can add SmsSender without touching NotificationService (this also gives you OCP), inject a mock MessageSender in tests, and swap transports freely. The dependency has been "inverted" — the detail now points up at the abstraction.\n\nDIP is the principle behind dependency injection (DI) and inversion-of-control containers. The practical mechanics: program to interfaces, never new up volatile dependencies inside a class, and pass dependencies in through the constructor (or a setter/factory). A subtle point Uncle Bob stresses: the abstraction should be owned by the high-level module (defined in terms of what the policy needs), not by the low-level detail — otherwise you have just renamed the coupling. In interviews, DIP is the cleanest way to justify constructor injection and to make a design testable; mentioning it alongside "and this lets me inject a mock in tests" is high signal.',
        diagram: `DIP: invert the arrow via an abstraction

 BEFORE (high depends on low)
 ┌─────────────────────┐
 │ NotificationService │  high-level policy
 │  new EmailSender()  │──────────┐ depends on
 └─────────────────────┘          ▼ concrete detail
                          ┌──────────────┐
                          │ EmailSender  │  low-level
                          └──────────────┘

 AFTER (both depend on abstraction)
 ┌─────────────────────┐     ┌──────────────────┐
 │ NotificationService │────►│ «interface»      │
 │  sender: MessageSender│    │  MessageSender   │
 └─────────────────────┘     │ +send(msg):void  │
                             └────────▲─────────┘
                          ┌───────────┴──────────┐
                  ┌───────┴──────┐      ┌─────────┴────┐
                  │ EmailSender  │      │  SmsSender   │
                  └──────────────┘      └──────────────┘
   arrow inverted: details now point UP at abstraction
   (inject sender via constructor → mockable in tests)`,
        keyPoints: [
          'High-level & low-level modules both depend on abstractions, not each other',
          'Abstractions don\'t depend on details; details depend on abstractions',
          'Smell it prevents: high-level class doing new ConcreteDetail() internally',
          'Bad: NotificationService news up EmailSender; Good: depends on MessageSender iface',
          'Enables dependency injection (constructor injection) and mockable tests',
          'The abstraction should be owned by the high-level module that needs it',
        ],
        videos: [
          { label: 'Concept && Coding — SOLID: DIP (Live LLD)', url: 'https://www.youtube.com/watch?v=-UjjfzJ574w' },
          { label: 'Concept && Coding — LLD Playlist', url: 'https://www.youtube.com/playlist?list=PL6W8uoQQ2c61X_9e6Net0WdYZidm7zooW' },
        ],
        links: [
          { label: 'GeeksforGeeks — Dependency Inversion Principle', url: 'https://www.geeksforgeeks.org/dependecy-inversion-principle-solid/' },
          { label: 'Baeldung — Dependency Inversion / DI', url: 'https://www.baeldung.com/java-dependency-inversion-principle' },
        ],
        interview: [
          { q: 'What is the Dependency Inversion Principle?', a: 'High-level modules should not depend on low-level modules; both should depend on abstractions. And abstractions should not depend on details; details should depend on abstractions. It flips the dependency so business policy depends on an interface, not a concrete implementation.' },
          { q: 'How is DIP different from dependency injection?', a: 'DIP is the design principle (depend on abstractions). Dependency injection is a technique that implements it — supplying a class\'s dependencies from outside (usually via the constructor) instead of the class constructing them itself. DI is how you achieve DIP in practice.' },
          { q: 'Give an example of a DIP violation and its fix.', a: 'A NotificationService that calls new EmailSender() internally is hard-wired to a concrete detail. Fix by defining a MessageSender interface that NotificationService depends on (injected via constructor); EmailSender and SmsSender implement it, so transports can be swapped and mocked.' },
          { q: 'Why does DIP improve testability?', a: 'Because the class depends on an interface rather than a concrete class, you can inject a mock/fake implementation in unit tests instead of the real (slow, side-effecting) dependency, testing the high-level logic in isolation.' },
          { q: 'What does Uncle Bob mean by the abstraction being "owned" by the high-level module?', a: 'The interface should be defined in terms of what the high-level policy needs, conceptually belonging to it, not dictated by the low-level detail. Otherwise the abstraction just mirrors the concrete class and you have renamed the coupling rather than inverting it.' },
          { q: 'How does DIP relate to OCP?', a: 'Depending on an abstraction lets you add new implementations (e.g. SmsSender) without modifying the high-level module — which is exactly OCP. DIP provides the seam; OCP is the benefit of extending through it.' },
        ],
      },
    ],
  },
  {
    focus: 'Core Design Principles',
    concepts: [
      {
        id: 'lld-dry-kiss-yagni',
        topic: 'DRY, KISS & YAGNI',
        summary: 'Three pragmatic rules: don\'t repeat yourself, keep it simple, don\'t build what you don\'t need.',
        explanation:
          'DRY — Don\'t Repeat Yourself — says every piece of knowledge should have a single, authoritative representation in the system. Duplicated logic (validation copy-pasted into five places, a tax rate hard-coded in many methods) means a change must be made in every copy, and the copies inevitably drift, causing bugs. You remove duplication by extracting it into one function, class, or constant. A caveat: DRY is about duplicated knowledge, not coincidentally-identical code — two pieces that look alike today but change for different reasons should stay separate, otherwise you create false coupling.\n\nKISS — Keep It Simple, Stupid — says prefer the simplest design that solves the problem. Complexity is the enemy of maintainability: clever one-liners, deep inheritance trees, premature generalisation, and excess configuration all make code harder to read and change. The simplest solution that a teammate can understand at a glance usually wins. KISS does not mean simplistic or under-engineered; it means not adding accidental complexity beyond what the problem demands.\n\nYAGNI — You Aren\'t Gonna Need It — says do not build functionality until it is actually required. Engineers love to add "flexibility for the future" — a plugin system, a config option, a generic framework — for requirements that never materialise. That speculative code costs time to write, must be maintained and tested, and often guesses the future wrong, getting in the way when the real requirement arrives. Build for today\'s requirements; add abstraction when a second concrete case actually appears.\n\nThese three are in productive tension with each other and with SOLID. Over-applying DRY can hurt KISS (a tortured generic abstraction to avoid two lines of duplication) and YAGNI (building a framework for reuse that never happens). The senior skill is balance: remove genuine duplication, keep designs as simple as the requirements allow, and resist speculative generality. In interviews, citing YAGNI is a clean way to defend not adding a pattern that the problem doesn\'t justify yet.',
        diagram: `DRY · KISS · YAGNI at a glance

 DRY  one source of truth
   BAD  taxRate=0.18 in calcA(), calcB(), calcC()
   GOOD  const TAX_RATE = 0.18  // referenced everywhere
   (but: don't merge code that changes for diff reasons)

 KISS  simplest thing that works
   BAD  ┌─ AbstractFactoryProviderStrategyBuilder ─┐
        └ to add two numbers ─────────────────────┘
   GOOD  int sum = a + b

 YAGNI  build only what's required now
   BAD  add plugin engine + config DSL "for the future"
   GOOD  implement today's requirement; abstract when a
         SECOND real case appears

 Tension:  over-DRY  ──► hurts KISS / YAGNI
           balance = remove real dup, stay simple, no
                     speculative generality`,
        keyPoints: [
          'DRY: single source of truth for each piece of knowledge; remove duplication',
          'DRY caveat: don\'t merge code that merely looks alike but changes for different reasons',
          'KISS: prefer the simplest design that solves the problem; avoid accidental complexity',
          'YAGNI: don\'t build speculative features/abstractions until actually needed',
          'Add abstraction when a SECOND concrete case appears, not before',
          'These principles trade off — balance them rather than maximising any one',
        ],
        videos: [
          { label: 'Concept && Coding — Design Principles (LLD)', url: 'https://www.youtube.com/playlist?list=PL6W8uoQQ2c61X_9e6Net0WdYZidm7zooW' },
          { label: 'ByteByteGo — Channel', url: 'https://www.youtube.com/@ByteByteGo' },
        ],
        links: [
          { label: 'GeeksforGeeks — DRY, KISS, YAGNI', url: 'https://www.geeksforgeeks.org/software-engineering/dry-kiss-yagni-principles/' },
          { label: 'refactoring.guru — Design principles', url: 'https://refactoring.guru/design-patterns/design-principles' },
        ],
        interview: [
          { q: 'What is the DRY principle?', a: 'Don\'t Repeat Yourself: every piece of knowledge should have one authoritative representation. Duplicated logic forces multi-place edits and drifts into bugs, so you extract it into a single function, class, or constant.' },
          { q: 'Can DRY be over-applied?', a: 'Yes. DRY is about duplicated knowledge, not coincidentally similar code. Merging two pieces that look alike but change for different reasons creates false coupling — a change for one forces awkward changes to the other. Sometimes a little duplication is healthier than the wrong abstraction.' },
          { q: 'What does KISS mean in practice?', a: 'Keep It Simple — choose the simplest design that meets the requirements and avoid accidental complexity (clever tricks, deep hierarchies, premature generalisation). The solution a teammate understands at a glance is usually the right one. It is not an excuse to under-engineer.' },
          { q: 'What is YAGNI and why does it matter?', a: 'You Aren\'t Gonna Need It: don\'t build functionality or abstraction until it is actually required. Speculative features cost time, add maintenance burden, and often guess the future wrong. Build for today and generalise when a real second case appears.' },
          { q: 'How do DRY, KISS, and YAGNI interact with SOLID?', a: 'They keep SOLID from being over-applied. SOLID encourages abstractions; YAGNI and KISS warn against adding them speculatively, and DRY warns against duplication. The skill is balancing extensibility with simplicity based on actual, anticipated change.' },
        ],
      },
      {
        id: 'lld-program-to-interface',
        topic: 'Program to an Interface & Composition over Inheritance',
        summary: 'Depend on abstractions and assemble behaviour from parts rather than inheriting it.',
        explanation:
          'Two of the most quoted Gang-of-Four maxims are "program to an interface, not an implementation" and "favour object composition over class inheritance." Together they are the backbone of flexible OOP design and underpin most design patterns.\n\n"Program to an interface, not an implementation" means your variables, parameters, and return types should be declared as the most abstract type that suffices (an interface or abstract class), not a concrete class. Write List<Order> orders = new ArrayList<>(), not ArrayList<Order> orders = ...; declare a method to take a MessageSender, not an EmailSender. This decouples callers from concrete types so you can swap implementations (ArrayList to LinkedList, Email to SMS) without touching the client, and it enables polymorphism and testing with mocks. It is the everyday application of DIP.\n\n"Favour composition over inheritance" means build complex behaviour by assembling objects (HAS-A) rather than extending a base class (IS-A). Inheritance is static — chosen at compile time, all-or-nothing, and it leaks the parent\'s internals into the subclass (the fragile base class problem). Composition is dynamic — you hold a reference to a collaborator behind an interface and delegate to it, so you can change behaviour at runtime and only depend on the collaborator\'s public contract. The classic illustration is the combinatorial explosion of subclasses: modelling a coffee with milk, with sugar, with both, with double milk... as a subclass per combination explodes, whereas the Decorator pattern composes add-ons at runtime with a handful of classes.\n\nThe two principles reinforce each other: you compose objects that you reference through interfaces. This is exactly how Strategy (inject an algorithm via an interface), Decorator (wrap a component implementing the same interface), and Adapter work. The practical heuristic: reach for an interface-typed field and delegation by default; only use inheritance for a genuine, stable IS-A that needs substitutability. In interviews, "I\'d compose these behind an interface so I can swap and test them" is a phrase that signals maturity.',
        diagram: `Program to interface + composition over inheritance

 Program to an INTERFACE (not concrete)
   GOOD  List<Order> o = new ArrayList<>()   // swap freely
   BAD   ArrayList<Order> o = new ArrayList<>()

 Composition beats subclass explosion
 INHERITANCE (combinatorial blow-up)
   Coffee ▷ MilkCoffee ▷ MilkSugarCoffee ▷
           SugarCoffee  ▷ DoubleMilkSugar... (N×M classes!)

 COMPOSITION (Decorator — runtime assembly)
  ┌──────────────┐        ┌──────────────────┐
  │ «interface»  │◄───────│ «abstract»       │
  │  Beverage    │        │ AddOnDecorator   │◆ wraps a
  │ +cost()      │        │  - inner:Beverage│  Beverage
  └──────▲───────┘        └────────▲─────────┘
   ┌─────┴────┐          ┌─────────┼─────────┐
 ┌─┴──────┐          ┌───┴───┐ ┌───┴───┐
 │Espresso│          │ Milk  │ │ Sugar │  mix at runtime:
 └────────┘          └───────┘ └───────┘  Sugar(Milk(Espresso))`,
        keyPoints: [
          'Declare variables/params/returns by the abstract type (interface), not concrete class',
          'Decoupling: swap implementations and inject mocks without changing callers',
          'Composition (HAS-A + delegation) is runtime-flexible; inheritance is static & leaky',
          'Subclass-per-combination explodes; Decorator composes add-ons with few classes',
          'Strategy, Decorator, Adapter all rest on these two maxims',
          'Default to interface-typed fields + delegation; inherit only for true stable IS-A',
        ],
        videos: [
          { label: 'Concept && Coding — Composition over Inheritance (LLD)', url: 'https://www.youtube.com/playlist?list=PL6W8uoQQ2c61X_9e6Net0WdYZidm7zooW' },
          { label: 'ByteByteGo — Channel', url: 'https://www.youtube.com/@ByteByteGo' },
        ],
        links: [
          { label: 'refactoring.guru — Composition over inheritance', url: 'https://refactoring.guru/design-patterns/decorator' },
          { label: 'GeeksforGeeks — Program to interface', url: 'https://www.geeksforgeeks.org/object-oriented-design-principles/' },
        ],
        interview: [
          { q: 'What does "program to an interface, not an implementation" mean?', a: 'Declare variables, parameters, and return types using the most abstract suitable type (an interface or abstract class) rather than a concrete class. This decouples callers from concrete implementations, so you can swap them and inject mocks without changing client code. It is DIP applied day to day.' },
          { q: 'Why favour composition over inheritance?', a: 'Composition assembles behaviour from collaborators referenced through interfaces, so it is runtime-flexible, depends only on public contracts, and avoids the fragile base class problem. Inheritance is compile-time, all-or-nothing, and leaks parent internals. Use inheritance only for a genuine, stable IS-A needing substitutability.' },
          { q: 'How does composition avoid subclass explosion?', a: 'Modelling every feature combination as its own subclass grows multiplicatively (milk × sugar × size...). Composition (e.g. the Decorator pattern) lets you wrap a base object with independent add-ons at runtime, so N features need ~N classes, not N-factorial subclasses.' },
          { q: 'Which patterns are built on these maxims?', a: 'Strategy injects an interchangeable algorithm via an interface; Decorator wraps a component sharing the same interface to add behaviour; Adapter composes an adaptee behind a target interface. All program to an interface and prefer composition.' },
          { q: 'Is inheritance ever the right tool then?', a: 'Yes — when there is a true, stable IS-A relationship, when you want polymorphic substitution through the base type, and when subclasses honour the base contract (LSP). For pure code reuse, prefer composition/delegation.' },
        ],
      },
      {
        id: 'lld-law-of-demeter',
        topic: 'Law of Demeter & Separation of Concerns',
        summary: 'Talk only to your immediate friends; keep distinct concerns in distinct modules.',
        explanation:
          'The Law of Demeter (LoD), the "principle of least knowledge," says a method should only talk to its immediate collaborators — not reach through them to distant objects. Concretely, a method m of object O may call methods on: O itself, O\'s own fields, m\'s parameters, and objects m creates. It should NOT call methods on objects returned by other calls. The classic violation is a "train wreck": order.getCustomer().getAddress().getCity().toUpperCase(). Each dot couples your code to another class\'s internal structure, so a change anywhere in that chain breaks you.\n\nThe fix is to add a method that hides the navigation: order.getCustomerCity() (which internally does the chaining once) or, better, push behaviour to where the data lives ("Tell, Don\'t Ask"): instead of pulling data out to act on it, tell the object to do the work — order.ship() rather than reading the address out and shipping it from outside. LoD reduces coupling because callers depend only on their direct neighbours\' interfaces, not on the whole object graph. The caveat: data-transfer objects, fluent builders, and stream pipelines legitimately chain calls; LoD targets behavioural coupling to foreign internals, not every dot.\n\nSeparation of Concerns (SoC) is the broader principle that a system should be decomposed into parts that each address a distinct concern, with minimal overlap. The canonical example is layering: presentation (UI), business logic (domain), and data access (persistence) live in separate layers, each ignorant of the others\' internals and communicating through defined interfaces. MVC, the layered architecture, and hexagonal/ports-and-adapters all apply SoC. The benefit is that you can change the UI without touching business rules, swap the database without changing the domain, and test each layer independently.\n\nLoD and SoC both serve low coupling and high cohesion from different angles: LoD at the method/object-interaction level (don\'t reach through neighbours), SoC at the architectural level (keep concerns in separate modules). In interviews, spotting a train-wreck chain and proposing a delegating method, or proposing a layered separation between domain and persistence, are concrete, senior-sounding moves.',
        diagram: `Law of Demeter + Separation of Concerns

 Law of Demeter — talk only to friends
  VIOLATION (train wreck):
    order.getCustomer().getAddress().getCity()
          └──── reaches through 3 foreign objects ────┘
  FIX (delegate / Tell-Don't-Ask):
    order.getShippingCity()    or    order.ship()
    ┌────────┐ asks only its direct neighbour
    │ Order  │──► knows how to reach its own data
    └────────┘

 Separation of Concerns — layers, distinct concerns
   ┌───────────────────────┐  Presentation (UI)
   └───────────┬───────────┘  ▲ depends via interface
   ┌───────────▼───────────┐  Business / Domain logic
   └───────────┬───────────┘  ▲ depends via interface
   ┌───────────▼───────────┐  Data Access (persistence)
   └───────────────────────┘  swap DB w/o touching domain`,
        keyPoints: [
          'Law of Demeter: a method talks only to self, its fields, its params, and objects it creates',
          'Avoid train wrecks a.getB().getC().getD() — each dot couples to foreign internals',
          'Fix via a delegating method or "Tell, Don\'t Ask" (push behaviour to the data)',
          'LoD caveat: DTOs, builders, and stream pipelines legitimately chain',
          'Separation of Concerns: decompose into distinct, minimally-overlapping modules/layers',
          'Layered/MVC/hexagonal architectures apply SoC; both serve low coupling',
        ],
        videos: [
          { label: 'Concept && Coding — Design Principles (LLD)', url: 'https://www.youtube.com/playlist?list=PL6W8uoQQ2c61X_9e6Net0WdYZidm7zooW' },
          { label: 'ByteByteGo — Channel', url: 'https://www.youtube.com/@ByteByteGo' },
        ],
        links: [
          { label: 'GeeksforGeeks — Law of Demeter', url: 'https://www.geeksforgeeks.org/law-of-demeter-in-java/' },
          { label: 'GeeksforGeeks — Separation of concerns', url: 'https://www.geeksforgeeks.org/separation-of-concerns-soc/' },
        ],
        interview: [
          { q: 'What is the Law of Demeter?', a: 'The principle of least knowledge: a method should only call methods on itself, its own fields, its parameters, and objects it creates — not on objects returned by other calls. It limits how far a method reaches into the object graph, reducing coupling to foreign internals.' },
          { q: 'What is a "train wreck" and how do you fix it?', a: 'A chain like a.getB().getC().getD() that navigates through several foreign objects, coupling the caller to all of their structures. Fix it by adding a delegating method that hides the chain, or by applying Tell-Don\'t-Ask — telling the nearest object to perform the operation instead of pulling data out.' },
          { q: 'Does the Law of Demeter ban all method chaining?', a: 'No. It targets behavioural coupling to other objects\' internals. Fluent builders, stream/LINQ pipelines, and DTO accessors chain legitimately because each call returns the same conceptual object or simple data, not a foreign object whose internals you depend on.' },
          { q: 'What is Separation of Concerns?', a: 'Decomposing a system into distinct parts that each handle one concern with minimal overlap — e.g. separating presentation, business logic, and data access into layers communicating through interfaces. It lets each concern change and be tested independently.' },
          { q: 'Name designs that embody Separation of Concerns.', a: 'Layered architecture (UI / domain / persistence), MVC and MVVM (separating view, model, and controller/viewmodel), and hexagonal/ports-and-adapters (domain isolated from external adapters). All keep distinct concerns in distinct modules.' },
          { q: 'How do LoD and SoC relate to coupling and cohesion?', a: 'Both are tactics for low coupling and high cohesion: LoD reduces coupling at the object-interaction level by limiting whom a method talks to, and SoC raises cohesion and reduces coupling at the architectural level by isolating concerns into separate modules.' },
        ],
      },
      {
        id: 'lld-grasp',
        topic: 'GRASP Patterns (Responsibility Assignment)',
        summary: 'GRASP gives principled answers to "which class should have this responsibility?"',
        explanation:
          'GRASP — General Responsibility Assignment Software Patterns — is a set of guidelines by Craig Larman for the hardest part of OOD: deciding which class should own which responsibility. While SOLID tells you what good structure looks like, GRASP tells you how to assign methods and data to classes in the first place. The core five for interviews are Information Expert, Creator, Controller, Low Coupling, and High Cohesion.\n\nInformation Expert: assign a responsibility to the class that has the information needed to fulfil it. To compute an order\'s total, the Order (which holds the line items) should do it, not some external service — the object with the data does the work. This keeps behaviour next to data, supporting encapsulation and low coupling. Creator: assign the responsibility of creating an object B to a class A that aggregates/contains B, closely uses B, or has the data to initialise B. An Order creates its LineItems because it aggregates them. This avoids spreading construction logic and keeps creation where the relationship already exists.\n\nController: assign the responsibility of handling a system input/use-case event to a coordinating class that is not the UI — a use-case controller (e.g. OrderController / PlaceOrderHandler) or a facade. This keeps UI thin and routes requests to the domain, separating presentation from logic (it is the C in MVC). Low Coupling and High Cohesion are the same goals you already met — GRASP frames them as evaluative principles you apply to every assignment: prefer the assignment that produces fewer dependencies and more focused classes.\n\nThe other GRASP patterns (Polymorphism, Pure Fabrication, Indirection, Protected Variations) extend the set: Polymorphism handles type-based variation with subtypes instead of conditionals; Pure Fabrication invents a non-domain class (like a Repository or Service) to keep cohesion when no domain class fits; Indirection introduces a mediator to decouple two classes; Protected Variations wraps unstable points behind a stable interface (the generalisation of OCP/DIP). In interviews, naming the GRASP rationale ("by Information Expert, the Cart should compute its own total") is a precise way to justify where you put a method.',
        diagram: `GRASP: who gets the responsibility?

 Information Expert  ── give it to who HAS the data
   ┌──────────────────┐  total() lives on Order,
   │ Order            │  not an external service
   │ - items:LineItem*│  (it owns the items)
   │ +getTotal()      │
   └──────────────────┘

 Creator  ── A creates B if A aggregates/uses B
   Order ◆──► LineItem    Order builds its LineItems

 Controller  ── route system events to a coordinator
   UI ──► OrderController ──► Order (domain)
          (thin UI, logic in domain — the "C" in MVC)

 Evaluators applied to EVERY choice:
   Low Coupling   prefer assignment with fewer deps
   High Cohesion  prefer assignment keeping classes focused

 Also: Polymorphism · Pure Fabrication (Repository) ·
       Indirection (Mediator) · Protected Variations (OCP/DIP)`,
        keyPoints: [
          'GRASP answers "which class should own this responsibility?"',
          'Information Expert: give the task to the class holding the needed data',
          'Creator: class that aggregates/uses/initialises B should create B',
          'Controller: a non-UI coordinator handles system/use-case events (the C in MVC)',
          'Low Coupling + High Cohesion are evaluators applied to every assignment',
          'Extended set: Polymorphism, Pure Fabrication, Indirection, Protected Variations',
        ],
        videos: [
          { label: 'Concept && Coding — OOD Principles (LLD)', url: 'https://www.youtube.com/playlist?list=PL6W8uoQQ2c61X_9e6Net0WdYZidm7zooW' },
          { label: 'ByteByteGo — Channel', url: 'https://www.youtube.com/@ByteByteGo' },
        ],
        links: [
          { label: 'GeeksforGeeks — GRASP', url: 'https://www.geeksforgeeks.org/grasp-design-principles/' },
          { label: 'Wikipedia — GRASP (OOD)', url: 'https://en.wikipedia.org/wiki/GRASP_(object-oriented_design)' },
        ],
        interview: [
          { q: 'What is GRASP and how does it differ from SOLID?', a: 'GRASP (General Responsibility Assignment Software Patterns) is a set of principles for deciding which class should own a given responsibility (data or behaviour). SOLID describes properties of a good structure; GRASP guides how to assign responsibilities to arrive at that structure.' },
          { q: 'What is the Information Expert principle?', a: 'Assign a responsibility to the class that has the information required to fulfil it. For example, an Order that holds the line items should compute its own total, keeping behaviour next to the data it operates on and supporting encapsulation and low coupling.' },
          { q: 'What does the Creator principle say?', a: 'A class A should be responsible for creating instances of B if A aggregates/contains B, closely uses B, or holds the data needed to initialise B. E.g. an Order creates its LineItems because it aggregates them, keeping construction where the relationship already exists.' },
          { q: 'What is the Controller in GRASP?', a: 'A non-UI class that handles a system/use-case input event and coordinates the domain to fulfil it — e.g. an OrderController or PlaceOrderHandler. It keeps the UI thin and routes requests to domain objects; it is the C in MVC.' },
          { q: 'What is Pure Fabrication and when is it used?', a: 'A class that does not represent a domain concept, invented to keep cohesion and coupling healthy when no domain class is a good home for a responsibility — e.g. a Repository for persistence or a Service for cross-entity logic. It avoids polluting domain entities with infrastructure concerns.' },
          { q: 'What is Protected Variations?', a: 'Identify points of likely change or instability and wrap them behind a stable interface so variation on one side does not ripple to clients. It is the general principle behind OCP, DIP, and the use of interfaces/adapters.' },
        ],
      },
    ],
  },
  {
    focus: 'The LLD Interview Approach (Machine Coding Playbook)',
    concepts: [
      {
        id: 'lld-machine-coding-approach',
        topic: 'A Repeatable Process for LLD / Machine-Coding Problems',
        summary: 'A step-by-step recipe: clarify, find nouns & verbs, relate, apply SOLID/patterns, diagram, code.',
        explanation:
          'A machine-coding / LLD round is open-ended on purpose, so the biggest differentiator is having a repeatable process instead of jumping straight to code. The proven sequence is: (1) Clarify requirements and scope, (2) Identify actors and entities (nouns), (3) Define attributes and behaviours (verbs), (4) Establish relationships and multiplicities, (5) Apply SOLID and the right design patterns, (6) Draw the class diagram, (7) Write a clean code skeleton, then (8) Handle concurrency and edge cases. Doing these in order keeps you calm and shows the interviewer a structured mind.\n\nStep 1 — clarify and scope. Never assume. Ask what the system must do, who uses it, and explicitly negotiate scope: "Should I support multiple payment methods? Concurrency? Persistence, or in-memory is fine?" In a 60-90 minute round you must trim aggressively — confirm an in-memory model, a single happy path plus key edge cases, and a couple of extension points. Write the agreed requirements down so you and the interviewer share a contract.\n\nStep 2-4 — model. Pull the nouns from the requirements to find candidate classes/entities (User, Account, Transaction), and the actors (who initiates actions). Pull the verbs to find behaviours/methods (withdraw, transfer, notify). Then connect them: which class HAS-A which (composition/aggregation), which IS-A which (inheritance), and the multiplicities (a User has 1..* Accounts). This noun/verb extraction is the heart of OOD and quickly yields a first-cut model.\n\nStep 5-8 — refine and build. Identify where behaviour varies and apply patterns (Strategy for interchangeable algorithms, Factory for creation, Observer for notifications, State for lifecycle), and sanity-check against SOLID (each class one responsibility? depending on interfaces?). Draw the class diagram so the structure is visible, then translate it into a code skeleton: enums, interfaces, classes with fields and method signatures, filling in core logic first and stubbing the rest. Finally address concurrency (where is shared mutable state? do I need synchronisation or concurrent collections?) and edge cases (invalid input, empty/duplicate, capacity limits). Throughout, narrate your reasoning — interviewers grade your thought process and trade-off discussion as much as the final code.',
        diagram: `LLD / machine-coding pipeline (do in order)

 1 ┌─ Clarify requirements & SCOPE ──────────────┐
   │  ask: who uses it? in-memory? concurrency?   │
   └──────────────────────┬───────────────────────┘
 2 ┌─ NOUNS → actors & entities (candidate classes)┐
 3 ┌─ VERBS  → attributes & behaviours (methods)   ┐
 4 ┌─ Relationships + multiplicity (HAS-A/IS-A,1..*)┐
   └──────────────────────┬───────────────────────┘
 5 ┌─ Apply SOLID + patterns (Strategy/Factory/...) ┐
 6 ┌─ Draw the CLASS DIAGRAM ───────────────────────┐
 7 ┌─ Code skeleton: enums, interfaces, classes ────┐
 8 ┌─ Concurrency + edge cases + (optional) tests ──┐
   └────────────────────────────────────────────────┘
   Narrate trade-offs at every step ──► graded!`,
        keyPoints: [
          'Have a fixed sequence; never jump straight into code',
          'Clarify & negotiate scope first — in-memory, happy path + key edges',
          'Nouns → classes/entities/actors; Verbs → methods/behaviours',
          'Establish HAS-A / IS-A relationships and multiplicities',
          'Apply patterns at variation points; sanity-check against SOLID',
          'Class diagram → skeleton (enums/interfaces/classes) → concurrency & edge cases',
          'Narrate reasoning and trade-offs — the thought process is graded',
        ],
        videos: [
          { label: 'Concept && Coding — Approach to solve LLD interview (Live)', url: 'https://www.youtube.com/watch?v=-UjjfzJ574w' },
          { label: 'Concept && Coding — LLD Playlist', url: 'https://www.youtube.com/playlist?list=PL6W8uoQQ2c61X_9e6Net0WdYZidm7zooW' },
        ],
        links: [
          { label: 'GeeksforGeeks — How to crack LLD interview', url: 'https://www.geeksforgeeks.org/how-to-prepare-for-low-level-design-interviews/' },
          { label: 'refactoring.guru — Design patterns catalog', url: 'https://refactoring.guru/design-patterns/catalog' },
        ],
        interview: [
          { q: 'How do you start a machine-coding / LLD problem?', a: 'By clarifying requirements and negotiating scope before any code — confirm who the users are, what must be supported, and constraints like in-memory vs persistent and whether concurrency matters. Then extract nouns (entities) and verbs (behaviours), establish relationships, and only then design classes and code. A structured process is itself a big part of the score.' },
          { q: 'How do you identify the classes for a system?', a: 'Extract the nouns from the requirements as candidate entities/classes and the actors as initiators, then extract verbs as behaviours/methods. Refine by merging duplicates, dropping non-domain nouns, and assigning each responsibility to the right class (Information Expert).' },
          { q: 'When and how do you bring in design patterns?', a: 'At points where behaviour varies or change is anticipated, not preemptively. Recognise the shape of the problem: interchangeable algorithms → Strategy, object creation by type → Factory, event notification → Observer, lifecycle/state transitions → State. Apply the minimum that solves the requirement (YAGNI).' },
          { q: 'How important is the class diagram in the interview?', a: 'Very — it makes your structure explicit, surfaces missing pieces, and gives the interviewer a contract to react to before you code. Most LLD rounds expect you to present a class diagram with correct relationships and multiplicities before or alongside coding.' },
          { q: 'What do interviewers actually evaluate?', a: 'Beyond working code: a structured approach, a clean class model honouring SOLID, correct use of relationships and patterns, handling of edge cases and concurrency, code readability/extensibility, and crucially the clarity of your reasoning and trade-off discussion throughout.' },
          { q: 'What if you run low on time?', a: 'Prioritise: deliver a compiling skeleton with the core happy path working and clean interfaces, explicitly note the extension points and the edge/concurrency cases you would add next. A coherent partial solution with clear structure beats a sprawling unfinished one.' },
        ],
      },
      {
        id: 'lld-worked-example-coffee-machine',
        topic: 'Worked Walkthrough: Designing a Coffee Machine End-to-End',
        summary: 'Apply the full process to a small problem, ending in a class diagram and skeleton.',
        explanation:
          'Let us apply the playbook to a classic warm-up: design a Coffee Machine that can serve a few recipes (Espresso, Latte, Cappuccino), tracks ingredient inventory, and dispenses a selected drink, rejecting it if ingredients are insufficient. This is small enough to finish but rich enough to show structure.\n\nStep 1, clarify/scope: in-memory, a fixed menu loaded at startup, ingredients are tracked quantities (water, milk, coffee, sugar), a drink can be made only if all its required ingredients are available, and after dispensing the inventory is decremented. Concurrency: assume a single dispensing slot but make the inventory thread-safe in case of concurrent selections. Step 2-3, nouns/verbs: nouns give us CoffeeMachine, Beverage/Recipe, Ingredient, Inventory, and a Button/selection; verbs give us selectBeverage, dispense, hasEnough, deductIngredients, refill.\n\nStep 4-5, relationships and patterns: CoffeeMachine HAS-A Inventory (composition) and HAS-A list of Recipes (each Recipe HAS-A map of Ingredient to quantity). For creating beverages we use a simple Factory (BeverageFactory creates the right Recipe by type), which keeps the machine closed for modification when a new drink is added — adding a recipe is a new entry, not edits to dispensing logic (OCP). We program to interfaces where it helps and keep responsibilities split: Inventory owns ingredient quantities and the hasEnough/deduct logic (Information Expert), Recipe owns its required ingredients, and CoffeeMachine orchestrates (Controller).\n\nStep 6-8, diagram, skeleton, concurrency/edge cases: the class diagram below captures the structure. The skeleton would define an enum BeverageType, a Recipe with Map<Ingredient,Integer> requirements, an Inventory with a thread-safe map plus synchronized hasEnough()/deduct(), a BeverageFactory, and a CoffeeMachine.dispense(type) that asks the inventory whether it has enough, deducts atomically, and returns the beverage or throws InsufficientIngredientsException. Edge cases: unknown beverage type, insufficient ingredients, concurrent dispense of the last unit (handled by synchronising the check-and-deduct as one atomic step so two threads cannot both pass the check). Narrating this — "I synchronise check-and-deduct together to avoid a race on the last unit" — is exactly the senior signal interviewers want.',
        diagram: `Coffee Machine — class diagram (worked example)

 ┌──────────────────────────────┐
 │        CoffeeMachine         │  (Controller)
 ├──────────────────────────────┤
 │ - inventory : Inventory      │◆── owns
 │ - recipes : Map<Type,Recipe> │◆── owns
 ├──────────────────────────────┤
 │ + dispense(t:Type):Beverage  │
 │ + refill(i:Ingredient,q:int) │
 └───────────────┬──────────────┘
        ◆         │         ◆
        ▼                   ▼
 ┌──────────────┐    ┌─────────────────────────┐
 │  Inventory   │    │        Recipe           │
 │ (Info Expert)│    │ - type : BeverageType   │
 ├──────────────┤    │ - needs:Map<Ingredient, │
 │ -stock:Map<  │    │            Integer>     │
 │  Ingredient, │    ├─────────────────────────┤
 │  Integer> (▲ │    │ + getRequirements():Map │
 │ threadsafe)  │    └─────────────────────────┘
 ├──────────────┤              ▲ creates
 │+hasEnough(r) │    ┌─────────┴──────────┐
 │+deduct(r)    │◄── │  BeverageFactory   │ (OCP: add
 │ (synchronized)│   │ +create(t):Recipe  │  recipe = new
 └──────────────┘    └────────────────────┘  entry)

   «enum» BeverageType { ESPRESSO, LATTE, CAPPUCCINO }
   «enum» Ingredient   { WATER, MILK, COFFEE, SUGAR }
   dispense(): synchronized check-and-deduct = atomic
   → InsufficientIngredientsException on shortage`,
        keyPoints: [
          'Scope it: in-memory, fixed menu, decrement inventory, thread-safe stock',
          'Nouns→CoffeeMachine, Recipe, Ingredient, Inventory; verbs→dispense, hasEnough, deduct',
          'CoffeeMachine ◆ Inventory and ◆ Recipes (composition); Recipe holds requirement map',
          'Factory creates recipes → adding a drink is OCP-friendly (new entry, no edits)',
          'Inventory is Information Expert for stock; CoffeeMachine is the Controller',
          'Concurrency: synchronise check-and-deduct as one atomic step (race on last unit)',
          'Edge cases: unknown type, insufficient ingredients → custom exception',
        ],
        videos: [
          { label: 'Concept && Coding — Machine Coding case studies (LLD)', url: 'https://www.youtube.com/playlist?list=PL6W8uoQQ2c61X_9e6Net0WdYZidm7zooW' },
          { label: 'Concept && Coding — Channel', url: 'https://www.youtube.com/@ConceptAndCodingByShrayansh' },
        ],
        links: [
          { label: 'GeeksforGeeks — Design a vending/coffee machine (LLD)', url: 'https://www.geeksforgeeks.org/design-vending-machine-system-using-object-oriented-design-principles/' },
          { label: 'refactoring.guru — Factory Method', url: 'https://refactoring.guru/design-patterns/factory-method' },
        ],
        interview: [
          { q: 'Walk me through designing a coffee machine.', a: 'Clarify scope (in-memory, fixed menu, decrement inventory, thread safety). Nouns give CoffeeMachine, Recipe, Ingredient, Inventory; verbs give dispense/hasEnough/deduct/refill. CoffeeMachine composes an Inventory and Recipes; a BeverageFactory creates recipes. Inventory owns stock and the check/deduct logic (Information Expert); CoffeeMachine orchestrates (Controller). dispense() atomically checks-and-deducts and throws on shortage.' },
          { q: 'Where does the inventory-check logic belong and why?', a: 'On the Inventory class, by the Information Expert principle — it owns the ingredient quantities, so it should answer hasEnough() and perform deduct(). Putting it elsewhere would mean exposing the stock map and scattering the logic, increasing coupling.' },
          { q: 'How would you make adding a new drink easy?', a: 'Drive creation through a BeverageFactory and represent a drink as a Recipe (type + required-ingredients map). Adding a drink means registering a new recipe entry, not editing the dispensing code — satisfying the Open/Closed Principle.' },
          { q: 'What concurrency issue exists and how do you handle it?', a: 'A race on the last unit of an ingredient: two threads could both pass hasEnough() and then both deduct, going negative. Handle it by making check-and-deduct a single atomic operation — synchronise that critical section (or use an atomic compare-and-update) so only one thread succeeds.' },
          { q: 'Which edge cases would you handle?', a: 'Unknown/unsupported beverage type, insufficient ingredients (throw a custom InsufficientIngredientsException), refill of an unknown ingredient, and zero/negative quantities. Each should fail fast with a clear error rather than corrupting state.' },
          { q: 'Which patterns appear in this design and why?', a: 'Factory Method to create recipes by type (decouples creation, supports OCP). If drink preparation steps varied, Template Method or Strategy could model the brew steps. The design also leans on GRASP (Information Expert, Controller) and composition over inheritance for the machine\'s parts.' },
        ],
      },
      {
        id: 'lld-time-management',
        topic: 'Time Management in a 60-90 Minute Machine-Coding Round',
        summary: 'Budget the clock: short on design, most on core code, reserve time for edge cases & demo.',
        explanation:
          'A machine-coding round is as much a time-management test as a design test. Candidates fail not because they cannot design, but because they over-invest in one phase and run out of time with nothing runnable. The fix is a deliberate time budget that you state to yourself (and sometimes the interviewer) at the start.\n\nA solid budget for a 60-90 minute round: spend the first ~10-15% clarifying requirements and fixing scope, ~15-20% on the class design and a quick class diagram, ~45-55% writing the core working code (the happy path of the primary use cases), ~10-15% on edge cases, validation, and concurrency, and the final ~5-10% on a quick demo/driver (a main method showing it works) and cleanup. The single most important rule: get something runnable early. A compiling, demoable core beats an elegant half-written design every time.\n\nScope ruthlessly. When the problem is large (a parking lot, a splitwise, a BookMyShow), pick the 2-3 core use cases and explicitly defer the rest: "I\'ll implement booking and pricing now and leave seat-type variations and refunds as clear extension points." Tell the interviewer what you are deferring and why — that is judgement, not weakness. Build vertically (one full use case end-to-end) rather than horizontally (all entities but nothing working), so you always have a working slice.\n\nKeep code clean as you go because there is rarely time for a big refactor at the end: meaningful names, small methods, enums for fixed sets, interfaces at variation points, and a custom exception or two. Use in-memory collections rather than a real database unless asked. Leave the last few minutes to run your driver, fix the obvious bug it reveals, and verbally list what you would add with more time (persistence, more edge cases, more tests). Communicating that roadmap shows maturity even when the code is incomplete. In short: clarify fast, design briefly, code the core early, harden edges, and always leave time to demonstrate it runs.',
        diagram: `Time budget for a ~75-min machine-coding round

  0    10        25                        65   75
  ├─────┼─────────┼──────────────────────────┼────┤
  │CLAR │ DESIGN  │      CORE  CODE          │EDGE/│
  │+SCOPE│+diagram│  (happy path, vertical)  │DEMO │
  └─────┴─────────┴──────────────────────────┴────┘
   ~15%   ~20%          ~50%                  ~15%

 Rules:
  • Get something RUNNABLE early (compiling core > elegant half)
  • Build VERTICALLY: one full use case end-to-end
  • Scope ruthlessly; state what you DEFER and why
  • Clean as you go (names, enums, small methods) — no
    time for a big refactor at the end
  • Reserve final minutes for a driver/demo + "what's next"`,
        keyPoints: [
          'Treat it as a time-management test; set an explicit budget up front',
          'Rough split: ~15% clarify, ~20% design, ~50% core code, ~15% edges + demo',
          'Get something runnable early — compiling core beats elegant half-design',
          'Build vertically (one full use case) not horizontally (all entities, nothing works)',
          'Scope ruthlessly and announce what you defer and why (shows judgement)',
          'Keep code clean continuously; no time for a final big refactor',
          'Reserve the last minutes for a driver/demo and a "with more time I\'d add..." list',
        ],
        videos: [
          { label: 'Concept && Coding — Approach & time management (Live LLD)', url: 'https://www.youtube.com/watch?v=-UjjfzJ574w' },
          { label: 'Concept && Coding — LLD Playlist', url: 'https://www.youtube.com/playlist?list=PL6W8uoQQ2c61X_9e6Net0WdYZidm7zooW' },
        ],
        links: [
          { label: 'GeeksforGeeks — Machine coding round preparation', url: 'https://www.geeksforgeeks.org/how-to-prepare-for-low-level-design-interviews/' },
          { label: 'refactoring.guru — Design patterns catalog', url: 'https://refactoring.guru/design-patterns/catalog' },
        ],
        interview: [
          { q: 'How do you manage time in a machine-coding round?', a: 'Set an explicit budget: roughly 15% clarifying and scoping, 20% class design and a quick diagram, 50% writing the core happy-path code, and 15% for edge cases, concurrency, and a demo. The overriding rule is to get something runnable early — a compiling core beats an unfinished elegant design.' },
          { q: 'Should you build all entities first or one use case end-to-end?', a: 'Build vertically — implement one full use case end-to-end so you always have a working slice — rather than horizontally creating every entity with nothing actually working. Vertical progress de-risks the round and gives you something to demo at any point.' },
          { q: 'What do you do when the problem is too big to finish?', a: 'Scope ruthlessly: pick the 2-3 core use cases, implement them well, and explicitly tell the interviewer what you are deferring and why, leaving clear extension points. Announcing deliberate trade-offs demonstrates judgement, not weakness.' },
          { q: 'Why keep code clean throughout instead of refactoring at the end?', a: 'Because there is rarely time for a large refactor at the end. Continuously using good names, small methods, enums for fixed sets, and interfaces at variation points keeps the code reviewable and extensible without a risky late cleanup.' },
          { q: 'How should you spend the final minutes?', a: 'Run a small driver/main to demonstrate the core works, fix the obvious bug it exposes, and verbally outline what you would add with more time (persistence, more edge cases, tests). Showing a working demo plus a clear roadmap leaves a strong final impression.' },
          { q: 'Is finishing everything required to do well?', a: 'No. Interviewers value a clean, well-structured, runnable core with sound design and clear reasoning over a sprawling incomplete attempt. A coherent partial solution with explicit next steps usually scores better than unfinished breadth.' },
        ],
      },
    ],
  },
]
