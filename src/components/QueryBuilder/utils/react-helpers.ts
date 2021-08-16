import React from 'react';

export interface CreateContextOptions {
  /**
   * If `true`, React will throw if context is `null` or `undefined`
   * In some cases, you might want to support nested context, so you can set it to `false`
   */
  strict?: boolean;
  displayName?: string;
}

type CreateContextReturn<T> = [React.Provider<T>, () => T, React.Context<T>];
export function createContext<ContextType>(options: CreateContextOptions = {}) {
  const { strict = true, displayName } = options;

  const errorMessage = displayName
    ? `use${displayName}Context must be inside a ${displayName}ContextProvider with a value`
    : 'useContext must be inside a ContextProvider with a value';

  const Context = React.createContext<ContextType | undefined>(undefined);

  Context.displayName = displayName;

  function useContext() {
    const context = React.useContext(Context);
    if (!context && strict) throw new Error(errorMessage);

    return context;
  }

  return [
    Context.Provider,
    useContext,
    Context,
  ] as CreateContextReturn<ContextType>;
}
