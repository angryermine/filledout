import { createFormFactory } from './create-form';
import { FormModel } from './types/common';

type CreateLibParams<P, T> = {
  factoryInterceptor: (form: FormModel<any, P>) => T;
};

const createLib = <Params, Result>({
  factoryInterceptor
}: CreateLibParams<Params, Result>) => {
  const createForm = createFormFactory<Params, Result>({
    factoryInterceptor
  });

  return {
    createForm
  };
};

export { createLib };

export type { FormModel } from './types/common';
