import { ReactNode, useState, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '@hooks/context.hooks';
import { toast } from 'react-hot-toast';
import { useSeasonContext } from '@hooks/context.hooks';
import { isSeasonActive } from '@/shared/utils/season.utils';
import { signOutUser } from '@services/auth.service'

const NavBar = () => {
    const { currentUser } = useAuthContext();
    const { selectedSeason, seasons } = useSeasonContext();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const visibleSeasons = seasons.filter((season) => season.visible);
    const activeSeasons = seasons.filter((season) => season.visible && isSeasonActive(season));

    const handleSignOut = async () => {
        try {
            await signOutUser();
            toast.success('Kirjauduttu ulos');
            setIsMobileMenuOpen(false);
        } catch (error) {
            console.error('Error signing out:', error);
            toast.error('Ulos kirjautuminen epäonnistui');
        }
    };

    const handleLinkClick = () => setIsMobileMenuOpen(false);

    const handleAuthAction = useCallback(() => {
        if (currentUser) {
            handleSignOut();
        } else {
            navigate('/login');
        }
    }, [currentUser, navigate]);

    const navLinkClasses = "text-white hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium";
    const activeNavLinkClasses = "bg-slate-700";
    const mobileNavLinkClasses = "text-white hover:bg-slate-700 block px-3 py-2 rounded-md text-base font-medium";

    const NavLink: React.FC<{ to: string, children: ReactNode }> = ({ to, children }) => (
        <Link
            to={to}
            className={`${navLinkClasses} ${location.pathname === to || (to === '/dashboard' && location.pathname === '/admin/dashboard') ? activeNavLinkClasses : ''} mr-2`}
            onClick={handleLinkClick}
        >
            {children}
        </Link>
    );

    const MobileNavLink: React.FC<{ to: string, children: ReactNode }> = ({ to, children }) => (
        <Link
            to={to}
            className={`${mobileNavLinkClasses} ${location.pathname === to || (to === '/dashboard' && location.pathname === '/admin/dashboard') ? activeNavLinkClasses : ''}`}
            onClick={handleLinkClick}
        >
            {children}
        </Link>
    );

    return (
        <nav className="bg-slate-900 shadow-xl mb-2 fixed w-full z-10">
            <div className="max-w-6xl mx-auto px-4 lg:px-5">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <h1 className="text-white text-lg font-semibold">
                            <Link to="/dashboard" onClick={handleLinkClick}>Treeniseuranta</Link>
                        </h1>
                    </div>
                    {currentUser && !(location.pathname.startsWith('/seasons') || location.pathname.startsWith('/admin')) && activeSeasons.length > 1 && (currentUser.isActive || currentUser.isSuperUser) && (
                        <div className='flex text-sm gap-2 mt-1'>
                            <p>{selectedSeason ? `Kausi: ${selectedSeason.name}` : 'Ei valittua kautta'}</p>
                        </div>
                    )}
                    <div className="hidden md:flex items-center">
                        {currentUser && selectedSeason && (currentUser.isActive || currentUser.isSuperUser) && (
                            <>
                                <NavLink to="/dashboard">Oma taulu</NavLink>
                                {!currentUser.isSuperUser && <NavLink to="/chart">Kaavio</NavLink>}
                                <NavLink to="/leaderboard">Tulokset</NavLink>
                                {visibleSeasons.length > 1 && <NavLink to="/seasons">Kaudet</NavLink>}
                            </>
                        )}
                        <button
                            onClick={handleAuthAction}
                            className={`${navLinkClasses} ml-2`}
                        >
                            {currentUser ? 'Kirjaudu ulos' : 'Kirjaudu sisään'}
                        </button>
                    </div>
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-white focus:outline-none"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div
                className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${isMobileMenuOpen ? 'max-h-64' : 'max-h-0'}`}
            >
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {currentUser && selectedSeason && (
                        <>
                            <MobileNavLink to="/dashboard">Oma taulu</MobileNavLink>
                            {!currentUser.isSuperUser && <MobileNavLink to="/chart">Kaavio</MobileNavLink>}
                            <MobileNavLink to="/leaderboard">Tulokset</MobileNavLink>
                            {visibleSeasons.length > 1 && <MobileNavLink to="/seasons">Kaudet</MobileNavLink>}
                        </>
                    )}
                    <button
                        onClick={handleAuthAction}
                        className={`${mobileNavLinkClasses} w-full text-left`}
                    >
                        {currentUser ? 'Kirjaudu ulos' : 'Kirjaudu sisään'}
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;