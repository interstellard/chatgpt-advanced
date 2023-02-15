import { h, JSX } from "preact"

function Dropdown(props: {
    value: string | number
    onChange: any
    options: Array<{ value: string | number; label: string }>
}): JSX.Element {

    return (
        <select className="wcg-block wcg-max-w-[9.5rem] wcg-border-0 wcg-bg-[#343541] wcg-p-2.5 wcg-pr-2 wcg-text-sm wcg-text-white focus:wcg-ring-0"
            value={props.value}
            onChange={props.onChange}
        >
            {props.options.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
            ))}
        </select>
    )
}

export default Dropdown
