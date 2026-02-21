import { Link, LinkProps } from 'react-router-dom';
import { IBlockChain } from '../../shared/types';

import LedgerPage from './LedgerPage';

import styles from './Ledger.module.scss';

type ILedgerProps = {
  blockChain: IBlockChain;
};

const Ledger = ({ blockChain }: ILedgerProps) => {
  return (
    <div className={`my-auto justify-content-center ${styles.ledgerContainer}`}>
      {blockChain.map((block, index) => (
        <Link
          key={index}
          to={{
            pathname: '/block',
            search: `?hash=${block.originalBlockHash}`,
          }}
          style={{ color: 'black' }}
        >
          <LedgerPage block={block} index={index} />
        </Link>
      ))}
    </div>
  );
};

export default Ledger;
