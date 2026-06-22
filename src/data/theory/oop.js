// OOP theory — authored for SDE placement interview prep.
// Schema mirrors the theory modules consumed by ./index.js: each day =
// { focus, concepts: [...] }. Concepts may include optional `diagram` and `videos`.

export const SUBJECT = { key: 'oop', name: 'OOP', tag: 'encapsulation · inheritance · polymorphism · SOLID' }

export const DAYS = [
  {
    focus: 'Classes, Objects & OOP Basics',
    concepts: [
      {
        id: 'oop-class-vs-object',
        topic: 'Class vs Object, Attributes & Methods',
        summary: 'A class is a blueprint; an object is a concrete instance created from that blueprint.',
        explanation:
          'Object-oriented programming organizes software around objects rather than around functions and logic. The two foundational ideas are the class and the object. A class is a user-defined blueprint or template that describes the structure (data) and behavior (functions) that its objects will have. By itself a class allocates no memory for instance data; it is just a definition. For example, a Car class might declare attributes like color and speed and methods like accelerate() and brake().\n\nAn object is a concrete instance of a class created at runtime. When you write Car c = new Car() in Java or Car c; / Car* c = new Car() in C++, you are asking the runtime to allocate memory and produce an actual entity that has its own copy of the instance attributes. Two objects of the same class share the same method code but have independent state, so changing one objects color does not affect another.\n\nThe data held by an object is called its attributes (also fields, instance variables, or data members). The functions that operate on that data are called methods (or member functions). Together they bundle state and behavior into one unit, which is the essence of OOP. A method typically reads or modifies the attributes of the object it is called on.\n\nThink of class vs object like a cookie cutter vs the actual cookies, or an architectural blueprint vs the houses built from it. One blueprint can produce many houses, each existing independently. This separation lets you define behavior once and reuse it across unlimited instances, which is a key reason OOP scales well for large systems.',
        diagram: `        Class (blueprint)                Objects (instances)
  ┌────────────────────────┐        ┌──────────────┐ ┌──────────────┐
  │         Car            │        │   car1:Car   │ │   car2:Car   │
  ├────────────────────────┤        ├──────────────┤ ├──────────────┤
  │ - color : String       │  new   │ color = red  │ │ color = blue │
  │ - speed : int          │ ─────► │ speed = 0    │ │ speed = 40   │
  ├────────────────────────┤        └──────────────┘ └──────────────┘
  │ + accelerate() : void  │         (own state, shared method code)
  │ + brake() : void       │
  └────────────────────────┘`,
        keyPoints: [
          'Class = blueprint/template; defines structure + behavior, allocates no instance memory',
          'Object = runtime instance with its own copy of attributes',
          'Attributes (fields/data members) hold state; methods define behavior',
          'Many objects can be created from one class, each independent',
          'Methods are shared as code; attributes are per-object',
        ],
        videos: [
          { label: 'Kunal Kushwaha — OOP in Java (full course)', url: 'https://www.youtube.com/playlist?list=PL9gnSGHSqcno1G3XjUbwzXHL8_EttOuKk' },
          { label: 'Telusko — Java OOP Tutorials', url: 'https://www.youtube.com/c/Telusko' },
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/' },
          { label: 'Programiz', url: 'https://www.programiz.com/java-programming/class-objects' },
        ],
        interview: [
          { q: 'What is the difference between a class and an object?', a: 'A class is a blueprint that defines the attributes and methods its instances will have but reserves no memory for instance data. An object is a concrete instance of that class created at runtime, with its own copy of the attributes and access to the shared methods.' },
          { q: 'What are attributes and methods?', a: 'Attributes (fields, instance variables, data members) hold the state of an object. Methods (member functions) define the behavior that operates on that state. Together they bundle data and behavior into a single unit.' },
          { q: 'Can a class exist without creating any object?', a: 'Yes. A class is just a definition and exists once it is loaded/compiled. You can also use a class without instances through static members, but to hold per-instance state you must create objects.' },
          { q: 'Do two objects of the same class share their attributes?', a: 'No, each object has its own copy of the instance attributes, so modifying one object does not affect another. Only static (class-level) members are shared across all objects.' },
          { q: 'What are the four main principles of OOP?', a: 'Encapsulation, abstraction, inheritance, and polymorphism. These are often called the four pillars of object-oriented programming.' },
        ],
      },
      {
        id: 'oop-constructors-destructors',
        topic: 'Constructors, Destructors & this',
        summary: 'Constructors initialize new objects; destructors release resources; this refers to the current object.',
        explanation:
          'A constructor is a special method automatically invoked when an object is created. Its job is to put the object into a valid initial state, typically by assigning its attributes. A constructor has the same name as the class and has no return type. If you write no constructor, the compiler supplies a default no-argument constructor; once you declare any constructor, that implicit default is no longer provided. You can overload constructors to offer multiple ways of creating an object (e.g. a no-arg constructor and a parameterized one). A constructor that copies another object of the same type is a copy constructor, important in C++ for deep copies.\n\nThe this keyword (this pointer in C++) is an implicit reference to the current object on which a method or constructor is operating. It is mainly used to disambiguate between an instance attribute and a parameter of the same name (this.speed = speed), to pass the current object to another method, and to chain constructors (this(...) in Java, delegating constructors in C++).\n\nA destructor is the counterpart of a constructor, called when an object is destroyed to release resources such as memory, file handles, or sockets. In C++ a destructor is written ~ClassName() and runs deterministically when the object goes out of scope or delete is called; getting destructors right (and making them virtual for base classes) is crucial to avoid leaks. Java and C# have no explicit destructors because they use garbage collection; cleanup is handled by the GC and, when needed, by finalize()/try-with-resources or IDisposable patterns.\n\nThe order of construction matters: in inheritance the base-class constructor runs before the derived-class constructor, and destructors run in the reverse order. Understanding this ordering, and that constructors cannot be virtual while destructors often should be, is a frequent interview theme, especially in C++.',
        diagram: `   new Car("red")                        end of scope / delete
        │                                        │
        ▼                                        ▼
  ┌───────────────┐                       ┌───────────────┐
  │ Constructor   │  sets initial state   │ Destructor    │ frees
  │ Car(color){   │  ───────────────────► │ ~Car(){ ... } │ resources
  │   this.color  │                       └───────────────┘
  │     = color   │      object alive
  │ }             │  ◄─── uses this ───►  methods act on
  └───────────────┘                       current object`,
        keyPoints: [
          'Constructor: same name as class, no return type, initializes a new object',
          'Default constructor is auto-provided only until you declare any constructor',
          'Constructors can be overloaded; copy constructor matters in C++ deep copies',
          'this references the current object; resolves name clashes and enables chaining',
          'Destructor (~Class in C++) frees resources; Java/C# rely on garbage collection',
          'Base constructor runs first; destructors run in reverse order',
        ],
        videos: [
          { label: 'Kunal Kushwaha — OOP: Constructors & Keywords', url: 'https://www.youtube.com/playlist?list=PL9gnSGHSqcno1G3XjUbwzXHL8_EttOuKk' },
          { label: 'CodeWithHarry — OOP in Java', url: 'https://www.youtube.com/c/CodeWithHarry' },
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/constructors-in-java/' },
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/this-reference-in-java/' },
        ],
        interview: [
          { q: 'What is a constructor and how is it different from a method?', a: 'A constructor is a special member used to initialize a new object; it has the same name as the class and no return type, and it is called automatically on object creation. A regular method has a return type, an arbitrary name, and must be called explicitly.' },
          { q: 'What is the this keyword used for?', a: 'this is an implicit reference to the current object. It disambiguates instance variables from parameters with the same name, lets you pass the current object to other methods, and enables constructor chaining via this(...).' },
          { q: 'Does Java have destructors?', a: 'No, Java does not have explicit destructors. Memory is reclaimed by the garbage collector. Cleanup of resources is done with try-with-resources/AutoCloseable, while the deprecated finalize() existed historically but is unreliable.' },
          { q: 'Why should a base-class destructor be virtual in C++?', a: 'If you delete a derived object through a base-class pointer and the base destructor is not virtual, only the base destructor runs, leaking the derived parts. A virtual destructor ensures the full chain of destructors runs correctly.' },
          { q: 'What is a copy constructor?', a: 'A copy constructor creates a new object as a copy of an existing object of the same class, e.g. Car(const Car& other) in C++. It is essential for performing deep copies when an object owns dynamically allocated resources.' },
          { q: 'Can constructors be overloaded?', a: 'Yes. You can define multiple constructors with different parameter lists (constructor overloading), giving callers several ways to initialize an object. Constructor chaining lets one constructor call another to avoid duplication.' },
        ],
      },
      {
        id: 'oop-object-lifecycle-memory',
        topic: 'Object Lifecycle & Memory (Stack vs Heap)',
        summary: 'Objects are created on the heap, referenced from the stack, and reclaimed by GC or destructors.',
        explanation:
          'Every object passes through a lifecycle: creation (allocation + construction), usage (its methods are called and state changes), and destruction (resources released, memory reclaimed). Understanding where objects live in memory is essential for interviews. Program memory is broadly split into the stack and the heap. The stack stores method call frames, local variables, and references; it is fast, automatically managed, and grows/shrinks as functions are called and return. The heap is a large pool used for dynamically allocated objects whose lifetime is not tied to a single function call.\n\nIn Java, when you write Car c = new Car(), the object itself is allocated on the heap, while the reference variable c lives on the stack and points to it. Primitive local variables (int, char) live directly on the stack. In C++ you can choose: Car c; creates the object on the stack (destroyed automatically at end of scope), whereas Car* c = new Car() allocates on the heap and must be freed with delete (or managed by a smart pointer like unique_ptr/shared_ptr).\n\nReclamation differs by language. Java and C# use a garbage collector that automatically finds objects no longer reachable from any reference and frees them, so there is no manual delete; this prevents most memory leaks but adds non-deterministic pauses. C++ has no GC by default: heap objects must be deleted explicitly or wrapped in RAII/smart pointers, and stack objects are destroyed deterministically when scope ends.\n\nKey lifecycle facts for interviews: an object becomes eligible for garbage collection in Java when it is no longer reachable (all references dropped or set to null). Stack allocation is faster and cache-friendly but limited in size and lifetime; heap allocation is flexible but slower and must be managed. Memory leaks happen when heap objects remain referenced (or are never freed) even though they are no longer needed.',
        diagram: `        STACK (per-thread)              HEAP (shared)
   ┌──────────────────────┐         ┌────────────────────────┐
   │ main():              │         │  ┌──────────────────┐  │
   │   c ───────────────────────────►  │  Car object      │  │
   │   x = 5  (primitive) │         │  │  color = "red"   │  │
   ├──────────────────────┤         │  │  speed = 0       │  │
   │ accelerate():        │         │  └──────────────────┘  │
   │   (frame, returns)   │         │   reclaimed by GC when │
   └──────────────────────┘         │   unreachable          │
   fast, auto, scope-bound          └────────────────────────┘`,
        keyPoints: [
          'Lifecycle: creation → use → destruction/reclamation',
          'Stack: call frames, locals, references — fast, auto, scope-bound',
          'Heap: dynamically allocated objects — flexible, slower, must be managed',
          'Java: object on heap, reference on stack; primitives on stack',
          'Java/C# use garbage collection; C++ uses delete or RAII/smart pointers',
          'Object is GC-eligible in Java once unreachable (no live references)',
        ],
        videos: [
          { label: 'Telusko — Java Memory (Stack & Heap)', url: 'https://www.youtube.com/c/Telusko' },
          { label: 'Kunal Kushwaha — How Java works (memory)', url: 'https://www.youtube.com/playlist?list=PL9gnSGHSqcno1G3XjUbwzXHL8_EttOuKk' },
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/stack-vs-heap-memory-allocation/' },
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/garbage-collection-java/' },
        ],
        interview: [
          { q: 'Where are objects stored in Java, on the stack or the heap?', a: 'The object itself is always created on the heap, while the reference variable that points to it lives on the stack. Primitive local variables are stored directly on the stack.' },
          { q: 'What is the difference between stack and heap memory?', a: 'The stack holds method frames, local variables, and references; it is fast, automatically managed, and tied to method scope. The heap is a larger pool for dynamically allocated objects whose lifetime is independent of a single method, and it is slower to allocate.' },
          { q: 'When does an object become eligible for garbage collection?', a: 'When it is no longer reachable from any live reference, for example after all references are set to null or go out of scope. The GC then reclaims it at some later, non-deterministic time.' },
          { q: 'How is C++ memory management different from Java?', a: 'C++ has no garbage collector by default. Heap objects must be freed with delete or managed via RAII/smart pointers, and stack objects are destroyed deterministically at end of scope. Java automates reclamation via the GC.' },
          { q: 'What causes a memory leak in a garbage-collected language?', a: 'Unintended references that keep objects reachable even though they are no longer needed, such as objects lingering in static collections, caches, or listener lists. The GC cannot reclaim what is still referenced.' },
        ],
      },
      {
        id: 'oop-procedural-vs-oop',
        topic: 'Procedural vs Object-Oriented Programming',
        summary: 'Procedural code organizes around functions and shared data; OOP organizes around self-contained objects.',
        explanation:
          'Procedural programming (as in classic C) structures a program as a sequence of functions/procedures that operate on data which is usually passed around or kept globally. The program is essentially a recipe: do step 1, then step 2, calling functions in order. Data and the functions that act on it are separate, so any function can potentially read or modify the data, which makes large programs harder to reason about and maintain.\n\nObject-oriented programming structures the program around objects that bundle data (attributes) together with the functions (methods) that operate on that data. Instead of functions reaching into global data, objects expose a controlled interface and hide their internals. This shifts the focus from how (step-by-step procedures) to what (collaborating objects with responsibilities).\n\nThe practical advantages of OOP are reusability (through inheritance and composition), maintainability (encapsulation localizes change), and modeling power (objects map naturally onto real-world entities like User, Order, Account). It also improves security through data hiding and supports polymorphism so code can work with many types through a common interface. Procedural code can be simpler and faster for small, linear tasks and has less overhead, which is why it still dominates systems programming and performance-critical code.\n\nA balanced interview answer notes that neither paradigm is universally better: procedural suits small scripts and low-level/performance code, while OOP shines in large, evolving systems with many interacting entities. Many modern languages are multi-paradigm (Java, C++, Python) and good engineers mix procedural, OOP, and functional styles as appropriate.',
        diagram: `  PROCEDURAL                         OBJECT-ORIENTED
  ┌─────────────┐                    ┌───────────────────────┐
  │  DATA       │◄── any function    │   Account object      │
  └─────────────┘    can touch it    │ ┌───────────────────┐ │
        ▲  ▲  ▲                       │ │ balance (private) │ │
        │  │  │                       │ └───────────────────┘ │
   ┌────┘  │  └────┐                  │  + deposit()          │
  func1  func2  func3                 │  + withdraw()         │
  (separate from data)                └───────────────────────┘
                                       data + methods together`,
        keyPoints: [
          'Procedural: program = ordered functions acting on shared/global data',
          'OOP: program = objects bundling data with the methods that use it',
          'OOP focuses on what (responsibilities) vs procedural how (steps)',
          'OOP advantages: reuse, maintainability, encapsulation, polymorphism, modeling',
          'Procedural advantages: simplicity, lower overhead for small/linear tasks',
          'Most modern languages are multi-paradigm; choose per problem',
        ],
        videos: [
          { label: 'Telusko — OOP vs Procedural', url: 'https://www.youtube.com/c/Telusko' },
          { label: 'Apna College — OOP Basics', url: 'https://www.youtube.com/c/ApnaCollegeOfficial' },
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/differences-between-procedural-and-object-oriented-programming/' },
          { label: 'Javatpoint', url: 'https://www.javatpoint.com/java-oops-concepts' },
        ],
        interview: [
          { q: 'What is the difference between procedural and object-oriented programming?', a: 'Procedural programming organizes code as functions that operate on separate, often global, data and follows a top-down sequence of steps. OOP organizes code around objects that bundle data with the methods acting on it, hiding internals and following a bottom-up, entity-centric design.' },
          { q: 'What are the advantages of OOP over procedural programming?', a: 'Better code reuse via inheritance and composition, easier maintenance because encapsulation localizes changes, stronger data security through hiding, natural modeling of real-world entities, and polymorphism that lets code work with many types via one interface.' },
          { q: 'Is OOP always better than procedural programming?', a: 'No. Procedural code is simpler and has less overhead for small, linear, or performance-critical tasks. OOP pays off for large, evolving systems with many interacting entities. The right choice depends on the problem.' },
          { q: 'Why is procedural code harder to maintain at scale?', a: 'Because data and functions are separate and often global, many functions can read or modify the same data, so a change can have wide, hard-to-track effects. OOP confines state inside objects, limiting the blast radius of changes.' },
          { q: 'Can a single program use both paradigms?', a: 'Yes. Most modern languages are multi-paradigm, so it is common to use procedural code for small utilities and algorithms while structuring the overall system with objects, and even mix in functional style where it fits.' },
        ],
      },
    ],
  },
  {
    focus: 'Encapsulation & Abstraction',
    concepts: [
      {
        id: 'oop-encapsulation',
        topic: 'Encapsulation & Data Hiding',
        summary: 'Encapsulation bundles data with methods and hides internal state behind a controlled interface.',
        explanation:
          'Encapsulation is the OOP principle of wrapping data (attributes) and the methods that operate on that data into a single unit, the class, and restricting direct access to the data from outside. The internal state is made private and is reachable only through public methods. This is also called data hiding because the implementation details are concealed from the outside world.\n\nThe mechanism in most languages is access modifiers: attributes are declared private, and controlled access is provided through public getter and setter methods. A getter returns the value of an attribute; a setter updates it, often with validation. For example, an Account class keeps balance private and exposes deposit() and withdraw() that enforce rules (no negative deposits, sufficient funds for withdrawal), so the balance can never be set to an invalid value directly.\n\nThe benefits are significant. It protects invariants by validating every change through methods, it allows the internal representation to change without breaking callers (you can switch a field from int to BigDecimal as long as the getter/setter signatures stay stable), it makes classes easier to test and reason about, and it improves security by preventing outside code from corrupting state. Read-only or write-only fields are easy to express by providing only a getter or only a setter.\n\nA classic real-world analogy is a medicine capsule that encloses the medicine, or a car: you use the steering wheel, pedals, and gear stick (the public interface) without touching the engine internals (the hidden implementation). For interviews, be precise: encapsulation is the bundling-plus-hiding mechanism, distinct from abstraction (which is about exposing only essential features and hiding complexity at the design level), though the two work hand in hand.',
        diagram: `        ┌─────────────────────────────────────┐
        │              Account                │
        │  ╔═══════════════════════════════╗  │  outside code
        │  ║  - balance : double (private) ║  │  CANNOT touch
        │  ╚═══════════════════════════════╝  │  balance directly
        │  ─────────────────────────────────  │
   ───► │  + deposit(amt)   validates > 0     │ ◄── only via
   ───► │  + withdraw(amt)  checks funds      │     public methods
   ───► │  + getBalance() : double            │
        └─────────────────────────────────────┘`,
        keyPoints: [
          'Bundles data + methods in one unit and hides internal state',
          'Attributes private; access through public getters/setters',
          'Setters can validate input, protecting class invariants',
          'Internal representation can change without breaking callers',
          'Enables read-only / write-only fields and improves security',
          'Mechanism of hiding — works with, but differs from, abstraction',
        ],
        videos: [
          { label: 'Kunal Kushwaha — OOP Principles', url: 'https://www.youtube.com/playlist?list=PL9gnSGHSqcno1G3XjUbwzXHL8_EttOuKk' },
          { label: 'Telusko — Encapsulation in Java', url: 'https://www.youtube.com/c/Telusko' },
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/encapsulation-in-java/' },
          { label: 'Programiz', url: 'https://www.programiz.com/java-programming/encapsulation' },
        ],
        interview: [
          { q: 'What is encapsulation?', a: 'Encapsulation is the bundling of data and the methods that operate on it into a single class, while hiding the internal state by making attributes private and exposing access only through public methods. It is also called data hiding.' },
          { q: 'How is encapsulation achieved in Java?', a: 'By declaring instance variables private and providing public getter and setter methods to read and modify them, often with validation in the setters. This gives controlled access and protects class invariants.' },
          { q: 'What are the benefits of encapsulation?', a: 'It protects invariants through validation, lets you change internal representation without affecting callers, supports read-only/write-only access, improves security, and makes classes easier to test and maintain.' },
          { q: 'What is the difference between encapsulation and data hiding?', a: 'Data hiding is the restriction of direct access to internal state (making it private). Encapsulation is the broader principle of bundling data with methods and exposing a controlled interface; data hiding is the part of encapsulation that conceals the state.' },
          { q: 'Can you have encapsulation without getters and setters?', a: 'Yes. Getters/setters are the common pattern, but encapsulation only requires controlling access through a well-defined interface. Behavior methods (like deposit/withdraw) that operate on private data are encapsulation too, often better than exposing raw getters/setters.' },
          { q: 'How does encapsulation support immutability?', a: 'By keeping fields private and final and providing no setters, only getters, the object cannot be modified after construction. This makes objects safe to share and thread-safe by default.' },
        ],
      },
      {
        id: 'oop-access-modifiers',
        topic: 'Access Modifiers (private/protected/public/default)',
        summary: 'Access modifiers control the visibility of class members across classes, packages, and subclasses.',
        explanation:
          'Access modifiers are keywords that set the visibility (accessibility) of classes, attributes, and methods. They are the primary tool for enforcing encapsulation. Java has four levels. private members are visible only within the same class. default (package-private, no keyword) members are visible to any class in the same package. protected members are visible within the same package and additionally to subclasses in other packages. public members are visible everywhere.\n\nThe general guideline is to make members as private as possible (least privilege) and widen access only when there is a clear need. Fields are usually private with public getters/setters; helper methods are private; methods meant to be overridden or used by subclasses are protected; and the genuine external interface is public. This minimizes coupling and protects invariants.\n\nC++ uses three access specifiers — private, protected, public — applied to members and also to inheritance (public, protected, private inheritance), which additionally changes how inherited members are exposed. C++ has no package-private concept; instead it offers the friend keyword to grant specific classes/functions access to private members. Java has no friend mechanism, relying on packages instead.\n\nFor interviews, common pitfalls to mention: a class declared as top-level can only be public or package-private in Java (not private/protected); protected in Java is broader than many expect because it also includes the same package; and a subclass can widen but not narrow the visibility of an overridden method. Choosing the right modifier is a design decision that directly shapes the encapsulation and maintainability of a system.',
        diagram: `  Access from →   same    same      subclass    other
  Modifier ↓      class   package   (other pkg) (world)
  ──────────────────────────────────────────────────────
  private          ✔        ✗        ✗            ✗
  default          ✔        ✔        ✗            ✗
  protected        ✔        ✔        ✔            ✗
  public           ✔        ✔        ✔            ✔
            (most restrictive ──────► most open)`,
        keyPoints: [
          'private: same class only — strongest hiding',
          'default (package-private): same package only',
          'protected: same package + subclasses in other packages',
          'public: visible everywhere',
          'Principle of least privilege: keep members as private as possible',
          'C++ has private/protected/public + friend; Java relies on packages',
        ],
        videos: [
          { label: 'Kunal Kushwaha — Access Control & Packages', url: 'https://www.youtube.com/playlist?list=PL9gnSGHSqcno1G3XjUbwzXHL8_EttOuKk' },
          { label: 'CodeWithHarry — Access Modifiers', url: 'https://www.youtube.com/c/CodeWithHarry' },
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/access-modifiers-java/' },
          { label: 'Javatpoint', url: 'https://www.javatpoint.com/access-modifiers' },
        ],
        interview: [
          { q: 'What are the access modifiers in Java?', a: 'private (same class only), default/package-private (same package), protected (same package plus subclasses in other packages), and public (accessible everywhere). They control the visibility of classes and members.' },
          { q: 'What is the difference between protected and default access?', a: 'Default (package-private) is visible only within the same package. Protected is visible within the same package AND to subclasses even in other packages, so protected is strictly broader than default.' },
          { q: 'Can a top-level class be private in Java?', a: 'No. A top-level class can only be public or package-private (default). private and protected are allowed only for nested classes and for members, not for top-level classes.' },
          { q: 'What is the friend keyword in C++ and does Java have it?', a: 'In C++, declaring a class or function as a friend grants it access to the private and protected members of the class. Java has no friend mechanism; it uses package-level (default) access instead.' },
          { q: 'When overriding a method, can you reduce its visibility?', a: 'No. An overriding method cannot have more restrictive access than the method it overrides; it can keep or widen the access (e.g. protected can become public, but public cannot become protected).' },
          { q: 'Why prefer making fields private?', a: 'It enforces encapsulation: outside code cannot read or corrupt the state directly, you can validate changes through setters, and you can change the internal representation later without breaking callers.' },
        ],
      },
      {
        id: 'oop-abstraction',
        topic: 'Abstraction vs Encapsulation',
        summary: 'Abstraction hides complexity by exposing only essential features; encapsulation hides data via access control.',
        explanation:
          'Abstraction is the principle of exposing only the essential, relevant features of an entity while hiding the underlying complexity and implementation details. It answers the question what does this do? rather than how does it do it? In OOP, abstraction is achieved primarily through abstract classes and interfaces, which declare what operations are available without committing to how they are implemented. For example, a List interface promises add() and get() operations; callers program against the interface without caring whether the implementation is an array list or a linked list.\n\nA helpful real-world analogy is driving a car: you operate it through an abstract interface (steering wheel, accelerator, brake) without knowing the internal combustion or electric drivetrain details. Another is a TV remote: pressing power abstracts away the electronics. Abstraction reduces cognitive load and lets large systems be designed in terms of high-level contracts.\n\nAbstraction and encapsulation are closely related and often confused, so being precise matters in interviews. Encapsulation is about bundling data with methods and restricting access to internal state via access modifiers; it is a language-level mechanism that hides data. Abstraction is about hiding complexity and exposing only essential behavior; it is a design-level concept achieved with abstract classes/interfaces. Put differently, encapsulation hides the how at the data level (implementation/state hiding), while abstraction hides the how at the design level (showing only the essential interface).\n\nThey complement each other: you use encapsulation to implement abstraction. A well-designed class presents a clean abstract interface (abstraction) and protects its internal state behind that interface (encapsulation). Both reduce complexity and coupling, but they operate at different levels and with different tools, which is the key distinction interviewers look for.',
        diagram: `   ABSTRACTION (design level)        ENCAPSULATION (data level)
   "show essentials, hide how"       "bundle + restrict access"

   ┌───────────────────────┐         ┌───────────────────────┐
   │ «interface» Shape     │         │  class Circle         │
   │  + area() : double    │         │  - radius (private)   │
   └──────────▲────────────┘         │  + area()  uses radius│
              │ implemented by       │  + setRadius() checks │
   ┌──────────┴────────────┐         └───────────────────────┘
   │ Circle / Rectangle... │          hides STATE behind
   └───────────────────────┘          a controlled interface`,
        keyPoints: [
          'Abstraction: expose essential features, hide complexity (what vs how)',
          'Achieved via abstract classes and interfaces (contracts)',
          'Encapsulation: bundle data+methods, restrict access via modifiers',
          'Abstraction is design-level; encapsulation is implementation/data-level',
          'You use encapsulation to implement abstraction',
          'Both reduce complexity and coupling, using different tools',
        ],
        videos: [
          { label: 'Telusko — Abstraction in Java', url: 'https://www.youtube.com/c/Telusko' },
          { label: 'Kunal Kushwaha — Abstraction & Interfaces', url: 'https://www.youtube.com/playlist?list=PL9gnSGHSqcno1G3XjUbwzXHL8_EttOuKk' },
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/difference-between-abstraction-and-encapsulation-in-java-with-examples/' },
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/abstraction-in-java-2/' },
        ],
        interview: [
          { q: 'What is the difference between abstraction and encapsulation?', a: 'Abstraction hides complexity by exposing only essential features (the what) and is achieved with abstract classes and interfaces at the design level. Encapsulation hides internal data by bundling it with methods and restricting access via modifiers at the implementation level. You use encapsulation to implement abstraction.' },
          { q: 'What is abstraction in OOP?', a: 'Abstraction is exposing only the relevant, essential characteristics of an object while hiding its internal implementation details, so users interact through a simple interface without knowing how it works internally.' },
          { q: 'How is abstraction achieved in Java?', a: 'Through abstract classes (0–100% abstraction) and interfaces (traditionally 100% abstract contracts). They declare what methods exist without dictating how they are implemented, leaving that to concrete subclasses.' },
          { q: 'Give a real-world example of abstraction.', a: 'Driving a car: you use the steering wheel, accelerator, and brake (the interface) without understanding the engine internals. The complexity of the drivetrain is abstracted away behind simple controls.' },
          { q: 'Are abstraction and encapsulation the same thing?', a: 'No. They are related but distinct. Encapsulation is a mechanism that hides data and restricts access. Abstraction is a design concept that hides complexity and shows only essential behavior. They commonly work together but operate at different levels.' },
          { q: 'Does abstraction improve maintainability?', a: 'Yes. By coding to abstract interfaces rather than concrete implementations, you can swap implementations, reduce coupling, and limit the impact of changes, which makes large systems easier to evolve and test.' },
        ],
      },
    ],
  },
  {
    focus: 'Inheritance & Its Types',
    concepts: [
      {
        id: 'oop-inheritance-basics',
        topic: 'Inheritance & the IS-A Relationship',
        summary: 'Inheritance lets a child class reuse and extend the members of a parent class via an IS-A relationship.',
        explanation:
          'Inheritance is the mechanism by which one class (the child, subclass, or derived class) acquires the attributes and methods of another class (the parent, superclass, or base class). It models an IS-A relationship: a Dog IS-A Animal, a Car IS-A Vehicle. The child inherits the reusable members of the parent and can add new members or change inherited behavior. In Java you use extends; in C++ you use class Dog : public Animal.\n\nThe primary motivation is code reuse and a natural type hierarchy. Common behavior is defined once in the base class and shared by all subclasses, avoiding duplication. Inheritance also enables polymorphism: a base-class reference can point to any subclass object, so code written against the base type works for all derived types.\n\nWhen a subclass object is created, the base-class constructor runs first (often via an implicit or explicit super(...) call in Java) before the subclass constructor body, ensuring the inherited part is initialized before the derived part uses it. The super keyword (Java) lets a subclass call the parent constructor and access overridden parent methods/fields; in C++ you call the base constructor in the initializer list and use Base:: to reach base members.\n\nA crucial design caution for interviews: prefer inheritance only for genuine IS-A relationships. Misusing it for code reuse alone leads to fragile, tightly coupled hierarchies (the fragile base class problem). When the relationship is really HAS-A (a Car has an Engine), composition is the better tool. The rule of thumb favor composition over inheritance captures this.',
        diagram: `              ┌───────────────┐
              │    Animal     │   (base / superclass)
              │  + eat()      │
              │  + sleep()    │
              └───────▲───────┘
                      │  extends  (IS-A)
          ┌───────────┴───────────┐
   ┌──────┴──────┐         ┌───────┴───────┐
   │    Dog      │         │     Cat       │   (derived)
   │  + bark()   │         │  + meow()     │
   └─────────────┘         └───────────────┘
   Dog inherits eat()/sleep(), adds bark()`,
        keyPoints: [
          'Child class inherits attributes/methods of parent (IS-A relationship)',
          'Java uses extends; C++ uses class D : public B',
          'Main benefits: code reuse and enabling polymorphism',
          'Base constructor runs before derived constructor (super/initializer list)',
          'super (Java) / Base:: (C++) access parent members and constructors',
          'Use inheritance only for true IS-A; prefer composition for HAS-A',
        ],
        videos: [
          { label: 'Kunal Kushwaha — Inheritance', url: 'https://www.youtube.com/playlist?list=PL9gnSGHSqcno1G3XjUbwzXHL8_EttOuKk' },
          { label: 'Telusko — Inheritance in Java', url: 'https://www.youtube.com/c/Telusko' },
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/inheritance-in-java/' },
          { label: 'Programiz', url: 'https://www.programiz.com/java-programming/inheritance' },
        ],
        interview: [
          { q: 'What is inheritance?', a: 'Inheritance is a mechanism where one class (subclass) acquires the attributes and methods of another class (superclass), modeling an IS-A relationship. It enables code reuse and supports polymorphism.' },
          { q: 'What is the IS-A relationship?', a: 'It is the relationship inheritance expresses: a subclass is a specialized kind of its superclass, e.g. a Dog IS-A Animal. If you cannot honestly say child IS-A parent, inheritance is probably the wrong tool.' },
          { q: 'What is the order of constructor execution in inheritance?', a: 'The base-class constructor runs first, then the derived-class constructor body. In Java this happens via an implicit or explicit super(...) call as the first statement; in C++ via the constructor initializer list.' },
          { q: 'What is the super keyword used for?', a: 'In Java, super calls the parent class constructor (super(...)) and accesses parent members or overridden methods (super.method()). It lets a subclass reuse and extend, rather than fully replace, parent behavior.' },
          { q: 'Why prefer composition over inheritance?', a: 'Inheritance creates tight coupling and can lead to the fragile base class problem when used merely for reuse. Composition (HAS-A) is more flexible, lets you change behavior at runtime, and avoids deep, brittle hierarchies. Use inheritance only for genuine IS-A relationships.' },
          { q: 'What members are not inherited?', a: 'Constructors are not inherited (though they can be invoked via super), and private members of the base class are not directly accessible in the subclass (they are still part of the object but accessed only through inherited public/protected methods).' },
        ],
      },
      {
        id: 'oop-inheritance-types',
        topic: 'Types of Inheritance',
        summary: 'Single, multilevel, hierarchical, multiple, and hybrid inheritance describe how classes are arranged.',
        explanation:
          'Inheritance comes in several structural forms. Single inheritance: a class derives from exactly one base class (B extends A). Multilevel inheritance: a chain where C extends B and B extends A, so C indirectly inherits from A (e.g. Animal → Dog → Puppy). Hierarchical inheritance: multiple classes derive from a single common base (Dog, Cat, Cow all extend Animal). These three are supported directly by all OOP languages.\n\nMultiple inheritance means a class derives from more than one base class at the same time (class C extends A, B). C++ supports this directly. Java and C# do NOT support multiple inheritance of classes, because it introduces ambiguity, most famously the diamond problem. Java instead allows a class to implement multiple interfaces, achieving the benefits of multiple inheritance of type without the ambiguity of inheriting conflicting state/implementation.\n\nHybrid inheritance is a combination of two or more of the above forms, for example a mix of hierarchical and multiple inheritance. Because it can involve multiple inheritance, hybrid inheritance can also run into the diamond problem in languages like C++ and is resolved using techniques such as virtual inheritance.\n\nFor interviews, be ready to draw each form and to state which forms each language supports. The headline facts: C++ supports all five (including multiple and hybrid) using virtual base classes to resolve diamonds; Java/C# support single, multilevel, and hierarchical for classes, and simulate multiple inheritance via interfaces. Knowing why multiple inheritance of classes is restricted (ambiguity, complexity, diamond problem) is a very common follow-up.',
        diagram: `  Single        Multilevel        Hierarchical      Multiple
    A              A                   A              A   B
    │              │                 / | \\            \\ /
    B              B                B  C  D             C
                   │
                   C
  (Java/C++)   (Java/C++)        (Java/C++)     (C++ only;
                                                 Java via
                                                 interfaces)`,
        keyPoints: [
          'Single: one base class (B ← A)',
          'Multilevel: chain A ← B ← C',
          'Hierarchical: many subclasses share one base',
          'Multiple: one class, several bases — C++ yes, Java no (for classes)',
          'Hybrid: combination of forms; can trigger the diamond problem',
          'Java simulates multiple inheritance via multiple interfaces',
        ],
        videos: [
          { label: 'Telusko — Types of Inheritance', url: 'https://www.youtube.com/c/Telusko' },
          { label: 'CodeWithHarry — Inheritance Types', url: 'https://www.youtube.com/c/CodeWithHarry' },
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/types-of-inheritance-in-java/' },
          { label: 'Javatpoint', url: 'https://www.javatpoint.com/inheritance-in-java' },
        ],
        interview: [
          { q: 'What are the types of inheritance?', a: 'Single (one base), multilevel (a chain A→B→C), hierarchical (many subclasses of one base), multiple (one class with several bases), and hybrid (a combination of these forms).' },
          { q: 'Which types of inheritance does Java support?', a: 'Java supports single, multilevel, and hierarchical inheritance of classes. It does not support multiple (or hybrid) inheritance of classes, but it allows multiple inheritance of type through interfaces.' },
          { q: 'What is multilevel inheritance?', a: 'A chain of inheritance where a class inherits from a derived class, e.g. C extends B and B extends A. C then transitively inherits the members of both B and A.' },
          { q: 'What is hierarchical inheritance?', a: 'When several subclasses inherit from the same single base class, e.g. Dog, Cat, and Cow all extend Animal. They share the common base behavior while adding their own.' },
          { q: 'What is hybrid inheritance?', a: 'A combination of two or more inheritance types, such as hierarchical plus multiple inheritance. Because it may involve multiple inheritance, it can cause the diamond problem, which C++ resolves with virtual base classes.' },
        ],
      },
      {
        id: 'oop-diamond-problem',
        topic: 'Diamond Problem & Multiple Inheritance',
        summary: 'The diamond problem is the ambiguity when a class inherits the same member via two paths.',
        explanation:
          'The diamond problem arises with multiple inheritance when a class D inherits from two classes B and C that both inherit from a common base A. If A defines a method or field, D ends up with two copies/paths of A (one through B, one through C). When you call the inherited A member on a D object, the compiler cannot tell which path to use, and you may also get duplicate copies of A state. The inheritance graph looks like a diamond, hence the name.\n\nThis ambiguity is exactly why Java and C# forbid multiple inheritance of classes. Instead, Java lets a class implement multiple interfaces. Historically interfaces had no implementation, so there was no state or method-body conflict to resolve. Since Java 8 introduced default methods (interfaces can have method bodies), a milder diamond can occur if two interfaces provide the same default method; Java requires the implementing class to explicitly override and resolve it (e.g. calling InterfaceName.super.method()).\n\nC++ permits multiple inheritance and resolves the diamond using virtual inheritance. Declaring the intermediate classes to inherit virtually from the common base (class B : virtual public A) ensures that only a single shared instance of A exists in D, eliminating duplicate state and the ambiguity over which copy to use.\n\nFor interviews, the key points are: define the diamond clearly, explain why it causes ambiguity (which path / duplicate state), state how each language deals with it (Java avoids it by disallowing multiple class inheritance and resolving interface default-method clashes explicitly; C++ uses virtual base classes), and be able to sketch the diamond diagram. This is one of the most frequently asked OOP design questions.',
        diagram: `              ┌─────────┐
              │    A    │   greet()
              └────▲────┘
                   │  (inherited two ways)
          ┌────────┴────────┐
     ┌────┴────┐       ┌────┴────┐
     │    B    │       │    C    │
     └────▲────┘       └────▲────┘
          └────────┬────────┘
              ┌────┴────┐
              │    D    │  d.greet() → which A? AMBIGUOUS
              └─────────┘  C++: virtual inheritance fixes it`,
        keyPoints: [
          'Occurs in multiple inheritance: D inherits A via both B and C',
          'Ambiguity: which path to A? plus possible duplicate A state',
          'Java/C# disallow multiple class inheritance to avoid it',
          'Java 8 default methods: clashing defaults must be explicitly overridden',
          'C++ resolves it with virtual inheritance (single shared base)',
        ],
        videos: [
          { label: 'Telusko — Multiple Inheritance / Diamond', url: 'https://www.youtube.com/c/Telusko' },
          { label: 'Concept && Coding — OOP', url: 'https://www.youtube.com/@ConceptandCoding' },
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/multiple-inheritance-in-cpp/' },
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/diamond-problem-in-java/' },
        ],
        interview: [
          { q: 'What is the diamond problem?', a: 'It is the ambiguity that arises in multiple inheritance when a class inherits from two classes that share a common base. The derived class gets two paths (and possibly two copies) of the base members, so the compiler cannot determine which inherited member to use.' },
          { q: 'Why does Java not support multiple inheritance of classes?', a: 'To avoid the ambiguity and complexity of the diamond problem, where a class could inherit conflicting implementations and duplicate state from two parents. Java instead allows multiple interface inheritance, which provides type flexibility without inheriting conflicting state.' },
          { q: 'How does C++ solve the diamond problem?', a: 'Through virtual inheritance: the intermediate classes inherit the common base virtually (class B : virtual public A), so the most-derived class contains only one shared instance of the base, removing duplication and ambiguity.' },
          { q: 'Can the diamond problem occur with Java interfaces?', a: 'A milder form can since Java 8, because interfaces can have default methods. If two interfaces supply the same default method, the implementing class must override it explicitly, optionally choosing one via Interface.super.method().' },
          { q: 'How does Java achieve the benefits of multiple inheritance?', a: 'A class can implement multiple interfaces, inheriting multiple types/contracts. Because interfaces traditionally carried no state and conflicting default methods must be resolved explicitly, this provides multiple inheritance of type without the ambiguity of inheriting conflicting implementations.' },
        ],
      },
      {
        id: 'oop-method-hiding',
        topic: 'Method Hiding vs Overriding & Constructor Chaining',
        summary: 'Static methods are hidden, not overridden; constructor chaining links base and derived initialization.',
        explanation:
          'Method overriding occurs when a subclass provides a new implementation for an inherited instance method with the same signature; the call is resolved at runtime based on the actual object type (dynamic dispatch). Method hiding is different: it happens with static methods (and, in C++, with non-virtual methods or by name in derived scope). When a subclass declares a static method with the same signature as a parent static method, it hides the parent version rather than overriding it. The version invoked is decided at compile time based on the reference/declared type, not the runtime object.\n\nThis distinction trips up many candidates. Example: if Parent and Child both have static void show(), then Parent p = new Child(); p.show() calls Parent.show() (hiding, compile-time), whereas for an instance method with the same setup, p.show() would call Child.show() (overriding, runtime). The rule is: static methods are hidden; instance methods are overridden. Fields are also hidden, not overridden, and are resolved by declared type.\n\nConstructor chaining is the process by which constructors call other constructors to avoid duplicate initialization logic. There are two directions. Within the same class, one constructor calls another using this(...) in Java (or delegating constructors in C++). Across the hierarchy, a subclass constructor calls its superclass constructor using super(...) in Java (or the initializer list in C++). If you do not write super(...), Java inserts an implicit call to the no-arg super constructor as the first statement.\n\nFor interviews, remember: the base part of an object must be fully constructed before the derived part, so super(...) (if present) must be the first statement; this(...) and super(...) cannot both appear in the same constructor body as the first call. Being able to contrast overriding vs hiding and to explain the construction order are reliable points to score.',
        diagram: `  OVERRIDING (instance)            HIDING (static)
  Parent p = new Child();          Parent p = new Child();
  p.show();  → Child.show()        p.show();  → Parent.show()
  (runtime / object type)          (compile-time / ref type)

  CONSTRUCTOR CHAINING
  Child() ──super()──► Parent() ──super()──► Object()
          ──this()──► Child(args)   (same-class delegation)`,
        keyPoints: [
          'Overriding: instance methods, resolved at runtime by object type',
          'Hiding: static methods/fields, resolved at compile time by reference type',
          'static methods are hidden, not overridden',
          'this(...) chains constructors within the same class',
          'super(...) calls the parent constructor; implicit no-arg super if omitted',
          'super(...) / this(...) must be the first statement in a constructor',
        ],
        videos: [
          { label: 'Kunal Kushwaha — Overriding & super', url: 'https://www.youtube.com/playlist?list=PL9gnSGHSqcno1G3XjUbwzXHL8_EttOuKk' },
          { label: 'Telusko — Constructor Chaining', url: 'https://www.youtube.com/c/Telusko' },
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/overriding-vs-hiding-java/' },
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/constructor-chaining-java-examples/' },
        ],
        interview: [
          { q: 'What is the difference between method overriding and method hiding?', a: 'Overriding redefines an inherited instance method and is resolved at runtime based on the actual object type. Hiding occurs with static methods (and fields), where the version used is decided at compile time based on the reference/declared type. Static methods are hidden, not overridden.' },
          { q: 'Can you override a static method?', a: 'No. If a subclass declares a static method with the same signature, it hides the parent method rather than overriding it. Resolution is based on the declared reference type at compile time, not the runtime object.' },
          { q: 'What is constructor chaining?', a: 'It is calling one constructor from another to reuse initialization logic. Within a class you use this(...) in Java; across the hierarchy a subclass calls the parent constructor using super(...). It avoids duplicate setup code.' },
          { q: 'What happens if you do not call super() in a subclass constructor?', a: 'Java inserts an implicit call to the parent class no-argument constructor as the first statement. If the parent has no accessible no-arg constructor, you must call an appropriate super(...) explicitly or you get a compile error.' },
          { q: 'Can this() and super() both appear in the same constructor?', a: 'No. Each must be the first statement in the constructor, so you can use only one of them. You can, however, chain: a this(...) target constructor can itself call super(...).' },
        ],
      },
    ],
  },
  {
    focus: 'Polymorphism (Compile-time & Run-time)',
    concepts: [
      {
        id: 'oop-polymorphism-overview',
        topic: 'Polymorphism: Overloading vs Overriding',
        summary: 'Polymorphism is one interface, many forms — via overloading (compile-time) or overriding (runtime).',
        explanation:
          'Polymorphism literally means many forms. In OOP it is the ability of a single interface or name to behave differently depending on context or the actual type of object. It is what lets you write general code that works with many specific types. Polymorphism has two flavors: compile-time (static) polymorphism and runtime (dynamic) polymorphism.\n\nCompile-time polymorphism is achieved through method overloading (and, in C++, operator overloading). Overloading means multiple methods in the same class share the same name but differ in their parameter list (number, types, or order of parameters). The compiler decides which overload to call based on the arguments at compile time. The return type alone cannot distinguish overloads. Example: add(int, int) and add(double, double) are two overloads of add.\n\nRuntime polymorphism is achieved through method overriding. A subclass overrides an inherited instance method with the same signature, and which version executes is decided at runtime based on the actual object type, not the reference type. This is called dynamic dispatch and is the mechanism behind treating different subclasses uniformly through a base reference. Example: Animal a = new Dog(); a.sound() calls Dog.sound() at runtime.\n\nThe interview-critical contrast: overloading is same name + different parameters, resolved at compile time, within a single class, no inheritance needed; overriding is same name + same signature, resolved at runtime, across a class hierarchy, requires inheritance. Overloading is about offering convenient variants; overriding is about specializing inherited behavior. Both are forms of polymorphism but operate at different times and serve different purposes.',
        diagram: `                  POLYMORPHISM
                  (many forms)
            ┌──────────┴──────────┐
   COMPILE-TIME (static)      RUNTIME (dynamic)
   = Method Overloading       = Method Overriding
   same name, diff params     same signature, subclass
   resolved at COMPILE time   resolved at RUN time
   one class                  needs inheritance
   add(int,int)               Animal a = new Dog();
   add(double,double)         a.sound() → Dog.sound()`,
        keyPoints: [
          'Polymorphism = one interface/name, many forms',
          'Overloading: same name, different parameters, compile-time, one class',
          'Overriding: same signature, runtime, across inheritance hierarchy',
          'Return type alone cannot distinguish overloads',
          'Overriding enables dynamic dispatch via base-class references',
          'Two flavors: compile-time (static) and runtime (dynamic)',
        ],
        videos: [
          { label: 'Kunal Kushwaha — Polymorphism', url: 'https://www.youtube.com/playlist?list=PL9gnSGHSqcno1G3XjUbwzXHL8_EttOuKk' },
          { label: 'Telusko — Polymorphism in Java', url: 'https://www.youtube.com/c/Telusko' },
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/polymorphism-in-java/' },
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/difference-between-method-overloading-and-method-overriding-in-java/' },
        ],
        interview: [
          { q: 'What is polymorphism?', a: 'Polymorphism is the ability of a single interface or method name to take many forms, behaving differently based on context or the actual object type. It comes in compile-time (overloading) and runtime (overriding) forms.' },
          { q: 'What is the difference between overloading and overriding?', a: 'Overloading has the same method name with different parameter lists, is resolved at compile time, and lives within one class without needing inheritance. Overriding has the same signature in a subclass, is resolved at runtime, and requires an inheritance relationship.' },
          { q: 'Can methods be overloaded based on return type alone?', a: 'No. Overloads must differ in their parameter list (number, types, or order). Two methods that differ only in return type are not valid overloads and cause a compile error.' },
          { q: 'Is overloading compile-time or runtime polymorphism?', a: 'Overloading is compile-time (static) polymorphism because the compiler selects the correct method based on the argument types at compile time. Overriding is runtime (dynamic) polymorphism.' },
          { q: 'Can you overload the main method in Java?', a: 'Yes, you can declare multiple main methods with different parameters, but the JVM only calls public static void main(String[] args) as the entry point. The other overloads must be called explicitly.' },
          { q: 'Does C++ support operator overloading?', a: 'Yes. C++ lets you redefine operators like +, ==, and << for user-defined types, which is a form of compile-time polymorphism. Java does not support user-defined operator overloading (except the built-in + for strings).' },
        ],
      },
      {
        id: 'oop-binding-vtable',
        topic: 'Static vs Dynamic Binding & the vtable',
        summary: 'Binding links a call to its implementation — at compile time (static) or runtime (dynamic via vtable).',
        explanation:
          'Binding is the association of a method call with the actual method body that runs. Static binding (early binding) happens at compile time: the compiler knows exactly which method to call. This applies to static methods, private methods, final methods, and overloaded methods, and to all method calls in languages without virtual dispatch for those calls. Dynamic binding (late binding) happens at runtime: the decision is deferred until the program runs and depends on the actual type of the object. This applies to overridden instance methods and is the engine of runtime polymorphism.\n\nIn C++ dynamic binding is opt-in: a method must be declared virtual in the base class for calls through a base pointer/reference to dispatch to the derived override. Without virtual, the call is statically bound to the type of the pointer. In Java, instance methods are virtual by default, so overriding is dynamically bound unless the method is static, private, or final.\n\nThe mechanism behind dynamic binding is the virtual table (vtable). Each class with virtual functions has a vtable: an array of pointers to its (possibly overridden) virtual methods. Each object of such a class stores a hidden pointer (the vptr) to its class vtable. When you call a virtual method through a base reference, the runtime follows the objects vptr to its vtable and jumps to the correct function pointer. Because the vtable reflects the objects actual class, the right override is invoked. This indirection costs a small amount of time and one pointer of memory per object.\n\nFor interviews: be able to define static vs dynamic binding, state which calls use each, explain that Java methods are virtual by default while C++ requires the virtual keyword, and describe the vtable/vptr mechanism. A common follow-up is why constructors cannot be virtual (the vptr is not yet set up during base construction) and why base destructors should be virtual.',
        diagram: `   Base* p = new Derived();   p->speak();  // virtual

   object (Derived)        Derived vtable
   ┌──────────────┐        ┌────────────────────────┐
   │ vptr ────────┼──────► │ speak() → Derived::speak│
   │ ...fields... │        │ run()   → Base::run     │
   └──────────────┘        └────────────────────────┘
   runtime follows vptr → vtable → correct override
   (static binding would jump straight to Base::speak)`,
        keyPoints: [
          'Static (early) binding: resolved at compile time',
          'Dynamic (late) binding: resolved at runtime by actual object type',
          'Static binds static/private/final/overloaded methods',
          'Dynamic binds overridden instance (virtual) methods',
          'Java methods virtual by default; C++ needs the virtual keyword',
          'vtable = array of virtual method pointers; each object holds a vptr',
        ],
        videos: [
          { label: 'Concept && Coding — Virtual functions / vtable', url: 'https://www.youtube.com/@ConceptandCoding' },
          { label: 'Telusko — Dynamic Method Dispatch', url: 'https://www.youtube.com/c/Telusko' },
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/virtual-function-cpp/' },
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/static-vs-dynamic-binding-in-java/' },
        ],
        interview: [
          { q: 'What is the difference between static and dynamic binding?', a: 'Static (early) binding resolves a method call to its implementation at compile time, used for static, private, final, and overloaded methods. Dynamic (late) binding resolves the call at runtime based on the actual object type, used for overridden instance methods, and is the basis of runtime polymorphism.' },
          { q: 'What is a vtable?', a: 'A virtual table is a per-class array of pointers to its virtual methods. Each object of such a class stores a hidden pointer (vptr) to its class vtable, so a virtual call is dispatched by following the vptr to the correct override at runtime.' },
          { q: 'What is the virtual keyword in C++?', a: 'It marks a method so that calls through a base-class pointer or reference are dynamically dispatched to the derived class override. Without virtual, the call is statically bound to the pointer type.' },
          { q: 'Are Java methods virtual by default?', a: 'Yes. Java instance methods are virtual by default, so overriding is dynamically bound. Exceptions are static, private, and final methods, which are statically bound and cannot be polymorphically overridden.' },
          { q: 'Why cannot constructors be virtual?', a: 'During construction the object vptr/vtable for the most-derived type is not fully set up, and an object must exist before dispatch can occur. So a constructor is always bound statically to the class being constructed.' },
          { q: 'Why should a base class destructor be virtual?', a: 'So that deleting a derived object through a base pointer invokes the full chain of destructors (derived then base). A non-virtual base destructor would only run the base destructor, leaking the derived parts.' },
        ],
      },
      {
        id: 'oop-upcasting-covariant',
        topic: 'Upcasting, Downcasting & Covariant Returns',
        summary: 'Upcasting treats a subclass as its base; covariant returns let overrides return more specific types.',
        explanation:
          'Upcasting is treating a subclass object through a base-class reference, e.g. Animal a = new Dog(). It is always safe and usually implicit because every Dog IS-A Animal. Upcasting is what enables polymorphism: you store different subclasses in a base-typed variable or collection and call overridden methods uniformly, letting dynamic dispatch pick the right implementation. Through an upcast reference you can only access members declared in the base type, even though the underlying object is the subclass.\n\nDowncasting is the reverse: converting a base reference back to a subclass type, e.g. Dog d = (Dog) a. It is not automatically safe because the base reference might not actually point to that subclass, so it must be explicit and is checked at runtime. In Java, an invalid downcast throws a ClassCastException; you guard it with instanceof. In C++ you use dynamic_cast, which returns nullptr (for pointers) or throws (for references) on failure. Downcasting is a sign you may be missing a polymorphic method; it should be used sparingly.\n\nCovariant return types allow an overriding method to return a type that is a subclass of the return type declared in the parent method. For example, if Animal reproduce() returns Animal, an override in Dog may return Dog instead of Animal. This was added in Java 5 and is supported in C++ as well. It makes APIs more precise: callers using a Dog reference get a Dog back without casting, while polymorphism through the base type still works.\n\nFor interviews: explain that upcasting is implicit and safe and is what powers polymorphism, downcasting is explicit and runtime-checked, and covariant returns let overrides narrow the return type. A frequent question is what you can access through an upcast reference (only base-type members, but overridden behavior is the subclass version due to dynamic dispatch).',
        diagram: `   UPCASTING (safe, implicit)        DOWNCASTING (explicit, checked)
   Animal a = new Dog();             Dog d = (Dog) a;   // needs check
        Dog ──► Animal                    Animal ──► Dog
   access only Animal members        risk: ClassCastException

   COVARIANT RETURN
   class Animal { Animal create(){...} }
   class Dog    { Dog    create(){...} }  // override narrows return`,
        keyPoints: [
          'Upcasting: subclass → base reference; implicit, always safe',
          'Upcasting enables polymorphism (uniform base-typed handling)',
          'Through an upcast reference you see only base-declared members',
          'Downcasting: base → subclass; explicit, runtime-checked',
          'Java guards downcast with instanceof; C++ uses dynamic_cast',
          'Covariant return: override may return a subtype of the parent return',
        ],
        videos: [
          { label: 'Telusko — Upcasting & Downcasting', url: 'https://www.youtube.com/c/Telusko' },
          { label: 'Kunal Kushwaha — Polymorphism & casting', url: 'https://www.youtube.com/playlist?list=PL9gnSGHSqcno1G3XjUbwzXHL8_EttOuKk' },
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/upcasting-vs-downcasting-in-java/' },
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/covariant-return-types-in-java/' },
        ],
        interview: [
          { q: 'What is upcasting?', a: 'Upcasting is assigning a subclass object to a base-class reference, e.g. Animal a = new Dog(). It is implicit and always safe, and it enables polymorphism by letting you handle many subclasses uniformly through the base type.' },
          { q: 'What is downcasting and is it safe?', a: 'Downcasting converts a base reference back to a subclass type, e.g. Dog d = (Dog) a. It is not inherently safe because the object may not be that subclass, so it must be explicit and is checked at runtime, throwing ClassCastException (Java) on failure.' },
          { q: 'What members can you access through an upcast reference?', a: 'Only the members declared in the base type. However, for overridden methods the subclass implementation runs due to dynamic dispatch, so behavior is the subclass version even though visibility is the base interface.' },
          { q: 'What is a covariant return type?', a: 'It allows an overriding method to return a subtype of the type returned by the parent method, e.g. an override of Animal create() may return Dog. It makes APIs more precise and avoids casting at the call site.' },
          { q: 'How do you safely downcast in Java?', a: 'Check the type first with instanceof (or pattern matching) before casting, e.g. if (a instanceof Dog d) { ... }. This avoids a ClassCastException at runtime.' },
        ],
      },
    ],
  },
  {
    focus: 'Abstract Classes & Interfaces',
    concepts: [
      {
        id: 'oop-abstract-class',
        topic: 'Abstract Classes & Pure Virtual Functions',
        summary: 'An abstract class cannot be instantiated and may declare abstract methods subclasses must implement.',
        explanation:
          'An abstract class is a class that cannot be instantiated on its own; it is meant to be extended. It can contain a mix of concrete methods (with bodies), abstract methods (declared without a body), constructors, instance and static fields, and any access modifiers. In Java you mark it with the abstract keyword; an abstract method is also declared abstract and has no body. In C++ the equivalent is a class with at least one pure virtual function, declared as virtual void f() = 0; such a class is called an abstract base class.\n\nThe purpose of an abstract class is to provide a partial implementation and a common base while forcing subclasses to fill in the missing behavior. For example, an abstract Shape class can implement a concrete describe() method and a stored color field, but declare area() as abstract because each concrete shape computes area differently. Any concrete subclass (Circle, Rectangle) must override area() or itself be declared abstract.\n\nAbstract classes are ideal when subclasses share state and some behavior, not just a contract. Because an abstract class can hold fields and concrete methods, it captures the common is-a backbone of a hierarchy. You can still hold an abstract type reference (Shape s = new Circle()) and rely on polymorphism, you just cannot do new Shape().\n\nFor interviews, the headline facts: an abstract class cannot be instantiated; it can have constructors (called via subclass super()); it can have both abstract and concrete methods and any number of fields; a class with even one abstract method must be declared abstract; and a pure virtual function (= 0) in C++ makes a class abstract. The key decision point versus interfaces is whether you need shared state/implementation (abstract class) or a pure contract that many unrelated classes can adopt (interface).',
        diagram: `        ┌──────────────────────────────┐
        │   «abstract» Shape           │  cannot do new Shape()
        ├──────────────────────────────┤
        │  # color : String  (state)   │
        │  + describe()  {concrete}    │
        │  + area() : double  {abstract}│ ◄ subclasses MUST implement
        └───────────────▲──────────────┘
            ┌───────────┴───────────┐
       ┌────┴─────┐            ┌─────┴──────┐
       │ Circle   │            │ Rectangle  │
       │ area(){} │            │ area(){}   │
       └──────────┘            └────────────┘`,
        keyPoints: [
          'Abstract class cannot be instantiated; must be extended',
          'Can mix abstract and concrete methods, fields, and constructors',
          'A class with any abstract method must itself be abstract',
          'C++ uses pure virtual functions (= 0) for abstract base classes',
          'Subclasses must implement all abstract methods or be abstract too',
          'Best when subclasses share state and partial implementation',
        ],
        videos: [
          { label: 'Kunal Kushwaha — Abstract Classes & Interfaces', url: 'https://www.youtube.com/playlist?list=PL9gnSGHSqcno1G3XjUbwzXHL8_EttOuKk' },
          { label: 'Telusko — Abstract Class in Java', url: 'https://www.youtube.com/c/Telusko' },
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/abstract-classes-in-java/' },
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/pure-virtual-functions-and-abstract-classes/' },
        ],
        interview: [
          { q: 'What is an abstract class?', a: 'A class that cannot be instantiated and is designed to be extended. It can contain abstract methods (no body) that subclasses must implement, along with concrete methods, fields, and constructors.' },
          { q: 'Can an abstract class have a constructor?', a: 'Yes. It cannot be instantiated directly, but its constructor is invoked via super() when a subclass object is created, to initialize the inherited (abstract base) state.' },
          { q: 'What is a pure virtual function in C++?', a: 'A virtual function declared with = 0 and no implementation, e.g. virtual void draw() = 0;. A class with at least one pure virtual function becomes an abstract base class that cannot be instantiated.' },
          { q: 'Can an abstract class have concrete (non-abstract) methods?', a: 'Yes. An abstract class can have fully implemented methods and fields alongside abstract methods. This lets it provide shared behavior and state while leaving some methods for subclasses to define.' },
          { q: 'What happens if a subclass does not implement all abstract methods?', a: 'Then the subclass still has unimplemented abstract methods, so it must itself be declared abstract and cannot be instantiated until a further subclass implements them.' },
          { q: 'Can you create a reference of an abstract class type?', a: 'Yes. You cannot instantiate it, but you can declare a reference of the abstract type and point it to a concrete subclass object, then use it polymorphically, e.g. Shape s = new Circle().' },
        ],
      },
      {
        id: 'oop-interface',
        topic: 'Interfaces, Default Methods & Multiple Inheritance',
        summary: 'An interface is a pure contract of methods that a class implements, enabling multiple inheritance of type.',
        explanation:
          'An interface defines a contract: a set of method signatures that an implementing class must provide, without (traditionally) any implementation or instance state. In Java a class uses implements to adopt an interface, and a class can implement many interfaces at once, which is how Java provides multiple inheritance of type while disallowing multiple inheritance of classes. Interface methods are implicitly public and abstract, and interface variables are implicitly public static final constants.\n\nSince Java 8, interfaces can include default methods (concrete methods with a body, marked default) and static methods, and since Java 9 private methods. Default methods let interfaces evolve by adding new behavior without breaking existing implementers, and they provide optional shared logic. This blurred the old line between interfaces and abstract classes, but interfaces still cannot hold instance state (only constants), which remains a core difference.\n\nInterfaces are the right tool when you want to specify what a class can do regardless of where it sits in the class hierarchy. Unrelated classes (e.g. Bird and Airplane) can both implement a Flyable interface even though they share no common ancestor. This expresses capability/behavior rather than identity. Programming to interfaces (List list = new ArrayList()) is a best practice that reduces coupling and makes implementations swappable.\n\nFor interviews: state that an interface is a pure contract, that a class can implement multiple interfaces (multiple inheritance of type), that interface fields are constants, and that Java 8+ added default/static methods and Java 9 private methods. Be ready to resolve the default-method diamond (override and call Interface.super.method()), and to contrast interface (capability/contract, no state) with abstract class (partial implementation, shared state).',
        diagram: `   class Duck implements Swimmable, Flyable
   (multiple inheritance of TYPE via interfaces)

   «interface» Swimmable        «interface» Flyable
   + swim()                     + fly()
   + float() default {...}      + glide() default {...}
            \\                    /
             \\                  /
              ┌────────────────┐
              │     Duck       │  must provide swim()/fly()
              └────────────────┘  inherits default float()/glide()`,
        keyPoints: [
          'Interface = pure contract of method signatures (capability)',
          'A class can implement many interfaces — multiple inheritance of type',
          'Interface variables are public static final constants',
          'Java 8+: default & static methods; Java 9: private methods',
          'Interfaces hold no instance state; abstract classes can',
          'Program to interfaces to reduce coupling and swap implementations',
        ],
        videos: [
          { label: 'Telusko — Interfaces in Java', url: 'https://www.youtube.com/c/Telusko' },
          { label: 'Kunal Kushwaha — Interfaces & default methods', url: 'https://www.youtube.com/playlist?list=PL9gnSGHSqcno1G3XjUbwzXHL8_EttOuKk' },
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/interfaces-in-java/' },
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/default-methods-java/' },
        ],
        interview: [
          { q: 'What is an interface?', a: 'An interface is a contract that declares method signatures a class must implement, without instance state. It specifies what a class can do, not how, and a class adopts it using implements (Java).' },
          { q: 'How does Java achieve multiple inheritance using interfaces?', a: 'A class can implement multiple interfaces simultaneously, inheriting multiple type contracts. Since interfaces carry no instance state and default-method conflicts must be resolved explicitly, this avoids the ambiguity of multiple class inheritance.' },
          { q: 'What is a default method?', a: 'A concrete method with a body defined inside an interface (since Java 8), marked with default. It lets interfaces add new behavior without breaking existing implementers and provides optional shared logic.' },
          { q: 'Can interface variables be modified?', a: 'No. Interface variables are implicitly public, static, and final, i.e. constants, so they must be assigned at declaration and cannot be changed.' },
          { q: 'What happens if two interfaces have the same default method?', a: 'The implementing class must override the method to resolve the conflict; it can delegate to a chosen one using InterfaceName.super.method(). Otherwise the code does not compile.' },
          { q: 'Can an interface extend another interface?', a: 'Yes. An interface can extend one or more other interfaces (multiple inheritance of interfaces), accumulating all their method contracts. A class implementing it must satisfy the combined contract.' },
        ],
      },
      {
        id: 'oop-abstract-vs-interface',
        topic: 'Abstract Class vs Interface: When to Use Which',
        summary: 'Abstract classes share state and partial implementation; interfaces define capabilities and contracts.',
        explanation:
          'Abstract classes and interfaces both let you program to abstractions and achieve polymorphism, but they serve different design intents. An abstract class represents a strong IS-A relationship and a partial implementation: it can hold instance state (fields), constructors, and concrete methods, and a class can extend only one of them. An interface represents a capability or contract (CAN-DO): it holds no instance state, and a class can implement many interfaces.\n\nThe decision rule: use an abstract class when related classes share common state and behavior and form a natural type hierarchy (e.g. an abstract Vehicle base for Car and Truck with shared fuel logic). Use an interface when unrelated classes need a common capability regardless of their place in the hierarchy (e.g. Comparable, Serializable, Flyable). If you only need to declare a contract that many disparate classes can adopt, choose an interface; if you need to share code and fields among close relatives, choose an abstract class.\n\nKey technical differences in Java: a class can extend one abstract class but implement multiple interfaces; abstract classes can have any access modifier members while interface members are public by default; abstract classes can have constructors and instance fields, interfaces cannot have instance fields (only public static final constants); since Java 8 both can have concrete methods (interface via default/static), but only abstract classes hold mutable state. In C++, the line is blurrier because there are no separate interfaces, an interface is just an abstract class with only pure virtual functions and no data, and C++ allows multiple inheritance of such classes.\n\nFor interviews this is a guaranteed question. Give the design intent (IS-A/shared implementation vs CAN-DO/contract), the single-inheritance vs multiple-implementation rule, the state difference (interfaces hold no instance state), and a concrete example of each. Mentioning that Java 8 default methods narrowed but did not erase the distinction shows depth.',
        diagram: `                Abstract Class        Interface
  Inheritance   extend ONE            implement MANY
  State/fields  yes (instance)        no (only constants)
  Constructors  yes                   no
  Methods       abstract + concrete   abstract + default/static
  Intent        IS-A, share impl      CAN-DO, contract
  Use when      close relatives       unrelated capabilities
                share code/state      across the hierarchy`,
        keyPoints: [
          'Abstract class: IS-A + partial implementation + shared state',
          'Interface: CAN-DO capability/contract, no instance state',
          'Extend one abstract class; implement many interfaces',
          'Interfaces have only public static final constants (no fields)',
          'Use abstract class for close relatives sharing code/state',
          'Use interface for common capabilities across unrelated classes',
        ],
        videos: [
          { label: 'Kunal Kushwaha — Abstract vs Interface', url: 'https://www.youtube.com/playlist?list=PL9gnSGHSqcno1G3XjUbwzXHL8_EttOuKk' },
          { label: 'Telusko — Abstract Class vs Interface', url: 'https://www.youtube.com/c/Telusko' },
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/difference-between-abstract-class-and-interface-in-java/' },
          { label: 'Javatpoint', url: 'https://www.javatpoint.com/difference-between-abstract-class-and-interface' },
        ],
        interview: [
          { q: 'What is the difference between an abstract class and an interface?', a: 'An abstract class can have instance state, constructors, and a mix of abstract and concrete methods, and a class can extend only one. An interface is a contract with no instance state (only constants), and a class can implement many. Abstract class models IS-A with shared implementation; interface models a CAN-DO capability.' },
          { q: 'When should you use an interface over an abstract class?', a: 'Use an interface when unrelated classes need a common capability regardless of hierarchy (e.g. Comparable, Flyable), or when you need multiple inheritance of type. Use an abstract class when closely related classes share state and partial implementation.' },
          { q: 'Can an abstract class implement an interface?', a: 'Yes. An abstract class can implement an interface and may leave some or all of the interface methods unimplemented (declaring them abstract) for its concrete subclasses to provide.' },
          { q: 'Can interfaces have constructors?', a: 'No. Interfaces cannot have constructors because they hold no instance state to initialize and cannot be instantiated. Abstract classes can have constructors, invoked via subclass super().' },
          { q: 'Did Java 8 default methods make interfaces the same as abstract classes?', a: 'No. Default methods let interfaces carry concrete behavior, but interfaces still cannot hold instance state, cannot have constructors, and a class can implement many interfaces but extend only one abstract class. The design intents remain distinct.' },
          { q: 'How many interfaces and abstract classes can a Java class inherit?', a: 'A class can implement any number of interfaces but can extend only one class (abstract or concrete). This is why interfaces are used to simulate multiple inheritance of type.' },
        ],
      },
    ],
  },
  {
    focus: 'The Four Pillars in Practice + Relationships',
    concepts: [
      {
        id: 'oop-four-pillars',
        topic: 'The Four Pillars Working Together',
        summary: 'Encapsulation, abstraction, inheritance, and polymorphism combine to build robust OOP designs.',
        explanation:
          'The four pillars of OOP are encapsulation, abstraction, inheritance, and polymorphism. Each addresses a different concern, and well-designed systems use them together rather than in isolation. Encapsulation bundles data with the methods that act on it and hides internal state behind a controlled interface. Abstraction exposes only the essential operations and hides complexity, typically via abstract classes and interfaces. Inheritance models IS-A relationships and lets subclasses reuse and extend a base. Polymorphism lets one interface drive many implementations, resolved by overloading or overriding.\n\nConsider a payments system. An abstract PaymentMethod (abstraction) declares pay(amount). Concrete CreditCard, UPI, and Wallet classes inherit it (inheritance) and each provides its own pay() (polymorphism via overriding). Each keeps its credentials private and validates inputs through methods (encapsulation). The checkout code holds a PaymentMethod reference and calls pay() without knowing the concrete type, dispatched dynamically. Adding a new method (e.g. NetBanking) requires no change to checkout, demonstrating how the pillars yield extensible, low-coupling designs.\n\nThe pillars reinforce each other. Encapsulation makes abstraction trustworthy by guaranteeing the hidden state cannot be corrupted. Inheritance and interfaces realize abstraction by providing the concrete types behind a contract. Polymorphism makes abstraction useful by letting client code operate on the abstract type while the right concrete behavior runs. Together they deliver the headline OOP benefits: reusability, maintainability, extensibility, and a clean mapping to real-world domains.\n\nFor interviews, be able to define all four crisply, give a single cohesive example that uses all of them (like the payments example), and explain how they interrelate rather than just listing them. Interviewers often ask you to identify each pillar in a small code snippet, so practice spotting private fields (encapsulation), abstract types/interfaces (abstraction), extends/implements (inheritance), and overridden/overloaded methods (polymorphism).',
        diagram: `        FOUR PILLARS in one design (payments)
   ┌────────────────────────────────────────────────┐
   │ «abstract» PaymentMethod   ← ABSTRACTION         │
   │   - credentials (private)  ← ENCAPSULATION       │
   │   + pay(amount)                                  │
   └───────────────▲──────────────────────────────────┘
        extends (INHERITANCE) │
     ┌──────────────┼───────────────┐
   CreditCard      UPI            Wallet
   pay(){...}    pay(){...}      pay(){...}  ← POLYMORPHISM
   checkout holds PaymentMethod, calls pay() (dynamic dispatch)`,
        keyPoints: [
          'Four pillars: encapsulation, abstraction, inheritance, polymorphism',
          'Encapsulation hides state; abstraction hides complexity',
          'Inheritance models IS-A; polymorphism gives one interface, many forms',
          'They reinforce each other in real designs (e.g. payment methods)',
          'Together they yield reuse, maintainability, and extensibility',
          'Spot each pillar in code: private fields, interfaces, extends, overriding',
        ],
        videos: [
          { label: 'Kunal Kushwaha — OOP Principles (all four)', url: 'https://www.youtube.com/playlist?list=PL9gnSGHSqcno1G3XjUbwzXHL8_EttOuKk' },
          { label: 'Telusko — Four Pillars of OOP', url: 'https://www.youtube.com/c/Telusko' },
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/understanding-encapsulation-inheritance-polymorphism-abstraction-in-oops/' },
          { label: 'Programiz', url: 'https://www.programiz.com/java-programming/oop' },
        ],
        interview: [
          { q: 'What are the four pillars of OOP?', a: 'Encapsulation (bundling data with methods and hiding state), abstraction (exposing essentials and hiding complexity), inheritance (reusing and extending via IS-A relationships), and polymorphism (one interface, many forms via overloading/overriding).' },
          { q: 'How do the four pillars work together?', a: 'Encapsulation protects state so abstraction can be trusted; inheritance and interfaces provide concrete types behind an abstract contract; and polymorphism lets client code use the abstract type while the right concrete behavior runs. Together they produce reusable, extensible, low-coupling designs.' },
          { q: 'Give one example that uses all four pillars.', a: 'An abstract PaymentMethod (abstraction) is extended by CreditCard, UPI, Wallet (inheritance), each overriding pay() (polymorphism) while keeping credentials private and validated (encapsulation). Checkout uses a PaymentMethod reference and is unaffected when new methods are added.' },
          { q: 'Which pillar enables runtime flexibility?', a: 'Polymorphism, specifically runtime polymorphism via overriding and dynamic dispatch, lets the same call execute different implementations based on the actual object type, enabling flexible and extensible behavior.' },
          { q: 'How would you identify the pillars in a code snippet?', a: 'Look for private fields with getters/setters (encapsulation), abstract classes/interfaces and references to them (abstraction), extends/implements (inheritance), and overloaded or overridden methods (polymorphism).' },
        ],
      },
      {
        id: 'oop-relationships',
        topic: 'Association, Aggregation & Composition (HAS-A)',
        summary: 'HAS-A relationships range from loose association to part-whole aggregation and owning composition.',
        explanation:
          'Besides IS-A (inheritance), objects relate through HAS-A relationships, where one object contains or uses another. These come in three strengths. Association is the most general: two objects are related and can interact, but neither owns the other and they have independent lifecycles. Example: a Teacher and a Student know each other; either can exist without the other. Association can be one-to-one, one-to-many, etc.\n\nAggregation is a specialized association expressing a part-whole (has-a) relationship with shared ownership and independent lifecycles. The part can exist without the whole and can be shared among wholes. Example: a Department has Professors, but a Professor can exist without the Department and could belong to another. In UML, aggregation is drawn with a hollow diamond at the whole end.\n\nComposition is a stronger part-whole relationship with exclusive ownership and dependent lifecycles: the part cannot meaningfully exist without the whole, and when the whole is destroyed, its parts are destroyed too. Example: a House has Rooms; destroy the house and the rooms cease to exist, and a room belongs to exactly one house. In UML, composition is drawn with a filled diamond at the whole end. In code, composition usually means the whole creates and owns the part internally.\n\nThe interview-critical distinction is lifecycle and ownership. Association = uses-a, no ownership. Aggregation = has-a, shared/weak ownership, part survives the whole. Composition = owns-a, strong ownership, part dies with the whole. A practical heuristic: if the contained object is created and destroyed with the container and is not shared, it is composition; if it is passed in and can outlive or be shared, it is aggregation. These relationships, together with the composition over inheritance guideline, are central to good OOP design.',
        diagram: `   ASSOCIATION ──── (uses-a, no ownership, plain line)
     Teacher ───────── Student

   AGGREGATION ◇──── (has-a, weak/shared, part survives whole)
     Department ◇──── Professor      (hollow diamond)

   COMPOSITION ◆──── (owns-a, strong, part dies with whole)
     House ◆──── Room                (filled diamond)

   strength:  association < aggregation < composition`,
        keyPoints: [
          'Association: objects related/interact, no ownership, independent lifecycles',
          'Aggregation: part-whole, weak/shared ownership, part survives the whole',
          'Composition: part-whole, strong ownership, part dies with the whole',
          'UML: hollow diamond = aggregation, filled diamond = composition',
          'Key distinguisher is ownership and lifecycle dependency',
          'Heuristic: created/destroyed with container & not shared → composition',
        ],
        videos: [
          { label: 'Concept && Coding — Association/Aggregation/Composition', url: 'https://www.youtube.com/@ConceptandCoding' },
          { label: 'Telusko — HAS-A relationship', url: 'https://www.youtube.com/c/Telusko' },
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/association-composition-aggregation-java/' },
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/association-in-java/' },
        ],
        interview: [
          { q: 'What is the difference between association, aggregation, and composition?', a: 'Association is a general relationship where objects interact with no ownership and independent lifecycles. Aggregation is a part-whole with weak/shared ownership where the part can outlive the whole. Composition is a part-whole with strong ownership where the part is created and destroyed with the whole.' },
          { q: 'What is a HAS-A relationship?', a: 'It is a relationship where one object contains or uses another, as opposed to IS-A (inheritance). Aggregation and composition are specific forms of HAS-A that express part-whole containment.' },
          { q: 'How do you decide between aggregation and composition?', a: 'Look at ownership and lifecycle. If the part is created and destroyed with the whole and is not shared, it is composition (e.g. House–Room). If the part can exist independently or be shared among wholes, it is aggregation (e.g. Department–Professor).' },
          { q: 'How are these relationships shown in UML?', a: 'Association is a plain line; aggregation is a line with a hollow diamond at the whole end; composition is a line with a filled (solid) diamond at the whole end.' },
          { q: 'Is composition a form of association?', a: 'Yes. Both aggregation and composition are stronger, more specific forms of association that add part-whole semantics, with composition adding exclusive ownership and dependent lifecycle.' },
        ],
      },
      {
        id: 'oop-coupling-cohesion',
        topic: 'Coupling, Cohesion & Composition over Inheritance',
        summary: 'Aim for low coupling and high cohesion; favor composition over inheritance for flexible designs.',
        explanation:
          'Coupling measures how dependent modules/classes are on one another. Tight (high) coupling means a change in one class forces changes in others, making the system rigid and hard to test. Loose (low) coupling means classes interact through stable abstractions (interfaces) and know little about each others internals, so they can evolve independently. Good design aims for loose coupling, typically achieved via interfaces, dependency injection, and programming to abstractions.\n\nCohesion measures how focused a single class/module is. High cohesion means a class has one clear, well-defined responsibility and all its members work toward it. Low cohesion means a class does many unrelated things (a god class), which is hard to understand and change. Good design aims for high cohesion, which aligns closely with the Single Responsibility Principle. The mantra is low coupling, high cohesion.\n\nComposition over inheritance is a closely related guideline. Inheritance creates a tight, compile-time, IS-A bond to a base class; misusing it for code reuse leads to deep, fragile hierarchies (the fragile base class problem) and inflexible designs that cannot change behavior at runtime. Composition (HAS-A) assembles behavior by holding references to other objects, which is more flexible: you can swap parts, change behavior at runtime, and avoid inheriting unwanted members. For example, instead of a Car extending Engine (wrong IS-A), a Car has an Engine that can be a PetrolEngine or ElectricEngine chosen at runtime.\n\nFor interviews, define coupling and cohesion, state the goal (low coupling, high cohesion), and explain why composition is usually preferred over inheritance: greater flexibility, reduced coupling, runtime behavior change, and avoidance of fragile hierarchies. Note that inheritance is still appropriate for genuine IS-A relationships and when you want polymorphic substitution. These ideas underpin the SOLID principles covered next.',
        diagram: `  COUPLING  (between classes)     COHESION  (within a class)
  tight ─────────► loose          low ─────────► high
  A↔B↔C tangled    A→Iface←B       does many things → one job
  GOAL: low coupling              GOAL: high cohesion

  COMPOSITION over INHERITANCE
  Car extends Engine   ✗ (wrong IS-A, rigid)
  Car ◆── Engine       ✔ (HAS-A, swap Petrol/Electric at runtime)`,
        keyPoints: [
          'Coupling = inter-class dependency; aim for loose coupling',
          'Cohesion = intra-class focus; aim for high cohesion',
          'Mantra: low coupling, high cohesion',
          'Loose coupling via interfaces, dependency injection, abstractions',
          'Composition (HAS-A) is more flexible than inheritance for reuse',
          'Use inheritance only for genuine IS-A and polymorphic substitution',
        ],
        videos: [
          { label: 'Concept && Coding — Coupling, Cohesion & Composition', url: 'https://www.youtube.com/@ConceptandCoding' },
          { label: 'Telusko — Composition vs Inheritance', url: 'https://www.youtube.com/c/Telusko' },
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/coupling-in-java/' },
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/difference-between-inheritance-and-composition-in-java/' },
        ],
        interview: [
          { q: 'What is the difference between coupling and cohesion?', a: 'Coupling measures interdependence between classes; we want it low so changes stay localized. Cohesion measures how focused a single class is on one responsibility; we want it high. The design goal is low coupling and high cohesion.' },
          { q: 'Why is composition preferred over inheritance?', a: 'Composition (HAS-A) is more flexible: you can swap parts, change behavior at runtime, and avoid inheriting unwanted members or the fragile base class problem. Inheritance creates tight compile-time coupling and should be reserved for genuine IS-A relationships.' },
          { q: 'What is tight coupling and why is it bad?', a: 'Tight coupling means classes depend heavily on each others concrete details, so a change in one forces changes in others and units are hard to test in isolation. It makes the system rigid and fragile.' },
          { q: 'How do you achieve loose coupling?', a: 'By programming to interfaces/abstractions, using dependency injection to supply dependencies, and avoiding direct dependence on concrete implementations. This is essentially the Dependency Inversion Principle in action.' },
          { q: 'What is the fragile base class problem?', a: 'It is when changes to a base class unexpectedly break subclasses that depended on its internal behavior. Deep inheritance hierarchies are especially vulnerable, which is a key reason to favor composition.' },
          { q: 'Is high cohesion related to any SOLID principle?', a: 'Yes, it aligns directly with the Single Responsibility Principle: a highly cohesive class has one clear responsibility and therefore one reason to change.' },
        ],
      },
    ],
  },
  {
    focus: 'SOLID Principles',
    concepts: [
      {
        id: 'oop-srp-ocp',
        topic: 'SRP & OCP (Single Responsibility, Open/Closed)',
        summary: 'A class should have one reason to change, and be open to extension but closed to modification.',
        explanation:
          'SOLID is a set of five object-oriented design principles introduced by Robert C. Martin that make software easier to maintain, extend, and test. The first two are SRP and OCP.\n\nSingle Responsibility Principle (SRP): a class should have only one reason to change, meaning it should do exactly one job. A bad example is an Invoice class that calculates totals, saves itself to the database, and prints itself, mixing business logic, persistence, and presentation, so a change to printing risks breaking persistence. The good design splits these into InvoiceCalculator, InvoiceRepository, and InvoicePrinter, each with one responsibility. This improves cohesion, makes classes easier to test, and limits the ripple effect of changes. SRP is closely tied to high cohesion.\n\nOpen/Closed Principle (OCP): software entities should be open for extension but closed for modification. You should be able to add new behavior without changing existing, tested code. A bad example is an AreaCalculator with a big if/else over shape types; adding a new shape forces editing that method. The good design defines a Shape abstraction with an area() method, and each new shape is a new class implementing it, so the calculator never changes when you add shapes. OCP is typically achieved through abstraction and polymorphism (interfaces, inheritance).\n\nWhy they matter: together SRP and OCP reduce the risk and cost of change. SRP keeps each class small and focused so changes are localized; OCP lets the system grow by adding code rather than editing working code, which protects against regressions. For interviews, give the one-line definition of each, a quick bad-vs-good contrast, and the underlying technique (separation of concerns for SRP, abstraction/polymorphism for OCP).',
        diagram: `  SRP: one class, one reason to change
   Invoice (BAD: calc + save + print)
        ├─► InvoiceCalculator   (calc)
        ├─► InvoiceRepository   (save)
        └─► InvoicePrinter      (print)   each = 1 job

  OCP: open to extend, closed to modify
   «interface» Shape { area() }
        ▲        ▲         ▲
     Circle  Rectangle  Triangle(new)  ← add class, don't edit calc`,
        keyPoints: [
          'SOLID = SRP, OCP, LSP, ISP, DIP (Robert C. Martin)',
          'SRP: a class should have exactly one reason to change',
          'SRP via separation of concerns; aligns with high cohesion',
          'OCP: open for extension, closed for modification',
          'OCP via abstraction + polymorphism (add classes, not edits)',
          'Together they localize change and prevent regressions',
        ],
        videos: [
          { label: 'Concept && Coding — SOLID Principles', url: 'https://www.youtube.com/@ConceptandCoding' },
          { label: 'Telusko — SOLID Principles', url: 'https://www.youtube.com/c/Telusko' },
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/solid-principle-in-programming-understand-with-real-life-examples/' },
          { label: 'refactoring.guru', url: 'https://refactoring.guru/design-principles' },
        ],
        interview: [
          { q: 'What does SOLID stand for?', a: 'Single Responsibility Principle, Open/Closed Principle, Liskov Substitution Principle, Interface Segregation Principle, and Dependency Inversion Principle. They are five OOP design principles for maintainable, extensible code.' },
          { q: 'What is the Single Responsibility Principle?', a: 'A class should have only one reason to change, i.e. one responsibility. Mixing concerns like business logic, persistence, and presentation in one class violates SRP; splitting them into focused classes improves cohesion and testability.' },
          { q: 'What is the Open/Closed Principle?', a: 'Software entities should be open for extension but closed for modification: you add new behavior by adding new code (new subclasses/implementations) rather than editing existing, tested code, typically using abstraction and polymorphism.' },
          { q: 'How do you apply OCP in practice?', a: 'Depend on an abstraction (interface/abstract class) and implement new variants as new classes. For example, replace a switch over shape types with a Shape interface so adding a shape never modifies the calculator.' },
          { q: 'How is SRP related to cohesion?', a: 'They are two views of the same idea: a class following SRP has one responsibility, which makes it highly cohesive because all its members serve that single purpose.' },
        ],
      },
      {
        id: 'oop-lsp-isp',
        topic: 'LSP & ISP (Liskov Substitution, Interface Segregation)',
        summary: 'Subtypes must be substitutable for their base; clients should not depend on methods they do not use.',
        explanation:
          'Liskov Substitution Principle (LSP): objects of a subclass must be substitutable for objects of their base class without breaking the program. In other words, a subclass should honor the contract (expected behavior, preconditions, postconditions, invariants) of its base. The classic violation is the Rectangle/Square problem: making Square extend Rectangle breaks code that sets width and height independently, because a Square forces them equal, so substituting a Square where a Rectangle is expected produces wrong results. The fix is to not model Square as a subtype of Rectangle (use a separate abstraction or composition). Another sign of LSP violation is a subclass that throws UnsupportedOperationException or weakens guarantees of an inherited method. LSP ensures inheritance hierarchies are behaviorally sound, not just syntactically valid.\n\nInterface Segregation Principle (ISP): clients should not be forced to depend on methods they do not use. Prefer many small, role-specific interfaces over one large, fat interface. A bad example is a Worker interface with work() and eat(); a RobotWorker forced to implement eat() must throw or no-op, a smell. The good design splits it into Workable and Eatable, so each class implements only what it needs. ISP keeps interfaces focused (a kind of cohesion at the interface level) and reduces coupling, because implementers and clients are not burdened by irrelevant methods.\n\nWhy they matter: LSP makes polymorphism trustworthy. If subtypes are truly substitutable, code written against the base type works for all subtypes, which is the whole point of inheritance and OCP. ISP keeps abstractions lean so changes to one capability do not force unrelated classes to recompile or implement no-op methods.\n\nFor interviews: state LSP as substitutability without breaking correctness (give the Square/Rectangle example), and ISP as no client forced to depend on unused methods (give the fat-interface split example). Both principles are about designing honest abstractions: LSP for inheritance, ISP for interfaces.',
        diagram: `  LSP: subtype substitutable for base (honor contract)
    Rectangle r = new Square();  // BAD if Square breaks
    r.setW(5); r.setH(4);        //   independent set assumption
    assert area == 20            //   fails for Square → violates LSP

  ISP: split fat interfaces into role-specific ones
    Worker{work(); eat()}  ✗   →   Workable{work()}  ✔
    RobotWorker forced eat()        Eatable {eat()}   ✔`,
        keyPoints: [
          'LSP: subtypes must be substitutable for their base type',
          'Subclasses must honor base contracts (no broken/weakened behavior)',
          'Square-extends-Rectangle is the classic LSP violation',
          'ISP: no client forced to depend on methods it does not use',
          'Prefer many small role interfaces over one fat interface',
          'LSP keeps polymorphism safe; ISP keeps interfaces lean',
        ],
        videos: [
          { label: 'Concept && Coding — LSP & ISP', url: 'https://www.youtube.com/@ConceptandCoding' },
          { label: 'Telusko — SOLID (LSP/ISP)', url: 'https://www.youtube.com/c/Telusko' },
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/liskov-substitution-principle-in-system-design/' },
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/interface-segregation-principle/' },
        ],
        interview: [
          { q: 'What is the Liskov Substitution Principle?', a: 'Objects of a subclass must be substitutable for objects of the base class without breaking correctness. Subclasses must honor the base contract, including preconditions, postconditions, and invariants, so code written against the base works for any subtype.' },
          { q: 'Give an example that violates LSP.', a: 'Making Square extend Rectangle. Code that sets width and height independently expects them to vary, but a Square forces them equal, so substituting a Square produces wrong area results, breaking the base contract.' },
          { q: 'What is the Interface Segregation Principle?', a: 'Clients should not be forced to depend on methods they do not use. Instead of one large interface, define several small, role-specific interfaces so each class implements only the methods relevant to it.' },
          { q: 'How does ISP improve a design?', a: 'It keeps interfaces focused and cohesive, reduces coupling, and avoids forcing classes to implement irrelevant no-op or exception-throwing methods. Changes to one capability then do not ripple into unrelated implementers.' },
          { q: 'How is LSP related to inheritance and OCP?', a: 'LSP makes inheritance behaviorally sound so that polymorphic substitution is safe; this is exactly what OCP relies on when client code works with a base abstraction and new subtypes are added without modification.' },
          { q: 'What is a code smell that indicates an LSP violation?', a: 'A subclass that overrides a method to throw UnsupportedOperationException, returns invalid results, or strengthens preconditions/weakens postconditions, because it can no longer safely stand in for its base type.' },
        ],
      },
      {
        id: 'oop-dip',
        topic: 'DIP (Dependency Inversion Principle)',
        summary: 'High-level modules and low-level modules should both depend on abstractions, not on each other.',
        explanation:
          'Dependency Inversion Principle (DIP) states two things: high-level modules should not depend on low-level modules; both should depend on abstractions. And abstractions should not depend on details; details should depend on abstractions. The word inversion refers to flipping the conventional dependency direction: instead of high-level policy code depending directly on concrete low-level implementations, both depend on an interface, so the concrete implementation depends on the abstraction rather than the other way around.\n\nA bad example: an OrderService (high-level) that directly creates and uses a MySQLDatabase (low-level concrete). The business logic is now tied to MySQL; switching to Postgres or testing with a fake database requires editing OrderService. The good example: define a Database interface; OrderService depends on Database, and MySQLDatabase implements it. Now OrderService is decoupled from any specific database, and you can inject any implementation (MySQL, Postgres, an in-memory test double). This injection of the dependency is typically done via constructor parameters, which is the Dependency Injection technique that helps achieve DIP.\n\nIt is important to distinguish DIP from Dependency Injection: DIP is the design principle (depend on abstractions); DI is a technique/pattern (supplying dependencies from outside, e.g. via the constructor) that is a common way to implement DIP. Inversion of Control containers (like Spring) automate DI.\n\nWhy it matters: DIP produces loosely coupled, testable, and flexible systems. High-level business rules stay stable while volatile details (databases, frameworks, third-party services) can be swapped behind interfaces. It is the foundation of plugin architectures and makes unit testing easy because you can substitute mocks. For interviews, state both clauses of DIP, give the database example, draw the depend-on-abstraction diagram, and clarify the DIP-vs-DI distinction.',
        diagram: `  WITHOUT DIP (bad)            WITH DIP (good)
  ┌──────────────┐            ┌──────────────┐
  │ OrderService │            │ OrderService │ (high-level)
  └──────┬───────┘            └──────┬───────┘
         │ depends on                │ depends on
         ▼ concrete                  ▼
  ┌──────────────┐            ┌──────────────────┐
  │ MySQLDatabase│            │ «interface» Database
  └──────────────┘            └────────▲─────────┘
   tight coupling                      │ implements
                               ┌────────┴─────────┐
                            MySQLDatabase   PostgresDatabase`,
        keyPoints: [
          'High-level and low-level modules both depend on abstractions',
          'Abstractions do not depend on details; details depend on abstractions',
          'Inverts the usual high→low concrete dependency direction',
          'Dependency Injection (e.g. constructor) is how DIP is implemented',
          'DIP = principle; DI = technique; IoC containers automate DI',
          'Yields loose coupling, swappable details, and easy testing/mocking',
        ],
        videos: [
          { label: 'Concept && Coding — Dependency Inversion', url: 'https://www.youtube.com/@ConceptandCoding' },
          { label: 'Telusko — Dependency Inversion / Injection', url: 'https://www.youtube.com/c/Telusko' },
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/dependency-inversion-principle-solid/' },
          { label: 'refactoring.guru', url: 'https://refactoring.guru/design-principles' },
        ],
        interview: [
          { q: 'What is the Dependency Inversion Principle?', a: 'High-level modules should not depend on low-level modules; both should depend on abstractions. And abstractions should not depend on details; details should depend on abstractions. This decouples policy from concrete implementations.' },
          { q: 'What does inversion mean in DIP?', a: 'It reverses the conventional dependency direction. Instead of high-level code depending on concrete low-level classes, both depend on an interface, so the concrete implementation now depends on the abstraction rather than the high-level code depending on the concrete.' },
          { q: 'What is the difference between DIP and Dependency Injection?', a: 'DIP is a design principle that says depend on abstractions. Dependency Injection is a technique for supplying those dependencies from outside (e.g. through the constructor) and is one common way to implement DIP. IoC containers like Spring automate DI.' },
          { q: 'Why does DIP make code easier to test?', a: 'Because high-level modules depend on interfaces, you can inject mock or fake implementations during testing instead of real databases or services, allowing fast, isolated unit tests.' },
          { q: 'Give a real example of applying DIP.', a: 'Instead of OrderService instantiating a concrete MySQLDatabase, define a Database interface that OrderService depends on and inject a MySQLDatabase (or a test double) implementing it. The service then works with any database without code changes.' },
        ],
      },
    ],
  },
  {
    focus: 'Design Patterns Intro',
    concepts: [
      {
        id: 'oop-design-patterns-intro',
        topic: 'What Design Patterns Are & Why They Matter',
        summary: 'Design patterns are reusable, named solutions to recurring object-oriented design problems.',
        explanation:
          'A design pattern is a general, reusable solution to a commonly occurring problem in software design. It is not a finished piece of code you paste in, but a template or blueprint describing how to structure classes and objects to solve a problem in a particular context. Patterns capture the distilled experience of expert designers so you do not have to reinvent solutions. They were popularized by the 1994 book Design Patterns: Elements of Reusable Object-Oriented Software by the Gang of Four (GoF) — Gamma, Helm, Johnson, and Vlissides — which cataloged 23 classic patterns.\n\nEach pattern is typically described by a name, the problem it addresses, the solution (participating classes and their collaborations), and the consequences/trade-offs. The shared vocabulary is itself a major benefit: saying use a Factory or this is an Observer communicates a whole design instantly to other engineers. Patterns rely heavily on the OOP pillars and SOLID principles, especially programming to interfaces, favoring composition over inheritance, and the open/closed principle.\n\nWhy patterns matter: they promote reuse of proven designs, improve communication through a common vocabulary, lead to more flexible and maintainable code, and help avoid subtle design pitfalls. They also make codebases easier for new engineers to understand because the structures are recognizable. In Indian SDE interviews, especially for LLD/machine-coding rounds, patterns are frequently tested, so knowing the intent of the common ones is important.\n\nA word of caution often appreciated by interviewers: patterns are tools, not goals. Overusing them (pattern fever) adds needless complexity. Apply a pattern only when the problem genuinely matches it. Keep this as an intro level here; the LLD subject covers individual patterns in depth.',
        diagram: `   PROBLEM (recurring) ──► PATTERN (named template) ──► SOLUTION
                              describes:
                              • name (shared vocabulary)
                              • problem / context
                              • structure (classes + collaboration)
                              • consequences / trade-offs

   GoF (1994): 23 patterns, built on OOP pillars + SOLID
   "use a Factory / it's an Observer" → instant shared understanding`,
        keyPoints: [
          'Pattern = reusable template solution to a recurring design problem',
          'Not copy-paste code; a blueprint of classes and collaborations',
          'Popularized by the Gang of Four (GoF) book, 23 classic patterns',
          'Benefits: reuse, shared vocabulary, flexibility, maintainability',
          'Built on OOP pillars + SOLID (program to interfaces, OCP)',
          'Use only when the problem fits — avoid over-engineering',
        ],
        videos: [
          { label: 'Concept && Coding — Design Patterns', url: 'https://www.youtube.com/@ConceptandCoding' },
          { label: 'Telusko — Design Patterns Intro', url: 'https://www.youtube.com/c/Telusko' },
        ],
        links: [
          { label: 'refactoring.guru', url: 'https://refactoring.guru/design-patterns' },
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/software-design-patterns/' },
        ],
        interview: [
          { q: 'What is a design pattern?', a: 'A design pattern is a general, reusable solution to a commonly recurring problem in software design. It is a template describing how to structure classes and objects in a context, not ready-made code, capturing proven design experience.' },
          { q: 'Who are the Gang of Four?', a: 'The four authors — Erich Gamma, Richard Helm, Ralph Johnson, and John Vlissides — of the 1994 book Design Patterns: Elements of Reusable Object-Oriented Software, which cataloged 23 classic OOP design patterns.' },
          { q: 'Why are design patterns useful?', a: 'They reuse proven solutions, provide a shared vocabulary that speeds communication, lead to more flexible and maintainable designs, and help avoid common design mistakes. They make code more recognizable to other engineers.' },
          { q: 'Are design patterns language-specific?', a: 'No. They are language-agnostic design concepts, though their implementation details vary by language. The GoF patterns were illustrated in C++ and Smalltalk but apply broadly to OOP languages like Java and C#.' },
          { q: 'What is the downside of overusing design patterns?', a: 'Applying patterns where they are not needed adds unnecessary abstraction and complexity, making code harder to read and maintain. Patterns should be used only when the problem genuinely matches the pattern intent.' },
          { q: 'How do design patterns relate to SOLID principles?', a: 'Patterns are concrete ways to apply SOLID and OOP ideas, such as programming to interfaces, favoring composition over inheritance, and achieving the open/closed principle. Many patterns are essentially codified applications of those principles.' },
        ],
      },
      {
        id: 'oop-pattern-categories',
        topic: 'The Three Pattern Categories (GoF)',
        summary: 'GoF patterns fall into creational, structural, and behavioral categories by their purpose.',
        explanation:
          'The 23 GoF design patterns are grouped into three categories by what they primarily deal with. Creational patterns concern object creation, providing flexible ways to instantiate objects while hiding the creation logic and reducing dependence on concrete classes. Examples: Singleton (one shared instance), Factory Method and Abstract Factory (create objects via a method/factory without naming concrete classes), Builder (construct complex objects step by step), and Prototype (clone existing objects).\n\nStructural patterns concern how classes and objects are composed into larger structures while keeping them flexible and efficient. Examples: Adapter (make incompatible interfaces work together), Decorator (add responsibilities to objects dynamically), Facade (provide a simplified interface to a complex subsystem), Composite (treat individual objects and compositions uniformly in a tree), Proxy (a stand-in controlling access to another object), Bridge, and Flyweight.\n\nBehavioral patterns concern communication and the assignment of responsibilities between objects, i.e. how they interact and distribute algorithms. Examples: Observer (notify dependents of state changes — used in event systems), Strategy (select an algorithm at runtime by encapsulating each), Command (encapsulate a request as an object), Iterator (traverse a collection without exposing its structure), State, Template Method, Chain of Responsibility, and Mediator.\n\nFor interviews, you should be able to name the three categories, state what each is about (creation / composition / interaction), and give one or two example patterns per category. A common quick question is to classify a given pattern (e.g. Singleton is creational, Adapter is structural, Observer is behavioral). Keep this introductory; deep mechanics of each pattern belong to the LLD subject. The key takeaway is the mental map: creational = how objects are made, structural = how they are arranged, behavioral = how they collaborate.',
        diagram: `              GoF Design Patterns (23)
        ┌──────────────┬──────────────┬───────────────┐
        ▼              ▼              ▼
   CREATIONAL      STRUCTURAL      BEHAVIORAL
   (object         (object         (object
    creation)       composition)    interaction)
   • Singleton     • Adapter       • Observer
   • Factory       • Decorator     • Strategy
   • Abstract Fac. • Facade        • Command
   • Builder       • Composite     • Iterator
   • Prototype     • Proxy/Bridge  • State/Template`,
        keyPoints: [
          'Three categories: creational, structural, behavioral',
          'Creational: object creation — Singleton, Factory, Builder, Prototype',
          'Structural: object composition — Adapter, Decorator, Facade, Proxy',
          'Behavioral: object interaction — Observer, Strategy, Command, Iterator',
          'Be able to classify a pattern into its category',
          'Mental map: how made / how arranged / how they collaborate',
        ],
        videos: [
          { label: 'Concept && Coding — Pattern Categories', url: 'https://www.youtube.com/@ConceptandCoding' },
          { label: 'Telusko — Creational/Structural/Behavioral', url: 'https://www.youtube.com/c/Telusko' },
        ],
        links: [
          { label: 'refactoring.guru', url: 'https://refactoring.guru/design-patterns/classification' },
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/types-of-software-design-patterns/' },
        ],
        interview: [
          { q: 'What are the three categories of design patterns?', a: 'Creational (object creation mechanisms), Structural (how classes and objects are composed into larger structures), and Behavioral (how objects communicate and distribute responsibilities). This is the GoF classification.' },
          { q: 'Give examples of creational patterns.', a: 'Singleton, Factory Method, Abstract Factory, Builder, and Prototype. They abstract the instantiation process so the system is independent of how objects are created and composed.' },
          { q: 'What are structural patterns? Give examples.', a: 'They deal with composing classes and objects into larger structures while keeping them flexible. Examples include Adapter, Decorator, Facade, Composite, Proxy, Bridge, and Flyweight.' },
          { q: 'What are behavioral patterns? Give examples.', a: 'They deal with object interaction and the assignment of responsibilities. Examples include Observer, Strategy, Command, Iterator, State, Template Method, Chain of Responsibility, and Mediator.' },
          { q: 'Which category does the Singleton pattern belong to?', a: 'Singleton is a creational pattern because it controls how an object is created, ensuring only one instance exists and providing a global access point to it.' },
          { q: 'How many patterns did the Gang of Four define and how are they split?', a: 'The GoF defined 23 patterns, split into 5 creational, 7 structural, and 11 behavioral patterns.' },
        ],
      },
    ],
  },
]
