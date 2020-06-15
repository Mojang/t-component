import * as React from "react";
import { render } from "react-testing-library";
import { T, escapePercentage } from "./T";

import "jest";
import { TranslationProvider } from "./TranslationContext";

const messages = {
  domain: "messages",
  locale_data: {
    messages: {
      "": {
        domain: "messages",
        lang: "en-US",
        plural_forms: "nplurals=2; plural=(n != 1);",
      },
      Message: ["Test translation."],
      "Message with placeholder: %1$s": [
        "Translated message with placeholder: %1$s.",
      ],
      "Message with placeholders: %1$s, %2$s": [
        "Translated message with placeholder: %1$s, %2$s",
      ],
      "This should be escaped %1$s.": ["Escaped placeholder: %1$s."],
      "percentage sign %1$s%%": ["translated percentage sign %1$s%%"],
      "Untranslated message.": "",
    },
  },
};

describe("escapePercentage function", () => {
  it("adds a % sign", () => {
    expect(escapePercentage("%")).toEqual("%%");
  });

  it("but not on a placeholder", () => {
    expect(escapePercentage("%1$s")).toEqual("%1$s");
  });

  it("should work combined aswell", () => {
    expect(escapePercentage("%%1$s%%2$s%")).toEqual("%%%1$s%%%2$s%%");
  });
});

describe("T", () => {
  describe("With messages for current locale", () => {
    describe("With placeholders", () => {
      it("Returns translated text with values instead of placeholders", () => {
        const { container } = render(
          <TranslationProvider translation={messages}>
            <T placeholders={[2, "two"]}>
              Message with placeholders: %1$s, %2$s
            </T>
          </TranslationProvider>
        );
        expect(container.textContent).toEqual(
          "Translated message with placeholder: 2, two"
        );
      });
    });

    describe("Without placeholders", () => {
      it("Returns translated text", () => {
        const { container } = render(
          <TranslationProvider translation={messages}>
            <T>Message</T>
          </TranslationProvider>
        );
        expect(container.textContent).toEqual("Test translation.");
      });
    });

    describe("When isHTML is false", () => {
      it("Escapes placeholders", () => {
        const { container } = render(
          <TranslationProvider translation={messages}>
            <T
              placeholders={[
                "<script>test</script>",
                "<iframe src-javascript:alert('s')>",
              ]}
            >
              Message with placeholders: %1$s, %2$s
            </T>
          </TranslationProvider>
        );
        expect(container.textContent).toEqual(
          "Translated message with placeholder: , "
        );
      });
    });

    describe("When isHTML is true", () => {
      it("Renders html", () => {
        const { container } = render(
          <TranslationProvider translation={messages}>
            <T isHTML>{"Test <strong>html</strong> message."}</T>
          </TranslationProvider>
        );
        expect(container.innerHTML).toEqual(
          "<span>Test <strong>html</strong> message.</span>"
        );
      });

      describe("With ADD_ATTR target", () => {
        it("Preserves the target field of the links", () => {
          const { container } = render(
            <TranslationProvider translation={messages}>
              <T
                isHTML
                domPurifyConfig={{ ADD_ATTR: ["target"] }}
              >{`Test <a target="_blank">link</a>`}</T>
            </TranslationProvider>
          );
          expect(container.innerHTML).toEqual(
            `<span>Test <a target="_blank">link</a></span>`
          );
        });

        it("Preserves the target field of the links", () => {
          const { container } = render(
            <TranslationProvider
              translation={messages}
              settings={{ domPurifyConfig: { ADD_ATTR: ["target"] } }}
            >
              <T isHTML>{'Test <a target="_blank">link</a>'}</T>
            </TranslationProvider>
          );
          expect(container.innerHTML).toEqual(
            '<span>Test <a target="_blank">link</a></span>'
          );
        });
      });
      describe("Without ADD_ATTR target", () => {
        it("Removes the target field of the links", () => {
          const { container } = render(
            <TranslationProvider translation={messages}>
              <T isHTML>{`Test <a target="_blank">link</a>`}</T>
            </TranslationProvider>
          );
          expect(container.innerHTML).toEqual(`<span>Test <a>link</a></span>`);
        });
      });
    });
  });

  describe("When isHTML in context is true", () => {
    it("Renders html", () => {
      const { container } = render(
        <TranslationProvider translation={messages} settings={{ isHTML: true }}>
          <T>{"Test <strong>html</strong> message."}</T>
        </TranslationProvider>
      );
      expect(container.innerHTML).toEqual(
        "<span>Test <strong>html</strong> message.</span>"
      );
    });
  });

  describe("Without messages for current locale", () => {
    describe("With percentage sign", () => {
      it("should find correct translation", () => {
        const { container } = render(
          <TranslationProvider
            translation={messages}
            settings={{ escapePercentage: true }}
          >
            <T placeholders={["75"]} isHTML>
              percentage sign %1$s%
            </T>
          </TranslationProvider>
        );
        expect(container.textContent).toEqual("translated percentage sign 75%");
      });
    });
    describe("Without placeholders", () => {
      it("Returns english fallback", () => {
        const { container } = render(
          <TranslationProvider translation={{}}>
            <T>Untranslated message.</T>
          </TranslationProvider>
        );
        expect(container.textContent).toEqual("Untranslated message.");
      });
    });
    describe("With placeholders", () => {
      it("Returns english fallback with value instead of placeholder", () => {
        const { container } = render(
          <TranslationProvider translation={{}}>
            <T placeholders={[123]}>
              Untranslated message with placeholder: %1$s.
            </T>
          </TranslationProvider>
        );
        expect(container.textContent).toEqual(
          "Untranslated message with placeholder: 123."
        );
      });
    });
  });

  describe("without context", () => {
    it("returns the original text", () => {
      const { container } = render(<T>Message</T>);
      expect(container.textContent).toEqual("Message");
    });
  });
});
