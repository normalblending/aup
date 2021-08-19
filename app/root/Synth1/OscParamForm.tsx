import * as React from "react";
import {useCallback, useRef} from "react";
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
    const valueInput = useRef<HTMLInputElement>(null);
    const paramNameInput = useRef<HTMLInputElement>(null);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        console.log('submit')
        const name = paramNameInput.current?.value as string;
        const value = valueInput.current?.value;
        onApply(name, value)
    }, [paramNameInput, valueInput, onApply]);

    const key = KEY_CODE_MAP[parentIndex]?.[index];
    return (
        <form onSubmit={handleSubmit} className={'oscParamForm'}>

            {index <= 2 && (
                <KeyTrigger codeValue={key} onPress={handleSubmit}/>
            )}
            <button type='submit'>_{key ? <small>({key})</small> : ''}</button>
            <input ref={paramNameInput} placeholder={'parameter'}/>
            <input ref={valueInput} placeholder={'value'}/>
        </form>
    );
};
