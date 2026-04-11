import { create } from "zustand";

interface UserState {
  isLoggedIn: boolean;
  login: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  isLoggedIn: false,
  login: () => set({ isLoggedIn: true }),
}));
