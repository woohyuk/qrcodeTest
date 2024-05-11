var webUI = (function() {
    var timeout;
    return {
        "getChildIndex": function(child) {
            var parent = child.parentNode;
            var children = parent.children;
            var i = children.length - 1;
            for (; i >= 0; i--) {
                if (child == children[i]) {
                    break;
                }
            }
            return i;
        },
        "debounce": function(func, wait, immediate) {
            var context = this,
                args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            }, wait);
            if (immediate && !timeout) func.apply(context, args);
        },
		"easeInOutQuad" : function (t, b, c, d) {
			t /= d/2;
			if (t < 1) return c/2*t*t + b;
			t--;
			return -c/2 * (t*(t-2) - 1) + b;
		},
		"animatedScrollTo": function(element, to, duration) {
			var start = element.scrollLeft;
			var change = to - start;
			var currentTime = 0;
			var increment = 20;
			var animateScroll = function(callback) {
				currentTime += increment;
				var val = Math.floor(webUI.easeInOutQuad(currentTime, start, change, duration));
				element.scrollLeft = val;
				if (currentTime < duration) {
					window.requestAnimationFrame(animateScroll);
				} else {
					if (callback && typeof(callback) === 'function') {
						callback();
					}
				}
			}
			animateScroll();
		},
        "addListener": function(node, event, listener, useCapture) {
            if (!node || !event || !listener) return;

            if (node instanceof Node) {
                node.addEventListener(event, listener, (typeof useCapture === "undefined") ? false : useCapture);
            } else if (node instanceof NodeList) {
                if (node.length > 0) {
                    for (var i = 0, l = node.length; i < l; i++) {
                        node[i].addEventListener(event, listener, (typeof useCapture === "undefined") ? false : useCapture);
                    }
                }
            }
        },
        "addDelegate": function(node, event, selector, listener, useCapture) {
            if (!node || !event || !listener) return;

            webUI.addListener(node, event, function(e) {
                var target = e.target;
                if (typeof selector === "string") {
                    while (target && target !== this && !target.matches(selector)) {
                        target = target.parentElement;
                    }
                    if (target && target.matches(selector)) {
                        listener.call(target, e);
                    }
                } else {
                    selector.call(this, e);
                }
            }, useCapture);
        }
    }
})();

// layerPopup
var layerPopup = (function() {
	var html = undefined;
	var layer;
	var sctop;
    return {
		"show" : function(elem, container) {
			layer = document.querySelector(elem);
			if (container == null){
				html = (document.body.scrollTop == '0') ? document.documentElement : document.body;
			} else {
				html = container;
			}
			sctop = html.scrollTop;
			html.style.top = (0 - sctop) + "px";
			html.classList.add('noscroll');
            layer.setAttribute('aria-modal', 'true'); // 모달이 열릴 때 aria-modal을 true로 설정
			layer.style.display = 'block';
			setTimeout(function() {
				layer.classList.add('visible');
			}, 50);
		},
		"hide" : function(elem) {
			if (html == undefined){
				html = (document.body.scrollTop == '0') ? document.documentElement : document.body;
			}
			if (elem !== undefined){
				layer = document.querySelector(elem);
			}
			html.classList.remove("noscroll");
            layer.setAttribute('aria-modal', 'false'); // 모달이 열릴 때 aria-modal을 false로 설정
			html.scrollTop = sctop;
			html.style.top = "";
			layer.classList.remove('visible');
			setTimeout(function() {
				layer.style.display = 'none';
			}, 500);
		}
    };
}());

/* Toast Popup */
let removeToast;

function toast(string) {
    const toast = document.getElementById("toast");
    const toastCont = document.getElementById("toast-cont");

    toast.classList.contains("reveal") ?
        (clearTimeout(removeToast), removeToast = setTimeout(function () {
            document.getElementById("toast").classList.remove("reveal")
        }, 1000)) :
        removeToast = setTimeout(function () {
            document.getElementById("toast").classList.remove("reveal")
        }, 1000)
    toast.classList.add("reveal"),
    toastCont.innerText = string
}

// press event 
document.addEventListener("DOMContentLoaded", function() {
    var hasTouchEvent = "ontouchstart" in document.documentElement,
        START_EV = hasTouchEvent ? "touchstart" : "mousedown",
        END_EV = hasTouchEvent ? "touchend" : "mouseup";
    var dragPoint = false;
    webUI.addDelegate(document.body, START_EV, ".usetap", function(e) {
        dragPoint = true;
        this.classList.add("active");
    });
    webUI.addDelegate(document.body, END_EV, ".usetap", function(e) {
        dragPoint = false;
        this.classList.remove("active");
    });
    webUI.addDelegate(document.body, "touchcancel", ".usetap", function(e) {
        dragPoint = false;
        this.classList.remove("active");
    });
    webUI.addDelegate(document.body, "mousemove", ".usetap", function(e) {
        if (dragPoint == true) {
            e.target.onmouseout = function() {
                this.classList.remove("active");
            }
        }
    });
});

// Acoordion (faq)
function accordion() {
    const $accordionHd = $(".accordion-hd");

    $accordionHd.on('click', function () {
        const $clickedAccordionHd = $(this);
        const $accordionBd = $clickedAccordionHd.next('.accordion-bd');
        const $accordionItem = $clickedAccordionHd.parent('.accordion-item');

        const isExpanded = $clickedAccordionHd.attr('aria-expanded') === 'true';

        $accordionHd.attr('aria-expanded', 'false');

        $clickedAccordionHd.attr('aria-expanded', isExpanded ? 'false' : 'true');

        $('.accordion-bd').not($accordionBd).slideUp(250);

        $accordionBd.slideToggle(250);

        $accordionItem.toggleClass('show')
            .siblings('.accordion-item').removeClass('show')
            .find('.accordion-bd').slideUp(250);
    });

    $('.accordion-bd').hide();
};

// Expand Box
function expandBox() {
    const $btnExpand = $(".btn-expand");

    $btnExpand.on('click', function () {
        const $expandBoxItem = $(this).closest(".expand-item");
        const $expandBox = $(this).next(".expand-box");
        
        const isBoxVisible = $expandBox.is(":visible");
        $(this).attr("aria-expanded", isBoxVisible.toString());
        $expandBox.attr("aria-hidden", (!isBoxVisible).toString());

        $expandBox.slideToggle(250);
        $expandBoxItem.toggleClass('off');
    });
}

/* Counter Number Animation */
function animateValue(id, start, end, duration) {
    var $obj = $('#' + id);
    var range = end - start;
    var increment = range / (duration / 1000);
    var startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = timestamp - startTime;
        var current = start + increment * progress / 1000;
        $obj.html(formatNumberWithClasses(Math.floor(current)));

        if (progress < duration) {
            requestAnimationFrame(step);
        } else {
            $obj.html(formatNumberWithClasses(end));
        }
    }

    requestAnimationFrame(step);
}

// Number Format
function formatNumberWithClasses(x) {
    var formattedNumber = x.toLocaleString();
    var digits = formattedNumber.split('');
    var result = '';

    digits.forEach(function (digit) {
        if (digit === ',') {
            result += ',';
        } else {
            result += '<span class="digit">' + digit + '</span>';
        }
    });

    return result;
}

// Number Init
var targetNumber = 2999999;
var duration = 2000;
var formattedNumber = formatNumberWithClasses(targetNumber);
$('#counter').html(formattedNumber);

// Scroll Event
function handleCounterScroll() {
    var $divElement = $('.sec-intro-gseek');

    // Check if the element is present on the page
    if ($divElement.length > 0) {
        var rect = $divElement[0].getBoundingClientRect();
        var isVisible = (rect.top >= -300 && rect.top <= window.innerHeight - 300);

        if (isVisible) {
            animateValue('counter', 0, targetNumber, duration);
            $(window).off('scroll', handleCounterScroll);
        }
    } else {
        // Element not found, do nothing or handle accordingly
    }
}

// Notice Rolling 
function notiRolling() {
    var marginTopValue = ($(window).width() >= 1136) ? '-60px' : '-4rem';
    var timer;

    function startAnimation() {
        timer = setInterval(function(){
            $('#notiRolling li:first-of-type').animate({marginTop: marginTopValue}, 400, function() {
                $(this).detach().appendTo('#notiRolling').removeAttr('style');
            });
        }, 2000);
    }

    function stopAnimation() {
        clearInterval(timer);
    }

    startAnimation();

    $('#notiRolling').on('mouseover', function(){
        stopAnimation();
    }).on('mouseout', function(){
        startAnimation();
    });

    $(window).on('resize', function() {
        stopAnimation();
        marginTopValue = ($(window).width() >= 1136) ? '-60px' : '-4rem';
        startAnimation();
    });
}

notiRolling();

/* Family Site */
function openInNewWindow(selectElement) {
    var selectedValue = selectElement.value;

    // Check if a valid option is selected
    if (selectedValue && selectedValue !== "") {
        window.open(selectedValue, '_blank');
    }
}

// TabContens
function tabContens() {
    $(".tab-wrap").each(function() {
        const $tabWrap = $(this);
        const $tbtnLi = $tabWrap.find(".tab-btn li");
        const $tbtn = $tabWrap.find(".tab-btn li .tab-item");
        const $tbtn_leng = $tbtn.length;

        const $tab_contentsOb = $tabWrap.find(".tab-contents");
        $tab_contentsOb.hide();
        $tab_contentsOb.eq(0).show();
        $tbtnLi.eq(0).addClass("active").find('.tab-item').attr("aria-selected", "true");

        $tbtnLi.click(function(e) {
            e.preventDefault();
            const idx = $(this).index();

            $tbtnLi.removeClass("active").find('.tab-item').attr("aria-selected", "false");
            $(this).addClass("active").find('.tab-item').attr("aria-selected", "true");
            $tab_contentsOb.hide();
            $tab_contentsOb.eq(idx).show();
        });
    });
}

// Mobile Snb DropDown
function snbDropDown() {

    $(".btn-snb-dropdown").on('click', function () {
        //$(this).closest('.tab-item').addClass('on');
        $(this).closest('.tab-link').next('.mob-snb-2dul').slideToggle(250);
    });

    $('.mob-snb-2dul').hide();
};

$(document).ready(function() {

    /* Header */
    // Header fixed event
    const header = $('#header');
    const threshold = 0;
    const bottomThreshold = $(document).height() - $(window).height() - 100;
    let lastScrollTop = 0;

    function handleScroll() {
        const scrollTop = $(window).scrollTop();
        const windowWidth = $(window).width();
    
        if (windowWidth >= 1176 && scrollTop > threshold && scrollTop > lastScrollTop && scrollTop < bottomThreshold) {
            header.addClass('fixed');
        } else if (windowWidth >= 1176 && scrollTop < bottomThreshold) {
            header.removeClass('fixed');
        } 
    
        lastScrollTop = scrollTop;
    }
    
    handleScroll();

    $(window).on('scroll resize', function() {
        handleScroll();
        
        if ($(window).scrollTop() === 0) {
            header.removeClass('fixed');
        }
    });

    $(window).on('load', function() {
        handleScroll();
    });

    /* Menu All */
    $('.menu-all').on('click', function() {
        var $hdWrap = $(this).closest('.hd-wrap');
        var ishdWrap = $hdWrap.hasClass('open');

        // .bottom-area의 상태에 따라 aria-expanded 값을 변경
        $(this).attr('aria-expanded', !ishdWrap);

        // .bottom-area에 open 클래스를 토글
        $hdWrap.toggleClass('open');
    });

    /* gnb 2dul */
    const gnb2dul = $('.gnb-2dul');
    $('.gnb-1da').on('focus', function() {
        $('.gnb-2dul').css('display', 'none');
        $(this).next('.gnb-2dul').css('display', 'block');
    })
    $('#gnb > ul > li:last-of-type .gnb-2dul li:last-of-type').on('focusout', function() {
        $('.gnb-2dul').css('display', 'none');
    })

    $(document).on('click', function(event) {
        var target = $(event.target);

        if (!target.closest(gnb2dul).length) {
            gnb2dul.css('display', 'none');
        }
    });

    /* hd my, hd alarm */
    const headerMy = $('.hd-my');
    const headerAlarm = $('.hd-alarm');
    $('.btn-hd-my').on('click', function() {
        headerAlarm.removeClass('open');
        $(this).parent(headerMy).toggleClass('open');
    });
    $('.btn-hd-alarm').on('click', function() {
        headerMy.removeClass('open');
        $(this).parent(headerAlarm).toggleClass('open');
        $(this).find('.ico-new').hide();
    });

    $(document).on('click', function(event) {
        var target = $(event.target);

        if (!target.closest(headerMy).length) {
            headerMy.removeClass('open');
        }

        if (!target.closest(headerAlarm).length) {
            headerAlarm.removeClass('open');
        }
    });

    /* Counter Number Animation */
    $(window).on('scroll', handleCounterScroll);

    /* Main - Masonry Review */
    let masonry;

    const initMasonry = () => {
        // 1136px
        const $container = $('.masonry-container');

        if ($container.length > 0 && $(window).width() >= 1136) {            
            masonry = new Masonry($container[0], {
                itemSelector: '.masonry-item',
                columnWidth: '.masonry-item',
                gutter: 30
            });
        }
    };

    const destroyMasonry = () => {
        if (masonry) {
            masonry.destroy();
            masonry = null;
        }
    };

    const masonryResize = () => {
        if ($(window).width() >= 1136) {
            initMasonry();
        } else {
            destroyMasonry();
        }
    };

    // reset
    initMasonry();


    // resize
    $(window).on('resize', masonryResize);

    /* Main Top button hidden event */
    var lastScrollTop2 = 0;

    $(window).scroll(function(event){
        var st = $(this).scrollTop();
        if (st > lastScrollTop2 || st == 0){
            // 스크롤 내릴 때 또는 스크롤이 맨 위에 있을 때
            $('.quick-menu').addClass('hidden');
        } else {
            // 스크롤 올릴 때
            $('.quick-menu').removeClass('hidden');
        }
        lastScrollTop2 = st;
    });

    // Mobile Menu
    const mobMenuBox = $(".mob-menu-box");
    const srhLayer = $(".srh-layer");
    const body = $("body");

    $(".tab_allMenu").click(function() {
        setTimeout(function() {
            mobMenuBox.addClass("open").focus();
            body.addClass("mob-scroll-lock");
            mobMenuBox.attr("aria-hidden", "false");
        }, 400); // 0.4초 후에 실행
    });
    $(".btn-mob-close").click(function() {
        mobMenuBox.removeClass("open");
        body.removeClass("mob-scroll-lock");
        mobMenuBox.attr("aria-hidden", "false");
    });

    $(".tab_srh").click(function() {
        setTimeout(function() {
            srhLayer.addClass("on").focus();
            $('#header').addClass("integrated-wrap");
            body.addClass("mob-scroll-lock");
            srhLayer.attr("aria-hidden", "false");
        }, 400); // 0.4초 후에 실행
    });
    $(".srh-btn-back").click(function() {
        srhLayer.removeClass("on");
        $('#header').removeClass("integrated-wrap");
        body.removeClass("mob-scroll-lock");
        srhLayer.attr("aria-hidden", "false");
    });

    /* Checkbox select all event */
    $('.check-all').click(function () {
        var isChecked = $(this).prop('checked');
        $(this).closest('.chk-wrap').find('input[type="checkbox"]').prop('checked', isChecked);
    });

    // Individual checkboxes
    $('.chk-box input[type="checkbox"]').click(function () {
        var $chkWrap = $(this).closest('.chk-wrap');
        var totalCheckboxes = $chkWrap.find('.chk-box input[type="checkbox"]').length;
        var checkedCheckboxes = $chkWrap.find('.chk-box input[type="checkbox"]:checked').length;
        
        if (checkedCheckboxes === totalCheckboxes) {
            $chkWrap.find('.check-all').prop('checked', true);
        } else {
            $chkWrap.find('.check-all').prop('checked', false);
        }
    });

    // If all individual checkboxes are checked, check the "Select All" checkbox
    $('.chk-wrap .chk-box input[type="checkbox"]').change(function () {
        var $chkWrap = $(this).closest('.chk-wrap');
        var totalCheckboxes = $chkWrap.find('.chk-box input[type="checkbox"]').length;
        var checkedCheckboxes = $chkWrap.find('.chk-box input[type="checkbox"]:checked').length;

        if (totalCheckboxes - 1 === checkedCheckboxes) {
            $chkWrap.find('.check-all').prop('checked', true);
        }
    });
    
    // Acoordion (faq)
    accordion();

    // Expand Box
    expandBox();

    

    // Datepicker common Option (inline)
    const disabledDates = ["2024-02-01","2024-02-02","2024-02-03","2024-02-04"];

    const commonInlineDatepicker = {
        inline: true,
        firstDay: 0, // sunday
        showOtherMonths: true, 
        showMonthAfterYear: true,
        dateFormat: "yy.mm.dd",
        yearSuffix: "년",
        dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
        monthNames: [ "01월", "02월", "03월", "04월", "05월", "06월", "07월", "08월", "09월", "10월", "11월", "12월"],
        monthNamesShort: [ "01월", "02월", "03월", "04월", "05월", "06월", "07월", "08월", "09월", "10월", "11월", "12월"],
        /* disabled date */
        beforeShowDay: function(date) {
            // 선택 가능한 날짜는 [년, 월 - 1, 일] 형식의 배열로 표현
            //const selectableDates = [2023, 9, 12]; // 10월은 9로 표현됩니다 (0부터 시작)

            // date가 선택 불가능한 날짜 중 하나인지 확인
            const formattedDate = $.datepicker.formatDate("yy-mm-dd", date);
            if ($.inArray(formattedDate, disabledDates) != -1) {
                return [false, ""];
            }

            // 그 외에는 선택 가능
            return [true, ""];
        }
    };
    
    if ($(".inline-datepicker").length > 0) {
        $(".inline-datepicker").datepicker(commonInlineDatepicker);
    };

    // Datepicker common Option (Default)
    const commonDatepicker = {
        inline: true,
        firstDay: 0, // sunday
        showOtherMonths: true, 
        showMonthAfterYear: true,
        dateFormat: "yy.mm.dd",
        yearSuffix: "년",
        dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
        monthNames: [ "01월", "02월", "03월", "04월", "05월", "06월", "07월", "08월", "09월", "10월", "11월", "12월"],
        monthNamesShort: [ "01월", "02월", "03월", "04월", "05월", "06월", "07월", "08월", "09월", "10월", "11월", "12월"],
        beforeShow: function(input, inst) {            
            $('#ui-datepicker-div').addClass('comm-calendar');
        },
        onSelect: function (dateText, inst) { //date select
            $('.comm-calendar').addClass('checked');            
            $(this).addClass('checked');            
        }
    };

    if ($(".single-datepicker").length > 0) {
        $(".single-datepicker").datepicker(commonDatepicker);
    };

    // Datepicker start date Option (layer)
    if ($(".start-datepicker").length > 0) {
        $('.start-datepicker').datepicker({
            inline: true,
            firstDay: 0, // sunday
            showOtherMonths: true, 
            showMonthAfterYear: true,
            dateFormat: "yy.mm.dd",
            yearSuffix: "년",
            dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
            monthNames: [ "01월", "02월", "03월", "04월", "05월", "06월", "07월", "08월", "09월", "10월", "11월", "12월"],
            monthNamesShort: [ "01월", "02월", "03월", "04월", "05월", "06월", "07월", "08월", "09월", "10월", "11월", "12월"],
            changeYear: true, //콤보박스에서 년 선택 가능
            changeMonth: true, //콤보박스에서 월 선택 가능
            beforeShow: function(input, inst) {            
                $('#ui-datepicker-div').addClass('comm-calendar');
            },
            onClose: function( selectedDate ) {
                // 시작일 datepicker가 닫힐때
                // 종료일의 선택할수있는 최소 날짜(minDate)를 선택한 시작일로 지정
                $('.end-datepicker').datepicker( "option", "minDate", selectedDate );
                    
            },
            onSelect: function (dateText, inst) { //date select
                $('.comm-calendar').addClass('checked');            
                $(this).addClass('checked');            
            }
        });
    }

    // Datepicker end date Option (layer)
    if ($(".end-datepicker").length > 0) {
        $('.end-datepicker').datepicker({
            inline: true,
            firstDay: 0, // sunday
            showOtherMonths: true, 
            showMonthAfterYear: true,
            dateFormat: "yy.mm.dd",
            yearSuffix: "년",
            dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
            monthNames: [ "01월", "02월", "03월", "04월", "05월", "06월", "07월", "08월", "09월", "10월", "11월", "12월"],
            monthNamesShort: [ "01월", "02월", "03월", "04월", "05월", "06월", "07월", "08월", "09월", "10월", "11월", "12월"],
            changeYear: true, //콤보박스에서 년 선택 가능
            changeMonth: true, //콤보박스에서 월 선택 가능
            beforeShow: function(input, inst) {            
                $('#ui-datepicker-div').addClass('comm-calendar');
            },
            onClose: function( selectedDate ) {
                $('.start-datepicker').datepicker( "option", "maxDate", selectedDate );
                    
            },
            onSelect: function (dateText, inst) {
                $('.comm-calendar').addClass('checked');
                $(this).addClass('checked');
            }
        });
    };

    /* select2 (selectbox) */
    // init
    function initializeSelect2() {
        $('.select-box').select2({
            minimumResultsForSearch: Infinity,
            width: '100%',
        });
    }

    // destroy (for mobile)
    function destroySelect2() {
        if ($('.select-box').data('select2')) {
            $('.select-box').select2('destroy');
        }
    }

    //select-box resize
    function handleWindowSize() {
        var windowWidth = $(window).width();

        // 창 크기가 1136 이상인 경우
        if (windowWidth >= 1136) {
            initializeSelect2();
        } else {
            // 창 크기가 1135 이하인 경우
            destroySelect2();
        }
    }

    // select-box resize
    handleWindowSize();

    // 창 크기 변경 이벤트 핸들러 등록
    $(window).resize(function () {
        // 일정 시간 딜레이를 주고 실행 (리소스 낭비 방지)
        clearTimeout(window.resizeEvt);
        window.resizeEvt = setTimeout(function () {
            handleWindowSize();
        }, 250);
    });

    // Intergrated SelectBox
    $('.integrated-select-box').select2({
        minimumResultsForSearch: Infinity,
        width: '100%',
        dropdownCssClass: 'select2-dropdown-integrated'
    });
    $('.integrated-select-box').on('select2:open', function (e) {
        $('.select2-container').addClass('integrated-select-option');
    });

    $('.select-box-xs').select2({
        minimumResultsForSearch: Infinity,
        width: '100%',
        dropdownCssClass: 'select2-dropdown-xs'
    });

    /* Textarea */
    $('.exptCont').each(function() {
        const textarea = $(this);

        // Focus In Event
        textarea.on('focus', function() {
            textarea.closest(".textarea-wrap").addClass('focus');
        });

        // Focus Out Event
        textarea.on('focusout', function() {
            textarea.closest(".textarea-wrap").removeClass('focus');
        });
        
    });

    /* Share Event */
    $(".share-box .btn-share").click(function(e) {
        e.stopPropagation();
        $(this).siblings(".share-content").css("display", "block");
        $(this).siblings(".share-content").attr("aria-hidden", "false");
    });
    // share close event
    $(".share-box .btn-close").click(function() {
        $(this).closest(".share-content").css("display", "none");
        $(this).closest(".share-content").attr("aria-hidden", "true");
    });
    $(document).click(function(e) {
        if (!$(e.target).closest('.share-box').length) {
            // .share-content 숨기기
            $(".share-box .share-content").css("display", "none");
            // aria-hidden 속성 변경
            $(".share-box .share-content").attr("aria-hidden", "true");
        }
    });

    /* Tooltip*/
    $(".tooltip-box .btn-tooltip").click(function(e) {
        e.stopPropagation();
        $(this).siblings(".tooltip-content").css("display", "block");
        $(this).siblings(".tooltip-content").attr("aria-hidden", "false");
    });
    // tooltip close event
    $(".tooltip-box .btn-close").click(function() {
        $(this).closest(".tooltip-content").css("display", "none");
        $(this).closest(".tooltip-content").attr("aria-hidden", "true");
    });
    $(document).click(function(e) {
        if (!$(e.target).closest('.tooltip-box').length) {
            // .tooltip-content 숨기기
            $(".tooltip-box .tooltip-content").css("display", "none");
            // aria-hidden 속성 변경
            $(".tooltip-box .tooltip-content").attr("aria-hidden", "true");
        }
    });

    /* Tooltip*/
    $(".tooltip-box2 .btn-tooltip").click(function(e) {
        e.stopPropagation();
        $(this).siblings(".tooltip-content").css("display", "block");
        $(this).siblings(".tooltip-content").attr("aria-hidden", "false");
    });
    // tooltip close event
    $(".tooltip-box2 .btn-close").click(function() {
        $(this).closest(".tooltip-content").css("display", "none");
        $(this).closest(".tooltip-content").attr("aria-hidden", "true");
    });
    $(document).click(function(e) {
        if (!$(e.target).closest('.tooltip-box2').length) {
            // .tooltip-content 숨기기
            $(".tooltip-box2 .tooltip-content").css("display", "none");
            // aria-hidden 속성 변경
            $(".tooltip-box2 .tooltip-content").attr("aria-hidden", "true");
        }
    });

    /* Integrated */
    // Filter DetailSrh Button Event
    $(".btn-detail-srh").click(function () {
        $(this).toggleClass("on");
        $(".detail-srh-box").toggle().focus();
        
        var isBoxVisible = $(".detail-srh-box").is(":visible");
        $(this).attr("aria-expanded", isBoxVisible.toString());
        $(".detail-srh-box").attr("aria-hidden", (!isBoxVisible).toString());
    });

    $(".btn-detail-apply").click(function () {
        $(".btn-detail-srh").removeClass("on");
        $(".detail-srh-box").hide();

        $(".btn-detail-srh").attr("aria-expanded", "false");
        $(".detail-srh-box").attr("aria-hidden", "true");
    });

    // Input Text Clear (value reset)
    if($('.ip-clear-box').length > 0){
	
        $(".ip-clear-box input").on("focusin keyup", function () {
            var txtClear = $(this).siblings(".txt-clear");
            // Show or hide .txt-clear based on input value
            if ($(this).val().trim() !== "") {
                txtClear.removeClass("hidden");
            } else {
                txtClear.addClass("hidden");
            }
            
            // Add .ip-sp class based on focus
            $(this).addClass("ip-sp");
        });

        // Handle focusout Event
        $(".ip-clear-box input").on("focusout", function () {
            var txtClear = $(this).siblings(".txt-clear");
            $(this).removeClass("ip-sp");
            // Delay hiding .txt-clear to check if it was clicked
            setTimeout(function () {                
                txtClear.addClass("hidden");
            }, 200);
        });

        // Handle .txt-clear click Event
        $(".txt-clear").on("click", function () {
            var input = $(this).siblings("input");
            input.val("").trigger("input").focus();
        });
    };

    /* Footer Reached Event */
    const courseDetailContainer = $('.course-detail-container');
    const footer = $('#footer');

    // footer reached
    function isFooterReached() {
        const footerRect = footer[0].getBoundingClientRect();
        return footerRect.top <= window.innerHeight;
    }

    // scroll event
    function handleReachedScroll() {
        // Check if .course-detail-container exists
        if (courseDetailContainer.length) {
            if (isFooterReached()) {
                courseDetailContainer.addClass('reached');
            } else {
                courseDetailContainer.removeClass('reached');
            }
        }
    }

    // scroll event listener
    $(window).scroll(handleReachedScroll);

    /* Diagnosis Answer Expand Event */
    function answerExpend() {
        const $answerHd = $(".title-container");
        const $answerBd = $(".answer-list");

        $answerHd.attr('aria-expanded', 'false');
        $answerBd.attr('aria-hidden', 'true');

        if ($(window).width() < 1136) {

            

            $answerHd.off('click')
                .on('click', function () {
                    const $clickedAnswerHd = $(this);
                    const $clickedAnswerBd = $(this).next(".answer-list");

                    const isBoxVisible = $clickedAnswerBd.is(":visible");
                    $(this).attr("aria-expanded", (!isBoxVisible).toString());
                    $clickedAnswerBd.attr("aria-hidden", isBoxVisible.toString());
                    
                    $clickedAnswerBd.slideToggle(250);

                    $clickedAnswerHd.parent('.answer-area').toggleClass('show');
                });
        } else {
            $answerHd.off('click').removeAttr('aria-expanded');
            $answerBd.css('display', 'none');
            $('.answer-area').removeClass('show');
        }
    }

    answerExpend();
    
    /* Course Detail */
    function calculateHeaderHeight() {
        return $('#header').outerHeight(true);
    }

    function updateHeaderOffset() {
        if ($('.tab-link-wrap').length > 0) {
            if ($(window).width() < 1136) {
                tabLinkOffset = $('.tab-link-wrap').offset().top - calculateHeaderHeight();
                tabHeights = $('.sec-shortcut').map(function() {
                    return $(this).offset().top - calculateHeaderHeight() - $('.tab-link-wrap').outerHeight(true);
                }).get();
            } else {
                tabLinkOffset = $('.tab-link-wrap').offset().top;
                tabHeights = $('.sec-shortcut').map(function() {
                    return $(this).offset().top - $('.tab-link-wrap').outerHeight(true);
                }).get();
            }
        }
    }

    var tabLinkOffset;
    var tabHeights;

    updateHeaderOffset();

    $(window).scroll(function() {
        var scrollTop = $(this).scrollTop();
        var headerHeight = calculateHeaderHeight();
        
        updateHeaderOffset(); // header height update
        
        if (scrollTop >= tabLinkOffset) {
            $('#header').addClass('none');
            $('.course-detail-container').addClass('fixed');
        } else {
            $('#header').removeClass('none');
            $('.course-detail-container').removeClass('fixed');
        }

        // Update active tab item
        if (tabHeights) {
            tabHeights.forEach(function(offset, index) {
                if (scrollTop >= offset - 5) {
                    $('.tab-link-wrap .tab-item').removeClass('active');
                    $('.tab-link-wrap .tab-item').eq(index).addClass('active');
                }
            });
        }

        if ($(window).scrollTop() == 0) {
            // Remove active class from all tab items
            $('.tab-link-wrap .tab-item').removeClass('active');
            // Add active class to the first tab item
            $('.tab-link-wrap .tab-item').first().addClass('active');
        }
        // Check if scrolled to bottom
        if ($(window).scrollTop() + $(window).height() == $(document).height()) {
            // Remove active class from all tab items
            $('.tab-link-wrap .tab-item').removeClass('active');
            // Add active class to the last tab item
            $('.tab-link-wrap .tab-item').last().addClass('active');
        }

    });

    $('.tab-link-wrap .tab-item').click(function() {
        var index = $(this).index();
        var targetOffset = $('.sec-shortcut').eq(index).offset().top - $('#header').outerHeight(true) - $('.tab-link-wrap').outerHeight(true);
        $('html, body').animate({
            scrollTop: targetOffset
        }, 500);
    });

    // Function to handle window resize event
    $(window).resize(function() {
        updateHeaderOffset(); // 윈도우 리사이즈 시 헤더 높이가 변할 때마다 업데이트
    });
    
    /* Top100 Scroll Event */
    var HeaderHeightTop100 = $('#header').outerHeight();
    if ($('.tab-top100').length > 0) {
        var tabTopOffsetTop100 = $('.tab-top100').offset().top - HeaderHeightTop100;
    }

    function calculateTop100HeaderHeight() {
        return $('#header').outerHeight(true);
    }

    function updateTop100HeaderOffset() {
        if ($('.tab-top100').length > 0) {
            TabHeightsTop100 = $('.tab-content').map(function() {
                return $(this).offset().top - calculateTop100HeaderHeight() - $('.tab-top100').outerHeight(true);
            }).get();
        }
    }

    var TabHeightsTop100;

    $(window).scroll(function() {
        var scrollTop100 = $(window).scrollTop();

        updateTop100HeaderOffset();

        if (scrollTop100 >= tabTopOffsetTop100) {
            $('#header, #container, .tab-top100').addClass('fixed100');
        } else {
            $('#header, #container, .tab-top100').removeClass('fixed100');
        }

        if (TabHeightsTop100) {
            TabHeightsTop100.forEach(function(offset, index) {
                if (scrollTop100 >= offset - 5) {
                    $('.tab-top100 .tab-item').removeClass('active');
                    $('.tab-top100 .tab-item').eq(index).addClass('active');
                }
            });
        }
    });

    if ($(window).scrollTop() == 0) {
        $('.tab-top100 .tab-item').removeClass('active');
        $('.tab-top100 .tab-item').first().addClass('active');
    }

    $('.tab-top100 .tab-item').click(function() {
        var index = $(this).index();
        var targetOffset = $('.tab-content').eq(index).offset().top - $('#header').outerHeight(true) - $('.tab-top100').outerHeight(true);
        
        if ($(this).index() === 0) {
            $('html, body').animate({
                scrollTop: 0
            }, 0);
        } else {
            $('html, body').animate({
                scrollTop: targetOffset
            }, 0);
        }
    });

    // Function to handle window resize event
    $(window).resize(function() {
        updateTop100HeaderOffset(); // 윈도우 리사이즈 시 헤더 높이가 변할 때마다 업데이트
    });

    /* Parents Diagnosis Header fixed event */
    if ($('.diagnosis-hd').length > 0) {
        var $diagnosisWrap = $('.diagnosis-hd');
        var diagnosisOffset = $diagnosisWrap.offset().top;
        var subHeaderHeight = $('.sub-header').height();

        function toggleFixedClass() {
            var scrollTop = $(window).scrollTop();
            if ($(window).width() >= 1136) {
                if (scrollTop >= diagnosisOffset - 160) {
                    $diagnosisWrap.addClass('fixed');
                } else {
                    $diagnosisWrap.removeClass('fixed');
                }
            } else {
                if (scrollTop >= diagnosisOffset - subHeaderHeight) {
                    $diagnosisWrap.addClass('fixed');
                } else {
                    $diagnosisWrap.removeClass('fixed');
                }
            }
        }

        $(window).scroll(function() {
            toggleFixedClass();
        });

        $(window).resize(function() {
            subHeaderHeight = $('.sub-header').height();
            toggleFixedClass();
        });
    }

    // Player Chapter Hidden Event
    $('.btn-chapter-dropdown').on('click', function() {
        $(this).toggleClass('on');
        $(this).prev('.course-desc').toggleClass('sr-only');
    });

    /* Dropdown */
    $('.dropdown-toggle').on('click', function(){
        $(this).toggleClass('on');
        $(this).next('.dropdown-content').toggle();
    });
    $(document).on('click', function(e){
        if (!$(e.target).closest('.dropdown').length && !$(e.target).hasClass('dropdown-toggle')) {
            $('.dropdown-content').hide();
        }
    });
});