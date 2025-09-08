import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Quiz() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Career Quiz</h2>
          <p className="text-sm text-muted-foreground">Answer a few questions to get personalized guidance.</p>
        </div>
        <div>
          <Button asChild>
            <Link to="/">Back</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Start the Quiz</CardTitle>
          <CardDescription>It takes about 10 minutes to complete.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-700">This interactive quiz will learn your interests and strengths, then suggest career paths and courses.</p>
          <div className="mt-4">
            <Button>Begin Quiz</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
