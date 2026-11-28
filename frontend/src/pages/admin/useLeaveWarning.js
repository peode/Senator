import { useEffect } from "react";

// Браузер перепитає перед закриттям вкладки, поки є незбережені зміни
export const useLeaveWarning = (dirty) => {
  useEffect(() => {
    if (!dirty) return undefined;

    const warn = (event) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
};
