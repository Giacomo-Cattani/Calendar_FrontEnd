import { FC, useEffect, useState } from 'react'
import { Calendar, Event, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import axios from 'axios'

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'

moment.locale('en-GB')

const App: FC = () => {

  useEffect(() => {
    handleEvent()
  }, [])

  const [events, setEvents] = useState<Event[]>([
  ])

  async function handleEvent() {

    axios.post(`${import.meta.env.VITE_URL}/login`,
      {
        headers: { 'Access-Control-Allow-Origin': '*' },
        data: {
          user: "giacomo.cattani@stu.fondazionejobsacademy.org",
          pwd: "1a8c622ae2f60ac41b74b48e19450859", // PASSWORD CRIPTATA CON MD5
          fromDate: "01/09/2024",
          toDate: "01/09/2025"
        }
      }).then((response) => {
        setEvents([])
        response.data.forEach((element: any) => {
          setEvents(prevEvents => [...prevEvents, { title: element.Modulo, start: new Date(element.StartTime), end: new Date(element.EndTime) }])
        })
      }).catch((error) => {
        console.error("There was an error!", error)
      })
  }


  return (
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
  )
}

//@ts-ignore

export default App