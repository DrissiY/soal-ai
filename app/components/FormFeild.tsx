
'use client'

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form"
import { Input } from "./ui/input"
import { FieldValues, Control, Path } from "react-hook-form"

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  placeholder?: string
  type?: "text" | "password" | "email" | "file"
}

export const FormFieldInput = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "",
  type = "text",
}: FormFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} placeholder={placeholder} type={type} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}