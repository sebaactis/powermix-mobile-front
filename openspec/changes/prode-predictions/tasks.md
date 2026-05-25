# PRODE Predictions Tasks

## 1. Navigation and entrypoint

- [ ] Add authenticated stack navigator that wraps existing tabs and a new `Prode` screen.
- [ ] Update `MainNavigator` to use the authenticated stack for logged-in users.
- [ ] Create `src/screens/prode/ProdeScreen.tsx` scaffold with existing safe-area/header conventions.
- [ ] Add a fixed circular PRODE floating action button in the authenticated app shell.
- [ ] Position the floating button above the bottom tab bar/safe-area inset.
- [ ] Hide or disable the floating button while the current route is `Prode`.
- [ ] Confirm no existing app button is reused or replaced for PRODE.
- [ ] Confirm no `Prode` route is added to `TabNavigator`.

## 2. API and types

- [ ] Add PRODE match/prediction/status TypeScript types.
- [ ] Add PRODE API functions for `GET /matches` and `PUT /matches/{matchID}/prediction`.
- [ ] Extend `ApiResponse` additively with HTTP status for reliable 409/404 handling.
- [ ] Confirm actual `my_prediction` response shape during integration.

## 3. PRODE screen states

- [ ] Implement initial loading state.
- [ ] Implement pull-to-refresh.
- [ ] Implement empty matches state.
- [ ] Implement backend-disabled/unavailable state for 404.
- [ ] Implement retryable generic error state.

## 4. Match card and prediction flow

- [ ] Render stage, opponent, kickoff, cutoff, status, open/closed state, result, and `my_prediction` together.
- [ ] Add create/edit prediction UI for open matches.
- [ ] Validate score inputs: integers from 0 to 50.
- [ ] Save prediction through PUT endpoint.
- [ ] Refresh/update match state after save.
- [ ] Handle 409 cutoff with warning, refresh, and disabled stale editor state.
- [ ] Show closed/result/evaluated states without allowing edits.

## 5. Reward guidance

- [ ] Show voucher guidance when a prediction is `CORRECT`.
- [ ] Add navigation path to existing `Vouchers` tab from the PRODE screen.

## 6. Verification

- [ ] Run `npm run lint`.
- [ ] If a test runner is introduced, add focused tests for API status handling and score validation.
- [ ] Complete manual verification checklist from `design.md`.
- [ ] Document any unrelated lint failures separately.

## Review workload forecast

Estimated implementation touches 5-8 files:

- `src/navigation/MainNavigator.tsx`
- new authenticated stack navigator file
- new floating button component or authenticated-shell UI
- authenticated navigator/shell files
- new `src/screens/prode/ProdeScreen.tsx`
- new PRODE API/types module(s)
- `src/helpers/apiHelper.ts`

Risk is moderate because navigation and API helper changes affect shared infrastructure. Keep implementation as one writer pass and require fresh review before PR/commit.

No hard changed-line budget is configured for this session, but this should still be reviewable as one cohesive PR if scope stays user-only and admin remains out of scope.
