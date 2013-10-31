(function() {
var container = document.querySelector('#style-ex-scoped');
var root = container.createShadowRoot();
root.innerHTML = "<style>h3{color: red;}</style><h3>Заголовок, принадлежащий теневому дереву</h3>";
})();