"use strict";(self.webpackChunkwebapp=self.webpackChunkwebapp||[]).push([[612],{99462:(e,s,t)=>{t.d(s,{A:()=>R});var a=t(9950),n=t(44268),l=t(45199),i=t(24615),r=t(26120),o=t(82053),c=t(93230),d=t(66699),h=t(36080),u=t(75271),f=t(15231),x=t(4804),m=t(99624),p=t(44137),j=t(19223),g=t(66666),y=t(30656),A=t(44294);var w=t(44414);const v=(0,r.A)((e=>({appBar:{position:"relative"},title:{flex:"0 0 auto"},iconSmall:{fontSize:20}})))((e=>{let{file:s,onMetaDataChange:t}=e;const[n,l]=(0,a.useState)({dwv:(0,A.getDwvVersion)(),react:a.version}),[r,v]=(0,a.useState)({Scroll:{},ZoomAndPan:{},WindowLevel:{},Draw:{options:["Ruler"]}}),[b,S]=(0,a.useState)("Select Tool"),[N,k]=(0,a.useState)(0),[C,L]=(0,a.useState)(!1),[D,I]=(0,a.useState)(null),[H,M]=(0,a.useState)(void 0),[E,R]=(0,a.useState)(!1),F=((0,i.A)(),(e,s)=>{s&&z(s)}),B=e=>{let s;return"Scroll"===e?s=(0,w.jsx)(m.A,{}):"ZoomAndPan"===e?s=(0,w.jsx)(j.A,{}):"WindowLevel"===e?s=(0,w.jsx)(p.A,{}):"Draw"===e&&(s=(0,w.jsx)(g.A,{})),s},O=e=>{if(!D)return!1;let s;return s="Scroll"===e?D.canScroll():"WindowLevel"!==e||D.canWindowLevel(),s},T=Object.keys(r).map((e=>(0,w.jsx)(u.A,{value:e,title:e,disabled:!C||!O(e),onChange:()=>F(),children:B(e)},e))),z=e=>{D&&(S(e),D.setTool(e),"Draw"===e&&P(r.Draw.options[0]))},P=e=>{D&&D.setToolFeatures({shapeName:e})},U=e=>{k(e)},K=e=>{t(e.getMetaData(0)),L(!0)};return(0,a.useEffect)((()=>{const e=((e,s,t,a)=>{A.decoderScripts.jpeg2000="".concat("/DigitalHealthApp","/assets/dwv/decoders/pdfjs/decode-jpeg2000.js"),A.decoderScripts["jpeg-lossless"]="".concat("/DigitalHealthApp","/assets/dwv/decoders/rii-mango/decode-jpegloss.js"),A.decoderScripts["jpeg-baseline"]="".concat("/DigitalHealthApp","/assets/dwv/decoders/pdfjs/decode-jpegbaseline.js"),A.decoderScripts.rle="".concat("/DigitalHealthApp","/assets/dwv/decoders/dwv/decode-rle.js");const n=new A.App;n.init({dataViewConfigs:{"*":[{divId:"layerGroup0"}]},tools:e});let l=null,i=null,r=null,o=null;return n.addEventListener("loadstart",(()=>{l=0,i=0,r=0,o=!0})),n.addEventListener("loadprogress",(e=>{s(e.loaded)})),n.addEventListener("renderend",(()=>{if(o){o=!1;let e="ZoomAndPan";n.canScroll()&&(e="Scroll"),a(e)}})),n.addEventListener("load",(()=>{t(n)})),n.addEventListener("loadend",(()=>{i&&(s(0),alert("Received errors during load. Check log for details.")),r&&(s(0),alert("Load was aborted."))})),n.addEventListener("loaditem",(()=>{++l})),n.addEventListener("loaderror",(e=>{console.error(e.error),++i})),n.addEventListener("loadabort",(()=>{++r})),n.addEventListener("keydown",(e=>{n.defaultOnKeydown(e)})),n})(r,U,K,z);I(e)}),[]),(0,a.useEffect)((()=>{D&&D.loadFiles([s])}),[D]),(0,w.jsxs)("div",{id:"dwv",children:[(0,w.jsx)(d.A,{variant:"determinate",value:N}),D&&(0,w.jsxs)(c.A,{direction:"row",spacing:1,padding:1,justifyContent:"center",children:[(0,w.jsx)(f.A,{size:"small",color:"primary",value:b,exclusive:!0,onChange:F,children:T}),(0,w.jsx)(u.A,{size:"small",value:"reset",title:"Reset",disabled:!C,onChange:()=>{D&&D.resetDisplay()},children:(0,w.jsx)(x.A,{})}),(0,w.jsx)(u.A,{size:"small",value:"toggleOrientation",title:"Toggle Orientation",disabled:!C,onClick:()=>{"undefined"!==typeof H?"axial"===H?M("coronal"):"coronal"===H?M("sagittal"):"sagittal"===H&&M("axial"):M("coronal");const e={"*":[{divId:"layerGroup0",orientation:H}]};D.setDataViewConfigs(e);for(let s=0;s<D.getNumberOfLoadedData();++s)D.render(s)},children:(0,w.jsx)(y.A,{})})]}),(0,w.jsx)("div",{id:"layerGroup0",className:"layerGroup",children:(0,w.jsx)("div",{id:"dropBox"})}),(0,w.jsx)("div",{children:(0,w.jsx)("p",{className:"legend",children:(0,w.jsxs)(o.A,{variant:"caption",children:["Powered by ",(0,w.jsx)(h.A,{href:"https://github.com/ivmartel/dwv",title:"dwv on github",color:"inherit",children:"dwv"})," ",n.dwv," and ",(0,w.jsx)(h.A,{href:"https://github.com/facebook/react",title:"react on github",color:"inherit",children:"React"})," ",n.react]})})})]})}));var b=t(2046),S=t(89931),N=t(2235),k=t(15769),C=t(1320),L=t(34075),D=t(21671),I=t(69780),H=t(9213);class M extends a.Component{constructor(e){super(e),this.onSliderChange=e=>{const s=parseInt(e.target.value,10),t=this.getMetaArray(s);this.setState({instanceNumber:s,displayData:t}),this.filterList(this.state.searchfor,s)},this.onSearch=e=>{var s=e.target.value;this.filterList(s,this.state.instanceNumber)};const s=this.props.data;this.state={fullMetaData:s,searchfor:""};const t=s["00200013"];if("undefined"!==typeof t){let e=t.value;"string"===typeof e&&(e=[e]);const s=e.map(Number);s.sort(((e,s)=>e-s)),this.state.sliderMin=s[0],this.state.sliderMax=s[s.length-1],this.state.instanceNumber=s[0],this.state.instanceNumbers=s}this.state.displayData=this.getMetaArray(this.state.sliderMin),this.filterList=this.filterList.bind(this)}filterList(e,s){var t=e.toLowerCase(),a=this.getMetaArray(s).filter((function(e){for(var s in e)if(e.hasOwnProperty(s)){var a=e[s];if("undefined"!==typeof a&&("string"!==typeof a&&(a=a.toString()),-1!==a.toLowerCase().indexOf(t)))return!0}return!1}));this.setState({searchfor:e,displayData:a})}getMetaArray(e){if("undefined"!==typeof this.state.instanceNumbers&&!this.state.instanceNumbers.includes(e))return console.warn("Invalid instance number: ",e),[];let s;s=this.isDicomMeta(this.state.fullMetaData)?this.getDicomTagReducer(this.state.fullMetaData,e,""):this.getTagReducer(this.state.fullMetaData);return Object.keys(this.state.fullMetaData).reduce(s,[])}isDicomMeta(e){return"undefined"!==typeof e["00020010"]}getTagReducer(e){return function(s,t){return s.push({name:t,value:e[t].value}),s}}getDicomTagReducer(e,s,t){return(a,n)=>{const l=(0,A.getTagFromKey)(n);let i=l.getNameFromDictionary();"undefined"===typeof i&&(i="x"+l.getKey());const r=i,o=e[n];let c=o.value;if("undefined"===typeof c.slice&&"undefined"!==typeof c[s]&&(c=c[s]),"InstanceNumber"===r&&(c=s),"SQ"===o.vr){a.push({name:(t?t+" ":"")+r,value:""});for(let e=0;e<c.length;++e){const n=c[e],l=Object.keys(n).reduce(this.getDicomTagReducer(n,s,t+"["+e+"]"),[]);a=a.concat(l)}}else"O"===o.vr[0]&&c.length>10&&(c=c.slice(0,10).toString()+"... (len:"+c.length+")"),a.push({name:(t?t+" ":"")+r,value:c.toString()});return a}}render(){const{classes:e}=this.props,{displayData:s,searchfor:t,sliderMin:a,sliderMax:n}=this.state;return(0,w.jsxs)("div",{className:e.container,children:[(0,w.jsx)(c.A,{direction:"row",spacing:2,children:(0,w.jsx)(S.A,{id:"search",type:"search",value:t,className:e.searchField,onChange:this.onSearch,margin:"normal",size:"small",InputProps:{startAdornment:(0,w.jsx)(b.A,{position:"start",children:(0,w.jsx)(j.A,{})})}})}),(0,w.jsx)(N.A,{sx:{width:"100%",overflow:"hidden"},children:(0,w.jsx)(C.A,{sx:{maxHeight:700},children:(0,w.jsxs)(k.A,{stickyHeader:!0,className:e.table,children:[(0,w.jsx)(I.A,{children:(0,w.jsxs)(H.A,{children:[(0,w.jsx)(D.A,{children:"Tag"}),(0,w.jsx)(D.A,{children:"Value"})]})}),(0,w.jsx)(L.A,{children:s.map(((e,s)=>(0,w.jsxs)(H.A,{children:[(0,w.jsx)(D.A,{children:e.name}),(0,w.jsx)(D.A,{children:e.value})]},s)))})]})})})]})}}const E=(0,r.A)((e=>({flex:{flex:1},spacer:{flex:"1 1 100%"},searchField:{width:"45%"},slider:{margin:20},container:{padding:10,overflow:"hidden"}})))(M),R=e=>{let{show:s,onHide:t,file:i}=e;const[r,o]=(0,a.useState)("viewer"),[c,d]=(0,a.useState)({});return(0,w.jsx)(n.A,{show:s,fullscreen:!0,onHide:t,children:(0,w.jsxs)(n.A.Body,{children:[(0,w.jsxs)(l.A,{fill:!0,variant:"tabs",defaultActiveKey:"viewer",onSelect:(e,s)=>((e,s)=>{s.preventDefault(),o(e)})(e,s),children:[(0,w.jsx)(l.A.Item,{children:(0,w.jsx)(l.A.Link,{eventKey:"viewer",children:"Image"})}),(0,w.jsx)(l.A.Item,{children:(0,w.jsx)(l.A.Link,{eventKey:"tags",children:"Tags"})})]}),"viewer"===r&&(0,w.jsx)(v,{file:i,onMetaDataChange:e=>{d(e)}}),"tags"===r&&c&&(0,w.jsx)(E,{data:c})]})})}},70612:(e,s,t)=>{t.r(s),t.d(s,{default:()=>ne});var a=t(9950),n=t(28429),l=t(45358),i=t(81605),r=t(97937),o=t(19360),c=t(11534),d=t(18481),h=t(45199),u=t(14798),f=t(29949),x=t(22875),m=t(90917),p=t(82096),j=t(44414);const g=e=>{let{user:s,handleSelect:t}=e;const{logout:l}=(0,d.r)();(0,n.Zp)();return(0,a.useEffect)((()=>{console.log(s)}),[]),(0,j.jsxs)(u.A,{className:"d-flex flex-column col-2 border border-start-0 rounded-end py-2 px-3",children:[(0,j.jsx)(u.A.Brand,{className:"mb-4 mt-3",href:"#",children:"Medical Sharing"}),(0,j.jsxs)(h.A,{variant:"pills",defaultActiveKey:"authorization",className:"d-flex flex-column col-12",onSelect:(e,s)=>((e,s)=>{s.preventDefault(),"logout"===e&&l(),t(e)})(e,s),children:[(0,j.jsx)(h.A.Item,{children:(0,j.jsxs)(h.A.Link,{eventKey:"authorization",children:[(0,j.jsx)(f.jh0,{}),"Authorize People"]})}),(0,j.jsx)(h.A.Item,{children:(0,j.jsxs)(h.A.Link,{eventKey:"my-files",children:[(0,j.jsx)(f.bm4,{}),"Manage Your Files"]})}),(0,j.jsx)(h.A.Item,{children:(0,j.jsxs)(h.A.Link,{eventKey:"authorized-files",children:[(0,j.jsx)(m.D_b,{}),"Shared Files"]})}),(0,j.jsx)(h.A.Item,{children:(0,j.jsxs)(h.A.Link,{eventKey:"notification",children:[(0,j.jsx)(x.hbh,{}),"Notifications"]})}),(0,j.jsx)(h.A.Item,{children:(0,j.jsxs)(h.A.Link,{eventKey:"logout",children:[(0,j.jsx)(p.YZx,{}),"Logout"]})})]})]})};var y=t(44268),A=t(16449);const w=e=>{let{show:s,onHide:t,onConfirm:n}=e;const[l,i]=(0,a.useState)("");(0,a.useEffect)((()=>{i("")}),[s]);return(0,j.jsxs)(y.A,{show:s,onHide:t,centered:!0,children:[(0,j.jsx)(y.A.Header,{closeButton:!0,children:(0,j.jsx)(y.A.Title,{children:"Confirm Password"})}),(0,j.jsx)(y.A.Body,{children:(0,j.jsx)(A.A,{children:(0,j.jsxs)(A.A.Group,{controlId:"password",children:[(0,j.jsx)(A.A.Label,{children:"Password:"}),(0,j.jsx)(A.A.Control,{type:"password",value:l,onChange:e=>i(e.target.value)})]})})}),(0,j.jsxs)(y.A.Footer,{children:[(0,j.jsx)(r.A,{variant:"secondary",onClick:t,children:"Cancel"}),(0,j.jsx)(r.A,{variant:"primary",onClick:()=>{n(l),t()},children:"Confirm"})]})]})},v=e=>{let{show:s,onHide:t,onAddFile:n}=e;const[l,i]=(0,a.useState)(null),[o,c]=(0,a.useState)(!1);return(0,a.useEffect)((()=>{i(null)}),[s]),(0,j.jsxs)(y.A,{show:s,onHide:t,centered:!0,children:[(0,j.jsx)(y.A.Header,{closeButton:!0,children:(0,j.jsx)(y.A.Title,{children:"Add File"})}),(0,j.jsx)(y.A.Body,{children:(0,j.jsxs)(A.A,{children:[(0,j.jsxs)(A.A.Group,{className:"mb-3",children:[(0,j.jsx)(A.A.Label,{children:"Input File"}),(0,j.jsx)(A.A.Control,{type:"file",name:"input-file",id:"input-file",onChange:e=>{return(s=e).preventDefault(),void i(s.target.files);var s}})]}),(0,j.jsx)(A.A.Switch,{label:"Encryption",onChange:e=>c((e=>!e))})]})}),(0,j.jsxs)(y.A.Footer,{children:[(0,j.jsx)(r.A,{variant:"secondary",onClick:t,children:"Cancel"}),(0,j.jsx)(r.A,{variant:"primary",type:"submit",onClick:e=>(e=>{e.preventDefault(),n(l,o)})(e),children:"Add File"})]})]})};var b=t(92910),S=t(89127),N=t(10062),k=(t(92723),t(27885)),C=t(93853);const L=async(e,s)=>{const t=await(0,S.F)(e.get(s.fileHash),D,(e=>(0,k.A)(e))),a=(t.map((e=>e.header.name)),new Blob([t[0].body],{type:s.fileType}));return URL.createObjectURL(a)};async function*D(e){yield*(0,S.F)(e,(0,b.o)(),(async function*(e){for await(const s of e)yield{...s,body:await(0,N.A)((0,C.A)(s.body,(e=>e.slice())))}}))}var I=t(52465),H=(t(99462),t(8966));const M=e=>{let{show:s,onHide:t,content:n}=e;return(0,a.useEffect)((()=>{n&&console.log(n)}),[s,n]),(0,j.jsxs)(y.A,{show:s,onHide:t,children:[(0,j.jsx)(y.A.Header,{closeButton:!0,children:n&&(0,j.jsx)(y.A.Title,{children:n.admissionContent.messageType})}),(0,j.jsx)(y.A.Body,{children:n&&(0,j.jsx)(H.A,{children:Object.entries(n.admissionContent).map((e=>{let[s,t]=e;return"messageType"!==s&&(0,j.jsxs)(H.A.Item,{eventKey:s,children:[(0,j.jsx)(H.A.Header,{children:s.charAt(0).toUpperCase()+s.slice(1)}),(0,j.jsx)(H.A.Body,{children:"admissionReason"===s?t:t.join(", ")})]},s)}))})})]})};var E=t(75208),R=t(35298),F=t(60123),B=t(66187);R.t1.register(R.PP,R.kc,R.E8,R.Bs,R.FN,R.No,R.hE,R.dN,R.m_,R.s$);const O="rgba(255, 99, 132, 0.2)",T="rgba(75, 192, 192, 0.2)",z="rgba(255, 159, 64, 0.2)",P={"rgba(255, 99, 132, 0.2)":"rgba(255, 99, 132, 1)","rgba(75, 192, 192, 0.2)":"rgba(75, 192, 192, 1)","rgba(255, 159, 64, 0.2)":"rgba(255, 159, 64, 1)"},U=e=>{let{data:s,labels:t}=e;const[n,i]=(0,a.useState)({responsive:!0,plugins:{legend:{position:"top"},title:{display:!0,text:"Chart.js Bar Chart"}},scales:{x:{min:0,max:9}}}),[r,o]=(0,a.useState)(0),c=t.length,d=Math.ceil((c-10)/2);return(0,j.jsxs)(l.A,{children:[(0,j.jsx)(B.N1,{options:n,data:{labels:t,datasets:[{fill:!0,data:s,borderColor:"rgb(53, 162, 235)",backgroundColor:"rgba(53, 162, 235, 0.5)"}]}}),(0,j.jsx)(l.A,{children:(0,j.jsx)(F.Ay,{value:r,onChange:(e,s)=>{const t=JSON.parse(JSON.stringify(n));let a=n.scales.x.min,l=n.scales.x.max;if(r!==s)if(c-a>=10){let e=2*s;t.scales.x.min=e,t.scales.x.max=e+9,i(t),o(s)}else if(l===c){console.log(l,c);let e=2*s;t.scales.x.min=e,t.scales.x.max=e+9,i(t),o(s)}},step:1,min:0,max:d})})]})},K=e=>{let{data:s}=e;const[t,n]=(0,a.useState)(null);return(0,a.useEffect)((()=>{const e=s.filter((e=>e.value<90)).length,t=s.filter((e=>e.value>100)).length,a=s.length-e-t,l=(Math.ceil(e/s.length*100),Math.ceil(t/s.length*100),Math.ceil(a/s.length*100),[z,O,T]),i=l.map((e=>P[e])),r={labels:["Low Days < 90","High Days > 100","Normal"],datasets:[{label:"# of Votes",data:[e,t,a],backgroundColor:l,borderColor:i,borderWidth:1}]};console.log(a,e,t),n(r)}),[]),t&&(0,j.jsx)(l.A,{className:"d-flex justify-content-center",children:(0,j.jsx)(B.nu,{data:t})})},W=e=>{let{data:s,labels:t}=e;const[n,i]=(0,a.useState)({responsive:!0,plugins:{legend:{position:"top"},title:{display:!0,text:"Chart.js Bar Chart"}},scales:{x:{min:0,max:9}}}),[r,o]=(0,a.useState)(0),[c,d]=(0,a.useState)([]),[h,u]=(0,a.useState)([]),f=t.length,x=Math.ceil((f-10)/2);return(0,a.useEffect)((()=>{const e=s.map((e=>e<60?z:e>100?O:T)),t=e.map((e=>P[e]));d(e),u(t)}),[]),c&&h&&(0,j.jsxs)(l.A,{children:[(0,j.jsx)(B.yP,{options:n,data:{labels:t,datasets:[{label:"Beat Per Minute",data:s,backgroundColor:c,borderColor:h,borderWidth:1}]},onClick:()=>{}}),(0,j.jsx)(l.A,{children:(0,j.jsx)(F.Ay,{value:r,onChange:(e,s)=>{const t=JSON.parse(JSON.stringify(n));let a=n.scales.x.min,l=n.scales.x.max;if(r!==s)if(console.log(s,a,l,f),f-a>=10){let e=2*s;t.scales.x.min=e,t.scales.x.max=e+9,i(t),o(s)}else if(l===f){console.log(l,f);let e=2*s;t.scales.x.min=e,t.scales.x.max=e+9,i(t),o(s)}},step:1,min:0,max:x})})]})};function Y(e){let{show:s,onHide:t,content:n}=e;const[i,r]=(0,a.useState)([]),[o,c]=(0,a.useState)(null),[d,h]=(0,a.useState)(null),[u,f]=(0,a.useState)(null);return(0,a.useEffect)((()=>{const e=n.map((e=>e.DateTime)),s=n.map((e=>e.HeartRate)),t=n.map((e=>e.BloodPressure)),a=n.map((e=>e.OxygenLevel));r(e),f(a),h(t),c(s)}),[]),(0,j.jsxs)(y.A,{fullscreen:!0,show:s,onHide:t,children:[(0,j.jsx)(y.A.Header,{closeButton:!0}),(0,j.jsx)(y.A.Body,{children:(0,j.jsxs)(l.A,{fluid:!0,className:"d-flex flex-column overflow",children:[o&&(0,j.jsx)(W,{data:o,labels:i}),u&&(0,j.jsx)(K,{data:u}),d&&(0,j.jsx)(U,{data:d,labels:i})]})})]})}var G=t(79652),V=t(42935),J=t(88551),Z=t(34691);const q={pdf:{ipfs:!0,server:!0},png:{ipfs:!0,server:!0},jpg:{ipfs:!0,server:!0},pptx:{ipfs:!0,server:!0},dcm:{ipfs:!1,server:!0},hl7:{ipfs:!1,server:!0},docx:{ipfs:!1,server:!0},xlsx:{ipfs:!1,server:!0}},_=e=>{let{fileList:s,owner:t,accessor:o}=e;const{ipfs:c}=(0,J.B)(),[d,h]=(0,a.useState)(!1),[u,f]=(0,a.useState)(null),[x,m]=(0,a.useState)(),[g,y]=(0,a.useState)(null),A=(0,n.Zp)(),w={Download:{method:async(e,s)=>{if("Public"===s.fileMode){const e=await L(c,s);window.open(e),(0,Z.saveAs)(e,s.fileName+"."+s.fileExtension)}else{const{blob:e,fileName:a}=await(0,I.BF)(s.fileHash,t.key,o.key),n=URL.createObjectURL(e);window.open(n),URL.revokeObjectURL(n)}},icon:(0,j.jsx)(p.qqM,{className:"icon theme"})},Open:{method:async(e,s)=>{e.preventDefault();try{if("Public"===s.fileMode&&q[s.fileExtension].ipfs){const e=await L(c,s);window.open(e),URL.revokeObjectURL(e)}else{if("dcm"===s.fileExtension){const e="/dicom/?fileHash=".concat(s.fileHash,"&owner=").concat(t.key,"&accessor=").concat(o.key);return void A(e)}if("hl7"===s.fileExtension){const e=await(0,I.GD)(s.fileHash,t.key,o.key);f(e),h(!0)}else if("json"===s.fileExtension){const{blob:e,fileName:a}=await(0,I.BF)(s.fileHash,t.key,o.key),n=new FileReader;n.onload=function(){y(JSON.parse(this.result))},n.readAsText(e),m(!0)}else{const{blob:e,fileName:a}=await(0,I.BF)(s.fileHash,t.key,o.key),n=URL.createObjectURL(e);window.open(n),URL.revokeObjectURL(n)}}}catch(a){console.error(a)}},icon:(0,j.jsx)(p.W8l,{className:"icon theme"})},Remove:{method:async(e,s)=>{const t=await(0,I.Ww)(s.fileId);console.log(t)},icon:(0,j.jsx)(V.Yzb,{className:"icon theme"})}};return(0,a.useEffect)((()=>{}),[s]),(0,j.jsxs)(l.A,{style:{height:"85%"},children:[(0,j.jsxs)(l.A,{fluid:!0,className:"d-flex flex-row mb-2",children:[(0,j.jsx)(l.A,{className:"col-3",children:"Date Added"}),(0,j.jsx)(l.A,{className:"col-5",children:"File Name"}),(0,j.jsx)(l.A,{className:"col-1",children:"File Mode"}),(0,j.jsx)(l.A,{className:"d-flex col-3 justify-content-center",children:"Actions"})]}),s&&(0,j.jsx)(i.A,{children:s.map(((e,s)=>{const a=new Date(e.addedDate);return(0,j.jsxs)(i.A.Item,{className:"d-flex mb-3 justify-content-around shadow rounded",children:[(0,j.jsx)(l.A,{className:"align-items-center col-3",children:"".concat(a.toLocaleDateString()," ").concat(a.toLocaleTimeString("en-US",{hour:"numeric",minute:"numeric",hour12:!0}))}),(0,j.jsx)(l.A,{className:"col-5",style:{maxWidth:"50%"},children:e.fileName+"."+e.fileExtension}),(0,j.jsx)(l.A,{className:"col-1",children:e.fileMode}),(0,j.jsx)(l.A,{className:"d-flex flex-row col-3 justify-content-around align-items-center",children:e.fileActions.map((s=>{if("Remove"===s.name&&t.userId!==o.userId)return;const a=w[s.name];return a?(0,j.jsx)(E.A,{className:"action-icon",sx:{bgcolor:"transparent"},children:(0,j.jsx)(r.A,{style:{backgroundColor:"transparent",width:"auto",boxShadow:"none",justifyContent:"center",alignItems:"center"},className:" col-3 rounded-circle",onClick:s=>a.method(s,e),children:a.icon})},s.id):void 0}))})]},s)}))}),(0,j.jsx)(M,{show:d,onHide:()=>{h(!1)},content:u}),g&&(0,j.jsx)(Y,{show:x,onHide:()=>{m(!1)},content:g})]})},Q=e=>{let{owner:s,accessor:t}=e;const{ipfs:n}=(0,J.B)(),[l,i]=(0,a.useState)(!1);return(0,j.jsxs)(a.Fragment,{children:[(0,j.jsxs)(r.A,{onClick:e=>(e=>{e.preventDefault(),i(!0)})(e),children:[(0,j.jsx)(G.LzS,{}),"Add File"]}),(0,j.jsx)(v,{show:l,onHide:()=>{i(!1)},onAddFile:async(e,a)=>{if(s&&e)if(a){const a=new FormData;for(let s=0;s<e.length;s++)a.append("files",e[s]);a.append("owner",JSON.stringify(s)),a.append("accessor",JSON.stringify(t)),(0,I.R3)(a)}else{const a=await(async(e,s)=>{let[t]=e;try{return{...await s.add(t,{progress:e=>console.log("received: ".concat(e))}),file:t}}catch(a){throw new Error("IPFS failed to add file",a)}})(e,n),l=a.file,i={fileHash:a.path,multiAddress:"/ip4/127.0.0.1/tcp/5001",fileName:l.name,fileType:l.type.length>0?l.type:"application/octet-stream",ownerId:s.userId,accessorId:t.userId};(0,I.bA)(i)}}})]})},X=e=>{let{ipfs:s,owner:t}=e;const[n,i]=(0,a.useState)([]);return(0,a.useEffect)((()=>{(async()=>{const e=await(0,I.XU)(t.userId);i(e),console.log(e)})()}),[]),(0,j.jsxs)(l.A,{fluid:!0,className:"pt-5",style:{height:"100%"},children:[(0,j.jsx)(l.A,{fluid:!0,className:"d-flex flex-column mb-3",style:{height:"80%",overflowY:"scroll"},children:n.length>0?(0,j.jsx)(_,{fileList:n,ipfs:s,owner:t,accessor:t}):(0,j.jsx)(o.A,{variant:"light",children:"You have not been authorized for any file "})}),(0,j.jsx)(l.A,{fluid:!0,className:"d-flex justify-content-end mb-3",children:(0,j.jsx)(Q,{ipfs:s,owner:t,accessor:t})})]})},$=e=>{let{accessor:s}=e;const[t,n]=(0,a.useState)([]);return(0,a.useEffect)((()=>{(async()=>{const e=await(0,I.fu)(s.userId);console.log(e),n(e)})()}),[]),(0,j.jsx)(l.A,{className:"mb-3 pt-4",style:{height:"100%",maxHeight:"100%",overflowY:"scroll"},children:t.length>0?(0,j.jsxs)(a.Fragment,{children:[(0,j.jsx)(A.A.Label,{style:{height:"50px",fontWeight:"500",fontSize:"18px"},children:"Authorized File List"}),(0,j.jsx)(H.A,{children:t.map(((e,t)=>(0,j.jsx)(l.A,{style:{height:"200px"},children:(0,j.jsxs)(H.A.Item,{eventKey:t,children:[(0,j.jsxs)(H.A.Header,{className:"d-flex ",children:[(0,j.jsx)(l.A,{className:"d-flex col",children:e.userName}),(0,j.jsx)(l.A,{className:"d-flex col-10 justify-content-end",children:(0,j.jsx)(Q,{owner:{userId:e.ownerId,key:e.key},accessor:s})})]}),(0,j.jsx)(H.A.Body,{children:(0,j.jsx)(_,{fileList:e.informationList,owner:{userId:e.ownerId,key:e.key},accessor:s})})]},t)})))})]}):(0,j.jsx)(o.A,{variant:"light",children:"You have not been authorized for any file"})})};var ee=t(67532),se=t(1322);function te(){const[e,s]=(0,a.useState)(null),[t,n]=(0,a.useState)(null),{user:i}=(0,d.r)(),r={Upload:"uploaded a file",Open:"opened a file",Remove:"removed a file"};return(0,a.useEffect)((()=>{(async()=>{const e=(await(0,I.Tr)(i.userId)).map((e=>({id:e.id,name:e.accessorName,fileName:"".concat(e.fileName,".").concat(e.fileExtension),imageUri:"https://images.unsplash.com/photo-1707655096648-1655344fc4d5?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",message:r[e.actionName],isRead:e.isRead,createdDate:e.createdDate}))),t=e.filter((e=>!e.isRead)).length;s(e),n(t)})()}),[]),e&&(0,j.jsxs)(l.A,{fluid:!0,style:{padding:0,height:"100%",margin:0},children:[(0,j.jsx)(l.A,{fluid:!0,className:"theme",style:{height:"50px",fontWeight:"500",fontSize:"25px"},children:"Notification (".concat(t,")")}),(0,j.jsx)(l.A,{fluid:!0,className:"d-flex flex-row justify-content-end my-3",children:(0,j.jsxs)(l.A,{className:"d-flex align-self-end shadow px-2 justify-content-between align-items-center rounded-4 ",style:{width:"30%",height:"40px"},children:[(new Date).toLocaleDateString(),(0,j.jsx)(x.LyP,{})]})}),(0,j.jsx)(l.A,{fluid:!0,className:"theme",style:{height:"50px",fontWeight:"500",fontSize:"18px"},children:"Today"}),(0,j.jsx)(l.A,{fluid:!0,style:{maxHeight:"500px",overflowY:"scroll"},children:e.map(((e,s)=>((e,s)=>(0,j.jsxs)(l.A,{fluid:!0,className:"d-flex shadow flex-row py-5 mb-3 align-items-center rounded",style:{height:"50px"},children:[(0,j.jsx)("div",{className:"mx-3 rounded-circle",style:{backgroundColor:e.isRead?"white":"orange",width:"14px",height:"11px"}}),(0,j.jsx)(E.A,{className:"shadow m-3",alt:"Travis Howard",src:e.imageUri}),(0,j.jsxs)("p",{className:"message mb-0 ms-3",children:[(0,j.jsxs)("span",{className:"span-message",children:[e.name," "]})," "," ".concat(e.message," ")," ",(0,j.jsxs)("span",{className:"span-message",children:[e.fileName," "]})]}),(0,j.jsxs)("p",{className:"message-time mb-0",children:["  ",new Date(e.createdDate).toLocaleTimeString("en-US",{hour:"numeric",minute:"numeric",hour12:!0})]})]},s))(e,s)))}),(0,j.jsx)(l.A,{})]})}const ae=e=>{let{authorizationList:s,handleOpenModal:t}=e;return(0,j.jsx)(l.A,{className:"mb-3 mt-3",style:{height:"100%",maxHeight:"100%",overflowY:"scroll"},children:(0,j.jsx)(i.A,{children:s.map((e=>(0,j.jsxs)(i.A.Item,{className:"d-flex justify-content-between text mb-3 shadow rounded",children:[e.name,(0,j.jsx)(r.A,{onClick:s=>t({event:s,accessor:e}),children:"Revoke"})]},e.accessorId)))})})},ne=()=>{const[e,s]=(0,a.useState)([]),[t,i]=(0,a.useState)("authorization"),{authed:h,user:u}=(0,d.r)(),[f,x]=(0,a.useState)(!1),[m,p]=(0,a.useState)(),[y,A]=(0,a.useState)(null),[v,b]=(0,a.useState)([]),[S,N]=(0,a.useState)([]),{data:k,isPending:C,writeContractAsync:L}=(0,se.x)(),D=(0,n.Zp)(),H=async e=>{let{confirmedPassword:t}=e;if(console.log(y),null==u.userId)return;const a=(0,ee.ye)({accessor:y.accessorKey,password:t,owner:u.key});try{await L(a),await(0,I.Ve)({ownerId:u.key,accessorId:y.accessorKey})}catch(n){console.log(n)}s((e=>e.filter((e=>e.accessorId!==y.accessorId)))),A(null)},M=e=>{let{event:s,accessor:t}=e;s.preventDefault(),A(t),x(!0)};return(0,a.useEffect)((()=>{h||D("/login"),u.userId&&((async()=>{try{const e=await(0,I.sr)({userId:u.userId});s(e)}catch(e){console.log("Cannot get authorization list"+e)}})(),(async()=>{try{const e=await(0,I.aU)(),s=e.filter((e=>e.userId!==u.userId)).map((e=>({value:e.userId,label:e.name})));b(e),N(s)}catch(e){console.log("Fail to set user list"+e)}})())}),[]),(0,a.useEffect)((()=>{}),[e]),(0,j.jsxs)(l.A,{fluid:!0,className:"custom-container d-flex flex-row mx-0",children:[(0,j.jsx)(g,{user:u,handleSelect:e=>{i(e)}}),(0,j.jsxs)(l.A,{fluid:!0,className:"d-flex flex-column mb-3 ms-5",style:{height:"100%"},children:["authorization"===t&&S&&(0,j.jsxs)(l.A,{className:"mb-3 pt-4",style:{height:"80%"},children:[(0,j.jsx)(c.Ay,{options:S,placeholder:"Select user",value:m,onChange:function(e){p(e)},isSearchable:!0,styles:{control:(e,s)=>({...e,backgroundColor:"white",borderColor:"#070f25",marginBottom:"0.3em",paddingBottom:"0.5rem",paddingTop:"0.5rem"}),option:(e,s)=>{let{data:t,isDisabled:a,isFocused:n,isSelected:l}=s;return{...e,color:"#000",backgroundColor:n?"#d1d2d7":"white"}}}}),(0,j.jsx)(a.Fragment,{children:(0,j.jsx)(r.A,{style:{width:"100%"},variant:"primary",type:"submit",onClick:e=>M({event:e}),children:"Authorize"})}),e.length>0?(0,j.jsx)(ae,{authorizationList:e,handleRevoke:H,handleOpenModal:M}):(0,j.jsx)(l.A,{fluid:!0,className:"mt-3",children:(0,j.jsx)(o.A,{variant:"light",children:"You have not authorized anyone"})})]}),"my-files"===t&&(0,j.jsx)(X,{owner:{userId:u.userId,key:u.key}}),"authorized-files"===t&&(0,j.jsx)($,{accessor:{userId:u.userId,key:u.key}}),"notification"===t&&(0,j.jsx)(te,{})]}),(0,j.jsx)(w,{show:f,onHide:()=>{x(!1)},onConfirm:t=>{y?H({confirmedPassword:t}):(async t=>{let{confirmedPassword:a}=t;const n=v.find((e=>e.userId===m.value));if(null==u.userId||null===n)return;if(n.key==u.key)return;const l=(0,ee.bk)({accessor:n.key,password:a,owner:u.key});try{await L(l),await(0,I.VM)({ownerId:u.key,accessorId:n.key})}catch(i){console.log(i)}s([...e,{accessorId:n.userId,accessorKey:n.key,name:n.name,isAuthorized:!0}])})({confirmedPassword:t})}})]})}}}]);