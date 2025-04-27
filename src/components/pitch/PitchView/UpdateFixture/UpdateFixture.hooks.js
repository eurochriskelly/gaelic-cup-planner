import { useReducer, useState, useEffect } from "react";

export function useFixtureStates(startedTime, isResult) {
  const initialStates = {
    start: startedTime ? "disabled" : "enabled",
    postpone: startedTime ? "disabled" : "enabled",
    finish: startedTime ? "enabled" : "disabled",
    proceed: isResult ? "enabled" : "disabled",
  };

  function reducer(state, action) {
    switch (action.type) {
      case "setStart":
        return { ...state, start: action.value };
      case "setPostpone":
        return { ...state, postpone: action.value };
      case "setFinish":
        return { ...state, finish: action.value };
      case "setProceed":
        return { ...state, proceed: action.value };
      default:
        return state;
    }
  }

  const [states, dispatch] = useReducer(reducer, initialStates);

  // Keep `proceed` in sync if fixture.isResult changes after mount
  useEffect(() => {
    dispatch({ type: "setProceed", value: isResult ? "enabled" : "disabled" });
  }, [isResult]);

  // wrapper to match old API
  function setEnableStates(updater) {
    const next = typeof updater === "function" ? updater(states) : updater;
    if (next.proceed != null) {
      dispatch({ type: "setProceed", value: next.proceed });
    }
    if (next.start != null) {
      dispatch({ type: "setStart", value: next.start });
    }
    if (next.postpone != null) {
      dispatch({ type: "setPostpone", value: next.postpone });
    }
    if (next.finish != null) {
      dispatch({ type: "setFinish", value: next.finish });
    }
  }

  return [states, setEnableStates];
}

export function useVisibleDrawers() {
  const [visibleDrawers, setVisibleDrawers] = useState({
    start: false,
    proceed: false,
    postpone: false,
    finish: false,
  });
  const drawerOpen = Object.values(visibleDrawers).some((v) => v);
  return [visibleDrawers, setVisibleDrawers, drawerOpen];
}