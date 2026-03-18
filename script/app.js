window.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.fade-up').forEach(function(el) {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
});

$(document).ready(function () {

    $.getJSON("data.json", function (data) {

        // ════════════════════════════════════════════════════════
        // 1. THEME ENGINE
        // ════════════════════════════════════════════════════════

        var darkVars = {
            bg: '#0F1117', surface: '#1A1D27',
            ink: '#F0F0F0', ink2: '#B0B0B8', ink3: '#70707A',
            line: '#2A2D3A'
        };

        function applyTheme(themeName) {
            var t = data.themes[themeName] || data.themes[data.defaults.theme];
            var r = document.documentElement;
            r.style.setProperty('--accent',  t.accent);
            r.style.setProperty('--accent2', t.accent2);
            if (!$('body').hasClass('dark-mode')) {
                r.style.setProperty('--bg',      t.bg);
                r.style.setProperty('--surface', t.surface);
                r.style.setProperty('--ink',     t.ink);
            }
            $('.tp-color').removeClass('active');
            $('.tp-color[data-theme="' + themeName + '"]').addClass('active');
        }

        function applyFont(fontName) {
            var f = data.fonts[fontName];
            if (!f) return;
            if (f.googleUrl) {
                var id = 'font-' + fontName.replace(/\W/g, '-');
                if (!$('#' + id).length) {
                    $('head').append('<link id="' + id + '" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=' + f.googleUrl + '&display=swap"/>');
                }
            }
            document.documentElement.style.setProperty('--serif', f.serif);
            document.documentElement.style.setProperty('--sans',  f.sans);
            $('.tp-font-btn').removeClass('active');
            $('.tp-font-btn[data-font="' + fontName + '"]').addClass('active');
        }

        function applyDark(on) {
            var r = document.documentElement;
            if (on) {
                $('body').addClass('dark-mode');
                r.style.setProperty('--bg',      darkVars.bg);
                r.style.setProperty('--surface', darkVars.surface);
                r.style.setProperty('--ink',     darkVars.ink);
                r.style.setProperty('--ink2',    darkVars.ink2);
                r.style.setProperty('--ink3',    darkVars.ink3);
                r.style.setProperty('--line',    darkVars.line);
            } else {
                $('body').removeClass('dark-mode');
                var saved = localStorage.getItem('sv-theme') || data.defaults.theme;
                var t = data.themes[saved] || data.themes[data.defaults.theme];
                r.style.setProperty('--bg',      t.bg);
                r.style.setProperty('--surface', t.surface);
                r.style.setProperty('--ink',     t.ink);
                r.style.removeProperty('--ink2');
                r.style.removeProperty('--ink3');
                r.style.removeProperty('--line');
            }
        }

        var savedTheme = localStorage.getItem('sv-theme') || data.defaults.theme;
        var savedFont  = localStorage.getItem('sv-font')  || data.defaults.font;
        var savedDark  = localStorage.getItem('sv-dark') !== null
                            ? localStorage.getItem('sv-dark') === 'true'
                            : data.defaults.darkMode;

        applyTheme(savedTheme);
        applyFont(savedFont);
        if (savedDark) applyDark(true);

        // ════════════════════════════════════════════════════════
        // 2. BUILD THEME PANEL ONLY (no trigger button — it's in navbar)
        // ════════════════════════════════════════════════════════

        var colorBtns = Object.keys(data.themes).map(function(key) {
            var t = data.themes[key];
            return '<button class="tp-color" data-theme="' + key + '" style="background:' + t.accent + '" title="' + key + '"></button>';
        }).join('');

        var fontBtns = Object.keys(data.fonts).map(function(key) {
            return '<button class="tp-font-btn" data-font="' + key + '">' + key + '</button>';
        }).join('');

        // Append ONLY the panel — trigger button is already in index.html navbar
        var panel =
            '<div id="theme-panel">' +
                '<div id="tp-header"><span>&#9881;&nbsp; Theme Settings</span><button id="tp-close">&times;</button></div>' +
                '<div id="tp-body">' +
                    '<div class="tp-label">Mode</div>' +
                    '<label class="tp-toggle">' +
                        '<input type="checkbox" id="tp-dark" ' + (savedDark ? 'checked' : '') + '/>' +
                        '<span class="tp-slider"></span>' +
                        '<span>Dark Mode</span>' +
                    '</label>' +
                    '<div class="tp-label">Accent Color</div>' +
                    '<div class="tp-colors">' + colorBtns + '</div>' +
                    '<div class="tp-label">Font Pairing</div>' +
                    '<div class="tp-fonts">' + fontBtns + '</div>' +
                    '<button id="tp-reset">Reset to Default</button>' +
                '</div>' +
            '</div>';

        $('body').append(panel);

        $('.tp-color[data-theme="' + savedTheme + '"]').addClass('active');
        $('.tp-font-btn[data-font="' + savedFont + '"]').addClass('active');

        // Panel internal styles only — no trigger styles (handled in app.css)
        $('head').append('<style>' +
            '#theme-panel{' +
                'position:fixed;top:68px;right:24px;width:300px;' +
                'background:var(--surface);border:1px solid var(--line,#E0DDD6);' +
                'border-radius:14px;box-shadow:0 20px 60px rgba(0,0,0,0.15);' +
                'z-index:9999;display:none;overflow:hidden;' +
                'font-family:var(--sans);' +
            '}' +
            '#tp-header{' +
                'display:flex;justify-content:space-between;align-items:center;' +
                'padding:16px 18px;border-bottom:1px solid var(--line,#E0DDD6);' +
                'font-size:0.85rem;font-weight:600;color:var(--ink);' +
            '}' +
            '#tp-close{' +
                'background:none;border:none;font-size:1.3rem;cursor:pointer;' +
                'color:var(--ink3,#888);line-height:1;padding:0;' +
            '}' +
            '#tp-body{padding:18px;}' +
            '.tp-label{font-size:0.7rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink3,#888);margin:14px 0 8px;}' +
            '.tp-label:first-child{margin-top:0}' +
            '.tp-toggle{display:flex;align-items:center;gap:10px;cursor:pointer;font-size:0.85rem;color:var(--ink);}' +
            '.tp-toggle input{display:none;}' +
            '.tp-slider{' +
                'position:relative;width:38px;height:20px;background:#ccc;' +
                'border-radius:100px;transition:background 0.2s;flex-shrink:0;' +
            '}' +
            '.tp-slider::after{' +
                'content:"";position:absolute;top:3px;left:3px;' +
                'width:14px;height:14px;background:#fff;border-radius:50%;' +
                'transition:transform 0.2s;' +
            '}' +
            '.tp-toggle input:checked + .tp-slider{background:var(--accent);}' +
            '.tp-toggle input:checked + .tp-slider::after{transform:translateX(18px);}' +
            '.tp-colors{display:flex;gap:8px;flex-wrap:wrap;}' +
            '.tp-color{' +
                'width:28px;height:28px;border-radius:50%;border:2px solid transparent;' +
                'cursor:pointer;transition:transform 0.15s,border-color 0.15s;' +
            '}' +
            '.tp-color:hover{transform:scale(1.15);}' +
            '.tp-color.active{border-color:var(--ink,#111);transform:scale(1.15);}' +
            '.tp-fonts{display:flex;flex-direction:column;gap:6px;}' +
            '.tp-font-btn{' +
                'text-align:left;padding:8px 12px;border-radius:6px;' +
                'border:1.5px solid var(--line,#E0DDD6);background:transparent;' +
                'font-size:0.82rem;cursor:pointer;color:var(--ink);' +
                'transition:all 0.15s;' +
            '}' +
            '.tp-font-btn:hover{border-color:var(--accent);color:var(--accent);}' +
            '.tp-font-btn.active{border-color:var(--accent);background:var(--accent);color:#fff;}' +
            '#tp-reset{' +
                'width:100%;margin-top:16px;padding:9px;border-radius:6px;' +
                'border:1.5px solid var(--line,#E0DDD6);background:transparent;' +
                'font-size:0.8rem;font-weight:600;cursor:pointer;color:var(--ink3,#888);' +
                'transition:all 0.15s;letter-spacing:0.04em;' +
            '}' +
            '#tp-reset:hover{border-color:var(--accent);color:var(--accent);}' +
            '.dark-mode #theme-panel{box-shadow:0 20px 60px rgba(0,0,0,0.4);}' +
        '</style>');

        // ════════════════════════════════════════════════════════
        // 3. PANEL EVENTS
        // ════════════════════════════════════════════════════════

        $('#theme-trigger').on('click', function(e) {
            e.stopPropagation();
            $('#theme-panel').fadeToggle(180);
        });

        $('#tp-close').on('click', function() {
            $('#theme-panel').fadeOut(180);
        });

        $('#tp-dark').on('change', function() {
            var on = $(this).is(':checked');
            applyDark(on);
            localStorage.setItem('sv-dark', on);
        });

        $(document).on('click', '.tp-color', function() {
            var t = $(this).data('theme');
            applyTheme(t);
            localStorage.setItem('sv-theme', t);
        });

        $(document).on('click', '.tp-font-btn', function() {
            var f = $(this).data('font');
            applyFont(f);
            localStorage.setItem('sv-font', f);
        });

        $('#tp-reset').on('click', function() {
            localStorage.removeItem('sv-theme');
            localStorage.removeItem('sv-font');
            localStorage.removeItem('sv-dark');
            applyTheme(data.defaults.theme);
            applyFont(data.defaults.font);
            applyDark(data.defaults.darkMode);
            $('#tp-dark').prop('checked', data.defaults.darkMode);
        });

        $(document).on('click', function(e) {
            if (!$(e.target).closest('#theme-panel, #theme-trigger').length) {
                $('#theme-panel').fadeOut(180);
            }
        });

        // ════════════════════════════════════════════════════════
        // 4. POPULATE CONTENT
        // ════════════════════════════════════════════════════════

        $('title').text(data.name + ' — ' + data.role);
        $('img[alt]').attr('alt', data.name);
        $('.my-name').text(data.name);
        $('.experience').text(data.experience);
        $('.total-projects').text(data.totalProjects);
        $('.total-companies').text(data.totalCompanies);

        $('.hero-desc').html(
            data.tagline + ' <span class="experience">' + data.experience + '</span> years hands-on experience.'
        );

        $('.about-text').html(
            '<p>I\'m a Software Developer based in Puducherry, India with <span class="experience">' + data.experience + '</span> years of experience building and shipping web applications. My core strength is Laravel and PHP — I\'ve worked on everything from early-stage learning projects to large-scale government portals and enterprise SaaS products.</p>' +
            '<p>I\'ve led framework migrations, built in-house CRM products, integrated payment gateways, managed Linux servers, and mentored junior developers. I take pride in writing clean, maintainable code that solves real problems.</p>' +
            '<p>Outside work, I build personal projects to sharpen my skills — currently exploring Vue 3 and Laravel 12 API development.</p>'
        );

        $('.contact-email').attr('href', 'mailto:' + data.contact.email).find('span').text(data.contact.email);
        $('.contact-phone').attr('href', 'tel:' + data.contact.phone.replace(/\s/g,'')).find('span').text(data.contact.phone);
        $('.contact-linkedin').attr('href', data.contact.linkedin);
        $('.contact-github').attr('href', data.contact.github);

        $('.footer-copy').text('© ' + new Date().getFullYear() + ' ' + data.name + '. All rights reserved.');

        // Skills
        var corners = ['border-radius:10px 0 0 0','','border-radius:0 10px 0 0','border-radius:0 0 0 10px','','border-radius:0 0 10px 0'];
        var skillsGrid = $('.skills-grid').empty();
        $.each(data.skills, function(i, s) {
            var tags = s.tags.map(function(t){ return '<span class="skill-tag">'+t+'</span>'; }).join('');
            var style = corners[i] ? ' style="'+corners[i]+'"' : '';
            skillsGrid.append('<div class="skill-card"'+style+'><div class="skill-icon">'+s.icon+'</div><div class="skill-cat">'+s.category+'</div><div class="skill-name">'+s.name+'</div><div class="skill-tags">'+tags+'</div></div>');
        });

        // Experience
        var timeline = $('.exp-timeline').empty();
        $.each(data.experience_list, function(i, e) {
            var pts = e.points.map(function(p){ return '<li>'+p+'</li>'; }).join('');
            timeline.append('<div class="exp-item'+(e.current?' current':'')+'"><div class="exp-dot"></div><div class="exp-period">'+e.period+'</div><div class="exp-role">'+e.role+'</div><div class="exp-company">'+e.company+' — '+e.location+'</div><ul class="exp-points">'+pts+'</ul></div>');
        });

        // Projects
        var grid = $('.projects-grid').empty();
        $.each(data.projects, function(i, p) {
            var tech = p.tech.map(function(t){ return '<span>'+t+'</span>'; }).join('');
            var gh = p.github ? '<a href="'+p.github+'" target="_blank" class="proj-link"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>View on GitHub</a>' : '';
            var topStyle = p.color ? ' style="background:'+p.color+'"' : '';
            var topInner = p.badge
                ? '<div class="proj-header-row"><div class="proj-num">'+p.number+'</div><span class="badge">'+p.badge+'</span></div><div class="proj-title">'+p.title+'</div>'
                : '<div class="proj-num">'+p.number+'</div><div class="proj-title">'+p.title+'</div>';
            grid.append('<div class="proj-card"><div class="proj-card-top"'+topStyle+'>'+topInner+'</div><div class="proj-body"><div class="proj-tech">'+tech+'</div><p class="proj-desc">'+p.description+'</p>'+gh+'</div></div>');
        });

    }).fail(function() {
        console.error('Failed to load data.json');
    });

    // ════════════════════════════════════════════════════════
    // 5. HAMBURGER MENU
    // ════════════════════════════════════════════════════════

    $('#hamburger').on('click', function () {
        $(this).toggleClass('open');
        $('#nav-links').toggleClass('open');
    });

    $('#nav-links a').on('click', function () {
        $('#hamburger').removeClass('open');
        $('#nav-links').removeClass('open');
    });

});