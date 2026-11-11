const LOCAL_HISTORY_KEY = "startupscope_local_history";
const CACHED_HISTORY_KEY = "startupscope_cached_history";

export const fallbackSampleIdeas = [
  {
    idea_name: "FitFlow Coach",
    problem_statement:
      "Busy professionals struggle to stay consistent with fitness plans because most apps are generic and hard to stick with.",
    target_audience: "Urban professionals aged 25-40 who want short guided fitness routines.",
    revenue_model: "Freemium app with premium AI coaching subscription."
  },
  {
    idea_name: "AgriLink Local",
    problem_statement:
      "Small farmers lack direct access to nearby restaurants and retailers willing to buy produce consistently.",
    target_audience: "Small farmers and local food businesses in tier-2 cities.",
    revenue_model: "Transaction fee and B2B SaaS subscriptions."
  },
  {
    idea_name: "StudySprint AI",
    problem_statement:
      "Students lose time switching between notes, doubt solving, and revision tools before exams.",
    target_audience: "College students preparing for semester and placement exams.",
    revenue_model: "Monthly subscription with campus partnerships."
  },
  {
    idea_name: "ClinicQueue",
    problem_statement:
      "Small clinics lose patients to long waiting times because scheduling, walk-ins, and follow-ups are handled manually.",
    target_audience: "Independent clinics and diagnostic centers in urban neighborhoods.",
    revenue_model: "Monthly SaaS plan per clinic with paid SMS reminders."
  }
];

function readList(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeList(key, entries) {
  localStorage.setItem(key, JSON.stringify(entries));
}

function uniqueEntries(entries) {
  const seen = new Set();
  return entries.filter((entry) => {
    if (!entry?.id || seen.has(entry.id)) return false;
    seen.add(entry.id);
    return true;
  });
}

export function getLocalHistory() {
  return readList(LOCAL_HISTORY_KEY);
}

export function cacheHistory(entries) {
  writeList(CACHED_HISTORY_KEY, uniqueEntries(entries));
}

export function getKnownHistory() {
  return uniqueEntries([...getLocalHistory(), ...readList(CACHED_HISTORY_KEY)]);
}

function tokenize(value) {
  return String(value || "")
    .toLowerCase()
    .split(/\W+/)
    .filter((token) => token.length > 3);
}

function buildMemoryContext(idea) {
  const currentTokens = new Set(
    tokenize(`${idea.idea_name} ${idea.problem_statement} ${idea.target_audience} ${idea.revenue_model}`)
  );

  const similar_entries = getKnownHistory()
    .map((entry) => {
      const past = entry.idea || {};
      const pastTokens = new Set(
        tokenize(`${past.idea_name} ${past.problem_statement} ${past.target_audience} ${past.revenue_model}`)
      );
      const overlap = [...currentTokens].filter((token) => pastTokens.has(token)).length;
      return {
        id: entry.id,
        idea_name: past.idea_name,
        similarity: Number((overlap / Math.max(currentTokens.size, 1)).toFixed(2)),
        score: entry.report?.score,
        competition: entry.report?.competition
      };
    })
    .filter((entry) => entry.similarity >= 0.18)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3);

  return {
    similar_entries,
    repeated_patterns: getKnownHistory()
      .flatMap((entry) => entry.report?.gaps || [])
      .filter((gap, index, all) => all.indexOf(gap) === index)
      .slice(0, 5),
    historical_warnings: similar_entries.length
      ? ["This idea overlaps with past validation themes, so make the positioning more specific."]
      : [],
    entry_count: getKnownHistory().length
  };
}

function simulatedCompetitors(idea) {
  const audience = idea.target_audience.split(",")[0].trim() || "general users";
  const name = idea.idea_name.trim() || "Startup";

  return [
    {
      name: `${name} Lite`,
      summary: `A lightweight alternative for ${audience} with simpler onboarding.`,
      strength: "Easy to understand and quick to adopt.",
      weakness: "May lack deep workflow differentiation.",
      source: "local demo"
    },
    {
      name: `${name} Pro`,
      summary: `A premium tool serving ${audience} with automation and team features.`,
      strength: "Broader feature set and stronger premium positioning.",
      weakness: "Higher setup friction for first-time users.",
      source: "local demo"
    },
    {
      name: "Legacy Incumbent",
      summary: `An established product solving adjacent problems for ${audience}.`,
      strength: "Brand trust and distribution.",
      weakness: "Slower product iteration and dated UX.",
      source: "local demo"
    }
  ];
}

function domainInsights(idea) {
  const nameProblem = `${idea.idea_name} ${idea.problem_statement}`.toLowerCase();
  const blob = `${idea.idea_name} ${idea.problem_statement} ${idea.target_audience} ${idea.revenue_model}`.toLowerCase();

  if (["study", "exam", "revision", "notes", "doubt"].some((word) => nameProblem.includes(word))) {
    return {
      gaps: [
        "The study workflow must show measurable exam improvement, not only combine notes, doubt solving, and revision in one place.",
        "Retention risk is high unless the product creates daily study momentum before exam week."
      ],
      suggestions: [
        "Pilot one exam category and track revision completion, doubt resolution time, and score improvement.",
        "Differentiate with adaptive revision plans based on weak topics."
      ]
    };
  }

  if (["career", "job", "placement", "skill", "resume"].some((word) => blob.includes(word))) {
    return {
      gaps: [
        "Career guidance must prove it can map students to real hiring outcomes, not just recommend generic skill paths.",
        "Trust will depend on verified employer, mentor, or placement signals that students cannot already get from free content."
      ],
      suggestions: [
        "Start with final-year students in one stream and measure interview conversions.",
        "Build a proof loop around skill assessment, project evidence, and employer feedback."
      ]
    };
  }

  if (["study", "student", "exam", "revision", "notes", "doubt"].some((word) => blob.includes(word))) {
    return {
      gaps: [
        "The study workflow must show measurable exam improvement, not only combine notes, doubt solving, and revision in one place.",
        "Retention risk is high unless the product creates daily study momentum before exam week."
      ],
      suggestions: [
        "Pilot one exam category and track revision completion, doubt resolution time, and score improvement.",
        "Differentiate with adaptive revision plans based on weak topics."
      ]
    };
  }

  if (["farm", "agri", "produce", "restaurant", "retailer"].some((word) => blob.includes(word))) {
    return {
      gaps: [
        "The marketplace must solve supply reliability, payment trust, and repeat ordering before discovery has value.",
        "Cold-start risk is high because both farmers and buyers need liquidity in the same local cluster."
      ],
      suggestions: [
        "Launch with one crop category and ten repeat buyers to validate fulfillment reliability.",
        "Add simple quality grading and payment assurance before expanding the marketplace."
      ]
    };
  }

  if (["fitness", "coach", "workout", "health"].some((word) => blob.includes(word))) {
    return {
      gaps: [
        "The fitness concept must explain why busy users will stay consistent after the first two weeks.",
        "Generic workout plans are crowded; the retention hook needs to be sharper than AI coaching alone."
      ],
      suggestions: [
        "Validate a seven-minute routine habit with one professional segment before adding broader coaching.",
        "Use accountability, calendar friction, and progress proof as the main differentiation."
      ]
    };
  }

  return {
    gaps: [
      "The first customer workflow needs a sharper proof point before the product promise will feel defensible.",
      "The idea needs a clearer unfair advantage in acquisition, data, workflow ownership, or retention."
    ],
    suggestions: [
      "Pick one narrow early adopter group and define the before-and-after workflow in measurable terms.",
      "Create a paid pilot around the riskiest assumption instead of validating broad interest."
    ]
  };
}

function contextualTopGap(idea, gap) {
  const generic = new Set([
    "",
    "Differentiation is not obvious from the problem framing.",
    "Target audience is too broad or under-defined."
  ]);
  return generic.has(String(gap || "").trim()) ? domainInsights(idea).gaps[0] : gap;
}

function buildReport(idea, memoryContext) {
  const competitors = simulatedCompetitors(idea);
  const insights = domainInsights(idea);
  const problem = idea.problem_statement.toLowerCase();
  const revenue = idea.revenue_model.toLowerCase();
  const targetBonus = idea.target_audience.length > 30 ? 1 : 0;
  const revenueBonus = ["subscription", "saas", "fee", "commission", "marketplace"].some((word) =>
    revenue.includes(word)
  )
    ? 1
    : 0;
  const clarityBonus = idea.problem_statement.length > 90 ? 1 : 0;
  const noveltyPenalty = memoryContext.similar_entries.length ? 1 : 0;
  const score = Math.max(3, Math.min(10, 6 + targetBonus + revenueBonus + clarityBonus - noveltyPenalty));

  const gaps = [insights.gaps[0]];
  if (idea.target_audience.length < 25) gaps.push("Target audience is still too broad for a strong first wedge.");
  if (idea.revenue_model.length < 18) gaps.push("Revenue model needs clearer pricing and buying trigger details.");
  if (!["unlike", "faster", "cheaper", "better", "specific", "only"].some((word) => problem.includes(word))) {
    gaps.push(insights.gaps[1]);
  }
  gaps.push("Competitive pressure is meaningful; positioning must be sharper.");
  if (memoryContext.similar_entries.length) gaps.push("This resembles earlier ideas and needs a stronger novelty angle.");

  return {
    score,
    competition: "Medium",
    swot: {
      strengths: [
        "Problem is understandable and close to a real workflow.",
        "The concept has a practical path to early customer interviews.",
        "Revenue thinking is included before product build-out."
      ],
      weaknesses: gaps.slice(0, 3),
      opportunities: [
        "Narrowing the first user segment can create clearer messaging.",
        "A focused pilot can validate willingness to pay quickly.",
        "Competitor friction creates room for a simpler product promise."
      ],
      threats: [
        "Established tools can copy lightweight features.",
        "Customers may delay payment unless ROI is explicit.",
        "Broad positioning can make acquisition expensive."
      ]
    },
    gaps: gaps.slice(0, 5),
    suggestions: [
      ...insights.suggestions,
      "Write a one-sentence promise that explains why this beats the current workaround.",
      "Run five interviews before building and ask for a pre-order or pilot commitment.",
      "Define the smallest paid version that proves retention within two weeks."
    ].slice(0, 5),
    competitors,
    feasibility: {
      product: "Moderate",
      go_to_market: "Moderate",
      operations: "Moderate",
      notes: "This is validateable in demo mode: the next step is to narrow the user, promise, and paid pilot."
    },
    market_pulse: {
      demand: Number(((score + 7) / 2).toFixed(1)),
      timing: "Good",
      confidence: "Demo mode"
    },
    memory_insights: memoryContext
  };
}

export function createLocalValidation(payload) {
  const idea = {
    idea_name: payload.idea_name.trim(),
    problem_statement: payload.problem_statement.trim(),
    target_audience: payload.target_audience.trim(),
    revenue_model: payload.revenue_model.trim()
  };
  const memoryContext = buildMemoryContext(idea);
  const entry = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    created_at: new Date().toISOString(),
    idea,
    report: buildReport(idea, memoryContext),
    source: "local"
  };

  writeList(LOCAL_HISTORY_KEY, uniqueEntries([entry, ...getLocalHistory()]));
  return entry;
}

export function getKnownEntry(id) {
  return getKnownHistory().find((entry) => entry.id === id) || null;
}

export function deleteKnownEntry(id) {
  const removeFrom = (key) => writeList(key, readList(key).filter((entry) => entry.id !== id));
  const entry = getKnownEntry(id);
  removeFrom(LOCAL_HISTORY_KEY);
  removeFrom(CACHED_HISTORY_KEY);

  if (entry) {
    try {
      const liked = JSON.parse(localStorage.getItem("likedIdeas") || "{}");
      delete liked[id];
      delete liked[entry.idea?.idea_name];
      Object.keys(liked).forEach((key) => {
        if (liked[key]?.entryId === id || liked[key]?.ideaId === entry.idea?.idea_name) {
          delete liked[key];
        }
      });
      localStorage.setItem("likedIdeas", JSON.stringify(liked));
    } catch {
      localStorage.setItem("likedIdeas", "{}");
    }
  }

  return entry;
}

export function compareKnownIdeas(entryIds) {
  const entries = entryIds.map(getKnownEntry).filter(Boolean);
  if (entries.length < 2) {
    throw new Error("Select at least two available ideas to compare.");
  }

  const comparison = entries.map((entry) => ({
    id: entry.id,
    idea_name: entry.idea.idea_name,
    score: entry.report.score,
    competition: entry.report.competition,
    top_gap: contextualTopGap(entry.idea, entry.report.gaps?.[0]) || "No major gap detected",
    best_suggestion: entry.report.suggestions?.[0] || "No suggestion available"
  }));

  return {
    comparison,
    leader: comparison.reduce((best, item) => (item.score > best.score ? item : best), comparison[0])
  };
}
