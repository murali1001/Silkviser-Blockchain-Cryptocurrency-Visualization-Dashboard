import { ITransactionList } from '../../shared/types';
import { mapRange } from '../../shared/utils/utils';
import CoinGlyph from './CoinGlyph';

type ICoinGlyphGroupProps = {
  transactions: ITransactionList;
};

function CoinGlyphGroup({ transactions }: ICoinGlyphGroupProps) {
  let transactionsCount = transactions.length;

  if (transactions.length > 14) {
    transactions = transactions.slice(0, 14);
  }

  let minInner = Math.min(...transactions.map((t) => t.inaddr));
  let minOuter = Math.min(...transactions.map((t) => t.inaddr));
  let maxInner = Math.max(...transactions.map((t) => t.inaddr));
  let maxOuter = Math.max(...transactions.map((t) => t.outaddr));

  const degMapper = mapRange(
    Math.min(minInner, minOuter),
    Math.max(maxInner, maxOuter),
    30,
    160
  );

  const txSizeMapper = mapRange(
    Math.min(...transactions.map((t) => t.txsize)),
    Math.max(...transactions.map((t) => t.txsize)),
    20,
    30
  );
  const txFeeMapper = mapRange(
    Math.min(...transactions.map((t) => t.txfee)),
    Math.max(...transactions.map((t) => t.txfee)),
    0.6,
    1
  );

  return (
    <div style={{ display: 'flex' }}>
      <div
        style={{
          backgroundColor: '#e6ddd5',
          padding: '1px',
          marginLeft: '80px',
          marginBottom: '50px',
          marginRight: '25px',
        }}
      >
        <div
          style={{
            paddingBottom: '0px',
            padding: '2px',
            paddingTop: '5px',
            marginTop: '10px',
            textAlign: 'center',
            fontFamily: 'Courier New, Courier, monospace',
            color: '#978272',
          }}
        >
          <p>Transactions</p>
          <p style={{ fontSize: '24px', margin: '0', paddingTop: '0px' }}>
            {transactionsCount}
          </p>
        </div>
      </div>
      <div style={{ paddingLeft: '0px' }}>
        {transactions.map((transaction, index) => (
          <CoinGlyph
            leftDeg={degMapper(transaction.inaddr)}
            rightDeg={degMapper(transaction.outaddr)}
            txSize={txSizeMapper(transaction.txsize)}
            opacity={txFeeMapper(transaction.txfee)}
            txHash={transaction.txhash}
            key={index}
          />
        ))}
        <div style={{ display: 'inline-block', marginRight: '5px' }}>
          <span style={{ fontSize: '18px' }}>. . . . . .</span>
        </div>
      </div>
    </div>
  );
}

export default CoinGlyphGroup;
