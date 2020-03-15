//전역변수
var string;
//함수 객체
var viewObj = {
    // lnb toggle
    lnbToggle: function () {
        var lnbToggleBtn = $('.left__nav ul li.sub button');
        var lnbToggleLi = lnbToggleBtn.parent();
        var lnbToggleUl = $('.left__nav ul li.sub > ul');
        if(lnbToggleUl.has('.left__nav--curr').length > 0){
            lnbToggleLi.addClass('has on');
            lnbToggleUl.show();
        }
        if(lnbToggleUl.has('.left__nav--comp').length > 0){
            lnbToggleLi.addClass('has');
        }
        lnbToggleBtn.on('click', function(){
            lnbToggleLi.toggleClass('on');
            lnbToggleUl.slideToggle();f
        });
    },

    // input + label animation
    inputLabelAni: function () {
        $('.form__element').each(function(){
            var thisInput = $(this);
            var paDiv = thisInput.parents('.form__unit');
            var paDivForm = paDiv.find('.form__label');
            function aniBig(){
                paDiv.addClass('inputon');
                paDivForm.animate({
                    fontSize: '14px',
                    top:'4px'
                });
            }
            function aniSmall(){
                paDiv.removeClass('inputon');
                paDivForm.animate({
                    'font-size': '22px',
                    'top':'24px'
                });
            }
            if (thisInput.is('select')){
                if(thisInput.val() == thisInput.parent('.form__unit').find('.form__label').text()){
                    thisInput.addClass('selon');
                    paDiv.removeClass('inputon');
                    paDivForm.css({
                        'font-size': '22px',
                        'top':'24px'
                    });
                } else {
                    paDiv.addClass('inputon');
                    paDivForm.css({
                        'font-size': '14px',
                        'top':'4px'
                    });
                    thisInput.removeClass('selon')
                }
                // thisInput.on("focus", function() {
                //     if (!paDiv.hasClass('inputon') && thisInput.val() == thisInput.parent('.form__unit').find('.form__label').text()) {
                //         console.log('big');
                //         aniBig();
                //     }
                //     if(thisInput.val() == thisInput.parent('.form__unit').find('.form__label').text()){
                //         console.log('small');
                //         thisInput.addClass('selon');
                //         aniSmall();
                //     } else {
                //         console.log('else');
                //         //aniBig();
                //         //thisInput.removeClass('selon')
                //     }
                // });
                thisInput.on("change", function() {
                    setTimeout(function(){
                        if (thisInput.val() == "") {
                            aniSmall();
                        }
                        if(thisInput.val() == thisInput.parents('.form__unit').find('.form__label').text()){
                            aniSmall();
                            thisInput.addClass('selon');
                        } else {
                            aniBig();
                            thisInput.removeClass('selon')
                        }
                    }, 200);
                });
                $('.selectric-scroll ul li').on('click',function(){
                    thisInput.trigger(change);
                });
            } else {
                if (thisInput.val() != "") {
                    paDiv.addClass('inputon');
                    paDivForm.css({
                        'font-size': '14px',
                        'top':'4px'
                    });
                } else{
                    paDiv.removeClass('inputon');
                    paDivForm.css({
                        'font-size': '22px',
                        'top':'24px'
                    });
                }
                thisInput.on("focus", function() {
                    if (!paDiv.hasClass('inputon')) {
                        aniBig();

                        // var labelTooltip = $(this).siblings('.form__label').find('.pualugin-tooltip');
                        // // var tooltipBtn = labelTooltip.find('.icon-tooltip').attr('aria-expended');

                        // if(labelTooltip.length!=0) {
                        //     $(labelTooltip).on('mouseenter', function() {
                        //         $(this).addClass('over');
                        //     });
                        // }
                    }
                });
                thisInput.on("focusout", function() {

                    if (thisInput.val() == "") {


                        var formWithbtn = $(this).parent('div.form__with-btn');
                        var formWithbtnTooltip = formWithbtn.siblings('.form__label').find('.pualugin-tooltip');
                        var formWithbtnTooltipDesc = formWithbtnTooltip.find('button').attr('aria-describedby');

                        var labelTooltip = $(this).siblings('.form__label').find('.pualugin-tooltip');
                        var labelToolTipDesc = labelTooltip.find('button').attr('aria-describedby');
                        setTimeout(function(){
                            if(formWithbtn.length!=0 && $('#'+formWithbtnTooltipDesc).hasClass('is-active')) {
                                //no action
                            } else if(labelTooltip.length!=0 && $('#'+labelToolTipDesc).hasClass('is-active')) {
                                //no action
                            } else {
                                paDiv.removeClass('inputon');
                                paDivForm.animate({
                                    fontSize: '22px',
                                    top:'24px'
                                });
                            }
                        }, 200);
                    }
                });
            }
        });
    },
    nextDivToggle: function(){
        $('.btn-radio__input, .pualugin-checkbox__input').not('.data__specificCheck .gray-box .pualugin-checkbox__input, .agree-checkbox .pualugin-checkbox__input').each(function(){
            var inputRadio = $(this);
            var toggle;
            var innerToggle;
            if(inputRadio.is('[data-toggle]')){
                toggle = inputRadio.data('toggle');
            }
            if(inputRadio.prop('checked') && inputRadio.is('[data-toggle]')){
                $('.data__'+toggle).show();
            }
            inputRadio.on("click", function() {
                inputRadio.closest(".data-wrap").find(".data__toggle").hide();

                if($(".data__" + toggle).hasClass('data-wrap')) {
                    var innerRadioToggle = $(".data__" + toggle).find("[data-toggle]");
                    innerToggle = innerRadioToggle.data("toggle");
                    if (innerRadioToggle.prop("checked")) {
                        $(".data__" + innerToggle).show();
                    }
                }
                if (inputRadio.prop("checked") && inputRadio.is("[data-toggle]")) {
                    $(".data__" + toggle).show();
                }
            });
        });
    },
    popBankSearch : function(){
        $('.modal .search-result .search-result__item').each(function(){
            var thisSel = $(this);
            thisSel.on('click', function(){
                if(!thisSel.hasClass('is-active')){
                    thisSel.parent().find('.is-active').removeClass('is-active');
                    thisSel.addClass('is-active');
                }
            });
        });
    },
    innerTab : function(){
        $('.data-innerTabAnchor').each(function(){
            var thisAnchor = $(this);
            var innerTabAnchor = $('.data-innerTabAnchor');
            var innerTabPanel = $('.data-innerTabPanel');
            var thisIdx = thisAnchor.parents('li').index();

            thisAnchor.on('click', function(){
                if(!thisAnchor.hasClass('is-active')){
                    innerTabPanel.hide();
                    innerTabPanel.eq(thisIdx).show();
                    innerTabAnchor.removeClass('is-active');
                    thisAnchor.addClass('is-active');
                }
            })
        })
    },
    slideToggle : function(){
        $('.toggle--btn').each(function(){
            var thisBtn = $(this);
            var toggleDiv = thisBtn.next('div');
            thisBtn.on('click', function(){
                thisBtn.toggleClass('on');
                toggleDiv.slideToggle();
            })
        })
    },
    counterControl : function(){
        if($('#deviceTotal').length > 0){
            var totalInp = $('#deviceTotal');
            var greenInp = $('#greenIpt');
            var greenVal = Number(greenInp.val());
            var greenSpan = $('.green span');
            var whiteInp = $('#whiteIpt');
            var whiteVal = Number(whiteInp.val());
            var whiteSpan = $('.white span');
            var totalCount = greenVal + whiteVal;
            var totalSpan = $('.device__counter--total span');
            totalInp.val(totalCount);
            totalSpan.text(totalCount);
            greenSpan.text(greenVal);
            whiteSpan.text(whiteVal);
            $('.device__counter').each(function(){
                var thisBox = $(this);
                var thisType = thisBox.hasClass('green') ? true : false;
                var deviBtn = thisBox.find('button');
                var deviInp = thisBox.find('input');
                var deviVal = Number(deviInp.val());
                var deviSpan = thisBox.find('label span');
                deviBtn.on('click', function(){
                    if($(this).hasClass('device__counter--down') && totalInp.val() > 0) {
                        if(deviVal != 0) {
                            deviVal --;
                        }
                    } else if ($(this).hasClass('device__counter--up') && totalInp.val() < 20){
                        deviVal ++;
                    }
                    deviInp.val(deviVal);
                    deviSpan.text(deviVal);
                    if(thisType){
                        greenVal = deviVal;
                    } else {
                        whiteVal = deviVal;
                    }
                    totalInp.val(greenVal + whiteVal);
                    totalSpan.text(greenVal + whiteVal);
                });
            });
        }
    },
    imgUpload : function() {
        // $('.img-box').each(function() {
        //     var imgBox = $(this);
        //     var imgList = imgBox.find('.img-box__list');
        //     var imgItem = imgList.find('div.img-item');
        //     var imgReset = imgBox.find('.img-box__reset');

        //     imgItem.each(function(){
        //         if($(this).hasClass('img-preview') || $(this).find('.img-item__delete').length > 0){
        //             //
        //         } else {
        //             $(this).addClass('nofunc');
        //         }
        //     });

        //     if(imgBox.hasClass('img-box-logo')) {
        //         if(imgItem.length!=0) {
        //             imgReset.show();
        //         }
        //     }

        //     if(imgItem.length!=0) {
        //         imgReset.show();
        //     }
        // })

        // $('div.img-item').on('click', function() {
        //     var thisItem = $(this);
        //     var imgDelete = thisItem.find('.img-item__delete');
        //     var imgItemOn = $(this).hasClass('is-active');
        //     //var imgList = $(this).parents('.img-box').find('.img-box__wrap .img-box__list .img-item');
        //     //var imgReset = $(this).parents('.img-box').find('.img-box__reset');
        //     if(imgDelete.length > 0){
        //         if(!imgItemOn) {
        //             $(this).addClass('is-active');
        //         }else{
        //             $(this).removeClass('is-active');
        //         }
        //     }
        // });

        // $('.img-item__delete').on('click', function() {
        //     $(this).parent().remove();
        //     if($(this).parent().parent().find('div.img-item').length==0) {
        //         $(this).parents('.img-box').find('.img-box__reset').hide();
        //     }
        // })

        // $('.img-box__reset').on('click', function() {
        //     $(this).parents('.img-box').find('.img-box__wrap .img-box__list .img-item').remove();
        //     $(this).hide();
        // });
    },
    textareaAuto : function() {
        $(document).on('keydown keyup','textarea.form__textarea', function () {
            var scrollH = $(this).prop('scrollHeight');
            $(this).height(1).height(scrollH - 10);
        });
    },
    showPw : function() {
        $(document).on('click','.showpw',function(){
            var thisEye = $(this);
            if(thisEye.hasClass('on')){
                thisEye.parent().find('input').attr('type','password');
                thisEye.removeClass('on');
            } else {
                thisEye.parent().find('input').attr('type','text');
                thisEye.addClass('on');
            }
        });
    },
    leftScroll : function(){
        var left = $('.left');
        //var docScrollTop = $(document).scrollTop();
        if(left.length > 0){
            if(domChecker() && $(document).height()-$(document).scrollTop() < 850){
                left.css({'position':'absolute','top':left.offset().top})
            } else {
                left.css({'position':'fixed','top':''})
            }
            $(document).on('scroll', function (event) {
                if(domChecker() && $(document).height()-$(document).scrollTop() < 850){
                    left.css({'position':'absolute','top':left.offset().top})
                } else {
                    if(!leftChecker) {
                        left.css({'position':'fixed','top':''})
                    }
                }
            });
        }
    }
}
function domChecker() {
	var flag = false;
	$('.footer').each(function(index){
        var pos = $(this).offset(), wX = $(window).scrollLeft(), wY = $(window).scrollTop(), wH = $(window).height(), wW = $(window).width(), oH = $(this).outerHeight(), oW = $(this).outerWidth();

        // check the edges
        if (pos.left >= wX && pos.top >= wY && oW + pos.left <= wX + wW && oH + pos.top <= wY + wH ){
			//console.log('전체');
			flag = true;
		} else if (((pos.left <= wX && pos.left + oW > wX) || (pos.left >= wX && pos.left <= wX + wW)) && ((pos.top <= wY && pos.top + oH > wY) || (pos.top  >= wY && pos.top  <= wY + wH))){
			//console.log('일부');
			flag = true;
		}
    });
	if(flag == true){
		return true;
	}
}

var aniBig = function (f,b){
    f.addClass('inputon');
    b.animate({
        fontSize: '14px',
        top:'4px'
    });
}
var aniSmall = function (f,b){
    f.removeClass('inputon');
    b.animate({
        'font-size': '22px',
        'top':'24px'
    });
}
var inputs = (function(){
    var thisInput;
    var init = function(){
        thisInput = $('.form__element').not('dd');
        thisInput.each(function(){
            var self = $(this);
            var paDiv = self.parents('.form__unit');
            var paDivForm = paDiv.find('.form__label');
            if (self.is('select')){
                if(self.val() == self.parent('.form__unit').find('.form__label').text()){
                    self.addClass("selon");
                    paDiv.removeClass("inputon");
                    paDivForm.css({
                        "font-size": "22px",
                        top: "24px"
                    });
                } else {
                    paDiv.addClass("inputon");
                    paDivForm.css({
                        "font-size": "14px",
                        top: "4px"
                    });
                    self.removeClass("selon");
                }
            } else {
                if (self.val() != "") {
                    paDiv.addClass("inputon");
                    paDivForm.css({
                        "font-size": "14px",
                        top: "4px"
                    });
                } else {
                    paDiv.removeClass("inputon");
                    paDivForm.css({
                        "font-size": "22px",
                        top: "24px"
                    });
                }
            }
            self.addClass('comp');
        })
        eventBind();
    }
    var eventBind = function(){
        $(document).on("change",'select.form__element', function(el) {
            var paDiv = $(el.target).parents('.form__unit');
            var paDivForm = paDiv.find('.form__label');
            setTimeout(function(){
                if ($(el.target).val() == "") {
                    aniSmall(paDiv,paDivForm);
                }
                if($(el.target).val() == $(el.target).parents('.form__unit').find('.form__label').text()){
                    aniSmall(paDiv,paDivForm);
                    $(el.target).addClass('selon');
                } else {
                    aniBig(paDiv,paDivForm);
                    $(el.target).removeClass('selon')
                }
            }, 200);
        });
        $(document).on('click','.selectric-scroll ul li',function(){
            $(this).trigger(change);
        });
        $(document).on("focus change",'input.form__element, textarea.form__element', function() {
            var paDiv = $(this).parents('.form__unit');
            var paDivForm = paDiv.find('.form__label');
            if (!paDiv.hasClass('inputon')) {
                aniBig(paDiv,paDivForm);
            }
        });
        $(document).on("focusout change",'input.form__element, textarea.form__element', function() {
            var paDiv = $(this).parents('.form__unit');
            var paDivForm = paDiv.find('.form__label');
            if ($(this).val() == "") {

                var formWithbtn = $(this).parent('div.form__with-btn');
                var formWithbtnTooltip = formWithbtn.siblings('.form__label').find('.pualugin-tooltip');
                var formWithbtnTooltipDesc = formWithbtnTooltip.find('button').attr('aria-describedby');

                var labelTooltip = $(this).siblings('.form__label').find('.pualugin-tooltip');
                var labelToolTipDesc = labelTooltip.find('button').attr('aria-describedby');
                setTimeout(function(){
                    if(formWithbtn.length!=0 && $('#'+formWithbtnTooltipDesc).hasClass('is-active')) {
                        //no action
                    } else if(labelTooltip.length!=0 && $('#'+labelToolTipDesc).hasClass('is-active')) {
                        //no action
                    } else {
                        paDiv.removeClass('inputon');
                        paDivForm.animate({
                            'font-size': '22px',
                            'top':'24px'
                        });
                    }
                }, 200);
            }
        });
    }
    return {
        init: init
    }
})();

//개발대응 function

//셀렉트, 셀렉트옵션, 인풋 추가시
function newInput() {
    var thisInput = $('.form__element').not('.comp');
    thisInput.each(function(){
        var self = $(this);
        var paDiv = self.parents('.form__unit');
        var paDivForm = paDiv.find('.form__label');
        if (self.is('select')){
            if(self.val() == self.parent('.form__unit').find('.form__label').text()){
                self.addClass('selon');
                aniSmall(paDiv,paDivForm);
            } else {
                aniBig(paDiv,paDivForm);
                self.removeClass('selon')
            }
        } else {
            if (self.val() != "") {
                aniBig(paDiv,paDivForm);
            } else{
                aniSmall(paDiv,paDivForm)
            }
        }
        self.addClass('comp');
    })
    $('select').selectric('refresh');
}
function toastCall(txt,call,callval) {
    var text = txt;
    var toast = $('.toast-alert');
    var toastText = toast.find('.toast-alert__text');
    var callval = callval;
    toastText.text(text);
    toast.fadeIn(function(){
        setTimeout(function() {
            toast.fadeOut();
        }, 1000);
        if(call){
            call(callval);
        }
    });
}
var hourSelectInit;
$(document).ready(function () {
    inputs.init();
    // viewObj.inputLabelAni();
    viewObj.nextDivToggle();
    viewObj.popBankSearch();
    viewObj.lnbToggle();
    viewObj.innerTab();
    viewObj.slideToggle();
    viewObj.counterControl();
    viewObj.imgUpload();
    viewObj.textareaAuto();
    viewObj.showPw();
    viewObj.leftScroll();
    $('select').selectric({
        onInit: function() {
            hourSelectInit = Boolean(true);
        },
        disableOnMobile: true,
        nativeOnMobile: false,
    });
    if($('.checkheight').length > 0){
        if($('.checkheight:eq(0)').height() > $('.checkheight:eq(1)').height()){
            $('.checkheight:eq(1)').height($('.checkheight:eq(0)').height())
        } else {
            $('.checkheight:eq(0)').height($('.checkheight:eq(1)').height())
        }
        if($('.checkheight:eq(0) h3').height() > $('.checkheight:eq(1) h3').height()){
            $('.checkheight:eq(1) h3').height($('.checkheight:eq(0) h3').height())
        } else {
            $('.checkheight:eq(0) h3').height($('.checkheight:eq(1) h3').height())
        }
        if($('.checkheight:eq(0) p').height() > $('.checkheight:eq(1) p').height()){
            $('.checkheight:eq(1) p').height($('.checkheight:eq(0) p').height())
        } else {
            $('.checkheight:eq(0) p').height($('.checkheight:eq(1) p').height())
        }
    }
});