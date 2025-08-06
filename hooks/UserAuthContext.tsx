import { createContext, useContext, useEffect, useState } from 'react';

type UserAuthContextType = {
    isLoggedIn: boolean;
    setIsLoggedIn: (val: boolean) => void;
    };

    const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

    export function UserAuthProvider({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        setIsLoggedIn(!!token);
    }, []);

    return (
        <UserAuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
        {children}
        </UserAuthContext.Provider>
    );
    }

    export function useUserAuth() {
    const context = useContext(UserAuthContext);
    if (!context) throw new Error('useUserAuth must be used within UserAuthProvider');
    return context;
}
