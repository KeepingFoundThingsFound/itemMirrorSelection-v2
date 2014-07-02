  /**
   * If you ever get an error "require is undefined", it's because you have not included the
   * require.js dependency on your page. See the <script> tag in this document ending with
   * "require.js"
   */
  require(["ItemMirror"], function(ItemMirror){
    "use strict";

    dropboxClientCredentials = {
      key: DROPBOX_APP_KEY,
    };

    
//TODO make it so you can pass in a delimiter
function modalFolderSelect() {
      groupingItemURI = "/";
      this.run = function() {
        dropboxClient.authenticate(function (error, client) {
          if (error) {
            throw error;
          }
          constructNewItemMirror();
        });
      };
  
      //Construct an itemMirror object and do something with it
      this.constructNewItemMirror = function() {
        // Construct new ItemMirror in Case 3, could choose other cases
        new ItemMirror(itemMirrorOptions[3], function (error, itemMirror) {
          if (error) { throw error; }
          //SchemaVersion 0.54
          //alertSchemaVersion(itemMirror);
          this.listAssociations(itemMirror);
        });
      };
  
      //get an array of Association GUIDs and do something with it.
      this.listAssociations = function(itemMirror){
            var displayText;
            //Limit output to x associations
            var cap = 75;
            var length;
            console.log(itemMirror);
            $('#modalDialog').empty();
           itemMirror.listAssociations(function (error, GUIDs){
            itemMirror.getParent(function(error, parent){
              if (parent) {
                upOneLevel(parent);
              }
            });
            //make sure length does not exceed cap.
            if (GUIDs.length >= cap) {
              length = cap
            }else {
              length = GUIDs.length
            }
            //var isGroupingItem;
            //loop across GUID up to length
            for (var i=0;i<length;i++){
            //for (var i=0;i<10;i++){
              //code to get displayText and print it out
              //console.log("Reading GUID:" + GUIDs[i]);
              //get Displaytext for Association
              itemMirror.getAssociationDisplayText(GUIDs[i], function(error, text){
                displayText = text;
                //Check if this Association is a Grouping Item (a folder in the case of dropbox)
              });
              //Print the Association
              this.prntAssoc(error, displayText, GUIDs[i], itemMirror);
            }
            if (error) {
              console.log(error);
            }
          });
      };
  
      //Event handler for navigating into a subfolder/child grouping item
      //you've clicked on
      this.createItemMirrorFromGroupingItem = function(event) {
          //event.stopPropagation();
          var itemMirror = event.data.itemmirror;
          //console.log(itemMirror);
          var GUID = event.data.guid;
          //This will always run the constructor on Case 3, but has the added benefit of
          //adding a Parent for successful back-navigation
          console.log("Now creating a grouping item for " + GUID);
          itemMirror.createItemMirrorForAssociatedGroupingItem(
            GUID, function (error, newItemMirror) {
            if (error) { throw error; }
            //console.log(newItemMirror);
            //newItemMirror._groupingItemURI = newItemMirror._groupingItemURI;
            this.listAssociations(newItemMirror);
          });
      };
  
      this.alertSchemaVersion = function (itemMirror) {
        // Most "get" methods follow this pattern. Check documentation to be sure.
        itemMirror.getSchemaVersion(function (error, schemaVersion) {
          if (error) {
            throw error;
          }
          alert(schemaVersion);
          // do something with schemaVersion
        });
      };
  
      /**
       *The Printout for individual iM Associations
       *Uses jQuery to manipulate the DOM
       **/
      this.prntAssoc = function(error, displayText, GUID, itemMirror){
        if (error) {
            throw error;
        }
        //code for print to screen
        var $thisAssoc = $('<div>'/*, {'class':"explorirror"}*/);
        $thisAssoc.append($('<p>', {'text':displayText}))
        itemMirror.isAssociatedItemGrouping(GUID, function(error, isGroupingItem){
          if (isGroupingItem) {
              //console.log("GUID is " + GUID);
              //console.log("break");
              $thisAssoc.prepend($('<span>', {class:'glyphicon glyphicon-folder-close'}));
              //$thisAssoc.prepend($('<img>', {'src':"Folder.png", 'alt':displayText, 'title':displayText}));
              $thisAssoc.bind("click",{guid:GUID, itemmirror:itemMirror},createItemMirrorFromGroupingItem);
          }
          //else{
          //  $thisAssoc.prepend($('<img>', {'src':"Document.png", 'alt':displayText, 'title':displayText}));
          //}
        });
        $('#modalDialog').append($thisAssoc);
      };
      
      //Print an up one level button or link
      this.upOneLevel = function(parent) {
        $('a#upOneLvl').remove();
       $('<a>', {'href':"#" + parent._groupingItemURI, 'text':"^ Up One Level ^", id: "upOneLvl"}).on("click", function(){
          if (parent) {
            this.listAssociations(parent)
             //Event Handler for taking it back to parent
           }
       }).insertBefore('#modalDialog');
      };
  }
    //modalFolderSelect.run(); this would start the script

  });