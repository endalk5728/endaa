import React from 'react'
import { Input, InputProps } from '@/components/ui/input'
import { Textarea, TextareaProps } from '@/components/ui/textarea'

interface FormFieldProps {
    placeholder: string;
    error?: string;
    multiline?: boolean;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onBlur: () => void;
    name: string;
    disabled?: boolean;
  }
export const FormField: React.FC<FormFieldProps> = ({ error, multiline, ...props }) => {
  return (
    <div>
      {multiline ? (
        <Textarea {...(props as TextareaProps)} />
      ) : (
        <Input {...(props as InputProps)} />
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}
