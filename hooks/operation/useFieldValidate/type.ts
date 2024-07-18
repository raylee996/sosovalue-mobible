export type ValidationRule<T> = {
  value: T;
  message: string;
}

type ValidateResult = {
  result: boolean;
  msg?: string;
  customStatus?: number;
};

export type ValidateOptions = Partial<{
  required: ValidationRule<boolean>;
  maxLength: ValidationRule<number>;
  minLength: ValidationRule<number>;
  pattern: ValidationRule<RegExp>[];
  asyncValidate: (value: string) => Promise<ValidateResult>;
  syncValidate: (value: string) => ValidateResult;
}>;
