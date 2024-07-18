import React, { PropsWithChildren } from 'react'
import Select, { SelectProps } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';

type Props = PropsWithChildren<{
    options: { value: any; label: React.ReactNode }[]
} & SelectProps>

const FormSelect = ({ name,value, placeholder,  fullWidth, options,  ...props }: Props) => {
    return (
    <FormControl fullWidth={fullWidth}>
        <Select
            placeholder={placeholder}
            value={value}
            label="Age"
            classes={{select:'bg-[#333] p-0 pl-2 pr-6 text-[#E5E5E5]',icon:'text-[#E5E5E5] right-0.5'}}
            {...props}>
            {
                options.map(({ value, label }) => <MenuItem key={value} value={value}>{label}</MenuItem>)
            }
        </Select>
    </FormControl>
    )
};

export default FormSelect; 