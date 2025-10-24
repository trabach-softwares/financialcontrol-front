import { ref, computed, reactive } from 'vue'

export type ValidationRule = {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  email?: boolean
  password?: boolean
  confirmPassword?: string
  custom?: (value: string) => string | null
}

export type FieldValidation = {
  value: string
  error: string
  rules: ValidationRule[]
  touched: boolean
}

export function useFormValidation() {
  const fields = reactive<Record<string, FieldValidation>>({})

  // Add a field to validation
  const addField = (name: string, rules: ValidationRule[] = []) => {
    fields[name] = {
      value: '',
      error: '',
      rules,
      touched: false,
    }
  }

  // Validate a single field
  const validateField = (name: string): boolean => {
    const field = fields[name]
    if (!field) return true

    field.touched = true
    field.error = ''

    for (const rule of field.rules) {
      const error = validateRule(field.value, rule, fields)
      if (error) {
        field.error = error
        return false
      }
    }

    return true
  }

  // Validate a single rule
  const validateRule = (
    value: string, 
    rule: ValidationRule, 
    allFields: Record<string, FieldValidation>
  ): string | null => {
    // Required validation
    if (rule.required && (!value || value.trim() === '')) {
      return 'This field is required'
    }

    // Skip other validations if field is empty and not required
    if (!value && !rule.required) {
      return null
    }

    // Min length validation
    if (rule.minLength && value.length < rule.minLength) {
      return `Must be at least ${rule.minLength} characters`
    }

    // Max length validation
    if (rule.maxLength && value.length > rule.maxLength) {
      return `Must be no more than ${rule.maxLength} characters`
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      return 'Invalid format'
    }

    // Email validation
    if (rule.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address'
      }
    }

    // Password validation
    if (rule.password) {
      const hasLetter = /[a-zA-Z]/.test(value)
      const hasNumber = /\d/.test(value)
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value)

      if (value.length < 8) {
        return 'Password must be at least 8 characters'
      }
      if (!hasLetter) {
        return 'Password must contain at least one letter'
      }
      if (!hasNumber) {
        return 'Password must contain at least one number'
      }
      if (!hasSpecial) {
        return 'Password must contain at least one special character'
      }
    }

    // Confirm password validation
    if (rule.confirmPassword) {
      const passwordField = allFields[rule.confirmPassword]
      if (passwordField && value !== passwordField.value) {
        return 'Passwords do not match'
      }
    }

    // Custom validation
    if (rule.custom) {
      return rule.custom(value)
    }

    return null
  }

  // Validate all fields
  const validateAll = (): boolean => {
    let isValid = true
    for (const name in fields) {
      if (!validateField(name)) {
        isValid = false
      }
    }
    return isValid
  }

  // Reset a field
  const resetField = (name: string) => {
    const field = fields[name]
    if (field) {
      field.value = ''
      field.error = ''
      field.touched = false
    }
  }

  // Reset all fields
  const resetAll = () => {
    for (const name in fields) {
      resetField(name)
    }
  }

  // Set field value
  const setFieldValue = (name: string, value: string) => {
    const field = fields[name]
    if (field) {
      field.value = value
      if (field.touched) {
        validateField(name)
      }
    }
  }

  // Get field error
  const getFieldError = (name: string): string => {
    return fields[name]?.error || ''
  }

  // Get field value
  const getFieldValue = (name: string): string => {
    return fields[name]?.value || ''
  }

  // Check if field has error
  const hasFieldError = (name: string): boolean => {
    const field = fields[name]
    return !!(field?.error && field?.touched)
  }

  // Check if form is valid
  const isFormValid = computed(() => {
    return Object.values(fields).every(field => !field.error && field.value !== '')
  })

  // Check if any field is touched
  const isFormTouched = computed(() => {
    return Object.values(fields).some(field => field.touched)
  })

  // Get all errors
  const errors = computed(() => {
    const fieldErrors: Record<string, string> = {}
    for (const [name, field] of Object.entries(fields)) {
      if (field.error && field.touched) {
        fieldErrors[name] = field.error
      }
    }
    return fieldErrors
  })

  // Get form data
  const formData = computed(() => {
    const data: Record<string, string> = {}
    for (const [name, field] of Object.entries(fields)) {
      data[name] = field.value
    }
    return data
  })

  return {
    fields,
    addField,
    validateField,
    validateAll,
    resetField,
    resetAll,
    setFieldValue,
    getFieldError,
    getFieldValue,
    hasFieldError,
    isFormValid,
    isFormTouched,
    errors,
    formData,
  }
}

// Predefined validation rules
export const validationRules = {
  required: { required: true },
  email: { required: true, email: true },
  password: { required: true, password: true },
  confirmPassword: (passwordField: string) => ({ 
    required: true, 
    confirmPassword: passwordField 
  }),
  minLength: (length: number) => ({ minLength: length }),
  maxLength: (length: number) => ({ maxLength: length }),
  pattern: (regex: RegExp) => ({ pattern: regex }),
}

// Common validation patterns
export const patterns = {
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  username: /^[a-zA-Z0-9_]{3,20}$/,
  url: /^https?:\/\/.+/,
  number: /^\d+$/,
  decimal: /^\d*\.?\d+$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
}

// Usage example helper
export function createLoginValidation() {
  const validation = useFormValidation()
  
  validation.addField('email', [validationRules.email])
  validation.addField('password', [validationRules.required, validationRules.minLength(6)])
  
  return validation
}

export function createRegistrationValidation() {
  const validation = useFormValidation()
  
  validation.addField('name', [validationRules.required, validationRules.minLength(2)])
  validation.addField('email', [validationRules.email])
  validation.addField('password', [validationRules.password])
  validation.addField('confirmPassword', [validationRules.confirmPassword('password')])
  
  return validation
}