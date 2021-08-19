import React from "react";
import {Synth1} from "./Synth1/Synth1";

export interface RootProps {

}

export const Root: React.FC<RootProps> = (props) => {

    return (
        <div>
            <Synth1/>
        </div>
    );
};
