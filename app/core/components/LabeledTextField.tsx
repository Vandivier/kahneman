import { forwardRef, PropsWithoutRef, ComponentPropsWithoutRef } from 'react';
import { useFormContext } from 'react-hook-form';

import 'react';

// ref: https://stackoverflow.com/questions/66011598/styled-jsx-typescript-error-after-migrating-to-monorepo-structure-property-jsx
declare module 'react' {
    interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
        jsx?: boolean;
        global?: boolean;
    }
}

export interface LabeledTextFieldProps extends PropsWithoutRef<JSX.IntrinsicElements['input']> {
    /** Field name. */
    name: string;
    /** Field label. */
    label: string;
    /** Field type. Doesn't include radio buttons and checkboxes */
    type?: 'text' | 'password' | 'email' | 'number';
    outerProps?: PropsWithoutRef<JSX.IntrinsicElements['div']>;
    labelProps?: ComponentPropsWithoutRef<'label'>;
}

export const LabeledTextField = forwardRef<HTMLInputElement, LabeledTextFieldProps>(
    ({ label, outerProps, labelProps, name, ...props }, ref) => {
        const {
            register,
            formState: { isSubmitting, errors },
        } = useFormContext();
        const error = Array.isArray(errors[name]) ? (errors[name] as any).join(', ') : errors[name]?.message || errors[name];

        return (
            <div {...outerProps}>
                <label {...labelProps}>
                    {label}
                    <input disabled={isSubmitting} {...register(name)} {...props} />
                </label>

                {error && (
                    <div role="alert" style={{ color: 'red' }}>
                        {error}
                    </div>
                )}

                <style jsx>{`
                    label {
                        display: flex;
                        flex-direction: column;
                        align-items: start;
                        font-size: 1rem;
                    }
                    input {
                        font-size: 1rem;
                        padding: 0.25rem 0.5rem;
                        border-radius: 3px;
                        border: 1px solid purple;
                        appearance: none;
                        margin-top: 0.5rem;
                    }
                `}</style>
            </div>
        );
    }
);

export default LabeledTextField;
