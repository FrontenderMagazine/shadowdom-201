(function() {
var container = document.querySelector('#style-ex-distributed');
var root = container.createShadowRoot();
root.innerHTML = '<style>h3{ color: red; }' + 
                 'content::-webkit-distributed(h3) { color: green; }' + 
                 '</style>' + 
                 '<h3>Заголовок, принадлежащий теневому дереву</h3>' +
                 '<content select="h3"></content>';
})();