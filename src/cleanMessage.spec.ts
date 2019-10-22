import { cleanMessage } from "./cleanMessage";

import "jest";

describe("cleanMessage", () => {
  it("should remove line breaks", () => {
    expect(cleanMessage("make\nfoo bars")).toEqual("make foo bars");
  });

  it("should remove extra spaces around the string", () => {
    expect(cleanMessage("  make foo bars  ")).toEqual("make foo bars");
  });

  it("should remove extra spaces between words", () => {
    expect(cleanMessage("make    foo            bars")).toEqual(
      "make foo bars"
    );
  });

  it("should remove extra spaces and line breaks", () => {
    expect(cleanMessage("make         \n foo  \n bars")).toEqual(
      "make foo bars"
    );
  });

  it("should remove trailing line breaks", () => {
    expect(cleanMessage("make foo bars\n")).toEqual("make foo bars");
  });

  it("should remove trailing line breaks", () => {
    expect(cleanMessage("\nmake foo bars")).toEqual("make foo bars");
  });
});
