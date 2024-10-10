import { FC, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from './redux/store'
import { useNavigate } from 'react-router-dom'
import { logout } from './redux/authSlice'
import { clearEvents, setEvents } from './redux/eventSlice'
import { toast } from 'react-toastify'
import axios from 'axios'

moment.locale('en-GB')

const App: FC = () => {

  const events = useSelector((state: RootState) => state.events.events);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {

    // Save email and hashed password in session storage
    const email = sessionStorage.getItem('email');
    const hashedPassword = sessionStorage.getItem('hashedPassword');

    // Fetch events from the server or any other source
    const fetchEvents = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_URL}/login`,
          {
            "data": {
              user: email,
              pwd: hashedPassword, // Ensure secure handling on the server side
              fromDate: '01/09/2024',
              toDate: '01/09/2025',
            }
          },
          {
            headers: { 'Access-Control-Allow-Origin': '*' },
          }
        );

        // Map response data to Event structure
        const eventsData = Array.isArray(response.data) ? response.data : [response.data];
        console.log('Events data:', eventsData[0].events);
        const formattedEvents = eventsData[0].events.map((element: any) => ({
          title: element.Subject, // Added title
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
        }));

        // Dispatch events to the Redux store
        dispatch(setEvents(formattedEvents));
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearEvents());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <>
      <button onClick={handleLogout}>Logout</button>
      <Calendar
        localizer={momentLocalizer(moment)}
        defaultView='week'
        min={new Date(0, 0, 0, 9, 0, 0)}
        max={new Date(0, 0, 0, 19, 0, 0)}
        events={events}
        formats={{
          timeGutterFormat: 'HH:mm',
          eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
            localizer?.format(start, 'HH:mm', culture) + ' - ' + localizer?.format(end, 'HH:mm', culture),
          agendaTimeRangeFormat: ({ start, end }, culture, localizer) =>
            localizer?.format(start, 'HH:mm', culture) + ' - ' + localizer?.format(end, 'HH:mm', culture),
        }}
        style={{ height: '90vh' }}
      />
    </>
  )
}

//@ts-ignore

export default App