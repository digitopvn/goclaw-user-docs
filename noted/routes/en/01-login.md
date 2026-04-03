# Login

**Route:** `/login`
**Access:** Public

## What It Shows
Login form with two-tab layout for authentication.

## Actions
- **Token Login** — authenticate with user ID + token
- **Pairing Login** — authenticate via device pairing approval flow (generates a pairing code, polls for approval)
- Redirects to the originally requested page after successful login

## Sub-features
- Two tabs: Token and Pairing
- Pairing tab shows a code to approve from the Nodes page

## Dialogs

### Token Form
**Trigger:** Default tab on login page
**Fields:**
- User ID (text, default "system")
- Gateway Token (password)

**Actions:**
- **Connect** — validates credentials via `GET /v1/agents`, stores token and navigates on success; shows "Invalid credentials" on 401

### Pairing Form
**Trigger:** "Pairing" tab on login page
**Fields:**
- User ID (text)

**States:** Idle → Connecting → Pending (code shown) → Approved

**Actions:**
- **Request Access** — opens WebSocket, sends CONNECT with userId, receives pairing code, starts polling
- **Cancel** (Pending state) — closes WebSocket, returns to Idle

**PairingCodeDisplay sub-component:**
- Shows 6-character visual code boxes
- Displays CLI command: `goclaw pairing approve {code}`
- Pulsing "Waiting for approval" indicator
