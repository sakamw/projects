import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  LabelList,
  Line,
  LineChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  Rectangle,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../components/ui/chart";
import { Separator } from "../../components/ui/separator";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Gauge, Plus, Settings } from "lucide-react";

export default function Analytics() {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 border-r bg-card/30 p-4 md:block">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/" className="text-lg font-semibold">
            Admin
          </Link>
          <Button variant="ghost" size="icon" aria-label="Settings">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
        <nav className="space-y-1">
          <Link
            className="block rounded-md px-3 py-2 hover:bg-accent"
            to="/admin"
          >
            Dashboard
          </Link>
          <Link
            className="block rounded-md px-3 py-2 hover:bg-accent"
            to="/admin/analytics"
          >
            Analytics
          </Link>
          <Link
            className="block rounded-md px-3 py-2 hover:bg-accent"
            to="/reports"
          >
            Reports
          </Link>
          <Link
            className="block rounded-md px-3 py-2 hover:bg-accent"
            to="/users"
          >
            Users
          </Link>
          <Link
            className="block rounded-md px-3 py-2 hover:bg-accent"
            to="/settings"
          >
            Settings
          </Link>
        </nav>
      </aside>

      <div className="flex-1">
        <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center gap-2 p-4">
            <h1 className="mr-auto text-xl font-semibold">Analytics</h1>
            <Button variant="secondary" className="gap-2">
              <Plus className="h-4 w-4" /> New Category
            </Button>
            <Button className="gap-2">
              <Gauge className="h-4 w-4" /> System Health
            </Button>
          </div>
        </header>

        <main className="chart-wrapper mx-auto flex max-w-7xl flex-col flex-wrap items-start justify-center gap-6 p-6 sm:flex-row sm:p-8">
          <div className="grid w-full gap-6 sm:grid-cols-2 lg:max-w-[22rem] lg:grid-cols-1 xl:max-w-[25rem]">
            <Card className="lg:max-w-md">
              <CardHeader className="space-y-0 pb-2">
                <CardDescription>Today</CardDescription>
                <CardTitle className="text-4xl tabular-nums">
                  12,584{" "}
                  <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                    steps
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    steps: {
                      label: "Steps",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[180px]"
                >
                  <BarChart
                    accessibilityLayer
                    margin={{
                      left: -4,
                      right: -4,
                    }}
                    data={[
                      { date: "2024-01-01", steps: 2000 },
                      { date: "2024-01-02", steps: 2100 },
                      { date: "2024-01-03", steps: 2200 },
                      { date: "2024-01-04", steps: 1300 },
                      { date: "2024-01-05", steps: 1400 },
                      { date: "2024-01-06", steps: 2500 },
                      { date: "2024-01-07", steps: 1600 },
                    ]}
                  >
                    <Bar
                      dataKey="steps"
                      fill="var(--color-steps)"
                      radius={5}
                      fillOpacity={0.6}
                      activeBar={<Rectangle fillOpacity={0.8} />}
                    />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={4}
                      interval={0}
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", {
                          weekday: "short",
                        })
                      }
                    />
                    <ChartTooltip
                      cursor={{ fill: "rgba(255,255,255,0.06)" }}
                      content={
                        <ChartTooltipContent
                          labelFormatter={(value) =>
                            new Date(value as string).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )
                          }
                        />
                      }
                    />
                    <ReferenceLine
                      y={1200}
                      stroke="#ffffff"
                      strokeDasharray="5 5"
                      strokeWidth={2}
                      strokeOpacity={0.8}
                    >
                      <Label
                        position="insideBottomLeft"
                        value="Average Steps"
                        offset={10}
                        fill="#ffffff"
                        fontSize={12}
                        fontWeight="normal"
                      />
                      <Label
                        position="insideTopLeft"
                        value="12,343"
                        className="text-sm font-medium"
                        fill="#ffffff"
                        offset={10}
                        startOffset={100}
                        fontSize={12}
                      />
                    </ReferenceLine>
                  </BarChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col items-start gap-1">
                <CardDescription>
                  Over the past 7 days, you have walked{" "}
                  <span className="font-medium text-foreground">53,305</span>{" "}
                  steps.
                </CardDescription>
                <CardDescription>
                  You need{" "}
                  <span className="font-medium text-foreground">12,584</span>{" "}
                  more steps to reach your goal.
                </CardDescription>
              </CardFooter>
            </Card>

            <Card className="flex flex-col lg:max-w-md">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2 [&>div]:flex-1">
                <div>
                  <CardDescription>Resting HR</CardDescription>
                  <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
                    62
                    <span className="text-sm font-normal tracking-normal text-muted-foreground">
                      bpm
                    </span>
                  </CardTitle>
                </div>
                <div>
                  <CardDescription>Variability</CardDescription>
                  <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
                    35
                    <span className="text-sm font-normal tracking-normal text-muted-foreground">
                      ms
                    </span>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 items-center">
                <ChartContainer
                  config={{
                    resting: {
                      label: "Resting",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="w-full h-[180px]"
                >
                  <LineChart
                    accessibilityLayer
                    margin={{ left: 14, right: 14, top: 10 }}
                    data={[
                      { date: "2024-01-01", resting: 62 },
                      { date: "2024-01-02", resting: 72 },
                      { date: "2024-01-03", resting: 35 },
                      { date: "2024-01-04", resting: 62 },
                      { date: "2024-01-05", resting: 52 },
                      { date: "2024-01-06", resting: 62 },
                      { date: "2024-01-07", resting: 70 },
                    ]}
                  >
                    <CartesianGrid
                      strokeDasharray="5 5"
                      vertical={false}
                      stroke="#ffffff"
                      strokeWidth={1}
                      strokeOpacity={0.2}
                    />
                    <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      interval={0}
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", {
                          weekday: "short",
                        })
                      }
                    />
                    <Line
                      dataKey="resting"
                      type="natural"
                      fill="var(--color-resting)"
                      stroke="var(--color-resting)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{
                        fill: "var(--color-resting)",
                        stroke: "var(--color-resting)",
                        r: 4,
                      }}
                    />
                    <ChartTooltip
                      cursor={{
                        stroke: "hsl(var(--muted-foreground))",
                        strokeDasharray: "4 4",
                      }}
                      content={
                        <ChartTooltipContent
                          labelFormatter={(value) =>
                            new Date(value as string).toLocaleDateString(
                              "en-US",
                              { day: "numeric", month: "long", year: "numeric" }
                            )
                          }
                        />
                      }
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid w-full flex-1 gap-6 lg:max-w-[20rem]">
            <Card className="max-w-xs">
              <CardHeader>
                <CardTitle>Progress</CardTitle>
                <CardDescription>
                  You're average more steps a day this year than last year.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid auto-rows-min gap-2">
                  <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                    12,453
                    <span className="text-sm font-normal text-muted-foreground">
                      steps/day
                    </span>
                  </div>
                  <ChartContainer
                    config={{
                      steps: {
                        label: "Steps",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[40px] w-full"
                  >
                    <BarChart
                      accessibilityLayer
                      layout="vertical"
                      margin={{ left: 0, top: 0, right: 0, bottom: 0 }}
                      data={[{ date: "2024", steps: 12435 }]}
                    >
                      <Bar
                        dataKey="steps"
                        fill="var(--color-steps)"
                        radius={4}
                        barSize={32}
                        background={
                          <Rectangle
                            fill="hsl(var(--muted-foreground))"
                            opacity={0.15}
                            radius={4}
                          />
                        }
                      >
                        <LabelList
                          position="insideLeft"
                          dataKey="date"
                          offset={8}
                          fontSize={12}
                          fill="white"
                        />
                      </Bar>
                      <YAxis
                        dataKey="date"
                        type="category"
                        tickCount={1}
                        hide
                      />
                      <XAxis dataKey="steps" type="number" hide />
                    </BarChart>
                  </ChartContainer>
                </div>
                <div className="grid auto-rows-min gap-2">
                  <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                    10,103
                    <span className="text-sm font-normal text-muted-foreground">
                      steps/day
                    </span>
                  </div>
                  <ChartContainer
                    config={{
                      steps: {
                        label: "Steps",
                        color: "hsl(var(--muted))",
                      },
                    }}
                    className="h-[40px] w-full"
                  >
                    <BarChart
                      accessibilityLayer
                      layout="vertical"
                      margin={{ left: 0, top: 0, right: 0, bottom: 0 }}
                      data={[{ date: "2023", steps: 10103 }]}
                    >
                      <Bar
                        dataKey="steps"
                        fill="var(--color-steps)"
                        radius={4}
                        barSize={32}
                        background={
                          <Rectangle
                            fill="hsl(var(--muted-foreground))"
                            opacity={0.15}
                            radius={4}
                          />
                        }
                      >
                        <LabelList
                          position="insideLeft"
                          dataKey="date"
                          offset={8}
                          fontSize={12}
                          fill="white"
                        />
                      </Bar>
                      <YAxis
                        dataKey="date"
                        type="category"
                        tickCount={1}
                        hide
                      />
                      <XAxis dataKey="steps" type="number" hide />
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="max-w-xs">
              <CardHeader className="p-4 pb-0">
                <CardTitle>Walking Distance</CardTitle>
                <CardDescription>
                  Over the last 7 days, your distance walked and run was 12.5
                  miles per day.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-0">
                <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
                  12.5
                  <span className="text-sm font-normal text-muted-foreground">
                    miles/day
                  </span>
                </div>
                <ChartContainer
                  config={{
                    steps: {
                      label: "Steps",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="ml-auto h-[72px] w-[120px]"
                >
                  <BarChart
                    accessibilityLayer
                    margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    data={[
                      { date: "2024-01-01", steps: 2000 },
                      { date: "2024-01-02", steps: 2100 },
                      { date: "2024-01-03", steps: 2200 },
                      { date: "2024-01-04", steps: 1300 },
                      { date: "2024-01-05", steps: 1400 },
                      { date: "2024-01-06", steps: 2500 },
                      { date: "2024-01-07", steps: 1600 },
                    ]}
                  >
                    <Bar
                      dataKey="steps"
                      fill="var(--color-steps)"
                      radius={2}
                      fillOpacity={0.2}
                      activeIndex={6}
                      activeBar={<Rectangle fillOpacity={0.8} />}
                    />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={4}
                      hide
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="max-w-xs">
              <CardContent className="flex gap-4 p-4 pb-2">
                <ChartContainer
                  config={{
                    move: { label: "Move", color: "hsl(var(--chart-1))" },
                    stand: { label: "Stand", color: "hsl(var(--chart-2))" },
                    exercise: {
                      label: "Exercise",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-[140px] w-full"
                >
                  <BarChart
                    margin={{ left: 0, right: 0, top: 0, bottom: 10 }}
                    data={[
                      {
                        activity: "stand",
                        value: (8 / 12) * 100,
                        label: "8/12 hr",
                        fill: "var(--color-stand)",
                      },
                      {
                        activity: "exercise",
                        value: (46 / 60) * 100,
                        label: "46/60 min",
                        fill: "var(--color-exercise)",
                      },
                      {
                        activity: "move",
                        value: (245 / 360) * 100,
                        label: "245/360 kcal",
                        fill: "var(--color-move)",
                      },
                    ]}
                    layout="vertical"
                    barSize={32}
                    barGap={2}
                  >
                    <XAxis type="number" dataKey="value" hide />
                    <YAxis
                      dataKey="activity"
                      type="category"
                      tickLine={false}
                      tickMargin={4}
                      axisLine={false}
                      className="capitalize"
                    />
                    <Bar dataKey="value" radius={5}>
                      <LabelList
                        position="insideLeft"
                        dataKey="label"
                        fill="white"
                        offset={8}
                        fontSize={12}
                      />
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex flex-row border-t p-4">
                <div className="flex w-full items-center gap-2">
                  <div className="grid flex-1 auto-rows-min gap-0.5">
                    <div className="text-xs text-muted-foreground">Move</div>
                    <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                      562
                      <span className="text-sm font-normal text-muted-foreground">
                        kcal
                      </span>
                    </div>
                  </div>
                  <Separator
                    orientation="vertical"
                    className="mx-2 h-10 w-px"
                  />
                  <div className="grid flex-1 auto-rows-min gap-0.5">
                    <div className="text-xs text-muted-foreground">
                      Exercise
                    </div>
                    <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                      73
                      <span className="text-sm font-normal text-muted-foreground">
                        min
                      </span>
                    </div>
                  </div>
                  <Separator
                    orientation="vertical"
                    className="mx-2 h-10 w-px"
                  />
                  <div className="grid flex-1 auto-rows-min gap-0.5">
                    <div className="text-xs text-muted-foreground">Stand</div>
                    <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                      14
                      <span className="text-sm font-normal text-muted-foreground">
                        hr
                      </span>
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>

          <div className="grid w-full flex-1 gap-6">
            <Card className="max-w-xs">
              <CardContent className="flex gap-4 p-4">
                <div className="grid items-center gap-2">
                  <div className="grid flex-1 auto-rows-min gap-0.5">
                    <div className="text-sm text-muted-foreground">Move</div>
                    <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                      562/600
                      <span className="text-sm font-normal text-muted-foreground">
                        kcal
                      </span>
                    </div>
                  </div>
                  <div className="grid flex-1 auto-rows-min gap-0.5">
                    <div className="text-sm text-muted-foreground">
                      Exercise
                    </div>
                    <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                      73/120
                      <span className="text-sm font-normal text-muted-foreground">
                        min
                      </span>
                    </div>
                  </div>
                  <div className="grid flex-1 auto-rows-min gap-0.5">
                    <div className="text-sm text-muted-foreground">Stand</div>
                    <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                      8/12
                      <span className="text-sm font-normal text-muted-foreground">
                        hr
                      </span>
                    </div>
                  </div>
                </div>
                <ChartContainer
                  config={{
                    move: { label: "Move", color: "hsl(var(--chart-1))" },
                    exercise: {
                      label: "Exercise",
                      color: "hsl(var(--chart-2))",
                    },
                    stand: { label: "Stand", color: "hsl(var(--chart-3))" },
                  }}
                  className="mx-auto aspect-square w-full max-w-[80%]"
                >
                  <RadialBarChart
                    margin={{ left: -10, right: -10, top: -10, bottom: -10 }}
                    data={[
                      {
                        activity: "stand",
                        value: (8 / 12) * 100,
                        fill: "var(--color-stand)",
                      },
                      {
                        activity: "exercise",
                        value: (46 / 60) * 100,
                        fill: "var(--color-exercise)",
                      },
                      {
                        activity: "move",
                        value: (245 / 360) * 100,
                        fill: "var(--color-move)",
                      },
                    ]}
                    innerRadius="20%"
                    barSize={24}
                    startAngle={90}
                    endAngle={450}
                  >
                    <PolarAngleAxis
                      type="number"
                      domain={[0, 100]}
                      dataKey="value"
                      tick={false}
                    />
                    <RadialBar dataKey="value" background cornerRadius={5} />
                  </RadialBarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="max-w-xs">
              <CardHeader className="p-4 pb-0">
                <CardTitle>Active Energy</CardTitle>
                <CardDescription>
                  You're burning an average of 754 calories per day. Good job!
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-2">
                <div className="flex items-baseline gap-2 text-3xl font-bold tabular-nums leading-none">
                  1,254
                  <span className="text-sm font-normal text-muted-foreground">
                    kcal/day
                  </span>
                </div>
                <ChartContainer
                  config={{
                    calories: {
                      label: "Calories",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="ml-auto h-[72px] w-[120px]"
                >
                  <BarChart
                    accessibilityLayer
                    margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    data={[
                      { date: "2024-01-01", calories: 354 },
                      { date: "2024-01-02", calories: 514 },
                      { date: "2024-01-03", calories: 345 },
                      { date: "2024-01-04", calories: 734 },
                      { date: "2024-01-05", calories: 645 },
                      { date: "2024-01-06", calories: 456 },
                      { date: "2024-01-07", calories: 345 },
                    ]}
                  >
                    <Bar
                      dataKey="calories"
                      fill="var(--color-calories)"
                      radius={2}
                      fillOpacity={0.2}
                      activeIndex={6}
                      activeBar={<Rectangle fillOpacity={0.8} />}
                    />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={4}
                      hide
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="max-w-xs">
              <CardHeader className="space-y-0 pb-0">
                <CardDescription>Time in Bed</CardDescription>
                <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
                  8
                  <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                    hr
                  </span>
                  35
                  <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                    min
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ChartContainer
                  config={{
                    time: { label: "Time", color: "hsl(var(--chart-2))" },
                  }}
                  className="h-[140px]"
                >
                  <AreaChart
                    accessibilityLayer
                    data={[
                      { date: "2024-01-01", time: 8.5 },
                      { date: "2024-01-02", time: 7.2 },
                      { date: "2024-01-03", time: 8.1 },
                      { date: "2024-01-04", time: 6.2 },
                      { date: "2024-01-05", time: 5.2 },
                      { date: "2024-01-06", time: 8.1 },
                      { date: "2024-01-07", time: 7.0 },
                    ]}
                    margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  >
                    <XAxis dataKey="date" hide />
                    <YAxis domain={["dataMin - 5", "dataMax + 2"]} hide />
                    <defs>
                      <linearGradient id="fillTime" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="var(--color-time)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-time)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      dataKey="time"
                      type="natural"
                      fill="url(#fillTime)"
                      fillOpacity={0.4}
                      stroke="var(--color-time)"
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
