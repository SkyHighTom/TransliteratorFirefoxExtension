import { franc } from "franc";
import { pinyin } from "pinyin-pro";
import * as wanakana from "wanakana";
import { transliterate } from "transliteration";
import * as hangulRomanization from "hangul-romanization";

const transliterators = {
    cmn: (text) =>
        pinyin(text, {
            toneType: "symbol"
        }),
    jpn: (text) =>
        wanakana.toRomaji(text),

    kor: (text) =>
        hangulRomanization.convert(text),

    default: (text) =>
        transliterate(text)
};

function isEnglish(text) {
    return /^[a-zA-Z0-9\s.,!?'"()-]+$/
        .test(text);
}

function detectLanguage(text) {
    if (/[\u3040-\u30FF]/.test(text)) return "jpn";
    if (/[\uAC00-\uD7AF]/.test(text)) return "kor";
    if (/[\u4E00-\u9FFF]/.test(text)) return "cmn";

    return franc(text);
}

function transliterateText(text) {

    if (isEnglish(text))
        return text;

    const lang =
        detectLanguage(text);

    const fn =
        transliterators[lang] ??
        transliterators.default;

    return fn(text);
}

browser.contextMenus.create({
    id: "transliterate-text",
    title: "Transliterate Text",
    contexts: ["selection"]
});

browser.contextMenus.onClicked.addListener(
    async (info) => {
        if (info.menuItemId !== "transliterate-text")
            return;

        const selectedText = info.selectionText;

        if (!selectedText)
            return;

        const result = transliterateText(selectedText);

        await browser.storage.local.set({
            originalText: selectedText,
            transliteratedText: result
        });

        await browser.windows.create({
            url: browser.runtime.getURL("popup.html"),
            type: "popup",
            width: 500,
            height: 300
        });
    }
);