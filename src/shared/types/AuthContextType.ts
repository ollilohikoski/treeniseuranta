import User from './User';

interface AuthContextType {
    currentUser: User | null;
    authLoading: boolean;
    emailVerified: boolean;
    setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export default AuthContextType;