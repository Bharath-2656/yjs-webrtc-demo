import{w as o,s as h,h as p}from"./index-ByVayODS.js";import"./index-Ci6yQmAz.js";function v(t,e){return(t?l(t,e||{}):void 0)||{type:"root",children:[]}}function l(t,e){const n=d(t,e);return n&&e.afterTransform&&e.afterTransform(t,n),n}function d(t,e){switch(t.nodeType){case 1:return N(t,e);case 3:return y(t);case 8:return w(t);case 9:return f(t,e);case 10:return g();case 11:return f(t,e);default:return}}function f(t,e){return{type:"root",children:m(t,e)}}function g(){return{type:"doctype"}}function y(t){return{type:"text",value:t.nodeValue||""}}function w(t){return{type:"comment",value:t.nodeValue||""}}function N(t,e){const n=t.namespaceURI,c=n===o.svg?h:p,r=n===o.html?t.tagName.toLowerCase():t.tagName,u=n===o.html&&r==="template"?t.content:t,a=t.getAttributeNames(),i={};let s=-1;for(;++s<a.length;)i[a[s]]=t.getAttribute(a[s])||"";return c(r,i,m(u,e))}function m(t,e){const n=t.childNodes,c=[];let r=-1;for(;++r<n.length;){const u=l(n[r],e);u!==void 0&&c.push(u)}return c}export{v as fromDom};
