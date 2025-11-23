import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Icon from "@/components/ui/icon";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type EventType = "hit" | "miss" | "resolver_change" | "jitter_detected" | "breaker_detected";

interface ResolverEvent {
  id: string;
  timestamp: number;
  type: EventType;
  player: string;
  details: string;
  angle?: number;
  side?: number;
}

interface PlayerStats {
  name: string;
  hits: number;
  misses: number;
  resolveType: string;
  angle: number;
  isJitter: boolean;
  isBreaker: boolean;
  resolved: boolean;
}

const Index = () => {
  const [events, setEvents] = useState<ResolverEvent[]>([]);
  const [stats, setStats] = useState({
    totalShots: 0,
    hits: 0,
    misses: 0,
    accuracy: 0,
  });
  const [players, setPlayers] = useState<PlayerStats[]>([]);
  const [accuracyHistory, setAccuracyHistory] = useState<Array<{ time: string; accuracy: number }>>([]);

  useEffect(() => {
    const mockPlayers: PlayerStats[] = [
      {
        name: "Enemy_01",
        hits: 12,
        misses: 3,
        resolveType: "ANIM",
        angle: 58,
        isJitter: true,
        isBreaker: false,
        resolved: true,
      },
      {
        name: "Enemy_02",
        hits: 8,
        misses: 7,
        resolveType: "BRUTE",
        angle: 35,
        isJitter: false,
        isBreaker: true,
        resolved: false,
      },
      {
        name: "Enemy_03",
        hits: 15,
        misses: 2,
        resolveType: "ANIM",
        angle: 43,
        isJitter: true,
        isBreaker: false,
        resolved: true,
      },
    ];
    setPlayers(mockPlayers);

    const mockEvents: ResolverEvent[] = [
      {
        id: "1",
        timestamp: Date.now() - 5000,
        type: "hit",
        player: "Enemy_01",
        details: "Head shot • 58° angle • ANIM resolve",
        angle: 58,
      },
      {
        id: "2",
        timestamp: Date.now() - 4500,
        type: "jitter_detected",
        player: "Enemy_02",
        details: "Jitter detected • Stored side: +",
      },
      {
        id: "3",
        timestamp: Date.now() - 3800,
        type: "miss",
        player: "Enemy_02",
        details: "Miss resolver • Switching to BRUTE mode",
      },
      {
        id: "4",
        timestamp: Date.now() - 3000,
        type: "hit",
        player: "Enemy_03",
        details: "Body shot • 43° angle • ANIM resolve",
        angle: 43,
      },
      {
        id: "5",
        timestamp: Date.now() - 2200,
        type: "breaker_detected",
        player: "Enemy_01",
        details: "Pitch breaker detected • Safe point ON",
      },
    ];
    setEvents(mockEvents);

    const totalShots = mockPlayers.reduce((sum, p) => sum + p.hits + p.misses, 0);
    const totalHits = mockPlayers.reduce((sum, p) => sum + p.hits, 0);
    const totalMisses = mockPlayers.reduce((sum, p) => sum + p.misses, 0);

    setStats({
      totalShots,
      hits: totalHits,
      misses: totalMisses,
      accuracy: totalShots > 0 ? Math.round((totalHits / totalShots) * 100) : 0,
    });

    const mockHistory = [
      { time: "00:00", accuracy: 65 },
      { time: "00:30", accuracy: 72 },
      { time: "01:00", accuracy: 68 },
      { time: "01:30", accuracy: 78 },
      { time: "02:00", accuracy: 75 },
      { time: "02:30", accuracy: 82 },
      { time: "03:00", accuracy: 79 },
    ];
    setAccuracyHistory(mockHistory);
  }, []);

  const eventIcons: Record<EventType, string> = {
    hit: "Target",
    miss: "X",
    resolver_change: "ArrowLeftRight",
    jitter_detected: "Waves",
    breaker_detected: "Zap",
  };

  const eventColors: Record<EventType, string> = {
    hit: "bg-secondary text-secondary-foreground",
    miss: "bg-destructive text-destructive-foreground",
    resolver_change: "bg-accent text-accent-foreground",
    jitter_detected: "bg-primary text-primary-foreground",
    breaker_detected: "bg-destructive text-destructive-foreground",
  };

  const resolveTypeData = [
    { name: "ANIM", value: 60, color: "hsl(var(--primary))" },
    { name: "BRUTE", value: 30, color: "hsl(var(--secondary))" },
    { name: "GAME", value: 10, color: "hsl(var(--muted))" },
  ];

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = Math.floor((now - timestamp) / 1000);
    if (diff < 60) return `${diff}s ago`;
    return `${Math.floor(diff / 60)}m ago`;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-primary neon-glow">
              RESOLVER SYSTEM
            </h1>
            <p className="text-muted-foreground mt-1">Real-time anti-aim monitoring</p>
          </div>
          <Badge className="text-lg px-4 py-2 neon-glow animate-pulse" variant="outline">
            <Icon name="Activity" className="mr-2" size={20} />
            ACTIVE
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-slide-up">
          <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Shots</p>
                <p className="text-3xl font-bold text-primary">{stats.totalShots}</p>
              </div>
              <Icon name="Crosshair" className="text-primary" size={32} />
            </div>
          </Card>

          <Card className="p-6 border-secondary/20 bg-card/50 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hits</p>
                <p className="text-3xl font-bold text-secondary">{stats.hits}</p>
              </div>
              <Icon name="Target" className="text-secondary" size={32} />
            </div>
          </Card>

          <Card className="p-6 border-destructive/20 bg-card/50 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Misses</p>
                <p className="text-3xl font-bold text-destructive">{stats.misses}</p>
              </div>
              <Icon name="X" className="text-destructive" size={32} />
            </div>
          </Card>

          <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur neon-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Accuracy</p>
                <p className="text-3xl font-bold text-primary">{stats.accuracy}%</p>
              </div>
              <Icon name="TrendingUp" className="text-primary" size={32} />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6 border-primary/20 bg-card/50 backdrop-blur animate-fade-in">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Icon name="Activity" className="mr-2 text-primary" />
              Accuracy Over Time
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={accuracyHistory}>
                <defs>
                  <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="accuracy"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorAccuracy)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur animate-fade-in">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Icon name="PieChart" className="mr-2 text-primary" />
              Resolve Types
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={resolveTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {resolveTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {resolveTypeData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold">{item.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur animate-fade-in">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Icon name="Clock" className="mr-2 text-primary" />
              Event Timeline
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 border border-border/50 hover:border-primary/50 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${eventColors[event.type]} neon-glow-blue`}>
                    <Icon name={eventIcons[event.type]} size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm">{event.player}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(event.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{event.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur animate-fade-in">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Icon name="Users" className="mr-2 text-primary" />
              Player Statistics
            </h2>
            <div className="space-y-4">
              {players.map((player) => (
                <div
                  key={player.name}
                  className="p-4 rounded-lg bg-muted/20 border border-border/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-bold">{player.name}</span>
                      <Badge
                        variant={player.resolved ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {player.resolved ? "RESOLVED" : "RESOLVING"}
                      </Badge>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {player.resolveType}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    {player.isJitter && (
                      <Badge className="bg-primary/20 text-primary border-primary/50">
                        <Icon name="Waves" size={12} className="mr-1" />
                        JITTER
                      </Badge>
                    )}
                    {player.isBreaker && (
                      <Badge className="bg-destructive/20 text-destructive border-destructive/50">
                        <Icon name="Zap" size={12} className="mr-1" />
                        BREAKER
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Angle</p>
                      <p className="font-bold text-primary">{player.angle}°</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Hits</p>
                      <p className="font-bold text-secondary">{player.hits}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Misses</p>
                      <p className="font-bold text-destructive">{player.misses}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Accuracy</span>
                      <span className="font-bold">
                        {Math.round((player.hits / (player.hits + player.misses)) * 100)}%
                      </span>
                    </div>
                    <Progress
                      value={(player.hits / (player.hits + player.misses)) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
