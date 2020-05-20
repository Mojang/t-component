import * as DOMPurify from "dompurify";
import * as React from "react";
import { useContext } from "react";
import { TranslationSettingsContext } from "./TranslationContext";
import { IDomPurifyConfig } from "./IDomPurifyConfig";

export interface SanitizedProps {
  children: string;
  domPurifyConfig?: IDomPurifyConfig;
  context?: string;
}

const defaultDomPurifySettings = {
  RETURN_DOM_FRAGMENT: false,
  RETURN_DOM: false,
};

export const Sanitized: React.FC<SanitizedProps> = ({
  children,
  domPurifyConfig,
}) => {
  const settings = useContext(TranslationSettingsContext);

  const translation = DOMPurify.sanitize(children, {
    ...defaultDomPurifySettings,
    ...(settings && settings.domPurifyConfig ? settings.domPurifyConfig : {}),
    ...(domPurifyConfig || {}),
  }).toString();

  return <span dangerouslySetInnerHTML={{ __html: translation }} />;
};
