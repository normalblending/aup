import * as React from "react";

export interface EnvFormProps {
    value: [number, number, number, number]
    onChange: (value: [number, number, number, number]) => void
}

export const EnvForm: React.FC<EnvFormProps> = (props) => {

    const {value, onChange} = props;

    const handleChange = React.useCallback((e) => {
        const newValue = [...value];
        newValue[+e.target.name] = e.target.value
        onChange(newValue as [number, number, number, number]);
    }, [value]);
    const handleValueKeyDown = React.useCallback((e) => {
        if (e.key === 'Escape' || e.key === 'Enter')
            e.target.blur();
    }, []);

    return (
        <div className={'envForm'}>
            <input title={'attack'} type={'number'} step={0.1} min={0} max={2} name={'0'} value={value[0]}
                   onChange={handleChange} onKeyDown={handleValueKeyDown}/>
            <input title={'decay'} type={'number'} step={0.1} min={0} max={2} name={'1'} value={value[1]}
                   onChange={handleChange} onKeyDown={handleValueKeyDown}/>
            <input title={'sustain'} type={'number'} step={0.1} min={0} max={1} name={'2'} value={value[2]}
                   onChange={handleChange} onKeyDown={handleValueKeyDown}/>
            <input title={'release'} type={'number'} step={0.1} min={0} max={5} name={'3'} value={value[3]}
                   onChange={handleChange} onKeyDown={handleValueKeyDown}/>
        </div>
    );
};
