function IPcamera_Ajax(obj) {
    try {CollectGarbage();} catch (e) {};
    var c = this, x = null;
    this.h = (obj.h != undefined ? (obj.h.indexOf("https://") >= 0 ? obj.h + '/' : 'http://' + obj.h + '/') : "");
    this.u = obj.u;
    this.d = (obj.d != undefined ? obj.d : {});
    this.f = obj.f;
    this.m = (obj.m != undefined && obj.m == 'post' ? "post" : 'get');
    this.a = obj.a != undefined && obj.a == false ? false : true;
	this.json = obj.json != undefined && obj.json == false ? false : true;
    this.timeout = (obj.t != undefined ? (obj.t < 10 ? obj.t * 1000 : obj.t) : 0);
    this.timeouter = null;
    this.istimeout = false;
    this.callbackname = null;
    this.j = (obj.j != undefined ? obj.j : '');
    this.exe = function() {
        try {
            if (c.h != '') {
                c.callbackname = c.R();
                c.d['jsonp_callback'] = c.callbackname
            }
            if(c.json)c.d['json'] = c.h != '' ? 2 : 1;
            c.u += (c.u.indexOf("?") >= 0 ? "&" : "?") + c.pTS(c.d);
            if (c.h != '') {
                var script = window.document.createElement('script');
                script.setAttribute('src', c.h + c.u);
                window.document.getElementsByTagName('head')[0].appendChild(script);
                window[c.callbackname] = function(d) {
                    c.kexe(script);
                    if (!c.istimeout) {
                        clearTimeout(c.timeouter);
                        c.ce('success', d)
                    }
                };
                c.addEvent(script, 'error', function() {
                    try {
                        try {
                            clearTimeout(c.timeouter);
                        } catch (e) {
                        }
                        c.kexe(script);
                        c.ce('error', '-11')
                    } catch (e) {
                    }
                });
                if (c.timeout > 0) {
                    c.timeouter = setTimeout(function() {
                        c.istimeout = true;
                        c.ce('error', '-13')
                    }, c.timeout)
                }
            } else {
                if (c.u == undefined) {
                    return false
                }
                try {
                    x = new ActiveXObject('MSXML2.XMLHTTP.3.0');
                } catch (e) {
                    x = null
                }
                if (x == null) {
                    try {
                        x = new XMLHttpRequest()
                    } catch (e) {
                        x = null
                    }
                }
                if (x != null) {
                    if (c.timeout > 0) {
                        c.timeouter = setTimeout(function() {
                            x.abort();
                            c.ce('error', '-13')
                        }, c.timeout)
                    }
                    if (c.a) {
                        x.onreadystatechange = c.cb
                    }
                    if (c.m == "get") {
                        x.open("GET", c.u, c.a);
                        x.setRequestHeader("Cache-Control", "no-cache");
                        x.setRequestHeader("If-Modified-Since", "0");
                        x.send(null)
                    } else if (c.m == "post") {
                        x.open("POST", c.u.split("?")[0], c.a);
                        x.setRequestHeader("content-type", "application/x-www-form-urlencoded");
                        x.setRequestHeader("Cache-Control", "no-cache");
                        x.setRequestHeader("If-Modified-Since", "0");
                        x.send(c.u.substring(c.u.indexOf("?") + 1, c.u.length))
                    }
                    if (!c.a) {
                        c.cb()
                    }
                } else {
                    c.ce('error', '-14')
                }
            }
        } catch (e) {
        }
    };
    this.cb = function() {
        if (x.readyState == 4) {
            if ((x.status >= 200 && x.status < 300) || x.status == 401) {
                d = x.responseText;
                if (c.timeouter != null) {
                    clearTimeout(c.timeouter)
                }
                try {
                    if(c.json)
						d = eval('(' + (d.replace(/^\s+|\s+$/, "")) + ')');
                    c.ce('success', d)
                } catch (e) {
                    c.ce('error', (d == 'File not found.' ? '-15' : '-12'))
                }
            } else {
                if (c.timeout == 0)
                    c.ce('error', '-11')
            }
        }
    };
    this.ce = function(s, d) {
        if (s == 'success' && d.error < 0) {
            s = d.error;
            delete d.error;
            c.ce(s, d);
            return
        }
        if (s == 'success') {
            s = d.error;
            delete d.error
        }
        if (s == 'error') {
            s = d
        }
        try {
            c.f(s, d, c.j)
        } catch (e) {};
        x = null;
        c = null
    };
    this.kexe = function(s) {
        s.parentNode.removeChild(s);
        window[c.callbackname] = undefined;
        try {
            delete window[c.callbackname]
        } catch (e) {
        }
    };
    this.pTS = function(pars) {
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
    this.R = function() {
        var s = [], hexDigits = "0123456789", i = 0;
        for (i = 0; i < 6; i += 1) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 10), 1)
        }
        return "callback_" + Date.parse(new Date()) + "_" + s.join("")
    };
    this.addEvent = function(element, event, fn) {
        if (element.addEventListener) {
            element.addEventListener(event, fn, false)
        } else if (element.attachEvent) {
            element.attachEvent('on' + event, fn)
        } else {
            element['on' + event] = fn
        }
    };
    this.exe()
}
function ipcamera_ajax(obj) {
	if(obj.h==undefined){
		obj.h=url;
	}
    new IPcamera_Ajax(obj)
}
function in_array(a, b) {
    if (typeof a == 'string' || typeof a == 'number') {
        for (var i in b) {
            if (b[i] == a) {
                return true
            }
        }
    }
    return false
}
function $id(d) {
    return document.getElementById(d)
}
function create_session(u, p, f, t, a, h) {
    ipcamera_ajax({h: h,d: {user: u,pwd: p},u: "create_session.cgi",f: f,a: a,t: t})
}
function close_session(s, f, t, a, h) {
    ipcamera_ajax({h: h,d: {session: s},u: "close_session.cgi",f: f,a: a,t: t})
}
function get_session_list(d, f, t, a, h) {
    ipcamera_ajax({h: h,d: d,u: "get_session_list.cgi",f: f,a: a,t: t})
}
function is_mjpeg_stream_exist(d, f, t, a, h) {
    ipcamera_ajax({h: h,d: d,u: "is_mjpeg_stream_exist.cgi",f: f,a: a,t: t})
}
function get_properties(d, f, t, a, h) {
    ipcamera_ajax({h: h,d: d,u: "get_properties.cgi",f: f,a: a,t: t})
}
function get_params(d, f, t, a, h) {
    ipcamera_ajax({h: h,d: d,u: "get_params.cgi",f: f,a: a,t: t})
}
function set_params(d, f, t, a, h) {
    ipcamera_ajax({h: h,d: d,u: "set_params.cgi",f: f,a: a,t: t})
}
function get_status(d, f, t, a, h) {
    if (t == undefined)
        t = 15000;
    ipcamera_ajax({h: h,d: d,u: "get_status.cgi",f: f,a: a,t: t})
}
function get_log(d, f, t, a, h) {
    ipcamera_ajax({h: h,d: d,u: "get_log.cgi",f: f,a: a,t: t})
}
function request_av(d, f, t, a, h) {
    ipcamera_ajax({h: h,d: d,u: "request_av.cgi",f: f,a: a,t: t})
}
function ptz_control(c, d, f, t, a, h) {
    d['command'] = c;
    ipcamera_ajax({h: h,d: d,u: "ptz_control.cgi",f: f,a: a,t: t})
}
function start_record(d, f, t, a, h) {
    ipcamera_ajax({h: h,d: d,u: "start_record.cgi",f: f,a: a,t: t})
}
function stop_record(id, d, f, t, a, h) {
    d['task'] = id;
    ipcamera_ajax({h: h,d: d,u: "stop_record.cgi",f: f,a: a,t: t})
}
function search_record(d, f, t, a, h) {
    ipcamera_ajax({h: h,d: d,u: "search_record.cgi",f: f,a: a,t: t})
}
function del_record(name, d, f, t, a, h) {
    d['name'] = name;
    ipcamera_ajax({h: h,d: d,u: "del_record.cgi",f: f,a: a,t: t})
}
function restore_factory(d, f, t, a, h) {
    ipcamera_ajax({h: h,d: d,u: "restore_factory.cgi",f: f,a: a,t: t})
}
function mail_test(d, f, t, a, h) {
    ipcamera_ajax({h: h,d: d,u: "mail_test.cgi",f: f,a: a,t: t})
}
function wifi_scan(d, f, t, a, h) {
    ipcamera_ajax({h: h,d: d,u: "wifi_scan.cgi",f: f,a: a,t: t})
}
function check_user(d, f, t, a, h) {
    ipcamera_ajax({h: h,d: d,u: "check_user.cgi",f: f,a: a,t: t})
}
function register_skype_user(name, pwd, mail, d, f, t, a, h) {
    d['account_name'] = name;
    d['account_pwd'] = pwd;
    d['account_mail'] = mail;
    ipcamera_ajax({h: h,d: d,u: "register_skype_user.cgi",f: f,a: a,t: t})
}
function get_skype_contacts_list(d, f, t, a, h) {
    ipcamera_ajax({h: h,d: d,u: "get_skype_contacts_list.cgi",f: f,a: a,t: t})
}
function search_skype_contact(key, d, f, t, a, h) {
    d['keyword'] = key;
    ipcamera_ajax({h: h,d: d,u: "search_skype_contact.cgi",f: f,a: a,t: t})
}
function add_skype_contact(key, d, f, t, a, h) {
    d['contact'] = key;
    ipcamera_ajax({h: h,d: d,u: "add_skype_contact.cgi",f: f,a: a,t: t})
}
function remove_skype_contact(key, d, f, t, a, h) {
    d['contact'] = key;
    ipcamera_ajax({h: h,d: d,u: "remove_skype_contact.cgi",f: f,a: a,t: t})
}
function get_badauth(d, f, t, a, h) {
    ipcamera_ajax({h: h,d: d,u: "get_badauth.cgi",f: f,a: a,t: t})
}