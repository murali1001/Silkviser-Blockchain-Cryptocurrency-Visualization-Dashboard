import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AddressPage from './routes/address';
import BlockPage from './routes/block';
import BlockchainPage from './routes/blockchain';
import Transaction from './routes/transaction';
import Navbar from './shared/components/Navbar';
import Searchbar from './shared/components/Searchbar';

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Searchbar />
        <Routes>
          <Route path="/" element={<BlockchainPage />} />
          <Route path="/address/:addressHash" element={<AddressPage />} />
          <Route path="/block" element={<BlockPage />} />
          <Route path="/transaction/:txHash" element={<Transaction />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
