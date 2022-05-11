import React from "react";
import {Synth1} from "./Synth1";
import {SynthContextProvider} from "./Synth1/context";
import './styles.css';

export interface RootProps {

}

export const Root: React.FC<RootProps> = (props) => {

    return (
        <div>
            <SynthContextProvider>
                <Synth1/>
                <div
                    className={'infoButton'}
                    onClick={() => {
                        alert('AUP v2.0.1 (polyphonic synthesizer)\n' +
                            'by Normalblending, 2022\n' +
                            '\n' +
                            '\n' +
                            '\n' +
                            '\n' +
                            '***');
                    }}
                >i</div>

            </SynthContextProvider>
        </div>
    );
};
