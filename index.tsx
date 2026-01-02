
import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Bell, 
  Activity, 
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  Clock,
  BarChart2,
  PieChart as PieIcon,
  Filter,
  Trash2,
  FileSpreadsheet,
  RefreshCw,
  Megaphone,
  Calendar,
  ArrowUpDown,
  Square,
  CheckSquare,
  BarChart3,
  ShieldAlert,
  ListTodo,
  FileText,
  Settings
} from 'lucide-react';

// --- 类型定义 ---

type TabType = '店铺统计' | '数据统计' | '天梯榜' | '负责人看板' | '派单员数据分析' | '客服录单轨迹' | '派单员录单轨迹';

// --- “网页1” 源代码 (用于 iframe srcdoc) ---
// 注意：已移除顶部的系统公告栏
const PAGE_1_HTML = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>12.16更新—派单员数据分析专业版</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Babel Standalone for JSX compilation -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        body { font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif; }
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #f1f5f9;
        }
        ::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
        }
    </style>
    <script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@18.3.1",
    "react-dom": "https://esm.sh/react-dom@18.3.1",
    "react-dom/client": "https://esm.sh/react-dom@18.3.1/client",
    "recharts": "https://esm.sh/recharts@2.13.0?external=react,react-dom",
    "lucide-react": "https://esm.sh/lucide-react@0.460.0?external=react",
    "react/": "https://esm.sh/react@^19.2.3/",
    "vite": "https://esm.sh/vite@^7.3.0",
    "@vitejs/plugin-react": "https://esm.sh/@vitejs/plugin-react@^5.1.2"
  }
}
</script>
</head>
<body class="bg-slate-50">
    <div id="root"></div>

    <script type="text/babel" data-type="module">
        import React, { useState, useMemo, useEffect } from 'react';
        import ReactDOM from 'react-dom/client';
        import { 
            BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
        } from 'recharts';
        import { 
            Bell, Search, Activity, BarChart2, Briefcase, Calendar, 
            Clock, CalendarDays, X, ArrowUp, ArrowDown, Minus, 
            ArrowUpDown, CheckSquare, Square
        } from 'lucide-react';

        // --- Mock Data & Constants ---
        const PROJECT_CATEGORIES = ['全部', '家庭维修', '家电安装', '日常保养', '紧急管道维修', '暖通空调'];
        const NAMES = ['张伟', '李强', '王芳', '赵敏', '刘洋', '陈杰', '杨光', '黄婷', '吴刚', '孙丽'];
        
        const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
        
        const generateMockData = () => {
            const data = [];
            const now = new Date();
            NAMES.forEach((name, index) => {
                const baseSuccess = getRandomInt(60, 90);
                const baseDispatch = getRandomInt(70, 95);
                PROJECT_CATEGORIES.slice(1).forEach(cat => {
                    const itemDate = new Date(now);
                    itemDate.setDate(now.getDate() - getRandomInt(0, 7));
                    itemDate.setHours(getRandomInt(8, 20));
                    itemDate.setMinutes(getRandomInt(0, 59));
                    data.push({
                        id: \`\${index}-\${cat}-\${itemDate.getTime()}\`,
                        name: name,
                        successRate: Math.min(100, Math.max(0, baseSuccess + getRandomInt(-10, 10))),
                        dispatchRate: Math.min(100, Math.max(0, baseDispatch + getRandomInt(-10, 10))),
                        avgRevenue: getRandomInt(150, 500),
                        dispatch30MinRate: getRandomInt(50, 95),
                        totalOrders: getRandomInt(20, 150),
                        avgResponseTime: getRandomInt(5, 45),
                        projectCategory: cat,
                        date: itemDate.toISOString()
                    });
                });
            });
            return data;
        };

        const INITIAL_DATA = generateMockData();

        // --- Components ---

        const MetricChart = ({ title, data, dataKey, color, unit = '', yDomain }) => (
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-5 rounded-full" style={{ backgroundColor: color }}></div>
                    <h3 className="text-sm font-bold text-slate-700">{title}</h3>
                </div>
                <div className="h-48 flex-grow">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={Math.max(20, 100 / (data.length || 1))}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} interval={0} axisLine={{ stroke: '#e2e8f0' }} />
                            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} domain={yDomain || [0, 'auto']} tickFormatter={(value) => \`\${value}\${unit.replace('¥', '')}\`} />
                            <Tooltip 
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} 
                                formatter={(value) => [\`\${unit}\${value}\`, title]}
                            />
                            <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} animationDuration={800} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );

        const ComparisonRow = ({ label, current, previous, type }) => {
            const diff = current - previous;
            let ratio = previous !== 0 ? ((current - previous) / previous) * 100 : 0;
            const isUp = diff > 0;
            const isDown = diff < 0;
            const isNeutral = diff === 0;
            
            const textColor = isUp ? 'text-red-600' : isDown ? 'text-green-600' : 'text-slate-400';
            const bgColor = isUp ? 'bg-red-50' : isDown ? 'bg-green-50' : 'bg-slate-100';
            const Icon = isUp ? ArrowUp : isDown ? ArrowDown : Minus;

            let diffDisplay = isNeutral ? '-' : type === 'percent' ? \`\${isUp ? '+' : ''}\${diff.toFixed(1)}%\` : \`\${isUp ? '+' : ''}\${Math.floor(diff)}\`;

            return (
                <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="py-3 pl-3 text-sm font-medium text-slate-600">{label}</td>
                    <td className="py-3 text-right text-sm text-slate-500 font-mono">{type === 'percent' ? previous + '%' : type === 'currency' ? '¥' + previous : previous}</td>
                    <td className="py-3 text-right text-sm text-slate-800 font-bold font-mono">{type === 'percent' ? current + '%' : type === 'currency' ? '¥' + current : current}</td>
                    <td className={\`py-3 text-right text-sm font-medium font-mono \${textColor}\`}>{diffDisplay}</td>
                    <td className="py-3 pr-3 text-right">
                        <div className={\`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold justify-end min-w-[70px] \${bgColor} \${textColor}\`}>
                            {!isNeutral && <Icon className="h-3 w-3" strokeWidth={3} />}
                            {isNeutral ? '0.0%' : \`\${Math.abs(ratio).toFixed(1)}%\`}
                        </div>
                    </td>
                </tr>
            );
        };

        const TimeFrameCard = ({ title, icon: Icon, stats, labels, colorClass }) => (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-2">
                        <div className={\`p-1.5 \${colorClass} bg-opacity-10 rounded-md\`}>
                            <Icon className={\`h-4 w-4 \${colorClass.replace('bg-', 'text-')}\`} />
                        </div>
                        <h3 className="font-bold text-slate-700 text-sm">{title}</h3>
                    </div>
                </div>
                <div className="p-2">
                    <table className="w-full">
                        <thead>
                            <tr className="text-xs text-slate-400 uppercase tracking-wider">
                                <th className="pb-2 pl-3 text-left font-normal w-1/4">指标</th>
                                <th className="pb-2 text-right font-normal w-1/6">{labels.prev}</th>
                                <th className="pb-2 text-right font-normal w-1/6">{labels.curr}</th>
                                <th className="pb-2 text-right font-normal w-1/6">差值</th>
                                <th className="pb-2 pr-3 text-right font-normal w-1/4">环比</th>
                            </tr>
                        </thead>
                        <tbody>
                            <ComparisonRow label="成单率" current={stats.successRate} previous={Math.max(0, Math.min(100, stats.successRate + getRandomInt(-5, 5)))} type="percent" />
                            <ComparisonRow label="派单率" current={stats.dispatchRate} previous={Math.max(0, Math.min(100, stats.dispatchRate + getRandomInt(-5, 5)))} type="percent" />
                            <ComparisonRow label="业绩" current={stats.avgRevenue} previous={Math.max(0, stats.avgRevenue + getRandomInt(-50, 50))} type="currency" />
                        </tbody>
                    </table>
                </div>
            </div>
        );

        // --- Main App ---

        const App = () => {
            const [data] = useState(INITIAL_DATA);
            const [showFilters, setShowFilters] = useState(false);
            const [selectedIds, setSelectedIds] = useState(new Set());
            const [sortField, setSortField] = useState('successRate');
            const [sortDirection, setSortDirection] = useState('desc');

            const getLocalISO = (d) => {
                const off = d.getTimezoneOffset() * 60000;
                return (new Date(d.getTime() - off)).toISOString().slice(0, 16);
            };

            const [filters, setFilters] = useState({
                startDate: getLocalISO(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
                endDate: getLocalISO(new Date()),
                projectCategory: '全部',
                searchQuery: ''
            });

            const filteredData = useMemo(() => {
                return data.filter(item => {
                    if (filters.projectCategory !== '全部' && item.projectCategory !== filters.projectCategory) return false;
                    if (filters.searchQuery && !item.name.toLowerCase().includes(filters.searchQuery.toLowerCase())) return false;
                    if (filters.startDate && filters.endDate) {
                        const itemDate = new Date(item.date);
                        if (itemDate < new Date(filters.startDate) || itemDate > new Date(filters.endDate)) return false;
                    }
                    return true;
                });
            }, [data, filters]);

            const sortedData = useMemo(() => {
                return [...filteredData].sort((a, b) => {
                    const aV = a[sortField], bV = b[sortField];
                    if (aV < bV) return sortDirection === 'asc' ? -1 : 1;
                    if (aV > bV) return sortDirection === 'asc' ? 1 : -1;
                    return 0;
                });
            }, [filteredData, sortField, sortDirection]);

            const selectedData = useMemo(() => data.filter(item => selectedIds.has(item.id)), [data, selectedIds]);

            const metrics = useMemo(() => {
                if (filteredData.length === 0) return null;
                const totalOrders = filteredData.reduce((a, c) => a + c.totalOrders, 0);
                const avg = (key) => (filteredData.reduce((a, c) => a + c[key], 0) / filteredData.length).toFixed(1);
                return { totalOrders, avgSuccess: avg('successRate'), avgDispatch: avg('dispatchRate'), avgRevenue: avg('avgRevenue'), avg30Min: avg('dispatch30MinRate'), avgResponse: avg('avgResponseTime') };
            }, [filteredData]);

            const handleToggleSelect = (id) => {
                const n = new Set(selectedIds);
                n.has(id) ? n.delete(id) : n.add(id);
                setSelectedIds(n);
            };

            const handleSort = (field) => {
                if (sortField === field) {
                    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                } else {
                    setSortField(field);
                    setSortDirection('desc');
                }
            };

            const SortIcon = ({ field }) => {
                if (sortField !== field) return <ArrowUpDown className="h-3 w-3 text-slate-300 ml-1 inline-block" />;
                return <ArrowUpDown className={\`h-3 w-3 text-blue-500 ml-1 inline-block transform \${sortDirection === 'desc' ? 'rotate-180' : ''}\`} />;
            };

            return (
                <div className="min-h-screen bg-slate-50 pb-20">
                    <main className="w-full px-3 py-6">
                        {/* Data Overview Bar */}
                        <div className="bg-[#F0F8FF] rounded-xl border border-blue-100 h-[60px] mb-6 flex items-center justify-between px-4 shadow-sm">
                            <div className="flex items-center gap-2 min-w-max mr-4">
                                <Activity className="h-5 w-5 text-blue-600" />
                                <h2 className="text-[18px] font-[700] text-slate-800">数据概览</h2>
                            </div>
                            
                            {metrics && (
                                <div className="flex flex-1 items-center justify-around px-2">
                                    {[
                                        { l: '成单率', v: metrics.avgSuccess + '%', c: 'text-slate-800' },
                                        { l: '派单率', v: metrics.avgDispatch + '%', c: 'text-blue-600' },
                                        { l: '每单业绩', v: '¥' + metrics.avgRevenue, c: 'text-orange-600' },
                                        { l: '30分派单率', v: metrics.avg30Min + '%', c: 'text-green-600' },
                                        { l: '当日总单量', v: metrics.totalOrders, c: 'text-slate-800' },
                                        { l: '平均响应', v: metrics.avgResponse + '分', c: 'text-purple-600' }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-2 whitespace-nowrap">
                                            <span className="text-[12px] font-[400] text-[#5A5E66]">{item.l}:</span>
                                            <span className={\`text-[16px] font-[700] \${item.c}\`}>{item.v}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button onClick={() => setShowFilters(!showFilters)} className={\`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors min-w-max ml-4 \${showFilters ? 'bg-blue-200 text-blue-800' : 'bg-[#D9ECFF] text-blue-700 hover:bg-[#C5E2FF]'}\`}>
                                <Search className="h-4 w-4" />点这高级筛选
                            </button>
                        </div>

                        {showFilters && (
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between animate-in slide-in-from-top-2">
                                <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
                                    <div className="relative w-full md:w-auto">
                                        <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <select value={filters.projectCategory} onChange={(e) => setFilters({...filters, projectCategory: e.target.value})} className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 min-w-[160px] outline-none">
                                            {PROJECT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input type="datetime-local" value={filters.startDate} onChange={(e) => setFilters({...filters, startDate: e.target.value})} className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none" />
                                        <span className="text-slate-400">至</span>
                                        <input type="datetime-local" value={filters.endDate} onChange={(e) => setFilters({...filters, endDate: e.target.value})} className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none" />
                                    </div>
                                </div>
                                <div className="relative w-full lg:w-64">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <input type="text" placeholder="搜索姓名..." value={filters.searchQuery} onChange={(e) => setFilters({...filters, searchQuery: e.target.value})} className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none" />
                                </div>
                            </div>
                        )}

                        {selectedIds.size === 1 && (
                            <div className="mb-8 p-4 bg-white rounded-xl border border-slate-200 relative animate-in slide-in-from-top-4">
                                <button onClick={() => setSelectedIds(new Set())} className="absolute right-4 top-4 text-slate-400 p-1 hover:bg-slate-100 rounded-full"><X className="h-5 w-5"/></button>
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded">深度分析</span>
                                    {selectedData[0].name}
                                    <span className="text-slate-400 font-normal text-sm"> | {selectedData[0].projectCategory}</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <TimeFrameCard title="日环比数据" icon={Clock} stats={selectedData[0]} labels={{prev:'昨日', curr:'今日'}} colorClass="bg-blue-600 text-blue-600" />
                                    <TimeFrameCard title="周环比数据" icon={CalendarDays} stats={selectedData[0]} labels={{prev:'上周', curr:'本周'}} colorClass="bg-purple-600 text-purple-600" />
                                    <TimeFrameCard title="月环比数据" icon={Calendar} stats={selectedData[0]} labels={{prev:'上月', curr:'本月'}} colorClass="bg-orange-600 text-orange-600" />
                                </div>
                            </div>
                        )}

                        {selectedIds.size > 1 && (
                            <div className="mb-8 animate-in slide-in-from-top-4">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-2">
                                        <BarChart2 className="h-5 w-5 text-blue-600"/>
                                        <h3 className="text-lg font-bold text-slate-800">对比分析</h3>
                                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">已选 {selectedIds.size} 人</span>
                                    </div>
                                    <button onClick={() => setSelectedIds(new Set())} className="text-sm text-slate-500 hover:text-red-500 underline transition-colors">清空选择</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <MetricChart title="成单率对比" data={selectedData} dataKey="successRate" color="#3b82f6" unit="%" yDomain={[0,100]} />
                                    <MetricChart title="派单率对比" data={selectedData} dataKey="dispatchRate" color="#10b981" unit="%" yDomain={[0,100]} />
                                    <MetricChart title="每单业绩对比" data={selectedData} dataKey="avgRevenue" color="#f59e0b" unit="¥" />
                                    <MetricChart title="总单量对比" data={selectedData} dataKey="totalOrders" color="#6366f1" unit="" />
                                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-5 flex flex-col justify-center items-center text-center">
                                        <p className="text-slate-400 text-sm font-medium">共对比 {selectedIds.size} 位成员</p>
                                        <p className="text-slate-400 text-xs mt-1">数据基于所选时间范围</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left whitespace-nowrap">
                                    <thead className="bg-slate-50 border-b text-slate-500">
                                        <tr>
                                            <th className="px-6 py-4 w-12 text-center">
                                                <button onClick={() => setSelectedIds(selectedIds.size === sortedData.length ? new Set() : new Set(sortedData.map(d=>d.id)))}>
                                                    {selectedIds.size === sortedData.length ? <CheckSquare className="h-5 w-5 text-blue-600"/> : <Square className="h-5 w-5 text-slate-300"/>}
                                                </button>
                                            </th>
                                            <th className="px-6 py-4 cursor-pointer hover:bg-slate-100" onClick={()=>handleSort('name')}>
                                                <div className="flex items-center">姓名<SortIcon field="name"/></div>
                                            </th>
                                            <th className="px-6 py-4 text-right cursor-pointer hover:bg-slate-100" onClick={()=>handleSort('successRate')}>
                                                <div className="flex items-center justify-end">成单率<SortIcon field="successRate"/></div>
                                            </th>
                                            <th className="px-6 py-4 text-right cursor-pointer hover:bg-slate-100" onClick={()=>handleSort('dispatchRate')}>
                                                <div className="flex items-center justify-end">派单率<SortIcon field="dispatchRate"/></div>
                                            </th>
                                            <th className="px-6 py-4 text-right cursor-pointer hover:bg-slate-100" onClick={()=>handleSort('avgRevenue')}>
                                                <div className="flex items-center justify-end">每单业绩<SortIcon field="avgRevenue"/></div>
                                            </th>
                                            <th className="px-6 py-4 text-right cursor-pointer hover:bg-slate-100" onClick={()=>handleSort('dispatch30MinRate')}>
                                                <div className="flex items-center justify-end">30分钟派单率<SortIcon field="dispatch30MinRate"/></div>
                                            </th>
                                            <th className="px-6 py-4 text-right cursor-pointer hover:bg-slate-100" onClick={()=>handleSort('avgResponseTime')}>
                                                <div className="flex items-center justify-end">平均响应时间<SortIcon field="avgResponseTime"/></div>
                                            </th>
                                            <th className="px-6 py-4 text-right cursor-pointer hover:bg-slate-100" onClick={()=>handleSort('totalOrders')}>
                                                <div className="flex items-center justify-end">总单量<SortIcon field="totalOrders"/></div>
                                            </th>
                                            <th className="px-6 py-4 text-center">维修项目</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {sortedData.length === 0 ? (
                                            <tr><td colSpan={9} className="px-6 py-12 text-center text-slate-400">未找到符合条件的记录</td></tr>
                                        ) : sortedData.map(row => (
                                            <tr key={row.id} className={\`hover:bg-blue-50/20 transition-colors \${selectedIds.has(row.id) ? 'bg-blue-50/50' : ''}\`}>
                                                <td className="px-6 py-4 text-center">
                                                    <button onClick={() => handleToggleSelect(row.id)}>
                                                        {selectedIds.has(row.id) ? <CheckSquare className="h-5 w-5 text-blue-600"/> : <Square className="h-5 w-5 text-slate-300"/>}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 font-medium">
                                                    <div className="flex items-center">
                                                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mr-3">{row.name.charAt(0)}</div>
                                                        <span className="text-slate-700">{row.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right font-medium text-slate-600">{row.successRate}%</td>
                                                <td className="px-6 py-4 text-right font-medium text-slate-600">{row.dispatchRate}%</td>
                                                <td className="px-6 py-4 text-right font-medium text-slate-600">¥{row.avgRevenue}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className={\`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium \${row.dispatch30MinRate >= 80 ? 'bg-green-100 text-green-800' : row.dispatch30MinRate >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}\`}>
                                                        {row.dispatch30MinRate}%
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right font-medium text-slate-600">{row.avgResponseTime}分钟</td>
                                                <td className="px-6 py-4 text-right font-medium text-slate-700">{row.totalOrders}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-block px-2 py-1 text-xs text-slate-500 bg-slate-100 rounded-md">{row.projectCategory}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
                                <span>显示 {sortedData.length} 条记录</span>
                                <span>已选择 {selectedIds.size} 项</span>
                            </div>
                        </div>
                    </main>
                </div>
            );
        };

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>
`;

// --- 子组件：通知栏 (视觉风格：白色背景 + 蓝色标签) ---
const NotificationBar = () => (
  <div className="flex items-center gap-4 mb-3 px-4 h-11 bg-white rounded-lg shadow-sm overflow-hidden shrink-0 relative border border-slate-100">
     <div className="flex items-center gap-2 bg-[#1890ff] text-white px-3 py-1 rounded text-[11px] font-bold shrink-0 font-sans">
      <span>主要公告</span>
      <Bell size={12} fill="white" />
    </div>
    <div className="flex-1 overflow-hidden relative flex items-center">
      <div className="whitespace-nowrap flex items-center gap-6 text-[12px] text-slate-600 font-sans">
        <span className="font-bold">!</span>
        <span>关于 2025 年度秋季职级晋升评审的通知：点击下方详情以阅读完整公告内容。请所有相关人员务必在截止日期前完成确认。</span>
      </div>
    </div>
    <div className="shrink-0 bg-slate-100 px-3 py-0.5 rounded-full text-[11px] text-slate-500 font-mono">
        2025-11-19
    </div>
  </div>
);

// --- 子组件：标签切换 (视觉风格：多彩小方框) ---
const TabSelector = ({ activeTab, onSelect }: { activeTab: TabType, onSelect: (t: TabType) => void }) => {
  const tabs = [
    { name: '店铺统计', color: 'red', icon: ShieldAlert, borderColor: 'border-red-200', textColor: 'text-red-600', iconBg: 'bg-red-500' },
    { name: '数据统计', color: 'orange', icon: Bell, borderColor: 'border-orange-200', textColor: 'text-orange-600', iconBg: 'bg-orange-400' },
    { name: '天梯榜', color: 'blue', icon: Settings, borderColor: 'border-blue-200', textColor: 'text-blue-600', iconBg: 'bg-blue-500' },
    { name: '负责人看板', color: 'green', icon: ListTodo, borderColor: 'border-green-200', textColor: 'text-green-600', iconBg: 'bg-green-500' },
    { name: '派单员数据分析', color: 'teal', icon: FileText, borderColor: 'border-teal-200', textColor: 'text-teal-600', iconBg: 'bg-teal-500' },
    { name: '客服录单轨迹', color: 'purple', icon: Megaphone, borderColor: 'border-purple-200', textColor: 'text-purple-600', iconBg: 'bg-purple-500' },
    { name: '派单员录单轨迹', color: 'indigo', icon: FileSpreadsheet, borderColor: 'border-indigo-200', textColor: 'text-indigo-600', iconBg: 'bg-indigo-500' }
  ];

  return (
    <div className="grid grid-cols-7 gap-3 mb-3">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;
        const Icon = tab.icon;
        return (
          <button
            key={tab.name}
            onClick={() => onSelect(tab.name as TabType)}
            className={`h-11 border rounded-xl text-[13px] font-bold transition-all duration-200 flex items-center justify-center gap-2 px-1 text-center shadow-sm hover:shadow-md cursor-pointer font-sans bg-white ${tab.borderColor}
              ${isActive ? 'ring-2 ring-offset-1 ring-blue-100 scale-105 shadow-md z-10' : ''}`}
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${tab.iconBg}`}>
                <Icon size={12} className="text-white" />
            </div>
            <span className={tab.textColor}>{tab.name}</span>
          </button>
        );
      })}
    </div>
  );
};

// --- 各板块具体内容组件 ---

const StoreStats = () => {
  const widgets = ["咨询转化率", "每单成本", "响应时间", "客户满意度", "投入产出比", "推广情况", "门市单量占比"];
  return (
    <div className="grid grid-cols-2 gap-4 overflow-auto p-1">
      {widgets.map(title => (
        <div key={title} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm min-h-[160px]">
          <h3 className="text-sm font-bold text-slate-700 mb-4 font-sans">{title}</h3>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500 font-sans">平台来源</span>
              <select className="border border-slate-200 rounded h-6 px-1 text-[10px] outline-none"><option>请选择</option></select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500 font-sans">创建时间</span>
              <input type="date" className="border border-slate-200 rounded h-6 px-1 text-[10px] font-mono" />
              <span className="text-slate-300">至</span>
              <input type="date" className="border border-slate-200 rounded h-6 px-1 text-[10px] font-mono" />
            </div>
            <button className="bg-[#1890ff] text-white text-[10px] px-3 h-6 rounded font-sans">查询</button>
          </div>
          <div className="flex items-center justify-center h-24 bg-slate-50 rounded border border-dashed border-slate-200">
            <span className="text-slate-400 text-xs font-sans">暂无图表数据</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const DataStats = () => (
  <div className="flex-1 bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden">
    <div className="flex items-center gap-4 mb-8">
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500 font-sans">项目</span>
        <select className="border border-slate-200 rounded h-8 w-40 px-2 text-xs outline-none font-sans"><option>全部</option></select>
      </div>
      <div className="flex items-center gap-2">
        <Clock size={14} className="text-slate-400" />
        <input type="date" className="border border-slate-200 rounded h-8 px-2 text-xs font-mono" defaultValue="2025-12-01" />
        <span className="text-slate-300">至</span>
        <input type="date" className="border border-slate-200 rounded h-8 px-2 text-xs font-mono" defaultValue="2025-12-31" />
      </div>
      <button className="bg-[#1890ff] text-white px-4 h-8 rounded text-xs font-sans">查询</button>
    </div>
    <div className="flex-1 flex flex-col items-center">
      <h2 className="text-base font-bold mb-4 font-sans">订单数统计</h2>
      <div className="flex gap-20 items-center">
        <div className="w-64 h-64 rounded-full border-[30px] border-[#5b7ce2] relative flex items-center justify-center">
           <div className="text-center">
              <div className="text-xs text-slate-400 font-sans">订单总数</div>
              <div className="text-xl font-bold font-mono">289,491</div>
           </div>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[11px] max-h-64 overflow-y-auto pr-4">
           {["专利申请", "其他开锁服务", "冰箱加氟", "冰箱维修", "单开门冰箱清洗", "双开门冰箱清洗", "名酒回收", "地暖漏水", "地板清洁"].map((item, i) => (
             <div key={item} className="flex items-center gap-2">
               <div className={`w-3 h-3 rounded ${i === 0 ? 'bg-[#5b7ce2]' : 'bg-slate-200'}`}></div>
               <span className="text-slate-600 truncate w-32 font-sans">{item}</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  </div>
);

const Leaderboard = () => (
  <div className="flex-1 bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden">
    <div className="flex border-b border-slate-100 mb-4">
      <div className="px-4 py-2 text-[#1890ff] border-b-2 border-[#1890ff] text-sm font-bold cursor-pointer font-sans">客服</div>
    </div>
    <div className="flex items-center gap-6 mb-6 text-[11px]">
      <div className="flex items-center gap-1 font-sans">我的排名: <span className="text-blue-500 font-bold font-mono">135</span></div>
      <div className="flex items-center gap-1 font-sans">录单数: <span className="text-blue-500 font-bold font-mono">9</span></div>
      <div className="flex items-center gap-1 font-sans">报错数: <span className="text-blue-500 font-bold font-mono">0</span></div>
      <div className="flex items-center gap-1 font-sans">出错率: <span className="text-blue-500 font-bold font-mono">0%</span></div>
    </div>
    <div className="flex items-center gap-4 mb-6">
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500 font-sans">时间</span>
        <div className="flex items-center gap-1 border border-slate-200 rounded px-2 h-8">
           <input type="date" className="text-xs outline-none font-mono" defaultValue="2025-12-01" />
           <span className="text-slate-300">至</span>
           <input type="date" className="text-xs outline-none font-mono" defaultValue="2025-12-31" />
        </div>
      </div>
      <button className="bg-[#1890ff] text-white px-4 h-8 rounded text-xs flex items-center gap-1 font-sans"><Search size={14}/> 搜索</button>
    </div>
    <div className="flex-1 overflow-auto">
      <h4 className="text-sm font-bold mb-4 font-sans">录单数排名</h4>
      <div className="space-y-4 pr-10">
        {[
          { name: "肖广东", rank: 134, count: 10, color: "bg-orange-400" },
          { name: "钟威", rank: 135, count: 9, color: "bg-red-500" },
          { name: "郭玉珍", rank: 136, count: 9, color: "bg-orange-300" },
          ...Array.from({ length: 17 }).map((_, i) => ({ name: `客服${i+1}`, rank: 137 + i, count: 5, color: "bg-slate-200" }))
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-4 group">
            <span className="text-[11px] text-slate-500 w-16 shrink-0 font-mono">{item.rank}</span>
            <span className="text-[11px] text-slate-500 font-sans"> {item.name}</span>
            <div className="flex-1 bg-slate-100 h-6 rounded-r relative overflow-hidden">
               <div className={`${item.color} h-full transition-all`} style={{ width: `${(item.count / 10) * 100}%` }}></div>
               <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-mono">{item.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ManagerDashboard = () => (
  <div className="flex-1 overflow-auto p-1 space-y-4">
    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-slate-700 font-sans">数据总览</h3>
        <div className="flex items-center gap-2">
           <input type="date" className="border border-slate-200 rounded h-7 px-2 text-xs font-mono" defaultValue="2025-12-19" />
           <button className="bg-[#1890ff] text-white text-[11px] px-3 h-7 rounded font-sans">搜索</button>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-3">
        {["订单总数", "直派订单", "手动派单", "派单率", "派单平均耗时", "长期订单", "报错订单", "单库订单", "售后订单", "作废订单", "总收款(录)", "总业绩(录)"].map(label => (
          <div key={label} className="bg-slate-50 p-2 rounded border border-slate-100 flex flex-col items-center">
            <span className="text-[11px] text-slate-500 mb-1 font-sans">{label}</span>
            <span className="text-sm font-bold font-mono">0</span>
          </div>
        ))}
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      {["录单情况", "派单情况", "成单数据", "客单价"].map(title => (
        <div key={title} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm min-h-[160px]">
          <h3 className="text-sm font-bold text-slate-700 mb-4 text-center font-sans">{title}</h3>
          <div className="h-20 flex items-center justify-center bg-slate-50 rounded border border-dashed border-slate-200">
            <span className="text-slate-400 text-[10px] font-sans">暂无细分数据</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const DispatcherDataAnalysis = () => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden p-1">
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
          <iframe 
            srcDoc={PAGE_1_HTML} 
            className="w-full h-full border-none" 
            title="Dispatcher Analysis Professional"
            sandbox="allow-scripts allow-same-origin"
          />
      </div>
    </div>
  );
};

const RecordingTrack = ({ type }: { type: '客服' | '派单员' }) => {
  const users = useMemo(() => Array.from({ length: 20 }).map((_, i) => ({
    id: i + 1,
    name: i % 2 === 0 ? "何旺" : (i % 3 === 0 ? "邱树周" : "赖国秀"),
    group: "运营中心",
    role: type === '客服' ? "客服" : "派单",
    totalCount: Math.floor(Math.random() * 10),
    avgInterval: `${Math.floor(Math.random() * 30)}分${Math.floor(Math.random() * 60).toString().padStart(2, '0')}秒`,
    dailyAvg: Math.floor(Math.random() * 50) + 10,
    regDays: 500 - i * 5
  })), [type]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm mb-2 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-sans">{type}</span>
          <input type="text" placeholder="请输入内容" className="border border-slate-200 rounded h-8 px-2 text-xs outline-none focus:border-blue-400 font-sans" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-sans">查询日期</span>
          {type === '客服' ? (
             <div className="flex items-center gap-1">
               <input type="date" className="border border-slate-200 rounded h-8 px-2 text-xs font-mono" defaultValue="2025-12-01" />
               <span className="text-slate-300">-</span>
               <input type="date" className="border border-slate-200 rounded h-8 px-2 text-xs font-mono" defaultValue="2025-12-19" />
             </div>
          ) : (
             <input type="date" className="border border-slate-200 rounded h-8 px-2 text-xs font-mono" defaultValue="2025-12-19" />
          )}
        </div>
        {type === '客服' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-sans">部门</span>
            <select className="border border-slate-200 rounded h-8 px-2 text-xs outline-none focus:border-blue-400 bg-white min-w-[100px] font-sans">
              <option value="">全部</option>
              <option value="运营中心">运营中心</option>
              <option value="客服部">客服部</option>
              <option value="综合部">综合部</option>
            </select>
          </div>
        )}
        <button className="bg-[#1890ff] text-white px-6 h-8 rounded text-xs font-bold hover:bg-blue-600 font-sans">搜索</button>
      </div>
      <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm overflow-auto p-4 space-y-4">
        {users.map((user, idx) => (
          <div key={idx} className={`border border-slate-200 rounded-lg p-3 hover:shadow-md transition-shadow ${idx % 2 === 1 ? 'bg-[#FFF0F0]' : 'bg-white'}`}>
            <div className="flex flex-wrap items-center gap-3 mb-4 font-sans">
              <span className="bg-red-500 text-white px-2 py-1 rounded text-[10px] font-medium">{user.name} / {user.group} / {user.role}</span>
              <span className="bg-blue-400 text-white px-2 py-1 rounded text-[10px] font-medium">录单总量: {user.totalCount}</span>
              <span className="bg-green-500 text-white px-2 py-1 rounded text-[10px] font-medium">注册天数: {user.regDays}</span>
              <span className="bg-purple-500 text-white px-2 py-1 rounded text-[10px] font-medium">
                {type === '客服' ? '平均录单时间间隔' : '平均派单时间间隔'}: {user.avgInterval}
              </span>
              {type === '客服' && (
                  <span className="bg-orange-500 text-white px-2 py-1 rounded text-[10px] font-medium">
                    日均单量: {user.dailyAvg}
                  </span>
              )}
            </div>
            <div className="relative h-12 flex items-center border-t border-slate-50 pt-2">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2"></div>
              {Array.from({ length: 11 }).map((_, i) => (
                <div key={i} className="flex-1 relative">
                  <span className="absolute -bottom-4 left-0 -translate-x-1/2 text-[9px] text-slate-400 font-mono">{10 + i}:00</span>
                </div>
              ))}
              <div className="absolute left-1/4 w-0.5 h-4 bg-blue-500 top-1/2 -translate-y-1/2 shadow-sm"></div>
              <div className="absolute left-[45%] w-0.5 h-4 bg-red-500 top-1/2 -translate-y-1/2 shadow-sm"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-2 border-t border-slate-200 flex items-center justify-center gap-4 text-[11px] bg-slate-50 rounded-b-lg">
        <span className="text-slate-500 font-sans">共 <span className="font-mono">20</span> 条记录</span>
        <div className="flex gap-1">
          <button className="w-6 h-6 border border-slate-200 rounded flex items-center justify-center bg-white hover:bg-slate-50"><ChevronLeft size={12}/></button>
          <button className="w-6 h-6 border rounded font-bold bg-[#1890ff] text-white border-[#1890ff] font-mono">1</button>
          <button className="w-6 h-6 border border-slate-200 rounded flex items-center justify-center bg-white hover:bg-slate-50"><ChevronRight size={12}/></button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState<TabType>('店铺统计');

  const overviewConfig = useMemo(() => {
    if (activeTab === '客服录单轨迹') {
      return {
        title: '客服录单数据概览',
        stats: [
          ['今日录单总数', '482', '#262626'],
          ['昨日录单总数', '465', '#595959'],
          ['当月录单总数', '12,580', '#1890ff'],
          ['上月录单总数', '11,200', '#595959'],
          ['环比率', '+12.3%', '#f5222d']
        ]
      };
    }
    return {
      title: '运营效能概览',
      stats: [
        ['今日单量', '2,482', '#262626'],
        ['异常预警', '3', '#f5222d'],
        ['榜单冠军', '廖林峰', '#52c41a'],
        ['全网GMV', '¥85.4w', '#1890ff']
      ]
    };
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case '店铺统计': return <StoreStats />;
      case '数据统计': return <DataStats />;
      case '天梯榜': return <Leaderboard />;
      case '负责人看板': return <ManagerDashboard />;
      case '派单员数据分析': return <DispatcherDataAnalysis />;
      case '客服录单轨迹': return <RecordingTrack type="客服" />;
      case '派单员录单轨迹': return <RecordingTrack type="派单员" />;
      default: return <StoreStats />;
    }
  };

  return (
    <div className="h-screen bg-[#f8fafc] p-3 flex flex-col overflow-hidden font-sans text-slate-800">
      <NotificationBar />
      <TabSelector activeTab={activeTab} onSelect={setActiveTab} />
      
      {activeTab !== '数据统计' && activeTab !== '负责人看板' && activeTab !== '派单员数据分析' && (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden flex items-center shadow-sm h-12 mb-2 shrink-0">
          <div className="flex items-center gap-3 px-4 flex-1">
            <div className="flex items-center gap-2 mr-8 shrink-0">
               <BarChart2 size={18} className="text-blue-600" />
              <span className="text-[14px] font-bold text-slate-600 font-sans">{overviewConfig.title}</span>
            </div>
            <div className="flex gap-12">
              {overviewConfig.stats.map(([label, val, color]) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className="text-[12px] text-[#8c8c8c] font-sans">{label}:</span>
                  <span className="text-[20px] font-bold font-mono" style={{ color }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
            <button className="mr-4 bg-[#1890ff] text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-600 transition-colors flex items-center gap-1">
               <span className="text-lg leading-none">+</span> 新增
            </button>
            <div className="mr-4 flex items-center text-[#1890ff] text-xs cursor-pointer hover:underline">
               <Search size={12} className="mr-1" />
               点这高级筛选
            </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
};

const container = document.getElementById('root');
if (container) { const root = createRoot(container); root.render(<App />); }
