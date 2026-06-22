// LLD Part 4 — Machine-coding case studies (Days 16-22).
// Diagram-driven, interview-aligned 'design X' problems.

export const DAYS = [
  {
    focus: 'Design: Parking Lot',
    concepts: [
      {
        id: 'lld-parking-lot',
        topic: 'Design Parking Lot — core model & spot allocation',
        summary: 'Multi-level lot with sized spots, ticketing, Factory + Strategy + Singleton.',
        explanation: 'Start by scoping requirements with clarifying questions: How many levels? Which vehicle types (motorcycle, car, truck/bus)? Do spots have sizes that constrain which vehicle fits (small/medium/large)? Is pricing hourly, flat, or tiered? Single entry/exit or multiple gates? How do we handle a full lot? Pinning these down decides whether we build a toy or an extensible system. For an interview, assume multiple levels, three spot sizes, hourly pricing, and multiple gates.\n\nCore entities fall out naturally. Vehicle is an abstract base with subclasses Car, Motorcycle, Truck, each exposing a VehicleType and the SpotType(s) it can occupy. ParkingSpot has an id, SpotType, isOccupied flag, and the parked Vehicle. ParkingLevel owns a collection of spots plus per-type free counts for O(1) availability checks. ParkingLot is the top-level aggregate holding levels, entry/exit gates, and the active tickets map. Ticket records spotId, vehicle, entryTime and (on exit) exitTime + amount. Gate/EntryGate/ExitGate orchestrate the issue/close flows.\n\nRelationships: ParkingLot composes ParkingLevel (lifecycle owned), ParkingLevel composes ParkingSpot, a ParkingSpot aggregates at most one Vehicle, and a Ticket associates a Vehicle with a ParkingSpot. Gates depend on ParkingLot and on the pricing + allocation strategies.\n\nPattern choices, justified. Factory: VehicleFactory.create(type) centralizes object creation so adding a new vehicle type touches one place, not every call site. Strategy: SpotAllocationStrategy (nearest-to-gate, first-fit, best-fit by size) and PricingStrategy are swapped at runtime without editing the lot. Singleton: ParkingLot is a single shared instance (one physical lot) — but make it thread-safe (double-checked locking / eager init) so concurrent gates see consistent state. Observer is optional to push "lot full" / "spot freed" events to a display board.\n\nKey APIs: ParkingLot.getInstance(); EntryGate.park(vehicle) -> Ticket (find spot via strategy, mark occupied atomically, create ticket); ExitGate.unpark(ticket) -> amount (compute price via PricingStrategy, free the spot, remove ticket); ParkingLevel.findSpot(VehicleType); ParkingLevel.freeSpot(spot). The allocation + occupancy mutation must be one atomic step.\n\nConcurrency and edge cases are where candidates score. Two cars racing for the last spot must not both win — guard spot assignment with a per-level lock or a CAS on isOccupied, or pull from a concurrent free-list. Other edges: lot/level full (return null or queue), lost ticket (flat penalty), vehicle that fits no spot type, exit without a valid ticket, and clock issues for billing (use monotonic timestamps).\n\nExtensions: add electric spots with charging (new SpotType + pricing rule), reservations/valet, license-plate recognition replacing physical tickets, dynamic surge pricing (new PricingStrategy), and a display Observer per level. Because creation is behind a factory and the variable behaviors are strategies, each extension is additive and respects Open/Closed.',
        diagram: `        ┌──────────────────────────────────────────────┐
        │            ParkingLot  «Singleton»             │
        ├──────────────────────────────────────────────┤
        │ - instance: ParkingLot                         │
        │ - levels: List<ParkingLevel>                   │
        │ - tickets: Map<id, Ticket>                     │
        ├──────────────────────────────────────────────┤
        │ + getInstance(): ParkingLot                    │
        │ + park(v): Ticket   + unpark(t): double        │
        └───────┬───────────────────────┬────────────────┘
            ◆ 1..*                    ▷ uses
        ┌───────┴────────┐   ┌──────────────────────────┐
        │  ParkingLevel  │   │ «interface»              │
        ├────────────────┤   │ SpotAllocationStrategy   │
        │ - floor: int   │   ├──────────────────────────┤
        │ - spots: List  │   │ + findSpot(type): Spot   │
        │ - free: Map    │   └─────────▲────────────────┘
        ├────────────────┤      ┌──────┴──────┐
        │ + findSpot()   │      │ NearestFirst│ BestFit
        │ + freeSpot()   │      └─────────────┘
        └───────┬────────┘
           ◆ 1..*
        ┌───────┴────────┐        ┌──────────────────────┐
        │  ParkingSpot   │        │ «interface»          │
        ├────────────────┤        │ PricingStrategy      │
        │ - id; type     │        ├──────────────────────┤
        │ - occupied:bool│        │ + price(t): double   │
        │ - vehicle      │        └────────▲─────────────┘
        └───────┬────────┘     ┌───────────┴──────────┐
            ▷ 0..1            │ HourlyPricing | FlatRate│
        ┌───────┴────────┐    └─────────────────────────┘
        │ «abstract»     │   ┌──────────────────────────┐
        │   Vehicle      │   │  VehicleFactory «Factory» │
        ├────────────────┤   │ + create(type): Vehicle  │
        │ - plate; type  │   └──────────────────────────┘
        └──▲──────▲──────┘   enum VehicleType{MOTO,CAR,TRUCK}
       Car │ Moto │ Truck    enum SpotType{SMALL,MEDIUM,LARGE}`,
        keyPoints: [
          'Entities: ParkingLot, ParkingLevel, ParkingSpot, Vehicle hierarchy, Ticket, Gate',
          'Patterns: Singleton (lot), Factory (vehicle), Strategy (allocation + pricing), Observer (board)',
          'Spot allocation + occupancy flip must be atomic to prevent two vehicles winning the last spot',
          'Edges: lot full, lost ticket penalty, no fitting spot, exit without valid ticket',
          'Open/Closed: new vehicle type = factory edit; new pricing = new strategy',
        ],
        videos: [
          { label: 'Concept && Coding — LLD playlist (Parking Lot)', url: 'https://www.youtube.com/playlist?list=PL6W8uoQQ2c61X_9e6Net0WdYZidm7zooW' },
          { label: 'sudocode — Parking Lot design', url: 'https://www.youtube.com/c/sudoCODE' },
        ],
        links: [
          { label: 'awesome-low-level-design — parking-lot.md', url: 'https://github.com/ashishps1/awesome-low-level-design/blob/main/problems/parking-lot.md' },
          { label: 'GeeksforGeeks — Design Parking Lot (LLD)', url: 'https://www.geeksforgeeks.org/system-design/design-parking-lot-system-design/' },
        ],
        interview: [
          { q: 'How would you add a new vehicle type (e.g. electric scooter)?', a: 'Add a Vehicle subclass and a case in VehicleFactory; map it to a SpotType. No changes to ParkingLot/level logic — that is the Open/Closed payoff of factory + strategy.' },
          { q: 'How do you stop two cars from grabbing the same last spot?', a: 'Make find-and-occupy one atomic operation: lock the level (or the per-type free-list) while assigning, or CAS the isOccupied flag. The loser retries or is told the lot is full.' },
          { q: 'Why Singleton for ParkingLot, and what is the risk?', a: 'There is one physical lot, so one shared instance keeps occupancy consistent. Risk: hidden global state and broken lazy init under threads — use eager init or double-checked locking, and avoid it where DI/testing matters.' },
          { q: 'How does pricing stay flexible?', a: 'Pricing is a Strategy injected into the exit flow (hourly, flat, tiered, surge). Swapping rates or rules means a new strategy class, never edits to the gate.' },
          { q: 'How would you support spot reservations?', a: 'Add a Reservation entity and a reserved state on ParkingSpot; the allocation strategy skips reserved spots for walk-ins and a scheduler releases expired holds.' },
        ],
      },
      {
        id: 'lld-parking-lot-payment',
        topic: 'Design Parking Lot — payment & pricing detail',
        summary: 'Pluggable pricing + payment-method strategies with a clean exit flow.',
        explanation: 'The exit flow is its own mini design. On unpark we (1) compute duration from the ticket, (2) ask the PricingStrategy for the amount, (3) collect via a PaymentStrategy, (4) free the spot, (5) close the ticket. Keeping these steps explicit lets each vary independently and keeps the gate dumb.\n\nPricingStrategy encapsulates how money is computed: HourlyPricing (rate per started hour by SpotType), FlatRatePricing, FreeFirstNMinutes, and SurgePricing (rate scales with occupancy). Each takes the Ticket (entry/exit time, spot type) and returns an amount, so a new scheme is a new class.\n\nPaymentStrategy encapsulates how money is collected: CashPayment, CardPayment, UpiPayment, WalletPayment. A PaymentProcessor coordinates: charge(amount) -> PaymentResult{SUCCESS, FAILED, PENDING}. On failure the spot stays occupied and the ticket stays open, so the vehicle cannot leave without paying.\n\nPatterns: Strategy twice (pricing and payment), optionally Factory to build the right PaymentStrategy from a method enum, and Observer to emit a receipt / update the display when a payment succeeds. This cleanly separates "how much" from "how paid" from "what to display".\n\nConcurrency/edge cases: idempotent payment (retrying a charge must not double-bill — key on ticketId), partial/failed payment handling, refunds for overcharge, clock skew on duration, and lost-ticket flat penalty. Make the close-ticket + free-spot step atomic with the recorded payment so we never free a spot for an unpaid exit.\n\nExtensions: subscriptions / monthly passes (pricing returns 0 and decrements a quota), discount coupons (decorator over a pricing strategy), and multi-currency. Because pricing and payment are strategies, finance changes never touch the parking domain.',
        diagram: `   ┌────────────────────────────────────────────────┐
   │                   ExitGate                       │
   ├────────────────────────────────────────────────┤
   │ - pricing: PricingStrategy                       │
   │ - processor: PaymentProcessor                    │
   ├────────────────────────────────────────────────┤
   │ + unpark(ticket): Receipt                        │
   └─────┬───────────────────────────┬────────────────┘
      ▷ uses                       ▷ uses
   ┌─────┴──────────────┐   ┌────────┴───────────────┐
   │ «interface»        │   │   PaymentProcessor     │
   │ PricingStrategy    │   ├────────────────────────┤
   ├────────────────────┤   │ - method: PaymentStrat │
   │ + price(Ticket):d  │   │ + charge(amt): Result  │
   └────▲──────▲────────┘   └──────────┬─────────────┘
        │      │                    ◆ uses
  Hourly │  Surge │            ┌────────┴───────────────┐
  Pricing│  Pricing            │ «interface»            │
  FlatRate         FreeFirstN  │ PaymentStrategy        │
                               ├────────────────────────┤
   ┌──────────────────────┐    │ + pay(amt): Result     │
   │  Ticket              │    └───▲────▲────▲───────────┘
   ├──────────────────────┤    Cash │Card│ Upi │ Wallet
   │ - entryTime; exitTime│
   │ - spotType; amount   │  enum Result{SUCCESS,FAILED,PENDING}
   └──────────────────────┘`,
        keyPoints: [
          'Exit flow: compute duration -> price -> collect -> free spot -> close ticket',
          'Two strategies: PricingStrategy (how much) and PaymentStrategy (how paid)',
          'Idempotent charge keyed on ticketId prevents double-billing on retry',
          'Free-spot + payment record must be atomic so no unpaid exit',
          'Coupons as a decorator over pricing; subscriptions return zero charge',
        ],
        videos: [
          { label: 'Concept && Coding — LLD playlist', url: 'https://www.youtube.com/playlist?list=PL6W8uoQQ2c61X_9e6Net0WdYZidm7zooW' },
          { label: 'Engineering Digest — LLD playlist', url: 'https://www.youtube.com/@EngineeringDigest' },
        ],
        links: [
          { label: 'awesome-low-level-design — parking-lot.md', url: 'https://github.com/ashishps1/awesome-low-level-design/blob/main/problems/parking-lot.md' },
          { label: 'Refactoring Guru — Strategy pattern', url: 'https://refactoring.guru/design-patterns/strategy' },
        ],
        interview: [
          { q: 'How do you add UPI/wallet without touching existing code?', a: 'Implement PaymentStrategy and register it in the PaymentFactory; the processor and gate are unchanged.' },
          { q: 'How do you make payment idempotent?', a: 'Key the charge on ticketId and persist a payment record; a retry sees the existing SUCCESS and returns it instead of charging again.' },
          { q: 'Where does a discount coupon fit?', a: 'As a decorator wrapping the chosen PricingStrategy: it calls the inner price() then subtracts/percent-discounts, so coupons compose with any base scheme.' },
          { q: 'What if payment fails at exit?', a: 'Keep the spot occupied and the ticket open; surface a retry. Atomicity guarantees the spot is only freed once a SUCCESS is recorded.' },
          { q: 'How would you support monthly passes?', a: 'A SubscriptionPricing returns 0 (or a prorated charge) and decrements the pass quota; the rest of the flow is unchanged.' },
        ],
      },
    ],
  },

  {
    focus: 'Design: Elevator System',
    concepts: [
      {
        id: 'lld-elevator-system',
        topic: 'Design Elevator System — cars, controller & scheduling',
        summary: 'State + Strategy + Observer model for multi-car elevator dispatch.',
        explanation: 'Clarify scope first: How many elevator cars and floors? Are there separate internal (inside-car panel) and external (up/down hall) requests? What scheduling policy — FCFS, SCAN/LOOK (elevator algorithm), or shortest-seek? Capacity/weight limits? Express floors? For an interview assume multiple cars, both request types, and a LOOK-based scheduler.\n\nCore entities: ElevatorCar holds currentFloor, Direction (UP/DOWN/IDLE), an ElevatorState, capacity, and two request sets (up-stops, down-stops). Request models a target floor and a source (INTERNAL vs EXTERNAL with a desired direction). ElevatorController (dispatcher) owns all cars and routes each external request to the best car. Floor / HallPanel raise external requests; an internal Panel raises internal ones. A Display shows each car position.\n\nRelationships: ElevatorController aggregates many ElevatorCar; each ElevatorCar has-a ElevatorState and a SchedulingStrategy is used by the controller to pick a car and by the car to order its stops. Panels are sources that the controller observes.\n\nPattern choices: State governs per-car behavior — MovingUpState, MovingDownState, IdleState, (optional DoorOpenState/MaintenanceState) — so move(), stop(), and openDoor() do the right thing without giant if/else, and transitions are explicit. Strategy is the dispatch/scheduling policy (LOOK, nearest-car, least-load) swapped without touching cars. Observer pushes car position/arrival events to displays and the controller. Command can wrap a button press as a request object (nice for queuing/undo of selections).\n\nKey APIs: HallPanel.pressUp(floor)/pressDown(floor) and Panel.pressFloor(n) create Requests; ElevatorController.submit(Request) -> picks a car via strategy and enqueues; ElevatorCar.step() advances one tick honoring its state and ordered stops; ElevatorCar.addStop(floor, dir). The scheduler turns a flat request set into a direction-aware ordered route.\n\nScheduling logic (LOOK): a car keeps moving in its current direction serving all stops in that direction, then reverses when none remain ahead. This minimizes direction changes and starvation versus naive FCFS. The controller assigns an external request to a car already heading that way and passing the floor, else the nearest idle car.\n\nConcurrency/edge cases: simultaneous presses on the same floor, request arriving for a floor the car just passed, overload (refuse new internal stops), a car going out of service mid-route (re-dispatch its pending external requests), and direction flips. Extensions: express elevators, zoning (cars serve floor bands), VIP/priority requests, and energy-optimal idle parking — each is a new SchedulingStrategy or State.',
        diagram: `   ┌──────────────────────────────────────────────────┐
   │            ElevatorController «Dispatcher»          │
   ├──────────────────────────────────────────────────┤
   │ - cars: List<ElevatorCar>                          │
   │ - strategy: SchedulingStrategy                     │
   ├──────────────────────────────────────────────────┤
   │ + submit(req: Request)                             │
   │ + step()  // advance all cars one tick             │
   └────┬───────────────────────────────┬───────────────┘
     ◆ 1..*                           ▷ uses
   ┌────┴───────────┐         ┌─────────┴──────────────┐
   │  ElevatorCar   │         │ «interface»            │
   ├────────────────┤         │ SchedulingStrategy     │
   │ - curFloor:int │         ├────────────────────────┤
   │ - dir:Direction│         │ + pick(cars,req): Car  │
   │ - upStops; dn  │         │ + nextStop(car): int   │
   │ - state        │         └────────▲───────────────┘
   ├────────────────┤        ┌──────────┴─────────┐
   │ + step()       │        │ LookStrategy        │
   │ + addStop(f,d) │        │ NearestCarStrategy  │
   └───┬────────────┘        └─────────────────────┘
    ▷ has-a
   ┌───┴────────────────────┐    ┌──────────────────────┐
   │ «interface»            │    │  Request             │
   │ ElevatorState          │    ├──────────────────────┤
   ├────────────────────────┤    │ - floor:int          │
   │ + move() + stop()      │    │ - source:Source      │
   │ + openDoor()           │    │ - dir:Direction      │
   └──▲──────▲──────▲───────┘    └──────────────────────┘
  Moving│Moving│ Idle │ Door  enum Direction{UP,DOWN,IDLE}
  Up    │Down  │ State│ Open  enum Source{INTERNAL,EXTERNAL}
            «Observer» Display ◁── observes ── ElevatorCar`,
        keyPoints: [
          'Entities: ElevatorController, ElevatorCar, ElevatorState, Request, Panels, Display',
          'State pattern: Idle/MovingUp/MovingDown/DoorOpen drive per-car behavior',
          'Strategy: scheduling (LOOK/SCAN, nearest-car, least-load) is pluggable',
          'Observer: car position/arrival events feed displays and controller',
          'LOOK serves all stops in one direction then reverses — avoids starvation',
          'Edges: passed-floor request, overload, car out-of-service re-dispatch',
        ],
        videos: [
          { label: 'sudocode — Design Elevator System (LLD)', url: 'https://www.youtube.com/c/sudoCODE' },
          { label: 'Concept && Coding — LLD playlist', url: 'https://www.youtube.com/playlist?list=PL6W8uoQQ2c61X_9e6Net0WdYZidm7zooW' },
        ],
        links: [
          { label: 'awesome-low-level-design — elevator-system.md', url: 'https://github.com/ashishps1/awesome-low-level-design/blob/main/problems/elevator-system.md' },
          { label: 'GeeksforGeeks — Elevator system LLD', url: 'https://www.geeksforgeeks.org/system-design/design-an-elevator-system-lld/' },
        ],
        interview: [
          { q: 'How does your elevator decide which request to serve next?', a: 'Per car, the LOOK strategy serves all pending stops in the current direction in floor order, then reverses. The controller assigns each external request to the car already moving toward it and passing the floor, else the nearest idle car.' },
          { q: 'Why the State pattern here?', a: 'A car behaves differently per state (moving up vs idle vs door open). Encoding it as state classes makes move()/stop()/openDoor() and the legal transitions explicit, killing brittle if/else chains.' },
          { q: 'Internal vs external requests — why distinguish?', a: 'Internal requests are committed destinations the car must serve; external (hall) requests carry a desired direction and can be reassigned among cars by the dispatcher for efficiency.' },
          { q: 'How do you prevent starvation?', a: 'LOOK guarantees progress in one direction before reversing, so far requests are eventually swept; optionally age requests and bump priority if they wait too long.' },
          { q: 'A car goes out of service mid-route. Now what?', a: 'It transitions to a Maintenance state; its pending external requests are returned to the controller and re-dispatched to other cars, internal ones are dropped after passengers exit.' },
          { q: 'How would you scale to many cars / zoning?', a: 'Add a ZoneStrategy so each car serves a floor band; the dispatcher first routes by zone then by LOOK within the zone — both are just new SchedulingStrategy implementations.' },
        ],
      },
    ],
  },

  {
    focus: 'Design: BookMyShow (Movie Ticket Booking)',
    concepts: [
      {
        id: 'lld-bookmyshow',
        topic: 'Design BookMyShow — core domain model',
        summary: 'Movies, theatres, screens, shows, seats and bookings with payment + notify.',
        explanation: 'Scope it: browse movies by city, pick a theatre/show, select seats, pay, get a confirmation. Out of scope for a 45-min round: recommendations, reviews. Clarify multi-city, seat categories (silver/gold/recliner) with per-category pricing, and that double-booking must be impossible — that last point drives the concurrency concept (next).\n\nCore entities: Movie (title, language, duration, genre). City and Theatre (a theatre belongs to a city and owns Screens). Screen has a fixed seat layout (Seat with row/col and SeatCategory). Show ties a Movie to a Screen at a startTime and carries the bookable ShowSeat instances (a per-show copy of each seat with a SeatStatus). Booking links a User, a Show, the chosen seats, an amount and a BookingStatus. Payment records the transaction.\n\nRelationships: City 1..* Theatre; Theatre 1..* Screen; Screen 1..* Seat; Show references one Movie + one Screen and owns 1..* ShowSeat; Booking aggregates 1..* ShowSeat and one Payment. Separating Seat (physical, reusable) from ShowSeat (per-show, stateful) is the key modelling move — availability is per show, not per physical seat.\n\nPatterns: Singleton for the central BookMyShow service / catalog. Strategy for pricing (per category, weekend surge) and payment method. Observer to notify the user (email/SMS) on booking confirmation and to update seat-availability displays. Factory can build payment instances. A SearchService indexes shows by city+movie+date.\n\nKey APIs: searchMovies(city, date) -> List<Show>; getAvailableSeats(showId); createBooking(user, showId, seatIds) -> Booking(PENDING) (this is where seat locking happens); makePayment(bookingId) -> confirms or releases; cancelBooking(bookingId). The booking deliberately starts PENDING and only becomes CONFIRMED after payment.\n\nEdge cases: a show selling out between search and select (refresh seats), user abandoning a held selection (lock expiry), partial-group bookings, and refunds on cancellation. Concurrency (double-booking) is large enough to be its own concept.\n\nExtensions: offers/coupons (decorator over pricing), dynamic pricing, waitlists, multiplexes with many screens, and a notifications fan-out. Because seat state is per-show and pricing/payment are strategies, scaling to thousands of shows is additive.',
        diagram: `  ┌──────────────────────────────────────────────────┐
  │           BookMyShow «Singleton» (Service)         │
  ├──────────────────────────────────────────────────┤
  │ + searchMovies(city,date): List<Show>             │
  │ + createBooking(user,show,seats): Booking         │
  └────┬───────────────┬──────────────────┬───────────┘
    ◆ cities         ◆ catalog          ▷ uses
  ┌────┴─────┐     ┌────┴────┐      ┌──────┴──────────┐
  │   City   │     │  Movie  │      │ PricingStrategy │
  ├──────────┤     ├─────────┤      │ PaymentStrategy │
  │ - name   │     │ - title │      └─────────────────┘
  │ -theatres│     │ - lang  │
  └────┬─────┘     └─────────┘      ┌──────────────────┐
   ◆ 1..*                           │     Booking      │
  ┌────┴──────┐                     ├──────────────────┤
  │  Theatre  │                     │ - user; show     │
  ├───────────┤                     │ - seats:List     │
  │ - screens │                     │ - amount; status │
  └────┬──────┘                     └────┬─────────────┘
   ◆ 1..*                              ◆ 1..*
  ┌────┴──────┐    ┌──────────────┐  ┌──┴──────────────┐
  │  Screen   │    │     Show     │  │   ShowSeat      │
  ├───────────┤    ├──────────────┤  ├─────────────────┤
  │ - seats   │◀───│ - movie;screen│─▶│ - seat; price   │
  │ (layout)  │ref │ - startTime  │◆ │ - status        │
  └────┬──────┘    │ - showSeats  │  └─────────────────┘
   ◆ 1..*          └──────────────┘
  ┌────┴──────┐  enum SeatStatus{AVAILABLE,LOCKED,BOOKED}
  │   Seat    │  enum SeatCategory{SILVER,GOLD,RECLINER}
  │ row;col;cat│ enum BookingStatus{PENDING,CONFIRMED,CANCELLED}
  └───────────┘  «Observer» Notifier ◁── on CONFIRMED`,
        keyPoints: [
          'Key model: separate physical Seat from per-show stateful ShowSeat',
          'Entities: City, Theatre, Screen, Movie, Show, ShowSeat, Booking, Payment',
          'Patterns: Singleton (service), Strategy (pricing/payment), Observer (notify)',
          'Booking starts PENDING; CONFIRMED only after payment success',
          'Availability is per-show; seat locking handled in the concurrency concept',
        ],
        videos: [
          { label: 'Concept && Coding — BookMyShow LLD', url: 'https://www.youtube.com/playlist?list=PL6W8uoQQ2c61X_9e6Net0WdYZidm7zooW' },
          { label: 'Coder Army — LLD playlist', url: 'https://www.youtube.com/@CoderArmy9' },
        ],
        links: [
          { label: 'awesome-low-level-design — movie-ticket-booking-system.md', url: 'https://github.com/ashishps1/awesome-low-level-design/blob/main/problems/movie-ticket-booking-system.md' },
          { label: 'GeeksforGeeks — Design BookMyShow', url: 'https://www.geeksforgeeks.org/system-design/design-bookmyshow-a-system-design-interview-question/' },
        ],
        interview: [
          { q: 'Why separate Seat and ShowSeat?', a: 'A physical Seat is reused across every show; bookability is per show. ShowSeat is a per-show copy carrying status and price, so the same chair can be free in one show and booked in another.' },
          { q: 'Why does a booking start in PENDING?', a: 'Selecting seats reserves them temporarily; the booking only becomes CONFIRMED after payment succeeds. PENDING lets us hold seats during checkout and release them if payment fails or times out.' },
          { q: 'How do you support seat categories and weekend pricing?', a: 'Each ShowSeat carries a category; a PricingStrategy computes price from category + show time (weekend surge), so pricing rules change without touching the booking flow.' },
          { q: 'How would you notify users of confirmation?', a: 'A Notifier observer subscribes to booking events and fans out email/SMS/push on CONFIRMED — decoupled from the booking logic via Observer.' },
          { q: 'How do you search shows efficiently?', a: 'A SearchService indexes shows by (city, movieId, date); the catalog/service exposes search and the heavy domain objects stay lazy-loaded.' },
        ],
      },
      {
        id: 'lld-bookmyshow-concurrency',
        topic: 'Design BookMyShow — seat locking & double-booking prevention',
        summary: 'Temporary seat locks + atomic CAS so two users never book the same seat.',
        explanation: 'The hard part of BookMyShow is concurrency: two users selecting the same seat for the same show at the same instant must not both succeed. The fix is a two-phase flow — a short-lived LOCK during checkout, then a permanent BOOK on payment — backed by atomicity at the seat level.\n\nPhase 1, lock: when a user selects seats, attempt to move each ShowSeat from AVAILABLE -> LOCKED atomically (compare-and-set / a row-level DB lock / SELECT ... FOR UPDATE, or a distributed lock keyed by showId:seatId in Redis with a TTL). The lock is held by that userId with an expiry (say 5 minutes). If any requested seat cannot transition (already LOCKED/BOOKED), roll back the seats already locked in this request and fail fast — all-or-nothing for the group.\n\nPhase 2, book: on successful payment, transition the held seats LOCKED -> BOOKED (verifying the same user still holds the lock and it has not expired). If payment fails or the TTL elapses, a SeatLockManager reaper releases the seats LOCKED -> AVAILABLE so they are not stranded. This is exactly why Booking starts PENDING.\n\nKey component: SeatLockManager (or SeatLockProvider) with lock(show, seats, user, ttl), unlock(show, seats, user), validate(show, seat, user), and getLockedSeats(show). In-memory it is a ConcurrentHashMap<seatKey, SeatLock{user, expiry}> guarded so the check-then-set is atomic; distributed it is Redis SETNX with TTL or a DB unique constraint. The unique constraint on (showId, seatId, status=BOOKED) is a final safety net so even a race that slips through cannot create two bookings.\n\nConcurrency choices and trade-offs: optimistic locking (version column, retry on conflict) scales better under low contention; pessimistic locking (FOR UPDATE) is simpler and safer under hot shows; the TTL-based soft lock gives good UX (seats free themselves). Edges: lock expiry mid-payment (re-validate before BOOK and refund if lost), user double-clicking (idempotent lock by userId returns the same lock), clock skew on TTL (server time only), and partial group failure (rollback).\n\nExtensions: a queue/waiting-room for blockbuster on-sale spikes, hold-extension on active payment, and analytics on lock contention. The sequence below shows the happy path and the loser being rejected.',
        diagram: `  SEAT-LOCK CLASS VIEW
  ┌────────────────────────────────────────────────┐
  │            SeatLockManager                       │
  ├────────────────────────────────────────────────┤
  │ - locks: ConcurrentMap<key, SeatLock>            │
  │ - ttl: Duration                                  │
  ├────────────────────────────────────────────────┤
  │ + lock(show,seats,user): bool   // atomic CAS    │
  │ + unlock(show,seats,user)                        │
  │ + validate(show,seat,user): bool                 │
  │ + reapExpired()                                  │
  └───────────────────┬──────────────────────────────┘
                   ◆ holds
              ┌────────┴─────────┐
              │     SeatLock     │
              │ - user; expiry   │
              └──────────────────┘
  status flow:  AVAILABLE ─lock► LOCKED ─pay► BOOKED
                    ▲              │
                    └── expire/fail┘

  SEQUENCE (two users, one seat)
  UserA        UserB        SeatLockManager        Payment
   │ lock(S) ───────────────────►│ CAS A:OK            │
   │            │ lock(S) ───────►│ CAS B:FAIL (held)   │
   │            │◄── rejected ────│                     │
   │ pay ───────────────────────────────────────►│ OK  │
   │ book(S): validate A ─► LOCKED▶BOOKED ◄───────│     │
   │◄── CONFIRMED                 │                     │`,
        keyPoints: [
          'Two-phase: AVAILABLE -> LOCKED (TTL, during checkout) -> BOOKED (on pay)',
          'SeatLockManager does atomic CAS / SETNX / SELECT FOR UPDATE per seat',
          'Group lock is all-or-nothing: roll back partial locks on any failure',
          'TTL reaper releases stranded locks if payment fails or times out',
          'Unique constraint on (showId,seatId,BOOKED) is the final race safety net',
          'Optimistic (version+retry) vs pessimistic (FOR UPDATE) vs soft TTL lock trade-offs',
        ],
        videos: [
          { label: 'Concept && Coding — BookMyShow concurrency', url: 'https://www.youtube.com/playlist?list=PL6W8uoQQ2c61X_9e6Net0WdYZidm7zooW' },
          { label: 'Gaurav Sen — System design playlist', url: 'https://www.youtube.com/@gkcs' },
        ],
        links: [
          { label: 'awesome-low-level-design — movie-ticket-booking-system.md', url: 'https://github.com/ashishps1/awesome-low-level-design/blob/main/problems/movie-ticket-booking-system.md' },
          { label: 'GeeksforGeeks — Optimistic vs Pessimistic locking', url: 'https://www.geeksforgeeks.org/system-design/optimistic-vs-pessimistic-concurrency-control/' },
        ],
        interview: [
          { q: 'How do you prevent double booking in BookMyShow?', a: 'Two-phase locking: atomically CAS each ShowSeat AVAILABLE->LOCKED during checkout (the loser is rejected), then LOCKED->BOOKED only on payment. A DB unique constraint on booked seats is the final guarantee.' },
          { q: 'What happens if a user locks seats but never pays?', a: 'The lock carries a TTL; a reaper (or lazy check on next access) releases LOCKED->AVAILABLE on expiry, so abandoned selections do not strand seats.' },
          { q: 'Optimistic vs pessimistic locking — which and why?', a: 'Pessimistic (SELECT FOR UPDATE) for hot, high-contention shows: simpler and avoids retry storms. Optimistic (version + retry) for low contention: better throughput. The TTL soft-lock layers good UX on top.' },
          { q: 'Lock expires mid-payment — how do you avoid charging then losing the seat?', a: 'Re-validate the lock (same user, not expired) right before LOCKED->BOOKED; if it was lost, fail the booking and refund. Or extend the TTL while a payment is actively in flight.' },
          { q: 'How is the group booking kept all-or-nothing?', a: 'Lock all requested seats in one transaction; if any seat fails to lock, roll back the ones already locked in this request and reject the whole booking.' },
          { q: 'How would you handle a blockbuster on-sale spike?', a: 'Front it with a waiting-room/queue to admit users at a controlled rate, plus per-seat sharded locks (Redis) so contention is local to a seat key, not a global lock.' },
        ],
      },
    ],
  },

  {
    focus: 'Design: Splitwise',
    concepts: [
      {
        id: 'lld-splitwise',
        topic: 'Design Splitwise — expenses, splits & debt simplification',
        summary: 'Users/groups, pluggable split strategies, balance sheet, debt simplification.',
        explanation: 'Scope: users add expenses (someone pays, others owe), in groups or one-off; splits can be equal, exact amounts, or by percentage; the app shows who owes whom and can simplify debts. Clarify currency handling, whether settlements are recorded, and whether group balances or pairwise balances are shown.\n\nCore entities: User (id, name, contact). Group aggregates Users and Expenses. Expense (id, amount, paidBy, list of Splits, SplitType). Split is abstract with EqualSplit, ExactSplit, PercentSplit subclasses, each holding a user and the amount they owe. A BalanceSheet (per user, or a central ExpenseManager) tracks net pairwise balances: balances[A][B] = how much A owes B.\n\nRelationships: Group 1..* User and 1..* Expense; Expense has one paidBy User and 1..* Split; each Split references a User. The ExpenseManager (or Splitwise singleton) owns users and the balance graph and applies each expense to it.\n\nPatterns: Strategy for split computation — SplitStrategy.validate(total, splits) + each split type computes shares (equal divides evenly handling remainder cents, percent multiplies, exact must sum to total). This is the centerpiece pattern. Observer to notify members when an expense is added or a balance changes. Singleton for the manager. Optionally Factory to build the right Split objects from a request.\n\nKey APIs: addExpense(paidBy, amount, splits, type) -> validates via strategy then updates balances; getBalances(user) -> who they owe / who owes them; settleUp(from, to, amount); simplifyDebts(group). On addExpense, for each ower we do balances[ower][payer] += share and net it against any reverse balance.\n\nDebt simplification idea: model net balances as a graph; compute each person net = totalPaid - totalOwed. Then greedily match the biggest creditor with the biggest debtor (max-flow / heap of credits and debits): settle min(|credit|, |debit|), reducing the number of transactions toward (n-1) instead of O(n^2) pairwise IOUs. This minimizes the count of transfers, not the total money.\n\nEdge cases: rounding cents on equal split (assign the leftover penny deterministically), exact splits not summing to total (reject), percentages not summing to 100, self-inclusion of the payer, and multi-currency (normalize). Extensions: recurring expenses, partial settlements, comments/attachments, and multiple currencies via a conversion strategy.',
        diagram: `   ┌──────────────────────────────────────────────────┐
   │          Splitwise «Singleton» (ExpenseManager)    │
   ├──────────────────────────────────────────────────┤
   │ - users: Map<id,User>                              │
   │ - balances: Map<User, Map<User, double>>           │
   ├──────────────────────────────────────────────────┤
   │ + addExpense(exp)                                  │
   │ + getBalances(user)  + simplifyDebts(group)        │
   └────┬───────────────┬──────────────────┬───────────┘
     ◆ users          ◆ groups           ▷ uses
   ┌────┴────┐    ┌──────┴──────┐   ┌───────┴──────────┐
   │  User   │    │   Group     │   │ «interface»      │
   ├─────────┤    ├─────────────┤   │ SplitStrategy    │
   │ - id    │    │ - members   │   ├──────────────────┤
   │ - name  │    │ - expenses  │   │ + computeShares  │
   └─────────┘    └──────┬──────┘   │   (total,splits) │
                     ◆ 1..*         └────▲────▲────▲────┘
                  ┌──────┴──────┐    Equal│Exact│Percent
                  │   Expense   │         Split│Split│Split
                  ├─────────────┤
                  │ - amount    │   ┌──────────────────┐
                  │ - paidBy    │◆─▶│     Split        │
                  │ - splits    │   ├──────────────────┤
                  │ - type      │   │ - user; amount   │
                  └─────────────┘   └──▲────▲────▲──────┘
   enum SplitType{EQUAL,EXACT,PERCENT}  Equal Exact Percent
   «Observer» Notifier ◁── on addExpense / balance change`,
        keyPoints: [
          'Entities: User, Group, Expense, Split hierarchy, BalanceSheet/ExpenseManager',
          'Strategy: EqualSplit/ExactSplit/PercentSplit compute and validate shares',
          'Balance graph balances[A][B] netted on every expense',
          'Simplify debts: net each person, greedily match max creditor with max debtor',
          'Simplification minimizes number of transfers (~n-1), not total money',
          'Edges: cent rounding, exact must sum to total, percent must sum to 100',
        ],
        videos: [
          { label: 'Concept && Coding — Splitwise LLD', url: 'https://www.youtube.com/playlist?list=PL6W8uoQQ2c61X_9e6Net0WdYZidm7zooW' },
          { label: 'Engineering Digest — LLD playlist', url: 'https://www.youtube.com/@EngineeringDigest' },
        ],
        links: [
          { label: 'awesome-low-level-design — splitwise.md', url: 'https://github.com/ashishps1/awesome-low-level-design/blob/main/problems/splitwise.md' },
          { label: 'GeeksforGeeks — Design Splitwise (LLD)', url: 'https://www.geeksforgeeks.org/system-design/design-splitwise-system-design/' },
        ],
        interview: [
          { q: 'How do you simplify debts in Splitwise?', a: 'Compute each member net = paid - owed. Put creditors (positive) and debtors (negative) in two heaps; repeatedly settle min(|maxCredit|, |maxDebt|) between the two extremes. This drives transfers toward n-1 instead of O(n^2) pairwise IOUs.' },
          { q: 'Why the Strategy pattern for splits?', a: 'Each split type computes shares differently and has its own validation; SplitStrategy lets us add a new type (e.g. share-based) without touching addExpense, and each strategy self-validates.' },
          { q: 'How do you handle the leftover cent on an equal split?', a: 'Divide floor(total/n) to everyone, then distribute the remaining pennies one-by-one deterministically (e.g. to the first k members) so the shares sum exactly to the total.' },
          { q: 'How are balances stored and updated?', a: 'A nested map balances[A][B] = amount A owes B. On each expense, for every ower add their share to balances[ower][payer] and net it against balances[payer][ower].' },
          { q: 'Does simplification reduce how much people pay?', a: 'No — total money owed is unchanged; it only reduces the number of transactions needed to settle, which is the usual interview point.' },
          { q: 'How would you support multiple currencies?', a: 'Store each expense in its native currency and normalize to a base via a CurrencyConversionStrategy before updating the balance graph; display can convert back.' },
        ],
      },
    ],
  },

  {
    focus: 'Design: Vending Machine + Tic-Tac-Toe',
    concepts: [
      {
        id: 'lld-vending-machine',
        topic: 'Design Vending Machine — State pattern showcase',
        summary: 'Idle/HasMoney/Dispensing states drive a clean coin-and-product flow.',
        explanation: 'Scope: user inserts coins, selects a product, machine dispenses and returns change; it tracks inventory and refuses out-of-stock or underpaid selections. Clarify accepted denominations, whether it makes change, and refund on cancel. This problem exists to showcase the State pattern.\n\nCore entities: VendingMachine (the context) holds the current VendingState, an Inventory, accumulated balance, and the selected product. Product/ItemShelf (code, price, quantity). Coin/Note enum for denominations. The states encapsulate behavior: IdleState (waiting), HasMoneyState (coins inserted), DispensingState (vending), and optionally OutOfStockState.\n\nRelationships: VendingMachine has-a VendingState (swapped on transitions) and aggregates Inventory which holds many ItemShelf. Each state holds a back-reference to the machine to read/mutate balance and trigger transitions.\n\nPattern: State is the star. The machine delegates every action — insertCoin(), selectProduct(), dispense(), refund() — to its current state, which performs the action and decides the next state. This replaces a tangled enum + switch where each method checks the current mode. Transitions: Idle --insertCoin--> HasMoney --selectProduct(funds ok)--> Dispensing --dispense--> Idle; insufficient funds stays in HasMoney; refund returns to Idle. Strategy can plug a change-making algorithm; Singleton if one physical machine.\n\nKey APIs (all on the machine, delegated to state): insertCoin(coin); selectProduct(code); dispenseProduct(); refund(); and internally setState(state). Illegal actions (selecting before paying, inserting coins mid-dispense) are rejected by the current state, which is the whole point.\n\nConcurrency/edge cases: insufficient funds (stay, prompt for more), out of stock (reject + refund), exact-change-only when the machine cannot make change, simultaneous button presses (the machine is effectively single-session; guard the context), and power loss mid-dispense (persist state). Extensions: card payments (new flow in HasMoney), product restock admin mode (new state), and a change-making Strategy — each is a new state or strategy without rewriting the flow.',
        diagram: `   ┌──────────────────────────────────────────────────┐
   │            VendingMachine «Context»                │
   ├──────────────────────────────────────────────────┤
   │ - state: VendingState                              │
   │ - inventory: Inventory                             │
   │ - balance: int   - selected: ItemShelf            │
   ├──────────────────────────────────────────────────┤
   │ + insertCoin(c)   + selectProduct(code)            │
   │ + dispense()      + refund()   + setState(s)       │
   └───────────────┬───────────────────┬────────────────┘
                ▷ has-a              ◆ has-a
   ┌────────────────┴───────┐   ┌───────┴─────────────┐
   │ «interface»            │   │     Inventory       │
   │ VendingState           │   ├─────────────────────┤
   ├────────────────────────┤   │ - shelves: List     │
   │ + insertCoin(c)        │   │ + get(code)         │
   │ + selectProduct(code)  │   │ + reduce(code)      │
   │ + dispense()           │   └──────────┬──────────┘
   │ + refund()             │           ◆ 1..*
   └──▲──────▲──────▲───────┘      ┌───────┴─────────┐
  Idle │HasMoney│Dispensing│OutOf  │   ItemShelf     │
  State│ State  │ State    │Stock  │ code;price;qty  │
                                   └─────────────────┘
   transitions:
   Idle ─insertCoin─► HasMoney ─select(ok)─► Dispensing
   Dispensing ─dispense─► Idle ;  refund ─► Idle
   enum Coin{ONE,TWO,FIVE,TEN}`,
        keyPoints: [
          'Context: VendingMachine; State interface with Idle/HasMoney/Dispensing/OutOfStock',
          'Every action delegates to the current state, which decides the next state',
          'State pattern replaces a giant mode switch and makes illegal actions impossible',
          'Strategy for change-making; Singleton if one physical machine',
          'Edges: insufficient funds, out of stock, exact-change-only, power loss',
        ],
        videos: [
          { label: 'Concept && Coding — Vending Machine (State)', url: 'https://www.youtube.com/playlist?list=PL6W8uoQQ2c61X_9e6Net0WdYZidm7zooW' },
          { label: 'sudocode — Vending Machine LLD', url: 'https://www.youtube.com/c/sudoCODE' },
        ],
        links: [
          { label: 'awesome-low-level-design — vending-machine.md', url: 'https://github.com/ashishps1/awesome-low-level-design/blob/main/problems/vending-machine.md' },
          { label: 'Refactoring Guru — State pattern', url: 'https://refactoring.guru/design-patterns/state' },
        ],
        interview: [
          { q: 'Why the State pattern over an enum + switch?', a: 'Each state owns its own behavior and legal transitions, so insertCoin/selectProduct/dispense do the right thing per state and illegal actions are rejected locally — no sprawling switch that must be edited for every new mode.' },
          { q: 'Walk the transitions for a successful purchase.', a: 'Idle --insertCoin--> HasMoney; selectProduct with sufficient funds --> Dispensing; dispense returns the item plus change and --> Idle. Insufficient funds stays in HasMoney; refund returns to Idle.' },
          { q: 'How do you handle out-of-stock?', a: 'selectProduct checks Inventory; if zero, either reject and stay, or transition to OutOfStockState and refund the balance.' },
          { q: 'How do you make change?', a: 'A ChangeStrategy (e.g. greedy by denomination, or DP for exact change) computes coins to return; if it cannot, signal exact-change-only and refuse or refund.' },
          { q: 'How would you add card payment?', a: 'Extend HasMoneyState (or add a CardPaymentState) to accept an authorized charge as balance; the dispense flow is unchanged.' },
        ],
      },
      {
        id: 'lld-tic-tac-toe',
        topic: 'Design Tic-Tac-Toe — extensible board & win rules',
        summary: 'N x N board, players, turn loop, Strategy for win-checking.',
        explanation: 'Scope: two players alternate marking cells on a 3x3 (generalize to N x N) board; detect win (row/col/diagonal) or draw. Clarify board size, number of players/symbols, and whether to support pluggable win rules (k-in-a-row). Designing for N x N from the start shows extensibility.\n\nCore entities: Game (the controller) owns the Board, the list of Players, and the turn pointer. Board holds an N x N grid of Cell (each Cell empty or holding a Piece/Symbol). Player has a name and a PlayingPiece (symbol X/O, extensible to more). A GameStatus enum (IN_PROGRESS, WIN, DRAW). A WinningStrategy checks for a win after each move.\n\nRelationships: Game aggregates Board and 1..* Player; Board composes N x N Cell; Player has-a PlayingPiece. The Game uses a WinningStrategy.\n\nPatterns: Strategy for win-checking — a RowColDiagonalStrategy for classic rules, or a KInARowStrategy for Gomoku-style; this isolates win logic so new rules drop in without touching the turn loop. Factory can create PlayingPiece by symbol. A simple Observer can broadcast moves. Keep the move loop tiny and push complexity into the board and strategy.\n\nKey APIs: Game.play() runs the loop; makeMove(player, row, col) validates the cell is in-bounds and empty, places the piece, then asks WinningStrategy.checkWin(board, lastMove) -> bool; isDraw() when the board is full with no winner. An efficient win-check tracks per-row, per-col, and two diagonal running counts so each move is O(1) instead of O(N) scanning.\n\nEdge cases: out-of-bounds or occupied cell (reject, replay turn), draw detection, more than two players (rotate the turn pointer over the player list), and very large N (use the O(1) counter trick). Extensions: N x N + k-in-a-row (new strategy), more players/symbols (factory), undo (keep a move stack), and AI opponent (a strategy that picks the next move). The win rule being a Strategy is what makes the design extensible.',
        diagram: `   ┌──────────────────────────────────────────────────┐
   │                 Game «Controller»                  │
   ├──────────────────────────────────────────────────┤
   │ - board: Board                                     │
   │ - players: Deque<Player>                           │
   │ - status: GameStatus                               │
   │ - winStrategy: WinningStrategy                     │
   ├──────────────────────────────────────────────────┤
   │ + play()   + makeMove(player,row,col)              │
   └────┬───────────────┬──────────────────┬───────────┘
     ◆ board          ◆ 1..*             ▷ uses
   ┌────┴─────┐   ┌──────┴──────┐   ┌───────┴──────────┐
   │  Board   │   │   Player    │   │ «interface»      │
   ├──────────┤   ├─────────────┤   │ WinningStrategy  │
   │ - size:N │   │ - name      │   ├──────────────────┤
   │ - grid   │   │ - piece     │   │ + checkWin(board,│
   ├──────────┤   └──────┬──────┘   │   lastMove): bool│
   │ + place()│       ▷ has-a       └────▲────▲─────────┘
   │ + isFull()│  ┌──────┴──────┐    RowCol│  KInARow
   └────┬─────┘   │ PlayingPiece│    Diag   │  Strategy
    ◆ NxN         │ - symbol    │
   ┌────┴─────┐   └─────────────┘  «Factory» PieceFactory
   │  Cell    │                     + create(symbol)
   │ - piece? │   enum Symbol{X,O,...}
   └──────────┘   enum GameStatus{IN_PROGRESS,WIN,DRAW}`,
        keyPoints: [
          'Entities: Game, Board (N x N of Cell), Player, PlayingPiece, WinningStrategy',
          'Strategy isolates win rules (row/col/diag vs k-in-a-row) from the turn loop',
          'O(1) win check via per-row/col/diagonal running counts per move',
          'Generalize to N x N and >2 players via a rotating turn deque',
          'Factory for pieces/symbols; Observer optional for move broadcast',
        ],
        videos: [
          { label: 'Concept && Coding — Tic Tac Toe LLD', url: 'https://www.youtube.com/playlist?list=PL6W8uoQQ2c61X_9e6Net0WdYZidm7zooW' },
          { label: 'sudocode — Tic Tac Toe design', url: 'https://www.youtube.com/c/sudoCODE' },
        ],
        links: [
          { label: 'awesome-low-level-design — tic-tac-toe.md', url: 'https://github.com/ashishps1/awesome-low-level-design/blob/main/problems/tic-tac-toe.md' },
          { label: 'GeeksforGeeks — Design Tic-Tac-Toe (LLD)', url: 'https://www.geeksforgeeks.org/system-design/design-tic-tac-toe-game-or-design-an-online-game-of-tic-tac-toe/' },
        ],
        interview: [
          { q: 'How would you generalize 3x3 to N x N with k-in-a-row?', a: 'Parameterize the board by N and inject a KInARowStrategy; the turn loop and board are unchanged because win logic lives entirely in the WinningStrategy.' },
          { q: 'How do you check a win in O(1) per move?', a: 'Maintain running counts per row, per column, and the two diagonals for the current player; after a move, if any count hits N (or k), it is a win — no full-board scan.' },
          { q: 'How do you support more than two players?', a: 'Hold players in a rotating deque and cycle the turn pointer; each has a distinct PlayingPiece symbol built by the factory.' },
          { q: 'Where does an AI opponent fit?', a: 'As a MoveStrategy a player uses to choose its cell (e.g. minimax); the Game loop just calls player.nextMove(board), human or AI alike.' },
          { q: 'How do you handle an invalid move?', a: 'makeMove validates in-bounds and that the cell is empty; on failure it rejects and the same player replays the turn — the turn pointer only advances on a valid move.' },
        ],
      },
    ],
  },

  {
    focus: 'Design: Logging Framework + Rate Limiter',
    concepts: [
      {
        id: 'lld-logger',
        topic: 'Design Logging Framework — levels, appenders & chain',
        summary: 'Levels via Chain of Responsibility, pluggable appenders, Singleton logger.',
        explanation: 'Scope: a library where code logs messages at levels (DEBUG, INFO, WARN, ERROR), each level routed to one or more destinations (console, file, DB), with a configurable threshold so lower levels are filtered. Clarify thread-safety, async logging, and formatting. This is the canonical Chain of Responsibility + Singleton problem.\n\nCore entities: Logger (the API surface, usually a Singleton or per-class instance) exposes debug/info/warn/error. LogLevel enum with an ordering. A chain of LogProcessor / LogHandler links — DebugHandler -> InfoHandler -> WarnHandler -> ErrorHandler — each deciding whether the message is at its level and passing the rest down the chain. LogMessage (level, text, timestamp, thread). Appender/Sink (ConsoleAppender, FileAppender, DBAppender) actually write, fronted by a LogFormatter.\n\nRelationships: Logger has-a head LogProcessor; each LogProcessor has a next LogProcessor (the chain) and writes via one or more Appenders; each Appender has-a Formatter.\n\nPatterns: Chain of Responsibility routes a message to the handler matching its level (and threshold filtering), so adding a level or changing routing means editing the chain, not the logger. Singleton gives one global logger with shared config. Strategy/Factory for Appenders and Formatters (swap console/file/JSON). Optionally Observer for async fan-out to multiple sinks and a Decorator for adding context to messages.\n\nKey APIs: Logger.getInstance(); logger.log(level, message) which builds a LogMessage and hands it to the chain head; LogProcessor.handle(message) (if level matches and >= threshold, write; then next.handle(message)); Appender.append(formatted). The threshold check lives in the handler so a single config var silences DEBUG in prod.\n\nConcurrency/edge cases: concurrent log() calls (appenders must be thread-safe — synchronize the write or use a lock-free queue), file rotation/size limits, async logging via a bounded queue + worker (drop or block when full), formatting failures, and ordering guarantees. Extensions: new sinks (Kafka, cloud) as new Appenders, structured/JSON logging via a Formatter strategy, sampling, and per-module loggers — all additive thanks to the chain + strategy structure.',
        diagram: `   ┌──────────────────────────────────────────────────┐
   │              Logger «Singleton»                    │
   ├──────────────────────────────────────────────────┤
   │ - chain: LogProcessor                              │
   │ - threshold: LogLevel                              │
   ├──────────────────────────────────────────────────┤
   │ + getInstance()                                    │
   │ + debug/info/warn/error(msg)                       │
   │ + log(level, msg)                                  │
   └───────────────────────┬────────────────────────────┘
                       ◆ head
   ┌───────────────────────┴────────────────────────────┐
   │ «abstract» LogProcessor   (Chain of Responsibility) │
   ├────────────────────────────────────────────────────┤
   │ - next: LogProcessor                                │
   │ - level: LogLevel                                   │
   ├────────────────────────────────────────────────────┤
   │ + handle(msg)  // if match: write; then next.handle │
   └──▲──────▲──────▲──────▲────────────────────────────┘
  Debug │Info │Warn │Error    each ─writes via─►
  Hndlr │Hndlr│Hndlr│Hndlr  ┌──────────────────────┐
   ─►nextnextnext──┘         │ «interface» Appender │
                            ├──────────────────────┤
   ┌──────────────────┐     │ + append(formatted)  │
   │   LogMessage     │     └───▲────▲────▲─────────┘
   │ level;text;ts;thr│   Console│File │ DB
   └──────────────────┘     each ◆ has-a Formatter
   enum LogLevel{DEBUG<INFO<WARN<ERROR}`,
        keyPoints: [
          'Chain of Responsibility routes a message to the handler matching its level',
          'Singleton logger with a configurable threshold filters low levels',
          'Appenders (console/file/DB) as Strategy/Factory; each has a Formatter',
          'Thread-safe appends; optional async via bounded queue + worker',
          'Extend: new sinks/levels/formatters are additive, no logger rewrite',
        ],
        videos: [
          { label: 'Concept && Coding — Logging system LLD', url: 'https://www.youtube.com/playlist?list=PL6W8uoQQ2c61X_9e6Net0WdYZidm7zooW' },
          { label: 'Engineering Digest — LLD playlist', url: 'https://www.youtube.com/@EngineeringDigest' },
        ],
        links: [
          { label: 'awesome-low-level-design — logging-system.md', url: 'https://github.com/ashishps1/awesome-low-level-design/blob/main/problems/logging-system.md' },
          { label: 'Refactoring Guru — Chain of Responsibility', url: 'https://refactoring.guru/design-patterns/chain-of-responsibility' },
        ],
        interview: [
          { q: 'Why Chain of Responsibility for log levels?', a: 'Each handler decides whether the message is at its level and otherwise passes it down the chain, so routing/filtering is decentralized and adding a level or sink means inserting a link, not editing one big method.' },
          { q: 'How does the threshold filter work?', a: 'Levels are ordered (DEBUG<INFO<WARN<ERROR); a handler writes only if message.level >= configured threshold, so flipping one config var silences DEBUG/INFO in production.' },
          { q: 'How do you make the logger thread-safe?', a: 'Synchronize the appender write (or use a concurrent queue), and for high throughput push messages to a bounded queue consumed by a single writer thread (async logging).' },
          { q: 'How would you add a new destination like Kafka?', a: 'Implement Appender.append for Kafka and register it on the relevant handler; no change to Logger or the chain logic.' },
          { q: 'How do you support structured/JSON logs?', a: 'Swap the Formatter strategy on the appender; the same LogMessage is rendered as JSON or plain text without touching the routing.' },
          { q: 'What are the trade-offs of async logging?', a: 'Lower caller latency and decoupled I/O, but risk of losing buffered logs on crash and back-pressure when the queue fills — choose drop vs block per criticality.' },
        ],
      },
      {
        id: 'lld-rate-limiter',
        topic: 'Design Rate Limiter — token/leaky bucket & sliding window',
        summary: 'Pluggable algorithms (token bucket, leaky bucket, sliding window) via Strategy.',
        explanation: 'Scope: limit how many requests a client (by key/userId/IP) may make per time window, returning allow/deny. Clarify the limit (e.g. 100 req/min), per-key granularity, distributed vs single-node, and whether bursts are allowed. The design hinges on the algorithm, so make it a Strategy.\n\nCore entities: RateLimiter (facade) holds per-key state and a RateLimitStrategy; allowRequest(key) -> bool is the one public method. RateLimitStrategy is the interface with implementations: TokenBucket (capacity + refill rate; allow if a token is available, refill lazily by elapsed time — permits bursts up to capacity), LeakyBucket (a queue draining at fixed rate; smooths output, rejects on overflow), FixedWindowCounter (count per fixed window; simple but bursty at boundaries), and SlidingWindowLog / SlidingWindowCounter (timestamps or weighted counts across the rolling window; accurate, more memory).\n\nRelationships: RateLimiter aggregates per-key strategy state (a Map<key, BucketState>); the strategy reads/mutates that state. In distributed mode the state lives in Redis (atomic INCR/EXPIRE or a Lua script) instead of memory.\n\nPatterns: Strategy to swap algorithms without changing callers — the whole point. Factory to build the configured strategy. Singleton for a shared limiter. The clean separation lets you A/B algorithms or per-route policies.\n\nKey APIs: allowRequest(key): boolean (and optionally getRetryAfter(key)). Token bucket: tokens = min(capacity, tokens + elapsed * refillRate); if tokens >= 1, tokens-- and allow, else deny. Sliding window log: drop timestamps older than window, if count < limit record now and allow.\n\nConcurrency/edge cases: concurrent requests for the same key must update the bucket atomically (per-key lock or atomic ops; in Redis a Lua script makes check-and-decrement atomic), clock skew (use server time), memory growth for many keys (TTL/evict idle buckets), and thundering herd at window edges (sliding window mitigates the fixed-window burst). Extensions: per-tier limits (free vs premium), distributed coordination via Redis, and graceful degradation. Token bucket is the common default for allowing controlled bursts; sliding window when accuracy matters.',
        diagram: `   ┌──────────────────────────────────────────────────┐
   │            RateLimiter «Singleton» (Facade)        │
   ├──────────────────────────────────────────────────┤
   │ - strategy: RateLimitStrategy                      │
   │ - state: Map<key, BucketState>                     │
   ├──────────────────────────────────────────────────┤
   │ + allowRequest(key): bool                          │
   │ + getRetryAfter(key): long                         │
   └───────────────────────┬────────────────────────────┘
                       ▷ uses
   ┌───────────────────────┴────────────────────────────┐
   │ «interface» RateLimitStrategy                       │
   ├────────────────────────────────────────────────────┤
   │ + allow(key, state, now): bool                      │
   └──▲────────▲────────────▲────────────▲───────────────┘
      │        │            │            │
  ┌───┴───┐┌───┴────┐ ┌─────┴──────┐┌────┴──────────┐
  │ Token ││ Leaky  │ │  Fixed     ││  Sliding      │
  │ Bucket││ Bucket │ │  Window    ││  Window       │
  ├───────┤├────────┤ ├────────────┤├───────────────┤
  │cap;   ││queue;  │ │count;      ││timestamps[] / │
  │refill ││drainRt │ │windowStart ││weightedCount  │
  └───────┘└────────┘ └────────────┘└───────────────┘
   ┌──────────────────────┐
   │   BucketState        │  «Factory» StrategyFactory
   │ tokens; lastRefillTs │   + create(type, cfg)
   └──────────────────────┘`,
        keyPoints: [
          'Single API allowRequest(key); algorithm hidden behind RateLimitStrategy',
          'Token bucket allows bursts; leaky bucket smooths; sliding window is accurate',
          'Fixed window is simple but bursts at boundaries — sliding window fixes it',
          'Per-key state updated atomically (per-key lock, or Redis Lua for distributed)',
          'Edges: clock skew, idle-key eviction/TTL, thundering herd at window edges',
        ],
        videos: [
          { label: 'Gaurav Sen — Rate limiter / system design', url: 'https://www.youtube.com/@gkcs' },
          { label: 'Concept && Coding — Rate Limiter LLD', url: 'https://www.youtube.com/playlist?list=PL6W8uoQQ2c61X_9e6Net0WdYZidm7zooW' },
        ],
        links: [
          { label: 'awesome-low-level-design — README (problems list)', url: 'https://github.com/ashishps1/awesome-low-level-design/blob/main/README.md' },
          { label: 'GeeksforGeeks — Rate limiter design', url: 'https://www.geeksforgeeks.org/system-design/rate-limiting-in-system-design/' },
        ],
        interview: [
          { q: 'Token bucket vs leaky bucket vs sliding window — when each?', a: 'Token bucket when controlled bursts are fine (default). Leaky bucket when you need a smooth, constant output rate. Sliding window when you need accurate per-window counts without the fixed-window boundary burst.' },
          { q: 'What is the fixed-window boundary problem?', a: 'A client can send the full limit at the end of one window and again at the start of the next — up to 2x the limit across the boundary. Sliding window (log or weighted counter) eliminates this.' },
          { q: 'How do you make it work across multiple servers?', a: 'Centralize state in Redis and make check-and-decrement atomic with a Lua script (or INCR + EXPIRE); each node consults Redis so the limit is global, not per-node.' },
          { q: 'How do you handle concurrent requests for one key?', a: 'Update the bucket atomically — a per-key lock in-process, or atomic Redis ops/Lua in distributed mode — so two requests cannot both consume the last token.' },
          { q: 'How would you add per-tier limits?', a: 'Configure a strategy + capacity per tier and select by key metadata in the factory; free vs premium just map to different RateLimitStrategy configs.' },
          { q: 'How do you stop memory growing with many keys?', a: 'Attach a TTL to idle bucket entries (or LRU-evict them); in Redis use EXPIRE so untouched keys self-clean.' },
        ],
      },
    ],
  },

  {
    focus: 'Design: Notification System + LRU Cache',
    concepts: [
      {
        id: 'lld-notification-system',
        topic: 'Design Notification System — channels, Observer + Factory',
        summary: 'Multi-channel (email/SMS/push) dispatch via Observer + Factory + Strategy + retry.',
        explanation: 'Scope: send notifications to users over multiple channels (email, SMS, push), let users subscribe to event types, format per channel, and retry on failure. Clarify synchronous vs queued delivery, user preferences, templating, and idempotency. This is the canonical Observer + Factory + Strategy problem.\n\nCore entities: NotificationService (orchestrator) accepts a Notification (type, payload, recipients). Channel/NotificationChannel is the send abstraction with EmailChannel, SmsChannel, PushChannel implementations. A Subscriber/Observer (the user or a topic subscription) registers interest in event types. A ChannelFactory builds the right Channel; a MessageFormatter/template Strategy renders per channel; a RetryPolicy governs re-sends.\n\nRelationships: NotificationService maintains a Map<EventType, List<Observer>>; on an event it notifies each observer, which resolves the user preferred channels and dispatches via the Channel(s); each Channel uses a Formatter and a RetryPolicy.\n\nPatterns: Observer for pub/sub — subscribers register for event types and are notified on publish, decoupling producers from consumers. Factory to create Channel instances by type so adding a channel is one registration. Strategy for formatting/templating and for the retry/backoff policy. Optional Decorator to layer features (rate-limit, dedupe) and a Queue for async, reliable delivery.\n\nKey APIs: subscribe(eventType, observer); unsubscribe(...); notify(event) -> fan-out to observers; channel.send(message) -> DeliveryResult{SENT, FAILED, RETRYING}. On FAILED, the RetryPolicy (exponential backoff, max attempts) re-enqueues; after exhaustion it dead-letters.\n\nConcurrency/edge cases: a channel/provider being down (retry with backoff, circuit-break, fall back to another channel), duplicate sends (idempotency key per notification), partial multi-recipient failure (per-recipient status), respecting user quiet-hours/preferences, and rate limits per provider. Extensions: new channels (WhatsApp/Slack) via the factory, priority lanes, templating per locale, scheduled/digest notifications, and an async queue for scale — all additive because dispatch is event-driven and channel-pluggable.',
        diagram: `   ┌──────────────────────────────────────────────────┐
   │          NotificationService «Subject»             │
   ├──────────────────────────────────────────────────┤
   │ - subs: Map<EventType, List<Observer>>             │
   │ - factory: ChannelFactory                          │
   ├──────────────────────────────────────────────────┤
   │ + subscribe(type, obs)  + unsubscribe(...)         │
   │ + notify(event)                                    │
   └────┬───────────────────┬──────────────────┬────────┘
    ◆ observers          ▷ creates           ▷ uses
   ┌────┴──────────┐  ┌──────┴──────────┐ ┌────┴────────┐
   │ «interface»   │  │ ChannelFactory  │ │ RetryPolicy │
   │ Observer      │  │ «Factory»       │ │ (Strategy)  │
   ├───────────────┤  │ + create(type)  │ └─────────────┘
   │ + update(evt) │  └──────┬──────────┘
   └──────▲────────┘      ▷ builds
   UserSubscriber    ┌──────┴────────────────────┐
                     │ «interface»               │
   ┌──────────────┐  │ NotificationChannel       │
   │ Notification │  ├───────────────────────────┤
   │ type;payload │  │ + send(msg): DeliveryResult│
   │ recipients   │  └──▲────────▲────────▲───────┘
   └──────────────┘ Email │  Sms  │  Push  │
                     each ◆ has-a Formatter «Strategy»
   enum EventType{...}  enum DeliveryResult{SENT,FAILED,RETRYING}`,
        keyPoints: [
          'Observer: subscribers register per EventType; notify fans out on publish',
          'Factory builds Channel by type — new channel = one registration',
          'Strategy for per-channel formatting/templating and retry/backoff',
          'Retry with exponential backoff + max attempts, then dead-letter',
          'Edges: provider down (fallback/circuit-break), dedupe via idempotency key',
        ],
        videos: [
          { label: 'Concept && Coding — Notification system LLD', url: 'https://www.youtube.com/playlist?list=PL6W8uoQQ2c61X_9e6Net0WdYZidm7zooW' },
          { label: 'Engineering Digest — LLD playlist', url: 'https://www.youtube.com/@EngineeringDigest' },
        ],
        links: [
          { label: 'awesome-low-level-design — notification-system.md', url: 'https://github.com/ashishps1/awesome-low-level-design/blob/main/problems/notification-system.md' },
          { label: 'Refactoring Guru — Observer pattern', url: 'https://refactoring.guru/design-patterns/observer' },
        ],
        interview: [
          { q: 'Why Observer for a notification system?', a: 'Producers publish events without knowing who consumes them; subscribers register per event type and are notified on publish, so adding a consumer never touches the producer — clean pub/sub decoupling.' },
          { q: 'How do you add a new channel like WhatsApp?', a: 'Implement NotificationChannel.send for WhatsApp and register it in ChannelFactory; the service and observers are unchanged.' },
          { q: 'How do you handle a channel being down?', a: 'A RetryPolicy retries with exponential backoff up to a max, optionally a circuit breaker to stop hammering, and a fallback to another channel; exhausted messages go to a dead-letter queue.' },
          { q: 'How do you avoid sending duplicates?', a: 'Attach an idempotency key per notification; the channel/queue checks a seen-set so a retried or re-published event is sent once.' },
          { q: 'How do you respect user preferences/quiet hours?', a: 'The subscriber resolves the users channels and a do-not-disturb window before dispatch, so notifications are filtered/deferred per preference.' },
          { q: 'How would you scale delivery?', a: 'Push events onto a queue consumed by worker pools per channel; this decouples production from delivery, smooths spikes, and isolates slow providers.' },
        ],
      },
      {
        id: 'lld-lru-cache',
        topic: 'Design LRU Cache — HashMap + doubly linked list',
        summary: 'O(1) get/put via HashMap + DLL; generic cache with pluggable eviction.',
        explanation: 'Scope: a fixed-capacity cache with O(1) get(key) and put(key, value); when full, evict the least-recently-used entry. Clarify capacity, thread-safety, and whether eviction policy should be swappable. The classic answer is HashMap + doubly linked list.\n\nCore data structures: a HashMap<Key, Node> for O(1) lookup, and a doubly linked list of Node{key, value, prev, next} ordered by recency — most-recently-used at the head, least at the tail. The map points straight at the list node so we can unlink/move it in O(1).\n\nWhy a DLL specifically: on access we must move a node to the head; a doubly linked list lets us splice a node out in O(1) given its neighbors (no traversal). Dummy head and tail sentinels remove null-edge handling. A singly linked list cannot unlink in O(1) because you cannot reach the predecessor.\n\nOperations: get(key) — if absent return miss; else move that node to the head (mark MRU) and return its value. put(key, value) — if present, update value and move to head; else create a node, add at head, and put in the map; if size > capacity, remove the tail node (LRU) and delete its key from the map. Both are O(1): map lookup + constant pointer surgery.\n\nPatterns/extensibility: make it generic Cache<K,V> and pull eviction behind an EvictionStrategy (Strategy pattern) so LRU, LFU, or FIFO can swap without rewriting the store; the DLL is the LRU implementation detail. A Singleton or factory can hand out configured caches. A removal listener (Observer) can notify on eviction.\n\nConcurrency/edge cases: capacity of zero or one, updating an existing key (must reorder, not duplicate), and thread-safety — wrap get/put in a lock, or use a striped/segmented lock for throughput, or a concurrent structure (e.g. an access-ordered LinkedHashMap behind a lock, or a library like Caffeine that approximates LRU with sketches for less contention). The naive single global lock serializes everything; segment by key hash to scale. Extensions: TTL expiry (store an expiry per node, lazy-evict on access), size-based vs count-based eviction, and write-through/write-back to a backing store.',
        diagram: `   ┌──────────────────────────────────────────────────┐
   │              LRUCache<K,V>                          │
   ├──────────────────────────────────────────────────┤
   │ - capacity: int                                    │
   │ - map: HashMap<K, Node>                            │
   │ - head: Node  (MRU sentinel)                       │
   │ - tail: Node  (LRU sentinel)                       │
   │ - eviction: EvictionStrategy                       │
   ├──────────────────────────────────────────────────┤
   │ + get(key): V        // move node -> head, O(1)    │
   │ + put(key, val)      // insert/update -> head      │
   │ - addFront(n)  - remove(n)  - evictLRU()           │
   └────┬───────────────────────────────┬───────────────┘
    ◆ map values                      ▷ uses
   ┌────┴───────────────┐    ┌──────────┴──────────────┐
   │      Node          │    │ «interface»             │
   ├────────────────────┤    │ EvictionStrategy        │
   │ - key: K           │    ├─────────────────────────┤
   │ - value: V         │    │ + evict(cache)          │
   │ - prev: Node ◄────┐ │    └────▲────▲────▲──────────┘
   │ - next: Node ───┐ │ │      LRU │ LFU │ FIFO
   └─────────────────┼─┼─┘
   Doubly Linked List (recency order):
   head ⇄ [MRU] ⇄ [..] ⇄ [..] ⇄ [LRU] ⇄ tail
            ▲ access moves here     ▲ evicted from here`,
        keyPoints: [
          'HashMap gives O(1) lookup; doubly linked list gives O(1) reorder/evict',
          'MRU at head, LRU at tail; dummy head/tail sentinels simplify edges',
          'get/put both move the touched node to the head; evict from the tail',
          'DLL (not SLL) needed so a node unlinks in O(1) via its prev/next',
          'EvictionStrategy makes LRU/LFU/FIFO pluggable; DLL is the LRU detail',
          'Thread-safe via a lock or segmented locks; LinkedHashMap is a shortcut',
        ],
        videos: [
          { label: 'Concept && Coding — LRU Cache LLD', url: 'https://www.youtube.com/playlist?list=PL6W8uoQQ2c61X_9e6Net0WdYZidm7zooW' },
          { label: 'sudocode — LRU Cache design', url: 'https://www.youtube.com/c/sudoCODE' },
        ],
        links: [
          { label: 'awesome-low-level-design — README (problems list)', url: 'https://github.com/ashishps1/awesome-low-level-design/blob/main/README.md' },
          { label: 'LeetCode — 146. LRU Cache', url: 'https://leetcode.com/problems/lru-cache/' },
        ],
        interview: [
          { q: 'Why HashMap + doubly linked list?', a: 'The HashMap gives O(1) key lookup straight to the node; the doubly linked list maintains recency order and lets you unlink/move any node in O(1) using its prev/next pointers. Together both get and put are O(1).' },
          { q: 'Why a doubly (not singly) linked list?', a: 'Eviction/move requires splicing a node out given only the node; a DLL has prev/next so you fix both neighbors in O(1). A singly linked list cannot reach the predecessor without O(n) traversal.' },
          { q: 'How do you make the LRU cache thread-safe?', a: 'Guard get/put with a lock; for throughput use segmented/striped locks by key hash so concurrent keys do not contend, or use a concurrency-friendly cache (e.g. Caffeine) that approximates LRU to reduce locking.' },
          { q: 'How would you support LFU or FIFO instead?', a: 'Put eviction behind an EvictionStrategy; LRU uses the DLL move-to-head, LFU uses frequency buckets, FIFO drops the oldest insert — the map/store stays the same.' },
          { q: 'How do you add TTL expiry?', a: 'Store an expiry timestamp per node; on get, treat expired nodes as misses and unlink them (lazy eviction), optionally with a background sweeper for proactive cleanup.' },
          { q: 'What edge cases do you test?', a: 'Capacity 0/1, updating an existing key (reorder not duplicate), evicting exactly at capacity+1, and get on a missing key — plus concurrent put/get under the chosen locking.' },
        ],
      },
    ],
  },
]
