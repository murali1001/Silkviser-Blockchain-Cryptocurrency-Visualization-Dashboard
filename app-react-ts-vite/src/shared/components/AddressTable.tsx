import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import './Table.scss';
import { IAddressTableRow } from '../types';

const columns: GridColDef[] = [
  {
    field: 'txhash',
    headerName: 'TxHash',
    width: 800,
    renderCell: renderTxHashCell,
    headerAlign: 'center',
    align: 'center',
  },
  {
    field: 'inaddr',
    headerName: 'In_addr',
    type: 'number',
    width: 100,
    headerAlign: 'center',
    align: 'center',
  },
  {
    field: 'outaddr',
    headerName: 'Out_addr',
    type: 'number',
    width: 100,
    headerAlign: 'center',
    align: 'center',
  },
  {
    field: 'confirmations',
    headerName: 'Confirmations',
    type: 'number',
    width: 180,
    headerAlign: 'center',
    align: 'center',
  },
  {
    field: 'txtime',
    headerName: 'Tx Time',
    width: 300,
    headerAlign: 'center',
    align: 'center',
  },
];

function renderTxHashCell(params: any) {
  const txHash = params.value as string;
  return (
    <Link to={`/transaction/${txHash}`} className="tx-hash-link">
      {txHash}
    </Link>
  );
}

type IAddressTableProps = {
  rows: Array<IAddressTableRow> | undefined;
};

export default function AddressTable({ rows }: IAddressTableProps) {
  return (
    <>
      {rows ? (
        <div style={{ height: 426.3, width: '92%' }} className={`mx-auto`}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10]}
          />
        </div>
      ) : null}
    </>
  );
}
