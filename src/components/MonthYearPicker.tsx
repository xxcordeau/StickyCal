import { useState } from 'react';
import styled from 'styled-components';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthYearPickerProps {
  currentMonth: number;
  currentYear: number;
  onSelect: (month: number, year: number) => void;
}

const TriggerButton = styled.button`
  padding: 0.5rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.5);
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.8);
    transform: scale(1.1);
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const YearNavigator = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const YearButton = styled.button`
  padding: 0.25rem;
  border-radius: 4px;
  
  &:hover {
    background: #f3f4f6;
  }
`;

const YearText = styled.span`
  font-weight: 600;
`;

const MonthGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
`;

const MonthButton = styled.button<{ $isActive: boolean }>`
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s;
  background: ${props => props.$isActive ? '#e5e7eb' : 'transparent'};
  font-weight: ${props => props.$isActive ? '600' : '400'};
  
  &:hover {
    background: #f3f4f6;
  }
`;

export const MonthYearPicker = ({ currentMonth, currentYear, onSelect }: MonthYearPickerProps) => {
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [open, setOpen] = useState(false);

  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];

  const handleMonthSelect = (month: number) => {
    onSelect(month, selectedYear);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <TriggerButton>
          <CalendarIcon className="w-8 h-8 text-gray-700" />
        </TriggerButton>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="center">
        <ContentWrapper>
          <YearNavigator>
            <YearButton onClick={() => setSelectedYear(selectedYear - 1)}>
              <ChevronLeft className="w-5 h-5" />
            </YearButton>
            <YearText>{selectedYear}년</YearText>
            <YearButton onClick={() => setSelectedYear(selectedYear + 1)}>
              <ChevronRight className="w-5 h-5" />
            </YearButton>
          </YearNavigator>

          <MonthGrid>
            {monthNames.map((month, index) => (
              <MonthButton
                key={index}
                onClick={() => handleMonthSelect(index + 1)}
                $isActive={currentMonth === index + 1 && currentYear === selectedYear}
              >
                {month}
              </MonthButton>
            ))}
          </MonthGrid>
        </ContentWrapper>
      </PopoverContent>
    </Popover>
  );
};
