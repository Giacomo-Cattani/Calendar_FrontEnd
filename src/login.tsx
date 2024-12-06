// src/Demo.tsx
import LoginPage, { Email, Banner, ButtonAfter, Password, Submit } from '@react-login-page/page3';
import defaultBannerImage from '@react-login-page/page3/bg.jpeg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import md5 from 'md5';
import { setEvents, clearEvents } from './redux/eventSlice';
import { setMarks, clearMarks } from './redux/markSlice';
import { loginSuccess, logout } from './redux/authSlice';
import { AppDispatch } from './redux/store';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Demo = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    useEffect(() => {

        // Check if expiresAt is today
        const expiresAt = localStorage.getItem('expiresAt');
        if (expiresAt) {
            const expiresAtDate = new Date(parseInt(expiresAt));
            const today = new Date();
            if (expiresAtDate < today) {
                // Clear events and auth state on login page load
                dispatch(logout());
            } else {
                navigate('/');
            }
        }
    }, [dispatch]);

    const cleanSubject = (subject: string) => {
        return subject.replace(/\(.*?\)\s*/, '');
    };

    const login = async (): Promise<void> => {
        const emailInput = document.getElementById('email') as HTMLInputElement;
        const passwordInput = document.getElementById('psw') as HTMLInputElement;

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email) {
            toast.error('Email is required');
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            toast.error('Invalid email format');
            return;
        }

        if (!password) {
            toast.error('Password is required');
            return;
        }

        const hashedPassword = md5(password);


        try {
            const response = await axios.post(
                `${import.meta.env.VITE_URL}/login`,
                {
                    "data": {
                        user: email,
                        pwd: hashedPassword, // Ensure secure handling on the server side
                        fromDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toLocaleDateString('it-IT'),
                        toDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('it-IT'),
                    }
                },
                {
                    headers: { 'Access-Control-Allow-Origin': '*' },
                }
            );

            const response2 = await axios.post(
                `${import.meta.env.VITE_URL}/marks`,
                {
                    "data": {
                        user: email,
                        pwd: hashedPassword
                    }
                },
                {
                    headers: { 'Access-Control-Allow-Origin': '*' },
                }
            );

            // Since the response doesn't contain user info or token,
            // we'll consider the login successful if the request succeeds
            // and dispatch `loginSuccess` to update the auth state
            localStorage.setItem('expiresAt', String(Date.now() + 1000 * 60 * 60 * 24 * 30));
            dispatch(loginSuccess());

            // Map response data to Event structure
            const eventsData = Array.isArray(response.data) ? response.data : [response.data];
            const marksData = Array.isArray(response2.data) ? response2.data : [response2.data];
            const formattedEvents = eventsData.flatMap((data: any) => data.events.map((element: any) => ({
                title: cleanSubject(element.Subject), // Cleaned title
                start: new Date(element.StartTime), // Changed startTime to start
                end: new Date(element.EndTime), // Changed endTime to end
                color: element.Colore,
                module: element.Modulo,
                moduleCode: element.ModuloCodice,
                course: element.Corso,
                courseCode: element.CorsoCodice,
                year: element.Anno,
                classroom: element.Aula,
                teacherFirstName: element.NomeDocente,
                teacherLastName: element.CognomeDocente,
            })));
            const formattedMark = marksData[0].marks;

            dispatch(setEvents([]));
            dispatch(setMarks([]));
            // Dispatch events to the Redux store
            dispatch(setEvents(formattedEvents));
            dispatch(setMarks(formattedMark));
            // Save email and hashed password in session storage
            localStorage.setItem('email', email);
            localStorage.setItem('hashedPassword', hashedPassword);

            toast.success('Login successful');

            // Navigate to the calendar
            navigate('/');
        } catch (error: any) {
            console.error('There was an error!', error);
            toast.error(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div
            style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                border: 'none',
            }}
        >
            <LoginPage
                style={{
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    border: 'none',
                }}
            >
                <Banner
                    style={{
                        backgroundImage: `url(${defaultBannerImage})`,
                        flex: '0 1 auto',
                    }}
                />
                <Email
                    id="email"
                    style={{
                        flex: '0 1 auto',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                />
                <Password
                    id="psw"
                    style={{
                        flex: '0 1 auto',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            login();
                        }
                    }}
                />
                <section
                    style={{
                        flex: '0 1 auto',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Submit
                        onClick={login}
                        style={{
                            flex: '0 1 auto',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        Log In
                    </Submit>
                </section>
                <ButtonAfter>‎</ButtonAfter>
            </LoginPage>
            <ToastContainer autoClose={1000} />
        </div>
    );
};

export default Demo;