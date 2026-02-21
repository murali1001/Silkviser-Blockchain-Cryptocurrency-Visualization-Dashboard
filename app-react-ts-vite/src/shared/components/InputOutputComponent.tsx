import React, {useState } from 'react';
import Table from 'react-bootstrap/Table';
import { TablePagination } from '@mui/material';
import { Link } from 'react-router-dom';


interface AddressItem {
    address: string;
    amount: number;
}



interface DualTableProps {
    inputAddresses: AddressItem[];
    outputAddresses: AddressItem[];
}

const DualTable: React.FC<DualTableProps> = ({ inputAddresses, outputAddresses }) => {


       const [inputPage, setInputPage] = useState(0);
       const [inputRowsPerPage, setInputRowsPerPage] = useState(5);
       const [outputPage, setOutputPage] = useState(0);
       const [outputRowsPerPage, setOutputRowsPerPage] = useState(5);
    const handleInputPageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setInputPage(newPage);
    };

    const handleInputRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInputRowsPerPage(parseInt(event.target.value, 10));
        setInputPage(0); 
    };

    const handleOutputPageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setOutputPage(newPage);
    };

    const handleOutputRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setOutputRowsPerPage(parseInt(event.target.value, 10));
        setOutputPage(0);
    };

    return (
        <div style={{ display: 'flex', margin: 'auto', maxWidth: '2000px', paddingLeft: '100px' }}>
            <div style={{ width: '48%', paddingRight: '10px' }}>
                <h6 style={{ borderBottom: '2px solid gray', color: '#4086ce', paddingBottom: '5px' }}>Input Addresses</h6>
                <Table bordered hover style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th>Address</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Display input addresses based on pagination */}
                        {inputAddresses.slice(inputPage * inputRowsPerPage, (inputPage + 1) * inputRowsPerPage).map((item, index) => (
                            <tr key={index}>
                                <td><Link to={`/address/${item.address}`} style={{ color: '#4086ce' }}>{item.address}</Link></td>
                                <td>{item.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                {/* Input addresses pagination */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={inputAddresses.length}
                    rowsPerPage={inputRowsPerPage}
                    page={inputPage}
                    onPageChange={handleInputPageChange}
                    onRowsPerPageChange={handleInputRowsPerPageChange}
                />
                </div>
            </div>
            <div style={{ width: '48%', paddingLeft: '10px' }}>
                <h6 style={{ borderBottom: '2px solid gray', color: '#4086ce', paddingBottom: '5px' }}>Output Addresses</h6>
                <Table bordered hover style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th>Address</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Display output addresses based on pagination */}
                        {outputAddresses.slice(outputPage * outputRowsPerPage, (outputPage + 1) * outputRowsPerPage).map((item, index) => (
                            <tr key={index}>
                                <td><Link to={`/address/${item.address}`} style={{ color: '#4086ce' }}>{item.address}</Link></td>
                                <td>{item.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                {/* Output addresses pagination */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={outputAddresses.length}
                    rowsPerPage={outputRowsPerPage}
                    page={outputPage}
                    onPageChange={handleOutputPageChange}
                    onRowsPerPageChange={handleOutputRowsPerPageChange}

                />
                </div>
            </div>
        </div>
    );
};

export default DualTable;