//전역변수
var string;
//함수 객체
var viewObj = {
    // input + label animation
    inputLabelAni: function() {
        $(".form__element").each(function() {
            var thisInput = $(this);
            var paDiv = thisInput.parents(".form__unit");
            var paDivForm = paDiv.find(".form__label");

            function aniBig() {
                paDiv.addClass("inputon");
                paDivForm.animate({
                    fontSize: "12px",
                    top: "29px"
                });
            }

            function aniSmall() {
                paDiv.removeClass("inputon");
                paDivForm.animate({
                    "font-size": "17px",
                    top: "55px"
                });
            }
            if (thisInput.is("select")) {
                if (thisInput.val() == thisInput.parent(".form__unit").find(".form__label").text()) {
                    thisInput.addClass("selon");
                    paDiv.removeClass("inputon");
                    paDivForm.css({
                        "font-size": "17px",
                        top: "55px"
                    });
                } else {
                    paDiv.addClass("inputon");
                    paDivForm.css({
                        "font-size": "12px",
                        top: "29px"
                    });
                    thisInput.removeClass("selon");
                }
                thisInput.on("change", function() {
                    setTimeout(function(){
                        if (thisInput.val() == "") {
                            aniSmall();
                        }
                        if (thisInput.val() == thisInput.parents(".form__unit").find(".form__label").text()) {
                            aniSmall();
                            thisInput.addClass("selon");
                        } else {
                            aniBig();
                            thisInput.removeClass("selon");
                        }
                    }, 200);
                });
                $(".selectric-scroll ul li").on("click", function() {
                    thisInput.trigger(change);
                });
            } else {
                if (thisInput.val() != "") {
                    paDiv.addClass("inputon");
                    paDivForm.css({
                        "font-size": "12px",
                        top: "29px"
                    });
                } else {
                    paDiv.removeClass("inputon");
                    paDivForm.css({
                        "font-size": "17px",
                        top: "55px"
                    });
                }
                thisInput.on("focus", function() {
                    if (!paDiv.hasClass("inputon")) {
                        aniBig();
                    }
                });
                thisInput.on("focusout", function() {
                    if (thisInput.val() == "") {
                        var formWithbtn = $(this).parent("div.form__with-btn");
                        var formWithbtnTooltip = formWithbtn.siblings(".form__label").find(".pualugin-tooltip");
                        var formWithbtnTooltipDesc = formWithbtnTooltip.find("button").attr("aria-describedby");
                        var labelTooltip = $(this).siblings(".form__label").find(".pualugin-tooltip");
                        var labelToolTipDesc = labelTooltip.find("button").attr("aria-describedby");
                        setTimeout(function(){
                            if (formWithbtn.length != 0 && $("#" + formWithbtnTooltipDesc).hasClass("is-active")) {
                                //no action
                            } else if (labelTooltip.length != 0 && $("#" + labelToolTipDesc).hasClass("is-active")) {
                                //no action
                            } else {
                                aniSmall();
                            }
                        }, 200);
                    }
                });
            }
        });
    },
    nextDivToggle: function() {
        $('.btn-radio__input, .pualugin-checkbox__input').not('.data__specificCheck .gray-box .pualugin-checkbox__input').each(function(){
            var inputRadio = $(this);
            var toggle;
            var innerToggle;
            if (inputRadio.is("[data-toggle]")) {
                toggle = inputRadio.data("toggle");
            }
            if (inputRadio.prop("checked") && inputRadio.is("[data-toggle]")) {
                $(".data__" + toggle).show();
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
    popBankSearch: function() {
        $(".search-result .search-result__item a").each(function() {
            var thisSel = $(this);
            thisSel.on("click", function() {
                var thisItem = thisSel.parents(".search-result__item");
                if (!thisItem.hasClass("is-active")) {
                    thisItem.parent().find(".is-active").removeClass("is-active");
                    thisItem.addClass("is-active");
                }
            });
        });
    },
    slideToggle: function() {
        $(".toggle--btn").each(function() {
            var thisBtn = $(this);
            var toggleDiv = thisBtn.next("div");
            thisBtn.on("click", function() {
                thisBtn.toggleClass("on");
                toggleDiv.slideToggle();
            });
        });
    },
    counterControl: function() {
        if ($("#deviceTotal").length > 0) {var totalInp = $('#deviceTotal');
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
    imgUpload: function() {
        // $('.img-box').each(function() {
        //     var imgBox = $(this);
        //     var imgList = imgBox.find('.img-box__list');
        //     var imgItem = imgList.find('div.img-item');
        //     var imgReset = imgBox.find('.img-box__reset');
        //     imgItem.each(function(){
        //         if($(this).hasClass('img-preview') || $(this).find('.img-item__delete').length > 0){
        //
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
        //     var imgList = $(this).parents('.img-box').find('.img-box__wrap .img-box__list .img-item');
        //     var imgReset = $(this).parents('.img-box').find('.img-box__reset');
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
    textareaAuto: function() {
        $("textarea.form__textarea").on("keydown keyup", function() {
            var scrollH = $(this).prop("scrollHeight");
            $(this).height(1).height(scrollH - 8);
        });
    },
    showPw: function() {
        $(".showpw").each(function() {
            var thisEye = $(this);
            thisEye.on("click", function() {
                if (thisEye.hasClass("on")) {
                    thisEye.parent().find("input").attr("type", "password");
                    thisEye.removeClass("on");
                } else {
                    thisEye.parent().find("input").attr("type", "text");
                    thisEye.addClass("on");
                }
            });
        });
    }
};

var aniBig = function (f,b){
    f.addClass('inputon');
    b.animate({
        fontSize: '12px',
        top:'29px'
    });
}
var aniSmall = function (f,b){
    f.removeClass('inputon');
    b.animate({
        'font-size': '17px',
        'top':'55px'
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
                        "font-size": "17px",
                        top: "55px"
                    });
                } else {
                    paDiv.addClass("inputon");
                    paDivForm.css({
                        "font-size": "12px",
                        top: "29px"
                    });
                    self.removeClass("selon");
                }
            } else {
                if (self.val() != "") {
                    paDiv.addClass("inputon");
                    paDivForm.css({
                        "font-size": "12px",
                        top: "29px"
                    });
                } else {
                    paDiv.removeClass("inputon");
                    paDivForm.css({
                        "font-size": "17px",
                        top: "55px"
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
                            'font-size': '17px',
                            'top':'55px'
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
$(document).ready(function() {
    inputs.init();
    // viewObj.inputLabelAni();
    viewObj.nextDivToggle();
    viewObj.popBankSearch();
    viewObj.slideToggle();
    viewObj.counterControl();
    viewObj.imgUpload();
    viewObj.textareaAuto();
    viewObj.showPw();
    $("select").selectric({
        onInit: function() {
            hourSelectInit = Boolean(true);
        },
        disableOnMobile: true,
        nativeOnMobile: false,
    });
    //변수설정
    var body = $("body");
    var doc = $(document);
    var wrapIn = $(".wrap__in");
    var wrapBottom = $(".wrap__bottom");
    //wrap 기본padding-bottom 설정
    if (wrapBottom.length > 0) {
        setTimeout(function(){
            wrapIn.css({
                "padding-bottom": wrapBottom.outerHeight(true) + 55,
                "min-height": $(window).height()
            });
        },100)
    } else {
        setTimeout(function(){
            wrapIn.css("padding-bottom", 22);
        },100)
    }
});