var stb = gSTB,
v_idx = 0,
h_idx = 0,
cur_page = 0,
cur_volume = 0,
standby = false,
channel_set = false,
button_blocked = false,
debug = false,
update_enable = false,
update_url250 = 'http://mag.infomir.com.ua/250/imageupdate',
update_url200 = '';

function init(){
    stb.InitPlayer();
    stb.SetBufferSize(4000,2000000);
    var model = stb.RDir("Model ");
    if(update_enable && ((model == 'MAG250' && update_url250 != '')||(model == 'MAG200' && update_url200 != ''))){
        var locupdateurl = stb.RDir('getenv autoupdateURL');
        if(locupdateurl == ''){
            stb.RDir('setenv autoupdate_cond 2');
        }
        if(model == 'MAG200'){
            update_url = update_url200;
        }else{
            update_url = update_url250;
        }
        startUpdating();
    }
    try{cur_volume = parseInt(stb.RDir('getenv audio_initial_volume'));}catch(e){cur_volume = 100;stb.RDir('setenv audio_initial_volume 70');}
    if(isNaN(cur_volume)){cur_volume = 100;stb.RDir('setenv audio_initial_volume 70');}
    for(var i = 0;i<6;i++){
        for(var y = 0;y<6;y++){
            document.getElementById(i+''+y).style.WebkitTransform = 'scale(0.75)';
        }
    }
    menuItem_Select();
    stb.EnableServiceButton(true);
    stb.EnableVKButton(true);
    win = {
        "width":screen.width,
        "height":screen.height
    };
    stb.SetTopWin(0);
    resize(win.height);
}
var update_url = '';
function resize(res){
    var new_width = 0,
        new_height = 0;
    switch(res){
        case 480:
            new_width = '100';
            new_height = '55';
        break;
        case 576:
            new_width = '100';
            new_height = '60';
        break;
        case 720:
            new_width = '100';
            new_height = '60';
        break;
        case 1080:
            new_width = '100';
            new_height = '60';
        break;
    }
    for(var i = 0;i<6;i++){
        for(var y = 0;y<6;y++){
            document.getElementById(i+''+y).getElementsByTagName('a')[0].getElementsByTagName('img')[0].width = new_width;
            document.getElementById(i+''+y).getElementsByTagName('a')[0].getElementsByTagName('img')[0].height = new_height;
        }
    }
	document.body.style.display = 'block';
}
footer_hide_tmo = 0;
function body_keyDown(e){
    var key = e.keyCode || e.which;
    if(button_blocked){e.preventDefault();return;}
    switch(key){
        case 13:
            e.preventDefault();
            window.location.href = '/anime'
        break;
        case 37:
            menuItem_unSelect()
            h_idx>0?h_idx--:h_idx;
            menuItem_Select()
        break;
        case 38:
            menuItem_unSelect()
            v_idx>0?v_idx--:v_idx;
            menuItem_Select()
        break;
        case 39:
            menuItem_unSelect()
            h_idx<5?h_idx++:h_idx;
            menuItem_Select()
        break;
        case 40:
            menuItem_unSelect()
            v_idx<5?v_idx++:v_idx;
            menuItem_Select()
        break;
        case 85:
            if(event.altKey){
                if(standby == false){
                    standby = true;
                    stb.StandBy(true);
                    stb.ExecAction('front_panel led-on');}
                else{
                    stb.StandBy(false);
                    standby = false;
                    stb.ExecAction('front_panel led-off');
                }
        
            }
        break;
        case 57:
            document.getElementById('00').getElementsByTagName('a')[0].getElementsByTagName('img')[0].height = '50';
            document.getElementById('01').getElementsByTagName('a')[0].getElementsByTagName('img')[0].height = '50';
            document.getElementById('02').getElementsByTagName('a')[0].getElementsByTagName('img')[0].height = '50';
            document.getElementById('03').getElementsByTagName('a')[0].getElementsByTagName('img')[0].height = '50';
            document.getElementById('04').getElementsByTagName('a')[0].getElementsByTagName('img')[0].height = '50';
            document.getElementById('05').getElementsByTagName('a')[0].getElementsByTagName('img')[0].height = '50';
        break;
    }
}
function menuItem_Select(){
  document.getElementById(v_idx+''+h_idx).style.WebkitTransform = 'scale(1)';
  
  //document.getElementById(v_idx+''+h_idx).style.visibility = "visible";

}

function menuItem_unSelect(){
  document.getElementById(v_idx+''+h_idx).style.WebkitTransform = 'scale(0.75)';
  
  //document.getElementById(v_idx+''+h_idx).style.visibility = "visible";

}
chan_tmo = 0;
volume_timer = 0;


function startUpdating(){
    stbUpdate.startCheck(update_url);
    timerHandler();
}

function timerHandler(){
    if(stbUpdate.getStatus() == 21){
        autoupdate_init();
    }else{
        setTimeout(timerHandler, 1000);
    }
}

function autoupdate_init(){
    var cur_Imagedate = new Date();
    var date_str = stb.RDir("ImageDate").replace(/\n|\r/gm,'');
    cur_Imagedate.setTime(Date.parse(date_str.match(/\w{3}\s\w{3}\s\d{1,2}\s\d{1,2}:\d{1,2}:\d{1,2}/)+' '+date_str.match(/\d{4}/)));
    var last_Imagedate = new Date();
    last_Imagedate.setTime(Date.parse(stbUpdate.getImageDateStr().match(/\w{3}\s\w{3}\s\d{1,2}\s/)+''+stbUpdate.getImageDateStr().match(/\d{4}/)+' '+stbUpdate.getImageDateStr().match(/\d{1,2}:\d{1,2}:\d{1,2}/)));
    if(((last_Imagedate.getTime() > cur_Imagedate.getTime())||(isNaN(cur_Imagedate.getTime())))){
        var updateform_obj = {
            'tag':'div',
            'attrs':{
                'id':'update_form'
            },
            'child':[
                {
                    'tag':'div',
                    'attrs':{
                        'id':'update_label',
                        'html':'Autoupdate form'
                    }
                },
                {
                    'tag':'span',
                    'attrs':{
                        'html':'Current version',
                        'class':'update_text'
                    }
                },
                {
                    'tag':'div',
                    'attrs':{
                        'id':'update_curver',
                        'html':isNaN(cur_Imagedate.getTime())?('Date : '):('Date : '+cur_Imagedate),
                        'class':'update_text',
                    }
                },
                {
                    'tag':'div',
                    'attrs':{
                        'id':'update_curdescr',
                        'html':'Description : '+stb.RDir('ImageDescription'),
                        'class':'update_text',
                    }
                },
                {
                    'tag':'div',
                    'child':[
                        {
                            'tag':'span',
                            'attrs':{
                                'class':'update_text',
                                'html':'New version'
                            }
                        }
                    ]
                },
                {
                    'tag':'div',
                    'attrs':{
                        'id':'update_newver',
                        'html':'Date : '+last_Imagedate,
                        'class':'update_text',
                    }
                },
                {
                    'tag':'div',
                    'attrs':{
                        'id':'update_newdescr',
                        'html':'Description : '+stbUpdate.getImageDescStr(),
                        'class':'update_text',
                    }
                },
                {
                    'tag':'div',
                    'attrs':{
                        'id':'update_prbar'
                    },
                    'child':[
                        {
                            'tag':'div',
                            'attrs':{
                                'id':'prbar_bg'
                            }
                        },
                        {
                            'tag':'div',
                            'attrs':{
                                'id':'prbar_line'
                            }
                        }
                    ]
                },
                {
                    'tag':'div',
                    'attrs':{
                        'id':'update_msg',
                        'html':'Updating...',
                        'class':'update_text',
                    }
                },

            ]
        }
        document.body.appendChild(createHTMLTree(updateform_obj));
        button_blocked = true;
        //document.getElementById('update_newver').innerHTML = update_version_text+': '+update_list[(update_list.length-1)].name+'-'+update_list[(update_list.length-1)].type+' '+update_list[(update_list.length-1)].date.replace(/GMT\+\d\d\d\d/,'');
        //document.getElementById('update_newdescr').innerHTML = update_descr_text+': '+update_list[(update_list.length-1)].descr;
        e();
    }
}
function e(){
    if(stbUpdate.getStatus() == 21){
        window.setTimeout(function(){startUpdate()}, 1000);
    }else{
        var prlime_width = 560;
        document.getElementById('update_msg').innerHTML = stbUpdate.getStatusStr();
        document.getElementById('prbar_line').style.width = prlime_width*(stbUpdate.getPercents()/100)+'px';
        window.setTimeout(function(){e();}, 1000);            
    }
}




function createHTMLTree(obj){
    var el = document.createElement(obj.tag);
    for(var key in obj.attrs) {
        if (obj.attrs.hasOwnProperty(key)){
            if(key!='html'){
                el.setAttribute(key, obj.attrs[key]);
            }else{
                el.innerHTML = obj.attrs[key];
            }
        }
    }
    if(typeof obj.child != 'undefined'){
        for(var i=0; i<obj.child.length; i++){
            el.appendChild(createHTMLTree(obj.child[i]));
        }
    }
    return el;
}

function startUpdate(){
    document.getElementById('update_msg').innerHTML = stbUpdate.getStatusStr();
    var prlime_width = 560;
    document.getElementById('prbar_line').style.width = prlime_width*(stbUpdate.getPercents()/100)+'px';
    var activeBank = stbUpdate.getActiveBank();
    var model = stb.RDir("Model ");
    if(model == 'MAG250'){
        if(activeBank == 1){
            stbUpdate.startUpdate(0, update_url250);
        }else{
            if(activeBank == 0){
                stbUpdate.startUpdate(1, update_url250);
            }else{
                stbUpdate.startUpdate(0, update_url250);
            }
        }
    }else{
        if(activeBank == -1){
            stbUpdate.startUpdate(0, update_url200);
        }else{
            if(stbUpdate.GetFlashBankCount() == 2){
                if(activeBank == 0){
                    stbUpdate.startUpdate(1, update_url200);
                }else{
                    stbUpdate.startUpdate(0, update_url200);
                }
            }else{
                document.body.removeChild(document.getElementById('update_form'));
                return;
            }

        }
    }
    e();
}
