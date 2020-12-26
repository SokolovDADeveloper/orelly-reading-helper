const link = document.createElement('link');
link.href =  chrome.runtime.getURL('lib/styles/custom_code_style.css');
link.rel = 'stylesheet';
document.head.appendChild(link);