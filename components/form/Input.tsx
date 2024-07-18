
import React, { PropsWithChildren } from 'react'
import { Field, FieldConfig, FieldProps } from 'formik';
import { ErrorMessage } from 'formik';
import Collapse from '@mui/material/Collapse'
import OutlinedInput, { OutlinedInputProps } from '@mui/material/OutlinedInput';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

type Props = PropsWithChildren<{ helperText?: string; } & FieldConfig & OutlinedInputProps>

const FormInput = ({ name, label, placeholder, helperText, fullWidth, className, inputProps, ...props }: Props) => {
    return (
        <Field name={name}>
            {
                ({ field: { value }, form: { setFieldValue, setFieldTouched }, meta }: FieldProps) => {
                    const hasError = !!(meta.touched && meta.error)
                    return (
                        <FormControl error={hasError} fullWidth={fullWidth} className={className}>
                            <FormLabel className='text-xs mb-1'>{label}</FormLabel>
                            <OutlinedInput
                                inputProps={{ ...inputProps, className: 'h-4' }}
                                color='primary'
                                error={hasError}
                                placeholder={placeholder}
                                value={value}
                                onChange={(e) => setFieldValue(name, e.target.value.trim())}
                                onBlur={(e) => setFieldTouched(name, true)}
                                {...props} />
                            {
                                helperText && <FormHelperText className='ml-0'>{helperText}</FormHelperText>
                            }
                            <div className='min-h-[20px]'>
                                <Collapse in={hasError}>
                                    <div>
                                        <ErrorMessage name={name} render={msg => <FormHelperText className='ml-0' >{msg}</FormHelperText>} />
                                    </div>
                                </Collapse>
                            </div>
                        </FormControl>
                    )
                }
            }
        </Field>
    )
};

export default FormInput; 