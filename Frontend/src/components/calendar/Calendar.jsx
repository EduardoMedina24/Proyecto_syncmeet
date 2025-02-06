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
  const token = localStorage.getItem('token');

  // Obtener eventos desde el backend
  const fetchEvents = () => {
    fetch('http://localhost:5000/api/reuniones', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(response => response.json())
      .then(data => {
        const formattedEvents = data.map(event => ({
          id: event._id,
          title: event.titulo,
          start: new Date(event.fechaInicio),
          end: new Date(event.fechaFin),
          description: event.descripcion,
          enlace: event.urlReunion,
        }));
        setEvents(formattedEvents);
      })
      .catch(error => console.error('Error al obtener reuniones:', error));
  };

  useEffect(() => {
    fetchEvents();
  }, [token]);

  // Traduce fecha al español
  const translateDateToSpanish = (date) => {
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    return `${dayNames[date.getDay()]}, ${date.getDate()} de ${monthNames[date.getMonth()]} de ${date.getFullYear()}`;
  };

  // Formatea la hora a formato legible en español
  const formatHour = (date) => {
    return moment(date).format('h:mm A'); // Formato 24 horas
  };

  // Función para leer los detalles de una reunión
  const speakDetails = (event) => {
    const synth = window.speechSynthesis;
    synth.cancel(); // Detener cualquier síntesis anterior

    const startDate = translateDateToSpanish(new Date(event.start));
    const startTime = formatHour(new Date(event.start));

    const utterance = new SpeechSynthesisUtterance(`Tu evento es: ${event.title}, el día ${startDate} a las ${startTime}. Descripción: ${event.description}`);
    utterance.lang = 'es-ES';

    synth.speak(utterance);
  };

  // Manejar la selección de una fecha en el calendario
  const handleSelectSlot = (slotInfo) => {
    const selected = moment(slotInfo.start).format('YYYY-MM-DDTHH:mm'); // Formato compatible con datetime-local
    setSelectedDate(selected);
    setStart(selected);
    const newFilteredEvents = events.filter(event => moment(event.start).format('YYYY-MM-DD') === moment(slotInfo.start).format('YYYY-MM-DD'));
    setFilteredEvents(newFilteredEvents);
  };

  // Enviar una nueva reunión
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newEvent = {
      titulo: title,
      descripcion: description,
      fechaInicio: new Date(start),
      fechaFin: new Date(start),
      enlace: link,
    };

    try {
      const response = await fetch('http://localhost:5000/api/reuniones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newEvent),
      });

      const responseData = await response.json();

      if (response.ok) {
        fetchEvents();
        setTitle('');
        setDescription('');
        setStart('');
        setLink('');
      } else {
        console.error('Error en la creación de la reunión:', responseData.message);
      }
    } catch (error) {
      console.error('Error al agregar reunión:', error);
    }
  };

  return (
    <div className="calendar-container">
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
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción"
            required
          />
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Enlace de reunión virtual"
          />
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
          style={{ height: '100%' }}
          messages={messages}
          culture="es"
        />
      </div>

      <div className="meeting-list">
        <h2>Reuniones para {selectedDate ? moment(selectedDate).format('LLL') : 'selecciona una fecha'}</h2>
        {filteredEvents.length > 0 ? (
          <div className="meeting-cards">
            {filteredEvents.map(event => (
              <div 
                key={event.id} 
                className="meeting-card"
                onClick={() => speakDetails(event)} // Leer en voz alta cuando se haga clic
              >
                <h3>{event.title}</h3>
                <p>{moment(event.start).format('LLL')}</p>
                <p>{event.description}</p>
                {event.enlace && (
                  <div className="virtual-link">
                    <a href={event.enlace} target="_blank" rel="noopener noreferrer">Acceder a la reunión virtual</a>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No hay reuniones programadas.</p>
        )}
      </div>
    </div>
  );
};

export default CalendarComponent;
