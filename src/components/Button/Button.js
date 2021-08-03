import { useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './Button.module.css';

function Button({ onClick }) {
  useEffect(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  });
  return (
    <button type="button" onClick={onClick} className={styles.Button}>
      Load more
    </button>
  );
}

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
};
export default Button;
