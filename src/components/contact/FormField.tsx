import type { ChangeEvent, FocusEvent, ReactNode, Ref } from 'react'
import { CircleAlertIcon } from '@/components/ui/icons'
import { cn } from '@/lib/cn'

export interface FormFieldProps {
  id: string
  name: string
  label: string
  /** UiCopy.required, e.g. "(required)" — the requirement in text, not colour (FR-CON-02). */
  requiredLabel: string
  value: string
  error?: string | undefined
  multiline?: boolean
  type?: 'text' | 'email'
  autoComplete?: string
  /** Extra description ids (e.g. the message counter). */
  describedBy?: string
  inputRef?: Ref<HTMLInputElement & HTMLTextAreaElement>
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  children?: ReactNode
}

const control =
  'w-full rounded-md border border-field bg-[rgb(0_0_0/0.55)] px-4 font-sans text-body text-heading ' +
  'transition-[border-color,box-shadow] duration-400 ease-soft ' +
  'focus:border-accent focus:shadow-[0_0_0_3px_rgb(0_194_255/0.2)] focus:outline-none ' +
  'aria-invalid:border-error aria-invalid:shadow-[0_0_0_1px_var(--color-error)]'

/**
 * Labelled field (COMPONENT_VISUAL_SPEC §21, FR-CON-02/03): visible label with "(required)",
 * `aria-invalid` and an error linked by `aria-describedby` when invalid.
 */
export function FormField({
  id,
  name,
  label,
  requiredLabel,
  value,
  error,
  multiline = false,
  type = 'text',
  autoComplete,
  describedBy,
  inputRef,
  onChange,
  onBlur,
  children,
}: FormFieldProps) {
  const errorId = `${id}-error`
  const described = [error ? errorId : null, describedBy].filter(Boolean).join(' ') || undefined
  const shared = {
    id,
    name,
    value,
    required: true,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': described,
    onChange,
    onBlur,
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-ui font-bold text-heading">
        {label} <span className="font-normal text-sub">{requiredLabel}</span>
      </label>
      {multiline ? (
        <textarea
          {...shared}
          ref={inputRef}
          rows={6}
          className={cn(control, 'min-h-37.5 resize-y py-3.5')}
        />
      ) : (
        <input
          {...shared}
          ref={inputRef}
          type={type}
          autoComplete={autoComplete}
          className={cn(control, 'h-13')}
        />
      )}
      {children}
      {error ? (
        <p id={errorId} className="flex items-center gap-2 text-small text-error">
          <CircleAlertIcon size={16} className="shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  )
}
