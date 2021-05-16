function copyText(text) {
    const ta = document.createElement("textarea");
    document.body.appendChild(ta);
    ta.value = text;
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
}

function copyHTMLContent(content) {
    html2canvas(content, { scrollY: -window.scrollY }).then(canvas => {
        canvas.toBlob(function(blob) {
            const item = new ClipboardItem({ "image/png": blob });

            navigator.clipboard.write([item]);
        });
    });
}

export default {
    copyText,
    copyHTMLContent,
};