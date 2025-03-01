import { useEffect, useState } from "react";

export const useFixtureStates = (startedTime) => {
  const started = !!startedTime;
  const [enableStates, setEnableStates] = useState({
    start: "enabled",
    postpone: "enabled",
    cancel: "enabled",
    finish: "disabled",
  });

  useEffect(() => {
    if (started) {
      setEnableStates({
        start: "disabled",
        postpone: "enabled",
        cancel: "enabled",
        finish: "enabled",
      });
    }
  }, [started]);

  return [enableStates, setEnableStates];
};

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
