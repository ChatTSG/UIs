'use strict';

var theme = {
    init: function () {
        this.navCompact();
        this.navToggle();
        this.sidebarShow();
        this.textareaAutoRows();
        this.imageZoom();
        this.videoPlayer();
        this.switchTheme();
    },
    
    // 
    // Toggle compact navigation
    // 
    navCompact: () => {
        const nav = document.querySelector('.navigation');        
        const navCompactToggle = document.querySelector('.js-toggle-nav-compact');

        if (nav == null || navCompactToggle == null) {
            return;
        }

        // Check button state in localStorage
        const isCompact = localStorage.getItem('buttonState') === 'is-compact';
        if (isCompact) {
            nav.classList.add('is-compact');
        } else {
            nav.classList.remove('is-compact');
        }

        navCompactToggle.addEventListener('click', (e) => {
            nav.classList.toggle('is-compact');

            // Save button state in localStorage
            const state = nav.classList.contains('is-compact') ? 'is-compact' : '';
            localStorage.setItem('buttonState', state);
            e.preventDefault();
        });
    },
    
    // 
    // Toggle navigation
    // 
    navToggle: () => {
        const nav = document.querySelector('.navigation');
        const navShow = document.querySelector('.js-navigation-show');
        const navClose = document.querySelector('.nav-close');
        const backdrop = document.querySelector('.nav-backdrop');
        const mediaQuery = window.matchMedia("(min-width: 1200px)");

        if (nav == null || navShow == null || navClose == null || backdrop == null) {
            return;
        }

        navShow.addEventListener('click', function (e) {
            nav.classList.toggle('show');
            e.preventDefault();
        });
        
        navClose.addEventListener('click', function (e) {
            nav.classList.remove('show');
        });

        backdrop.addEventListener('click', function (e) {
            nav.classList.remove('show');
        });

        function handleTabletChange(e) {
            if (e.matches) {
                nav.classList.remove('show');
            }
        }

        mediaQuery.addEventListener("change", handleTabletChange);
        handleTabletChange(mediaQuery);
    },
    
    // 
    // Toggle sidebar
    // 
    sidebarShow: () => {
        const sidebar = document.querySelector('.sidebar');        
        const sidebarToggle = document.querySelector('.js-toggle-sidebar');

        if (sidebar == null || sidebarToggle == null) {
            return;
        }

        // Check sidebar state in localStorage
        const isActive = localStorage.getItem('sidebarState') === 'is-active';
        if (isActive) {
            sidebar.classList.add('is-active');
        } else {
            sidebar.classList.remove('is-active');
        }

        sidebarToggle.addEventListener('click', (e) => {
            sidebar.classList.toggle('is-active');

            // Save sidebar state in localStorage
            const state = sidebar.classList.contains('is-active') ? 'is-active' : '';
            localStorage.setItem('sidebarState', state);
            e.preventDefault();
        });
    },
    
    // 
    // Add textarea rows on new line
    // Idea author Github: https://github.com/lifemaster
    textareaAutoRows: () => {
        const textarea = document.querySelector('.chat-form-control');
        const sidebarToggle = document.querySelector('.js-toggle-sidebar');
        const navCompactToggle = document.querySelector('.js-toggle-nav-compact');

        if (textarea == null) {
            return;
        }
        
        const minRows = parseInt(textarea.dataset.minRows) || 1;
        const maxRows = parseInt(textarea.dataset.maxRows) || 5;

        if (minRows <= 0) {
            minRows = 2;
        }

        if (maxRows <= 0 || maxRows < minRows) {
            maxRows = minRows;
        }

        textarea.setAttribute('rows', minRows);

        textarea.addEventListener('input', () => {
            if (minRows === maxRows) {
                return;
            }

            increaseRows();
            decreaseRows();
        });
        
        window.addEventListener('resize', () => {
            setTimeout(() => {
                if (minRows === maxRows) {
                    return;
                }
                
                increaseRows();
                decreaseRows();
            }, 200);
        });
        
        if (sidebarToggle == null) {
            return;
        } else {
            sidebarToggle.addEventListener('click', () => {
                if (minRows === maxRows) {
                    return;
                }
                
                increaseRows();
                decreaseRows();
            });
        }
        
        if (navCompactToggle == null) {
            return;
        } else {
            navCompactToggle.addEventListener('click', () => {
                if (minRows === maxRows) {
                    return;
                }
                
                increaseRows();
                decreaseRows();
            });
        }

        function increaseRows() {
            if (textarea.scrollHeight > textarea.clientHeight && textarea.getAttribute('rows') < maxRows) {
                incrementRows();
                increaseRows();
            }
        }

        function decreaseRows() {
            if (textarea.scrollHeight === textarea.clientHeight && textarea.getAttribute('rows') > minRows) {
                decrementRows();
                (textarea.scrollHeight > textarea.clientHeight) ? increaseRows() : decreaseRows();
            }
        }

        function incrementRows() {
            textarea.setAttribute('rows', parseInt(textarea.getAttribute('rows')) + 1);
        }

        function decrementRows() {
            textarea.setAttribute('rows', parseInt(textarea.getAttribute('rows')) - 1);
        }
    },
    
    // 
    // Image zoom plugin
    // Github: https://github.com/francoischalifour/medium-zoom
    imageZoom: () => {
        mediumZoom('[data-zoomable]', {
            margin: 16,
            background: '#241636',
        });
    },
    
    // 
    // Plyr video player
    // 
    videoPlayer: () => {
        const players = Array.from(document.querySelectorAll('.js-player')).map((p) => new Plyr(p));
    },
    
    // 
    // Theme switcher
    // Enable or disable dark theme
    switchTheme: () => {
        const storedTheme = localStorage.getItem('theme');

        const getPreferredTheme = () => {
            if (storedTheme) {
                return storedTheme;
            }

            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        
        const transitionOff = function() {
            document.documentElement.classList.add('transition-off');
        }
        
        const transitionOn = function() {
            setTimeout(function() {document.documentElement.classList.remove('transition-off')}, 250);
        }

        const setTheme = function (theme) {
            if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                transitionOff();
                document.documentElement.setAttribute('data-bs-theme', 'dark');
                transitionOn();
            } else {
                transitionOff()
                document.documentElement.setAttribute('data-bs-theme', theme);
                transitionOn();
            }
        }

        setTheme(getPreferredTheme());

        const updateSwitcherStatus = theme => {
            const btnThemeToggle = document.querySelector('#switchTheme');

            if (btnThemeToggle == null) {
                return;
            }
            
            if (theme == 'light') {
                btnThemeToggle.checked = false;
                btnThemeToggle.setAttribute('value', 'light');
            } else if (theme == 'dark') {
                btnThemeToggle.checked = true;
                btnThemeToggle.setAttribute('value', 'dark');
            }
        }

        updateSwitcherStatus(getPreferredTheme());

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (storedTheme !== 'light' || storedTheme !== 'dark') {
                setTheme(getPreferredTheme());
            }
        });

        window.addEventListener('DOMContentLoaded', () => {

            document.querySelectorAll('.form-switch-theme .form-check-input').forEach(switcher => {
                switcher.addEventListener('click', () => {
                    
                    var switcherPosition = switcher.checked;
                    var theme;

                    if (switcherPosition == true) {
                        theme = 'dark';
                    } else {
                        theme = 'light';
                    }

                    localStorage.setItem('theme', theme);
                    setTheme(theme);
                    updateSwitcherStatus(theme);
                })
            })
        })
    },
}

theme.init();
