import React, { useState, useEffect } from 'react';

interface DataItem {
    month: string;
    sales: number;
    profit: number;
}

interface FilterPanelProps {
    data: DataItem[];
    setFilteredMonths: React.Dispatch<React.SetStateAction<string[]>>;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ data, setFilteredMonths }) => {
    const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
    const [months, setMonths] = useState<string[]>([]);

    useEffect(() => {
        const uniqueMonths = Array.from(new Set(data.map(item => item.month)));
        setMonths(uniqueMonths);
    }, [data]);

    const handleCheckboxChange = (month: string) => {
        const updatedMonths = selectedMonths.includes(month)
            ? selectedMonths.filter(item => item !== month)
            : [...selectedMonths, month];

        setSelectedMonths(updatedMonths);
        setFilteredMonths(updatedMonths);
    };

    return (
        <div>
            <h2>Filter Panel</h2>
            {months.map(month => (
                <label key={month}>
                    <input type="checkbox" checked={selectedMonths.includes(month)} onChange={() => handleCheckboxChange(month)} />
                    {month}
                </label>
            ))}
        </div>
    );
};

export default FilterPanel;
