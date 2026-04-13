# DUA Streamliner
**Intelligent System for Automated Generation of the Single Customs Document (DUA)**  
**Course:** Software Design – Computer Engineering  
**Case #1 (15%)**

## Authors
- Guillermo Coto Álvarez
- Marlon Badilla Mora

**Problem:** Preparing the DUA requires interpreting many documents (commercial invoices, packing lists, bill of lading (BL), certificates, insurance policies, permits, etc.) that arrive in different formats (Word, Excel, PDF, and scanned images). Manual completion is slow, repetitive, and error-prone, and it heavily depends on the expertise of the customs agent or operator, which can lead to delays, rejections, or penalties.

**How:** DUA Streamliner takes a folder containing the files and runs an automated pipeline: it reads Word/Excel, extracts text and tables from PDFs, and applies OCR to scanned images. Then it performs semantic extraction to identify key customs data (values, currencies, incoterms, countries, transport info, invoice numbers/dates) and maps them to the official DUA fields, applying basic validations and flagging ambiguities with confidence levels.

**Results:** The system generates a pre-filled DUA Word document with visual confidence coding (green: high, yellow: medium, red: needs review) and a list of observations to quickly correct issues. This shifts the customs expert’s work from “filling everything manually” to “reviewing and adjusting,” reducing time, errors, and rework.

## Scope (MVP)
1. Folder path selection
2. Multi-format reading (docx/xlsx/pdf/img + OCR)
3. Semantic extraction of customs fields
4. Mapping and basic validation
5. Pre-filled DUA generation in Word with a traffic-light confidence indicator

## Key References
- DUA messaging/specification (Ministry of Finance): https://www.hacienda.go.cr/docs/Mensaje_TD_DUA-V3-17-12-03-2025.pdf
- Documents of interest (Ministry of Finance / DGA): https://www.hacienda.go.cr/DocumentosInteres.html
- User manual/guide related to DUA exports (VUCE): https://www.vuce.cr/wp-content/uploads/2021/10/Manual-de-Usuario-DUA-Exportaciones_compressed.pdf

## Repository structure (proposal)
- docs/
  - research/            # notes, links, comparison of similar solutions
  - architecture/        # diagrams, ADRs, decisions
- src/
  - frontend/
  - backend/
- tests/
- samples/               # anonymized or dummy examples

# 1. Frontend Design

## 1.1 Technology stack: frontend technology, security, third-party libraries, frameworks, hosting; all with their respective versions.
- Application type: web app
- Web framework: ReactJS version 19.2
- Node.js version 21
- Prettier 3.8.1
- TypeScript 5.8.3
- ESLint 10.0.2
- Unit testing: Jest 30.2.0
- Integration testing: Playwright version 1.58.2
- Cloud service: AWS cloud services
- Hosted by AWS App Services
- Code repositories in Github
- Automated code tasks with Husky 9.1.7
- CI/CD with Github DevOps Pipelines
- Environments: development, stage, and production
- Environments deployments: Azure DevOps Environments
- Observability with AWS Application Insights SDK / Gr

## 1.2 UX/UI analysis
### Core business process

#### Learnability
- First-time user completes “Select folder → Generate DUA” without help in ≤ 2 minutes.
#### Efficiency
- Returning user generates a DUA in ≤ 60 seconds (excluding heavy OCR processing).
#### Error prevention
- The system detects missing / duplicate / unreadable files and suggests an action (retry OCR, replace, ignore).
#### Status visibility
- The user always sees stage-based progress (Ingestion → OCR → Extraction → Mapping → Validation → Word).
#### Control and reversibility
- Edit a field and “undo / reset to AI suggestion”.
#### Traceability
- Each field shows “where it came from” (file + page + snippet).
#### Basic accessibility
- Contrast, keyboard navigation, clear text.
#### Confidence
- Traffic-light indicator (green/yellow/red) + a short explanation of why.

### Wireframes              (https://golden-wasp-02185792.figma.site)
Home / Folder selection  
Button: “Select folder”  
Detected files list with icons and type (PDF/DOCX/XLSX/IMG)  
Button: “Analyze”  
![login](/media/1_Home.png)

Processing / Progress  
Stage progress bar + percentage  
Short log (e.g., “OCR page 3/12…”)  
Buttons: “Cancel” / “Retry OCR” if something failed  
![login](/media/2_Procesamiento.png)

DUA Review (main screen)  
Left panel: “DUA Fields” grouped by sections  
Right panel: “Evidence” (document preview + highlighted source text)  
Each field: value + color (green/yellow/red) + confidence % + source
![login](/media/3_Revisión_del_DUA.png)

Issues / Validations  
List of issues (inconsistent currency, totals don’t match, invalid date)  
Quick actions: “Fix”, “Mark as reviewed”, “Ignore with reason”  
![login](/media/4_Issues.png)

Export  
Button: “Generate Word (.docx)”  
Summary: # green / # yellow / # red  
Download + save job history  
![login](/media/5_Export.png)

**Testing results**

Test de mamá de Guillermo:

![login](/media/pruebaGuillermo1.png)

Test de hermana de Guillermo:

![login](/media/pruebaGuillermo2.png)

Test de amigo de Marlon:

![login](/media/pruebaMarlon.jpg)

## 1.3 Component design strategy
Defines the technique and principles for frontend component design: how component reuse is achieved, how styles are centralized, branding, internationalization, and responsiveness.

* Use atomic design for basic and complex component design
* Centralize one style per component
* Component-scope naming convention
* Use only "rem" positional units to support responsivenes in the design
* Components support react i-18next
* Accesibility is out of scope

## 1.4 Security (Technologies, techniques, and classes (with their location in the project structure) responsible for authentication and authorization of permissions and sessions.)

* Authentication method: Multifactor through AWS Cognito
* Authorization: AWS Cognito       
* Single sign on AWS Cognito
* Authentication handled through AWS Cognito
* Access method: RBAC
* Roles: ADMIN, USER_AGENT, SUPPORT, AUDIT
* Permissions by role:
*   * ADMIN:
*     + Permission code: MANAGE_USER
*     + Permission code: VIEW_REPORTS
*     + Permission code: EDIT_TEMPLATES
*     + Permission code: DOWNLOAD_DUA
*   * USER_AGENT:
*      + Permission code: LOAD_FILES
*      + Permission code: GENERATE_DUA
*      + Permission code: DOWNLOAD_DUA
*   * SUPPORT:
*      + Permission code: VIEW_ERROR_REPORTS
*      + Permission code: EDIT_TEMPLATES
*      + Permission code: LOAD_FILES
*      + Permission code: DOWNLOAD_DUA
*      + Permission code: GENERATE_DUA
*   * AUDIT:
*      + Permission code: VIEW_REPORTS
*      + Permission code: DOWNLOAD_DUA

*  AWS Secrets Manager is used to store Environment variables, API keys, Sensitive configuration data
*  Server name: customsidentityserver


## 1.5 Layered design
Design and explanation of the different layers of the frontend application.

Folder structure:
```text
/webapp
│
├── .github/
│   └── workflows/                # GitHub DevOps pipelines
│
├── public/
│   └── assets/                   # static assets
│
├── src/
│
│   ├── app/                      # application bootstrap & providers
│   │   ├── App.tsx
│   │   ├── routes.tsx
│   │   ├── store.ts
│   │   └── providers/
│   │       ├── AuthProvider.tsx
│   │       ├── I18nProvider.tsx
│   │       └── ThemeProvider.tsx
│
│   ├── domain/                   # business models & rules
│   │   ├── dua/
│   │   ├── user/
│   │   └── permissions/
│
│   ├── application/              # use cases / orchestration
│   │   ├── generateDUA/
│   │   ├── validation/
│   │   └── workflow/
│
│   ├── infrastructure/           # external integrations
│   │   ├── api/
│   │   │   └── httpClient.ts
│   │   ├── cognito/
│   │   │   ├── authService.ts
│   │   │   └── sessionManager.ts
│   │   ├── observability/
│   │   │   └── appInsights.ts
│   │   └── storage/
│
│   ├── presentation/
│   │
│   │   ├── components/           # Atomic design
│   │   │   ├── atoms/
│   │   │   ├── molecules/
│   │   │   ├── organisms/
│   │   │   └── templates/
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard/
│   │   │   ├── GenerateDUA/
│   │   │   └── Reports/
│   │   │
│   │   ├── hooks/
│   │   ├── layouts/
│   │   └── styles/
│
│   ├── security/
│   │   ├── rbac/
│   │   │   ├── roles.ts
│   │   │   ├── permissions.ts
│   │   │   └── accessGuard.ts
│   │   └── auth/
│   │       └── tokenValidator.ts
│
│   ├── shared/
│   │   ├── constants/
│   │   ├── utils/
│   │   ├── types/
│   │   └── config/
│
│   ├── i18n/
│   │   ├── index.ts
│   │   └── locales/
│
│   └── main.tsx
│
├── tests/
│   ├── unit/                     # Jest
│   └── integration/              # Playwright
│
├── .husky/                       # git hooks
├── tsconfig.json
├── eslint.config.js
├── prettier.config.js
└── package.json
```

List of responsability layers:
* Presentation Layer
* Component Layer
* Application Layer
* Domain Layer
* Security Layer
* Infrastructure Layer
* Integration Layer
* State Management Layer
* Observability Layer
* Configuration Layer
* Shared/Common Layer

Execution Workflow:
* User accesses application URL (AWS App Services hosting)
* Application bootstrap initializes providers (Auth, i18n, Theme, Observability)
* Cognito session validation executed
* MFA authentication performed if session not valid
* JWT token retrieved and stored in secure session context
* RBAC role extracted from token claims
* Route guard validates permissions before page rendering
* Page loads Atomic components and layout templates
* User selects folder for processing
* Files uploaded through infrastructure API client
* Backend ingestion workflow triggered
* Frontend subscribes to workflow status updates
* UI updates stage-based progress:
  * Ingestion
  * OCR
  * Extraction
  * Mapping
  * Validation
  * Word generation
* Validation results mapped into domain models
* Traceability metadata displayed per field
* User edits fields with undo/reset capability
* Generate DUA action executed
* File download enabled based on RBAC permission
* Observability events sent to AWS Application Insights
* Session maintained via Cognito token refresh
* Logout clears session and cached state

Gaps detected:
1. State Management Strategy Missing
  No definition of:
    Redux / Zustand / React Query / Context boundaries.
2. API Communication Pattern Undefined
  Missing:
    * REST vs GraphQL
    * retry strategy
    * error normalization
    * request caching
3. Token Storage Strategy Not Defined
  Need clarification:
    * memory storage vs cookies
    * refresh token handling
    * XSS mitigation approach
4. Error Handling Layer Missing
  No definition for:
    * global error boundary
    * API error mapping
    * UX error consistency
5. Environment Configuration Strategy Missing
  Need definition of:
    * env variable injection
    * runtime config per environment
    * secrets retrieval strategy
6. Observability Scope Undefined
  You mention AWS Application Insights but not:
    * what events are tracked
    * performance metrics
    * user journey telemetry
7. Loading & Async Strategy Missing
  Your workflow implies long OCR processing but lacks:
    * polling vs websocket strategy
    * cancellation handling
    * optimistic UI rules
8. Permission Enforcement Location Not Explicit
  * RBAC defined but missing statement:
  * enforcement at route level
  * component level
  * API call level

The frontend performs Server-Side Rendering (SSR) using ReactJS executed within a Node.js runtime hosted on AWS App Runner.
If no authenticated session exists, the Security Layer invokes AWS Cognito authentication with Multi-Factor Authentication enabled.
Upon successful authentication:
  * Cognito issues JWT tokens.
  * User roles are extracted for RBAC authorization.
  * The requested visual resource is rendered through the Components Layer.

**Component Structure**
Components follow Atomic Design:
  * Atoms
  * Molecules
  * Organisms
  * Templates
  * Pages

A Hooks layer connects UI interactions with application Services.

**Services Layer**
Services implement application operations and workflows.
Services may access:
  * Utils Layer
  * ApiClients Layer
  * Settings Layer

**Settings Layer**
The Settings layer retrieves configuration securely from AWS Secrets Manager during server-side rendering.
Secrets include:
  * API keys
  * service endpoints
  * environment configuration

**ApiClients Layer**
ApiClients handle communication with external APIs.
  * Endpoints and credentials are read from Settings.
  * Requests and responses use shared Models.
  * All data is validated using the DataValidation layer.

**Shared Layers**
The following layers are accessible system-wide:
  * Models
  * Utils
  * State Management
  * Exception Handling

**Notification Service**
The NotificationService allows asynchronous processing through callback endpoints exposed via AWS API Gateway.
External systems notify processing completion through callbacks rather than polling.

**Logging and Observability**
System events are registered through the Logs layer and transmitted to:
  * AWS CloudWatch Logs
  * AWS Application Insights

**Deployment Pipeline**
Code is stored in GitHub repositories and deployed using GitHub DevOps pipelines across environments:
  * Development
  * Stage
  * Production
Deployment targets AWS App Runner services.
```text  
+----------------------+
|     User Browser     |
+----------+-----------+
           |
           v
+-----------------------------+
|        AWS App Runner       |
|     NodeJS + React SSR      |
+-------------+---------------+
              |
        Authentication
              |
        AWS Cognito (MFA)
              |
+-----------------------------+
|      Components Layer       |
|       Atomic Design UI      |
+-------------+---------------+
              |
            Hooks
              |
        Services Layer
              |
   +----------+-----------+
   |          |           |
 Utils   ApiClients   Settings
                         |
              AWS Secrets Manager
                         |
                   Secrets / Config

ApiClients → External APIs
External APIs → API Gateway → Notification Service

Shared:
Models | Validation | State | Exception Handling

Logs → CloudWatch → AWS Application Insights

CI/CD:
GitHub → Pipelines → Dev/Stage/Prod → App Runner
```

## 1.6 Design patterns
This section lists the object-oriented design patterns used in the frontend, including **where each pattern lives in the current project structure** (security, UI refresh, notifications, state storage, API calls, async operations, session invalidation, event-driven programming, and object creation). :contentReference[oaicite:1]{index=1}

### Pattern map (concern → pattern → classes/modules → location)

| Concern / Need | Pattern | Classes / Modules | Location (existing folders) | How it is used |
|---|---|---|---|---|
| Authentication integration (MFA, login, logout, refresh) | **Facade** | `authService` | `src/infrastructure/cognito/authService.ts` :contentReference[oaicite:2]{index=2} | Wraps Cognito calls behind a small API used by UI/providers. |
| Session lifecycle (valid, refreshing, expired) + session invalidation | **State** | `sessionManager` | `src/infrastructure/cognito/sessionManager.ts` :contentReference[oaicite:3]{index=3} | Centralizes token refresh / expiration rules and exposes a single session state to the app. |
| Route-level authorization (RBAC) before rendering pages | **Proxy (Guard)** | `accessGuard` | `src/security/rbac/accessGuard.ts` :contentReference[oaicite:4]{index=4} | Blocks navigation/render if the user role/permissions do not allow the route/action. |
| Token validation rules (signature/claims/expiration) | **Strategy** | `tokenValidator` | `src/security/auth/tokenValidator.ts` :contentReference[oaicite:5]{index=5} | Encapsulates validation logic so rules can evolve without touching UI code. |
| Permissions catalog (roles → permissions) | **Specification (Rules as data)** | `roles`, `permissions` | `src/security/rbac/roles.ts`, `src/security/rbac/permissions.ts` :contentReference[oaicite:6]{index=6} | Defines authorization rules and permission codes used by guards and UI. |
| Central HTTP calls to backend | **Facade** | `httpClient` | `src/infrastructure/api/httpClient.ts` :contentReference[oaicite:7]{index=7} | Single entrypoint for REST calls (GET/POST/etc.) used by application workflows. |
| Cross-cutting HTTP behaviors (auth header, retry, error mapping, logging) | **Decorator (Interceptor-style)** | `httpClient` internal wrappers (e.g., attach token, retry) | `src/infrastructure/api/httpClient.ts` :contentReference[oaicite:8]{index=8} | Adds behaviors without changing every call site; keeps API calls consistent. |
| App bootstrap + global concerns (auth, i18n, theme) | **Provider / Dependency Injection (composition)** | `AuthProvider`, `I18nProvider`, `ThemeProvider` | `src/app/providers/*` :contentReference[oaicite:9]{index=9} | Provides global services/context to all pages/components. |
| Global state storage (job, selected files, progress, issues) | **Redux/Flux-style Store** | `store` | `src/app/store.ts` :contentReference[oaicite:10]{index=10} | Single source of truth for UI state; reduces inconsistent local states. |
| Orchestrate the use case (select folder → analyze → poll/receive updates → review → export) | **Mediator (Use-case coordinator)** | `GenerateDUA` use case modules | `src/application/generateDUA/` :contentReference[oaicite:11]{index=11} | Keeps UI thin: pages trigger use cases; use cases call infrastructure and update state. |
| Long-running workflow status updates (UI refresh by stages) | **Observer (Pub/Sub)** | Workflow “status subscription” utilities + hooks | `src/application/workflow/` + `src/presentation/hooks/` :contentReference[oaicite:12]{index=12} | UI subscribes to job status events (polling or callback-driven) and re-renders progress screens. |
| Validation rules (currency mismatch, totals mismatch, invalid date) | **Strategy** | validation rule modules | `src/application/validation/` :contentReference[oaicite:13]{index=13} | Each rule is a strategy; a validator runs all strategies and produces an `Issues` list. |
| Domain modeling (DUA fields, extracted evidence, confidence) | **Value Objects / Domain Model** | DUA models | `src/domain/dua/` :contentReference[oaicite:14]{index=14} | Keeps “DUA Field + confidence + evidence source” consistent across UI and workflows. |
| UI actions as testable operations (Analyze, Cancel, Retry OCR, Generate Word) | **Command** | command modules for workflow actions | `src/application/workflow/` :contentReference[oaicite:15]{index=15} | Encapsulates each action so it can be tested without React rendering. |
| Observability (track events: start job, cancel, retry, download) | **Facade** | `appInsights` | `src/infrastructure/observability/appInsights.ts` :contentReference[oaicite:16]{index=16} | Centralized telemetry for key user journeys and system events. |
| Configuration and secrets access | **Facade** | config/settings utilities | `src/shared/config/` :contentReference[oaicite:17]{index=17} | Centralizes env/config reads; avoids scattered hardcoded constants. |

---
### Event-driven programming (notifications vs polling)
The system supports asynchronous completion updates (“Notification Service” callbacks) and can also fall back to polling. In the frontend this is represented as an **Observer subscription** in `src/application/workflow/` consumed by hooks in `src/presentation/hooks/`, which updates the UI stage-by-stage (Ingestion → OCR → Extraction → Mapping → Validation → Word). 

### Where patterns appear in the current architecture
- **Security Layer**: RBAC guard + token validation + Cognito session lifecycle. :contentReference[oaicite:19]{index=19}  
- **Infrastructure Layer**: HTTP client, Cognito integration, observability SDK. :contentReference[oaicite:20]{index=20}  
- **Application Layer**: use cases (Generate DUA), workflow orchestration, validation strategies. :contentReference[oaicite:21]{index=21}  
- **Presentation Layer**: pages/components use hooks that subscribe to workflow updates and read state from `store.ts`. :contentReference[oaicite:22]{index=22}

## 1.7 Scaffold
The complete scaffold

[`src/frontend/webapp/`](./src/frontend/webapp)

Structure overview:

| Layer | Path |
|---|---|
| App bootstrap & providers | [`src/app/`](./src/frontend/webapp/src/app) |
| Domain models | [`src/domain/`](./src/frontend/webapp/src/domain) |
| Application / use cases | [`src/application/`](./src/frontend/webapp/src/application) |
| Infrastructure | [`src/infrastructure/`](./src/frontend/webapp/src/infrastructure) |
| Presentation (UI) | [`src/presentation/`](./src/frontend/webapp/src/presentation) |
| Security (RBAC) | [`src/security/`](./src/frontend/webapp/src/security) |
| Shared utilities | [`src/shared/`](./src/frontend/webapp/src/shared) |
| i18n (EN/ES) | [`src/i18n/`](./src/frontend/webapp/src/i18n) |
| Unit tests (Jest) | [`tests/unit/`](./src/frontend/webapp/tests/unit) |
| Integration tests (Playwright) | [`tests/integration/`](./src/frontend/webapp/tests/integration) |
| CI/CD pipeline | [`.github/workflows/ci-cd.yml`](./src/frontend/webapp/.github/workflows/ci-cd.yml) |



# 2. Backend Design — DUA Streamliner

This section documents the backend as a system: transport protocol, API contract, business paradigm, hosting, domain boundaries (DDD), security, observability, DevOps, availability, scalability, and C4 views (context, containers, components, and code).

---

## 2.1 Technology Stack

### 2.1.1 Transport and Application Protocol

| Decision | Choice (DUA Streamliner) | Justification |
|---|---|---|
| Transport | HTTPS — TLS 1.2+ over TCP; TLS termination at Application Load Balancer (ALB) with HTTP/2 support | Internet-facing service; compatibility with browsers and corporate clients; HTTP/2 reduces latency for concurrent SSE + REST calls |
| API style over HTTP | **REST** with OpenAPI 3.1 contract | Aligned with broad integrations, HTTP-level caching where applicable, and operational simplicity for the MVP; well-understood by the frontend team already consuming REST endpoints |
| Real-time (job status) | **SSE (Server-Sent Events)** as primary channel; HTTP polling as fallback | Stage-by-stage progress (Ingestion → OCR → Extraction → Mapping → Validation → Word) without requiring WebSocket support in all corporate environments |
| Internal events / messaging | **Amazon SQS** (standard queues + DLQ) | Decouples the synchronous API from heavy processing (OCR, extraction); absorbs traffic spikes and enables automatic retries |

**Why REST and not GraphQL:** The frontend already defines a clear, stable set of operations (create job, poll status, review fields, download artifact). REST with OpenAPI provides a typed contract natively, a straightforward caching model, and zero additional runtime dependency on the client side.

**Business logic paradigm:**

- **Synchronous (request/response):** delegated authentication (JWT validation), job creation, metadata queries, download of already-generated artifacts.
- **Asynchronous via queues/events:** document pipeline (ingestion, OCR, semantic extraction, mapping, validation, Word generation) executed by workers consuming SQS messages.
- **Batch (post-MVP phase):** aggregate reports, reconciliation, and quality metrics outside the online path.

### 2.1.2 Service Technologies and Versions

| Layer | Technology | Version |
|---|---|---|
| Language & framework | Python + FastAPI | Python 3.12 / FastAPI 0.115+ |
| Data validation | Pydantic | v2 (bundled with FastAPI 0.115+) |
| ORM | SQLAlchemy | 2.0+ |
| Database migrations | Alembic | 1.13+ |
| HTTP client (outbound) | httpx | 0.27+ |
| AWS SDK | boto3 / aiobotocore | latest stable |
| OpenTelemetry | opentelemetry-sdk + AWS X-Ray exporter | 1.x |
| Structured logging | structlog | 24.x |
| Containerization | Docker (OCI images) | — |
| Container orchestration | AWS ECS Fargate | — |
| API gateway | Amazon API Gateway (HTTP API) | — |
| Load balancer | AWS Application Load Balancer | — |
| Relational database | Amazon RDS for PostgreSQL | 16 |
| Object storage | Amazon S3 | — |
| Cache / ephemeral state | Amazon ElastiCache for Redis | 7.x |
| Message queue | Amazon SQS (standard + DLQ) | — |
| Identity provider | Amazon Cognito | — |
| Secrets management | AWS Secrets Manager + SSM Parameter Store | — |
| Unit testing | pytest | 8.x |
| Integration testing | pytest + testcontainers | — |

### 2.1.3 Monorepo Structure

The entire project lives in a **single GitHub repository** shared with the frontend. Path filters in CI/CD ensure only the affected side is built on each push.

```
/ (repository root)
├── src/
│   ├── frontend/
│   │   └── webapp/               ← React 19 SSR (Node.js 21)
│   └── backend/                  ← Python 3.12 / FastAPI (this document)
│       ├── api/
│       ├── application/
│       ├── domain/
│       ├── infrastructure/
│       ├── worker/
│       ├── contracts/
│       ├── tests/
│       ├── infra/                ← Terraform IaC
│       ├── Dockerfile.api
│       ├── Dockerfile.worker
│       └── pyproject.toml
├── .github/
│   └── workflows/
│       ├── frontend-ci-cd.yml
│       └── backend-ci-cd.yml     ← path filter: src/backend/**
└── README.md
```

### 2.1.4 Hosting

| Artifact | Model | AWS Service |
|---|---|---|
| REST API + SSE | Managed containers | AWS ECS Fargate (`api` service) behind ALB |
| Pipeline workers | Managed containers | AWS ECS Fargate (`worker` service) scaled by queue depth |
| Lightweight auxiliary functions (optional) | Serverless | AWS Lambda only if a step fits time/size limits (e.g., small transformations) |

---

## 2.2 Services, Microservices, Repositories, and DDD

### 2.2.1 Explicit Decisions

| Axis | Decision |
|---|---|
| Deployable artifacts | Two in the MVP: `api` (FastAPI) and `worker` (async pipeline). Same codebase, different entry points, independent scaling |
| Repository | Monorepo — `src/frontend/webapp` and `src/backend` coexist; CI with path filters builds only what changed |
| Microservices | Not fragmented into multiple microservices in the MVP — modular monolith split into two processes (API + worker) for operational cohesion and transactional consistency in PostgreSQL |
| Contracts | OpenAPI 3.1 (public API); internal queue messages use versioned JSON Schema (`schema_version` field in every message envelope) |

### 2.2.2 Bounded Contexts (DDD)

| Bounded Context | Responsibility | Notes |
|---|---|---|
| Identity and Access | Validate JWTs issued by Amazon Cognito (MFA on the IdP side); map claims to internal roles aligned with the frontend RBAC model | No server-side session required; API is stateless |
| Job Orchestration | Create/cancel jobs, manage state transitions, publish progress events | Application-level orchestration + queues; no heavyweight BPM engine in MVP |
| Ingestion and Storage | Upload to S3, file registration, type detection, input normalization | Optional virus scan (e.g., ClamAV in worker) as a future improvement |
| OCR and Text Extraction | Native PDF vs. scanned; OCR engines; tabular extraction | Isolates provider/local dependencies |
| Semantic Extraction and Mapping | Customs-domain entities → DUA fields; confidence scoring | Core of the domain; extensible rules |
| Validation and Issues | Business rules (totals, currencies, dates, cross-document coherence) | Produces the issues list consumed by the frontend review screen |
| DUA Export | Word generation from template + reviewed metadata | Output stored in S3 + pre-signed download URL |

**Tactical patterns per context:**

- Aggregates (`Job`, `DuaDraft`) with explicit invariants.
- One repository interface per aggregate in the persistence layer.
- Domain services where logic does not belong to a single entity.
- Anticorruption layer against AWS SDKs and any optional external connectors.

---

## 2.3 Security

### 2.3.1 Authentication

Authentication is **fully delegated to Amazon Cognito**, the same identity provider used by the frontend.

- **Protocol:** OAuth 2.0 / OIDC.
- **MFA:** enforced at the Cognito level (TOTP or SMS); the backend never handles MFA logic directly.
- **JWT validation:** on every request the API validates the token locally (no round-trip to Cognito per request):
  - Signature verified against Cognito's JWKS endpoint (public keys cached with TTL).
  - Claims checked: `iss`, `aud`, `exp` (with a ≤ 30s clock leeway), `token_use`.
- **Token lifetimes:** access token 15 minutes; refresh token 7 days (configured in Cognito user pool).
- **Stateless API:** no server-side session. Each request must carry a valid Bearer token.

### 2.3.2 Authorization (RBAC)

Roles and permission codes are identical to those defined in the frontend, enforced independently on the backend:

| Role | Permission codes enforced by the backend |
|---|---|
| `ADMIN` | `MANAGE_USER`, `VIEW_REPORTS`, `EDIT_TEMPLATES`, `DOWNLOAD_DUA` |
| `USER_AGENT` | `LOAD_FILES`, `GENERATE_DUA`, `DOWNLOAD_DUA` |
| `SUPPORT` | `VIEW_ERROR_REPORTS`, `EDIT_TEMPLATES`, `LOAD_FILES`, `GENERATE_DUA`, `DOWNLOAD_DUA` |
| `AUDIT` | `VIEW_REPORTS`, `DOWNLOAD_DUA` |

Role is extracted from the `cognito:groups` claim in the JWT. Each endpoint declares the minimum required permission via a dependency injected guard (`PermissionGuard`).

### 2.3.3 Password and Credential Handling

DUA Streamliner does **not manage usernames or passwords directly** — that responsibility belongs entirely to Amazon Cognito. The following applies to the scope the backend does own:

| Concern | Decision |
|---|---|
| User passwords | Managed exclusively by Cognito (SRP protocol, bcrypt-based storage on AWS side). The backend never receives or stores passwords |
| Service-to-service credentials (DB, SQS, S3) | No static credentials. ECS Task Role (IAM) grants access via short-lived tokens rotated automatically by AWS |
| API keys and connection strings | Stored in **AWS Secrets Manager**. Loaded at container startup via `boto3`; never written to environment variables in plain text or committed to Git |
| Non-sensitive configuration | **AWS SSM Parameter Store** (SecureString for versioned config, String for non-sensitive values) |
| Encryption keys | Managed by **AWS KMS**. Used by RDS (encryption at rest), S3 (SSE-KMS), and application-level field encryption |

### 2.3.4 Encryption

| Data | Algorithm | Implementation |
|---|---|---|
| Data in transit | TLS 1.2+ (ALB terminates, re-encrypts to ECS if end-to-end is required) | AWS Certificate Manager (auto-renewal) |
| RDS at rest | AES-256 (AWS KMS managed key) | Enabled on RDS instance creation |
| S3 at rest | AES-256 SSE-KMS | Bucket policy enforces `aws:SecureTransport` |
| Sensitive DB fields (e.g., taxpayer IDs) | AES-256-GCM at application level, before persisting | 96-bit random IV per record; key retrieved from Secrets Manager |
| EBS volumes (Fargate tasks) | AES-256 (AWS managed) | Enabled by default in Fargate |

### 2.3.5 API Surface Protection

| Control | Value / Setting |
|---|---|
| General payload limit | 10 MB |
| Upload endpoint (`POST /v1/jobs`) | 100 MB per request |
| Rate limit — anonymous IP | 30 req/min (AWS WAF rate-based rule) |
| Rate limit — authenticated user | 300 req/min (API Gateway usage plan) |
| Rate limit — upload endpoint | 10 req/min per user |
| Max concurrent ECS tasks (`api`) | 10 (auto-scaling ceiling for cost control) |
| Input validation | Strict Pydantic models; unknown fields rejected; types enforced |
| OWASP API Top 10 | Addressed via WAF rules + input validation + auth guards |

### 2.3.6 Data Retention

| Data type | Hot (production DB / S3) | Archive (S3 Glacier) | Deletion |
|---|---|---|---|
| Generated DUAs | 12 months | Up to 5 years | Per S3 lifecycle rule |
| Uploaded source files | 6 months | Up to 3 years | Per S3 lifecycle rule |
| Audit logs | 90 days (CloudWatch) | 1 year (S3) | Automatic CloudWatch retention policy |
| JWT sessions | Until expiration | — | Immediate on logout (Cognito token revocation) |

---

## 2.4 Observability

### 2.4.1 Platform

| Pillar | Tool | Notes |
|---|---|---|
| Structured logs | **Amazon CloudWatch Logs** + `structlog` (JSON format) | `request_id`, `job_id`, `trace_id`, `user_id` on every log line |
| Metrics | **Amazon CloudWatch Metrics** + Dashboards | RPS, p95/p99 latencies, 4xx/5xx error rates, SQS queue depth, per-stage pipeline duration |
| Distributed tracing | **AWS X-Ray** via OpenTelemetry SDK | Correlation propagated from API request → SQS message → worker |
| Analysis dashboards | **Amazon CloudWatch Dashboards** | Operational view; Grafana with CloudWatch datasource optional for richer analysis |
| Alerts | **Amazon CloudWatch Alarms** → SNS → email / Slack webhook | Thresholds defined per SLI |

This mirrors the frontend observability stack: the frontend sends events to **AWS Application Insights** (CloudWatch-backed); the backend sends structured logs and traces to **CloudWatch Logs + X-Ray**, giving a unified end-to-end view in the same AWS console.

### 2.4.2 Instrumented Events

All events are logged as structured JSON with the fields: `timestamp`, `request_id`, `job_id`, `trace_id`, `user_id`, `module`, `event`, `level`, `metadata`.

#### Authentication and Session

| Event | Level |
|---|---|
| `auth.token.validated` | INFO |
| `auth.token.invalid` | WARNING |
| `auth.token.expired` | WARNING |
| `auth.unauthorized_access` | WARNING |
| `auth.forbidden` (RBAC permission missing) | WARNING |

#### Job Pipeline

| Event | Level |
|---|---|
| `job.created` | INFO |
| `job.submitted` | INFO |
| `job.cancelled` | INFO |
| `job.stage.started` (`ingestion` / `ocr` / `extraction` / `mapping` / `validation` / `export`) | INFO |
| `job.stage.completed` | INFO |
| `job.stage.failed` | ERROR |
| `job.pipeline.completed` | INFO |
| `job.pipeline.failed` | ERROR |
| `job.message.published_to_sqs` | INFO |
| `job.message.consumed_from_sqs` | INFO |
| `job.message.dead_lettered` | ERROR |

#### Storage and Artifacts

| Event | Level |
|---|---|
| `storage.s3.upload.started` | INFO |
| `storage.s3.upload.completed` | INFO |
| `storage.s3.upload.failed` | ERROR |
| `storage.signed_url.generated` | INFO |
| `storage.s3.download.failed` | ERROR |

#### Infrastructure and Errors

| Event | Level |
|---|---|
| `api.rate_limit.hit` | WARNING |
| `api.payload_too_large` | WARNING |
| `db.query.slow` (> 500 ms) | WARNING |
| `exception.unhandled` | CRITICAL |
| `exception.validation` | WARNING |
| `health.liveness.ok` / `.failed` | INFO / ERROR |
| `health.readiness.ok` / `.failed` | INFO / ERROR |

**Baseline SLIs:** API availability (target 99.9%), time to first job progress event (p95 < 5 s), OCR failure rate per batch (< 2%).

---

## 2.5 Infrastructure (DevOps)

### 2.5.1 CI/CD

**GitHub Actions** — code lives in GitHub; path filters on the monorepo ensure only `src/backend/**` changes trigger the backend pipeline.

Pipeline: `.github/workflows/backend-ci-cd.yml`

```
Triggers: push / PR to branches: main, develop, release/*

Stage 1 — lint        ruff check + black --check + mypy (strict)
Stage 2 — test        pytest (unit + integration via testcontainers)
Stage 3 — build       docker build → OCI image tagged by Git SHA digest
Stage 4 — push        Amazon ECR (no "latest" tag in stage/prod)
Stage 5 — deploy:dev      ECS rolling update — automatic on push to develop
Stage 6 — deploy:stage    ECS rolling update — automatic on push to release/*
Stage 7 — deploy:prod     ECS blue/green (CodeDeploy) — manual approval gate on main
```

### 2.5.2 Infrastructure as Code

| Environment | Tool | Trigger |
|---|---|---|
| **dev** | Terraform (`infra/env/dev/`) | Push to `develop` |
| **stage** | Terraform (`infra/env/stage/`) | Push to `release/*` |
| **prod** | Terraform (`infra/env/prod/`) | Manual approval on `main` |

Terraform manages: VPC, RDS, S3, SQS, ECS (cluster + task definitions + services), ALB, API Gateway, IAM least-privilege roles, CloudWatch log groups, X-Ray sampling rules.

```
src/backend/infra/
├── modules/          ← reusable modules (ecs-service, rds, sqs, alb, iam)
└── env/
    ├── dev/
    ├── stage/
    └── prod/
```

### 2.5.3 Secrets in CI/CD

- GitHub Secrets federated with AWS via **OIDC (GitHub Actions ↔ AWS IAM)** — no static AWS keys in CI.
- At runtime: ECS Task Role accesses Secrets Manager and SSM Parameter Store directly; no secrets in environment variables.

### 2.5.4 Container Policy

- Images identified by immutable digest (no `latest` in stage/prod).
- Vulnerability scanning enabled in Amazon ECR (Inspector).
- Retention policy: last 10 images per repository in dev; production images kept with a lifecycle rule deleting those older than 180 days.

---

## 2.6 Availability

### SLA Target

**99.9% uptime** → maximum **8.7 hours of downtime per year** (internal operational target; reviewed toward 99.95% post-MVP).

### Single Points of Failure and Mitigation

| Component | Native AWS SLA | Meets 99.9%? | Mitigation strategy |
|---|---|---|---|
| ECS Fargate (multi-AZ) | 99.99% | ✅ | Minimum 2 tasks per service; liveness and readiness health checks configured |
| ALB (multi-AZ) | 99.99% | ✅ | Native multi-AZ; no additional action required |
| Amazon API Gateway (HTTP API) | 99.99% | ✅ | Native regional service |
| RDS PostgreSQL (Multi-AZ) | 99.95% | ✅ | Multi-AZ enabled in stage/prod; standby in separate AZ; failover ~60 s |
| Amazon SQS | 99.9% | ✅ | Managed service; DLQ configured with `maxReceiveCount: 3` |
| Amazon S3 | 99.99% | ✅ | Native; versioning enabled on outputs bucket |
| ElastiCache Redis | 99.9% | ✅ | Multi-AZ with replica; degraded mode acceptable (SSE progress is reconstructible) |

### Recovery Strategy

- **RTO:** 15 minutes (automatic RDS failover + ECS task rescheduling).
- **RPO:** 5 minutes (RDS automated backups + Multi-AZ transaction log replication).
- RDS automated backups: 7 days retention in dev; 35 days in prod.
- Deployment rollback: ECS retains previous task definition; re-deploy in < 3 minutes.
- External dependency resilience: explicit timeouts, retries with exponential backoff, circuit breaker via `tenacity` for any optional external connectors.

---

## 2.7 Scalability

| Component | Strategy | Trigger |
|---|---|---|
| ECS Fargate — `api` | Horizontal auto-scaling (target tracking) | CPU > 70% or connection count > 80% of target |
| ECS Fargate — `worker` | Auto-scaling by SQS metric: `ApproximateNumberOfMessagesVisible` | > 10 visible messages → +1 task; cooldown 60 s |
| RDS PostgreSQL | Vertical scale-up (instance class change) | `CPUUtilization` > 80% sustained; reviewed weekly in prod |
| Amazon SQS | Automatic (managed service) | — |
| Amazon S3 | Automatic (managed service) | — |
| ElastiCache Redis | Node scale-up or replica addition | `EngineCPUUtilization` > 75% |

**Stateless `api` layer:** no in-memory server sessions; progress state lives in Redis with strict TTL.

**Auto-scaling ceilings (cost control):**

- `api`: maximum 10 Fargate tasks (1 vCPU / 2 GB each).
- `worker`: maximum 20 Fargate tasks (2 vCPU / 4 GB each).

**Future partitioning:** natural key `job_id` in storage and messages; PostgreSQL table partitioning by `created_at` when volume justifies it.

---

## 2.8 Backend Key Workflows

### Workflow 1 — File Upload and Job Creation

```
1.  Client → POST /v1/jobs
      Headers: Authorization: Bearer <jwt>
      Body: { "files": [{ "name": "invoice.pdf", "size": 204800 }], "template_id": "..." }

2.  API Gateway validates JWT (signature, aud, iss, exp).
    Rate limit: 300 req/min per authenticated user.

3.  JobsRouter → CreateJobService:
    a. Validates command with Pydantic (types, declared sizes, template existence).
    b. Creates Job aggregate (id=ULID, owner=user_id, status=PENDING).
    c. Persists to PostgreSQL via SqlJobRepository.
    d. Generates S3 pre-signed PUT URLs (TTL: 15 min) for direct client upload.

4.  Response: 201 Created + { job_id, upload_urls: [...], status: "PENDING" }

5.  Client PUTs files directly to S3 (bypasses the API — reduces backend load).

6.  Client → POST /v1/jobs/{job_id}/submit
    a. API verifies S3 objects exist (HeadObject).
    b. Updates Job.status = QUEUED.
    c. Publishes SQS message:
       { schema_version: 1, type: "PIPELINE_START", job_id, s3_keys: [...] }

7.  Response: 202 Accepted + { job_id, status: "QUEUED" }
```

### Workflow 2 — Async Pipeline (Worker)

```
1.  Worker consumes SQS message type PIPELINE_START.

2.  PipelineDispatcher routes to IngestHandler:
    a. Downloads files from S3 via streaming (no full RAM load).
    b. Detects MIME type; normalizes (native PDF vs. scanned image).
    c. Updates Job.stage = INGESTING; publishes progress to Redis.

3.  OcrHandler (if file is a scanned image):
    a. Applies OCR engine (configurable: Amazon Textract / local Tesseract).
    b. Persists extracted text in PostgreSQL (table: document_text).
    c. Updates progress in Redis.

4.  ExtractionHandler:
    a. Extracts customs-domain entities (consignee, FOB value, tariff headings, etc.).
    b. Persists in table dua_fields with confidence score and source reference
       (file, page, snippet) — data displayed in the frontend Evidence panel.

5.  MappingHandler:
    a. Maps extracted entities → canonical DUA structure.
    b. Persists DuaDraft with status MAPPED.

6.  ValidationHandler:
    a. Applies business rules (totals, currencies, dates, cross-document coherence).
    b. Generates issues list in table job_issues (used by frontend Issues screen).
    c. Updates Job.status = VALIDATED or NEEDS_REVIEW (if critical issues found).

7.  ExportWordHandler:
    a. Generates .docx from template + DuaDraft.
    b. Uploads artifact to S3 (outputs bucket, prefix: {job_id}/dua_draft.docx).
    c. Updates Job.status = COMPLETED; persists s3_output_key.

8.  On any stage failure: DLQ after 3 attempts; Job.status = FAILED; event logged.
```

### Workflow 3 — Progress Subscription (SSE)

```
1.  Client → GET /v1/jobs/{job_id}/progress
      Headers: Accept: text/event-stream

2.  API opens SSE connection (streaming response with FastAPI EventSourceResponse).

3.  Every 1 second: reads progress from Redis (key: progress:{job_id}).
    Emits SSE event: { stage, percentage, message, timestamp }
    Stages match the frontend progress bar labels:
    Ingestion → OCR → Extraction → Mapping → Validation → Word

4.  When Job.status = COMPLETED or FAILED: emits final event and closes connection.

5.  Polling fallback: GET /v1/jobs/{job_id} returns current status from PostgreSQL.
```

### Workflow 4 — DUA Download

```
1.  Client → GET /v1/jobs/{job_id}/download
      Required permission: DOWNLOAD_DUA

2.  API verifies Job.status == COMPLETED and Job.owner == user_id from JWT.

3.  Generates S3 pre-signed GET URL (TTL: 15 minutes) for the .docx artifact.

4.  Response: 200 OK + { download_url, expires_at }

5.  Client downloads directly from S3 with the signed URL — no API bandwidth used.
```

---

## 2.9 C4 Architecture Diagrams

### Level 1 — System Context

```
┌──────────────────────────────────────────────────────────────────┐
│                        DUA Streamliner                           │
│                       [Software System]                          │
│                                                                  │
│  Python 3.12 + FastAPI · AWS ECS Fargate · PostgreSQL RDS 16    │
└───────────────────┬──────────────────────────────────────────────┘
                    │
      ┌─────────────┼──────────────┬──────────────────────┐
      │             │              │                      │
 ┌────▼──────┐ ┌────▼──────────┐ ┌▼──────────────┐ ┌────▼────────────────┐
 │ Customs   │ │Amazon Cognito │ │ Normative refs │ │ CloudWatch / X-Ray  │
 │ Operator  │ │ [OIDC IdP]    │ │ (Customs auth.)│ │ [Observability]     │
 │ (user)    │ │ MFA enforced  │ │ human-consulted│ │ Logs, metrics,      │
 └───────────┘ └───────────────┘ │ outside MVP    │ │ distributed traces  │
                                  └────────────────┘ └─────────────────────┘
```

### Level 2 — Container Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                          DUA Streamliner                             │
│                                                                      │
│  ┌─────────────────┐    ┌──────────────────┐    ┌────────────────┐  │
│  │  SPA / SSR      │───▶│  API Gateway     │───▶│  API Backend   │  │
│  │  React 19       │    │  + ALB           │    │  FastAPI       │  │
│  │  Node.js 21     │    │  TLS termination │    │  ECS Fargate   │  │
│  │  AWS App Runner │    │  throttling/CORS │    └───────┬────────┘  │
│  └─────────────────┘    └──────────────────┘            │           │
│                                                  ┌───────▼────────┐  │
│                                                  │  PostgreSQL 16 │  │
│                                                  │  RDS (Multi-AZ)│  │
│                                                  └───────┬────────┘  │
│                                                          │           │
│                          ┌───────────────┐      ┌───────▼────────┐  │
│                          │    Worker     │◀─────│  Amazon SQS    │  │
│                          │   Pipeline    │      │  + DLQ         │  │
│                          │  ECS Fargate  │      └────────────────┘  │
│                          └───────┬───────┘                          │
│                                  │                                   │
│                   ┌──────────────┼─────────────┐                    │
│              ┌────▼────┐   ┌─────▼────┐   ┌────▼──────────────┐   │
│              │Amazon S3│   │  Redis   │   │CloudWatch + X-Ray │   │
│              │ uploads │   │Elasticach│   │ Logs, metrics,    │   │
│              │ outputs │   │ progress │   │ distributed traces│   │
│              └─────────┘   └──────────┘   └───────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘

External systems:
  Amazon Cognito (OIDC IdP) ◀── frontend SSR + API JWT validation
  AWS Secrets Manager       ◀── API and worker at startup
  AWS KMS                   ◀── RDS, S3, application-level field encryption
```

### Level 3 — Component Diagram (API container)

```
┌────────────────────────────────────────────────────────────────┐
│                     API Backend (FastAPI)                      │
│                                                                │
│  ── Transport layer (API) ──────────────────────────────────  │
│  ┌──────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │HealthRouter  │  │   JobsRouter    │  │   DuaRouter     │  │
│  │/health/*     │  │ /v1/jobs        │  │ /v1/jobs/{id}/  │  │
│  └──────────────┘  └────────┬────────┘  │ progress        │  │
│                              │           │ download        │  │
│  ── Middleware ─────────────┼───────────└─────────────────┘  │
│  ┌──────────────────────────▼─────────────────────────────┐   │
│  │ CognitoJwtMiddleware · PermissionGuard · RequestContext │   │
│  └──────────────────────────┬─────────────────────────────┘   │
│                              │                                  │
│  ── Application layer ───────────────────────────────────── ─  │
│  ┌───────────────────────────▼────────────────────────────┐    │
│  │  CreateJobService    SubmitJobService                  │    │
│  │  GetJobStatusQuery   DownloadArtifactService           │    │
│  └───────────────────────────┬────────────────────────────┘    │
│                               │                                 │
│  ── Domain layer ─────────────────────────────────────────── ─  │
│  ┌────────────────────────────▼───────────────────────────┐    │
│  │  Job (aggregate)       DuaDraft (aggregate)            │    │
│  │  IJobRepository        IDuaDraftRepository             │    │
│  │  ISqsPublisher (port)  IS3Storage (port)               │    │
│  └────────────────────────────┬───────────────────────────┘    │
│                                │                                │
│  ── Infrastructure layer ──────────────────────────────────── ─ │
│  ┌─────────────┐  ┌───────────▼──┐  ┌───────────┐  ┌────────┐ │
│  │SqlJobRepo   │  │SqsPublisher  │  │S3Adapter  │  │Redis   │ │
│  │(SQLAlchemy) │  │(boto3)       │  │(boto3)    │  │Progress│ │
│  └─────────────┘  └──────────────┘  └───────────┘  └────────┘ │
└────────────────────────────────────────────────────────────────┘
```

**Worker components (summary):**

- `PipelineDispatcher` — routes message to the correct stage handler.
- `IngestHandler`, `OcrHandler`, `ExtractionHandler`, `MappingHandler`, `ValidationHandler`, `ExportWordHandler` — application + adapter layers per stage.
- Repositories and S3/SQS adapters share domain contracts with the API through versioned internal DTOs (`schema_version` field).

---

## 2.10 Design Considerations

### System Configuration and Parameters

All system configuration is managed in source code — no hardcoded values anywhere:

| Parameter | Source | Example key |
|---|---|---|
| DB connection string | AWS Secrets Manager | `duastreamliner/{env}/db/connection_string` |
| JWT issuer / audience | SSM Parameter Store | `/duastreamliner/{env}/cognito/issuer` |
| S3 bucket names | ECS environment variables | `S3_UPLOADS_BUCKET`, `S3_OUTPUTS_BUCKET` |
| SQS queue URLs | ECS environment variables | `SQS_PIPELINE_URL` |
| Rate limits | ECS environment variables | `RATE_LIMIT_AUTHENTICATED_PER_MIN` |
| Max payload sizes | ECS environment variables | `MAX_UPLOAD_BYTES` |
| OCR engine selector | SSM Parameter Store | `/duastreamliner/{env}/ocr/engine` |
| Confidence threshold for issues | SSM Parameter Store | `/duastreamliner/{env}/extraction/confidence_threshold` |

### Resource Allocation (ECS Task Definitions)

| Service | Dev | Stage | Prod |
|---|---|---|---|
| `api` task | 0.5 vCPU / 1 GB | 1 vCPU / 2 GB | 1 vCPU / 2 GB (min. 2 tasks) |
| `worker` task | 1 vCPU / 2 GB | 2 vCPU / 4 GB | 2 vCPU / 4 GB (min. 2 tasks) |
| RDS instance | `db.t3.micro` | `db.t3.medium` | `db.r6g.large` (Multi-AZ) |
| ElastiCache | `cache.t3.micro` | `cache.t3.small` | `cache.r6g.large` (with replica) |

### Core Algorithms

| Algorithm | Use | Parameters |
|---|---|---|
| AES-256-GCM | Application-level encryption of sensitive DB fields before persisting | 96-bit random IV per record; key from Secrets Manager |
| JWT validation (RS256) | Cognito token verification on every request | JWKS cached with 1-hour TTL; clock leeway ≤ 30 s |
| Exponential backoff with full jitter | Retries in SQS consumer and outbound calls | Base 500 ms, max 32 s, 5 attempts |
| Sliding window | Rate limiting (WAF rate-based rule + API Gateway usage plan) | 60-second window |
| Confidence scoring | Semantic extraction — each DUA field receives a score 0.0–1.0 | Configurable threshold (default 0.7); below threshold → issue generated |

### External Integrations and Interfaces

| Integration | Type | Authentication |
|---|---|---|
| Amazon Cognito | OIDC — JWT validation via JWKS | Public JWKS endpoint (no secret required) |
| Amazon S3 | SDK `boto3` — uploads, outputs, pre-signed URLs | ECS Task Role (IAM) |
| Amazon SQS | SDK `boto3` — publish and consume | ECS Task Role (IAM) |
| AWS Secrets Manager | SDK `boto3` — secret loading at startup | ECS Task Role (IAM) |
| Amazon Textract (optional OCR) | SDK `boto3` | ECS Task Role (IAM) |
| CloudWatch Logs + X-Ray | SDK `boto3` + OpenTelemetry exporters | ECS Task Role (IAM) |

---

## 2.11 Source Code

The backend skeleton is generated using a specialized agent with the following instruction:

> **Agent instruction:** Generate only the folder structure, `.py` files with class definitions, ABC/Protocol interfaces, and empty dataclasses — without implementing any functional logic. Strictly follow the layered architecture defined in this document. Do not implement any method body — only signatures, docstrings, and type hints.

### Folder Structure (`src/backend/`)

```
src/backend/
├── api/
│   ├── main.py                      # FastAPI app, lifespan hooks, router registration
│   ├── deps.py                      # Dependency injection (repos, services, current user)
│   ├── middleware/
│   │   ├── request_context.py       # request_id / trace_id propagation
│   │   └── security.py              # Cognito JWT validation middleware
│   └── routers/
│       ├── health.py                # GET /health/liveness, /health/readiness
│       ├── jobs.py                  # POST /v1/jobs, POST /v1/jobs/{id}/submit, GET /v1/jobs/{id}
│       └── dua.py                   # GET /v1/jobs/{id}/progress (SSE), GET /v1/jobs/{id}/download
│
├── application/
│   ├── commands/
│   │   ├── create_job.py            # CreateJobCommand (Pydantic)
│   │   └── submit_job.py            # SubmitJobCommand
│   ├── queries/
│   │   └── get_job_status.py        # GetJobStatusQuery
│   └── services/
│       ├── create_job_service.py    # CreateJobService
│       ├── submit_job_service.py    # SubmitJobService
│       └── download_service.py      # DownloadArtifactService
│
├── domain/
│   ├── jobs/
│   │   ├── job.py                   # Job aggregate, JobStatus enum, stage transitions
│   │   └── repositories.py          # IJobRepository (ABC / Protocol)
│   ├── dua/
│   │   ├── dua_draft.py             # DuaDraft aggregate
│   │   ├── value_objects.py         # DuaField, ConfidenceScore, SourceReference, Issue
│   │   └── repositories.py          # IDuaDraftRepository (ABC / Protocol)
│   └── common/
│       ├── ids.py                   # UserId, JobId (ULID wrappers)
│       └── ports.py                 # ISqsPublisher, IS3Storage (Protocol)
│
├── infrastructure/
│   ├── persistence/
│   │   ├── models/
│   │   │   ├── job_model.py         # SQLAlchemy ORM model for jobs
│   │   │   └── dua_draft_model.py   # SQLAlchemy ORM model for dua_drafts / dua_fields
│   │   ├── sql_job_repository.py    # SqlJobRepository implements IJobRepository
│   │   └── sql_dua_repository.py    # SqlDuaDraftRepository implements IDuaDraftRepository
│   ├── messaging/
│   │   └── sqs_publisher.py         # SqsPublisher implements ISqsPublisher (boto3)
│   ├── storage/
│   │   └── s3_adapter.py            # S3StorageAdapter implements IS3Storage (boto3)
│   └── cache/
│       └── redis_progress.py        # RedisProgressStore (progress state for SSE)
│
├── worker/
│   ├── main.py                      # SQS consumer entrypoint, PipelineDispatcher
│   └── handlers/
│       ├── ingest_handler.py        # IngestHandler
│       ├── ocr_handler.py           # OcrHandler (Textract / Tesseract)
│       ├── extract_handler.py       # ExtractionHandler
│       ├── map_handler.py           # MappingHandler
│       ├── validate_handler.py      # ValidationHandler
│       └── export_word_handler.py   # ExportWordHandler (.docx generation)
│
├── contracts/
│   └── openapi.yaml                 # OpenAPI 3.1 — source of truth for the API contract
│
├── tests/
│   ├── unit/
│   │   ├── domain/
│   │   ├── application/
│   │   └── worker/
│   └── integration/
│       ├── api/
│       └── worker/
│
├── infra/                           # Terraform IaC
│   ├── modules/
│   └── env/
│       ├── dev/
│       ├── stage/
│       └── prod/
│
├── Dockerfile.api
├── Dockerfile.worker
└── pyproject.toml
```

### Illustrative Code Fragment

```python
# src/backend/api/routers/jobs.py
from fastapi import APIRouter, Depends, status
from uuid import UUID

from api.deps import get_create_job_service, get_submit_job_service, get_current_user
from application.commands.create_job import CreateJobCommand
from application.commands.submit_job import SubmitJobCommand
from application.services.create_job_service import CreateJobService
from application.services.submit_job_service import SubmitJobService

router = APIRouter(prefix="/v1/jobs", tags=["jobs"])


@router.post("", status_code=status.HTTP_201_CREATED)
def create_job(
    cmd: CreateJobCommand,
    svc: CreateJobService = Depends(get_create_job_service),
    user=Depends(get_current_user),
):
    """Creates a job and returns S3 pre-signed PUT URLs for direct file upload."""
    return svc.execute(cmd, user_id=user.sub).model_dump()


@router.post("/{job_id}/submit", status_code=status.HTTP_202_ACCEPTED)
def submit_job(
    job_id: UUID,
    svc: SubmitJobService = Depends(get_submit_job_service),
    user=Depends(get_current_user),
):
    """Verifies files exist in S3 and enqueues the processing pipeline."""
    return svc.execute(SubmitJobCommand(job_id=job_id), user_id=user.sub).model_dump()
```

```python
# src/backend/application/services/create_job_service.py
from dataclasses import dataclass
from uuid import uuid4

from application.commands.create_job import CreateJobCommand
from domain.common.ids import UserId
from domain.common.ports import IS3Storage
from domain.jobs.job import Job
from domain.jobs.repositories import IJobRepository


@dataclass
class CreateJobService:
    jobs: IJobRepository
    storage: IS3Storage

    def execute(self, cmd: CreateJobCommand, user_id: str):
        uid = UserId(user_id)
        job = Job.create(id=uuid4(), owner=uid, template_id=cmd.template_id)
        self.jobs.save(job)
        upload_urls = [
            self.storage.generate_presigned_put(
                key=f"{job.id}/{f.name}",
                size=f.size,
                ttl_seconds=900,
            )
            for f in cmd.files
        ]
        return job.to_dto(upload_urls=upload_urls)
```

### Key Class Links *(update after generating the skeleton)*

| Class / Interface | Path |
|---|---|
| `JobsRouter` | `src/backend/api/routers/jobs.py` |
| `DuaRouter` (SSE + download) | `src/backend/api/routers/dua.py` |
| `CognitoJwtMiddleware` | `src/backend/api/middleware/security.py` |
| `CreateJobService` | `src/backend/application/services/create_job_service.py` |
| `SubmitJobService` | `src/backend/application/services/submit_job_service.py` |
| `Job` (aggregate) | `src/backend/domain/jobs/job.py` |
| `IJobRepository` | `src/backend/domain/jobs/repositories.py` |
| `ISqsPublisher` | `src/backend/domain/common/ports.py` |
| `IS3Storage` | `src/backend/domain/common/ports.py` |
| `SqlJobRepository` | `src/backend/infrastructure/persistence/sql_job_repository.py` |
| `SqsPublisher` | `src/backend/infrastructure/messaging/sqs_publisher.py` |
| `S3StorageAdapter` | `src/backend/infrastructure/storage/s3_adapter.py` |
| `PipelineDispatcher` | `src/backend/worker/main.py` |
| `ExportWordHandler` | `src/backend/worker/handlers/export_word_handler.py` |
