import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, reload } from 'firebase/auth';
import { auth } from '../lib/firebase';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [, setAuthRevision] = useState(0);

    const refreshUser = async () => {
        const currentUser = auth.currentUser;

        if (!currentUser) {
            setUser(null);
            return null;
        }
        await reload(currentUser);

        const updatedUser = auth(currentUser);
        setUser(updatedUser);

        setAuthRevision((AuthRevision) => AuthRevision + 1);

        return updatedUser;
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            auth,
            (currentUser) => {
                setUser(currentUser);
                setLoading(false);
            },
            () => {
                setUser(null);
                setLoading(false);
            }
        );
        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

// The provider and its hook intentionally share a module.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider.');
    }
    return context;
}
