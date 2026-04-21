# Changelog

This file is generated automatically from Conventional Commits on push to `main`.
Do not edit it manually.

## 2026-04-20

### Documentation

- doctrine: codify ui boundaries and quality gates (`d43311b`)

### Refactors

- web: centralize academic data and ui seams (`e4e7e8c`)

### Continuous Integration

- repo: add merged coverage and lighter hosted checks (`4338eca`)

## 2026-04-16

### Features

- web: add official planner bootstrap surfaces (`2b71b67`)
- web: align planner shell with canonical routes (`4114e92`)
- web: cover official joint programs in onboarding (`29c5030`)
- web: add official graduate study references (`95b247f`)
- web: localize schedule surfaces cleanly (`0e139a7`)
- web: align schedule wording across metadata (`d13b44e`)
- web: centralize localized route metadata (`bd51afe`)
- web: add canonical schedule onboarding flow (`3e52124`)

### Fixes

- web: align planner onboarding with academic context (`8a03bcb`)
- web: align official joint program references (`f85e258`)
- web: infer ai schedule defaults from official plans (`5096b0f`)
- web: align localized copy with canonical routes (`86f0c91`)
- web: localize project and registration labels (`3d9074d`)
- web: centralize locale-driven copy cleanup (`7092943`)
- web: localize official search surfaces (`d31d061`)
- web: adopt the shipped svg favicon (`bfa6031`)
- web: wire canonical favicon and install icons (`a514cbb`)

### Documentation

- doctrine: expand official planner shell scope (`fe5d641`)
- doctrine: refine planner onboarding policy (`993c3b6`)
- doctrine: refine frontend route and planner rules (`fb10827`)
- doctrine: mirror blocking CI before push (`ba60065`)
- doctrine: extend official study surfaces (`40b9207`)
- doctrine: enforce locale-driven frontend text (`fad4745`)
- doctrine: localize crawlable metadata copy (`54390cb`)
- doctrine: require English frontend identifiers (`107feea`)
- doctrine: codify localized schedule onboarding (`0441cc6`)
- doctrine: harden localized onboarding defaults (`60c829a`)
- docs: title the readme canonically (`7748642`)

### Refactors

- web: centralize legacy route redirects (`a9b3332`)
- web: rename locale-independent academic enums (`a262d1b`)
- web: rename legacy utility surfaces (`09c37a6`)

### Build

- repo: allow repeated changelog headings (`7b43a64`)

### Continuous Integration

- repo: block broken pushes with local CI mirror (`1fb24e1`)

## 2026-04-15

### Features

- api: add public catalog ingestion pipeline (`e820d54`)
- api: add change-aware snapshot promotion (`bbd370e`)
- web: add navigation and chatgpt connection surface (`4e0f385`)
- web: polish the planner experience (`470866d`)
- web: enrich planner with catalog insights (`098f91f`)
- web: add installable shell and secure catalog caching (`6ffa747`)
- web: add system theme foundations (`7dc4846`)
- web: rebuild the mobile planner shell (`8cbaedc`)
- web: add searchable planner onboarding wizard (`4b00f60`)
- web: limit planner swipe to phone layouts (`131dd5a`)

### Fixes

- api: make fixture snapshot promotion deterministic (`2730b5a`)
- api: stabilize fixture snapshots across platforms (`b582d7c`)
- web: harden browser storage persistence (`4ce6cb3`)
- web: disable route prefetch on public shell (`2fdfecb`)
- web: serve planner bootstrap from published catalog (`1628a45`)
- web: split home onboarding and planner routes (`1fabc1d`)
- web: explain planner onboarding redirect (`a645a48`)
- web: slim planner bootstrap and gate safely (`302fc9c`)
- web: validate onboarding before planner routing (`1b62d1a`)
- api: tolerate mixed live bulletin formats (`9ca80fc`)
- web: harden onboarding and browser-local resilience (`412ee4b`)
- api: switch boletines to official itam sources (`046a063`)
- web: stabilize onboarding selectors and locale copy (`7854af2`)
- web: harden planner entry against stale local state (`3fc428a`)
- web: harden browser planner state recovery (`92371f4`)

### Documentation

- repo: add ADR-first doctrine baseline (`6324063`)
- git: define main workflow for single maintainer (`a2c67bc`)
- adr: define ingestion and public data doctrine (`3eeac78`)
- adr: extend roadmap for planner and ai phases (`054c24d`)
- repo: add community entrypoints and issue templates (`fb19532`)
- repo: clarify contribution and delivery surfaces (`bcb9986`)
- doctrine: define push-driven changelog automation (`1f31ccb`)
- docs: record the current custom domain target (`27eb578`)
- doctrine: expand accessibility and delivery guidance (`000c0f3`)
- frontend: define home onboarding planner routes (`92c5a35`)
- frontend: harden planner route fallback (`265d110`)
- frontend: refine onboarding and catalog doctrine (`ae26e5f`)
- doctrine: harden source policy and frontend scope (`1f33fed`)
- doctrine: codify localized ui and design references (`3ec1ada`)
- doctrine: constrain onboarding year availability (`877e3fd`)
- doctrine: forbid automatic state wiping on route errors (`e89ae7c`)
- doctrine: embed planner onboarding in frontend policy (`56658a4`)
- doctrine: refine planner onboarding contract (`d4d3ccb`)
- doctrine: make swipe guidance phone-only (`906ec9d`)

### Tests

- tests: ignore local pytest temp artifacts (`aea34ef`)

### Build

- web: add pnpm workspace and planner shell (`b18b562`)
- repo: add modern quality automation baselines (`8b420fb`)
- web: ship published catalog with the web artifact (`717be7a`)
- deploy: harden vercel artifact inputs (`29c417a`)
- test: stabilize pytest temp paths (`3037a38`)
- scripts: add conventional changelog generator (`ff0b432`)
- repo: preserve live catalog during verify (`67543f4`)

### Continuous Integration

- repo: add validation and delivery workflows (`57b9606`)
- deploy: remove secret gating from job startup (`362357e`)
- api: verify published catalog without sqlite byte diffs (`6039fb4`)
- api: run catalog drift check without pnpm (`b525a2f`)
- ci: automate changelog updates on push (`ef303cb`)

### Chores

- git: add local hook bootstrap (`dfd6f18`)
- cursor: derive repository rules from ADR doctrine (`339211d`)
- config: add derived repository policy baselines (`515e40c`)
- data: add fixture-backed public catalog snapshot (`f367457`)
- data: refresh published fixture snapshot (`c47d553`)
- data: publish live academic catalog snapshot (`af8c559`)
- data: publish official-source academic snapshot (`4d0fcdb`)
