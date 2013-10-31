(function() {
var container = document.querySelector('#style-ex-distributed');
var root = container.createShadowRoot();
root.innerHTML = '<style>b{ color: red; }' + 
                 'content::-webkit-distributed(b) { color: green; }' + 
                 '</style>' + 
                 '<b>Заголовок, принадлежащий теневому дереву</b>' +
                 '<content select="b"></content>';
})();