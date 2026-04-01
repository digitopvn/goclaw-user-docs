# Nodes (Device Pairing)

**Route:** `/nodes`
**Sidebar Group:** Connections
**Access:** Admin

---

## Overview

Nodes manages the pairing of physical devices or client applications with the GoClaw system. Once a device is paired, it can communicate with agents through a specific channel without needing to re-authenticate each time.

This mechanism is suitable for:
- IoT devices sending periodic messages
- Mobile applications connecting to a specific agent
- Multi-instance deployments with individual devices

---

## User Interface (UI)

**Route:** `/nodes`

The page is divided into two main sections:

**Pending Requests** — a list of devices that have sent pairing requests, awaiting admin approval or denial.

**Paired Devices** — a table of active devices displaying: channel, sender ID, paired date, paired by (which admin approved).

---

## Guide

### Device Pairing Process

1. **Device sends a request** — the device calls `device.pair.request` via WebSocket with a pairing code
2. **Appears in "Pending Requests"** — admin sees the new request on the `/nodes` page
3. **Admin approves** — clicks the approve button, confirms the information
4. **Device receives confirmation** — the device transitions to authenticated status

### Approve a Pairing Request

1. Find the request in the "Pending Requests" section
2. Click **Approve**
3. Review the information in the dialog: channel, sender ID, pairing code
4. Click **Approve** to confirm

### Deny a Pairing Request

1. Find the request to deny
2. Click **Deny**
3. Confirm in the dialog (destructive action)
4. Click **Deny** — the request is removed

### Revoke a Paired Device

1. Find the device in the "Paired Devices" table
2. Click **Revoke**
3. Confirm in the dialog — displays the channel and sender ID
4. Click **Revoke** — triggers `EventPairingRevoked`, disconnecting the server-side session immediately

### Refresh

Click **Refresh** to update the list from the server.

---

## Multi-Instance Deployment

In environments with multiple GoClaw instances running in parallel (horizontal scaling), each instance needs to know about paired devices to handle messages correctly:

- **Pairing state synchronization** — pairing information is stored in a shared database (PostgreSQL), all instances can look it up
- **Sender ID** — unique device identifier, used to route messages to the correct instance
- **Remote revocation** — when revoked on any instance, the event broadcasts to all instances to disconnect

### Edge Cases

| Scenario | Handling |
|----------|----------|
| Device changes IP | Pairing remains valid — identification is based on sender ID, not IP |
| Instance restarts | Device automatically reconnects and pairing is restored from DB |
| Revocation while device is offline | Revocation is written to DB, takes effect when device reconnects |
| Multiple devices with same sender ID | Not allowed — each sender ID can only be paired once |

---

## Example

**Pairing a tablet with a customer support agent:**

1. The app on the tablet calls `device.pair.request` with channel `web` and sender ID `tablet-reception-01`
2. Admin opens `/nodes`, sees the request from `tablet-reception-01`
3. Confirms it is a legitimate device -> Approves
4. The tablet is paired and can now send messages without a token

---

## Notes

- Revoke disconnects the server-side session immediately — the device will receive a WebSocket error and needs to re-pair
- `EventPairingRevoked` can be listened to by other systems to react accordingly
- Pairing codes have an expiration — check the `gateway.pairing_code_ttl` configuration if requests auto-expire
- Nodes only appears in the Standard edition with multi-channel support; Desktop (Lite) does not have channels and does not use this page

---

## See Also

- [Channel Configuration](../admin/02-channels-setup.md)
- [WebSocket RPC — Pairing methods](../reference/02-websocket-rpc.md)
- [Security and Authorization](../admin/05-bao-mat.md)
