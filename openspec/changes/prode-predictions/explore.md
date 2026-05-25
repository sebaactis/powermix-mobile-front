# Explore PRODE Predictions

PRODE should be implemented as a dedicated authenticated screen reached from a new fixed circular floating button near the lower screen area. It must not reuse an existing button and must not be added as a new bottom tab.

## Findings

| Area | Finding |
| --- | --- |
| Backend contract | User endpoints live under `/api/v1/prode/*` and require the normal JWT bearer auth. |
| Scope | PRODE is only for Argentina matches in World Cup 2026, not a generic tournament predictor. |
| Navigation | `MainNavigator` currently sends authenticated users directly to `TabNavigator`. `TabNavigator` contains Home, Profile, Proofs, Vouchers, Help. |
| Tab risk | `CustomTabBar` renders every tab route, so adding `Prode` as a hidden tab is the wrong approach. |
| Existing non-tab pattern | `ProofsNavigator` and `HelpStackNavigator` use native stack navigators for non-tab child screens. |
| Entrypoint | Use a new round floating action button (FAB) near the bottom of authenticated screens, positioned above the tab bar. Do not repurpose Home buttons. |
| API pattern | Use existing `AuthApi<T>()`, `useAuth().signOut`, and `EXPO_PUBLIC_POWERMIX_API_URL` patterns. |
| API limitation | `ApiResponse` currently omits HTTP status, so reliable 409 cutoff and 404 disabled-feature handling requires exposing status or adding a safe fallback. |
| Testing | `npm run lint` exists. No test runner/script is configured. |

## User decisions captured

- Store SDD artifacts in both OpenSpec and Engram.
- Run SDD interactively.
- Use auto-forecast for PR splitting.
- No hard changed-line review limit.
- Do not add a new tab.
- Add a new fixed round low-position PRODE button; do not reuse an existing button.
- Do not add a frontend visual feature flag for first release; handle backend 404 gracefully.
- Match and prediction must be shown together; do not make `/predictions/me` a separate first-release screen.
- Admin frontend is out of scope.

## Resolved design decisions

1. Entrypoint uses a new circular FAB near the lower authenticated app area, not an existing button.
2. The FAB belongs to the authenticated app shell, appears on eligible tab screens, and is hidden on the PRODE screen.
3. `GET /matches` with embedded `my_prediction` is the first-release source of truth.
4. `ApiResponse` should expose HTTP status additively so PRODE can handle 409 and 404 reliably.
5. Client date/time display is allowed, but prediction eligibility is controlled by backend `is_open` and save responses.
