const primary = 'text-white hover:bg-brand-primary-hover bg-brand-primary';
const secondary = 'bg-white text-gray-600 border border-gray-300 hover:border-gray-400';

const Button = (props) => {
  const { handleOnClick, text, disabled = false, variant = 'primary' } = props;

  const additionalProps = variant === 'primary' ? primary : secondary;

  return (
    <button
      className={`w-full px-8 py-2 max-h-[40px] rounded-full text-base md:!min-w-48 ${additionalProps} transition-colors`}
      onClick={handleOnClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
