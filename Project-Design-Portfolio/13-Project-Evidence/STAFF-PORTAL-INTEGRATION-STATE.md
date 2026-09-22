# Staff portal integration state

## Objective and context

- Requested outcome: integrate the supplied staff frontend into the `Pre-production` branch as a separate Staff Portal web service.
- Architecture: a dedicated React/Vite web application at `src/MzansiMarket.StaffWeb`, sharing the Mzansi Market ASP.NET Core API and PostgreSQL database with the customer application.
- Security boundary: staff role enforcement remains server-side. The portal must never use demo users, hard-coded passwords, mock transactional data, or committed `node_modules`.

## Work graph

| Unit | Objective | Depends on | Status |
| --- | --- | --- | --- |
| SP-001 | Create authenticated staff portal foundation and deployment configuration | Existing identity API | Complete / build validated |
| SP-002 | Connect live fulfilment queue and transitions | SP-001, existing fulfilment API | Pending |
| SP-003 | Implement product administration API/contracts and portal views | SP-001 | Pending |
| SP-004 | Implement manager reports, returns, and refund approval API/contracts and portal views | SP-001 | Pending |
| SP-005 | Cross-portal validation and Render deployment | SP-001–SP-004 | Pending |

## Findings and decisions

- The supplied repository is a visual React prototype. Its login, products, categories, promotions, fulfilment orders, reports, and refunds are all mock data.
- Existing API support is available for authentication and fulfilment. Product-administration, reporting, returns, and refund approval endpoints are not yet implemented.
- A separate portal is required by the user. It will be a distinct Render static web service, not staff-only routes inside the customer portal.

## Validation and continuation

- Starting revision: `d8ea1d95fe436c982421b1ca16b7320b2623b1a7` (`Pre-production`).
- SP-001 implementation: added `src/MzansiMarket.StaffWeb` with a standalone Vite/React build, no copied `node_modules`, no demo credentials, an API-backed login, role-gated workspace navigation, and a live fulfilment queue.
- Validation: `npm run build` passed (TypeScript and Vite) on 2026-09-22.
- Security limitation: the starting `Pre-production` API still exposes the historical bearer-token login flow. The portal retains the opaque access token only in runtime memory and never persists it in browser storage. The HTTP-only cookie migration from the active Mzansi workspace must be ported before public deployment.
- Next ready unit: SP-002, then the missing SP-003 and SP-004 API contracts.
