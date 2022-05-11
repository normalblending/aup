import * as Tone from "tone";

export type Destination = Tone.Signal<any> | Tone.Param<any>;
export type Source = Tone.ToneAudioNode;

export class SynthModule {
    source: Source
    connections: Destination[] = [];

    setSource(source: Tone.ToneAudioNode) {
        this.source = source;
    }

    connect = (destinations: Destination[]) => {
        this.connections = this.connections.filter(connection => !destinations.includes(connection))
        this.connections.push(...destinations);

        this.source.disconnect();

        this.connections.forEach(connection => {
            this.source.connect(connection);
        })

        return this;
    };
    disconnect = (destinations: Destination[]) => {
        this.connections = this.connections.filter(connection => !destinations.includes(connection))

        this.source.disconnect();

        this.connections.forEach(connection => {
            this.source.connect(connection);
        })

        return this;
    };
}
