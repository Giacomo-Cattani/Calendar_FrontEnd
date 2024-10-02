import { FC } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from './redux/store'
import { useNavigate } from 'react-router-dom'
import { logout } from './redux/authSlice'
import { clearEvents } from './redux/eventSlice'
import { toast } from 'react-toastify'

moment.locale('en-GB')

const App: FC = () => {

  const events = useSelector((state: RootState) => state.events.events);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

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