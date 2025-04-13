import { FC, useEffect, useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import Modal from 'react-modal'

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from './redux/store'
import { setEvents } from './redux/eventSlice'
import axios from 'axios'

moment.locale('en-GB')

const customStyles = {
  content: {
    zIndex: 1000,
  },
  overlay: {
    zIndex: 1000,
  },
};

const formatDate = (date: Date) => {
  return `${date.getHours()}:${date.getMinutes()}`;
};

const cleanSubject = (subject: string) => {
  return subject.replace(/\(BSD23 2°\)\s*/, '');
};

const App: FC = () => {

  const events = useSelector((state: RootState) => state.events.events);


  const dispatch = useDispatch<AppDispatch>();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  useEffect(() => {

    // Save email and hashed password in session storage
    const email = localStorage.getItem('email');
    const hashedPassword = localStorage.getItem('hashedPassword');

    // Fetch events from the server or any other source
    const fetchEvents = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_URL}/login`,
          {
            "data": {
              user: email,
              pwd: hashedPassword, // Ensure secure handling on the server side
              fromDate: moment().subtract(1, 'year').format('DD/MM/YYYY'),
              toDate: moment().add(1, 'year').format('DD/MM/YYYY'),
            }
          },
          {
            headers: { 'Access-Control-Allow-Origin': '*' },
          }
        );

        // Map response data to Event structure
        const eventsData = Array.isArray(response.data) ? response.data : [response.data];
        const formattedEvents = eventsData.flatMap((data: any) => data.events.map((element: any) => {
          return {
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
          };
        }));


        dispatch(setEvents([]));
        // Dispatch events to the Redux store
        dispatch(setEvents(formattedEvents));
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, [dispatch]);

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  return (
    <>
      {/* <button onClick={handleLogout}>Logout</button> */}
      <Calendar
        localizer={momentLocalizer(moment)}
        defaultView={window.innerWidth < 768 ? 'day' : 'week'}
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
        style={{ height: '90vh', paddingTop: '1rem' }}
        onSelectEvent={handleEventClick}
      />
      {selectedEvent && (
        <Modal
          isOpen={!!selectedEvent}
          onRequestClose={closeModal}
          contentLabel="Event Details"
          style={customStyles}
        >
          <button onClick={closeModal} style={{ float: 'right', fontSize: '1.5rem', border: 'none', background: 'none', cursor: 'pointer' }}>x</button>
          <h2>{selectedEvent.title}</h2>
          <p>Inizio: {formatDate(selectedEvent.start)}</p>
          <p>Fine: {formatDate(selectedEvent.end)}</p>
          <p>Modulo: {selectedEvent.module}</p>
          <p>Classe: {selectedEvent.classroom}</p>
          <p>Maestro: {selectedEvent.teacherFirstName} {selectedEvent.teacherLastName}</p>
        </Modal>
      )}
    </>
  )
}

//@ts-ignore

export default App