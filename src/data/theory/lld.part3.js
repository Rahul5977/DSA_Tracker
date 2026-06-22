// LLD theory — Part 3 (Days 11-15): Behavioral design patterns + a pattern
// selection guide. Authored for SDE placement interview prep. Schema mirrors
// the theory modules consumed by ./index.js: each day = { focus, concepts }.

export const DAYS = [
  {
    focus: 'Behavioral I — Strategy & Observer',
    concepts: [
      {
        id: 'lld-strategy',
        topic: 'Strategy Pattern',
        summary: 'Encapsulate a family of interchangeable algorithms behind a common interface so the algorithm can vary independently of the client that uses it.',
        explanation:
          'Intent: The Strategy pattern defines a family of algorithms, encapsulates each one in its own class, and makes them interchangeable at runtime. The client holds a reference to a Strategy interface and delegates the work to whatever concrete strategy is plugged in, so the behaviour can change without touching the client code. It is the canonical answer to "favour composition over inheritance" — instead of subclassing a class to vary one behaviour, you inject a behaviour object.\n\nProblem solved: Imagine a Duck base class where some ducks fly and some do not. If you put fly() in the base class and override it in every subclass you get a maintenance nightmare and duplicated code (rubber ducks must override to do nothing, decoy ducks too). The Head First example fixes this by pulling the varying behaviour (FlyBehavior, QuackBehavior) into separate strategy hierarchies that the Duck composes. The same idea applies to payment processing (CreditCardPayment, UpiPayment, PayPalPayment), sorting (QuickSort vs MergeSort), compression (Zip vs Rar), and route finding (Fastest vs Shortest vs Scenic in a maps app).\n\nStructure & participants: (1) Strategy — an interface declaring the algorithm method, e.g. pay(amount) or sort(list). (2) ConcreteStrategy — each implements the algorithm differently. (3) Context — holds a Strategy reference, exposes a setter to swap it, and delegates calls to it. The client picks the concrete strategy and hands it to the context. The context never knows which concrete class it is talking to; it only knows the interface.\n\nHow it works (payment example): A PaymentService (Context) has a PaymentStrategy field. A user checking out with a card causes the client to call service.setStrategy(new CreditCardPayment(card)) then service.checkout(amount), which internally calls strategy.pay(amount). Switching to UPI is just setStrategy(new UpiPayment(vpa)) — no if/else ladder, no recompilation of the service. New payment methods are added by writing a new class (Open/Closed Principle).\n\nReal-world analogy: Choosing how to travel to the airport. The goal (get to the airport) is fixed, but the strategy — drive, taxi, train, bike — is interchangeable and chosen based on context (time, budget, traffic). You swap the means without changing the goal.\n\nWhen to use / pros & cons: Use it when you have many related classes differing only in behaviour, when you need different variants of an algorithm, or when a class has a massive conditional that selects behaviour. Pros: eliminates conditionals, follows OCP, swappable at runtime, easy to unit-test each strategy in isolation. Cons: clients must be aware of the different strategies to choose one, and you get more objects/classes; for trivial cases a lambda may be enough (in modern languages strategies are often just function objects).',
        diagram: `STRATEGY — UML CLASS DIAGRAM

        ┌──────────────────────────┐
        │        Context           │
        │  (PaymentService)        │
        ├──────────────────────────┤
        │ - strategy: Strategy     │◇────┐ has-a
        │ + setStrategy(s)         │     │
        │ + checkout(amount)       │     │
        └──────────────────────────┘     │
                                         ▼
                          ┌───────────────────────────┐
                          │   <<interface>> Strategy  │
                          │       PaymentStrategy     │
                          ├───────────────────────────┤
                          │ + pay(amount)             │
                          └───────────────────────────┘
                                      ▲
            ┌─────────────────────────┼─────────────────────────┐
   ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐
   │ CreditCardPayment  │  │    UpiPayment      │  │   PayPalPayment    │
   ├────────────────────┤  ├────────────────────┤  ├────────────────────┤
   │ + pay(amount)      │  │ + pay(amount)      │  │ + pay(amount)      │
   └────────────────────┘  └────────────────────┘  └────────────────────┘

  Context delegates to Strategy; concrete strategies are swapped at runtime.`,
        keyPoints: [
          'Intent: encapsulate interchangeable algorithms behind one interface, swap at runtime',
          'When to use: a fat conditional selects behaviour, or many classes differ only in one algorithm',
          'Real example: payment methods, sorting algorithms, map route finders',
          'Pros: removes conditionals, follows Open/Closed, testable in isolation',
          'Cons: more classes; client must know which strategy to choose',
        ],
        videos: [
          { label: 'Christopher Okhravi — Strategy Pattern (ep 1)', url: 'https://www.youtube.com/watch?v=13nftsQUUE0' },
          { label: 'Concept && Coding (Shrayansh) — LLD/Design Patterns', url: 'https://www.youtube.com/@ConceptAndCodingByShrayansh' },
        ],
        links: [
          { label: 'refactoring.guru — Strategy', url: 'https://refactoring.guru/design-patterns/strategy' },
          { label: 'GeeksforGeeks — Strategy Pattern', url: 'https://www.geeksforgeeks.org/strategy-pattern-set-1/' },
        ],
        interview: [
          { q: 'What problem does the Strategy pattern solve?', a: 'It removes hard-coded, conditional algorithm selection by encapsulating each algorithm in its own class behind a shared interface, letting the algorithm vary independently of the client and be swapped at runtime. It favours composition over inheritance.' },
          { q: 'Strategy vs State — what is the difference?', a: 'They share the same structure (a context delegating to an interface) but differ in intent. In Strategy the client picks the strategy and strategies are unaware of each other; the behaviour rarely changes once set. In State the object changes its own state internally in response to events, and states often know about and transition to other states.' },
          { q: 'How does Strategy uphold the Open/Closed Principle?', a: 'Adding a new algorithm means writing a new ConcreteStrategy class; the Context and existing strategies are not modified. The system is open for extension but closed for modification.' },
          { q: 'Where have you used Strategy in a real project?', a: 'A common answer is a payment service that delegates to CreditCard/UPI/PayPal strategies, or a checkout discount engine that swaps pricing strategies, or a sorting/route module that selects an algorithm based on input size or user preference.' },
          { q: 'Can Strategy be implemented without extra classes?', a: 'Yes. In languages with first-class functions or lambdas, a strategy is often just a function or functional interface passed in (e.g. Comparator in Java, a callback in JS), which removes the class explosion for simple cases.' },
          { q: 'How is Strategy different from simple if/else branching?', a: 'If/else couples all behaviours into one method that must be edited for every new case and is hard to test. Strategy isolates each behaviour, enables runtime selection, and makes each algorithm independently testable and reusable.' },
        ],
      },
      {
        id: 'lld-observer',
        topic: 'Observer Pattern',
        summary: 'Define a one-to-many dependency so that when one object (subject) changes state, all its dependents (observers) are notified and updated automatically.',
        explanation:
          'Intent: The Observer pattern establishes a one-to-many relationship between a Subject (a.k.a. Observable or Publisher) and many Observers (Subscribers). When the subject changes, it automatically notifies every registered observer, keeping them in sync without the subject knowing their concrete types. It is the backbone of event systems and the publish/subscribe (pub-sub) style.\n\nProblem solved: Suppose a WeatherStation measures temperature and several displays (current conditions, statistics, forecast) must refresh whenever a new reading arrives. Hard-wiring the station to call each display couples them tightly and makes adding a new display require editing the station. Observer inverts this: displays register themselves with the station; the station simply broadcasts notify() and each display updates itself. This is also how UI buttons fire click listeners, how Excel charts update when cells change, and how Kafka/RxJS streams push events to subscribers.\n\nStructure & participants: (1) Subject — keeps a list of observers and offers attach(o), detach(o), and notify(). (2) Observer — an interface with update() (often update(data)). (3) ConcreteSubject — stores the state of interest and calls notify() when it changes. (4) ConcreteObserver — implements update() to react. Two delivery styles exist: push (subject sends the data in update(data)) and pull (subject sends only a signal and observers query the subject for what they need).\n\nHow it works (notification example): A user subscribes to a YouTube channel (Subject). The channel keeps a subscriber list. When a video is uploaded the channel calls notifySubscribers(video), iterating the list and calling subscriber.update(video). Each subscriber reacts — send an email, push a phone notification, log it. Unsubscribing simply removes the observer from the list. The channel never depends on concrete subscriber classes, only on the Observer interface.\n\nReal-world analogy: A newspaper subscription. The publisher does not know its readers personally; readers subscribe and automatically receive each new edition, and can unsubscribe at any time. The publisher just prints and the distribution list handles fan-out.\n\nWhen to use / pros & cons: Use it when a change to one object requires changing others and you do not know how many or which, or when an object should notify others without being tightly coupled to them. Pros: loose coupling, supports broadcast communication, observers can be added/removed at runtime (OCP). Cons: notification order is not guaranteed, can cause cascading or unexpected updates, risk of memory leaks if observers are not detached (the lapsed-listener problem), and debugging the indirect flow can be hard.',
        diagram: `OBSERVER — UML + NOTIFY SEQUENCE

  ┌────────────────────────────┐        ┌─────────────────────────┐
  │      <<interface>>         │        │     <<interface>>       │
  │         Subject            │        │       Observer          │
  ├────────────────────────────┤  0..* ├─────────────────────────┤
  │ + attach(o: Observer)      │◇──────►│ + update(data)          │
  │ + detach(o: Observer)      │        └─────────────────────────┘
  │ + notify()                 │                    ▲
  └────────────────────────────┘        ┌───────────┴───────────┐
              ▲                 ┌────────────────┐   ┌────────────────┐
   ┌────────────────────┐      │ EmailObserver  │   │  PushObserver  │
   │   YouTubeChannel   │      ├────────────────┤   ├────────────────┤
   │ - subscribers[]    │      │ + update(data) │   │ + update(data) │
   │ - state            │      └────────────────┘   └────────────────┘
   │ + upload(video)    │
   └────────────────────┘

  SEQUENCE on state change:
   Channel.upload(v) ──► notify() ──► for each o: o.update(v)
        Email ◄──update(v)      Push ◄──update(v)`,
        keyPoints: [
          'Intent: one-to-many auto-notification; subject broadcasts, observers react',
          'When to use: a state change must propagate to an unknown set of dependents',
          'Real example: notification/event systems, UI listeners, pub-sub streams',
          'Push vs pull delivery; attach/detach lets observers come and go at runtime',
          'Pros: loose coupling, broadcast. Cons: ordering, cascades, listener leaks',
        ],
        videos: [
          { label: 'Christopher Okhravi — Observer Pattern (ep 2)', url: 'https://www.youtube.com/watch?v=_BpmfnqjgzQ' },
          { label: 'Geekific — Design Patterns (code on GitHub)', url: 'https://github.com/geekific-official/geekific-youtube/tree/main/design-patterns' },
        ],
        links: [
          { label: 'refactoring.guru — Observer', url: 'https://refactoring.guru/design-patterns/observer' },
          { label: 'GeeksforGeeks — Observer Pattern', url: 'https://www.geeksforgeeks.org/system-design/observer-pattern-set-1-introduction/' },
        ],
        interview: [
          { q: 'How does Observer enable pub-sub?', a: 'The subject (publisher) maintains a subscriber list and broadcasts notify() on change; observers (subscribers) register/deregister dynamically and react in update(). Neither side depends on the others concrete type, which is exactly the publish/subscribe decoupling.' },
          { q: 'What is the difference between push and pull models in Observer?', a: 'In push the subject sends the changed data directly to observers via update(data). In pull the subject sends only a signal and each observer calls back to fetch the specific data it cares about, which keeps the subject simpler but adds extra calls.' },
          { q: 'What is the lapsed-listener problem?', a: 'If an observer is registered but never detached, the subject keeps a reference to it, preventing garbage collection and causing a memory leak (and wasted notifications). Solutions include explicit detach() in cleanup or weak references.' },
          { q: 'Observer vs Mediator — how do they differ?', a: 'Observer broadcasts one-way from a subject to many dependents who do not talk to each other. Mediator centralises many-to-many communication: colleagues talk only to a mediator that coordinates them. Observer is fan-out; Mediator is a hub.' },
          { q: 'Where is Observer used in real systems or frameworks?', a: 'GUI event listeners, the java.util.Observer / PropertyChangeListener APIs, RxJS / Reactive Streams, Kafka and message-bus subscribers, model-view bindings in MVC, and notification services.' },
          { q: 'What are the downsides of Observer?', a: 'Notification order is undefined, a single change can trigger cascading updates that are hard to trace, observers can be notified of irrelevant changes, and forgetting to unsubscribe leaks memory.' },
        ],
      },
    ],
  },
  {
    focus: 'Behavioral II — Command & State',
    concepts: [
      {
        id: 'lld-command',
        topic: 'Command Pattern',
        summary: 'Encapsulate a request as an object, letting you parameterise clients with requests, queue or log them, and support undoable operations.',
        explanation:
          'Intent: The Command pattern turns a request into a stand-alone object that carries everything needed to perform an action — the receiver, the method, and the arguments. Because the request is now an object, you can pass it around, store it in a queue, log it, schedule it, and crucially undo/redo it. It decouples the object that invokes an operation (Invoker) from the object that knows how to perform it (Receiver).\n\nProblem solved: Consider a GUI with many buttons and menu items that all trigger actions. Hard-coding each buttons action couples the UI widget to business logic and makes features like undo, macro recording, or remapping buttons painful. Command fixes this: each action becomes a Command object (e.g. CopyCommand, PasteCommand, LightOnCommand). The button just holds a Command and calls execute(). The same command can be wired to a button, a keyboard shortcut, and a menu item without duplication. This is also how task queues, transactional operations, and the famous remote-control example work.\n\nStructure & participants: (1) Command — interface with execute() and often undo(). (2) ConcreteCommand — binds a Receiver to an action; execute() calls receiver.action(). (3) Receiver — the object that does the real work (e.g. Light, Document, Stock). (4) Invoker — triggers the command (e.g. Button, RemoteControl); it knows only the Command interface. (5) Client — creates concrete commands and configures the invoker.\n\nHow it works (remote control + undo): A RemoteControl (Invoker) has slots holding commands. Pressing a button calls command.execute(); the LightOnCommand calls light.on(). To support undo, each command implements undo() (LightOnCommand.undo() calls light.off()) and the invoker pushes executed commands onto a history stack. The undo button pops the last command and calls its undo(). Redo is the mirror: keep a redo stack. Macro/composite commands hold a list of commands and execute them in sequence.\n\nReal-world analogy: Ordering at a restaurant. You (client) write an order on a ticket (command object). The waiter (invoker) does not cook; he carries the ticket to the kitchen. The chef (receiver) reads the ticket and cooks. The ticket decouples who requests from who fulfils, and the order can be queued, logged, or cancelled (undone).\n\nWhen to use / pros & cons: Use it for undo/redo, for queuing or scheduling operations, for logging changes to support replay/recovery, for macro recording, and to decouple UI from actions. Pros: decouples invoker from receiver, supports undo/redo and queuing, easy to add new commands (OCP), composable into macros. Cons: a separate class per command increases the number of classes and can feel heavy for trivial actions.',
        diagram: `COMMAND — UML CLASS DIAGRAM

  ┌──────────────┐  holds   ┌────────────────────────┐
  │   Invoker    │◇────────►│   <<interface>>        │
  │ (RemoteCtrl) │          │      Command           │
  ├──────────────┤          ├────────────────────────┤
  │ - history[]  │          │ + execute()            │
  │ + press()    │          │ + undo()               │
  │ + undo()     │          └────────────────────────┘
  └──────────────┘                     ▲
                       ┌───────────────┴───────────────┐
            ┌────────────────────┐        ┌────────────────────┐
            │  LightOnCommand    │        │ LightOffCommand    │
            ├────────────────────┤        ├────────────────────┤
            │ - light: Light     │        │ - light: Light     │
            │ + execute()        │        │ + execute()        │
            │ + undo()           │        │ + undo()           │
            └─────────┬──────────┘        └─────────┬──────────┘
                      │ calls                        │ calls
                      ▼                              ▼
                   ┌────────────────────────────────────┐
                   │   Receiver: Light                  │
                   │ + on()   + off()                   │
                   └────────────────────────────────────┘`,
        keyPoints: [
          'Intent: wrap a request as an object so it can be passed, queued, logged, undone',
          'When to use: undo/redo, task queues, macro recording, decoupling UI from actions',
          'Participants: Command, ConcreteCommand, Receiver, Invoker, Client',
          'Real example: GUI buttons/remote control, transactional job queues',
          'Pros: decouple invoker/receiver, undo/redo, composable. Cons: many small classes',
        ],
        videos: [
          { label: 'Christopher Okhravi — Command Pattern (ep 7)', url: 'https://www.youtube.com/watch?v=9qA5kw8dcSU' },
          { label: 'Concept && Coding (Shrayansh) — LLD/Design Patterns', url: 'https://www.youtube.com/@ConceptAndCodingByShrayansh' },
        ],
        links: [
          { label: 'refactoring.guru — Command', url: 'https://refactoring.guru/design-patterns/command' },
          { label: 'SourceMaking — Command', url: 'https://sourcemaking.com/design_patterns/command' },
        ],
        interview: [
          { q: 'Where have you used the Command pattern?', a: 'Typical answers: a remote/UI where each button holds a command, an undo/redo system in an editor, a job/task queue where requests are serialised commands processed by workers, or macro recording that replays a list of commands.' },
          { q: 'How would you implement undo with Command?', a: 'Each command implements both execute() and undo(), where undo() reverses execute(). The invoker keeps a history stack; on undo it pops the last command and calls its undo(). A second redo stack lets you re-apply undone commands.' },
          { q: 'Who are the participants and how are they decoupled?', a: 'Client creates a ConcreteCommand binding a Receiver. The Invoker stores and triggers commands knowing only the Command interface, never the Receiver. So the invoker (e.g. a button) is fully decoupled from the business object that does the work.' },
          { q: 'How do you build a macro / composite command?', a: 'Create a MacroCommand that holds a list of commands; its execute() runs each in order and its undo() runs each undo() in reverse order. This composes simple commands into a higher-level operation.' },
          { q: 'How does Command help with logging and crash recovery?', a: 'Because requests are objects, you can serialise and persist them to a log. After a crash you replay the logged commands to reconstruct state, which is the basis of write-ahead/transaction logs and event sourcing.' },
          { q: 'Command vs Strategy — what is the difference?', a: 'Strategy encapsulates an interchangeable algorithm chosen by the client to do one job differently. Command encapsulates a request/action together with its receiver and arguments, focused on invoking, queuing, and undoing operations rather than swapping algorithms.' },
        ],
      },
      {
        id: 'lld-state',
        topic: 'State Pattern',
        summary: 'Allow an object to alter its behaviour when its internal state changes, so the object appears to change its class.',
        explanation:
          'Intent: The State pattern lets an object change its behaviour at runtime depending on an internal state, by delegating state-specific work to separate state objects. Each possible state is a class implementing a common State interface; the context holds a reference to the current state and forwards requests to it. As the state changes, the contexts behaviour changes — it looks as if the object changed its class.\n\nProblem solved: Objects with complex, state-dependent behaviour usually start as a giant switch on a state field scattered across many methods. A vending machine, for example, behaves differently when it has NoCoin, HasCoin, Sold, or SoldOut. Cramming insertCoin(), pressButton(), and dispense() with nested conditionals on the current state becomes unreadable and error-prone. State replaces the conditionals: each state is a class that defines how every action behaves while in that state, including which state to transition to next.\n\nStructure & participants: (1) Context — the object whose behaviour varies (e.g. VendingMachine, ATM, TrafficLight). It holds a State reference and delegates requests to it; it exposes setState() so states can transition it. (2) State — an interface declaring the actions (insertCoin(), pressButton(), etc.). (3) ConcreteState — each implements those actions for one specific state and decides the next state. Transitions can be controlled by the states themselves (each state knows its successor) or by the context.\n\nHow it works (vending machine): VendingMachine starts in NoCoinState. Calling insertCoin() delegates to currentState.insertCoin(), which (in NoCoinState) accepts the coin and calls machine.setState(hasCoinState). Now pressButton() delegates to HasCoinState, which dispenses and transitions to SoldState or back to NoCoinState. Each state encapsulates the rules for its own behaviour and successor, so adding a new state (e.g. MaintenanceState) means adding a class, not editing every method.\n\nReal-world analogy: A traffic light. In the Red state the behaviour is "stop" and after a timer it transitions to Green; in Green the behaviour is "go" and it transitions to Yellow. Same object (the light), different behaviour per state, with well-defined transitions. An ATM (no-card, has-card, authenticated, out-of-cash) is the same idea.\n\nWhen to use / pros & cons: Use it when an objects behaviour depends on its state and it must change behaviour at runtime, or when methods are full of large conditionals keyed on a state field. Pros: removes sprawling conditionals, localises state-specific behaviour and transitions, follows OCP (new states = new classes), makes the state machine explicit. Cons: more classes (overkill for a couple of trivial states), and transition logic spread across states can be harder to see as a whole unless documented with a diagram.',
        diagram: `STATE — UML CLASS DIAGRAM (Vending Machine)

   ┌──────────────────────────┐   current   ┌────────────────────────┐
   │   Context                │◇───────────►│   <<interface>> State  │
   │   VendingMachine         │             ├────────────────────────┤
   ├──────────────────────────┤             │ + insertCoin()         │
   │ - state: State           │             │ + pressButton()        │
   │ + setState(s)            │             │ + dispense()           │
   │ + insertCoin()  ─delegate│             └────────────────────────┘
   │ + pressButton() ─delegate│                        ▲
   └──────────────────────────┘        ┌───────────────┼───────────────┐
              ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
              │  NoCoinState   │ │  HasCoinState  │ │   SoldState    │
              ├────────────────┤ ├────────────────┤ ├────────────────┤
              │ + insertCoin() │ │ + pressButton()│ │ + dispense()   │
              └────────────────┘ └────────────────┘ └────────────────┘

  Transitions:  NoCoin ─insertCoin─► HasCoin ─press─► Sold ─► NoCoin
  Each state defines behaviour AND chooses the next state.`,
        keyPoints: [
          'Intent: behaviour varies by internal state; delegate to per-state objects',
          'When to use: large conditionals keyed on a state field; explicit state machine',
          'Real example: vending machine, ATM, traffic light, order/document lifecycle',
          'Each ConcreteState defines its actions and the transition to the next state',
          'Pros: removes conditionals, OCP. Cons: many classes, transitions spread out',
        ],
        videos: [
          { label: 'Christopher Okhravi — State Pattern (ep 17)', url: 'https://www.youtube.com/watch?v=N12L5D78MAA' },
          { label: 'Geekific — Design Patterns (code on GitHub)', url: 'https://github.com/geekific-official/geekific-youtube/tree/main/design-patterns' },
        ],
        links: [
          { label: 'refactoring.guru — State', url: 'https://refactoring.guru/design-patterns/state' },
          { label: 'GeeksforGeeks — State Pattern', url: 'https://www.geeksforgeeks.org/state-design-pattern/' },
        ],
        interview: [
          { q: 'Strategy vs State — what is the real difference?', a: 'Structurally they are twins (a context delegating to an interface). The difference is intent and who drives change: in Strategy the client sets the algorithm and strategies are independent and unaware of each other; in State the object transitions itself between states in response to events, and states usually know about and switch to other states.' },
          { q: 'How does State remove conditionals?', a: 'Instead of a switch(currentState) inside every method, each state becomes a class that implements every action for that state. The context just delegates to the current state object, so the branching disappears and behaviour is localised per state.' },
          { q: 'Who decides the state transitions?', a: 'Either the concrete states themselves call context.setState(next) (decentralised, each state knows its successors), or the context contains the transition table (centralised). The first is common in GoF; the second makes the whole machine easier to read.' },
          { q: 'Give a concrete example where you would use State.', a: 'A vending machine (no-coin, has-coin, sold, sold-out), an ATM (no-card, has-card, authenticated), a traffic light, a TCP connection (listen, established, closed), or an order lifecycle (placed, paid, shipped, delivered, cancelled).' },
          { q: 'What are the drawbacks of State?', a: 'It introduces one class per state, which is overkill if there are only two trivial states, and the transition logic can be scattered across many state classes, making the overall flow hard to grasp without a state diagram.' },
          { q: 'How is the State pattern related to a finite state machine?', a: 'It is essentially an object-oriented implementation of an FSM: states are objects, events are method calls, and transitions are state swaps. It makes the FSM explicit in code rather than hidden in flags and conditionals.' },
        ],
      },
    ],
  },
  {
    focus: 'Behavioral III — Template Method, Iterator & Chain of Responsibility',
    concepts: [
      {
        id: 'lld-template-method',
        topic: 'Template Method Pattern',
        summary: 'Define the skeleton of an algorithm in a base method, deferring some steps to subclasses without changing the algorithm structure.',
        explanation:
          'Intent: The Template Method pattern defines the overall structure (skeleton) of an algorithm in a single method of a base class, while letting subclasses override specific steps without altering the algorithms sequence. The base class controls the "what and when"; subclasses fill in the "how" for the variable steps. It is the inheritance-based cousin of Strategy.\n\nProblem solved: Many algorithms share the same steps in the same order but differ in a few step implementations. A data-mining application that parses CSV, PDF, and DOC files all do: openFile, extractData, parseData, analyze, sendReport, closeFile — only extract/parse differ by format. Duplicating the whole flow in each class causes copy-paste and drift. Template Method puts the invariant flow in an abstract base method and makes only the differing steps overridable, so the shared structure lives in one place.\n\nStructure & participants: (1) AbstractClass — defines the templateMethod() that calls the steps in a fixed order; it implements the invariant steps itself and declares the variable steps as abstract methods. It may also define hooks — empty or default methods subclasses can optionally override. (2) ConcreteClass — overrides the abstract steps (and optionally the hooks) to provide format-specific behaviour. The templateMethod() is usually made final so subclasses cannot change the algorithms structure.\n\nHow it works (beverage example): A CaffeineBeverage base class has final prepareRecipe(): boilWater(); brew(); pourInCup(); addCondiments(). boilWater and pourInCup are common; brew() and addCondiments() are abstract and overridden by Coffee (brew = drip through filter, condiments = sugar/milk) and Tea (brew = steep tea bag, condiments = lemon). A hook like customerWantsCondiments() can let a subclass skip a step. The control flow (the recipe order) is fixed; only the steps vary. This is the Hollywood Principle: "Dont call us, we will call you" — the base class calls the subclass steps, not the other way round.\n\nReal-world analogy: A recipe template or a building blueprint. The sequence (foundation, walls, roof, paint) is fixed, but specific choices (brick vs wood walls, tile vs shingle roof) are filled in per house. Frameworks use this heavily: you override onCreate()/handle()/doGet() and the framework drives the lifecycle.\n\nWhen to use / pros & cons: Use it when several classes share an algorithm that differs only in certain steps, or to let subclasses extend only particular points of a large algorithm. Pros: removes duplicate code by hoisting the common flow up, enforces a fixed algorithm structure, and gives controlled extension points via hooks. Cons: relies on inheritance (less flexible than composition), the skeleton can become rigid, and the Liskov risk that a subclass breaks the algorithm if it overrides too much.',
        diagram: `TEMPLATE METHOD — UML CLASS DIAGRAM

       ┌────────────────────────────────────────┐
       │        <<abstract>> AbstractClass      │
       │            CaffeineBeverage            │
       ├────────────────────────────────────────┤
       │ + prepareRecipe()   <<final, template>>│
       │     ├─ boilWater()        (concrete)   │
       │     ├─ brew()             (abstract) ──►│ deferred to subclass
       │     ├─ pourInCup()        (concrete)   │
       │     └─ addCondiments()    (abstract) ──►│ deferred to subclass
       │ # boilWater()                          │
       │ # pourInCup()                          │
       │ # brew()*        (abstract step)       │
       │ # addCondiments()* (abstract step)     │
       │ # customerWantsCondiments() (hook)     │
       └────────────────────────────────────────┘
                          ▲
              ┌───────────┴───────────┐
     ┌────────────────────┐  ┌────────────────────┐
     │       Coffee       │  │        Tea         │
     ├────────────────────┤  ├────────────────────┤
     │ # brew()           │  │ # brew()           │
     │ # addCondiments()  │  │ # addCondiments()  │
     └────────────────────┘  └────────────────────┘

  Base class fixes the step ORDER; subclasses fill variable steps.`,
        keyPoints: [
          'Intent: fix an algorithm skeleton in a base method; subclasses override only some steps',
          'When to use: many classes share a flow but differ in a few steps',
          'Hollywood Principle: base class calls subclass steps (inversion of control)',
          'Hooks give optional, overridable extension points; template method is usually final',
          'Pros: removes duplication, enforces structure. Cons: inheritance-bound, can be rigid',
        ],
        videos: [
          { label: 'Christopher Okhravi — Design Patterns playlist', url: 'https://www.youtube.com/playlist?list=PLrhzvIcii6GNjpARdnO4ueTUAVR9eMBpc' },
          { label: 'Geekific — Design Patterns (code on GitHub)', url: 'https://github.com/geekific-official/geekific-youtube/tree/main/design-patterns' },
        ],
        links: [
          { label: 'refactoring.guru — Template Method', url: 'https://refactoring.guru/design-patterns/template-method' },
          { label: 'GeeksforGeeks — Template Method', url: 'https://www.geeksforgeeks.org/template-method-design-pattern/' },
        ],
        interview: [
          { q: 'Template Method vs Strategy — difference?', a: 'Both vary part of an algorithm. Template Method uses inheritance: the skeleton is fixed in a base class and subclasses override steps at compile time. Strategy uses composition: the whole algorithm is an injected object swappable at runtime. Template varies steps; Strategy varies the entire algorithm.' },
          { q: 'What is a hook in Template Method?', a: 'A hook is a method in the base class with an empty or default implementation that subclasses may optionally override to influence the algorithm (e.g. customerWantsCondiments() to skip a step). Unlike abstract steps, overriding a hook is optional.' },
          { q: 'What is the Hollywood Principle?', a: '"Dont call us, we will call you." High-level base/framework code calls the low-level subclass steps, not vice versa. Template Method embodies it: the base classs template method drives the flow and invokes the overridden steps.' },
          { q: 'Why is the template method often declared final?', a: 'To prevent subclasses from changing the algorithms structure or step order; subclasses are only allowed to customise the designated overridable steps, preserving the invariant flow.' },
          { q: 'Give a real example of Template Method.', a: 'A data parser base class with a fixed read->parse->validate->save flow where parse differs per format; java.util.AbstractList, HttpServlet.service() dispatching to doGet/doPost, or unit-test framework setUp/test/tearDown lifecycles.' },
          { q: 'What are the drawbacks of Template Method?', a: 'It is tied to inheritance, so a class can only extend one template; the algorithm structure becomes hard to change; and overriding subclasses can violate the Liskov Substitution Principle if they break assumptions the skeleton relies on.' },
        ],
      },
      {
        id: 'lld-iterator',
        topic: 'Iterator Pattern',
        summary: 'Provide a way to access the elements of a collection sequentially without exposing its underlying representation.',
        explanation:
          'Intent: The Iterator pattern provides a uniform way to traverse the elements of a collection one by one without exposing how the collection stores them internally. The traversal logic is pulled out of the collection into a separate iterator object, so the same client code can walk an array-backed list, a linked list, a tree, or a hash set through one interface.\n\nProblem solved: If different collections expose different APIs (arrays use indexes, linked lists use node.next, trees need recursion), client code that wants to loop over "any collection" gets cluttered with collection-specific traversal code and breaks encapsulation by reaching into internals. Iterator solves this by giving every collection a way to produce an iterator that knows how to traverse it, exposing a tiny, uniform interface like hasNext()/next(). Clients depend only on that interface.\n\nStructure & participants: (1) Iterator — interface with hasNext() and next() (often current()/remove() too). (2) ConcreteIterator — implements traversal for a specific collection and tracks the current position. (3) Aggregate/IterableCollection — interface declaring createIterator() (Java: iterator()). (4) ConcreteAggregate — the actual collection that returns a matching concrete iterator. The iterator holds the cursor state, so multiple independent iterators can traverse the same collection simultaneously.\n\nHow it works (menu example): A restaurant has a DinerMenu backed by an array and a PancakeMenu backed by an ArrayList. A Waitress wants to print all items without caring about storage. Each menu implements createIterator() returning an Iterator. The waitress writes one loop: Iterator it = menu.createIterator(); while(it.hasNext()) print(it.next()). Add a new menu backed by a hashmap and the waitress code is unchanged — only the new menus iterator is written. This is exactly how Javas Iterator/Iterable and the for-each loop work, and how C# IEnumerator and Python __iter__/__next__ work.\n\nReal-world analogy: A TV remotes channel-up button. You press next repeatedly and move through channels without knowing whether they are stored in an array or a list internally. The remote (iterator) hides the storage and just advances the cursor.\n\nWhen to use / pros & cons: Use it when you want to traverse a collection without exposing its internals, when you need multiple or different traversal strategies (forward, reverse, filtered), or to give a uniform traversal API across different collection types. Pros: single-responsibility (traversal separated from storage), uniform interface, supports parallel/independent traversals and lazy iteration. Cons: overkill for simple, fixed collections, and a custom iterator can be less efficient than direct indexed access for a plain array.',
        diagram: `ITERATOR — UML CLASS DIAGRAM

  ┌──────────────────────────┐        ┌────────────────────────┐
  │  <<interface>>           │ creates│   <<interface>>        │
  │  IterableCollection      │───────►│      Iterator          │
  ├──────────────────────────┤        ├────────────────────────┤
  │ + createIterator()       │        │ + hasNext(): bool      │
  └──────────────────────────┘        │ + next(): Element      │
              ▲                        └────────────────────────┘
              │                                   ▲
   ┌────────────────────┐               ┌────────────────────────┐
   │   DinerMenu        │── creates ───►│   MenuIterator         │
   │ - items: array     │               ├────────────────────────┤
   │ + createIterator() │               │ - menu                 │
   └────────────────────┘               │ - position: int        │
                                        │ + hasNext()  + next()  │
                                        └────────────────────────┘

  Client: it = menu.createIterator();
          while (it.hasNext()) use(it.next());`,
        keyPoints: [
          'Intent: sequential access to elements without exposing internal structure',
          'When to use: uniform traversal across collection types, or multiple traversal orders',
          'Interface: hasNext()/next(); iterator holds the cursor, collection holds the data',
          'Real example: Java Iterable/Iterator + for-each, Python __iter__/__next__',
          'Pros: separates traversal from storage, parallel iterators. Cons: overkill for simple arrays',
        ],
        videos: [
          { label: 'Christopher Okhravi — Design Patterns playlist', url: 'https://www.youtube.com/playlist?list=PLrhzvIcii6GNjpARdnO4ueTUAVR9eMBpc' },
          { label: 'Geekific — Design Patterns (code on GitHub)', url: 'https://github.com/geekific-official/geekific-youtube/tree/main/design-patterns' },
        ],
        links: [
          { label: 'refactoring.guru — Iterator', url: 'https://refactoring.guru/design-patterns/iterator' },
          { label: 'GeeksforGeeks — Iterator Pattern', url: 'https://www.geeksforgeeks.org/iterator-pattern/' },
        ],
        interview: [
          { q: 'What problem does the Iterator pattern solve?', a: 'It lets clients traverse a collection element by element through a uniform interface (hasNext/next) without knowing or depending on the collections internal representation, keeping traversal logic separate from storage and preserving encapsulation.' },
          { q: 'Why is the cursor kept in the iterator and not the collection?', a: 'Putting the position in the iterator allows multiple independent traversals of the same collection at once, each with its own cursor, and keeps the collection focused on storage rather than tracking who is iterating it.' },
          { q: 'How does the for-each loop relate to Iterator?', a: 'In Java, for-each works on any Iterable; the compiler calls iterator() and repeatedly hasNext()/next() under the hood. Python for-loops call __iter__ then __next__. The pattern is what makes the uniform loop syntax possible.' },
          { q: 'What is an internal vs external iterator?', a: 'An external iterator is controlled by the client, who calls next() (Java Iterator). An internal iterator is controlled by the collection, which calls a passed-in function for each element (forEach / map). External gives more control; internal is more concise.' },
          { q: 'What is a fail-fast iterator?', a: 'One that throws ConcurrentModificationException if the underlying collection is structurally modified during iteration (other than through the iterators own remove). It detects bugs early by checking a modification count.' },
          { q: 'When is Iterator overkill?', a: 'For a small, fixed array or a collection accessed by index where a simple indexed loop suffices; the pattern adds classes and indirection that are not justified for trivial traversal.' },
        ],
      },
      {
        id: 'lld-chain-of-responsibility',
        topic: 'Chain of Responsibility Pattern',
        summary: 'Pass a request along a chain of handlers; each either handles it or forwards it to the next, decoupling sender from receiver.',
        explanation:
          'Intent: The Chain of Responsibility (CoR) pattern lets you pass a request along a chain of potential handlers. Each handler decides either to process the request or to pass it to the next handler in the chain. The sender does not know which handler will ultimately handle the request, which decouples the sender from the concrete receivers and lets you add, remove, or reorder handlers freely.\n\nProblem solved: When a request might be handled by one of several objects and the right one is not known in advance, a long if/else or switch in the caller becomes brittle. CoR replaces it with a linked set of handlers. A classic example is logging levels: a DEBUG message should be handled by the debug logger, INFO by the info logger, ERROR by the error logger — each logger checks if it should handle the level and otherwise forwards. The same applies to approval chains (a purchase request approved by Manager up to a limit, else Director, else VP), to support-ticket escalation, and to HTTP middleware/servlet filter pipelines.\n\nStructure & participants: (1) Handler — interface/abstract class declaring handle(request) and holding a reference to the next handler (setNext()). (2) BaseHandler — usually implements the default forwarding logic (if cannot handle, call next.handle(request)). (3) ConcreteHandler — checks whether it can handle the request; if yes it processes it, otherwise it delegates to the next. (4) Client — builds the chain by linking handlers and sends the request to the first one.\n\nHow it works (approval chain): A purchase request flows in. Manager.handle(req): if amount <= 1000, approve; else next.handle(req). Director.handle(req): if amount <= 10000, approve; else next.handle(req). VP.handle(req): approve any amount. The client builds manager.setNext(director); director.setNext(vp) and calls manager.handle(req). A 5000 request is forwarded by Manager and approved by Director; the client never coded that decision. Two variants exist: the request stops at the first handler that handles it, or it is passed through every handler (a processing pipeline like middleware).\n\nReal-world analogy: Customer support escalation. You call support; the front-line agent handles simple issues, escalates harder ones to a specialist, who escalates the toughest to a manager. You (the caller) just submit the request to the first level and the chain routes it to whoever can resolve it.\n\nWhen to use / pros & cons: Use it when more than one object may handle a request and the handler is not known a priori, when you want to issue a request without specifying the receiver explicitly, or when the set/order of handlers should be configurable at runtime. Pros: decouples sender from receiver, single-responsibility per handler, easy to add/reorder handlers (OCP). Cons: a request may fall off the end of the chain unhandled if no handler catches it, and the flow can be hard to debug because it is not obvious which handler will respond.',
        diagram: `CHAIN OF RESPONSIBILITY — UML + FLOW

  ┌────────────────────────────┐
  │   <<abstract>> Handler     │
  ├────────────────────────────┤      next
  │ - next: Handler            │◇────────────┐ (link to successor)
  │ + setNext(h): Handler      │             │
  │ + handle(request)          │◄────────────┘
  └────────────────────────────┘
                ▲
   ┌────────────┼────────────────────────┐
 ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
 │ ManagerHandler   │ │ DirectorHandler  │ │   VpHandler      │
 ├──────────────────┤ ├──────────────────┤ ├──────────────────┤
 │ + handle(req)    │ │ + handle(req)    │ │ + handle(req)    │
 └──────────────────┘ └──────────────────┘ └──────────────────┘

  FLOW (approve $5000):
   client ─► Manager ──can't (>1k)──► Director ──approves──► done
                                       (else ──► VP)`,
        keyPoints: [
          'Intent: pass a request along handlers; each handles or forwards it',
          'When to use: multiple possible handlers, receiver unknown, configurable order',
          'Real example: logging levels, approval/escalation chains, HTTP middleware/filters',
          'Two modes: stop at first handler, or pass through a full processing pipeline',
          'Pros: decouples sender/receiver, OCP. Cons: request may go unhandled; hard to trace',
        ],
        videos: [
          { label: 'Concept && Coding (Shrayansh) — LLD/Design Patterns', url: 'https://www.youtube.com/@ConceptAndCodingByShrayansh' },
          { label: 'Christopher Okhravi — Design Patterns playlist', url: 'https://www.youtube.com/playlist?list=PLrhzvIcii6GNjpARdnO4ueTUAVR9eMBpc' },
        ],
        links: [
          { label: 'refactoring.guru — Chain of Responsibility', url: 'https://refactoring.guru/design-patterns/chain-of-responsibility' },
          { label: 'GeeksforGeeks — Chain of Responsibility', url: 'https://www.geeksforgeeks.org/chain-responsibility-design-pattern/' },
        ],
        interview: [
          { q: 'Give a real-world use of Chain of Responsibility.', a: 'Logging frameworks routing by level (debug/info/error), purchase approval chains by amount, support-ticket escalation, exception handling chains, and HTTP middleware / servlet filter / interceptor pipelines where each filter handles or forwards the request.' },
          { q: 'How is CoR different from a simple if/else ladder?', a: 'An if/else hard-codes all decisions in one place and the caller must know every handler. CoR distributes each decision into an independent handler, decouples the sender from receivers, and lets you add or reorder handlers at runtime without editing the caller.' },
          { q: 'What happens if no handler can process the request?', a: 'If the request reaches the end of the chain unhandled it is simply dropped (or you add a default/terminal handler that catches everything). This silent drop is a known drawback you must guard against.' },
          { q: 'What are the two variants of CoR?', a: 'The pure form stops at the first handler that can handle the request. The pipeline/processing form passes the request through every handler in sequence (each doing part of the work), as in middleware or filter chains.' },
          { q: 'How does CoR relate to middleware in web frameworks?', a: 'Middleware is CoR in practice: each middleware receives the request, optionally processes it (auth, logging, compression), and calls next() to forward it down the chain, with the chain order configured at startup.' },
          { q: 'What are the trade-offs of CoR?', a: 'Pros: decoupling, single responsibility per handler, runtime-configurable chain. Cons: no guarantee a request is handled, and the dynamic routing makes debugging which handler responded harder.' },
        ],
      },
    ],
  },
  {
    focus: 'Behavioral IV — Mediator & Memento',
    concepts: [
      {
        id: 'lld-mediator',
        topic: 'Mediator Pattern',
        summary: 'Define an object that encapsulates how a set of objects interact, promoting loose coupling by keeping them from referring to each other directly.',
        explanation:
          'Intent: The Mediator pattern introduces a central object (the mediator) that coordinates communication among a set of objects (colleagues) so they no longer reference each other directly. Instead of a tangled web of many-to-many connections, colleagues talk only to the mediator, which routes and orchestrates their interactions. This converts a mesh into a hub-and-spoke and dramatically reduces coupling.\n\nProblem solved: When many objects must interact, direct references between every pair create an explosion of dependencies (n objects can need up to n*(n-1) links). Changing one object ripples through all the others it knows about, and the objects become non-reusable because they are wired to specific peers. A chat room is the classic example: if every user held references to every other user, broadcasting a message and managing join/leave would be a nightmare. Air-traffic control is another: planes do not coordinate landing slots peer-to-peer; they all talk to the control tower.\n\nStructure & participants: (1) Mediator — interface declaring the coordination method, e.g. notify(sender, event) or sendMessage(msg, user). (2) ConcreteMediator — knows all colleagues and implements the coordination logic, deciding who reacts to what. (3) Colleague — each component holds a reference to the mediator (not to other colleagues) and notifies the mediator instead of calling peers directly. The mediator centralises the interaction rules that would otherwise be scattered.\n\nHow it works (chat room): Each User (Colleague) holds a reference to a ChatRoom (Mediator). When userA.send("hi") is called, the user delegates to chatRoom.sendMessage("hi", userA). The chat room loops over its registered users and delivers the message to everyone except the sender by calling user.receive(...). Users never hold references to each other; adding or removing a user only touches the mediator. The same pattern coordinates UI dialog widgets: a form mediator enables/disables the Submit button based on field states, so the fields do not need to know about each other.\n\nReal-world analogy: An air-traffic control tower. Pilots do not negotiate runways directly with one another; each communicates only with the tower, which has the global picture and coordinates safe sequencing. The tower is the mediator; the planes are decoupled colleagues.\n\nWhen to use / pros & cons: Use it when a set of objects communicate in complex, tangled ways, when reusing an object is hard because it depends on many others, or when behaviour distributed across classes should be customisable without lots of subclassing. Pros: reduces coupling to a single hub, centralises interaction logic (single responsibility), makes colleagues reusable, and follows OCP (add colleagues without changing others). Cons: the mediator can grow into a "god object" that knows too much and becomes a complex, hard-to-maintain bottleneck.',
        diagram: `MEDIATOR — UML CLASS DIAGRAM (Chat Room)

                 ┌────────────────────────────┐
                 │   <<interface>> Mediator   │
                 │        ChatRoom            │
                 ├────────────────────────────┤
                 │ + sendMessage(msg, from)   │
                 │ + addUser(user)            │
                 └────────────────────────────┘
                              ▲ implements
                 ┌────────────────────────────┐
                 │   ChatRoomImpl             │
                 │ - users: List<User>        │
                 └────────────────────────────┘
                       ▲    ▲    ▲   each colleague ◇─► mediator
        ┌──────────────┘    │    └──────────────┐
   ┌────────────┐    ┌────────────┐      ┌────────────┐
   │   User A   │    │   User B   │      │   User C   │
   ├────────────┤    ├────────────┤      ├────────────┤
   │ - mediator │    │ - mediator │      │ - mediator │
   │ + send()   │    │ + send()   │      │ + send()   │
   │ + receive()│    │ + receive()│      │ + receive()│
   └────────────┘    └────────────┘      └────────────┘

  Colleagues talk ONLY to the mediator, never to each other.`,
        keyPoints: [
          'Intent: centralise many-to-many interaction in one hub; colleagues do not reference each other',
          'When to use: tangled object communication, hard-to-reuse components coupled to peers',
          'Real example: chat room, air-traffic control, UI dialog/form coordination',
          'Converts an n-to-n mesh into hub-and-spoke, cutting coupling',
          'Pros: loose coupling, centralised logic. Cons: mediator can become a god object',
        ],
        videos: [
          { label: 'Christopher Okhravi — Design Patterns playlist', url: 'https://www.youtube.com/playlist?list=PLrhzvIcii6GNjpARdnO4ueTUAVR9eMBpc' },
          { label: 'Geekific — Design Patterns (code on GitHub)', url: 'https://github.com/geekific-official/geekific-youtube/tree/main/design-patterns' },
        ],
        links: [
          { label: 'refactoring.guru — Mediator', url: 'https://refactoring.guru/design-patterns/mediator' },
          { label: 'GeeksforGeeks — Mediator Pattern', url: 'https://www.geeksforgeeks.org/mediator-design-pattern/' },
        ],
        interview: [
          { q: 'Observer vs Mediator — what is the difference?', a: 'Observer is one-way fan-out: a subject broadcasts to many observers that do not interact with each other. Mediator coordinates many-to-many interaction: colleagues send events to a central mediator that decides who reacts. Observer decouples a publisher from subscribers; Mediator decouples peers from each other.' },
          { q: 'How does Mediator reduce coupling?', a: 'It replaces direct references between every pair of objects (a mesh that grows quadratically) with each object referencing only the mediator. Interaction logic lives in one place, so objects become independent and reusable and changes are localised to the mediator.' },
          { q: 'Give a real example where you would use Mediator.', a: 'A chat room delivering messages between users, an air-traffic control tower sequencing planes, or a complex UI dialog where one mediator enables/disables and validates widgets so the widgets need not know about one another.' },
          { q: 'What is the main risk of the Mediator pattern?', a: 'The mediator can become a god object that accumulates all the interaction logic and grows large and hard to maintain, effectively moving the complexity rather than removing it. Keeping mediators focused mitigates this.' },
          { q: 'How is Mediator related to Facade?', a: 'A Facade offers a simplified one-way interface to a subsystem; the subsystem objects do not know about the facade. A Mediator is bidirectional and known to its colleagues, which actively delegate their peer interactions to it.' },
          { q: 'Can Mediator and Observer be combined?', a: 'Yes. A common implementation has colleagues notify the mediator via an Observer-style notify(sender, event) callback, and the mediator then orchestrates the responses, blending broadcast notification with centralised coordination.' },
        ],
      },
      {
        id: 'lld-memento',
        topic: 'Memento Pattern',
        summary: 'Capture and externalise an object\'s internal state without violating encapsulation, so the object can be restored to that state later.',
        explanation:
          'Intent: The Memento pattern lets you save a snapshot of an objects internal state and restore it later, without exposing the objects internal structure. The state is captured into an opaque memento object that only the original object can read, so encapsulation is preserved. It is the foundation of undo/redo, checkpoints, and save/restore features.\n\nProblem solved: Implementing undo or a "restore previous version" feature naively forces you to expose all of an objects private fields so an external manager can copy and later reinstate them, which breaks encapsulation. Memento avoids this by having the object itself produce a memento that captures its state and accept a memento to restore from. The outside world holds the memento but cannot peek inside it, so the objects internals stay private. A text editor storing snapshots for Ctrl+Z, a game saving checkpoints, and a graphics app saving canvas states all use this.\n\nStructure & participants: (1) Originator — the object whose state we want to save/restore; it has save() that creates a Memento and restore(m) that reinstates its state from a Memento. (2) Memento — a value object that stores the originators state; it is opaque to everyone except the originator (narrow interface to outsiders, wide interface to the originator). (3) Caretaker — manages and stores mementos (e.g. an undo history stack) but never inspects or modifies their contents; it just keeps them and hands them back. This separation is the heart of the pattern: the caretaker holds the snapshots without understanding them.\n\nHow it works (text editor undo): An Editor (Originator) has text content. Before each change the editor calls save(), producing an EditorMemento that copies the current text; the editor pushes that memento onto a history stack held by the Caretaker. On Ctrl+Z the caretaker pops the last memento and the editor calls restore(memento) to roll the text back. Redo keeps a parallel stack. Because the memento exposes its content only to the editor, no other class can tamper with saved states. To save memory, real systems store deltas/diffs instead of full snapshots.\n\nReal-world analogy: A video game save point or a documents version history. You create a save (memento), keep a list of saves (caretaker), and load any save to restore the exact prior state. The save file is opaque to you; only the game knows how to read it back.\n\nWhen to use / pros & cons: Use it to implement undo/redo, snapshots, checkpoints, or transactional rollback, and whenever direct access to an objects fields would break encapsulation. Pros: produces snapshots without violating encapsulation, simplifies the originator by offloading history to the caretaker, and cleanly supports undo/redo. Cons: mementos can consume a lot of memory if state is large or saved often, the caretaker must manage their lifecycle (when to discard old ones), and in languages without strong access control the "opaque" guarantee is weaker.',
        diagram: `MEMENTO — UML CLASS DIAGRAM (Editor Undo)

  ┌──────────────────────────┐  creates/reads  ┌────────────────────┐
  │      Originator          │────────────────►│     Memento        │
  │       Editor             │                 ├────────────────────┤
  ├──────────────────────────┤                 │ - state (private)  │
  │ - content: string        │                 │ + getState()       │
  │ + save(): Memento        │                 │   (wide: originator│
  │ + restore(m: Memento)    │                 │    only)           │
  └──────────────────────────┘                 └────────────────────┘
                                                        ▲ stores
                              ┌──────────────────────────┐
                              │      Caretaker           │
                              │   (History / UndoStack)  │
                              ├──────────────────────────┤
                              │ - history: Memento[]     │
                              │ + push(m)  + pop(): Memento│
                              └──────────────────────────┘

  Caretaker keeps mementos but never looks inside them.`,
        keyPoints: [
          'Intent: snapshot and restore an object\'s state without breaking encapsulation',
          'When to use: undo/redo, checkpoints, snapshots, transactional rollback',
          'Roles: Originator (save/restore), Memento (opaque state), Caretaker (history)',
          'Caretaker stores mementos but never reads or modifies them',
          'Pros: undo without exposing internals. Cons: memory cost of many snapshots',
        ],
        videos: [
          { label: 'Christopher Okhravi — Design Patterns playlist', url: 'https://www.youtube.com/playlist?list=PLrhzvIcii6GNjpARdnO4ueTUAVR9eMBpc' },
          { label: 'Concept && Coding (Shrayansh) — LLD/Design Patterns', url: 'https://www.youtube.com/@ConceptAndCodingByShrayansh' },
        ],
        links: [
          { label: 'refactoring.guru — Memento', url: 'https://refactoring.guru/design-patterns/memento' },
          { label: 'GeeksforGeeks — Memento Pattern', url: 'https://www.geeksforgeeks.org/memento-design-pattern/' },
        ],
        interview: [
          { q: 'How would you implement undo using Memento?', a: 'The originator creates a memento capturing its current state before each change; a caretaker pushes these onto a history stack. To undo, pop the last memento and call originator.restore(memento). Redo uses a second stack of undone mementos.' },
          { q: 'How does Memento preserve encapsulation?', a: 'Only the originator can read the mementos full state (a wide interface); the caretaker sees only an opaque handle (a narrow interface). So state is saved and restored without exposing the originators private fields to outside code.' },
          { q: 'What are the three participants in Memento?', a: 'Originator (creates and restores from mementos), Memento (the opaque snapshot of state), and Caretaker (stores the mementos, e.g. an undo-history stack, without inspecting them).' },
          { q: 'Memento vs Command for undo — how do they differ?', a: 'Command-based undo stores the operations and reverses them via undo() (logical/incremental). Memento-based undo stores full state snapshots and restores them wholesale. Command is memory-light but each op must be reversible; Memento is simpler to restore but heavier on memory.' },
          { q: 'What is the main drawback of Memento?', a: 'Saving frequent or large full-state snapshots consumes significant memory, and the caretaker must decide when to discard old mementos. Real systems often store deltas instead of full snapshots to mitigate this.' },
          { q: 'Where is Memento used in practice?', a: 'Editor/IDE undo-redo, game save points, database transaction rollback and savepoints, browser session restore, and graphics applications saving canvas history.' },
        ],
      },
    ],
  },
  {
    focus: 'Behavioral V — Visitor, Interpreter & Pattern Selection Guide',
    concepts: [
      {
        id: 'lld-visitor',
        topic: 'Visitor Pattern (with a note on Interpreter)',
        summary: 'Separate an algorithm from the object structure it operates on, letting you add new operations without modifying the elements.',
        explanation:
          'Intent: The Visitor pattern lets you define a new operation on a set of objects (an object structure) without changing the classes of those objects. You move the operation into a separate visitor object, and each element accepts a visitor and calls back the visitor method for its own type. This lets you add many unrelated operations over a stable class hierarchy while keeping each operations logic in one place.\n\nProblem solved: Suppose you have a hierarchy of elements (e.g. AST nodes, file-system items, or shapes) and you keep needing new operations over them — export to XML, compute size, render, type-check, price. Adding each operation as a method on every element class bloats those classes and mixes unrelated concerns. Visitor inverts this: each new operation is a new visitor class implementing a visit method per element type, and the element classes stay untouched. This is ideal when operations change often but the element types are stable.\n\nStructure & participants: (1) Visitor — interface with a visit method overloaded per concrete element, e.g. visitCircle(c), visitRectangle(r). (2) ConcreteVisitor — implements each visit method for one operation (e.g. AreaVisitor, DrawVisitor, XmlExportVisitor). (3) Element — interface with accept(visitor). (4) ConcreteElement — implements accept(v) by calling v.visitX(this). The trick is double dispatch: the actual method invoked depends on both the elements concrete type (via accept) and the visitors concrete type (via the visit overload), which single-dispatch languages cannot do directly.\n\nHow it works (shapes example): Shape has accept(visitor). Circle.accept(v) calls v.visitCircle(this); Rectangle.accept(v) calls v.visitRectangle(this). To compute areas, write AreaVisitor with visitCircle/visitRectangle returning each areas formula, then loop shapes calling shape.accept(areaVisitor). To later add an export operation you write XmlExportVisitor without touching Circle or Rectangle. The cost: adding a new element type (e.g. Triangle) forces every existing visitor to add visitTriangle — the well-known trade-off.\n\nBrief note on Interpreter: The Interpreter pattern defines a grammar for a simple language and an interpreter that evaluates sentences in that language. Each grammar rule becomes a class (TerminalExpression / NonTerminalExpression) with an interpret(context) method, and expressions are composed into an abstract syntax tree. It is used for SQL-like query parsers, regular-expression engines, rule engines, and calculators. It is powerful but rarely hand-rolled in interviews because real grammars are better handled by parser generators; know its intent (evaluate sentences of a small DSL via a class-per-rule AST) and that it pairs naturally with Visitor for traversing the tree.\n\nReal-world analogy: A tax auditor (visitor) who visits different kinds of businesses (elements). The auditor knows how to assess a restaurant differently from a factory, while the businesses just "accept" the auditor and let the appropriate assessment run. You can send in a new kind of inspector (a new visitor/operation) without changing the businesses.\n\nWhen to use / pros & cons: Use it when you must perform many distinct, unrelated operations over a stable object structure, especially a composite/tree, and want to keep each operation cohesive and separate from the elements. Pros: add new operations easily (OCP for operations), gather related behaviour in one visitor, and accumulate state across a traversal. Cons: adding a new element type breaks all visitors, the double-dispatch boilerplate is verbose, and visitors may need access to element internals, weakening encapsulation.',
        diagram: `VISITOR — UML + DOUBLE DISPATCH

  ┌────────────────────────┐        ┌────────────────────────────┐
  │  <<interface>>         │        │   <<interface>> Visitor    │
  │      Element           │        ├────────────────────────────┤
  ├────────────────────────┤        │ + visitCircle(c)           │
  │ + accept(v: Visitor)   │───────►│ + visitRectangle(r)        │
  └────────────────────────┘        └────────────────────────────┘
            ▲                                     ▲
   ┌────────┴────────┐              ┌─────────────┴─────────────┐
 ┌──────────────┐ ┌──────────────┐ ┌────────────────┐ ┌────────────────┐
 │   Circle     │ │  Rectangle   │ │  AreaVisitor   │ │  DrawVisitor   │
 ├──────────────┤ ├──────────────┤ ├────────────────┤ ├────────────────┤
 │ + accept(v)──┼─┤ + accept(v)  │ │ + visitCircle  │ │ + visitCircle  │
 │   v.visit-   │ │   v.visit-   │ │ + visitRect    │ │ + visitRect    │
 │   Circle(this)│ │  Rectangle()│ └────────────────┘ └────────────────┘
 └──────────────┘ └──────────────┘

  DOUBLE DISPATCH: element.accept(v) ─► v.visitConcrete(element)
  (operation chosen by element type AND visitor type)`,
        keyPoints: [
          'Intent: add operations over a stable object structure without changing element classes',
          'Mechanism: double dispatch via accept(visitor) + visitX(element) overloads',
          'When to use: many unrelated operations over a fixed hierarchy (e.g. AST, composite tree)',
          'Pros: easy to add operations (OCP). Cons: adding an element type breaks all visitors',
          'Interpreter: class-per-grammar-rule AST with interpret(); for small DSLs/expressions',
        ],
        videos: [
          { label: 'Christopher Okhravi — Design Patterns playlist', url: 'https://www.youtube.com/playlist?list=PLrhzvIcii6GNjpARdnO4ueTUAVR9eMBpc' },
          { label: 'Geekific — Design Patterns (code on GitHub)', url: 'https://github.com/geekific-official/geekific-youtube/tree/main/design-patterns' },
        ],
        links: [
          { label: 'refactoring.guru — Visitor', url: 'https://refactoring.guru/design-patterns/visitor' },
          { label: 'refactoring.guru — Interpreter (SourceMaking)', url: 'https://sourcemaking.com/design_patterns/interpreter' },
        ],
        interview: [
          { q: 'What is double dispatch and why does Visitor need it?', a: 'Double dispatch selects a method based on two runtime types: the element and the visitor. Single-dispatch languages pick a method by one receiver only, so Visitor simulates double dispatch via element.accept(v) calling v.visitConcrete(this), where the element type picks accept and the visitor type picks the visit overload.' },
          { q: 'When should you use Visitor and when should you avoid it?', a: 'Use it when the object structure is stable but you keep adding new operations over it. Avoid it when element types change frequently, because every new element type forces you to update all existing visitors.' },
          { q: 'What is the core trade-off of Visitor?', a: 'It makes adding operations easy (a new visitor) but adding element types hard (every visitor must add a new visit method). It is the inverse trade-off of putting methods directly on the elements.' },
          { q: 'What does the Interpreter pattern do?', a: 'It defines a grammar for a simple language and represents sentences as an abstract syntax tree of expression classes, each with an interpret(context) method. Used for expression evaluators, simple query languages, regex engines, and rule engines.' },
          { q: 'How do Visitor and Composite work together?', a: 'Composite builds a tree of elements; Visitor traverses that tree performing an operation, with the composites accept() forwarding the visitor to its children. Together they cleanly separate tree structure from the operations run over it.' },
          { q: 'Does Visitor violate encapsulation?', a: 'It can. Because the operation lives outside the element, visitors often need access to element internals (getters or wider visibility), which can leak details the element would otherwise keep private. That is a recognised cost of the pattern.' },
        ],
      },
      {
        id: 'lld-pattern-selection',
        topic: 'Pattern Selection Guide & Common Confusions',
        summary: 'A practical decision guide: map problem-symptoms to the right pattern and disambiguate the look-alike pairs interviewers love to test.',
        explanation:
          'Why this matters: In LLD interviews the hard part is not reciting a pattern but choosing the right one and defending it. Patterns are graded along three axes (Gang of Four): Creational (how objects are made — Factory, Abstract Factory, Builder, Prototype, Singleton), Structural (how objects are composed — Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy), and Behavioral (how objects interact and distribute responsibility — Strategy, Observer, Command, State, Template Method, Iterator, Chain of Responsibility, Mediator, Memento, Visitor, Interpreter). Start by identifying which axis your problem is on, then match the symptom.\n\nSymptom -> pattern mapping (the cheat sheet): "I have a big if/else picking an algorithm" -> Strategy. "Behaviour must change as the object moves through states" -> State. "One change must notify many dependents" -> Observer. "I need undo/redo, queuing, or to log/replay actions" -> Command (+ Memento for snapshot-style undo). "Many objects interact in a tangled mesh" -> Mediator. "Traverse a collection uniformly without exposing internals" -> Iterator. "An algorithm has a fixed skeleton but a few variable steps" -> Template Method (inheritance) or Strategy (composition). "A request could be handled by one of several handlers" -> Chain of Responsibility. "Add operations to a stable class hierarchy" -> Visitor. "Wrap an object to add behaviour at runtime" -> Decorator. "Make two incompatible interfaces work together" -> Adapter. "Control or stand in for access to an object" -> Proxy. "Simplify a complex subsystem behind one entry point" -> Facade. "Construct a complex object step by step" -> Builder. "Create objects without naming concrete classes" -> Factory Method / Abstract Factory. "Exactly one shared instance" -> Singleton.\n\nConfusion 1 — Strategy vs State: identical structure (context delegates to an interface), different intent. Strategy: the client chooses the algorithm; strategies are independent and do not switch among themselves; behaviour is set once. State: the object changes its own state in response to events; states know about and transition to each other. Ask "who triggers the change and do the variants know about each other?" — client + independent => Strategy; self + interconnected => State.\n\nConfusion 2 — Factory vs Builder: both create objects. Factory Method returns one product chosen by type in a single call and hides which concrete class is instantiated; use it when creation depends on a type/condition. Builder constructs a complex object step by step (often with many optional parameters or a fluent API) and returns it at the end; use it for objects with many configurations (e.g. building an HTTP request or a Pizza with optional toppings). Rule of thumb: Factory = "which object", Builder = "how to assemble this object".\n\nConfusion 3 — Decorator vs Proxy vs Adapter: all wrap an object but for different reasons. Decorator adds responsibilities/behaviour dynamically and you can stack many (e.g. BufferedInputStream wrapping a FileInputStream) — same interface, enhanced behaviour. Proxy controls access to the same interface without changing behaviour (lazy loading, caching, access control, remote calls) — same interface, gated access. Adapter changes/translates an interface so an incompatible class can be used (e.g. wrapping a legacy API to match a new one) — different interface made compatible. Ask: enhancing (Decorator), guarding (Proxy), or translating (Adapter)?\n\nConfusion 4 — Observer vs Mediator, plus picking the right one: Observer is one-to-many broadcast where observers do not talk to each other and the subject does not orchestrate them — pure notification. Mediator is many-to-many coordination where a central hub contains the interaction logic and decides who reacts. Use Observer for event/notification fan-out; use Mediator when components must coordinate complex mutual behaviour. General selection advice: prefer the simplest thing that works (often a plain function or polymorphism beats a pattern), favour composition over inheritance, do not force a pattern where none is needed, and in interviews always justify the choice by the symptom and name one concrete trade-off.',
        diagram: `PATTERN SELECTION — DECISION GUIDE

  WHAT IS YOUR PROBLEM ABOUT?
   ┌───────────────┬───────────────┬───────────────────┐
   ▼ creating      ▼ structuring   ▼ behaviour/interaction
 CREATIONAL       STRUCTURAL       BEHAVIORAL
 Factory/Builder  Adapter/Decorator Strategy/Observer/...
 Singleton/Proto  Proxy/Facade/...  State/Command/...

  SYMPTOM ──────────────────────► PATTERN
  big if/else picks algorithm ──► Strategy
  behaviour changes by state ───► State
  notify many on change ────────► Observer
  undo / queue / log actions ───► Command (+ Memento)
  tangled object mesh ──────────► Mediator
  uniform collection traversal ─► Iterator
  fixed skeleton, vary steps ───► Template Method
  one of many may handle it ────► Chain of Responsibility
  add ops to stable hierarchy ──► Visitor

  LOOK-ALIKES — ASK:
  Strategy vs State  : client-set & independent ? Strategy : self-switch
  Factory vs Builder : which object ? Factory : how to assemble ? Builder
  Decorator/Proxy/Adapter:
        enhance ◆ Decorator | guard ◆ Proxy | translate ◆ Adapter
  Observer vs Mediator: broadcast ◆ Observer | coordinate hub ◆ Mediator`,
        keyPoints: [
          'Classify first: Creational (make) vs Structural (compose) vs Behavioral (interact)',
          'Strategy vs State: client-chosen & independent => Strategy; self-transitioning => State',
          'Factory vs Builder: "which object" => Factory; "assemble step by step" => Builder',
          'Decorator (enhance) vs Proxy (guard access) vs Adapter (translate interface)',
          'Observer (one-to-many broadcast) vs Mediator (many-to-many hub coordination)',
          'Prefer the simplest solution; do not force a pattern; always justify by symptom + trade-off',
        ],
        videos: [
          { label: 'ByteByteGo — Design Patterns overview', url: 'https://www.youtube.com/@ByteByteGo' },
          { label: 'Christopher Okhravi — Design Patterns playlist', url: 'https://www.youtube.com/playlist?list=PLrhzvIcii6GNjpARdnO4ueTUAVR9eMBpc' },
        ],
        links: [
          { label: 'refactoring.guru — Catalog of Design Patterns', url: 'https://refactoring.guru/design-patterns/catalog' },
          { label: 'GeeksforGeeks — When to use which pattern (cheat sheet)', url: 'https://www.geeksforgeeks.org/system-design/design-patterns-cheat-sheet-when-to-use-which-design-pattern/' },
        ],
        interview: [
          { q: 'Strategy vs State — how do you decide which to use?', a: 'If the client picks an interchangeable algorithm and the variants are independent and unaware of each other, use Strategy. If the object transitions between states by itself in response to events and states know about each other, use State. Same structure, opposite intent.' },
          { q: 'Factory vs Builder — when do you pick each?', a: 'Use Factory (Method/Abstract) when you need to create one of several product types and want to hide the concrete class. Use Builder when a single complex object has many optional parts and must be assembled step by step, often via a fluent interface.' },
          { q: 'Decorator vs Proxy vs Adapter — how are they different?', a: 'All wrap an object. Decorator keeps the same interface and adds behaviour (stackable). Proxy keeps the same interface and controls access (lazy load, cache, security, remote). Adapter changes the interface to make an incompatible class usable. Ask: enhance, guard, or translate?' },
          { q: 'Observer vs Mediator — which for what?', a: 'Use Observer for one-to-many event notification where dependents do not interact. Use Mediator when many components must coordinate complex mutual interactions and you want that logic centralised in a hub rather than spread across peers.' },
          { q: 'How do you approach a "design X" LLD question with patterns?', a: 'Identify the core requirements and the parts that vary, classify the problem (creation/structure/behaviour), match the varying part to a pattern by symptom, sketch the class diagram, and justify the choice while naming one trade-off. Prefer the simplest design and avoid over-engineering.' },
          { q: 'Is it good to use as many patterns as possible?', a: 'No. Patterns add indirection and classes; using them where they are not needed (pattern-itis) hurts readability. Apply a pattern only when it solves a real, present variation or coupling problem, and otherwise prefer the simplest solution.' },
        ],
      },
    ],
  },
]
