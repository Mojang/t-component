import * as DOMPurify from "dompurify";
import * as React from "react";
import { cleanMessage } from "./cleanMessage";
import { TranslationContext } from "./TranslationContext";
import Jed from "jed";
import { IDomPurifyConfig } from "./IDomPurifyConfig";

export interface ITProps {
  children: string;
  isHTML?: boolean;
  domPurifyConfig?: IDomPurifyConfig;
  placeholders?: Array<string | number>;
}

export const T = (props: ITProps) => {
  const i18n: Jed = React.useContext(TranslationContext);

  const { children, placeholders, isHTML, domPurifyConfig } = props;
  if (!i18n || !i18n.translate) {
    return <>{children}</>;
  }

  const args = placeholders || [];
  const translation = DOMPurify.sanitize(
    i18n.translate(cleanMessage(children)).fetch(...args),
    domPurifyConfig
      ? { ...domPurifyConfig, RETURN_DOM_FRAGMENT: false, RETURN_DOM: false }
      : undefined
  );
  return isHTML ? (
    <span dangerouslySetInnerHTML={{ __html: translation.toString() }} />
  ) : (
    <>{translation.toString()}</>
  );
};

export const useTranslation = () => {
  const i18n: Jed = React.useContext(TranslationContext);

  return {
    t: (text: string, placeholders: string[] = []) =>
      i18n ? i18n.translate(text).fetch(...placeholders) : text
  };
};
