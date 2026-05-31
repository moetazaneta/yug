// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import m0000 from "./20260525161117_chunky_firedrake/migration.sql";

export default {
  journal: {
    entries: [
      {
        idx: 0,
        when: 20260525161117,
        tag: "20260525161117_chunky_firedrake",
        breakpoints: true,
      },
    ],
  },
  migrations: {
    "20260525161117_chunky_firedrake": m0000,
  },
};
