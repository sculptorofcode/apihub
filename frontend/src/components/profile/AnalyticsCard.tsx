import React, { useState } from "react";
import { BarChart2, Eye, Search, TrendingUp, ChevronRight, Activity, Share2, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Custom animated counter component
const AnimatedCounter: React.FC<{ value: number; duration?: number }> = ({ value, duration = 1 }) => {
  const [count, setCount] = useState(0);
  
  React.useEffect(() => {
    // Simple animation function
    let start = 0;
    const end = value;
    const totalFrames = Math.max(1, Math.floor(duration * 60)); // 60fps
    const counter = setInterval(() => {
      start += 1;
      const progress = Math.min(1, start / totalFrames);
      setCount(Math.floor(progress * end));
      if (start >= totalFrames) clearInterval(counter);
    }, 1000 / 60);
    
    return () => clearInterval(counter);
  }, [value, duration]);
  
  return <>{count}</>;
};

interface MetricCardProps {
  icon: React.ReactNode;
  iconColor: string;
  iconBgColor: string;
  barColor: string;
  title: string;
  value: number;
  percentChange: number;
  percentFilled: number;
  delay: number;
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  iconColor,
  iconBgColor,
  barColor,
  title,
  value,
  percentChange,
  percentFilled,
  delay
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-gradient-to-br from-[var(--background-50)] to-[var(--background-100)] dark:from-[var(--background-800)] dark:to-[var(--background-900)] rounded-xl p-4 border border-[var(--border)] hover:shadow-md transition-all duration-300 group"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex justify-between items-center mb-3">
        <div className={`w-10 h-10 rounded-full ${iconBgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
          >
            {icon}
          </motion.div>
        </div>
        {percentChange > 0 ? (
          <div className="flex items-center gap-1 text-green-500">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs font-medium">+{percentChange}%</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-amber-500">
            <TrendingUp className="h-4 w-4 rotate-180" />
            <span className="text-xs font-medium">{percentChange}%</span>
          </div>
        )}
      </div>
      <h4 className="text-sm text-[var(--text-500)] dark:text-[var(--text-400)] font-medium mb-1">{title}</h4>
      <div className="flex justify-between items-end">
        <span className="text-2xl font-bold text-[var(--text-900)] dark:text-[var(--text-50)]">
          <AnimatedCounter value={value} />
        </span>
      </div>
      <div className="mt-2 h-2 w-full bg-[var(--background-200)] dark:bg-[var(--background-700)] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentFilled}%` }}
          transition={{ duration: 1, delay: delay + 0.5, ease: "easeOut" }}
          className={`h-full ${barColor} rounded-full`}
        />
      </div>
    </motion.div>
  );
};

const AnalyticsCard: React.FC = () => {
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">("month");
  
  // Analytics data for different time periods - in real app this would come from API
  const analyticsData = {
    week: {
      profileViews: { value: 12, percentChange: 20, percentFilled: 45 },
      postImpressions: { value: 8, percentChange: 5, percentFilled: 30 },
      searchAppearances: { value: 1, percentChange: 100, percentFilled: 15 },
    },
    month: {
      profileViews: { value: 29, percentChange: 14, percentFilled: 65 },
      postImpressions: { value: 25, percentChange: 7, percentFilled: 45 },
      searchAppearances: { value: 3, percentChange: 50, percentFilled: 25 },
    },
    year: {
      profileViews: { value: 142, percentChange: 28, percentFilled: 80 },
      postImpressions: { value: 98, percentChange: 12, percentFilled: 60 },
      searchAppearances: { value: 15, percentChange: 200, percentFilled: 40 },
    }
  };

  return (
    <Card className="rounded-xl shadow-sm overflow-hidden border-[var(--border)] transform transition-all duration-300 hover:shadow-md">
      <CardHeader className="bg-gradient-to-r from-[var(--background-50)] to-[var(--background-100)] dark:from-[var(--background-900)] dark:to-[var(--background-800)] pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-[var(--primary-100)] dark:bg-[var(--primary-900/30)] p-1.5 rounded-lg">
              <Activity className="h-5 w-5 text-[var(--primary-500)]" />
            </div>
            <h3 className="font-medium text-lg text-[var(--text-900)] dark:text-[var(--text-50)]">
              Analytics
            </h3>
            <div className="hidden sm:flex items-center gap-1 ml-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-xs text-[var(--text-500)] font-medium">Premium</span>
            </div>
          </div>
          <div className="text-xs rounded-full bg-[var(--primary-100)] text-[var(--primary-700)] dark:bg-[var(--primary-900)] dark:text-[var(--primary-300)] px-3 py-1.5 font-medium">
            {timeframe === "week" ? "Last 7 days" : timeframe === "month" ? "Last 30 days" : "Last year"}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs defaultValue={timeframe} onValueChange={(v) => setTimeframe(v as "week" | "month" | "year")} className="w-full">
          <TabsList className="w-full grid grid-cols-3 rounded-none bg-[var(--background-50)] dark:bg-[var(--background-900)]">
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>

          {["week", "month", "year"].map((period) => (
            <TabsContent key={period} value={period} className="mt-0 p-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Profile Views */}
                <MetricCard
                  icon={<Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                  iconColor="text-blue-600 dark:text-blue-400"
                  iconBgColor="bg-blue-100 dark:bg-blue-900/30"
                  barColor="bg-blue-500"
                  title="Profile Views"
                  value={analyticsData[period as keyof typeof analyticsData].profileViews.value}
                  percentChange={analyticsData[period as keyof typeof analyticsData].profileViews.percentChange}
                  percentFilled={analyticsData[period as keyof typeof analyticsData].profileViews.percentFilled}
                  delay={0.1}
                />

                {/* Post Impressions */}
                <MetricCard
                  icon={<BarChart2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
                  iconColor="text-purple-600 dark:text-purple-400"
                  iconBgColor="bg-purple-100 dark:bg-purple-900/30"
                  barColor="bg-purple-500"
                  title="Post Impressions"
                  value={analyticsData[period as keyof typeof analyticsData].postImpressions.value}
                  percentChange={analyticsData[period as keyof typeof analyticsData].postImpressions.percentChange}
                  percentFilled={analyticsData[period as keyof typeof analyticsData].postImpressions.percentFilled}
                  delay={0.2}
                />

                {/* Search Appearances */}
                <MetricCard
                  icon={<Search className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
                  iconColor="text-amber-600 dark:text-amber-400"
                  iconBgColor="bg-amber-100 dark:bg-amber-900/30"
                  barColor="bg-amber-500"
                  title="Search Appearances"
                  value={analyticsData[period as keyof typeof analyticsData].searchAppearances.value}
                  percentChange={analyticsData[period as keyof typeof analyticsData].searchAppearances.percentChange}
                  percentFilled={analyticsData[period as keyof typeof analyticsData].searchAppearances.percentFilled}
                  delay={0.3}
                />
              </div>

              <div className="flex justify-center mt-6">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-[var(--primary-600)] hover:text-[var(--primary-700)] group"
                >
                  <span>View detailed analytics</span>
                  <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AnalyticsCard;
