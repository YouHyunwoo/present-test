const pages = document.querySelector('#pages');



export function moveToPage(pageId) {
    const pageNode = Array.from(pages.children);

    const pageIds = pageNode.map(page => page.id);

    if (!pageIds.includes(pageId)) {
        return;
    }

    pageNode.forEach(page => {
        if (page.id === pageId) {
            page.style.display = 'block';
        }
        else {
            page.style.display = 'none';
        }
    });
}
