import styles from './ProgressBar.module.scss';
import { IBlockProgress } from '../../shared/types';

const ProgressBar = ({ completed, label }: IBlockProgress) => {
  // Inline style for the filler element
  const fillerStyles = {
    width: `${completed}%`,
  };

  return (
    <div className={`${styles.progressBar}`}>
      <div className={`${styles.progressBarFiller}`} style={fillerStyles}></div>
      <div className={`${styles.progressBarLabel}`}>{label}</div>
    </div>
  );
};

export default ProgressBar;
