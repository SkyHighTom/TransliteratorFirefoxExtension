async function loadData() {

    const data =
        await browser.storage.local.get([
            "originalText",
            "transliteratedText"
        ]);

    document.getElementById("original")
        .textContent =
            data.originalText;

    document.getElementById("result")
        .textContent =
            data.transliteratedText;
}

document
    .getElementById("copy")
    .addEventListener(
        "click",
        async () => {

            const text =
                document
                .getElementById("result")
                .textContent;

            await navigator.clipboard.writeText(
                text
            );
        }
    );

loadData();