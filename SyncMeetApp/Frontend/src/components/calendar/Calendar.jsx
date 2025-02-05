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
  const [colorTarea, setColorTarea] = useState('#19bff7');
  const [colorReunion, setColorReunion] = useState('#4CAF50');
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
        tipo: 'reunion',
        color: colorReunion,
      }));
  
      const formattedTareas = tareasData.map(tarea => ({
        id: tarea._id,
        title: tarea.titulo,
        start: new Date(tarea.fecha),
        end: new Date(tarea.fecha),
        description: tarea.descripcion,
        tipo: 'tarea',
        color: colorTarea,
      }));
  
      const updatedEvents = [...formattedReuniones, ...formattedTareas];
  
      setEvents(updatedEvents);
  
      // **Actualizar los eventos filtrados si hay una fecha seleccionada**
      if (selectedDate) {
        const filtered = updatedEvents.filter(
          (event) => moment(event.start).format('YYYY-MM-DD') === moment(selectedDate).format('YYYY-MM-DD')
        );
        setFilteredEvents(filtered);
      }
    } catch (error) {
      console.error('Error al obtener eventos y tareas:', error);
    }
  };
  

  useEffect(() => {
  fetchEvents();
  }, [token, colorReunion, colorTarea]);

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
            color: colorReunion,
          }
        : {
            titulo: title,
            descripcion: description,
            fecha: new Date(start),
            color: colorTarea,
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

  const handleEditEvent = async (event) => {
    const updatedTitle = prompt("Editar título:", event.title);
    const updatedDescription = prompt("Editar descripción:", event.description);
    if (!updatedTitle || !updatedDescription) return;
  
    const updatedEvent = {
      titulo: updatedTitle,
      descripcion: updatedDescription,
      fechaInicio: event.start,
      fechaFin: event.end,
    };
  
    try {
      const response = await fetch(`http://localhost:5000/api/${event.tipo === 'tarea' ? 'tareas' : 'reuniones'}/${event.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedEvent),
      });
      const data = await response.json();
      if (data.success) {
        fetchEvents(); // Recargar eventos actualizados
      } else {
        console.error('Error al actualizar:', data.message);
      }
    } catch (error) {
      console.error('Error al actualizar evento:', error);
    }
  };
  
  const handleDeleteEvent = async (event) => {
    if (!window.confirm("¿Seguro que deseas eliminar este evento?")) return;
  
    try {
      const response = await fetch(`http://localhost:5000/api/${event.tipo === 'tarea' ? 'tareas' : 'reuniones'}/${event.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        fetchEvents(); // Recargar eventos después de eliminar
      } else {
        console.error('Error al eliminar:', data.message);
      }
    } catch (error) {
      console.error('Error al eliminar evento:', error);
    }
  };
  

  
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

  const getEventStyle = (event) => ({
    backgroundColor: event.color,
    border: `1px solid ${event.color}`,
  });



  
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

        {/* Selectores de color con 8 opciones */}
        <div className="color-select-container">
          <div>
            <label>Tarea Color: </label>
            <select value={colorTarea} onChange={(e) => setColorTarea(e.target.value)}>
              <option value="#19bff7">Azul Claro</option>
              <option value="#ff0000">Rojo</option>
              <option value="#ff5733">Naranja</option>
              <option value="#4CAF50">Verde</option>
              <option value="#ff9800">Amarillo</option>
              <option value="#9c27b0">Púrpura</option>
              <option value="#607d8b">Azul Grisáceo</option>
              <option value="#f44336">Rojo Intenso</option>
            </select>
          </div>
          <div>
            <label>Reunión Color: </label>
            <select value={colorReunion} onChange={(e) => setColorReunion(e.target.value)}>
              <option value="#4CAF50">Verde</option>
              <option value="#ff0000">Rojo</option>
              <option value="#ff5733">Naranja</option>
              <option value="#19bff7">Azul Claro</option>
              <option value="#ff9800">Amarillo</option>
              <option value="#9c27b0">Púrpura</option>
              <option value="#607d8b">Azul Grisáceo</option>
              <option value="#f44336">Rojo Intenso</option>
            </select>
          </div>
        </div>
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
          eventPropGetter={(event) => ({
            style: getEventStyle(event),
          })}
        />
      </div>

      <div className="meeting-list">
  <h2>
    Eventos para {selectedDate ? moment(selectedDate).format('LLL') : 'selecciona una fecha'}
  </h2>
  {filteredEvents.length > 0 ? (
    <div className="meeting-cards">
      {filteredEvents.map((event) => (
        <div key={event.id} className="meeting-card" onClick={() => speakDetails(event)}>
          <h3>{event.title}</h3>
          <p>{moment(event.start).format('LLL')}</p>
          <p>{event.description}</p>
          {event.enlace && (
            <>
              <div className="virtual-link">
                <a
                  href={event.enlace}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()} // Evita activar el bot de voz
                >
                  Acceder a la reunión virtual
                </a>
              </div>
              
            </>
          )}
          <button   onClick={(e) => {e.stopPropagation();  handleEditEvent(event);}} >✏️</button>
          <button   onClick={(e) => {e.stopPropagation(); handleDeleteEvent(event);}} >🗑️</button>
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
