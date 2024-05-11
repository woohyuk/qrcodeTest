$(document).ready(function(){
    // init
    var $recentBox = $(".recent-box-container");
    var $atcmpBox = $(".atcmp-box-container");
    var $srhBar = $(".srh-bar");
    var $srhLayer = $(".srh-layer");
    var $srhInput = $(".srh-bar input");

    $recentBox.show();
    $atcmpBox.hide();

    // input 클릭 시 srh-layer에 on 클래스 추가 (레이어 show)
    $srhInput.click(function(event){
        event.stopPropagation(); // 이벤트 전파 방지
        $srhLayer.addClass("on");

        // 모바일에서 레이어 show 됐을 때 바디 스크롤 방지
        if ($(window).width() < 1136) {
            $("body").addClass("scroll-lock");
        }
    });

    // input keyup or input text length (검색어 hidden, 자동완성 show)
    $srhInput.on("input", function(){
        var searchText = $(this).val();

        if(searchText.length > 0){
            $recentBox.hide();
            $atcmpBox.show();
        } else {
            $recentBox.show();
            $atcmpBox.hide();
        }
    });

    // 외부 클릭 이벤트
    $(document).click(function(){
        // 이벤트가 발생한 요소와 그 부모 요소들을 확인
        if (!$(event.target).closest($srhLayer).length && !$(event.target).closest($srhBar).length) {
            var searchText = $srhInput.val();

            if (searchText.length > 0) {
                $recentBox.hide();
                $atcmpBox.show();
            } else {
                $recentBox.show(); // 초기 상태에서 보이도록 설정
                $atcmpBox.hide();
            }
            $srhLayer.removeClass("on");
            $("body").removeClass("scroll-lock"); // 레이어 히든 시 같이 제거
        }
    });
});