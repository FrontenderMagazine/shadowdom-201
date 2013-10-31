var root = document.querySelector('div').webkitCreateShadowRoot();
root.innerHTML = '<style>' + 
                       'b{ color: red; }' + 
                       'content::-webkit-distributed(b) { color: green; }' + 
                     '</style>' + 
                     '<b>Заголовок, принадлежащий теневому дереву</b>' +
                     '<content select="b"></content>';