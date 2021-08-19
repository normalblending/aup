import * as React from "react";
import {createRef, Ref, RefObject, useCallback, useRef, useState} from "react";
import * as Tone from "tone";
import {Osc, OscImperativeHandlers} from "./Osc";
import './Synth1.css';

export interface Synth1Props {

}

export const Synth1: React.FC<Synth1Props> = (props) => {

    const [oscs, setOscs] = useState<{}[]>([]);


    const oscsRefs = useRef<RefObject<OscImperativeHandlers>[]>([]);


    const handleAddOsc = useCallback(async () => {
        await Tone.start();
        oscsRefs.current.push(createRef<OscImperativeHandlers>());
        setOscs([...oscs, {}]);
    }, [oscs]);


    const handleConnect = React.useCallback((number, signal: Tone.Signal) => {
        console.log(oscsRefs.current);
        oscsRefs.current[number]?.current?.connect(signal);
    }, [oscsRefs]);

    return (
        <div className='synth1Container'>
            <div className={'oscillators'}>
                {oscs.map((_, index) => {
                    return <Osc ref={oscsRefs.current[index]} key={index} index={index} onConnectRequest={handleConnect}/>
                })}
                <div className={`addOscButtonContainer`}>
                    <button
                        title={'add oscillator'}
                        className={`addOscButton`}
                        onClick={handleAddOsc}>+</button>
                </div>
            </div>
        </div>
    );
};
