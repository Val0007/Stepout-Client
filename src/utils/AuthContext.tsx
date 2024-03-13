import { Session, User } from '@supabase/supabase-js';
import { useContext, useState, useEffect, createContext } from 'react';
import supabase from "./supabase"

// create a context for authentication
const AuthContext = createContext<{ session: Session | null | undefined, user: User | null | undefined, signOut: () => void }>({ session: null, user: null, signOut: () => {}});

interface AuthProviderProps{
    children:React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User>()
    const [session, setSession] = useState<Session | null>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
                console.log(_event)
                console.log(session)
                setSession(session);
                setUser(session?.user)
                setLoading(false)
            
        });
        return () => {
            listener?.subscription.unsubscribe();
        };
    }, []);

    const value = {
        session,
        user,
        signOut: () => {
            supabase.auth.signOut()
            setSession(undefined);
            setUser(undefined);
        },
    };

    // use a provider to pass down the value
    return (
        //Only if Auth COMPLETES ANY CHILDREN WILL LOAD
        <AuthContext.Provider value={value}>
            {loading ? <>Loading</> : children}
        </AuthContext.Provider>
    );
};

// export the useAuth hook
export const useAuth = () => {
    return useContext(AuthContext);
};