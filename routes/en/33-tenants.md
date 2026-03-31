# Tenants (Admin)

**Route:** `/admin/tenants`
**Access:** Cross-tenant (Owner)

## What It Shows
Table of all tenants. Columns: name, slug, status (active / suspended), creation date.

## Actions
- **Create tenant** — dialog with name input and auto-generated slug
- **View tenant detail** — click row to navigate to detail page
- **Refresh**

## Sub-features
- Only owners can create new tenants
- Slug auto-generated from name (lowercase alphanumeric + hyphens)

## Dialogs

### Create Tenant Dialog
**Trigger:** "Create Tenant" button
**Fields:**
- Name (text, required)
- Slug (text, required, auto-derived from name — lowercase alphanumeric + hyphens)

**Actions:**
- **Create** — creates tenant and navigates to tenant detail
- **Cancel** — closes
