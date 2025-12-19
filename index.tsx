
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
  Filter
} from 'lucide-react';

// --- 类型定义 ---

type TabType = '店铺统计' | '数据统计' | '天梯榜' | '负责人看板' | '客服录单轨迹' | '派单员录单轨迹';

// --- 子组件：通知栏 ---

const NotificationBar = () => (
  <div className="flex items-center gap-4 mb-2 px-4 py-2 bg-[#fff7e6] border border-[#ffd591] rounded-lg shadow-sm overflow-hidden shrink-0">
    <div className="flex items-center gap-2 text-[#d46b08] shrink-0">
      <Bell size={14} className="animate-pulse" />
      <span className="text-xs font-bold">系统公告</span>
    </div>
    <div className="flex-1 overflow-hidden relative h-5 flex items-center">
      <div className="whitespace-nowrap animate-[marquee_30s_linear_infinite] flex items-center gap-8 text-[11px] text-[#d46b08]">
        <span>📢 数据看板已更新：店铺统计增加“门市单量占比”视图，天梯榜排名逻辑已优化，请各位负责人知悉。</span>
      </div>
    </div>
    <style>{`@keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }`}</style>
  </div>
);

// --- 子组件：标签切换 ---

const TabSelector = ({ activeTab, onSelect }: { activeTab: TabType, onSelect: (t: TabType) => void }) => {
  const tabs: TabType[] = ['店铺统计', '数据统计', '天梯榜', '负责人看板', '客服录单轨迹', '派单员录单轨迹'];
  return (
    <div className="grid grid-cols-6 gap-1 mb-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onSelect(tab)}
          className={`h-9 border border-slate-300 rounded-lg text-[12px] font-bold transition-all flex items-center justify-center px-1 text-center leading-tight ${
            activeTab === tab ? 'bg-[#1890ff] text-white border-[#1890ff] shadow-md' : 'bg-white text-slate-600 hover:border-blue-400 hover:text-blue-500 hover:shadow-sm'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

// --- 各板块具体内容组件 ---

// 1. 店铺统计 (图1样式)
const StoreStats = () => {
  const widgets = ["咨询转化率", "每单成本", "响应时间", "客户满意度", "投入产出比", "推广情况", "门市单量占比"];
  return (
    <div className="grid grid-cols-2 gap-4 overflow-auto p-1">
      {widgets.map(title => (
        <div key={title} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm min-h-[160px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-700">{title}</h3>
          </div>
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

// 2. 数据统计 (图2样式)
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
        {/* 模拟饼图 */}
        <div className="w-64 h-64 rounded-full border-[30px] border-[#5b7ce2] relative flex items-center justify-center">
           <div className="text-center">
              <div className="text-xs text-slate-400">订单总数</div>
              <div className="text-xl font-bold">289,491</div>
           </div>
           <div className="absolute top-0 right-0 w-2 h-2 bg-[#5b7ce2] rounded-full translate-x-1/2 -translate-y-1/2"></div>
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

// 3. 天梯榜 (图3样式)
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
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-500">排序</span>
        <select className="border border-slate-200 rounded h-8 w-32 px-2 outline-none"><option>录单数</option></select>
      </div>
      <button className="bg-[#1890ff] text-white px-4 h-8 rounded text-xs flex items-center gap-1"><Search size={14}/> 搜索</button>
    </div>
    <div className="flex-1 overflow-auto">
      <h4 className="text-sm font-bold mb-4">录单数</h4>
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

// 4. 负责人看板 (图4样式)
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
        {[
          "订单总数", "直派订单", "手动派单", "派单率", "派单平均耗时", "长期订单", 
          "报错订单", "单库订单", "售后订单", "作废订单", "总收款(录)", "总业绩(录)",
          "总收款(完)", "总业绩(完)"
        ].map(label => (
          <div key={label} className="bg-slate-50 p-2 rounded border border-slate-100 flex flex-col items-center">
            <span className="text-[11px] text-slate-500 mb-1">{label}</span>
            <span className="text-sm font-bold">0{label.includes('单') ? '单' : (label.includes('绩') || label.includes('款') ? '元' : (label.includes('时') ? 'min' : '%'))}</span>
          </div>
        ))}
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      {["录单情况", "派单情况", "成单数据", "客单价"].map(title => (
        <div key={title} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm min-h-[160px]">
          <h3 className="text-sm font-bold text-slate-700 mb-4 text-center">{title}</h3>
          <div className="flex items-center gap-2 mb-4 justify-center">
            <span className="text-[10px] text-slate-500">来源</span>
            <select className="border border-slate-200 rounded h-6 px-1 text-[10px] w-20 outline-none"><option>请选择</option></select>
            {title.includes('情况') && <div className="flex gap-1 h-6 border rounded px-1 items-center"><input type="date" className="text-[10px]" /></div>}
            <button className="bg-[#1890ff] text-white text-[10px] px-2 h-6 rounded">搜索</button>
          </div>
          <div className="h-20 flex items-center justify-center bg-slate-50 rounded border border-dashed border-slate-200">
            <span className="text-slate-400 text-[10px]">暂无细分数据</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// 5. 客服/派单员录单轨迹 (图5样式)
const RecordingTrack = ({ type }: { type: '客服' | '派单员' }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const users = useMemo(() => Array.from({ length: 20 }).map((_, i) => ({
    id: i + 1,
    name: i % 2 === 0 ? "何旺" : (i % 3 === 0 ? "邱树周" : "赖国秀"),
    group: i % 2 === 0 ? "运营三组" : "私域专科",
    role: type === '客服' ? "客服" : "派单",
    platform: "京东",
    totalCount: Math.floor(Math.random() * 10),
    avgInterval: "24分58秒",
    regDays: 778 - i * 10
  })), [type]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm mb-2 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">{type}</span>
          <input type="text" placeholder="请输入内容" className="border border-slate-200 rounded h-8 px-2 text-xs outline-none focus:border-blue-400" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 text-red-500">* 查询日期</span>
          <input type="date" className="border border-slate-200 rounded h-8 px-2 text-xs" defaultValue="2025-12-19" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">部门</span>
          <select className="border border-slate-200 rounded h-8 w-32 px-2 text-xs outline-none"><option>请选择</option></select>
        </div>
        <button className="bg-[#1890ff] text-white px-6 h-8 rounded text-xs">搜索</button>
      </div>
      <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm overflow-auto p-4 space-y-4">
        {users.map((user, idx) => (
          <div key={idx} className="border border-slate-200 rounded-lg p-3 hover:shadow-md transition-shadow">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-red-500 text-white px-2 py-1 rounded text-[10px] font-medium">{user.name} / {user.group} / {user.role} ( {user.platform} )</span>
              <span className="bg-blue-400 text-white px-2 py-1 rounded text-[10px] font-medium">当日录单总量: {user.totalCount}</span>
              <span className="bg-blue-300 text-white px-2 py-1 rounded text-[10px] font-medium">平均录单时间间隔: {user.avgInterval}</span>
              <span className="bg-green-500 text-white px-2 py-1 rounded text-[10px] font-medium">注册天数: {user.regDays}</span>
            </div>
            <div className="relative h-12 flex items-center border-t border-slate-50 pt-2">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2"></div>
              {Array.from({ length: 11 }).map((_, i) => (
                <div key={i} className="flex-1 relative">
                  <span className="absolute -bottom-4 left-0 -translate-x-1/2 text-[9px] text-slate-400">{10 + i}:00</span>
                  <div className="w-px h-2 bg-slate-200 absolute top-1/2 -translate-y-1/2 left-0"></div>
                </div>
              ))}
              {/* 模拟轨迹点 */}
              <div className="absolute left-1/4 w-0.5 h-4 bg-blue-500 top-1/2 -translate-y-1/2 shadow-sm"></div>
              <div className="absolute left-[40%] w-0.5 h-4 bg-red-500 top-1/2 -translate-y-1/2 shadow-sm"></div>
              <div className="absolute left-[42%] w-0.5 h-4 bg-black top-1/2 -translate-y-1/2 shadow-sm"></div>
            </div>
          </div>
        ))}
      </div>
      {/* 分页 */}
      <div className="px-4 py-2 border-t border-slate-200 flex items-center justify-center gap-4 text-[11px] bg-slate-50 rounded-b-lg">
        <span className="text-slate-500">共 96 条</span>
        <div className="flex gap-1">
          <button className="w-6 h-6 border border-slate-200 rounded flex items-center justify-center bg-white"><ChevronLeft size={12}/></button>
          <button className="w-6 h-6 border rounded font-bold bg-[#1890ff] text-white">1</button>
          <button className="w-6 h-6 border border-slate-200 rounded flex items-center justify-center bg-white">2</button>
          <button className="w-6 h-6 border border-slate-200 rounded flex items-center justify-center bg-white"><ChevronRight size={12}/></button>
        </div>
      </div>
    </div>
  );
};

// --- 主应用组件 ---

const App = () => {
  const [activeTab, setActiveTab] = useState<TabType>('店铺统计');

  const renderContent = () => {
    switch (activeTab) {
      case '店铺统计': return <StoreStats />;
      case '数据统计': return <DataStats />;
      case '天梯榜': return <Leaderboard />;
      case '负责人看板': return <ManagerDashboard />;
      case '客服录单轨迹': return <RecordingTrack type="客服" />;
      case '派单员录单轨迹': return <RecordingTrack type="派单员" />;
      default: return <StoreStats />;
    }
  };

  return (
    <div className="h-screen bg-[#f8fafc] p-3 flex flex-col overflow-hidden font-sans text-slate-800">
      <NotificationBar />
      <TabSelector activeTab={activeTab} onSelect={setActiveTab} />
      
      {/* 实时概览 (保持原样，除非切换到特殊看板) */}
      {activeTab !== '数据统计' && activeTab !== '负责人看板' && (
        <div className="bg-[#f0f7ff] rounded-lg border border-[#d9d9d9] overflow-hidden flex items-center shadow-sm h-12 mb-2 shrink-0">
          <div className="flex items-center gap-3 px-4 flex-1">
            <div className="flex items-center gap-2 mr-8 shrink-0">
              <Activity size={18} className="text-[#1890ff]" />
              <span className="text-sm font-bold text-[#003a8c]">运营效能概览</span>
            </div>
            <div className="flex gap-12">
              {[['今日单量', '2,482', '#262626'], ['异常预警', '3', '#f5222d'], ['榜单第一', '廖林峰', '#52c41a'], ['全网GMV', '¥85.4w', '#1890ff']].map(([label, val, color]) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className="text-[12px] text-[#8c8c8c]">{label}:</span>
                  <span className="text-base font-bold font-mono" style={{ color }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 核心内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
};

const container = document.getElementById('root');
if (container) { const root = createRoot(container); root.render(<App />); }
