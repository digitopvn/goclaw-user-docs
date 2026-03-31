# Storage

**Route:** `/storage`
**Access:** Admin

## What It Shows
File browser with expandable directory tree (left panel) and file content viewer (right panel). Shows total storage size at top.

## Actions
- **Browse directory tree** — lazy-load subdirectories by expanding nodes
- **View file content** — text files rendered in viewer; images shown as preview
- **Upload files** — dialog, uploads to the currently selected folder
- **Download file** — download to local machine
- **Delete file or folder** — confirm dialog
- **Move files** — drag and drop between folders
- **Refresh**

## Sub-features
- Lazy-loading tree (subdirs loaded on expand)
- Image preview for image files
- Text viewer for text files
- Total storage size indicator

## Dialogs

### Upload File Dialog
**Trigger:** "Upload" button (uploads to currently selected folder)
**Fields:**
- Drag-drop file area
- Current folder path display (read-only)

**Actions:**
- **Upload** — uploads selected files to current folder
- **Cancel** — closes

### Delete File / Folder Confirmation
**Trigger:** Delete button on file or folder in tree
**Displays:** File/folder name; folder warning ("all contents will be deleted"); "cannot be undone" note

**Actions:**
- **Delete** (destructive) — removes file or folder and all contents
- **Cancel** — closes
