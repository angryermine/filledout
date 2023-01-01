import { DeepPartial } from '@filledout/utils';
import { Event, Store } from 'effector';
import { ValidateOnEventType, ValidationVisibilityCondition } from './enums';

type NamePayload = {
  name: string;
};

type NameValuePair<V = unknown> = NamePayload & {
  value: V;
};

type RejectionPayload<V> = { values: V; errors: Record<string, FieldErrors> };

type ValidationTriggersConfiguration = {
  validateOn?: ValidateOnEventType[];

  showValidationOn?: ValidationVisibilityCondition[];
};

type DeepMapTo<Values, T> = {
  [K in keyof Values]?: Values[K] extends any[]
    ? Values[K][number] extends object
      ? DeepMapTo<Values[K][number], T>[] | T | T[]
      : T | T[]
    : Values[K] extends object
    ? DeepMapTo<Values[K], T>
    : T;
};

type FieldErrors = Record<string, Record<string, any>>;

type Fields<V> = {
  [P in keyof V]: V[P] extends Array<any>
    ? ListFieldModel<V[P]>
    : V[P] extends object
    ? FieldModel<V[P]> & Fields<V[P]>
    : FieldModel<V[P]>;
};

type BaseFieldModel<V> = {
  $value: Store<V>;
  $isDirty: Store<boolean>;
  $isFocused: Store<boolean>;
  $isTouched: Store<boolean>;
  $errors: Store<FieldErrors>;

  name: string;
  set: Event<V>;
  change: Event<V>;
  changed: Event<V>;
  blured: Event<void>;
  focused: Event<void>;
};

type FieldModel<V> = BaseFieldModel<V>;

type ListFieldModel<V> = BaseFieldModel<V> & {
  pop: () => V;
  shift: () => V;
  push: (payload: V) => void;
  unshift: (payload: V) => void;
  remove: (index: number) => void;
  insert: (index: number, payload: V) => void;
};

type FormUnits<V> = {
  // state
  $values: Store<V>;

  $focused: Store<string>;

  $initialValues: Store<V>;

  $isDisabled: Store<boolean>;

  $submitCount: Store<number>;

  $dirty: Store<Record<string, boolean>>;

  $touched: Store<Record<string, boolean>>;

  $errors: Store<Record<string, FieldErrors>>;

  $externalErrors:
    | Store<Record<string, FieldErrors>>
    | Store<DeepMapTo<V, FieldErrors>>;

  // events
  submitted: Event<V>;

  blured: Event<NamePayload>;

  focused: Event<NamePayload>;

  changed: Event<NameValuePair>;

  rejected: Event<RejectionPayload<V>>;

  // methods
  put: Event<V>;

  reset: Event<V | void>;

  set: Event<NameValuePair>;

  patch: Event<DeepPartial<V>>;

  submit: Event<void | unknown>;

  change: Event<NameValuePair>;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type FormModel<V, P = {}> = FormUnits<V> &
  ValidationTriggersConfiguration & {
    fields: Fields<V>;

    $isValid: Store<boolean>;

    $isDirty: Store<boolean>;

    $isFocused: Store<boolean>;

    $isTouched: Store<boolean>;

    $isSubmitted: Store<boolean>;
  } & P;

type FormMeta<V> = FormUnits<V> & ValidationTriggersConfiguration;

export {
  Fields,
  FormMeta,
  FormUnits,
  FormModel,
  DeepMapTo,
  FieldModel,
  NamePayload,
  FieldErrors,
  NameValuePair,
  ListFieldModel,
  RejectionPayload,
  ValidationTriggersConfiguration
};