import { h } from "preact"

function Dropdown({ value, onChange, options }) {
    return (
        <select className="webchatgpt-dropdown text-sm dark:text-white ml-0 dark:bg-gray-800 border-0" value={value} onChange={onChange}>
            {options.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
            ))}
        </select>
    )
}

export default Dropdown
