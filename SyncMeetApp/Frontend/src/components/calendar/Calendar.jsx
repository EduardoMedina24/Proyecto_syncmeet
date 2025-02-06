import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import googleMeetIcon from "../../assets/google-meet.svg";

import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import "moment/locale/es";
import "./Calendar.css";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { Link } from "lucide-react";
import { toast, Toaster } from "sonner";
moment.locale("es");
const localizer = momentLocalizer(moment);

const messages = {
  allDay: "Todo el día",
  previous: "Anterior",
  next: "Siguiente",
  today: "Hoy",
  month: "Mes",
  week: "Semana",
  day: "Día",
  agenda: "Agenda",
  date: "Fecha",
  time: "Hora",
  event: "Evento",
  noEventsInRange: "No hay eventos en este rango",
  showMore: (total) => `+ Ver más (${total})`,
};

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("");
  const [link, setLink] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const token = localStorage.getItem("token");

  // Obtener eventos desde el backend
  const fetchEvents = () => {
    fetch("http://localhost:5000/api/reuniones", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        const formattedEvents = data.map((event) => ({
          id: event._id,
          title: event.titulo,
          start: new Date(event.fechaInicio),
          end: new Date(event.fechaFin),
          description: event.descripcion,
          enlace: event.urlReunion,
        }));
        setEvents(formattedEvents);
      })
      .catch((error) => console.error("Error al obtener reuniones:", error));
  };

  useEffect(() => {
    fetchEvents();
  }, [token]);

  // Traduce fecha al español
  const translateDateToSpanish = (date) => {
    const dayNames = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    const monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    return `${dayNames[date.getDay()]}, ${date.getDate()} de ${
      monthNames[date.getMonth()]
    } de ${date.getFullYear()}`;
  };

  // Formatea la hora a formato legible en español
  const formatHour = (date) => {
    return moment(date).format("h:mm A"); // Formato 24 horas
  };

  // Función para leer los detalles de una reunión
  const speakDetails = (event) => {
    const synth = window.speechSynthesis;
    synth.cancel(); // Detener cualquier síntesis anterior

    const startDate = translateDateToSpanish(new Date(event.start));
    const startTime = formatHour(new Date(event.start));

    const utterance = new SpeechSynthesisUtterance(
      `Tu evento es: ${event.title}, el día ${startDate} a las ${startTime}. Descripción: ${event.description}`
    );
    utterance.lang = "es-ES";

    synth.speak(utterance);
  };

  // Manejar la selección de una fecha en el calendario
  const handleSelectSlot = (slotInfo) => {
    const selected = moment(slotInfo.start).format("YYYY-MM-DDTHH:mm"); // Formato compatible con datetime-local
    setSelectedDate(selected);
    setStart(selected);
    const newFilteredEvents = events.filter(
      (event) =>
        moment(event.start).format("YYYY-MM-DD") ===
        moment(slotInfo.start).format("YYYY-MM-DD")
    );
    setFilteredEvents(newFilteredEvents);
  };

  // Enviar una nueva reunión
  const handleSubmit = async (e) => {
    e.preventDefault();

    const promise = () =>
      new Promise((resolve) =>
        setTimeout(() => resolve({ name: "El evento" }), 2000)
      );

    toast.promise(promise, {
      loading: "Un momento...",
      success: (data) => {
        return `${data.name} ha sido añadido exitosamente`;
      },
      error: "Error al añadir el evento",
    });

    const newEvent = {
      titulo: title,
      descripcion: description,
      fechaInicio: new Date(start),
      fechaFin: new Date(start),
      enlace: link,
    };

    try {
      const response = await fetch("http://localhost:5000/api/reuniones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEvent),
      });

      const responseData = await response.json();

      if (response.ok) {
        fetchEvents();
        setTitle("");
        setDescription("");
        setStart("");
        setLink("");
      } else {
        console.error(
          "Error en la creación de la reunión:",
          responseData.message
        );
      }
    } catch (error) {
      toast.error("Hubo un error al crear el evento");
      console.error("Error al agregar reunión:", error);
    }
  };

  return (
    <>
      <Toaster richColors position="bottom-right" />
      <div className="calendar-container">
        <Card className="calendar-box overflow-hidden overflow-y-auto">
          <CardContent>
            <Dialog>
              <DialogTrigger className="sticky" asChild>
                <Button className="  action-btn bg-[#bee4db] text-[#00684a] font-bold border-transparent border-2 text-balance py-2 px-4">
                  {" "}
                  <img src={googleMeetIcon} />
                  Crear reunión
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Programa una nueva reunion</DialogTitle>
                  <DialogDescription>
                    Ingresa los datos de la reunión que quieres programar
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label>
                        Título de evento{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Título"
                        required
                      />

                      {/* <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Título"
                        required
                      /> */}
                    </div>
                    <div className=" flex flex-col space-y-2">
                      <Label>
                        {" "}
                        Fecha de evento{" "}
                        <span className="text-destructive">*</span>{" "}
                      </Label>
                      <input
                        className="p-2 outline-none border border-gray-300 rounded-md  focus-visible:ring-2"
                        type="datetime-local"
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>
                        Descripción de evento
                        <span className="text-destructive">*</span>{" "}
                      </Label>
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Descripción"
                        required
                      />
                    </div>

                    {/*  <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Descripción"
                      required
                    /> */}
                    <div className="space-y-2">
                      <div className="mb-2 flex items-center justify-between gap-1">
                        <Label className="leading-6">
                          Enlace de reunión virtual
                        </Label>
                        <span className="text-sm text-muted-foreground">
                          Opcional
                        </span>
                      </div>

                      <div className="relative">
                        <Input
                          type="text"
                          value={link}
                          onChange={(e) => setLink(e.target.value)}
                          placeholder="Enlace de reunión virtual"
                        />
                        <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80 peer-disabled:opacity-50">
                          <Link size={16} strokeWidth={2} aria-hidden="true" />
                        </div>
                      </div>
                    </div>
                    {/* <input
                        type="text"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        placeholder="Enlace de reunión virtual"
                      /> */}
                  </div>
                  <Button
                    type="submit"
                    className="action-btn bg-[#bee4db] text-[#00684a] font-bold border-transparent border-2"
                  >
                    Guardar
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              selectable
              onSelectSlot={handleSelectSlot}
              style={{
                height: "100%",
                // Adjust the 100px based on your header/navigation height
                width: "100%",
                minHeight: "390px",
                marginBottom: "20px",
              }}
              messages={messages}
              culture="es"
            />
          </CardContent>
        </Card>

        <Card className="meeting-list">
          <CardHeader>
            Reuniones para{" "}
            {selectedDate
              ? moment(selectedDate).format("LLL")
              : "selecciona una fecha"}
          </CardHeader>
          {filteredEvents.length > 0 ? (
            <div className="meeting-cards">
              {filteredEvents.map((event) => (
                <Card
                  key={event.id}
                  className="meeting-card space-y-2"
                  onClick={() => speakDetails(event)} // Leer en voz alta cuando se haga clic
                >
                  <h3>{event.title}</h3>

                  <CardDescription>
                    <p>{moment(event.start).format("LLL")}</p>
                    <p>{event.description}</p>
                  </CardDescription>
                  {event.enlace && (
                    <div className="virtual-link">
                      <a
                        href={event.enlace}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Acceder a la reunión virtual
                      </a>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <p>No hay reuniones programadas.</p>
          )}
        </Card>
      </div>
    </>
  );
};

export default CalendarComponent;
