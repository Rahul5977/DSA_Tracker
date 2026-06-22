// DBMS curriculum — Part 2 (Days 7–12): BCNF & higher normal forms, SQL,
// joins & subqueries, transactions & ACID, concurrency control, and indexing.
// Runs after dbms.js (Days 1–6) in the same subject.
// Each day: { focus, concepts: [ { id, topic, summary, explanation, keyPoints, links, interview } ] }

export const DAYS = [
  {
    focus: 'BCNF & Higher Normal Forms',
    concepts: [
      {
        id: 'dbms-bcnf',
        topic: 'Boyce-Codd Normal Form (BCNF)',
        summary: 'A stricter 3NF: every determinant must be a candidate key.',
        explanation:
          'Boyce-Codd Normal Form (BCNF, sometimes called 3.5NF) is a stronger version of the Third Normal Form. A relation is in BCNF if it is already in 3NF and, for every non-trivial functional dependency X -> Y that holds, the left-hand side X is a superkey of the relation. In other words, the only determinants allowed in the relation are candidate keys (or supersets of them). This removes a class of anomalies that 3NF still permits.\n\nRecall that 3NF allows a dependency A -> B to exist as long as either A is a superkey OR B is a prime attribute (part of some candidate key). BCNF drops the second escape hatch entirely: B being a prime attribute is no longer an excuse. So the difference is precisely that 3NF tolerates a non-key determinant when the dependent attribute is part of a candidate key, while BCNF never tolerates a non-key determinant.\n\nThe classic example that is in 3NF but not in BCNF: a relation Enroll(Student, Subject, Teacher) where (a) each Teacher teaches exactly one Subject, and (b) each (Student, Subject) pair maps to one Teacher. The candidate keys are {Student, Subject} and {Student, Teacher}. The dependency Teacher -> Subject holds. This relation is in 3NF because Subject is a prime attribute (it appears in candidate key {Student, Subject}). But it violates BCNF because Teacher is not a superkey yet it determines Subject. The fix is to decompose into Teaches(Teacher, Subject) and Studies(Student, Teacher).\n\nDecomposing into BCNF is always lossless, but BCNF decomposition is not always dependency-preserving. That is the price BCNF pays: in some schemas you cannot reach BCNF without losing the ability to enforce every original functional dependency using single-table constraints. 3NF, by contrast, can always be achieved while preserving all dependencies and remaining lossless, which is why 3NF is often the practical stopping point even though BCNF is theoretically cleaner.',
        keyPoints: [
          'BCNF: for every non-trivial FD X -> Y, X must be a superkey',
          'Stricter than 3NF — removes 3NF\'s "B is a prime attribute" exception',
          'Every BCNF relation is in 3NF, but not vice versa',
          'BCNF decomposition is always lossless but may not preserve dependencies',
          'Classic 3NF-but-not-BCNF: a non-key attribute determines a prime attribute',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/boyce-codd-normal-form-bcnf/' },
        ],
        interview: [
          { q: 'What is BCNF?', a: 'BCNF (Boyce-Codd Normal Form) is a normal form in which a relation is in 3NF and every non-trivial functional dependency X -> Y has X as a superkey. It allows only candidate keys as determinants.' },
          { q: 'How does BCNF differ from 3NF?', a: '3NF allows a dependency A -> B if A is a superkey OR B is a prime attribute. BCNF removes the second condition: every determinant must be a superkey. So BCNF is strictly stronger than 3NF.' },
          { q: 'Give an example that is in 3NF but not in BCNF.', a: 'Enroll(Student, Subject, Teacher) where Teacher -> Subject and each (Student, Subject) gives one Teacher. Candidate keys are {Student, Subject} and {Student, Teacher}. It is 3NF because Subject is prime, but Teacher is a non-key determinant, violating BCNF.' },
          { q: 'Is BCNF decomposition always dependency-preserving?', a: 'No. BCNF decomposition is always lossless but may fail to preserve dependencies, meaning some original FD can no longer be enforced on a single decomposed table. 3NF can always be both lossless and dependency-preserving.' },
          { q: 'Why might engineers stop at 3NF instead of BCNF?', a: 'Because 3NF guarantees a lossless and dependency-preserving decomposition, while BCNF may force you to sacrifice dependency preservation. Keeping dependencies enforceable on single tables is often worth more in practice than eliminating the last redundancy.' },
          { q: 'Can a relation with only two attributes ever violate BCNF?', a: 'No. Any relation with two attributes is automatically in BCNF, because every non-trivial FD on two attributes has a single attribute as determinant which is necessarily a candidate key.' },
        ],
      },
      {
        id: 'dbms-lossless-dependency-decomposition',
        topic: 'Lossless-Join vs Dependency-Preserving Decomposition',
        summary: 'The two correctness properties any decomposition should aim to satisfy.',
        explanation:
          'When we decompose a relation R into smaller relations R1, R2, ... to remove redundancy, we want the decomposition to be correct. Two properties capture correctness: lossless-join and dependency preservation.\n\nA decomposition is lossless-join (or non-additive) if, when you natural-join the decomposed relations back together, you recover exactly the original relation with no spurious extra tuples. For a binary decomposition of R into R1 and R2, the test is: the decomposition is lossless if and only if the common attributes (R1 intersect R2) form a superkey of at least one of R1 or R2. Formally, (R1 ∩ R2) -> R1 or (R1 ∩ R2) -> R2 must hold. A lossy decomposition is unacceptable because it corrupts data — re-joining produces phantom rows.\n\nA decomposition is dependency-preserving if the set of functional dependencies that can be enforced on the individual decomposed relations (the union of the projected FDs, F1 ∪ F2 ∪ ...) is equivalent to (has the same closure as) the original FD set F. Dependency preservation matters because if a dependency spans two tables after decomposition, you can only check it by joining them, which is expensive and is not enforced by ordinary single-table constraints.\n\nThe two properties are independent. A lossless-join decomposition might not be dependency-preserving and vice versa. The golden rule: lossless-join is mandatory (you must never lose data), while dependency preservation is highly desirable but sometimes sacrificed (notably when forcing BCNF). 3NF synthesis algorithms are designed to always deliver both, which is the main theoretical reason 3NF is so widely used.',
        keyPoints: [
          'Lossless-join: re-joining decomposed tables yields the original exactly (no spurious tuples)',
          'Binary test: common attributes must be a superkey of at least one sub-relation',
          'Dependency-preserving: all original FDs remain enforceable on single tables',
          'The two properties are independent of each other',
          'Lossless is mandatory; dependency preservation is desirable but sometimes given up for BCNF',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/lossless-join-and-dependency-preserving-decomposition/' },
        ],
        interview: [
          { q: 'What is a lossless-join decomposition?', a: 'A decomposition is lossless-join if natural-joining the decomposed relations reproduces the original relation exactly, with no extra spurious tuples. It guarantees no information is lost or fabricated.' },
          { q: 'How do you test a binary decomposition for lossless join?', a: 'Decomposing R into R1 and R2 is lossless if and only if the common attributes R1 ∩ R2 functionally determine all of R1 or all of R2 — i.e., the shared attributes form a superkey of at least one sub-relation.' },
          { q: 'What does dependency-preserving mean?', a: 'It means the union of FDs that can be checked on the individual decomposed tables has the same closure as the original FD set, so every original dependency can still be enforced without joining tables.' },
          { q: 'Are lossless-join and dependency preservation related?', a: 'They are independent properties. A decomposition can be lossless but not dependency-preserving, or dependency-preserving but lossy. We always require lossless, and prefer dependency-preserving.' },
          { q: 'Why is dependency preservation important?', a: 'If a functional dependency spans multiple decomposed tables, enforcing it requires a join on every insert/update, which is costly and not expressible as a simple single-table constraint. Preserving dependencies keeps integrity checks cheap.' },
          { q: 'Which normal form guarantees both properties?', a: '3NF can always be achieved with a decomposition that is both lossless and dependency-preserving. BCNF guarantees lossless but may not preserve dependencies.' },
        ],
      },
      {
        id: 'dbms-mvd-4nf-5nf',
        topic: 'Multivalued Dependencies, 4NF, Join Dependency & 5NF',
        summary: 'Beyond functional dependencies: removing multivalued and join-based redundancy.',
        explanation:
          'A multivalued dependency (MVD), written X ->> Y, exists when, for a given value of X, there is a set of values of Y that is independent of the other attributes. MVDs capture "many-to-many-to-many" facts stored in one table. Example: a table Course(Course, Instructor, Textbook) where a course has several independent instructors and several independent textbooks. Storing them together forces a Cartesian product of instructors and textbooks for each course, creating redundancy even though there is no functional dependency causing it.\n\nFourth Normal Form (4NF) addresses MVDs. A relation is in 4NF if it is in BCNF and, for every non-trivial multivalued dependency X ->> Y, X is a superkey. The Course example is in BCNF (the whole tuple is the key) but violates 4NF because Course ->> Instructor and Course ->> Textbook with Course not being a superkey. The fix is to split into CourseInstructor(Course, Instructor) and CourseTextbook(Course, Textbook), eliminating the spurious combinations.\n\nA join dependency is a more general constraint: it says a relation can be reconstructed by joining several of its projections (not just two). Fifth Normal Form (5NF), also called Project-Join Normal Form (PJNF), deals with these. A relation is in 5NF if it is in 4NF and every join dependency in it is implied by its candidate keys — meaning any lossless decomposition into three or more parts is already a consequence of the keys. 5NF removes redundancy that arises only from cyclic relationships among three or more entities and cannot be expressed via FDs or MVDs.\n\nIn practice 4NF is occasionally needed, while 5NF situations are rare and usually arise in complex many-to-many-to-many relationships (e.g., supplier-part-project). Most production schemas stop at 3NF or BCNF; 4NF/5NF are applied selectively where multivalued or join anomalies are demonstrably present.',
        keyPoints: [
          'MVD X ->> Y: for each X there is a set of Y values independent of other attributes',
          '4NF = BCNF + every non-trivial MVD has a superkey on its left side',
          '4NF removes Cartesian-product redundancy from independent multivalued facts',
          'Join dependency: relation reconstructable by joining 3+ projections',
          '5NF (PJNF) = 4NF + every join dependency implied by candidate keys',
          '4NF is sometimes needed; 5NF cases are rare in practice',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/the-problem-of-redundancy-in-database/' },
          { label: 'GeeksforGeeks 4NF', url: 'https://www.geeksforgeeks.org/fourth-normal-form-4nf/' },
        ],
        interview: [
          { q: 'What is a multivalued dependency?', a: 'A multivalued dependency X ->> Y holds when for each value of X there is a set of Y values that is independent of the remaining attributes. It models independent many-valued facts stored in one relation.' },
          { q: 'What is 4NF?', a: 'A relation is in Fourth Normal Form if it is in BCNF and for every non-trivial multivalued dependency X ->> Y, X is a superkey. It eliminates redundancy caused by independent multivalued attributes.' },
          { q: 'How can a relation be in BCNF but not 4NF?', a: 'If the whole tuple is the only key (so no FD is violated) but two independent multivalued attributes coexist — like Course(Course, Instructor, Textbook) — the table is BCNF yet has MVD redundancy, so it violates 4NF.' },
          { q: 'What is a join dependency?', a: 'A join dependency states that a relation equals the natural join of several of its projections. It generalizes MVDs (which are join dependencies over two projections) to three or more projections.' },
          { q: 'What is 5NF?', a: '5NF, or Project-Join Normal Form, requires the relation to be in 4NF and every join dependency to be implied by candidate keys. It removes redundancy arising from cyclic multi-entity relationships.' },
          { q: 'Why is 5NF rarely used in practice?', a: 'Genuine join-dependency anomalies are uncommon, usually appearing only in complex many-to-many-to-many relationships. The extra decomposition adds joins and complexity, so most schemas stop at 3NF/BCNF.' },
        ],
      },
      {
        id: 'dbms-denormalization',
        topic: 'Over-Normalization & Denormalization',
        summary: 'When breaking normalization rules deliberately improves performance.',
        explanation:
          'Normalization minimizes redundancy and update anomalies, but it does so by splitting data across many tables. Every query that needs related data must then join those tables back together. As schemas grow highly normalized, read queries require more and more joins, which can hurt performance for read-heavy workloads. This is the trade-off: normalization optimizes for write integrity and storage; it can be costly for reads.\n\nDenormalization is the deliberate introduction of controlled redundancy into a normalized schema to improve read performance. Common techniques include storing precomputed aggregates (e.g., an order_total column instead of summing line items every time), duplicating a frequently joined attribute into a child table (e.g., copying customer_name into orders), and maintaining summary or materialized-view tables. The goal is to trade extra storage and write complexity for faster reads.\n\nThe cost of denormalization is that the duplicated data must be kept consistent. Every update to the source now has to update the copies too, usually via application logic, triggers, or scheduled jobs. This reintroduces the update anomalies normalization was designed to prevent, so it must be done consciously and documented. A common rule: normalize first to a correct design, then denormalize selectively only where profiling shows a real read bottleneck.\n\nDenormalization is especially common in analytical/OLAP systems and data warehouses (star and snowflake schemas), where reads dominate and data is loaded in bulk, so consistency of duplicated data is easier to manage. Transactional OLTP systems tend to stay more normalized because their workloads are write-heavy and integrity-critical.',
        keyPoints: [
          'Highly normalized schemas need many joins, which can slow read-heavy queries',
          'Denormalization adds controlled redundancy to speed up reads',
          'Techniques: precomputed aggregates, duplicated columns, summary/materialized tables',
          'Cost: duplicated data must be kept in sync, risking update anomalies',
          'Best practice: normalize first, denormalize selectively based on profiling',
          'Common in OLAP/data warehouses; OLTP systems stay more normalized',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/denormalization-in-databases/' },
        ],
        interview: [
          { q: 'What is denormalization?', a: 'Denormalization is the intentional introduction of redundancy into a normalized database to improve read/query performance, typically by reducing the number of joins needed.' },
          { q: 'When would you denormalize?', a: 'When a normalized schema causes too many costly joins for read-heavy workloads, and profiling shows a real bottleneck. It is common in reporting, analytics, and data-warehouse systems.' },
          { q: 'What is the downside of denormalization?', a: 'Duplicated data must be kept consistent across copies, which complicates writes and can reintroduce update, insertion, and deletion anomalies that normalization avoids.' },
          { q: 'How does normalization affect performance?', a: 'Normalization improves write integrity and reduces storage and redundancy, but increases the number of joins for reads, which can degrade read performance in large schemas.' },
          { q: 'Give examples of denormalization techniques.', a: 'Storing precomputed totals, duplicating frequently joined columns into child tables, and maintaining summary or materialized-view tables that cache join/aggregate results.' },
          { q: 'Why are data warehouses often denormalized?', a: 'They are read-heavy and load data in bulk, so the consistency overhead of redundancy is manageable, while the read speedup from fewer joins (e.g., star schemas) is very valuable.' },
        ],
      },
    ],
  },
  {
    focus: 'SQL Basics & Queries',
    concepts: [
      {
        id: 'dbms-sql-sublanguages',
        topic: 'SQL Sublanguages: DDL, DML, DCL, TCL',
        summary: 'The four command families that make up SQL and what each one does.',
        explanation:
          'SQL (Structured Query Language) is divided into sublanguages grouped by the kind of operation they perform. Knowing these categories helps you reason about what a statement affects and whether it is transactional.\n\nDDL (Data Definition Language) defines and modifies the structure of database objects. Its commands are CREATE (make a table, view, index, schema), ALTER (change a structure, e.g., add a column), DROP (delete an object entirely), and TRUNCATE (remove all rows quickly). DDL statements are auto-committed in most databases — they cannot normally be rolled back.\n\nDML (Data Manipulation Language) works with the data inside objects. Its core commands are INSERT (add rows), UPDATE (modify rows), DELETE (remove rows), and SELECT (read rows; some texts classify SELECT as DQL, Data Query Language). DML changes are transactional, so they can be committed or rolled back.\n\nDCL (Data Control Language) manages permissions and access rights: GRANT (give privileges to a user/role) and REVOKE (take them back). TCL (Transaction Control Language) manages transactions: COMMIT (make changes permanent), ROLLBACK (undo changes since the last commit), and SAVEPOINT (set a marker to which you can partially roll back). Together, DML+TCL give you transactional control over data, while DDL+DCL govern structure and access.',
        keyPoints: [
          'DDL: CREATE, ALTER, DROP, TRUNCATE — defines structure, usually auto-committed',
          'DML: INSERT, UPDATE, DELETE (and SELECT/DQL) — manipulates data, transactional',
          'DCL: GRANT, REVOKE — controls access and privileges',
          'TCL: COMMIT, ROLLBACK, SAVEPOINT — controls transactions',
          'DDL changes typically cannot be rolled back; DML changes can',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/sql-ddl-dql-dml-dcl-tcl-commands/' },
        ],
        interview: [
          { q: 'What are the sublanguages of SQL?', a: 'DDL (define structure: CREATE/ALTER/DROP/TRUNCATE), DML (manipulate data: INSERT/UPDATE/DELETE, plus SELECT as DQL), DCL (access control: GRANT/REVOKE), and TCL (transaction control: COMMIT/ROLLBACK/SAVEPOINT).' },
          { q: 'Is SELECT a DDL or DML command?', a: 'SELECT manipulates/retrieves data, so it is part of DML; some classifications separate it as DQL (Data Query Language). Either way it reads data and does not change structure.' },
          { q: 'Can DDL statements be rolled back?', a: 'In most databases (e.g., MySQL, Oracle) DDL is auto-committed and cannot be rolled back. Some databases like PostgreSQL support transactional DDL, allowing rollback of CREATE/ALTER/DROP inside a transaction.' },
          { q: 'What is the difference between DCL and TCL?', a: 'DCL (GRANT/REVOKE) manages who can access objects and what privileges they have. TCL (COMMIT/ROLLBACK/SAVEPOINT) manages the boundaries and durability of a transaction.' },
          { q: 'Which category does GRANT belong to?', a: 'GRANT belongs to DCL (Data Control Language), used to give privileges such as SELECT, INSERT, or ALL on database objects to users or roles.' },
        ],
      },
      {
        id: 'dbms-sql-select',
        topic: 'SELECT, WHERE, DISTINCT, ORDER BY, LIMIT',
        summary: 'The core of querying: filtering, deduplicating, sorting, and paging rows.',
        explanation:
          'SELECT retrieves rows from one or more tables. The basic form is SELECT <columns> FROM <table>. Using SELECT * returns all columns, while listing specific columns is preferred in production for clarity and to avoid fetching unneeded data. The WHERE clause filters rows by a predicate, e.g., SELECT name, salary FROM emp WHERE salary > 50000. WHERE supports comparison operators (=, <>, <, >, <=, >=), logical operators (AND, OR, NOT), and special predicates like BETWEEN, IN, LIKE (pattern match with % and _), and IS NULL.\n\nDISTINCT removes duplicate rows from the result. SELECT DISTINCT department FROM emp returns each department once. It applies to the whole selected row, so SELECT DISTINCT a, b dedupes on the combination of a and b.\n\nORDER BY sorts the result, ascending by default; add DESC for descending. You can sort by multiple columns: ORDER BY dept ASC, salary DESC sorts by department then by salary within each department. You can also order by column position (ORDER BY 2) or by an alias.\n\nLIMIT restricts how many rows are returned, often combined with an offset for pagination: SELECT * FROM emp ORDER BY id LIMIT 10 OFFSET 20 returns rows 21-30. Syntax varies by vendor — MySQL/PostgreSQL use LIMIT, SQL Server uses TOP or OFFSET ... FETCH, and Oracle historically used ROWNUM or now FETCH FIRST. The logical processing order is roughly FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> DISTINCT -> ORDER BY -> LIMIT, which is why a column alias defined in SELECT can be used in ORDER BY but not in WHERE.',
        keyPoints: [
          'WHERE filters rows using comparison, logical, BETWEEN, IN, LIKE, IS NULL predicates',
          'DISTINCT removes duplicate rows across the whole selected column set',
          'ORDER BY sorts ASC (default) or DESC, and supports multiple keys',
          'LIMIT/OFFSET pages results; syntax differs (TOP, FETCH FIRST) by vendor',
          'Logical order: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/sql-select-query/' },
        ],
        interview: [
          { q: 'What is the difference between WHERE and HAVING?', a: 'WHERE filters individual rows before grouping and cannot use aggregate functions. HAVING filters groups after GROUP BY and can use aggregates like COUNT or SUM. WHERE runs first, HAVING later.' },
          { q: 'What does DISTINCT do?', a: 'DISTINCT eliminates duplicate rows from the result set, deduplicating based on the full combination of the selected columns.' },
          { q: 'Why can you use a column alias in ORDER BY but not in WHERE?', a: 'Because of logical query processing order: WHERE is evaluated before SELECT (where aliases are created), but ORDER BY is evaluated after SELECT, so the alias already exists by then.' },
          { q: 'How do you paginate results in SQL?', a: 'Use LIMIT with OFFSET (MySQL/PostgreSQL), e.g., LIMIT 10 OFFSET 20 for rows 21-30. SQL Server uses OFFSET ... FETCH NEXT, and you should always pair pagination with a deterministic ORDER BY.' },
          { q: 'What is the difference between LIKE and = in WHERE?', a: '= tests exact equality, while LIKE matches patterns using wildcards % (any sequence of characters) and _ (single character), e.g., WHERE name LIKE \'A%\' finds names starting with A.' },
          { q: 'What is the logical order of execution of a SELECT query?', a: 'FROM/JOIN, then WHERE, then GROUP BY, then HAVING, then SELECT, then DISTINCT, then ORDER BY, and finally LIMIT/OFFSET — different from the written order.' },
        ],
      },
      {
        id: 'dbms-sql-aggregates-groupby',
        topic: 'Aggregate Functions, GROUP BY & HAVING',
        summary: 'Summarizing rows into per-group results with COUNT/SUM/AVG and filtering groups.',
        explanation:
          'Aggregate functions compute a single value over a set of rows. The standard five are COUNT (number of rows or non-null values), SUM (total), AVG (average), MIN (smallest), and MAX (largest). For example SELECT AVG(salary) FROM emp returns one number. COUNT(*) counts all rows including those with NULLs, while COUNT(column) counts only rows where that column is non-null, and COUNT(DISTINCT column) counts distinct non-null values.\n\nGROUP BY partitions rows into groups that share the same values in the listed columns and applies the aggregate to each group. Example: SELECT dept, COUNT(*) AS headcount, AVG(salary) AS avg_pay FROM emp GROUP BY dept produces one row per department. A key rule: every column in the SELECT list that is not inside an aggregate function must appear in the GROUP BY clause (strict SQL mode enforces this).\n\nHAVING filters the groups produced by GROUP BY, using aggregate conditions. For example SELECT dept, AVG(salary) AS avg_pay FROM emp GROUP BY dept HAVING AVG(salary) > 60000 returns only departments whose average salary exceeds 60000. You cannot put AVG(salary) > 60000 in WHERE because WHERE runs before grouping and aggregates do not yet exist there.\n\nA common subtlety is how aggregates treat NULL: all aggregates except COUNT(*) ignore NULL values. So AVG(salary) over rows where some salaries are NULL averages only the non-null salaries, which can differ from SUM(salary)/COUNT(*). Understanding this prevents off-by-one and wrong-average bugs in reports.',
        keyPoints: [
          'Aggregates: COUNT, SUM, AVG, MIN, MAX collapse many rows into one value',
          'COUNT(*) counts all rows; COUNT(col) ignores NULLs; COUNT(DISTINCT col) counts unique non-nulls',
          'GROUP BY partitions rows; non-aggregated SELECT columns must be in GROUP BY',
          'HAVING filters groups using aggregate predicates (WHERE cannot)',
          'All aggregates except COUNT(*) ignore NULL values',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/sql-group-by/' },
        ],
        interview: [
          { q: 'What is the difference between COUNT(*) and COUNT(column)?', a: 'COUNT(*) counts every row including those with NULLs. COUNT(column) counts only rows where that column is not NULL. COUNT(DISTINCT column) counts distinct non-null values.' },
          { q: 'What is the difference between WHERE and HAVING again, with aggregates?', a: 'WHERE filters rows before aggregation and cannot reference aggregate functions; HAVING filters after GROUP BY and is the only place to apply conditions on aggregates like AVG or SUM.' },
          { q: 'Can you use GROUP BY without an aggregate function?', a: 'Yes, it behaves like SELECT DISTINCT on the grouped columns, returning one row per distinct combination, but it is usually paired with aggregates to be meaningful.' },
          { q: 'How do aggregate functions handle NULL?', a: 'All aggregates except COUNT(*) ignore NULL values. So AVG, SUM, MIN, MAX, and COUNT(column) operate only on non-null entries.' },
          { q: 'Why must non-aggregated SELECT columns appear in GROUP BY?', a: 'Because each output row represents a group; a column not aggregated and not in GROUP BY has no single well-defined value per group, so standard/strict SQL rejects it.' },
          { q: 'Can HAVING be used without GROUP BY?', a: 'Yes; HAVING without GROUP BY treats the entire result as one group, so a condition like HAVING COUNT(*) > 100 filters based on the whole-table aggregate.' },
        ],
      },
      {
        id: 'dbms-sql-constraints',
        topic: 'Constraints & NULL / Three-Valued Logic',
        summary: 'Enforcing data integrity with constraints, and why NULL needs three-valued logic.',
        explanation:
          'Constraints are rules enforced by the database to keep data valid. The main ones: NOT NULL ensures a column cannot store NULL. UNIQUE ensures all values in a column (or column set) are distinct, though it allows one NULL in most databases. PRIMARY KEY uniquely identifies each row and is effectively UNIQUE + NOT NULL; a table has at most one primary key. FOREIGN KEY enforces referential integrity by requiring a value to match a primary/unique key in another table, supporting actions like ON DELETE CASCADE. CHECK enforces a boolean condition, e.g., CHECK (age >= 18). DEFAULT supplies a value when none is given on insert.\n\nDDL example: CREATE TABLE emp ( id INT PRIMARY KEY, name VARCHAR(50) NOT NULL, age INT CHECK (age >= 18), dept_id INT DEFAULT 1, email VARCHAR(100) UNIQUE, FOREIGN KEY (dept_id) REFERENCES dept(id) ). This single statement enforces uniqueness, mandatory fields, a value check, a default, and a cross-table reference.\n\nNULL represents an unknown or inapplicable value — not zero and not an empty string. Because the value is unknown, comparisons involving NULL do not return TRUE or FALSE but a third truth value, UNKNOWN. This is three-valued logic (3VL): predicates evaluate to TRUE, FALSE, or UNKNOWN. For instance, NULL = NULL is UNKNOWN, not TRUE, which is why you must use IS NULL / IS NOT NULL to test for nulls rather than = NULL.\n\nThree-valued logic affects query results in subtle ways: WHERE keeps only rows where the predicate is TRUE (UNKNOWN rows are dropped), so WHERE salary > 1000 excludes rows with NULL salary. Aggregates ignore NULLs, and NULLs require special handling in joins, NOT IN subqueries (which can return no rows if the list contains a NULL), and arithmetic (anything + NULL = NULL). Functions like COALESCE and IFNULL/NVL are used to substitute defaults for NULLs.',
        keyPoints: [
          'Constraints: NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, CHECK, DEFAULT',
          'PRIMARY KEY = UNIQUE + NOT NULL; FOREIGN KEY enforces referential integrity',
          'NULL means unknown/inapplicable — not 0 and not empty string',
          'Comparisons with NULL yield UNKNOWN (three-valued logic), so use IS NULL',
          'WHERE keeps only TRUE rows; UNKNOWN rows are excluded',
          'Use COALESCE/IFNULL/NVL to substitute values for NULL',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/sql-constraints/' },
          { label: 'GeeksforGeeks NULL', url: 'https://www.geeksforgeeks.org/sql-null-values/' },
        ],
        interview: [
          { q: 'What is the difference between PRIMARY KEY and UNIQUE?', a: 'A primary key is unique and NOT NULL, and there is only one per table. A UNIQUE constraint also enforces distinct values but usually permits a single NULL, and a table may have many UNIQUE constraints.' },
          { q: 'What is the difference between NULL and an empty string or zero?', a: 'NULL means the value is unknown or not applicable. An empty string and zero are known, defined values. NULL is not equal to anything, including another NULL.' },
          { q: 'Why does NULL = NULL not return TRUE?', a: 'Because NULL is unknown, the comparison cannot be confirmed true, so it evaluates to UNKNOWN under three-valued logic. You must use IS NULL to test for a NULL value.' },
          { q: 'What is three-valued logic in SQL?', a: 'SQL predicates can evaluate to TRUE, FALSE, or UNKNOWN. UNKNOWN arises when NULL is involved in a comparison. WHERE and HAVING keep only rows where the predicate is TRUE.' },
          { q: 'What does a CHECK constraint do?', a: 'A CHECK constraint enforces a boolean condition on column values, rejecting any insert or update that makes it false, e.g., CHECK (salary > 0).' },
          { q: 'How does NOT IN behave when the list contains NULL?', a: 'If a NOT IN subquery/list contains a NULL, the whole predicate can evaluate to UNKNOWN for every row, returning no rows. EXISTS or filtering out NULLs avoids this trap.' },
        ],
      },
      {
        id: 'dbms-delete-truncate-drop',
        topic: 'DELETE vs TRUNCATE vs DROP',
        summary: 'Three ways to remove data/objects with very different semantics.',
        explanation:
          'These three commands all "remove" things but operate at different levels and with different consequences. DELETE is a DML command that removes rows from a table based on an optional WHERE clause: DELETE FROM emp WHERE dept_id = 3. Without WHERE it deletes all rows but keeps the table structure. Because it is DML, it is fully transactional (can be rolled back), fires row-level triggers, and logs each deleted row, making it slower for large deletions. It does not reset auto-increment counters.\n\nTRUNCATE is a DDL command that removes all rows from a table at once, like resetting it to empty. It cannot have a WHERE clause. It is much faster than DELETE because it deallocates the data pages rather than logging individual row deletions, generally does not fire row-level triggers, and typically resets identity/auto-increment counters. In most databases TRUNCATE is auto-committed and cannot be rolled back (PostgreSQL is an exception inside a transaction). The table structure, columns, and constraints remain.\n\nDROP is a DDL command that removes the entire object — the table definition, its data, indexes, triggers, and constraints — from the database. DROP TABLE emp leaves nothing behind; the table no longer exists. Like other DDL it is generally auto-committed and not rollback-able in most systems.\n\nSummary of the trade-offs: DELETE = selective, transactional, slower, structure kept, counters not reset. TRUNCATE = all rows, fast, usually non-rollbackable, structure kept, counters reset. DROP = removes the object entirely. A common interview line: DELETE removes rows, TRUNCATE empties a table, DROP destroys the table.',
        keyPoints: [
          'DELETE: DML, can use WHERE, transactional/rollbackable, fires triggers, slower',
          'TRUNCATE: DDL, removes all rows fast, no WHERE, resets identity, usually not rollbackable',
          'DROP: DDL, removes the entire table/object (structure + data + indexes)',
          'DELETE and TRUNCATE keep the table structure; DROP does not',
          'TRUNCATE generally skips row-level triggers and logging; DELETE does not',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/difference-between-delete-and-truncate/' },
        ],
        interview: [
          { q: 'What is the difference between DELETE, TRUNCATE, and DROP?', a: 'DELETE (DML) removes selected rows and can be rolled back; TRUNCATE (DDL) quickly removes all rows, resets identity, and is usually non-rollbackable; DROP (DDL) removes the entire table including its structure. DELETE and TRUNCATE keep the table; DROP deletes it.' },
          { q: 'Which is faster, DELETE or TRUNCATE, and why?', a: 'TRUNCATE is faster because it deallocates data pages and logs minimal information, while DELETE logs each row removal and fires row triggers, making it slower for large tables.' },
          { q: 'Can TRUNCATE be rolled back?', a: 'In most databases (MySQL, Oracle) TRUNCATE is auto-committed and cannot be rolled back. PostgreSQL allows rolling it back when executed inside a transaction.' },
          { q: 'Does TRUNCATE reset the auto-increment counter?', a: 'Yes, TRUNCATE typically resets identity/auto-increment values to their seed, whereas DELETE leaves the counter unchanged.' },
          { q: 'Can you use a WHERE clause with TRUNCATE?', a: 'No. TRUNCATE always removes all rows of a table; to delete a subset you must use DELETE with a WHERE clause.' },
          { q: 'After DROP TABLE, can you still query the table?', a: 'No. DROP removes the table definition and all associated data, indexes, and constraints, so the table no longer exists and querying it raises an error.' },
        ],
      },
    ],
  },
  {
    focus: 'Joins & Subqueries',
    concepts: [
      {
        id: 'dbms-sql-joins',
        topic: 'Joins: INNER, LEFT, RIGHT, FULL OUTER, CROSS, SELF, NATURAL',
        summary: 'Combining rows across tables, with examples of how each join shapes the output.',
        explanation:
          'A join combines rows from two or more tables based on a related column. Consider Employee(id, name, dept_id) with rows (1, Asha, 10), (2, Ravi, 20), (3, Meena, NULL), and Department(dept_id, dname) with rows (10, HR), (30, Finance).\n\nINNER JOIN returns only rows with a match in both tables. Emp INNER JOIN Dept ON emp.dept_id = dept.dept_id returns just (Asha, HR), because Ravi\'s dept 20 and Meena\'s NULL have no match, and Finance has no employee. LEFT (OUTER) JOIN returns all rows from the left table plus matches from the right, filling NULLs where there is no match: it returns (Asha, HR), (Ravi, NULL), (Meena, NULL). RIGHT (OUTER) JOIN does the mirror: all right rows plus matches, returning (Asha, HR), (NULL, Finance). FULL OUTER JOIN returns all rows from both sides, matched where possible: (Asha, HR), (Ravi, NULL), (Meena, NULL), (NULL, Finance).\n\nCROSS JOIN produces the Cartesian product — every row of the left paired with every row of the right (no ON clause). With 3 employees and 2 departments it yields 6 rows. SELF JOIN joins a table to itself using aliases, useful for hierarchies, e.g., finding each employee\'s manager from an Employee(id, name, manager_id) table by joining Employee e1 to Employee e2 ON e1.manager_id = e2.id. NATURAL JOIN automatically joins on all columns that share the same name in both tables and removes the duplicate column from the output; it is convenient but risky because it silently changes behavior if columns are added/renamed, so explicit ON/USING is generally preferred.\n\nIn short: INNER keeps only matches, LEFT/RIGHT keep all of one side, FULL keeps all of both, CROSS pairs everything, SELF relates a table to itself, and NATURAL auto-matches same-named columns.',
        keyPoints: [
          'INNER JOIN: only rows matching in both tables',
          'LEFT/RIGHT OUTER JOIN: all rows of one side + matches, NULLs for the rest',
          'FULL OUTER JOIN: all rows from both sides, matched where possible',
          'CROSS JOIN: Cartesian product (every combination), no ON clause',
          'SELF JOIN: a table joined to itself via aliases (e.g., employee-manager)',
          'NATURAL JOIN: auto-joins on same-named columns; explicit ON is safer',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/sql-join-set-1-inner-left-right-and-full-joins/' },
        ],
        interview: [
          { q: 'What is the difference between INNER JOIN and OUTER JOIN?', a: 'INNER JOIN returns only rows that have matching values in both tables. OUTER JOIN (LEFT, RIGHT, or FULL) also returns non-matching rows from one or both tables, filling missing columns with NULL.' },
          { q: 'What is the difference between LEFT JOIN and RIGHT JOIN?', a: 'LEFT JOIN returns all rows from the left table plus matching right rows (NULLs where no match); RIGHT JOIN does the same but preserves all rows from the right table. They are mirror images.' },
          { q: 'What does a CROSS JOIN produce?', a: 'A CROSS JOIN produces the Cartesian product: every row of the first table combined with every row of the second, yielding m × n rows and no join condition.' },
          { q: 'What is a self join and when is it used?', a: 'A self join joins a table to itself using aliases. It is used for hierarchical or comparative data within one table, like finding an employee\'s manager or pairs of employees in the same department.' },
          { q: 'What is a NATURAL JOIN and why is it discouraged?', a: 'A NATURAL JOIN automatically joins on all columns with the same name and removes duplicates. It is discouraged because behavior changes implicitly if columns are renamed or added, making queries fragile; explicit ON/USING is preferred.' },
          { q: 'How does FULL OUTER JOIN differ from UNION of LEFT and RIGHT joins?', a: 'FULL OUTER JOIN returns all matched and unmatched rows from both tables in one pass. It is logically equivalent to a LEFT JOIN UNION a RIGHT JOIN, which is how databases without native FULL OUTER JOIN emulate it.' },
        ],
      },
      {
        id: 'dbms-sql-subqueries',
        topic: 'Subqueries: Correlated vs Non-Correlated, IN/EXISTS/ANY/ALL',
        summary: 'Nesting queries, and the key distinction of correlation and the comparison operators.',
        explanation:
          'A subquery (inner query) is a query nested inside another query. It can appear in the SELECT list, FROM clause (as a derived table), or WHERE/HAVING clause. There are two fundamental kinds based on whether the inner query depends on the outer one.\n\nA non-correlated subquery is independent: it can run on its own, produces its result once, and the outer query uses that result. Example: SELECT name FROM emp WHERE dept_id IN (SELECT dept_id FROM dept WHERE location = \'Pune\'). The inner query runs once and yields a list of department ids.\n\nA correlated subquery references columns from the outer query, so it cannot run independently and is conceptually re-evaluated for each row of the outer query. Example: SELECT e.name FROM emp e WHERE e.salary > (SELECT AVG(salary) FROM emp e2 WHERE e2.dept_id = e.dept_id) finds employees earning more than their own department\'s average — the inner query depends on e.dept_id from the outer row. Correlated subqueries are powerful but can be slow because of repeated evaluation.\n\nThe comparison operators tie subqueries into predicates. IN tests membership in a returned set (and NOT IN tests non-membership, with the NULL caveat). EXISTS tests whether the subquery returns at least one row and returns TRUE/FALSE; it is often faster than IN for correlated existence checks because it short-circuits on the first match. ANY (or SOME) compares a value to each returned value with a relational operator and is TRUE if any comparison holds — x > ANY(...) means greater than the minimum. ALL is TRUE only if the comparison holds for every returned value — x > ALL(...) means greater than the maximum. Choosing EXISTS vs IN and understanding NULL behavior in NOT IN are frequent interview discussion points.',
        keyPoints: [
          'Non-correlated subquery: independent, evaluated once',
          'Correlated subquery: references outer query columns, re-evaluated per outer row',
          'IN/NOT IN: set membership; NOT IN breaks if the set contains NULL',
          'EXISTS: TRUE if subquery returns any row; often efficient via short-circuit',
          'ANY/SOME: TRUE if comparison holds for at least one value (> ANY = > min)',
          'ALL: TRUE only if comparison holds for all values (> ALL = > max)',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/sql-subquery/' },
          { label: 'GeeksforGeeks correlated', url: 'https://www.geeksforgeeks.org/sql-correlated-subqueries/' },
        ],
        interview: [
          { q: 'What is a correlated subquery?', a: 'A correlated subquery references columns from the outer query, so it cannot be executed independently and is logically re-evaluated once per row processed by the outer query.' },
          { q: 'What is the difference between IN and EXISTS?', a: 'IN compares a value against a set of returned values; EXISTS checks whether the subquery returns at least one row. EXISTS short-circuits on the first match and is often more efficient for correlated existence checks, especially with large or NULL-containing sets.' },
          { q: 'What is the difference between ANY and ALL?', a: 'x > ANY(set) is true if x exceeds at least one value (effectively the minimum). x > ALL(set) is true only if x exceeds every value (the maximum). ANY needs one match; ALL needs all.' },
          { q: 'Why can NOT IN with a NULL return no rows?', a: 'If the subquery/list contains a NULL, comparisons become UNKNOWN under three-valued logic, so the NOT IN predicate is never TRUE for any row, yielding an empty result. EXISTS avoids this pitfall.' },
          { q: 'Where can subqueries be placed in a SQL statement?', a: 'In the SELECT list (scalar subquery), the FROM clause (derived table), and the WHERE/HAVING clauses as predicates. They can also appear in INSERT, UPDATE, and DELETE statements.' },
          { q: 'Are correlated subqueries efficient?', a: 'Not necessarily; because they are conceptually re-evaluated for each outer row they can be slow. Often they can be rewritten as joins or EXISTS, which optimizers may execute more efficiently.' },
        ],
      },
      {
        id: 'dbms-sql-views-cte',
        topic: 'Views, Updatable Views & CTEs (WITH)',
        summary: 'Named virtual tables and named query blocks for cleaner, reusable SQL.',
        explanation:
          'A view is a named virtual table defined by a stored SELECT query. It does not store data itself (unless it is a materialized view); instead, querying the view runs its underlying SELECT. Views are created with CREATE VIEW active_emp AS SELECT id, name FROM emp WHERE status = \'active\'. They serve several purposes: simplifying complex queries, providing a stable interface that hides schema details, and enforcing security by exposing only certain columns/rows to users.\n\nA view is updatable when the database can unambiguously map an INSERT/UPDATE/DELETE on the view back to a single base table. Generally a view is updatable if it selects from one table, includes the primary key (or enough to identify rows), and does not use DISTINCT, GROUP BY, aggregates, joins (in many engines), set operations, or computed columns in a way that makes the mapping ambiguous. Views over joins or aggregates are typically read-only. WITH CHECK OPTION can be added so that rows modified through the view still satisfy the view\'s WHERE condition.\n\nA materialized view physically stores the result of the query and must be refreshed; it trades freshness for read speed, useful for expensive aggregations.\n\nA Common Table Expression (CTE), introduced with the WITH keyword, defines a temporary named result set that exists only for the duration of a single statement. Example: WITH dept_avg AS (SELECT dept_id, AVG(salary) AS avg_pay FROM emp GROUP BY dept_id) SELECT e.name FROM emp e JOIN dept_avg d ON e.dept_id = d.dept_id WHERE e.salary > d.avg_pay. CTEs improve readability over deeply nested subqueries, allow a result to be referenced multiple times in one query, and support recursion (WITH RECURSIVE) for hierarchical data like org charts or graph traversals. Unlike a view, a CTE is not stored and is scoped to the statement it precedes.',
        keyPoints: [
          'A view is a named, stored SELECT query — a virtual table, not stored data',
          'Views simplify queries, hide schema, and enforce row/column-level security',
          'Updatable views map cleanly to one base table; join/aggregate views are usually read-only',
          'Materialized views store results physically and need refreshing',
          'CTE (WITH) defines a temporary named result set scoped to one statement',
          'WITH RECURSIVE handles hierarchical/recursive data like trees and graphs',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/sql-views/' },
          { label: 'GeeksforGeeks CTE', url: 'https://www.geeksforgeeks.org/cte-in-sql/' },
        ],
        interview: [
          { q: 'What is a view in SQL?', a: 'A view is a virtual table defined by a stored SELECT query. It stores no data of its own (unless materialized); querying it executes the underlying query. It simplifies access, hides complexity, and supports security.' },
          { q: 'When is a view updatable?', a: 'A view is updatable when modifications can be mapped unambiguously to one base table — typically a single-table view without DISTINCT, GROUP BY, aggregates, set operations, or many joins, and including the key columns.' },
          { q: 'What is the difference between a view and a materialized view?', a: 'A normal view recomputes its query on each access and always reflects current data. A materialized view physically stores the result and must be refreshed, trading data freshness for faster reads on expensive queries.' },
          { q: 'What is a CTE?', a: 'A Common Table Expression is a temporary named result set defined with WITH that exists only for the duration of one statement, improving readability and allowing the result to be referenced multiple times.' },
          { q: 'What is the difference between a CTE and a subquery?', a: 'Both are temporary, but a CTE is named, can be referenced multiple times within the statement, reads more clearly than nested subqueries, and can be recursive. A subquery is inline and usually used once.' },
          { q: 'What is WITH CHECK OPTION on a view?', a: 'It ensures that any row inserted or updated through the view still satisfies the view\'s defining WHERE condition, preventing changes that would make rows disappear from the view.' },
        ],
      },
    ],
  },
  {
    focus: 'Transactions & ACID Properties',
    concepts: [
      {
        id: 'dbms-transactions',
        topic: 'Transaction Concept, States & Control Commands',
        summary: 'A transaction is an all-or-nothing unit of work moving through defined states.',
        explanation:
          'A transaction is a logical unit of work consisting of one or more operations (reads and writes) that must execute as a single, indivisible action. The canonical example is a bank transfer: debit account A and credit account B. Either both happen or neither does — leaving A debited without crediting B would corrupt the data. The transaction is the unit at which the database guarantees consistency and recovery.\n\nA transaction passes through several states. Active: it is executing operations. Partially committed: the final operation has executed but changes are not yet permanent (still in buffers). Committed: changes are made permanent and visible. Failed: an error prevented normal completion. Aborted: the transaction has been rolled back, undoing its effects and returning the database to its prior consistent state; from here it may be restarted. Terminated is the end state after commit or abort.\n\nTransaction control is done with TCL commands. COMMIT makes all changes since the transaction began (or since the last commit) permanent and durable. ROLLBACK undoes all changes since the last commit (or since a savepoint), returning to a consistent prior state. SAVEPOINT name sets a named marker within a transaction so you can ROLLBACK TO savepoint partially, undoing only the work done after that marker while keeping earlier work. SET TRANSACTION can configure properties like isolation level.\n\nSavepoints enable fine-grained error handling: a long transaction can set a savepoint, attempt risky work, and roll back just that portion on failure without discarding everything done before. Together, commit/rollback/savepoint give the application precise control over the boundaries and partial undo of a transaction.',
        keyPoints: [
          'Transaction = indivisible logical unit of work (all-or-nothing)',
          'States: Active -> Partially Committed -> Committed, or -> Failed -> Aborted',
          'COMMIT makes changes permanent; ROLLBACK undoes them to a consistent state',
          'SAVEPOINT marks a point to allow partial ROLLBACK TO that point',
          'Aborted transactions restore the prior consistent state and may be restarted',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/transaction-states-in-dbms/' },
        ],
        interview: [
          { q: 'What is a transaction?', a: 'A transaction is a logical unit of work made up of one or more operations that must execute atomically — completely or not at all — to keep the database in a consistent state.' },
          { q: 'What are the states of a transaction?', a: 'Active (executing), Partially Committed (last operation done, not yet permanent), Committed (changes permanent), Failed (error occurred), and Aborted (rolled back to prior state). Terminated is the end after commit or abort.' },
          { q: 'What is the difference between COMMIT and ROLLBACK?', a: 'COMMIT permanently saves all changes made during the transaction; ROLLBACK undoes all changes since the last commit (or savepoint), restoring the previous consistent state.' },
          { q: 'What is a savepoint?', a: 'A savepoint is a named marker within a transaction. ROLLBACK TO savepoint undoes only the work done after the marker, keeping earlier work intact, enabling partial rollback.' },
          { q: 'Can a committed transaction be rolled back?', a: 'No. Once committed, changes are permanent and durable. Recovering from a committed but mistaken change requires a new compensating transaction or restoring from backup, not a rollback.' },
          { q: 'Why are transactions important?', a: 'They guarantee atomicity and consistency for multi-step operations, ensure isolation between concurrent users, and provide durability and recoverability after failures.' },
        ],
      },
      {
        id: 'dbms-acid',
        topic: 'ACID Properties',
        summary: 'Atomicity, Consistency, Isolation, Durability — the guarantees of a transaction.',
        explanation:
          'ACID is the set of four properties that a reliable transaction system guarantees. They are the foundation of correctness in relational databases.\n\nAtomicity means a transaction is all-or-nothing. Every operation in the transaction must complete; if any part fails, the entire transaction is aborted and the database is rolled back as if it never started. In a bank transfer, you cannot debit one account without crediting the other. Atomicity is implemented through logging and the recovery manager, which can undo partial work.\n\nConsistency means a transaction takes the database from one valid state to another, preserving all defined rules — constraints, cascades, and triggers. If a transaction would violate an integrity constraint (e.g., a foreign key or a CHECK), it is rejected. Consistency is partly the database\'s responsibility (enforcing constraints) and partly the application\'s (writing logically correct transactions).\n\nIsolation means concurrently executing transactions do not interfere with each other; the result is as if they ran in some serial order. Without isolation you get anomalies like dirty reads and lost updates. Isolation is enforced by concurrency control mechanisms (locking, timestamps, MVCC) and tuned via isolation levels, which trade strictness for concurrency.\n\nDurability means once a transaction commits, its effects survive subsequent failures such as crashes or power loss. This is achieved with write-ahead logging and flushing committed changes (or their log records) to non-volatile storage, so on restart the recovery process can redo committed work. Together, ACID gives applications a clean mental model: a committed transaction is permanent, correct, isolated, and complete.',
        keyPoints: [
          'Atomicity: all operations succeed or none do (all-or-nothing), via logging/undo',
          'Consistency: transactions move the DB between valid states, respecting constraints',
          'Isolation: concurrent transactions appear to run serially; prevents anomalies',
          'Durability: committed changes survive crashes, via write-ahead logging',
          'Isolation is tunable via isolation levels; durability relies on persistent log',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/acid-properties-in-dbms/' },
        ],
        interview: [
          { q: 'What are the ACID properties?', a: 'Atomicity (all-or-nothing), Consistency (valid state to valid state, respecting constraints), Isolation (concurrent transactions do not interfere), and Durability (committed changes persist through failures).' },
          { q: 'How is atomicity achieved?', a: 'Through transaction logging and the recovery manager: if a transaction fails partway, the undo log is used to roll back its partial changes so the database looks as though the transaction never ran.' },
          { q: 'What is the difference between consistency and isolation?', a: 'Consistency ensures each transaction preserves integrity rules, moving the DB between valid states. Isolation ensures concurrent transactions do not see each other\'s intermediate, uncommitted effects, as if executed serially.' },
          { q: 'How is durability guaranteed?', a: 'By write-ahead logging: changes (or their log records) are flushed to non-volatile storage before commit is acknowledged, so after a crash the recovery process can redo committed transactions.' },
          { q: 'Which ACID property prevents dirty reads?', a: 'Isolation. Proper isolation (via locking, MVCC, or isolation levels at READ COMMITTED or higher) prevents a transaction from reading another transaction\'s uncommitted changes.' },
          { q: 'Is the application responsible for any ACID property?', a: 'Yes, partly consistency: the database enforces declared constraints, but the application must write logically correct transactions so that committing them leaves the data semantically valid.' },
        ],
      },
      {
        id: 'dbms-serializability',
        topic: 'Schedules & Serializability (Conflict / View)',
        summary: 'When interleaved transaction schedules are equivalent to a safe serial order.',
        explanation:
          'When multiple transactions run concurrently, the order in which their operations interleave is called a schedule. A serial schedule runs transactions one after another with no interleaving — always correct but offers no concurrency. The goal of concurrency control is to allow interleaving (for performance) while ensuring the result is equivalent to some serial schedule; such a schedule is called serializable, which is the accepted criterion for correctness.\n\nConflict serializability is the most common, practical notion. Two operations conflict if they belong to different transactions, access the same data item, and at least one is a write (the conflicting pairs are write-write, read-write, and write-read). A schedule is conflict serializable if it can be transformed into a serial schedule by swapping only non-conflicting adjacent operations. The standard test uses a precedence (serialization) graph: create a node per transaction, and draw an edge Ti -> Tj whenever an operation of Ti conflicts with and precedes an operation of Tj on the same item. The schedule is conflict serializable if and only if this graph has no cycle; a topological sort of the acyclic graph gives an equivalent serial order.\n\nExample: schedule S with T1: R(A), W(A) then T2: R(A), W(A), and later T2: W(B) before T1: W(B). The conflict on A gives T1 -> T2; the conflict on B gives T2 -> T1. The precedence graph has a cycle T1 -> T2 -> T1, so S is not conflict serializable.\n\nView serializability is a broader notion: a schedule is view serializable if it is view-equivalent to a serial schedule, meaning every transaction reads the same values (same initial reads, same read-from relationships, and same final writes) as in that serial schedule. Every conflict-serializable schedule is also view serializable, but the reverse is not always true — view serializability additionally accepts certain schedules with blind writes (writes without a prior read). View serializability is more permissive but testing it is NP-complete, so systems rely on conflict serializability in practice.',
        keyPoints: [
          'Schedule = the interleaved order of operations of concurrent transactions',
          'Serializable schedule = equivalent in effect to some serial schedule (the correctness goal)',
          'Conflict: different transactions, same item, at least one write',
          'Conflict serializable iff the precedence graph is acyclic',
          'View serializable: same reads-from and final writes as a serial order',
          'Conflict serializable implies view serializable, but not conversely; testing view-S is NP-complete',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/conflict-serializability-in-dbms/' },
          { label: 'GeeksforGeeks view', url: 'https://www.geeksforgeeks.org/view-serializability-in-dbms-transactions/' },
        ],
        interview: [
          { q: 'What is a serializable schedule?', a: 'A schedule of concurrent transactions whose effect is equivalent to executing those transactions in some serial (one-at-a-time) order. Serializability is the standard correctness criterion for concurrent execution.' },
          { q: 'When do two operations conflict?', a: 'When they belong to different transactions, operate on the same data item, and at least one of them is a write — i.e., read-write, write-read, or write-write pairs.' },
          { q: 'How do you test conflict serializability?', a: 'Build a precedence graph with a node per transaction and an edge Ti -> Tj for each conflicting pair where Ti precedes Tj. The schedule is conflict serializable if and only if the graph has no cycle; a topological sort gives the equivalent serial order.' },
          { q: 'What is the difference between conflict and view serializability?', a: 'Conflict serializability is based on reordering non-conflicting operations and is testable in polynomial time. View serializability is based on equivalent reads-from and final writes; it is more permissive (accepts some blind-write schedules) but testing it is NP-complete.' },
          { q: 'Is every view-serializable schedule conflict serializable?', a: 'No. Every conflict-serializable schedule is view serializable, but some view-serializable schedules (typically those with blind writes) are not conflict serializable.' },
          { q: 'Why prefer serial-equivalent execution over actual serial execution?', a: 'Because serial execution wastes resources by forbidding concurrency. Serializable interleaving lets transactions overlap for throughput while still guaranteeing the correct, serial-equivalent result.' },
        ],
      },
      {
        id: 'dbms-recoverable-schedules',
        topic: 'Recoverable & Cascadeless Schedules',
        summary: 'Ordering commits so failures and rollbacks never corrupt other transactions.',
        explanation:
          'Serializability ensures correctness under concurrency, but a separate concern is recoverability: what happens when a transaction aborts? If another transaction has already read data written by the aborting transaction and committed, the database cannot undo cleanly. Recoverability properties classify schedules by how safely they handle aborts.\n\nA recoverable schedule is one in which, if transaction Tj reads a value written by Ti, then Tj commits only after Ti commits. This guarantees that we never have to undo a committed transaction: if Ti later aborts, Tj has not yet committed and can also be rolled back. A non-recoverable schedule lets Tj commit before Ti, so if Ti aborts we are stuck — Tj read dirty data but is already permanent, violating durability/consistency. Non-recoverable schedules are unacceptable.\n\nEven recoverable schedules can suffer cascading rollback (cascading abort): if Ti aborts, every transaction that read Ti\'s uncommitted writes must also abort, and any that read from those, and so on. A single failure can cascade into many rollbacks, which is expensive. A cascadeless schedule (also called avoiding cascading aborts) prevents this by requiring that a transaction reads a value only after the transaction that wrote it has committed. With this rule, no one ever reads uncommitted data, so an abort affects only the aborting transaction.\n\nA strict schedule is even stronger: a value written by Ti may be neither read nor overwritten by another transaction until Ti commits or aborts. Strict schedules make recovery simplest because undoing a write is just restoring the before-image. The containment is: Strict ⊂ Cascadeless ⊂ Recoverable. Strict Two-Phase Locking, used by most real databases, produces strict (and therefore recoverable and cascadeless) schedules.',
        keyPoints: [
          'Recoverable: a reader commits only after the transaction it read from commits',
          'Non-recoverable schedules can force undoing an already-committed transaction (unacceptable)',
          'Cascading rollback: one abort forces many dependent transactions to abort too',
          'Cascadeless: read only committed data, so aborts do not cascade',
          'Strict: no read or overwrite of an uncommitted write until commit/abort',
          'Containment: Strict ⊂ Cascadeless ⊂ Recoverable',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/recoverability-in-dbms/' },
        ],
        interview: [
          { q: 'What is a recoverable schedule?', a: 'A schedule where if a transaction Tj reads data written by Ti, then Tj commits only after Ti commits. This ensures the system never has to roll back an already-committed transaction.' },
          { q: 'What is cascading rollback?', a: 'When one transaction aborts and forces every transaction that read its uncommitted data to also abort, possibly cascading further. It is costly and undesirable.' },
          { q: 'What is a cascadeless schedule?', a: 'A schedule in which a transaction reads a data item only after the transaction that last wrote it has committed, so no transaction reads dirty data and aborts never cascade.' },
          { q: 'What is a strict schedule?', a: 'A schedule where a value written by a transaction is neither read nor overwritten by others until that transaction commits or aborts. It makes recovery simplest by allowing restore of before-images.' },
          { q: 'What is the relationship between strict, cascadeless, and recoverable schedules?', a: 'Strict schedules are a subset of cascadeless schedules, which are a subset of recoverable schedules. Strict is the strongest guarantee; recoverable is the weakest acceptable one.' },
          { q: 'Why are non-recoverable schedules not allowed?', a: 'Because a transaction may commit after reading uncommitted data from another transaction that later aborts, leaving permanent changes based on data that was rolled back — violating consistency and durability.' },
        ],
      },
    ],
  },
  {
    focus: 'Concurrency Control & Locking',
    concepts: [
      {
        id: 'dbms-concurrency-anomalies',
        topic: 'Concurrency Anomalies: Lost Update, Dirty/Unrepeatable/Phantom Read',
        summary: 'The four classic problems that arise when transactions run without proper isolation.',
        explanation:
          'When transactions execute concurrently without adequate control, their interleaving can produce incorrect results. Four well-known anomalies are central to understanding isolation levels.\n\nLost update: two transactions read the same item, both modify it based on the read value, and one overwrites the other\'s change. Example: T1 and T2 both read balance = 100; T1 writes 100+50 = 150; T2 writes 100+30 = 130, overwriting T1; the +50 update is lost. The final value should have been 180.\n\nDirty read (uncommitted dependency): T1 updates a row and T2 reads that uncommitted value; then T1 aborts. T2 has read data that never officially existed, basing its work on a phantom value. This violates isolation.\n\nUnrepeatable (non-repeatable) read: T1 reads a row, T2 then updates and commits that same row, and T1 reads it again within the same transaction and gets a different value. The two reads of the same row disagree, even though T1 did nothing to change it. This concerns existing rows being modified.\n\nPhantom read: T1 runs a query with a search condition (e.g., all employees in dept 10) and gets a set of rows; T2 inserts (or deletes) a row that matches that condition and commits; T1 re-runs the same query and sees a different set of rows — new "phantom" rows appear. Unlike unrepeatable read (which is about changed values in existing rows), phantom read is about the set of qualifying rows changing due to inserts/deletes. Preventing phantoms requires the strongest isolation (SERIALIZABLE) or range/predicate locks, because row-level locks alone cannot lock rows that do not yet exist.',
        keyPoints: [
          'Lost update: concurrent writes overwrite each other; one update vanishes',
          'Dirty read: reading another transaction\'s uncommitted data that may be rolled back',
          'Unrepeatable read: re-reading the same row yields a different value (row updated between reads)',
          'Phantom read: re-running a query returns a different set of rows (rows inserted/deleted)',
          'Phantoms need range/predicate locks or SERIALIZABLE, not just row locks',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/concurrency-control-in-dbms/' },
        ],
        interview: [
          { q: 'What is a dirty read?', a: 'A dirty read occurs when a transaction reads data written by another transaction that has not yet committed. If the writing transaction aborts, the reader has used data that never validly existed.' },
          { q: 'What is the difference between an unrepeatable read and a phantom read?', a: 'An unrepeatable read is when re-reading the same existing row returns a different value because another transaction updated it. A phantom read is when re-running a query returns a different set of rows because another transaction inserted or deleted rows matching the condition.' },
          { q: 'What is a lost update?', a: 'A lost update happens when two transactions read the same item and both write back based on their read; the second write overwrites the first, so the first transaction\'s update is silently lost.' },
          { q: 'Why are phantom reads harder to prevent than unrepeatable reads?', a: 'Because phantoms involve rows that do not yet exist at read time, so locking individual existing rows is insufficient. You need range/predicate locks or full SERIALIZABLE isolation to block inserts into the queried range.' },
          { q: 'Which anomaly does READ COMMITTED prevent?', a: 'READ COMMITTED prevents dirty reads (you only see committed data) but still allows non-repeatable reads and phantom reads.' },
          { q: 'How does isolation relate to these anomalies?', a: 'Higher isolation levels progressively eliminate anomalies: READ UNCOMMITTED allows all, READ COMMITTED stops dirty reads, REPEATABLE READ also stops non-repeatable reads, and SERIALIZABLE stops phantoms too.' },
        ],
      },
      {
        id: 'dbms-2pl',
        topic: 'Locking & Two-Phase Locking (2PL)',
        summary: 'Shared/exclusive locks and the protocol that guarantees serializability.',
        explanation:
          'Locking is the most common concurrency-control mechanism. A lock is acquired on a data item before accessing it. There are two basic modes. A shared (S) lock is for reading: multiple transactions can hold S locks on the same item simultaneously because reads do not conflict. An exclusive (X) lock is for writing: only one transaction can hold it, and no other lock (S or X) can coexist with it. The compatibility rule is S-S compatible, but S-X, X-S, and X-X are incompatible.\n\nMerely locking is not enough to guarantee serializability; the order of acquiring and releasing locks matters. Two-Phase Locking (2PL) is the protocol that does. Each transaction has two phases: a growing phase, during which it may acquire locks but cannot release any, and a shrinking phase, during which it may release locks but cannot acquire any new ones. The point where it switches is the lock point. 2PL guarantees conflict-serializable schedules. However, basic 2PL does not prevent cascading rollback and can still deadlock.\n\nVariants tighten the guarantees. Strict 2PL holds all exclusive (write) locks until the transaction commits or aborts, releasing them only at the end; this prevents cascading aborts and produces strict (recoverable, cascadeless) schedules, which is why it is the most widely used in practice. Rigorous 2PL holds all locks, both shared and exclusive, until commit/abort; it is even stricter and ensures transactions are serialized in commit order, simplifying reasoning at the cost of less concurrency.\n\nConservative (static) 2PL acquires all needed locks before the transaction begins; if it cannot get them all, it waits and acquires none, which makes it deadlock-free but requires knowing the lock set in advance and reduces concurrency. The practical takeaway: 2PL gives serializability, and Strict 2PL adds recoverability without cascading rollback, which is the standard for most relational databases.',
        keyPoints: [
          'Shared (S) lock = read, multiple allowed; Exclusive (X) lock = write, only one',
          'Compatibility: S-S allowed; S-X, X-S, X-X not allowed',
          '2PL: growing phase (only acquire) then shrinking phase (only release)',
          'Basic 2PL guarantees conflict serializability but allows deadlock/cascading rollback',
          'Strict 2PL holds write locks until commit -> recoverable, cascadeless',
          'Rigorous 2PL holds all locks until commit; Conservative 2PL is deadlock-free',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/two-phase-locking-protocol/' },
        ],
        interview: [
          { q: 'What is the difference between a shared and an exclusive lock?', a: 'A shared (S) lock is for reading and several transactions can hold it on the same item at once. An exclusive (X) lock is for writing and is incompatible with any other lock, so only one transaction can hold it.' },
          { q: 'What is Two-Phase Locking?', a: '2PL is a protocol where each transaction first only acquires locks (growing phase) and then only releases locks (shrinking phase), never acquiring after the first release. It guarantees conflict-serializable schedules.' },
          { q: 'Does 2PL prevent deadlocks?', a: 'No. Basic 2PL guarantees serializability but can still deadlock because transactions may wait on each other\'s locks in a cycle. Deadlocks must be handled separately by detection or prevention schemes.' },
          { q: 'What is Strict 2PL and why is it used?', a: 'Strict 2PL holds all exclusive (write) locks until the transaction commits or aborts. This prevents cascading rollbacks and yields recoverable, cascadeless, strict schedules, making recovery clean — which is why most databases use it.' },
          { q: 'What is the difference between Strict and Rigorous 2PL?', a: 'Strict 2PL holds only write locks until commit; Rigorous 2PL holds both shared and exclusive locks until commit. Rigorous is stricter, serializing transactions in commit order, with somewhat lower concurrency.' },
          { q: 'What is Conservative (static) 2PL?', a: 'It acquires all required locks before the transaction starts; if it cannot get them all, it waits without holding any. This makes it deadlock-free but requires predeclaring the lock set and reduces concurrency.' },
        ],
      },
      {
        id: 'dbms-deadlock',
        topic: 'Deadlocks in DBMS & Handling',
        summary: 'Circular lock waits and how databases detect, prevent, and avoid them.',
        explanation:
          'A deadlock in a database occurs when two or more transactions are each waiting for a lock held by another, forming a cycle so that none can proceed. Example: T1 holds an X lock on A and requests B; T2 holds an X lock on B and requests A. Each waits forever. The same four Coffman conditions as in operating systems apply — mutual exclusion, hold and wait, no preemption, and circular wait.\n\nDeadlock detection lets deadlocks happen and then finds them. The DBMS maintains a wait-for graph with a node per transaction and an edge Ti -> Tj if Ti is waiting for a lock held by Tj. A cycle in this graph indicates a deadlock. The system periodically checks for cycles and, when found, chooses a victim transaction to abort and roll back (based on cost, age, or number of locks held), breaking the cycle; the victim is later restarted.\n\nDeadlock prevention uses timestamp-based schemes so cycles can never form. Each transaction gets a timestamp at start (older = smaller timestamp). In Wait-Die (non-preemptive): if an older transaction requests a lock held by a younger one, the older waits; if a younger requests one held by an older, the younger dies (aborts and restarts with its original timestamp). In Wound-Wait (preemptive): if an older requests a lock held by a younger, the older wounds (aborts) the younger; if a younger requests one held by an older, the younger waits. Both ensure waiting only happens in one timestamp direction, preventing circular wait. Keeping the original timestamp on restart avoids starvation.\n\nTimeout-based handling is the simplest approach: if a transaction waits for a lock longer than a threshold, it is aborted and restarted. It is easy to implement and needs no graph, but choosing the timeout is tricky — too short aborts healthy transactions, too long delays detection. Most production databases use detection (wait-for graph) or timeouts; pure prevention schemes are common in textbooks and some distributed systems.',
        keyPoints: [
          'Deadlock = cyclic waiting on locks; none of the transactions can proceed',
          'Detection: wait-for graph; a cycle means deadlock, abort a victim to break it',
          'Wait-Die (non-preemptive): older waits, younger dies when requesting held lock',
          'Wound-Wait (preemptive): older wounds (aborts) younger, younger waits',
          'Aborted transactions keep their original timestamp to avoid starvation',
          'Timeout: abort a transaction that waits too long — simple but threshold-sensitive',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/deadlock-in-dbms/' },
        ],
        interview: [
          { q: 'What is a deadlock in a DBMS?', a: 'A deadlock is when two or more transactions each hold a lock the other needs and wait for each other in a cycle, so none can make progress.' },
          { q: 'How is deadlock detected in a database?', a: 'Using a wait-for graph: nodes are transactions and an edge Ti -> Tj means Ti waits for a lock held by Tj. A cycle in this graph indicates a deadlock, and the system aborts a victim to break it.' },
          { q: 'Explain Wait-Die and Wound-Wait.', a: 'Both are timestamp-based prevention schemes. In Wait-Die, an older transaction waits for a younger one but a younger requesting an older\'s lock is aborted (dies). In Wound-Wait, an older transaction aborts (wounds) the younger holder, while a younger one waits for an older. Both ensure waits go in only one timestamp direction.' },
          { q: 'Why is the original timestamp reused when a transaction restarts?', a: 'To prevent starvation. Keeping the old (smaller) timestamp makes the restarted transaction progressively older, so it eventually wins priority and is not repeatedly aborted.' },
          { q: 'What is timeout-based deadlock handling?', a: 'A transaction that waits for a lock longer than a set threshold is assumed deadlocked, aborted, and restarted. It is simple and needs no graph but is sensitive to the chosen timeout value.' },
          { q: 'Is Wait-Die preemptive or non-preemptive?', a: 'Wait-Die is non-preemptive: it never forces a transaction holding a lock to abort; only the requesting younger transaction dies. Wound-Wait is preemptive because an older requester can abort a younger lock holder.' },
        ],
      },
      {
        id: 'dbms-isolation-levels',
        topic: 'Isolation Levels, Timestamp Ordering & MVCC',
        summary: 'The SQL isolation levels, the anomalies each allows, and how MVCC enables them.',
        explanation:
          'The SQL standard defines four isolation levels that trade consistency for concurrency by controlling which anomalies are allowed. From weakest to strongest: READ UNCOMMITTED allows dirty reads, non-repeatable reads, and phantoms — it lets a transaction read uncommitted data. READ COMMITTED forbids dirty reads (a transaction sees only committed data) but still allows non-repeatable reads and phantoms; it is the default in many databases like PostgreSQL and Oracle. REPEATABLE READ additionally guarantees that re-reading a row returns the same value (no non-repeatable reads), but the standard still permits phantoms (though some engines like MySQL InnoDB prevent them with gap locks). SERIALIZABLE is the strongest: it forbids all three anomalies and makes transactions behave as if run one at a time.\n\nA concise anomaly table: READ UNCOMMITTED allows dirty + non-repeatable + phantom; READ COMMITTED allows non-repeatable + phantom; REPEATABLE READ allows phantom; SERIALIZABLE allows none. Higher levels mean stronger guarantees but typically more locking/aborts and less concurrency.\n\nTimestamp Ordering (TO) is an alternative to locking. Each transaction gets a unique timestamp at start, and each data item tracks the largest read-timestamp and write-timestamp that have accessed it. When a transaction tries to read or write, the protocol compares timestamps: an operation that would violate timestamp order (e.g., a write by an older transaction after a younger one already read the item) is rejected and the offending transaction is aborted and restarted. This enforces serializability in timestamp order without deadlocks (but can cause more restarts).\n\nMultiversion Concurrency Control (MVCC) keeps multiple versions of each data item, each tagged with the transaction/timestamp that created it. Readers see a consistent snapshot of committed data as of their start (or statement), so readers never block writers and writers never block readers — a major concurrency win used by PostgreSQL, Oracle, and MySQL InnoDB. Snapshot Isolation, a popular MVCC-based level, prevents dirty, non-repeatable, and phantom reads but can allow a write-skew anomaly, which true SERIALIZABLE (e.g., Serializable Snapshot Isolation) closes.',
        keyPoints: [
          'READ UNCOMMITTED: allows dirty, non-repeatable, and phantom reads',
          'READ COMMITTED: no dirty reads; allows non-repeatable and phantom reads',
          'REPEATABLE READ: no dirty or non-repeatable reads; standard allows phantoms',
          'SERIALIZABLE: prevents all three anomalies; behaves as serial execution',
          'Timestamp ordering: orders operations by transaction timestamp, aborts violators (deadlock-free)',
          'MVCC keeps versions so readers see a snapshot; readers and writers do not block each other',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/transaction-isolation-levels-dbms/' },
          { label: 'GeeksforGeeks MVCC', url: 'https://www.geeksforgeeks.org/multiversion-concurrency-control-mvcc/' },
        ],
        interview: [
          { q: 'What are the four isolation levels and the anomalies they prevent?', a: 'READ UNCOMMITTED prevents none; READ COMMITTED prevents dirty reads; REPEATABLE READ prevents dirty and non-repeatable reads; SERIALIZABLE prevents dirty, non-repeatable, and phantom reads, behaving as if transactions ran serially.' },
          { q: 'What is a phantom read and which level prevents it?', a: 'A phantom read is when re-running a query returns a different set of rows because another transaction inserted or deleted matching rows. Only SERIALIZABLE (or engines using range/gap locks at REPEATABLE READ) prevents it.' },
          { q: 'What is the trade-off of higher isolation levels?', a: 'Higher levels give stronger consistency but reduce concurrency and throughput because they require more locking or more transaction aborts/restarts.' },
          { q: 'What is timestamp ordering?', a: 'A concurrency-control method that assigns each transaction a timestamp and orders conflicting operations by timestamp, aborting and restarting any transaction whose operation would violate that order. It is deadlock-free but can cause more restarts.' },
          { q: 'What is MVCC?', a: 'Multiversion Concurrency Control keeps multiple versions of each data item so each transaction reads a consistent committed snapshot. Readers do not block writers and vice versa, greatly improving concurrency; used by PostgreSQL, Oracle, and InnoDB.' },
          { q: 'What is snapshot isolation and its weakness?', a: 'Snapshot isolation is an MVCC-based level where each transaction reads a snapshot taken at its start, preventing dirty, non-repeatable, and phantom reads. Its weakness is write skew, an anomaly that only fully serializable execution prevents.' },
        ],
      },
    ],
  },
  {
    focus: 'Indexing (B-Tree / B+ Tree) & File Organization',
    concepts: [
      {
        id: 'dbms-indexing-basics',
        topic: 'Indexing Fundamentals & Index Types',
        summary: 'Why indexes speed up lookups, and primary/secondary, clustered/non-clustered, dense/sparse.',
        explanation:
          'An index is an auxiliary data structure that lets the database find rows quickly without scanning the whole table. Conceptually it is like the index at the back of a book: instead of reading every page, you look up a key and jump to the page (disk block) holding the data. Without an index, a query with a selective WHERE clause may require a full table scan, which is O(n) in disk reads; with a suitable index it can be reduced to O(log n) or near-constant. The trade-off is that indexes consume storage and must be updated on every insert/update/delete, slowing writes.\n\nA primary index is built on the ordering key of a sequentially ordered (sorted) file — usually the primary key. Because the file is sorted on this attribute, the index can be sparse. A secondary index is built on a non-ordering field (any column you also want to search by); since the file is not sorted on it, a secondary index must be dense. A table can have one primary/clustered index but many secondary indexes.\n\nA clustered index determines the physical order of rows in the table — the data rows are stored in the same order as the index key, so there can be only one clustered index per table (you can physically sort the data only one way). Range scans on the clustered key are very fast. A non-clustered (secondary) index stores the index keys separately along with pointers (row locators) to the actual rows, whose physical order is independent of the index; a table can have many non-clustered indexes.\n\nDense vs sparse describes index entries. A dense index has one entry for every search-key value (every record), giving direct lookups but using more space. A sparse index has an entry only for some records — typically one per disk block (the first key in each block); to find a record you locate the largest key ≤ the target, go to that block, and scan within it. Sparse indexes are smaller and require fewer block reads to traverse, but only work when the file is ordered on the key. Multilevel indexing builds an index on the index (and so on) so even the index itself does not need a linear scan — this hierarchical idea is exactly what B/B+ trees generalize.',
        keyPoints: [
          'Index = structure mapping key -> disk location; turns full scans into log-time lookups',
          'Cost: extra storage and slower writes (index maintained on every modification)',
          'Primary index on the ordering key (can be sparse); secondary on non-ordering field (must be dense)',
          'Clustered: data physically ordered by the key (one per table); non-clustered: separate keys + pointers (many allowed)',
          'Dense: one entry per record; Sparse: one entry per block (needs ordered file)',
          'Multilevel index = index on the index; B/B+ trees generalize this',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/indexing-in-databases-set-1/' },
        ],
        interview: [
          { q: 'Why do we use indexes?', a: 'Indexes let the database locate rows quickly without scanning the entire table, turning selective lookups and range queries from O(n) full scans into roughly O(log n) operations, at the cost of extra storage and slower writes.' },
          { q: 'What is the difference between a clustered and a non-clustered index?', a: 'A clustered index defines the physical storage order of the table rows, so there can be only one per table and range scans are fast. A non-clustered index stores keys with pointers to the rows separately, the data order is independent, and a table can have many of them.' },
          { q: 'What is the difference between a dense and a sparse index?', a: 'A dense index has an entry for every record (or search-key value), enabling direct lookups but using more space. A sparse index has one entry per block (typically the first key), so it is smaller but requires the file to be ordered and a small in-block scan.' },
          { q: 'What is the difference between a primary and a secondary index?', a: 'A primary index is built on the file\'s ordering key (often the primary key) and can be sparse. A secondary index is on a non-ordering attribute, must be dense, and a table can have several secondary indexes.' },
          { q: 'What is multilevel indexing?', a: 'When an index is itself too large to scan efficiently, we build an index over the index, and possibly more levels, forming a tree-like hierarchy. This reduces the search to a few block accesses and is the idea behind B/B+ trees.' },
          { q: 'What are the downsides of indexing?', a: 'Indexes use additional disk space and slow down INSERT, UPDATE, and DELETE because the index must be maintained. Over-indexing can hurt write-heavy workloads more than it helps reads.' },
        ],
      },
      {
        id: 'dbms-bplus-tree',
        topic: 'B-Tree vs B+ Tree',
        summary: 'Balanced multiway search trees, and why databases prefer the B+ tree.',
        explanation:
          'B-trees and B+ trees are self-balancing, multiway search trees designed for block-oriented storage (disk). Unlike a binary tree, each node holds many keys and has many children (a high fanout), so the tree stays very shallow even for huge datasets, minimizing the number of disk-block reads — which dominate cost. A tree of order m has up to m children and m-1 keys per node, stays balanced, and guarantees O(log n) search, insert, and delete with logarithm base equal to the fanout.\n\nIn a B-tree, keys and their associated record pointers (the actual data references) are stored in both internal and leaf nodes. A search can terminate early at an internal node if the key is found there. Because internal nodes carry data pointers too, each internal node holds fewer keys, so the fanout is slightly lower and the tree slightly taller. There is no convenient linked path through all keys for range scans.\n\nIn a B+ tree, all actual data pointers live only in the leaf nodes; internal nodes store only keys (separator/routing keys) to guide the search. Every search therefore travels all the way down to a leaf. Crucially, the leaf nodes are linked together in a sorted linked list, so once you find the start of a range you can walk the leaves sequentially. This structure is what databases and file systems use.\n\nDatabases prefer B+ trees for several reasons. (1) Because internal nodes store only keys (no data pointers), each node packs more keys, giving higher fanout, a shallower tree, and fewer disk I/Os per lookup. (2) The linked leaf list makes range queries and ordered scans (BETWEEN, ORDER BY, sequential reads) very efficient — you traverse to one leaf then follow leaf links. (3) All searches reach a leaf, so search cost is uniform and predictable. (4) Leaves hold all keys, making full-table ordered traversal trivial. Example lookup for key 57 in a B+ tree of order 4: start at the root, compare 57 against routing keys to pick the correct child pointer, descend through one or two internal levels, and arrive at a leaf node where 57 (and its record pointer) is found, all in 3-4 block reads even for millions of rows. A B-tree might find 57 one level higher occasionally, but loses on range scans and overall fanout.',
        keyPoints: [
          'Both are balanced multiway trees with high fanout, ideal for disk (few block reads)',
          'B-tree: keys + data pointers in all nodes; search can stop at an internal node',
          'B+ tree: data pointers only in leaves; internal nodes hold keys for routing only',
          'B+ tree leaves are linked in sorted order -> fast range/ordered scans',
          'B+ tree has higher fanout (no data in internal nodes) -> shallower tree, fewer I/Os',
          'Databases prefer B+ trees for predictable lookups and efficient range queries',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/difference-between-b-tree-and-b-tree/' },
        ],
        interview: [
          { q: 'What is the difference between a B-tree and a B+ tree?', a: 'In a B-tree, keys and data pointers are stored in all nodes (internal and leaf). In a B+ tree, data pointers are only in the leaves and internal nodes hold keys for routing; additionally, B+ tree leaves are linked in sorted order.' },
          { q: 'Why do databases prefer B+ trees over B-trees?', a: 'Because internal nodes store no data, B+ trees have higher fanout and are shallower (fewer disk I/Os), every search reaches a leaf giving uniform cost, and the linked leaves make range and ordered scans very efficient.' },
          { q: 'Why are B/B+ trees better than binary search trees for databases?', a: 'They have high fanout, so a node maps to a disk block and the tree stays shallow, drastically reducing the number of expensive disk-block reads compared with a tall binary tree of the same data.' },
          { q: 'How do B+ trees make range queries efficient?', a: 'All keys are in the leaves, which are connected as a sorted doubly linked list. After finding the starting leaf, the query simply walks the leaf chain sequentially, ideal for BETWEEN and ORDER BY.' },
          { q: 'Where are the actual records or data pointers stored in a B+ tree?', a: 'Only in the leaf nodes. Internal nodes contain just separator keys used to navigate; the leaves contain every key along with pointers to the data records.' },
          { q: 'What does the order of a B/B+ tree mean?', a: 'The order m is the maximum number of children a node can have (and m-1 keys). A higher order means greater fanout, more keys per node, and a shallower tree for the same number of records.' },
        ],
      },
      {
        id: 'dbms-hashing-file-organization',
        topic: 'Hashing & File Organization',
        summary: 'Hash-based access, static vs dynamic hashing, and heap/sequential/hashed files.',
        explanation:
          'File organization describes how records of a table are physically arranged in storage, which directly affects insert and search performance. A heap (unordered) file stores records in no particular order — new rows are simply appended wherever there is space. Inserts are very fast (just append), but searching requires a full scan, and deletions leave gaps. A sequential (ordered) file keeps records sorted on some key; this makes binary search and range scans efficient, but inserts are costly because maintaining order may require shifting records or using overflow blocks. A hashed file uses a hash function on a key to compute the block where a record is stored, giving roughly O(1) lookups for equality searches but poor support for range queries (since hashing scatters keys).\n\nHashing maps a search key to a bucket (block) via a hash function h(key). On lookup you hash the key and go straight to the bucket. Collisions (different keys hashing to the same bucket) are handled with overflow chains or open addressing. Hashing excels at equality lookups (WHERE id = 42) but cannot answer range queries efficiently because adjacent keys land in unrelated buckets.\n\nStatic hashing uses a fixed number of buckets decided in advance. It is simple, but it does not adapt to data growth: if the table grows much larger than expected, buckets overflow and long overflow chains degrade performance; if it shrinks, space is wasted. Reorganizing requires rehashing everything.\n\nDynamic hashing lets the bucket structure grow and shrink with the data, avoiding the rigidity of static hashing. Two common schemes: Extendible hashing uses a directory of pointers indexed by the first few bits of the hash; when a bucket overflows it splits and the directory may double, so only the affected buckets are reorganized. Linear hashing grows buckets one at a time in a predetermined order as load increases, without a directory. Both keep performance stable as data volume changes, which is why dynamic hashing is preferred when data size is unpredictable. In summary: choose heap for write-heavy staging, sequential/B+ tree for range queries and ordering, and hashing for fast equality access.',
        keyPoints: [
          'Heap file: append-only, fast inserts, full scan to search',
          'Sequential file: sorted, good for range/binary search, costly inserts',
          'Hashed file: h(key) -> bucket, fast equality lookups, poor for ranges',
          'Static hashing: fixed buckets; overflow chains degrade as data grows',
          'Dynamic hashing (extendible, linear) adapts bucket count to data size',
          'Hashing handles equality (=) well but not range queries; B+ trees handle ranges',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/file-organization-in-dbms-set-1/' },
          { label: 'GeeksforGeeks hashing', url: 'https://www.geeksforgeeks.org/hashing-in-dbms/' },
        ],
        interview: [
          { q: 'What is the difference between static and dynamic hashing?', a: 'Static hashing fixes the number of buckets in advance and degrades with overflow chains as data grows. Dynamic hashing (extendible or linear) grows and shrinks the bucket structure with the data, keeping performance stable.' },
          { q: 'When is hashing better than a B+ tree index?', a: 'Hashing is better for equality lookups (key = value) because it goes directly to the bucket in roughly O(1). B+ trees are better for range queries and ordered scans, which hashing cannot do efficiently.' },
          { q: 'What are the main file organizations?', a: 'Heap (unordered, append-fast but scan-to-search), sequential (sorted, good for ranges but slow inserts), and hashed (direct equality access via a hash function). The choice depends on the dominant access pattern.' },
          { q: 'How are collisions handled in hashing?', a: 'Through overflow handling such as chaining (linking extra blocks to an overflowed bucket) or open addressing (placing the record in another bucket). Long chains in static hashing hurt performance, which dynamic hashing avoids.' },
          { q: 'What is extendible hashing?', a: 'A dynamic hashing scheme that uses a directory indexed by leading bits of the hash. When a bucket overflows it splits and the directory may double, so only affected buckets are reorganized rather than rehashing everything.' },
          { q: 'Why does hashing not support range queries well?', a: 'A good hash function scatters keys across buckets, so logically adjacent key values (e.g., 50 and 51) usually land in unrelated buckets. There is no order among buckets, so a range scan would have to probe many or all buckets.' },
        ],
      },
      {
        id: 'dbms-index-performance',
        topic: 'Query Performance & When NOT to Index',
        summary: 'How indexes change query plans and the situations where an index hurts.',
        explanation:
          'Indexes dramatically affect query performance because they change the access path the optimizer can use. A query with WHERE on an indexed, selective column can use an index seek (jump directly to matching rows) instead of a full table scan, cutting disk reads from O(n) to O(log n) plus the matching rows. Indexes also speed up ORDER BY and GROUP BY (the data can be read in index order), JOIN conditions (index on the join key), and the enforcement of UNIQUE/PRIMARY KEY constraints. A covering index — one that contains all columns a query needs — lets the query be answered from the index alone (an index-only scan) without touching the table at all.\n\nHowever, every index is a cost on writes. On each INSERT, UPDATE (of an indexed column), and DELETE, the database must also update the corresponding index structures, which adds I/O and CPU. More indexes mean slower writes and more storage. Therefore indexing is a deliberate trade-off between read speedup and write/storage overhead.\n\nThere are several situations where you should NOT add an index. (1) Small tables: a full scan of a few blocks is cheaper than navigating an index. (2) Columns with low cardinality / low selectivity: a column like gender or a boolean has few distinct values, so an index returns a large fraction of the table and the optimizer will often ignore it in favor of a scan. (3) Write-heavy tables where read benefit is marginal: the index maintenance cost can outweigh occasional read gains. (4) Columns that are rarely used in WHERE/JOIN/ORDER BY: an unused index is pure overhead. (5) Columns updated very frequently: each update churns the index.\n\nFurther pitfalls: an index on a column may be unusable if the query applies a function or implicit conversion to that column (e.g., WHERE UPPER(name) = ... defeats an index on name unless a function-based index exists), or if a leading wildcard pattern is used (LIKE \'%abc\'). For composite (multi-column) indexes, the leftmost-prefix rule applies: an index on (a, b, c) can serve queries filtering on a, or a and b, or all three, but generally not one filtering only on b or c. The practical guidance: index selective columns used in frequent WHERE/JOIN/ORDER BY clauses, avoid indexing low-selectivity or rarely queried columns, and validate decisions with the query planner (EXPLAIN) on realistic data.',
        keyPoints: [
          'Indexes enable index seeks, speed up WHERE/JOIN/ORDER BY/GROUP BY and constraints',
          'A covering index answers a query from the index alone (index-only scan)',
          'Every index slows writes (INSERT/UPDATE/DELETE) and uses storage',
          'Avoid indexing small tables, low-cardinality columns, and rarely queried columns',
          'Functions/implicit casts on a column and leading-wildcard LIKE can disable an index',
          'Composite indexes follow the leftmost-prefix rule; verify plans with EXPLAIN',
        ],
        links: [
          { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/sql-indexes/' },
        ],
        interview: [
          { q: 'When should you NOT create an index?', a: 'On very small tables, on low-cardinality/low-selectivity columns (like booleans), on columns rarely used in WHERE/JOIN/ORDER BY, and on write-heavy columns where index maintenance cost outweighs read benefits.' },
          { q: 'How do indexes improve query performance?', a: 'They let the optimizer use index seeks instead of full table scans for selective predicates, speed up joins and sorting, support uniqueness constraints, and can enable index-only scans via covering indexes.' },
          { q: 'What is a covering index?', a: 'An index that includes all columns a query references, so the query can be answered entirely from the index without reading the base table — an index-only scan that avoids extra I/O.' },
          { q: 'What is the leftmost-prefix rule for composite indexes?', a: 'A composite index on (a, b, c) can be used for queries filtering on a, or a and b, or a, b, and c, but generally not for queries filtering only on b or c, because the index is ordered by the leading columns first.' },
          { q: 'Why might a query ignore an existing index?', a: 'If the predicate is not selective (returns a large fraction of rows), if a function or implicit conversion is applied to the indexed column, or with a leading-wildcard LIKE, the optimizer may judge a full scan cheaper and skip the index.' },
          { q: 'How can you tell whether an index is actually used?', a: 'Run the query through the optimizer\'s execution plan tool, e.g., EXPLAIN (or EXPLAIN ANALYZE), and check whether it shows an index seek/scan on that index versus a full table scan, on realistic data volumes.' },
        ],
      },
    ],
  },
]
