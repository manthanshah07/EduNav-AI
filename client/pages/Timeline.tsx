import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Timeline() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Timeline</h2>
          <p className="text-sm text-muted-foreground">Overview of deadlines and milestones for your college journey.</p>
        </div>
        <div>
          <Button variant="outline">Add milestone</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Milestones</CardTitle>
          <CardDescription>Stay on track with important dates</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            <li className="flex items-start justify-between">
              <div>
                <div className="font-medium">FAFSA opens</div>
                <div className="text-sm text-slate-600">Complete FAFSA to receive financial aid</div>
              </div>
              <div className="text-sm text-slate-500">Oct 1</div>
            </li>
            <li className="flex items-start justify-between">
              <div>
                <div className="font-medium">SAT registration deadline</div>
                <div className="text-sm text-slate-600">Sign up for your preferred test date</div>
              </div>
              <div className="text-sm text-slate-500">Sep 15</div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
