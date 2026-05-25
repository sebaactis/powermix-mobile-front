# Add PRODE predictions screen

Authenticated users will access a new PRODE screen from a fixed circular floating button near the bottom of the app, see Argentina World Cup 2026 matches, and create or edit their exact score prediction until the backend closes the match.

## Why

The backend now exposes PRODE endpoints for Argentina match predictions. The mobile app needs a user-facing flow so customers can participate without changing the bottom-tab structure.

## What changes

- Add a dedicated authenticated PRODE screen outside the bottom tab navigator.
- Add a new fixed round floating action button as the PRODE entrypoint.
- List visible Argentina matches from `GET /api/v1/prode/matches`.
- Show each match with its current `my_prediction` in the same card/list item.
- Allow creating/editing predictions via `PUT /api/v1/prode/matches/{matchID}/prediction` while `is_open=true`.
- Handle cutoff conflicts (`409`) by warning the user and refreshing match state.
- Handle backend feature disabled (`404`) with a graceful unavailable state.
- Link users to vouchers after evaluated/correct predictions because rewards are visible through existing voucher flows.

## Out of scope

- New bottom tab for PRODE.
- Reusing or replacing an existing Home/Profile/Proof/Voucher/Help button as the PRODE entrypoint.
- Admin screens for match management, results, settlement, or reward retry.
- Generic World Cup predictor for non-Argentina matches.
- Separate first-release prediction-history screen using `/predictions/me`.
- Client-side enforcement of prediction cutoff as source of truth.

## Decisions

| Topic | Decision |
| --- | --- |
| Navigation | PRODE is an authenticated stack screen above/alongside tabs, not a tab route. |
| Entry button | Add a new fixed circular floating button near the lower screen area, positioned above the tab bar and not replacing existing actions. |
| Feature flag | No frontend visual flag in first release; backend 404 gets handled gracefully. |
| Match/prediction data | `GET /matches` is the first-release source of truth because `my_prediction` is embedded per match. |
| Admin | Explicitly excluded from this frontend SDD. |

## Success criteria

- A logged-in user can reach PRODE from the new floating round button without a new tab appearing.
- A logged-in user can see loading, empty, unavailable, and populated match states.
- A match card shows match details and the user's existing prediction when present.
- A user can create and edit a valid score prediction while `is_open=true`.
- Closed/cutoff matches cannot be edited in the UI and backend conflicts are handled correctly.
- Existing auth refresh/sign-out behavior is preserved.
- `npm run lint` passes, or failures are documented if unrelated to this change.
