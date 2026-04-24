import { create } from 'zustand';

interface AppStore {
  commandOpen: boolean;
  activeSection: string;
  setCommandOpen: (v: boolean) => void;
  setActiveSection: (s: string) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  commandOpen: false,
  activeSection: 'home',
  setCommandOpen: (v) => set({ commandOpen: v }),
  setActiveSection: (s) => set({ activeSection: s }),
}));
