var bnbUi = (function() {
    let tabbar;
    let tab_button;
    let active_tab_container;
    let active_label_container;
    let active_tab;
    let tab_length;
    let activeIndex;
    let bStartEvent;
    return {
        "init": function() {
            tabbar = document.getElementById('tab_bar');
            tab_button = document.getElementById('tab_button');
            active_tab_container = document.getElementById('active_tab_container');
            active_label_container = document.getElementById('active_label_container');
            active_tab = 2;
            tab_length = tab_button.querySelectorAll('.tab').length
            activeIndex = 0;
            bStartEvent = false;
            tabbar.querySelector('.left_side').addEventListener('transitionend', bnbUi.resetTransitionEndHandler);
            tab_button.addEventListener("click", function(e) {
                e.preventDefault();
                if (e.target.classList.contains('tab')) {
                    if (e.target.classList.contains('hide')) {
                        return;
                    }
                    if (bStartEvent) {
                        return;
                    }
                    bStartEvent = true;
                    const index = webUI.getChildIndex(e.target);
                    if (active_tab == index) {
                        return false;
                    }
                    bnbUi.gotoPosition(index);
                    const idx = index + 1;
                }
            }, true);

            setTimeout(function() {
                document.getElementById('mobile-gnb').classList.add('on');
            }, 0);
            setTimeout(function() {
                active_tab_container.querySelectorAll('.tab')[2].classList.add('active');
            }, 300);
        },
        "fadeInOut": function(begin, end, delay) {
            setTimeout(function() {
                active_tab_container.querySelectorAll('.tab')[begin].classList.remove('active');
                active_label_container.querySelectorAll('.label')[begin].classList.remove('active');
                if (begin < end) {
                    for (let i = begin; i <= end; i++) {
                        tab_button.querySelectorAll('.tab')[i].classList.add('hide');
                    }
                } else {
                    for (let i = begin; i >= end; i--) {
                        tab_button.querySelectorAll('.tab')[i].classList.add('hide');
                    }
                }
            }, 0);
            setTimeout(function() {
                tab_button.querySelectorAll('.tab').forEach(function(item) {
                    item.classList.remove('active');
                });
                if (begin < end) {
                    for (let i = begin; i < end; i++) {
                        tab_button.querySelectorAll('.tab')[i].classList.remove('hide');
                    }
                    active_label_container.querySelectorAll('.label')[end].classList.add('active');
                } else {
                    for (let i = begin; i > end; i--) {
                        tab_button.querySelectorAll('.tab')[i].classList.remove('hide');
                    }
                    active_label_container.querySelectorAll('.label')[end].classList.add('active');
                }
            }, delay);

            setTimeout(function() {
                active_tab_container.querySelectorAll('.tab')[end].classList.add('active');
            }, delay - 0);
        },
        "gotoPosition": function(index) {
            const left_flex_grow = index;
            const right_flex_grow = (tab_length - 1) - index;
            bnbUi.fadeInOut(active_tab, index, 250);
            tabbar.querySelector('.left_side').style.cssText = '-webkit-box-flex:' + left_flex_grow + ';flex-grow:' + left_flex_grow + ';';
            tabbar.querySelector('.right_side').style.cssText = '-webkit-box-flex:' + right_flex_grow + ';flex-grow:' + right_flex_grow + ';';
            active_tab = index;
        },
        "resetTransitionEndHandler": function() {
            bStartEvent = false;
        }
    }
})();