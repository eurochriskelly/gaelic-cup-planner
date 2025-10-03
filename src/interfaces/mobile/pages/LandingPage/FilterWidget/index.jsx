import { useEffect, useMemo, useRef, useState } from "react";
import "./FilterWidget.scss";

const ENTER_KEYS = ["Enter", " ", "Spacebar", "Space"];

function FilterWidget({
  pitches = [],
  isLoading = false,
  error = null,
  initialSelection,
  onSelectionChange,
}) {
  const [selectedPitches, setSelectedPitches] = useState([]);
  const [multiSelectEnabled, setMultiSelectEnabled] = useState(false);
  const lastEmittedSelection = useRef(JSON.stringify({ primary: null, additional: [] }));

  const sanitizeSelection = (pitchList, selection) => {
    if (!pitchList.length) {
      return { ids: [], multiSelect: false };
    }

    const availableIds = pitchList.map((pitch) => `${pitch.id}`);
    const ordered = [];
    const seen = new Set();

    const pushIfValid = (candidate) => {
      if (candidate === null || candidate === undefined) return;
      const id = `${candidate}`;
      if (!availableIds.includes(id)) return;
      if (seen.has(id)) return;
      seen.add(id);
      ordered.push(id);
    };

    pushIfValid(selection?.primary);
    (selection?.additional || []).forEach(pushIfValid);

    if (!ordered.length) {
      ordered.push(availableIds[0]);
    }

    return {
      ids: ordered,
      multiSelect: ordered.length > 1,
    };
  };

  const lastAppliedInitial = useRef({ signature: null, multiSelect: null });

  useEffect(() => {
    if (!pitches.length) {
      setSelectedPitches([]);
      setMultiSelectEnabled(false);
      lastAppliedInitial.current = { signature: null, multiSelect: false };
      return;
    }

    const { ids, multiSelect } = sanitizeSelection(pitches, initialSelection);
    console.log('[FilterWidget] hydrate from props', {
      initialSelection,
      resolvedIds: ids,
      multiSelect,
    });
    const signature = JSON.stringify(ids);
    const { signature: lastSignature, multiSelect: lastMulti } = lastAppliedInitial.current;

    const signatureChanged = lastSignature !== signature;
    const multiChanged = lastMulti !== multiSelect;

    if (!signatureChanged && !multiChanged) {
      return;
    }

    lastAppliedInitial.current = { signature, multiSelect };

    if (signatureChanged) {
      console.log('[FilterWidget] applying hydrated selection', ids);
      setSelectedPitches(ids);
    }

    if (multiChanged) {
      console.log('[FilterWidget] setting multiSelectEnabled', multiSelect);
      setMultiSelectEnabled(multiSelect);
    }
  }, [pitches, initialSelection]);

  useEffect(() => {
    if (!onSelectionChange) return;
    const [primary, ...additional] = selectedPitches;
    const payload = { primary: primary || null, additional };

    if (!selectedPitches.length) {
      lastEmittedSelection.current = JSON.stringify({ primary: null, additional: [] });
      return;
    }

    const signature = JSON.stringify(payload);
    if (lastEmittedSelection.current === signature) return;
    lastEmittedSelection.current = signature;
    console.log('[FilterWidget] emit selection change', payload);
    onSelectionChange(payload);
  }, [selectedPitches, onSelectionChange]);

  const selectedSet = useMemo(() => new Set(selectedPitches), [selectedPitches]);
  const selectedCount = selectedPitches.length;

  const handlePitchToggle = (pitchId) => {
    if (pitchId === null || pitchId === undefined) return;
    const safeId = `${pitchId}`;
    setSelectedPitches((prev) => {
      const hasPitch = prev.includes(safeId);

      if (multiSelectEnabled) {
        if (hasPitch) {
          if (prev.length === 1) {
            return prev;
          }
          return prev.filter((id) => id !== safeId);
        }
        return [...prev, safeId];
      }

      if (hasPitch && prev.length === 1) {
        return prev;
      }

      return [safeId];
    });
  };

  const handleMultiSelectChange = (event) => {
    const enabled = event.target.checked;
    if (enabled) {
      setMultiSelectEnabled(true);
      return;
    }

    setMultiSelectEnabled(false);
    setSelectedPitches((prevSel) => {
      if (prevSel.length <= 1) return prevSel;
      return prevSel.slice(0, 1);
    });
  };

  const handleKeyToggle = (event, pitchId) => {
    if (ENTER_KEYS.includes(event.key)) {
      event.preventDefault();
      handlePitchToggle(pitchId);
    }
  };

  const getStatusLabel = (id) => {
    if (!selectedSet.has(id)) return "Tap to select";
    return "Selected";
  };

  const extraCount = Math.max(selectedCount - 1, 0);
  const canShowGrid = !isLoading && !error && pitches.length;
  const multiSelectActive = multiSelectEnabled || selectedCount > 1;
  const baseSummary = `${selectedCount} pitch${selectedCount === 1 ? "" : "es"} selected`;
  const selectionSummary = multiSelectEnabled ? `Multi-select on · ${baseSummary}` : baseSummary;
  const additionalSummary = multiSelectEnabled && extraCount > 0 ? ` (${extraCount} additional)` : "";

  return (
    <div className={`FilterWidget${multiSelectEnabled ? " multi-select" : ""}`}>
      <div className="label">Select which pitch(es) you are coordinating</div>
      <p className="helper">Select a pitch to coordinate; enable multi-select if you need to cover more than one.</p>

      {isLoading && <div className="state">Loading pitches...</div>}

      {error && !isLoading && (
        <div className="state error">We could not load the pitch list. Refresh to try again.</div>
      )}

      {!isLoading && !error && !pitches.length && (
        <div className="state">No pitches available yet.</div>
      )}

      {canShowGrid && (
        <div className="pitch-grid">
          {pitches.map(({ id, label }) => {
            const safeId = `${id}`;
            const isSelected = selectedSet.has(safeId);
            return (
              <div
                key={safeId}
                role="button"
                tabIndex={0}
                className={`pitch-chip${isSelected ? " selected" : ""}`}
                onClick={() => handlePitchToggle(safeId)}
                onKeyDown={(event) => handleKeyToggle(event, safeId)}
              >
                <div className="chip-heading">
                  <span className="chip-label">{label}</span>
                  <span className="chip-status">{getStatusLabel(safeId)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="controls">
        <label className={`toggle-multi${!pitches.length ? " disabled" : ""}`}>
          <input
            type="checkbox"
            checked={multiSelectEnabled}
            onChange={handleMultiSelectChange}
            disabled={!pitches.length}
          />
          <span>Select multiple pitches</span>
        </label>
        {multiSelectActive && (
          <span className="extras-indicator">{selectionSummary}{additionalSummary}.</span>
        )}
      </div>
    </div>
  );
}

export default FilterWidget;
