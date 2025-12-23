
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
  BarChart3
} from 'lucide-react';

// --- 类型定义 ---

type TabType = '店铺统计' | '数据统计' | '天梯榜' | '负责人看板' | '派单员数据分析' | '客服录单轨迹' | '派单员录单轨迹';

// --- “网页1” 源代码 (用于 iframe srcdoc) ---
const PAGE_1_HTML = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>12.16更新—派单员数据分析专业版</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        body { font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
    </style>
    <script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@19.0.0",
    "react-dom": "https://esm.sh/react-dom@19.0.0",
    "react-dom/client": "https://esm.sh/react-dom@19.0.0/client",
    "recharts": "https://esm.sh/recharts@2.13.0",
    "lucide-react": "https://esm.sh/lucide-react@0.460.0"
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
            Search, Activity, X, ArrowUpDown, Square, Calendar, ChevronDown, Clock, BarChart3, CheckSquare
        } from 'lucide-react';

        // 匹配截图人员数据
        const MOCK_DATA = [
            { id: 1, name: '陈杰', initial: '陈', avatarColor: 'bg-blue-100 text-blue-600', success: 97, dispatch: 86, revenue: 496, rate30: 77, response: 19, total: 137, project: '暖通空调' },
            { id: 2, name: '陈杰', initial: '陈', avatarColor: 'bg-blue-100 text-blue-600', success: 95, dispatch: 91, revenue: 202, rate30: 78, response: 17, total: 59, project: '家电安装' },
            { id: 3, name: '吴刚', initial: '吴', avatarColor: 'bg-blue-50 text-blue-500', success: 95, dispatch: 94, revenue: 205, rate30: 76, response: 19, total: 144, project: '日常保养' },
            { id: 4, name: '黄婷', initial: '黄', avatarColor: 'bg-blue-50 text-blue-500', success: 95, dispatch: 100, revenue: 247, rate30: 84, response: 25, total: 76, project: '紧急管道维修' },
            { id: 5, name: '李强', initial: '李', avatarColor: 'bg-blue-100 text-blue-600', success: 93, dispatch: 94, revenue: 331, rate30: 52, response: 24, total: 38, project: '日常保养' },
            { id: 6, name: '王芳', initial: '王', avatarColor: 'bg-blue-100 text-blue-600', success: 92, dispatch: 90, revenue: 183, rate30: 65, response: 5, total: 90, project: '紧急管道维修' },
            { id: 7, name: '杨光', initial: '杨', avatarColor: 'bg-blue-50 text-blue-500', success: 92, dispatch: 82, revenue: 171, rate30: 57, response: 29, total: 47, project: '紧急管道维修' },
            { id: 8, name: '孙丽', initial: '孙', avatarColor: 'bg-blue-50 text-blue-500', success: 92, dispatch: 95, revenue: 188, rate30: 58, response: 19, total: 50, project: '家电安装' },
        ];

        const ChartCard = ({ title, data, dataKey, color, unit = "" }) => (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 h-[240px] flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-4 rounded-full" style={{ backgroundColor: color }}></div>
                    <h4 className="text-[13px] font-bold text-slate-700">{title}</h4>
                </div>
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} interval={0} />
                            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => \`\${val}\${unit}\`} />
                            <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px -2px rgba(0,0,0,0.1)', fontSize: '11px' }} />
                            <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} barSize={24} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );

        const ComparisonCard = ({ title, icon: Icon, iconBg, iconColor, labels, data }) => (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex-1">
                <div className="px-4 py-3 border-b border-slate-50 flex items-center gap-2">
                    <div className={\`p-1.5 \${iconBg} rounded-md\`}>
                        <Icon size={14} className={iconColor} />
                    </div>
                    <span className="text-sm font-bold text-slate-700">{title}</span>
                </div>
                <div className="p-3">
                    <table className="w-full text-[12px]">
                        <thead>
                            <tr className="text-slate-400 font-medium">
                                <th className="pb-3 text-left">指标</th>
                                <th className="pb-3 text-center">{labels[0]}</th>
                                <th className="pb-3 text-center">{labels[1]}</th>
                                <th className="pb-3 text-center">差值</th>
                                <th className="pb-3 text-center">环比</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {data.map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-2.5 text-slate-600">{row.label}</td>
                                    <td className="py-2.5 text-center text-slate-400 font-mono">{row.v1}</td>
                                    <td className="py-2.5 text-center text-slate-800 font-bold font-mono">{row.v2}</td>
                                    <td className={\`py-2.5 text-center font-mono \${row.diff.startsWith('+') ? 'text-red-500' : row.diff.startsWith('-') ? 'text-green-500' : 'text-slate-300'}\`}>
                                        {row.diff}
                                    </td>
                                    <td className="py-2.5 text-center">
                                        <div className={\`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold \${row.ratio.includes('↑') ? 'bg-red-50 text-red-500' : row.ratio.includes('↓') ? 'bg-green-50 text-green-500' : 'bg-slate-50 text-slate-400'}\`}>
                                            {row.ratio}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );

        const App = () => {
            const [selectedIds, setSelectedIds] = useState(new Set());
            const [showFilters, setShowFilters] = useState(false);

            // 动态过滤选中的用户
            const selectedUsers = useMemo(() => {
                return MOCK_DATA.filter(u => selectedIds.has(u.id));
            }, [selectedIds]);

            // 单人环比数据逻辑
            const comparisonData = useMemo(() => {
                if (selectedUsers.length !== 1) return null;
                const user = selectedUsers[0];
                return {
                    daily: [
                        { label: '成单率', v1: '96%', v2: '96%', diff: '-', ratio: '0.0%' },
                        { label: '派单率', v1: '75%', v2: '78%', diff: '+3.0%', ratio: '↑ 4.0%' },
                        { label: '30分派单', v1: '81%', v2: '82%', diff: '+1.0%', ratio: '↑ 1.2%' },
                        { label: '每单业绩', v1: '¥309', v2: '¥316', diff: '+7', ratio: '↑ 2.3%' },
                        { label: '总单量', v1: '130', v2: '127', diff: '-3', ratio: '↓ 2.3%' },
                    ],
                    weekly: [
                        { label: '成单率', v1: '98%', v2: '96%', diff: '-2.0%', ratio: '↓ 2.0%' },
                        { label: '派单率', v1: '77%', v2: '78%', diff: '+1.0%', ratio: '↑ 1.3%' },
                        { label: '30分派单', v1: '82%', v2: '82%', diff: '-', ratio: '0.0%' },
                        { label: '每单业绩', v1: '¥280', v2: '¥316', diff: '+36', ratio: '↑ 12.9%' },
                        { label: '总单量', v1: '142', v2: '127', diff: '-15', ratio: '↓ 10.6%' },
                    ],
                    monthly: [
                        { label: '成单率', v1: '99%', v2: '96%', diff: '-3.0%', ratio: '↓ 3.0%' },
                        { label: '派单率', v1: '79%', v2: '78%', diff: '-1.0%', ratio: '↓ 1.3%' },
                        { label: '30分派单', v1: '78%', v2: '82%', diff: '+4.0%', ratio: '↑ 5.1%' },
                        { label: '每单业绩', v1: '¥333', v2: '¥316', diff: '-17', ratio: '↓ 5.1%' },
                        { label: '总单量', v1: '137', v2: '127', diff: '-10', ratio: '↓ 7.3%' },
                    ]
                };
            }, [selectedUsers]);

            const handleToggle = (id) => {
                const next = new Set(selectedIds);
                if (next.has(id)) {
                    next.delete(id);
                } else {
                    next.add(id);
                }
                setSelectedIds(next);
            };

            const clearSelection = (e) => {
                e.stopPropagation();
                setSelectedIds(new Set());
            };

            return (
                <div className="p-3">
                    {/* Header: 数据概览 */}
                    <div className="bg-[#F0F8FF] rounded-xl border border-blue-50 h-[64px] mb-4 flex items-center justify-between px-6 shadow-sm">
                        <div className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-blue-600" />
                            <h2 className="text-[17px] font-[700] text-slate-800">数据概览</h2>
                        </div>
                        
                        <div className="flex flex-1 items-center justify-center gap-10 text-slate-700">
                            {[
                                { l: '成单率', v: '75.5%', c: 'text-slate-800' },
                                { l: '派单率', v: '87.8%', c: 'text-blue-600' },
                                { l: '每单业绩', v: '¥302.5', c: 'text-orange-500' },
                                { l: '30分派单率', v: '73.7%', c: 'text-green-500' },
                                { l: '当日总单量', v: '4016', c: 'text-slate-800' },
                                { l: '平均响应', v: '24.8分', c: 'text-purple-600' }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <span className="text-[13px] text-slate-500">{item.l}:</span>
                                    <span className={\`text-[16px] font-[700] \${item.c}\`}>{item.v}</span>
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={() => setShowFilters(!showFilters)}
                            className={\`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 border \${showFilters ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-[#D9ECFF] text-[#1890ff] border-blue-100 hover:bg-[#C5E2FF]'}\`}
                        >
                            <Search className="h-4 w-4" />点这高级筛选
                        </button>
                    </div>

                    {/* 对比分析板块 (当选中人数 >= 2 时显示) */}
                    {selectedUsers.length >= 2 && (
                        <div className="mb-6 transition-all duration-300">
                            <div className="flex items-center justify-between mb-4 px-2">
                                <div className="flex items-center gap-2">
                                    <BarChart3 size={18} className="text-blue-600" />
                                    <h3 className="text-[16px] font-bold text-slate-800">对比分析</h3>
                                    <span className="bg-blue-100 text-blue-600 px-2.5 py-0.5 rounded-full text-[10px] font-bold">已选 {selectedUsers.length} 人</span>
                                </div>
                                <button onClick={clearSelection} className="text-xs text-[#1890ff] hover:text-red-500 font-medium transition-colors">清空选择</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <ChartCard title="成单率对比" data={selectedUsers} dataKey="success" color="#3b82f6" unit="%" />
                                <ChartCard title="派单率对比" data={selectedUsers} dataKey="dispatch" color="#10b981" unit="%" />
                                <ChartCard title="30分钟派单率对比" data={selectedUsers} dataKey="rate30" color="#8b5cf6" unit="%" />
                                <ChartCard title="每单业绩对比" data={selectedUsers} dataKey="revenue" color="#f59e0b" />
                                <ChartCard title="总单量对比" data={selectedUsers} dataKey="total" color="#6366f1" />
                                <div className="bg-white rounded-xl border border-slate-200 border-dashed p-4 flex flex-col items-center justify-center text-center h-[240px]">
                                    <div className="space-y-2">
                                        <p className="text-[13px] text-slate-500 font-medium">共对比 {selectedUsers.length} 位成员</p>
                                        <p className="text-[11px] text-slate-400">数据基于所选时间范围</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 单人环比数据板块 */}
                    {selectedUsers.length === 1 && comparisonData && (
                        <div className="mb-4 flex gap-4 transition-all duration-300">
                            <ComparisonCard 
                                title="日环比数据" icon={Clock} iconBg="bg-blue-50" iconColor="text-blue-500" 
                                labels={['昨日', '今日']} data={comparisonData.daily} 
                            />
                            <ComparisonCard 
                                title="周环比数据" icon={Calendar} iconBg="bg-purple-50" iconColor="text-purple-500" 
                                labels={['上周', '本周']} data={comparisonData.weekly} 
                            />
                            <ComparisonCard 
                                title="月环比数据" icon={Calendar} iconBg="bg-orange-50" iconColor="text-orange-500" 
                                labels={['上月', '本月']} data={comparisonData.monthly} 
                            />
                        </div>
                    )}

                    {/* Filter Bar */}
                    {showFilters && (
                        <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 mb-4 flex items-center gap-4 animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex items-center gap-3 border border-slate-200 rounded-lg px-3 py-1.5 bg-white min-w-[120px] justify-between cursor-pointer">
                               <div className="flex items-center gap-2">
                                 <div className="p-1 bg-slate-50 rounded"><ArrowUpDown className="h-3.5 w-3.5 text-slate-400 rotate-90" /></div>
                                 <span className="text-sm text-slate-600">全部</span>
                               </div>
                               <ChevronDown className="h-4 w-4 text-slate-400" />
                            </div>
                            <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-1.5 bg-white flex-1 max-w-[500px]">
                                <Calendar className="h-4 w-4 text-slate-400" />
                                <span className="text-sm text-slate-500 font-mono">2025/12/12 08:00</span>
                                <span className="text-slate-300 mx-1">至</span>
                                <span className="text-sm text-slate-500 font-mono">2025/12/19 15:07</span>
                                <Calendar className="h-4 w-4 text-slate-400 ml-auto" />
                            </div>
                            <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-1.5 bg-white flex-1">
                                <Search className="h-4 w-4 text-slate-400" />
                                <input type="text" placeholder="搜索姓名..." className="bg-transparent text-sm w-full outline-none text-slate-600" />
                            </div>
                        </div>
                    )}

                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-500 font-medium">
                                <tr>
                                    <th className="px-6 py-4 w-12 text-center">
                                       <Square className="h-4 w-4 mx-auto text-slate-300" />
                                    </th>
                                    <th className="px-4 py-4">姓名</th>
                                    <th className="px-4 py-4 text-center">成单率</th>
                                    <th className="px-4 py-4 text-center">派单率</th>
                                    <th className="px-4 py-4 text-center">每单业绩</th>
                                    <th className="px-4 py-4 text-center">30分钟派单率</th>
                                    <th className="px-4 py-4 text-center">平均响应时间</th>
                                    <th className="px-4 py-4 text-center">总单量</th>
                                    <th className="px-4 py-4 text-center">维修项目</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {MOCK_DATA.map(row => (
                                    <tr 
                                        key={row.id} 
                                        className={\`hover:bg-blue-50/40 transition-colors group cursor-pointer \${selectedIds.has(row.id) ? 'bg-blue-50/50' : ''}\`}
                                        onClick={() => handleToggle(row.id)}
                                    >
                                        <td className="px-6 py-4 text-center">
                                            {selectedIds.has(row.id) ? 
                                                <CheckSquare className="h-4 w-4 mx-auto text-blue-500 fill-blue-50" /> : 
                                                <Square className="h-4 w-4 mx-auto text-slate-300" />
                                            }
                                        </td>
                                        <td className="px-4 py-4 font-medium flex items-center gap-3">
                                            <div className={\`w-7 h-7 \${row.avatarColor} rounded-full flex items-center justify-center text-[11px] font-bold\`}>
                                                {row.initial}
                                            </div>
                                            <span className="text-slate-700">{row.name}</span>
                                        </td>
                                        <td className="px-4 py-4 text-center text-slate-600 font-mono text-[13px]">{row.success}%</td>
                                        <td className="px-4 py-4 text-center text-slate-600 font-mono text-[13px]">{row.dispatch}%</td>
                                        <td className="px-4 py-4 text-center text-slate-600 font-mono text-[13px]">¥{row.revenue}</td>
                                        <td className="px-4 py-4 text-center">
                                            <span className={\`px-3 py-1 rounded-lg text-[12px] font-medium font-mono \${row.rate30 >= 75 ? 'bg-green-50 text-green-600' : row.rate30 >= 60 ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-500'}\`}>
                                                {row.rate30}%
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-center text-slate-600 text-[13px]">{row.response}分钟</td>
                                        <td className="px-4 py-4 text-center text-slate-800 font-bold font-mono text-[13px]">{row.total}</td>
                                        <td className="px-4 py-4 text-center">
                                            <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] text-slate-500">{row.project}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        };

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>
`;

// --- 子组件：通知栏 (视觉风格：深色通告栏 + 红色标签) ---
const NotificationBar = () => (
  <div className="flex items-center gap-4 mb-3 px-4 h-11 bg-[#0f172a] rounded-lg shadow-sm overflow-hidden shrink-0 relative">
     <div className="flex items-center gap-2 bg-[#f5222d] text-white px-2.5 py-1 rounded text-[11px] font-bold shrink-0">
      <span>重要公告</span>
      <Bell size={12} fill="white" />
    </div>
    <div className="flex-1 overflow-hidden relative flex items-center">
      <div className="whitespace-nowrap animate-[marquee_30s_linear_infinite] flex items-center gap-6 text-[12px] text-slate-200">
        <Megaphone size={14} className="text-[#f5222d]" />
        <span>关于 2025 年度秋季职级晋升评审的通知：点击下方详情以阅读完整公告内容。请所有相关人员务必在截止日期前完成确认。</span>
      </div>
    </div>
    <div className="shrink-0 bg-white/10 px-2 py-0.5 rounded text-[11px] text-slate-400 font-mono border border-white/5">
        2025-11-19
    </div>
    <style>{`@keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }`}</style>
  </div>
);

// --- 子组件：标签切换 (视觉风格：统一淡蓝色风格) ---
const TabSelector = ({ activeTab, onSelect }: { activeTab: TabType, onSelect: (t: TabType) => void }) => {
  const tabs: TabType[] = [
    '店铺统计', '数据统计', '天梯榜', '负责人看板', '派单员数据分析', '客服录单轨迹', '派单员录单轨迹'
  ];

  return (
    <div className="grid grid-cols-7 gap-3 mb-3">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onSelect(tab)}
          // 背景色：#F0F9FE (用户指定)
          // 边框和文字：参考截图，蓝色文字，淡蓝边框
          className={`h-11 border rounded-lg text-[13px] font-bold transition-all flex items-center justify-center px-1 text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer 
            bg-[#F0F9FE] border-[#91d5ff] text-[#1890ff] hover:bg-[#e6f7ff]
            ${activeTab === tab ? 'ring-2 ring-offset-1 ring-[#1890ff] opacity-100' : 'opacity-90'}`}
        >
          {tab}
        </button>
      ))}
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
          <h3 className="text-sm font-bold text-slate-700 mb-4">{title}</h3>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500">平台来源</span>
              <select className="border border-slate-200 rounded h-6 px-1 text-[10px] outline-none"><option>请选择</option></select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500">创建时间</span>
              <input type="date" className="border border-slate-200 rounded h-6 px-1 text-[10px]" />
              <span className="text-slate-300">至</span>
              <input type="date" className="border border-slate-200 rounded h-6 px-1 text-[10px]" />
            </div>
            <button className="bg-[#1890ff] text-white text-[10px] px-3 h-6 rounded">查询</button>
          </div>
          <div className="flex items-center justify-center h-24 bg-slate-50 rounded border border-dashed border-slate-200">
            <span className="text-slate-400 text-xs">暂无图表数据</span>
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
        <span className="text-xs text-slate-500">项目</span>
        <select className="border border-slate-200 rounded h-8 w-40 px-2 text-xs outline-none"><option>全部</option></select>
      </div>
      <div className="flex items-center gap-2">
        <Clock size={14} className="text-slate-400" />
        <input type="date" className="border border-slate-200 rounded h-8 px-2 text-xs" defaultValue="2025-12-01" />
        <span className="text-slate-300">至</span>
        <input type="date" className="border border-slate-200 rounded h-8 px-2 text-xs" defaultValue="2025-12-31" />
      </div>
      <button className="bg-[#1890ff] text-white px-4 h-8 rounded text-xs">查询</button>
    </div>
    <div className="flex-1 flex flex-col items-center">
      <h2 className="text-base font-bold mb-4">订单数统计</h2>
      <div className="flex gap-20 items-center">
        <div className="w-64 h-64 rounded-full border-[30px] border-[#5b7ce2] relative flex items-center justify-center">
           <div className="text-center">
              <div className="text-xs text-slate-400">订单总数</div>
              <div className="text-xl font-bold">289,491</div>
           </div>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[11px] max-h-64 overflow-y-auto pr-4">
           {["专利申请", "其他开锁服务", "冰箱加氟", "冰箱维修", "单开门冰箱清洗", "双开门冰箱清洗", "名酒回收", "地暖漏水", "地板清洁"].map((item, i) => (
             <div key={item} className="flex items-center gap-2">
               <div className={`w-3 h-3 rounded ${i === 0 ? 'bg-[#5b7ce2]' : 'bg-slate-200'}`}></div>
               <span className="text-slate-600 truncate w-32">{item}</span>
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
      <div className="px-4 py-2 text-[#1890ff] border-b-2 border-[#1890ff] text-sm font-bold cursor-pointer">客服</div>
    </div>
    <div className="flex items-center gap-6 mb-6 text-[11px]">
      <div className="flex items-center gap-1">我的排名: <span className="text-blue-500 font-bold">135</span></div>
      <div className="flex items-center gap-1">录单数: <span className="text-blue-500 font-bold">9</span></div>
      <div className="flex items-center gap-1">报错数: <span className="text-blue-500 font-bold">0</span></div>
      <div className="flex items-center gap-1">出错率: <span className="text-blue-500 font-bold">0%</span></div>
    </div>
    <div className="flex items-center gap-4 mb-6">
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500">时间</span>
        <div className="flex items-center gap-1 border border-slate-200 rounded px-2 h-8">
           <input type="date" className="text-xs outline-none" defaultValue="2025-12-01" />
           <span className="text-slate-300">至</span>
           <input type="date" className="text-xs outline-none" defaultValue="2025-12-31" />
        </div>
      </div>
      <button className="bg-[#1890ff] text-white px-4 h-8 rounded text-xs flex items-center gap-1"><Search size={14}/> 搜索</button>
    </div>
    <div className="flex-1 overflow-auto">
      <h4 className="text-sm font-bold mb-4">录单数排名</h4>
      <div className="space-y-4 pr-10">
        {[
          { name: "肖广东", rank: 134, count: 10, color: "bg-orange-400" },
          { name: "钟威", rank: 135, count: 9, color: "bg-red-500" },
          { name: "郭玉珍", rank: 136, count: 9, color: "bg-orange-300" },
          ...Array.from({ length: 17 }).map((_, i) => ({ name: `客服${i+1}`, rank: 137 + i, count: 5, color: "bg-slate-200" }))
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-4 group">
            <span className="text-[11px] text-slate-500 w-16 shrink-0">{item.rank} {item.name}</span>
            <div className="flex-1 bg-slate-100 h-6 rounded-r relative overflow-hidden">
               <div className={`${item.color} h-full transition-all`} style={{ width: `${(item.count / 10) * 100}%` }}></div>
               <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-500">{item.count}</span>
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
        <h3 className="text-sm font-bold text-slate-700">数据总览</h3>
        <div className="flex items-center gap-2">
           <input type="date" className="border border-slate-200 rounded h-7 px-2 text-xs" defaultValue="2025-12-19" />
           <button className="bg-[#1890ff] text-white text-[11px] px-3 h-7 rounded">搜索</button>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-3">
        {["订单总数", "直派订单", "手动派单", "派单率", "派单平均耗时", "长期订单", "报错订单", "单库订单", "售后订单", "作废订单", "总收款(录)", "总业绩(录)"].map(label => (
          <div key={label} className="bg-slate-50 p-2 rounded border border-slate-100 flex flex-col items-center">
            <span className="text-[11px] text-slate-500 mb-1">{label}</span>
            <span className="text-sm font-bold">0</span>
          </div>
        ))}
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      {["录单情况", "派单情况", "成单数据", "客单价"].map(title => (
        <div key={title} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm min-h-[160px]">
          <h3 className="text-sm font-bold text-slate-700 mb-4 text-center">{title}</h3>
          <div className="h-20 flex items-center justify-center bg-slate-50 rounded border border-dashed border-slate-200">
            <span className="text-slate-400 text-[10px]">暂无细分数据</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const DispatcherDataAnalysis = () => {
  return (
    <div className="flex-1 flex flex-col overflow-auto p-1 space-y-4">
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <iframe 
            srcDoc={PAGE_1_HTML} 
            className="w-full border-none" 
            style={{ height: '2000px', minHeight: '1800px' }} 
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
    regDays: 500 - i * 5
  })), [type]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm mb-2 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">{type}</span>
          <input type="text" placeholder="请输入内容" className="border border-slate-200 rounded h-8 px-2 text-xs outline-none focus:border-blue-400" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">查询日期</span>
          <input type="date" className="border border-slate-200 rounded h-8 px-2 text-xs" defaultValue="2025-12-19" />
        </div>
        {type === '客服' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">部门</span>
            <select className="border border-slate-200 rounded h-8 px-2 text-xs outline-none focus:border-blue-400 bg-white min-w-[100px]">
              <option value="">全部</option>
              <option value="运营中心">运营中心</option>
              <option value="客服部">客服部</option>
              <option value="综合部">综合部</option>
            </select>
          </div>
        )}
        <button className="bg-[#1890ff] text-white px-6 h-8 rounded text-xs font-bold hover:bg-blue-600">搜索</button>
      </div>
      <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm overflow-auto p-4 space-y-4">
        {users.map((user, idx) => (
          <div key={idx} className="border border-slate-200 rounded-lg p-3 hover:shadow-md transition-shadow">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-red-500 text-white px-2 py-1 rounded text-[10px] font-medium">{user.name} / {user.group} / {user.role}</span>
              <span className="bg-blue-400 text-white px-2 py-1 rounded text-[10px] font-medium">录单总量: {user.totalCount}</span>
              <span className="bg-green-500 text-white px-2 py-1 rounded text-[10px] font-medium">注册天数: {user.regDays}</span>
              <span className="bg-purple-500 text-white px-2 py-1 rounded text-[10px] font-medium">
                {type === '客服' ? '平均录单时间间隔' : '平均派单时间间隔'}: {user.avgInterval}
              </span>
            </div>
            <div className="relative h-12 flex items-center border-t border-slate-50 pt-2">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2"></div>
              {Array.from({ length: 11 }).map((_, i) => (
                <div key={i} className="flex-1 relative">
                  <span className="absolute -bottom-4 left-0 -translate-x-1/2 text-[9px] text-slate-400">{10 + i}:00</span>
                </div>
              ))}
              <div className="absolute left-1/4 w-0.5 h-4 bg-blue-500 top-1/2 -translate-y-1/2 shadow-sm"></div>
              <div className="absolute left-[45%] w-0.5 h-4 bg-red-500 top-1/2 -translate-y-1/2 shadow-sm"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-2 border-t border-slate-200 flex items-center justify-center gap-4 text-[11px] bg-slate-50 rounded-b-lg">
        <span className="text-slate-500">共 20 条记录</span>
        <div className="flex gap-1">
          <button className="w-6 h-6 border border-slate-200 rounded flex items-center justify-center bg-white hover:bg-slate-50"><ChevronLeft size={12}/></button>
          <button className="w-6 h-6 border rounded font-bold bg-[#1890ff] text-white border-[#1890ff]">1</button>
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
        <div className="bg-[#f0f7ff] rounded-lg border border-[#d9d9d9] overflow-hidden flex items-center shadow-sm h-12 mb-2 shrink-0">
          <div className="flex items-center gap-3 px-4 flex-1">
            <div className="flex items-center gap-2 mr-8 shrink-0">
              <Activity size={18} className="text-[#1890ff]" />
              <span className="text-sm font-bold text-[#003a8c]">{overviewConfig.title}</span>
            </div>
            <div className="flex gap-12">
              {overviewConfig.stats.map(([label, val, color]) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className="text-[12px] text-[#8c8c8c]">{label}:</span>
                  <span className="text-base font-bold font-mono" style={{ color }}>{val}</span>
                </div>
              ))}
            </div>
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
