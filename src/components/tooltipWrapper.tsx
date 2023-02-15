import { h, JSX } from "preact";

export const tooltipPositions = {
    top: "wcg-tooltip-top",
    bottom: "wcg-tooltip-bottom"
}


function TooltipWrapper(props: { tip: string, children: JSX.Element, position?: string }) {
    if (!props.tip) return props.children

    return (
        <span className={
            `wcg-tooltip ${props.position || tooltipPositions.bottom}
             wcg-normal-case before:wcg-text-xs before:wcg-content-[attr(data-tip)]`
        }
            data-tip={props.tip}>
            {props.children}
        </span>
    )

}

export default TooltipWrapper
