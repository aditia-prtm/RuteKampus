import React from 'react';
import { Plus, Link2, Move, Trash2 } from 'lucide-react';

export default function CustomGraphToolbar({
  currentMode,
  onSelectMode
}) {
  const tools = [
    { id: 'add-node', label: 'Tambah Simpul', icon: Plus },
    { id: 'add-edge', label: 'Sambung Sisi', icon: Link2 },
    { id: 'drag', label: 'Geser Simpul', icon: Move },
    { id: 'delete', label: 'Hapus', icon: Trash2 }
  ];

  return (
    <div className="mb-4 sm:mb-5 bg-gradient-to-r from-[#0e4984]/75 to-[#072f59]/90 border border-blue-300/25 backdrop-blur-md rounded-2xl p-3 sm:p-4 flex flex-col gap-2.5 text-xs shadow-xl shadow-[#021c38]/40">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 text-white font-medium">
          <span className="font-semibold text-white whitespace-nowrap">Alat Kanvas:</span>
          <div className="flex items-center gap-1.5 bg-[#062648]/85 p-1 rounded-xl border border-blue-300/20 overflow-x-auto w-full sm:w-auto">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const isActive = currentMode === tool.id;
              const isDelete = tool.id === 'delete';
              return (
                <button
                  key={tool.id}
                  onClick={() => onSelectMode(tool.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? isDelete
                        ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-950/40'
                        : 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-black/25'
                      : 'text-blue-200/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tool.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="text-blue-100/80 text-[11px] font-medium leading-relaxed">
        {currentMode === 'add-node' && '● Klik pada area kanvas untuk menaruh simpul baru.'}
        {currentMode === 'add-edge' && '● Klik simpul pertama, lalu klik simpul kedua untuk menyambung sisi berbobot.'}
        {currentMode === 'drag' && '● Tarik (drag & drop) simpul mana saja untuk memindahkan koordinatnya.'}
        {currentMode === 'delete' && '✕ Klik simpul atau garis sisi mana saja untuk langsung menghapusnya.'}
      </div>
    </div>
  );
}
