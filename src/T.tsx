import * as DOMPurify from "dompurify";
import * as React from "react";
import { useContext } from "react";
import { cleanMessage } from "./cleanMessage";
import {
  TranslationContext,
  TranslationSettingsContext,
} from "./TranslationContext";
import { Jed } from "jed";
import { IDomPurifyConfig } from "./IDomPurifyConfig";

export interface ITProps {
  children: string;
  isHTML?: boolean;
  domPurifyConfig?: IDomPurifyConfig;
  placeholders?: Array<string | number>;
  context?: string;
}

export const escapePercentage = (text: string): string => {
  return text.replace(/(?!%[0-9]{1,2}\$s)%/g, "%%");
};

const defaultDomPurifySettings = {
  RETURN_DOM_FRAGMENT: false,
  RETURN_DOM: false,
};

export const T: React.FC<ITProps> = ({
  children,
  placeholders,
  isHTML,
  domPurifyConfig,
}) => {
  const i18n: Jed = useContext(TranslationContext) || new Jed({});
  const settings = useContext(TranslationSettingsContext);

  let translation = cleanMessage(children);

  if (settings && settings.escapePercentage) {
    translation = escapePercentage(translation);
  }

  translation = DOMPurify.sanitize(
    i18n.translate(translation).fetch(...(placeholders || [])),
    {
      ...defaultDomPurifySettings,
      ...(settings && settings.domPurifyConfig ? settings.domPurifyConfig : {}),
      ...(domPurifyConfig || {}),
    }
  ).toString();

  return isHTML ? (
    <span dangerouslySetInnerHTML={{ __html: translation }} />
  ) : (
    <>{translation}</>
  );
};

export const useTranslation = () => {
  const i18n: Jed = React.useContext(TranslationContext);
  const settings = React.useContext(TranslationSettingsContext);

  function translate(
    text: string,
    placeholders: string[],
    isHTML: false,
    domPurifyConfig?: IDomPurifyConfig
  ): string;

  function translate(
    text: string,
    placeholders: string[],
    isHTML: true,
    domPurifyConfig?: IDomPurifyConfig
  ): React.ReactNode;

  function translate(
    text: string,
    placeholders: string[] = [],
    isHTML: boolean = false,
    domPurifyConfig?: IDomPurifyConfig
  ) {
    if (!i18n) {
      return text;
    }

    const translation =
      settings && settings.escapePercentage ? escapePercentage(text) : text;

    const result = DOMPurify.sanitize(
      i18n.translate(translation).fetch(...(placeholders || [])),
      {
        ...defaultDomPurifySettings,
        ...(settings && settings.domPurifyConfig
          ? settings.domPurifyConfig
          : {}),
        ...(domPurifyConfig || {}),
      }
    ).toString();

    return isHTML ? (
      <span dangerouslySetInnerHTML={{ __html: result }} />
    ) : (
      result
    );
  }

  return {
    t: translate,
  };
};
