
module.exports = function(){

  window.hackdash = window.hackdash || {};

  window.hackdash.getQueryVariable = function(variable){
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split("=");
      if(pair[0] === variable){return decodeURI(pair[1]);}
    }
    return(false);
  };

  if ($.fn.editable){
    // Set global mode for InlineEditor (X-Editable)
    $.fn.editable.defaults.mode = 'inline';
  }

  hackdash.statuses = [
    'brainstorming',
    'researching',
    'prototyping',
    'wireframing',
    'building',
    'releasing'
  ];

  // Init Helpers
  require('./helpers/handlebars');
  require('./helpers/backboneOverrides');

  Placeholders.init({ live: true, hideOnFocus: true });

  window.smoothScroll.init({
    speed: 100,
    easing: 'Linear'
  });

  Dropzone.autoDiscover = false;

  window.hackdash.apiURL = "/api/v2";
};
