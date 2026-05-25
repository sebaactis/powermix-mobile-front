# PRODE Predictions Design

Implement PRODE as a non-tab authenticated stack screen, with match cards that contain both match details and the user's prediction.

## Architecture decisions

| Topic | Decision |
| --- | --- |
| Screen placement | Add `ProdeScreen` under `src/screens/prode/ProdeScreen.tsx`. |
| Navigation | Wrap the authenticated tab app in a native stack: `MainTabs` renders current `TabNavigator`; `Prode` renders `ProdeScreen`. |
| Tab safety | Do not add `Prode` to `TabNavigator`; `CustomTabBar` renders every tab route. |
| Entrypoint | Add a new fixed circular floating action button (FAB) near the lower screen area, above the tab bar, that navigates to stack route `Prode`. |
| Existing actions | Do not reuse, replace, or repurpose existing Home/Profile/Proof/Voucher/Help buttons for PRODE. |
| Data source | Use `GET /api/v1/prode/matches`; do not use `/predictions/me` in first release. |
| API status | Extend API handling to expose HTTP status so PRODE can distinguish 409 cutoff and 404 disabled feature reliably. |
| Validation | Use `npm run lint`; no automated test runner exists yet, so record manual verification steps for user flows. |

## Navigation shape

Current authenticated flow returns `TabNavigator` directly from `MainNavigator`.

Target shape:

```tsx
AuthenticatedStack
  MainTabs -> TabNavigator
  Prode -> ProdeScreen
```

Implementation options:

1. Create `src/navigation/AuthenticatedNavigator.tsx` with `createNativeStackNavigator`.
2. Update `MainNavigator` to return `<AuthenticatedNavigator />` for authenticated users.
3. Keep `TabNavigator` route names unchanged: Home, Profile, Proofs, Vouchers, Help.
4. Render a `ProdeFloatingButton` from the authenticated app shell so it can navigate to `Prode` without becoming a tab.
5. Position the button above the tab bar and hide it while the current route is `Prode`.

If TypeScript route typing is formalized later, add `AuthenticatedStackParamList` and update the floating button navigation typing accordingly.

## Data model

Create PRODE-specific types, likely under `src/types/prode.ts` or colocated with the API module.

```ts
export type ProdeMatchStatus =
  | 'DRAFT'
  | 'SCHEDULED'
  | 'OPEN'
  | 'CLOSED'
  | 'RESULT_RECORDED'
  | 'EVALUATED'
  | 'CANCELLED';

export type ProdePredictionStatus = 'PENDING' | 'CORRECT' | 'INCORRECT';

export type ProdePrediction = {
  id: string;
  match_id: string;
  argentina_goals: number;
  opponent_goals: number;
  status: ProdePredictionStatus;
  created_at: string;
  updated_at: string;
};

export type ProdeMatch = {
  id: string;
  stage: string;
  opponent: string;
  kickoff_at: string;
  cutoff_at: string;
  status: ProdeMatchStatus;
  is_open: boolean;
  argentina_goals: number | null;
  opponent_goals: number | null;
  my_prediction: ProdePrediction | null;
};
```

Confirm `my_prediction` exact backend shape during implementation. If it differs from `ProdePrediction`, adapt the type locally.

## API design

Add a small PRODE API module, for example `src/api/prodeApi.ts` or `src/services/prodeService.ts`, following existing project conventions.

Functions:

- `getProdeMatches(signOut): Promise<ApiResponse<ProdeMatch[]>>`
- `saveProdePrediction(matchId, payload, signOut): Promise<ApiResponse<ProdePrediction>>`

Endpoint construction:

```ts
const baseUrl = process.env.EXPO_PUBLIC_POWERMIX_API_URL;
const prodeUrl = `${baseUrl}/api/v1/prode`;
```

Status handling:

- Preferred: add `status?: number` or `httpStatus: number` to `ApiResponse<T>` in `src/helpers/apiHelper.ts`.
- Preserve existing callers by making the field additive.
- PRODE uses status `409` for cutoff and `404` for disabled/unavailable feature.

## Floating button behavior

- Shape: circular FAB.
- Placement: fixed near the lower screen area, above the bottom tab bar and safe-area inset.
- Visibility: authenticated tab screens only; hide on auth screens and on the PRODE screen itself.
- Action: navigate to authenticated stack route `Prode`.
- Accessibility: provide a clear label such as `Abrir PRODE`.
- Visual risk: ensure it does not cover primary tab bar touch targets or important screen CTAs.

## Screen behavior

### Loading and refresh

- Initial load: centered `ActivityIndicator`.
- Pull-to-refresh: use `RefreshControl`.
- Retry action on error/unavailable state.

### Empty state

If matches array is empty, show clear copy:

> Todavía no hay partidos del PRODE disponibles. Volvé a revisar más cerca del Mundial.

### Match card

Each card should show:

- Stage label.
- Argentina vs opponent.
- Kickoff date/time.
- Cutoff date/time.
- Open/closed badge based on `is_open`.
- Result if `argentina_goals` and `opponent_goals` are not null.
- Existing prediction if `my_prediction` exists.
- Create/edit action only when `is_open=true`.

### Prediction input

Use a focused inline editor or modal with two numeric fields:

- Argentina goals.
- Opponent goals.

Client validation:

- Required integer values.
- Minimum `0`.
- Maximum `50`.

Server remains final authority.

### Save feedback

- Success: show existing success toast variant.
- Validation error: show existing error/warning toast.
- 409: show warning, refresh matches, close/disable editor.
- 401 after refresh failure: existing auth helper signs the user out.
- Network error: show retryable error state/toast.

## Reward UX

When prediction status is `CORRECT`, show a small success message and a button/link to existing `Vouchers` tab. Do not build a reward-specific API view because backend does not expose one yet.

## Verification plan

Automated:

- Run `npm run lint`.
- If a test runner is added before apply, add focused tests for API status handling and score validation.

Manual:

1. Login and verify the fixed circular PRODE button appears near the lower screen area without replacing existing buttons.
2. Press the floating PRODE button and verify PRODE opens without a new tab item.
3. Verify loading, empty, error/unavailable, and populated states using mocked or backend data.
4. Save a new prediction for an open match.
5. Edit an existing prediction for an open match.
6. Verify closed match controls are disabled.
7. Simulate/observe 409 cutoff response and confirm warning + refresh.
8. Verify correct prediction guidance links to Vouchers.

## Risks

- Floating button placement can conflict with bottom tab bar or screen CTAs if safe-area spacing is not handled carefully.
- Existing dirty worktree means implementation must scope diffs carefully.
- Without a test runner, UI behavior relies on lint plus manual verification unless test setup is added.
