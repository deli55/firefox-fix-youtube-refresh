console.log("Firefox Fix Youtube Refresh loaded.");

// Helper: format seconds into YouTube's t= format
function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m > 0 ? m + 'm' : ''}${s}s`;
}

// Toolbar button click
browser.browserAction.onClicked.addListener(tab => {
    console.log("Firefox Fix Youtube Refresh: Button clicked on tab:", tab.url);

    if (!tab.url.includes("youtube.com/watch")) {
        console.log("Firefox Fix Youtube Refresh: Not a YouTube video page");
        return;
    }

    // Get current video time reliably
    browser.tabs.executeScript(tab.id, {
        code: `
            (function() {
                const video = document.querySelector("video");
                if (!video) return 0;
                return video.currentTime;
            })();
        `
    }).then(results => {
        const time = results[0] || 0;
        const t = formatTime(time);
        console.log("Firefox Fix Youtube Refresh: Video time formatted:", t);

        // Reload with updated URL
        const url = new URL(tab.url);
        url.searchParams.set("t", t);

        // Reload the tab
        browser.tabs.update(tab.id, { url: url.toString() });
    }).catch(err => console.error("Firefox Fix Youtube Refresh: Error getting video time:", err));
});
