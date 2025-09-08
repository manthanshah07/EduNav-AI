import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Medal } from "lucide-react";

type Cluster = "tech" | "business" | "arts" | "health" | "research";

type Option = {
  id: string;
  label: string;
  scores?: Partial<Record<Cluster, number>>;
};

type Question = {
  id: string;
  text: string;
  type: "mcq" | "rating" | "yesno";
  options?: Option[];
  // for rating, we will use 1-5
};

type Section = {
  id: string;
  title: string;
  questions: Question[];
};

const SECTIONS: Section[] = [
  {
    id: "interests",
    title: "Career Interests",
    questions: [
      {
        id: "i1",
        text: "Which work environment appeals most to you?",
        type: "mcq",
        options: [
          { id: "i1a", label: "Fast-paced, innovative (startup/tech)", scores: { tech: 2, business: 1 } },
          { id: "i1b", label: "Structured, large organizations", scores: { business: 2, research: 1 } },
          { id: "i1c", label: "Studio or creative spaces", scores: { arts: 2 } },
          { id: "i1d", label: "Clinical or service settings", scores: { health: 2 } },
        ],
      },
      {
        id: "i2",
        text: "Do you enjoy creating visual or written work?",
        type: "yesno",
      },
      {
        id: "i3",
        text: "How important is travel in your career?",
        type: "mcq",
        options: [
          { id: "i3a", label: "Often (frequent travel)", scores: { business: 1, health: 1 } },
          { id: "i3b", label: "Sometimes (occasional)", scores: { business: 1 } },
          { id: "i3c", label: "Rarely (mostly local)", scores: { research: 1, tech: 1 } },
        ],
      },
      {
        id: "i4",
        text: "Do you prefer creative freedom or clear structure?",
        type: "mcq",
        options: [
          { id: "i4a", label: "Creative freedom", scores: { arts: 2, tech: 1 } },
          { id: "i4b", label: "Clear structure", scores: { business: 2, research: 1 } },
        ],
      },
      {
        id: "i5",
        text: "How much do you enjoy problem-solving with data or systems?",
        type: "rating",
      },
      {
        id: "i6",
        text: "Do you like teaching, mentoring, or explaining ideas to others?",
        type: "yesno",
      },
    ],
  },

  {
    id: "skills",
    title: "Skills & Strengths",
    questions: [
      {
        id: "s1",
        text: "Do you enjoy coding or technical problem solving?",
        type: "yesno",
      },
      {
        id: "s2",
        text: "Rate your math & analytical skills",
        type: "rating",
      },
      {
        id: "s3",
        text: "How strong is your creativity (design, storytelling)?",
        type: "rating",
      },
      {
        id: "s4",
        text: "Are you comfortable with hands-on healthcare tasks?",
        type: "yesno",
      },
      {
        id: "s5",
        text: "Do you prefer leadership/management roles?",
        type: "yesno",
      },
    ],
  },

  {
    id: "personality",
    title: "Personality & Work Style",
    questions: [
      { id: "p1", text: "Do you prefer working alone or in teams?", type: "mcq", options: [ { id: "p1a", label: "Alone", scores: { research: 1, tech: 1 } }, { id: "p1b", label: "In teams", scores: { business: 1, health: 1, arts: 1 } } ] },
      { id: "p2", text: "How do you handle stressful deadlines?", type: "rating" },
      { id: "p3", text: "Are you more introverted or extroverted?", type: "mcq", options: [ { id: "p3a", label: "Introverted", scores: { research: 1 } }, { id: "p3b", label: "Extroverted", scores: { business: 1, arts: 1 } } ] },
      { id: "p4", text: "Do you enjoy mentoring others?", type: "yesno" },
      { id: "p5", text: "Prefer predictable tasks or varied challenges?", type: "mcq", options: [ { id: "p5a", label: "Predictable", scores: { business: 1 } }, { id: "p5b", label: "Varied", scores: { tech: 1, arts: 1 } } ] },
    ],
  },

  {
    id: "values",
    title: "Values & Lifestyle Preferences",
    questions: [
      { id: "v1", text: "Is salary a top priority?", type: "yesno" },
      { id: "v2", text: "How important is work-life balance?", type: "rating" },
      { id: "v3", text: "Do you prefer public sector or private sector?", type: "mcq", options: [ { id: "v3a", label: "Public", scores: { research: 1, health: 1 } }, { id: "v3b", label: "Private", scores: { business: 1, tech: 1 } } ] },
      { id: "v4", text: "Would you consider a career in non-profit or social work?", type: "yesno" },
      { id: "v5", text: "Do you want a role with high growth potential?", type: "yesno" },
    ],
  },

  {
    id: "goals",
    title: "Career Goals & Future Plans",
    questions: [
      { id: "g1", text: "Do you plan to pursue higher studies (Masters/PhD)?", type: "yesno" },
      { id: "g2", text: "Are you interested in entrepreneurship?", type: "yesno" },
      { id: "g3", text: "How open are you to learning new technical skills?", type: "rating" },
      { id: "g4", text: "Do you see yourself in a leadership role in 10 years?", type: "yesno" },
    ],
  },
];

const STORAGE_KEY = "edunav.quiz.v1";

export default function Quiz() {
  const totalQuestions = SECTIONS.reduce((s, sec) => s + sec.questions.length, 0);
  const [step, setStep] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return typeof parsed.step === 'number' ? parsed.step : 0;
      }
    } catch {}
    return 0;
  }); // section index
  const [answers, setAnswers] = useState<Record<string, any>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw).answers || {};
    } catch (e) {
      // ignore
    }
    return {};
  });
  const [direction, setDirection] = useState<"next" | "back">("next");
  const [submitted, setSubmitted] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return !!JSON.parse(raw).submitted;
    } catch {}
    return false;
  });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const location = (typeof window !== 'undefined' && window.location) ? new URL(window.location.href) : null;
  const reviewMode = location ? location.search.includes('review=1') : false;
  const startParam = location ? location.search.includes('start=1') : false;
  // if reviewMode or startParam present, auto-start

  useEffect(() => {
    // persist including metadata
    const payload: any = { step, answers, totalQuestions };
    if (submitted) payload.submitted = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [step, answers, submitted, totalQuestions]);

  const section = SECTIONS[step];

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const completionPercent = Math.round((answeredCount / totalQuestions) * 100);

  // handlers
  const setAnswer = (qId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const goNext = () => {
    setDirection("next");
    if (step < SECTIONS.length - 1) setStep((s) => s + 1);
  };
  const goBack = () => {
    setDirection("back");
    if (step > 0) setStep((s) => s - 1);
  };

  const computeResults = () => {
    const scores: Record<Cluster, number> = { tech: 0, business: 0, arts: 0, health: 0, research: 0 };

    for (const sec of SECTIONS) {
      for (const q of sec.questions) {
        const val = answers[q.id];
        if (val === undefined || val === null) continue;

        if (q.type === "mcq") {
          // val is option id
          const opt = q.options?.find((o) => o.id === val);
          if (opt?.scores) {
            for (const k of Object.keys(opt.scores)) {
              const key = k as Cluster;
              scores[key] += (opt.scores as any)[key] || 0;
            }
          }
        }

        if (q.type === "yesno") {
          if (val === true) {
            // heuristics: map some questions by id to clusters
            if (q.id.startsWith("i2") || q.id.startsWith("s3")) scores.arts += 2;
            if (q.id.startsWith("s1")) scores.tech += 2;
            if (q.id.startsWith("s4")) scores.health += 2;
            if (q.id.startsWith("s5") || q.id.startsWith("g4")) scores.business += 1;
            if (q.id.startsWith("g1")) scores.research += 2;
            // generic bonus
            scores.business += 0;
          }
        }

        if (q.type === "rating") {
          const r = Number(val);
          // rate 1-5
          // apply to clusters depending on question context
          if (q.id === "i5" || q.id === "s2") {
            scores.tech += r >= 4 ? 2 : r >= 3 ? 1 : 0;
            scores.research += r >= 4 ? 1 : 0;
          }
          if (q.id === "s3") {
            scores.arts += r >= 4 ? 2 : r >= 3 ? 1 : 0;
          }
          if (q.id === "p2" || q.id === "v2") {
            // stability preferences
            if (r >= 4) scores.business += 1; else scores.arts += 0;
          }
          if (q.id === "g3") {
            if (r >= 4) scores.tech += 2; else if (r >= 3) scores.tech += 1;
            if (r >= 4) scores.research += 1;
          }
        }
      }
    }

    return scores;
  };

  const results = useMemo(() => {
    if (!submitted) return null;
    const scores = computeResults();
    const winner = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0] as Cluster;

    const mapping: Record<Cluster, { label: string; careers: string[] }> = {
      tech: { label: "Tech & Engineering", careers: ["Software Engineer", "Data Scientist", "Systems Engineer"] },
      business: { label: "Business & Management", careers: ["Product Manager", "Business Analyst", "Marketing Manager"] },
      arts: { label: "Arts & Creativity", careers: ["UX Designer", "Content Creator", "Graphic Designer"] },
      health: { label: "Healthcare & Social Work", careers: ["Nurse", "Public Health Specialist", "Therapist"] },
      research: { label: "Research & Academia", careers: ["Research Scientist", "Academic", "Lab Technician"] },
    };

    return { scores, winner, profile: mapping[winner] };
  }, [submitted]);

  const resetQuiz = () => {
    setAnswers({});
    setStep(0);
    setSubmitted(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    // persist submitted flag immediately
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    parsed.submitted = true;
    parsed.step = step;
    parsed.answers = answers;
    parsed.totalQuestions = totalQuestions;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  };

  // animation helpers
  const getTransition = (idx: number) => {
    if (idx === step) return "translate-x-0 opacity-100";
    if (idx < step) return "-translate-x-4 opacity-0 pointer-events-none absolute";
    return "translate-x-4 opacity-0 pointer-events-none absolute";
  };

  const [started, setStarted] = useState(false);

  // If there are saved answers, show continue option but don't auto-start
  const hasSaved = useMemo(() => Object.keys(answers || {}).length > 0, [answers]);

  // Auto-start if URL instructs to (continue or review)
  useEffect(() => {
    if (startParam || reviewMode) {
      setStarted(true);
    }
  }, [startParam, reviewMode]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Career Quiz</h2>
          <p className="text-sm text-muted-foreground">Answer a few questions to get personalized guidance.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={resetQuiz}>Reset</Button>
        </div>
      </div>

      {/* Intro / Start screen */}
      {!started && !submitted && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Find your path</CardTitle>
              <CardDescription>Take a short quiz to get personalized career and college recommendations. It takes ~10 minutes.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <p className="text-sm text-slate-700">Your progress will be saved locally so you can continue later.</p>
                {hasSaved && <p className="text-sm text-slate-600">We found a saved quiz. You can continue where you left off or start fresh.</p>}
              </div>
              <div className="flex items-center gap-3">
                {hasSaved && (
                  <Button onClick={() => setStarted(true)} className="bg-sky-600 text-white">Continue Quiz</Button>
                )}
                <Button onClick={() => { localStorage.removeItem(STORAGE_KEY); setAnswers({}); setStarted(true); }} className="bg-emerald-500 text-white">Begin Quiz</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quiz content */}
      {started && !submitted && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div>
                <CardTitle>Find your path — step {step + 1} of {SECTIONS.length}</CardTitle>
                <CardDescription>{SECTIONS[step].title}</CardDescription>
              </div>
              <div className="w-1/3">
                <Progress value={completionPercent} />
                <div className="mt-2 text-right text-sm text-slate-600">{completionPercent}% completed • {completionPercent >= 80 ? "Almost there!" : completionPercent >= 50 ? "Great progress — keep going!" : "Keep going — you've got this!"}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative min-h-[240px]">
              {SECTIONS.map((sec, idx) => (
                <div key={sec.id} className={`transition-all duration-300 ${getTransition(idx)} bg-background px-2 py-2`}>
                  <div className="space-y-4">
                    {sec.questions.map((q) => (
                      <div key={q.id} className="space-y-2 border-b last:border-b-0 pb-4">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{q.text}</div>
                          <div className="text-xs text-muted-foreground">{q.type === "rating" ? "Rate 1-5" : q.type === "yesno" ? "Yes / No" : "Choose one"}</div>
                        </div>

                        {/* Render controls */}
                        {q.type === "mcq" && (
                          <div className="flex flex-col gap-2">
                            {q.options?.map((o) => (
                              <button
                                key={o.id}
                                onClick={() => { if (reviewMode) return; setAnswer(q.id, o.id); }}
                                className={`rounded-md border px-3 py-2 text-left transition-shadow ${answers[q.id] === o.id ? "bg-sky-50 border-sky-300 shadow" : "bg-white border-slate-200"} ${reviewMode ? 'opacity-60 cursor-not-allowed' : ''}`}>
                                {o.label}
                            </button>
                            ))}
                          </div>
                        )}

                        {q.type === "yesno" && (
                          <div className="flex gap-3">
                            <button onClick={() => { if (reviewMode) return; setAnswer(q.id, true); }} className={`rounded-md px-3 py-2 ${answers[q.id] === true ? "bg-sky-600 text-white" : "bg-white"} ${reviewMode ? 'opacity-60 cursor-not-allowed' : ''}`}>Yes</button>
                            <button onClick={() => { if (reviewMode) return; setAnswer(q.id, false); }} className={`rounded-md px-3 py-2 ${answers[q.id] === false ? "bg-sky-600 text-white" : "bg-white"} ${reviewMode ? 'opacity-60 cursor-not-allowed' : ''}`}>No</button>
                          </div>
                        )}

                        {q.type === "rating" && (
                          <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((n) => (
                            <button key={n} onClick={() => { if (reviewMode) return; setAnswer(q.id, n); }} className={`h-9 w-9 rounded-full ${answers[q.id] === n ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-700"} ${reviewMode ? 'opacity-60 cursor-not-allowed' : ''}`}>{n}</button>
                          ))}
                          </div>
                        )}

                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div>
                <Button variant="ghost" onClick={goBack} disabled={step === 0} className="inline-flex items-center gap-2"><ChevronLeft /> Back</Button>
              </div>
              <div className="flex items-center gap-3">
                {step < SECTIONS.length - 1 && (
                  <Button onClick={goNext} className="inline-flex items-center gap-2">Next <ChevronRight /></Button>
                )}

                {step === SECTIONS.length - 1 && !submitted && (
                  <Button onClick={handleSubmit} className="bg-sky-600 text-white inline-flex items-center gap-2">Submit</Button>
                )}

                {submitted && results && (
                  <Button onClick={() => window.alert(JSON.stringify(results, null, 2))} className="inline-flex items-center gap-2">View Results</Button>
                )}
              </div>
            </div>

          </CardContent>
        </Card>
      )}

      {submitted && results && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Medal className="h-6 w-6 text-amber-500" />
              <div>
                <CardTitle>{results.profile.label}</CardTitle>
                <CardDescription>Suggested career paths</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Top matches based on your answers:</p>
            <ul className="grid gap-3 sm:grid-cols-3">
              {results.profile.careers.map((c) => (
                <li key={c} className="rounded-md border bg-white p-3 text-sm shadow-sm">{c}</li>
              ))}
            </ul>

            <div className="mt-6 flex items-center gap-3">
              <Button variant="outline" onClick={() => { setSubmitted(false); }}>
                Re-run quiz
              </Button>
              <Button onClick={() => { window.localStorage.removeItem(STORAGE_KEY); }}>
                Clear saved
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
