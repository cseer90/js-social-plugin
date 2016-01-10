# js-social-plugin
Use this plugin to integrate social login/ social actions (share, invite, etc.) using JavaScript (requires jQuery). Quick, easy and tested.
Currently, it support social login for Facebook and GooglePlus only. Shall be extended in future. Also supports Social invite for Facebook and GooglePlus.

<b>How to use:</b><br>
include following code in head section of your html<br>
<code>
<script type='text/javascript' src='https://github.com/cseer90/js-social-plugin/blob/master/social.plugin.js'></script><br>
$social.setup.id.facebook = 'add-your-facebook-app-id-here';<br>
$social.setup.id.googleplus = 'add-your-googleplus-app-id-here';<br>

$social.login_platforms = ['facebook','googleplus'];<br>//currently supports these two only<br>
$social.invite_platforms = ['facebook','googleplus'];<br>//currently supports these two only<br>
$social.login_container = '.login_buttons';<br>//wrapper ID or class where social login buttons should be placed<br>
$social.invite_container = '.invite_buttons';<br>//wrapper ID or class where social invite buttons should be placed<br>
$social.onLoginSuccess = 'your-function-name';<br>//function that should be called after successful login<br>
$social.onLoginFail = 'your-function-name';<br>//function that should be called after login fails<br>
$social.onInviteSuccess = 'your-function-name';<br>//function that should be called on successful sharing<br>
</code>
