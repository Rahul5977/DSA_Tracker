// DBMS theory — Part 1 (Days 1-6): foundations through normalization (1NF-3NF).
// Authored for SDE placement interview prep. Schema mirrors the theory modules
// consumed by ./index.js: each day = { focus, concepts: [...] }.

export const DAYS = [
  {
    focus: 'DBMS Intro & Architecture',
    concepts: [
      {
        id: 'dbms-what-is-dbms',
        topic: 'What a DBMS Is & DBMS vs File System',
        summary: 'A DBMS is software to store, manage, and query data efficiently, fixing the flaws of flat files.',
        explanation:
          'A database is an organized collection of related data, and a Database Management System (DBMS) is the software that lets you define, create, store, query, update, and administer that data. Examples are MySQL, PostgreSQL, Oracle, and SQL Server. The DBMS sits between the application and the raw stored bytes, exposing a clean interface (usually SQL) while internally handling storage layout, indexing, concurrency, and recovery.\n\nBefore DBMS, data was kept in flat files managed directly by application programs. This file-processing approach suffered from serious problems. Data redundancy: the same fact (a customer address, say) was copied into many files, wasting space and causing inconsistency when one copy was updated but others were not. Data isolation: data scattered across files in different formats was hard to fetch together. There was no easy enforcement of integrity constraints, no concurrent multi-user access control, no atomic transactions, and recovery after a crash was ad hoc.\n\nA DBMS solves these by centralizing data and its description. It minimizes redundancy through normalization and shared storage, enforces integrity constraints declaratively, and provides controlled concurrent access so many users can read and write safely at once. It supports transactions with the ACID guarantees, offers backup and recovery, and provides security through user accounts and privileges.\n\nThe key conceptual leap is data abstraction: applications ask for data in logical terms (give me all orders over 1000) without knowing how bytes are physically arranged on disk. The DBMS keeps a catalog (also called the data dictionary or metadata) describing the structure of the data separately from the data itself, so the structure can evolve without rewriting every program. This separation of structure from access is what makes a DBMS far more powerful and maintainable than a pile of files.',
        keyPoints: [
          'DBMS = software to define, store, query, and administer related data',
          'File systems cause redundancy, inconsistency, and poor concurrency/recovery',
          'DBMS gives integrity enforcement, transactions (ACID), security, and backup',
          'Data abstraction lets apps query logically without knowing physical storage',
          'Metadata (data dictionary) describes structure separately from the data',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/dbms/introduction-of-dbms-database-management-system-set-1/' },
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/difference-between-file-system-and-dbms/' },
        ],
        interview: [
          { q: 'What is a DBMS?', a: 'A DBMS is software that lets you create, store, manage, query, and control access to a database. It provides an abstraction over physical storage and handles concurrency, integrity, security, and recovery so applications can work with data logically through an interface like SQL.' },
          { q: 'What are the main advantages of a DBMS over a file system?', a: 'It reduces data redundancy and inconsistency, enforces integrity constraints, supports concurrent multi-user access, provides ACID transactions, offers backup and recovery, and improves security and data sharing. A plain file system offers none of these out of the box.' },
          { q: 'What is data redundancy and why is it a problem?', a: 'Data redundancy means storing the same fact in multiple places. It wastes storage and, more importantly, leads to inconsistency when one copy is updated but the others are not, so different parts of the system disagree on the truth.' },
          { q: 'What is metadata in a DBMS?', a: 'Metadata is data about the data, such as table names, column types, constraints, indexes, and user privileges. It is stored in the system catalog or data dictionary and lets the DBMS interpret and manage the actual stored data.' },
          { q: 'Name some real-world DBMS products.', a: 'Relational ones include MySQL, PostgreSQL, Oracle Database, Microsoft SQL Server, and SQLite. NoSQL examples include MongoDB, Cassandra, and Redis.' },
          { q: 'What is the difference between data and information?', a: 'Data is raw, unprocessed facts and figures (e.g., 25, Mumbai). Information is data that has been processed and given context so it is meaningful (e.g., the average customer age is 25). A DBMS stores data and supports queries that turn it into information.' },
        ],
      },
      {
        id: 'dbms-three-schema-architecture',
        topic: 'Data Abstraction & Three-Schema Architecture',
        summary: 'The ANSI/SPARC three levels — physical, logical, and view — hide complexity at each layer.',
        explanation:
          'Data abstraction is the practice of hiding low-level storage details from users so they can work with data at a comfortable conceptual level. The ANSI/SPARC three-schema (three-level) architecture formalizes this into three layers: the internal (physical) level, the conceptual (logical) level, and the external (view) level. Each level describes the database at a different degree of abstraction, and mappings connect them.\n\nThe internal level (physical schema) is the lowest level. It describes how data is actually stored: file organization, data structures, indexes, compression, and placement on disk. It answers how the data is stored. The conceptual level (logical schema) is the middle level. It describes what data is stored and the relationships among the data for the whole database community: tables, columns, data types, and constraints, without any storage detail. There is exactly one conceptual schema for a database.\n\nThe external level (view level) is the highest level and closest to users. It consists of many user views, each presenting only the portion of the database relevant to a particular user or application, possibly restructured or restricted for security. For example, a payroll clerk sees salary fields while a receptionist sees only names and phone numbers, both drawn from the same conceptual schema.\n\nThis layering delivers two big benefits. First, simplicity: most users never deal with physical details. Second, and more importantly, it enables data independence. Because views map to the conceptual schema and the conceptual schema maps to the physical schema, you can change one level without rewriting the levels above it. The classic interview example: a payroll application sees a logical Employee record while the DBA may store it across several physical files with various indexes; the application neither knows nor cares.',
        keyPoints: [
          'Three levels: internal/physical, conceptual/logical, external/view',
          'Physical schema = how data is stored (files, indexes, layout)',
          'Logical schema = what is stored and relationships; exactly one per database',
          'View level = multiple user-specific, possibly restricted, presentations',
          'Mappings between levels enable data independence and hide complexity',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/dbms/dbms-three-schema-architecture/' },
        ],
        interview: [
          { q: 'What is data abstraction in a DBMS?', a: 'It is hiding the complexity of how data is stored and presenting it at a level appropriate to the user. The three-schema architecture provides physical, logical, and view levels of abstraction so each user works at the right amount of detail.' },
          { q: 'Explain the three-schema architecture.', a: 'It has the internal/physical level (how data is stored on disk), the conceptual/logical level (what data and relationships exist, one per database), and the external/view level (multiple tailored user views). Mappings between the levels let each layer change independently.' },
          { q: 'What is the difference between physical and logical schema?', a: 'The physical schema describes storage details like file structures and indexes, answering how data is stored. The logical schema describes tables, columns, types, and constraints, answering what data is stored and how it relates, with no storage detail.' },
          { q: 'Why do we need the external (view) level?', a: 'It customizes and restricts what each user sees, improving simplicity and security. Different users get views suited to their role from the same underlying conceptual schema, without exposing the whole database.' },
          { q: 'How many conceptual schemas can a database have?', a: 'Exactly one. The conceptual schema is the single, community-wide logical description of the entire database, whereas there can be many external views and one internal schema.' },
        ],
      },
      {
        id: 'dbms-data-independence',
        topic: 'Data Independence (Physical vs Logical)',
        summary: 'The ability to change a schema at one level without altering the level above it.',
        explanation:
          'Data independence is the capacity to change the schema at one level of the database system without having to change the schema at the next higher level, and crucially without rewriting application programs. It is the practical payoff of the three-schema architecture and a very common interview topic. There are two kinds: physical data independence and logical data independence.\n\nPhysical data independence is the ability to change the internal (physical) schema without changing the conceptual schema. For instance, you can add an index, switch the file organization from heap to clustered, partition a table across disks, or compress data, and none of the logical table definitions or application queries need to change. Physical data independence is relatively easy to achieve because the physical level is well separated from the logical level.\n\nLogical data independence is the ability to change the conceptual (logical) schema without changing the external schemas or application programs that use them. Examples include adding a new column or a new table, or splitting one table into two, while existing views and applications continue to work unchanged via the view-to-conceptual mapping. Logical data independence is harder to achieve because applications usually depend heavily on the logical structure they query, so changes there are more likely to ripple upward.\n\nThe rule of thumb to remember for interviews: physical independence is easier than logical independence, because the higher the level you change, the more programs tend to depend on it. Both forms reduce maintenance cost and let the database evolve gracefully as requirements and hardware change.',
        keyPoints: [
          'Data independence = change one schema level without changing the level above',
          'Physical independence: change storage (indexes, file org) without touching logical schema',
          'Logical independence: change logical schema (add column/table) without touching views/apps',
          'Logical independence is harder to achieve than physical independence',
          'It is the main practical benefit of the three-schema architecture',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/dbms/data-independence-in-dbms/' },
        ],
        interview: [
          { q: 'What is data independence?', a: 'It is the ability to modify the schema at one level of the architecture without requiring changes to the schema at the next higher level or to the application programs. It comes in two forms: physical and logical data independence.' },
          { q: 'What is the difference between physical and logical data independence?', a: 'Physical data independence means changing the physical/storage schema (indexes, file layout) without altering the logical schema. Logical data independence means changing the logical schema (adding columns or tables) without altering the external views or applications.' },
          { q: 'Which type of data independence is harder to achieve and why?', a: 'Logical data independence is harder, because application programs and views are tightly coupled to the logical structure they query. Changing it tends to affect those programs, whereas physical changes are well isolated from the logical level.' },
          { q: 'Give an example of physical data independence.', a: 'Adding an index to speed up a query, or changing a table from a heap to a B-tree clustered organization. Queries and table definitions stay the same; only performance changes.' },
          { q: 'Give an example of logical data independence.', a: 'Adding a new attribute (column) to a table or splitting a table into two, while existing views and applications that do not use the new structure keep working unchanged through the view mapping.' },
        ],
      },
      {
        id: 'dbms-schema-instance-users',
        topic: 'Schema vs Instance, Database Users & DBA',
        summary: 'Schema is the design; instance is the data at a moment. Many user roles exist, led by the DBA.',
        explanation:
          'A database schema is the overall logical design or structure of the database. It describes the tables, the columns and their data types, the relationships, and the constraints. The schema is defined once and changes only rarely; it is like the blueprint of a building. By contrast, a database instance (or database state) is the actual data stored in the database at a particular moment in time. As rows are inserted, updated, and deleted, the instance changes constantly while the schema stays fixed. The classic analogy: schema is to instance as a program is to its variables during one run, or as a class is to an object.\n\nA DBMS serves many categories of users. Naive or end users interact through applications and forms (a bank teller using a banking app) without writing SQL. Application programmers write the programs that access the database through embedded SQL or APIs. Sophisticated users (analysts, data scientists) write ad hoc queries directly. Specialized users build complex, domain-specific applications such as CAD or expert systems.\n\nThe most important role is the Database Administrator (DBA). The DBA has central control over both the data and the programs that access it. Responsibilities include defining and modifying the schema, defining storage structures and access methods, granting and revoking user authorizations and privileges, monitoring and tuning performance, and managing backup, recovery, and routine maintenance. The DBA holds the highest privileges in the system.\n\nUnderstanding this distinction matters because much of DBMS behavior revolves around it. Integrity constraints are part of the schema and apply to every instance; transactions move the database from one valid instance to another; and recovery is about restoring a consistent instance after a failure. Keeping schema and instance clearly separated is the foundation for reasoning about all of these.',
        keyPoints: [
          'Schema = logical design/structure (rarely changes), the blueprint',
          'Instance = the actual data at a given moment (changes constantly)',
          'Analogy: schema vs instance is like class vs object, or program vs variables',
          'User types: naive, application programmers, sophisticated, specialized',
          'DBA has central control: schema, authorizations, tuning, backup, and recovery',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/dbms/difference-between-database-schema-and-database-state/' },
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/dbms/types-of-users-in-dbms/' },
        ],
        interview: [
          { q: 'What is the difference between a schema and an instance?', a: 'A schema is the logical structure or design of the database (tables, columns, constraints) and changes rarely. An instance is the data stored at a particular moment and changes with every insert, update, or delete. Schema is the blueprint; instance is the current content.' },
          { q: 'Who is a DBA and what does a DBA do?', a: 'The Database Administrator has central control over the database. The DBA defines the schema and storage structures, grants and revokes privileges, tunes performance, and manages backup, recovery, and security. It is the most privileged role.' },
          { q: 'What are the different types of database users?', a: 'Naive/end users (use ready-made applications), application programmers (write programs using embedded SQL/APIs), sophisticated users (write ad hoc queries directly), and specialized users (build domain-specific applications like CAD).' },
          { q: 'Can the schema change while the database is running?', a: 'Yes, via DDL statements like ALTER TABLE, but schema changes are infrequent compared to data changes. Each schema change may require care so that existing data and applications remain valid.' },
          { q: 'Is a constraint part of the schema or the instance?', a: 'Constraints are part of the schema. They define the rules that every valid instance must satisfy, so they are enforced against all the data in the database.' },
        ],
      },
      {
        id: 'dbms-languages-acid-overview',
        topic: 'Database Languages (DDL/DML/DCL/TCL) & ACID at a Glance',
        summary: 'SQL splits into DDL, DML, DCL, and TCL; transactions follow the ACID properties.',
        explanation:
          'SQL statements are grouped by purpose into language sub-categories. DDL (Data Definition Language) defines and modifies the structure of database objects: CREATE, ALTER, DROP, TRUNCATE, and RENAME. DDL changes the schema and is typically auto-committed. DML (Data Manipulation Language) works with the data inside those structures: INSERT, UPDATE, DELETE, and (in most classifications) SELECT for retrieval. DML statements operate on instances, not the schema.\n\nDCL (Data Control Language) controls access rights and permissions: GRANT gives privileges to users and REVOKE takes them back. TCL (Transaction Control Language) manages transactions: COMMIT makes changes permanent, ROLLBACK undoes changes since the last commit, and SAVEPOINT sets an intermediate marker you can roll back to. Some texts treat SELECT as a separate DQL (Data Query Language) category. Knowing which command belongs to which category is a frequent quick-fire interview question.\n\nA transaction is a logical unit of work that must execute completely or not at all. The DBMS guarantees four properties, remembered as ACID. Atomicity: all operations in a transaction happen or none do; a partial transaction is rolled back. Consistency: a transaction takes the database from one valid state to another, preserving all integrity constraints. Isolation: concurrently running transactions do not interfere; the result is as if they ran in some serial order. Durability: once a transaction commits, its effects survive even a crash or power loss, because they are persisted (typically via a write-ahead log).\n\nThese ideas connect: TCL commands (COMMIT, ROLLBACK) are how applications drive atomicity and durability, while the DBMS engine enforces isolation through concurrency control and consistency through the constraints declared with DDL. Together the languages and the ACID guarantees define how data is structured, changed, secured, and kept reliable.',
        keyPoints: [
          'DDL: CREATE, ALTER, DROP, TRUNCATE, RENAME — defines schema',
          'DML: INSERT, UPDATE, DELETE, SELECT — manipulates data',
          'DCL: GRANT, REVOKE — controls privileges; TCL: COMMIT, ROLLBACK, SAVEPOINT',
          'A transaction is an all-or-nothing logical unit of work',
          'ACID: Atomicity, Consistency, Isolation, Durability',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/sql/sql-ddl-dml-dcl-tcl-commands/' },
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/dbms/acid-properties-in-dbms/' },
        ],
        interview: [
          { q: 'What is the difference between DDL and DML?', a: 'DDL defines or modifies the structure of database objects (CREATE, ALTER, DROP) and changes the schema. DML manipulates the data inside those objects (INSERT, UPDATE, DELETE, SELECT) and changes instances, not structure.' },
          { q: 'What are DCL and TCL commands?', a: 'DCL (Data Control Language) manages permissions with GRANT and REVOKE. TCL (Transaction Control Language) manages transactions with COMMIT, ROLLBACK, and SAVEPOINT.' },
          { q: 'What are the ACID properties?', a: 'Atomicity (all or nothing), Consistency (only valid states, preserving constraints), Isolation (concurrent transactions do not interfere), and Durability (committed changes survive failures). They guarantee reliable transaction processing.' },
          { q: 'What is the difference between DELETE, TRUNCATE, and DROP?', a: 'DELETE (DML) removes selected rows and can be rolled back and filtered with WHERE. TRUNCATE (DDL) quickly removes all rows and is typically not rollback-friendly. DROP (DDL) removes the entire table structure along with its data.' },
          { q: 'What is a transaction?', a: 'A transaction is a logical unit of work consisting of one or more operations that must execute as a single all-or-nothing unit. The DBMS ensures it satisfies the ACID properties.' },
          { q: 'Is SELECT a DDL or DML command?', a: 'SELECT is used to retrieve data and is commonly classified under DML, though some texts place it in a separate category called DQL (Data Query Language). It does not change the schema.' },
        ],
      },
    ],
  },
  {
    focus: 'ER Model & ER Diagrams',
    concepts: [
      {
        id: 'dbms-er-entities-attributes',
        topic: 'Entities, Entity Sets & Attributes',
        summary: 'Entities are real-world objects; attributes describe them and come in several flavours.',
        explanation:
          'The Entity-Relationship (ER) model is a high-level conceptual data model used to design databases before they are converted to tables. It represents the mini-world to be stored as a collection of entities and the relationships among them, drawn as an ER diagram. It is the most common tool for capturing requirements in interviews and real projects.\n\nAn entity is a real-world object or concept that is distinguishable from other objects, such as a particular student, employee, or course. An entity set (or entity type) is a collection of entities of the same kind, for example all Students; it corresponds roughly to a table, while an individual entity corresponds to a row. In ER diagrams an entity set is drawn as a rectangle.\n\nAttributes are the properties that describe an entity, drawn as ellipses connected to the entity. Attributes come in several types. A simple (atomic) attribute cannot be divided further (Age), whereas a composite attribute can be split into sub-parts (Name into FirstName and LastName, or Address into Street, City, Pincode). A single-valued attribute holds one value (DateOfBirth), while a multivalued attribute can hold several (PhoneNumbers), shown with a double ellipse. A derived attribute is computed from others and not stored, such as Age derived from DateOfBirth, shown with a dashed ellipse. Finally, a key attribute uniquely identifies each entity in the set (RollNumber) and is underlined.\n\nUnderstanding attribute types matters because they directly affect the table design. Composite attributes are usually flattened into separate columns; multivalued attributes cannot live in a single column under first normal form and are typically given their own separate table; and derived attributes are often not stored at all but computed on the fly. Getting this right at the ER stage prevents poor schemas later.',
        keyPoints: [
          'ER model is a high-level conceptual design tool, drawn as an ER diagram',
          'Entity = real-world object; entity set = collection of same-type entities (rectangle)',
          'Attributes (ellipses): simple vs composite, single vs multivalued',
          'Derived attribute = computed, not stored (dashed ellipse); key attribute is underlined',
          'Multivalued attributes need their own table; composite ones are split into columns',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/dbms/introduction-of-er-model/' },
        ],
        interview: [
          { q: 'What is the ER model?', a: 'The Entity-Relationship model is a high-level conceptual model that represents the data requirements of a system as entities, their attributes, and the relationships among them, usually drawn as an ER diagram. It is later converted into relational tables.' },
          { q: 'What is the difference between an entity and an entity set?', a: 'An entity is a single distinguishable real-world object, like one specific student. An entity set is the collection of all entities of the same type, like all students. An entity maps to a row and an entity set roughly to a table.' },
          { q: 'What are the types of attributes in the ER model?', a: 'Simple vs composite (divisible), single-valued vs multivalued, derived (computed, not stored) vs stored, and key attributes that uniquely identify an entity. They are drawn as ellipses, with special notations for multivalued, derived, and key attributes.' },
          { q: 'What is a derived attribute? Give an example.', a: 'A derived attribute is one whose value is computed from other attributes rather than stored, such as Age derived from DateOfBirth. It is shown with a dashed ellipse in an ER diagram.' },
          { q: 'How is a multivalued attribute handled when converting to tables?', a: 'Because a single column cannot hold multiple values under 1NF, a multivalued attribute is moved to a separate table that stores the entity key together with each value as its own row.' },
          { q: 'What is a composite attribute?', a: 'A composite attribute can be broken into smaller sub-attributes, such as Name into FirstName and LastName or Address into Street, City, and Pincode. It is usually flattened into multiple columns in the table.' },
        ],
      },
      {
        id: 'dbms-er-relationships-cardinality',
        topic: 'Relationships, Degree, Cardinality & Participation',
        summary: 'Relationships link entities; mapping cardinality (1:1, 1:N, M:N) and participation define the rules.',
        explanation:
          'A relationship is an association among two or more entities, such as a Student enrolls in a Course. A relationship set is a collection of relationships of the same type and is drawn as a diamond connecting the participating entity rectangles. Relationships can also carry their own descriptive attributes; for example the enrolls relationship might have a Grade attribute that belongs to neither the Student nor the Course alone.\n\nThe degree of a relationship is the number of entity sets that participate in it. A unary (recursive) relationship involves one entity set with itself (an Employee manages another Employee). A binary relationship involves two entity sets and is by far the most common. A ternary relationship involves three entity sets at once. Higher-degree relationships are rarer and harder to model.\n\nMapping cardinality (cardinality ratio) specifies how many entities of one set can be associated with entities of another through the relationship. One-to-one (1:1): each entity on each side relates to at most one on the other (a Person has one Passport). One-to-many (1:N): one entity on the first side relates to many on the second, but each of those relates back to only one (a Department has many Employees). Many-to-many (M:N): entities on both sides can relate to many on the other (Students and Courses). The cardinality directly determines how foreign keys or junction tables are placed when converting to a relational schema.\n\nParticipation constraints specify whether every entity must take part in the relationship. Total participation (drawn as a double line) means every entity in the set must participate; for instance every Loan must be associated with some Customer. Partial participation (a single line) means some entities may not participate; for instance not every Customer has a Loan. Together, cardinality and participation precisely capture the business rules and drive correct table design and null handling.',
        keyPoints: [
          'Relationship = association among entities (diamond); may have its own attributes',
          'Degree = number of participating entity sets: unary, binary, ternary',
          'Cardinality ratios: 1:1, 1:N, and M:N',
          'Total participation (double line) = every entity must participate; partial = may not',
          'Cardinality and participation drive foreign-key placement and null rules',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/dbms/introduction-of-er-model/' },
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/dbms/mapping-constraints-in-dbms/' },
        ],
        interview: [
          { q: 'What is a relationship in the ER model?', a: 'A relationship is an association among two or more entities, such as a Student enrolls in a Course. A relationship set groups relationships of the same type and is drawn as a diamond. Relationships may also have their own attributes.' },
          { q: 'What is the degree of a relationship?', a: 'It is the number of entity sets participating in the relationship: unary/recursive (one entity set with itself), binary (two), or ternary (three). Binary relationships are the most common.' },
          { q: 'What are the cardinality ratios?', a: 'One-to-one (1:1), one-to-many (1:N), and many-to-many (M:N). They specify how many entities of one set can be linked to entities of another through the relationship.' },
          { q: 'What is the difference between total and partial participation?', a: 'Total participation means every entity in the set must take part in the relationship (drawn as a double line), while partial participation means participation is optional and some entities may not be linked (a single line).' },
          { q: 'How does cardinality affect table design?', a: 'For 1:N you put the foreign key of the one side into the many side. For M:N you create a separate junction table with foreign keys to both sides. For 1:1 you can merge the tables or put a unique foreign key on either side.' },
          { q: 'Can a relationship have attributes?', a: 'Yes. Attributes that belong to the association rather than to a single entity are placed on the relationship, such as a Grade on the enrolls relationship between Student and Course, or a date on a works-on relationship.' },
        ],
      },
      {
        id: 'dbms-er-weak-entity-ehr',
        topic: 'Weak Entities, Generalization, Specialization & Aggregation',
        summary: 'Advanced ER constructs for identity-dependent entities and class hierarchies.',
        explanation:
          'A weak entity set is one that does not have enough attributes of its own to form a primary key; it depends on another (the strong or owner entity) for its identity. A weak entity is drawn as a double rectangle, and the relationship that connects it to its owner (the identifying relationship) is drawn as a double diamond. A weak entity has a partial key (or discriminator), drawn with a dashed underline, which distinguishes its instances only within the context of one owner. The full key of the weak entity is the owner key plus the partial key. Classic example: a Dependent of an Employee, where two employees might each have a dependent named John, so Dependent needs the Employee key plus the name to be uniquely identified. Weak entities always have total participation in the identifying relationship.\n\nGeneralization is a bottom-up abstraction in which common attributes of two or more lower-level entity sets are factored out into a higher-level entity set. For example, Car and Truck both have RegistrationNo and Color, so we generalize them into a Vehicle superclass. Specialization is the reverse, a top-down process: we take a higher-level entity set and split it into specialized lower-level sets based on distinguishing characteristics, for instance specializing Employee into Engineer and Manager. Both create an IS-A hierarchy drawn with a triangle, and subclasses inherit the attributes of the superclass.\n\nAggregation is a feature used when we need to express a relationship between a relationship set and an entity set, which the basic ER model cannot do directly. We treat an existing relationship (together with its participating entities) as a single higher-level abstract entity and then draw another relationship from it. The standard example: a Project worked on by an Employee using certain Machinery forms a works-on relationship, and a Manager supervises that whole works-on activity; aggregation lets the supervises relationship point at the works-on aggregate.\n\nThese constructs let the ER model capture richer real-world semantics. In interviews, the most frequently asked of the three is the weak entity, so be ready to explain identity dependence, the partial key, and the double-rectangle/double-diamond notation precisely.',
        keyPoints: [
          'Weak entity has no key of its own; depends on an owner (double rectangle)',
          'Identifying relationship = double diamond; partial key = dashed underline',
          'Weak entity key = owner primary key + partial key; total participation',
          'Generalization (bottom-up) and specialization (top-down) build IS-A hierarchies',
          'Aggregation models a relationship between a relationship set and an entity',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/dbms/generalization-specialization-and-aggregation-in-er-model/' },
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/dbms/weak-entity-set-in-er-diagrams/' },
        ],
        interview: [
          { q: 'What is a weak entity set?', a: 'A weak entity set lacks sufficient attributes to form its own primary key and depends on an owner (strong) entity for identification. It is drawn as a double rectangle and connected via an identifying relationship (double diamond), with a partial key shown by a dashed underline.' },
          { q: 'How is the primary key of a weak entity formed?', a: 'It is the combination of the owner entity primary key and the weak entity partial key (discriminator). The partial key alone only distinguishes weak entities within a single owner.' },
          { q: 'What is the difference between generalization and specialization?', a: 'Generalization is a bottom-up process that combines common features of several entity sets into a higher-level entity. Specialization is the top-down reverse, dividing a higher-level entity into specialized subclasses. Both produce an IS-A hierarchy.' },
          { q: 'What is aggregation in the ER model?', a: 'Aggregation treats a relationship set (along with its entities) as a single higher-level entity so it can participate in another relationship. It models situations the basic ER model cannot, such as a Manager supervising a works-on relationship between Employee and Project.' },
          { q: 'Does a weak entity have total or partial participation?', a: 'A weak entity always has total participation in its identifying relationship, because each weak entity must be associated with exactly one owner entity to exist and be identified.' },
          { q: 'What is an IS-A relationship?', a: 'It is the inheritance relationship created by generalization or specialization, where a subclass is a kind of the superclass and inherits its attributes, such as a Manager IS-A Employee. It is drawn with a triangle in the ER diagram.' },
        ],
      },
      {
        id: 'dbms-er-to-relational',
        topic: 'Converting ER Diagrams to Relational Tables',
        summary: 'Systematic rules to turn entity sets, attributes, and relationships into tables.',
        explanation:
          'Once an ER diagram captures the design, it is mapped to a relational schema using a small set of well-known rules; this conversion is a favourite interview exercise. The goal is to produce tables, columns, primary keys, and foreign keys that faithfully preserve the ER semantics.\n\nFor each strong entity set, create a table with a column for each simple attribute; composite attributes contribute one column per leaf sub-attribute, and the key attribute becomes the primary key. Derived attributes are normally not stored. For each multivalued attribute, create a separate table containing the primary key of the owner entity plus a column for the value, with both together forming the key. For each weak entity set, create a table that includes its own attributes plus the primary key of the owner entity as a foreign key; the primary key is the owner key combined with the weak entity partial key.\n\nRelationships are mapped according to their cardinality. For a 1:1 relationship, you can add the primary key of one side as a foreign key in the other (preferably on the side with total participation) or merge the two tables. For a 1:N relationship, place the primary key of the one side as a foreign key in the many side; any relationship attributes go into the many side too. For an M:N relationship, you must create a separate junction (associative) table whose primary key is the combination of the primary keys of both participating entities, and which also holds any relationship attributes.\n\nFor generalization and specialization there are a few strategies: create one table for the superclass and one per subclass (each subclass table holding the superclass key plus its own attributes), or fold everything into a single table with a type discriminator, or create only subclass tables when participation is total and disjoint. Following these rules mechanically yields a correct, normalized starting schema directly from the ER diagram.',
        keyPoints: [
          'Strong entity to table; key attribute becomes primary key; derived attrs omitted',
          'Multivalued attribute to its own table (owner key + value)',
          'Weak entity to table with owner key as foreign key; PK = owner key + partial key',
          '1:N puts the one-side key as a foreign key in the many side',
          'M:N needs a junction table keyed by both entities’ primary keys plus relationship attrs',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/dbms/mapping-from-er-model-to-relational-model/' },
        ],
        interview: [
          { q: 'How do you convert a strong entity set to a table?', a: 'Create a table with a column for each simple attribute (composite attributes become several columns), make the entity key attribute the primary key, and omit derived attributes since they are computed rather than stored.' },
          { q: 'How is a many-to-many relationship converted to tables?', a: 'You create a separate junction (associative) table whose primary key is the combination of the primary keys of both participating entities, included as foreign keys, along with any attributes of the relationship itself.' },
          { q: 'How is a one-to-many relationship represented in tables?', a: 'You place the primary key of the one side as a foreign key in the table of the many side. Any attributes on the relationship are also stored on the many side.' },
          { q: 'How do you convert a weak entity set?', a: 'Create a table containing the weak entity attributes plus the owner entity primary key as a foreign key. The primary key of this table is the owner key combined with the weak entity partial key.' },
          { q: 'How is a multivalued attribute mapped to the relational model?', a: 'It becomes a separate table holding the owner entity primary key and one column for each value, with the owner key plus the value forming the primary key, since a single column cannot store multiple values in 1NF.' },
          { q: 'What are the strategies for mapping generalization to tables?', a: 'Common approaches are: a table for the superclass plus one table per subclass holding the inherited key and subclass-specific attributes; a single combined table with a type discriminator column; or only subclass tables when participation is total and disjoint.' },
        ],
      },
    ],
  },
  {
    focus: 'Relational Model & Relational Algebra',
    concepts: [
      {
        id: 'dbms-relational-model',
        topic: 'Relational Model: Relations, Tuples, Attributes, Domains',
        summary: 'Data is organized as relations (tables) of tuples over attribute domains.',
        explanation:
          'The relational model, introduced by E. F. Codd, represents a database as a collection of relations. A relation is essentially a table with rows and columns, but with precise mathematical terminology. A relation has a name and a fixed set of attributes; each attribute (column) has a name and an associated domain, which is the set of allowed atomic values for that attribute (for example, Age has a domain of non-negative integers). The relation schema is the relation name together with its list of attributes and their domains, written like Student(RollNo, Name, Age).\n\nEach row of a relation is a tuple, an ordered collection of values, one per attribute, all drawn from the respective domains. The degree (or arity) of a relation is the number of attributes (columns), while the cardinality of a relation is the number of tuples (rows) it currently contains. The body of the relation, the set of tuples, is the relation instance, which changes over time, whereas the schema stays fixed.\n\nThe relational model rests on a few important properties. Relations are sets of tuples, so in theory there are no duplicate tuples and the order of tuples does not matter. The order of attributes is also immaterial as long as each value is matched to its attribute. Every attribute value must be atomic (indivisible), which is the essence of first normal form. Finally, a special marker NULL is used to represent an unknown or inapplicable value, and it behaves specially in comparisons.\n\nThis model became dominant because of its simplicity and strong theoretical foundation: data is just tables, queries are expressed declaratively (in relational algebra or SQL), and the underlying set theory enables powerful optimization. Almost every interview on databases assumes fluency with this vocabulary, so be precise: table is relation, row is tuple, column is attribute, and the allowed values of a column form its domain.',
        keyPoints: [
          'Relation = table; tuple = row; attribute = column; domain = allowed atomic values',
          'Relation schema = name + attributes; relation instance = current set of tuples',
          'Degree/arity = number of attributes; cardinality = number of tuples',
          'Relations are sets: no duplicate tuples, order of rows and columns is irrelevant',
          'Attribute values are atomic; NULL marks unknown or inapplicable values',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/dbms/relational-model-in-dbms/' },
        ],
        interview: [
          { q: 'What is the relational model?', a: 'It is a data model proposed by E. F. Codd that represents a database as a collection of relations (tables) consisting of tuples (rows) over attributes (columns), each attribute drawing values from a domain. Queries are expressed declaratively through relational algebra or SQL.' },
          { q: 'Define tuple, attribute, and domain.', a: 'A tuple is a single row of a relation, a set of values one per attribute. An attribute is a named column of the relation. A domain is the set of permissible atomic values for an attribute, such as positive integers for Age.' },
          { q: 'What is the difference between the degree and cardinality of a relation?', a: 'Degree (arity) is the number of attributes (columns) in the relation, a property of the schema. Cardinality is the number of tuples (rows) currently in the relation, a property of the instance.' },
          { q: 'What is a relation schema versus a relation instance?', a: 'A relation schema is the fixed definition: the relation name plus its attributes and their domains. A relation instance is the actual set of tuples present at a given moment, which changes as data is modified.' },
          { q: 'Why must attribute values be atomic?', a: 'Atomicity means each cell holds a single indivisible value, which is the requirement of first normal form. It avoids repeating groups and multivalued cells, keeping the relation simple to query and manipulate.' },
          { q: 'What is a NULL value?', a: 'NULL is a special marker indicating that a value is unknown, missing, or inapplicable. It is not zero or an empty string, and comparisons with NULL yield UNKNOWN rather than true or false.' },
        ],
      },
      {
        id: 'dbms-integrity-constraints',
        topic: 'Relational Integrity Constraints',
        summary: 'Domain, entity, and referential integrity keep the data valid and consistent.',
        explanation:
          'Integrity constraints are rules that the data in a relational database must always satisfy so that it stays accurate and consistent. The DBMS enforces them automatically and rejects any operation that would violate them. The three foundational categories are domain constraints, entity integrity, and referential integrity, plus key constraints.\n\nDomain constraints require that every value of an attribute belongs to that attribute domain, including its data type and any restrictions such as range or NOT NULL. For example, Age must be a non-negative integer and Gender must be one of a fixed set of allowed values. Domain constraints are the most basic guarantee and are enforced on every insert and update.\n\nKey constraints state that the values of a candidate key (or primary key) must be unique across all tuples, so no two rows can have the same key value. Entity integrity is a specific, important constraint on the primary key: no attribute of a primary key may be NULL. The reasoning is that the primary key is used to identify tuples uniquely, and a NULL key value would make a row unidentifiable, so it is forbidden.\n\nReferential integrity governs relationships between tables expressed through foreign keys. It states that a foreign key value in a referencing table must either match some existing primary key value in the referenced table or be entirely NULL; it can never point to a non-existent row. For instance, if an Orders table has a CustomerID foreign key referencing Customers, every CustomerID in Orders must correspond to a real customer. This prevents dangling references. When a referenced row is updated or deleted, referential actions such as CASCADE, SET NULL, or RESTRICT decide what happens to the matching rows. Together these constraints are what make a relational database trustworthy.',
        keyPoints: [
          'Domain constraint: every value must lie in its attribute domain (type/range/NOT NULL)',
          'Key constraint: candidate/primary key values must be unique across tuples',
          'Entity integrity: no part of a primary key may be NULL',
          'Referential integrity: a foreign key must match an existing key value or be NULL',
          'Referential actions (CASCADE, SET NULL, RESTRICT) handle updates/deletes of referenced rows',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/dbms/relational-model-in-dbms/' },
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/dbms/types-of-constraints-in-dbms/' },
        ],
        interview: [
          { q: 'What are integrity constraints?', a: 'They are rules enforced by the DBMS to keep data accurate and consistent, such as domain, key, entity integrity, and referential integrity constraints. Any operation that would violate them is rejected.' },
          { q: 'What is entity integrity?', a: 'Entity integrity requires that no attribute of a primary key contains a NULL value. Since the primary key uniquely identifies each tuple, a NULL would make the row unidentifiable, so it is not allowed.' },
          { q: 'What is referential integrity?', a: 'Referential integrity requires that every foreign key value either match an existing primary key value in the referenced table or be NULL. It prevents foreign keys from pointing to rows that do not exist (dangling references).' },
          { q: 'What is a domain constraint?', a: 'A domain constraint restricts the values an attribute can take to its declared domain, including data type, allowed range, and rules like NOT NULL. For example, Age must be a non-negative integer.' },
          { q: 'What happens when you delete a row that is referenced by a foreign key?', a: 'It depends on the referential action defined: CASCADE deletes the referencing rows too, SET NULL sets their foreign key to NULL, and RESTRICT/NO ACTION blocks the delete. The default in many systems is to restrict it.' },
          { q: 'Can a foreign key be NULL?', a: 'Yes, unless it is also declared NOT NULL. A NULL foreign key means the row simply has no associated parent row, which still satisfies referential integrity.' },
        ],
      },
      {
        id: 'dbms-relational-algebra',
        topic: 'Relational Algebra Operators',
        summary: 'A procedural query language: selection, projection, set ops, products, joins, division.',
        explanation:
          'Relational algebra is a procedural query language: it specifies a sequence of operations to compute the desired result from input relations, and each operation takes one or two relations and produces a new relation. It is the theoretical basis of SQL and a frequent interview topic, so the operators and their symbols should be memorized.\n\nThe fundamental (basic) operators are six. Selection (sigma) picks the tuples (rows) that satisfy a predicate, e.g. sigma over Age greater than 18 of Student. Projection (pi) picks the listed attributes (columns) and removes duplicates, e.g. pi over Name, Age of Student. Union (relations must be union-compatible, meaning the same number and types of attributes) returns tuples in either relation. Set difference returns tuples in the first relation but not the second. Cartesian product pairs every tuple of one relation with every tuple of the other. Rename gives a relation or its attributes new names so they can be reused or self-joined.\n\nFrom these, several derived operators are defined for convenience. Intersection returns tuples in both relations. The join family is the most important: a theta join is a Cartesian product followed by a selection on a condition; an equijoin uses only equality conditions; a natural join automatically joins on all attributes with the same name and keeps one copy of each. Outer joins (left, right, full) preserve unmatched tuples by padding with NULLs, which the basic operators cannot do.\n\nDivision is a special derived operator used for queries with the phrase for all. Given R(x, y) divided by S(y), it returns the x values that are associated with every y in S. The classic example: find students who have taken all courses, computed as Enrolled(StudentID, CourseID) divided by Courses(CourseID). Mastering selection vs projection, the join variants, and the meaning of division covers almost every relational-algebra interview question.',
        keyPoints: [
          'Relational algebra is procedural and is the theoretical basis of SQL',
          'Basic operators: selection (σ), projection (π), union, set difference, Cartesian product, rename',
          'Selection filters rows; projection picks columns and removes duplicates',
          'Joins: theta, equijoin, natural join, and outer joins (pad unmatched rows with NULL)',
          'Division answers for all queries, e.g. students who took every course',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/dbms/introduction-of-relational-algebra-in-dbms/' },
        ],
        interview: [
          { q: 'What is relational algebra?', a: 'It is a procedural query language consisting of operators that take one or two relations and produce a new relation. It forms the theoretical foundation of SQL and query optimization.' },
          { q: 'What is the difference between selection and projection?', a: 'Selection (sigma) chooses tuples (rows) that satisfy a condition, filtering horizontally. Projection (pi) chooses specified attributes (columns) and removes duplicates, filtering vertically.' },
          { q: 'What are the basic (fundamental) operators of relational algebra?', a: 'Selection, projection, union, set difference, Cartesian product, and rename. All other operators such as intersection, joins, and division are derived from these.' },
          { q: 'What is a natural join?', a: 'A natural join combines two relations on all attributes that share the same name, keeping only one copy of each common attribute and including only matching tuples. It is a special case of the equijoin.' },
          { q: 'What does the division operator do?', a: 'Division answers for all queries. R(x, y) divided by S(y) returns the x values that are related to every y in S, for example finding students who have enrolled in all available courses.' },
          { q: 'What does union-compatible mean?', a: 'Two relations are union-compatible if they have the same number of attributes and the corresponding attributes have the same domains. Union, intersection, and set difference require union compatibility.' },
        ],
      },
      {
        id: 'dbms-relational-calculus',
        topic: 'Relational Calculus (TRC & DRC) Overview',
        summary: 'A declarative query language describing what to retrieve, not how, in two forms: TRC and DRC.',
        explanation:
          'Relational calculus is a non-procedural (declarative) query language. Unlike relational algebra, which specifies a step-by-step procedure, relational calculus describes only what result is wanted in terms of a logical condition, leaving the system to figure out how to compute it. SQL is closer in spirit to relational calculus than to algebra, which is why this topic is worth understanding. There are two variants: tuple relational calculus and domain relational calculus.\n\nTuple Relational Calculus (TRC) uses tuple variables that range over the tuples of a relation. A query has the form { t | P(t) }, read as the set of all tuples t for which the predicate P(t) is true. For example, { t | t in Student and t.Age greater than 18 } returns all student tuples whose age exceeds 18. The predicate is built using comparisons, logical connectives (AND, OR, NOT), and quantifiers (there exists and for all).\n\nDomain Relational Calculus (DRC) uses domain variables that range over the values of individual attributes (domains) rather than whole tuples. A query has the form { <x1, x2, ...> | P(x1, x2, ...) }, listing the domain variables for the desired attributes and a predicate over them. For example, { <n, a> | there exists r such that (r, n, a) in Student and a greater than 18 } returns the name and age columns of students older than 18. DRC and TRC are equivalent in expressive power.\n\nAn important caveat is the notion of a safe expression. A calculus expression is unsafe if it can generate an infinite result, such as { t | NOT (t in R) }, which would include every possible tuple not in R. We restrict ourselves to safe expressions whose results are finite and drawn from the values appearing in the database. The key interview takeaway is the contrast: relational algebra is procedural (how), relational calculus is declarative (what), and the two are equivalent in power, a result tied to Codd theorem on relational completeness.',
        keyPoints: [
          'Relational calculus is declarative (what to fetch), unlike procedural algebra (how)',
          'TRC uses tuple variables: { t | P(t) }',
          'DRC uses domain variables over attribute values: { <x, y> | P(x, y) }',
          'TRC, DRC, and relational algebra are equivalent in expressive power',
          'Only safe expressions (finite results) are allowed',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/dbms/introduction-of-relational-algebra-in-dbms/' },
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/dbms/tuple-relational-calculus-trc-in-dbms/' },
        ],
        interview: [
          { q: 'What is relational calculus?', a: 'It is a non-procedural query language that specifies what data to retrieve using a logical predicate, without describing the procedure to obtain it. It comes in two forms: tuple relational calculus and domain relational calculus.' },
          { q: 'What is the difference between relational algebra and relational calculus?', a: 'Relational algebra is procedural and specifies how to compute the result through a sequence of operations, while relational calculus is declarative and specifies only what is wanted via a predicate. They are equivalent in expressive power.' },
          { q: 'What is the difference between TRC and DRC?', a: 'Tuple relational calculus uses variables that range over whole tuples, written { t | P(t) }. Domain relational calculus uses variables that range over individual attribute values (domains), written { <x, y> | P(x, y) }. They are equivalent in power.' },
          { q: 'What is a safe expression in relational calculus?', a: 'A safe expression is one guaranteed to produce a finite result drawn from values in the database. Unsafe expressions like { t | NOT t in R } could yield infinitely many tuples and are disallowed.' },
          { q: 'Which is closer to SQL, relational algebra or relational calculus?', a: 'SQL is closer to relational calculus in spirit because it is largely declarative, letting you state what you want, although its execution engine internally uses algebra-style operations for optimization.' },
        ],
      },
    ],
  },
  {
    focus: 'Keys in the Relational Model',
    concepts: [
      {
        id: 'dbms-types-of-keys',
        topic: 'Super Key, Candidate Key, Primary Key & Alternate Key',
        summary: 'A hierarchy of keys from broad super keys down to the chosen primary key.',
        explanation:
          'A key is an attribute or set of attributes used to identify tuples in a relation. The family of keys forms a hierarchy that is one of the most frequently asked interview topics, so the distinctions must be crisp. Consider a relation Student(RollNo, Aadhaar, Email, Name, Age) where RollNo, Aadhaar, and Email are each individually unique.\n\nA super key is any set of attributes that uniquely identifies a tuple. It may contain extra, redundant attributes. In our example {RollNo}, {RollNo, Name}, {Aadhaar, Age}, and {Email} are all super keys because each guarantees uniqueness, even though some include unnecessary columns. A candidate key is a minimal super key: a super key from which you cannot remove any attribute without losing uniqueness. Here {RollNo}, {Aadhaar}, and {Email} are candidate keys, since each is unique on its own and has no removable part. {RollNo, Name} is a super key but not a candidate key because Name is redundant.\n\nThe primary key is the one candidate key chosen by the designer to be the main identifier of the relation. It must be unique and NOT NULL (entity integrity), and there is exactly one primary key per table. Say we pick RollNo. The remaining candidate keys (Aadhaar, Email) are then called alternate keys (or secondary keys): they were eligible to be the primary key but were not chosen.\n\nThe mental model to carry into interviews: every candidate key is a super key, and every primary key is a candidate key, but not vice versa. Super key is the broadest set, candidate key is minimal, primary key is the selected candidate key, and the leftover candidate keys are alternate keys. Being able to classify a given set of attributes into these categories from a sample relation is a standard exam question.',
        keyPoints: [
          'Super key: any attribute set that uniquely identifies a tuple (may be redundant)',
          'Candidate key: a minimal super key (no attribute removable)',
          'Primary key: the chosen candidate key; unique and NOT NULL; one per table',
          'Alternate key: candidate keys not chosen as the primary key',
          'Hierarchy: every primary key is a candidate key is a super key (not vice versa)',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/dbms/types-of-keys-in-relational-model-candidate-super-primary-alternate-and-foreign/' },
        ],
        interview: [
          { q: 'What are the different types of keys in a DBMS?', a: 'Super key, candidate key, primary key, alternate key, composite key, foreign key, and surrogate key. They differ in minimality, uniqueness, and whether they reference another table or are system-generated.' },
          { q: 'What is the difference between a super key and a candidate key?', a: 'A super key is any set of attributes that uniquely identifies a tuple and may contain extra attributes. A candidate key is a minimal super key from which no attribute can be removed without losing uniqueness. Every candidate key is a super key, but not vice versa.' },
          { q: 'What is a candidate key?', a: 'A candidate key is a minimal set of attributes that can uniquely identify each tuple in a relation. A relation can have several candidate keys, and one of them is chosen as the primary key.' },
          { q: 'What is an alternate key?', a: 'An alternate key is a candidate key that was not selected as the primary key. For example, if RollNo is the primary key, then Aadhaar and Email, if also unique, are alternate keys.' },
          { q: 'How many primary keys can a table have?', a: 'Exactly one. A table can have several candidate keys, but only one of them is designated as the primary key, which must be unique and non-null.' },
          { q: 'Is the primary key always a single column?', a: 'No. A primary key can be composite, made of two or more columns, as long as their combination is unique and minimal. The requirement is uniqueness and non-nullability, not a single column.' },
        ],
      },
      {
        id: 'dbms-composite-foreign-surrogate',
        topic: 'Composite, Foreign & Surrogate Keys',
        summary: 'Multi-column keys, cross-table references, and system-generated identifiers.',
        explanation:
          'Beyond the core hierarchy, three more key types come up constantly. A composite key (also called a compound key) is a primary or candidate key made up of two or more attributes, used when no single attribute is unique on its own. For example, in an Enrollment(StudentID, CourseID, Grade) table, neither StudentID nor CourseID alone is unique, but together {StudentID, CourseID} uniquely identifies each enrollment, so they form a composite primary key. Junction tables created from many-to-many relationships almost always use composite keys.\n\nA foreign key is an attribute (or set of attributes) in one table whose values must match the primary key (or a candidate key) of another, referenced table, or be NULL. It is the mechanism that links tables and enforces referential integrity. For example, in Orders(OrderID, CustomerID, Amount), CustomerID is a foreign key referencing Customers(CustomerID). The table containing the foreign key is the child or referencing table; the one it points to is the parent or referenced table. A foreign key need not be unique in the child table; many orders can reference the same customer.\n\nA surrogate key is an artificial, system-generated key that has no business meaning, introduced solely to serve as the primary key. Typical examples are an auto-increment integer ID or a UUID. Surrogate keys are preferred when natural candidate keys are large, composite, or prone to change (such as an email address that a user might update). Because the surrogate value never changes and is compact, it makes joins efficient and keeps foreign-key references stable, but it does not by itself prevent duplicate business data, so a unique constraint on the natural key is still often needed.\n\nIn interviews you should be able to contrast a natural key (derived from real-world data, like Aadhaar) with a surrogate key (artificial, like an auto-increment ID), and explain when each is appropriate. Surrogate keys trade away human readability and built-in uniqueness of business data for stability and performance.',
        keyPoints: [
          'Composite key: primary/candidate key made of two or more attributes',
          'Foreign key: attribute(s) referencing another table’s key; enforces referential integrity',
          'Foreign key need not be unique in the child table; can be NULL',
          'Surrogate key: artificial, system-generated identifier (auto-increment ID, UUID)',
          'Natural key has business meaning; surrogate key trades readability for stability/performance',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/dbms/types-of-keys-in-relational-model-candidate-super-primary-alternate-and-foreign/' },
        ],
        interview: [
          { q: 'What is a foreign key?', a: 'A foreign key is one or more attributes in a child table whose values must match a primary or candidate key in a referenced parent table, or be NULL. It links the two tables and enforces referential integrity.' },
          { q: 'What is a composite key?', a: 'A composite (compound) key is a key made up of two or more attributes whose combination uniquely identifies a tuple, used when no single attribute is unique, as in a junction table keyed by StudentID and CourseID.' },
          { q: 'What is a surrogate key and when is it used?', a: 'A surrogate key is an artificial, system-generated identifier (like an auto-increment integer or UUID) with no business meaning. It is used when natural keys are large, composite, or changeable, giving stable and efficient references.' },
          { q: 'Can a foreign key have duplicate or NULL values?', a: 'Yes. A foreign key can repeat in the child table (many rows can reference the same parent) and can be NULL unless declared NOT NULL, meaning that row has no associated parent.' },
          { q: 'What is the difference between a natural key and a surrogate key?', a: 'A natural key is derived from real-world data with inherent meaning (e.g., email, Aadhaar), while a surrogate key is an artificial value with no meaning created just for identification. Surrogate keys are more stable and compact but not human-meaningful.' },
          { q: 'Can a foreign key reference the same table it belongs to?', a: 'Yes, this is a self-referencing (recursive) foreign key, useful for hierarchies such as an Employee table where ManagerID is a foreign key referencing EmployeeID in the same table.' },
        ],
      },
      {
        id: 'dbms-keys-fk-actions-nulls',
        topic: 'Keys from FDs, Referential Actions & NULLs',
        summary: 'How keys arise from functional dependencies, foreign-key actions, and how NULLs interact with keys.',
        explanation:
          'Keys are not arbitrary; they emerge from the functional dependencies (FDs) that hold in a relation. A set of attributes X is a candidate key if its attribute closure X+ includes every attribute of the relation (so X determines everything) and no proper subset of X has that property (minimality). This is why finding candidate keys is fundamentally an exercise in computing closures over the given FDs, a connection explored in detail in the functional-dependencies day. The practical upshot: given the FDs, you can derive precisely which attribute sets qualify as keys rather than guessing.\n\nReferential integrity, enforced by foreign keys, raises the question of what should happen when a referenced (parent) row is updated or deleted while child rows still point to it. SQL provides referential actions, declared with ON DELETE and ON UPDATE clauses. CASCADE propagates the change: deleting a parent deletes the matching children, and updating a parent key updates the children. SET NULL sets the child foreign key to NULL (only valid if the column allows NULLs). SET DEFAULT sets it to a predefined default value. RESTRICT and NO ACTION reject the operation if dependent child rows exist, which is often the safe default. Choosing the right action encodes the business rule, for example cascading deletes of order items when an order is deleted.\n\nNULLs interact with keys in specific ways that are popular exam points. A primary key column can never be NULL, because of entity integrity; this is the single most important NULL rule for keys. A UNIQUE constraint, by contrast, generally does allow NULLs, and in most databases multiple NULLs are permitted because two NULLs are not considered equal. A foreign key may be NULL, indicating the absence of a relationship, and a NULL foreign key never violates referential integrity since there is nothing to match.\n\nPulling it together: FDs determine which columns can serve as keys, the chosen primary key must be unique and non-null, alternate candidate keys are usually backed by UNIQUE constraints (which tolerate NULLs), and foreign keys plus their referential actions wire tables together while respecting these NULL rules. This forms the complete practical picture of keys in a working schema.',
        keyPoints: [
          'X is a candidate key if X+ covers all attributes and no proper subset does (minimal)',
          'Finding candidate keys reduces to computing attribute closures over the FDs',
          'Referential actions: CASCADE, SET NULL, SET DEFAULT, RESTRICT/NO ACTION',
          'Primary key cannot be NULL; UNIQUE generally permits NULL(s)',
          'A NULL foreign key is allowed and does not violate referential integrity',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/dbms/how-to-find-the-candidate-keys-of-a-relation/' },
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/sql/sql-foreign-key/' },
        ],
        interview: [
          { q: 'What is the difference between a primary key and a unique key?', a: 'A primary key uniquely identifies rows and cannot be NULL, and there is only one per table. A unique key also enforces uniqueness but generally allows NULL values (often multiple), and a table can have several unique keys. The primary key is essentially the chosen candidate key.' },
          { q: 'How are candidate keys derived from functional dependencies?', a: 'You compute the attribute closure of candidate attribute sets. A set X is a candidate key if its closure X+ contains all attributes of the relation and no proper subset of X also has that property, ensuring minimality.' },
          { q: 'What are referential actions and name a few?', a: 'They specify what happens to child rows when a referenced parent key is updated or deleted: CASCADE propagates the change, SET NULL nulls the foreign key, SET DEFAULT sets a default, and RESTRICT/NO ACTION blocks the operation if children exist.' },
          { q: 'Can a primary key contain a NULL value?', a: 'No. Entity integrity forbids any part of a primary key from being NULL, because the primary key must uniquely and unambiguously identify every tuple, which NULL cannot do.' },
          { q: 'Does a UNIQUE constraint allow NULL values?', a: 'Yes, in most databases a UNIQUE column allows NULLs, and often multiple NULLs, because two NULL values are not considered equal. This is a key difference from a primary key, which forbids NULLs entirely.' },
          { q: 'What does ON DELETE CASCADE do?', a: 'It automatically deletes all child rows whose foreign key references a parent row when that parent row is deleted, keeping the database free of dangling references without manual cleanup.' },
        ],
      },
    ],
  },
  {
    focus: 'Functional Dependencies',
    concepts: [
      {
        id: 'dbms-fd-basics',
        topic: 'Functional Dependencies: Definition & Types',
        summary: 'X to Y means X determines Y; FDs can be trivial or non-trivial.',
        explanation:
          'A functional dependency (FD) is a constraint between two sets of attributes in a relation. We write X to Y (read X determines Y, or Y is functionally dependent on X) to mean that whenever two tuples agree on all attributes in X, they must also agree on all attributes in Y. X is called the determinant and Y the dependent. For example, in a Student relation, RollNo to Name means any two rows with the same RollNo must have the same Name, which makes sense because RollNo identifies the student.\n\nFunctional dependencies express the real-world rules about the data and are the foundation of normalization. They are derived from the meaning (semantics) of the attributes, not from a particular instance: you cannot conclude an FD just because it happens to hold in the current rows; it must hold for all valid states. This is why FDs are given as part of the relation design.\n\nFDs are classified by triviality. An FD X to Y is trivial if Y is a subset of X; such a dependency always holds automatically and carries no real information (for example, {RollNo, Name} to RollNo). An FD is non-trivial if Y is not a subset of X (for example RollNo to Name), and these are the dependencies that actually constrain the data and matter for normalization. A completely non-trivial FD is one where X and Y have no attributes in common at all.\n\nAnother useful classification is full versus partial dependency, which becomes important in second normal form. An FD X to Y is a full functional dependency if Y depends on the whole of X and not on any proper subset; it is a partial dependency if Y can be determined by just part of a composite determinant X. Understanding the definition of an FD, the trivial/non-trivial split, and the full/partial split equips you to reason about closures, keys, and normal forms, which build directly on these ideas.',
        keyPoints: [
          'FD X to Y: tuples agreeing on X must agree on Y (X determines Y)',
          'X is the determinant, Y the dependent; FDs reflect real-world semantics, not one instance',
          'Trivial FD: Y is a subset of X (always holds); non-trivial: Y not a subset of X',
          'Full dependency: Y needs all of X; partial dependency: Y needs only part of X',
          'FDs are the basis for finding keys and for normalization',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/dbms/functional-dependency-and-attribute-closure/' },
        ],
        interview: [
          { q: 'What is a functional dependency?', a: 'A functional dependency X to Y means that whenever two tuples have the same values for the attribute set X, they must also have the same values for Y. In other words, X uniquely determines Y. It reflects a real-world rule about the data.' },
          { q: 'What is the difference between a trivial and a non-trivial functional dependency?', a: 'An FD X to Y is trivial if Y is a subset of X, so it always holds and conveys no constraint. It is non-trivial if Y is not a subset of X, in which case it genuinely constrains the data and matters for normalization.' },
          { q: 'What is the difference between full and partial functional dependency?', a: 'A full functional dependency means Y depends on the entire determinant X, with no proper subset of X being sufficient. A partial dependency means Y can be determined by only part of a composite X. Partial dependencies cause violations of 2NF.' },
          { q: 'Can a functional dependency be inferred from a single instance of data?', a: 'No. An FD is a constraint that must hold for all valid states of the relation. The fact that it happens to hold in one instance does not prove it; FDs come from the semantics of the data.' },
          { q: 'What is a determinant?', a: 'The determinant is the left-hand side of a functional dependency, the set of attributes X in X to Y that determines the value of the right-hand side Y.' },
        ],
      },
      {
        id: 'dbms-armstrong-axioms',
        topic: "Armstrong's Axioms & Inference Rules",
        summary: 'A sound and complete set of rules to derive all FDs implied by a given set.',
        explanation:
          'Given a set of functional dependencies, many other FDs are logically implied by them. Armstrong axioms are a set of inference rules used to derive all such implied FDs; the complete set of FDs derivable from F is called the closure of F, written F+. Armstrong axioms are sound (they derive only FDs that truly hold) and complete (they can derive every FD that is logically implied), which is a celebrated theoretical result.\n\nThere are three primary (fundamental) axioms. Reflexivity (the trivial rule): if Y is a subset of X, then X to Y; in other words a set of attributes always determines any subset of itself. Augmentation: if X to Y holds, then XZ to YZ for any set of attributes Z; you may add the same attributes to both sides. Transitivity: if X to Y and Y to Z, then X to Z; dependencies chain together. These three alone are enough to derive every implied FD.\n\nFrom the three primary axioms, several secondary (derived) rules follow that are convenient in practice. Union (additivity): if X to Y and X to Z, then X to YZ. Decomposition (projectivity): if X to YZ, then X to Y and X to Z; this is the reverse of union. Pseudo-transitivity: if X to Y and WY to Z, then WX to Z. These derived rules are not strictly necessary but speed up reasoning and proofs.\n\nIn interviews you should be able to state the three primary axioms precisely with their names, mention that they are sound and complete, and list the common derived rules (union, decomposition, pseudo-transitivity). Armstrong axioms underpin the computation of attribute closures and the determination of candidate keys, so they are the engine behind the rest of dependency theory.',
        keyPoints: [
          'Armstrong’s axioms derive all FDs implied by a set F (its closure F+)',
          'They are sound (only valid FDs) and complete (all implied FDs)',
          'Primary axioms: Reflexivity, Augmentation, Transitivity',
          'Derived rules: Union, Decomposition, Pseudo-transitivity',
          'They underpin attribute-closure and candidate-key computation',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/dbms/armstrongs-axioms-in-functional-dependency-in-dbms/' },
        ],
        interview: [
          { q: "What are Armstrong's axioms?", a: 'They are a set of inference rules for functional dependencies, used to derive all FDs logically implied by a given set. The three primary axioms are reflexivity, augmentation, and transitivity. They are sound and complete.' },
          { q: 'State the three primary Armstrong axioms.', a: 'Reflexivity: if Y is a subset of X then X to Y. Augmentation: if X to Y then XZ to YZ. Transitivity: if X to Y and Y to Z then X to Z.' },
          { q: 'What does it mean that Armstrong axioms are sound and complete?', a: 'Sound means every FD derived using them genuinely holds (no false dependencies). Complete means they can derive every FD that is logically implied by the given set, so together they generate the full closure F+.' },
          { q: 'What are the secondary or derived inference rules?', a: 'Union: if X to Y and X to Z then X to YZ. Decomposition: if X to YZ then X to Y and X to Z. Pseudo-transitivity: if X to Y and WY to Z then WX to Z. They are derivable from the three primary axioms.' },
          { q: 'What is the closure of a set of functional dependencies (F+)?', a: 'F+ is the set of all functional dependencies that can be logically derived from F using Armstrong axioms. It represents every dependency implied by the original set.' },
          { q: 'What is the augmentation rule used for?', a: 'Augmentation lets you add the same attributes to both sides of an FD: from X to Y you get XZ to YZ. It is often a needed step in proofs and in deriving more complex dependencies via pseudo-transitivity.' },
        ],
      },
      {
        id: 'dbms-attribute-closure-candidate-keys',
        topic: 'Attribute Closure & Finding Candidate Keys',
        summary: 'Compute X+ to test keys; a worked example of finding candidate keys from FDs.',
        explanation:
          'The attribute closure of a set X, written X+, is the set of all attributes that are functionally determined by X under a given set of FDs. The algorithm is simple and iterative: start with X+ = X, then repeatedly look for any FD A to B where A is already a subset of X+, and if so add B to X+. Repeat until no more attributes can be added. The resulting X+ tells you everything X can determine.\n\nWorked example. Consider relation R(A, B, C, D, E) with FDs: A to B, B to C, CD to E. Compute A+. Start with {A}. Using A to B, add B, giving {A, B}. Using B to C, add C, giving {A, B, C}. Now CD to E requires both C and D in the closure; we have C but not D, so it does not fire. No more FDs apply, so A+ = {A, B, C}. Since A+ does not include D or E, A alone is not a candidate key.\n\nNow find a candidate key. An attribute set is a candidate key if its closure is all of R and it is minimal. Notice D and E never appear on the right-hand side of any FD, so they can never be determined by other attributes; therefore every candidate key must contain D (E can be derived via CD to E once C and D are present, so E need not be in the key). Try {A, D}: closure is {A} to add B (A to B), then C (B to C), now we have C and D so CD to E adds E, giving {A, B, C, D, E} = R. So {A, D} is a super key. Is it minimal? A+ = {A,B,C} is not all of R, and D+ = {D} is not all of R, so neither single attribute suffices; thus {A, D} is minimal and therefore a candidate key.\n\nThe general technique for interviews: first find attributes that appear only on the left of FDs or never on any right side, since they must be in every candidate key. Build candidate sets around them, compute closures, confirm they cover all attributes, and check minimality by removing each attribute. Attribute closure is the single most useful computational tool in dependency theory, used to test super keys, find candidate keys, verify FDs, and compute minimal covers.',
        keyPoints: [
          'X+ = all attributes determined by X; computed by iteratively applying FDs',
          'Algorithm: start with X, add B for each A to B where A is inside the current closure',
          'X is a super key if X+ equals all attributes; a candidate key if also minimal',
          'Attributes never on any FD right-hand side must appear in every candidate key',
          'Worked example: in R(A,B,C,D,E) with A→B, B→C, CD→E, {A, D} is a candidate key',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/dbms/finding-attribute-closure-and-candidate-keys-using-functional-dependencies/' },
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/dbms/how-to-find-the-candidate-keys-of-a-relation/' },
        ],
        interview: [
          { q: 'What is attribute closure?', a: 'The attribute closure X+ is the set of all attributes that can be functionally determined by the attribute set X under a given set of FDs. It is computed by repeatedly adding the right-hand side of any FD whose left-hand side is already contained in the current closure.' },
          { q: 'How do you check whether an attribute set is a candidate key?', a: 'Compute its closure. If the closure equals the entire set of attributes of the relation, it is a super key. If, in addition, no proper subset has a closure covering all attributes, it is minimal and therefore a candidate key.' },
          { q: 'How do you find candidate keys from functional dependencies?', a: 'Identify attributes that never appear on the right-hand side of any FD; they must be in every candidate key. Combine them with other attributes, compute closures, keep the sets whose closure covers all attributes, and reduce each to a minimal set.' },
          { q: 'If an attribute never appears on the right side of any FD, what does that imply?', a: 'It can never be determined by other attributes, so it must be part of every candidate key (and super key) of the relation; otherwise the closure could never include it.' },
          { q: 'How is attribute closure used to verify an FD X to Y?', a: 'Compute X+. If Y is a subset of X+, then X to Y is implied by the given FD set; otherwise it is not. This is the standard way to test membership in F+.' },
          { q: 'Can a relation have more than one candidate key?', a: 'Yes. A relation may have several minimal attribute sets that each determine all attributes. For example, both an auto-increment ID and a unique email could each be candidate keys.' },
        ],
      },
      {
        id: 'dbms-fd-equivalence-minimal-cover',
        topic: 'FD Set Equivalence & Canonical (Minimal) Cover',
        summary: 'When two FD sets are equivalent, and how to find a minimal cover.',
        explanation:
          'Two sets of functional dependencies F and G are equivalent if they imply exactly the same dependencies, that is, if F+ equals G+. In practice you check equivalence by testing covers: F covers G if every FD in G can be derived from F (verified by attribute closures using F), and G covers F similarly. If F covers G and G covers F, then F and G are equivalent. If only one direction holds, one set is stronger than the other. This is a common exam question phrased as are these two FD sets equivalent.\n\nA canonical cover (also called a minimal cover or irreducible set), denoted Fc, is a simplified FD set that is equivalent to the original F but has no redundancy. It must satisfy three conditions. First, every FD has a single attribute on its right-hand side (achieved using the decomposition rule). Second, no FD has a redundant attribute on its left-hand side (no extraneous determinant attribute). Third, no entire FD is redundant, meaning none can be derived from the others. The minimal cover is not always unique, but it is always equivalent to F.\n\nThe algorithm to compute a minimal cover has three steps. Step one: split right-hand sides so each FD has a single attribute on the right. Step two: remove extraneous attributes from left-hand sides; for an FD like AB to C, check whether A or B is unnecessary by testing closures (if B+ already determines C using the rest of the set, then A is extraneous). Step three: remove redundant FDs; for each FD X to Y, temporarily remove it and check whether X still determines Y using the remaining FDs (compute X+ without that FD); if it does, the FD is redundant and is dropped.\n\nMinimal cover matters because it gives the simplest equivalent description of the dependencies, which is exactly what algorithms for 3NF decomposition use to produce a lossless, dependency-preserving schema with the fewest dependencies. For interviews, be ready to state the three properties of a canonical cover and walk through the three-step reduction on a small FD set.',
        keyPoints: [
          'F and G are equivalent if F+ = G+ (each covers the other)',
          'Check cover direction using attribute closures',
          'Canonical/minimal cover Fc is equivalent to F with no redundancy',
          'Conditions: single attribute on RHS, no extraneous LHS attribute, no redundant FD',
          'Steps: split RHS, remove extraneous LHS attributes, remove redundant FDs',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/dbms/canonical-cover-of-functional-dependencies-in-dbms/' },
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/dbms/equivalence-of-functional-dependencies/' },
        ],
        interview: [
          { q: 'When are two sets of functional dependencies equivalent?', a: 'Two FD sets F and G are equivalent if they imply exactly the same dependencies, i.e., F+ equals G+. This holds when F covers G and G covers F, checked by deriving each set’s FDs from the other using attribute closures.' },
          { q: 'What is a canonical (minimal) cover?', a: 'A canonical cover Fc is a minimal, redundancy-free set of FDs equivalent to the original. It has a single attribute on each right-hand side, no extraneous left-hand-side attributes, and no redundant FDs.' },
          { q: 'How do you compute a minimal cover?', a: 'First split every FD so it has one attribute on the right. Then remove extraneous attributes from left-hand sides using closure tests. Finally remove any FD that can still be derived from the remaining FDs. The result is the minimal cover.' },
          { q: 'How do you check if F covers G?', a: 'For every FD X to Y in G, compute the closure of X using only the FDs in F. If Y is contained in X+ for all such FDs, then F covers G (F implies every dependency in G).' },
          { q: 'Is the minimal cover unique?', a: 'Not necessarily. Depending on the order in which extraneous attributes and redundant FDs are removed, you may arrive at different minimal covers, but all of them are equivalent to the original set.' },
          { q: 'What is an extraneous attribute in a functional dependency?', a: 'An extraneous attribute is one that can be removed from a functional dependency without changing the closure of the FD set. Removing it from the left or right side still yields an equivalent set, so it is redundant.' },
        ],
      },
    ],
  },
  {
    focus: 'Normalization (1NF, 2NF, 3NF)',
    concepts: [
      {
        id: 'dbms-normalization-anomalies',
        topic: 'Why Normalize? Anomalies & Dependencies',
        summary: 'Normalization removes redundancy and the insertion, update, and deletion anomalies.',
        explanation:
          'Normalization is the process of organizing the attributes and tables of a relational database to minimize data redundancy and to eliminate undesirable characteristics called anomalies. It works by decomposing larger, badly structured tables into smaller well-structured ones based on their functional dependencies, in a way that loses no information. The motivation is that a single big table holding repeated data leads to wasted space and, more importantly, to inconsistencies.\n\nThere are three classic anomalies that arise from poor design. An insertion anomaly occurs when you cannot add a piece of data without also having unrelated data; for example, if course information is stored only in a Student-Course table, you cannot record a new course that has no enrolled students yet. An update anomaly occurs when a fact is stored redundantly in many rows and updating it requires changing all copies; if a single copy is missed, the database becomes inconsistent (e.g., a department’s location stored against every employee row). A deletion anomaly occurs when deleting a row unintentionally removes other useful facts; deleting the last student of a course might erase the course details entirely.\n\nNormalization attacks these anomalies by ensuring each fact is stored in exactly one place. The driving theory is functional dependencies: a table is well-formed when its non-key attributes depend on the key, the whole key, and nothing but the key. Two dependency patterns cause trouble. A partial dependency exists when a non-prime attribute depends on only part of a composite candidate key (it violates 2NF). A transitive dependency exists when a non-prime attribute depends on another non-prime attribute rather than directly on the key (it violates 3NF).\n\nA prime attribute is one that is part of some candidate key; a non-prime attribute is one that is not part of any candidate key. This distinction is central to defining the normal forms. The normal forms 1NF, 2NF, 3NF, and BCNF form a hierarchy, each stricter than the last, that progressively removes these problematic dependencies. The goal is a schema that is free of redundancy-driven anomalies while still allowing the original data to be reconstructed by joins.',
        keyPoints: [
          'Normalization decomposes tables to reduce redundancy and remove anomalies',
          'Insertion anomaly: cannot add data without unrelated data being present',
          'Update anomaly: redundant copies must all be updated or data becomes inconsistent',
          'Deletion anomaly: deleting a row loses other useful facts unintentionally',
          'Prime attribute = part of a candidate key; partial/transitive dependencies cause anomalies',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/dbms/introduction-of-database-normalization/' },
        ],
        interview: [
          { q: 'What is normalization?', a: 'Normalization is the process of structuring a relational database by decomposing tables based on functional dependencies to reduce redundancy and eliminate insertion, update, and deletion anomalies, while preserving the ability to reconstruct the original data.' },
          { q: 'What are the types of anomalies in databases?', a: 'Insertion anomaly (cannot add data without unrelated data), update anomaly (redundant copies must all be updated consistently), and deletion anomaly (deleting a row removes other useful facts). They arise from storing the same fact redundantly.' },
          { q: 'What is the difference between a prime and a non-prime attribute?', a: 'A prime attribute is one that is part of some candidate key, while a non-prime (non-key) attribute is not part of any candidate key. This distinction is used in defining 2NF and 3NF.' },
          { q: 'What is a partial dependency?', a: 'A partial dependency occurs when a non-prime attribute depends on only part of a composite candidate key rather than the whole key. It violates second normal form.' },
          { q: 'What is a transitive dependency?', a: 'A transitive dependency occurs when a non-prime attribute depends on another non-prime attribute, which in turn depends on the key, rather than depending directly on the key. It violates third normal form.' },
          { q: 'What are the advantages and disadvantages of normalization?', a: 'Advantages include reduced redundancy, fewer anomalies, and better data integrity. The main disadvantage is that highly normalized schemas require more joins, which can slow read-heavy queries, leading to deliberate denormalization in some analytic systems.' },
        ],
      },
      {
        id: 'dbms-1nf-2nf',
        topic: 'First Normal Form (1NF) & Second Normal Form (2NF)',
        summary: '1NF requires atomic values; 2NF removes partial dependencies on a composite key.',
        explanation:
          'First Normal Form (1NF) requires that every attribute hold only atomic (indivisible) values and that there be no repeating groups or multivalued attributes within a single cell. In other words, each cell contains exactly one value and each row is unique. Consider Student(RollNo, Name, Subjects) where Subjects holds a list like {Math, Physics}. This violates 1NF because the cell is multivalued. To convert to 1NF, give each subject its own row: (1, Ravi, Math) and (1, Ravi, Physics). Now every cell is atomic. After this step the primary key becomes the composite {RollNo, Subject}.\n\nSecond Normal Form (2NF) applies to tables with a composite candidate key and requires two things: the table is already in 1NF, and every non-prime attribute is fully functionally dependent on the whole candidate key, with no partial dependencies. A partial dependency means a non-prime attribute depends on only part of the composite key. Such partial dependencies cause redundancy and anomalies, so 2NF eliminates them.\n\nWorked example. Take StudentCourse(RollNo, CourseID, StudentName, CourseName, Marks) with candidate key {RollNo, CourseID}. Examine the dependencies: StudentName depends only on RollNo (part of the key), CourseName depends only on CourseID (the other part of the key), while Marks depends on both RollNo and CourseID together. So StudentName and CourseName are partially dependent, violating 2NF, and StudentName would be repeated for every course the student takes.\n\nTo convert to 2NF, decompose so each partial dependency gets its own table built around the part of the key it depends on. The result: Student(RollNo, StudentName), Course(CourseID, CourseName), and Enrollment(RollNo, CourseID, Marks). Now in each table every non-prime attribute depends on the entire key of that table, the partial dependencies are gone, and the student and course names are stored once. Note that a relation whose primary key is a single attribute is automatically in 2NF, since partial dependency on part of a single-attribute key is impossible.',
        keyPoints: [
          '1NF: all attribute values are atomic; no repeating groups or multivalued cells',
          'Convert to 1NF by giving each multivalued item its own row',
          '2NF: must be in 1NF and have no partial dependency on a composite key',
          'Partial dependency = non-prime attribute depends on only part of the composite key',
          'A table with a single-attribute primary key is automatically in 2NF',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/dbms/first-normal-form-1nf/' },
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/dbms/second-normal-form-2nf/' },
        ],
        interview: [
          { q: 'What is first normal form (1NF)?', a: 'A relation is in 1NF if every attribute contains only atomic (single, indivisible) values, with no repeating groups or multivalued attributes in a cell, and each row is unique. You achieve it by splitting multivalued cells into separate rows.' },
          { q: 'What is second normal form (2NF)?', a: 'A relation is in 2NF if it is in 1NF and every non-prime attribute is fully functionally dependent on the whole candidate key, with no partial dependencies on part of a composite key.' },
          { q: 'What is a partial dependency? Give an example.', a: 'A partial dependency is when a non-prime attribute depends on only part of a composite key. For example, in (RollNo, CourseID) to ..., if StudentName depends only on RollNo, that is a partial dependency violating 2NF.' },
          { q: 'How do you convert a table to 2NF?', a: 'Identify partial dependencies and move each partially dependent attribute, along with the part of the key it depends on, into a separate table. The original table keeps only attributes that depend on the full key.' },
          { q: 'Is a table with a single-column primary key automatically in 2NF?', a: 'Yes, provided it is already in 1NF. Partial dependency requires a composite key, so with a single-attribute key there can be no partial dependency and the table is automatically in 2NF.' },
          { q: 'Why is 1NF required before 2NF?', a: 'The normal forms are a hierarchy; each builds on the previous one. 2NF presupposes atomic values and a well-defined key, which is exactly what 1NF guarantees, so a relation must satisfy 1NF first.' },
        ],
      },
      {
        id: 'dbms-3nf-overview',
        topic: 'Third Normal Form (3NF) & Beyond',
        summary: '3NF removes transitive dependencies of non-prime attributes; BCNF is even stricter.',
        explanation:
          'Third Normal Form (3NF) builds on 2NF by removing transitive dependencies. A relation is in 3NF if it is in 2NF and no non-prime attribute is transitively dependent on the candidate key, meaning no non-prime attribute depends on another non-prime attribute. Equivalently, for every non-trivial functional dependency X to Y, at least one of two conditions must hold: either X is a super key, or Y is a prime attribute (part of some candidate key). If a dependency fails both conditions, the relation is not in 3NF.\n\nWorked example. Consider Student(RollNo, Name, DeptID, DeptName) with candidate key RollNo and the dependencies RollNo to DeptID and DeptID to DeptName. Here DeptName depends on DeptID, which is itself a non-prime attribute, and DeptID depends on RollNo, so RollNo to DeptName is a transitive dependency through DeptID. This violates 3NF and causes redundancy: every student in the same department repeats the same DeptName, and updating a department name means updating many rows.\n\nTo convert to 3NF, remove the transitively dependent attribute into its own table keyed by the determinant. We decompose into Student(RollNo, Name, DeptID) and Department(DeptID, DeptName). Now DeptName is stored once per department, the transitive dependency is gone, and we can still reconstruct the original by joining on DeptID. This decomposition is lossless and preserves the dependencies.\n\nBeyond 3NF lies Boyce-Codd Normal Form (BCNF), a stricter version that requires the determinant X of every non-trivial FD to be a super key (it drops the prime-attribute escape clause of 3NF). BCNF handles certain edge cases with overlapping candidate keys that 3NF allows, so every BCNF relation is in 3NF but not always vice versa. Higher forms such as 4NF (which removes multivalued dependencies) and 5NF exist for more specialized situations. For most practical placement-prep purposes, designing up to 3NF (and ideally BCNF) removes the common redundancy anomalies while keeping the schema usable; BCNF and 4NF are covered in detail separately.',
        keyPoints: [
          '3NF: in 2NF and no non-prime attribute transitively depends on the key',
          'Rule: for each non-trivial X to Y, X is a super key OR Y is a prime attribute',
          'Transitive dependency = non-prime attribute depends on another non-prime attribute',
          'Convert by moving the transitively dependent attribute to a table keyed by its determinant',
          'BCNF is stricter (determinant must be a super key); 4NF/5NF go further',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/dbms/third-normal-form-3nf/' },
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/dbms/boyce-codd-normal-form-bcnf/' },
        ],
        interview: [
          { q: 'What is third normal form (3NF)?', a: 'A relation is in 3NF if it is in 2NF and has no transitive dependency of a non-prime attribute on the candidate key. Equivalently, for every non-trivial FD X to Y, either X is a super key or Y is a prime attribute.' },
          { q: 'What is the difference between 2NF and 3NF?', a: '2NF removes partial dependencies, where a non-prime attribute depends on part of a composite key. 3NF additionally removes transitive dependencies, where a non-prime attribute depends on another non-prime attribute rather than directly on the key.' },
          { q: 'How do you convert a table to 3NF?', a: 'Identify transitive dependencies and move the transitively dependent attribute, together with its determinant, into a new table keyed by that determinant. The original table keeps a foreign key to the new table. This is lossless and dependency-preserving.' },
          { q: 'What is the difference between 3NF and BCNF?', a: '3NF allows a non-trivial FD X to Y if X is a super key or Y is a prime attribute. BCNF is stricter and requires X to be a super key for every non-trivial FD, removing the prime-attribute exception. Every BCNF relation is in 3NF but not vice versa.' },
          { q: 'What is a transitive dependency? Give an example.', a: 'It is when a non-prime attribute depends on the key only through another non-prime attribute. For example, RollNo to DeptID and DeptID to DeptName makes DeptName transitively dependent on RollNo, violating 3NF.' },
          { q: 'Why do we usually normalize up to 3NF in practice?', a: '3NF removes most redundancy-driven anomalies while keeping the schema simple and queryable without excessive joins. It is a good balance, and going to BCNF or higher is done only when specific dependency problems remain.' },
        ],
      },
    ],
  },
]
