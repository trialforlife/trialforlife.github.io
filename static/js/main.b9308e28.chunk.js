(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{118:function(e,a,t){e.exports=t(288)},123:function(e,a,t){},125:function(e,a,t){},288:function(e,a,t){"use strict";t.r(a);var n=t(0),r=t.n(n),l=t(16),c=t.n(l),i=(t(123),t(63)),o=t(99),m=t(100),s=t(115),u=t(101),p=t(116),d=(t(125),t(22)),E=t(17),g=t.n(E),f=t(19),b=t.n(f),h=t(23),y=t.n(h),v=function(e){var a=e.id,t=e.img,n=e.title,l=e.price,c=e.desc,i=e.onClick;return r.a.createElement("div",null,r.a.createElement("img",{style:{maxWidth:"100%",maxHeight:"100%"},src:t,alt:""}),r.a.createElement("h2",null,n),r.a.createElement("p",null,"Price: ",l," $"),r.a.createElement("p",null,c),r.a.createElement(y.a,{variant:"contained",color:"primary",onClick:function(){return i({id:a,img:t,title:n,price:l})}},"Buy"))},x=t(104),C=t.n(x),k=t(103),w=t.n(k),j=t(289),N=function(e){var a=e.onCartClick,t=e.classes,n=e.onDriverBtnClick;return r.a.createElement(b.a,{item:!0,xs:12},r.a.createElement(g.a,{className:t.paper},r.a.createElement(y.a,{style:{position:"absolute",left:"2px",top:"22px"},variant:"fab",color:"primary","aria-label":"Login as driver",onClick:n},r.a.createElement(w.a,null,"commute")),r.a.createElement("h2",null,r.a.createElement(j.a,{to:"/"},"Local food grown 50 km from you")),r.a.createElement(j.a,{to:"/cart"},r.a.createElement(y.a,{style:{position:"absolute",right:"2px",top:"22px"},variant:"fab",color:"secondary","aria-label":"Add",onClick:a},r.a.createElement(C.a,null)))))};var O=Object(d.withStyles)(function(e){return{root:{flexGrow:1},paper:{padding:2*e.spacing.unit,textAlign:"center",color:e.palette.text.secondary}}})(function(e){var a=e.classes,t=e.onCartClick,n=e.onProductClick,l=e.onDriverBtnClick;return r.a.createElement("div",{className:a.root},r.a.createElement(b.a,{container:!0,spacing:24},r.a.createElement(N,{classes:a,onCartClick:t,onDriverBtnClick:l}),r.a.createElement(b.a,{item:!0,xs:6},r.a.createElement(g.a,{className:a.paper},r.a.createElement(v,{onClick:n,id:"001",title:"Pepper",desc:"Very good pepper",price:"10",img:"https://choosemyplate-prod.azureedge.net/sites/default/files/styles/food_gallery_colorbox__800x500_/public/myplate/Chili%20Peppers.jpeg?itok=lwuu_nio"}))),r.a.createElement(b.a,{item:!0,xs:6},r.a.createElement(g.a,{className:a.paper},r.a.createElement(v,{id:"002",onClick:n,title:"Tomato",desc:"Very good tomato",price:"15",img:"http://5.imimg.com/data5/KH/QO/MY-45371487/fresh-red-tomato-500x500.jpg"}))),r.a.createElement(b.a,{item:!0,xs:12},r.a.createElement(g.a,{className:a.paper},r.a.createElement("p",null,"Purchase online, get at nearest bus station"))),r.a.createElement(b.a,{item:!0,xs:6},r.a.createElement(g.a,{className:a.paper},r.a.createElement(v,{id:"003",onClick:n,title:"Cucumber",desc:"Very good cucumber",price:"20",img:"https://www.veseys.com/media/catalog/product/cache/image/700x700/e9c3970ab036de70892d86c6d221abfe/s/t/straighteight-straighteight-image-14015newcucumber.jpg"}))),r.a.createElement(b.a,{item:!0,xs:6},r.a.createElement(g.a,{className:a.paper},r.a.createElement(v,{id:"004",onClick:n,title:"Carrot",desc:"Very good carrot",price:"15",img:"https://www.veseys.com/media/catalog/product/cache/image/700x700/e9c3970ab036de70892d86c6d221abfe/n/a/napolicarrot-12710a-image1-1271_napoli.jpg"})))))}),B=t(62),P=t.n(B),_=t(108),D=t.n(_),V=t(110),A=t.n(V),S=t(45),L=t.n(S),I=t(109),W=t.n(I),$=t(111),z=t.n($),F=t(112),G=t.n(F),H=t(64),J=t(41),M=t.n(J);var R=Object(d.withStyles)(function(e){return{container:{display:"flex",flexWrap:"wrap"},textField:{marginLeft:e.spacing.unit,marginRight:e.spacing.unit,width:200}}})(function(e){var a=e.classes;return r.a.createElement("form",{className:a.container,noValidate:!0},r.a.createElement(M.a,{id:"date",label:"Date",type:"date",defaultValue:"2018-10-22",className:a.textField,InputLabelProps:{shrink:!0}}))}),T=[{value:"central",label:"Central"},{value:"zahid",label:"Zahid"}],Y=[{value:"800",label:"8:00"},{value:"900",label:"9:00"},{value:"1000",label:"10:00"}];var K=Object(d.withStyles)(function(e){return{root:{flexGrow:1},paper:{padding:2*e.spacing.unit,textAlign:"center",color:e.palette.text.secondary}}})(function(e){var a=e.classes,t=e.products,n=t.reduce(function(e,a){return e+a.amount*a.price},0);return r.a.createElement("div",{className:a.root},r.a.createElement(b.a,{container:!0,spacing:24},r.a.createElement(N,{classes:a}),r.a.createElement(b.a,{item:!0,xs:12},r.a.createElement(g.a,{className:a.paper},r.a.createElement("h3",null,"My cart"))),r.a.createElement(b.a,{item:!0,xs:12},t.length?r.a.createElement("div",null,r.a.createElement(g.a,{className:a.paper},r.a.createElement(P.a,null,t.map(function(e){var t=e.id,n=e.title,l=e.img,c=e.amount,i=e.price;return r.a.createElement(D.a,{key:t,dense:!0,button:!0,className:a.listItem},r.a.createElement(W.a,{alt:"Remy Sharp",src:l}),r.a.createElement(L.a,{primary:n}),r.a.createElement(L.a,{primary:"".concat(i," $")}),r.a.createElement(L.a,{primary:c}),r.a.createElement(A.a,null,r.a.createElement(z.a,{className:a.button,"aria-label":"Delete"},r.a.createElement(G.a,null))))}),r.a.createElement("p",null,"Total: ",n," $"))),r.a.createElement(g.a,{className:a.paper},r.a.createElement(M.a,{id:"standard-number",label:"Phone",type:"number",fullWidth:!0,margin:"normal"}),r.a.createElement(R,null),r.a.createElement("p",null,"Bus stations near you"),r.a.createElement(H.a,{options:T}),r.a.createElement("p",null,"Delivery time"),r.a.createElement(H.a,{options:Y}),r.a.createElement("br",null),r.a.createElement(y.a,{variant:"contained",color:"primary"},"Checkout"))):r.a.createElement(g.a,{className:a.paper},"Your cart is empty"))))}),Q=t(290),Z=t(291),q=t(117),U=t(292),X=function(e){var a=e.component,t=Object(q.a)(e,["component"]);return r.a.createElement(U.a,Object.assign({},t,{render:function(e){return function(e){for(var a=arguments.length,t=new Array(a>1?a-1:0),n=1;n<a;n++)t[n-1]=arguments[n];var l=Object.assign.apply(Object,[{}].concat(t));return r.a.createElement(e,l)}(a,e,t)}}))},ee=function(e){function a(){var e,t;Object(o.a)(this,a);for(var n=arguments.length,r=new Array(n),l=0;l<n;l++)r[l]=arguments[l];return(t=Object(s.a)(this,(e=Object(u.a)(a)).call.apply(e,[this].concat(r)))).state={products:[]},t.handleBuy=function(e){var a=e.id,n=e.img,r=e.title,l=e.price;t.setState(function(e){var t=e.products.find(function(e){return+e.id===+a});return t?(t.amount++,{products:Object(i.a)(e.products.filter(function(e){return+e.id!==+a})).concat([t])}):{products:Object(i.a)(e.products).concat([{id:a,img:n,title:r,price:l,amount:1}])}},function(){return console.log("save to localstorage")})},t}return Object(p.a)(a,e),Object(m.a)(a,[{key:"render",value:function(){var e=this.state.products;return r.a.createElement(Q.a,null,r.a.createElement(Z.a,null,r.a.createElement(X,{exact:!0,path:"/",component:O,onProductClick:this.handleBuy}),r.a.createElement(X,{path:"/cart",component:K,products:e})))}}]),a}(n.Component);c.a.render(r.a.createElement(Q.a,null,r.a.createElement(ee,null)),document.getElementById("root"))}},[[118,2,1]]]);
//# sourceMappingURL=main.b9308e28.chunk.js.map