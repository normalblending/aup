import * as React from "react";
import {useCallback, useEffect, useRef, useState} from "react";
import * as Tone from "tone";
import {OscParamForm} from "./OscParamForm";
import {KeyTrigger} from "../../components/KeyboardJS/KeyboardJSTrigger";

export interface OscProps {
    index: number
}

export const Osc: React.FC<OscProps> = ({index}) => {
    const osc = useRef<Tone.Oscillator>();
    const [started, setStarted] = useState(false);
    const [params, setParams] = useState<{}[]>([]);

    useEffect(() => {

        async function start() {
            await Tone.start();
            osc.current = new Tone.Oscillator(440, "sine").toDestination();
            osc.current.mute = true;
            osc.current.start();
        }

        start();
        return () => {
        };
    }, [osc]);
    const handleStart = React.useCallback(async () => {
        if (osc.current) {
            osc.current.mute = false;
            setStarted(true);
        }
    }, [osc]);
    const handleStop = React.useCallback(async () => {
        if (osc.current) {
            osc.current.mute = true;
            setStarted(false);
        }
    }, [osc]);
    const handleToggle = React.useCallback(async () => {
        if (osc.current) {
            osc.current.mute = !osc.current.mute;
            setStarted(!started);
        }
    }, [osc, started]);
    const handleApply = React.useCallback(async (_name, _value) => {
        if (osc.current) {
            try {

                const name = _name as ('type' | 'frequency' /*...*/);
                const value = _value as never;

                if (['frequency'].includes(name)) {
                    if (osc.current[name])
                        (osc.current[name] as any).value = value
                } else {
                    osc.current[name] = value;
                }
            } catch (e) {

            }
        }
    }, [osc]);

    const handleAddParam = React.useCallback(() => {
        setParams([...params, {}]);
    }, [params]);

    const key = index === 9 ? '0' : (index+1).toString();

    return (
        <div className={'oscItem'}>
            {!started ? (
                <button
                    className={'oscStartButton'}
                    onClick={handleStart}
                >▯{key ? <small>({key})</small> : ''}</button>
            ) : (
                <button
                    className={'oscStopButton'}
                    onClick={handleStop}
                >▮{key ? <small>({key})</small> : ''}</button>
            )}
            {index <= 9 && (
                <KeyTrigger codeValue={index === 9 ? '0' : (index+1).toString()} onPress={handleToggle}/>
            )}
            {params.map((_, _index) => {
                return <OscParamForm parentIndex={index} index={_index} key={_index} onApply={handleApply}/>
            })}
            <button
                className={'oscAddParamButton'}
                onClick={handleAddParam}>+
            </button>
        </div>
    );
};
