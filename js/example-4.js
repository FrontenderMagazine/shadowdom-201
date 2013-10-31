var root = document.querySelector('div').webkitCreateShadowRoot();
 root.applyAuthorStyles = true;
 root.resetStyleInheritance = false;
 root.innerHTML = '<style>h3{ color: red; }</style>' + 
                     '<h3>Заголовок, принадлежащий теневому дереву</h3>' + 
                     '<content select="h3"></content>';