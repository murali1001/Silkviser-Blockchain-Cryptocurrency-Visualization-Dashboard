import { IBlock } from '../../shared/types';
import styles from './LedgerPage.module.scss';
import ProgressBar from './ProgressBar';
import pageImg from './images/block_image.png';

type ILedgerPageProps = {
  block: IBlock;
  index: number;
};

function LedgerPage({ block, index }: ILedgerPageProps) {
  // const backgroundColor = `rgba(226, 184, 131, ${1 - (0.5 / 7) * index})`;
  return (
    <div
      className={`p-2 m-2 ${styles.ledgerPageContainer}`}
      style={{
        backgroundImage: `url(${pageImg})`,
        backgroundSize: 'cover',
        opacity: 1 - (0.5 / 12) * index,
      }}
    >
      {block.leftLinkTime && (
        <>
          <div className={`${styles.linkLine} ${styles.timeLabel}`}>
            {block.leftLinkTime}s
          </div>
          <div className={`${styles.linkLine}`}>&lt;------------</div>
        </>
      )}
      <div className={`${styles.ledgerPage}`}>
        <div className={`${styles.pageHeader}`}>
          <div className={`${styles.pageHeaderSection}`}>
            Block Height
            <br />
            <span className={`${styles.pageHeaderSectionHighlight}`}>
              {block.blockHeight}
            </span>
          </div>
          <div className={`${styles.pageHeaderSection}`}>
            Confirmation
            <br />
            <span className={`${styles.pageHeaderSectionHighlight}`}>
              {block.confirmation}
            </span>
          </div>
        </div>
        <div className={`${styles.ledgerDataContainer}`}>
          <div className={`${styles.ledgerData}`}>
            Block hash: {block.blockHash}
          </div>
          <div className={`${styles.ledgerData}`}>
            Pre_block hash: {block.preBlockHash}
          </div>
          <div className={`${styles.ledgerData}`}>
            Merkle root: {block.merkleRoot}
          </div>
          <div className={`${styles.ledgerData}`}>Time: {block.time}</div>
        </div>

        <ProgressBar
          completed={block.transactions.completed}
          label={block.transactions.label}
        />
        <ProgressBar
          completed={block.blockSize.completed}
          label={block.blockSize.label}
        />
        <ProgressBar
          completed={block.blockReward.completed}
          label={block.blockReward.label}
        />
      </div>
    </div>
  );
}

export default LedgerPage;
