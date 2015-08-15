# js-social-plugin
Use this plugin to integrate social login/ social actions (share, invite, etc.) using JavaScript (requires jQuery). Quick, easy and tested.
Currently, it support social login for Facebook and GooglePlus only. Shall be extended in future. Also supports Social invite for Facebook and GooglePlus.

<b>How to use:</b>
include following code in head section of your html
<code>
<script type='text/javascript' src='https://github.com/cseer90/js-social-plugin/blob/master/social.plugin.js'>
$social.setup.id.facebook = 'add-your-facebook-app-id-here';
$social.setup.id.googleplus = 'add-your-googleplus-app-id-here';

$social.login_platforms = ['facebook','googleplus'];//currently supports these two only
$social.invite_platforms = ['facebook','googleplus'];//currently supports these two only
$social.login_container = '.login_buttons';//wrapper ID or class where social login buttons should be placed
$social.invite_container = '.invite_buttons';//wrapper ID or class where social invite buttons should be placed
$social.onLoginSuccess = 'your-function-name';//function that should be called after successful login
$social.onLoginFail = 'your-function-name';//function that should be called after login fails
$social.onInviteSuccess = 'your-function-name';//function that should be called on successful sharing
</code>
