# Nodes (Device Pairing)

**Route:** `/nodes`
**Access:** Admin

## What It Shows
Two sections:
- **Pending pairing requests** — devices/browsers waiting for approval
- **Paired devices table** — columns: channel, sender ID, paired date, paired by

## Actions
- **Approve pairing** — confirm dialog, pairs the device
- **Deny pairing** — confirm dialog, rejects the request
- **Revoke pairing** — confirm dialog, unpairs an existing device
- **Refresh**

## Sub-features
- Separate sections for pending and paired devices
- Revoking a device triggers a server-side session disconnect

## Dialogs

### Approve Pairing Confirmation
**Trigger:** "Approve" button on pending request
**Displays:** Channel + sender_id + pairing code

**Actions:**
- **Approve** — pairs the device, broadcasts `EventDevicePairRes`
- **Cancel** — closes

### Deny Pairing Confirmation
**Trigger:** "Deny" button on pending request
**Displays:** Channel + sender_id + pairing code (destructive styling)

**Actions:**
- **Deny** (destructive) — rejects the pairing request
- **Cancel** — closes

### Revoke Pairing Confirmation
**Trigger:** "Revoke" button on paired device row
**Displays:** Channel + sender_id

**Actions:**
- **Revoke** (destructive) — unpairs device, triggers server-side session disconnect via `EventPairingRevoked`
- **Cancel** — closes
