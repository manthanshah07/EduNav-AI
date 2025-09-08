import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Colleges() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">College Finder</h2>
          <p className="text-sm text-muted-foreground">
            Search and match colleges based on fit, major, and location.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Explore Colleges</CardTitle>
          <CardDescription>
            Find institutions that fit your profile and goals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-700">
            Use filters to narrow down colleges and save favorites to your
            roadmap.
          </p>
          <div className="mt-4">
            <Button>Search Colleges</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
