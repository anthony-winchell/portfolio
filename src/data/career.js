// Newest first, like git log. `graph` picks which piece of the branch drawing
// goes beside the entry; see CareerLog.js. The hashes are just for looks.
export const career = [
  {
    hash: "a3f9c21",
    ref: "HEAD -> main",
    graph: "tip",
    title: "IT Programmer, AI Automation & Infrastructure Support",
    when: "September 2026 to present",
    details: [
      "Automated an internal data pipeline, freeing up the billing team's time for other work.",
      "Software development, infrastructure, automation, AI integration, and IT support in healthcare technology.",
    ],
  },
  {
    hash: "7be04d8",
    graph: "merge",
    title: "Merge branch 'wgu'",
    when: "July 2026",
    details: ["B.S. in Computer Science, Western Governors University."],
  },
  {
    hash: "5c1d9e0",
    ref: "wgu",
    graph: "branch",
    title: "Earn a CS degree while working full-time",
    when: "1.5 years",
    details: [],
  },
  {
    hash: "1e82f47",
    graph: "root",
    title: "Lead Trainer / Server, service industry",
    when: "Nearly a decade",
    details: ["Trained and mentored staff on operating procedures, point-of-sale systems, and troubleshooting."],
  },
];
