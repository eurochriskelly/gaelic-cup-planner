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
  const [allowExtras, setAllowExtras] = useState(false);
  const lastEmittedSelection = useRef(JSON.stringify({ primary: null, additional: [] }));

  const sanitizeSelection = (pitchList, selection) => {
    if (!pitchList.length) {
      return { ids: [], allowExtras: false };
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
      allowExtras: ordered.length > 1,
    };
  };

  const lastAppliedInitial = useRef({ signature: null, allowExtras: null });

  useEffect(() => {
    if (!pitches.length) {
      setSelectedPitches([]);
      setAllowExtras(false);
      lastAppliedInitial.current = { signature: null, allowExtras: false };
      return;
    }

    const { ids, allowExtras: extrasState } = sanitizeSelection(pitches, initialSelection);
    console.log('[FilterWidget] hydrate from props', {
      initialSelection,
      resolvedIds: ids,
      allowExtras: extrasState,
    });
    const signature = JSON.stringify(ids);
    const { signature: lastSignature, allowExtras: lastExtras } = lastAppliedInitial.current;

    const signatureChanged = lastSignature !== signature;
    const extrasChanged = lastExtras !== extrasState;

    if (!signatureChanged && !extrasChanged) {
      return;
    }

    lastAppliedInitial.current = { signature, allowExtras: extrasState };

    if (signatureChanged) {
      console.log('[FilterWidget] applying hydrated selection', ids);
      setSelectedPitches(ids);
    }

    if (extrasChanged) {
      console.log('[FilterWidget] setting allowExtras', extrasState);
      setAllowExtras(extrasState);
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

  const primaryPitch = selectedPitches[0] || null;
  const selectedSet = useMemo(() => new Set(selectedPitches), [selectedPitches]);

  const handlePitchToggle = (pitchId) => {
    if (pitchId === null || pitchId === undefined) return;
    const safeId = `${pitchId}`;
    setSelectedPitches((prev) => {
      const hasPitch = prev.includes(safeId);

      if (allowExtras) {
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

  const handlePromoteToPrimary = (pitchId) => {
    const safeId = `${pitchId}`;
    setSelectedPitches((prev) => {
      if (!prev.includes(safeId)) return prev;
      const filtered = prev.filter((id) => id !== safeId);
      return [safeId, ...filtered];
    });
  };

  const handleToggleExtras = () => {
    if (!allowExtras) {
      setAllowExtras(true);
      return;
    }

    setAllowExtras(false);
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
    if (!selectedSet.has(id)) return "Tap to coordinate";
    return primaryPitch === id ? "Coordinating" : "Viewing";
  };

  const extraCount = Math.max(selectedPitches.length - 1, 0);
  const canShowGrid = !isLoading && !error && pitches.length;

  return (
    <div className={`FilterWidget${allowExtras ? " allow-extras" : ""}`}>
      <div className="label">Select which pitch(es) you are coordinating</div>
      <p className="helper">Pick your primary pitch; use "View additional pitch" to keep an eye on another field.</p>

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
            const isPrimary = primaryPitch === safeId;
            const isSelected = selectedSet.has(safeId);
            return (
              <div
                key={safeId}
                role="button"
                tabIndex={0}
                className={`pitch-chip${isSelected ? " selected" : ""}${isPrimary ? " primary" : ""}`}
                onClick={() => handlePitchToggle(safeId)}
                onKeyDown={(event) => handleKeyToggle(event, safeId)}
              >
                <div className="chip-heading">
                  <span className="chip-label">{label}</span>
                  <span className="chip-status">{getStatusLabel(safeId)}</span>
                </div>
                {allowExtras && isSelected && !isPrimary && (
                  <button
                    type="button"
                    className="chip-promote"
                    onClick={(event) => {
                      event.stopPropagation();
                      handlePromoteToPrimary(safeId);
                    }}
                  >
                    Set as primary
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="controls">
        <button
          type="button"
          className={`toggle-extras${allowExtras ? " active" : ""}`}
          onClick={handleToggleExtras}
          disabled={!pitches.length}
        >
          {allowExtras ? "Done adding extra pitches" : "View additional pitch"}
        </button>
        {extraCount > 0 && (
          <span className="extras-indicator">
            Viewing {extraCount} additional pitch{extraCount > 1 ? "es" : ""}.
          </span>
        )}
      </div>
    </div>
  );
}

export default FilterWidget;
