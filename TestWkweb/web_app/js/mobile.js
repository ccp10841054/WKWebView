var web_app_version="web_app3.9.25";
var DEBUG=true;
var is_adb=false;
var is_dijia=false;
var is_meixin=false;
function check_adb(version){
	var tmp_v=version.split('.');
	is_adb=tmp_v[0]=="18";
	is_dijia=tmp_v[0]=="19";
	is_meixin=tmp_v[0]=="34";
	createMenu();
}
function debug_log(str){
	if(DEBUG && data_array.sys=='1')
		console.log(str);
}
function IPC_get(cgi,d2,m,host){
	if(m.length<5 || m.length>8){
		alert("mark length must be 5 tp 8");
		return;
	}
	if(!d2.hasOwnProperty('user')){
		d2['user']=data_array['user'];
		d2['pwd']=data_array['pwd'];
	}
	var thishost=data_array['url'];
	if(host!=undefined){
		thishost=host;
	}
	if(data_array.sys=='1'){
		debug_log(thishost+"/"+cgi+"?"+get_pTS(d2)+"&getjson="+m);
		thishost=thishost.replace("http://","");
		ipcamera_ajax({d:d2,u:cgi,j:m,f:function(s,d,j){
			if(s<0){
				get_resultsbyjava_done1(s,j,d);
			}else{
				get_resultsbyjava_done1(1,j,d);
			}
		},h:thishost,timeout:60000});
	}else{
		location.href=thishost+"/"+cgi+"?"+get_pTS(d2)+"&getjson="+m;
	}
}
//屏蔽回车
$(document).keypress(function(e){
	if(e.keyCode==13){
		e.preventDefault();
		$('input:focus').blur();
	}
});
function get_pTS(pars) {
	var arr = new Array(), key, pars;
	for (key in pars) {
		if (pars.hasOwnProperty(key)) {
			key = encodeURIComponent(key);
			par = encodeURIComponent(pars[key]);
			arr.push(key + "=" + par)
		}
	}
	return arr.join("&")
};
function get_resultsbyjava(err,mark,json){
	if(err==1){
		var get_json=eval("("+decodeURIComponent(json)+")");
		err=get_json['error'];
		if(err==0){
			get_resultsbyjava_done1(1,mark,get_json);
			return;
		}
	}
	get_resultsbyjava_done1(err,mark,{});
}
function get_resultsbyjava_done1(err,mark,json){
	if(mark=='gschl'){
		$.mobile.loading('hide');
		if(err=='1'){
			schedule_data=json[schedule_type];
			show_schedule();
		}else{
			show_message(str_failed);
		}
	}else
	if(mark=='sadbg'){
		if(err=='1'){
			show_message(str_succeed);
		}else{
			if(is_adb){
				show_message(str_adb_alarm_period_err);
			}else{
				show_message(str_failed);
			}
		}
	}else
	if(mark=='sschl'){
		$.mobile.loading('hide');
		if(err=='1'){
			show_message(str_succeed);
			setTimeout(function(){
				$("#date_time_schedule .custom_back").click();
			},500);
		}else{
			show_message(str_failed);
		}
	}else
	if(mark=='cherf'){
		createMenu(err=='0'?'0':json["rf_device"]);
	}else{
		get_resultsbyjava_done(err,mark,json);
	}
}
function web_go(page_go){
	var this_url="";
	var this_url_arr=['user','pwd','ssl','host','port','lng','sys'];
	for(var key in data_array){
		if(in_array(key,this_url_arr)){
			if(this_url==""){
				this_url=page_go+'.html?';
			}else{
				this_url+="&";
			}
			this_url+=key+"="+encodeURIComponent(data_array[key]);
		}
	}
	window.location.href=this_url;
}
function web_out(){
	if(data_array.sys=='0'){
		window.jscalljava.exitWeb();
	}else{
		location.hash = "#exitweb=";
	}
}
function createMenu(){
	$("#web_app_version").html(web_app_version);
	//$("#out_word").html(str_exit);
	var html_nav_bar='<li data-icon="carat-r" data-iconpos="right"><a onclick="web_go(\'alarming\')">'+str_arm_settings+'</a></li>';
		html_nav_bar+='<li data-icon="carat-r" data-iconpos="right"><a onclick="web_go(\'outswitch\')">'+str_outreach_switch_title+'</a></li>';
		html_nav_bar+='<li data-icon="carat-r" data-iconpos="right"><a onclick="web_go(\'record\')">'+str_record_settings+'</a></li>';
		html_nav_bar+='<li data-icon="carat-r" data-iconpos="right"><a onclick="web_go(\'ptz\')">PTZ</a></li>';
		html_nav_bar+='<li data-icon="carat-r" data-iconpos="right"><a onclick="web_go(\'ip\')">'+str_net_settings+'</a></li>';
		html_nav_bar+='<li data-icon="carat-r" data-iconpos="right"><a onclick="web_go(\'wifi\')">'+str_wifi_settings+'</a></li>';
	if(is_dijia){
		html_nav_bar+='<li data-icon="carat-r" data-iconpos="right"><a onclick="web_go(\'dijia_schedule\')">'+str_dijia_schedule_settings+'</a></li>';
	}
	html_nav_bar+='<li data-icon="carat-r" data-iconpos="right"><a onclick="web_out()">'+str_exit+'</a></li>';
	$("#sub_nav").html(html_nav_bar);
	$(".jqm-navmenu-panel ul").listview();
	$(".custom_menu").on("click", function() {
		$("body").find(".ui-panel-dismiss").css("opacity","0").delay(300).animate({opacity:0.1},500,function(){
			$(this).removeAttr("style");
		});
		$(".custom_home").find(".jqm-navmenu-panel:not(.jqm-panel-page-nav)").panel("open");
	});
	if(is_dijia){
		$(".custom_menu").hide();
	}
};

//布防创建
var arm_list = schedule = {};
function createAlarm(){
	show_loadding();
	$("#alarm h1").html(str_arm_settings2);
	$("#alarm").find('.code_box').append('<form class="ui-body ui-body-c ui-corner-all"></form>');
	if(check_rf_device){
		if(!is_adb){
			var html='<div><fieldset data-role="controlgroup" id="alarm_schedule_choose">';
				html+='  <legend>'+str_arm_settings+':</legend>'
				html+='  <input name="alarm_schedule_c" id="alarm_schedule_0" value="0" type="radio">';
				html+='  <label for="alarm_schedule_0">'+str_arm_schedule_enable_0+'</label>';
				html+='  <input name="alarm_schedule_c" id="alarm_schedule_2" value="2" type="radio">';
				html+='  <label for="alarm_schedule_2">'+str_arm_schedule_enable_2+'</label>';
				html+='  <input name="alarm_schedule_c" id="alarm_schedule_1" value="1" type="radio">';
				html+='  <label for="alarm_schedule_1">'+str_arm_schedule_enable_1+'</label>';
				html+='</fieldset></div>';
			$("#alarm").find('.code_box form').append(html);
			$("#alarm_schedule_choose input[id='alarm_schedule_"+data_array.arm_schedule+"']").prop("checked",true);
				$("#alarm").find('#alarm_schedule_choose').parent().append("<a id=\"edit_schedule\" data-role=\"button\" data-icon=\"edit\" data-theme=\"a\" href=\"#date_time_schedule\" data-transition=\"slide\">"+str_edit_schedule+"</a>");
				if(data_array.arm_schedule!=1)$("#alarm #edit_schedule").css("display","none");
				$("#alarm").find('#alarm_schedule_choose').bind("change",function(){
				  if($("#alarm_schedule_choose input[name='alarm_schedule_c']:checked").val()==1){
					 $("#alarm #edit_schedule").css("display","block");
				  }
				  else{
					 $("#alarm #edit_schedule").css("display","none"); 
				  }
				});
		}
	}else{
	  create_switch($("#alarm").find('.code_box form'),str_arm_schedule_enable,'arm_schedule',data_array.arm_schedule,true,function(obj){
			  if(obj.val()==0){
				  $("#alarm #edit_schedule").css("display","none");
			  }else{
				  $("#alarm #edit_schedule").css("display","block");
			  }
		  });
	  $("#alarm #arm_schedule").parent().append("<a id=\"edit_schedule\" data-role=\"button\" data-icon=\"edit\" data-theme=\"a\" href=\"#date_time_schedule\" data-transition=\"slide\">"+str_edit_schedule+"</a>");
	  if(!data_array.arm_schedule)$("#alarm #edit_schedule").css("display","none");
	}
	
	if(is_adb){//安定宝
		$("#alarm").find('.code_box form').append('<div data-role="collapsible" id="alarm_period_c" data-content-theme="c" data-collapsed="false"><h3>'+str_adb_alarm_period_zone+'</h3></div>');
		create_slider($("#alarm").find('.code_box form #alarm_period_c'),str_adb_alarm_period,'alarm_period',data_array.alarm_period,5,600,true);

		$("#alarm").find('.code_box form').append('<div data-role="collapsible" id="beep_on_powerdown_c" data-content-theme="c" data-collapsed="false"><h3>'+str_adb_beep_on_powerdown_zone+'</h3></div>');
		create_switch($("#alarm").find('.code_box form #beep_on_powerdown_c'),str_adb_beep_on_powerdown,'beep_on_powerdown',data_array.beep_on_powerdown,1);
		//内部红外
		$("#alarm").find('.code_box form').append('<div data-role="collapsible" id="IRzone" data-content-theme="c"><h3>'+str_adb_IRzone+'</h3></div>');
		var html='<option value="0">'+str_adb_outreach_arm_0+'</option><option value="1">'+str_adb_outreach_arm_1+'</option>';
			html+='<option value="2">'+str_adb_outreach_arm_2+'</option><option value="3">'+str_adb_outreach_arm_3+'</option>';
			html+='<option value="4">'+str_adb_outreach_arm_4+'</option><option value="5">'+str_adb_outreach_arm_5+'</option>';
		create_select($("#alarm").find('.code_box form #IRzone'),str_adb_trigger_armed,'trigger_armed',html,data_array.trigger_armed,true,1,function(obj){
			if(obj.val()==0){
				$("#alarm #alarm_sound").parent().hide();
				$("#alarm #md_armed").parent().hide();
				if($("#alarm #md_armed").val()==1){
					$("#alarm #md_sensitivity").parent().parent().hide();
				}
			}else{
				$("#alarm #alarm_sound").parent().show();
				$("#alarm #md_armed").parent().show();
				if($("#alarm #md_armed").val()==1){
					$("#alarm #md_sensitivity").parent().parent().show();
				}
			}
		});
		create_switch($("#alarm").find('.code_box form #IRzone'),str_adb_alarm_sound,'alarm_sound',data_array.alarm_sound,data_array.trigger_armed);
		create_switch($("#alarm").find('.code_box form #IRzone'),str_adb_md_enable,'md_armed',data_array.md_armed,data_array.trigger_armed,function(obj){
			if(obj.val()==0){
				$("#alarm #md_sensitivity").parent().parent().hide();
			}else{
				$("#alarm #md_sensitivity").parent().parent().show();
			}
		});
		if(data_array.md_sensitivity<3){
			data_array.md_sensitivity=0;
		}else if(data_array.md_sensitivity<7){
			data_array.md_sensitivity=4;
		}else{
			data_array.md_sensitivity=9;
		}
		var html='<option value="0">'+str_adb_md_sensitivity_1+'</option><option value="4">'+str_adb_md_sensitivity_2+'</option><option value="9">'+str_adb_md_sensitivity_3+'</option>';
		create_select($("#alarm").find('.code_box form #IRzone'),'&nbsp;&nbsp;'+str_sensitivity,'md_sensitivity',html,data_array.md_sensitivity,(data_array.trigger_armed && data_array.md_armed?true:false),1);

		//出入口防区
		$("#alarm").find('.code_box form').append('<div data-role="collapsible" id="zone" data-content-theme="c"><h3>'+str_adb_zone+'</h3></div>');
		create_slider($("#alarm").find('.code_box form #zone'),str_adb_arm_delay,'arm_delay',data_array.arm_delay,0,600,true);
		create_slider($("#alarm").find('.code_box form #zone'),str_adb_alarm_delay,'alarm_delay',data_array.alarm_delay,0,600,true);
	}else{
		for(var i=1;i<4;i++){
			arm_list['mm_win'+i+'_valid'] = data_array['md_win'+i+'_valid'];
			arm_list['mm_win'+i+'_left'] = data_array['md_win'+i+'_left'];
			arm_list['mm_win'+i+'_top'] = data_array['md_win'+i+'_top'];
			arm_list['mm_win'+i+'_right'] = data_array['md_win'+i+'_right'];
			arm_list['mm_win'+i+'_bottom'] = data_array['md_win'+i+'_bottom'];
		}
		//create_switch(div,name,value_name,value,show,fuc,opt_arr)
		create_switch($("#alarm").find('.code_box form'),str_md_enable,'md_armed',data_array.md_armed,true,function(obj){
				if(obj.val()==0){
						$("#alarm #md_sensitivity").parent().parent().hide();
						$("#alarm #edit_region").css("display","none");
				}else{
						$("#alarm #md_sensitivity").parent().parent().show();
						$("#alarm #edit_region").css("display","block");
				}
		});
		$("#alarm #md_armed").parent().append("<a id=\"edit_region\" data-role=\"button\" data-icon=\"edit\" data-theme=\"a\" href=\"#regionset\" data-transition=\"slide\">"+str_edit+"</a>");
		if(!data_array.md_armed)$("#alarm #edit_region").css("display","none");
		create_slider($("#alarm").find('.code_box form'),'&nbsp;&nbsp;'+str_sensitivity,'md_sensitivity',Number(data_array.md_sensitivity)+1,1,10,data_array.md_armed);
		create_switch($("#alarm").find('.code_box form'),str_sd_enable,'sd_armed',data_array.sd_armed,true,function(obj){
				if(obj.val()==0){
					$("#alarm #sd_sensitivity").parent().parent().hide();
				}else{
					$("#alarm #sd_sensitivity").parent().parent().show();
				}
		});

		create_slider($("#alarm").find('.code_box form'),'&nbsp;&nbsp;'+str_sensitivity,'sd_sensitivity',Number(data_array.sd_sensitivity)+1,1,10,data_array.sd_armed);
	}

	if(data_array['rf_device']==1){
		//$("#alarm").find('.code_box form').append('<a href="#" data-role="button" data-icon="gear" data-theme="c" onclick="web_go(\'outreach\')" style="text-align:left;">'+str_outreach_toppic+'</a>');

		$("#alarm").find('.code_box form').append('<div data-role="collapsible" id="link" data-content-theme="c"></div>');
		$("#alarm").find('.code_box form').append('<div data-role="collapsible" id="arm_link" data-content-theme="c"></div>');
		$("#alarm").find('.code_box form').append('<div data-role="collapsible" id="disarm_link" data-content-theme="c"></div>');

		var link_html='<h3>'+str_outreach_link_tit+'</h3>';
			link_html+='<p>'+str_outreach_link_tip+'</p>';
			link_html+='<div class="colls"></div>';
		var arm_link_html='<h3>'+str_outreach_arm_link_tit+'</h3>';
			arm_link_html+='<p>'+str_outreach_arm_link_tip+'</p>';
		var disarm_link_html='<h3>'+str_outreach_disarm_link_tit+'</h3>';
			disarm_link_html+='<p>'+str_outreach_disarm_link_tip+'</p>';
		$("#alarm").find('#link').append(link_html);
		$("#alarm").find('#arm_link').append(arm_link_html);
		$("#alarm").find('#disarm_link').append(disarm_link_html);
		var show_ddd=data_array['rf_devices_list'];
		var siren=true;
		for(var i in show_ddd){
			switch(show_ddd[i].type){
				case 256:
					link_html='<div data-role="collapsible" data-content-theme="c" data-collapsed="false" id="_link_switch_'+show_ddd[i].addr+'"><h3>'+show_ddd[i].name+'</h3>';
					link_html+='</div>';
					$("#alarm").find('#link .colls').append(link_html);
					create_switch($("#alarm").find('#link #_link_switch_'+show_ddd[i].addr),str_outreach_link,'link_switch_'+show_ddd[i].addr,show_ddd[i].link,true,function(obj){
						if($(obj).val()==0){
							$("#alarm").find('#link #link_act'+$(obj).attr('addr')).parent().hide();
						}else{
							$("#alarm").find('#link #link_act'+$(obj).attr('addr')).parent().show();
						}
					});
					$("#alarm").find('#link #link_switch_'+show_ddd[i].addr).attr({"addr":show_ddd[i].addr,"data":"link"});
					create_switch($("#alarm").find('#link #_link_switch_'+show_ddd[i].addr),str_outreach_link_act,'link_act'+show_ddd[i].addr,show_ddd[i].link_switch,show_ddd[i].link,void 0,[str_outreach_link_val_close,str_outreach_link_val_open]);
				break;
				case 257:
					if(siren){
						siren=false;
						link_html='<div data-role="fieldcontain"><fieldset data-role="controlgroup" id="link_html">';
						link_html+='<legend>'+str_outreach_siren+'</legend>';
						link_html+='</fieldset></div>';
						$("#alarm").find('#link').append(link_html);
					}
					link_html='<input name="link_siren" id="link_siren_'+show_ddd[i].addr+'" value="'+show_ddd[i].addr+'" type="checkbox" class="custom"'+(show_ddd[i].link==1?' checked':'')+'>';
					link_html+='<label for="link_siren_'+show_ddd[i].addr+'">'+show_ddd[i].name+'</label>';
					$("#alarm").find('#link #link_html').append(link_html);
				break;
				default:
					continue;
				return;
			}
			if(show_ddd[i].type!=256){
				continue;
			}
			arm_link_html='<div data-role="collapsible" data-content-theme="c" data-collapsed="false" id="_arm_link_switch_'+show_ddd[i].addr+'"><h3>'+show_ddd[i].name+'</h3>';
			arm_link_html+='</div>';
			$("#alarm").find('#arm_link').append(arm_link_html);
			create_switch($("#alarm").find('#arm_link #_arm_link_switch_'+show_ddd[i].addr),str_outreach_arm_link,'arm_link_switch_'+show_ddd[i].addr,show_ddd[i].arm_link,true,function(obj){
				if($(obj).val()==0){
					$("#alarm").find('#arm_link #arm_link_act'+$(obj).attr('addr')).parent().hide();
				}else{
					$("#alarm").find('#arm_link #arm_link_act'+$(obj).attr('addr')).parent().show();
				}
			});
			$("#alarm").find('#arm_link #arm_link_switch_'+show_ddd[i].addr).attr({"addr":show_ddd[i].addr,"data":"arm_link"});
			create_switch($("#alarm").find('#arm_link #_arm_link_switch_'+show_ddd[i].addr),str_outreach_arm_link_act,'arm_link_act'+show_ddd[i].addr,show_ddd[i].arm_link_switch,show_ddd[i].arm_link,void 0,[str_outreach_link_val_close,str_outreach_link_val_open]);

			disarm_link_html='<div data-role="collapsible" data-content-theme="c" data-collapsed="false" id="_disarm_link_switch_'+show_ddd[i].addr+'"><h3>'+show_ddd[i].name+'</h3>';
			$("#alarm").find('#disarm_link').append(disarm_link_html);
			create_switch($("#alarm").find('#disarm_link #_disarm_link_switch_'+show_ddd[i].addr),str_outreach_disarm_link,'disarm_link_switch_'+show_ddd[i].addr,show_ddd[i].disarm_link,true,function(obj){
				if($(obj).val()==0){
					$("#alarm").find('#disarm_link #disarm_link_act'+$(obj).attr('addr')).parent().hide();
				}else{
					$("#alarm").find('#disarm_link #disarm_link_act'+$(obj).attr('addr')).parent().show();
				}
			});
			$("#alarm").find('#disarm_link #disarm_link_switch_'+show_ddd[i].addr).attr({"addr":show_ddd[i].addr,"data":"disarm_link"});
			create_switch($("#alarm").find('#disarm_link #_disarm_link_switch_'+show_ddd[i].addr),str_outreach_disarm_link_act,'disarm_link_act'+show_ddd[i].addr,show_ddd[i].disarm_link_switch,show_ddd[i].disarm_link,void 0,[str_outreach_link_val_close,str_outreach_link_val_open]);
		}
		$("#alarm").find('#link').append('<div style="text-align:center;margin-top:15px;" data-role="controlgroup" data-type="horizontal"  data-mini="true"><a href="#" data-role="button" data-theme="c" onclick="ourswitch_link_set(0);return false;">'+str_set+'</a></div>');
		$("#alarm").find('#arm_link').append('<div style="text-align:center;margin-top:15px;" data-role="controlgroup" data-type="horizontal"  data-mini="true"><a href="#" data-role="button" data-theme="c" onclick="ourswitch_link_set(1);return false;">'+str_set+'</a></div>');
		$("#alarm").find('#disarm_link').append('<div style="text-align:center;margin-top:15px;" data-role="controlgroup" data-type="horizontal"  data-mini="true"><a href="#" data-role="button" data-theme="c" onclick="ourswitch_link_set(2);return false;">'+str_set+'</a></div>');
	}
	if(is_dijia || is_meixin){
		var html='<option value="0">'+str_push_language_0+'</option><option value="1">'+str_push_language_1+'</option>';
		create_select($("#alarm").find('.code_box form'),str_push_language,'push_language',html,data_array.push_language,true,1);

	}
	$("#alarm .code_box").trigger("create");
	$("#alarm .code_box #arm_link").trigger("create");
	hide_loadding();
	$("#alarm .save_btn").unbind('click').bind('click',function(){
		$.mobile.loading('show', {text : '', theme : 'b'});
		if(check_rf_device){
			data_array['arm_schedule']=$("#alarm_schedule_choose input[name='alarm_schedule_c']:checked").val();
		}
		else{
			data_array['arm_schedule']=$("#alarm #arm_schedule").val();
		}
		var d_set={save:1,reinit_alarm:1};
		//var urll_to=data_array.url+"/set_params.cgi?user="+data_array.user+"&pwd="+data_array.pwd+"&save=1&reinit_alarm=1&arm_schedule="+data_array.arm_schedule+"&md_armed="+data_array.md_armed+"&sd_armed="+data_array.sd_armed;
		if(is_adb){
			d_set['reinit_rf']=1;
			d_set['arm_delay']=$("#alarm #arm_delay").val();
			d_set['alarm_delay']=$("#alarm #alarm_delay").val();
			d_set['trigger_armed']=$("#alarm #trigger_armed").val();
			d_set['alarm_sound']=$("#alarm #alarm_sound").val();
			d_set['alarm_period']=$("#alarm #alarm_period").val();
			d_set['beep_on_powerdown']=$("#alarm #beep_on_powerdown").val();
			d_set['md_armed']=$("#alarm #md_armed").val();
			d_set['md_sensitivity']=$("#alarm #md_sensitivity").val();
		}else{
			data_array['arm_schedule']=data_array.arm_schedule;
			data_array['md_armed']=$("#alarm #md_armed").val();
			data_array['sd_armed']=$("#alarm #sd_armed").val();
			d_set['md_armed']=data_array.md_armed;
			d_set['sd_armed']=data_array.sd_armed;
			if($("#alarm #md_armed").val()!=0){
				for(var i=1;i<4;i++){
					var aw=new Array(),ax=new Array(),ay=new Array(),az=new Array(),ah=new Array();
					aw[i]=data_array['md_win'+i+'_valid']=arm_list['mm_win'+i+'_valid'];
					ax[i]=data_array['md_win'+i+'_left']=arm_list['mm_win'+i+'_left'];
					ay[i]=data_array['md_win'+i+'_top']=arm_list['mm_win'+i+'_top'];
					az[i]=data_array['md_win'+i+'_right']=arm_list['mm_win'+i+'_right'];
					ah[i]=data_array['md_win'+i+'_bottom']=arm_list['mm_win'+i+'_bottom'];
					d_set["md_win"+i+"_valid"]=aw[i];
					d_set["md_win"+i+"_left"]=ax[i];
					d_set["md_win"+i+"_top"]=ay[i];
					d_set["md_win"+i+"_right"]=az[i];
					d_set["md_win"+i+"_bottom"]=ah[i];
				}
				data_array['md_sensitivity']=$("#alarm #md_sensitivity").val()-1;
				d_set["md_sensitivity"]=data_array.md_sensitivity;
			}
			if($("#alarm #sd_armed").val()!=0) {
				data_array['sd_sensitivity']=$("#alarm #sd_sensitivity").val()-1;
				d_set["sd_sensitivity"]=data_array.sd_sensitivity;
			}
		}
		if(is_dijia || is_meixin){
			d_set["push_language"]=$("#alarm #push_language").val();
		}
		IPC_get("set_params.cgi",d_set,'sadbg');
	});
}
function ourswitch_link_set(mod){
	var set_data=[];
	switch(mod){
		case 0:
			$("#alarm").find('#link select[data="link"]').each(function(){
				set_data.push({addr:$(this).attr("addr"),link:$(this).val(),link_switch:$("#alarm #link #link_act"+$(this).attr("addr")).val()});
			});
			$("#alarm").find('#link input[name="link_siren"]').each(function(){
				if($(this).attr("checked")){
					set_data.push({addr:$(this).val(),link:1});
				}else{
					set_data.push({addr:$(this).val(),link:0});
				}
			});
		break;
		case 1:
			$("#alarm").find('#arm_link select[data="arm_link"]').each(function(){
				set_data.push({addr:$(this).attr("addr"),arm_link:$(this).val(),arm_link_switch:$("#alarm #arm_link #arm_link_act"+$(this).attr("addr")).val()});
			});
		break;
		case 2:
			$("#alarm").find('#disarm_link select[data="disarm_link"]').each(function(){
				set_data.push({addr:$(this).attr("addr"),disarm_link:$(this).val(),disarm_link_switch:$("#alarm #disarm_link #disarm_link_act"+$(this).attr("addr")).val()});
			});
		break;
		default:
		return;
	}
	if(set_data.length==0){
		show_message(str_outreach_link_set_error);
		return;
	}
	$.mobile.loading('show', {text : '', theme : 'b'});
	var set_arr=Array();
	for(var i=0;i<set_data.length;i++){
		arr = new Array();
		for (key in set_data[i]) {
			if (set_data[i].hasOwnProperty(key)) {
				arr.push('"'+key + '":' + set_data[i][key])
			}
		}
		set_arr.push("{"+(arr.join(","))+"}");
	}
	debug_log('['+set_arr.join(",")+']');
	IPC_get("edit_rf_devices.cgi",{rf_devices:'['+set_arr.join(",")+']'},'alink');
}

//区域创建
var ax1,ay1,ax2,ay2,bx1,by1,bx2,by2,cx1,cy1,cx2,cy2,way=1;
var ox1,oy1,ox2,oy2,wx1,wy1,wx2,wy2,tx1,ty1,tx2,ty2;
$(document).on('pagebeforecreate', '#regionset', function(){
	$("#regionset").on('pagebeforeshow', function(){
		var html_r="";
		html_r+="        	<div id=\"screen\">";
		html_r+="                <div id=\"screen_1\"></div>";
		html_r+="                <div id=\"screen_2\"></div>";
		html_r+="                <div id=\"screen_3\"></div>";
		html_r+="            </div>";
		html_r+="            <div id=\"regin_con_img\">";
		html_r+="                <img id=\"snapshot_img\" name=\"snapshot_img\" alt=\"\" title=\"\" src=\"css/images/defout.png\"  />";
		html_r+="            </div>";
		html_r+="            <div id=\"regin_con\">";
		html_r+="                <div style=\" text-align:center;\" data-role=\"controlgroup\" data-type=\"horizontal\">";
		html_r+="                    <a title=\"1\" class=\"choose_way aselected1\" data-role=\"button\" data-theme=\"c\">"+str_alarm_place1+"</a>";
		html_r+="                    <a title=\"2\" class=\"choose_way\" data-role=\"button\" data-theme=\"c\">"+str_alarm_place2+"</a>";
		html_r+="                    <a title=\"3\" class=\"choose_way\" data-role=\"button\" data-theme=\"c\">"+str_alarm_place3+"</a>";
		html_r+="                 </div>";
		html_r+="                 <div style=\" text-align:center;\" data-role=\"controlgroup\" data-type=\"horizontal\">";
		html_r+="                    <a id=\"screen_cleen\" data-role=\"button\" data-theme=\"c\">"+str_remove+"</a>";
		html_r+="                    <a id=\"screen_select_all\" data-role=\"button\" data-theme=\"c\">"+str_selectall+"</a>";
		html_r+="                 </div>";
		html_r+="            </div>";
		html_r+="            <p class=\"drow_attetion\">"+drow_attetion+"</p>";
		$("#regionset").find('.code_box').html(html_r);

		$("#regionset .code_box").trigger("create");
		regionset_load();
		$("#regionset .save_btn").unbind('click').bind('click',function(){
			if(ox2>0 && oy2>0){arm_list.mm_win1_valid=1;}else{arm_list.mm_win1_valid=0;}
			if(wx2>0 && wy2>0){arm_list.mm_win2_valid=1;}else{arm_list.mm_win2_valid=0;}
			if(tx2>0 && ty2>0){arm_list.mm_win3_valid=1;}else{arm_list.mm_win3_valid=0;}
			arm_list.mm_win1_left=ox1;
			arm_list.mm_win1_top=oy1;
			arm_list.mm_win1_right=ox2;
			arm_list.mm_win1_bottom=oy2;
			arm_list.mm_win2_left=wx1;
			arm_list.mm_win2_top=wy1;
			arm_list.mm_win2_right=wx2;
			arm_list.mm_win2_bottom=wy2;
			arm_list.mm_win3_left=tx1;
			arm_list.mm_win3_top=ty1;
			arm_list.mm_win3_right=tx2;
			arm_list.mm_win3_bottom=ty2;
			$("#regionset .custom_back").click();
		});
				
	});
});
function regionset_load(){
	var w=$("#regionset").width()-30;
	var h=w*3/4;
	way=1;
	$("#snapshot_img").css({width:w+"px",height:h+"px"});
	$("#screen").css({height:h+"px",width:w+"px"});
	$("#regin_con_img").css({height:h+"px",width:w+"px"});
	$("#screen_1,#screen_2,#screen_3").empty();
	$("#snapshot_img").attr("src",data_array.url+"/snapshot.cgi?user="+data_array.user+"&pwd="+data_array.pwd);
	$("#screen_1,#screen_2,#screen_3").show();
	ax1=arm_list.mm_win1_left;
	ay1=arm_list.mm_win1_top;
	ax2=arm_list.mm_win1_right;
	ay2=arm_list.mm_win1_bottom;
	bx1=arm_list.mm_win2_left;
	by1=arm_list.mm_win2_top;
	bx2=arm_list.mm_win2_right;
	by2=arm_list.mm_win2_bottom;
	cx1=arm_list.mm_win3_left;
	cy1=arm_list.mm_win3_top;
	cx2=arm_list.mm_win3_right;
	cy2=arm_list.mm_win3_bottom;
	
	ox1=arm_list.mm_win1_left;
	oy1=arm_list.mm_win1_top;
	ox2=arm_list.mm_win1_right;
	oy2=arm_list.mm_win1_bottom;
	wx1=arm_list.mm_win2_left;
	wy1=arm_list.mm_win2_top;
	wx2=arm_list.mm_win2_right;
	wy2=arm_list.mm_win2_bottom;
	tx1=arm_list.mm_win3_left;
	ty1=arm_list.mm_win3_top;
	tx2=arm_list.mm_win3_right;
	ty2=arm_list.mm_win3_bottom;
	to1=(ay1/100)*h;
	le1=(ax1/100)*w;
	ww1=(ax2-ax1)/100*w;
	hh1=(ay2-ay1)/100*h;
	int1=to1+hh1;
	inl1=w-(le1+ww1);
	to2=(by1/100)*h;
	le2=(bx1/100)*w;
	ww2=(bx2-bx1)/100*w;
	hh2=(by2-by1)/100*h;
	int2=to2+hh2;
	inl2=w-(le2+ww2);
	to3=(cy1/100)*h;
	le3=(cx1/100)*w;
	ww3=(cx2-cx1)/100*w;
	hh3=(cy2-cy1)/100*h;
	int3=to3+hh3;
	inl3=w-(le3+ww3);
	if(ax1!=0 || ay1!=0 || ax2!=0 || ay2!=0){
	$("#screen_1").append('<div class="selected1" style="left:'+le1+'px;top:'+to1+'px;width:'+ww1+'px;height:'+hh1+'px;"></div><span class="selectedinfor1" style="right:'+inl1+'px;top:'+int1+'px;">'+ax1+'%'+ay1+'%--'+ax2+'%'+ay2+'%</span>')
	}
	if(bx1!=0 || by1!=0 || bx2!=0 || by2!=0){
	$("#screen_2").append('<div class="selected2" style="left:'+le2+'px;top:'+to2+'px;width:'+ww2+'px;height:'+hh2+'px;"></div><span class="selectedinfor2" style="right:'+inl2+'px;top:'+int2+'px;">'+bx1+'%'+by1+'%--'+bx2+'%'+by2+'%</span>')
	}
	if(cx1!=0 || cy1!=0 || cx2!=0 || cy2!=0){
	$("#screen_3").append('<div class="selected3" style="left:'+le3+'px;top:'+to3+'px;width:'+ww3+'px;height:'+hh3+'px;"></div><span class="selectedinfor3" style="right:'+inl3+'px;top:'+int3+'px;">'+cx1+'%'+cy1+'%--'+cx2+'%'+cy2+'%</span>')
	}

	$("#regin_con").find("a.choose_way").click(function(){
		way = $(this).attr("title");
		$("#screen_1,#screen_2,#screen_3").css("z-index","999");
		$("#screen_"+way).show();
		$("#screen_"+way).css("z-index","1000");
		$("#regin_con a.choose_way:eq(0)").removeClass("aselected1");
		$("#regin_con a.choose_way:eq(1)").removeClass("aselected2");
		$("#regin_con a.choose_way:eq(2)").removeClass("aselected3");
		$(this).addClass("aselected"+way);
	});

	$("#screen").unbind('click').bind('click',function(e){
		var tt = $("#screen_"+way).find("div.selected"+way);
		var kk = $("#screen_"+way).find("span.selectedinfor"+way);
		var xx = e.pageX-15;
		var yy = e.pageY-57;
		var ww = w-xx;
		var hh = h-yy;
		var zz = hh-18;
		var top,left,right,bottom;
		if(tt.length==1 && kk.length==1){
			tt.remove();
			kk.remove();
			$("#screen_"+way).append('<div class="selected'+way+'" style="left:'+xx+'px;top:'+yy+'px;width:5px;height:5px;opacity:1;"></div>');
		}
		
		else if(tt.length==1 && kk.length!=1){
			var top1 =tt.position().top;
			var left1 =tt.position().left;
			var right1 =xx;
			var bottom1 =yy;
			if(top1>bottom1 && left1<right1){
				top=yy;
				left=left1;
				right=xx;
				bottom=top1;
				zz = h-top1-18
				wn = xx-left1;
				hn = top1-yy;
				potop=yy;
				poleft=left1;
			}
			else if(top1>bottom1 && left1>right1){
				top=yy;
				left=xx;
				right=left1;
				bottom=top1;
				ww = w-left1;
				zz = h-top1-18;
				wn = left1-xx;
				hn = top1-yy;
				potop=yy;
				poleft=xx;
			}
			else if(top1<bottom1 && left1>right1){
				top=top1;
				left=xx;
				right=left1;
				bottom=yy;
				ww = w-left1;
				wn = left1-xx;
				hn = yy-top1;
				potop=top1;
				poleft=xx;
			}
			else{
				top=top1;
				left=left1;
				right=xx;
				bottom=yy;
				wn = xx-left1;
				hn = yy-top1;
				potop=top1;
				poleft=left1;
			}
			tt.animate({height:hn+'px',width:wn+'px',top:potop+'px',left:poleft+'px',opacity:'0.3'});
			if(way==1){
					ox1=parseInt((Math.round((left/w)*100)/100)*100);
					oy1=parseInt((Math.round((top/h)*100)/100)*100);
					ox2=parseInt((Math.round((right/w)*100)/100)*100);
					oy2=parseInt((Math.round((bottom/h)*100)/100)*100);

				$("#screen_"+way).append('<span class="selectedinfor'+way+'" style="right:'+ww+'px;bottom:'+zz+'px;">'+ox1+'%'+oy1+'%--'+ox2+'%'+oy2+'%</span>');
			}
			else if(way==2){
					wx1=parseInt((Math.round((left/w)*100)/100)*100);
					wy1=parseInt((Math.round((top/h)*100)/100)*100);
					wx2=parseInt((Math.round((right/w)*100)/100)*100);
					wy2=parseInt((Math.round((bottom/h)*100)/100)*100);

				$("#screen_"+way).append('<span class="selectedinfor'+way+'" style="right:'+ww+'px;bottom:'+zz+'px;">'+wx1+'%'+wy1+'%--'+wx2+'%'+wy2+'%</span>');
			}
			else{
					tx1=parseInt((Math.round((left/w)*100)/100)*100);
					ty1=parseInt((Math.round((top/h)*100)/100)*100);
					tx2=parseInt((Math.round((right/w)*100)/100)*100);
					ty2=parseInt((Math.round((bottom/h)*100)/100)*100);

				$("#screen_"+way).append('<span class="selectedinfor'+way+'" style="right:'+ww+'px;bottom:'+zz+'px;">'+tx1+'%'+ty1+'%--'+cx2+'%'+ty2+'%</span>');
			}
		}
		else{
			$("#screen_"+way).append('<div class="selected'+way+'" style="left:'+xx+'px;top:'+yy+'px;width:5px;height:5px;opacity:1;"></div>');
		}
	});
	
	$("#screen_cleen").click(function(){
		$("#screen_"+way).html("");
		if(way==1){
			ox1=0,oy1=0,ox2=0,oy2=0;
		}
		else if(way==2){
			wx1=0,wy1=0,wx2=0,wy2=0;
		}
		else{
			tx1=0,ty1=0,tx2=0,ty2=0;
		}
	});
	$("#screen_select_all").click(function(){
		$("#screen_"+way).html('<div style="left:0px;top:0px; width:'+w+'px; height:'+h+'px; opacity: 0.3;" class="selected'+way+'"></div><span style="right:0px;bottom:0px;" class="selectedinfor'+way+'">00%00%--100%100%</span>');
		if(way==1){
			ox1=0,oy1=0,ox2=100,oy2=100;
		}
		else if(way==2){
			wx1=0,wy1=0,wx2=100,wy2=100;
		}
		else{
			tx1=0,ty1=0,tx2=100,ty2=100;
		}
	});
}

//外联设备
function get_rf_devices_list(){
	IPC_get("get_params.cgi",{rf_devices_list:'',rf_device_addr:''},'getcg');
}
var show_ddd=[];
var outreach_str=[str_outreach_remoteControl,str_outreach_alarm,str_outreach_switch,str_outreach_siren,str_adb_outreach_0,str_adb_outreach_1,str_adb_outreach_2,str_adb_outreach_3,str_adb_outreach_4,str_adb_outreach_5,str_adb_outreach_6,str_adb_outreach_7,str_adb_outreach_8];
var outreach_str_id=['RemoteControl','Alarm','Switch','Siren','adb_0','adb_1','adb_2','adb_3','adb_4','adb_5','adb_6','adb_7','adb_8'];
var switch_nums=0;
function createOutswitch(){
	show_loadding();
	$("#outswitch h1").html(str_outreach_switch_title);
	show_ddd=data_array.rf_devices_list;
	var style_id,style_type;
	$("#outswitch").find('.code_box').html("");
	for(var i in show_ddd){
		switch(show_ddd[i].type){
			case 0:
				if(is_adb){
					style_id=outreach_str_id[4];
					style_type=outreach_str[4];
				}else{
					style_id=outreach_str_id[0];
					style_type=outreach_str[0];
				}
			break;
			case 1:
				if(is_adb){
					style_id=outreach_str_id[5];
					style_type=outreach_str[5];
				}else{
					style_id=outreach_str_id[1];
					style_type=outreach_str[1];
				}
			break;
			case 2:
				style_id=outreach_str_id[6];
				style_type=outreach_str[6];
			break;
			case 3:
				style_id=outreach_str_id[7];
				style_type=outreach_str[7];
			break;
			case 4:
				style_id=outreach_str_id[8];
				style_type=outreach_str[8];
			break;
			case 5:
				style_id=outreach_str_id[9];
				style_type=outreach_str[9];
			break;
			case 6:
				style_id=outreach_str_id[10];
				style_type=outreach_str[10];
			break;
			case 7:
				style_id=outreach_str_id[11];
				style_type=outreach_str[11];
			break;
			case 8:
				style_id=outreach_str_id[12];
				style_type=outreach_str[12];
			break;
			case 256:
				style_id=outreach_str_id[2];
				style_type=outreach_str[2];
				switch_nums++;
			break;
			case 257:
				style_id=outreach_str_id[2];
				style_type=outreach_str[3];
				switch_nums++;
			break;
			default:
				continue;
			break;
		}
		$("#outswitch").find('.code_box').append('<div data-role="collapsible" data-collapsed-icon="arrow-d" data-expanded-icon="arrow-u" id=\"'+style_id+'_'+i+'\" data="'+i+'" data-content-theme="c"><h3><span class="outreach_type_font" style="float:left">'+style_type+'</span><span class="for_name" style="color:#777;">'+show_ddd[i].name+'</span></h3>');
		$("#outswitch").find("#"+style_id+"_"+i).append('<div id=\"'+style_id+'_more'+i+'\" style="padding:5px"></div>');
		 
		if(show_ddd[i].type==256 || show_ddd[i].type==257){
			create_switch($("#outswitch").find('#'+style_id+'_more'+i),str_outreach_switch_act,'_'+style_id+'switch_control'+i,show_ddd[i].switch,true,function(obj){
				if($(obj).val()==0){
					outreach_switch_change(0,Number($(obj).attr("addr")));
				}else{
					outreach_switch_change(1,Number($(obj).attr("addr")));
				}
			});
			$('#_'+style_id+'switch_control'+i).attr("addr",show_ddd[i].addr);
		}else{
			if(is_adb){
				if(show_ddd[i].type!=0 && show_ddd[i].type!=3){
					var html='<div><fieldset data-role="controlgroup" id="adb_alarm_choose_'+i+'">';
						html+='  <legend>'+str_adb_settings+':</legend>'
						html+='  <input name="adb_alarm_c_'+i+'" id="adb_alarm_0_'+i+'" value="0" type="radio">';
						html+='  <label for="adb_alarm_0_'+i+'">'+str_adb_outreach_arm_0+'</label>';
						html+='  <input name="adb_alarm_c_'+i+'" id="adb_alarm_1_'+i+'" value="1" type="radio">';
						html+='  <label for="adb_alarm_1_'+i+'">'+str_adb_outreach_arm_1+'</label>';
						html+='  <input name="adb_alarm_c_'+i+'" id="adb_alarm_2_'+i+'" value="2" type="radio">';
						html+='  <label for="adb_alarm_2_'+i+'">'+str_adb_outreach_arm_2+'</label>';
						html+='  <input name="adb_alarm_c_'+i+'" id="adb_alarm_3_'+i+'" value="3" type="radio">';
						html+='  <label for="adb_alarm_3_'+i+'">'+str_adb_outreach_arm_3+'</label>';
						html+='  <input name="adb_alarm_c_'+i+'" id="adb_alarm_4_'+i+'" value="4" type="radio">';
						html+='  <label for="adb_alarm_4_'+i+'">'+str_adb_outreach_arm_4+'</label>';
						html+='  <input name="adb_alarm_c_'+i+'" id="adb_alarm_5_'+i+'" value="5" type="radio">';
						html+='  <label for="adb_alarm_5_'+i+'">'+str_adb_outreach_arm_5+'</label>';
						html+='</fieldset></div>';
					//$("#alarm").find('.code_box form').append(html);
					$("#outswitch").find('#'+style_id+'_more'+i).append(html);
					$("#outswitch").find('#'+style_id+'_more'+i+" input[id='adb_alarm_"+show_ddd[i].armed+"_"+i+"']").prop("checked",true);
					$("#outswitch").find('#adb_alarm_choose_'+i).attr({"addr":show_ddd[i].addr,"_index":i}).unbind("change").bind("change",function(obj){
						outreach_arm_change($(this).find("input[name='adb_alarm_c_"+$(this).attr('_index')+"']:checked").val(),Number($(this).attr("addr")));
					});
				}
				if(show_ddd[i].type!=3){
					create_switch($("#outswitch").find('#'+style_id+'_more'+i),str_adb_alarm_sound,'beeps_'+style_id+'arm_beep'+i,show_ddd[i].beep,1,function(obj){
						outreach_beep_change($(obj).val(),Number($(obj).attr("addr")));
					});
					$('#beeps_'+style_id+'arm_beep'+i).attr({"addr":show_ddd[i].addr,"_index":i});
				}
			}else{
				if(show_ddd[i].type==1){
					create_switch($("#outswitch").find('#'+style_id+'_more'+i),str_outreach_arm,'_'+style_id+'arm_control'+i,show_ddd[i].armed==2?1:show_ddd[i].armed,true,function(obj){
						outreach_arm_change($(obj).val(),Number($(obj).attr("addr")));
						if($(obj).val()==0){
							$("#outswitch_alarm_choose_"+$(obj).attr("_index")).hide();
						}else{
							$("#outswitch_alarm_choose_"+$(obj).attr("_index")).show();
						}
					});
					$('#_'+style_id+'arm_control'+i).attr({"addr":show_ddd[i].addr,"_index":i});
					var html='<div data-role="fieldcontain" id="outswitch_alarm_choose_'+i+'" data="'+show_ddd[i].addr+'"><fieldset data-role="controlgroup">';
						html+='  <legend></legend>'
						html+='  <input name="outswitch_alarm_c" id="outswitch_alarm_'+i+'_2" value="2" type="checkbox" class="custom">';
						html+='  <label for="outswitch_alarm_'+i+'_2">'+str_outreach_arm_open+'</label>';
						html+='</fieldset></div>';
					$("#outswitch").find('#'+style_id+'_more'+i).append(html);
					if(show_ddd[i].armed==0){
						$("#outswitch_alarm_choose_"+i).hide();
					}else if(show_ddd[i].armed==2){
						$("#outswitch_alarm_choose_"+i+" input[id='outswitch_alarm_"+i+"_"+show_ddd[i].armed+"']").prop("checked",true);
					}
					$("#outswitch").find('#outswitch_alarm_choose_'+i).attr({"addr":show_ddd[i].addr,"_index":i}).unbind("change").bind("change",function(){
						if($(this).find("input[name='outswitch_alarm_c']:checked").val()==2){
							outreach_arm_change(2,Number($(this).attr("addr")));
						}else{
							outreach_arm_change(1,Number($(this).attr("addr")));
						}
					});
				}
			}
		}
		$("#outswitch").find('#'+style_id+'_more'+i).append('<div style="text-align:center;margin-top:15px;" data-role="controlgroup" data-type="horizontal"  data-mini="true"><a href="#" data-role="button"  data-theme="c" onclick="device_edit('+show_ddd[i].addr+',this);return false;">'+str_edit+'</a><a href="#" data-role="button" data-theme="c" onclick="outreach_del('+show_ddd[i].addr+',this,'+show_ddd[i].type+');return false;">'+str_remove+'</a></div>');
	}
	create_slider($("#outswitch").find('.code_box'),str_rf_device_addr,'rf_device_addr',data_array.rf_device_addr,0,65535,true);
	$("#outswitch .code_box").append('<a href="#" data-role="button" data-inline="true" data-theme="e" onclick="rf_device_addr_save(0);return false;">'+str_set+'</a>');
	$("#outswitch .code_box").trigger("create");
	hide_loadding();
	$("#outswitch .save_btn").unbind('click').bind('click',function(){
		$.mobile.changePage("#outswitch_add",{ transition: "slide" });
	});
}
$(document).on('pagebeforecreate', '#outswitch_add', function(){
	$("#outswitch_add").on('pagebeforeshow', function(){
		$("#outswitch_add .custom_header h1").html(str_outswitch_add);
		var html='<option value="-1">'+str_no_style+'</option>';
		if(is_adb){
			html+='<option value="0">'+str_adb_outreach_0+'</option><option value="1">'+str_adb_outreach_1+'</option>';
			html+='<option value="2">'+str_adb_outreach_2+'</option><option value="3">'+str_adb_outreach_3+'</option>';
			html+='<option value="4">'+str_adb_outreach_4+'</option><option value="5">'+str_adb_outreach_5+'</option>';
			html+='<option value="6">'+str_adb_outreach_6+'</option><option value="7">'+str_adb_outreach_7+'</option>';
			html+='<option value="8">'+str_adb_outreach_8+'</option>';
		}else{
			html+='<option value="0">'+str_outreach_remoteControl+'</option><option value="1">'+str_outreach_alarm+'</option>';
		}
		html+='<option value="256">'+str_outreach_switch+'</option>';
		html+='<option value="257">'+str_outreach_siren+'</option>';
		$("#outswitch_add").find('.code_box').html("");
		$("#outswitch_add").find('.code_box').append('<form class="ui-body ui-body-c ui-corner-all"></form>');
		create_select($("#outswitch_add").find('.code_box form'),str_outreach_type,'add_outreach_type',html,-1,true);
		create_value($("#outswitch_add").find('.code_box form'),str_outreach_name_edit,'add_outreach_name','',true);
		$("#outswitch_add").trigger("create");
		$("#outswitch_add .save_btn").unbind('click').bind('click',function(){
			if($("#add_outreach_name").val()==""){
			  show_message(str_outreach_no_name);
			  return false;
			}
			if($("#add_outreach_type").val()==256 || $("#add_outreach_type").val()==257){
			  if(switch_nums>=16){
				  show_message(str_outreach_type_have);
				  return false;
			  }
				$("#show_tip .message").html(str_outreach_study+"<br/>"+str_outreach_study_switch);
				$("#show_tip #true").show().unbind('click').bind('click',function(){
					$("#show_tip_bg,#show_tip").hide();
					IPC_get("confirm_rf_switch_added.cgi",{},'addes');
				});
			}else{
				$("#show_tip .message").html(str_outreach_study);
				$("#show_tip #true").hide();
			}
			$("#show_tip_bg,#show_tip").show();
			$("#show_tip #flase").click(function(){
				$("#show_tip_bg,#show_tip").hide();
				IPC_get("cancel_add_rf_device.cgi",{},'addes');
			});
			var d3={};
			d3['name']=$("#add_outreach_name").val();
			d3['type']=$("#add_outreach_type").val();
			IPC_get("add_rf_device.cgi",d3,'addde');
		});
	})
});
function rf_device_addr_save(mode){
	if(mode==0){
		$("#show_tip .message").text(str_rf_device_addr_tip);
		$("#show_tip_bg,#show_tip").show();
		$("#show_tip #true").unbind('click').bind('click',function(){
			$("#show_tip_bg,#show_tip").hide();
			rf_device_addr_save(1);
		});
		
		$("#show_tip #flase").click(function(){
			$("#show_tip_bg,#show_tip").hide();
		});
		return;
	}
	$.mobile.loading('show', {text : '', theme : 'b'});
	var rf_device_addr=$("#outswitch #rf_device_addr").val();
	IPC_get("set_params.cgi",{rf_device_addr:$("#outswitch #rf_device_addr").val(),save:1,reinit_rf:1},'rfadd');
}

var edit_addr,obj_change,obj_name;
function device_edit(addr,obj){
	obj_change=$(obj);
	edit_addr=addr;
	obj_name=$(obj).parent().parent().parent().parent().prev("h3").find("span.for_name").html();
	$(obj).removeClass("ui-btn-active");
	$.mobile.changePage("#outreach_edit",{ transition: "slide" });
}
$(document).on('pagebeforecreate', '#outreach_edit', function(){
	$("#outreach_edit").on('pagebeforeshow', function(){
		$("#outreach_edit").find('.code_box').html("");
		$("#outreach_edit").find('.code_box').append('<form class="ui-body ui-body-c ui-corner-all"></form>');
		create_value($("#outreach_edit").find('.code_box form'),str_alias,'outreach_name_edit',obj_name,true);
		$("#outreach_edit").trigger("create");
		$("#outreach_edit .save_btn").unbind('click').bind('click',function(){
			$.mobile.loading('show', {text : '', theme : 'b'});
			var d3={};
		   d3['addr']=edit_addr;
		   name_new=$("#outreach_name_edit").val()==''?str_outreach_no_name:$("#outreach_name_edit").val();
		   d3['name']=name_new;
		   IPC_get("edit_rf_device.cgi",d3,'editr');
		});
	})
});

var title_mark,title_val;
function outreach_arm_change(style,addr){
   title_mark=addr;
   title_val=style;
   IPC_get("edit_rf_device.cgi",{addr:addr,armed:style},'editt');
}

function outreach_beep_change(style,addr){
   title_mark=addr;
   title_val=style;
   IPC_get("edit_rf_device.cgi",{addr:addr,beep:style},'editt');
}

function outreach_link_change(style,addr){
   title_mark=addr;
   title_val=style;
   IPC_get("edit_rf_device.cgi",{addr:addr,link:style},'editt');
}
function outreach_switch_change(style,addr){
   title_mark=addr;
   title_val=style;
   IPC_get("edit_rf_device.cgi",{addr:addr,switch:style},'editt');
}
var con_style;
function outreach_del(addr,obj,style){
   obj_change=$(obj);
   con_style=style;
   IPC_get("remove_rf_device.cgi",{addr:addr},'remov');
}

//ip创建
function createIpset(){
	show_loadding();
	$("#ip h1").html(str_net_settings);
	$("#ip").find('.code_box').append('<form class="ui-body ui-body-c ui-corner-all"></form>');
	create_switch($("#ip").find('.code_box form'),str_dhcp,'dhcp_inp',data_array.dhcp,true,function(obj){
			if(obj.val()==0){
				$("#ip #ip_inp").parent().parent().show();
				$("#ip #mask_inp").parent().parent().show();
				$("#ip #gateway_inp").parent().parent().show();
				$("#ip #dns1_inp").parent().parent().show();
				$("#ip #dns2_inp").parent().parent().show();
			}else{
				$("#ip #ip_inp").parent().parent().hide();
				$("#ip #mask_inp").parent().parent().hide();
				$("#ip #gateway_inp").parent().parent().hide();
				$("#ip #dns1_inp").parent().parent().hide();
				$("#ip #dns2_inp").parent().parent().hide();
			}
		});
	create_value($("#ip").find('.code_box form'),str_ip,'ip_inp',data_array.ip,data_array.dhcp==1?false:true);
	create_value($("#ip").find('.code_box form'),str_mask,'mask_inp',data_array.mask,data_array.dhcp==1?false:true);
	create_value($("#ip").find('.code_box form'),str_gateway,'gateway_inp',data_array.gateway,data_array.dhcp==1?false:true);
	create_value($("#ip").find('.code_box form'),str_dns1,'dns1_inp',data_array.dns1,data_array.dhcp==1?false:true);
	create_value($("#ip").find('.code_box form'),str_dns2,'dns2_inp',data_array.dns2,data_array.dhcp==1?false:true);
	$("#ip .code_box").trigger("create");
	hide_loadding();
	$("#ip .save_btn").unbind('click').bind('click',function(){
		 $.mobile.loading('show', {text : '', theme : 'b'});
		 data_array['dhcp']=$("#ip #dhcp_inp").val();
		if(data_array['dhcp']==0){
			data_array['mask']=$("#ip #mask_inp").val();
			data_array['gateway']=$("#ip #gateway_inp").val();
			data_array['dns1']=$("#ip #dns1_inp").val();
			data_array['dns2']=$("#ip #dns2_inp").val();
		}
		var d_set={save:1,reinit_network:1,dhcp:data_array.dhcp};
		if(data_array['dhcp']==0){
			d_set['ip']=$("#ip #ip_inp").val();
			d_set['mask']=data_array.mask;
			d_set['gateway']=data_array.gateway;
			d_set['dns1']=data_array.dns1;
			d_set['dns2']=data_array.dns2;
		}
		IPC_get("set_params.cgi",d_set,'setcg');
	});
}
//录像创建
var record_data = {'1':{bitrate:128,fps:15,gop:150},'2':{bitrate:256,fps:25,gop:250},'3':{bitrate:512,fps:30,gop:300}};
function createRecord(){
	show_loadding();
	$("#recordd h1").html(str_record_settings);
	$("#recordd").find('.code_box').append('<form class="ui-body ui-body-c ui-corner-all"></form>');
	$("#recordd .code_box form").append("<a id=\"edit_record\" data-role=\"button\" data-icon=\"edit\" data-theme=\"a\" href=\"#date_time_schedule\" data-transition=\"slide\">"+str_edit_schedule+"</a>");
	var sm;
	for(var i in record_data){
	  if(record_data[i].bitrate==data_array.stream3_bitrate && record_data[i].fps==data_array.stream3_fps && record_data[i].gop==data_array.stream3_gop){
		sm=i
		break;
	  }
	}
	create_select($("#recordd").find('.code_box form'),str_record_streem_model,'record_streem_model','<option value="1">'+str_record_streem_model_1+'</option><option value="2">'+str_record_streem_model_2+'</option><option value="3">'+str_record_streem_model_3+'</option>',sm,true);
	$("#recordd .code_box").trigger("create");
	hide_loadding();
	$("#recordd .save_btn").unbind('click').bind('click',function(){
		$.mobile.loading('show', {text : '', theme : 'b'});
		
		var key=$("#record_streem_model").val();
		data_array['stream3_bitrate']=record_data[key].bitrate;
		data_array['stream3_fps']=record_data[key].fps;
		data_array['stream3_gop']=record_data[key].gop;
		//show_message(str_save_seting);
		var json_record='',zoom_array='';
		for(var i in data_array.record_schedule_list){
			if(i!=0){
				zoom_array+=',';
			}
			zoom_array+='{"start":'+data_array.record_schedule_list[i].start+',"end":'+data_array.record_schedule_list[i].end+',"day":'+data_array.record_schedule_list[i].day+'}';
		}
		json_record='['+zoom_array+']';
		//location.href=data_array.url+"/set_params.cgi?user="+data_array.user+"&pwd="+data_array.pwd+"&save=1&reinit_record=1&stream3_bitrate="+record_data[key].bitrate+"&stream3_fps="+record_data[key].fps+"&stream3_gop="+record_data[key].gop+"&record_schedule_list="+json_record+"&getjson=setcg";
		var d_set={save:1,reinit_record:1};
		d_set['stream3_bitrate']=record_data[key].bitrate;
		d_set['stream3_fps']=record_data[key].fps;
		d_set['stream3_gop']=record_data[key].gop;
		//d_set['record_schedule_list']=json_record;
		IPC_get("set_params.cgi",d_set,'setcg');
	});
}


//ptz创建
function createPtz(){
	show_loadding();
	$("#ptz_general h1").html("PTZ");
	$("#ptz_general").find('.code_box').append('<form class="ui-body ui-body-c ui-corner-all"></form>');
	create_select($("#ptz_general").find('.code_box form'),str_patrol_schedule_type,'patrol_schedule','<option value="0">'+str_none+'</option><option value="1">'+str_v_patrol+'</option><option value="2">'+str_h_patrol+'</option><option value="3">'+str_v_patrol + ' + ' + str_h_patrol+'</option><option value="4">'+str_t_patrol+'</option>',data_array.patrol_schedule,true,false,function(obj){
		if(obj.val()==0){
			$("#ptz_general #edit_schedule3").css("display","none");
		}
		else{
			$("#ptz_general #edit_schedule3").show();
		}
	});
	
	$("#ptz_general .code_box form").append("<a id=\"edit_schedule3\" data-role=\"button\" data-icon=\"edit\" data-theme=\"a\"  href=\"#date_time_schedule\" data-transition=\"slide\">"+str_edit_schedule+"</a>");
	if(data_array.patrol_schedule==0)$("#ptz_general #edit_schedule3").css("display","none");
		
	$("#ptz_general .code_box").trigger("create");
	hide_loadding();
	$("#ptz_general .save_btn").unbind('click').bind('click',function(){
		$.mobile.loading('show', {text : '', theme : 'b'});
		data_array['patrol_schedule']=$("#ptz_general #patrol_schedule").val();
		var json_ptz='',zoom_array='';
		for(var i in data_array.patrol_schedule_list){
			if(i!=0){
				zoom_array+=',';
			}
			zoom_array+='{"start":'+data_array.patrol_schedule_list[i].start+',"end":'+data_array.patrol_schedule_list[i].end+',"day":'+data_array.patrol_schedule_list[i].day+'}';
		}
		json_ptz='['+zoom_array+']';
		//location.href=data_array.url+"/set_params.cgi?user="+data_array.user+"&pwd="+data_array.pwd+"&save=1&reinit_ptz=1&patrol_schedule="+data_array.patrol_schedule+"&patrol_schedule_list="+json_ptz+"&getjson=setcg";
		var d_set={save:1,reinit_ptz:1};
		d_set['patrol_schedule']=data_array.patrol_schedule;
		//d_set['patrol_schedule_list']=json_ptz;
		IPC_get("set_params.cgi",d_set,'setcg');
	});
}

//计划表创建
$(document).on('pagebeforecreate', '#date_time_schedule', function(){
	$("#date_time_schedule").on('pagebeforeshow', function(){
		schedule_onload(page);
	})
});
var add_num,add_j;
function schedule_open_to(num,j){
	add_num=num;
	add_j=j;
	$.mobile.changePage("#date_time_schedule_add",{ transition: "slide" });
}
$(document).on('pagebeforecreate', '#date_time_schedule_add', function(){
	$("#date_time_schedule_add").on('pagebeforeshow', function(){
		schedule_open(add_num,add_j);
	})
});

var schedule_type='',schedul_val='',schedule_data=[],schedule_reinit='',schedule_reload=true;
function schedule_onload(page){
	switch(page){
		case "alarm":
			schedule_type='arm_schedule_list';
			schedule_reinit='reinit_alarm';
			$("#date_time_schedule h1").html(str_alarm_plan);
		break;
		case "recordd":
			schedule_type='record_schedule_list';
			schedule_reinit='reinit_record';
			$("#date_time_schedule h1").html(str_record_plan);
		break;
		case "ptz_general":
			schedule_type='patrol_schedule_list';
			schedule_reinit='reinit_ptz';
			$("#date_time_schedule h1").html(str_ptz_plan);
		break;
	}
	if(schedule_reload){
		var d_get={};
		d_get[schedule_type]='';
		$.mobile.loading('show', {text : '', theme : 'b'});
		IPC_get("get_params.cgi",d_get,'gschl');
	}else{
		schedule_reload=true;
		show_schedule();
	}
}

function show_schedule(){
	$("#date_time_schedule .code_box").html("");
	for(var i in schedule_data){
		$("#date_time_schedule").find('.code_box').append('<div data-role="collapsible" data-collapsed-icon="arrow-d" data-expanded-icon="arrow-u" id="schedule_'+i+'" data="'+i+'" data-content-theme="c"><h3>'+get_time(schedule_data[i].start)+'-'+get_time(schedule_data[i].end)+'</br><span style="font-size:0.6em;color:#666;font-weight:normal;">'+get_day(schedule_data[i].day)+'</span></h3>');
		$("#date_time_schedule").find("#schedule_"+i).append('<div id="schedule_more'+i+'" style="padding: 5px 5px 5px"></div>');
		$("#date_time_schedule").find('#schedule_more'+i).append('<div style=" text-align:center;" data-role="controlgroup" data-type="horizontal"><a data-role="button" data-icon="gear" data-theme="c" onclick="schedule_open_to(0,'+i+');return false;">'+str_edit+'</a><a data-role="button" data-icon="delete" data-theme="c" onclick="schedule_del(this,'+i+');return false;">'+str_remove+'</a></div>');
	}
	
	$("#date_time_schedule").find('.code_box').append('<div><a data-transition="slide" data-role="button" data-icon="plus" data-theme="a" onclick="schedule_open_to(1,0);return false;">+'+str_add_plan+'</a></div>');
	$("#date_time_schedule .code_box").trigger("create");
	$("#date_time_schedule .save_btn").html(str_set).unbind('click').bind('click',function(){
		$.mobile.loading('show', {text : '', theme : 'b'});
		var str=[],tmp=[];
		for(var i in schedule_data){
			tmp=[];
			for(var j in schedule_data[i]){
				tmp.push('"'+j+'":'+schedule_data[i][j]);
			}
			str.push("{"+tmp.join(',')+"}");
		}
		str="["+str.join(',')+"]";
		var d_set={save:1};
		d_set[schedule_reinit]=1;
		d_set[schedule_type]=str;
		IPC_get("set_params.cgi",d_set,'sschl');
	});
}
var edit_key=-1;
var days={0:str_sun,1:str_mon,2:str_tue,3:str_wed,4:str_thu,5:str_fri,6:str_sat};
var days_en={0:"sun",1:"mon",2:"tue",3:"wed",4:"thu",5:"fri",6:"sat"};
function schedule_open(num,j){
	  $("#date_time_schedule_add .code_box").html("");
	  $("#date_time_schedule_add").find('.code_box').append('<form class="ui-body ui-body-c ui-corner-all"></form>');
	  var time_sel_h='',time_sel_m='<option value="0">00'+str_minute+'</option><option value="1">15'+str_minute+'</option><option value="2">30'+str_minute+'</option><option value="3">45'+str_minute+'</option>';
	  for (i = 0; i <= 24; i++){
		 time_sel_h+='<option value=\"' + i + '\">' + i + str_hour+'<\/option>';
	  }
	   create_select($("#date_time_schedule_add").find('.code_box form'),str_starttime,'schedule_start_time_h',time_sel_h,0);
	   create_select($("#date_time_schedule_add").find('.code_box form'),"————"+str_minute,'schedule_start_time_m',time_sel_m,0);
	   create_select($("#date_time_schedule_add").find('.code_box form'),str_endtime,'schedule_stop_time_h',time_sel_h,0);
	   create_select($("#date_time_schedule_add").find('.code_box form'),"————"+str_minute,'schedule_stop_time_m',time_sel_m,0);
	   
	   $("#date_time_schedule_add").find('.code_box form').append('<div data-role="fieldcontain" id="week_choose"><fieldset data-role="controlgroup" data-type="controlgroup"><legend>'+str_dates_choose+':</legend><input type="checkbox" id="week_sun" class="custom" /><label for="week_sun">'+str_sun+'</label><input type="checkbox" id="week_mon" class="custom" /><label for="week_mon">'+str_mon+'</label><input type="checkbox" id="week_tue" class="custom" /><label for="week_tue">'+str_tue+'</label><input type="checkbox" id="week_wed" class="custom" /><label for="week_wed">'+str_wed+'</label><input type="checkbox" id="week_thu" class="custom" /><label for="week_thu">'+str_thu+'</label><input type="checkbox" id="week_fri" class="custom" /><label for="week_fri">'+str_fri+'</label><input type="checkbox" id="week_sat" class="custom" /><label for="week_sat">'+str_sat+'</label></fieldset></div>');
	  if(num==0){
		 //获取当前计划时间日期 并表现在弹出框上
		 edit_key=j;
		 $("#date_time_schedule_add h1").html(str_edite_plan);
		 $("#schedule_start_time_h").val(parseInt(schedule_data[j].start/4)).selectmenu('refresh');
		 $("#schedule_start_time_m").val(parseInt(schedule_data[j].start%4)).selectmenu('refresh');
		 $("#schedule_stop_time_h").val(parseInt(schedule_data[j].end/4)).selectmenu('refresh');
		 $("#schedule_stop_time_m").val(parseInt(schedule_data[j].end%4)).selectmenu('refresh');
		 for(var i in days){
			var ii=Number(i);
			if(schedule_data[j].day>>ii&0x01){
				$("#week_choose input[id='week_"+days_en[i]+"']").prop("checked",true);
			}
		 }
	  }
	  else{
		  edit_key=-1;
		 $("#date_time_schedule_add h1").html(str_add_plan);
	  }
	  $("#date_time_schedule_add .code_box").trigger("create");
	  
	  $("#schedule_start_time_m,#schedule_stop_time_m").parent().parent().parent().find("label").remove();
	  $("#schedule_start_time_h,#schedule_stop_time_h").parent().parent().parent().css("border","none");
	  $("#date_time_schedule_add").find('.save_btn').html(str_sure).unbind('click').click(function() {
			//保存计划
			var tmp={};
			tmp['start']=(Number($("#schedule_start_time_h").val())*4)+Number($("#schedule_start_time_m").val());
			tmp['end']=(Number($("#schedule_stop_time_h").val())*4)+Number($("#schedule_stop_time_m").val());
			if(tmp.end<=tmp.start){
				show_message(str_plan_set_error1);
				return;
			}
			if(0>tmp.start || tmp.start>96){
				show_message(str_plan_set_error2);
				return;
			}
			if(0>tmp.end || tmp.end>96){
				show_message(str_plan_set_error3);
				return;
			}
			if($("#week_choose input[type='checkbox']:checked").length==0){
				show_message(str_plan_set_error4);
				return;
			}
			tmp['day']=0;
			for(var i in days){
				if($("#week_choose input[id='week_"+days_en[i]+"']").is(":checked")){
					tmp['day']^=0x01<<i
				}
			}
			if(edit_key<0) schedule_data.push(tmp);
			else schedule_data[edit_key]=tmp;
			setTimeout(function(){
				schedule_reload=false;
				$("#date_time_schedule_add .custom_back").click();
			},1500);
	  });
}
function get_time(t){
	var h=parseInt(t/4);
	if(h<10)h='0'+h;
	var m=(t%4)*15;
	if(m==0)m='00';
	return h+":"+m;
}
function get_day(d){
	var str='';
	for(var i in days){
		var ii=Number(i);
		if(d>>ii&0x01){
			str+=(str==''?'':",")+"<span>"+days[i]+"</span>";
		}
	}
	return str;
}
function schedule_del(obj,i){
	delete schedule_data[i];
	$(obj).parent().parent().parent().parent().parent().remove();
}


var dijia_day={0:["mon",str_mon],1:["tue",str_tue],2:["wed",str_wed],3:["thu",str_thu],4:["fri",str_fri],5:["sat",str_sat],6:["sun",str_sun],}
function createdijia_schedule(){
	var n=data_array['dijia_schedule'];

	var n2=pad(n.toString(2),24);
	debug_log("二进制:"+n2);
	var this_minute=parseInt(n2.substr(16,8),2);
	debug_log("this_minute:"+n2.substr(16,8));
	var this_hour=parseInt(n2.substr(8,8),2);
	debug_log("this_hour:"+n2.substr(8,8));
	var this_week=parseInt(n2.substr(0,8),2);
	debug_log("this_week:"+n2.substr(0,8));
	if(this_hour>23){
		this_hour=0;
	}
	if(this_minute>59){
		this_minute=0;
	}

	show_loadding();
	$("#dijia_schedule h1").html(str_dijia_schedule_settings);
	$("#dijia_schedule .code_box").html("");
	$("#dijia_schedule").find('.code_box').append('<form class="ui-body ui-body-c ui-corner-all"></form>');
	var time_sel_h='',time_sel_m='';
	for (i = 0; i <= 23; i++){
		time_sel_h+='<option value=\"' + i + '\">' + i +' '+ (i>1?str_hours:str_hour2)+'<\/option>';
	}
	for (i = 0; i <= 59; i++){
		time_sel_m+='<option value=\"' + i + '\">' + i +' '+ (i>1? str_minutes:str_minute2)+'<\/option>';
	}
	create_select($("#dijia_schedule").find('.code_box form'),str_hour,'schedule_time_h',time_sel_h,this_hour);
	create_select($("#dijia_schedule").find('.code_box form'),str_minute,'schedule_time_m',time_sel_m,this_minute);
	$("#dijia_schedule").find('.code_box form').append('<div data-role="fieldcontain" id="week_choose"><fieldset data-role="controlgroup" data-type="controlgroup"><legend>'+str_dates_choose+':</legend><input type="checkbox" id="week_sun" class="custom" /><label for="week_sun">'+str_sun+'</label><input type="checkbox" id="week_mon" class="custom" /><label for="week_mon">'+str_mon+'</label><input type="checkbox" id="week_tue" class="custom" /><label for="week_tue">'+str_tue+'</label><input type="checkbox" id="week_wed" class="custom" /><label for="week_wed">'+str_wed+'</label><input type="checkbox" id="week_thu" class="custom" /><label for="week_thu">'+str_thu+'</label><input type="checkbox" id="week_fri" class="custom" /><label for="week_fri">'+str_fri+'</label><input type="checkbox" id="week_sat" class="custom" /><label for="week_sat">'+str_sat+'</label></fieldset></div>');
	for(var i in dijia_day){
		var ii=Number(i);
		if(this_week>>ii&0x01){
			$("#week_choose input[id='week_"+dijia_day[i][0]+"']").prop("checked",true);
		}
	}
	$("#dijia_schedule .code_box").trigger("create");
	hide_loadding();
	$("#dijia_schedule .save_btn").unbind('click').bind('click',function(){
		 $.mobile.loading('show', {text : '', theme : 'b'});
		var d_set={save:1};
		var tmp_week=0x00;
		for(var i in dijia_day){
			if($("#week_choose input[id='week_"+dijia_day[i][0]+"']").is(":checked")){
				tmp_week^=0x01<<i
			}
		}
		var tmp_hour=Number($("#schedule_time_h").val());
		var tmp_minute=Number($("#schedule_time_m").val());

		data_array['dijia_schedule']=pad(tmp_week.toString(2),8);
		data_array['dijia_schedule']+=pad(tmp_hour.toString(2),8);
		data_array['dijia_schedule']+=pad(tmp_minute.toString(2),8);
		debug_log(data_array['dijia_schedule']);
		data_array['dijia_schedule']=parseInt(data_array['dijia_schedule'],2);
		d_set['dijia_schedule']=data_array['dijia_schedule'];
		IPC_get("set_params.cgi",d_set,'setcg');
		debug_log(data_array['dijia_schedule']);
	});
}
///补零
function pad(num, n) {
    var len = num.toString().length;
    while(len < n) {
        num = "0" + num;
        len++;
    }
    return num;
}

var this_wifi_set_i=-1;
var this_wifi_set_pwd="";
function createwifi(){
	//data_array['wifi_list'][0]['status']=2;
	//data_array['wifi_list'].push({"ssid":"Pactera-Visitor2","psk":"ipcamera","discovered":0,"type":0,"rssi":100,"auth":4,"encrypt":3,"status":0});
	
	for(var j in data_array['ap']){
		if(data_array['ap'][j]['status']==void 0)
			data_array['ap'][j]['status']=0;
	}
	for(var i in data_array['wifi_list']){
		var is_macth=false;
		for(var j in data_array['ap']){
			if(data_array['ap'][j]['ssid']==data_array['wifi_list'][i]['ssid']){
				if(data_array['ap'][j]['psk']!=data_array['wifi_list'][i]['psk']){
					if(data_array['ap'][j]['psk']!="" && data_array['ap'][j]['psk']!=void 0){
						data_array['wifi_list'][i]['psk']=data_array['ap'][j]['psk'];
					}
				}
				data_array['ap'][j]=data_array['wifi_list'][i];
				is_macth=true;
			}
		}
		if(!is_macth){
			data_array['ap'].push(data_array['wifi_list'][i]);
		}
	}
	data_array['ap'].sort(function (a, b){
		var a_rssi=a.rssi==void 0?-1:a.rssi;
		var b_rssi=b.rssi==void 0?-1:b.rssi;
		var a_discovered=a.discovered==void 0?-1:a.discovered;
		var b_discovered=b.discovered==void 0?-1:b.discovered;
		return a.status==b.status?(a.discovered==b.discovered?b_rssi - a_rssi:b_discovered - a_discovered):(b.status-a.status);
	});
	show_loadding();
	$("#wifi h1").html(str_wifi_settings);
	$("#wifi").find('.code_box').html('<form class="ui-body ui-body-c ui-corner-all"></form>');

	$("#wifi").find('.code_box form').append('<div data-role="collapsibleset" id="wifi_ap" data-content-theme="c" data-collapsed="true" data-iconpos="right" data-collapsed-icon="carat-d" data-expanded-icon="carat-u"></div>');
	for(var i in data_array['ap']){
		if(data_array['ap'][i]['ssid']==""){
			continue;
		}
		var status=data_array['ap'][i]['status']==2?"("+str_wifi_connected+")":data_array['ap'][i]['status']==1?"("+str_wifi_connecting+")":data_array['ap'][i]['discovered']==void 0?"":"("+str_wifi_saved+")";
		var i_class="";
		if(data_array['ap'][i]['rssi']!=void 0){
			if(data_array['ap'][i]['rssi'] <= 25) {
				i_class = "_one";
			} else if(data_array['ap'][i]['rssi'] > 25 && data_array['ap'][i]['rssi'] <= 50) {
				i_class = "_two";
			} else if(data_array['ap'][i]['rssi'] > 50 && data_array['ap'][i]['rssi'] <= 75) {
				i_class = "_three";
			} else if(data_array['ap'][i]['rssi'] > 75) {
				i_class = "_full";
			}
			if(data_array['ap'][i]['auth'] >1 && data_array['ap'][i]['auth'] <6){
				i_class += "_lock";
			}
		}
		$("#wifi").find('.code_box form #wifi_ap').append('<div data-role="collapsible" id="wifi_ap_'+i+'" data-content-theme="c"><h3>'+data_array['ap'][i]['ssid']+'<span class="wifi_right">'+status+(i_class==""?"":'<i class="'+i_class+'"></i>')+'</span></h3></div>');
		
		if(data_array['ap'][i]['auth'] >1 && data_array['ap'][i]['auth'] <6){
			create_value($("#wifi").find('.code_box form #wifi_ap_'+i),str_wifi_pwd,'wifi_ap_pwd_'+i,data_array['ap'][i]['psk'],true,str_wifi_pwd_tip,true);
		}
		
		var html="";
		if(data_array['ap'][i]['discovered']==void 0){
			html+='<a href="#" data-role="button" data-theme="c" class="add">'+str_wifi_add+'</a>'
		}else{
			if(data_array['ap'][i]['rssi']!=void 0){
				html+='<a href="#" data-role="button" data-theme="c" class="select">'+str_wifi_select+'</a>'
			}
			if(data_array['ap'][i]['auth'] >1 && data_array['ap'][i]['auth'] <6){
				html+='<a href="#" data-role="button" data-theme="c" class="update">'+str_wifi_update+'</a>'
			}
			html+='<a href="#" data-role="button" data-theme="c" class="delete">'+str_wifi_delete+'</a>'
		}
		$("#wifi").find('.code_box form #wifi_ap_'+i).append('<div style="text-align:center;margin-top:15px;" data-role="controlgroup" data-type="horizontal" data-mini="true" data="'+i+'">'+html+'</div>');
	}
	$("#wifi").find('.code_box form .delete').unbind('click').bind('click',function(){
		$.mobile.loading('show', {text : '', theme : 'b'});
		this_wifi_set_i=$(this).parent().parent().attr("data");
		IPC_get("remove_wifi.cgi",{ssid:data_array['ap'][this_wifi_set_i]['ssid']},'wifir');
	})
	$("#wifi").find('.code_box form .select').unbind('click').bind('click',function(){
		$.mobile.loading('show', {text : '', theme : 'b'});
		if(!is_wifi){
			show_message(str_wifi_select_faild);
		}else{
			this_wifi_set_i=$(this).parent().parent().attr("data");
			IPC_get("select_wifi.cgi",{ssid:data_array['ap'][this_wifi_set_i]['ssid']},'wifis');
		}
	})
	var wifi_pwd1=new RegExp("^[\x00-\x7f]{5,13}$");
	var wifi_pwd2=new RegExp("^[0-9a-f]{10,26}$");
	$("#wifi").find('.code_box form .update').unbind('click').bind('click',function(){
		$.mobile.loading('show', {text : '', theme : 'b'});
		var this_i=$(this).parent().parent().attr("data");
		if(data_array['ap'][this_i]['auth'] >1 && data_array['ap'][this_i]['auth'] <6){
			var pwd=$("#wifi_ap_pwd_"+this_i).val();
			var len=pwd.length;
			error=false;
			if(data_array['ap'][this_i]['encrypt']==1){
				if(len==5 || len==13){
					if(wifi_pwd1.test(pwd)==false){
						error=true;
					}
				}else
				if(len==10 || len==26){
					if(wifi_pwd2.test(pwd)==false){
						error=true;
					}
				}
				if(error){
					show_message(str_wifi_pwd_err1);
					return false;
				}
			}else if(data_array['ap'][this_i]['encrypt']>1){
				if(len<8 || len>64){
					show_message(str_wifi_pwd_err2);
					return false;
				}
			}
			debug_log(data_array['wifi_list']);
			this_wifi_set_i=this_i;
			this_wifi_set_pwd=pwd;
			IPC_get("update_wifi.cgi",{ssid:data_array['ap'][this_i]['ssid'],psk:pwd},'wifiu');
		}
	})

	$("#wifi").find('.code_box form .add').unbind('click').bind('click',function(){
		$.mobile.loading('show', {text : '', theme : 'b'});
		var this_i=$(this).parent().parent().attr("data");
		var d2={wifi:1,wifi_ssid:data_array['ap'][this_i]['ssid'],wifi_type:data_array['ap'][this_i]['type'],wifi_auth:data_array['ap'][this_i]['auth'],wifi_encrypt:data_array['ap'][this_i]['encrypt']};
		if(is_wifi){
			d2['save']=1;
			d2['reinit_network']=1;
		}
		if(d2.wifi_type=='0')delete d2['wifi_type'];
		if(data_array['ap'][this_i]['auth'] >1 && data_array['ap'][this_i]['auth'] <6){
			var pwd=$("#wifi_ap_pwd_"+this_i).val();
			var len=pwd.length;
			error=false;
			if(data_array['ap'][this_i]['encrypt']==1){
				d2['wifi_defkey']=0;
				d2['wifi_key0']=pwd;
				if(len==5 || len==13){
					d2['wifi_keytype']=1;
					if(wifi_pwd1.test(pwd)==false){
						error=true;
					}
				}else
				if(len==10 || len==26){
					d2["wifi_keytype"]=0;
					if(wifi_pwd2.test(pwd)==false){
						error=true;
					}
				}
				if(error){
					show_message(str_wifi_pwd_err1);
					return false;
				}
			}else if(data_array['ap'][this_i]['encrypt']>1){
				d2["wifi_wpapsk"]=pwd;
				if(len<8 || len>64){
					show_message(str_wifi_pwd_err2);
					return false;
				}
			}
		}
		this_wifi_set_i=this_i;
		IPC_get("set_params.cgi",d2,'wfadd');
	})
	$("#wifi .code_box").trigger("create");
	hide_loadding();
	hide_message();
}
function check_wifi_set_succeed(mark){
	if(mark=="wfadd"){//添加
		data_array['ap'][this_wifi_set_i]['discovered']=0;
		if(is_wifi){
			web_out();
		}else{
			show_message("测试wifi...",false);
			IPC_get("test_wifi_connected.cgi",{},'wtest');
		}
	}else
	if(mark=="wadd2"){
		show_message(str_wifi_reload,false);
		setTimeout(function(){
			IPC_get("get_status.cgi",{wifi_signal_level:''},'getwf');
		},1200);
	}else
	if(mark=="wifiu"){//更新
		debug_log(data_array['ap'][this_wifi_set_i]);
		data_array['ap'][this_wifi_set_i]['psk']=this_wifi_set_pwd;
		createwifi();
		if(data_array['ap'][this_wifi_set_i]['status']==2){
			web_out();
		}
	}else
	if(mark=="wifir"){//删除
		if(data_array['ap'][this_wifi_set_i]['status']==2){
			web_out();
		}else{
			delete data_array['ap'][this_wifi_set_i]['discovered'];
			delete data_array['ap'][this_wifi_set_i]['psk'];
			for(var i in data_array['wifi_list']){
				if(data_array['ap'][this_wifi_set_i]['ssid']==data_array['wifi_list'][i]['ssid']){
					delete data_array['wifi_list'][i];
					break;
				}
			}
			createwifi();
		}
	}else
	if(mark=="wifis"){//切换
		if(is_wifi){
			web_out();
		}
	}
}

var tmp_push_language=0;
//推送语言
function create_push_language()
{
	show_loadding();
	$("#other h1").html(str_push_language);
	$("#other").find('.code_box').html('<form class="ui-body ui-body-c ui-corner-all"></form>');
//	create_switch($('#other .code_box form'),"推送语言","push_language",data_array.push_language,1,function(obj){
//		debug_log($(obj).val());
//	},['简体中文','English']);
	create_controlgroup($('#other .code_box form'),str_push_language,"push_language","radio",[[0,str_push_language_0],[1,str_push_language_1]],data_array.push_language,1,function(obj){
			if($(obj).val()!=data_array.push_language){
				$.mobile.loading('show', {text : '', theme : 'b'});
				tmp_push_language=$(obj).val();
				IPC_get("set_params.cgi",{push_language:$(obj).val()},'saveplng');
			}
		});
	$("#other .code_box").trigger("create");
	hide_loadding();
	hide_message();
}
function other_back_marck(err,mark,get_json){
	if(err=='1'){
		if(mark=='gprop'){
			check_adb(get_json["firmware_ver"]);
			if(page=="push_language"){
				IPC_get("get_params.cgi",{push_language:''},'pushlng');
			}
		}else
		if(mark=='pushlng'){
			for(var k in get_json){
				data_array[k]=get_json[k];
			}
			create_push_language();
		}else
		if(mark=='saveplng'){
			data_array.push_language=tmp_push_language;
			show_message(str_succeed);
		}else{
			show_message(str_succeed);
		}
	}
	else{
		if(mark=='gprop'){
			alert_show();
		}else{
			show_message(str_failed);
		}
	}
}

//错误提示
function show_mobile_error(err)
{
	var err_info;
	switch(Number(err))
	{		
		case -1:
			err_info=str_err_auth;
		break;
		case -2:
			err_info=str_err_params;
		break;
		case -3:
			err_info=str_err_maxsessioin;
		break;
		case -4:
			err_info=str_err_caminnererr;
		break;
		case -5:
			err_info=str_err_exectimeout;
		break;
		case -6:
			err_info=str_err_errreq;
		break;
		case -11:
			err_info=str_err_returnexcept;
		break;
		case -12:
			err_info=str_err_returndataerr;
		break;
		case -13:
			err_info=str_err_reqtimeout;
		break;
		case -14:
			err_info=str_err_initajaxfail;
		break;
		case -15:
			err_info=str_err_severnotinterfile;
		break;
	}
	err_info =(err > -10 ? err_info : err_info+' '+err);
	show_message(err_info)
}
//文字提示
function show_message(str,autohide){
    $.mobile.loading( "show", {
            text: str,
            textVisible: true,
            theme: 'b',
            textonly: autohide==false?false:true
    });
	if(autohide==false){
		return false;
	}
	setTimeout(function(){
		hide_message();
	},1200);
}
function hide_message(){
	$.mobile.loading('hide');
}

//页面加载提示
function show_loadding(){
	$("#loadding_box").show();
}
function hide_loadding(){
	$("#loadding_box").hide();
}
function alert_show(){
	$("#loadding_box").find("div").addClass("error").html(str_alertt);
}
//退出浏览器模式
function out_webapp(){
	
}


//页面  组件创建
function create_page(div,title,hide_save){
	var elem = '<div data-theme="a" data-role="header">'+
		'<h1>{{title}}</h1>'+
		'<a data-role="button" data-rel="back" data-icon="back" data-iconpos="left" class="ui-btn-left">{{back}}</a>'+
		'<a data-role="button" data-icon="check" data-iconpos="left" class="ui-btn-right save_btn" style="display:none;">{{save}}</a>'+
		'</div>'+
		'<div data-role="content" style="padding: 5px 5px 5px;" class="code_box">'+
		'</div>';
	div.html(elem.replace('{{title}}', title).replace('{{back}}', str_back).replace('{{save}}', str_set));
	if(hide_save!=true)div.find(".save_btn").show();
}
function create_show(div,name,value){
	var elem = '<li>'+
		'<div class="ui-grid-a">'+
		'<div class="ui-block-a">{{name}}</div>'+
		'<div class="ui-block-b">{{value}}</div>'+
		'</div>'+
		'</li>';
	div.append(elem.replace('{{name}}', name).replace('{{value}}', value));
}
function create_value(div,name,value_name,value,show,placeholder,is_password){
	var elem = '<div class="ui-field-contain">'+
		'<label for="{{value_name}}">{{name}}:</label>'+
		'<input type="{{value_type}}" id="{{value_name}}" value="{{value}}"{{placeholder}} />'+
		'</div>';
	value = value==undefined?'':value;
	div.append(elem.replace('{{name}}', name).replace('{{value}}', value).replace('{{value_name}}', value_name).replace('{{value_name}}', value_name).replace('{{placeholder}}', placeholder==undefined?'':' placeholder="'+placeholder+'"').replace('{{value_type}}', is_password==undefined || is_password==false?'text':'password'));
	div.find("#alarm_url").val(value);
	if(show==false)div.find('#'+value_name).parent().hide();
}
function create_switch(div,name,value_name,value,show,fuc,opt_arr){
	var elem = '<div data-role="fieldcontain">'+
		'<label for="{{value_name}}">{{name}}:</label>'+
		'<select id="{{value_name}}" data-role="slider">'+
		'<option value="0">{{off}}</option>'+
		'<option value="1">{{on}}</option>'+
		'</select>'+
		'</div>';
	div.append(elem.replace('{{name}}', name).replace('{{value_name}}', value_name).replace('{{value_name}}', value_name).replace('{{off}}', opt_arr==undefined?'OFF':opt_arr[0]).replace('{{on}}', opt_arr==undefined?'ON':opt_arr[1]));
	div.find('#'+value_name).val(value);
	if(show==false)div.find('#'+value_name).parent().hide();
	if(fuc!=undefined){
		div.find('#'+value_name).bind( "change", function(event, ui) {
			fuc($(this),event, ui);
		});
	}
}

function create_controlgroup(div,name,value_name,type,option,value,show,fuc){
	var elem = '<div data-role="fieldcontain">'+
		'<label>{{name}}:</label>'+
		'<fieldset data-role="controlgroup" data-type="horizontal">'+
		'{{option}}'+
		'</fieldset>'+
		'</div>';
	var elem_option='<input type="{{type}}" name="{{name}}" id="{{name}}{{value}}" value="{{value}}">'+
		'<label for="{{name}}{{value}}">{{name_value}}</label>';
	var tmp_option="";
	debug_log(option);
	for(var i=0;i<option.length;i++){
		tmp_option+=elem_option.replace(new RegExp("{{type}}",'gm'),type=="checkbox"?"checkbox":"radio").replace(new RegExp("{{name}}",'gm'),value_name).replace("{{name_value}}",option[i][1]).replace(new RegExp("{{value}}",'gm'),option[i][0]);
	}
	div.append(elem.replace('{{name}}', name).replace('{{option}}', tmp_option).replace(new RegExp("{{value_name}}",'gm'), value_name));
	if(type=="checkbox"){
		div.find("input[id='"+value_name+value+"']").prop("checked",true);
	}else{
		div.find("input[id='"+value_name+value+"']").prop("checked",true);
	}
	if(show==false)div.find("input[name='"+value_name+"']").parent().parent().hide();
	if(fuc!=undefined){
		div.find("input[name='"+value_name+"']").bind( "click", function(event, ui) {
			fuc($(this),event, ui);
		});
	}
}
function create_select(div,name,value_name,option,value,show,menu_type,fuc){
	var elem = '<div data-role="fieldcontain">'+
		'<label for="{{value_name}}">{{name}}:</label>'+
		'<select id="{{value_name}}"{{data-native-menu}}>'+
		'{{option}}'+
		'</select>'+
		'</div>';
	div.append(elem.replace('{{name}}', name).replace('{{option}}', option).replace('{{value_name}}', value_name).replace('{{value_name}}', value_name).replace('{{data-native-menu}}', menu_type==true?' data-native-menu="false"':''));
	if(value!=undefined ){
		if(div.find('#'+value_name+" option[value='"+value+"']").length==0){
			div.find('#'+value_name)[0].options.add(new Option(value,value));
		}
		div.find('#'+value_name).val(value);
	}
	if(show==false)div.find('#'+value_name).parent().hide();
	if(fuc!=undefined){
		div.find('#'+value_name).bind("change",function(event, ui) {
			fuc($(this),event, ui);
		});
	}
	div.find('#'+value_name).selectmenu();
}
function create_slider(div,name,value_name,value,minval,maxval,show,step){
	if(is_adb){
		create_value(div,name,value_name,value,show);
		return false;
	}
	var elem = '<div data-role="fieldcontain">'+
		'<label for="{{value_name}}">{{name}}:</label>'+
		'<input type="range" id="{{value_name}}" value="{{value}}"{{minval}}{{maxval}} data-highlight="true"{{step}}/>'+
		'</div>';
	div.append(elem.replace('{{name}}', name).replace('{{value}}', value).replace('{{value_name}}', value_name).replace('{{value_name}}', value_name).replace('{{minval}}', minval==undefined?'':' min="'+minval+'"').replace('{{maxval}}', maxval==undefined?'':' max="'+maxval+'"').replace('{{step}}', step==undefined?' step="1"':' step="'+step+'"'));
	if(show==false)div.find('#'+value_name).parent().hide();
}