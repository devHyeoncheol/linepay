var html = '<div id="markp_test2" style="position:fixed;z-index:1000;top:40px;left:50%;padding:10px;margin-left:280px;width:140px;border:1px solid #000;background-color:skyblue;font-size:12px">'+
'<h3 style="font-size:12px;margin-bottom:10px">마크업 확인</h3>'+
'<ul>'+
'<li style="margin-bottom:2px;text-align:center;"><button class="btn_dcl2" style="width:95px;padding:2px;border:1px solid #ccc;cursor:pointer;font-size:11px" onclick="viewDeclare()">신규 팝업</button></li>'+
'<li style="margin-bottom:2px;text-align:center;"><button class="btn_dcl3" style="width:105px;padding:2px;border:1px solid #ccc;cursor:pointer;font-size:11px" onclick="viewDeclare2()">가맹점 추가 팝업</button></li>'+
'<li style="margin-bottom:2px;text-align:center;"><button class="btn_dcl4" style="width:105px;padding:2px;border:1px solid #ccc;cursor:pointer;font-size:11px" onclick="viewDeclare3()">URL 팝업</button></li>'+
'</div>';
$('body').append(html);

function viewDeclare(){
    var text = $('#markp_test2 .btn_dcl2').text();
    if(text == "신규 팝업 닫기"){
        $('#SCHJP3100LP100').addClass('is-open').css({'z-index':'100', 'position':'fixed','background-color':'rgba(38, 36, 36, 0.85)'});
        $('#SCHJP3100LP100').removeClass('is-open').css('z-index','');
        $('#markp_test2 .btn_dcl2').text('신규 팝업 열기');

    }else{
        $('#SCHJP3100LP100').removeClass('is-open').css('z-index','');
        $('#SCHJP3100LP100').addClass('is-open').css({'z-index':'100', 'position':'fixed','background-color':'rgba(38, 36, 36, 0.85)'});
        $('#markp_test2 .btn_dcl2').text('신규 팝업 닫기');
    }
}

function viewDeclare2(){
    var text = $('#markp_test2 .btn_dcl3').text();
    if(text == "가맹점 추가 팝업 닫기"){
        $('#SCHJP3100LP09').addClass('is-open').css({'z-index':'100', 'position':'fixed','background-color':'rgba(38, 36, 36, 0.85)'});
        $('#SCHJP3100LP09').removeClass('is-open').css('z-index','');
        $('#markp_test2 .btn_dcl3').text('가맹점 추가 팝업 열기');

    }else{
        $('#SCHJP3100LP09').removeClass('is-open').css('z-index','');
        $('#SCHJP3100LP09').addClass('is-open').css({'z-index':'100', 'position':'fixed','background-color':'rgba(38, 36, 36, 0.85)'});
        $('#markp_test2 .btn_dcl3').text('가맹점 추가 팝업 닫기');
    }
}

function viewDeclare3(){
    var text = $('#markp_test2 .btn_dcl4').text();
    if(text == "URL 팝업 닫기"){
        $('#SCHJP3100LP101').addClass('is-open').css({'z-index':'100', 'position':'fixed','background-color':'rgba(38, 36, 36, 0.85)'});
        $('#SCHJP3100LP101').removeClass('is-open').css('z-index','');
        $('#markp_test2 .btn_dcl4').text('URL 팝업 열기');

    }else{
        $('#SCHJP3100LP101').removeClass('is-open').css('z-index','');
        $('#SCHJP3100LP101').addClass('is-open').css({'z-index':'100', 'position':'fixed','background-color':'rgba(38, 36, 36, 0.85)'});
        $('#markp_test2 .btn_dcl4').text('URL 팝업 닫기');
    }
}
