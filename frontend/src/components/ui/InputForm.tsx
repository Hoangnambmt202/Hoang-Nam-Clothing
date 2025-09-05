const InputForm = (props: any) => {
  const { placeholder, onChange, className, ...rests } = props;

  const handleOnChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <input
      {...rests}
      placeholder={placeholder}
      value={props.value}
      onChange={handleOnChangeInput}
      className={`w-full px-6 py-2 border-b-2 mb-4 outline-none border-gray-500 ${className ?? ""}`}
    />
  );
};

export default InputForm;
