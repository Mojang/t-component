import * as DOMPurify from "dompurify";
import * as React from "react";
import { useContext } from "react";
import { cleanMessage } from "./cleanMessage";
import { TranslationContext, TranslationSettingsContext } from "./TranslationContext";
import Jed from "jed";
import { IDomPurifyConfig } from "./IDomPurifyConfig";

export interface ITProps {
  children: string;
  isHTML?: boolean;
  domPurifyConfig?: IDomPurifyConfig;
  placeholders?: Array<string | number>;
}

export const percentageFix = (text: string): string => {
  return text.replace(/(?!%[0-9]{1,2}\$s)%/g, '%%');
};

const defaultDomPurifySettings = {
  RETURN_DOM_FRAGMENT: false,
  RETURN_DOM: false
};

export const T: React.FC<ITProps> = ({ children, placeholders, isHTML, domPurifyConfig }) => {
  const i18n: Jed = useContext(TranslationContext);
  const settings = useContext(TranslationSettingsContext);

  if (!i18n || !i18n.translate) {
    return <>{children}</>;
  }

  let translation = cleanMessage(children);

  if (settings && settings.fixPercentage) {
    translation = percentageFix(translation);
  }

  translation = i18n.translate(translation).fetch(...(placeholders || []));

  if (isHTML) {
    translation = DOMPurify.sanitize(translation, {
        ...defaultDomPurifySettings,
        ...(settings && settings.domPurifyConfig ? settings.domPurifyConfig : {}),
        ...(domPurifyConfig || {})
    }).toString();

    return <span dangerouslySetInnerHTML={{ __html: translation }} />;
  }

  return <>{translation}</>;
};

export const useTranslation = () => {
  const i18n: Jed = useContext(TranslationContext);
  const settings = useContext(TranslationSettingsContext);

  return {
    t: (text: string, placeholders: string[] = []): string => {
      if (!i18n) {
          return text;
      }

      const translation = settings && settings.fixPercentage ? percentageFix(text) : text;

      return i18n.translate(translation).fetch(...placeholders);
    }
  };
};