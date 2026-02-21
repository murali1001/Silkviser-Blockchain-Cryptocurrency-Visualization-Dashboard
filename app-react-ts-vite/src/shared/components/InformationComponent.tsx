import React from 'react';
import { Table } from 'react-bootstrap';

interface KeyValueTableProps {
    data: Record<string, any>;
    title: string; // Add title prop

}

const KeyValueTable: React.FC<KeyValueTableProps> = ({ data, title }) => {
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
                    {Object.entries(data).map(([key, value]) => (
                        <tr key={key}>
                            <td>{key}</td>
                            <td>{value}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default KeyValueTable;
