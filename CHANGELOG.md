# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-06-19

### Added
- Asynchronous and universal (Browser + Node) support to all package APIs.
- Configuration methods `setDataLoader` and `setBaseUrl` for browser/custom CDN loading.
- High-coverage test suites using Vitest for all packages.
- GitHub Actions CI workflow supporting Node 18, 20, and 22.
- Npm workspaces configuration in root `package.json` for local resolution.

### Changed
- Refactored `loadData.ts` to support non-blocking asynchronous operations.

## [1.0.0] - 2026-06-19

### Added
- Initial release of `imanikurd` monorepo.
- Sub-packages: `imanikurd-quran`, `imanikurd-prayer`, `imanikurd-hadith`.
- Datasets for Quran, 13 Tafsirs, prayer times, hadith, dhikr, Names of Allah.
