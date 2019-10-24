import DOMPurify from 'dompurify';
import React, { useContext } from 'react';
import Jed from 'jed';

export type DomPurifyConfig = {
    ADD_ATTR?: string[];
    ADD_TAGS?: string[];
    ALLOW_DATA_ATTR?: boolean;
    ALLOWED_ATTR?: string[];
    ALLOWED_TAGS?: string[];
    FORBID_ATTR?: string[];
    FORBID_TAGS?: string[];
    FORCE_BODY?: boolean;
    KEEP_CONTENT?: boolean;
    RETURN_DOM?: boolean;
    RETURN_DOM_FRAGMENT?: boolean;
    RETURN_DOM_IMPORT?: boolean;
    SAFE_FOR_JQUERY?: boolean;
    SANITIZE_DOM?: boolean;
    WHOLE_DOCUMENT?: boolean;
    ALLOWED_URI_REGEXP?: RegExp;
    SAFE_FOR_TEMPLATES?: boolean;
    ALLOW_UNKNOWN_PROTOCOLS?: boolean;
    USE_PROFILES?: false | { mathMl?: boolean; svg?: boolean; svgFilters?: boolean; html?: boolean };
    IN_PLACE?: boolean;
};

export type Settings = {
    fixPercentage?: boolean;
    domPurifyConfig?: DomPurifyConfig;
};

export const TranslationContext = React.createContext<Jed | undefined>(undefined);
export const TranslationSettingsContext = React.createContext<Settings | undefined>(undefined);

export type TranslationProviderProps = {
    translation: any;
    settings?: Settings;
};

export type TProps = {
    children: string;
    isHTML?: boolean;
    domPurifyConfig?: DomPurifyConfig;
    placeholders?: Array<string | number>;
    context?: string;
};

export const percentageFix = (text: string): string => {
    return text.replace(/(?!%[0-9]{1,2}\$s)%/g, '%%');
};

export const cleanMessage = (message: string): string => {
    return message
        .replace(/\n/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim();
};

const defaultDomPurifySettings = {
    RETURN_DOM_FRAGMENT: false,
    RETURN_DOM: false
};

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ translation, settings, children }) => {
    const i18n = new Jed(translation);

    return (
        <TranslationSettingsContext.Provider value={settings}>
            <TranslationContext.Provider value={i18n}>{children}</TranslationContext.Provider>
        </TranslationSettingsContext.Provider>
    );
};

export const T: React.FC<TProps> = props => {
    const i18n: Jed = useContext(TranslationContext);
    const settings = useContext(TranslationSettingsContext);
    const { children, placeholders, isHTML, domPurifyConfig } = props;

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
