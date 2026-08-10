import { Button as ButtonAnt } from 'antd';

import { ButtonPropTypes } from '../Chip/Chip.component.types';
import './Chip.css';

const Chip = ({ text, onClick, isActive }) => {
  return (
    <ButtonAnt className={`rounded-xl ${isActive ? 'btn-solid' : 'btn-outline'}`} onClick={onClick}>
      {text}
    </ButtonAnt>
  );
};

Chip.propTypes = ButtonPropTypes;
export default Chip;
