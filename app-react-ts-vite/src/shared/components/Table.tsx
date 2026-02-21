import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import './Table.scss';


interface TableRow {
  id: number;
  txhash: string;
  inaddr: number;
  outaddr: number;
  txsize: number;
  txfee: number;
}

interface TableProps {
  rows: TableRow[];
}
const columns: GridColDef[] = [
  { field: 'txhash', headerName: 'TxHash', width: 800, renderCell: renderTxHashCell, headerAlign: 'center', align: 'center' },
  { field: 'inaddr', headerName: 'In_addr', type: 'number', width: 100, headerAlign: 'center', align: 'center' },
  { field: 'outaddr', headerName: 'Out_addr', type: 'number', width: 100, headerAlign: 'center', align: 'center' },
  { field: 'txsize', headerName: 'TxSize (bytes)', type: 'number', width: 200, headerAlign: 'center', align: 'center' },
  {
    field: 'txfee',
    headerName: 'TxFee (BTC)',
    width: 320,
    type: 'number',
    editable: true,
    valueGetter: (params: GridValueGetterParams) => {
      if (typeof params.value === 'number') {
        return params.value.toFixed(8);
      }
      return null;
    },
    align: 'center',
    headerAlign: 'center'
  },
];


function renderTxHashCell(params: any) { // Change any to appropriate type
    const txHash = params.value as string;
    return (
      <Link to={`/transaction/${txHash}`} className="tx-hash-link">
        {txHash}
      </Link>
    );
  }

  const DataTable: React.FC<TableProps> = ({ rows}) => {
    return (
    <div style={{ height: 426.3, width: '92%'}} className={`mx-auto`}>
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
  );
}

export default DataTable;