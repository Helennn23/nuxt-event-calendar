import type { FormInstance, FormItemRule, FormRules } from 'element-plus'

// --------------------------------------------- F O R M  R E F --------------------------------------------------------
export function useElFormRef (initialValue: any = null) {
  return ref<FormInstance>(initialValue)
}

// --------------------------------------------- F O R M  M O D E L ----------------------------------------------------
export function useElFormModel<T extends object> (model: T) {
  return reactive<T>(model)
}

// ------------------------------------------- F O R M  R U L E S ------------------------------------------------------
export function useElFormRules (model: FormRules) {
  return reactive(model)
}

export function useRequiredRule ({ required = true } = {}) {
  return { required, message: 'This field is required', trigger: 'change' } as FormItemRule
}

export function useEmailRule () {
  return { type: 'email', message: 'Invalid email', trigger: ['change', 'blur'] } as FormItemRule
}

export function useMinLenRule (min: number): FormItemRule {
  return { min, message: `Min length is ${min}`, trigger: 'change' }
}

export function useMaxLenRule (max: number): FormItemRule {
  return { max, message: `Max length is ${max}`, trigger: 'change' }
}
