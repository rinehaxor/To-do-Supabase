import { create } from 'zustand'

interface UserState {
  user: User | null;

}

export const useUserStore = create<UserStore>()((set) => ({
user:null
}))