
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Activity, 
  ChevronLeft, 
  ChevronRight, 
  BarChart2, 
  Trash2, 
  ChevronDown, 
  Calendar, 
  Users, 
  Trophy, 
  ClipboardList, 
  Search, 
  Clock,
  Edit3,
  Bell,
  Megaphone
} from 'lucide-react';

// --- 类型定义 ---
type TabType = '店铺统计' | '数据统计' | '天梯榜' | '负责人看板' | '派单员数据分析' | '客服录单轨迹' | '派单员录单轨迹';
type SubTabType = '第三方店铺管理' | '评论管理' | '评价统计' | '商品管理' | '客服管理' | '京东订单' | '第三方订单同步管理';
type ViewMode = 'TAB' | 'SUBTAB';

// --- 模拟数据 ---
const SERVICE_TYPES = [
  { name: '专利申请', color: '#5b8ff9' }, { name: '其他开锁服务', color: '#efefef' },
  { name: '冰箱加氟', color: '#efefef' }, { name: '冰箱维修', color: '#efefef' },
  { name: '单开门冰箱清洗', color: '#efefef' }, { name: '双开门冰箱清洗', color: '#efefef' },
  { name: '名酒回收', color: '#efefef' }, { name: '地暖漏水', color: '#efefef' },
  { name: '地板清洁', color: '#efefef' }
];

// --- 1. 重要公告栏组件 ---
const AnnouncementBar = () => (
  <div className="bg-[#141b2d] h-10 rounded-lg flex items-center px-4 mb-3 shrink-0 overflow-hidden shadow-sm">
    <div className="flex items-center gap-2 bg-[#f5222d] text-white px-2 py-0.5 rounded text-[10px] font-bold shrink-0">
      <Bell size={12} fill="white" />
      <span>重要公告</span>
    </div>
    <span className="text-slate-400 text-[12px] ml-4 font-mono shrink-0">2025-11-19</span>
    <div className="flex-1 ml-10 overflow-hidden relative">
      <div className="flex items-center gap-2 text-slate-200 text-[12px] whitespace-nowrap animate-[marquee_25s_linear_infinite]">
        <Megaphone size={14} className="text-orange-400" />
        <span>关于 2025 年度秋季职级晋升评审的通知：请相关人员务必在截止日期前完成确认，相关政策调整将于下月正式生效。</span>
        <span className="mx-20"></span>
        <Megaphone size={14} className="text-orange-400" />
        <span>关于 2025 年度秋季职级晋升评审的通知：请相关人员务必在截止日期前完成确认，相关政策调整将于下月正式生效。</span>
      </div>
    </div>
    <style>{`
      @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
    `}</style>
  </div>
);

// --- 2. 核心数据面板 (对应截图样式) ---
const CoreDataPanel = () => (
  <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
    <div className="flex items-center gap-10">
      <div className="flex items-center gap-2">
        <Activity size={20} className="text-[#722ed1]" />
        <span className="text-[14px] font-bold text-slate-800">核心数据面板</span>
      </div>
      <div className="flex items-center gap-10">
        <div className="flex flex-col">
          <span className="text-[11px] text-slate-400 mb-0.5">待处理评论</span>
          <span className="text-[15px] font-bold text-[#f5222d]">310</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] text-slate-400 mb-0.5">今日同步</span>
          <span className="text-[15px] font-bold text-slate-800">1560</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] text-slate-400 mb-0.5">平均好评</span>
          <span className="text-[15px] font-bold text-[#52c41a]">98.5%</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] text-slate-400 mb-0.5">同步状态</span>
          <span className="text-[15px] font-bold text-slate-800">正常</span>
        </div>
      </div>
    </div>
    <button className="bg-[#f0f5ff] text-[#1890ff] border border-[#d6e4ff] px-4 h-9 rounded-lg text-[13px] flex items-center gap-2 hover:bg-blue-100 transition-colors font-medium">
      <Search size={16} /> 点这高级筛选 <ChevronDown size={16} />
    </button>
  </div>
);

// --- 菜单配色配置 ---
const TAB_CONFIG: { label: TabType, bg: string, border: string, text: string }[] = [
  { label: '店铺统计', bg: 'bg-[#e6f7ff]', border: 'border-[#91d5ff]', text: 'text-[#096dd9]' },
  { label: '数据统计', bg: 'bg-[#f6ffed]', border: 'border-[#b7eb8f]', text: 'text-[#389e0d]' },
  { label: '天梯榜', bg: 'bg-[#fff7e6]', border: 'border-[#ffd591]', text: 'text-[#d46b08]' },
  { label: '负责人看板', bg: 'bg-[#f9f0ff]', border: 'border-[#d3adf7]', text: 'text-[#531dab]' },
  { label: '派单员数据分析', bg: 'bg-[#fff1f0]', border: 'border-[#ffa39e]', text: 'text-[#cf1322]' },
  { label: '客服录单轨迹', bg: 'bg-[#e6fffb]', border: 'border-[#87e8de]', text: 'text-[#08979c]' },
  { label: '派单员录单轨迹', bg: 'bg-[#f5f5f5]', border: 'border-[#d9d9d9]', text: 'text-[#595959]' },
];

const SUBNAV_CONFIG: { label: SubTabType, bg: string, border: string, text: string }[] = [
  { label: '第三方店铺管理', bg: 'bg-[#fff1f0]', border: 'border-[#ffa39e]', text: 'text-[#cf1322]' },
  { label: '评论管理', bg: 'bg-[#fffbe6]', border: 'border-[#ffe58f]', text: 'text-[#d46b08]' },
  { label: '评价统计', bg: 'bg-[#e6f7ff]', border: 'border-[#91d5ff]', text: 'text-[#096dd9]' },
  { label: '商品管理', bg: 'bg-[#f6ffed]', border: 'border-[#b7eb8f]', text: 'text-[#389e0d]' },
  { label: '客服管理', bg: 'bg-[#e6fffb]', border: 'border-[#87e8de]', text: 'text-[#08979c]' },
  { label: '京东订单', bg: 'bg-[#f9f0ff]', border: 'border-[#d3adf7]', text: 'text-[#531dab]' },
  { label: '第三方订单同步管理', bg: 'bg-[#fff0f6]', border: 'border-[#ffadd2]', text: 'text-[#c41d7f]' },
];

// --- 3. TabSelector (页面左右对齐 & 7列网格) ---
const TabSelector = ({ activeTab, onSelect }: { activeTab: TabType; onSelect: (tab: TabType) => void }) => (
  <div className="grid grid-cols-7 gap-2 mb-3 bg-white px-2 py-2 border-b border-slate-100 shrink-0">
    {TAB_CONFIG.map(config => (
      <button
        key={config.label}
        onClick={() => onSelect(config.label)}
        className={`w-full py-2.5 text-[13px] font-bold rounded-lg border transition-all text-center truncate ${
          activeTab === config.label 
            ? `${config.bg} ${config.border} ${config.text} shadow-sm scale-[1.01]` 
            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
        }`}
      >
        {config.label}
      </button>
    ))}
  </div>
);

// --- 4. SubNav (页面左右对齐 & 保持对齐) ---
const SubNav = ({ activeSubTab, onSelect }: { activeSubTab: SubTabType; onSelect: (sub: SubTabType) => void }) => (
  <div className="grid grid-cols-7 gap-2 mb-4 px-2 py-2 shrink-0 bg-slate-50/50 rounded-xl">
    {SUBNAV_CONFIG.map(config => (
      <button
        key={config.label}
        onClick={() => onSelect(config.label)}
        className={`w-full py-3 text-[12px] font-bold rounded-lg border transition-all text-center truncate ${
          activeSubTab === config.label
            ? `${config.bg} ${config.border} ${config.text} shadow-sm scale-[1.01]`
            : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
        }`}
      >
        {config.label}
      </button>
    ))}
  </div>
);

// --- 业务视图组件 (保持原逻辑) ---
const DonutStatsView = () => (
  <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col p-6">
    <div className="flex items-center gap-4 mb-10">
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500">项目</span>
        <select className="border border-slate-300 rounded px-3 h-8 text-sm outline-none w-32"><option>全部</option></select>
      </div>
      <div className="flex items-center gap-2">
        <Clock size={16} className="text-slate-400" />
        <div className="flex items-center gap-2 border border-slate-300 rounded px-2 h-8">
          <input type="text" defaultValue="2025/12/01" className="w-24 text-sm outline-none" />
          <Calendar size={14} className="text-slate-400" />
        </div>
        <span className="text-slate-400">至</span>
        <div className="flex items-center gap-2 border border-slate-300 rounded px-2 h-8">
          <input type="text" defaultValue="2025/12/31" className="w-24 text-sm outline-none" />
          <Calendar size={14} className="text-slate-400" />
        </div>
      </div>
      <button className="bg-[#1890ff] text-white px-4 h-8 rounded text-sm hover:bg-blue-600">查询</button>
    </div>
    <div className="flex-1 flex flex-col items-center">
      <h2 className="text-lg font-bold text-slate-800 mb-8">订单数统计</h2>
      <div className="flex items-center justify-center gap-20 w-full max-w-4xl">
        <div className="relative w-64 h-64">
          <div className="absolute inset-0 rounded-full border-[30px] border-[#5b8ff9]"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-slate-400">订单总数</span>
            <span className="text-2xl font-bold text-slate-700">289,491</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-12 gap-y-4">
          {SERVICE_TYPES.map(s => (
            <div key={s.name} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-md" style={{ backgroundColor: s.color }}></div>
              <span className="text-xs text-slate-500">{s.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const RankingLadderView = () => (
  <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden">
    <div className="border-b border-slate-100 flex items-center px-6 h-12 gap-8">
      <button className="text-[#1890ff] border-b-2 border-[#1890ff] h-full px-2 font-bold text-sm">客服</button>
    </div>
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-center gap-6 text-xs text-blue-500 font-medium">
        <span>我的排名: 135</span>
        <span>录单数: 9</span>
        <span>报错数: 0</span>
        <span>出错率: 0%</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500">时间</span>
        <div className="flex items-center gap-2 border border-slate-300 rounded px-2 h-7">
          <input type="text" defaultValue="2025/12/01" className="w-20 text-xs outline-none" />
          <Calendar size={12} className="text-slate-400" />
        </div>
        <span className="text-slate-400 text-xs">至</span>
        <div className="flex items-center gap-2 border border-slate-300 rounded px-2 h-7">
          <input type="text" defaultValue="2025/12/31" className="w-20 text-xs outline-none" />
          <Calendar size={12} className="text-slate-400" />
        </div>
        <button className="bg-[#1890ff] text-white px-3 h-7 rounded text-xs ml-2 flex items-center gap-1"><Search size={12}/>搜索</button>
      </div>
      <h3 className="font-bold text-sm text-slate-700 mt-2">录单数排名</h3>
      <div className="flex-1 overflow-auto pr-2 space-y-2">
        {Array(15).fill(null).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <span className="w-12 text-xs text-slate-400">{134 + i} 客服{i + 1}</span>
            <div className="flex-1 h-6 bg-slate-50 rounded-sm relative overflow-hidden">
              <div className="h-full rounded-sm" style={{ width: `${100 - i * 5}%`, backgroundColor: i === 0 ? '#f98d41' : '#e5e9ef' }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const LeadBoardView = () => (
  <div className="flex-1 flex flex-col gap-4 overflow-auto">
    <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-700">数据总览</h3>
        <button className="bg-[#1890ff] text-white px-3 h-7 rounded text-xs">搜索</button>
      </div>
      <div className="grid grid-cols-6 gap-2">
        {['订单总数', '直派订单', '手动派单', '派单率', '派单平均耗时', '长期订单'].map(label => (
          <div key={label} className="border border-slate-100 rounded bg-slate-50/30 p-3 flex flex-col items-center">
            <span className="text-[11px] text-slate-400 mb-1">{label}</span>
            <span className="text-lg font-bold text-slate-700">0</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const OrderSyncManagementView = () => {
  const columns = [
    '订单来源', '重复订单来源', '系统订单号', '用户名', '商家订单号', 
    '下单数量', '录单人', '录单状态', '录单失败原因', '录单失败处理人', 
    '录单失败处理状态', '录单失败处理结果', '订单创建时间'
  ];

  const data = Array(15).fill(null).map((_, i) => ({
    source: i % 2 === 0 ? '京东' : '拼多多',
    repeat: i % 2 === 0 ? '京东' : '拼多多',
    sysId: (13444998 + i).toString(),
    user: '--',
    merchantId: (13444998 + i).toString(),
    count: '--',
    recorder: i % 3 === 0 ? '管理员' : '廖林峰',
    status: i % 2 === 0 ? '完成' : '待处理',
    failReason: '--',
    handler: '管理员',
    handleStatus: i % 2 === 0 ? '完成' : '待处理',
    result: '--',
    time: '2025-11-17'
  }));

  return (
    <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden">
      <CoreDataPanel />
      <div className="flex-1 overflow-auto">
        <table className="w-full text-[11px] border-collapse min-w-[1500px]">
          <thead className="sticky top-0 bg-[#fafafa] z-20 border-b border-slate-100">
            <tr>
              <th className="px-3 py-3 text-left text-slate-400 font-medium w-12">NO.</th>
              {columns.map(h => <th key={h} className="px-3 py-3 text-left text-slate-400 font-medium whitespace-nowrap">{h}</th>)}
              <th className="px-3 py-3 text-left text-slate-400 font-medium w-24">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 bg-white">
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors group">
                <td className="px-3 py-3 text-slate-500 font-mono">{(i + 1).toString().padStart(2, '0')}</td>
                <td className="px-3 py-3">{row.source}</td>
                <td className="px-3 py-3">{row.repeat}</td>
                <td className="px-3 py-3 text-blue-500 font-mono">{row.sysId}</td>
                <td className="px-3 py-3">{row.user}</td>
                <td className="px-3 py-3">{row.merchantId}</td>
                <td className="px-3 py-3">{row.count}</td>
                <td className="px-3 py-3">{row.recorder}</td>
                <td className="px-3 py-3"><span className={row.status === '完成' ? 'text-green-600' : 'text-orange-500'}>{row.status}</span></td>
                <td className="px-3 py-3">{row.failReason}</td>
                <td className="px-3 py-3">{row.handler}</td>
                <td className="px-3 py-3">{row.handleStatus}</td>
                <td className="px-3 py-3">{row.result}</td>
                <td className="px-3 py-3 text-slate-400">{row.time}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    <button className="text-blue-500 hover:text-blue-700 flex flex-col items-center"><Edit3 size={12} /><span className="scale-[0.8] mt-0.5">修改</span></button>
                    <button className="text-red-400 hover:text-red-600 flex flex-col items-center"><Trash2 size={12} /><span className="scale-[0.8] mt-0.5">删除</span></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 bg-[#fafafa] border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
        <div>Total Records: 623</div>
        <div className="flex items-center gap-1">
          <button className="w-6 h-6 border border-slate-200 rounded flex items-center justify-center bg-slate-50"><ChevronLeft size={14}/></button>
          <button className="w-6 h-6 border border-[#1890ff] rounded bg-[#1890ff] text-white">1</button>
          <button className="w-6 h-6 border border-slate-200 rounded flex items-center justify-center bg-slate-50"><ChevronRight size={14}/></button>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title }: { title: string }) => (
  <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden h-[180px]">
    <div className="px-4 py-3 border-b border-slate-50"><h3 className="text-[13px] font-bold text-[#262626]">{title}</h3></div>
    <div className="p-3 bg-white flex items-center gap-3 border-b border-slate-50">
      <div className="flex items-center gap-1"><span className="text-[11px] text-slate-500 font-medium">平台来源</span><select className="border border-slate-300 rounded px-2 h-7 text-[11px] min-w-[80px] outline-none"><option>请选择</option></select></div>
      <div className="flex-1"></div><button className="bg-[#1890ff] text-white px-4 h-7 rounded text-[11px] hover:bg-blue-600 font-bold">查询</button>
    </div>
    <div className="flex-1 flex flex-col items-center justify-center bg-[#f9fafc]/30"><div className="w-[calc(100%-32px)] h-12 border border-dashed border-slate-200 rounded flex items-center justify-center text-slate-400 text-[12px] italic">暂无图表数据</div></div>
  </div>
);

const GenericTable = ({ columns, data }: { columns: string[], data: any[] }) => (
  <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
    <CoreDataPanel />
    <div className="overflow-auto flex-1">
      <table className="w-full text-[11px] border-collapse min-w-[1000px]">
        <thead className="sticky top-0 bg-[#fafafa] z-10 border-b border-slate-100">
          <tr>{columns.map(col => <th key={col} className="px-4 py-3 text-left text-slate-400 font-medium whitespace-nowrap">{col}</th>)}<th className="px-4 py-3 text-left text-slate-400 font-medium">操作</th></tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((row, i) => (<tr key={i} className="hover:bg-slate-50 transition-colors"> {columns.map(col => <td key={col} className="px-4 py-3 text-slate-600 truncate max-w-[150px]">{row[col] || '--'}</td>)}<td className="px-4 py-3"><div className="flex gap-3"><button className="text-blue-500 hover:underline">修改</button><button className="text-red-400 hover:text-red-600">删除</button></div></td></tr>))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- 主应用组件 ---
const App = () => {
  const [activeTab, setActiveTab] = useState<TabType>('店铺统计');
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>('第三方店铺管理');
  const [viewMode, setViewMode] = useState<ViewMode>('TAB');

  const handleTabClick = (tab: TabType) => { setActiveTab(tab); setViewMode('TAB'); };
  const handleSubTabClick = (sub: SubTabType) => { setActiveSubTab(sub); setViewMode('SUBTAB'); };

  const renderContent = () => {
    if (viewMode === 'SUBTAB' && activeSubTab === '第三方订单同步管理') return <OrderSyncManagementView />;
    if (viewMode === 'TAB') {
      switch (activeTab) {
        case '店铺统计': return (
          <div className="flex-1 overflow-auto pr-1">
            <div className="grid grid-cols-2 gap-3 pb-4">
              {["咨询转化率", "每单成本", "响应时间", "客户满意度", "投入产出比", "推广情况", "门市单量占比"].map(title => <MetricCard key={title} title={title} />)}
            </div>
          </div>
        );
        case '数据统计': return <DonutStatsView />;
        case '天梯榜': return <RankingLadderView />;
        case '负责人看板': return <LeadBoardView />;
        default: return <div className="flex-1 bg-white rounded border flex items-center justify-center text-slate-400 italic">视图开发中...</div>;
      }
    }
    switch (activeSubTab) {
      case '第三方店铺管理': return <GenericTable columns={['店铺名称', '店铺ID', '店铺负责人', '区域名称', '店铺所属平台', '店铺对应的订单来源', '是否自动接单', '是否新店']} data={Array(15).fill({ '店铺名称': '鲸佳家政服务官方旗舰店', '店铺ID': '13444998', '店铺负责人': '管理员', '区域名称': '赣州市', '店铺所属平台': '京东', '店铺对应的订单来源': '京东', '是否自动接单': '是', '是否新店': '是' })} />;
      case '评论管理': return <GenericTable columns={['店铺名称', '负责人', '评论来源', '第三方订单号', '评价等级', '星级', '区域', '评论时间']} data={Array(15).fill({ '店铺名称': '极修辣家庭维修旗舰店', '负责人': '廖林峰', '评论来源': '拼多多', '第三方订单号': '13444999', '评价等级': '好评', '星级': '5', '区域': '赣州市', '评论时间': '2025-11-17 17:10:00' })} />;
      default: return <div className="flex-1 flex items-center justify-center text-slate-400 bg-white rounded-lg border border-slate-200 italic">暂无数据</div>;
    }
  };

  return (
    <div className="h-screen bg-[#f8fafc] p-3 flex flex-col overflow-hidden font-sans text-slate-800">
      <AnnouncementBar />
      <TabSelector activeTab={activeTab} onSelect={handleTabClick} />
      <SubNav activeSubTab={activeSubTab} onSelect={handleSubTabClick} />
      <div className="flex-1 flex flex-col overflow-hidden">{renderContent()}</div>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) { const rootInstance = createRoot(rootElement); rootInstance.render(<App />); }
