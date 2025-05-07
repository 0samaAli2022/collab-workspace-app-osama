### Decision-Making Reports

#### 1. Backend Choice:

**Chosen Backend:** Supabase Edge Functions

**Reasoning:**

* **Integration Speed:** Supabase provides a full-stack experience with Edge Functions, enabling quick backend logic without needing a separate server.
* **Cost:** Offers generous free tier and affordable scaling.
* **Scaling:** Built on Deno, edge functions scale automatically without manual intervention.
* **Flexibility:** Native PostgreSQL integration and close coupling with Supabase services simplify implementation.

**Comparison:**

* **Firebase Functions**: Tightly coupled with Google Cloud, but limited SQL flexibility.
* **Laravel API**: Great for complex APIs but heavier to set up and maintain.
* **Python Flask/FastAPI**: Excellent for custom logic but requires managing own hosting and DevOps.

#### 2. Database Choice:

**Chosen Database:** Supabase (PostgreSQL)

**Reasoning:**

* Relational model fits the structure of users, workspaces, boards, and tasks well.
* Strong support for JSON, full-text search, and role-based access control.
* Auto-generated APIs and powerful SQL layer.

**Comparison:**

* **Firebase Firestore**: NoSQL, harder for relational joins and queries.
* **MySQL**: Lacks Supabase's tight integration and real-time features.

#### 3. Storage (for attachments):

**Chosen Storage:** Supabase Storage

**Reasoning:**

* Seamless integration with Supabase auth and database.
* Role-based access policies.
* Easy to manage files per workspace or task.

**Comparison:**

* **Firebase Storage**: Excellent but more suited for apps already using Firebase ecosystem.
* **Amazon S3**: Most flexible and scalable, but requires more setup and IAM policy configuration.

#### 4. Implementation Plan:

* **Database**:

  * Tables: Users, Workspaces, Boards, Tasks, Attachments.
  * Foreign keys to link relationships (e.g., Tasks -> Boards -> Workspaces).
* **Storage**:

  * Store attachments in Supabase Storage buckets.
  * Reference stored file URLs in the Attachments table.
* **Connection**:

  * Supabase client in the app handles both database and storage operations.

---

### Technical Questions

#### 1. Backend Architecture:

To handle 1 million users:

* Use Supabase's built-in horizontal scalability and edge functions.
* Partition data logically by workspace or tenant ID.
* Use database indexes on frequently queried fields.
* Introduce caching layer (e.g., Redis) if needed.
* Implement rate limiting and monitoring.

#### 2. Authentication Strategy:

* Use Supabase Auth with JWT tokens.
* Secure endpoints with RLS (Row Level Security) based on user roles.
* Token expiration:

  * Use short-lived access tokens (e.g., 15 mins).
  * Refresh token flow handled via Supabase's built-in session management.

#### 3. Database Modeling:

* **Users Table**: user\_id (PK), email, etc.
* **Workspaces Table**: workspace\_id (PK), name, owner\_id (FK -> Users)
* **Boards Table**: board\_id (PK), workspace\_id (FK -> Workspaces), name
* **Tasks Table**: task\_id (PK), board\_id (FK -> Boards), assignee\_id (FK -> Users), title, status
* **User\_Workspace Table** (for many-to-many): user\_id + workspace\_id

#### 4. State Management (Frontend):

* **Comparison**:

  * **Redux**: Powerful but boilerplate-heavy.
  * **Zustand**: Lightweight, minimal API, React-friendly.
  * **Recoil**: Great for atomic state, still experimental.

**Chosen Option:** Zustand — fast to implement, simple syntax, persistent state support.

#### 5. Offline Handling:

* Cache key data locally using IndexedDB or localStorage (e.g., via Zustand middleware).
* Queue changes made offline.
* On reconnect, push queued updates to the server.
* Use timestamps or versioning for conflict resolution.

---

End of Report.
