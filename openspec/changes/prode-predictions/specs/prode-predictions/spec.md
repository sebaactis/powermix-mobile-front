# PRODE Predictions Spec

## ADDED Requirements

### Requirement: Authenticated PRODE access without a new tab

The app SHALL provide an authenticated PRODE screen reachable from a new fixed circular floating button near the lower screen area and SHALL NOT add PRODE as a bottom-tab route.

#### Scenario: User opens PRODE from the floating button

- **GIVEN** the user is authenticated
- **WHEN** the user presses the PRODE floating action button
- **THEN** the app navigates to the PRODE screen
- **AND** the bottom tab bar does not include a PRODE tab item
- **AND** no existing app action button is replaced by PRODE

#### Scenario: Unauthenticated users cannot access PRODE

- **GIVEN** the user is not authenticated
- **WHEN** the app renders navigation
- **THEN** PRODE is not reachable from the authenticated app shell
- **AND** the PRODE floating action button is not shown

### Requirement: Floating PRODE entrypoint

The app SHALL render the PRODE entrypoint as a round fixed-position button near the lower screen area without blocking the bottom tab bar.

#### Scenario: Authenticated tab screen renders

- **GIVEN** the user is authenticated and viewing an eligible tab screen
- **WHEN** the screen renders
- **THEN** the PRODE floating action button is visible near the bottom of the screen
- **AND** it is positioned above or clear of the tab bar touch targets and safe-area inset

#### Scenario: PRODE screen renders

- **GIVEN** the user is viewing the PRODE screen
- **WHEN** the screen renders
- **THEN** the PRODE floating action button is hidden or disabled to avoid duplicate navigation to the current screen

### Requirement: Match list with embedded user prediction

The PRODE screen SHALL fetch visible Argentina matches from `GET /api/v1/prode/matches` and render each match together with the authenticated user's current prediction from `my_prediction`.

#### Scenario: Matches exist

- **GIVEN** the API returns one or more visible matches
- **WHEN** the PRODE screen loads
- **THEN** each match card shows stage, opponent, kickoff time, cutoff information, match status, open/closed state, and result when available
- **AND** each match card shows the user's prediction if `my_prediction` is not null

#### Scenario: No visible matches exist

- **GIVEN** the API returns an empty match array
- **WHEN** the PRODE screen loads
- **THEN** the user sees an empty state explaining that there are no PRODE matches available yet

#### Scenario: Backend feature is disabled

- **GIVEN** the backend returns 404 for `/api/v1/prode/matches`
- **WHEN** the PRODE screen loads
- **THEN** the user sees a graceful unavailable state rather than a broken or infinite loading screen

### Requirement: Prediction create and edit

The PRODE screen SHALL allow the authenticated user to create or edit one prediction per match while the backend marks that match as open.

#### Scenario: User creates a prediction

- **GIVEN** a match has `is_open=true` and `my_prediction=null`
- **WHEN** the user submits valid non-negative Argentina and opponent goals up to 50
- **THEN** the app sends `PUT /api/v1/prode/matches/{matchID}/prediction`
- **AND** the match card updates to show the saved prediction
- **AND** the user receives success feedback

#### Scenario: User edits a prediction

- **GIVEN** a match has `is_open=true` and `my_prediction` exists
- **WHEN** the user submits a changed valid score
- **THEN** the app sends the same PUT endpoint
- **AND** the displayed prediction is updated

#### Scenario: Match is closed in API state

- **GIVEN** a match has `is_open=false`
- **WHEN** the match card renders
- **THEN** prediction controls are disabled or hidden
- **AND** the user can still see the existing prediction/result state

#### Scenario: Backend rejects prediction after cutoff

- **GIVEN** the app attempts to save a prediction
- **AND** the backend returns 409 Conflict
- **WHEN** the response is handled
- **THEN** the app warns that the prediction deadline passed
- **AND** refreshes match data
- **AND** does not keep stale editable state for that match

### Requirement: Server authority for cutoff

The app SHALL use backend-provided `is_open` and backend responses as the authority for prediction eligibility.

#### Scenario: Client clock differs from server

- **GIVEN** the user's device clock is wrong
- **WHEN** the PRODE screen renders controls
- **THEN** eligibility is based on `is_open` from the API, not local time calculations

### Requirement: Rewards guidance

The app SHALL guide users to existing voucher visibility after evaluated correct predictions rather than implementing a reward-specific PRODE endpoint.

#### Scenario: Prediction is correct

- **GIVEN** a prediction status is `CORRECT`
- **WHEN** the match card renders
- **THEN** the app communicates that the reward should appear in vouchers
- **AND** provides a path to the existing vouchers screen
