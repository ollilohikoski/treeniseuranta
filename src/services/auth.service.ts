import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, signOut, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/firebase';
import { getUserById, updateUser, createUserDocument } from '@services/user.service';
import { User as FirebaseUser } from 'firebase/auth';
import { withTimeout } from "@/shared/utils/general.utils";
import { handleFirestoreError } from '@/shared/utils/error.utils';

export const signInWithCredentials = async (email: string, password: string) => {
    try {
        const result = await withTimeout(signInWithEmailAndPassword(auth, email, password));
        let userDoc = await withTimeout(getUserById(result.user.uid));

        if (!userDoc) {
            await createUserDocument(result.user);
            userDoc = await withTimeout(getUserById(result.user.uid));
        }

        await updateUserVerificationStatus(result.user);
        return userDoc;
    } catch (error: any) {
        handleFirestoreError(error, 'sign in with credentials');
        return null;
    }
};

export const signInWithGoogle = async () => {
    try {
        const provider = new GoogleAuthProvider();
        const result = await withTimeout(signInWithPopup(auth, provider));
        let userDoc = await withTimeout(getUserById(result.user.uid));

        if (!userDoc) {
            await createUserDocument(result.user);
            userDoc = await withTimeout(getUserById(result.user.uid));
        }

        await updateUserVerificationStatus(result.user);
        return userDoc;
    } catch (error: any) {
        handleFirestoreError(error, 'sign in with Google');
        return null;
    }
};

export const signOutUser = async () => {
    await signOut(auth);
};

export const sendVerificationEmail = async () => {
    if (auth.currentUser && !auth.currentUser.emailVerified) {
        await sendEmailVerification(auth.currentUser);
    }
};

export const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
};

export const checkEmailVerification = async () => {
    if (auth.currentUser) {
        await auth.currentUser.reload();
        await updateUserVerificationStatus(auth.currentUser);
        return auth.currentUser.emailVerified;
    }
    return false;
};

export const updateUserVerificationStatus = async (firebaseUser: FirebaseUser) => {
    try {
        if (firebaseUser.emailVerified) {
            const userDoc = await withTimeout(getUserById(firebaseUser.uid));
            if (userDoc && !userDoc.isVerified) {
                userDoc.isVerified = true;
                await withTimeout(updateUser(userDoc));
            }
        }
    } catch (error: any) {
        handleFirestoreError(error, 'update verification status');
        return null;
    }
};
