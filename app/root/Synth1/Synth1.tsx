import * as React from "react";
import {useCallback, useRef, useState} from "react";
import * as Tone from "tone";
import {Osc} from "./Osc";
import './Synth1.css';

export interface Synth1Props {

}

export const Synth1: React.FC<Synth1Props> = (props) => {

    const [oscs, setOscs] = useState<{}[]>([]);

    const handleAddOsc = useCallback(() => {
        setOscs([...oscs, {}]);
    }, [oscs]);

    return (
        <div className='synth1Container'>
            <div>
                <a href={'https://tonejs.github.io/docs/r13/Oscillator'}>https://tonejs.github.io/docs/r13/Oscillator</a>
            </div>
            <div className={'oscillators'}>
                {oscs.map((_, index) => {
                    return <Osc key={index} index={index}/>
                })}
                <div className={`addOscButtonContainer`}>
                    <button className={`addOscButton`} onClick={handleAddOsc}>+</button>
                </div>
            </div>
        </div>
    );
};
