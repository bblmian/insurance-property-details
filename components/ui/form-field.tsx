import React from 'react'
import { FormError } from './form-error'

interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

export function FormField({ label, error, required, children }: FormFieldProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      <FormError message={error} />
    </div>
  )
}

export function FormSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      {children}
    </div>
  )
}

export function FormActions({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end space-x-4 mt-6">
      {children}
    </div>
  )
} 