#ItemMirror Folder Select#

## 3 Different Versions ##
1. Pop-Up Folder Select Dialog
2. Panel Sidebar (Not yet implemented)
3. Redirect from a "Start" Screen (Referred to as Splash or Splash Screen)

##Variables ##
'''
//3
var DESTURL = 'index.html'; // the page you want to redirect to and append the path after
//1,2,3
var MAXFOLDERS = 200; // how many folders to list out
//1,3
var DELIMITER = "#"; // ?, ?/, and #/
'''

##Redirect/Path String Append ##
Redirection and Path String Append use the DELIMITER variable to append the grouping Item URI to the URL so that the initial grouping item can be set during the Page Load Document.Ready.
Use ? (used in PHP) or # (used in Angular as #/ and as HTML anchors) so that the path does not get misinterpreted as part of the path to an actual file.
Popup modal (1) and Redirect from "Start" Screen (2) uses this.

```
window.location.assign(window.location.href + this.DELIMITER + groupingItemURI);
window.location.reload();
```

###Pop-up Folder Select Dialog ###
- scripts/Modal-Dialog/folderSelectDialog.js

Dependencies: Bootstrap, jQuery

*LIMITATIONS: If your application is scoped inside a require() requirejs function call, you need to add it as a dependency in order to call the scoped "run" function.*
Currently it's implemented as Redirect/Path String Append. It can be modified to call a function and run another script, however the above limitation needs to be overcome before doing so.

USAGE:
From your application, you would construct a new modalFolderSelect object and pass in your ItemMirror variable.
Then run show to show the modal.
```
      var folderSelect = new modalFolderSelect(ItemMirror);
      folderSelect.run();
      $('#modalDialog').modal('show');
```

###Panel Sidebar (Not yet implemented) ###
- Coming Soon

###Redirect from a "Start" Screen (Referred to as Splash or Splash Screen) ###
- scripts/Splash-Screen/folderSelectSplash.js
- splash.html

Dependencies: Bootstrap, jQuery

*LIMITATIONS: The only way this would work is through URL Redirect. *
Configure DESTURL variable to be the relative address ("index.html") or absolute address ("http://www.example.com/index.html")
