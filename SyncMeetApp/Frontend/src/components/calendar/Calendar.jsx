import {  useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import './Calendar.css';

const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  const [events, setEvents] = useState([]); // Estado para eventos
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);

  // Manejo de selección de fecha en el calendario
  const handleSelectSlot = (slotInfo) => {
    const selected = moment(slotInfo.start).format('YYYY-MM-DD');
    setSelectedDate(selected);
    setStart(`${selected}T09:00`); // Hora predeterminada
    setFilteredEvents(events.filter(event => moment(event.start).format('YYYY-MM-DD') === selected));
  };

  // Manejo del envío del formulario para programar reuniones (sin backend)
  const handleSubmit = (e) => {
    e.preventDefault();

    const newEvent = {
      id: events.length + 1, // ID único para la reunión
      title,
      start: new Date(start),
      end: new Date(start), // Puede modificarse para agregar una duración
    };

    setEvents([...events, newEvent]); // Guardar en el estado
    setFilteredEvents([...filteredEvents, newEvent]); // Agregar a la lista filtrada
    setTitle(''); // Limpiar el formulario
  };

  return (
    <div className="calendar-container">
      {/* Formulario a la izquierda */}
      <div className="form-container">
        <h2>Programar Reunión</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título"
            required
          />
          <input
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            required
          />
          <button type="submit">Guardar</button>
        </form>
      </div>

      {/* Calendario en el centro */}
      <div className="calendar-box">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelectSlot}
          style={{ height: '100%' }}
        />
      </div>

      {/* Lista de reuniones a la derecha */}
      <div className="meeting-list">
        <h2>Reuniones para {selectedDate ? moment(selectedDate).format('LL') : 'selecciona una fecha'}</h2>
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <div key={event.id} className="meeting-card">
              <h3>{event.title}</h3>
              <p>{moment(event.start).format('LLL')}</p>
            </div>
          ))
        ) : (
          <p>No hay reuniones programadas.</p>
        )}
      </div>
    </div>
  );
};

export default CalendarComponent;
