import { h } from "preact";

function SocialIconButton(props: { url: string, tip: string, icon: JSX.Element }) {
    return (
        <span className="wcg-tooltip wcg-tooltip-bottom wcg-normal-case before:wcg-text-xs before:wcg-content-[attr(data-tip)]" data-tip={props.tip}>
            <a href={props.url} target="_blank" rel="noopener noreferrer">
                <div className="wcg-btn wcg-btn-ghost wcg-p-2 wcg-px-4">
                    {props.icon}
                </div>
            </a>
        </span>
    )
}

export default SocialIconButton