(function() {
var container = document.querySelector('#style-ex-inheritance');
var root = container.createShadowRoot();
root.applyAuthorStyles = true;
//root.resetStyleInheritance = false;
root.innerHTML = '<style>p{color: red;}</style><p>Shadow DOM Title</p><content select="p"></content>';

document.querySelector('#demo-applyAuthorStyles').addEventListener('click', function(e) {
  root.applyAuthorStyles = !root.applyAuthorStyles;
  e.target.textContent = 'applyAuthorStyles=' + root.applyAuthorStyles;
  document.querySelector('#code-applyAuthorStyles').textContent = root.applyAuthorStyles;
});
document.querySelector('#demo-resetStyleInheritance').addEventListener('click', function(e) {
  root.resetStyleInheritance = !root.resetStyleInheritance;
  e.target.textContent = 'resetStyleInheritance=' + root.resetStyleInheritance;
  document.querySelector('#code-resetStyleInheritance').textContent = root.resetStyleInheritance;
});

})();