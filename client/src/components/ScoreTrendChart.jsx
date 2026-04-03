import {
    AreaChart,
    Area,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            /* Glassmorphism Tooltip */
            <div className="bg-[#1e293b]/80 backdrop-blur-md p-4 border border-white/10 rounded-2xl shadow-2xl">
                <p className="font-bold text-white mb-1">
                    {data.interviewName}
                </p>
                <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400 font-medium">{data.date}</span>
                    <span className="h-1 w-1 bg-slate-600 rounded-full"></span>
                    <p className="text-sm font-black text-cyan-400">
                        Score: {data.score}%
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

export default function ScoreTrendChart({ chartData }) {
    return (
        /* Dark Glass Container */
        <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-8 mb-8 shadow-2xl transition-all duration-700">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                        Performance Trend
                    </h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Growth progression analytics</p>
                </div>
                
                <div className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-[10px] font-black text-cyan-400 uppercase tracking-widest">
                    Real-time Data
                </div>
            </div>

            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                        {/* Gradient definition for the "Liquid" fill */}
                        <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid 
                            strokeDasharray="3 3" 
                            stroke="#ffffff05" 
                            vertical={false} 
                        />
                        
                        <YAxis
                            domain={[0, 100]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: "#475569", fontWeight: 700 }}
                        />
                        
                        <Tooltip 
                            content={<CustomTooltip />} 
                            cursor={{ stroke: '#22d3ee', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />

                        <Area
                            type="monotone"
                            dataKey="score"
                            stroke="#22d3ee"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorScore)"
                            /* THE ANIMATION SETTINGS */
                            isAnimationActive={true}
                            animationDuration={2500}
                            animationEasing="ease-in-out"
                            /* Glowing Dot Settings */
                            activeDot={{
                                r: 6,
                                stroke: "#22d3ee",
                                strokeWidth: 4,
                                fill: "#020617",
                                className: "animate-pulse"
                            }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}