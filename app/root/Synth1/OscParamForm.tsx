import * as React from "react";
import {useCallback, useRef, useState} from "react";
import {KeyTrigger} from "../../components/KeyboardJS/KeyboardJSTrigger";

export interface OscParamFormProps {
    parentIndex: number
    index: number
    onApply: (name: string, value: any) => void
}

const KEY_CODE_MAP = [
    ['q', 'a', 'z'],
    ['w', 's', 'x'],
    ['e', 'd', 'c'],
    ['r', 'f', 'v'],
    ['t', 'g', 'b'],
    ['y', 'h', 'n'],
    ['u', 'j', 'm'],
    ['i', 'k', ','],
    ['o', 'l', '.'],
    ['p', ';', '/'],
]

export const OscParamForm: React.FC<OscParamFormProps> = (props) => {

    const {onApply, index, parentIndex} = props;
    const typeInput = useRef<HTMLSelectElement>(null);
    const valueInput = useRef<HTMLInputElement>(null);
    const paramNameInput = useRef<HTMLSelectElement>(null);

    const [param, setParam] = useState('frequency');

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (param === 'type') {
            const name = paramNameInput.current?.value as string;
            const value = typeInput.current?.value;
            onApply(name, value)
        } else {
            const name = paramNameInput.current?.value as string;
            const value = valueInput.current?.value;
            onApply(name, value)
        }
    }, [paramNameInput, valueInput, onApply, param]);

    const code = KEY_CODE_MAP[parentIndex]?.[index % 3];
    const key = index < 3 ? KEY_CODE_MAP[parentIndex]?.[index] : KEY_CODE_MAP[parentIndex]?.[index - 3]?.toUpperCase();

    const handleParamChange = useCallback((e) => {
        setParam(e.target.value);
    }, []);
    return (
        <form onSubmit={handleSubmit} className={'oscParamForm'}>
            {index <= 5 && (
                <KeyTrigger codeValue={code} keyValue={key} onPress={handleSubmit}/>
            )}
            <button type='submit' title={'apply'}>_{key ? <small>({key})</small> : ''}</button>
            <select title={'parameter name'} ref={paramNameInput} value={param} onChange={handleParamChange}>
                <option value={'frequency'}>frequency</option>
                <option value={'type'}>type</option>
            </select>
            {param === 'type' && (
                <select ref={typeInput} title={'wave type'} >
                    <option value={'square'}>square</option>
                    <option value={'sine'}>sine</option>
                    <option value={'triangle'}>triangle</option>
                    <option value={'sawtooth'}>sawtooth</option>
                </select>
            )}
            {param === 'frequency' && (
                <input ref={valueInput} title={'value'} placeholder={'value'}/>
            )}
        </form>
    );
};
