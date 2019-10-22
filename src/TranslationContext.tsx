import * as React from "react";
import * as Jed from "jed";

export const TranslationContext = React.createContext(undefined);

export interface ITranslation {
  [key: string]: string | any;
}

export interface ITranslationProviderProps {
  translation: ITranslation;
  children: React.ReactNode;
}

export const TranslationProvider = ({
  translation,
  children
}: ITranslationProviderProps) => {
  const i18n = new (Jed as any)(translation);
  return (
    <TranslationContext.Provider value={i18n}>
      {children}
    </TranslationContext.Provider>
  );
};
