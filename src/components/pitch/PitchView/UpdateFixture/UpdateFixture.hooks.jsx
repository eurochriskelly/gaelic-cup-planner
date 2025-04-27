import { useEffect, useState } from "react";

// Pass isResult into the hook
export const useFixtureStates = (startedTime, isResult) => {
  const started = !!startedTime;
  const [enableStates, setEnableStates] = useState({
    start: "enabled",
    postpone: "enabled",
    cancel: "enabled", // Keep cancel state for potential future use or separate button
    finish: "disabled",
    next: "disabled", // Add state for the 'Next' button
  });

  useEffect(() => {
    // Base state changes on whether the match has started
    let newStates;
    if (started) {
      newStates = {
        start: "disabled",
        postpone: "enabled", // Or disabled if started? Check logic
        cancel: "enabled", // Or disabled if started? Check logic
        finish: "enabled",
        next: "disabled", // Default next to disabled when started
      };
    } else {
      // Reset to initial state if match is not started
      newStates = {
        start: "enabled",
        postpone: "enabled",
        cancel: "enabled",
        finish: "disabled",
        next: "disabled", // Next is disabled if not started
      };
    }

    // Override 'next' state based on isResult, but only if match is finished/started?
    // Let's enable 'next' *only* if isResult is true, regardless of started state for now.
    // This assumes isResult can only be true after the match is effectively over.
    if (isResult) {
      newStates.next = "enabled";
    } else {
      newStates.next = "disabled";
    }

    setEnableStates(newStates);

  }, [started, isResult]); // Add isResult to dependency array

  return [enableStates, setEnableStates];
};

// Removed the duplicated/incorrect useFixtureStates hook definition that was here.

export const useVisibleDrawers = () => {
  const closedDrawers = {
    start: false,
    cancel: false,
    postpone: false,
    finish: false,
  };
  const [visibleDrawers, setVisibleDrawers] = useState(closedDrawers);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(Object.values(visibleDrawers).some((f) => f));
  }, [visibleDrawers]);

  return [visibleDrawers, setVisibleDrawers, drawerOpen];
};
