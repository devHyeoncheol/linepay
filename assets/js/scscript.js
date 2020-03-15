//전역변수
var string;
//함수 객체
var viewObj = {
    gnbToggle:function() {
        var hamBtn = $('.btn-hammenu');
        var gnb = $('.gnb');
        var closer = $('.btn-gnbcloser');
        var wrapper = $('.wrap');
        hamBtn.on("click", function(){
            //gnb.addClass('on');
            gnb.attr('aria-hidden','false').fadeIn();
            wrapper.attr('aria-hidden','true');
		});
        closer.on("click", function(){
            wrapper.attr('aria-hidden','false');
            gnb.attr('aria-hidden','true').fadeOut();
        });
        $(document).on('mouseup touchend',function(e){
            if(gnb.has(e.target).length===0 && gnb.is(':visible')){
                wrapper.attr('aria-hidden','false');
                gnb.attr('aria-hidden','true').fadeOut();
            }
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
                    fontSize: '13px',
                    top:'5px'
                });
            }
            function aniSmall(){
                paDiv.removeClass('inputon');
                paDivForm.animate({
                    'font-size': '19px',
                    'top':'26px'
                });
            }
            if (thisInput.is('select')){
                if(thisInput.val() == thisInput.prev().text()){
                    thisInput.addClass('selon');
                    paDiv.removeClass('inputon');
                    paDivForm.css({
                        'font-size': '19px',
                        'top':'26px'
                    });
                } else {
                    paDiv.addClass('inputon');
                    paDivForm.css({
                        'font-size': '13px',
                        'top':'5px'
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
                        'font-size': '13px',
                        'top':'5px'
                    });
                } else{
                    paDiv.removeClass('inputon');
                    paDivForm.css({
                        'font-size': '19px',
                        'top':'26px'
                    });
                }
                thisInput.on("focus", function() {
                    if (!paDiv.hasClass('inputon')) {
                        aniBig();

                        var labelTooltip = $(this).siblings('.form__label').find('.pualugin-tooltip');
                        // var tooltipBtn = labelTooltip.find('.icon-tooltip').attr('aria-expended');

                        if(labelTooltip.length!=0) {
                            $(labelTooltip).on('mouseenter', function() {
                                $(this).addClass('over');
                                // setTimeout(function() {
                                //     $(this).removeClass('over');
                                // }, 2000)
                            });
                        }
                    }
                });
                thisInput.on("focusout", function() {

                    if (thisInput.val() == "") {

                        var labelTooltip = $(this).siblings('.form__label').find('.pualugin-tooltip');
                        var labelToolTipDesc = labelTooltip.find('button').attr('aria-describedby');
                        setTimeout(function(){
                            if(labelTooltip.length!=0 && $('#'+labelToolTipDesc).hasClass('is-active')) {
                                //no action
                            } else {
                                paDiv.removeClass('inputon');
                                paDivForm.animate({
                                    fontSize: '19px',
                                    top:'26px'
                                });
                            }
                        }, 200);
                    }
                });
            }
        });
    },
    nextDivToggle: function(){
        $('.btn-radio__input').each(function(){
            var inputRadio = $(this);
            var toggle;
            if(inputRadio.is('[data-toggle]')){
                toggle = inputRadio.data('toggle');
            }
            if(inputRadio.prop('checked') && inputRadio.is('[data-toggle]')){
                $('.data__'+toggle).show();
            }
            inputRadio.on('click', function(){
                inputRadio.parents('.data-wrap').find('.data__toggle').hide()
                if(inputRadio.prop('checked') && inputRadio.is('[data-toggle]')){
                    $('.data__'+toggle).show();
                }
            })
        });
        $('.pualugin-checkbox__input').each(function(){
            var inputCheck = $(this);
            var toggle;
            if(inputCheck.is('[data-toggle]')){
                toggle = inputCheck.data('toggle');
            }
            if(inputCheck.prop('checked') && inputCheck.is('[data-toggle]')){
                $('.data__'+toggle).show();
            }
            inputCheck.on('click', function(){
                if(inputCheck.is('[data-toggle]')) {
                    inputCheck.parents('.data-wrap').find('.data__toggle').hide()
                    if(inputCheck.prop('checked')){
                        $('.data__'+toggle).show();
                    }
                }
            })
        });
    },
    customMDRInput: function(){
        $('.data__custommdr input').each(function(){
            var inputThis = $(this);
            if(inputThis.val() == "0.00" || inputThis.val() == "") {
                inputThis.addClass('grayinputtxt');
                inputThis.next('.per').addClass('grayinputtxt');
                inputThis.parent().prev('.plus').addClass('grayinputtxt');
            }
            inputThis.on('input', function(){
                if(inputThis.val() == "0.00" || inputThis.val() == "") {
                    inputThis.addClass('grayinputtxt');
                    inputThis.next('.per').addClass('grayinputtxt');
                    inputThis.parent().prev('.plus').addClass('grayinputtxt');
                } else {
                    inputThis.removeClass('grayinputtxt');
                    inputThis.next('.per').removeClass('grayinputtxt');
                    inputThis.parent().prev('.plus').removeClass('grayinputtxt');
                }
            });
            (function ($) {
                var originalVal = $.fn.val;
                $.fn.val = function (value) {
                    var res = originalVal.apply(this, arguments);
                    if (this.is('input:text') && arguments.length >= 1) {
                        this.trigger("input");
                    }
                    return res;
                };
            })(jQuery);
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

        // $(document).on('click', 'div.img-item', function() {
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

        // $(document).on('click', '.img-item__delete', function() {
        //     if($(this).parent().parent().find('div.img-item').length==1) {
        //         $(this).parents('.img-box').find('.img-box__reset').hide();
        //     }
        //     $(this).parent().remove();
        // })

        // $(document).on('click', '.img-box__reset', function() {
        //     $(this).parents('.img-box').find('.img-box__wrap .img-box__list div.img-item').remove();
        //     $(this).hide();
        // });
        // $('.img-box__list').on('DOMSubtreeModified', function() {
        //     if($(this).find('div.img-item').length!=0) {
        //         $(this).parent().prev().find('.img-box__reset').show();
        //     } else {
        //         $(this).parent().prev().find('.img-box__reset').hide();
        //     }
        // });
    },
    textareaAuto : function() {
        $('textarea.form__textarea').on('keydown keyup', function () {
            var scrollH = $(this).prop('scrollHeight');
            $(this).height(1).height(scrollH - 10);
            // $('.talk-input-box').css('height',$(this).prop('scrollHeight')+72);
        });
    },
    showPw : function() {
        $('.showpw').each(function(){
            var thisEye = $(this);
            thisEye.on('click', function(){
                if(thisEye.hasClass('on')){
                    thisEye.parent().find('input').attr('type','password');
                    thisEye.removeClass('on');
                } else {
                    thisEye.parent().find('input').attr('type','text');
                    thisEye.addClass('on');
                }
            });
        });
    },
    tableCheck : function() {
        var tg = $('.tb-check tbody tr');
            tg.css('cursor', 'pointer')
            tg.each(function(){
                var tr = $(this);
                tr.on('click', function(){
                    if(!tr.hasClass('is-active')){
                        tr.parent().find('.is-active').removeClass('is-active');
                        tr.addClass('is-active');
                    }
                });
            });
    },
    hourSelectric : function(){
        if($('.sales-info__hour').length > 0){
            view();
        }
        function view(){
            console.log('ll');
        }
    }
}

var aniBig = function (f,b){
    f.addClass('inputon');
    b.animate({
        fontSize: '13px',
        top:'5px'
    });
}
var aniSmall = function (f,b){
    f.removeClass('inputon');
    b.animate({
        'font-size': '19px',
        'top':'26px'
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
                        "font-size": "20px",
                        top: "28px"
                    });
                } else {
                    paDiv.addClass("inputon");
                    paDivForm.css({
                        "font-size": "13px",
                        top: "5px"
                    });
                    self.removeClass("selon");
                }
            } else {
                if (self.val() != "") {
                    paDiv.addClass("inputon");
                    paDivForm.css({
                        "font-size": "13px",
                        top: "5px"
                    });
                } else {
                    paDiv.removeClass("inputon");
                    paDivForm.css({
                        "font-size": "20px",
                        top: "28px"
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
                            'font-size': '19px',
                            'top':'26px'
                        });
                    }
                }, 200);
            }
        });
        $(document).on('click', 'p.form__label.form__label--required', function(){
            $(this).next('label').click();
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

//mini on/off
var miniChecker = (function(){
    var init = function(){
        var check = $('.miniChecker')
        if(check.length > 0){
            if(check.is(':checked')){
                $('.linepaymini__article').show();
            }
            check.on('click',function(){
                if(check.is(':checked')){
                    $('.linepaymini__article').show();
                } else {
                    $('.linepaymini__article').hide();
                }
            });
        }
    }
    return {
        init: init
    }
})();


var iframes = (function(){
    var init = function(){
        $('.modal__scrollarea').each(function() {
            if($(this).find('iframe').length > 0){
                $(this).addClass('overhidden');
            }
        });
    }
    return {
        init: init
    }
})();

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
    iframes.init();
    miniChecker.init();
    // viewObj.inputLabelAni();
    viewObj.gnbToggle();
    viewObj.nextDivToggle();
    viewObj.customMDRInput();
    viewObj.popBankSearch();
    viewObj.counterControl();
    viewObj.imgUpload();
    viewObj.textareaAuto();
    viewObj.showPw();
    viewObj.tableCheck();
    $('select').not('.sclist-th-button select').selectric({
        onInit: function() {
            hourSelectInit = Boolean(true);
        },
        disableOnMobile: true,
        nativeOnMobile: false,
    });
    function mobSelWidth(){
        var selectCustom = $('.cont__article.search-area');
        var selectThis = selectCustom.find('select');
        var inputDiv = selectCustom.find('.search-area--input-div');
        var selectCustomWidth = selectCustom.find('select').outerWidth();
        console.log(selectCustomWidth);
        var inputDivBtnWidth = inputDiv.find('button').outerWidth();
        var selWinWidth = $(window).width();
        if(!selectThis.parent().hasClass('selectric-hide-select') && selWinWidth <= 768){
            inputDiv.width(selWinWidth-selectCustomWidth-inputDivBtnWidth-166)
        } else if(!selectThis.parent().hasClass('selectric-hide-select') && selWinWidth > 768){
            inputDiv.width(936-selectCustomWidth-inputDivBtnWidth-116)
        }
    }
    $('.sclist-th-button select').selectric({
        onInit: function() {
            mobSelWidth();
            $(window).resize(function(){
                mobSelWidth();
            });
        },
        disableOnMobile: false,
        nativeOnMobile: false,
    });
    $(document).on('mousedown ','.nocurr', function(){
        var thisBtn = $(this);
        setTimeout(function(){
            thisBtn.prev('.thdaterange').click();
        },100)
    });
    $(document).on('click','.sclist-th-button button', function(){
        $(this).parent().find('.selectric').click();
    });
    $('.sclist-th-button select').on('selectric-open selectric-close', function(event, element, selectric) {
        $(this).parents('.sclist-th-button').find('button').toggleClass('slideon');
    });
});
