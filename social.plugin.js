/**
 * Created by Sayed on 11-06-2015.
 */

//for google plus sharing
window.___gcfg = {
    lang: 'en-US',
    //parsetags: 'explicit'
    parsetags: 'onload'
};
// Load the FB SDK asynchronously
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Load the GPlus SDK asynchronously
(function()
{
    var po = document.createElement('script');
    po.type = 'text/javascript';
    po.async = true;
    po.src = 'https://apis.google.com/js/client:platform.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
})();

// Load the LinkedIn SDK asynchronously
(function()
{
    var po = document.createElement('script');
    po.type = 'text/javascript';
    po.src = '//platform.linkedin.com/in.js?async=true';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
    onLoad = onLinkedInLoad;
})();

window.fbAsyncInit = function()//for FB
{
    FB.init({
        appId      : $social.setup.id.facebook,//Your facebook app ID. If you've setup the same for plugin variable, no need to set it here
        version    : 'v2.0',
        status     : true, // check login status
        cookie     : true, // enable cookies to allow the server to access the session
        frictionlessRequests: true,
        xfbml      : false  // on true,parse XFBML,when there are social plugins added
    });
}
if(!window.jQuery)
{
    var script = document.createElement('script');
    script.type = "text/javascript";
    script.src = "http://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js";
    document.getElementsByTagName('head')[0].appendChild(script);
}
if(window.location.hash && (window.location.hash=='#closeSocialInvite' || window.location.hash=='#_=_'))
    window.close();

$(document).ready(function()
{
    $social.loadIcons();//loads up login icons everywhere specified by selector
    $('.social_icon').bind('click',function(e)
    {
        e.target.href ? e.preventDefault() :null;
        var action = $(this).attr('data-action');
        var fn = $social[action];//call the respective function, eg, $social.login, $social.invite, etc.
        fn(this);
    });

    $(document).bind('click','.load_detail',function(e)
    {/*
        e.preventDefault();
        var object = $(this).data('type');
        $('#socialInvite').modal('show');
        $('#socialInvite').find('#object_name').html(getObjectName(object));
        $social.updateInviteLinks(this);*/
    });
});


var $social = {
    setup:{
		//you can setup your app ids here or you can do the same by accessing the object in your file
            id:{
                googleplus :'your-googleplus-app-id',//somethign like: 170143680859-aelijfni5piukeq8gtxxxxxxxxxxxxxx.apps.googleusercontent.com
                facebook: 'your-facebook-app-id'
            }
        },
    login_container:'.social_login_container',//the container in which the social login buttons should appear
    invite_container:'.social_invite_container',//the container in which the social invite buttons should appear
    platforms:
        {
			//configure these to setup your own icons or labels for social buttons
            facebook:
                {login: {icon:'icon icon-facebook2',image:'',label:'Facebook',html:''},
                 invite: {icon:'icon icon-facebook2',image:'',label:'Facebook Invite',html:''}
                },
            linkedin:
                {login: {icon:'icon icon-linkedin',image:'',label:'LinkedIn',html:''},
                 invite: {icon:'icon icon-linkedin',image:'',label:'LinkedIn Invite',html:''}
                },
            googleplus:
                {login:
                    {icon:'icon icon-google-plus2',image:'', label:'Google Plus',html:''},
                    invite:{icon:'icon icon-google-plus2',image:'', label:'Google Plus Invite',html:''}
                }
        },
    platform : null,//used in processes
    retry :{login:[],invite:[]},
    login_platforms:[],//specify social login platforms you intend to use
    invite_platforms:[],//specify social invite platforms you intend to use
    onLogin:this.getProfile,/
    onLoginFail:null,
    //loads up login icons everywhere specified by selector
    loadIcons:function(to)
    {
        var actions = ['login','invite'];
        for(var j=0; j<actions.length; j++)
        {
            var action = actions[j];
            to = $social[action+'_container'];
            if(!$(to).length)
            {
                console.log('Missing destination for '+action+' icons. Please specify a wrapper as $social.'+action+'_container=your_class_or_id_name');
                continue;
            }
            var social_icons = '<div class="'+action+'_icons">';
            for(var i=0; i<$social[action+'_platforms'].length; i++)
            {
                var platform = $social[action+'_platforms'][i];
                var key = platform.toLowerCase().split(' ').join('');
                if(this.platforms[key])
                {
                    var icon = this.platforms[key][action].icon;
                    var label = this.platforms[key][action].label;
                    var html = this.platforms[key][action].html;
                    //if specified, html will replace container of icon and label
                    var data = '';
                    var cl = '';
                    if(key=='googleplus')
                    {
                        var url = document.URL;
                        data = 'data-contenturl="'+url+'" data-calltoactionurl="'+url+'" data-clientid="'+$social.setup.id.googleplus+'" data-cookiepolicy="none" data-prefilltext="Invite your friends from GooglePlus!" data-calltoactionlabel="INVITE"';
                        cl = 'g-interactivepost';//for googleplus button
                    }
                    social_icons += '<span class="social_icon '+cl+'" data-action="'+action+'" data-platform="'+key+'" style="cursor:pointer;" '+data+'>';
                    social_icons += html ? html :'<span class="'+icon+'" ></span><span class="name" style="margin-left:3px">'+label+'</span>';
                    social_icons += '</span>';
                }
                else
                    console.log('Could not find any social handles specified as '+platform+' in $social.'+type+'_platforms');
            }
            social_icons += '</div>';
            $(to).html(social_icons);
            action=='invite' ?$(to).attr('data-url',document.URL) :null;
        }
    },
    login:function(obj)
    {
        var platform = $(obj).data('platform');
        console.log('logging in with '+platform)
        var resp = {success:false};
        if(!platform)
        {
            resp.msg = 'Platform type (e.g., facebook, google_plus) not specified. Requested terminited.';
            console.log('Error in login: '+resp);
            return resp;
        }
        platform = platform.toLowerCase().split(' ').join('');//replace space
        $social.platform = platform;
        if(platform=='facebook')
        {
            facebookLogin();
        }
        else if(platform=='google_plus')
        {

        }
    },
    invite:function(obj)
    {
        var $obj = $(obj);
        var platform = $obj.data('platform');
        var $parent = $obj.parent().closest($social.invite_container);
        var url = $parent.attr('href') ?$parent.attr('href') :($parent.attr('data-url') ?$parent.attr('data-url') :document.URL);

        if(platform=='facebook')
            facebookSendInvite(url,$social.onInviteSuccess);
        else if(platform=='linkedin')
            onLinkedinInvite();
        else if(platform=='googleplus')
            gapi.interactivepost.render();
    },
    getProfile:function(response)
    {
        var platform = $social.platform;
        var resp = {success:false};
        if(!platform)
        {
            resp.msg = 'Platform type (e.g., facebook, google_plus) not specified. Requested terminited.';
            console.log('Error in getProfile: '+resp);
            return resp;
        }
        if(platform=='facebook')
            facebookGetProfile(response);
    },
    onLoginSuccess:function(data)
    {
        var callback = this.onLogin ?this.onLogin :null;
        if(callback)
            callback(data)
        else
            cosole.log(data);
    },
    loginFail:function(data)
    {
        var callback = $social.onLoginFail;
        var response = {};
        response.response = data.authResponse;
        var status = data.status;
        if(status=='not_authorized')
            status = 'user_cancelled';
        response.status = status;
        if(!callback)
        {
            console.log('Login via '+$social.platform+' failed with following response:');
            return;
        }
        callback(response,$social.platform);
    },
    onInviteSuccess:function(response)
    {
        if(!response)
        {
            console.log('An unknown error occurred while inviting.');
        }
        console.log(response);
    },
    onInviteFail:function(response)
    {
      console.log(response);
    },
    updateInviteLinks:function(container)
    {
        var $obj = $(container);
        var url = $obj.attr('href') ?$obj.attr('href') :($obj.attr('data-url') ?$obj.attr('data-url') :document.URL);
        var data = {googleplus:{}, facebook:{}};
        //url = 'http://example.com';
        var temp = url.split('/');
        var found = false;
        for(var i=0; i<temp.length && !found; i++)
        {
            if(temp[i].match(/parentune/i))
                found = true;
            temp[i] = null;
        }
        temp = temp.join('/');
        var deeplink = temp;
        data.googleplus.clientid = $social.setup.id.googleplus;
        data.googleplus.cookiepolicy = 'none';
        data.googleplus.contenturl = url;
        data.googleplus.contentdeeplinkid = deeplink;
        data.googleplus.calltoactionurl = url;//this must match with contenturl
        data.googleplus.calltoactiondeeplinkid = deeplink;//this must match with contenturl
        data.googleplus.prefilltext = 'Share with your friends on GooglePlus!';//this must match with contenturl

        $obj = $(document).find($social.invite_container);
        $obj = $obj.find('.social_icon[data-platform="googleplus"]');
        var btn_id = $obj.attr('id');
        if(!btn_id)
        {
            var btn_id = 'rand_'+Math.floor(Math.random()*100000000)+new Date().getTime();
            $obj.attr('id',btn_id);
        }
        //gapi.interactivepost.render(btn_id, data.googleplus);
        $(data.googleplus).each(function(key,val)
        {
            $(btn_id).attr(key,val);
        })
    }
};

function facebookLogin()
{
    var permissions = {scope:'email,user_friends,user_birthday',display:'popup'};
    var platform = $social.platform;
    if($social.retry.login[platform])
    {
        permissions.auth_type = 'rerequest';
    }
    FB.login(function(response)
    {
        console.log(response)
        if(!response.authResponse)
        {
            $social.loginFail(response);
            return false;
        }
        else if(response.status=='connected')
        {
            $social.getProfile(response);
        }
        else
        {
            $social.loginFail(response);
            return false;
        }
    },permissions);
    //user_friends does not require review: https://developers.facebook.com/docs/facebook-login/permissions/v2.3#optimizing
}
function facebookGetProfile()
{
    FB.api('/me',
        {fields:'first_name, middle_name, last_name, name, email, gender, birthday, age_range',display:'dialog'},
        function(response)
        {
            var data = {Email:[{Value:''}], Friends:{}, Images:{}, BirthDate:''};
            //convert data in LoginRadius format to avoid further changes
            data.Email[0].Value = response.email;
            if(!response.email)
            {
                $social.retry.login[$social.platform] = true;
                //so that asks for email permissions in next attempt
                response.status = 'email_missing';
                $social.loginFail(response);
                return;
            }
            data.FullName = response.name;
            data.FirstName = response.first_name ?response.first_name :null;
            data.MiddleName = response.middle_name ?response.middle_name :null;
            data.LastName = response.last_name ?response.last_name :null;
            if(response.birthday)//in format mm/dd/yyyy
            {
                var temp = response.birthday.split('/');
                data.BirthDate = temp[2]+'-'+temp[0]+'-'+temp[1];
            }
            if(response.gender)
                data.Gender = response.gender[0];//pick first alphabet of gender; m/f
            FB.api('/me/friends',{fields:'name,id'},function(friends)
            {
                data.Friends.count = friends.summary ?friends.summary.total_count :'unknown';

                data.Images.thumb = "https://graph.facebook.com/" + response.id + "/picture";
                FB.api("/me/picture?width=300&height=300",  function(picture)
                {
                    if(picture.data)
                    {
                        data.Images.large = picture.data.url;
                        data.ImageUrl = data.Images.large;
                    }
                    $social.onLoginSuccess(data);
                });
            });
        })
}
function facebookSendInvite(url_link,callback)
{
    //url_link = baseURL+url_link;
    //url_link = 'http://www.parentune.com/parent-talk';
    var is_mobile = navigator.userAgent.match(/(Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini)/i);
    //this works for mobile only and returns
    if(is_mobile)
    {
        var return_url = document.URL.split('#')[0]+'#closeSocialInvite';
        //var return_url = 'http://parentune.com/#closeSocialInvite';
        window.open('http://www.facebook.com/dialog/share?app_id='+$social.setup.id.facebook+'&href='+encodeURI(url_link)+'&redirect_uri='+return_url+'&display=touch');
        return true;
    }
    //This works on web only
    FB.ui({
        method: 'send',
        link: url_link,
        display:'popup'
    },function(response)
    {
        // console.log(response);
        if(callback && typeof(callback)==='function')
            callback(response);
    });
}

// End: Google Plus
var in_init = false;
function onLinkedInLoad()
{
    IN.Event.on(IN, "auth", function()
    {
        api_key = 'your-linked-in-api-key';
        authorize = true;
        in_init = true;
        onLinkedInAuth();
    });
}

function onLinkedInAuth()
{
    if(!in_init)
    {
        $alert.show('Page is still loading. Please wait..');
        return;
    }
    IN.API.Profile("me")
        .fields('id', "email-address")
        .result(function(profiles)
        {
            member = profiles.values[0];
            var data = Array();
            // response.id = member.id;
            data['email'] = member.emailAddress;
            data['name'] = '';
            data['dob'] = '';
            openLogin(data,member);
        });
}
function onLinkedinInvite()
{
    // Build the JSON payload containing the content to be shared
    var payload = {
        "comment": "Check out developer.linkedin.com! http://linkd.in/1FC2PyG",
        "visibility": {
            "code": "anyone"
        }
    };

    IN.API.Raw("/people/~/shares?format=json")
        .method("POST")
        .body(JSON.stringify(payload))
        .result($social.onInviteSuccess)
        .error($social.onInviteFail);
}