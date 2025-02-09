import React, { ReactNode, Suspense, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from '@context/AuthContext';
import { useAuthContext, useSeasonContext } from '@hooks/context.hooks';
import { SeasonProvider } from '@context/SeasonContext';
import { SeasonUsersProvider } from '@context/SeasonUsersContext';
import { PersonalResultsProvider } from '@context/PersonalResultsContext';
import { RecentResultsProvider } from '@context/RecentResultsContext';
import NavBar from '@components/Shared/NavBar';
import Loader from '@components/Shared/Loader';
import ToasterContainer from '@components/Shared/ToasterContainer';
import Login from '@pages/Auth/Login';
import AdminDashboard from '@pages/Admin/AdminDashboard';
import AdminReportsList from '@pages/Admin/AdminReportsList';
import AdminUsersList from '@pages/Admin/AdminUsersList';
import Dashboard from '@pages/Dashboard/Dashboard';
import SeasonSelection from '@pages/SeasonSelection/SeasonSelection';
import Leaderboard from '@pages/Leaderboard/Leaderboard';
import PersonalChart from '@pages/Chart/PersonalChart';
import User from '@pages/User/User';
import SignUp from '@pages/Auth/SignUp';
import EmailVerification from '@pages/Auth/EmailVerification';
import NameSelection from '@pages/Auth/NameSelection';

const AdminRouteGuard = React.memo(({ children }: { children: ReactNode }) => {
  const { currentUser, authLoading } = useAuthContext();
  const location = useLocation();

  if (authLoading) return <Loader />;
  if (!currentUser || !currentUser.isSuperUser) {
    return <Navigate to="/login" replace />;
  }
  if (currentUser && location.pathname === '/admin/login' && currentUser.isSuperUser) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return <>{children}</>;
});

const RouteGuard = React.memo(({ children }: { children: ReactNode }) => {
  const { currentUser, authLoading } = useAuthContext();
  const location = useLocation();

  if (authLoading) return <Loader />;
  if (['/login', '/signup'].includes(location.pathname)) return <>{children}</>;
  if (!currentUser) return <Navigate to="/login" replace />;
  if (!currentUser.isVerified && location.pathname !== '/verify-email' && !currentUser.isSuperUser) return <Navigate to="/verify-email" replace />;
  if (!currentUser.nameChosen && location.pathname !== '/set-name' && !currentUser.isSuperUser) return <Navigate to="/set-name" replace />;
  if (!currentUser.isActive && !currentUser.isSuperUser) return <p>Sinulla ei ole käyttöoikeutta. Pyydä valmentajaa myöntämään oikeus.</p>;
  if (currentUser.isSuperUser && ['/dashboard', '/seasons', '/chart'].includes(location.pathname)) return <Navigate to="/admin/dashboard" replace />;
  return <>{children}</>;
});

const SeasonGuard = React.memo(({ children }: { children: ReactNode }) => {
  const { seasons, selectedSeason, seasonsLoading, selectedSeasonLoading } = useSeasonContext();
  const location = useLocation();

  if (!seasons) return <h1>Ei kausia vielä</h1>;
  if (seasonsLoading || selectedSeasonLoading) return <Loader />;
  if (!selectedSeason && location.pathname !== '/seasons') return <Navigate to="/seasons" replace />;
  return <>{children}</>;
});

const App = () => {
  const ContextProviders = useMemo(() => ({ children }: { children: ReactNode }) => (
    <AuthProvider>
      <SeasonProvider>
        <SeasonUsersProvider>
          <PersonalResultsProvider>
            <RecentResultsProvider>
              {children}
            </RecentResultsProvider>
          </PersonalResultsProvider>
        </SeasonUsersProvider>
      </SeasonProvider>
    </AuthProvider>
  ), []);

  return (
    <>
      <Router>
        <ContextProviders>
          <NavBar />
          <main className="max-w-6xl container mx-auto px-4 pt-[5.5rem] pb-5 scroll">
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/verify-email" element={<EmailVerification />} />
                <Route path="/set-name" element={<NameSelection />} />
                <Route path="/admin/*" element={
                  <AdminRouteGuard>
                    <Routes>
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="reports" element={<AdminReportsList />} />
                      <Route path="players" element={<AdminUsersList />} />
                    </Routes>
                  </AdminRouteGuard>
                } />
                <Route path="*" element={
                  <RouteGuard>
                    <SeasonGuard>
                      <Routes>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="seasons" element={<SeasonSelection />} />
                        <Route path="leaderboard" element={<Leaderboard />} />
                        <Route path="chart" element={<PersonalChart />} />
                        <Route path="players/:userId" element={<User />} />
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                      </Routes>
                    </SeasonGuard>
                  </RouteGuard>
                } />
              </Routes>
            </Suspense>
            <ToasterContainer />
          </main>
        </ContextProviders>
      </Router>
    </>
  );
};

export default App;