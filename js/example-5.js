(function() {
var container = document.querySelector('#style-ex-distributed');
var root = container.createShadowRoot();
root.innerHTML = '<style>p{ color: red; }' + 
                 'content::-webkit-distributed(b) { color: green; }' + 
                 '</style>' + 
                 '<p>Заголовок, принадлежащий теневому дереву</p>' +
                 '<content select="p"></content>';
})();