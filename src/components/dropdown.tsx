import { h, JSX } from "preact"

function Dropdown(props: {
    value: string | number
    onChange: (e: any) => void
    options: Array<{ value: any; label: string }>
    onClick?: (e: any) => void
}): JSX.Element {
    
    return (
        <select className="wcg-bg-[#343541] wcg-text-white wcg-text-sm wcg-block wcg-p-2.5 wcg-pr-2 wcg-border-0 focus:wcg-ring-0 wcg-max-w-[9.5rem]"
            value={props.value}
            onChange={props.onChange}
            onClick={props.onClick}
        >
            {props.options.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
            ))}
        </select>
    )
}

export default Dropdown
