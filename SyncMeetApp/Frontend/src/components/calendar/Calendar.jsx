import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import 'moment/locale/es';
import './Calendar.css';

moment.locale('es');
const localizer = momentLocalizer(moment);

const messages = {
  allDay: 'Todo el día',
  previous: 'Anterior',
  next: 'Siguiente',
  today: 'Hoy',
  month: 'Mes',
  week: 'Semana',
  day: 'Día',
  agenda: 'Agenda',
  date: 'Fecha',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'No hay eventos en este rango',
  showMore: (total) => `+ Ver más (${total})`,
};

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [start, setStart] = useState('');
  const [link, setLink] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [tipoEvento, setTipoEvento] = useState('reunion');
  const token = localStorage.getItem('token');

  const fetchEvents = async () => {
    try {
      const [reunionesResponse, tareasResponse] = await Promise.all([
        fetch('http://localhost:5000/api/reuniones', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('http://localhost:5000/api/tareas', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const reunionesData = await reunionesResponse.json();
      const tareasData = await tareasResponse.json();

      const formattedReuniones = reunionesData.map(event => ({
        id: event._id,
        title: event.titulo,
        start: new Date(event.fechaInicio),
        end: new Date(event.fechaFin),
        description: event.descripcion,
        enlace: event.urlReunion,
      }));

      const formattedTareas = tareasData.map(tarea => ({
        id: tarea._id,
        title: tarea.titulo,
        start: new Date(tarea.fecha),
        end: new Date(tarea.fecha),
        description: tarea.descripcion,
        tipo: 'tarea',
      }));

      setEvents([...formattedReuniones, ...formattedTareas]);
    } catch (error) {
      console.error('Error al obtener eventos y tareas:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [token]);

  const handleSelectSlot = (slotInfo) => {
    const selected = moment(slotInfo.start).format('YYYY-MM-DDTHH:mm');
    setSelectedDate(selected);
    setStart(selected);

    const filtered = events.filter(
      (event) => moment(event.start).format('YYYY-MM-DD') === moment(slotInfo.start).format('YYYY-MM-DD')
    );
    setFilteredEvents(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = tipoEvento === 'reunion' ? 'http://localhost:5000/api/reuniones' : 'http://localhost:5000/api/tareas';

    const newEvent =
      tipoEvento === 'reunion'
        ? {
            titulo: title,
            descripcion: description,
            fechaInicio: new Date(start),
            fechaFin: new Date(start),
            enlace: link,
          }
        : {
            titulo: title,
            descripcion: description,
            fecha: new Date(start),
          };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        fetchEvents();
        setTitle('');
        setDescription('');
        setStart('');
        setLink('');
      } else {
        console.error('Error en la creación:', await response.json());
      }
    } catch (error) {
      console.error('Error al agregar evento:', error);
    }
  };

  const getEventClassName = (event) => {
    // Lógica para asignar un color a las tareas
    if (event.enlace) return ''; // Para reuniones, sin clase especial
    if (event.tipo === 'tarea') {
      if (event.title.includes('urgente')) return 'evento-tarea-rojo'; // Si es urgente, asigna rojo
      return 'evento-tarea'; // Azul claro para las tareas normales
    }
    return '';
  };

  const dayPropGetter = (date) => {
    const today = moment().startOf('day');
    const currentDay = moment(date).startOf('day');
    if (today.isSame(currentDay)) {
      return {
        className: 'rbcToday', // Clase personalizada para el día actual
      };
    }
    return {};
  };

  return (
    <div className="calendar-container">
      <div className="form-container">
        <h2>Programar Evento</h2>
        <select value={tipoEvento} onChange={(e) => setTipoEvento(e.target.value)}>
          <option value="reunion">Reunión</option>
          <option value="tarea">Tarea</option>
        </select>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={tipoEvento === 'reunion' ? 'Título de la reunión' : 'Título de la tarea'}
            required
          />
          <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} required />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripción" required />
          {tipoEvento === 'reunion' && (
            <input type="text" value={link} onChange={(e) => setLink(e.target.value)} placeholder="Enlace de reunión virtual" />
          )}
          <button type="submit">Guardar</button>
        </form>
      </div>

      <div className="calendar-box">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelectSlot}
          dayPropGetter={dayPropGetter} // Aplicar el getter de propiedades para los días
          style={{ height: '100%' }}
          messages={messages}
          culture="es"
          eventPropGetter={(event) => ({
            className: getEventClassName(event),
          })}
        />
      </div>

      <div className="meeting-list">
        <h2>Eventos para {selectedDate ? moment(selectedDate).format('LLL') : 'selecciona una fecha'}</h2>
        {filteredEvents.length > 0 ? (
          <div className="meeting-cards">
            {filteredEvents.map((event) => (
              <div key={event.id} className="meeting-card">
                <h3>{event.title}</h3>
                <p>{moment(event.start).format('LLL')}</p>
                <p>{event.description}</p>
                {event.enlace && (
                  <div className="virtual-link">
                    <a href={event.enlace} target="_blank" rel="noopener noreferrer">
                      Acceder a la reunión virtual
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No hay eventos programados.</p>
        )}
      </div>
    </div>
  );
};

export default CalendarComponent;
