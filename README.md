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

### Wireframes
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
Class design (with their location in the project structure) where it is necessary to apply object-oriented design patterns, for example: security, UI refresh, receiving notifications, state storage, API calls, asynchronous operations, session invalidation, event-driven programming, object creation.

## 1.7 Scaffold
A folder under `/src` containing the project scaffold, generated based on the full specification from sections 1.1 to 1.6.
