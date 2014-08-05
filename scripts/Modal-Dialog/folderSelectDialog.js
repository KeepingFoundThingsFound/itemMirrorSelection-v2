/**
 *
 *
 */

    
//TODO make it so you can pass in a delimiter
function modalFolderSelect(ItemMirror) {
      var DELIMITER = "#";
      var MAXFOLDERS = 200;
      
      DELIMITER = "#";
      MAXFOLDERS = 200;
      
      groupingItemURI = "/";
      itemMirrorOptions[1].groupingItemURI = groupingItemURI;
      itemMirrorOptions[3].groupingItemURI = groupingItemURI;
      var self = this;
      this.run = function() {
        dropboxClient.authenticate(function (error, client) {
            this.DELIMITER = "#";
          if (error) {
            throw error;
          }
          self.constructNewItemMirror();
        });
      };
      
      //Construct an itemMirror object and do something with it
      this.constructNewItemMirror = function() {
        var $modalDia = $('#modalDialog div.modal-body div');
        new ItemMirror(itemMirrorOptions[3], function (error, itemMirror) {
          if (error) { throw error; }
          console.log("Created new itemMirror");
          self.listAssociations(itemMirror, $modalDia);
        });
      };
  
      //get an array of Association GUIDs and do something with it.
      this.listAssociations = function(itemMirror, $dest, groupingItemURI){
            var displayText;
            //Limit output to x associations
            var cap = this.MAXFOLDERS;
            var length;
            console.log(itemMirror);
            //$('a#upOneLvl').remove();
            //$('#modalDialog div.modal-body ul').empty();
            $('div#modalDialog div.modal-footer p').remove();
            $('div#modalDialog div.modal-footer').prepend($('<p>',{text: groupingItemURI}).css('float', 'left'));
           itemMirror.listAssociations(function (error, GUIDs){
            //itemMirror.getParent(function(error, parent){
            //  if (parent) {
            //    self.upOneLevel(parent);
            //  }
            //});
            if (GUIDs.length >= cap) {
              length = cap
            }else {
              length = GUIDs.length
            }
            for (var i=0;i<length;i++){
              itemMirror.getAssociationDisplayText(GUIDs[i], function(error, text){
                displayText = text;
                //Check if this Association is a Grouping Item (a folder in the case of dropbox)
              });
              //Print the Association
              self.prntAssoc(error, displayText, GUIDs[i], itemMirror, $dest);
            }
            if (error) {
              console.log(error);
            }
          });
      };
  
      //Event handler for navigating into a subfolder/child grouping item
      //you've clicked on
      this.createItemMirrorFromGroupingItem = function(GUID, itemMirror, $dest) {
          //var itemMirror = event.data.itemmirror;
          //var GUID = event.data.guid;
          console.log("Now creating a grouping item for " + GUID);
          itemMirror.createItemMirrorForAssociatedGroupingItem(
            GUID, function (error, newItemMirror) {
            if (error) { throw error; }
            newItemMirror.getGroupingItemURI(function (error, groupingItemURI) {
                  self.listAssociations(newItemMirror, $dest, groupingItemURI);
                  //$('div#modalDialog button').click(function (e) {
                  //      console.log(groupingItemURI);
                  //      window.location.assign(window.location.href + this.DELIMITER + groupingItemURI);
                   //     //window.location.reload();
                  //});
            });
          });
      };
      
      this.goToFolder = function(GUID, itemMirror){
            itemMirror.createItemMirrorForAssociatedGroupingItem(
                  GUID, function (error, newItemMirror) {
                  if (error) { throw error; }
                  newItemMirror.getGroupingItemURI(function (error, groupingItemURI) {
                              console.log(groupingItemURI);
                              window.location.assign(window.location.href + this.DELIMITER + groupingItemURI);
                              window.location.reload();
                  });
            });
      }
  
      this.alertSchemaVersion = function (itemMirror) {
        // Most "get" methods follow this pattern. Check documentation to be sure.
        itemMirror.getSchemaVersion(function (error, schemaVersion) {
          if (error) {
            throw error;
          }
          alert(schemaVersion);
        });
      };
  
      /**
       *The Printout for individual iM Associations
       *Uses jQuery to manipulate the DOM
       **/
      this.prntAssoc = function(error, displayText, GUID, itemMirror, $dest){
        if (error) {
            throw error;
        }
        
        itemMirror.isAssociatedItemGrouping(GUID, function(error, isGroupingItem){
          if (isGroupingItem) {
              //console.log("GUID is " + GUID);
              //console.log("break");
              var $thisAssoc;
              $thisAssoc = $('<a>', {'text': " " + displayText, 'class': "list-group-item"}).click(function(event){
                  event.preventDefault();
                  var target = $( event.target );
                  if (event.target != this) {
                          return;
                  }
                        $('div#modalDialog button').remove();
                        //$( this ).children('span').click();
                        $('#modalDialog div a.active').removeClass("active")
                        $( this ).addClass("active");
                        $thisAssoc.append($('<button>', {'text': "Open this Folder", 'type':"button", 'class':"btn btn-primary"}).click(function(){
                              $thisAssoc.dblclick();      
                        }));
                  
              }).dblclick(function(){
                  self.goToFolder(GUID, itemMirror);
              });
              $thisAssoc.prepend($('<span>', {class:'glyphicon glyphicon-chevron-right'}).click(function(){
                  if ($thisAssoc.children("div").length == 0) {
                        $subIM = $('<div>', {'class': "list-group"});
                        $thisAssoc.append($subIM);
                        self.createItemMirrorFromGroupingItem(GUID, itemMirror, $subIM);
                  }
                  if ($( this ).hasClass("glyphicon-chevron-right")) {
                        $( this ).removeClass("glyphicon-chevron-right");
                        $( this ).addClass("glyphicon-chevron-down");
                        $thisAssoc.children("div").show();
                  }else{
                        $( this ).removeClass("glyphicon-chevron-down");
                        $( this ).addClass("glyphicon-chevron-right");
                        $thisAssoc.children("div").hide();
                  }
                    
              }));
              //$thisAssoc.bind("click",{guid:GUID, itemmirror:itemMirror},self.createItemMirrorFromGroupingItem);
            $dest.append($thisAssoc);
          }
        });
        
      };
      /**
      //Print an up one level button or link
      this.upOneLevel = function(parent) {
        $('a#upOneLvl').remove();
        $('<a>', {'class': "btn btn-primary btn-sm active", 'href':"#" + parent._groupingItemURI, 'text':"^ Up One Level ^", id: "upOneLvl"}).on("click", function(){
       $('<a>', {'href':"#" + parent._groupingItemURI, 'text':"^ Up One Level ^", id: "upOneLvl"}).on("click", function(){
          if (parent) {
            self.listAssociations(parent, parent._groupingItemURI)
           }
       }).insertBefore('#modalDialog div.modal-body ul');
      });
      
  }**/
}
    //modalFolderSelect.run(); this would start the script, call this from your application.

  //});