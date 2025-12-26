# Changelog

All notable changes to the **AI Manifold** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> **Note:** This project is currently **Work In Progress (WIP)**. Features and APIs are subject to change as we refine the visualization and user experience.

## [Unreleased] - Work In Progress

### Added
- **Search Functionality**: Restored and enhanced search with real-time highlighting of matching tools and dimming of non-matches.
- **Micro-Interactions**: Hover states for tools in the map for instant identification.
- **Internationalization (i18n)**: 
    - Full translation support for the User Profile form (Labels, Placeholders, Buttons).
    - Dynamic search bar placeholder ("Search" / "Buscar").
- **Stability**: Implemented `ResizeObserver` in `RadialMap` to prevent layout distortion on page reloads.
- **Responsiveness**: 
    - Sidebar now adapts to mobile screens (100% width) and desktop (fixed width).
    - Map container resizes fluidly.

### Fixed
- **Critical Crash**: Resolved black screen issue upon Logout.
- **Profile Data**: Fixed issue where user profile data wouldn't load or save correctly; added visual feedback ("Saving...").
- **Search Flicker**: Resolved flickering issues during search by optimizing React keys.
- **Layout**: Fixed "squashed" map rendering by ensuring dimensions are calculated after container mount.

### Changed
- **Layout Engine**: Reverted from physics-based simulation to a **Deterministic Static Layout** for better stability and legibility.
- **Sidebar**: Improved z-indexing to ensure it overlays correctly on smaller screens.
- **Data Model**: Simplified tool data by removing volatile pricing information.

## [0.5.0] - 2025-12-25
### Constitutional & Visual Features
- **Entity Ontology**: Implemented core visual encoding logic:
    - **Node Size**: Maps to `importance` (derived from growth metrics).
    - **Node Opacity**: Maps to `consensus` (epistemic stability).
    - **Halo Effect**: Added for high-importance/multi-sector tools.
- **Streamgraph V2**:
    - **Full Synchronization**: Hovering a stream highlights the node in Radial Map and vice versa.
    - **Chromatic Scale**: Replaced single-color opacity with a full spectrum (Cold->Hot) to visualize growth intensity.
    - **Responsive Design**: Implemented `viewBox` for perfect scaling on all screens.
    - **Layout**: Centered, backdrop-enhanced overlay (85vw width) that hides the sidebar for focused viewing.
- **Data Persistance**:
    - **Migration**: Implemented `seedHistory` utility to generate and persist longitudinal data (2018-2025) to Firebase.
    - **Hybrid Loading**: Local fallback + Cloud source of truth for tool history.

### Fixed
- **Streamgraph Clipping**: Fixed issue where graph was cut off on smaller screens.
- **Sidebar / Graph Overlap**: Logic added to auto-hide Sidebar when Streamgraph is active.
- **Hover Sync**: Resolved state lifting issues to ensure seamless cross-component highlighting.

## [0.4.0] - 2025-12-20
### Added
- Initial implementation of Radial Map visualization.
- Basic Firebase Authentication integration.
- Clustering logic based on sectors.

### Deprecated
- Physics-based force simulation (Removed in favor of static layout for stability).
