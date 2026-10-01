import Link from 'next/link';
import { LogOut, Plus, MessageSquare, Globe } from 'lucide-react';
import { Item } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function Sidebar({ 
  userEmail, 
  items, 
  activeItemId, 
  onSelect,
  onNew,
  language,
  setLanguage
}: { 
  userEmail: string; 
  items: Item[]; 
  activeItemId: string | null;
  onSelect: (item: Item) => void;
  onNew: () => void;
  language: 'en' | 'hi';
  setLanguage: (l: 'en' | 'hi') => void;
}) {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="w-72 bg-zinc-950 h-full flex flex-col border-r border-zinc-800">
      <div className="p-6">
        <Link href="/" className="font-display text-3xl font-semibold text-amber-500 tracking-tight">Vaani</Link>
      </div>
      
      <div className="px-4 pb-4">
        <button 
          onClick={onNew}
          className="w-full flex items-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ring-offset-1 ring-offset-zinc-950 shadow-[0_0_15px_rgba(217,119,6,0.2)]"
        >
          <Plus size={18} />
          New session
        </button>
      </div>

      <div className="px-4 py-2 flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-400">
          <Globe size={16} /> Language
        </div>
        <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
          <button 
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${language === 'en' ? 'bg-zinc-800 text-zinc-50 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            EN
          </button>
          <button 
            onClick={() => setLanguage('hi')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${language === 'hi' ? 'bg-zinc-800 text-zinc-50 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            हिंदी
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
        <div className="text-xs font-medium text-zinc-500 mb-2 px-2 uppercase tracking-wider">Recent sessions</div>
        {items.length === 0 ? (
          <div className="text-sm text-zinc-600 px-2 italic">No saved sessions yet.</div>
        ) : (
          items.map(item => (
            <button 
              key={item.id}
              onClick={() => onSelect(item)}
              className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${activeItemId === item.id ? 'bg-zinc-900 text-zinc-50 font-medium border border-zinc-800' : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-300 border border-transparent'}`}
            >
              <MessageSquare size={16} className={activeItemId === item.id ? 'text-amber-500' : 'text-zinc-600'} />
              <span className="truncate">{item.title}</span>
            </button>
          ))
        )}
      </div>

      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-medium text-sm border border-amber-500/20 relative">
            {userEmail[0].toUpperCase()}
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-zinc-950 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-zinc-50 truncate">{userEmail}</div>
            <div className="text-xs text-zinc-500">Active</div>
          </div>
        </div>
        <button 
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </div>
  );
}
