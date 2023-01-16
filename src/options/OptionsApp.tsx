import { h } from "preact"
import "../style/base.css"
// import icon from "../assets/icons/icon48.png"

export default function App() {

    return (
        <div className="wcg-container wcg-mx-auto">
            <nav className="wcg-flex wcg-flex-row wcg-justify-between wcg-items-center wcg-px-2">
                <div className="wcg-flex wcg-flex-row wcg-items-center wcg-gap-2">
                    <img src="../icons/icon48.png" alt="logo" className="wcg-h-8 wcg-w-8" />
                    <span className="wcg-text-2xl wcg-font-bold">WebChatGPT</span>
                </div>
            </nav>
        </div>
    )
}