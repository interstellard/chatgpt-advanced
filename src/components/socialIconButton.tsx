import { h, JSX } from "preact";
import TooltipWrapper from "./tooltipWrapper";

function IconButton(props: { url: string, tip: string, icon: JSX.Element }) {
    return (
        <TooltipWrapper tip={props.tip}>
            <a href={props.url} target="_blank" rel="noopener noreferrer">
                <div className="wcg-btn wcg-btn-ghost wcg-p-2 wcg-px-4">
                    {props.icon}
                </div>
            </a>
        </TooltipWrapper>
    )
}

export default IconButton
