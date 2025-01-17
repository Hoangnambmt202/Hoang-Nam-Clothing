
import { useState } from "react"

const InputFormComponent = (props) => {
    // eslint-disable-next-line no-unused-vars
    const [valueInput,setValueInput] = useState();
    // eslint-disable-next-line react/prop-types
    const {placeholder, ...rests} = props;
  return (

    // eslint-disable-next-line react/no-unknown-property
    <input type="text" className="w-full px-6 py-2 border-b-2 mb-4 outline-none border-b border-gray-500" placeholder={placeholder} valueInput={valueInput} {...rests} />
  )
}
export default InputFormComponent;