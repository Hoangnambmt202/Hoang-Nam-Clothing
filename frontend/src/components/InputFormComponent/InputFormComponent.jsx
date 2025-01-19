

const InputFormComponent = (props) => {

    // eslint-disable-next-line react/prop-types
    const {placeholder, ...rests} = props;
    const handleOnChangeInput = (e) => {
      props.onChange(e.target.value);
    }
  
  return (

    // eslint-disable-next-line react/no-unknown-property, react/prop-types
    <input type="text" className="w-full px-6 py-2 border-b-2 mb-4 outline-none border-b border-gray-500" placeholder={placeholder} value={props.value} {...rests} onChange={handleOnChangeInput} />
  )
}
export default InputFormComponent;