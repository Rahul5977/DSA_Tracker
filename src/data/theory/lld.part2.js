// LLD theory — Part 2 (Days 6-10): GoF Creational & Structural design patterns.
// Authored for SDE placement interview prep. Schema mirrors the theory modules
// consumed by ./index.js: each day = { focus, concepts: [...] }.
// Diagram-driven: every pattern ships an ASCII UML class diagram.

export const DAYS = [
  {
    focus: 'Creational Patterns I — Singleton & Factory Method',
    concepts: [
      {
        id: 'lld-singleton',
        topic: 'Singleton Pattern',
        summary: 'Guarantees a class has exactly one instance and gives a global access point to it.',
        explanation:
          'Intent: ensure a class has only one instance and provide a single, global point of access to that instance. The Singleton solves two problems at once. First, it controls instantiation so that no matter how many times client code asks for the object, it always receives the same one — useful when a single shared resource must coordinate the whole system (a logger, a configuration registry, a connection pool, a hardware driver). Second, it offers a clean, well-known access point instead of passing the object through every layer or scattering global variables.\n\nStructure and participants: there is a single class, Singleton, with (1) a private static field holding the sole instance, (2) a private constructor so no external code can call `new`, and (3) a public static factory method (commonly `getInstance()`) that creates the instance on first call and returns the cached instance thereafter. The class is responsible both for being a normal class and for managing its own lifecycle — which is also the chief criticism, since it mixes business logic with creation/lifecycle control (a violation of the Single Responsibility Principle).\n\nThread safety is the classic interview trap. A naive lazy implementation (`if (instance == null) instance = new Singleton()`) is broken under concurrency: two threads can both see null and create two instances. The fixes, from simplest to best: (a) Eager initialization — `private static final Singleton INSTANCE = new Singleton();` — thread-safe via class loading but constructs even if never used. (b) Synchronized accessor — `synchronized getInstance()` — correct but locks on every call, slow. (c) Double-Checked Locking — check null, synchronize, check again, with the field marked `volatile` to prevent the half-constructed-object reordering bug. (d) Bill Pugh / initialization-on-demand holder idiom — a private static inner class holds the instance; the JVM loads the holder lazily and thread-safely with no locking. (e) Enum singleton (Joshua Bloch\'s recommendation) — `enum Singleton { INSTANCE; }` — concise, free thread safety, and the only form safe against reflection and serialization attacks.\n\nReal-world analogy: a country has exactly one official government; whoever you ask, you are routed to the same single authority. Concrete example — a database connection pool or an application Logger: you want one shared pool guarding a fixed set of connections, and one logger writing to one file, so a Singleton naturally models "there is exactly one of these".\n\nWhen to use: exactly one instance is genuinely required and that instance needs a global access point (config, cache, registry, pool, logging). Pros: controlled single access, lazy initialization possible, saves memory, global coordination. Cons / why it is often called an anti-pattern: it acts as a global variable (hidden dependencies, hard to reason about), tightly couples callers to a concrete class, makes unit testing painful (you cannot easily mock or reset global state between tests), can hide poor design, and needs special care to stay correct under concurrency, serialization, reflection, and multiple classloaders. Modern guidance: prefer dependency injection to manage a single shared instance (scope = singleton in the DI container) rather than the hard-coded Singleton pattern, which preserves "one instance" without the global-state pain.',
        diagram: `         ┌─────────────────────────────────────┐
         │             Singleton               │
         ├─────────────────────────────────────┤
         │ - instance : Singleton  {static}    │◄──┐
         │ - data : ...                        │   │ returns the
         ├─────────────────────────────────────┤   │ same self
         │ - Singleton()        {private ctor} │   │ instance
         │ + getInstance() : Singleton {static}│───┘
         │ + businessMethod() : void           │
         └─────────────────────────────────────┘
                          ▲
                          │ uses (via getInstance)
                  ┌───────────────┐
                  │    Client     │
                  └───────────────┘

  getInstance():
    if (instance == null)            // lazy
        instance = new Singleton()   // guard for threads!
    return instance`,
        keyPoints: [
          'Intent: exactly one instance + a global access point',
          'Mechanics: private static instance, private constructor, public static getInstance()',
          'Thread-safe variants: eager, synchronized, double-checked locking (volatile), Bill Pugh holder, enum',
          'Enum singleton is safest (handles serialization & reflection) per Effective Java',
          'Real use: logger, config registry, connection pool, cache',
          'Often an anti-pattern: global state, hidden deps, hard to test — prefer DI-scoped singletons',
        ],
        videos: [
          { label: 'Geekific — Singleton Pattern in Java', url: 'https://www.youtube.com/watch?v=tSZn4wkBIu8' },
          { label: 'Concept && Coding — LLD playlist', url: 'https://www.youtube.com/playlist?list=PL6W8uoQQ2c61X_9e6Net0WdYZidm7zooW' },
        ],
        links: [
          { label: 'refactoring.guru — Singleton', url: 'https://refactoring.guru/design-patterns/singleton' },
          { label: 'GeeksforGeeks — Singleton', url: 'https://www.geeksforgeeks.org/singleton-design-pattern/' },
        ],
        interview: [
          { q: 'How do you make a Singleton thread-safe?', a: 'Options: eager initialization (final static field built at class load), a synchronized getInstance (correct but slow), double-checked locking with a volatile instance field (lock only on first creation), the Bill Pugh static-holder idiom (lazy, lock-free via class loading), or an enum singleton. Double-checked locking and the holder idiom are the usual interview answers; enum is the most robust.' },
          { q: 'Why does double-checked locking need volatile?', a: 'Without volatile, the write that publishes the new instance can be reordered so another thread sees a non-null but not-yet-fully-constructed object. volatile establishes a happens-before relationship and forbids that reordering, so threads either see null or a fully built instance.' },
          { q: 'Is Singleton an anti-pattern?', a: 'It is widely criticized: it is effectively global state, it hides dependencies, it tightly couples clients to a concrete class, and it makes testing hard because you cannot easily mock or reset it. It is fine when a single instance is truly required, but for shared instances most modern code prefers dependency injection with a singleton scope instead of the hard-coded pattern.' },
          { q: 'How can a Singleton be broken, and how do you defend it?', a: 'Reflection can call the private constructor, serialization/deserialization can create a second instance, and multiple classloaders can each hold one. Defenses: throw from the constructor if an instance already exists, implement readResolve() to return the existing instance, or simply use an enum singleton, which the JVM guarantees against all three.' },
          { q: 'Why is an enum the best way to implement Singleton in Java?', a: 'An enum gives a single instance for free, is inherently thread-safe at class load, and is automatically protected against serialization and reflection attacks. The drawback is it cannot extend another class and is less flexible for lazy initialization.' },
          { q: 'Singleton vs static class — what is the difference?', a: 'A Singleton is a real object: it can implement interfaces, be passed as a parameter, be lazily created, be subclassed, and be swapped via DI. A static utility class is just a namespace of static methods with no instance, no polymorphism, and no lazy lifecycle. Use a Singleton when you need object behavior or to pass it around; static is for stateless helpers.' },
        ],
      },
      {
        id: 'lld-factory-method',
        topic: 'Factory Method Pattern',
        summary: 'Defines an interface for creating an object but lets subclasses decide which class to instantiate.',
        explanation:
          'Intent: define a method for creating objects, but let subclasses (or implementations) decide which concrete class to instantiate. The Factory Method moves the `new` out of client code and behind a method so that adding a new product type does not require editing the consumers. The core idea: program to an interface for both the product and its creation.\n\nThe problem it solves: imagine code littered with `new EmailNotification()`. The day you add SMS and Push, every call site must change with `if/else` or `switch` on type — a violation of the Open/Closed Principle. The Factory Method centralizes that decision in one overridable place. Clients call `creator.notify()` (or `factory.create(type)`) and receive a `Notification` without knowing or caring which concrete subclass came back.\n\nStructure and participants: (1) Product — the interface/abstract type returned (e.g. `Notification`). (2) ConcreteProduct — the actual implementations (`EmailNotification`, `SmsNotification`). (3) Creator — declares the factory method `createProduct()` returning a Product, and usually contains core logic that uses the product. (4) ConcreteCreator — overrides the factory method to return a specific ConcreteProduct. A common simpler cousin seen in interviews is the "Simple Factory": a single class with a `create(type)` method containing a switch — technically not a GoF pattern but a frequent starting point.\n\nHow it works: the Creator never references concrete products; it depends only on the Product interface and calls its own factory method. Subclasses customize the product by overriding that one method. This is the Hollywood principle in miniature: the base flow is fixed, the creation step is deferred to subclasses. Real-world analogy: a logistics company has a `planDelivery()` workflow but the `createTransport()` step is overridden — RoadLogistics builds a Truck, SeaLogistics builds a Ship — while the surrounding planning code is identical.\n\nConcrete example — a NotificationFactory: `Notification n = NotificationFactory.create("SMS"); n.send("hi");`. Adding WhatsApp means writing one new ConcreteProduct and one factory branch; no consumer changes. When to use: a class cannot anticipate which objects it must create, you want to decouple construction from use, or you want to give subclasses a hook to choose the product. Pros: removes tight coupling to concrete classes, honours Open/Closed and Single Responsibility (creation lives in one place), and centralizes complex construction. Cons: introduces extra subclasses/indirection, and a Simple Factory still violates OCP because its switch must be edited for each new type. Factory Method is the per-product, subclass-driven version; the next step up, when you must create whole families of related products, is the Abstract Factory.',
        diagram: `   ┌────────────────────┐        ┌─────────────────────┐
   │     Creator        │ create │     <<interface>>   │
   ├────────────────────┤ ─────► │       Product       │
   │ + factoryMethod()  │        ├─────────────────────┤
   │ + someOperation()  │        │ + operation()       │
   └────────────────────┘        └─────────────────────┘
            △                               △
            │ extends                       │ implements
   ┌────────────────────┐        ┌─────────────────────┐
   │  ConcreteCreator   │ create │  ConcreteProduct    │
   ├────────────────────┤ ─────► ├─────────────────────┤
   │ + factoryMethod()  │        │ + operation()       │
   └────────────────────┘        └─────────────────────┘

  someOperation() {
    Product p = factoryMethod()   // subclass decides type
    p.operation()                 // works on the abstraction
  }`,
        keyPoints: [
          'Intent: delegate object creation to a method subclasses can override',
          'Participants: Product, ConcreteProduct, Creator, ConcreteCreator',
          'Removes new from client code → honours Open/Closed Principle',
          'Real example: NotificationFactory (Email/SMS/Push), logistics planDelivery + createTransport',
          'Simple Factory (one switch) is a cousin, not true GoF, still violates OCP',
          'Pros: decoupling, single place for construction; Cons: extra subclasses/indirection',
        ],
        videos: [
          { label: 'Geekific — Factory Method in Java', url: 'https://www.youtube.com/watch?v=EdFq_JIThqM' },
          { label: 'Christopher Okhravi — Design Patterns playlist', url: 'https://www.youtube.com/playlist?list=PLrhzvIcii6GNjpARdnO4ueTUAVR9eMBpc' },
        ],
        links: [
          { label: 'refactoring.guru — Factory Method', url: 'https://refactoring.guru/design-patterns/factory-method' },
          { label: 'GeeksforGeeks — Factory Method', url: 'https://www.geeksforgeeks.org/factory-method-for-designing-pattern/' },
        ],
        interview: [
          { q: 'What problem does the Factory Method solve?', a: 'It removes hard-coded new calls from client code so that introducing new product types does not force you to modify every consumer. Creation is centralized behind an overridable method, keeping clients coupled only to the product interface and honouring the Open/Closed Principle.' },
          { q: 'What is the difference between Simple Factory and Factory Method?', a: 'Simple Factory is one class with a create(type) method containing a switch — easy but it must be edited for every new type (violates OCP) and is not a GoF pattern. Factory Method defines a creation method that subclasses override to choose the concrete product, so you extend by adding a subclass rather than editing existing code.' },
          { q: 'When would you use Factory Method vs Abstract Factory?', a: 'Use Factory Method when you need to create one product whose concrete type is decided by a subclass. Use Abstract Factory when you need to create whole families of related products (e.g. a matching Button + Checkbox + Menu for a given OS theme) consistently together.' },
          { q: 'How does Factory Method support the Open/Closed Principle?', a: 'Because clients depend on the abstract Product and call the factory method, you can add a new ConcreteProduct plus a new ConcreteCreator without touching existing client code — the system is open for extension but closed for modification.' },
          { q: 'What are the downsides of the Factory Method?', a: 'It increases the number of classes and adds a layer of indirection, which can be overkill for simple cases. A Simple Factory variant still centralizes a switch that must change for each new type, so it does not fully satisfy OCP.' },
        ],
      },
    ],
  },
  {
    focus: 'Creational Patterns II — Abstract Factory, Builder, Prototype',
    concepts: [
      {
        id: 'lld-abstract-factory',
        topic: 'Abstract Factory Pattern',
        summary: 'Creates families of related objects without specifying their concrete classes.',
        explanation:
          'Intent: provide an interface for creating families of related or dependent objects without specifying their concrete classes. Where the Factory Method makes one product, the Abstract Factory makes a whole set of products that are designed to work together, and guarantees that everything produced belongs to the same family.\n\nThe problem it solves: suppose you build a cross-platform UI. On Windows you need a WindowsButton, WindowsCheckbox, WindowsMenu; on macOS a MacButton, MacCheckbox, MacMenu. If client code created widgets directly, you could accidentally mix a Mac button with a Windows checkbox, and every screen would be full of platform `if/else`. The Abstract Factory packages "all widgets for one look-and-feel" behind a single factory interface so the rest of the app stays platform-agnostic and internally consistent.\n\nStructure and participants: (1) AbstractFactory — declares creation methods, one per product kind (`createButton()`, `createCheckbox()`). (2) ConcreteFactory — implements those for one family (`WindowsFactory`, `MacFactory`). (3) AbstractProduct — interfaces for each product (`Button`, `Checkbox`). (4) ConcreteProduct — family-specific implementations. (5) Client — works only with the abstract factory and abstract product interfaces; it is handed a concrete factory once (e.g. chosen by config) and never names a concrete product after that.\n\nHow it works: pick the concrete factory at startup based on environment/config, then pass that factory around. Every product the client creates through it is guaranteed to belong to the same family, eliminating mismatch bugs. Internally, an Abstract Factory is frequently implemented using a set of Factory Methods — they compose naturally. Real-world analogy: a furniture company offers complete styles — Victorian, Modern, ArtDeco — and each style provides a matching Chair, Sofa, and CoffeeTable; you order from one style factory and everything coordinates.\n\nConcrete example: `GUIFactory factory = isMac ? new MacFactory() : new WindowsFactory(); Button b = factory.createButton(); Checkbox c = factory.createCheckbox();`. When to use: your system must be independent of how its products are created and composed, you work with multiple families of products, and you must enforce that products from one family are used together. Pros: guarantees compatibility among produced objects, isolates concrete classes, makes swapping the whole family trivial (one line at startup), honours OCP and SRP. Cons: adding a brand-new product kind means changing the AbstractFactory interface and every concrete factory (so it is rigid about new product types), and it adds many interfaces/classes — significant boilerplate for small problems.',
        diagram: `        ┌──────────────────────────┐
        │   <<interface>>          │
        │     GUIFactory           │
        ├──────────────────────────┤
        │ + createButton(): Button │
        │ + createCheckbox():Checkbx│
        └──────────────────────────┘
               △            △
       implements│          │implements
  ┌────────────────┐  ┌────────────────┐
  │ WindowsFactory │  │   MacFactory   │
  └────────────────┘  └────────────────┘
        │ creates            │ creates
        ▼                    ▼
  ┌──────────────┐     ┌──────────────┐
  │<<interface>> │     │<<interface>> │
  │   Button     │     │  Checkbox    │
  └──────────────┘     └──────────────┘
        △  △                △  △
   ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
   │WinBtn  │ │MacBtn  │ │WinChk  │ │MacChk  │
   └────────┘ └────────┘ └────────┘ └────────┘`,
        keyPoints: [
          'Intent: create families of related products with a guaranteed consistent set',
          'Participants: AbstractFactory, ConcreteFactory, AbstractProduct, ConcreteProduct, Client',
          'Often built from several Factory Methods working together',
          'Real example: cross-platform GUI toolkit (Win/Mac), themed furniture sets',
          'Pros: enforces family compatibility, swap whole family in one line, isolates concretes',
          'Cons: adding a new product kind changes every factory; lots of classes',
        ],
        videos: [
          { label: 'Geekific — Design Patterns playlist', url: 'https://www.youtube.com/playlist?list=PLlsmxlJgn1HJpa28yHzkBmUY-Ty71ZUGc' },
          { label: 'Christopher Okhravi — Design Patterns playlist', url: 'https://www.youtube.com/playlist?list=PLrhzvIcii6GNjpARdnO4ueTUAVR9eMBpc' },
        ],
        links: [
          { label: 'refactoring.guru — Abstract Factory', url: 'https://refactoring.guru/design-patterns/abstract-factory' },
          { label: 'GeeksforGeeks — Abstract Factory', url: 'https://www.geeksforgeeks.org/abstract-factory-pattern/' },
        ],
        interview: [
          { q: 'How is Abstract Factory different from Factory Method?', a: 'Factory Method creates a single product and uses inheritance (a subclass overrides one creation method). Abstract Factory creates families of related products and uses composition (the client holds a factory object whose methods create each product in the family). Abstract Factory is often implemented as a bundle of Factory Methods.' },
          { q: 'When would you choose Abstract Factory?', a: 'When your code must work with multiple families of related products and you need to guarantee that products from the same family are used together — e.g. a cross-platform UI where all widgets must match one look-and-feel, or DB drivers where connection, command, and reader must come from one vendor.' },
          { q: 'What is the main weakness of Abstract Factory?', a: 'Adding a new kind of product (not a new family, but a new product type) forces a change to the AbstractFactory interface and every concrete factory that implements it. So it is open to new families but closed to new product kinds, and it generates a lot of interfaces and classes.' },
          { q: 'How does Abstract Factory enforce consistency between objects?', a: 'Because all products come from a single concrete factory representing one family, you cannot accidentally combine, say, a Windows button with a Mac scrollbar — the factory only ever returns members of its own family.' },
          { q: 'Can Abstract Factory be combined with Singleton?', a: 'Yes, commonly. The concrete factory is often stateless, so a single instance is enough; it is frequently exposed as a Singleton (or a DI-scoped singleton) and shared throughout the app.' },
        ],
      },
      {
        id: 'lld-builder',
        topic: 'Builder Pattern',
        summary: 'Constructs a complex object step by step, separating construction from representation.',
        explanation:
          'Intent: separate the construction of a complex object from its representation so that the same construction process can create different representations, and so that objects with many optional parts can be assembled step by step without a monstrous constructor.\n\nThe problem it solves: the "telescoping constructor" anti-pattern. When an object has many fields, some required and many optional, you end up with `new Pizza(12, true, false, true, false, true, ...)` — unreadable, error-prone (which boolean was extra cheese?), and an explosion of overloaded constructors. The Builder replaces that with fluent, named steps: `new Pizza.Builder().size(12).cheese().pepperoni().build()`. It also lets you create immutable objects: the builder accumulates state and the final `build()` produces a fully-formed, unmodifiable instance.\n\nStructure and participants: (1) Product — the complex object being built (e.g. `HttpRequest`, `Pizza`, `Computer`). (2) Builder — interface declaring step methods (`setSize`, `addTopping`) and a `build()`/`getResult()`. (3) ConcreteBuilder — implements the steps, keeps the part being assembled, and returns the finished product. (4) Director (optional) — encapsulates a specific construction recipe (e.g. `buildMargherita(builder)`), so common configurations are reusable; in the popular fluent/inner-static-class Java style the Director is often omitted and the client drives the builder directly. (5) Client — creates a builder, invokes steps, calls build().\n\nHow it works: each step method configures one aspect and (in the fluent style) returns `this` to allow chaining; `build()` validates and assembles the final object. Because construction logic lives in the builder rather than the product or the client, you can produce several representations with the same steps, and you can vary the order of optional steps freely. Real-world analogy: ordering a custom Subway sandwich — you walk the line choosing bread, then meat, then veggies, then sauces, and at the end you receive the assembled sandwich; the assembly process is the same, the result varies.\n\nConcrete examples: building an HTTP request (`Request.builder().url(u).header(k,v).method("POST").body(b).build()`), the classic `StringBuilder`, Java\'s `Stream.Builder`, Lombok\'s `@Builder`, and a `Pizza`/`Computer` configurator. When to use: an object needs many optional parameters, you want immutability, construction is multi-step or order-sensitive, or the same process should yield different products. Pros: readable named parameters, immutable results, no telescoping constructors, isolates complex construction, can reuse construction recipes via a Director. Cons: more code (a separate builder class), and overkill for simple objects with few fields.',
        diagram: `  ┌──────────┐ directs ┌────────────────────────┐
  │ Director │────────►│   <<interface>> Builder│
  ├──────────┤         ├────────────────────────┤
  │ construct│         │ + buildPartA()         │
  └──────────┘         │ + buildPartB()         │
                       │ + getResult(): Product │
                       └────────────────────────┘
                                  △
                          implements│
                       ┌────────────────────────┐
                       │   ConcreteBuilder      │
                       ├────────────────────────┤
                       │ - product : Product    │
                       │ + buildPartA()         │
                       │ + buildPartB()         │
                       │ + getResult(): Product │
                       └────────────────────────┘
                                  │ creates
                                  ▼
                          ┌────────────────┐
                          │    Product     │  (immutable)
                          └────────────────┘

  // fluent style:
  Pizza p = new Pizza.Builder()
        .size(12).cheese().pepperoni().build()`,
        keyPoints: [
          'Intent: build a complex object step by step, decoupling construction from representation',
          'Kills the telescoping-constructor anti-pattern; enables immutable objects',
          'Participants: Product, Builder, ConcreteBuilder, optional Director, Client',
          'Fluent variant: each step returns this; build() validates and returns the product',
          'Real examples: StringBuilder, HTTP request builder, Lombok @Builder, Pizza/Computer config',
          'Pros: readable, immutable, reusable recipes; Cons: extra class, overkill for simple objects',
        ],
        videos: [
          { label: 'Geekific — Design Patterns playlist', url: 'https://www.youtube.com/playlist?list=PLlsmxlJgn1HJpa28yHzkBmUY-Ty71ZUGc' },
          { label: 'Concept && Coding — LLD playlist', url: 'https://www.youtube.com/playlist?list=PL6W8uoQQ2c61X_9e6Net0WdYZidm7zooW' },
        ],
        links: [
          { label: 'refactoring.guru — Builder', url: 'https://refactoring.guru/design-patterns/builder' },
          { label: 'GeeksforGeeks — Builder', url: 'https://www.geeksforgeeks.org/builder-design-pattern/' },
        ],
        interview: [
          { q: 'What problem does the Builder pattern solve?', a: 'It solves the telescoping-constructor problem: objects with many optional fields would otherwise need huge, ambiguous constructors or many overloads. Builder lets you set parts via readable, named, chainable steps and produce an immutable, fully-validated object at build() time.' },
          { q: 'What is the role of the Director in Builder?', a: 'The Director encapsulates a reusable construction recipe — it knows the sequence of build steps for a particular configuration (e.g. build a sports car) and drives the builder. It is optional; in the common fluent Java style the client itself plays the director and chains the steps directly.' },
          { q: 'How does Builder help create immutable objects?', a: 'All mutable accumulation happens inside the builder. The product can keep its fields final and expose no setters; only build() constructs it, passing all values once through a private constructor, so the resulting object cannot be changed afterwards.' },
          { q: 'Builder vs Factory — when do you use which?', a: 'A factory returns an object in one call and is about choosing/creating the right type. A builder is about constructing one complex object in multiple configurable steps. Use a factory when creation is a single decision; use a builder when there are many optional parameters or a multi-step assembly.' },
          { q: 'Give real-world examples of Builder in standard libraries.', a: 'Java StringBuilder/StringBuffer, java.util.stream.Stream.Builder, java.time formatters, OkHttp Request.Builder, Lombok @Builder, and Protocol Buffers message builders all use the pattern.' },
          { q: 'What are the drawbacks of Builder?', a: 'It adds a separate builder class (more code and a parallel structure to maintain), and for simple objects with few, mostly required fields it is unnecessary ceremony where a plain constructor would be clearer.' },
        ],
      },
      {
        id: 'lld-prototype',
        topic: 'Prototype Pattern',
        summary: 'Creates new objects by cloning an existing instance instead of building from scratch.',
        explanation:
          'Intent: specify the kinds of objects to create using a prototypical instance, and create new objects by copying (cloning) this prototype. Rather than calling a constructor and reconfiguring an object from zero, you take an already-configured object and ask it to produce a copy of itself.\n\nThe problem it solves: sometimes constructing an object is expensive (heavy initialization, a database/network call, costly computation) or the client should not need to know the concrete class to make a copy. If you already have a fully-built object, cloning it can be far cheaper and decouples the client from concrete classes. Prototype also lets you add and remove product types at runtime simply by registering or unregistering prototypes, and it sidesteps the subclass explosion that a factory hierarchy might otherwise require.\n\nStructure and participants: (1) Prototype — an interface declaring a `clone()` method. (2) ConcretePrototype — implements clone() to copy itself (typically returning a new object with the same field values). (3) Client — creates new objects by calling `clone()` on a prototype it holds, without referencing the concrete type. A common addition is a Prototype Registry (a map of name → prototype) so clients fetch and clone preconfigured prototypes by key.\n\nThe central subtlety — shallow vs deep copy. A shallow copy duplicates the top-level object but shares references to nested objects, so mutating a nested object in the clone also affects the original. A deep copy recursively clones nested objects so the clone is fully independent. In Java, `Object.clone()` with `Cloneable` does a shallow copy by default; deep copies require overriding clone() to recursively copy mutable members, or using copy constructors or serialization. This shallow-vs-deep question is the most common Prototype interview point.\n\nReal-world analogy: a biological cell dividing — mitosis produces a copy of an existing cell rather than assembling one from raw molecules. Concrete example: a graphics editor where the user copies a complex Shape (with style, transforms, sub-shapes) and pastes duplicates — each paste is `shape.clone()`; or game development cloning a fully-configured enemy/tree prototype many times. When to use: object creation is costly, you want to avoid subclasses of a creator, you must copy objects whose concrete classes are unknown to the client, or you need many similar objects from a configured template. Pros: cheaper than building from scratch, decouples client from concrete classes, can add/remove types at runtime, reduces subclassing. Cons: cloning objects with circular references or deep nested graphs is tricky, and getting deep copies right (and copying private state) can be error-prone.',
        diagram: `        ┌──────────────────────────┐
        │   <<interface>>          │
        │      Prototype           │
        ├──────────────────────────┤
        │ + clone() : Prototype    │◄───┐
        └──────────────────────────┘    │ returns a
                   △                     │ copy of self
           implements│                   │
        ┌──────────────────────────┐    │
        │   ConcretePrototype      │────┘
        ├──────────────────────────┤
        │ - field1, field2 ...     │
        │ + clone() : Prototype    │
        └──────────────────────────┘
                   ▲
                   │ clones (no concrete type)
            ┌──────────────┐    ┌───────────────────┐
            │    Client    │───►│ PrototypeRegistry │
            └──────────────┘    │  map<key,proto>   │
                                └───────────────────┘

  shallow copy → nested refs shared
  deep copy    → nested objects cloned too`,
        keyPoints: [
          'Intent: create objects by cloning a configured prototype, not by new + reconfigure',
          'Useful when construction is expensive or concrete class is unknown to the client',
          'Participants: Prototype (clone()), ConcretePrototype, Client, optional Registry',
          'Shallow copy shares nested refs; deep copy clones the whole graph — key interview point',
          'Java: Cloneable/Object.clone() is shallow; deep copy needs override/copy-ctor/serialization',
          'Pros: cheap copies, runtime type registration, fewer subclasses; Cons: deep-copy & cycles are tricky',
        ],
        videos: [
          { label: 'Geekific — Design Patterns playlist', url: 'https://www.youtube.com/playlist?list=PLlsmxlJgn1HJpa28yHzkBmUY-Ty71ZUGc' },
          { label: 'Christopher Okhravi — Design Patterns playlist', url: 'https://www.youtube.com/playlist?list=PLrhzvIcii6GNjpARdnO4ueTUAVR9eMBpc' },
        ],
        links: [
          { label: 'refactoring.guru — Prototype', url: 'https://refactoring.guru/design-patterns/prototype' },
          { label: 'GeeksforGeeks — Prototype', url: 'https://www.geeksforgeeks.org/prototype-design-pattern/' },
        ],
        interview: [
          { q: 'What is the difference between a shallow copy and a deep copy?', a: 'A shallow copy duplicates the outer object but its reference fields still point to the same nested objects as the original, so changing a nested object affects both. A deep copy recursively clones nested objects too, making the clone completely independent of the original.' },
          { q: 'When would you prefer Prototype over a Factory?', a: 'When creating an object from scratch is expensive (heavy init, IO, computation) and you already have a configured instance to copy, or when the client should clone objects without knowing their concrete classes. Prototype copies a live object; a factory builds a new one and may require knowing the type.' },
          { q: 'How do you implement a deep copy in Java?', a: 'Override clone() to recursively clone each mutable reference field, or use a copy constructor that deep-copies members, or serialize and deserialize the object (e.g. via byte streams or a library). The default Object.clone() with Cloneable only performs a shallow copy.' },
          { q: 'What problems can arise when cloning objects?', a: 'Circular references can cause infinite recursion in naive deep copies; shared mutable state can leak if you accidentally shallow-copy; final fields and private state may be hard to copy; and clone() in Java has well-known design flaws (it bypasses constructors and requires careful casting).' },
          { q: 'What is a Prototype Registry?', a: 'A registry is a store (often a map of key to prototype) holding preconfigured prototype instances. Clients request a prototype by key and clone it, which centralizes the set of available templates and lets you add or remove product variants at runtime without changing client code.' },
        ],
      },
    ],
  },
  {
    focus: 'Structural Patterns I — Adapter, Bridge, Composite',
    concepts: [
      {
        id: 'lld-adapter',
        topic: 'Adapter Pattern',
        summary: 'Converts the interface of a class into another interface clients expect, so incompatible types can work together.',
        explanation:
          'Intent: convert the interface of a class into another interface that clients expect. Adapter lets classes work together that otherwise could not because of incompatible interfaces — it is the software equivalent of a power-plug travel adapter or a card reader.\n\nThe problem it solves: you have existing client code that expects a certain interface (the Target), and you have a useful class — often a legacy class or a third-party library — whose interface does not match (the Adaptee). You cannot or do not want to change either side. The Adapter sits in the middle, implements the Target interface the client wants, holds a reference to the Adaptee, and translates each call: it receives a request in the client\'s vocabulary and re-expresses it in the Adaptee\'s vocabulary (converting method names, parameters, and data formats as needed).\n\nStructure and participants: (1) Target — the interface the client uses (e.g. `JsonReportGenerator`). (2) Adaptee — the existing/incompatible class (e.g. a legacy `XmlDataProvider`). (3) Adapter — implements Target and wraps an Adaptee, translating calls. (4) Client — works only against Target. There are two flavours: the Object Adapter uses composition (the adapter holds an instance of the adaptee) — the dominant, more flexible form usable in any OO language; and the Class Adapter uses multiple inheritance (the adapter extends both Target and Adaptee) — only possible where multiple inheritance exists (e.g. C++; in Java you can extend the adaptee and implement the target interface).\n\nHow it works: the client calls a Target method on the adapter; the adapter calls one or more Adaptee methods and converts the result back into what the Target contract promises. Real-world analogy: a traveller with a US laptop charger in Europe uses a plug adapter that physically fits the European socket and passes power through to the US plug — neither the socket nor the charger changes; the adapter bridges them.\n\nConcrete example: your reporting system calls `analytics.generate(jsonData)` but a vendor library only understands XML. You write `XmlToJsonAdapter implements JsonReportGenerator` that wraps the vendor object, converts JSON to XML on the way in (and XML to JSON on the way out). In the JDK, `java.util.Arrays.asList()` and `InputStreamReader` (bytes→chars) are adapter-style bridges. When to use: you must use an existing class with an incompatible interface, you want to reuse legacy or third-party code, or you need several existing subclasses to gain a common interface. Pros: reuses existing code without modifying it, separates interface-conversion from business logic (SRP), and honours OCP (add new adapters without touching clients). Cons: adds extra classes and an indirection layer; if many incompatibilities exist it can proliferate adapters.',
        diagram: `  ┌──────────┐ uses  ┌────────────────────────┐
  │  Client  │──────►│   <<interface>> Target │
  └──────────┘       ├────────────────────────┤
                     │ + request()            │
                     └────────────────────────┘
                                 △
                         implements│
                     ┌────────────────────────┐
                     │        Adapter         │
                     ├────────────────────────┤
                     │ - adaptee : Adaptee    │◆──┐
                     │ + request()            │   │ holds
                     └────────────────────────┘   │ (composition)
                                 │ translates      │
                                 ▼                 │
                     ┌────────────────────────┐    │
                     │       Adaptee          │◄───┘
                     ├────────────────────────┤
                     │ + specificRequest()    │
                     └────────────────────────┘

  request() {  adaptee.specificRequest()  }  // converts call`,
        keyPoints: [
          'Intent: make two incompatible interfaces work together via a translator',
          'Participants: Target (wanted), Adaptee (incompatible), Adapter (wraps + translates), Client',
          'Object Adapter = composition (preferred); Class Adapter = inheritance',
          'Real examples: power-plug adapter, XML↔JSON wrapper, legacy/3rd-party libs, InputStreamReader',
          'Pros: reuse existing code unmodified, separates conversion logic (SRP/OCP)',
          'Cons: extra indirection; many incompatibilities → many adapters',
        ],
        videos: [
          { label: 'Geekific — Design Patterns playlist', url: 'https://www.youtube.com/playlist?list=PLlsmxlJgn1HJpa28yHzkBmUY-Ty71ZUGc' },
          { label: 'Christopher Okhravi — Design Patterns playlist', url: 'https://www.youtube.com/playlist?list=PLrhzvIcii6GNjpARdnO4ueTUAVR9eMBpc' },
        ],
        links: [
          { label: 'refactoring.guru — Adapter', url: 'https://refactoring.guru/design-patterns/adapter' },
          { label: 'GeeksforGeeks — Adapter', url: 'https://www.geeksforgeeks.org/adapter-pattern/' },
        ],
        interview: [
          { q: 'What is the Adapter pattern used for?', a: 'To let two classes with incompatible interfaces collaborate. The adapter implements the interface the client expects and internally delegates to the incompatible (often legacy or third-party) class, translating method names, arguments, and data formats between them.' },
          { q: 'What is the difference between an object adapter and a class adapter?', a: 'An object adapter holds an instance of the adaptee and delegates to it (composition) — flexible and works in any language and can adapt subclasses too. A class adapter inherits from the adaptee (and implements the target), relying on multiple/implementation inheritance; it is more limited and ties the adapter to one adaptee class.' },
          { q: 'Adapter vs Decorator — what is the difference?', a: 'Both wrap an object, but the intent differs. Adapter changes the interface to a different one the client expects without adding behaviour. Decorator keeps the same interface and adds new behaviour/responsibilities. Adapter is about compatibility; Decorator is about enhancement.' },
          { q: 'Adapter vs Facade — how do they differ?', a: 'A Facade provides a new simplified interface over a whole subsystem to make it easier to use. An Adapter makes an existing interface match a specific expected interface. Facade simplifies many classes; Adapter converts one (or a few) interfaces.' },
          { q: 'Give a real-world software example of Adapter.', a: 'java.io.InputStreamReader adapts a byte stream (InputStream) to a character stream (Reader); Arrays.asList adapts an array to a List; and wrapping a legacy XML-based service so it satisfies a modern JSON-based interface is a classic application example.' },
        ],
      },
      {
        id: 'lld-bridge',
        topic: 'Bridge Pattern',
        summary: 'Decouples an abstraction from its implementation so the two can vary independently.',
        explanation:
          'Intent: decouple an abstraction from its implementation so that the two can vary independently. Bridge is about preventing a combinatorial explosion of subclasses by splitting one tangled hierarchy into two cooperating hierarchies linked by composition — the "bridge".\n\nThe problem it solves: suppose you have a Shape hierarchy and you also want each shape rendered in different ways (Vector vs Raster). If you model this with inheritance alone you get RedCircle, BlueCircle, RedSquare, BlueSquare... — every new shape multiplied by every new rendering, a class explosion of M×N. Bridge separates the two independent dimensions: one hierarchy for the abstraction (Shape: Circle, Square) and another for the implementation (Renderer: VectorRenderer, RasterRenderer). The shape holds a reference to a renderer and delegates the drawing primitives to it. Now you add a shape OR a renderer in isolation (M+N classes).\n\nStructure and participants: (1) Abstraction — the high-level control layer (e.g. `Shape`) that holds a reference to an Implementor and defines high-level operations in terms of it. (2) RefinedAbstraction — variants/subclasses of the abstraction (`Circle`, `Square`). (3) Implementor — the interface for the implementation layer (`Renderer`) with low-level primitive operations (`renderCircle`, `drawLine`). (4) ConcreteImplementor — concrete implementations (`VectorRenderer`, `RasterRenderer`). The Abstraction delegates to its Implementor; that delegation link is the bridge.\n\nHow it works: clients work with the Abstraction; the Abstraction forwards the low-level parts of its job to the Implementor it was given (usually injected at construction). Because the two hierarchies are connected by composition rather than inheritance, you can mix and match any abstraction with any implementation and even swap implementations at runtime. Real-world analogy: a TV (abstraction) and a remote control... or better, a wall switch (abstraction) and the device it controls (lamp/fan implementation) — the same switch interface can drive different devices, and the same device can be driven by different switches.\n\nConcrete example: cross-platform GUI where `Window` (abstraction) delegates rendering to a `WindowImpl` per OS; or a `RemoteControl` abstraction (basic, advanced) operating over a `Device` implementation (TV, Radio). When to use: you have two (or more) orthogonal dimensions that would otherwise multiply into many subclasses, you want to switch implementations at runtime, or you want to hide implementation details from clients. Pros: avoids the M×N subclass explosion, lets abstraction and implementation evolve independently (OCP), and supports runtime switching of implementation. Cons: adds indirection and upfront complexity; it can be over-engineering when the two dimensions never actually vary independently. (Note: Bridge looks structurally like Adapter, but its intent is up-front design to keep dimensions separate, whereas Adapter retrofits compatibility onto existing code.)',
        diagram: `  ┌────────────────────────┐ bridge ┌──────────────────────┐
  │     Abstraction        │◆──────►│  <<interface>>       │
  ├────────────────────────┤  impl  │   Implementor        │
  │ # impl : Implementor   │        ├──────────────────────┤
  │ + operation()          │        │ + operationImpl()    │
  └────────────────────────┘        └──────────────────────┘
            △                              △        △
   ┌────────────────┐            ┌──────────────┐ ┌──────────────┐
   │RefinedAbstract │            │ConcreteImplA │ │ConcreteImplB │
   ├────────────────┤            ├──────────────┤ ├──────────────┤
   │ + operation()  │            │+operationImpl│ │+operationImpl│
   └────────────────┘            └──────────────┘ └──────────────┘

  operation() { impl.operationImpl() }   // delegates over bridge
  // M shapes + N renderers  →  M+N classes, not M×N`,
        keyPoints: [
          'Intent: split abstraction and implementation into two hierarchies joined by composition',
          'Prevents the M×N subclass explosion → only M+N classes',
          'Participants: Abstraction, RefinedAbstraction, Implementor, ConcreteImplementor',
          'Abstraction holds + delegates to Implementor (the bridge); swappable at runtime',
          'Real example: Shape×Renderer, RemoteControl×Device, cross-platform Window',
          'Bridge = designed up-front for two dimensions; Adapter = retrofitted compatibility',
        ],
        videos: [
          { label: 'Geekific — Design Patterns playlist', url: 'https://www.youtube.com/playlist?list=PLlsmxlJgn1HJpa28yHzkBmUY-Ty71ZUGc' },
          { label: 'Christopher Okhravi — Design Patterns playlist', url: 'https://www.youtube.com/playlist?list=PLrhzvIcii6GNjpARdnO4ueTUAVR9eMBpc' },
        ],
        links: [
          { label: 'refactoring.guru — Bridge', url: 'https://refactoring.guru/design-patterns/bridge' },
          { label: 'GeeksforGeeks — Bridge', url: 'https://www.geeksforgeeks.org/bridge-design-pattern/' },
        ],
        interview: [
          { q: 'What problem does the Bridge pattern solve?', a: 'It prevents a combinatorial explosion of subclasses when a class varies along two or more independent dimensions. Instead of one hierarchy of size M×N, Bridge creates two hierarchies (abstraction and implementation) linked by composition, so you only need M+N classes and each dimension evolves independently.' },
          { q: 'What is the difference between Bridge and Adapter?', a: 'They look similar (both use composition and delegation), but intent differs. Adapter is applied after the fact to make two existing, incompatible interfaces work together. Bridge is designed up front to keep an abstraction and its implementation decoupled so both can evolve, typically with interfaces designed to fit each other.' },
          { q: 'What are the participants in the Bridge pattern?', a: 'Abstraction (high-level interface holding an Implementor reference), RefinedAbstraction (its subclasses), Implementor (low-level operations interface), and ConcreteImplementor (its implementations). The Abstraction delegates low-level work to the Implementor across the bridge.' },
          { q: 'Bridge vs Strategy — how do they compare?', a: 'Structurally both delegate to a composed object. Strategy is behavioural — it swaps an interchangeable algorithm at runtime. Bridge is structural — it organizes two whole hierarchies (abstraction and implementation) so they can vary independently. Intent and scope differ even though the class diagrams resemble each other.' },
          { q: 'When is Bridge overkill?', a: 'When the abstraction and implementation never actually vary independently, or there is only one implementation. Then the extra hierarchy and indirection add complexity for no benefit, and a single hierarchy is simpler.' },
        ],
      },
      {
        id: 'lld-composite',
        topic: 'Composite Pattern',
        summary: 'Composes objects into tree structures and lets clients treat individual and composite objects uniformly.',
        explanation:
          'Intent: compose objects into tree structures to represent part-whole hierarchies, and let clients treat individual objects (leaves) and compositions of objects (nodes) uniformly through one common interface. The whole point is that a single object and a group of objects respond to the same operations, so client code does not branch on "is this one thing or many".\n\nThe problem it solves: many domains are naturally recursive trees — a file system (files inside folders inside folders), a UI (a panel containing buttons and other panels), an organization chart, a graphics drawing (a group of shapes that itself can be grouped). Without Composite, client code is full of `if (node is folder) iterate children else handle file`. Composite removes that branching: both `File` and `Folder` implement the same interface, and a `Folder` simply forwards operations to its children, so `getSize()` on a folder recursively sums the sizes of everything inside.\n\nStructure and participants: (1) Component — the common interface/abstract class declaring operations shared by leaves and composites (e.g. `getSize()`, `render()`, and optionally child-management methods `add()/remove()`). (2) Leaf — a primitive object with no children that implements the operations directly (`File`, `Button`). (3) Composite — a node that holds a collection of child Components and implements operations by delegating to/aggregating over its children, plus it manages adding/removing children (`Folder`, `Panel`). (4) Client — manipulates objects through the Component interface, oblivious to whether it holds a leaf or a composite.\n\nA classic design tension: where do `add()`/`remove()` live? "Transparent" Composite puts child-management methods in the Component interface so all elements share one type (leaves then throw or no-op on those methods) — maximal uniformity, weaker type safety. "Safe" Composite puts child-management only on Composite — type-safe but the client must distinguish composites from leaves to add children. Interviews often ask you to weigh this trade-off.\n\nHow it works: operations propagate recursively down the tree. Calling `render()` on the root composite renders the composite\'s own contribution and recursively calls `render()` on each child, leaves included, so the entire tree is processed by one polymorphic call. Real-world analogy: a box can contain products and other boxes; to total the price of a shipment you ask the outer box for its price and it recursively sums everything inside — boxes and individual products are priced the same way. Concrete examples: a file-system size calculator, a GUI widget tree, arithmetic expression trees, and menu/sub-menu structures. When to use: you have a part-whole tree and want clients to treat individual and grouped objects the same. Pros: clean recursive structure, clients are simple (no type checks), easy to add new component types (OCP), works naturally with the tree. Cons: it can be hard to restrict what a composite may contain (the common interface may be too general), and overly uniform interfaces can make some operations meaningless for leaves.',
        diagram: `  ┌──────────┐ uses ┌────────────────────────────┐
  │  Client  │─────►│  <<interface>> Component   │
  └──────────┘      ├────────────────────────────┤
                    │ + operation()              │
                    │ + add(c: Component)        │
                    │ + remove(c: Component)     │
                    └────────────────────────────┘
                        △                  △
                implements│                │implements
        ┌──────────────────┐      ┌────────────────────────┐
        │      Leaf        │      │      Composite         │
        ├──────────────────┤      ├────────────────────────┤
        │ + operation()    │      │ - children: Component[]│◆─┐
        └──────────────────┘      │ + operation()          │  │ 0..*
                                  │ + add() / remove()     │◄─┘ contains
                                  └────────────────────────┘

  Composite.operation() {
    for (child in children) child.operation()  // recurse
  }`,
        keyPoints: [
          'Intent: model part-whole trees; treat leaf and composite uniformly via one interface',
          'Participants: Component (interface), Leaf (no children), Composite (holds children), Client',
          'Composite delegates operations recursively to its children',
          'Transparent (add/remove in Component) vs Safe (add/remove only in Composite) design trade-off',
          'Real examples: file system, GUI widget tree, org chart, expression tree, nested menus',
          'Pros: no type-checking in client, easy to extend; Cons: hard to restrict composite contents',
        ],
        videos: [
          { label: 'Geekific — Composite Pattern in Java', url: 'https://www.youtube.com/watch?v=oo9AsGqnisk' },
          { label: 'Christopher Okhravi — Design Patterns playlist', url: 'https://www.youtube.com/playlist?list=PLrhzvIcii6GNjpARdnO4ueTUAVR9eMBpc' },
        ],
        links: [
          { label: 'refactoring.guru — Composite', url: 'https://refactoring.guru/design-patterns/composite' },
          { label: 'GeeksforGeeks — Composite', url: 'https://www.geeksforgeeks.org/composite-design-pattern/' },
        ],
        interview: [
          { q: 'What is the Composite pattern used for?', a: 'To represent part-whole hierarchies as trees and let clients treat individual objects (leaves) and groups of objects (composites) uniformly through a single Component interface, so operations like render or getSize work the same on a single element or an entire subtree.' },
          { q: 'What are the participants in the Composite pattern?', a: 'Component (the shared interface declaring operations and possibly child management), Leaf (a primitive with no children that implements operations directly), Composite (a node that stores child Components and delegates operations to them), and Client (which works through the Component interface).' },
          { q: 'What is the transparent vs safe Composite trade-off?', a: 'Transparent Composite declares add/remove in the Component interface so leaves and composites share one type (uniform, but leaves must throw or ignore those methods — less type-safe). Safe Composite keeps add/remove only on Composite (type-safe, but the client must distinguish composites from leaves to manage children).' },
          { q: 'Give real-world examples of the Composite pattern.', a: 'File systems (files and folders), GUI component trees (widgets containing widgets), organization charts, arithmetic/expression trees, and nested menus. Any recursive part-whole structure is a candidate.' },
          { q: 'How does Composite relate to recursion?', a: 'A composite implements its operations by recursively invoking the same operation on each child; leaves terminate the recursion by handling the operation directly. So one polymorphic call on the root cascades through the entire tree.' },
        ],
      },
    ],
  },
  {
    focus: 'Structural Patterns II — Decorator & Facade',
    concepts: [
      {
        id: 'lld-decorator',
        topic: 'Decorator Pattern',
        summary: 'Attaches additional responsibilities to an object dynamically by wrapping it, keeping the same interface.',
        explanation:
          'Intent: attach additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing for extending functionality — you wrap an object in another object that adds behaviour, and because the wrapper implements the same interface as the wrapped object, the client cannot tell the difference and can stack as many wrappers as it likes.\n\nThe problem it solves: extending behaviour by inheritance is static and explodes combinatorially. If a coffee can have milk, sugar, whipped cream, and caramel, modelling every combination as a subclass (`MilkCoffee`, `MilkSugarCoffee`, `MilkSugarWhipCoffee`...) is unmanageable. Decorator lets you compose those additions at runtime: start with a plain `Coffee` and wrap it — `new Caramel(new Milk(new Sugar(new SimpleCoffee())))` — each wrapper adding its cost and description on top of whatever it wraps. You can add and combine features dynamically, in any order, without touching the base class.\n\nStructure and participants: (1) Component — the interface shared by real objects and decorators (e.g. `Beverage` with `cost()` and `description()`). (2) ConcreteComponent — the base object being decorated (`SimpleCoffee`). (3) Decorator — an abstract base that implements Component and holds a reference to a wrapped Component, delegating to it. (4) ConcreteDecorator — adds behaviour before/after delegating (`MilkDecorator.cost()` returns `wrapped.cost() + 0.5`). The crucial structural property: a Decorator both implements the Component interface and contains a Component — it is-a and has-a Component, which is what allows recursive stacking.\n\nHow it works: each decorator delegates the core call to the object it wraps and contributes its own extra behaviour around that call. Because every layer has the same type, the client treats the outermost wrapper exactly like a plain component. Real-world analogy: getting dressed — a person wrapped in a shirt, then a sweater, then a raincoat; each layer adds warmth/protection but you are still a person, and you can add or remove layers as conditions change. Concrete examples: coffee add-ons; Java I/O streams (`new BufferedReader(new InputStreamReader(new FileInputStream(f)))` — each stream decorates another, adding buffering, decoding, etc.); adding scrollbars/borders to a UI component; or wrapping a data source with compression and encryption decorators.\n\nWhen to use: you must add responsibilities to individual objects dynamically and transparently without affecting others, when extension by subclassing is impractical, or when you want to combine behaviours freely. Pros: more flexible than inheritance, add/remove responsibilities at runtime, compose behaviours in any combination, single responsibility per decorator (SRP), honours OCP. Cons: many small classes that look alike, the order of wrapping can matter and be confusing, hard to remove a specific decorator from deep in the stack, and stack traces/debugging become noisier. (Contrast with Proxy, which has the same wrapping structure but controls access rather than adding features, and Adapter, which changes the interface rather than keeping it.)',
        diagram: `  ┌────────────────────────────┐
  │  <<interface>> Component   │◄──────────────┐
  ├────────────────────────────┤               │ wraps (has-a
  │ + operation()              │               │ Component)
  └────────────────────────────┘               │
        △                    △                  │
 implements│            implements│             │
 ┌──────────────────┐   ┌────────────────────────────┐
 │ConcreteComponent │   │   Decorator (abstract)     │◆┘
 ├──────────────────┤   ├────────────────────────────┤
 │ + operation()    │   │ - wrapped : Component      │
 └──────────────────┘   │ + operation()              │
                        └────────────────────────────┘
                                    △
                            ┌────────────────────┐
                            │ ConcreteDecorator  │
                            ├────────────────────┤
                            │ + operation()      │  // adds behaviour
                            └────────────────────┘  // then delegates

  operation() { extra(); wrapped.operation(); }`,
        keyPoints: [
          'Intent: add responsibilities to objects dynamically by wrapping — alternative to subclassing',
          'Decorator both implements AND holds a Component → can stack recursively',
          'Participants: Component, ConcreteComponent, Decorator (abstract), ConcreteDecorator',
          'Real examples: coffee add-ons, Java I/O streams (BufferedReader/InputStreamReader), UI borders',
          'Pros: runtime composition, any combination/order, SRP + OCP',
          'Cons: many tiny classes, order matters, hard to peel a specific layer, noisy debugging',
        ],
        videos: [
          { label: 'Geekific — Decorator Pattern in Java', url: 'https://www.youtube.com/watch?v=v6tpISNjHf8' },
          { label: 'Christopher Okhravi — Design Patterns playlist', url: 'https://www.youtube.com/playlist?list=PLrhzvIcii6GNjpARdnO4ueTUAVR9eMBpc' },
        ],
        links: [
          { label: 'refactoring.guru — Decorator', url: 'https://refactoring.guru/design-patterns/decorator' },
          { label: 'GeeksforGeeks — Decorator', url: 'https://www.geeksforgeeks.org/decorator-pattern/' },
        ],
        interview: [
          { q: 'Decorator vs inheritance — why prefer Decorator?', a: 'Inheritance fixes added behaviour at compile time and causes a subclass explosion for every combination of features. Decorator composes behaviours at runtime by wrapping, so you can add, remove, and combine features in any order without creating a class per combination, and without modifying the base class.' },
          { q: 'How does the Decorator pattern work structurally?', a: 'A decorator implements the same Component interface as the object it decorates and also holds a reference to a Component. It delegates the core call to the wrapped object and adds its own behaviour before or after. Because each decorator is itself a Component, decorators can be nested recursively.' },
          { q: 'What is the difference between Decorator and Proxy?', a: 'Both wrap an object with the same interface, but intent differs. Decorator adds new responsibilities/behaviour to the object. Proxy controls access to the object (lazy loading, caching, security, remote access) without changing its responsibilities. Decorators are usually stacked; a proxy typically wraps once.' },
          { q: 'Give a real example of Decorator in the JDK.', a: 'Java I/O streams: new BufferedReader(new InputStreamReader(new FileInputStream(file))). Each class decorates another, adding buffering or byte-to-char decoding while all share the Reader/InputStream interface. Collections.synchronizedList and unmodifiableList are also decorator-style wrappers.' },
          { q: 'What are the drawbacks of the Decorator pattern?', a: 'It produces many small, similar-looking classes; the order of wrapping can change behaviour and be confusing; it is awkward to remove or reconfigure a specific decorator buried in the stack; and deep wrapping makes debugging and stack traces harder to read.' },
          { q: 'Decorator vs Adapter — how do they differ?', a: 'Decorator keeps the same interface and enhances behaviour. Adapter changes the interface to a different one the client expects, without adding behaviour. One is about enhancement, the other about compatibility.' },
        ],
      },
      {
        id: 'lld-facade',
        topic: 'Facade Pattern',
        summary: 'Provides a single simplified interface to a complex subsystem.',
        explanation:
          'Intent: provide a unified, higher-level interface to a set of interfaces in a subsystem, making the subsystem easier to use. A Facade is a single front-door class that wraps a complicated set of classes and exposes only the few operations clients actually need.\n\nThe problem it solves: complex subsystems (a video-conversion library, an e-commerce checkout, a home-theatre system) involve many classes with intricate initialization order and interdependencies. Forcing every client to learn and correctly orchestrate all of them creates tight coupling and duplicated, fragile setup code everywhere. The Facade encapsulates that orchestration: clients call one simple method (`convert(file, format)`) and the facade performs the multi-step dance with the underlying classes (codecs, buffers, readers, audio mixers) behind the scenes.\n\nStructure and participants: (1) Facade — the class that knows which subsystem classes to call and in what order, and delegates client requests to them; it offers a small, convenient API. (2) Subsystem classes — the many classes that do the real work; they have no knowledge of the facade (the facade depends on them, not vice versa). (3) Client — talks only to the facade for common tasks. Optionally there can be Additional Facades to avoid one facade becoming a god-object, each covering a slice of the subsystem. Importantly, the facade does not hide the subsystem; advanced clients can still reach in and use subsystem classes directly when they need fine-grained control.\n\nHow it works: the facade composes calls to the subsystem. For example, a `HomeTheaterFacade.watchMovie()` turns on the projector, dims the lights, powers the amplifier, sets the input, and starts the player — a sequence the client would otherwise have to perform manually and correctly. Real-world analogy: when you call a company\'s customer-service line, one representative is your single point of contact; behind them sit many departments (billing, shipping, technical), but you do not interact with each individually — the rep coordinates on your behalf.\n\nConcrete examples: a `VideoConverter.convert()` over ffmpeg-style internals; an `OrderService.placeOrder()` coordinating inventory, payment, shipping, and notification; SLF4J as a logging facade over multiple logging backends; JDBC as a facade over driver internals. When to use: you need a simple interface to a complex subsystem, you want to layer your system (the facade becomes the entry point to a layer), or you want to reduce coupling between clients and many subsystem classes. Pros: simplifies usage, decouples clients from subsystem internals (so internals can change freely), improves readability, and provides a natural layering boundary. Cons: a facade can become an over-grown god object coupled to everything if not kept focused, and it may hide useful capabilities or add a slight indirection. (Contrast: Facade defines a new simpler interface; Adapter makes an existing interface match an expected one; Mediator centralizes communication between peers rather than simplifying access to a subsystem.)',
        diagram: `  ┌──────────┐ uses one  ┌──────────────────────────────┐
  │  Client  │──────────►│           Facade             │
  └──────────┘  simple   ├──────────────────────────────┤
                  API    │ + operation()                │
                         └──────────────────────────────┘
                            │      │       │  delegates
              ┌─────────────┘      │       └─────────────┐
              ▼                    ▼                      ▼
      ┌──────────────┐    ┌──────────────┐       ┌──────────────┐
      │ SubsystemA   │    │ SubsystemB   │       │ SubsystemC   │
      ├──────────────┤    ├──────────────┤       ├──────────────┤
      │ + opA1()     │    │ + opB1()     │       │ + opC1()     │
      │ + opA2()     │    │ + opB2()     │       │ + opC2()     │
      └──────────────┘    └──────────────┘       └──────────────┘
   (subsystem classes know nothing about the Facade)

  Facade.operation() { a.opA1(); b.opB2(); c.opC1(); }`,
        keyPoints: [
          'Intent: one simplified front-door interface over a complex subsystem',
          'Participants: Facade (orchestrates), Subsystem classes (do the work), Client',
          'Facade depends on the subsystem; the subsystem does not know the facade',
          'Does not hide the subsystem — advanced clients can still use it directly',
          'Real examples: SLF4J, JDBC, OrderService, HomeTheaterFacade, VideoConverter',
          'Pros: simplicity, decoupling, layering; Cons: risk of a god-object facade',
        ],
        videos: [
          { label: 'Geekific — Facade Pattern in Java', url: 'https://www.youtube.com/watch?v=xWk6jvqyhAQ' },
          { label: 'Christopher Okhravi — Design Patterns playlist', url: 'https://www.youtube.com/playlist?list=PLrhzvIcii6GNjpARdnO4ueTUAVR9eMBpc' },
        ],
        links: [
          { label: 'refactoring.guru — Facade', url: 'https://refactoring.guru/design-patterns/facade' },
          { label: 'GeeksforGeeks — Facade', url: 'https://www.geeksforgeeks.org/facade-design-pattern-introduction/' },
        ],
        interview: [
          { q: 'What is the Facade pattern and why use it?', a: 'It provides a single simplified interface over a complex subsystem of many classes. It is used to make the subsystem easier to use, to decouple clients from the subsystem internals (so those internals can change without breaking clients), and to create a clean entry point to a layer.' },
          { q: 'Does a Facade hide the subsystem completely?', a: 'No. The facade offers a convenient default interface for common tasks, but it does not prevent clients that need advanced or fine-grained control from accessing the subsystem classes directly. It adds a layer, it does not lock the subsystem away.' },
          { q: 'Facade vs Adapter — what is the difference?', a: 'Adapter converts one existing interface into another specific interface a client expects (compatibility, usually one class). Facade defines a brand-new, simpler interface over many classes to ease use of a whole subsystem (simplification). Their intents differ even though both wrap things.' },
          { q: 'Facade vs Mediator — how do they differ?', a: 'A Facade simplifies a client\'s access to a subsystem; communication is one-directional (client → facade → subsystem) and the subsystem is unaware of it. A Mediator centralizes and coordinates two-way communication among peer objects that know about the mediator, reducing their mutual coupling.' },
          { q: 'What is the main risk of the Facade pattern?', a: 'The facade can grow into a god object tightly coupled to every part of the subsystem, becoming a maintenance bottleneck. The remedy is to keep facades focused and introduce additional facades for distinct slices of functionality.' },
        ],
      },
    ],
  },
  {
    focus: 'Structural Patterns III — Proxy, Flyweight & Decision Guide',
    concepts: [
      {
        id: 'lld-proxy',
        topic: 'Proxy Pattern',
        summary: 'Provides a placeholder or surrogate for another object to control access to it.',
        explanation:
          'Intent: provide a surrogate or placeholder for another object to control access to it. A proxy implements the same interface as the real object and stands in for it, intercepting calls so it can add behaviour such as lazy creation, access control, caching, logging, or remote communication — all transparently to the client.\n\nThe problem it solves: sometimes you want to do something every time an object is accessed, or you want to defer/avoid expensive work, but you cannot or should not put that logic in the real object or scatter it across clients. The proxy wraps the real object and is indistinguishable from it (same interface), so clients use the proxy exactly as they would the real thing while the proxy quietly manages access. Common kinds: (1) Virtual proxy — lazy initialization; create or load the heavy real object only on first actual use (e.g. defer loading a large image until it must be drawn). (2) Protection proxy — access control; check permissions before forwarding the call. (3) Remote proxy — represent an object living in another address space/process/machine and handle the networking (the basis of RPC stubs). (4) Caching/smart proxy — cache results, count references, or add logging/metrics around calls.\n\nStructure and participants: (1) Subject — the common interface shared by the real object and the proxy (e.g. `Image` with `display()`). (2) RealSubject — the actual object doing the real work (`HighResImage`). (3) Proxy — implements Subject, holds a reference to the RealSubject (often creating it lazily), and controls access to it, forwarding requests after (or instead of) doing its own work. (4) Client — talks to the Subject interface, holding a Proxy without knowing it.\n\nHow it works: the client calls a Subject method on the proxy; the proxy decides what to do — instantiate the real object if needed, check permissions, return a cached value, or relay across the network — and then typically delegates to the real subject. Real-world analogy: a cheque is a proxy for cash (it controls access to funds in your account), or a credit card stands in for your bank balance; a security guard at a building checks your badge before letting you reach the actual rooms. Concrete examples: a virtual proxy that delays loading a high-resolution image until `display()` is first called; Spring AOP proxies that wrap beans to add transactions/logging; Hibernate lazy-loading proxies for entity relations; Java\'s dynamic proxies and RMI stubs.\n\nWhen to use: you need lazy initialization of a costly object, controlled/secured access, caching, logging/metrics, or a local representative for a remote object. Pros: controls access transparently, supports lazy loading and caching for performance, can manage the real subject\'s lifecycle, and follows OCP (introduce a proxy without changing the real subject or clients). Cons: adds another class and a layer of indirection, can introduce latency, and the response from the real service may be delayed by proxy logic. (Proxy vs Decorator: same wrapping structure, but Proxy controls access and usually manages the object\'s lifecycle, while Decorator adds responsibilities and is meant to be stacked. Proxy vs Adapter: Adapter changes the interface; Proxy keeps the same interface.)',
        diagram: `  ┌──────────┐ uses ┌────────────────────────────┐
  │  Client  │─────►│   <<interface>> Subject    │
  └──────────┘      ├────────────────────────────┤
                    │ + request()                │
                    └────────────────────────────┘
                        △                  △
                implements│            implements│
        ┌────────────────────────┐   ┌──────────────────┐
        │        Proxy           │   │   RealSubject    │
        ├────────────────────────┤   ├──────────────────┤
        │ - real : RealSubject   │◆─►│ + request()      │
        │ + request()            │   └──────────────────┘
        └────────────────────────┘   (heavy / protected /
                                       remote object)
  request() {
    if (checkAccess()) {
      if (real == null) real = new RealSubject() // lazy
      real.request()                              // delegate
    }
  }`,
        keyPoints: [
          'Intent: a surrogate that controls access to a real object behind the same interface',
          'Kinds: virtual (lazy init), protection (access control), remote (RPC), caching/smart',
          'Participants: Subject (interface), RealSubject, Proxy (holds + controls real), Client',
          'Real examples: lazy image loading, Spring AOP, Hibernate lazy load, RMI stubs, credit card',
          'Pros: lazy loading, access control, caching, lifecycle mgmt, OCP',
          'Proxy controls access; Decorator adds behaviour; Adapter changes interface',
        ],
        videos: [
          { label: 'Geekific — Proxy Pattern in Java', url: 'https://www.youtube.com/watch?v=TS5i-uPXLs8' },
          { label: 'Christopher Okhravi — Design Patterns playlist', url: 'https://www.youtube.com/playlist?list=PLrhzvIcii6GNjpARdnO4ueTUAVR9eMBpc' },
        ],
        links: [
          { label: 'refactoring.guru — Proxy', url: 'https://refactoring.guru/design-patterns/proxy' },
          { label: 'GeeksforGeeks — Proxy', url: 'https://www.geeksforgeeks.org/proxy-design-pattern/' },
        ],
        interview: [
          { q: 'What are the different types of Proxy?', a: 'Virtual proxy (lazy-creates an expensive object on first use), protection proxy (enforces access control before forwarding), remote proxy (local stand-in for an object in another process/machine, handling networking), and caching/smart proxy (caches results, adds logging, reference counting, or other smart behaviour around access).' },
          { q: 'What is the difference between Proxy and Decorator?', a: 'Both wrap an object behind the same interface. A Proxy controls access to the real object (lazy loading, security, caching, remote access) and often manages its lifecycle, usually wrapping it once. A Decorator adds new responsibilities/behaviour and is designed to be stacked. Intent: access control vs enhancement.' },
          { q: 'How does a virtual proxy improve performance?', a: 'It defers creation or loading of a heavyweight object until the moment it is actually needed. For example, a high-resolution image proxy holds only the filename and creates the real image object the first time display() is called, avoiding the cost when it is never shown.' },
          { q: 'Proxy vs Adapter — what is the difference?', a: 'A Proxy keeps the same interface as the real subject and controls access to it. An Adapter changes an interface into a different one the client expects to make incompatible types work together. Proxy is about access; Adapter is about compatibility.' },
          { q: 'Give real-world software examples of Proxy.', a: 'Spring AOP wraps beans in proxies to add transactions, security, and logging; Hibernate uses proxies for lazy-loaded entity associations; Java dynamic proxies and RMI stubs represent remote objects; and API gateways/caches act as proxies in front of services.' },
        ],
      },
      {
        id: 'lld-flyweight',
        topic: 'Flyweight Pattern',
        summary: 'Shares fine-grained objects to support large numbers of them efficiently by separating intrinsic from extrinsic state.',
        explanation:
          'Intent: use sharing to support large numbers of fine-grained objects efficiently. When an application must create an enormous number of similar objects and runs out of memory, Flyweight reduces the footprint by sharing the parts of state that are common across many objects, instead of storing them per object.\n\nThe core idea — intrinsic vs extrinsic state. Intrinsic state is the part of an object that is constant and shared across many instances (a character\'s font, glyph shape, and codepoint; a tree\'s mesh and texture; a bullet\'s sprite). Extrinsic state is the part that is unique per use and varies by context (a character\'s position in the document; a tree\'s coordinates and scale on the map). Flyweight stores only intrinsic state inside the shared object (the flyweight) and pushes extrinsic state out — it is passed in by the client as method parameters at call time. Thus one shared flyweight serves many contexts, and the unique data lives in the lightweight context objects or in the client.\n\nStructure and participants: (1) Flyweight — interface declaring operations that accept extrinsic state as parameters (`draw(x, y)`). (2) ConcreteFlyweight — stores intrinsic, shareable state and implements the operations; it must be immutable so sharing is safe. (3) FlyweightFactory — creates and manages a pool/cache of flyweights, returning an existing one for a given intrinsic key or creating it once if absent (this is what guarantees sharing rather than duplication). (4) Client — holds extrinsic state, requests flyweights from the factory, and passes the extrinsic data into the flyweight\'s methods. (Optionally a Context object pairs a flyweight reference with its extrinsic state.)\n\nHow it works: instead of `new Character(\'a\', font, x, y)` a million times, you call `factory.getCharacter(\'a\', font)` which returns the single shared glyph for (\'a\', font), and you supply x, y at draw time. The factory ensures there is exactly one flyweight per distinct intrinsic combination, so memory scales with the number of distinct glyphs, not the number of characters on the page. Real-world analogy: a text document with millions of letters but only ~100 distinct glyph definitions reused everywhere; or a forest in a game with millions of trees but a handful of shared tree models, each instance differing only in position.\n\nConcrete examples: a text editor sharing glyph objects across all occurrences of a character; a game sharing mesh/texture for thousands of trees, bullets, or particles; Java\'s `Integer.valueOf()` caching small Integers (−128..127); the String constant pool. When to use: an application must spawn a huge number of objects, storage cost is high because of that quantity, much of each object\'s state can be made extrinsic, and objects can be replaced by a few shared ones once extrinsic state is removed. Pros: dramatic memory savings when there are many objects with shared state. Cons: increased CPU/complexity because extrinsic state must be computed or stored and passed each time; flyweights must be immutable; the pattern complicates the code and is only worthwhile at large scale — a classic time-vs-space trade-off.',
        diagram: `  ┌───────────────────┐ getFlyweight(key) ┌───────────────────────┐
  │     Client        │──────────────────►│  FlyweightFactory     │
  ├───────────────────┤                   ├───────────────────────┤
  │ stores EXTRINSIC  │◄──────────────────│ - pool: Map<key,FW>   │
  │ state (x, y, ...) │  shared flyweight │ + getFlyweight(key):FW│
  └───────────────────┘                   └───────────────────────┘
           │ draw(extrinsic)                        │ creates once
           ▼                                        ▼
  ┌───────────────────────────────────────────────────────┐
  │            <<interface>> Flyweight                     │
  │  + operation(extrinsicState)                           │
  └───────────────────────────────────────────────────────┘
                          △ implements
  ┌───────────────────────────────────────────────────────┐
  │              ConcreteFlyweight                         │
  │  - intrinsicState  (shared, IMMUTABLE)                 │
  │  + operation(extrinsicState)                           │
  └───────────────────────────────────────────────────────┘`,
        keyPoints: [
          'Intent: share many fine-grained objects to save memory at large scale',
          'Intrinsic state = shared & constant (stored in flyweight); extrinsic = per-use (passed in)',
          'Participants: Flyweight, ConcreteFlyweight (immutable), FlyweightFactory (pool), Client',
          'Factory returns a shared instance per intrinsic key → no duplication',
          'Real examples: text-editor glyphs, game trees/particles, Integer.valueOf cache, String pool',
          'Trade-off: big memory savings vs added complexity & CPU; only worth it at scale',
        ],
        videos: [
          { label: 'Geekific — Design Patterns playlist', url: 'https://www.youtube.com/playlist?list=PLlsmxlJgn1HJpa28yHzkBmUY-Ty71ZUGc' },
          { label: 'Christopher Okhravi — Design Patterns playlist', url: 'https://www.youtube.com/playlist?list=PLrhzvIcii6GNjpARdnO4ueTUAVR9eMBpc' },
        ],
        links: [
          { label: 'refactoring.guru — Flyweight', url: 'https://refactoring.guru/design-patterns/flyweight' },
          { label: 'GeeksforGeeks — Flyweight', url: 'https://www.geeksforgeeks.org/flyweight-design-pattern/' },
        ],
        interview: [
          { q: 'What is the difference between intrinsic and extrinsic state?', a: 'Intrinsic state is constant and shareable across many objects (e.g. a glyph\'s shape and font) and is stored inside the flyweight. Extrinsic state varies per context (e.g. a character\'s position) and is not stored in the flyweight; the client supplies it as a parameter when calling the flyweight\'s methods.' },
          { q: 'When should you use the Flyweight pattern?', a: 'When an application must create a very large number of similar objects, memory is a constraint because of that volume, much of each object\'s state can be externalized as extrinsic, and the objects can be replaced by a small set of shared ones once extrinsic state is removed.' },
          { q: 'What is the role of the Flyweight Factory?', a: 'It maintains a pool/cache of flyweights and ensures sharing: when a client requests a flyweight for a given intrinsic key, the factory returns the existing instance if present or creates exactly one and stores it. This guarantees the same intrinsic state is never duplicated.' },
          { q: 'Why must flyweights be immutable?', a: 'Because a single flyweight instance is shared among many contexts, if one client could mutate its intrinsic state it would unintentionally affect every other context using it. Keeping flyweights immutable makes the sharing safe.' },
          { q: 'Give real examples of the Flyweight pattern.', a: 'A text editor sharing glyph objects across all occurrences of each character, a game reusing a few tree/particle models for millions of on-screen instances, Java\'s Integer.valueOf cache for −128..127, and the String literal pool.' },
          { q: 'What is the main trade-off of Flyweight?', a: 'It trades CPU and code complexity for memory savings. You save RAM by sharing intrinsic state, but you must compute, store, and pass extrinsic state on every call, and the code becomes more complex. It only pays off when the number of objects is genuinely large.' },
        ],
      },
      {
        id: 'lld-structural-decision-guide',
        topic: 'Structural Patterns — Comparison & Decision Guide',
        summary: 'How to tell Adapter, Bridge, Composite, Decorator, Facade, Proxy, and Flyweight apart and pick one.',
        explanation:
          'Structural patterns are all about how classes and objects are composed to form larger structures, but many of them look alike (wrapping an object behind an interface) and differ chiefly in intent. This wrap-up gives you the mental decision tree interviewers love.\n\nThe wrappers — Adapter, Decorator, Proxy, Facade — share a similar shape (one object holding another) but answer different questions. Adapter: "the interface I have does not match the interface I need" → it converts an interface to a different, expected one (compatibility). Decorator: "I want to add behaviour to an object dynamically while keeping its interface" → it enhances and is meant to be stacked. Proxy: "I want to control access to an object behind the same interface" → lazy loading, security, caching, remote access; usually one wrapper, often owns the lifecycle. Facade: "this whole subsystem is too complex to use" → it introduces a new, simpler interface over many classes (simplification). Quick test: changing the interface ⇒ Adapter; same interface + new behaviour ⇒ Decorator; same interface + access control ⇒ Proxy; brand-new simple interface over many classes ⇒ Facade.\n\nThe structure-builders — Bridge, Composite, Flyweight — solve composition problems rather than wrapping a single collaborator. Bridge: "my class varies along two independent dimensions and inheritance would explode" → split into abstraction and implementation hierarchies joined by composition (M+N not M×N). Composite: "I have a part-whole tree and want to treat single items and groups uniformly" → a recursive Component/Leaf/Composite structure. Flyweight: "I have a huge number of objects and run out of memory" → share intrinsic state across instances and externalize extrinsic state.\n\nClassic discrimination questions and answers in one place. Adapter vs Bridge: Adapter is retrofitted onto existing incompatible code after the fact; Bridge is designed up front to keep two dimensions decoupled. Decorator vs Proxy: both wrap with the same interface, but Decorator adds responsibilities (and stacks), Proxy controls access (and typically manages lifecycle). Adapter vs Facade: Adapter matches one expected interface; Facade invents a simpler interface over many classes. Proxy vs Decorator vs Adapter: access control vs added behaviour vs interface conversion. Composite vs Decorator: structurally both are recursive trees of a common Component, but Composite is about part-whole aggregation (many children), while a Decorator has exactly one wrapped child and exists to add behaviour.\n\nHow to choose in an interview/machine-coding round: first state the problem in plain words ("I need to add features at runtime", "I must hide a messy subsystem", "I have millions of objects"), then map that sentence to the matching intent above. Naming the intent — not just the class diagram — is what distinguishes a strong answer. Remember structural patterns favour composition over inheritance, which is the recurring theme that ties them together.',
        diagram: `  STRUCTURAL PATTERN DECISION TREE
  ──────────────────────────────────────────────
  Need to WRAP one object?
    ├─ Change its interface?............► ADAPTER
    ├─ Add behaviour, same interface?...► DECORATOR (stacks)
    ├─ Control access, same interface?..► PROXY
    └─ Simplify a whole subsystem?......► FACADE

  Need to STRUCTURE many objects?
    ├─ Two independent dimensions?......► BRIDGE  (M+N)
    ├─ Part-whole tree, treat uniform?..► COMPOSITE
    └─ Too many objects / memory?.......► FLYWEIGHT

  WRAPPERS (same shape, different intent)
  ┌───────────┬──────────────────────────────────┐
  │ Adapter   │ convert interface (compatibility)│
  │ Decorator │ add behaviour, keep interface    │
  │ Proxy     │ control access, keep interface   │
  │ Facade    │ new simple interface / subsystem │
  └───────────┴──────────────────────────────────┘`,
        keyPoints: [
          'Adapter = convert interface; Decorator = add behaviour; Proxy = control access; Facade = simplify subsystem',
          'Bridge = decouple two dimensions (M+N); Composite = part-whole tree; Flyweight = share to save memory',
          'Wrappers differ by INTENT, not structure — name the intent in interviews',
          'Adapter is retrofitted; Bridge is designed up-front',
          'Decorator stacks & adds behaviour; Proxy wraps once & controls access/lifecycle',
          'Common theme: favour composition over inheritance',
        ],
        videos: [
          { label: 'ByteByteGo — design patterns overview', url: 'https://www.youtube.com/c/ByteByteGo' },
          { label: 'Geekific — Design Patterns playlist', url: 'https://www.youtube.com/playlist?list=PLlsmxlJgn1HJpa28yHzkBmUY-Ty71ZUGc' },
        ],
        links: [
          { label: 'refactoring.guru — Structural patterns', url: 'https://refactoring.guru/design-patterns/structural-patterns' },
          { label: 'GeeksforGeeks — Facade vs Proxy vs Adapter vs Decorator', url: 'https://www.geeksforgeeks.org/difference-between-the-facade-proxy-adapter-and-decorator-design-patterns/' },
        ],
        interview: [
          { q: 'Adapter vs Decorator vs Proxy — how do you tell them apart?', a: 'All three wrap an object. Adapter changes the interface to a different one the client expects (compatibility). Decorator keeps the interface and adds new behaviour, and is designed to be stacked. Proxy keeps the interface and controls access (lazy loading, security, caching, remote), usually wrapping once and managing lifecycle.' },
          { q: 'When would you use Bridge instead of just inheritance?', a: 'When a class varies along two or more independent dimensions, inheritance produces an M×N subclass explosion. Bridge splits these into separate abstraction and implementation hierarchies linked by composition, giving M+N classes and letting each dimension evolve and be swapped independently.' },
          { q: 'Composite vs Decorator — they look similar, what differs?', a: 'Both are recursive structures of a common Component. Composite models part-whole aggregation: a composite holds many children and exists to let clients treat individual and grouped objects uniformly. A Decorator wraps exactly one component and exists to add behaviour. Aggregation vs enhancement.' },
          { q: 'How do you decide which structural pattern to apply?', a: 'State the problem in plain words and map it to an intent: change an interface → Adapter; add features at runtime → Decorator; control access → Proxy; hide a complex subsystem → Facade; decouple two varying dimensions → Bridge; treat trees uniformly → Composite; save memory across many objects → Flyweight.' },
          { q: 'What common principle do structural patterns share?', a: 'They favour object composition over class inheritance. Rather than building deep inheritance hierarchies, they assemble objects at runtime (wrapping, delegating, sharing) to gain flexibility, which is why so many of them have a similar wrapping shape but different intents.' },
        ],
      },
    ],
  },
]
