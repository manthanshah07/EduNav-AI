import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Courses() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Course Maps</h2>
          <p className="text-sm text-muted-foreground">Plan your classes to match your career goals.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Suggested Course Maps</CardTitle>
          <CardDescription>Programs and semester-by-semester guides tailored to your interests.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-700">Explore recommended course sequences for majors like Data Science, Design, Engineering, and more.</p>
          <div className="mt-4">
            <Button variant="outline">View all maps</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
