import { useState } from 'react';
import styled from 'styled-components';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface EventInputProps {
  selectedDate: string | null;
  onAddEvent: (date: string, title: string) => void;
  currentMonth: number;
  currentYear: number;
}

const Container = styled.div`
  margin-top: 2rem;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const FlexWrapper = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const InputWrapper = styled.div`
  flex: 1;
  min-width: 200px;
`;

const DateInfo = styled.div`
  margin-bottom: 0.5rem;
`;

const DateText = styled.span`
  color: white;
  font-size: 1.125rem;
`;

const DateValue = styled.span`
  font-weight: 600;
`;

export const EventInput = ({ selectedDate, onAddEvent, currentMonth, currentYear }: EventInputProps) => {
  const [eventTitle, setEventTitle] = useState('');
  
  const handleAddEvent = () => {
    if (eventTitle.trim() && selectedDate) {
      onAddEvent(selectedDate, eventTitle);
      setEventTitle('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddEvent();
    }
  };

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${parseInt(month)}월 ${parseInt(day)}일`;
  };
  
  return (
    <Container>
      <FlexWrapper>
        <InputWrapper>
          {selectedDate ? (
            <DateInfo>
              <DateText>
                선택된 날짜: <DateValue>{formatDate(selectedDate)}</DateValue>
              </DateText>
            </DateInfo>
          ) : (
            <DateInfo>
              <DateText>
                달력에서 날짜를 선택하세요
              </DateText>
            </DateInfo>
          )}
          <Input
            type="text"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="일정을 입력하세요..."
            className="bg-white/80 border-white/50"
            disabled={!selectedDate}
          />
        </InputWrapper>
        
        <Button 
          onClick={handleAddEvent}
          disabled={!selectedDate || !eventTitle.trim()}
          className="bg-white/90 text-gray-800 hover:bg-white hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          추가
        </Button>
      </FlexWrapper>
    </Container>
  );
};
