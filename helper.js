(function(){
  if (!document.addEventListener || !window.JSON) return;

  fullRe = /(?:https?:\/\/)?(?:www\.)?youtube.com\/(watch|playlist)\?(v|list)=([a-zA-Z0-9]+)/i
  shortRe = /(?:https?:\/\/)?youtu.be\/([a-zA-Z0-9]+)(?:\?list=([a-zA-Z0-9]+))?/i
  https://youtu.be/dQw4w9WgXcQ?list=RDdQw4w9WgXcQ

  var parseURL = function(url) {
    var match = fullRe.exec(url);

    var type = 'watch';
    var id;
    if (match){
      type = match[1];
      id = match[3];
    } else {
      match = shortRe.exec(url);

      if (!match)
        return null;

      if (match[2]) {
        type = 'playlist';
        id = match[2];
      } else {
        id = match[1];
      }
    }

    return {type: type, id: id}
  }

  var options = INSTALL_OPTIONS;

  var add = function(){
    for (var i=0; i < options.embeds.length; i++) {
      if (!options.embeds[i].url || !options.embeds[i].location || !options.embeds[i].location.selector) return;

      var info = parseURL(options.embeds[i].url);
      if (!info)
        continue;

      var embed = "//www.youtube.com/embed"

      if (info.type == "watch"){
        embed += "/" + info.id + "?";
      } else {
        embed += "?listType=playlist&list=" + info.id + "&";
      }

      if (options.embeds[i].autoplay){
        embed += "autoplay=1"
      }

      var el = Eager.createElement(options.embeds[i].location);
      el.innerHTML = '<iframe type="text/html" width="640" height="390" src="' + embed + '" frameborder="0"/>'
    }
  }

  if (document.readyState == 'loading')
    document.addEventListener('DOMContentLoaded', add);
  else
    add();
})()
