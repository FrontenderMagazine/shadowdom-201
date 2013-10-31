(function() {
var container = document.querySelector('#style-athost-ex2');
var root = container.createShadowRoot();
root.innerHTML = '<style>\
     @host {\
      * {\
        opacity: 0.4;\
        -webkit-transition: opacity 200ms ease-in-out;\
      }\
      *:active { position:relative;top:3px;left:3px; }\
      *:hover {\
        opacity: 1;\
      }\
    }</style><content select=""></content>';
})();