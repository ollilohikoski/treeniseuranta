export const handleFirestoreError = (error: any, operation: string): void => {
    console.error(`Error during ${operation}:`, error);
    if (error?.code === 'permission-denied') {
        console.warn(`Permission denied during ${operation}`);
    }
};

export const handleAuthError = (error: any) => {
    switch (error.code) {
        case 'auth/email-already-in-use':
            return 'Sähköpostiosoite on jo käytössä.';
        case 'auth/invalid-email':
            return 'Virheellinen sähköpostiosoite.';
        case 'auth/weak-password':
            return 'Salasanan on oltava vähintään 6 merkkiä pitkä.';
        case 'auth/user-not-found':
            return 'Käyttäjää ei löytynyt.';
        case 'auth/invalid-credential':
            return 'Väärät tunnukset. Yritä uudelleen.';
        case 'auth/popup-closed-by-user':
            return 'Kirjautumisikkuna suljettiin.';
        default:
            return 'Tuntematon virhe tapahtui.';
    }
};
