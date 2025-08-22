// Force Light Theme Script
// This script ensures the website always uses light theme regardless of system preferences

(function() {
  'use strict';
  
  // Function to force light theme
  function forceLightTheme() {
    // Force light theme attributes
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.setAttribute('data-mode', 'light');
    document.documentElement.setAttribute('color-scheme', 'light');
    
    // Remove dark mode classes
    document.documentElement.classList.remove('dark', 'dark-mode', 'theme-dark');
    document.documentElement.classList.add('light', 'light-mode', 'theme-light');
    
    // Force light theme styles
    document.documentElement.style.colorScheme = 'light';
    document.documentElement.style.setProperty('--color-scheme', 'light');
    document.documentElement.style.setProperty('--theme', 'light');
    
    // Override body styles
    if (document.body) {
      document.body.setAttribute('data-theme', 'light');
      document.body.classList.remove('dark', 'dark-mode');
      document.body.classList.add('light', 'light-mode');
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#000000';
    }
  }
  
  // Function to monitor and prevent dark mode
  function preventDarkMode() {
    // Force light theme immediately
    forceLightTheme();
    
    // Monitor for any theme changes and force light
    const observer = new MutationObserver(function(mutations) {
      let shouldForceLight = false;
      
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'data-theme' || 
             mutation.attributeName === 'data-mode' || 
             mutation.attributeName === 'class')) {
          shouldForceLight = true;
        }
        
        if (mutation.type === 'childList') {
          // Check if any dark mode classes were added
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.classList && 
                  (node.classList.contains('dark') || 
                   node.classList.contains('dark-mode') ||
                   node.classList.contains('theme-dark'))) {
                shouldForceLight = true;
              }
            }
          });
        }
      });
      
      if (shouldForceLight) {
        // Small delay to ensure DOM is updated
        setTimeout(forceLightTheme, 10);
      }
    });
    
    // Start observing
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-mode', 'class'],
      childList: true,
      subtree: true
    });
    
    // Also observe body
    if (document.body) {
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['data-theme', 'data-mode', 'class'],
        childList: true,
        subtree: true
      });
    }
    
    return observer;
  }
  
  // Function to override system preferences
  function overrideSystemPreferences() {
    // Override prefers-color-scheme media query
    if (window.matchMedia) {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Force light theme even if system prefers dark
      if (darkModeQuery.matches) {
        forceLightTheme();
      }
      
      // Listen for changes and force light
      darkModeQuery.addListener(function(e) {
        if (e.matches) {
          forceLightTheme();
        }
      });
    }
  }
  
  // Function to handle dynamic content
  function handleDynamicContent() {
    // Override any CSS that might be loaded dynamically
    const style = document.createElement('style');
    style.textContent = `
      [data-theme="dark"], [data-theme="dark"] *,
      [data-mode="dark"], [data-mode="dark"] *,
      .dark, .dark *,
      .dark-mode, .dark-mode *,
      .theme-dark, .theme-dark * {
        color-scheme: light !important;
        background-color: inherit !important;
        color: inherit !important;
      }
      
      html[data-theme="dark"],
      html[data-mode="dark"],
      html.dark,
      html.dark-mode {
        color-scheme: light !important;
        background-color: #ffffff !important;
        color: #000000 !important;
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      const observer = preventDarkMode();
      overrideSystemPreferences();
      handleDynamicContent();
      
      // Store observer for cleanup if needed
      window.lightThemeObserver = observer;
    });
  } else {
    // DOM is already ready
    const observer = preventDarkMode();
    overrideSystemPreferences();
    handleDynamicContent();
    
    // Store observer for cleanup if needed
    window.lightThemeObserver = observer;
  }
  
  // Also run on window load to catch any late changes
  window.addEventListener('load', function() {
    forceLightTheme();
  });
  
  // Run periodically to ensure light theme is maintained
  setInterval(forceLightTheme, 1000);
  
  // Export functions for external use
  window.forceLightTheme = forceLightTheme;
  window.preventDarkMode = preventDarkMode;
  
})();
