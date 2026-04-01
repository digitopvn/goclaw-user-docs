# Sign In and Select Tenant

## Overview

GoClaw supports two sign-in methods: Token authentication and Pairing authentication. After signing in, users who belong to multiple tenants will be redirected to the tenant selection page before entering the dashboard.

---

## Sign-In Guide

### Method 1 — Sign In with Token

Route: `/login`

1. Open the Web Dashboard; the sign-in page displays the **Token** tab by default.
2. Enter the **User ID** (default: `system`) and **Gateway Token**.
3. Click **Connect**.
4. On success: redirects to the originally requested page (or `/overview`).
5. On failure (401 error): displays the message "Invalid credentials".

The Gateway Token is the `GOCLAW_GATEWAY_TOKEN` value configured during the onboard step.

### Method 2 — Sign In with Pairing

Used when the token is unknown — requires admin approval via the Nodes page.

1. Switch to the **Pairing** tab.
2. Enter the **User ID**.
3. Click **Request Access** — the system opens a WebSocket and displays a 6-character code.
4. Provide this code to an admin.
5. The admin approves via the CLI command:
   ```bash
   goclaw pairing approve {code}
   ```
6. Once approved, the connection completes automatically.

Pairing status progression: **Pending** → **Connecting** → **Waiting for approval** → **Approved**.

Click **Cancel** at any time to close the WebSocket and return to the pending state.

---

## Interface — Sign-In Page

Route: `/login`
Access: Public

**Two tabs:**

| Tab | Input Fields | Actions |
|-----|-------------|---------|
| Token | User ID, Gateway Token (password) | **Connect** |
| Pairing | User ID | **Request Access**, **Cancel** |

The Pairing tab displays a 6-character code and the CLI command `goclaw pairing approve {code}` for admin approval.

---

## Select Tenant

Route: `/select-tenant`
Access: Signed in

Displayed after sign-in if the user belongs to multiple tenants.

**Display:** A list of tenant cards for the current user (name, slug, role).

**Actions:**
- Click a card to select the tenant — sets the session scope to that tenant.
- If the user does not belong to any tenant and is not the owner: displays a "No Access" screen with a **Sign Out** button.

---

## Example — Full Sign-In Flow

```
[User] -> /login (Token tab)
  -> Enter system / <gateway-token>
  -> Click Connect
  -> [System] Authentication successful
  -> Multiple tenants? -> /select-tenant -> Select tenant
  -> No tenants? -> /overview (home page)
```

---

## Notes

- The token is stored in the browser's session storage after sign-in.
- If accessing a page that requires authentication while not signed in, the system automatically redirects to `/login` and saves the original URL for redirect after sign-in.
- The Pairing method is suitable for new users who do not have a token — admins manage approvals on the `/nodes` page.

---

## See Also

- [04-setup-wizard.md](./04-setup-wizard.md) — Setup wizard after first sign-in
- [02-cai-dat.md](./02-cai-dat.md) — Configuring the Gateway token during installation
