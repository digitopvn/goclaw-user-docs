# Tenant Management (Multi-Tenant)

**List Route:** `/admin/tenants`
**Detail Route:** `/admin/tenants/:id`
**Sidebar Group:** System
**Access:** Owner (Cross-tenant)

> **Standard Edition only.** Desktop (Lite) does not support multi-tenant.

---

## Overview

Multi-tenant allows a single GoClaw system to serve multiple independent organizations (tenants). Each tenant has its own users, agents, and data. Owner-level administrators can create and manage all tenants from this interface.

---

## Tenant List

**Route:** `/admin/tenants`

### User Interface

A table displaying all existing tenants: name, slug, status (active / suspended), creation date.

### Create a New Tenant

1. Click the **"Create Tenant"** button
2. Fill in the dialog:
   - **Name** (required) — display name of the tenant
   - **Slug** (required) — auto-generated from the name (lowercase + hyphens); can be edited
3. Click **Create** — the system creates the tenant and navigates to its detail page

> Slug cannot be changed after creation. Choose carefully.

### Refresh

Click **Refresh** to reload the list from the server.

---

## Tenant Detail

**Route:** `/admin/tenants/:id`

### User Interface

- **Information card** — displays slug, status, creation date
- **User Management section** — list of members and their roles within this tenant

### Add User

1. Click **"Add User"**
2. Fill in the dialog:
   - **User ID** — search via UserPickerCombobox or enter manually
   - **Role** — select one of: `owner`, `admin`, `operator`, `member`, `viewer`
3. Click **Add User**

### Remove User

1. Click the remove button on the user's row
2. Confirm in the dialog — displays the user ID being removed
3. Click **Remove User** (destructive action — cannot be undone)

### Refresh List

Click **Refresh** to sync with the server.

---

## Role System

| Role | Access |
|------|--------|
| `owner` | Full access — manage tenant, users, system configuration |
| `admin` | Manage agents, channels, tools, cron, providers |
| `operator` | Chat, manage sessions, cron, send outbound messages |
| `member` | Chat and view own history |
| `viewer` | Read-only — view agents, sessions, history |

---

## Typical Workflow

**Create a tenant for a new department:**

1. `/admin/tenants` -> Create Tenant -> Enter name "Marketing Team", slug auto-generates `marketing-team`
2. Navigate to the newly created tenant detail page
3. Add department head: role `admin`
4. Add staff members: role `member`

**Add a user to an existing tenant:**

1. `/admin/tenants` -> Click the tenant row
2. Click **Add User**
3. Search for user ID via combobox
4. Select appropriate role -> Click **Add User**

---

## Notes

- Each tenant is fully isolated — users of tenant A cannot access tenant B's data
- The `X-GoClaw-Tenant-Id` header in API requests determines the tenant scope (UUID or slug both accepted)
- Owners have **cross-tenant** access — they can operate on all tenants from a single account
- Removing a user from a tenant does not delete the user account — it only removes access to that tenant
- The "default" tenant is the root tenant, always exists, and cannot be deleted

---

## See Also

- [Security and Authorization](../admin/05-security.md)
- [API Reference — Multi-tenant Headers](../reference/01-api-reference.md)
- [Configuration Reference](../reference/03-configuration.md)
