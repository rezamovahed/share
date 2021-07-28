window.__NUXT__=(function(a,b,c,d,e,f,g,h){return {staticAssetsBase:"\u002Fshare\u002F_nuxt\u002Fstatic\u002F1627433315",layout:"default",error:d,state:{categories:{en:{"Getting started":[{slug:"index",title:e,category:a,to:"\u002F"},{slug:"installation",title:a,category:a,to:"\u002Finstallation"},{slug:"configuration",title:"Configuration",category:a,to:"\u002Fconfiguration"},{slug:"docker",title:"Docker",category:a,to:"\u002Fdocker"},{slug:"sendgrid",title:"Sendgrid",category:a,to:"\u002Fsendgrid"}],API:[{slug:"api",title:e,category:b,to:f},{slug:"api-apikey",title:"API Key",category:b,to:"\u002Fapi-apikey"},{slug:"api-auth",title:"Auth",category:b,to:"\u002Fapi-auth"},{slug:"api-user",title:"User",category:b,to:"\u002Fapi-user"},{slug:"api-account",title:"Account",category:b,to:"\u002Fapi-account"},{slug:"api-3rd-party",title:"3rd Party",category:b,to:"\u002Fapi-3rd-party"}],Community:[{slug:"releases",title:"Releases",category:"Community",to:"\u002Freleases"}]}},releases:[{name:"4.2.0",date:"2020-05-29T17:06:51Z",body:"\u003Cul\u003E\n\u003Cli\u003EAdded tags to uploads which you can add when uploading and or after the fact.\u003C\u002Fli\u003E\n\u003Cli\u003EAdded tags to the API v1 in the body.\u003C\u002Fli\u003E\n\u003Cli\u003EFixed bug where you search for something that is not found it would spam the server.\u003C\u002Fli\u003E\n\u003Cli\u003EAdded link shorter (with features such as link click tracking and limit of clicks.) also can get the link data from the API, delete the link , and create a link.\u003C\u002Fli\u003E\n\u003Cli\u003EAdded Upload file name set via editing it after and also being able to add it while uploading via the API v2.\u003C\u002Fli\u003E\n\u003Cli\u003Ev2 API will be taking over API v1 in future updates.  Would be good to move over as soon as you can. \u003C\u002Fli\u003E\n\u003Cli\u003EView page is back for support with currently only being images.\u003C\u002Fli\u003E\n\u003Cli\u003EFixed some of the validation.\u003C\u002Fli\u003E\n\u003Cli\u003EAdded support for exporting of your data such as links,uploads, account and other data.\u003C\u002Fli\u003E\n\u003Cli\u003EAdded links to what get removed when you delete your account.\u003C\u002Fli\u003E\n\u003Cli\u003EAdded focus to the modals.\u003C\u002Fli\u003E\n\u003Cli\u003ERemoved old userlist code.\u003C\u002Fli\u003E\n\u003Cli\u003EAdded terms page editer in owner plus a page for it to be displayed if it&#39;s enabled.\u003C\u002Fli\u003E\n\u003Cli\u003EAdded a logger for logging the made on the app.\u003C\u002Fli\u003E\n\u003Cli\u003EAdded new env variable for LOGGER so you can enable or disable that feature.\u003C\u002Fli\u003E\n\u003Cli\u003EAdded better stableness due to try catching everything,\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n"},{name:"4.1.0",date:"2020-04-28T17:02:17Z",body:"\u003Cul\u003E\n\u003Cli\u003EFixed bug in pm2 echosystem file.\u003C\u002Fli\u003E\n\u003Cli\u003EFixed missing UPLOAD_LIMIT env.\u003C\u002Fli\u003E\n\u003Cli\u003EFixed bug where it shows dev even in prod in footer.\u003C\u002Fli\u003E\n\u003Cli\u003EFixed signup disabled middleware.\u003C\u002Fli\u003E\n\u003Cli\u003ERemoved the display of signup links on all pages if they are disabled.\u003C\u002Fli\u003E\n\u003Cli\u003EYou can now disable the \u002Fowner route to make it return a 404.\u003C\u002Fli\u003E\n\u003Cli\u003EFixed front-end bug where it wont display the right token created date.\u003C\u002Fli\u003E\n\u003Cli\u003EFixed the tests bug due to not removing mfa on the test account.\u003C\u002Fli\u003E\n\u003Cli\u003EFixed bug where if you edited yourself in the admin panel it will make you a user.\u003C\u002Fli\u003E\n\u003Cli\u003EFixed bug where the last login date wont show the right one.\u003C\u002Fli\u003E\n\u003Cli\u003EAdded account space used.  WIth rate limited requests.\u003C\u002Fli\u003E\n\u003Cli\u003EAdded admin dashboard space used.  And removed the users count.\u003C\u002Fli\u003E\n\u003Cli\u003EWhen logged in you can now make config files for supported uploads by pasting your token in and then picking a uploader.\u003C\u002Fli\u003E\n\u003Cli\u003EAdded tests for the config.\u003C\u002Fli\u003E\n\u003Cli\u003EFixed bug on check for username or email when signing up.\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n"},{name:"4.0.1",date:"2020-03-20T14:05:22Z",body:"\u003Cul\u003E\n\u003Cli\u003EFixed a bug where users can still create accounts even when signups are disabled (Hotfix)\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n"},{name:"4.0.0",date:"2020-03-17T16:08:20Z",body:"\u003Cp\u003E\u003Cstrong\u003EThis is a fair big of a update but this is a list &quot;all&quot; changes that have been made\u003C\u002Fstrong\u003E\u003C\u002Fp\u003E\n\u003Cul\u003E\n\u003Cli\u003EMade a lot of the code cleaner and easier to mange for developers\u003C\u002Fli\u003E\n\u003Cli\u003EAdded last login date and location\u003C\u002Fli\u003E\n\u003Cli\u003EAdded logo and favicon support\u003C\u002Fli\u003E\n\u003Cli\u003EAdded Service worker and PWA support (this is in very beta).\u003C\u002Fli\u003E\n\u003Cli\u003ESwitched to bower for frameworks (Must npm i again).\u003C\u002Fli\u003E\n\u003Cli\u003EAdded transfer ownership.\u003C\u002Fli\u003E\n\u003Cli\u003EAdded MFA.\u003C\u002Fli\u003E\n\u003Cli\u003EAdded a verify checkmark.\u003C\u002Fli\u003E\n\u003Cli\u003ERedesigned and redo of the upload,token and user lising pages.\u003C\u002Fli\u003E\n\u003Cli\u003EAdded Tests.\u003C\u002Fli\u003E\n\u003Cli\u003ERemoved avatars.\u003C\u002Fli\u003E\n\u003Cli\u003EAdded new docs.\u003C\u002Fli\u003E\n\u003Cli\u003ESwitched to sendgrid official mailer\u003C\u002Fli\u003E\n\u003Cli\u003EChanged from csurf to lusca.\u003C\u002Fli\u003E\n\u003Cli\u003EChanged the routes.\u003C\u002Fli\u003E\n\u003Cli\u003EChanged from passport-local-mongoose to passport-local.\u003C\u002Fli\u003E\n\u003Cli\u003EIntegrated Docker both for development and production modes.  Thanks to @exia for adding this.\u003C\u002Fli\u003E\n\u003Cli\u003EAdding a better way to handle the emails.  As there is so many templates that are just reused.  For easier reuse.\u003C\u002Fli\u003E\n\u003Cli\u003EAdded Streamer mode.  It will stop leaks for both the user and if they have admin others as well.\u003C\u002Fli\u003E\n\u003Cli\u003ENow you can make yourself owner  by going to \u002Fowner.  If the email matches the one in the env then it will change the account to owner (This is safe as the email has to be verified anyways which makes sure its yours.).\u003C\u002Fli\u003E\n\u003Cli\u003EAPI route has been changed file and image route to just be as one.\u003C\u002Fli\u003E\n\u003Cli\u003EAll upload lists have been reworked to be faster.\u003C\u002Fli\u003E\n\u003Cli\u003EYou can now limit the size of each upload by default its 100M.\u003C\u002Fli\u003E\n\u003Cli\u003EFixed dashboard so it will add a &#39;s&#39; when there is more the one user or upload.\u003C\u002Fli\u003E\n\u003Cli\u003EAdded suspend users 24 hours , a week, and even a month. With unsuspend.\u003C\u002Fli\u003E\n\u003Cli\u003EAdded ban and unban users. Confirm the ban of a user has been added.\u003C\u002Fli\u003E\n\u003Cli\u003EChanged text from &#39;Create user&#39; to &#39;Create new user&#39; in admin users.\u003C\u002Fli\u003E\n\u003Cli\u003EFixed the link in the admin nav gallery.  Now it links to the gallery.\u003C\u002Fli\u003E\n\u003Cli\u003EFixed the navbar in admin gallery as it was linking the wrong one.\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n"},{name:"3.1.2",date:"2019-08-20T13:39:09Z",body:"\u003Cul\u003E\n\u003Cli\u003EHotfix for createdAt date in the upload.js. Now when  you upload it should show the right date.\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n"},{name:"3.1.1",date:"2019-05-12T00:46:15Z",body:"\u003Cul\u003E\n\u003Cli\u003EFixed bug with middleware\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n"},{name:"3.1.0",date:"2019-05-12T00:43:13Z",body:"\u003Cul\u003E\n\u003Cli\u003ERemoved File and Text views\u003C\u002Fli\u003E\n\u003Cli\u003ERemoved Removed text support due to others being better. (You should use github gists if anything.)\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n"},{name:"3.0.1",date:"2019-04-15T14:54:27Z",body:"\u003Cul\u003E\n\u003Cli\u003EAdded Dec to image and files\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n"},{name:"3.0.0",date:"2019-04-13T16:41:22Z",body:"\u003Cul\u003E\n\u003Cli\u003EBetter Gallery\u003C\u002Fli\u003E\n\u003Cli\u003EAdded support for proxy more\u003C\u002Fli\u003E\n\u003Cli\u003ENow the upload link will add https based on the proxy and even the domain of the server\u003C\u002Fli\u003E\n\u003Cli\u003EFixed login bug with tokens via the proxy trust\u003C\u002Fli\u003E\n\u003Cli\u003EUpdated env template\u003C\u002Fli\u003E\n\u003Cli\u003EAdded psd, doc, docx, xls, xlsx file support.\u003C\u002Fli\u003E\n\u003Cli\u003EAdded better ZIP upload support\u003C\u002Fli\u003E\n\u003Cli\u003EChanged to npm start from npm run web\u003C\u002Fli\u003E\n\u003Cli\u003EAdded templates for sharex imput (All you have to do is replace the name and add your API key)\u003C\u002Fli\u003E\n\u003Cli\u003EAdded robots.txt.\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n"},{name:"2.0.0",date:"2019-04-03T00:59:28Z",body:"\u003Cul\u003E\n\u003Cli\u003EMany changes\u003C\u002Fli\u003E\n\u003Cli\u003EBetter upload URLs\u003C\u002Fli\u003E\n\u003Cli\u003EView pages for files, images, and text\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n"},{name:"1.0.0",date:"2019-03-29T20:23:12Z",body:"\u003Cp\u003EThe official version is out ✨\u003C\u002Fp\u003E\n"}],settings:{title:"Share",url:"https:\u002F\u002Fmrdemonwolf.github.io\u002Fshare\u002F",defaultDir:"docs",defaultBranch:"master",filled:c,logo:{light:"\u002Fshare\u002Flogo-text.svg",dark:"\u002Fshare\u002Flogo-text-dark.svg"},github:"MrDemonWolf\u002Fshare",twitter:"MrDemonWolf"},menu:{open:g},i18n:{routeParams:{}}},serverRendered:c,routePath:f,config:{_app:{basePath:"\u002Fshare\u002F",assetsPath:"\u002Fshare\u002F_nuxt\u002F",cdnURL:d},content:{dbHash:"e20a9b42"}},__i18n:{langs:{en:{search:{placeholder:"Search the docs (Press \"\u002F\" to focus)"},toc:{title:"On this page"},article:{github:"Edit this page on GitHub"}}}},colorMode:{preference:h,value:h,unknown:c,forced:g}}}("Getting started","API",true,null,"Introduction","\u002Fapi",false,"system"));