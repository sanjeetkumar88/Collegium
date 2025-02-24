import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Create the localizer directly (no need for useState)
const localizer = momentLocalizer(moment);

// Example events
const initialEvents = [
  {
    id: 1,
    title: "React Developer Conference",
    start: new Date(2025, 1, 16, 10, 0), // February 16, 2025 10:00 AM
    end: new Date(2025, 1, 17, 16, 0), // February 17, 2025 4:00 PM
    location: "Online",
  },
  { 
    id: 2, 
    title: "JavaScript Meetup",
    start: new Date(2025, 3, 20, 14, 0), // April 20, 2025 2:00 PM
    end: new Date(2025, 3, 20, 18, 0), // April 20, 2025 6:00 PM
    location: "New York, USA",
  },
  {
    id: 3,
    title: "Frontend Dev Workshop",
    start: new Date(2024, 4, 10, 9, 0), // May 10, 2025 9:00 AM
    end: new Date(2024, 4, 10, 12, 0), // May 10, 2025 12:00 PM
    location: "San Francisco, USA",
  },
];

const isEventPast = (eventEnd) => {
  const now = new Date();
  return eventEnd < now;
};

function Events() {
  const [events, setEvents] = useState(initialEvents);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: '',
    end: '',
    location: ''
  });

  // Function to separate events into upcoming and past
  const filterEvents = () => {
    const upcoming = [];
    const past = [];
    
    events.forEach(event => {
      if (isEventPast(event.end)) {
        past.push(event);
      } else {
        upcoming.push(event);
      }
    });
    
    setUpcomingEvents(upcoming);
    setPastEvents(past);
  };

  // Filter events based on the search query
  const handleSearch = () => {
    const filteredEvents = events.filter((event) => 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setUpcomingEvents(filteredEvents.filter(event => !isEventPast(event.end)));
    setPastEvents(filteredEvents.filter(event => isEventPast(event.end)));
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value
    });
  };

  // Handle form submission to add new event
  const handleAddEvent = (e) => {
    e.preventDefault();
    const event = {
      id: events.length + 1,
      ...newEvent,
      start: new Date(newEvent.start),
      end: new Date(newEvent.end)
    };
    setEvents([...events, event]);
    setShowAddEventForm(false);
    filterEvents();
  };

  useEffect(() => {
    filterEvents();
  }, [events]);

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Calendar Section */}
      <div className="calendar-container p-4 w-full lg:w-3/4">
        <h1 className="text-2xl font-bold mb-4">Events Calendar</h1>
        <div>
          <Calendar
            localizer={localizer}
            events={events}
            defaultView="month"
            startAccessor="start"
            endAccessor="end"
            style={{ height: 800 }}
          />
        </div>
      </div>

      {/* Events List Section */}
      <div className="events-list p-4 w-full lg:w-1/4 mt-8 lg:mt-0">
      
        <div className="mb-8 flex justify-between">
          <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
          <div>
            
          </div>
        </div>

        {/* Search Events */}
        <div className="mb-4">
          <input
            type="text"
            className="p-2 border rounded-lg"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer"
          >
            Search
          </button>
        </div>

        

        {/* Display Upcoming Events */}
        <div>
          {upcomingEvents.map((event) => (
            <div key={event.id} className="mb-4 border p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold">{event.title}</h3>
              <p>{event.location}</p>
              <p>{moment(event.start).format('MMMM Do YYYY, h:mm a')} - {moment(event.end).format('h:mm a')}</p>
              <div className="flex space-x-4 mt-2">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 cursor-pointer"
                  disabled={isEventPast(event.end)}
                >
                  {isEventPast(event.end) ? "Registration Closed" : "Register"}
                </button>
                <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-400 cursor-pointer">
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Display Past Events */}
        <div>
          <h2 className="text-xl font-bold mb-4">Past Events</h2>
          <div>
            {pastEvents.map((event) => (
              <div key={event.id} className="mb-4 border p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold">{event.title}</h3>
                <p>{event.location}</p>
                <p>{moment(event.start).format('MMMM Do YYYY, h:mm a')} - {moment(event.end).format('h:mm a')}</p>
                <div className="flex space-x-4 mt-2">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 cursor-pointer"
                    disabled
                  >
                    Registration Closed
                  </button>
                  <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-400 cursor-pointer">
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Events;
