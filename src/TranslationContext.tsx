import * as React from "react";
import * as Jed from "jed";
import { IDomPurifyConfig } from "./IDomPurifyConfig";

export const TranslationContext = React.createContext(undefined);
export const TranslationSettingsContext = React.createContext<Settings | undefined>(undefined);

export interface ITranslation {
  [key: string]: string | any;
}

export type Settings = {
  fixPercentage?: boolean;
  domPurifyConfig?: IDomPurifyConfig;
};

export interface ITranslationProviderProps {
  translation: ITranslation;
  settings?: Settings;
}

export const TranslationProvider: React.FC<ITranslationProviderProps> = ({
  translation,
  settings,
  children
}) => {
  const i18n = new (Jed as any)(translation);;

  return (
    <TranslationSettingsContext.Provider value={settings}>
      <TranslationContext.Provider value={i18n}>
        {children}
      </TranslationContext.Provider>
    </TranslationSettingsContext.Provider>
  );
};
