import { useState } from 'react';
import styled from 'styled-components';
import { Event } from '../App';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { MonthYearPicker } from './MonthYearPicker';
import { Button } from './ui/button';
import { EventListDialog } from './EventListDialog';

interface CalendarProps {
  month: number;
  year: number;
  events: Event[];
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDeleteEvent: (id: string) => void;
  onMonthYearSelect: (month: number, year: number) => void;
  onGoToToday: () => void;
}

const CalendarContainer = styled.div`
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const HeaderLeft = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const NavButton = styled.button`
  padding: 0.5rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.5);
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.8);
    transform: scale(1.1);
  }
`;

const WeekDaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
`;

const WeekDay = styled.div`
  text-align: center;
  color: white;
  font-size: 1.5rem;
  font-weight: 500;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1rem;
`;

const EmptyDay = styled.div`
  aspect-ratio: 1;
`;

const DayCell = styled.div<{ $isSelected: boolean }>`
  aspect-ratio: 1;
  border: 2px solid ${props => props.$isSelected ? '#fcd34d' : 'white'};
  background: ${props => props.$isSelected ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.2)'};
  backdrop-filter: blur(12px);
  border-radius: 8px;
  padding: 0.5rem;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }
`;

const DayNumber = styled.div`
  color: white;
  font-size: 1.875rem;
  font-weight: 300;
`;

const EventsContainer = styled.div`
  position: absolute;
  top: 3rem;
  left: 0;
  right: 0;
  padding: 0 0.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const EventSticker = styled(motion.div)<{ $color: string; $rotation: number }>`
  background-color: ${props => props.$color};
  color: #000;
  border-radius: 16px;
  padding: 0.25rem 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  position: relative;
  font-size: 0.75rem;
  font-weight: 500;
  z-index: ${props => props.style?.zIndex || 10};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const EventTitle = styled.span`
  display: inline-block;
  max-width: 70%;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DeleteButton = styled.button`
  margin-left: 0.25rem;
  opacity: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  border-radius: 9999px;
  background: rgba(0, 0, 0, 0.2);
  position: absolute;
  right: 0.25rem;
  top: 50%;
  transform: translateY(-50%);
  transition: opacity 0.2s;
  
  ${EventSticker}:hover & {
    opacity: 1;
  }
  
  &:hover {
    background: rgba(0, 0, 0, 0.4);
  }
`;

const MoreButton = styled(motion.button)`
  width: 100%;
  border-radius: 8px;
  padding: 0.25rem 0.5rem;
  color: white;
  background: rgba(255, 255, 255, 0.3);
  font-size: 0.75rem;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.5);
  }
`;

export const Calendar = ({ 
  month, 
  year, 
  events, 
  selectedDate,
  onDateSelect,
  onPrevMonth,
  onNextMonth,
  onDeleteEvent,
  onMonthYearSelect,
  onGoToToday,
}: CalendarProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogEvents, setDialogEvents] = useState<Event[]>([]);
  const [dialogDate, setDialogDate] = useState('');

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  
  const weekDays = ['S', 'M', 'T', 'W', 'Th', 'F', 'S'];
  const MAX_VISIBLE_EVENTS = 2;
  
  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  const handleDateClick = (day: number) => {
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    onDateSelect(dateStr);
  };

  const isSelectedDate = (day: number) => {
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return selectedDate === dateStr;
  };

  const handleShowAllEvents = (day: number, dayEvents: Event[]) => {
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    setDialogDate(dateStr);
    setDialogEvents(dayEvents);
    setDialogOpen(true);
  };
  
  return (
    <CalendarContainer>
      <Header>
        <HeaderLeft>
          <NavButton onClick={onPrevMonth}>
            <ChevronLeft className="w-8 h-8 text-gray-700" />
          </NavButton>
          
          <MonthYearPicker 
            currentMonth={month}
            currentYear={year}
            onSelect={onMonthYearSelect}
          />
        </HeaderLeft>
        
        <Button
          onClick={onGoToToday}
          className="bg-white/70 hover:bg-white/90 text-gray-800"
        >
          오늘
        </Button>
        
        <NavButton onClick={onNextMonth}>
          <ChevronRight className="w-8 h-8 text-gray-700" />
        </NavButton>
      </Header>

      <WeekDaysGrid>
        {weekDays.map((day, index) => (
          <WeekDay key={index}>{day}</WeekDay>
        ))}
      </WeekDaysGrid>
      
      <DaysGrid>
        {emptyDays.map((_, index) => (
          <EmptyDay key={`empty-${index}`} />
        ))}
        
        {days.map((day) => {
          const dayEvents = getEventsForDay(day);
          const isSelected = isSelectedDate(day);
          const visibleEvents = dayEvents.slice(0, MAX_VISIBLE_EVENTS);
          const remainingCount = dayEvents.length - MAX_VISIBLE_EVENTS;
          
          return (
            <DayCell 
              key={day} 
              onClick={() => handleDateClick(day)}
              $isSelected={isSelected}
            >
              <DayNumber>{day}</DayNumber>
              
              <EventsContainer>
                <AnimatePresence>
                  {visibleEvents.map((event, index) => (
                    <EventSticker
                      key={event.id}
                      initial={{ scale: 0, rotate: 0, x: -50 }}
                      animate={{ 
                        scale: 1, 
                        rotate: event.rotation,
                        x: 0
                      }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: index * 0.05
                      }}
                      $color={event.color}
                      $rotation={event.rotation}
                      style={{ zIndex: 10 + index }}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <EventTitle>{event.title}</EventTitle>
                      <DeleteButton
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteEvent(event.id);
                        }}
                      >
                        <X className="w-3 h-3" />
                      </DeleteButton>
                    </EventSticker>
                  ))}
                </AnimatePresence>
                
                {remainingCount > 0 && (
                  <MoreButton
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShowAllEvents(day, dayEvents);
                    }}
                  >
                    +{remainingCount}개 더보기
                  </MoreButton>
                )}
              </EventsContainer>
            </DayCell>
          );
        })}
      </DaysGrid>

      <EventListDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        events={dialogEvents}
        date={dialogDate}
        onDeleteEvent={(id) => {
          onDeleteEvent(id);
          setDialogEvents(dialogEvents.filter(e => e.id !== id));
        }}
      />
    </CalendarContainer>
  );
};
