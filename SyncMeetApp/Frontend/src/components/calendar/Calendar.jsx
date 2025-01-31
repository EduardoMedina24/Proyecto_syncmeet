import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import './Calendar.css';

const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
    const [events, setEvents] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [start, setStart] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [filteredEvents, setFilteredEvents] = useState([]);
  
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
          }));
          setEvents(formattedEvents);
        })
        .catch(error => console.error('Error al obtener reuniones:', error));
    }, [token]);
  
    // Manejo de la selección de fecha en el calendario
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
          console.log(responseData); // Verifica la respuesta del servidor
      
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
          />
        </div>
  
        <div className="meeting-list">
          <h2>Reuniones para {selectedDate ? moment(selectedDate).format('LL') : 'selecciona una fecha'}</h2>
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <div key={event.id} className="meeting-card">
                <h3>{event.title}</h3>
                <p>{moment(event.start).format('LLL')}</p>
                <p>{event.description}</p>
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
