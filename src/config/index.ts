export const sites = [
  {
    name: "robu",
    isAllowed: import.meta.env.VITE_ROBU_ALLOWED === "true",
  },
  {
    name: "robokit",
    isAllowed: import.meta.env.VITE_ROBOKIT_ALLOWED === "true",
  },
  {
    name: "sunrom",
    isAllowed: import.meta.env.VITE_SUNROM_ALLOWED === "true",
  },
  {
    name: "zbotic",
    isAllowed: import.meta.env.VITE_ZBOTIC_ALLOWED === "true",
  },
  {
    name: "evelta",
    isAllowed: import.meta.env.VITE_EVELTA_ALLOWED === "true",
  },
  {
    name: "robocraze",
    isAllowed: import.meta.env.VITE_ROBOCRAZE_ALLOWED === "true",
  },
  {
    name: "quartz",
    isAllowed: import.meta.env.VITE_QUARTZ_ALLOWED === "true",
  },
];
