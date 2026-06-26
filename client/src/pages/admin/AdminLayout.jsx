import { useState } from 'react'
import { Link }     from 'react-router-dom'
import {
  LayoutDashboard, Package, ClipboardList, Users, Mail, ArrowLeft, ShieldCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

import AdminOverview from './AdminOverview'
import AdminProducts from './AdminProducts'
import AdminOrders   from './AdminOrders'
import AdminUsers    from './AdminUsers'
import AdminMessages from './AdminMessages'

const TABS = [
  { id: 'overview', label: 'Overview', Icon: LayoutDashboard },
  { id: 'products', label: 'Products', Icon: Package         },
  { id: 'orders',   label: 'Orders',   Icon: ClipboardList   },
  { id: 'users',    label: 'Users',    Icon: Users           },
  { id: 'messages', label: 'Messages', Icon: Mail            },
]

export default function AdminLayout() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-void flex flex-col md:flex-row">

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-60 md:flex-col border-r border-white/[0.06] flex-shrink-0">
        <div className="px-6 py-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck size={16} className="text-violet" strokeWidth={1.75} />
            <span className="font-syne font-bold text-ghost text-sm">Frames Admin</span>
          </div>
          <p className="font-mono text-[10px] text-ghost-muted uppercase tracking-widest">
            Operations Console
          </p>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-dm text-sm transition-all duration-150 border',
                activeTab === id
                  ? 'bg-violet/10 text-violet border-violet/20'
                  : 'text-ghost-muted hover:text-ghost hover:bg-white/[0.03] border-transparent'
              )}
            >
              <Icon size={15} strokeWidth={1.75} />
              {label}
            </button>
          ))}
        </nav>

        <div className="px-3 py-5 border-t border-white/[0.06]">
          <Link to="/" className="flex items-center gap-2 px-3 py-2.5 rounded-lg font-dm text-xs text-ghost-muted hover:text-ghost transition-colors">
            <ArrowLeft size={13} />
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Mobile top tabs */}
      <div className="md:hidden sticky top-0 z-30 bg-void border-b border-white/[0.06]">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={15} className="text-violet" strokeWidth={1.75} />
            <span className="font-syne font-bold text-ghost text-sm">Admin</span>
          </div>
          <Link to="/" className="font-dm text-xs text-ghost-muted">Exit</Link>
        </div>
        <div className="flex overflow-x-auto px-3 pb-3 gap-2" style={{ scrollbarWidth: 'none' }}>
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                'flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full font-dm text-xs border transition-all duration-150',
                activeTab === id ? 'bg-violet/10 text-violet border-violet/30' : 'text-ghost-muted border-white/[0.08]'
              )}
            >
              <Icon size={13} strokeWidth={1.75} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 min-w-0 px-4 md:px-8 py-6 md:py-8">
        {activeTab === 'overview' && <AdminOverview />}
        {activeTab === 'products' && <AdminProducts />}
        {activeTab === 'orders'   && <AdminOrders />}
        {activeTab === 'users'    && <AdminUsers />}
        {activeTab === 'messages' && <AdminMessages />}
      </main>
    </div>
  )
}
