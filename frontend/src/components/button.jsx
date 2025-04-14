import { MoonLoader } from "react-spinners"

export const Button = ({
    label = "Button",
    type = "Button",
    className = "",
    loading = false,
    disabled = false
}) => {
    return(
        <>
        <button  className={`cursor-pointer text-white bg-gradient-to-r from-[#800080] to-[#FF00FF] hover:from-[#DDA0DD] hover:to-[#FF00FF] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex justify-center align-center items-center gap-5 ${className}`}
        type={type} disabled = {disabled} loading = {loading}
        >
            {loading ? (<MoonLoader color="black" secondaryColor="white" size="30"/>):("")}
            {label}
        </button>
        </>
    )
}