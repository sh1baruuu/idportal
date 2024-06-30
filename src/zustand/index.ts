import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface KeepMeLoggedInState {
    keepMeLoggedIn: boolean;
    toggleKeepMeLoggedIn: () => void;
    dontKeepMeLoggedIn: () => void;
}

export const useKeepMeLoggedInStore = create<KeepMeLoggedInState>()(
    persist(
        (set) => ({
            keepMeLoggedIn: false,
            toggleKeepMeLoggedIn: () =>
                set((state) => ({
                    keepMeLoggedIn: !state.keepMeLoggedIn,
                })),
            dontKeepMeLoggedIn: () =>
                set(() => ({
                    keepMeLoggedIn: false
                }))
        }),
        {
            name: "keepMeLoggedIn",
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);
