

export let Input = ({
    placeholder = "",
    type = "text",
    label = "",
    name = "",
    isRequired = false,
    className = "",
    value = "",
    onchange = () => {}

}) => {

    

    return (
        <>
        <div className = "h-[50%] w-[100%]">
            <label htmlFor = {name} className="">
                {label}
            </label>

            <input
             type={type} placeholder={placeholder} required = {isRequired}
             name={name} id={name}
             className={` border-2 border-gray-300 rounded-md p-2 w-full p-2.5 focus:border-red-400 focus:ring-blue-500 block ${className}`}
            value={value} onChange={onchange}
            />
        </div>
        </>
    )
}