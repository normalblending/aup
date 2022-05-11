import * as React from "react";
import {forwardRef, useContext, useEffect, useMemo} from "react";
import * as Tone from "tone";
import {OscParamForm} from "./OscParamForm";
import {KeyTrigger} from "../../../components/KeyboardJS/KeyboardJSTrigger";
import {SynthContext, SynthContextValue} from "../context";
import './styles.css';
import {ModuleType} from "../SynthBody/modules/types";

export interface OscProps {
    id: string
    index: number
    xOffset: number
    yOffset: number
}

export interface OscImperativeHandlers {
}

export const Osc = forwardRef<OscImperativeHandlers, OscProps>(({id, index, xOffset, yOffset}, ref) => {

    const {
        body,
        synthState,
        removeItemApplier,
        addItemApplier,
        applyParamValue,
        applyParamConnect,
        setItemPlay,
        setItemStop,
        setItemIndex
    } = useContext<SynthContextValue>(SynthContext);

    const item = useMemo(() => synthState[id], [synthState, id])

    useEffect(() => {
        setItemIndex?.(id, index);
    }, [id, index]);
    // useEffect(() => {
    //     const tick = () => {
    //         // console.log(getBody?.()?.items[1]?.freqConnectADSR?.value, getBody?.()?.items[0]?._ADSR.value)
    //
    //         requestAnimationFrame(tick);
    //     };
    //     tick();
    // }, []);
    const handleStart = React.useCallback(async () => {
        setItemPlay(id)
    }, [setItemPlay, id]);
    const handleStop = React.useCallback(async () => {
        setItemStop(id)
    }, [setItemStop, id]);

    const handleToggle = React.useCallback(async () => {
        if (item.started) {
            setItemStop(id)
        } else {
            setItemPlay(id)
        }
    }, [setItemPlay, setItemStop, id, item.started]);
    const handleApply = React.useCallback(async (_name, _value) => {
        applyParamValue(id, _name, _value)
    }, [applyParamValue, id]);

    const handleApplyConnect = React.useCallback(async (paramName: string, connectedItemId: string, moduleType: ModuleType) => {
        applyParamConnect?.(id, paramName, connectedItemId, moduleType)
    }, [applyParamConnect, id]);


    const handleAddParam = React.useCallback(() => {
        addItemApplier(id);
    }, [addItemApplier, id]);

    const handleRemoveParam = React.useCallback((applierIndex: string) => {
        removeItemApplier(id, applierIndex);
    }, [removeItemApplier, id]);

    const key = (index <= (9 + xOffset) && index >= xOffset)
        ? (
            index - xOffset === 9
                ? '0'
                : (index - xOffset + 1).toString()
        )
        : null;
    //
    // const [stateVisible, setStateVisible] = useState<boolean>(false);
    // const tableRef = useRef<HTMLTableElement>(null);
    //
    // const handleOpenState = useCallback((e) => {
    //
    //     setStateVisible(true)
    //     e.target.addEventListener('mousemove', (e: MouseEvent) => {
    //         if (tableRef.current) {
    //             tableRef.current.style.left = e.x + 'px';
    //             tableRef.current.style.top = e.y + 'px';
    //         }
    //     });
    //
    // }, []);
    // const handleCloseState = useCallback(() => {
    //     setStateVisible(false);
    // }, []);
    return (
        <div className={'oscItem'}>
            <div className={'oscItem-topRow'}>
                <button
                    title={item.started ? 'release' : 'attack'}
                    className={'oscStartButton'}
                    onClick={item.started ? handleStop : handleStart}
                >
                    {item.started ? '▮' : '▯'}
                    {
                        key ? (
                                (xOffset !== 0)
                                    ? (
                                        <>
                                            <small>{index + 1}</small>{key ? <small> ({key})</small> : ''}
                                        </>
                                    )
                                    : (
                                        <small>({key})</small>
                                    ))
                            : (
                                <small>{index + 1}</small>
                            )
                    }
                </button>
                {!!Object.keys(item.appliers || {}).length && (
                    <div
                        className={'changes'}
                        onClick={() => {
                            console.log(
                                body?.items[item.id].m_LFO._lfo.frequency.getValueAtTime(Tone.now()),
                                body?.items[item.id]._osc.frequency.getValueAtTime(Tone.now())
                            );
                        }}>
                        {item.changes.map(change => {
                            return change.paramName + ' ' + (
                                Array.isArray(change.value)
                                    ? ((synthState[change.value[0]].index + 1) + ' ' + change.value[1])
                                    : (change.value)
                            )
                        }).join(', ')}
                    </div>
                )}

            </div>
            {key && (
                <>
                    {/*{index === 9 ? '0' : (index + 1).toString()}*/}
                    <KeyTrigger
                        codeValue={key}
                        withShift
                        onPress={handleToggle}/>
                    <KeyTrigger
                        codeValue={key}
                        onPress={handleToggle}
                        onRelease={handleToggle}/>
                </>
            )}
            {Object.values(item.appliers || {}).map((applier, applierIndex) => (
                <OscParamForm
                    xOffset={xOffset}
                    yOffset={yOffset}
                    key={applier.id}
                    parentIndex={index}
                    index={applierIndex}
                    id={applier.id}

                    onApply={handleApply}
                    onApplyConnect={handleApplyConnect}
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
