$(function() {
	$("#row_cities").hide();
	$("#go").hide();

	// popup menu
	$('#header ul.menu li.submenu').mouseenter(function(){
		$(this).children('ul').show();
	}).mouseleave(function(){
		$(this).children('ul').hide();
	})
	$('#header ul.menu li.submenu > a').click(function(e){
		e.preventDefault();
		$(this).siblings('ul').toggle();
	});
	// тултипы с использованием плагина jquery.qtip.js
	$('.tooltip-handle').qtip({
		show: {
			event: 'click mouseenter'
		},
		hide: {
			event: 'click mouseleave'
		},
		style: {
			classes: 'qtip-bootstrap-wood'
		},
		position: {
			my: 'left center',
			at: 'right center'
		}
	});
	// редактирование подписок
	$('.subscriptions a.change').click(function(){
		var $a = $(this);
		var tr = $a.closest('tr');
		$.ajax({
			url: this.href,
			cache: false
		}).done(function(html) {
			var $editRow = $('.edit_subscription');
			$editRow.insertAfter(tr).find('td').html(html);
			initRegionForm();
		});
		$("#dark").show();
		return false;
	});
	$('.subscriptions').on('click', 'a.ok', function() {
		var $ul = $(this).closest('ul.form');
		var data = $ul.find('input,select').fieldSerialize();
		$.ajax({
			url: $ul.data('form-action'),
			type: 'POST',
			data: data
		}).done(function(html) {
			$('.edit_subscription td').html(html);
		});
		return false;
	});
	$('.subscriptions').on('click', 'a.close', function() {
		$("#dark").hide();
		$(this).parents('td').empty();
		if ($(this).hasClass('reload')) {
			document.location.reload();
		}
		return false;
	});

	// выбор регионов
	var $countryRegionForm = $("form.country_region");
	var $fd = $("#id_federal_district").val();
	var $country = $("#id_country").val();
	if ($country == "ru") {
	} else {
		if ($country) {
			$.each(regions_by_country[$country], function(key, slug_and_name) {
				var slug = slug_and_name[0];
				var name = slug_and_name[1];
				$("#id_region")
					.append($("<option></option>")
						.attr("value", slug)
						.text(name));
			});
		}
	}
	initRegionForm();

    $("input[id^='country_']").on("change", function() {
        if($(this).attr('checked')) {
            var country = $(this).attr('id');
            if(country == "country_ru") {
                if(~country.indexOf(country)) {
                    country = country.substr(8, country.length - country.indexOf(country) + 7);
                    $("input[id^='federal_district_']").each(function (i, el) {
                        var federal_district = $(this).attr('id');
                        if(~federal_district.indexOf(country)) {
                            federal_district = federal_district.substr(17, federal_district.length - 17 - country.length - 1)
                            $(this).attr('checked', true);
                            $("input[id^='secondary_region_']").each(function (i, el) {
                                var secondary_region = $(this).attr('id');
                                if(~secondary_region.indexOf(federal_district)) {
                                    if(~secondary_region.indexOf("daugavpils") || ~secondary_region.indexOf("luganskaya")) {
                                        $(this).attr('checked', false);
								    } else {
                                        $(this).attr('checked', true);
									}
								}
                            });
                        }
                    });
                }
            } else {
                if (country.indexOf('country') + 1) {
                    country = country.substr(8, country.length - country.indexOf(country) + 7);
                    $("input[id^='secondary_region_']").each(function (i, el) {
                        var secondary_region = $(this).attr('id');
                        if (secondary_region.endsWith('_' + country)) {
                            secondary_region = secondary_region.substr(secondary_region.indexOf('secondary_region') + 17, secondary_region.length - secondary_region.indexOf('secondary_region') + 17)
                            $(this).attr('checked', true);
                        }
                    });
                }
            }
        } else {
            var country = $(this).attr('id');
            if(country == "country_ru") {
                if (~country.indexOf(country)) {
                    country = country.substr(8, country.length - country.indexOf(country) + 7);
                    $("input[id^='federal_district_']").each(function (i, el) {
                        var federal_district = $(this).attr('id');
                        if (federal_district.indexOf(country) + 1) {
                            // federal_district = federal_district.substr(federal_district.indexOf('federal_district') + 17, federal_district.length - federal_district.indexOf('federal_district') + 17)
                            $(this).attr('checked', false);
                        }
                    });
                    $("input[id^='secondary_region_']").each(function (i, el) {
                        var secondary_region = $(this).attr('id');
                        if (secondary_region.indexOf(country) + 1) {
                            // secondary_region = secondary_region.substr(secondary_region.indexOf('secondary_region') + 17, secondary_region.length - secondary_region.indexOf('secondary_region') + 17)
                            $(this).attr('checked', false);
                        }
                    });
                }
            } else {
                if (~country.indexOf(country)) {
                    country = country.substr(8, country.length - country.indexOf(country) + 7);
                    $("input[id^='secondary_region_']").each(function (i, el) {
                        var secondary_region = $(this).attr('id');
                        if (secondary_region.indexOf(country) + 1) {
                            secondary_region = secondary_region.substr(secondary_region.indexOf('secondary_region') + 17, secondary_region.length - secondary_region.indexOf('secondary_region') + 17)
                            $(this).attr('checked', false);
                        }
                    });
                }
            }
        }
    });

    $("input[id^='federal_district_']").on("change", function() {
        var federal_district = $(this).attr('id');
        var country = federal_district.substr(federal_district.lastIndexOf('_') + 1, federal_district.length - federal_district.lastIndexOf('_'));
        federal_district = federal_district.substr(17, federal_district.length - 17 - country.length - 1)
        if($(this).attr('checked')) {
            $("input[id^='secondary_region_']").each(function (i, el) {
                var secondary_region = $(this).attr('id');
                if(~secondary_region.indexOf(federal_district)) {
 					if(~secondary_region.indexOf("daugavpils") || ~secondary_region.indexOf("luganskaya")) {
						$(this).attr('checked', false);
					} else {
						$(this).attr('checked', true);
					}
                }
            });
        } else {
            country = "#country_" + country;
            $(country).attr('checked', false);
            $("input[id^='secondary_region_']").each(function (i, el) {
                var secondary_region = $(this).attr('id');
                if(~secondary_region.indexOf(federal_district)) {
                    $(this).attr('checked', false);
                }
            });
        }
    });

    $("input[id^='secondary_region_']").on("change", function() {
        var secondary_region = $(this).attr('id');
        var country = secondary_region.substr(secondary_region.lastIndexOf('_') + 1, secondary_region.length - secondary_region.lastIndexOf('_'));
        if(country == "ru") {
            if(~secondary_region.indexOf('_', 17)) {
                var federal_district = secondary_region.substr(secondary_region.indexOf('_', 17) + 1, secondary_region.length - secondary_region.indexOf('_', 17));
            }

            federal_district = "#federal_district_" + federal_district;
            if ($(this).attr('checked')) {
            } else {
                $(federal_district).attr('checked', false);
            }
        }
        country = "#country_" + country;
        if ($(this).attr('checked')) {
        } else {
            $(country).attr('checked', false);
        }
    });
});

function initRegionForm() {
	// выбор из нескольких регионов
	var $regionForm = $("form.region");
	if ($regionForm.length) {
		var $regionSelects = $("select[multiple][id$='region']");
		$regionSelects.each(function (index, element) {
			var $target = $(element);
			var anyRegionText = $target.find("option[value='']").remove().text();
			$target.multiselect({
				header: '<a class="ui-multiselect-none" href="#"><span class="ui-icon ui-icon-closethick"></span><span>'+gettext('Любой регион')+'</span></a>',
				noneSelectedText: anyRegionText,
				selectedText: function(numChecked, numTotal, checkedItems) {
					if (numChecked == 1) {
						return checkedItems[0].title;
					}
					return numChecked + " " + ngettext("регион", "регионов", numChecked);
				}
			});
		})
	}

	// выбор регионов в форме поиска
	var $countryRegionForm = $("form.country_region");
	if ($countryRegionForm.length && window.regions_by_country) {
		// при изменении в форме страны меняем возможные значения для выпадающего списка "регион"
		$countryRegionForm.find('#id_country').change(function(event) {
			var $form = $(this).closest("form");
			// очищаем список "регион" кроме пустого элемента
			var $regionSelect = $form.find("#id_region");
			$regionSelect.find('option[value!=""]').remove();
			var $federalDistrictSelect = $countryRegionForm.find("#id_federal_district");
			var currentCountry = $(this).val();
            if ((currentCountry == "")||(currentCountry == "ru")) {
			    if ($('#id_federal_district')[0]) {
                    $("#form_row_federal_district").show();
                } else {
                    $('<li id="form_row_federal_district">' +
						'<label for="id_federal_district" style="display: block;">Федеральный округ</label>' +
						'<select name="federal_district" id="id_federal_district" style="display: inline-block;">' +
						'<option value="" selected="selected">Все федеральные округа</option>' +
						'<option value="dalvostok">Дальневосточный федеральный округ</option>' +
						'<option value="privolga">Приволжский федеральный округ</option>' +
						'<option value="sevzapad">Северо-Западный федеральный округ</option>' +
						'<option value="sevkavkaz">Северо-Кавказский федеральный округ</option>' +
						'<option value="sibir">Сибирский федеральный округ</option>' +
						'<option value="ural">Уральский федеральный округ</option>' +
						'<option value="center">Центральный федеральный округ</option>' +
						'<option value="ug">Южный федеральный округ</option>' +
						'</select>' +
						'</li>').insertAfter($('#form_row_country'));

	                if ($countryRegionForm.length && window.regions_by_federal_district) {
		                $countryRegionForm.find('#id_federal_district').change(function(event) {
			                var currentFederalDistrict = $(this).val();
			                var $form = $(this).closest("form");
			                // очищаем список "регион" кроме пустого элемента
			                var $regionSelect = $form.find("#id_region");
			                $regionSelect.find('option[value!=""]').remove();

			                if (currentFederalDistrict) {
				                $.each(regions_by_federal_district[currentFederalDistrict], function(key, slug_and_name) {
					                var slug = slug_and_name[0];
					                var name = slug_and_name[1];
					                $regionSelect
										.append($("<option></option>")
						                .attr("value", slug)
											.text(name));
				                });
                            }
						});
	                }
                }
				$.each(regions_by_country["ru"], function(key, slug_and_name) {
					var slug = slug_and_name[0];
					var name = slug_and_name[1];
					$regionSelect
						.append($("<option></option>")
						.attr("value", slug)
						.text(name));
				});
            }
            else {
				$("#form_row_federal_district").hide();
            }
            // заполняем, http://stackoverflow.com/questions/170986/what-is-the-best-way-to-add-options-to-a-select-from-an-array-with-jquery
			if (currentCountry) {
				$.each(regions_by_country[currentCountry], function(key, slug_and_name) {
					var slug = slug_and_name[0];
					var name = slug_and_name[1];
					$regionSelect
						.append($("<option></option>")
						.attr("value", slug)
						.text(name));
				});
			}
			if ($regionSelect.data('echMultiselect')) {
				$regionSelect.find("option:selected").removeAttr('selected');
				$regionSelect.multiselect('refresh');
				$regionSelect.multiselect('uncheckAll');
			}
		});
	}

	// выбор федерального округа в форме поиска
	if ($countryRegionForm.length && window.regions_by_federal_district) {
		$countryRegionForm.find('#id_federal_district').change(function(event) {
			var currentFederalDistrict = $(this).val();
			var $form = $(this).closest("form");
			// очищаем список "регион" кроме пустого элемента
			var $regionSelect = $form.find("#id_region");
			$regionSelect.find('option[value!=""]').remove();

			if (currentFederalDistrict) {
				$.each(regions_by_federal_district[currentFederalDistrict], function(key, slug_and_name) {
					var slug = slug_and_name[0];
					var name = slug_and_name[1];
					$regionSelect
						.append($("<option></option>")
						.attr("value", slug)
						.text(name));
				});
    			if ($regionSelect.data('echMultiselect')) {
	    			$regionSelect.find("option:selected").removeAttr('selected');
		    		$regionSelect.multiselect('refresh');
			    	$regionSelect.multiselect('uncheckAll');
			    }
           } else {
                var currentCountry = $("#id_country").val();
    			if (currentCountry) {
	    			$.each(regions_by_country[currentCountry], function(key, slug_and_name) {
		    			var slug = slug_and_name[0];
			    		var name = slug_and_name[1];
				    	$regionSelect
					    	.append($("<option></option>")
    						.attr("value", slug)
	    					.text(name));
		    		});
    				if ($regionSelect.data('echMultiselect')) {
	    				$regionSelect.find("option:selected").removeAttr('selected');
		    			$regionSelect.multiselect('refresh');
			    		$regionSelect.multiselect('uncheckAll');
			    	}
			    }
			}
		});
		if (currentFederalDistrict == "") {
            $.each(regions_by_country["ru"], function (key, slug_and_name) {
                var slug = slug_and_name[0];
                var name = slug_and_name[1];
                $("#id_region")
                    .append($("<option></option>")
                        .attr("value", slug)
                        .text(name));
            });
        }
	}
}

// эффекты выделения поля, используются в калькуляторе

function easeInOut(minValue,maxValue,totalSteps,actualStep,powr) {
    var delta = maxValue - minValue;
    var stepp = minValue+(Math.pow(((1 / totalSteps)*actualStep),powr)*delta);
    return Math.ceil(stepp);
}

function doBGFade(elem,startRGB,endRGB,finalColor,steps,intervals,powr) {
    if (elem.bgFadeInt) window.clearInterval(elem.bgFadeInt);
    var actStep = 0;
    elem.bgFadeInt = window.setInterval(
        function() {
                elem.css("backgroundColor", "rgb("+
                        easeInOut(startRGB[0],endRGB[0],steps,actStep,powr)+","+
                        easeInOut(startRGB[1],endRGB[1],steps,actStep,powr)+","+
                        easeInOut(startRGB[2],endRGB[2],steps,actStep,powr)+")"
                );
                actStep++;
                if (actStep > steps) {
                elem.css("backgroundColor", finalColor);
                window.clearInterval(elem.bgFadeInt);
                }
        }
        ,intervals);
}

// округление, http://www.cyberforum.ru/javascript/thread475237.html
function formatFloat(src, digits) {
    var powered, tmp, result
    // make sure it is number
    if (isNaN(src))
        return src;
    // 10^digits
    var powered = Math.pow(10, digits);
    var tmp = src*powered;
    // round tmp
    tmp = Math.round(tmp);
    // get result
    var result = tmp/powered;
    return result;
}

// как parseFloat, только учитывает запятую вместо точки
function rusParseFloat(src) {
	return parseFloat(src.replace(/,/, '.'));
}

// калькулятор погонажных изделий
function Calculator($running_meter_filed, $square_meter_field_id) {
	var fadeFrom = [200,255,0];
	var fadeTo = [255,255,255];
	this.onChange = function() {
		var width = rusParseFloat($('input#width').val()) / 1000; // ширина в метрах
		var running_meter_cost = rusParseFloat($('input#running_meter_cost').val());
		var square_meter_cost = rusParseFloat($('input#square_meter_cost').val());
		switch (this.id) {
			case 'width':
			case 'running_meter_cost':
				if (!isNaN(running_meter_cost) && !isNaN(width) && width) {
					var value = formatFloat( running_meter_cost / width, 2);
					$('input#square_meter_cost').val( value );
					doBGFade($('input#square_meter_cost'), fadeFrom, fadeTo, fadeTo, 10, 30, 1);
				}
				else if ($('input#width').val())
					$('input#square_meter_cost').val('');
				break;
			case 'square_meter_cost':
				if (!isNaN(square_meter_cost) && !isNaN(width)) {
					var value = formatFloat(square_meter_cost * width, 2);
					$('input#running_meter_cost').val( value );
					doBGFade($('input#running_meter_cost'), fadeFrom, fadeTo, fadeTo, 10, 30, 1);
				}
				else if ($('input#width').val())
					$('input#running_meter_cost').val('');
				break;
		}
	}

	$('input#width').keyup(this.onChange);
	$('input#running_meter_cost').keyup(this.onChange);
	$('input#square_meter_cost').keyup(this.onChange);
	$('input#move_to_form').click(function(){
		$running_meter_filed.val($('input#running_meter_cost').val());
		$square_meter_field_id.val($('input#square_meter_cost').val());
		doBGFade($running_meter_filed, fadeFrom, fadeTo, 'transparent',50,30,1.5);
		doBGFade($square_meter_field_id, fadeFrom, fadeTo, 'transparent',50,30,1.5);
	});
}

// Двухуровневое дерево выбора регионов
function RegionSelectTree($tree, freeRegionsAllowed, paidRegionCount, regionCost, regionCostPeriod) {
	$tree.find('.category>label').click(function(){
		var $submenu = $(this).closest('.category').find('>ul');
		if ($submenu.css('display') == 'none') { // берёт стиль у первого элемента
			$submenu.slideDown('fast');
			$(this).find('>span').html('▼');
		} else {
			$submenu.slideUp('fast');
			$(this).find('>span').html('▶');
		};
	});

	function updateInfoBox() {
		var checkedRegions = $tree.find("input[id^='secondary_region_']:checked:not(:disabled)").length;
		var lines = [];
		var secondary_region_price = (
			$('#region_select_tree').attr("secondary_region_price") ||
			$('#region_select_tree_show').attr("secondary_region_price") // Если это шаблон show-one
		);
		if (checkedRegions) {
			lines.push(gettext("Выбрано дополнительных регионов") + ": " + checkedRegions);
			var freeRegions = Math.min(checkedRegions, freeRegionsAllowed);
			if (freeRegions) {
				lines.push(gettext("Бесплатных") + ": " + freeRegions);
			}
			var paidSelectedRegionCount = Math.min(paidRegionCount, checkedRegions-freeRegions);
			if (paidSelectedRegionCount) {
				lines.push(gettext("Оплаченных") + ": " + paidSelectedRegionCount);
			}
			var nonPaidRegions = Math.max(checkedRegions - freeRegions - paidRegionCount, 0);
			var nonPaidRegions_sum = nonPaidRegions * secondary_region_price;
			if (nonPaidRegions) {
				lines.push(gettext("К оплате") + ": " + nonPaidRegions + " (" + nonPaidRegions_sum + " &#8381;)");
			}
			var discont = 0;
			var discont_sum = 0;
			if (nonPaidRegions >= 40) {
				discont = 40;
			} else {
				discont = nonPaidRegions;
			}
			discont_sum = Math.round(nonPaidRegions_sum / 100 * discont);
			if (discont) {
				lines.push("<span id='discont' style='color: palevioletred'>" + gettext("Скидка") + ": " + discont + "%" + " (" + discont_sum + " &#8381;)</span>");
			}
			var itogo = nonPaidRegions_sum - discont_sum;
			if (itogo) {
				lines.push("<span id='itogo' style='color: green'>" + gettext("Итого") + ": " + itogo + " &#8381;</span>");
			}
			lines.push("<br>");
		}
		$tree.find('.selected_regions_count_text').html(lines.join("<br>"));
	}
	updateInfoBox();

	$tree.find('input[type="checkbox"]').change(function() {
		updateInfoBox();
		var checkedRegionsCount = $tree.find('input[type="checkbox"]:checked:not(:disabled)').length;
		if (this.checked && checkedRegionsCount >= (freeRegionsAllowed+paidRegionCount) && !$tree.data('regionsCountWarningDisplayed')) {
			var includeThis = checkedRegionsCount > (freeRegionsAllowed+paidRegionCount);
			var msg_part1 = gettext(includeThis ? "Каждый следующий отмеченный регион будет стоить" : "Этот и каждый следующий отмеченный регион будет стоить")
			var msg_part2 = ngettext("(на %(period)s день)", "(на %(period)s дней)", regionCostPeriod)
			var msg = interpolate(msg_part1 + " " + regionCost + " \u20BD " + msg_part2 + ".", {
				'period': regionCostPeriod,
			}, true);
			if (!paidRegionCount) {
				msg = interpolate(ngettext("Вы можете отметить %s дополнительный регион бесплатно", "Вы можете отметить %s дополнительных регионов бесплатно", freeRegionsAllowed), [freeRegionsAllowed]) + ". " + msg;
			}
			$tree.data('regionsCountWarningDisplayed', true);
			setTimeout(function() { alert(msg); }, 0);
		}
	 });

	// Сворачиваем категории. Если свернуть прямо в шаблоне, то категории не будут
	// отображаться у пользователей, у которых отключен JavaScript
	$tree.find('.category>ul').css('display', 'none');
	$tree.find('.category>label>span').html('▶');
	return $tree;
}

function PriceCalculator($element) {
	var $element = $(".price-calculator");
	var $number = $('.number', $element);
	var notification_price = parseFloat($('.price', $element).text().replace(/,/g, '.'));

	$number.change(function(){
		var $form = $(this).closest('form');
		var number_of_notifications = $(this).val();
		var ok = !(isNaN(number_of_notifications) || number_of_notifications <= 0 || number_of_notifications % 1 !== 0);
		if (ok) {
			$form.find('.total-price').text(number_of_notifications * notification_price);
		}
                else {
			$form.find('.total-price').text('asdfas');
}
		$form.find('.total-price-wrapper').toggle(ok);
	}).change();
}

function addToFavorites(a) {
	var title=document.title;
	var url=document.location;
	try {
		// Internet Explorer
		window.external.AddFavorite(url, title);
	} catch (e) {
		try {
			// Mozilla
			window.sidebar.addPanel(title, url, "");
		} catch (e) {
			// Opera
			if (typeof(opera)=="object") {
				a.rel="sidebar";
				a.title=title;
				a.url=url;
				a.href=url;
				return true;
			} else {
				// Unknown
				alert(gettext('Нажмите Ctrl-D, чтобы добавить страницу в закладки.'));
			}
		}
	}
	return false;
}