// ==UserScript==
// @include http://www.youtube.com/watch?*
// @include https://www.youtube.com/watch?*
// @match http://www.youtube.com/watch?*
// @match https://www.youtube.com/watch?*
// ==/UserScript==
(function() {
  function injectScript() {
    var BUTTOM_ID = "send-to-songcloud";
    var URL_SVC = 'http://emotizoo.siteprofissional.com/mzk/addvideo.php?Video=';
    
    // Se já existe, não faz nada
    if(document.getElementById(BUTTOM_ID)) return;
    
    var isExperiment = false;
    
    // Pegar o ID do video
    var videoPlayer = document.getElementById('watch-player');
    if (videoPlayer == null) {
      videoPlayer = document.getElementById('watch7-player');
      isExperiment = true;
    }
    
    var videoId = null;
    if (videoPlayer && videoPlayer.getAttribute('class').indexOf('html5') == -1) { // Flash
      var flashValues = videoPlayer.innerHTML;
      var videoIdMatches = flashValues.match(/(?:"|\&amp;)video_id=([^(\&|$)]+)/);
      videoId = (videoIdMatches) ? videoIdMatches[1] : null;
    }
    else { // HTML5 (Opera)
      var config = null;
    
      if(window.yt && window.yt.getConfig) {
        config = window.yt.getConfig('PLAYER_CONFIG');
      }
    
      if (config && config.args) {
        var args = config.args;
        videoId = args['video_id'];
      }
    }
    
    if (videoId == null) { // HTML5 (Chrome)
      var bodyContent = document.body.innerHTML; 
      var videoIdMatches = bodyContent.match(/\"video_id\":\s*\"([^\"]+)\"/);
      videoId=(videoIdMatches) ? videoIdMatches[1] : null;
    }
    
    // Não consegui pegar o ID
    if(videoId == null) return;
    
    // Lista de ações
    var parentElement = null;
    var rightElement = null;
    
    if (isExperiment) {
      parentElement = document.getElementById('watch7-action-buttons');
      rightElement = document.getElementById('watch7-sentiment-actions');  
    } else {
      parentElement = document.getElementById('watch-actions');
      rightElement = document.getElementById('watch-actions-right');
    }
    if (parentElement == null) return;
    
    // UI
    var mainSpan = document.createElement('span');
    
    // Propriedades
    var spanButton = document.createElement('span');
    spanButton.setAttribute('class', 'yt-uix-button-content');
    spanButton.appendChild(document.createTextNode('SongCloud'));
    mainSpan.appendChild(spanButton);
    
    var buttonElement = document.createElement('button');
    buttonElement.setAttribute('id', BUTTOM_ID);
    if (isExperiment) {
      buttonElement.setAttribute('class', 'yt-uix-button yt-uix-button-text yt-uix-tooltip yt-uix-button-empty');
      buttonElement.setAttribute('style', 'margin-left:10px;');
    } else {
      buttonElement.setAttribute('class', 'yt-uix-button yt-uix-button-default yt-uix-tooltip yt-uix-tooltip-reverse');
    }
    buttonElement.setAttribute('data-tooltip-text', 'Enviar para o SongCloud');  
    buttonElement.setAttribute('type', 'button');
    buttonElement.addEventListener('click', function() {
      var xhr = new window.XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if(xhr.readyState == 4) {
          if(xhr.status == 200) {
            alert(xhr.responseText);
          } else {
            alert(xhr.status);
          }
        }
      }
      xhr.open("GET", URL_SVC + videoId, true);
      xhr.send();
    }, false);
    buttonElement.appendChild(mainSpan);
                        
    // add the button
    var containerSpan=document.createElement('span');
    containerSpan.setAttribute('id', 'songcloud-youtube-video');
      
    var leftmostButton = document.getElementById('watch-flag') || document.getElementById('watch-transcript') || null;
    
    if (!isExperiment && leftmostButton && leftmostButton.parentNode == parentElement) {
      containerSpan.appendChild(buttonElement);
      containerSpan.appendChild(document.createTextNode(' '));
      parentElement.insertBefore(containerSpan,leftmostButton);
    } else {
      containerSpan.appendChild(document.createTextNode(' '));
      containerSpan.appendChild(buttonElement);
      parentElement.appendChild(containerSpan);
    }
  }
  
  if(window.opera) {
    window.addEventListener('DOMContentLoaded', injectScript, false);
  } else {
    injectScript();
  }
})();