import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface CalendarProps {
    selectedDate: Date;
    onChange: (date: Date) => void;
}

export default function Calendar({ selectedDate, onChange }: CalendarProps) {
    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && onChange(date)}
                disabled={{ before: new Date() }}
                className="mx-auto"
                modifiersClassNames={{
                    selected: 'bg-indigo-600 text-white',
                    today: 'font-bold text-indigo-600',
                }}
            />
        </div>
    );
} 