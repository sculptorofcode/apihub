
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";

const SidebarWidgets: React.FC = () => (
  <div className="flex flex-col gap-4">
    {/* Settings cards */}
    <Card className="rounded-xl shadow-sm">
      <CardContent className="p-4 flex flex-col gap-2">
        <div className="flex items-center text-sm">
          <Settings className="h-4 w-4 mr-2" />
          <span>Profile language:</span>
          <span className="ml-auto font-semibold">English</span>
          <button className="ml-2 text-xs underline text-[var(--primary-600)]">Edit</button>
        </div>
        <div className="flex items-center text-sm pt-2 border-t border-[var(--border)]">
          <span>Public profile & URL:</span>
          <a href="#" className="ml-auto font-semibold underline text-[var(--primary-600)]">/alex_innovator</a>
          <button className="ml-2 text-xs underline text-[var(--primary-600)]">Edit</button>
        </div>
      </CardContent>
    </Card>
    {/* Ad/recommendation card */}
    <Card className="rounded-xl shadow-sm">
      <CardContent className="p-3">
        <img
          src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=140&fit=crop"
          alt="See who's hiring"
          className="rounded-lg w-full object-cover mb-2"
        />
        <div className="text-xs">See who’s hiring on IdeaHub</div>
      </CardContent>
    </Card>
    {/* People you may know - placeholder */}
    <Card className="rounded-xl shadow-sm">
      <CardContent className="p-3">
        <div className="font-semibold mb-1">People you may know</div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <img src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=40&h=40&fit=crop" alt="Profile" className="w-8 h-8 rounded-full" />
            <div className="flex-1 text-xs">Jess Wu</div>
            <button className="text-xs underline text-[var(--primary-600)]">View</button>
          </div>
          {/* ...more rows in the future */}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default SidebarWidgets;
