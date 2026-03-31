# Tenant Detail (Admin)

**Route:** `/admin/tenants/:id`
**Access:** Cross-tenant (Owner)

## What It Shows
Tenant info cards (slug, status, creation date) and a user management section listing all tenant members with their roles.

## Actions
- **Add user to tenant** — dialog with user picker combobox + role selector (owner / admin / operator / member / viewer)
- **Remove user from tenant** — confirm dialog
- **Refresh users**
- **Back to tenants list**

## Sub-features
- Role selector in add-user dialog: owner / admin / operator / member / viewer
- Tenant info cards: slug, status, created date

## Dialogs

### Add User Dialog
**Trigger:** "Add User" button
**Fields:**
- User ID (UserPickerCombobox, allows custom entry)
- Role (select: owner / admin / operator / member / viewer)

**Actions:**
- **Add User** — adds user to tenant with selected role
- **Cancel** — closes

### Remove User Confirmation
**Trigger:** Remove button on user row
**Displays:** User ID being removed

**Actions:**
- **Remove User** (destructive) — removes user from tenant
- **Cancel** — closes
