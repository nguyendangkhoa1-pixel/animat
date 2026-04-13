var baseUrl = $('base').attr('href');
var mobileWidth = 768;
var emailRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

function getURLVar(key) {
    var value = [];

    var query = String(document.location).split('?');

    if (query[1]) {
        var part = query[1].split('&');

        for (i = 0; i < part.length; i++) {
            var data = part[i].split('=');

            if (data[0] && data[1]) {
                value[data[0]] = data[1];
            }
        }

        if (value[key]) {
            return value[key];
        } else {
            return '';
        }
    }
}

function setCookie(name, value) {
    var expires = "";

    var date = new Date();
    date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();

    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function ajaxCall(url, data, callback) {
    $.ajax({
        type: "GET",
        url: url,
        data: data,
        dataType: "json",
        // crossDomain: crossDomain,
        xhrFields: {
            withCredentials: !0
        },
        success: function (data) {
            // console.log(data);
            callback(data);
        },
        error: function (request, status, error) {

        },
        cache: false
    })
}

function ajaxCallPOST(url, data, callback) {
    $.ajax({
        type: "POST",
        url: url,
        contentType: "application/json",
        mimeType: "application/json",
        dataType: "json",
        data: data,
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            // console.log(data);
            callback(data);
        },
        error: function (request, status, error) {

        },
        cache: false
    })
}

function showErrorMessage(message, mode, isScroll) {
    $('.alert-dismissible').remove();
    if (message) {

        let messageHTML = '';
        if (mode == 'success') {
            messageHTML += '<div class="alert alert-success alert-dismissible">';
        } else {
            messageHTML += '<div class="alert alert-danger alert-dismissible">';
        }

        messageHTML += '<i class="fa fa-exclamation-circle"></i>';
        messageHTML += message;
        messageHTML += '<button type="button" class="close" data-dismiss="alert">&times;</button></div>';

        $('.breadcrumb').after(messageHTML);

        if (isScroll){
            $('html, body').animate({
                scrollTop: 0
            }, 'slow');
        }
        
    }
}

function loadResponsiveImages() {
    var screenWidth = $(window).width();
    if (screenWidth <= 768) {
        //mobile
        $('img').each(function () {
            let mobileImg = $(this).data('mobile-src');
            let desktopImg = $(this).data('desktop-src')
            // console.log('mobile: '+mobileImg);
            // console.log('desktop: '+desktopImg);

            if (typeof mobileImg != 'undefined') {
                if (mobileImg.trim() != '') {
                    $(this).attr('src', mobileImg);
                }
            }
        });

    } else {
        //desktop
        $('img').each(function () {
            let mobileImg = $(this).data('mobile-src');
            let desktopImg = $(this).data('desktop-src')
            // console.log('desktop: '+desktopImg);

            if (typeof desktopImg != 'undefined') {
                if (desktopImg.trim() != '') {
                    $(this).attr('src', desktopImg);
                }
            }
        });
    }

    if (typeof movieSwiper != 'undefined' && typeof swiperWrapper != 'undefined') {
        // console.log('test');
        $('.module[data-type="movie"] .swiper-wrapper').attr('style', '');
        swiperWrapper.swiper(swiperSettings);


    }
}

function getMoreCallback(data) {
    // console.log(data);

    if (typeof data.products != 'undefined') {
        for (let i = 0; i < data.products.length; i++) {
            let product = data.products[i];

            let product_html = '<div class="product-layout col-lg-3 col-md-3 col-sm-3 col-xs-6">' +
                '<div class="product-thumb transition">' +
                '    <div class="product-name" alt="' + product.name + '" title="' + product.name + '" >' + product.name + '</div>' +
                '       <div class="image">' +
                '          <a href="' + product.href + '" alt="' + product.name + '" title="' + product.name + '" >' +
                '             <img class="lazy" alt="' + product.name + '" title="' + product.name + '" data-src="' + product.thumb + '" src="/catalog/view/theme/default/image/default-toei.jpg" />' +
                '          </a>' +
                '          <div class="caption">' +
                '             <div>' +
                '                <h4>' +
                '                  <a href="' + product.href + '" alt="' + product.name + '" title="' + product.name + '" >' + product.name + '</a>' +
                '                </h4>' +
                '                <p class="price">' + product.price + '</p>' +
                '                <div class="button-group">' +
                '                    <div type="button" data-type="eye" onclick="location.href = \'' + product.href + '\';"></div>' +
                '                    <div type="button" data-type="wishlist" onclick="wishlist.add(\'' + product.product_id + '\');"></div>';
                
                if( product.quantity > 0 ) {
                	product_html = product_html + '                    <div type="button" data-type="shopping-cart" onclick="cart.add(\'' + product.product_id + '\');"></div>';
                }
    
                product_html = product_html + '                </div>' +
                '             </div>' +
                '          </div>' +
                '       </div>' +
                '    </div>' +
                '</div>';

            $('#content .container.listing .row[data-type="list"]').append(product_html);
            $('.result-count span.showing').html($('#content .container.listing .row[data-type="list"] .product-layout').length);
            // $("img.lazy").Lazy();
        }
    }
    $("img.lazy").Lazy();

    if (typeof data.more_url == 'string') {
        ajax_url = data.more_url.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    } else if (data.more_url == null) {
        $('.show-more').hide();
    }
}

function updateCartList(json) {
    let product_list = json['products'];

    $('header .icon.cart .cart-list').html('');
    $('header .icon.cart .item.header span.count').html(json['amount']);

    for (let i = 0; i < product_list.length; i++) {
        let cart_product = product_list[i];
        $('header .icon.cart .cart-list').append(
            '<div class="item cart-item" data-item="' + cart_product.product_id + '">' +
            '<div class="thumbnail">' +
            '<a href="'+baseUrl+'index.php?route=product/product&product_id=' + cart_product.product_id + '">' +
            '<img src="'+baseUrl+'image/' + cart_product.image + '" alt="' + cart_product.name + '" title="' + cart_product.name + '" class="img-thumbnail">' +
            '</a>' +
            '</div>' +
            '<div class="title">' +
            '<a href="'+baseUrl+'index.php?route=product/product&product_id=' + cart_product.product_id + '">' + cart_product.name + '</a>' +
            '<br>' +
            json['language'].text_quantity + ': ' + cart_product.quantity +
            '<div class="cancel" onclick="cart.remove(\'' + cart_product.name + '\');">x</div>' +
            '</div>' +
            '</div>');
    }

    if (product_list.length == 1) {
        $('header .icon.cart .cart-container .button.redmode').remove();

        $('header .icon.cart .cart-container').append(
            '<div class="button redmode">' +
            '   <a href="'+baseUrl+'index.php?route=checkout/checkout">' + json['language'].text_checkout + '</a>' +
            '</div>'
        );
    }
}


$(document).ready(function () {
    // Lazy load
    $("img.lazy").Lazy();

    // News Messages Slider
    if ($('#newsbar').length > 0) {

        $('#newsbar .news[data-type="news-slide"]').click(function (event) {
                // console.log(event);

                $('#newsbar .news[data-type="news-slide"]').removeClass('animation');
                $(this).removeClass('back').addClass('animation');

                if (!$(this).hasClass('back')) {
                    // $(this).one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function(event) {
                    $(this).one("otransitionend oTransitionEnd msTransitionEnd transitionend", function (event) {
                        // console.log(event);
                        $(this).removeClass('animation').addClass('back');
                        // console.log($(this).next('.news[data-type="news-slide"]').length);

                        if ($(this).next('.news[data-type="news-slide"]').length == 1) {
                            $(this).next('.news[data-type="news-slide"]')[0].click();

                        } else {
                            // $('#newsbar .news[data-type="news-slide"]').removeClass('back');
                            $('#newsbar .news[data-type="news-slide"]')[0].click();
                        }
                    });
                }
            })
            .hover(function () {
                // console.log('in: '+$(this).css('margin-left'));
            }, function () {
                console.log('hover out');
            });

        setTimeout(function () {
            $('#newsbar .news[data-type="news-slide"]')[0].click();
        }, 500);


    }

    // reset default settings
    $('#search input[name=\'search\']').val('');

    // Highlight any found errors
    $('.text-danger').each(function () {
        var element = $(this).parent().parent();

        if (element.hasClass('form-group')) {
            element.addClass('has-error');
        }
    });

    // Cart dropdown
    $('.cart .cart-item .cancel').click(function () {
        $(this).closest('.cart-item').fadeOut('slow').addClass('hide');
    });

    // Forget PW Form
    if ($('#account-forgotten').length > 0) {
        // if ($('.login-form').length > 0) {
        //     $('.login-form .submit').click(function () {

        //         let email = $('input[name="email"]').val();
        //         if (!email.match(emailRegEx)) {
        //             showErrorMessage('Invalid Email Format', 'error', true);
        //         } else {
        //             $('form[name="login"]').submit();
        //         }
        //     })
        // }
    }

    // Register Form / Login Form
    if ($('#account-login').length > 0) {
        // if ($('.login-form').length > 0) {
        //     $('.login-form .submit').click(function () {

        //         let email = $('input[name="email"]').val();
        //         if (!email.match(emailRegEx)) {
        //             showErrorMessage('Invalid Email Format', 'error', true);
        //         } else {
        //             $('form[name="login"]').submit();
        //         }
        //     })
        // }

        // Sort the custom fields
        $('#account .form-group[data-sort]').detach().each(function () {
            if ($(this).attr('data-sort') >= 0 && $(this).attr('data-sort') <= $('#account .form-group').length) {
                $('#account .form-group').eq($(this).attr('data-sort')).before(this);
            }

            if ($(this).attr('data-sort') > $('#account .form-group').length) {
                $('#account .form-group:last').after(this);
            }

            if ($(this).attr('data-sort') == $('#account .form-group').length) {
                $('#account .form-group:last').after(this);
            }

            if ($(this).attr('data-sort') < -$('#account .form-group').length) {
                $('#account .form-group:first').before(this);
            }
        });

        $('input[name=\'customer_group_id\']').on('change', function () {
            $.ajax({
                url: 'index.php?route=account/register/customfield&customer_group_id=' + this.value,
                dataType: 'json',
                success: function (json) {
                    $('.custom-field').hide();
                    $('.custom-field').removeClass('required');

                    for (i = 0; i < json.length; i++) {
                        custom_field = json[i];

                        $('#custom-field' + custom_field['custom_field_id']).show();

                        if (custom_field['required']) {
                            $('#custom-field' + custom_field['custom_field_id']).addClass('required');
                        }
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
        });

        $('input[name=\'customer_group_id\']:checked').trigger('change');
        //

        $('button[id^=\'button-custom-field\']').on('click', function () {
            var element = this;

            $('#form-upload').remove();

            $('body').prepend(
                '<form enctype="multipart/form-data" id="form-upload" style="display: none;"><input type="file" name="file" /></form>'
            );

            $('#form-upload input[name=\'file\']').trigger('click');

            if (typeof timer != 'undefined') {
                clearInterval(timer);
            }

            timer = setInterval(function () {
                if ($('#form-upload input[name=\'file\']').val() != '') {
                    clearInterval(timer);

                    $.ajax({
                        url: 'index.php?route=tool/upload',
                        type: 'post',
                        dataType: 'json',
                        data: new FormData($('#form-upload')[0]),
                        cache: false,
                        contentType: false,
                        processData: false,
                        beforeSend: function () {
                            $(element).button('loading');
                        },
                        complete: function () {
                            $(element).button('reset');
                        },
                        success: function (json) {
                            $(element).parent().find('.text-danger').remove();

                            if (json['error']) {
                                $(node).parent().find('input').after(
                                    '<div class="text-danger">' + json['error'] + '</div>');
                            }

                            if (json['success']) {
                                alert(json['success']);

                                $(element).parent().find('input').val(json['code']);
                            }
                        },
                        error: function (xhr, ajaxOptions, thrownError) {
                            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr
                                .responseText);
                        }
                    });
                }
            }, 500);
        });
    }

    // Register Success Page 
    if ($('#account-success').length > 0) {
        // console.log('test');
        setTimeout(function () {
            location.href = '/index.php?route=common/home';
        }, 5000);
    }

    // Checkout Success Page 
    if ($('#common-success').length > 0) {
        setTimeout(function () {
            location.href = '/index.php?route=common/home';
        }, 10000);
    }

    // Currency
    $('#form-currency .currency-select').on('click', function (e) {
        e.preventDefault();
        $('#form-currency input[name=\'code\']').val($(this).attr('name'));
        $('#form-currency').submit();
    });

    // Language
    $('#form-language .language-select').on('click', function (e) {
        e.preventDefault();
        $('#form-language input[name=\'code\']').val($(this).attr('name'));
        $('#form-language').submit();
    });

    /* Search */
    $('#search input[name=\'search\']').parent().find('button').on('click', function () {
        var url = $('base').attr('href') + 'index.php?route=product/search';
        var value = $('header #search input[name=\'search\']').val();
        if (value) {
            url += '&search=' + encodeURIComponent(value);
        }
        location = url;
    });

    $('#header .mobile-menu .searchbar input[name=\'search\']').parent().find('button').on('click', function () {
        var url = $('base').attr('href') + 'index.php?route=product/search';
        var value = $('#header .mobile-menu .searchbar input[name=\'search\']').val();
        if (value) {
            url += '&search=' + encodeURIComponent(value);
        }
        location = url;
    });

    $('#search input[name=\'search\'], #header .mobile-menu .searchbar input[name=\'search\']').on('keydown', function (e) {
        if (e.keyCode == 13) {
            $(this).parent().find('button').trigger('click');
        }
    });


    $('div, button').click(function () {
        let clickUrl = $(this).data('link');
        if (typeof clickUrl != 'undefined') {
            if (clickUrl.trim() != "") {
                let target = $(this).data('link-target');
                if (target == '_blank') {
                    window.open(clickUrl, '_blank');
                } else {
                    location.href = clickUrl;
                }
            }
        }
    });

    loadResponsiveImages();
    $(window).resize(function () {
        loadResponsiveImages();
    });

    var predictiveSearch;
    $('#search input[name=\'search\'], #header .mobile-menu input[name=\'search\']').on('keyup keypress change keydown focus', function (e) {
            let searchStr = $(this).val();

            let newsUrl = baseUrl + 'index.php?route=product/search&search=';
            // console.log(searchStr);

            console.log(this);


            let predictiveContainer = $('#search .predictive, #header .mobile-menu .predictive');

            if (searchStr.trim().length > 0) {
                if (typeof predictiveSearch != 'undefined') {
                    clearTimeout(predictiveSearch);
                    // console.log('clear Timeout');
                }
                // console.log('set Timeout');
                predictiveSearch = setTimeout(function () {
                    $.ajax({
                        url: 'index.php?route=product/search/pre_search&search=' + searchStr,
                        type: 'get',
                        dataType: 'json',
                        success: function (json) {


                            predictiveContainer.html('');

                            if (json.category_result.length > 0) {
                                predictiveContainer.append('<div class="predictive-title">PRODUCT</div>');
                                for (let i = 0; i < json.category_result.length; i++) {
                                    let categoryItem = json.category_result[i];
                                    // console.log(predictItem['title_zh']);
                                    predictiveContainer.append('<div class="predictive-item"><a href="' + baseUrl + categoryItem['url'] + '"><div>' + categoryItem['breadcrumb'] + '</div></a></div>');

                                }
                            }

                            if (json.news_result.length > 0) {
                                predictiveContainer.append('<div class="predictive-title">NEWS</div>');
                                for (let i = 0; i < json.news_result.length; i++) {
                                    let newsItem = json.news_result[i];
                                    // console.log(predictItem['title_zh']);
                                    predictiveContainer.append('<div class="predictive-item"><a href="' + newsUrl + newsItem['url_en'] + '"><div>' + newsItem['title_en'] + '</div></a></div>');

                                }
                            }
                            predictiveContainer.removeClass('hide');
                        }
                    })
                }, 500);

            } else {
                predictiveContainer.addClass('hide');
            }
        })
        .on('blur', function (e) {
            $('.predictive').addClass('hide');
        });

    // Cookies layer
    $('#cookies .accept').click(function () {
        setCookie('accept-personal-info', '1');
        $('#cookies').removeClass('show').addClass('hide');
    })

    $('#cookies .decline').click(function () {
        $('#cookies').removeClass('show').addClass('hide');
    });

    // Menu
    $('#menu .dropdown-menu').each(function () {
        var menu = $('#menu').offset();
        var dropdown = $(this).parent().offset();

        var i = (dropdown.left + $(this).outerWidth()) - (menu.left + $('#menu').outerWidth());

        if (i > 0) {
            $(this).css('margin-left', '-' + (i + 10) + 'px');
        }
    });

    // Menu Highlight
    $('body .submenu > .item').each(function () {
        $(this).removeClass('highlight');
        let itemUrl = '';

        if ($(this).hasClass('hasChild')) {
            itemUrl = $(this).children('a').attr('href');
        } else {
            itemUrl = $(this).data('link');
        }
        (location.href == itemUrl) ? $(this).addClass('highlight'): null;

    });

    // Menu Expansion
    $('.button[data-type="menu"]').click(function () {
        if ($('#menu').hasClass('show')) {
            $('#menu, .dimlayer').removeClass('show');
            $('body, html').removeClass('no-scroll');
            $('#header').removeClass('show-menu');
        } else {
            $('#menu, .dimlayer').addClass('show');
            $('body, html').addClass('no-scroll');
            $('#header').addClass('show-menu');

            // Menu Expansion in submenu (mobile)
            $('body.no-scroll .submenu > .item').unbind();
            $('body.no-scroll .submenu > .item').click(function () {

                if ($(this).children('.item-list').hasClass('show')) {
                    $(this).children('.item-list').removeClass('show');
                } else {
                    $(this).children('.item-list').addClass('show');
                }

                /*
                if (!$(this).children('.item-list').hasClass('show')) {
                    $(this).children('.item-list').addClass('show');
                    $('body.no-scroll .submenu .item .item-list.show .title').unbind();
                    $('body.no-scroll .submenu .item .item-list.show .title').click(function () {
                        $(this).parent('.item-list').removeClass('show');
                    });
                }
                */
            });
        }
    });

    // Mobile Search
    $('.button[data-type="search"]').unbind();
    $('.button[data-type="search"]').click(function () {

        if ($('#menu').hasClass('show')) {
            $('.button[data-type="menu"]').click();
        }

        if ($('#header .mobile-menu .searchbar').hasClass('hide')) {
            $('#header .mobile-menu .searchbar').removeClass('hide');
        } else {
            $('#header .mobile-menu .searchbar').addClass('hide');
        }


    });

    // Footer
    $('footer h5').click(function () {
        if ($(this).closest('.footer-section').children('.list-unstyled').hasClass('show')) {
            $(this).closest('.footer-section').children('.list-unstyled').removeClass('show');
        } else {
            $('footer .list-unstyled').removeClass('show');
            $(this).closest('.footer-section').children('.list-unstyled').addClass('show');
        }
    });

    // Product List
    $('#list-view').click(function () {
        $('#content .product-grid > .clearfix').remove();

        $('#content .row > .product-grid').attr('class', 'product-layout product-list col-xs-12');
        $('#grid-view').removeClass('active');
        $('#list-view').addClass('active');

        localStorage.setItem('display', 'list');
    });

    // Product Grid
    $('#grid-view').click(function () {
        // What a shame bootstrap does not take into account dynamically loaded columns
        var cols = $('#column-right, #column-left').length;

        if (cols == 2) {
            $('#content .product-list').attr('class', 'product-layout product-grid col-lg-6 col-md-6 col-sm-12 col-xs-12');
        } else if (cols == 1) {
            $('#content .product-list').attr('class', 'product-layout product-grid col-lg-4 col-md-4 col-sm-6 col-xs-12');
        } else {
            $('#content .product-list').attr('class', 'product-layout product-grid col-lg-3 col-md-3 col-sm-6 col-xs-12');
        }

        $('#list-view').removeClass('active');
        $('#grid-view').addClass('active');

        localStorage.setItem('display', 'grid');
    });

    // Product Detail
    if ($('#product-product').length > 0) {

        $('#product-product .form-group[data-input="button"] .btn-option').click(function () {

            let option_selected = $(this).hasClass('selected');
            let option_name = $(this).closest('.form-group').data('option-id');
            let option_value = $(this).attr('type-value');

            if (option_selected) {
                $(this).removeClass('selected');
                $('select#' + option_name).val('');
                $('#sizedata').html('');

                galleryThumbs.destroy(false, true);
                galleryTop.destroy(false, true);
                $('.swiper-wrapper').html(sliderContent);
                galleryThumbs = new Swiper('.gallery-thumbs', galleryThumbsSettings);
                galleryTop = new Swiper('.gallery-top', galleryTopSettings);

            } else {

                let option_id = $(this).attr('type-optionid');
                let product_option_value_id = option_value;
                let product_id = $(this).closest('#product').data('productid');

                $.ajax({
                    url: 'index.php?route=extension/optioncolorsize/optioncolorsize&product_id=' + product_id + '&product_option_value_id=' + product_option_value_id + '&option_id=' + option_id,
                    type: 'post',
                    dataType: 'json',
                    success: function (json) {
                        if (json['html']) {
                            // console.log(json['html'].trim().length);
                            if (json['html'].trim().length > 0){
                                galleryThumbs.destroy(false, true);
                                galleryTop.destroy(false, true);
                                $('.swiper-wrapper').html(json['html']);
                                galleryThumbs = new Swiper('.gallery-thumbs', galleryThumbsSettings);
                                galleryTop = new Swiper('.gallery-top', galleryTopSettings);
                            }
                            
                        }

                        if (json['sizedata']) {
                            $('#sizedata').html(json['sizedata']);

                            $('#product-product .form-group[data-input="select"] .btn-option').unbind();
                            $('#product-product .form-group[data-input="select"] .btn-option').click(function () {
                                let option_selected = $(this).hasClass('selected');
                                let sizeValue = $(this).data('value');
                                let sizeOptionId = $(this).data('optionid');

                                if (option_selected) {
                                    $(this).removeClass('selected');
                                    $('select#' + sizeOptionId).val('');
                                } else {

                                    $('#product-product .form-group[data-input="select"] .btn-option').removeClass('selected');
                                    $(this).addClass('selected');
                                    $('select#' + sizeOptionId).val(sizeValue);
                                }
                            });
                        }

                        $('.oplx').remove();
                        if (json['model']) {
                            $('.changemodel').text(json['model']);
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                    }
                });

                $('#product-product .form-group[data-input="button"] .btn-option').removeClass('selected');
                $(this).addClass('selected');
                $('select#' + option_name).val(option_value);

            }
        });

        $('#product-product .form-group[data-type="qty"] .qty-btn').click(function () {
            let qty = $('#product-product .form-group[data-type="qty"]>input[name="quantity"]');
            let btnClick = $(this).data('type');

            if (btnClick == 'minus') {
                (qty.val() > 1) ? qty.val(parseInt(qty.val()) - 1): null;
            } else if (btnClick == 'add') {
                qty.val(parseInt(qty.val()) + 1);
            }
        });

        $('#product-product .size-table span').click(function () {
            $('body>.dimlayer').html('<div class="size-spec"></div>').addClass('cover');

            $('body>.dimlayer.cover').unbind();
            $('body>.dimlayer.cover').click(function () {
                $('body>.dimlayer').removeClass('cover').html('');
            });
        });

        $('#product-product #button-cart').on('click', function () {
            $.ajax({
                url: 'index.php?route=checkout/cart/add',
                type: 'post',
                data: $(
                    '#product input[type=\'text\'], #product input[type=\'hidden\'], #product input[type=\'radio\']:checked, #product input[type=\'checkbox\']:checked, #product select, #product textarea'
                ),
                dataType: 'json',
                beforeSend: function () {
                    $('#button-cart').button('loading');
                },
                complete: function () {
                    $('#button-cart').button('reset');
                },
                success: function (json) {
                    $('.alert-dismissible, .text-danger').remove();
                    $('.form-group').removeClass('has-error');

                    if (json['error']) {
                        if (json['error']['option']) {
                            for (i in json['error']['option']) {
                                var element = $('#input-option' + i.replace('_', '-'));

                                if (element.parent().hasClass('input-group')) {
                                    element.parent().after('<div class="text-danger">' + json['error'][
                                        'option'
                                    ][i] + '</div>');
                                } else {
                                    element.after('<div class="text-danger">' + json['error']['option'][
                                        i
                                    ] + '</div>');
                                }
                            }
                        }

                        if (json['error']['recurring']) {
                            $('select[name=\'recurring_id\']').after('<div class="text-danger">' + json[
                                'error']['recurring'] + '</div>');
                        }

                        // Highlight any found errors
                        $('.text-danger').parent().addClass('has-error');
                    }

                    if (json['success']) {
                        showErrorMessage(json['success'], 'success', true);
                        $('#cart > ul').load('index.php?route=common/cart/info ul li');

                        (json['amount'] >= 1) ? $('header .icon.cart .num').removeClass('hide'): $(
                            'header .icon.cart .num').addClass('hide');
                        $('header .icon.cart .num').html(json['amount']);
                    }

                    if (json['products']) {
                        updateCartList(json);
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
        });

        $('select[name=\'recurring_id\'], input[name="quantity"]').change(function () {
            $.ajax({
                url: 'index.php?route=product/product/getRecurringDescription',
                type: 'post',
                data: $(
                    'input[name=\'product_id\'], input[name=\'quantity\'], select[name=\'recurring_id\']'
                ),
                dataType: 'json',
                beforeSend: function () {
                    $('#recurring-description').html('');
                },
                success: function (json) {
                    $('.alert-dismissible, .text-danger').remove();

                    if (json['success']) {
                        $('#recurring-description').html(json['success']);
                    }
                }
            });
        });


        $('button[id^=\'button-upload\']').on('click', function () {
            var node = this;

            $('#form-upload').remove();

            $('body').prepend(
                '<form enctype="multipart/form-data" id="form-upload" style="display: none;"><input type="file" name="file" /></form>'
            );

            $('#form-upload input[name=\'file\']').trigger('click');

            if (typeof timer != 'undefined') {
                clearInterval(timer);
            }

            timer = setInterval(function () {
                if ($('#form-upload input[name=\'file\']').val() != '') {
                    clearInterval(timer);

                    $.ajax({
                        url: 'index.php?route=tool/upload',
                        type: 'post',
                        dataType: 'json',
                        data: new FormData($('#form-upload')[0]),
                        cache: false,
                        contentType: false,
                        processData: false,
                        beforeSend: function () {
                            $(node).button('loading');
                        },
                        complete: function () {
                            $(node).button('reset');
                        },
                        success: function (json) {
                            $('.text-danger').remove();

                            if (json['error']) {
                                $(node).parent().find('input').after(
                                    '<div class="text-danger">' + json['error'] + '</div>');
                            }

                            if (json['success']) {
                                alert(json['success']);

                                $(node).parent().find('input').val(json['code']);
                            }
                        },
                        error: function (xhr, ajaxOptions, thrownError) {
                            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr
                                .responseText);
                        }
                    });
                }
            }, 500);
        });

        $('#review').delegate('.pagination a', 'click', function (e) {
            e.preventDefault();

            $('#review').fadeOut('slow');
            $('#review').load(this.href);
            $('#review').fadeIn('slow');
        });

    }

    // Wishlist
    if ($('#account-wishlist').length > 0) {
        
        $('#account-wishlist .item .delete').click(function (){
            $(this).closest('.item').fadeOut('slow');
        });

    }    

    // Checkout Cart
    if ($('#checkout-cart').length > 0) {

        $('#checkout-cart .cart-content .delete').click(function (){
            $(this).closest('.cart-product').fadeOut('slow');
        });

        $('#checkout-cart .cart-content .edit').click(function () {
            let cart_id = $(this).closest('.cart-product').data('cartid');
            if ($(this).hasClass('editmode')) {
                $(this).removeClass('editmode');
                $('.cart-product[data-cartid="' + cart_id + '"] .cart-quantity .recent').removeClass('hide').addClass('show');
                $('.cart-product[data-cartid="' + cart_id + '"] .cart-quantity .edit-quantity').removeClass('show').addClass('hide');
                // $(this).closest('.cart-product').children('.cart-quantity').children('.recent').removeClass('hide').addClass('show');
                // $(this).closest('.cart-product').children('.cart-quantity').children('.edit-quantity').removeClass('show').addClass('hide');
            } else {
                $(this).addClass('editmode');
                $('.cart-product[data-cartid="' + cart_id + '"] .cart-quantity .recent').removeClass('show').addClass('hide');
                $('.cart-product[data-cartid="' + cart_id + '"] .cart-quantity .edit-quantity').removeClass('hide').addClass('show');
                // $(this).closest('.cart-product').children('.cart-quantity').children('.recent').removeClass('show').addClass('hide');
                // $(this).closest('.cart-product').children('.cart-quantity').children('.edit-quantity').removeClass('hide').addClass('show');

                $('#checkout-cart .cart-content .edit.editmode').unbind();
                $('#checkout-cart .cart-content .edit.editmode').click(function () {
                    $('.cart-product[data-cartid="' + cart_id + '"] .cart-quantity button').click();
                });
            }

        });

        $('#checkout-cart .edit-quantity .qty .qty-btn').click(function () {
            let cart_id = $(this).closest('.cart-product').data('cartid');
            let qty = $('.cart-product[data-cartid="' + cart_id + '"] .cart-quantity input[type="text"]');
            let btnClick = $(this).data('type');

            if (btnClick == 'minus') {
                (qty.val() > 1) ? qty.val(parseInt(qty.val()) - 1): null;
            } else if (btnClick == 'add') {
                qty.val(parseInt(qty.val()) + 1);
            }
        });

        $('#checkout-cart  #button-coupon').on('click', function () {
            $.ajax({
                url: 'index.php?route=extension/total/coupon/coupon',
                type: 'post',
                data: 'coupon=' + encodeURIComponent($('input[name=\'coupon\']').val()),
                dataType: 'json',
                beforeSend: function () {
                    $('#button-coupon').button('loading');
                },
                complete: function () {
                    $('#button-coupon').button('reset');
                },
                success: function (json) {
                    showErrorMessage(json['error'], 'error', true);

                    if (json['redirect']) {
                        location = json['redirect'];
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr
                        .responseText);
                }
            });
        });

        $('#checkout-cart  #button-clearcoupon').click(function () {
            let coupon_code = $('#checkout-cart .cart-content .coupon input[type="text"]').val();
            if (coupon_code.trim() == '') {
                showErrorMessage('No Coupon Applied', 'error', true);
            } else {
                ajaxCall('index.php?route=extension/total/coupon/coupon_clear', null, function (data) {
                    if (data.error.trim() != '') {
                        showErrorMessage(data.error, 'error', true);
                    } else {
                        location = data.redirect;
                    }
                });
            }
        });
    }

    //Checkout Form 
    if ($('#checkout-checkout').length > 0) {
        // Login
        $(document).delegate('#button-login', 'click', function () {
            $.ajax({
                url: 'index.php?route=checkout/login/save',
                type: 'post',
                data: $('#collapse-checkout-option :input'),
                dataType: 'json',
                beforeSend: function () {
                    $('#button-login').button('loading');
                },
                complete: function () {
                    $('#button-login').button('reset');
                },
                success: function (json) {
                    $('.alert-dismissible, .text-danger').remove();
                    $('.form-group').removeClass('has-error');

                    if (json['redirect']) {
                        location = json['redirect'];
                    } else if (json['error']) {
                        showErrorMessage(json['error']['warning'], 'error', true);

                        // Highlight any found errors
                        $('input[name=\'email\']').parent().addClass('has-error');
                        $('input[name=\'password\']').parent().addClass('has-error');
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
        });
    }

    if (localStorage.getItem('display') == 'list') {
        $('#list-view').trigger('click');
        $('#list-view').addClass('active');
    } else {
        $('#grid-view').trigger('click');
        $('#grid-view').addClass('active');
    }

    if (getCookie('accept-personal-info') != '1') {
        $('#cookies').addClass('show').removeClass('hide');
    }

    // Checkout
    $(document).on('keydown', '#collapse-checkout-option input[name=\'email\'], #collapse-checkout-option input[name=\'password\']', function (e) {
        if (e.keyCode == 13) {
            $('#collapse-checkout-option #button-login').trigger('click');
        }
    });

    // tooltips on hover
    $('[data-toggle=\'tooltip\']').tooltip({
        container: 'body'
    });

    // Makes tooltips work on ajax generated content
    $(document).ajaxStop(function () {
        $('[data-toggle=\'tooltip\']').tooltip({
            container: 'body'
        });
    });
});

// Cart add remove functions
var cart = {
    'add': function (product_id, quantity) {
        $.ajax({
            url: 'index.php?route=checkout/cart/add',
            type: 'post',
            data: 'product_id=' + product_id + '&quantity=' + (typeof (quantity) != 'undefined' ? quantity : 1),
            dataType: 'json',
            beforeSend: function () {
                $('#cart > button').button('loading');
            },
            complete: function () {
                $('#cart > button').button('reset');
            },
            success: function (json) {
                $('.alert-dismissible, .text-danger').remove();

                if (json['redirect']) {
                    location = json['redirect'];
                }

                if (json['success']) {
                    showErrorMessage(json['success'], 'success');

                    // Need to set timeout otherwise it wont update the total
                    setTimeout(function () {
                        $('#cart > button').html('<span id="cart-total"><i class="fa fa-shopping-cart"></i> ' + json['total'] + '</span>');
                    }, 100);

                    // $('html, body').animate({
                    //     scrollTop: 0
                    // }, 'slow');

                    $('#cart > ul').load('index.php?route=common/cart/info ul li');

                    (json['amount'] >= 1) ? $('header .icon.cart .num').removeClass('hide'): $('header .icon.cart .num').addClass('hide');
                    $('header .icon.cart .num').html(json['amount']);

                }

                if (json['products']) {
                    updateCartList(json);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },
    'update': function (key, quantity) {
        $.ajax({
            url: 'index.php?route=checkout/cart/edit',
            type: 'post',
            data: 'key=' + key + '&quantity=' + (typeof (quantity) != 'undefined' ? quantity : 1),
            dataType: 'json',
            beforeSend: function () {
                $('#cart > button').button('loading');
            },
            complete: function () {
                $('#cart > button').button('reset');
            },
            success: function (json) {
                // Need to set timeout otherwise it wont update the total
                setTimeout(function () {
                    $('#cart > button').html('<span id="cart-total"><i class="fa fa-shopping-cart"></i> ' + json['total'] + '</span>');
                }, 100);

                if (getURLVar('route') == 'checkout/cart' || getURLVar('route') == 'checkout/checkout') {
                    location = 'index.php?route=checkout/cart';
                } else {
                    $('#cart > ul').load('index.php?route=common/cart/info ul li');
                }

            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },
    'remove': function (key) {
        $.ajax({
            url: 'index.php?route=checkout/cart/remove',
            type: 'post',
            data: 'key=' + key,
            dataType: 'json',
            beforeSend: function () {
                $('#cart > button').button('loading');
            },
            complete: function () {
                $('#cart > button').button('reset');
            },
            success: function (json) {
                // Need to set timeout otherwise it wont update the total
                setTimeout(function () {
                    $('#cart > button').html('<span id="cart-total"><i class="fa fa-shopping-cart"></i> ' + json['total'] + '</span>');
                }, 100);

                if (getURLVar('route') == 'checkout/cart' || getURLVar('route') == 'checkout/checkout') {
                    location = 'index.php?route=checkout/cart';
                } else {
                    $('#cart > ul').load('index.php?route=common/cart/info ul li');
                }

                (json['amount'] >= 1) ? $('header .icon.cart .num').removeClass('hide'): $('header .icon.cart .num').addClass('hide');
                $('header .icon.cart .num').html(json['amount']);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}

var voucher = {
    'add': function () {

    },
    'remove': function (key) {
        $.ajax({
            url: 'index.php?route=checkout/cart/remove',
            type: 'post',
            data: 'key=' + key,
            dataType: 'json',
            beforeSend: function () {
                $('#cart > button').button('loading');
            },
            complete: function () {
                $('#cart > button').button('reset');
            },
            success: function (json) {
                // Need to set timeout otherwise it wont update the total
                setTimeout(function () {
                    $('#cart > button').html('<span id="cart-total"><i class="fa fa-shopping-cart"></i> ' + json['total'] + '</span>');
                }, 100);

                if (getURLVar('route') == 'checkout/cart' || getURLVar('route') == 'checkout/checkout') {
                    location = 'index.php?route=checkout/cart';
                } else {
                    $('#cart > ul').load('index.php?route=common/cart/info ul li');
                }
                (json['amount'] >= 1) ? $('header .icon.cart .num').removeClass('hide'): $('header .icon.cart .num').addClass('hide');
                $('header .icon.cart .num').html(json['amount']);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}

var wishlist = {
    'add': function (product_id) {
        $.ajax({
            url: 'index.php?route=account/wishlist/add',
            type: 'post',
            data: 'product_id=' + product_id,
            dataType: 'json',
            success: function (json) {
                $('.alert-dismissible').remove();

                if (json['redirect']) {
                    location = json['redirect'];
                }

                if (json['success']) {
                    showErrorMessage(json['success'], 'success', true);
                }

                $('#wishlist-total span').html(json['total']);
                $('#wishlist-total').attr('title', json['total']);

                (json['amount'] >= 1) ? $('header .icon.star .num').removeClass('hide'): $('header .icon.star .num').addClass('hide');
                $('header .icon.star .num').html(json['amount']);

                // $('html, body').animate({
                //     scrollTop: 0
                // }, 'slow');
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },
    'remove': function () {

    }
}

var compare = {
    'add': function (product_id) {
        $.ajax({
            url: 'index.php?route=product/compare/add',
            type: 'post',
            data: 'product_id=' + product_id,
            dataType: 'json',
            success: function (json) {
                $('.alert-dismissible').remove();

                if (json['success']) {
                    showErrorMessage(json['success'], 'success', true);

                    $('#compare-total').html(json['total']);

                    $('html, body').animate({
                        scrollTop: 0
                    }, 'slow');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },
    'remove': function () {

    }
}

/* Agree to Terms */
$(document).delegate('.agree', 'click', function (e) {
    e.preventDefault();

    $('#modal-agree').remove();

    var element = this;

    $.ajax({
        url: $(element).attr('href'),
        type: 'get',
        dataType: 'html',
        success: function (data) {
            html = '<div id="modal-agree" class="modal">';
            html += '  <div class="modal-dialog">';
            html += '    <div class="modal-content">';
            html += '      <div class="modal-header">';
            html += '        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
            html += '        <h4 class="modal-title">' + $(element).text() + '</h4>';
            html += '      </div>';
            html += '      <div class="modal-body">' + data + '</div>';
            html += '    </div>';
            html += '  </div>';
            html += '</div>';

            $('body').append(html);

            $('#modal-agree').modal('show');
        }
    });
});

// Autocomplete */
(function ($) {
    $.fn.autocomplete = function (option) {
        return this.each(function () {
            this.timer = null;
            this.items = new Array();

            $.extend(this, option);

            $(this).attr('autocomplete', 'off');

            // Focus
            $(this).on('focus', function () {
                this.request();
            });

            // Blur
            $(this).on('blur', function () {
                setTimeout(function (object) {
                    object.hide();
                }, 200, this);
            });

            // Keydown
            $(this).on('keydown', function (event) {
                switch (event.keyCode) {
                    case 27: // escape
                        this.hide();
                        break;
                    default:
                        this.request();
                        break;
                }
            });

            // Click
            this.click = function (event) {
                event.preventDefault();

                value = $(event.target).parent().attr('data-value');

                if (value && this.items[value]) {
                    this.select(this.items[value]);
                }
            }

            // Show
            this.show = function () {
                var pos = $(this).position();

                $(this).siblings('ul.dropdown-menu').css({
                    top: pos.top + $(this).outerHeight(),
                    left: pos.left
                });

                $(this).siblings('ul.dropdown-menu').show();
            }

            // Hide
            this.hide = function () {
                $(this).siblings('ul.dropdown-menu').hide();
            }

            // Request
            this.request = function () {
                clearTimeout(this.timer);

                this.timer = setTimeout(function (object) {
                    object.source($(object).val(), $.proxy(object.response, object));
                }, 200, this);
            }

            // Response
            this.response = function (json) {
                html = '';

                if (json.length) {
                    for (i = 0; i < json.length; i++) {
                        this.items[json[i]['value']] = json[i];
                    }

                    for (i = 0; i < json.length; i++) {
                        if (!json[i]['category']) {
                            html += '<li data-value="' + json[i]['value'] + '"><a href="#">' + json[i]['label'] + '</a></li>';
                        }
                    }

                    // Get all the ones with a categories
                    var category = new Array();

                    for (i = 0; i < json.length; i++) {
                        if (json[i]['category']) {
                            if (!category[json[i]['category']]) {
                                category[json[i]['category']] = new Array();
                                category[json[i]['category']]['name'] = json[i]['category'];
                                category[json[i]['category']]['item'] = new Array();
                            }

                            category[json[i]['category']]['item'].push(json[i]);
                        }
                    }

                    for (i in category) {
                        html += '<li class="dropdown-header">' + category[i]['name'] + '</li>';

                        for (j = 0; j < category[i]['item'].length; j++) {
                            html += '<li data-value="' + category[i]['item'][j]['value'] + '"><a href="#">&nbsp;&nbsp;&nbsp;' + category[i]['item'][j]['label'] + '</a></li>';
                        }
                    }
                }

                if (html) {
                    this.show();
                } else {
                    this.hide();
                }

                $(this).siblings('ul.dropdown-menu').html(html);
            }

            $(this).after('<ul class="dropdown-menu"></ul>');
            $(this).siblings('ul.dropdown-menu').delegate('a', 'click', $.proxy(this.click, this));

        });
    }
})(window.jQuery);