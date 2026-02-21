import React, { useState } from 'react';
import { Table } from 'react-bootstrap';

interface KeyValueTableProps {
    data: Record<string, any>[]; // Change data type to array of objects
    title: string;
}

const KeyValueTable: React.FC<KeyValueTableProps> = ({ data, title }) => {
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    const handlePrevClick = () => {
        setSelectedIndex((prevIndex) => (prevIndex === 0 ? data.length - 1 : prevIndex - 1));
    };

    const handleNextClick = () => {
        setSelectedIndex((prevIndex) => (prevIndex === data.length - 1 ? 0 : prevIndex + 1));
    };

    const currentItem = data[selectedIndex];

    return (
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', paddingTop: '50px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '20px', left: '75px', color: '#4086ce' }}>
                <h6>{title}</h6>
            </div>
            <Table bordered hover style={{ width: '90%', fontSize: '14px', paddingLeft: '100px', fontFamily: 'Courier New, Courier, monospace' }}>
                <colgroup>
                    <col style={{ width: '20%' }} />
                    <col style={{ width: '80%' }} />
                </colgroup>
                <tbody>
                    {Object.entries(currentItem).map(([key, value]) => (
                        <tr key={key}>
                            <td>{key }</td>
                            <td style={{ paddingLeft: key === 'Block Height' ? '40px' : '10px' }}>{value}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div style={{ position: 'absolute', top: '58px', right: '1275px', color: '#3982c6' }}>
            <button style={{ fontSize: '10px', padding: '10px', borderRadius: '50%', backgroundColor: '#3982c6', color: 'white', border: 'none', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={handlePrevClick}>{'<'}</button>
            </div>
            <div style={{ position: 'absolute', top: '58px', right: '1175px', color: '#3982c6' }}>
            <button style={{ fontSize: '10px', padding: '10px', borderRadius: '50%', backgroundColor: '#3982c6', color: 'white', border: 'none', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={handleNextClick}>{'>'}</button>
            </div>
        </div>
    );
};

export default KeyValueTable;
