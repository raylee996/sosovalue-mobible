
import React, { PropsWithChildren } from 'react'
import { Field, FieldProps } from 'formik';
import Collapse from '@mui/material/Collapse'
import { ErrorMessage } from 'formik';
import { InputBaseProps } from '@mui/material';

type Props = PropsWithChildren<{
    name: string;
    label?: string;
    placeholder?: string;
    notice?: string;
    className?: string;
    renderInputEnd?: () => React.ReactNode,
    type?: string;
    readOnly?: boolean;
}>

const CommonField = ({ name, label, placeholder, notice, className, renderInputEnd, ...props }: Props) => {

    return (
        <Field name={name}>
            {({
                field: { value },
                form: { setFieldValue, setFieldTouched }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                meta,
            }: FieldProps) => {
                const hasError = meta.touched && meta.error
                return (
                    <div className='mb-3'>
                        {
                            (label)
                                ? <label>
                                    <span className={`text-xs ${hasError ? 'text-red-600' : 'text-[#676564]'}`}>{label}</span>
                                </label>
                                : null
                        }
                        <div className='relative'>
                            <input className={`${className} w-full h-12 rounded-[3px] text-base px-4 py-0 font-semibold border border-solid ${hasError ? 'border-red-600' : 'border-[#D8D8D8]'} outline-none`} placeholder={placeholder} value={value} onChange={(e) => setFieldValue(name, e.target.value)} onBlur={(e) => setFieldTouched(name, true)} {...props} />
                            {
                                renderInputEnd && (
                                    <div className='absolute right-4 top-1/2 -translate-y-1/2'>
                                        {renderInputEnd()}
                                    </div>
                                )
                            }
                        </div>
                        <div className='h-5'>
                            <Collapse in={!!hasError}>
                                <div>
                                    <ErrorMessage name={name} render={msg => <div className='text-red-600 text-xs h-full leading-5'>{msg}</div>} />
                                </div>
                            </Collapse>
                        </div>
                        {
                            (notice)
                                ? <div className="text-base text-gray-600 pt-1">{notice}</div>
                                : null
                        }
                    </div>
                )
            }}
        </Field>
    )
};

export default CommonField; 