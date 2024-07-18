
import React, { PropsWithChildren } from 'react'
import { Field, FieldConfig, FieldProps } from 'formik';
import { ErrorMessage } from 'formik';
import Collapse from '@mui/material/Collapse'
import OutlinedInput, { OutlinedInputProps } from '@mui/material/OutlinedInput';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

type Props = PropsWithChildren<{ helperText?: string; } & FieldConfig & OutlinedInputProps>

const FormInput = ({ name, label, placeholder, helperText, fullWidth, className, inputProps, ...props }: Props) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
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
                                fullWidth={fullWidth}
                                value={value}
                                onChange={(e) => setFieldValue(name, e.target.value)}
                                onBlur={(e) => setFieldTouched(name, true)}
                                type={showPassword ? 'text' : 'password'} endAdornment={(
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )}
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