import React from 'react';

interface FilterDashboardProps {
    months: string[];
    onFilterChange: (selectedMonths: string[]) => void;
}

const FilterDashboard: React.FC<FilterDashboardProps> = ({ months, onFilterChange }) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedIndex = parseInt(event.target.value);
        const selectedMonths = months.slice(0, selectedIndex + 1);
        console.log(selectedIndex);
        console.log(selectedMonths);
        onFilterChange(selectedMonths);
    };

    return (
        <div style={{ marginTop: '20px' }}>
            <label htmlFor="monthSlider" style={{paddingRight:'15px'}}>Drag & Play </label>
            <input
                type="range"
                id="monthSlider"
                name="monthSlider"
                min={0}
                max={months.length - 1}
                onChange={handleChange}
            />
        </div>
    );
};

export default FilterDashboard;
