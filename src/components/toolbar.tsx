import { h } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { getUserConfig, updateUserConfig } from 'src/util/userConfig';
import Dropdown from './dropown';

const numResultsOptions = Array.from({ length: 10 }, (_, i) => i + 1).map((num) => ({
    value: num,
    label: `${num} result${num === 1 ? '' : 's'}`
}));

const timePeriodOptions = [
    { value: "", label: "Any time" },
    { value: "d", label: "Past day" },
    { value: "w", label: "Past week" },
    { value: "m", label: "Past month" },
    { value: "y", label: "Past year" }
];

function useUserConfig() {
    const [webAccess, setWebAccess] = useState(true);
    const [numResults, setNumResults] = useState(3);
    const [timePeriod, setTimePeriod] = useState('');

    useEffect(() => {
        getUserConfig().then((userConfig) => {
            setWebAccess(userConfig.webAccess);
            setNumResults(userConfig.numWebResults);
            setTimePeriod(userConfig.timePeriod);
        });
    }, []);

    return {
        webAccess,
        setWebAccess,
        numResults,
        setNumResults,
        timePeriod,
        setTimePeriod
    };
}

function Toolbar() {
    const { webAccess, setWebAccess, numResults, setNumResults, timePeriod, setTimePeriod } = useUserConfig();

    const handleWebAccessToggle = useCallback(() => {
        setWebAccess(!webAccess);
        updateUserConfig({ webAccess: !webAccess });
    }, [webAccess]);

    const handleNumResultsChange = useCallback((e: { target: { value: string; }; }) => {
        const value = parseInt(e.target.value);
        setNumResults(value);
        updateUserConfig({ numWebResults: value });
    }, [numResults]);

    const handleTimePeriodChange = useCallback((e: { target: { value: string; }; }) => {
        setTimePeriod(e.target.value);
        updateUserConfig({ timePeriod: e.target.value });
    }, [timePeriod]);

    return (
        <div className="webchatgpt-toolbar flex items-baseline gap-3 mt-0 p-0 px-2">
            <label class="webchatgpt-toggle relative inline-flex items-center mr-5 cursor-pointer">
                <input type="checkbox" value="" class="sr-only peer" checked={webAccess} onChange={handleWebAccessToggle} />
                <div class="w-9 h-5 bg-gray-500 rounded-full peer dark:bg-gray-704 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-700" />
                <span className="webchatgpt-toggle-label ml-3">Search on the web</span>
            </label>
            <Dropdown
                value={numResults}
                onChange={handleNumResultsChange}
                options={numResultsOptions}
            />
            <Dropdown
                value={timePeriod}
                onChange={handleTimePeriodChange}
                options={timePeriodOptions}
            />

        </div>
    );
}

export default Toolbar;
