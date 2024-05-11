// Swiper Course Default function
function initCommonSwiper($swiperContainer, customOptions) {
    // Default Option
    var defaultOptions = {
        slidesPerView: 4,
        slidesPerGroup: 4,
        spaceBetween: 16,
        navigation: {
            nextEl: $swiperContainer.closest(".course-box").find(".swiper-button-next")[0],
            prevEl: $swiperContainer.closest(".course-box").find(".swiper-button-prev")[0],
        }
    };

    var swiperOptions = Object.assign({}, defaultOptions, customOptions);

    return new Swiper($swiperContainer[0], swiperOptions);
}

// Swiper Course Resize handle
function handleSwiperResize() {
    let windowWidth = $(window).width();

    // 공통 슬라이더
    let $courseBoxes = $('.course-box');
    $courseBoxes.each(function (index, box) {
        let $swiperContainer = $(box).find('.swiper-container');
        let swiper = $swiperContainer.data('swiper');

        // 새로운 옵션
        let customOptions = {};

        // col-4
        if ($(box).hasClass('col-4')) {
            customOptions = {
                slidesPerView: 3,
                slidesPerGroup: 3,
                spaceBetween: 13,
            };
        }

        if (windowWidth >= 1136 && !swiper) {
            swiper = initCommonSwiper($swiperContainer, customOptions);
            $swiperContainer.data('swiper', swiper);
        } else if (windowWidth < 1136 && swiper) {
            swiper.destroy();
            $swiperContainer.removeData('swiper');
        }
    });
}

function sliderWatch() {
    const screenWidth = $(window).width();
    const swiperContainer = $('.slider-watch');
    const swiper = swiperContainer.data('swiper');

    if (screenWidth >= 1136 && !swiper) {
        mainSliderWatch = new Swiper(swiperContainer, {
            slidesPerView: 4,
            slidesPerGroup: 4,
            spaceBetween: 16,
            navigation: {
                nextEl: ".swiper-watch-next",
                prevEl: ".swiper-watch-prev",
            },
        });
        swiperContainer.data('swiper', swiper);
    } else if (screenWidth < 1136 && swiper) {
        swiper.destroy();
        swiperContainer.removeData('swiper');
    }
}
function sliderTailored1() {
    const screenWidth = $(window).width();
    const swiperContainer = $('.slider-tailored1');
    const swiper = swiperContainer.data('swiper');

    if (screenWidth >= 1136 && !swiper) {
        mainSliserTailored1 = new Swiper(swiperContainer, {
            slidesPerView: 4,
            slidesPerGroup: 4,
            spaceBetween: 16,
            navigation: {
                nextEl: ".swiper-tailored1-next",
                prevEl: ".swiper-tailored1-prev",
            },
        });
        swiperContainer.data('swiper', swiper);
    } else if (screenWidth < 1136 && swiper) {
        swiper.destroy();
        swiperContainer.removeData('swiper');
    }
}
function sliderTailored2() {
    const screenWidth = $(window).width();
    const swiperContainer = $('.slider-tailored2');
    const swiper = swiperContainer.data('swiper');

    if (screenWidth >= 1136 && !swiper) {
        mainSliserTailored2 = new Swiper(swiperContainer, {
            slidesPerView: 4,
            slidesPerGroup: 4,
            spaceBetween: 16,
            navigation: {
                nextEl: ".swiper-tailored2-next",
                prevEl: ".swiper-tailored2-prev",
            },
        });
        swiperContainer.data('swiper', swiper);
    } else if (screenWidth < 1136 && swiper) {
        swiper.destroy();
        swiperContainer.removeData('swiper');
    }
}
function sliderTailored3() {
    const screenWidth = $(window).width();
    const swiperContainer = $('.slider-tailored3');
    const swiper = swiperContainer.data('swiper');

    if (screenWidth >= 1136 && !swiper) {
        mainSliserTailored3 = new Swiper(swiperContainer, {
            slidesPerView: 4,
            slidesPerGroup: 4,
            spaceBetween: 16,
            navigation: {
                nextEl: ".swiper-tailored3-next",
                prevEl: ".swiper-tailored3-prev",
            },
        });
        swiperContainer.data('swiper', swiper);
    } else if (screenWidth < 1136 && swiper) {
        swiper.destroy();
        swiperContainer.removeData('swiper');
    }
}
function sliderTailored4() {
    const screenWidth = $(window).width();
    const swiperContainer = $('.slider-tailored4');
    const swiper = swiperContainer.data('swiper');

    if (screenWidth >= 1136 && !swiper) {
        mainSliserTailored4 = new Swiper(swiperContainer, {
            slidesPerView: 4,
            slidesPerGroup: 4,
            spaceBetween: 16,
            navigation: {
                nextEl: ".swiper-tailored4-next",
                prevEl: ".swiper-tailored4-prev",
            },
        });
        swiperContainer.data('swiper', swiper);
    } else if (screenWidth < 1136 && swiper) {
        swiper.destroy();
        swiperContainer.removeData('swiper');
    }
}

$(document).ready(function() {

    // Swiper Main Visual - Pagination Update
    function updatePaginationFormat(slider) {
        var $container = $(slider.$el); // Swiper 컨테이너 선택
        var totalSlides = slider.slides.length - slider.loopedSlides * 2;
        var activeIndex = slider.realIndex + 1;
    
        $container.find(".swiper-pagination-current").text(activeIndex.toString().padStart(2, '0'));
        $container.find(".swiper-pagination-total").text(totalSlides.toString().padStart(2, '0'));
    }

    // Swiper Main Visual
    const mainVisual = new Swiper('.main-visual', {
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        slidesPerView: 1,
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            type: "fraction",
        },
        navigation: {
            nextEl: ".main-visual-next",
            prevEl: ".main-visual-prev",
        },
        on: {
            init: function() {
                // init pagination update
                updatePaginationFormat(this);
            },
            slideChange: function() {
                // slideChange pagination update
                updatePaginationFormat(this);
            },
        },
    });

    sliderWatch();
    sliderTailored1();
    sliderTailored2();
    sliderTailored3();
    sliderTailored4();

    const mainVisualAtype = new Swiper('.main-visual-atype', {
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        slidesPerView: 'auto',
        loop: true,
        spaceBetween: 0,
        breakpoints: {
            1136: {
                spaceBetween: 72,
            }
        },
        centeredSlides: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            type: "fraction",
        },
        navigation: {
            nextEl: ".main-atype-next",
            prevEl: ".main-atype-prev",
        },
        on: {
            init: function() {
                // init pagination update
                updatePaginationFormat(this);
            },
            slideChange: function() {
                // slideChange pagination update
                updatePaginationFormat(this);
            },
        },
    });

    const mainBannerSm = new Swiper('.slider-main-sm', {
        slidesPerView: 1,
        loop: true,
        pagination: {
            el: '.main-sm-pagination',
            clickable: true,
            type: "fraction",
        },
        navigation: {
            nextEl: ".main-sm-next",
            prevEl: ".main-sm-prev",
        },
        on: {
            init: function() {
                // init pagination update
                updatePaginationFormat(this);
            },
            slideChange: function() {
                // slideChange pagination update
                updatePaginationFormat(this);
            },
        },
    });

    // Swiper Main Visual - Pause click event
    $('.main-sm-pause').on('click', function () {
        var swiperContainer = $(this).closest('.main-banner-sm').find('.swiper-container');
        if (swiperContainer.length > 0) {
            var swiper = swiperContainer[0].swiper;
            if (swiper) {
                swiper.autoplay.stop();
            }
        }
        $(this).hide();
        $('.main-sm-play').show();
    });

    // Swiper Main Visual - Play click event
    $('.main-sm-play').on('click', function () {
        var swiperContainer = $(this).closest('.main-banner-sm').find('.swiper-container');
        if (swiperContainer.length > 0) {
            var swiper = swiperContainer[0].swiper;
            if (swiper) {
                swiper.autoplay.start();
            }
        }
        $(this).hide();
        $('.main-sm-pause').show();
    });

    // Swiper Main Visual - Pause click event
    $('.swiper-pause').on('click', function () {
        var swiperContainer = $(this).closest('.swiper-container');
        if (swiperContainer.length > 0) {
            var swiper = swiperContainer[0].swiper;
            if (swiper) {
                swiper.autoplay.stop();
            }
        }
        $(this).hide();
        $('.swiper-play').show();
    });

    // Swiper Main Visual - Play click event
    $('.swiper-play').on('click', function () {
        var swiperContainer = $(this).closest('.swiper-container');
        if (swiperContainer.length > 0) {
            var swiper = swiperContainer[0].swiper;
            if (swiper) {
                swiper.autoplay.start();
            }
        }
        $(this).hide();
        $('.swiper-pause').show();
    });

    // Swiper Course Resize handle
    handleSwiperResize();

    // Main Theme
    var sliderTheme;

    function initializeTheme() {
        var sliderElement = document.querySelector('.slider-theme');
        if (sliderElement) {
            sliderTheme = new Swiper(sliderElement, {
                freeMode: true,
                slidesPerView: 5,
                spaceBetween: 14,
                grabCursor: true,
            });
        }
    }

    function destroyTheme() {
        if (sliderTheme) {
            sliderTheme.destroy();
            sliderTheme = undefined;
        }
    }

    function checkWindowSize() {
        var windowWidth = $(window).width();

        if (windowWidth <= 1135) {
            destroyTheme();
        } else {
            if (!sliderTheme) {
                initializeTheme();
            }
        }
    }

    // 최초 실행
    checkWindowSize();

    // 윈도우 크기 변경 시 실행
    $(window).resize(function() {
        checkWindowSize();
    });

    // Integrated Banner
    const sliderIntegrated = new Swiper('.slider-integrated', {
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        slidesPerView: 1,
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            type: "fraction",
        },
        on: {
            init: function() {
                // init pagination update
                updatePaginationFormat(this);
            },
            slideChange: function() {
                // slideChange pagination update
                updatePaginationFormat(this);
            },
        },
    });

    // Leaerning Club Photo
    const sliderClubPhoto = new Swiper('.slider-club', {
        slidesPerView: 1,
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            type: "fraction"
        },
        navigation: {
            nextEl: ".slider-club-next",
            prevEl: ".slider-club-prev"
        },
    });

    // Couse Detail Banner
    const sliderCourseEvent = new Swiper('.slider-course-event', {
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        slidesPerView: 1,
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            type: "fraction",
        },
        on: {
            init: function() {
                // init pagination update
                updatePaginationFormat(this);
            },
            slideChange: function() {
                // slideChange pagination update
                updatePaginationFormat(this);
            },
        },
    });

    // Online Course Detail Instructor
    const sliderInstructor = new Swiper('.slider-instructor', {
        slidesPerView: 1,
        //loop: true,
        navigation: {
            nextEl: ".slider-instructor-next",
            prevEl: ".slider-instructor-prev"
        },
    });

    // Card Learning
    const sliderCardLearning = new Swiper('.slider-card-learning', {
        slidesPerView: 1,
        spaceBetween: 20,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: ".slider-card-next",
            prevEl: ".slider-card-prev"
        },
        grabCursor: true,
    });

});

// Swiper Course Resize handle
$(window).resize(handleSwiperResize);

$(window).resize(function() {
    sliderWatch();
    sliderTailored1();
    sliderTailored2();
    sliderTailored3();
    sliderTailored4();
});