import * as React from "react";
import {forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState} from "react";
import * as Tone from "tone";
import {OscParamForm} from "./OscParamForm";
import {KeyTrigger} from "../../components/KeyboardJS/KeyboardJSTrigger";

export interface OscProps {
    index: number
    onConnectRequest: (oscNumber: number, signal: Tone.Signal) => void
}

export interface OscImperativeHandlers {
    connect: (signal: Tone.Signal) => void
}

export const Osc = forwardRef<OscImperativeHandlers, OscProps>(({index, onConnectRequest}, ref) => {
    const osc = useRef<Tone.Oscillator>();
    const [started, setStarted] = useState(false);
    const [params, setParams] = useState<{}[]>([]);

    useEffect(() => {

        osc.current = new Tone.Oscillator(440, "sine").toDestination();
        osc.current.mute = true;
        osc.current.start();
        return () => {
            osc.current?.dispose();
        };
    }, [osc]);

    useImperativeHandle(ref, () => ({
        connect: (signal: Tone.Signal) => {
            if (osc.current) {
                console.log('connect');
                signal.connect(osc.current?.frequency)
            }
        }
    }), [osc]);

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

                if (_value[0] === 'o') {
                    const oscNumber = +(_value as string).slice(1);
                    onConnectRequest(oscNumber, (osc.current[name] as any));
                } else {

                    if (['frequency'].includes(name)) {
                        if (osc.current[name])
                            (osc.current[name] as any).value = value
                    } else {
                        osc.current[name] = value;
                    }
                }
            } catch (e) {

            }
        }
    }, [osc, onConnectRequest]);

    const handleAddParam = React.useCallback(() => {
        setParams([...params, {}]);
    }, [params]);

    const key = index === 9 ? '0' : (index+1).toString();

    return (
        <div className={'oscItem'}>
            {!started ? (
                <button
                    title={'unmute'}
                    className={'oscStartButton'}
                    onClick={handleStart}
                >▯{key ? <small>({key})</small> : ''}</button>
            ) : (
                <button
                    title={'mute'}
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
                title={'add parameter control'}
                className={'oscAddParamButton'}
                onClick={handleAddParam}>+
            </button>
        </div>
    );
});
