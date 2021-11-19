import * as React from "react";
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import * as Tone from "tone";
import {OscParamForm} from "./OscParamForm";
import {KeyTrigger} from "../../components/KeyboardJS/KeyboardJSTrigger";
import {EnvForm} from "./EnvForm";

export interface OscProps {
    index: number
}

export interface OscImperativeHandlers {
}

export const Osc = forwardRef<OscImperativeHandlers, OscProps>(({index}, ref) => {
    const osc = useRef<Tone.Oscillator>();
    const env = useRef<Tone.AmplitudeEnvelope>();

    const [started, setStarted] = useState(false);
    const [params, setParams] = useState<{ id: number }[]>([]);
    const [envValue, setEnvValue] = useState<[number, number, number, number]>([0.1, 0.2, 1.0, 0.8]);

    useEffect(() => {
        env.current = new Tone.AmplitudeEnvelope({
            attack: envValue[0],
            decay: envValue[1],
            sustain: envValue[2],
            release: envValue[3]
        }).toDestination();

        osc.current = new Tone.Oscillator(440, "sine").connect(env.current);
        osc.current.start();
        return () => {
            osc.current?.dispose();
        };
    }, []);

    const handleEnvValueChange = React.useCallback((value: [number, number, number, number]) => {
        setEnvValue(value);
        if (env.current) {
            env.current.attack = value[0];
            env.current.decay = value[1];
            env.current.sustain = value[2];
            env.current.release = value[3];
        }
    }, []);

    const handleStart = React.useCallback(async () => {
        if (osc.current) {
            env.current?.triggerAttack();
            setStarted(true);
        }
    }, [osc, env]);
    const handleStop = React.useCallback(async () => {
        if (osc.current) {
            env.current?.triggerRelease();
            setStarted(false);
        }
    }, [osc]);
    const handleToggle = React.useCallback(async () => {
        if (osc.current) {
            if (started) {
                env.current?.triggerRelease();
            } else {
                env.current?.triggerAttack();
            }
            // osc.current.mute = !osc.current.mute;
            setStarted(!started);
        }
    }, [osc, started]);
    const handleApply = React.useCallback(async (_name, _value) => {
        if (osc.current) {
            try {
                const name = _name as ('type' | 'frequency');
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
        setParams([
            ...params,
            {
                id: params.reduce((res, {id}) => id > res ? id : res, 0) + 1
            }
        ]);
    }, [params]);

    const handleRemoveParam = React.useCallback((index: number) => {
        const newParams = [...params];
        newParams.splice(index, 1);
        setParams(newParams);
    }, [params]);

    const key = index === 9 ? '0' : (index + 1).toString();

    return (
        <div className={'oscItem'}>
            <div className={'oscItem-topRow'}>
                {!started ? (
                    <button
                        title={'attack'}
                        className={'oscStartButton'}
                        onClick={handleStart}
                    >▯{key ? <small>({key})</small> : ''}</button>
                ) : (
                    <button
                        title={'release'}
                        className={'oscStopButton'}
                        onClick={handleStop}
                    >▮{key ? <small>({key})</small> : ''}</button>
                )}
                <EnvForm
                    value={envValue}
                    onChange={handleEnvValueChange}
                />
            </div>
            {index <= 9 && (
                <>
                    <KeyTrigger codeValue={index === 9 ? '0' : (index + 1).toString()} withShift
                                onPress={handleToggle}/>
                    <KeyTrigger codeValue={index === 9 ? '0' : (index + 1).toString()} onPress={handleToggle}
                                onRelease={handleToggle}/>
                </>
            )}
            {params.map(({id}, _index) => (
                <OscParamForm
                    parentIndex={index}
                    index={_index}
                    key={id}
                    onApply={handleApply}
                    onRemove={handleRemoveParam}
                />
            ))}
            <div className={'oscItem-bottomRow'}>
                <button
                    title={'add parameter control'}
                    className={'oscAddParamButton'}
                    onClick={handleAddParam}
                >
                    +
                </button>
            </div>

        </div>
    );
});
