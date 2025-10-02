import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Calendar } from './components/Calendar';
import { EventInput } from './components/EventInput';
import { projectId, publicAnonKey } from './utils/supabase/info';

export interface Event {
  id: string;
  date: string;
  title: string;
  color: string;
  rotation: number;
}

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom right, #f3f4f6, #e5e7eb);
  padding: 2rem;
`;

const MaxWidthWrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: white;
  font-size: 4rem;
  font-weight: 300;
  letter-spacing: 0.05em;
`;

const LoadingContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom right, #f3f4f6, #e5e7eb);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingText = styled.div`
  color: white;
  font-size: 1.5rem;
`;

const App = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const fetchEvents = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-9829a803/events`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );
      
      if (!response.ok) {
        const error = await response.text();
        console.log('Error fetching events:', error);
        return;
      }
      
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.log('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const addEvent = async (date: string, title: string) => {
    const colors = [
      '#93C5FD', '#FDE047', '#F9A8D4', '#86EFAC',
      '#FCA5A5', '#C4B5FD', '#FDBA74',
    ];
    
    const newEvent = {
      date,
      title,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 6 - 3,
    };
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-9829a803/events`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newEvent),
        }
      );
      
      if (!response.ok) {
        const error = await response.text();
        console.log('Error adding event:', error);
        return;
      }
      
      const data = await response.json();
      setEvents([...events, data.event]);
      
      const [year, month] = date.split('-');
      setCurrentYear(parseInt(year));
      setCurrentMonth(parseInt(month));
    } catch (error) {
      console.log('Error adding event:', error);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-9829a803/events/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );
      
      if (!response.ok) {
        const error = await response.text();
        console.log('Error deleting event:', error);
        return;
      }
      
      setEvents(events.filter(e => e.id !== id));
    } catch (error) {
      console.log('Error deleting event:', error);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleMonthYearSelect = (month: number, year: number) => {
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  const handleGoToToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth() + 1);
    setCurrentYear(today.getFullYear());
  };

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingText>Loading...</LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <MaxWidthWrapper>
        <Title>
          {monthNames[currentMonth - 1]} {currentYear}
        </Title>
        
        <Calendar 
          month={currentMonth}
          year={currentYear}
          events={events}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onDeleteEvent={deleteEvent}
          onMonthYearSelect={handleMonthYearSelect}
          onGoToToday={handleGoToToday}
        />
        
        <EventInput 
          selectedDate={selectedDate}
          onAddEvent={addEvent}
          currentMonth={currentMonth}
          currentYear={currentYear}
        />
      </MaxWidthWrapper>
    </Container>
  );
};

export default App;
