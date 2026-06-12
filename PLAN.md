# Implementation Plan: Remove side gutters from tab headers

## Goal
Make the tab headers on the schedule page ("Planned / Next / Finished") and status page ("Combined / Gp.1 / Gp.2") span the full width without side gutters.

## Files to Modify
1. `src/components/pitch/PitchView/Kanban/Kanban.scss` — Remove side gutters from `.kanban-large-tabs`
2. `src/components/groups/TournamentView/TournamentView.scss` — Remove side gutters from `.group-tabs`

## Concrete Changes

### `src/components/pitch/PitchView/Kanban/Kanban.scss`
The `.kanban-large-tabs` currently sits in the middle column of a 3-column grid. Change it to span all columns:

```scss
.kanban-large-tabs {
  background: #f1f5ea;
  border-bottom: 1px solid rgba(80, 94, 67, 0.32);
  border-top: 1px solid rgba(80, 94, 67, 0.32);
  display: flex;
  grid-column: 1 / 4;   // changed from 2 / 3
  grid-row: 1;
  min-width: 0;
  overflow: hidden;
  position: relative;
  z-index: 1;
}
```

The side navigation (`.kanban-large-nav`) sits above it at `z-index: 50` and only occupies the left/right gutter columns, so the tabs can safely span the full width without interfering with navigation buttons.

### `src/components/groups/TournamentView/TournamentView.scss`
The `.group-tabs` also sits in the middle column of a 3-column grid. Change it to span all columns:

```scss
.group-tabs {
  background: #f1f5ea;
  border-bottom: 1px solid var(--status-border);
  border-top: 1px solid var(--status-border);
  display: flex;
  grid-column: 1 / 4;   // changed from 2 / 3
  grid-row: 1;
  min-width: 0;
  overflow-x: auto;
  position: relative;
  scrollbar-width: none;
  z-index: 1;

  &::-webkit-scrollbar {
    display: none;
  }
}
```

The side navigation (`.group-stage-side-nav`) sits above it at `z-index: 2` and only occupies the left/right gutter columns, so this is also safe.

## Verification
- [ ] Open the schedule page in large mode and confirm the "Planned / Next / Finished" tabs extend edge-to-edge
- [ ] Open the status page with multiple groups and confirm the "Combined / Gp.1 / Gp.2" tabs extend edge-to-edge
- [ ] Verify that side navigation (swipe arrows) still works correctly on both pages

## Rollback
- Revert the two `grid-column` values back to `2 / 3` in each file.
