import React, { useEffect, useRef, useState } from 'react';

interface MenuItem {
  id: string;
  label: string;
  onClick?: () => void;
}

interface Props {
  items: MenuItem[];
  children: React.ReactNode;
}

const ContextMenu: React.FC<Props> = ({ items, children }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const onContext = (e: MouseEvent) => {
      e.preventDefault();
      setPos({ x: e.clientX, y: e.clientY });
      setOpen(true);
    };

    const onClick = () => setOpen(false);

    node.addEventListener('contextmenu', onContext);
    window.addEventListener('click', onClick);

    return () => {
      node.removeEventListener('contextmenu', onContext);
      window.removeEventListener('click', onClick);
    };
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      {children}

      {open && (
        <div
          role="menu"
          className="fixed z-50"
          style={{ left: pos.x, top: pos.y }}
          onClick={() => setOpen(false)}
        >
          <div className="bg-white dark:bg-gray-800 min-w-[180px] py-1 rounded shadow-lg">
            {items.map((it) => (
              <div
                key={it.id}
                role="menuitem"
                onClick={() => {
                  it.onClick?.();
                  setOpen(false);
                }}
                className="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              >
                {it.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContextMenu;
