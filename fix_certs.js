const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Replace the structure
html = html.replace(/<div class="cert-item">\s*<div class="cert-logo">([\s\S]*?)<\/div>\s*<div class="cert-info">([\s\S]*?)<\/div>\s*<\/div>/g, (match, logo, info) => {
    // Check if info contains a button
    let buttonHtml = '';
    let cleanInfo = info;
    const buttonMatch = info.match(/(<button class="view-cert-btn"[\s\S]*?<\/button>)/);
    
    if (buttonMatch) {
        buttonHtml = '\n                            ' + buttonMatch[1];
        cleanInfo = info.replace(buttonMatch[1], '').trimEnd();
    } else {
        // If no button, add a disabled button for perfect alignment.
        buttonHtml = '\n                            <button class="view-cert-btn" style="opacity:0; pointer-events:none; cursor:default;" aria-hidden="true">View Certificate</button>';
    }

    return `<div class="cert-item">
                            <div class="cert-top">
                                <div class="cert-logo">${logo.trim()}</div>
                                <div class="cert-info">
                                    ${cleanInfo.trim()}
                                </div>
                            </div>${buttonHtml}
                        </div>`;
});

fs.writeFileSync('index.html', html);
console.log('HTML updated successfully!');
