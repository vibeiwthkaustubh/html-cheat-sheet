/**
 * HTML Tags Master Guide - Core Interactive Engine
 * Features: 1-Click Copy Code, Keyboard Arrow Navigation, Theme Switcher, Mouse Spotlight, Live Playground
 * Author: Kaustubh Singh
 */

(function () {
  'use strict';

  // 1. Interactive Mouse Spotlight
  document.addEventListener('mousemove', function (e) {
    var x = (e.clientX / window.innerWidth) * 100;
    var y = (e.clientY / window.innerHeight) * 100;
    document.body.style.setProperty('--mouse-x', x + '%');
    document.body.style.setProperty('--mouse-y', y + '%');
  });

  document.addEventListener('DOMContentLoaded', function () {
    // 2. Theme Toggle Setup (Dark Space vs Light Paper)
    initThemeToggle();

    // 3. 1-Click "Copy Code" Setup
    initCopyCodeButtons();

    // 4. Keyboard Arrow Navigation
    initKeyboardNavigation();

    // 5. Live HTML Playground (if page contains playground container)
    initLivePlayground();
  });

  // --- Theme Toggle ---
  function initThemeToggle() {
    var savedTheme = localStorage.getItem('html_guide_theme') || 'dark';
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
    }

    // Add toggle button into quick-nav or header if available
    var quickNav = document.querySelector('.quick-nav');
    if (quickNav && !document.getElementById('themeToggleBtn')) {
      var toggleBtn = document.createElement('button');
      toggleBtn.id = 'themeToggleBtn';
      toggleBtn.className = 'theme-toggle-btn';
      toggleBtn.type = 'button';
      toggleBtn.title = 'Toggle Dark / Light Theme';
      toggleBtn.innerHTML = savedTheme === 'light' ? '&#9790; Dark Mode' : '&#9728; Light Mode';

      toggleBtn.addEventListener('click', function () {
        var isLight = document.body.classList.toggle('light-theme');
        var newTheme = isLight ? 'light' : 'dark';
        localStorage.setItem('html_guide_theme', newTheme);
        toggleBtn.innerHTML = isLight ? '&#9790; Dark Mode' : '&#9728; Light Mode';
      });

      quickNav.appendChild(toggleBtn);
    }
  }

  // --- 1-Click Copy Code Buttons ---
  function initCopyCodeButtons() {
    document.querySelectorAll('pre').forEach(function (pre) {
      if (pre.querySelector('.copy-code-btn')) return;

      var copyBtn = document.createElement('button');
      copyBtn.className = 'copy-code-btn';
      copyBtn.textContent = 'Copy';
      copyBtn.type = 'button';
      copyBtn.setAttribute('aria-label', 'Copy code snippet to clipboard');

      copyBtn.addEventListener('click', function () {
        var code = pre.querySelector('code');
        var textToCopy = code ? code.innerText : pre.innerText;

        navigator.clipboard.writeText(textToCopy.trim()).then(function () {
          copyBtn.textContent = 'Copied! \u2713';
          copyBtn.classList.add('copied');

          setTimeout(function () {
            copyBtn.textContent = 'Copy';
            copyBtn.classList.remove('copied');
          }, 2000);
        }).catch(function () {
          copyBtn.textContent = 'Failed';
        });
      });

      pre.style.position = 'relative';
      pre.appendChild(copyBtn);
    });
  }

  // --- Keyboard Arrow Navigation ---
  function initKeyboardNavigation() {
    var prevLink = document.querySelector('link[rel="prev"]') || document.querySelector('.step-btn.prev');
    var nextLink = document.querySelector('link[rel="next"]') || document.querySelector('.step-btn.next');

    document.addEventListener('keydown', function (e) {
      // Don't trigger when user is typing in input or textarea
      var tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      if (e.key === 'ArrowLeft' && prevLink && prevLink.getAttribute('href')) {
        window.location.href = prevLink.getAttribute('href');
      } else if (e.key === 'ArrowRight' && nextLink && nextLink.getAttribute('href')) {
        window.location.href = nextLink.getAttribute('href');
      }
    });
  }

  // --- Interactive Live HTML Playground ---
  function initLivePlayground() {
    var editor = document.getElementById('playgroundEditor');
    var frame = document.getElementById('playgroundFrame');
    var resetBtn = document.getElementById('playgroundReset');

    if (editor && frame) {
      var defaultCode = editor.value;

      function updatePreview() {
        var doc = frame.contentDocument || frame.contentWindow.document;
        doc.open();
        doc.write('<!DOCTYPE html><html><head><style>body{font-family:system-ui,sans-serif;margin:16px;line-height:1.6;color:#1e293b;background:#ffffff;}</style></head><body>' + editor.value + '</body></html>');
        doc.close();
      }

      editor.addEventListener('input', updatePreview);
      if (resetBtn) {
        resetBtn.addEventListener('click', function () {
          editor.value = defaultCode;
          updatePreview();
        });
      }

      updatePreview();
    }
  }
})();