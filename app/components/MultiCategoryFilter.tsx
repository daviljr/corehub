"use client";

import React from "react";

type Category = {
  id: string;
  name?: string;
  slug?: string;
};

type Props = {
  categories: Category[];
  selected: string[];
  onChange: (next: string[]) => void;
};

export default function MultiCategoryFilter({ categories, selected, onChange }: Props) {
  // slug é sempre prioridade, pois define a URL amigável
  const getKey = (c: Category) => c.slug || c.id;

  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  return (
    <div className="p-3 bg-white border rounded-md shadow-sm">
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => {
          const key = getKey(c);
          const checked = selected.includes(key);
          const label = c.name || c.slug || key;

          return (
            <label
              key={key}
              className="inline-flex items-center gap-2 text-sm cursor-pointer"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(key)}
                className="w-4 h-4"
                aria-label={`Filtrar por ${label}`}
              />
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  checked
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {label}
              </span>
            </label>
          );
        })}
      </div>

      <div className="mt-3 text-xs text-slate-500">
        Se nenhuma categoria estiver marcada, todos os produtos serão exibidos.
      </div>
    </div>
  );
}