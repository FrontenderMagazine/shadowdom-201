(function() {
var container = document.querySelector('#style-athost');
var root = container.createShadowRoot();
root.innerHTML = '<style>' + 
                     '@host{' + 
                        'button { text-transform: uppercase; text-shadow:none }' +
                        '.bigger { padding: 20px; }' +
                      '}' +
                      '</style>' + 
                      '<content select=""></content>';
})();