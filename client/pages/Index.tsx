import { useEffect, useState, useMemo } from "react";
import { DemoResponse } from "@shared/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ChevronRight, GraduationCap, Map, Target, TrendingUp } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Index() {
  const [exampleFromServer, setExampleFromServer] = useState("");

  useEffect(() => {
    fetchDemo();
  }, []);

  const fetchDemo = async () => {
    try {
      const response = await fetch("/api/demo");
      const data = (await response.json()) as DemoResponse;
      setExampleFromServer(data.message);
    } catch (error) {
      console.error("Error fetching demo:", error);
    }
  };

  const STORAGE_KEY = "edunav.quiz.v1";

  const [completionPercent, setCompletionPercent] = useState<number>(0);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const navigate = useNavigate();

  const deadlines = [
    { title: "FAFSA opens", date: "2025-10-01" },
    { title: "SAT registration", date: "2025-09-15" },
    { title: "UC app opens", date: "2025-08-01" },
  ];

  const daysUntil = (isoDate: string) => {
    const now = new Date();
    const then = new Date(isoDate + "T00:00:00");
    const diff = Math.ceil((then.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const urgencyFor = (days: number) => {
    if (days < 0) return { color: "bg-slate-200 text-slate-600", label: "Passed" };
    if (days < 7) return { color: "bg-red-50 text-red-700", label: `Due in ${days}d` };
    if (days <= 30) return { color: "bg-amber-50 text-amber-700", label: `Due in ${days}d` };
    return { color: "bg-emerald-50 text-emerald-700", label: `Due in ${days}d` };
  };

  const level = useMemo(() => ({
    name: "Explorer",
    tier: 3,
    message: completionPercent >= 80 ? "You're almost at the next level!" : completionPercent >= 50 ? "Great progress — keep it up!" : "Keep going — you've got this!",
  }), [completionPercent]);

  // load stored progress on mount
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const answers = parsed.answers || {};
        const totalQ = parsed.totalQuestions || 25; // fallback
        const count = Object.keys(answers).length;
        const pct = totalQ ? Math.round((count / totalQ) * 100) : 0;
        setCompletionPercent(pct);
        setSubmitted(!!parsed.submitted);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const onContinue = () => navigate("/quiz?start=1");
  const onReview = () => navigate("/quiz?review=1");

  return (
    <div className="space-y-6">
      {/* Gradient header (reduced height for better hierarchy) */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-sm">
        <div className="absolute inset-0 opacity-18 [background:radial-gradient(circle_at_30%_20%,white_0,transparent_40%),radial-gradient(circle_at_70%_60%,white_0,transparent_35%)]" />
        <div className="relative px-6 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-xs uppercase tracking-widest text-white/85">AI-powered Guidance</p>
              <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl lg:text-3xl">Welcome back, Alex!</h1>
              <p className="mt-2 max-w-2xl text-white/95">Pick up where you left off. Continue your career quiz, explore college matches, and stay on top of upcoming deadlines.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button className="rounded-full bg-gradient-to-r from-sky-600 to-emerald-600 text-white shadow-sm hover:from-sky-700 hover:to-emerald-700">
                Find My Path
              </Button>
              <Button variant="outline" className="rounded-full bg-white/10 text-white border-white/30 hover:bg-white/20">
                Explore Colleges
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Progress + Quick stats (with gamification) */}
      <section className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-slate-800">Career Quiz Progress</CardTitle>
                <CardDescription>{submitted ? "Career Roadmap Ready!" : `You're ${completionPercent}% of the way to your personalized career roadmap.`}</CardDescription>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white/90">
                  <TrendingUp className="h-4 w-4 text-white" />
                  <span>Level {level.tier} • {level.name}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Progress value={submitted ? 100 : completionPercent} />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-700">{submitted ? 100 : completionPercent}%</span>
                <span className="text-xs text-slate-500">{level.message}</span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button size="sm" className="rounded-full" onClick={onContinue}>Continue Quiz</Button>
              <Button size="sm" variant="outline" className="rounded-full" onClick={onReview}>Review Answers</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-800">Upcoming Deadlines</CardTitle>
            <CardDescription>Keep track of what's next</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              {deadlines.map((d) => {
                const days = daysUntil(d.date);
                const urgency = urgencyFor(days);
                return (
                  <li key={d.title} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className={`h-4 w-4 ${days < 7 ? "text-red-500" : "text-emerald-500"}`} />
                      <span className="font-medium">{d.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${urgency.color}`}>{urgency.label}</span>
                      <span className="hidden text-xs text-slate-500 md:inline">{new Date(d.date).toLocaleDateString()}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4">
              <Button variant="ghost" className="group w-full justify-start px-0 text-sky-700 hover:bg-transparent hover:text-sky-800">
                View timeline
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Recommendations grid */}
      <section className="grid gap-6 md:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-sky-600" />
              <CardTitle className="text-slate-800">Career Recommendations</CardTitle>
            </div>
            <CardDescription>Based on your interests and strengths</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-between">
                <span>Data Analyst</span>
                <span className="text-xs text-emerald-600">High fit</span>
              </li>
              <li className="flex items-center justify-between">
                <span>UX Designer</span>
                <span className="text-xs text-emerald-600">High fit</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Biomedical Engineer</span>
                <span className="text-xs text-amber-600">Medium fit</span>
              </li>
            </ul>
            <div className="mt-4">
              <Button variant="outline" className="rounded-full">See all careers</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-sky-600" />
              <CardTitle className="text-slate-800">College Matches</CardTitle>
            </div>
            <CardDescription>Personalized suggestions for you</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-between">
                <span>UC San Diego</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">Reachable</span>
              </li>
              <li className="flex items-center justify-between">
                <span>University of Washington</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">Strong fit</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Arizona State University</span>
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">Safety</span>
              </li>
            </ul>
            <div className="mt-4">
              <Button variant="outline" className="rounded-full">Explore colleges</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Map className="h-5 w-5 text-sky-600" />
              <CardTitle className="text-slate-800">Upcoming Tasks</CardTitle>
            </div>
            <CardDescription>Stay organized on your journey</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-between">
                <span>Draft personal statement</span>
                <span className="text-xs text-slate-500">Due in 3 days</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Ask for recommendation</span>
                <span className="text-xs text-slate-500">Due in 5 days</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Finalize course plan</span>
                <span className="text-xs text-slate-500">Due next week</span>
              </li>
            </ul>
            <div className="mt-4 flex items-center justify-between">
              <Button variant="outline" className="rounded-full">Add task</Button>
              <Button size="sm" className="rounded-full">Open timeline</Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Hidden server message to keep example data flow */}
      <p className="hidden">{exampleFromServer}</p>
    </div>
  );
}
