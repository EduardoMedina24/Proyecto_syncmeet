import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import 'moment/locale/es'; // Asegúrate de que Moment.js esté en español
import './Calendar.css';

// Establece Moment.js en español
moment.locale('es'); 

// Crea el localizador para react-big-calendar con Moment.js
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
  // Traducción de los días de la semana
  sunday: 'Domingo',
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  // Traducción de los meses
  january: 'Enero',
  february: 'Febrero',
  march: 'Marzo',
  april: 'Abril',
  may: 'Mayo',
  june: 'Junio',
  july: 'Julio',
  august: 'Agosto',
  september: 'Septiembre',
  october: 'Octubre',
  november: 'Noviembre',
  december: 'Diciembre',
};

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [start, setStart] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [expandedEvent, setExpandedEvent] = useState(null); // Para la tarjeta expandida
  const [synth, setSynth] = useState(null); // Para la síntesis de voz

  const token = localStorage.getItem('token');

  useEffect(() => {
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
        }));
        setEvents(formattedEvents);
      })
      .catch(error => console.error('Error al obtener reuniones:', error));
  }, [token]);

  const handleSelectSlot = (slotInfo) => {
    const selected = moment(slotInfo.start).format('YYYY-MM-DD');
    setSelectedDate(selected);
    setStart(`${selected}T09:00`);
    setFilteredEvents(events.filter(event => moment(event.start).format('YYYY-MM-DD') === selected));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newEvent = {
      titulo: title,
      descripcion: description,
      fechaInicio: new Date(start),
      fechaFin: new Date(start),
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
        const savedEvent = { ...newEvent, start: new Date(start), end: new Date(start) };
        setEvents([...events, savedEvent]);
        setFilteredEvents([...filteredEvents, savedEvent]);
        setTitle('');
        setDescription('');
      } else {
        console.error('Error en la creación de la reunión:', responseData.message);
      }
    } catch (error) {
      console.error('Error al agregar reunión:', error);
    }
  };

  // Función para detener cualquier síntesis anterior y leer la nueva reunión
// Función para detener cualquier síntesis anterior y leer la nueva reunión en español
// Función para traducir la fecha a español
const translateDateToSpanish = (date) => {
    const dayNames = [
      'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
    ];
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 
      'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
  
    const dayOfWeek = dayNames[date.getDay()]; // Obtener el nombre del día
    const dayOfMonth = date.getDate(); // Obtener el día del mes
    const month = monthNames[date.getMonth()]; // Obtener el nombre del mes
    const year = date.getFullYear(); // Obtener el año
  
    // Devuelve una cadena en formato: "Día, Día del mes de Mes del Año"
    return `${dayOfWeek}, ${dayOfMonth} de ${month} de ${year}`;
  };
  
  // Función para detener cualquier síntesis anterior y leer la nueva reunión en español
  const speakDetails = (event) => {
    if (synth) {
      speechSynthesis.cancel(); // Detener cualquier voz anterior
    }
  
    const startDate = translateDateToSpanish(new Date(event.start)); // Traducir la fecha
  
    const utterance = new SpeechSynthesisUtterance(`Tu evento es: ${event.title} que será el día ${startDate} y la descripción es: ${event.description}`);
    utterance.lang = 'es-ES'; // Establecer el idioma de la síntesis a español (España)
    
    window.speechSynthesis.speak(utterance);
    setSynth(utterance); // Guardamos la síntesis para poder detenerla más tarde si es necesario
  };
  


  const handleCardClick = (event) => {
    setExpandedEvent(expandedEvent === event.id ? null : event.id); // Toggle expansión
    speakDetails(event); // Lee los detalles de la reunión
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
          messages={messages} // Aquí pasamos las traducciones
          culture="es" // Esta es la clave para forzar la localización
        />
      </div>

      <div className="meeting-list">
        <h2>Reuniones para {selectedDate ? moment(selectedDate).format('LL') : 'selecciona una fecha'}</h2>
        {filteredEvents.length > 0 ? (
          <div className="meeting-cards">
            {filteredEvents.map(event => (
              <div 
                key={event.id} 
                className={`meeting-card ${expandedEvent === event.id ? 'expanded' : ''}`}
                onClick={() => handleCardClick(event)}
              >
                <h3>{event.title}</h3>
                <p>{moment(event.start).format('LLL')}</p>
                <p>{event.description && expandedEvent === event.id ? event.description : 'Click para más detalles'}</p>
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
