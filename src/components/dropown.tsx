import { h } from "preact"

function Dropdown({ value, onChange, options }) {
    return (
        <select className="wcg-dropdown wcg-bg-transparent wcg-text-sm wcg-block wcg-p-2.5 wcg-pr-6 wcg-border-0 dark:bg-gray-800" value={value} onChange={onChange}>
            {options.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
            ))}
        </select>
    )
}

export default Dropdown
