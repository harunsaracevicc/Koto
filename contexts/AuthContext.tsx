
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    role: string | null;
    isAdmin: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    role: null,
    isAdmin: false,
    loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                const userRole = session.user.user_metadata?.role || 'user';
                setRole(userRole);
            }
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                const userRole = session.user.user_metadata?.role || 'user';
                setRole(userRole);
            } else {
                setRole(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const ADMIN_UIDS = ['d0e69ab1-f79e-41da-8d8f-0c2eb3a49f71'];
    const isAdmin = role === 'admin' || (user?.id ? ADMIN_UIDS.includes(user.id) : false);

    return (
        <AuthContext.Provider value={{ user, session, role, isAdmin, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
