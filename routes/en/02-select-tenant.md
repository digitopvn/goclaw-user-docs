# Select Tenant

**Route:** `/select-tenant`
**Access:** Auth

## What It Shows
List of tenant cards the current user is a member of, showing name, slug, and role. If user has no tenants and is not owner, shows a "no access" screen.

## Actions
- **Select tenant** — click a card to scope the session to that tenant
- **Logout** — available on the no-access screen

## Sub-features
- No-access state for users without any tenant membership
