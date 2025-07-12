

export let Input = ({
    placeholder = "",
    type = "text",
    label = "",
    name = "",
    isRequired = false,
    className = "",
    value = "",
    disable = "",
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
             name={name} id={name} disabled = {disable}
             autoComplete={type === "password" ? "off" : "on"}
             className={`  border-2 border-gray-300 rounded-md p-2 w-full p-2.5 focus:bg-[#E6E6FA] block ${className}`}
            value={value} onChange={onchange}
            />
        </div>
        </>
    )
}