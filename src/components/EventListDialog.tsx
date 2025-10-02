import styled from 'styled-components';
import { Event } from '../App';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { X } from 'lucide-react';
import { motion } from 'motion/react';

interface EventListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  events: Event[];
  date: string;
  onDeleteEvent: (id: string) => void;
}

const EventsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 400px;
  overflow-y: auto;
`;

const EventItem = styled(motion.div)<{ $color: string }>`
  background-color: ${props => props.$color};
  color: #000;
  border-radius: 16px;
  padding: 0.75rem 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const DeleteButton = styled.button`
  opacity: 0.7;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  background: rgba(0, 0, 0, 0.2);
  transition: opacity 0.2s;
  
  ${EventItem}:hover & {
    opacity: 1;
  }
  
  &:hover {
    background: rgba(0, 0, 0, 0.4);
  }
`;

export const EventListDialog = ({ 
  open, 
  onOpenChange, 
  events, 
  date,
  onDeleteEvent 
}: EventListDialogProps) => {
  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${parseInt(month)}월 ${parseInt(day)}일`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{formatDate(date)} 일정</DialogTitle>
        </DialogHeader>
        <EventsList>
          {events.map((event, index) => (
            <EventItem
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              $color={event.color}
            >
              <span>{event.title}</span>
              <DeleteButton
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteEvent(event.id);
                }}
              >
                <X className="w-4 h-4" />
              </DeleteButton>
            </EventItem>
          ))}
        </EventsList>
      </DialogContent>
    </Dialog>
  );
};
