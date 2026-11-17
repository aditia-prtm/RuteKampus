import React from 'react';
import { Plus, Link2, Move, Trash2 } from 'lucide-react';

export default function CustomGraphToolbar({
  currentMode,
  onSelectMode
}) {
  const tools = [
    { id: 'add-node', label: '1. Tambah Simpul', icon: Plus, activeClass: 'bg-[#133e75] text-white border-blue-400/50' },
    { id: 'add-edge', label: '2. Sambung Sisi & Bobot', icon: Link2, activeClass: 'bg-sky-700 text-white border-sky-400/50' },
    { id: 'drag', label: '3. Geser Simpul (Drag)', icon: Move, activeClass: 'bg-teal-700 text-white border-teal-400/50' },
    { id: 'delete', label: '4. Hapus', icon: Trash2, activeClass: 'bg-rose-700 text-white border-rose-400/50' }
  ];

  return (
    <div className="mb-4 bg-gradient-to-r from-[#072449]/90 to-[#03152c]/95 border border-blue-500/20 backdrop-blur-md rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 text-xs shadow-lg">
      <div className="flex items-center gap-2 text-blue-200 font-medium">
        <span>Alat Kanvas:</span>
        <div className="flex flex-wrap items-center gap-1.5 bg-[#031429] p-1 rounded-xl border border-blue-900/50">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = currentMode === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => onSelectMode(tool.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition cursor-pointer border ${
                  isActive
                    ? `${tool.activeClass} font-semibold shadow-sm`
                    : 'border-transparent text-blue-200/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tool.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="text-blue-200/70 text-[11px]">
        {currentMode === 'add-node' && '● Klik pada area kanvas untuk menaruh simpul baru.'}
        {currentMode === 'add-edge' && '● Klik simpul pertama, lalu klik simpul kedua untuk menyambung sisi.'}
        {currentMode === 'drag' && '● Tarik (drag & drop) simpul mana saja untuk memindahkan koordinatnya.'}
        {currentMode === 'delete' && '✕ Klik simpul atau garis sisi mana saja untuk langsung menghapusnya.'}
      </div>
    </div>
  );
}
