# OrdiFi Studio Desktop

**An offline-first workspace for organizing Bitcoin Ordinals and preparing UTXO compositions.**

OrdiFi Studio Desktop is a free desktop application for managing Ordinals collections, organizing assets, and creating composition drafts without modifying the Bitcoin blockchain.

## Features

- **Ordinal Manager** — Organize Ordinals across multiple watch-only wallet sources using folders, an Explorer, and visual canvases.
- **Thumbnail Previews** — Browse Ordinals and compositions using locally stored thumbnails.
- **Draft Mode** — Prepare and edit Cases, Layouts, Suitcases, and other supported structures off-chain, without signing transactions or broadcasting changes.
- **Offline Workspace** — Work with synchronized Studio data without requiring a continuous connection to a Bitcoin indexer.
- **Web ↔ Desktop Sync** — Transfer Studio snapshots and drafts between OrdiFi Web Studio and Desktop Studio.

## File Formats

### `.osync` — Studio Sync

A portable synchronization bundle containing Studio workspace data, including wallet sources, Ordinals metadata, thumbnails, assets, canvases, and drafts.

Use `.osync` to transfer your workspace between OrdiFi Web Studio and Desktop Studio.

### `.ostu` — Studio Project

A full Studio project file for saving, opening, and continuing a local workspace.

Use `.ostu` for project backups and local project management.

## Important

Studio Desktop operates in **off-chain Draft Mode**. Changes to drafts do not modify on-chain Ordinals or Bitcoin UTXOs.

Studio Desktop does not require private keys for its watch-only wallet sources and does not execute Bitcoin transactions.

## Download

Windows installers and release information are available through [OrdiFi](https://ordifi.app).

## License

See the repository's `LICENSE` file for the applicable open-source license.