import {SynthModule} from "../modules/SynthModule";

export interface ConnectionOptions {
    module: SynthModule
}

export class ParameterConnections {
    list: {
        [key: string]: ConnectionOptions | undefined
    } = {}

    constructor() {
    }

    save = (paramName: string, connectedItemModule: SynthModule) => {
        this.list[paramName] = {
            module: connectedItemModule
        };
    };
}