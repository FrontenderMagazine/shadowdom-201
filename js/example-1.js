(function() {
var container = document.querySelector('#style-ex-scoped');
var root = container.createShadowRoot();
root.innerHTML = "<style>b{color: red;}</style><b>Заголовок, принадлежащий теневому дереву</b>";
})();