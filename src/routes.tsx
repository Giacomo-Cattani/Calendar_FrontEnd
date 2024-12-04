// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Demo from './login'; // Your login component
import App from './App'; // Protected component
import PrivateRoute from './privateRoute';
import NotFound from './notfound';
import MarkPage from './mark';
import { NavbarDefault } from './navbar'

const NavbarLayout = () => (
    <>
        <NavbarDefault />
        <Outlet /> {/* This will render the matched child route */}
    </>
);

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Demo />} />

                {/* Define a route for the layout that includes the navbar */}
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <NavbarLayout />
                        </PrivateRoute>
                    }
                >
                    {/* Nested routes will be rendered inside the <Outlet> */}
                    <Route index element={<Navigate to="/calendar" replace />} />
                    <Route path="calendar" element={<App />} />
                    <Route path="mark" element={<MarkPage />} />
                </Route>

                {/* Redirect any unknown routes to login */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
