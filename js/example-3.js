var root = document.querySelector('button').webkitCreateShadowRoot();
root.innerHTML = '<style>' + 
        '@host{' + 
          'button { text-transform: uppercase; }' +
          '.bigger { padding: 20px; }' +
        '}' +
        '</style>' + 
        '<content select=""></content>';