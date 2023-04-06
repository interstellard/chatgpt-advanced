import { h } from "preact"
import { useEffect, useState } from "preact/hooks"
import { getTranslation, localizationKeys } from "src/util/localization"
import { getUserConfig, updateUserConfig } from "src/util/userConfig"



const OptionsEditor = () => {

    const [trimLongText, setTrimLongText] = useState<boolean>(null)

    useEffect(() => {
        getUserConfig().then(config => {
            setTrimLongText(config.trimLongText)
        })
    }, [])

    return (

        <div className="wcg-flex wcg-w-4/5 wcg-flex-col wcg-gap-2">
            <h1 className="wcg-m-0 wcg-p-0 wcg-text-2xl">
                {getTranslation(localizationKeys.UI.options)}
            </h1 >
            <div class="wcg-form-control">
                <label className="wcg-label wcg-flex wcg-w-fit wcg-cursor-pointer wcg-items-center wcg-gap-2">
                    <span className="wcg-label-text wcg-text-lg">{getTranslation(localizationKeys.UI.trimLongText)}</span>
                    <input type="checkbox"
                        checked={trimLongText}
                        onChange={(e: Event) => {
                            const checkbox: HTMLInputElement = e.target as HTMLInputElement
                            setTrimLongText(checkbox.checked)
                            updateUserConfig({ trimLongText: checkbox.checked })
                        }}
                    />
                </label>
            </div>
        </div>
    )
}

export default OptionsEditor
