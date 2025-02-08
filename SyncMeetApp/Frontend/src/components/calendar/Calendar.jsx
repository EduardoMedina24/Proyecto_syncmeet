import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import Modal from 'react-modal';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import 'moment/locale/es';
import './Calendar.css';
import Draggable from 'react-draggable';


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
Modal.setAppElement('#root');

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
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const API_URL = import.meta.env.VITE_APP_API_URL;


  const openModal = (event) => {
    setSelectedEvent(event);
    setCurrentEvent(event); // Agregar esta línea
    setUpdatedTitle(event.title);
    setUpdatedDescription(event.description);
    setModalIsOpen(true);
  };
  

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentEvent(null);
  };

  const handleUpdateEvent = async () => {
    if (!updatedTitle || !updatedDescription) return;
    
    const updatedEvent = {
      titulo: updatedTitle,
      descripcion: updatedDescription,
      fechaInicio: currentEvent.start,
      fechaFin: currentEvent.end,
    };

    try {
      const response = await fetch(`${API_URL}/api/${currentEvent.tipo === 'tarea' ? 'tareas' : 'reuniones'}/${currentEvent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedEvent),
      });

      const data = await response.json();
      if (data.success) {
        fetchEvents();
        closeModal();
      } else {
        console.error('Error al actualizar:', data.message);
      }
    } catch (error) {
      console.error('Error al actualizar evento:', error);
    }
  };
 
  
  const fetchEvents = async () => {
    try {
      const [reunionesResponse, tareasResponse] = await Promise.all([
        fetch(`${API_URL}/api/reuniones`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/tareas`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
  
      const reunionesData = await reunionesResponse.json();
      const tareasData = await tareasResponse.json();
      console.log("Reuniones:", reunionesData);
      console.log("Tareas:", tareasData);
  
  
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
    const url = tipoEvento === 'reunion' ? `${API_URL}/api/reuniones` : `${API_URL}/api/tareas`;

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


  const handleDeleteEvent = async (event) => {
    if (!window.confirm("¿Seguro que deseas eliminar este evento?")) return;
  
    try {
      const response = await fetch(`${API_URL}/api/${event.tipo === 'tarea' ? 'tareas' : 'reuniones'}/${event.id}`, {
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
      <div className="form-containerr">
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
    Eventos para  {selectedDate ? moment(selectedDate).format('LL') : 'selecciona una fecha'}
  </h2>
  {filteredEvents.length > 0 ? (
    <div className="meeting-cards">
{filteredEvents.map((event) => (
  <div key={event.id} className="meeting-card" onClick={() => speakDetails(event)}>
    <h3>{event.title}</h3>
    <p>{moment(event.start).format('LLL')}</p>
    <p>{event.description}</p>
    {event.enlace && (
      <div className="virtual-link">
                <a 
          href={event.enlace} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()} // Evita que el clic en el enlace active el `onClick` del div
        >
          Acceder a la reunión virtual
        </a>
      </div>
    )}
    <button onClick={(e) => { e.stopPropagation(); openModal(event); }}>✏️</button>
    
    <button onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event); }}>🗑️</button>
  </div>
))}

 {/* Modal */}
 <Modal
  isOpen={modalIsOpen}
  onRequestClose={closeModal}
  contentLabel="Editar Evento"
  className="modal1"
  overlayClassName="modal-overlay"
>
  <Draggable>
    <div className="modal-content">
      <div className="modal-header">
        <h2>Editar Evento</h2>
        <span className="modal-close" onClick={closeModal}>✖</span>
      </div>
      <form className="modal-form">
        <label>Título del evento</label>
        <input
          type="text"
          value={updatedTitle}
          onChange={(e) => setUpdatedTitle(e.target.value)}
          placeholder="Ingrese el título"
        />
        <label>Descripción</label>
        <textarea
          value={updatedDescription}
          onChange={(e) => setUpdatedDescription(e.target.value)}
          placeholder="Ingrese la descripción"
        />
        <div className="modal-actions">
          <button  type="button" onClick={handleUpdateEvent} className="save-button">Guardar</button>
          <button type="button" onClick={closeModal} className="cancel-button">Cancelar</button>
        </div>
      </form>
    </div>
  </Draggable>
</Modal>




    </div>
  ) : (
    <p>No hay eventos programados.</p>
  )}
</div>

    </div>
  );
};

export default CalendarComponent;
