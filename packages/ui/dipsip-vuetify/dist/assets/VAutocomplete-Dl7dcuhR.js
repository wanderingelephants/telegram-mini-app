import{at as qn,au as ii,an as Kn,E as Le,av as si,d as Yn,r as Jn,aw as ai,ax as xt,ay as oi,az as Ge,aA as li,aB as ci,N as ui,X as di,aC as dn,_ as Xn,A as X,C as Q,ah as He,p as je,z as Z,x as We,y as Se,$ as hn,o as Ut,Z as fn,i as Ft,j as mt,aD as qt,aE as hi,s as fi,m as pi,a as mi,b as gi,c as vi,u as _i,e as yi,f as bi,g as Ii,V as pn,h as wi,k as Ei,l as Ti,n as Si,q as ki}from"./index-BVIgS1lC.js";import{T as Ci,p as Ue,J as mn,m as Ai,b as Ri,g as Fe,W as Qn,d as Pi,B as Re,z as Oi,ax as Di,E as Ni,f as Ve,a0 as Kt,h as Li,s as Mi,l as xi,o as Ui,Q as Fi,O as Vi,av as Bi,aI as $i,aw as Hi,$ as gn,G as Wi}from"./vuetify-tLNOow9z.js";import{c as N,s as Ce,m as c,F as j,n as W,Q as k,d as Ae,f as ji,E as ve,N as z,S as ke,P as d,R as b,V as T,U as st,O as ze,_ as Zn,w as at,A as vn}from"./vue-CBE_nr9M.js";import{V as zi}from"./VDialog-CTrQJSNP.js";const ot=Ci("v-spacer","div","VSpacer"),Gi=Ue({name:String,itemAriaLabel:{type:String,default:"$vuetify.rating.ariaLabel.item"},activeColor:String,color:String,clearable:Boolean,disabled:Boolean,emptyIcon:{type:mn,default:"$ratingEmpty"},fullIcon:{type:mn,default:"$ratingFull"},halfIncrements:Boolean,hover:Boolean,length:{type:[Number,String],default:5},readonly:Boolean,modelValue:{type:[Number,String],default:0},itemLabels:Array,itemLabelPosition:{type:String,default:"top",validator:t=>["top","bottom"].includes(t)},ripple:Boolean,...Ai(),...qn(),...ii(),...Kn(),...Ri()},"VRating"),_n=Fe()({name:"VRating",props:Gi(),emits:{"update:modelValue":t=>!0},setup(t,e){let{slots:n}=e;const{t:r}=Qn(),{themeClasses:i}=Pi(t),s=Re(t,"modelValue"),a=N(()=>Oi(parseFloat(s.value),0,+t.length)),l=N(()=>Di(Number(t.length),1)),o=N(()=>l.value.flatMap(_=>t.halfIncrements?[_-.5,_]:[_])),u=Ce(-1),f=N(()=>o.value.map(_=>{const A=t.hover&&u.value>-1,R=a.value>=_,S=u.value>=_,I=(A?S:R)?t.fullIcon:t.emptyIcon,v=t.activeColor??t.color,B=R||S?v:t.color;return{isFilled:R,isHovered:S,icon:I,color:B}})),m=N(()=>[0,...o.value].map(_=>{function A(){u.value=_}function R(){u.value=-1}function S(){t.disabled||t.readonly||(s.value=a.value===_&&t.clearable?0:_)}return{onMouseenter:t.hover?A:void 0,onMouseleave:t.hover?R:void 0,onClick:S}})),p=N(()=>t.name??`v-rating-${Ni()}`);function w(_){var q,K;let{value:A,index:R,showStar:S=!0}=_;const{onMouseenter:L,onMouseleave:I,onClick:v}=m.value[R+1],B=`${p.value}-${String(A).replace(".","-")}`,U={color:(q=f.value[R])==null?void 0:q.color,density:t.density,disabled:t.disabled,icon:(K=f.value[R])==null?void 0:K.icon,ripple:t.ripple,size:t.size,variant:"plain"};return c(j,null,[c("label",{for:B,class:{"v-rating__item--half":t.halfIncrements&&A%1>0,"v-rating__item--full":t.halfIncrements&&A%1===0},onMouseenter:L,onMouseleave:I,onClick:v},[c("span",{class:"v-rating__hidden"},[r(t.itemAriaLabel,A,t.length)]),S?n.item?n.item({...f.value[R],props:U,value:A,index:R,rating:a.value}):c(Le,W({"aria-label":r(t.itemAriaLabel,A,t.length)},U),null):void 0]),c("input",{class:"v-rating__hidden",name:p.value,id:B,type:"radio",value:A,checked:a.value===A,tabindex:-1,readonly:t.readonly,disabled:t.disabled},null)])}function P(_){return n["item-label"]?n["item-label"](_):_.label?c("span",null,[_.label]):c("span",null,[k(" ")])}return Ve(()=>{var A;const _=!!((A=t.itemLabels)!=null&&A.length)||n["item-label"];return c(t.tag,{class:["v-rating",{"v-rating--hover":t.hover,"v-rating--readonly":t.readonly},i.value,t.class],style:t.style},{default:()=>[c(w,{value:0,index:-1,showStar:!1},null),l.value.map((R,S)=>{var L,I;return c("div",{class:"v-rating__wrapper"},[_&&t.itemLabelPosition==="top"?P({value:R,index:S,label:(L=t.itemLabels)==null?void 0:L[S]}):void 0,c("div",{class:"v-rating__item"},[t.halfIncrements?c(j,null,[c(w,{value:R-.5,index:S*2},null),c(w,{value:R,index:S*2+1},null)]):c(w,{value:R,index:S},null)]),_&&t.itemLabelPosition==="bottom"?P({value:R,index:S,label:(I=t.itemLabels)==null?void 0:I[S]}):void 0])})]})}),{}}}),Yt=Symbol.for("vuetify:v-tabs"),qi=Ue({fixed:Boolean,sliderColor:String,hideSlider:Boolean,direction:{type:String,default:"horizontal"},...Kt(si({selectedClass:"v-tab--selected",variant:"text"}),["active","block","flat","location","position","symbol"])},"VTab"),ut=Fe()({name:"VTab",props:qi(),setup(t,e){let{slots:n,attrs:r}=e;const{textColorClasses:i,textColorStyles:s}=Yn(t,"sliderColor"),a=Ae(),l=Ae(),o=N(()=>t.direction==="horizontal"),u=N(()=>{var m,p;return((p=(m=a.value)==null?void 0:m.group)==null?void 0:p.isSelected.value)??!1});function f(m){var w,P;let{value:p}=m;if(p){const _=(P=(w=a.value)==null?void 0:w.$el.parentElement)==null?void 0:P.querySelector(".v-tab--selected .v-tab__slider"),A=l.value;if(!_||!A)return;const R=getComputedStyle(_).color,S=_.getBoundingClientRect(),L=A.getBoundingClientRect(),I=o.value?"x":"y",v=o.value?"X":"Y",B=o.value?"right":"bottom",U=o.value?"width":"height",q=S[I],K=L[I],M=q>K?S[B]-L[B]:S[I]-L[I],we=Math.sign(M)>0?o.value?"right":"bottom":Math.sign(M)<0?o.value?"left":"top":"center",kt=(Math.abs(M)+(Math.sign(M)<0?S[U]:L[U]))/Math.max(S[U],L[U])||0,$e=S[U]/L[U]||0,Te=1.5;Li(A,{backgroundColor:[R,"currentcolor"],transform:[`translate${v}(${M}px) scale${v}(${$e})`,`translate${v}(${M/Te}px) scale${v}(${(kt-1)/Te+1})`,"none"],transformOrigin:Array(3).fill(we)},{duration:225,easing:Mi})}}return Ve(()=>{const m=Le.filterProps(t);return c(Le,W({symbol:Yt,ref:a,class:["v-tab",t.class],style:t.style,tabindex:u.value?0:-1,role:"tab","aria-selected":String(u.value),active:!1},m,r,{block:t.fixed,maxWidth:t.fixed?300:void 0,"onGroup:selected":f}),{...n,default:()=>{var p;return c(j,null,[((p=n.default)==null?void 0:p.call(n))??t.text,!t.hideSlider&&c("div",{ref:l,class:["v-tab__slider",i.value],style:s.value},null)])}})}),Jn({},a)}}),Ki=Ue({...Kt(ai(),["continuous","nextIcon","prevIcon","showArrows","touch","mandatory"])},"VTabsWindow"),Yi=Fe()({name:"VTabsWindow",props:Ki(),emits:{"update:modelValue":t=>!0},setup(t,e){let{slots:n}=e;const r=ji(Yt,null),i=Re(t,"modelValue"),s=N({get(){var a;return i.value!=null||!r?i.value:(a=r.items.value.find(l=>r.selected.value.includes(l.id)))==null?void 0:a.value},set(a){i.value=a}});return Ve(()=>{const a=xt.filterProps(t);return c(xt,W({_as:"VTabsWindow"},a,{modelValue:s.value,"onUpdate:modelValue":l=>s.value=l,class:["v-tabs-window",t.class],style:t.style,mandatory:!1,touch:!1}),n)}),{}}}),Ji=Ue({...oi()},"VTabsWindowItem"),Xi=Fe()({name:"VTabsWindowItem",props:Ji(),setup(t,e){let{slots:n}=e;return Ve(()=>{const r=Ge.filterProps(t);return c(Ge,W({_as:"VTabsWindowItem"},r,{class:["v-tabs-window-item",t.class],style:t.style}),n)}),{}}});function Qi(t){return t?t.map(e=>Fi(e)?e:{text:e,value:e}):[]}const Zi=Ue({alignTabs:{type:String,default:"start"},color:String,fixedTabs:Boolean,items:{type:Array,default:()=>[]},stacked:Boolean,bgColor:String,grow:Boolean,height:{type:[Number,String],default:void 0},hideSlider:Boolean,sliderColor:String,...li({mandatory:"force",selectedClass:"v-tab-item--selected"}),...qn(),...Kn()},"VTabs"),es=Fe()({name:"VTabs",props:Zi(),emits:{"update:modelValue":t=>!0},setup(t,e){let{attrs:n,slots:r}=e;const i=Re(t,"modelValue"),s=N(()=>Qi(t.items)),{densityClasses:a}=ci(t),{backgroundColorClasses:l,backgroundColorStyles:o}=ui(ve(t,"bgColor")),{scopeId:u}=di();return xi({VTab:{color:ve(t,"color"),direction:ve(t,"direction"),stacked:ve(t,"stacked"),fixed:ve(t,"fixedTabs"),sliderColor:ve(t,"sliderColor"),hideSlider:ve(t,"hideSlider")}}),Ve(()=>{const f=dn.filterProps(t),m=!!(r.window||t.items.length>0);return c(j,null,[c(dn,W(f,{modelValue:i.value,"onUpdate:modelValue":p=>i.value=p,class:["v-tabs",`v-tabs--${t.direction}`,`v-tabs--align-tabs-${t.alignTabs}`,{"v-tabs--fixed-tabs":t.fixedTabs,"v-tabs--grow":t.grow,"v-tabs--stacked":t.stacked},a.value,l.value,t.class],style:[{"--v-tabs-height":Ui(t.height)},o.value,t.style],role:"tablist",symbol:Yt},u,n),{default:()=>{var p;return[((p=r.default)==null?void 0:p.call(r))??s.value.map(w=>{var P;return((P=r.tab)==null?void 0:P.call(r,{item:w}))??c(ut,W(w,{key:w.text,value:w.value}),{default:r[`tab.${w.value}`]?()=>{var _;return(_=r[`tab.${w.value}`])==null?void 0:_.call(r,{item:w})}:void 0})})]}}),m&&c(Yi,W({modelValue:i.value,"onUpdate:modelValue":p=>i.value=p,key:"tabs-window"},u),{default:()=>{var p;return[s.value.map(w=>{var P;return((P=r.item)==null?void 0:P.call(r,{item:w}))??c(Xi,{value:w.value},{default:()=>{var _;return(_=r[`item.${w.value}`])==null?void 0:_.call(r,{item:w})}})}),(p=r.window)==null?void 0:p.call(r)]}})])}),{}}}),ts={name:"MFAnalysis",components:{},props:{analysisReport:{type:Object,required:!0}},data:()=>({showDialog:!1,showSectorDetails:!1,selectedOverlap:null,activeTab:0,downloading:!1,overlapHeaders:[{title:"Fund 1",key:"fund1_name"},{title:"Fund 2",key:"fund2_name"},{title:"Overlap %",key:"overlap_percentage"},{title:"Actions",key:"actions",sortable:!1}],expenseHeaders:[{title:"Fund Name",key:"fund_name"},{title:"Expense Ratio",key:"expense_ratio"},{title:"Category Average",key:"category_avg"},{title:"Relative Cost",key:"relative_cost"}],etfRecommendationHeaders:[{title:"Fund Name",key:"fund_name"},{title:"ETF Name",key:"etf"},{title:"Overlap %",key:"overlap_percentage"},{title:"ETF Fee %",key:"etf_fee"},{title:"Fund Fee %",key:"fund_fee"},{title:"Potential Savings %",key:"potential_savings"}]}),computed:{sectorChartSeries(){return Object.values(this.analysisReport.diversification.sector_breakdown).map(t=>t.percentage)},formattedEtfRecommendations(){const t=[];return console.log(this.analysisReport.recommendedETFs),Object.entries(this.analysisReport.recommendedETFs).forEach(([e,n])=>{console.log([e,n]),n.length>0&&n.forEach(r=>{t.push({fund_name:e,etf:r.etf,overlap_percentage:r["overlap%"],etf_fee:r.etf_fee,fund_fee:r.fund_fee,potential_savings:r.potential_savings})})}),console.log("computed formattedEtfRecom",t),t},sectorChartOptions(){return{chart:{type:"donut",animations:{dynamicAnimation:{enabled:!0}}},labels:Object.keys(this.analysisReport.diversification.sector_breakdown),plotOptions:{pie:{donut:{size:"65%"}}},tooltip:{y:{formatter:t=>`${t.toFixed(1)}%`}},legend:{position:"bottom",horizontalAlign:"center",fontSize:"14px",markers:{width:12,height:12,radius:12}},responsive:[{breakpoint:480,options:{chart:{width:300},legend:{position:"bottom"}}}],dataLabels:{enabled:!1},colors:["#008FFB","#00E396","#FEB019","#FF4560","#775DD0","#3F51B5","#546E7A","#D4526E","#8D5B4C","#F86624","#D7263D","#1B998B","#2E294E","#F46036","#E2C044"]}},sectorTableData(){const t=this.analysisReport.diversification.sector_breakdown;return Object.entries(t).map(([e,n])=>({name:e,percentage:n.percentage})).sort((e,n)=>n.percentage-e.percentage)},sectorHeaders(){return[{title:"Sector",key:"name"},{title:"Allocation (%)",key:"percentage"}]},performanceHeaders(){return[{title:"Fund Name",key:"mutual_fund_name",align:"start",sortable:!0},{title:"5 Year",key:"mutual_fund_return_5Y",align:"end",sortable:!0,format:t=>`${t}%`},{title:"3 Year",key:"mutual_fund_return_3Y",align:"end",sortable:!0,format:t=>`${t}%`},{title:"1 Year",key:"mutual_fund_return_1Y",align:"end",sortable:!0,format:t=>`${t}%`}]},performanceTableData(){const t=this.analysisReport.performanceAnalysis;return console.log("flattened",t.map(e=>({mutual_fund_name:e.mutual_fund_name,mutual_fund_return_1Y:e.mutual_fund_return_1Y||"-",mutual_fund_return_3Y:e.mutual_fund_return_3Y||"-",mutual_fund_return_5Y:e.mutual_fund_return_5Y||"-"}))),t.map(e=>({mutual_fund_name:e.mutual_fund_name,mutual_fund_return_1Y:e.mutual_fund_return_1Y||"-",mutual_fund_return_3Y:e.mutual_fund_return_3Y||"-",mutual_fund_return_5Y:e.mutual_fund_return_5Y||"-"}))},formattedOverlaps(){return this.analysisReport.overlaps.overlaps.map(t=>({fund1_name:t.comparison_metadata.fund1.name,fund2_name:t.comparison_metadata.fund2.name,overlap_percentage:t.overlap_percentage,...t})).sort((t,e)=>e.overlap_percentage-t.overlap_percentage)}},methods:{getOverlapColor(t){return t>=25?"red":t>=15?"orange":"green"},getDiversificationColor(t){return{"over-diversified":"orange",concentrated:"red",optimal:"green"}[t]||"grey"},getCategoryColor(t){return{"large cap":"blue","mid cap":"purple","small cap":"deep-purple","multi cap":"indigo"}[t.toLowerCase()]||"grey"},getExpenseColor(t){return t>.5?"red":t<-.5?"green":"orange"},showOverlapDetails(t){this.selectedOverlap=t,this.showDialog=!0},async downloadCompleteReport(){this.downloading=!0;try{const t=new jsPDF("p","mm","a4");let e=10;t.setFontSize(18),t.text("Mutual Fund Analysis Report",105,e,{align:"center"}),e+=15,t.setFontSize(14),t.text("1. Portfolio Overview",10,e),e+=10,t.setFontSize(10);const n=`Total Unique Stocks: ${this.analysisReport.diversification.unique_stocks.count}`;t.text(n,15,e),e+=5,t.text(`Status: ${this.analysisReport.diversification.unique_stocks.status}`,15,e),e+=5,t.text(`Recommendation: ${this.analysisReport.diversification.unique_stocks.recommendation}`,15,e),e+=15,t.setFontSize(14),t.text("2. Sector Allocation",10,e),e+=10;const r=Object.entries(this.analysisReport.diversification.sector_breakdown).map(([u,f])=>[u,`${f.percentage.toFixed(1)}%`]).sort((u,f)=>parseFloat(f[1])-parseFloat(u[1]));t.autoTable({startY:e,head:[["Sector","Allocation"]],body:r,theme:"striped",headStyles:{fillColor:[71,85,119]},columnStyles:{0:{cellWidth:100},1:{cellWidth:40,halign:"right"}},margin:{left:15}}),e=t.lastAutoTable.finalY+10,t.setFontSize(14),t.text("3. Fund Category Distribution",10,e),e+=10;const i=Object.entries(this.analysisReport.diversification.category_breakdown).map(([u,f])=>[u,`${f.percentage.toFixed(1)}%`]).sort((u,f)=>parseFloat(f[1])-parseFloat(u[1]));t.autoTable({startY:e,head:[["Category","Allocation"]],body:i,theme:"striped",headStyles:{fillColor:[71,85,119]},columnStyles:{0:{cellWidth:100},1:{cellWidth:40,halign:"right"}},margin:{left:15}}),e=t.lastAutoTable.finalY+10,t.setFontSize(14),t.text("4. Stock Overlaps Analysis",10,e),e+=10;const s=this.formattedOverlaps.filter(u=>u.overlap_percentage>=25).sort((u,f)=>f.overlap_percentage-u.overlap_percentage),a=this.formattedOverlaps.map(u=>[u.fund1_name,u.fund2_name,`${u.overlap_percentage.toFixed(1)}%`]).sort((u,f)=>parseFloat(f[2])-parseFloat(u[2]));t.autoTable({startY:e,head:[["Fund 1","Fund 2","Overlap"]],body:a,theme:"striped",headStyles:{fillColor:[71,85,119]},columnStyles:{0:{cellWidth:70},1:{cellWidth:70},2:{cellWidth:30,halign:"right"}},margin:{left:15}}),e=t.lastAutoTable.finalY+10,s.length>0&&(t.setFontSize(10),t.text("High Overlap Warning:",15,e,{style:"bold"}),e+=5,t.text("The following fund pairs have significant overlap (>25%):",15,e),e+=5,s.forEach(u=>{const f=`• ${u.fund1_name} - ${u.fund2_name}: ${u.overlap_percentage.toFixed(1)}%`;t.text(f,20,e),e+=5})),e+=5,t.setFontSize(14),t.text("5. Expense Ratio Analysis",10,e),e+=10,console.log(this.analysisReport.expenses);const l=this.analysisReport.expenses.map(u=>[u.fund_name,`${u.expense_ratio.toFixed(2)}%`,`${u.category_avg.toFixed(2)}%`,`${u.relative_cost>0?"+":""}${u.relative_cost.toFixed(2)}%`]);t.autoTable({startY:e,head:[["Fund Name","Expense Ratio","Category Avg","Relative Cost"]],body:l,theme:"striped",headStyles:{fillColor:[71,85,119]},columnStyles:{0:{cellWidth:70},1:{cellWidth:40,halign:"right"},2:{cellWidth:40,halign:"right"},3:{cellWidth:40,halign:"right"}},margin:{left:15}}),e=t.lastAutoTable.finalY+10,t.setFontSize(14),t.text("6. Key Recommendations",10,e),e+=10,t.setFontSize(10),this.generateRecommendations().forEach(u=>{t.text(`• ${u}`,15,e),e+=5}),t.save("mutual_fund_analysis_report.pdf")}catch(t){console.error("Error generating PDF:",t)}finally{this.downloading=!1}},generateRecommendations(){var r,i;const t=[];this.analysisReport.overlaps.maxOverlap>25&&t.push(`Consider consolidating funds with high overlap (${(r=this.analysisReport.overlaps.maxOverlapPair)==null?void 0:r.fund1_name} and ${(i=this.analysisReport.overlaps.maxOverlapPair)==null?void 0:i.fund2_name})`);const{unique_stocks:e}=this.analysisReport.diversification;e.count>100?t.push("Portfolio may be over-diversified. Consider streamlining holdings."):e.count<30&&t.push("Portfolio concentration is high. Consider adding more diversity.");const n=this.analysisReport.expenses.filter(s=>s.relative_cost>.5);return n.length>0&&t.push(`Consider reviewing high expense funds: ${n.map(s=>s.fund_name).join(", ")}`),t}}},ns={class:"analysis-container"},rs={class:"mt-2"};function is(t,e,n,r,i,s){return z(),ke("div",ns,[c(Z,{class:"mb-4"},{default:d(()=>[c(X,{class:"d-flex flex-wrap"},{default:d(()=>[e[4]||(e[4]=b("span",{class:"text-h6"},"Stock Overlap Analysis",-1)),c(ot)]),_:1}),c(Q,null,{default:d(()=>[c(He,{headers:t.overlapHeaders,items:s.formattedOverlaps,"items-per-page":5,density:"comfortable",class:"elevation-1",hover:!0},{"item.overlap_percentage":d(({item:a})=>[c(je,{color:s.getOverlapColor(a.overlap_percentage),"text-color":"white"},{default:d(()=>[k(T(a.overlap_percentage)+"% ",1)]),_:2},1032,["color"])]),"item.actions":d(({item:a})=>[c(Le,{small:"",text:"",color:"primary",onClick:l=>s.showOverlapDetails(a)},{default:d(()=>e[5]||(e[5]=[k(" Details ")])),_:2},1032,["onClick"])]),_:1},8,["headers","items"])]),_:1})]),_:1}),c(Z,{class:"mb-4"},{default:d(()=>[c(X,{class:"text-h6"},{default:d(()=>e[6]||(e[6]=[k("Portfolio Diversification Analysis")])),_:1}),c(Q,null,{default:d(()=>[c(We,{dense:""},{default:d(()=>[c(Se,null,{default:d(()=>[c(Z,{outlined:""},{default:d(()=>[c(X,{class:"text-subtitle-1"},{default:d(()=>[k(" Unique Stocks: "+T(n.analysisReport.diversification.unique_stocks.count),1)]),_:1}),c(Q,null,{default:d(()=>[c(je,{color:s.getDiversificationColor(n.analysisReport.diversification.unique_stocks.status),"text-color":"white"},{default:d(()=>[k(T(n.analysisReport.diversification.unique_stocks.status),1)]),_:1},8,["color"]),b("p",rs,T(n.analysisReport.diversification.unique_stocks.recommendation),1)]),_:1})]),_:1})]),_:1})]),_:1}),c(We,null,{default:d(()=>[c(Se,null,{default:d(()=>[c(Z,null,{default:d(()=>[c(X,null,{default:d(()=>[e[7]||(e[7]=k(" Sector Analysis Details ")),c(ot)]),_:1}),c(Q,null,{default:d(()=>[c(He,{headers:s.sectorHeaders,items:s.sectorTableData,"items-per-page":5,density:"comfortable",class:"elevation-1"},{item:d(({item:a})=>[b("tr",null,[b("td",null,T(a.name),1),b("td",null,[c(hn,{value:a.percentage,height:"20",color:"primary"},{default:d(()=>[k(T(a.percentage.toFixed(1))+"% ",1)]),_:2},1032,["value"])])])]),_:1},8,["headers","items"])]),_:1})]),_:1})]),_:1})]),_:1}),c(We,null,{default:d(()=>[c(Se,null,{default:d(()=>[c(Z,null,{default:d(()=>[c(X,null,{default:d(()=>[e[8]||(e[8]=k(" Performance Analysis (Returns) ")),c(ot)]),_:1}),c(Q,null,{default:d(()=>[c(He,{headers:s.performanceHeaders,items:s.performanceTableData,"items-per-page":5,density:"comfortable",class:"elevation-1"},null,8,["headers","items"])]),_:1})]),_:1})]),_:1})]),_:1}),c(We,null,{default:d(()=>[c(Se,{cols:"12",sm:"6",md:"12",lg:"12"},{default:d(()=>[c(Z,{outlined:""},{default:d(()=>[c(X,{class:"text-subtitle-1"},{default:d(()=>e[9]||(e[9]=[k("Fund Category Distribution")])),_:1}),c(Q,null,{default:d(()=>[(z(!0),ke(j,null,st(n.analysisReport.diversification.category_breakdown,(a,l)=>(z(),ze(hn,{key:l,value:a.percentage,color:s.getCategoryColor(l),height:"25",striped:""},{default:d(()=>[k(T(l)+": "+T(a.percentage)+"% ",1)]),_:2},1032,["value","color"]))),128))]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),c(Z,null,{default:d(()=>[c(X,{class:"text-h6"},{default:d(()=>e[10]||(e[10]=[k("Expense Ratio Analysis")])),_:1}),c(Q,null,{default:d(()=>[c(He,{headers:t.expenseHeaders,items:n.analysisReport.expenses,"items-per-page":5,density:"comfortable",hover:!0},{"item.relative_cost":d(({item:a})=>[c(je,{color:s.getExpenseColor(a.relative_cost),"text-color":"white"},{default:d(()=>[k(T(a.relative_cost>0?"+":"")+T(a.relative_cost)+"% ",1)]),_:2},1032,["color"])]),_:1},8,["headers","items"])]),_:1})]),_:1}),c(Z,{class:"mt-4"},{default:d(()=>[c(X,{class:"text-h6"},{default:d(()=>e[11]||(e[11]=[k("Similar ETFs")])),_:1}),c(Q,null,{default:d(()=>[c(He,{headers:t.etfRecommendationHeaders,items:s.formattedEtfRecommendations,"items-per-page":5,density:"comfortable",hover:!0},{"item.overlap_percentage":d(({item:a})=>[k(T(a.overlap_percentage.toFixed(2))+"% ",1)]),"item.etf_fee":d(({item:a})=>[k(T(a.etf_fee.toFixed(2))+"% ",1)]),"item.fund_fee":d(({item:a})=>[k(T(a.fund_fee.toFixed(2))+"% ",1)]),"item.potential_savings":d(({item:a})=>[c(je,{color:a.potential_savings>.3?"green":"orange","text-color":"white"},{default:d(()=>[k(T(a.potential_savings.toFixed(2))+"% ",1)]),_:2},1032,["color"])]),_:1},8,["headers","items"])]),_:1})]),_:1}),c(zi,{modelValue:t.showDialog,"onUpdate:modelValue":e[3]||(e[3]=a=>t.showDialog=a),"max-width":"800px"},{default:d(()=>[c(Z,null,{default:d(()=>[c(X,null,{default:d(()=>[e[13]||(e[13]=k(" Overlap Details ")),c(ot),c(Le,{icon:"",onClick:e[0]||(e[0]=a=>t.showDialog=!1)},{default:d(()=>[c(Ut,null,{default:d(()=>e[12]||(e[12]=[k("mdi-close")])),_:1})]),_:1})]),_:1}),t.selectedOverlap?(z(),ze(Q,{key:0},{default:d(()=>[c(es,{modelValue:t.activeTab,"onUpdate:modelValue":e[1]||(e[1]=a=>t.activeTab=a)},{default:d(()=>[c(ut,null,{default:d(()=>e[14]||(e[14]=[k("Overlapping Stocks")])),_:1}),c(ut,null,{default:d(()=>e[15]||(e[15]=[k("Unique Stocks")])),_:1}),c(ut,null,{default:d(()=>e[16]||(e[16]=[k("Fund Comparison")])),_:1})]),_:1},8,["modelValue"]),c(xt,{modelValue:t.activeTab,"onUpdate:modelValue":e[2]||(e[2]=a=>t.activeTab=a)},{default:d(()=>[c(Ge,null,{default:d(()=>[c(fn,null,{default:d(()=>[b("thead",null,[b("tr",null,[e[17]||(e[17]=b("th",null,"Stock",-1)),b("th",null,T(t.selectedOverlap.comparison_metadata.fund1.name)+" (%) ",1),b("th",null,T(t.selectedOverlap.comparison_metadata.fund2.name)+" (%) ",1)])]),b("tbody",null,[(z(!0),ke(j,null,st(t.selectedOverlap.overlapping_stocks,a=>(z(),ke("tr",{key:a.stock_name},[b("td",null,T(a.stock_name),1),b("td",null,T(a.fund1_holding),1),b("td",null,T(a.fund2_holding),1)]))),128))])]),_:1})]),_:1}),c(Ge,null,{default:d(()=>[c(We,null,{default:d(()=>[c(Se,{cols:"6"},{default:d(()=>[b("h3",null,T(t.selectedOverlap.comparison_metadata.fund1.name)+" Unique Stocks ",1),c(Ft,{dense:""},{default:d(()=>[(z(!0),ke(j,null,st(t.selectedOverlap.fund1_unique_stocks,a=>(z(),ze(mt,{key:a},{default:d(()=>[k(T(a),1)]),_:2},1024))),128))]),_:1})]),_:1}),c(Se,{cols:"6"},{default:d(()=>[b("h3",null,T(t.selectedOverlap.comparison_metadata.fund2.name)+" Unique Stocks ",1),c(Ft,{dense:""},{default:d(()=>[(z(!0),ke(j,null,st(t.selectedOverlap.fund2_unique_stocks,a=>(z(),ze(mt,{key:a},{default:d(()=>[k(T(a),1)]),_:2},1024))),128))]),_:1})]),_:1})]),_:1})]),_:1}),c(Ge,null,{default:d(()=>[c(fn,null,{default:d(()=>[b("thead",null,[b("tr",null,[e[18]||(e[18]=b("th",null,"Metric",-1)),b("th",null,T(t.selectedOverlap.comparison_metadata.fund1.name),1),b("th",null,T(t.selectedOverlap.comparison_metadata.fund2.name),1)])]),b("tbody",null,[b("tr",null,[e[19]||(e[19]=b("td",null,"AUM (millions)",-1)),b("td",null,T(t.selectedOverlap.comparison_metadata.fund1.aum),1),b("td",null,T(t.selectedOverlap.comparison_metadata.fund2.aum),1)]),b("tr",null,[e[20]||(e[20]=b("td",null,"Star Rating",-1)),b("td",null,[c(_n,{value:t.selectedOverlap.comparison_metadata.fund1.star_rating,readonly:"",small:"",dense:""},null,8,["value"])]),b("td",null,[c(_n,{value:t.selectedOverlap.comparison_metadata.fund2.star_rating,readonly:"",small:"",dense:""},null,8,["value"])])]),b("tr",null,[e[21]||(e[21]=b("td",null,"Expense Ratio",-1)),b("td",null,T(t.selectedOverlap.comparison_metadata.fund1.expenses_ratio)+"% ",1),b("td",null,T(t.selectedOverlap.comparison_metadata.fund2.expenses_ratio)+"% ",1)])])]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1})):Zn("",!0)]),_:1})]),_:1},8,["modelValue"])])}const ql=Xn(ts,[["render",is],["__scopeId","data-v-75eca7ae"]]);var yn={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const er=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let i=t.charCodeAt(r);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},ss=function(t){const e=[];let n=0,r=0;for(;n<t.length;){const i=t[n++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=t[n++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=t[n++],a=t[n++],l=t[n++],o=((i&7)<<18|(s&63)<<12|(a&63)<<6|l&63)-65536;e[r++]=String.fromCharCode(55296+(o>>10)),e[r++]=String.fromCharCode(56320+(o&1023))}else{const s=t[n++],a=t[n++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|a&63)}}return e.join("")},tr={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<t.length;i+=3){const s=t[i],a=i+1<t.length,l=a?t[i+1]:0,o=i+2<t.length,u=o?t[i+2]:0,f=s>>2,m=(s&3)<<4|l>>4;let p=(l&15)<<2|u>>6,w=u&63;o||(w=64,a||(p=64)),r.push(n[f],n[m],n[p],n[w])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(er(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):ss(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<t.length;){const s=n[t.charAt(i++)],l=i<t.length?n[t.charAt(i)]:0;++i;const u=i<t.length?n[t.charAt(i)]:64;++i;const m=i<t.length?n[t.charAt(i)]:64;if(++i,s==null||l==null||u==null||m==null)throw new as;const p=s<<2|l>>4;if(r.push(p),u!==64){const w=l<<4&240|u>>2;if(r.push(w),m!==64){const P=u<<6&192|m;r.push(P)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class as extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const os=function(t){const e=er(t);return tr.encodeByteArray(e,!0)},nr=function(t){return os(t).replace(/\./g,"")},rr=function(t){try{return tr.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ls(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cs=()=>ls().__FIREBASE_DEFAULTS__,us=()=>{if(typeof process>"u"||typeof yn>"u")return;const t=yn.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},ds=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&rr(t[1]);return e&&JSON.parse(e)},Jt=()=>{try{return cs()||us()||ds()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},hs=t=>{var e,n;return(n=(e=Jt())===null||e===void 0?void 0:e.emulatorHosts)===null||n===void 0?void 0:n[t]},ir=()=>{var t;return(t=Jt())===null||t===void 0?void 0:t.config},sr=t=>{var e;return(e=Jt())===null||e===void 0?void 0:e[`_${t}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fs{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function V(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function ps(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(V())}function ms(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function gs(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function vs(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function _s(){const t=V();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function ys(){try{return typeof indexedDB=="object"}catch{return!1}}function bs(){return new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var s;e(((s=i.error)===null||s===void 0?void 0:s.message)||"")}}catch(n){e(n)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Is="FirebaseError";class fe extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=Is,Object.setPrototypeOf(this,fe.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Xe.prototype.create)}}class Xe{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},i=`${this.service}/${e}`,s=this.errors[e],a=s?ws(s,r):"Error",l=`${this.serviceName}: ${a} (${i}).`;return new fe(i,l,r)}}function ws(t,e){return t.replace(Es,(n,r)=>{const i=e[r];return i!=null?String(i):`<${r}?>`})}const Es=/\{\$([^}]+)}/g;function Ts(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function gt(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const i of n){if(!r.includes(i))return!1;const s=t[i],a=e[i];if(bn(s)&&bn(a)){if(!gt(s,a))return!1}else if(s!==a)return!1}for(const i of r)if(!n.includes(i))return!1;return!0}function bn(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qe(t){const e=[];for(const[n,r]of Object.entries(t))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function Ss(t,e){const n=new ks(t,e);return n.subscribe.bind(n)}class ks{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,r){let i;if(e===void 0&&n===void 0&&r===void 0)throw new Error("Missing Observer.");Cs(e,["next","error","complete"])?i=e:i={next:e,error:n,complete:r},i.next===void 0&&(i.next=Rt),i.error===void 0&&(i.error=Rt),i.complete===void 0&&(i.complete=Rt);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Cs(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function Rt(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pe(t){return t&&t._delegate?t._delegate:t}class Me{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _e="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class As{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new fs;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:n});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){var n;const r=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),i=(n=e==null?void 0:e.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(s){if(i)return null;throw s}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Ps(e))try{this.getOrInitializeService({instanceIdentifier:_e})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(n);try{const s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=_e){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=_e){return this.instances.has(e)}getOptions(e=_e){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[s,a]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(s);r===l&&a.resolve(i)}return i}onInit(e,n){var r;const i=this.normalizeInstanceIdentifier(n),s=(r=this.onInitCallbacks.get(i))!==null&&r!==void 0?r:new Set;s.add(e),this.onInitCallbacks.set(i,s);const a=this.instances.get(i);return a&&e(a,i),()=>{s.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const i of r)try{i(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Rs(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=_e){return this.component?this.component.multipleInstances?e:_e:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Rs(t){return t===_e?void 0:t}function Ps(t){return t.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Os{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new As(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var C;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(C||(C={}));const Ds={debug:C.DEBUG,verbose:C.VERBOSE,info:C.INFO,warn:C.WARN,error:C.ERROR,silent:C.SILENT},Ns=C.INFO,Ls={[C.DEBUG]:"log",[C.VERBOSE]:"log",[C.INFO]:"info",[C.WARN]:"warn",[C.ERROR]:"error"},Ms=(t,e,...n)=>{if(e<t.logLevel)return;const r=new Date().toISOString(),i=Ls[e];if(i)console[i](`[${r}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class ar{constructor(e){this.name=e,this._logLevel=Ns,this._logHandler=Ms,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in C))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Ds[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,C.DEBUG,...e),this._logHandler(this,C.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,C.VERBOSE,...e),this._logHandler(this,C.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,C.INFO,...e),this._logHandler(this,C.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,C.WARN,...e),this._logHandler(this,C.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,C.ERROR,...e),this._logHandler(this,C.ERROR,...e)}}const xs=(t,e)=>e.some(n=>t instanceof n);let In,wn;function Us(){return In||(In=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Fs(){return wn||(wn=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const or=new WeakMap,Vt=new WeakMap,lr=new WeakMap,Pt=new WeakMap,Xt=new WeakMap;function Vs(t){const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("success",s),t.removeEventListener("error",a)},s=()=>{n(de(t.result)),i()},a=()=>{r(t.error),i()};t.addEventListener("success",s),t.addEventListener("error",a)});return e.then(n=>{n instanceof IDBCursor&&or.set(n,t)}).catch(()=>{}),Xt.set(e,t),e}function Bs(t){if(Vt.has(t))return;const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("complete",s),t.removeEventListener("error",a),t.removeEventListener("abort",a)},s=()=>{n(),i()},a=()=>{r(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",s),t.addEventListener("error",a),t.addEventListener("abort",a)});Vt.set(t,e)}let Bt={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return Vt.get(t);if(e==="objectStoreNames")return t.objectStoreNames||lr.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return de(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function $s(t){Bt=t(Bt)}function Hs(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=t.call(Ot(this),e,...n);return lr.set(r,e.sort?e.sort():[e]),de(r)}:Fs().includes(t)?function(...e){return t.apply(Ot(this),e),de(or.get(this))}:function(...e){return de(t.apply(Ot(this),e))}}function Ws(t){return typeof t=="function"?Hs(t):(t instanceof IDBTransaction&&Bs(t),xs(t,Us())?new Proxy(t,Bt):t)}function de(t){if(t instanceof IDBRequest)return Vs(t);if(Pt.has(t))return Pt.get(t);const e=Ws(t);return e!==t&&(Pt.set(t,e),Xt.set(e,t)),e}const Ot=t=>Xt.get(t);function js(t,e,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){const a=indexedDB.open(t,e),l=de(a);return r&&a.addEventListener("upgradeneeded",o=>{r(de(a.result),o.oldVersion,o.newVersion,de(a.transaction),o)}),n&&a.addEventListener("blocked",o=>n(o.oldVersion,o.newVersion,o)),l.then(o=>{s&&o.addEventListener("close",()=>s()),i&&o.addEventListener("versionchange",u=>i(u.oldVersion,u.newVersion,u))}).catch(()=>{}),l}const zs=["get","getKey","getAll","getAllKeys","count"],Gs=["put","add","delete","clear"],Dt=new Map;function En(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(Dt.get(e))return Dt.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,i=Gs.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||zs.includes(n)))return;const s=async function(a,...l){const o=this.transaction(a,i?"readwrite":"readonly");let u=o.store;return r&&(u=u.index(l.shift())),(await Promise.all([u[n](...l),i&&o.done]))[0]};return Dt.set(e,s),s}$s(t=>({...t,get:(e,n,r)=>En(e,n)||t.get(e,n,r),has:(e,n)=>!!En(e,n)||t.has(e,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qs{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(Ks(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function Ks(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const $t="@firebase/app",Tn="0.10.17";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const se=new ar("@firebase/app"),Ys="@firebase/app-compat",Js="@firebase/analytics-compat",Xs="@firebase/analytics",Qs="@firebase/app-check-compat",Zs="@firebase/app-check",ea="@firebase/auth",ta="@firebase/auth-compat",na="@firebase/database",ra="@firebase/data-connect",ia="@firebase/database-compat",sa="@firebase/functions",aa="@firebase/functions-compat",oa="@firebase/installations",la="@firebase/installations-compat",ca="@firebase/messaging",ua="@firebase/messaging-compat",da="@firebase/performance",ha="@firebase/performance-compat",fa="@firebase/remote-config",pa="@firebase/remote-config-compat",ma="@firebase/storage",ga="@firebase/storage-compat",va="@firebase/firestore",_a="@firebase/vertexai",ya="@firebase/firestore-compat",ba="firebase",Ia="11.1.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ht="[DEFAULT]",wa={[$t]:"fire-core",[Ys]:"fire-core-compat",[Xs]:"fire-analytics",[Js]:"fire-analytics-compat",[Zs]:"fire-app-check",[Qs]:"fire-app-check-compat",[ea]:"fire-auth",[ta]:"fire-auth-compat",[na]:"fire-rtdb",[ra]:"fire-data-connect",[ia]:"fire-rtdb-compat",[sa]:"fire-fn",[aa]:"fire-fn-compat",[oa]:"fire-iid",[la]:"fire-iid-compat",[ca]:"fire-fcm",[ua]:"fire-fcm-compat",[da]:"fire-perf",[ha]:"fire-perf-compat",[fa]:"fire-rc",[pa]:"fire-rc-compat",[ma]:"fire-gcs",[ga]:"fire-gcs-compat",[va]:"fire-fst",[ya]:"fire-fst-compat",[_a]:"fire-vertex","fire-js":"fire-js",[ba]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vt=new Map,Ea=new Map,Wt=new Map;function Sn(t,e){try{t.container.addComponent(e)}catch(n){se.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function Ke(t){const e=t.name;if(Wt.has(e))return se.debug(`There were multiple attempts to register component ${e}.`),!1;Wt.set(e,t);for(const n of vt.values())Sn(n,t);for(const n of Ea.values())Sn(n,t);return!0}function cr(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function te(t){return t.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ta={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},he=new Xe("app","Firebase",Ta);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sa{constructor(e,n,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Me("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw he.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ze=Ia;function ur(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const r=Object.assign({name:Ht,automaticDataCollectionEnabled:!1},e),i=r.name;if(typeof i!="string"||!i)throw he.create("bad-app-name",{appName:String(i)});if(n||(n=ir()),!n)throw he.create("no-options");const s=vt.get(i);if(s){if(gt(n,s.options)&&gt(r,s.config))return s;throw he.create("duplicate-app",{appName:i})}const a=new Os(i);for(const o of Wt.values())a.addComponent(o);const l=new Sa(n,r,a);return vt.set(i,l),l}function ka(t=Ht){const e=vt.get(t);if(!e&&t===Ht&&ir())return ur();if(!e)throw he.create("no-app",{appName:t});return e}function Pe(t,e,n){var r;let i=(r=wa[t])!==null&&r!==void 0?r:t;n&&(i+=`-${n}`);const s=i.match(/\s|\//),a=e.match(/\s|\//);if(s||a){const l=[`Unable to register library "${i}" with version "${e}":`];s&&l.push(`library name "${i}" contains illegal characters (whitespace or "/")`),s&&a&&l.push("and"),a&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),se.warn(l.join(" "));return}Ke(new Me(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ca="firebase-heartbeat-database",Aa=1,Ye="firebase-heartbeat-store";let Nt=null;function dr(){return Nt||(Nt=js(Ca,Aa,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(Ye)}catch(n){console.warn(n)}}}}).catch(t=>{throw he.create("idb-open",{originalErrorMessage:t.message})})),Nt}async function Ra(t){try{const n=(await dr()).transaction(Ye),r=await n.objectStore(Ye).get(hr(t));return await n.done,r}catch(e){if(e instanceof fe)se.warn(e.message);else{const n=he.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});se.warn(n.message)}}}async function kn(t,e){try{const r=(await dr()).transaction(Ye,"readwrite");await r.objectStore(Ye).put(e,hr(t)),await r.done}catch(n){if(n instanceof fe)se.warn(n.message);else{const r=he.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});se.warn(r.message)}}}function hr(t){return`${t.name}!${t.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pa=1024,Oa=30*24*60*60*1e3;class Da{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new La(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=Cn();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(a=>a.date===s)?void 0:(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(a=>{const l=new Date(a.date).valueOf();return Date.now()-l<=Oa}),this._storage.overwrite(this._heartbeatsCache))}catch(r){se.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=Cn(),{heartbeatsToSend:r,unsentEntries:i}=Na(this._heartbeatsCache.heartbeats),s=nr(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(n){return se.warn(n),""}}}function Cn(){return new Date().toISOString().substring(0,10)}function Na(t,e=Pa){const n=[];let r=t.slice();for(const i of t){const s=n.find(a=>a.agent===i.agent);if(s){if(s.dates.push(i.date),An(n)>e){s.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),An(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class La{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return ys()?bs().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await Ra(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var n;if(await this._canUseIndexedDBPromise){const i=await this.read();return kn(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var n;if(await this._canUseIndexedDBPromise){const i=await this.read();return kn(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function An(t){return nr(JSON.stringify({version:2,heartbeats:t})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ma(t){Ke(new Me("platform-logger",e=>new qs(e),"PRIVATE")),Ke(new Me("heartbeat",e=>new Da(e),"PRIVATE")),Pe($t,Tn,t),Pe($t,Tn,"esm2017"),Pe("fire-js","")}Ma("");function fr(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const xa=fr,pr=new Xe("auth","Firebase",fr());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _t=new ar("@firebase/auth");function Ua(t,...e){_t.logLevel<=C.WARN&&_t.warn(`Auth (${Ze}): ${t}`,...e)}function dt(t,...e){_t.logLevel<=C.ERROR&&_t.error(`Auth (${Ze}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function J(t,...e){throw Zt(t,...e)}function G(t,...e){return Zt(t,...e)}function Qt(t,e,n){const r=Object.assign(Object.assign({},xa()),{[e]:n});return new Xe("auth","Firebase",r).create(e,{appName:t.name})}function be(t){return Qt(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Fa(t,e,n){const r=n;if(!(e instanceof r))throw r.name!==e.constructor.name&&J(t,"argument-error"),Qt(t,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Zt(t,...e){if(typeof t!="string"){const n=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=t.name),t._errorFactory.create(n,...r)}return pr.create(t,...e)}function g(t,e,...n){if(!t)throw Zt(e,...n)}function ne(t){const e="INTERNAL ASSERTION FAILED: "+t;throw dt(e),new Error(e)}function ae(t,e){t||ne(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jt(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.href)||""}function Va(){return Rn()==="http:"||Rn()==="https:"}function Rn(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ba(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Va()||gs()||"connection"in navigator)?navigator.onLine:!0}function $a(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class et{constructor(e,n){this.shortDelay=e,this.longDelay=n,ae(n>e,"Short delay should be less than long delay!"),this.isMobile=ps()||vs()}get(){return Ba()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function en(t,e){ae(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mr{static initialize(e,n,r){this.fetchImpl=e,n&&(this.headersImpl=n),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;ne("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;ne("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;ne("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ha={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wa=new et(3e4,6e4);function tn(t,e){return t.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:t.tenantId}):e}async function Be(t,e,n,r,i={}){return gr(t,i,async()=>{let s={},a={};r&&(e==="GET"?a=r:s={body:JSON.stringify(r)});const l=Qe(Object.assign({key:t.config.apiKey},a)).slice(1),o=await t._getAdditionalHeaders();o["Content-Type"]="application/json",t.languageCode&&(o["X-Firebase-Locale"]=t.languageCode);const u=Object.assign({method:e,headers:o},s);return ms()||(u.referrerPolicy="no-referrer"),mr.fetch()(vr(t,t.config.apiHost,n,l),u)})}async function gr(t,e,n){t._canInitEmulator=!1;const r=Object.assign(Object.assign({},Ha),e);try{const i=new za(t),s=await Promise.race([n(),i.promise]);i.clearNetworkTimeout();const a=await s.json();if("needConfirmation"in a)throw lt(t,"account-exists-with-different-credential",a);if(s.ok&&!("errorMessage"in a))return a;{const l=s.ok?a.errorMessage:a.error.message,[o,u]=l.split(" : ");if(o==="FEDERATED_USER_ID_ALREADY_LINKED")throw lt(t,"credential-already-in-use",a);if(o==="EMAIL_EXISTS")throw lt(t,"email-already-in-use",a);if(o==="USER_DISABLED")throw lt(t,"user-disabled",a);const f=r[o]||o.toLowerCase().replace(/[_\s]+/g,"-");if(u)throw Qt(t,f,u);J(t,f)}}catch(i){if(i instanceof fe)throw i;J(t,"network-request-failed",{message:String(i)})}}async function ja(t,e,n,r,i={}){const s=await Be(t,e,n,r,i);return"mfaPendingCredential"in s&&J(t,"multi-factor-auth-required",{_serverResponse:s}),s}function vr(t,e,n,r){const i=`${e}${n}?${r}`;return t.config.emulator?en(t.config,i):`${t.config.apiScheme}://${i}`}class za{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,r)=>{this.timer=setTimeout(()=>r(G(this.auth,"network-request-failed")),Wa.get())})}}function lt(t,e,n){const r={appName:t.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const i=G(t,e,r);return i.customData._tokenResponse=n,i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ga(t,e){return Be(t,"POST","/v1/accounts:delete",e)}async function _r(t,e){return Be(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qe(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function qa(t,e=!1){const n=pe(t),r=await n.getIdToken(e),i=nn(r);g(i&&i.exp&&i.auth_time&&i.iat,n.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,a=s==null?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:qe(Lt(i.auth_time)),issuedAtTime:qe(Lt(i.iat)),expirationTime:qe(Lt(i.exp)),signInProvider:a||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function Lt(t){return Number(t)*1e3}function nn(t){const[e,n,r]=t.split(".");if(e===void 0||n===void 0||r===void 0)return dt("JWT malformed, contained fewer than 3 sections"),null;try{const i=rr(n);return i?JSON.parse(i):(dt("Failed to decode base64 JWT payload"),null)}catch(i){return dt("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function Pn(t){const e=nn(t);return g(e,"internal-error"),g(typeof e.exp<"u","internal-error"),g(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Je(t,e,n=!1){if(n)return e;try{return await e}catch(r){throw r instanceof fe&&Ka(r)&&t.auth.currentUser===t&&await t.auth.signOut(),r}}function Ka({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ya{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var n;if(e){const r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;const i=((n=this.user.stsTokenManager.expirationTime)!==null&&n!==void 0?n:0)-Date.now()-3e5;return Math.max(0,i)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zt{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=qe(this.lastLoginAt),this.creationTime=qe(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function yt(t){var e;const n=t.auth,r=await t.getIdToken(),i=await Je(t,_r(n,{idToken:r}));g(i==null?void 0:i.users.length,n,"internal-error");const s=i.users[0];t._notifyReloadListener(s);const a=!((e=s.providerUserInfo)===null||e===void 0)&&e.length?yr(s.providerUserInfo):[],l=Xa(t.providerData,a),o=t.isAnonymous,u=!(t.email&&s.passwordHash)&&!(l!=null&&l.length),f=o?u:!1,m={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:l,metadata:new zt(s.createdAt,s.lastLoginAt),isAnonymous:f};Object.assign(t,m)}async function Ja(t){const e=pe(t);await yt(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Xa(t,e){return[...t.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function yr(t){return t.map(e=>{var{providerId:n}=e,r=qt(e,["providerId"]);return{providerId:n,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Qa(t,e){const n=await gr(t,{},async()=>{const r=Qe({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=t.config,a=vr(t,i,"/v1/token",`key=${s}`),l=await t._getAdditionalHeaders();return l["Content-Type"]="application/x-www-form-urlencoded",mr.fetch()(a,{method:"POST",headers:l,body:r})});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function Za(t,e){return Be(t,"POST","/v2/accounts:revokeToken",tn(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oe{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){g(e.idToken,"internal-error"),g(typeof e.idToken<"u","internal-error"),g(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Pn(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){g(e.length!==0,"internal-error");const n=Pn(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(g(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:r,refreshToken:i,expiresIn:s}=await Qa(e,n);this.updateTokensAndExpiration(r,i,Number(s))}updateTokensAndExpiration(e,n,r){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,n){const{refreshToken:r,accessToken:i,expirationTime:s}=n,a=new Oe;return r&&(g(typeof r=="string","internal-error",{appName:e}),a.refreshToken=r),i&&(g(typeof i=="string","internal-error",{appName:e}),a.accessToken=i),s&&(g(typeof s=="number","internal-error",{appName:e}),a.expirationTime=s),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Oe,this.toJSON())}_performRefresh(){return ne("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function oe(t,e){g(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class re{constructor(e){var{uid:n,auth:r,stsTokenManager:i}=e,s=qt(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new Ya(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=n,this.auth=r,this.stsTokenManager=i,this.accessToken=i.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new zt(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const n=await Je(this,this.stsTokenManager.getToken(this.auth,e));return g(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return qa(this,e)}reload(){return Ja(this)}_assign(e){this!==e&&(g(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>Object.assign({},n)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new re(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return n.metadata._copy(this.metadata),n}_onReload(e){g(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),n&&await yt(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(te(this.auth.app))return Promise.reject(be(this.auth));const e=await this.getIdToken();return await Je(this,Ga(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){var r,i,s,a,l,o,u,f;const m=(r=n.displayName)!==null&&r!==void 0?r:void 0,p=(i=n.email)!==null&&i!==void 0?i:void 0,w=(s=n.phoneNumber)!==null&&s!==void 0?s:void 0,P=(a=n.photoURL)!==null&&a!==void 0?a:void 0,_=(l=n.tenantId)!==null&&l!==void 0?l:void 0,A=(o=n._redirectEventId)!==null&&o!==void 0?o:void 0,R=(u=n.createdAt)!==null&&u!==void 0?u:void 0,S=(f=n.lastLoginAt)!==null&&f!==void 0?f:void 0,{uid:L,emailVerified:I,isAnonymous:v,providerData:B,stsTokenManager:U}=n;g(L&&U,e,"internal-error");const q=Oe.fromJSON(this.name,U);g(typeof L=="string",e,"internal-error"),oe(m,e.name),oe(p,e.name),g(typeof I=="boolean",e,"internal-error"),g(typeof v=="boolean",e,"internal-error"),oe(w,e.name),oe(P,e.name),oe(_,e.name),oe(A,e.name),oe(R,e.name),oe(S,e.name);const K=new re({uid:L,auth:e,email:p,emailVerified:I,displayName:m,isAnonymous:v,photoURL:P,phoneNumber:w,tenantId:_,stsTokenManager:q,createdAt:R,lastLoginAt:S});return B&&Array.isArray(B)&&(K.providerData=B.map(M=>Object.assign({},M))),A&&(K._redirectEventId=A),K}static async _fromIdTokenResponse(e,n,r=!1){const i=new Oe;i.updateFromServerResponse(n);const s=new re({uid:n.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await yt(s),s}static async _fromGetAccountInfoResponse(e,n,r){const i=n.users[0];g(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?yr(i.providerUserInfo):[],a=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),l=new Oe;l.updateFromIdToken(r);const o=new re({uid:i.localId,auth:e,stsTokenManager:l,isAnonymous:a}),u={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new zt(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(o,u),o}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const On=new Map;function ie(t){ae(t instanceof Function,"Expected a class definition");let e=On.get(t);return e?(ae(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,On.set(t,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class br{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}br.type="NONE";const Dn=br;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ht(t,e,n){return`firebase:${t}:${e}:${n}`}class De{constructor(e,n,r){this.persistence=e,this.auth=n,this.userKey=r;const{config:i,name:s}=this.auth;this.fullUserKey=ht(this.userKey,i.apiKey,s),this.fullPersistenceKey=ht("persistence",i.apiKey,s),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?re._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,r="authUser"){if(!n.length)return new De(ie(Dn),e,r);const i=(await Promise.all(n.map(async u=>{if(await u._isAvailable())return u}))).filter(u=>u);let s=i[0]||ie(Dn);const a=ht(r,e.config.apiKey,e.name);let l=null;for(const u of n)try{const f=await u._get(a);if(f){const m=re._fromJSON(e,f);u!==s&&(l=m),s=u;break}}catch{}const o=i.filter(u=>u._shouldAllowMigration);return!s._shouldAllowMigration||!o.length?new De(s,e,r):(s=o[0],l&&await s._set(a,l.toJSON()),await Promise.all(n.map(async u=>{if(u!==s)try{await u._remove(a)}catch{}})),new De(s,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Nn(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Tr(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Ir(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(kr(e))return"Blackberry";if(Cr(e))return"Webos";if(wr(e))return"Safari";if((e.includes("chrome/")||Er(e))&&!e.includes("edge/"))return"Chrome";if(Sr(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=t.match(n);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function Ir(t=V()){return/firefox\//i.test(t)}function wr(t=V()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Er(t=V()){return/crios\//i.test(t)}function Tr(t=V()){return/iemobile/i.test(t)}function Sr(t=V()){return/android/i.test(t)}function kr(t=V()){return/blackberry/i.test(t)}function Cr(t=V()){return/webos/i.test(t)}function rn(t=V()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function eo(t=V()){var e;return rn(t)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function to(){return _s()&&document.documentMode===10}function Ar(t=V()){return rn(t)||Sr(t)||Cr(t)||kr(t)||/windows phone/i.test(t)||Tr(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rr(t,e=[]){let n;switch(t){case"Browser":n=Nn(V());break;case"Worker":n=`${Nn(V())}-${t}`;break;default:n=t}const r=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${Ze}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class no{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const r=s=>new Promise((a,l)=>{try{const o=e(s);a(o)}catch(o){l(o)}});r.onAbort=n,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const r of this.queue)await r(e),r.onAbort&&n.push(r.onAbort)}catch(r){n.reverse();for(const i of n)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ro(t,e={}){return Be(t,"GET","/v2/passwordPolicy",tn(t,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const io=6;class so{constructor(e){var n,r,i,s;const a=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(n=a.minPasswordLength)!==null&&n!==void 0?n:io,a.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=a.maxPasswordLength),a.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=a.containsLowercaseCharacter),a.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=a.containsUppercaseCharacter),a.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=a.containsNumericCharacter),a.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=a.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(i=(r=e.allowedNonAlphanumericCharacters)===null||r===void 0?void 0:r.join(""))!==null&&i!==void 0?i:"",this.forceUpgradeOnSignin=(s=e.forceUpgradeOnSignin)!==null&&s!==void 0?s:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var n,r,i,s,a,l;const o={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,o),this.validatePasswordCharacterOptions(e,o),o.isValid&&(o.isValid=(n=o.meetsMinPasswordLength)!==null&&n!==void 0?n:!0),o.isValid&&(o.isValid=(r=o.meetsMaxPasswordLength)!==null&&r!==void 0?r:!0),o.isValid&&(o.isValid=(i=o.containsLowercaseLetter)!==null&&i!==void 0?i:!0),o.isValid&&(o.isValid=(s=o.containsUppercaseLetter)!==null&&s!==void 0?s:!0),o.isValid&&(o.isValid=(a=o.containsNumericCharacter)!==null&&a!==void 0?a:!0),o.isValid&&(o.isValid=(l=o.containsNonAlphanumericCharacter)!==null&&l!==void 0?l:!0),o}validatePasswordLengthOptions(e,n){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(n.meetsMinPasswordLength=e.length>=r),i&&(n.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(n,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,n,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ao{constructor(e,n,r,i){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Ln(this),this.idTokenSubscription=new Ln(this),this.beforeStateQueue=new no(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=pr,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=ie(n)),this._initializationPromise=this.queue(async()=>{var r,i;if(!this._deleted&&(this.persistenceManager=await De.create(this,e),!this._deleted)){if(!((r=this._popupRedirectResolver)===null||r===void 0)&&r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((i=this.currentUser)===null||i===void 0?void 0:i.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await _r(this,{idToken:e}),r=await re._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(r)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var n;if(te(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(l,l))}):this.directlySetCurrentUser(null)}const r=await this.assertedPersistence.getCurrentUser();let i=r,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId,l=i==null?void 0:i._redirectEventId,o=await this.tryRedirectSignIn(e);(!a||a===l)&&(o!=null&&o.user)&&(i=o.user,s=!0)}if(!i)return this.directlySetCurrentUser(null);if(!i._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(i)}catch(a){i=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return i?this.reloadAndSetCurrentUserOrClear(i):this.directlySetCurrentUser(null)}return g(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===i._redirectEventId?this.directlySetCurrentUser(i):this.reloadAndSetCurrentUserOrClear(i)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await yt(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=$a()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(te(this.app))return Promise.reject(be(this));const n=e?pe(e):null;return n&&g(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&g(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return te(this.app)?Promise.reject(be(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return te(this.app)?Promise.reject(be(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(ie(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await ro(this),n=new so(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new Xe("auth","Firebase",e())}onAuthStateChanged(e,n,r){return this.registerStateListener(this.authStateSubscription,e,n,r)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,r){return this.registerStateListener(this.idTokenSubscription,e,n,r)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(r.tenantId=this.tenantId),await Za(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,n){const r=await this.getOrInitRedirectPersistenceManager(n);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&ie(e)||this._popupRedirectResolver;g(n,this,"argument-error"),this.redirectPersistenceManager=await De.create(this,[ie(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,r;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)===null||n===void 0?void 0:n._redirectEventId)===e?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const r=(n=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&n!==void 0?n:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,r,i){if(this._deleted)return()=>{};const s=typeof n=="function"?n:n.next.bind(n);let a=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(g(l,this,"internal-error"),l.then(()=>{a||s(this.currentUser)}),typeof n=="function"){const o=e.addObserver(n,r,i);return()=>{a=!0,o()}}else{const o=e.addObserver(n);return()=>{a=!0,o()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return g(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Rr(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const n={"X-Client-Version":this.clientVersion};this.app.options.appId&&(n["X-Firebase-gmpid"]=this.app.options.appId);const r=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());r&&(n["X-Firebase-Client"]=r);const i=await this._getAppCheckToken();return i&&(n["X-Firebase-AppCheck"]=i),n}async _getAppCheckToken(){var e;const n=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return n!=null&&n.error&&Ua(`Error while retrieving App Check token: ${n.error}`),n==null?void 0:n.token}}function Et(t){return pe(t)}class Ln{constructor(e){this.auth=e,this.observer=null,this.addObserver=Ss(n=>this.observer=n)}get next(){return g(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let sn={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function oo(t){sn=t}function lo(t){return sn.loadJS(t)}function co(){return sn.gapiScript}function uo(t){return`__${t}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ho(t,e){const n=cr(t,"auth");if(n.isInitialized()){const i=n.getImmediate(),s=n.getOptions();if(gt(s,e??{}))return i;J(i,"already-initialized")}return n.initialize({options:e})}function fo(t,e){const n=(e==null?void 0:e.persistence)||[],r=(Array.isArray(n)?n:[n]).map(ie);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function po(t,e,n){const r=Et(t);g(r._canInitEmulator,r,"emulator-config-failed"),g(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!1,s=Pr(e),{host:a,port:l}=mo(e),o=l===null?"":`:${l}`;r.config.emulator={url:`${s}//${a}${o}/`},r.settings.appVerificationDisabledForTesting=!0,r.emulatorConfig=Object.freeze({host:a,port:l,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})}),go()}function Pr(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function mo(t){const e=Pr(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const s=i[1];return{host:s,port:Mn(r.substr(s.length+1))}}else{const[s,a]=r.split(":");return{host:s,port:Mn(a)}}}function Mn(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function go(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Or{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return ne("not implemented")}_getIdTokenResponse(e){return ne("not implemented")}_linkToIdToken(e,n){return ne("not implemented")}_getReauthenticationResolver(e){return ne("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ne(t,e){return ja(t,"POST","/v1/accounts:signInWithIdp",tn(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vo="http://localhost";class Ie extends Or{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new Ie(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):J("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i}=n,s=qt(n,["providerId","signInMethod"]);if(!r||!i)return null;const a=new Ie(r,i);return a.idToken=s.idToken||void 0,a.accessToken=s.accessToken||void 0,a.secret=s.secret,a.nonce=s.nonce,a.pendingToken=s.pendingToken||null,a}_getIdTokenResponse(e){const n=this.buildRequest();return Ne(e,n)}_linkToIdToken(e,n){const r=this.buildRequest();return r.idToken=n,Ne(e,r)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,Ne(e,n)}buildRequest(){const e={requestUri:vo,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=Qe(n)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class an{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tt extends an{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class le extends tt{constructor(){super("facebook.com")}static credential(e){return Ie._fromParams({providerId:le.PROVIDER_ID,signInMethod:le.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return le.credentialFromTaggedObject(e)}static credentialFromError(e){return le.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return le.credential(e.oauthAccessToken)}catch{return null}}}le.FACEBOOK_SIGN_IN_METHOD="facebook.com";le.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ee extends tt{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return Ie._fromParams({providerId:ee.PROVIDER_ID,signInMethod:ee.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return ee.credentialFromTaggedObject(e)}static credentialFromError(e){return ee.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r}=e;if(!n&&!r)return null;try{return ee.credential(n,r)}catch{return null}}}ee.GOOGLE_SIGN_IN_METHOD="google.com";ee.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ce extends tt{constructor(){super("github.com")}static credential(e){return Ie._fromParams({providerId:ce.PROVIDER_ID,signInMethod:ce.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return ce.credentialFromTaggedObject(e)}static credentialFromError(e){return ce.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return ce.credential(e.oauthAccessToken)}catch{return null}}}ce.GITHUB_SIGN_IN_METHOD="github.com";ce.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ue extends tt{constructor(){super("twitter.com")}static credential(e,n){return Ie._fromParams({providerId:ue.PROVIDER_ID,signInMethod:ue.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return ue.credentialFromTaggedObject(e)}static credentialFromError(e){return ue.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:r}=e;if(!n||!r)return null;try{return ue.credential(n,r)}catch{return null}}}ue.TWITTER_SIGN_IN_METHOD="twitter.com";ue.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xe{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,r,i=!1){const s=await re._fromIdTokenResponse(e,r,i),a=xn(r);return new xe({user:s,providerId:a,_tokenResponse:r,operationType:n})}static async _forOperation(e,n,r){await e._updateTokensIfNecessary(r,!0);const i=xn(r);return new xe({user:e,providerId:i,_tokenResponse:r,operationType:n})}}function xn(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bt extends fe{constructor(e,n,r,i){var s;super(n.code,n.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,bt.prototype),this.customData={appName:e.name,tenantId:(s=e.tenantId)!==null&&s!==void 0?s:void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,n,r,i){return new bt(e,n,r,i)}}function Dr(t,e,n,r){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?bt._fromErrorAndOperation(t,s,e,r):s})}async function _o(t,e,n=!1){const r=await Je(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return xe._forOperation(t,"link",r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function yo(t,e,n=!1){const{auth:r}=t;if(te(r.app))return Promise.reject(be(r));const i="reauthenticate";try{const s=await Je(t,Dr(r,i,e,t),n);g(s.idToken,r,"internal-error");const a=nn(s.idToken);g(a,r,"internal-error");const{sub:l}=a;return g(t.uid===l,r,"user-mismatch"),xe._forOperation(t,i,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&J(r,"user-mismatch"),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function bo(t,e,n=!1){if(te(t.app))return Promise.reject(be(t));const r="signIn",i=await Dr(t,r,e),s=await xe._fromIdTokenResponse(t,r,i);return n||await t._updateCurrentUser(s.user),s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Io(t,e){return pe(t).setPersistence(e)}function Nr(t,e,n,r){return pe(t).onIdTokenChanged(e,n,r)}function wo(t,e,n){return pe(t).beforeAuthStateChanged(e,n)}function Eo(t,e,n,r){return pe(t).onAuthStateChanged(e,n,r)}const It="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lr{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(It,"1"),this.storage.removeItem(It),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const To=1e3,So=10;class Mr extends Lr{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Ar(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const r=this.storage.getItem(n),i=this.localCache[n];r!==i&&e(n,i,r)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((a,l,o)=>{this.notifyListeners(a,o)});return}const r=e.key;n?this.detachListener():this.stopPolling();const i=()=>{const a=this.storage.getItem(r);!n&&this.localCache[r]===a||this.notifyListeners(r,a)},s=this.storage.getItem(r);to()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,So):i()}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:r}),!0)})},To)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}Mr.type="LOCAL";const xr=Mr;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ur extends Lr{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}Ur.type="SESSION";const Fr=Ur;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ko(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tt{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(i=>i.isListeningto(e));if(n)return n;const r=new Tt(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:r,eventType:i,data:s}=n.data,a=this.handlersMap[i];if(!(a!=null&&a.size))return;n.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const l=Array.from(a).map(async u=>u(n.origin,s)),o=await ko(l);n.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:o})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Tt.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function on(t="",e=10){let n="";for(let r=0;r<e;r++)n+=Math.floor(Math.random()*10);return t+n}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Co{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,r=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,a;return new Promise((l,o)=>{const u=on("",20);i.port1.start();const f=setTimeout(()=>{o(new Error("unsupported_event"))},r);a={messageChannel:i,onMessage(m){const p=m;if(p.data.eventId===u)switch(p.data.status){case"ack":clearTimeout(f),s=setTimeout(()=>{o(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),l(p.data.response);break;default:clearTimeout(f),clearTimeout(s),o(new Error("invalid_response"));break}}},this.handlers.add(a),i.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:u,data:n},[i.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Y(){return window}function Ao(t){Y().location.href=t}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vr(){return typeof Y().WorkerGlobalScope<"u"&&typeof Y().importScripts=="function"}async function Ro(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function Po(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)===null||t===void 0?void 0:t.controller)||null}function Oo(){return Vr()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Br="firebaseLocalStorageDb",Do=1,wt="firebaseLocalStorage",$r="fbase_key";class nt{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function St(t,e){return t.transaction([wt],e?"readwrite":"readonly").objectStore(wt)}function No(){const t=indexedDB.deleteDatabase(Br);return new nt(t).toPromise()}function Gt(){const t=indexedDB.open(Br,Do);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const r=t.result;try{r.createObjectStore(wt,{keyPath:$r})}catch(i){n(i)}}),t.addEventListener("success",async()=>{const r=t.result;r.objectStoreNames.contains(wt)?e(r):(r.close(),await No(),e(await Gt()))})})}async function Un(t,e,n){const r=St(t,!0).put({[$r]:e,value:n});return new nt(r).toPromise()}async function Lo(t,e){const n=St(t,!1).get(e),r=await new nt(n).toPromise();return r===void 0?null:r.value}function Fn(t,e){const n=St(t,!0).delete(e);return new nt(n).toPromise()}const Mo=800,xo=3;class Hr{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Gt(),this.db)}async _withRetries(e){let n=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(n++>xo)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Vr()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Tt._getInstance(Oo()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var e,n;if(this.activeServiceWorker=await Ro(),!this.activeServiceWorker)return;this.sender=new Co(this.activeServiceWorker);const r=await this.sender._send("ping",{},800);r&&!((e=r[0])===null||e===void 0)&&e.fulfilled&&!((n=r[0])===null||n===void 0)&&n.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||Po()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Gt();return await Un(e,It,"1"),await Fn(e,It),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(r=>Un(r,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(r=>Lo(r,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>Fn(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(i=>{const s=St(i,!1).getAll();return new nt(s).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),n.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),n.push(i));return n}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Mo)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}Hr.type="LOCAL";const Uo=Hr;new et(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wr(t,e){return e?ie(e):(g(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ln extends Or{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Ne(e,this._buildIdpRequest())}_linkToIdToken(e,n){return Ne(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return Ne(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function Fo(t){return bo(t.auth,new ln(t),t.bypassAuthState)}function Vo(t){const{auth:e,user:n}=t;return g(n,e,"internal-error"),yo(n,new ln(t),t.bypassAuthState)}async function Bo(t){const{auth:e,user:n}=t;return g(n,e,"internal-error"),_o(n,new ln(t),t.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jr{constructor(e,n,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:r,postBody:i,tenantId:s,error:a,type:l}=e;if(a){this.reject(a);return}const o={auth:this.auth,requestUri:n,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(o))}catch(u){this.reject(u)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Fo;case"linkViaPopup":case"linkViaRedirect":return Bo;case"reauthViaPopup":case"reauthViaRedirect":return Vo;default:J(this.auth,"internal-error")}}resolve(e){ae(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){ae(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $o=new et(2e3,1e4);async function Ho(t,e,n){if(te(t.app))return Promise.reject(G(t,"operation-not-supported-in-this-environment"));const r=Et(t);Fa(t,e,an);const i=Wr(r,n);return new ye(r,"signInViaPopup",e,i).executeNotNull()}class ye extends jr{constructor(e,n,r,i,s){super(e,n,i,s),this.provider=r,this.authWindow=null,this.pollId=null,ye.currentPopupAction&&ye.currentPopupAction.cancel(),ye.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return g(e,this.auth,"internal-error"),e}async onExecution(){ae(this.filter.length===1,"Popup operations only handle one event");const e=on();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(G(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(G(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,ye.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,r;if(!((r=(n=this.authWindow)===null||n===void 0?void 0:n.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(G(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,$o.get())};e()}}ye.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wo="pendingRedirect",ft=new Map;class jo extends jr{constructor(e,n,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,r),this.eventId=null}async execute(){let e=ft.get(this.auth._key());if(!e){try{const r=await zo(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(n){e=()=>Promise.reject(n)}ft.set(this.auth._key(),e)}return this.bypassAuthState||ft.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function zo(t,e){const n=Ko(e),r=qo(t);if(!await r._isAvailable())return!1;const i=await r._get(n)==="true";return await r._remove(n),i}function Go(t,e){ft.set(t._key(),e)}function qo(t){return ie(t._redirectPersistence)}function Ko(t){return ht(Wo,t.config.apiKey,t.name)}async function Yo(t,e,n=!1){if(te(t.app))return Promise.reject(be(t));const r=Et(t),i=Wr(r,e),a=await new jo(r,i,n).execute();return a&&!n&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,e)),a}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jo=10*60*1e3;class Xo{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(n=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Qo(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var r;if(e.error&&!zr(e)){const i=((r=e.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";n.onError(G(this.auth,i))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const r=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Jo&&this.cachedEventUids.clear(),this.cachedEventUids.has(Vn(e))}saveEventToCache(e){this.cachedEventUids.add(Vn(e)),this.lastProcessedEventTime=Date.now()}}function Vn(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function zr({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Qo(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return zr(t);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Zo(t,e={}){return Be(t,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const el=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,tl=/^https?/;async function nl(t){if(t.config.emulator)return;const{authorizedDomains:e}=await Zo(t);for(const n of e)try{if(rl(n))return}catch{}J(t,"unauthorized-domain")}function rl(t){const e=jt(),{protocol:n,hostname:r}=new URL(e);if(t.startsWith("chrome-extension://")){const a=new URL(t);return a.hostname===""&&r===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&a.hostname===r}if(!tl.test(n))return!1;if(el.test(t))return r===t;const i=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const il=new et(3e4,6e4);function Bn(){const t=Y().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function sl(t){return new Promise((e,n)=>{var r,i,s;function a(){Bn(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Bn(),n(G(t,"network-request-failed"))},timeout:il.get()})}if(!((i=(r=Y().gapi)===null||r===void 0?void 0:r.iframes)===null||i===void 0)&&i.Iframe)e(gapi.iframes.getContext());else if(!((s=Y().gapi)===null||s===void 0)&&s.load)a();else{const l=uo("iframefcb");return Y()[l]=()=>{gapi.load?a():n(G(t,"network-request-failed"))},lo(`${co()}?onload=${l}`).catch(o=>n(o))}}).catch(e=>{throw pt=null,e})}let pt=null;function al(t){return pt=pt||sl(t),pt}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ol=new et(5e3,15e3),ll="__/auth/iframe",cl="emulator/auth/iframe",ul={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},dl=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function hl(t){const e=t.config;g(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?en(e,cl):`https://${t.config.authDomain}/${ll}`,r={apiKey:e.apiKey,appName:t.name,v:Ze},i=dl.get(t.config.apiHost);i&&(r.eid=i);const s=t._getFrameworks();return s.length&&(r.fw=s.join(",")),`${n}?${Qe(r).slice(1)}`}async function fl(t){const e=await al(t),n=Y().gapi;return g(n,t,"internal-error"),e.open({where:document.body,url:hl(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:ul,dontclear:!0},r=>new Promise(async(i,s)=>{await r.restyle({setHideOnLeave:!1});const a=G(t,"network-request-failed"),l=Y().setTimeout(()=>{s(a)},ol.get());function o(){Y().clearTimeout(l),i(r)}r.ping(o).then(o,()=>{s(a)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pl={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},ml=500,gl=600,vl="_blank",_l="http://localhost";class $n{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function yl(t,e,n,r=ml,i=gl){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let l="";const o=Object.assign(Object.assign({},pl),{width:r.toString(),height:i.toString(),top:s,left:a}),u=V().toLowerCase();n&&(l=Er(u)?vl:n),Ir(u)&&(e=e||_l,o.scrollbars="yes");const f=Object.entries(o).reduce((p,[w,P])=>`${p}${w}=${P},`,"");if(eo(u)&&l!=="_self")return bl(e||"",l),new $n(null);const m=window.open(e||"",l,f);g(m,t,"popup-blocked");try{m.focus()}catch{}return new $n(m)}function bl(t,e){const n=document.createElement("a");n.href=t,n.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Il="__/auth/handler",wl="emulator/auth/handler",El=encodeURIComponent("fac");async function Hn(t,e,n,r,i,s){g(t.config.authDomain,t,"auth-domain-config-required"),g(t.config.apiKey,t,"invalid-api-key");const a={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:r,v:Ze,eventId:i};if(e instanceof an){e.setDefaultLanguage(t.languageCode),a.providerId=e.providerId||"",Ts(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[f,m]of Object.entries({}))a[f]=m}if(e instanceof tt){const f=e.getScopes().filter(m=>m!=="");f.length>0&&(a.scopes=f.join(","))}t.tenantId&&(a.tid=t.tenantId);const l=a;for(const f of Object.keys(l))l[f]===void 0&&delete l[f];const o=await t._getAppCheckToken(),u=o?`#${El}=${encodeURIComponent(o)}`:"";return`${Tl(t)}?${Qe(l).slice(1)}${u}`}function Tl({config:t}){return t.emulator?en(t,wl):`https://${t.authDomain}/${Il}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mt="webStorageSupport";class Sl{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Fr,this._completeRedirectFn=Yo,this._overrideRedirectResult=Go}async _openPopup(e,n,r,i){var s;ae((s=this.eventManagers[e._key()])===null||s===void 0?void 0:s.manager,"_initialize() not called before _openPopup()");const a=await Hn(e,n,r,jt(),i);return yl(e,a,on())}async _openRedirect(e,n,r,i){await this._originValidation(e);const s=await Hn(e,n,r,jt(),i);return Ao(s),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:i,promise:s}=this.eventManagers[n];return i?Promise.resolve(i):(ae(s,"If manager is not set, promise should be"),s)}const r=this.initAndGetManager(e);return this.eventManagers[n]={promise:r},r.catch(()=>{delete this.eventManagers[n]}),r}async initAndGetManager(e){const n=await fl(e),r=new Xo(e);return n.register("authEvent",i=>(g(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=n,r}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(Mt,{type:Mt},i=>{var s;const a=(s=i==null?void 0:i[0])===null||s===void 0?void 0:s[Mt];a!==void 0&&n(!!a),J(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=nl(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return Ar()||wr()||rn()}}const kl=Sl;var Wn="@firebase/auth",jn="1.8.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cl{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){g(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Al(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Rl(t){Ke(new Me("auth",(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:a,authDomain:l}=r.options;g(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const o={apiKey:a,authDomain:l,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Rr(t)},u=new ao(r,i,s,o);return fo(u,n),u},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,r)=>{e.getProvider("auth-internal").initialize()})),Ke(new Me("auth-internal",e=>{const n=Et(e.getProvider("auth").getImmediate());return(r=>new Cl(r))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),Pe(Wn,jn,Al(t)),Pe(Wn,jn,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pl=5*60,Ol=sr("authIdTokenMaxAge")||Pl;let zn=null;const Dl=t=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>Ol)return;const i=n==null?void 0:n.token;zn!==i&&(zn=i,await fetch(t,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function Nl(t=ka()){const e=cr(t,"auth");if(e.isInitialized())return e.getImmediate();const n=ho(t,{popupRedirectResolver:kl,persistence:[Uo,xr,Fr]}),r=sr("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const a=Dl(s.toString());wo(n,a,()=>a(n.currentUser)),Nr(n,l=>a(l))}}const i=hs("auth");return i&&po(n,`http://${i}`),n}function Ll(){var t,e;return(e=(t=document.getElementsByTagName("head"))===null||t===void 0?void 0:t[0])!==null&&e!==void 0?e:document}oo({loadJS(t){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",t),r.onload=e,r.onerror=i=>{const s=G("internal-error");s.customData=i,n(s)},r.type="text/javascript",r.charset="UTF-8",Ll().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Rl("Browser");var Ml="firebase",xl="11.1.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Pe(Ml,xl,"app");const Ul=async()=>{const t="production";try{if(t==="production")return(await hi(()=>import("./firebase.config.prod-CMcj8fXD.js"),[])).default}catch(e){throw console.error("Error loading Firebase config:",e),e}};let ct=null,Gn=null;const Fl=async()=>{if(!ct){const t=await Ul();ct=ur(t),Gn=Nl(ct)}return{app:ct,auth:Gn}},Vl={data(){return{isInitialized:!1,authInstance:null,unsubscribeAuth:null,showDialog:!1}},created(){this.showDialog=!this.loggedInGoogle},watch:{loggedInGoogle(t){t&&(this.showDialog=!1)}},computed:{...fi(["loggedInGoogle","userGoogle"])},async mounted(){try{const{auth:t}=await Fl();Io(t,xr),this.authInstance=t,this.isInitialized=!0,Eo(t,async e=>{if(e){const n=await e.getIdToken(!0);try{const r=await fetch("/api/auth/google",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({idToken:n})}),i=await r.json();console.log("Mountted",i),r.ok?(this.$store.commit("setloggedInGoogle",!0),this.$store.commit("setUserGoogle",i.userGoogle),localStorage.setItem("AUTH_TOKEN",i.token)):(localStorage.removeItem("AUTH_TOKEN"),this.$store.commit("setloggedInGoogle",!1))}catch(r){console.error("Token verification error:",r)}}}),this.unsubscribeAuth=Nr(t,async e=>{if(e){const n=await e.getIdToken(!0);this.$store.commit("setloggedInGoogle",!0),this.$store.commit("setUserGoogle",e)}else this.$store.commit("setloggedInGoogle",!1),this.$store.commit("setUserGoogle",null)})}catch(t){console.error("Failed to initialize Firebase:",t)}},beforeDestroy(){this.unsubscribeAuth&&this.unsubscribeAuth()},methods:{closeDialog(){this.showDialog=!1},async signInWithGoogle(){if(!this.isInitialized||!this.authInstance){console.error("Firebase not yet initialized");return}try{const t=new ee,n=await(await Ho(this.authInstance,t)).user.getIdToken(!0),r=await fetch("/api/auth/google",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({idToken:n})});if(r.ok){const i=await r.json();console.log("SignIn",i),this.showDialog=!1,localStorage.setItem("AUTH_TOKEN",i.token),localStorage.setItem("jwtGoogle",n),this.$store.commit("setloggedInGoogle",!0)}}catch(t){console.error("Google sign-in error:",t)}}}};function Bl(t,e,n,r,i,s){return t.loggedInGoogle?Zn("",!0):(z(),ze(Le,{key:0,onClick:s.signInWithGoogle,color:"primary"},{default:d(()=>e[0]||(e[0]=[k(" Sign in with Google ")])),_:1},8,["onClick"]))}const Kl=Xn(Vl,[["render",Bl],["__scopeId","data-v-c8e5f04f"]]);function $l(t,e,n){if(e==null)return t;if(Array.isArray(e))throw new Error("Multiple matches is not implemented");return typeof e=="number"&&~e?c(j,null,[c("span",{class:"v-autocomplete__unmask"},[t.substr(0,e)]),c("span",{class:"v-autocomplete__mask"},[t.substr(e,n)]),c("span",{class:"v-autocomplete__unmask"},[t.substr(e+n)])]):t}const Hl=Ue({autoSelectFirst:{type:[Boolean,String]},clearOnSelect:Boolean,search:String,...pi({filterKeys:["title"]}),...mi(),...Kt(gi({modelValue:null,role:"combobox"}),["validationValue","dirty","appendInnerIcon"]),...vi({transition:!1})},"VAutocomplete"),Yl=Fe()({name:"VAutocomplete",props:Hl(),emits:{"update:focused":t=>!0,"update:search":t=>!0,"update:modelValue":t=>!0,"update:menu":t=>!0},setup(t,e){let{slots:n}=e;const{t:r}=Qn(),i=Ae(),s=Ce(!1),a=Ce(!0),l=Ce(!1),o=Ae(),u=Ae(),f=Re(t,"menu"),m=N({get:()=>f.value,set:h=>{var y;f.value&&!h&&((y=o.value)!=null&&y.ΨopenChildren.size)||(f.value=h)}}),p=Ce(-1),w=N(()=>{var h;return(h=i.value)==null?void 0:h.color}),P=N(()=>m.value?t.closeText:t.openText),{items:_,transformIn:A,transformOut:R}=_i(t),{textColorClasses:S,textColorStyles:L}=Yn(w),I=Re(t,"search",""),v=Re(t,"modelValue",[],h=>A(h===null?[null]:Wi(h)),h=>{const y=R(h);return t.multiple?y:y[0]??null}),B=N(()=>typeof t.counterValue=="function"?t.counterValue(v.value):typeof t.counterValue=="number"?t.counterValue:v.value.length),U=yi(t),{filteredItems:q,getMatches:K}=bi(t,_,()=>a.value?"":I.value),M=N(()=>t.hideSelected?q.value.filter(h=>!v.value.some(y=>y.value===h.value)):q.value),we=N(()=>!!(t.chips||n.chip)),Ee=N(()=>we.value||!!n.selection),kt=N(()=>v.value.map(h=>h.props.value)),$e=N(()=>{var y;return(t.autoSelectFirst===!0||t.autoSelectFirst==="exact"&&I.value===((y=M.value[0])==null?void 0:y.title))&&M.value.length>0&&!a.value&&!l.value}),Te=N(()=>t.hideNoData&&!M.value.length||U.isReadonly.value||U.isDisabled.value),Ct=Ae(),Gr=Ii(Ct,i);function qr(h){t.openOnClear&&(m.value=!0),I.value=""}function Kr(){Te.value||(m.value=!0)}function Yr(h){Te.value||(s.value&&(h.preventDefault(),h.stopPropagation()),m.value=!m.value)}function Jr(h){var y;Hi(h)&&((y=i.value)==null||y.focus())}function Xr(h){var E,O,$;if(U.isReadonly.value)return;const y=i.value.selectionStart,D=v.value.length;if((p.value>-1||["Enter","ArrowDown","ArrowUp"].includes(h.key))&&h.preventDefault(),["Enter","ArrowDown"].includes(h.key)&&(m.value=!0),["Escape"].includes(h.key)&&(m.value=!1),$e.value&&["Enter","Tab"].includes(h.key)&&!v.value.some(x=>{let{value:F}=x;return F===M.value[0].value})&&me(M.value[0]),h.key==="ArrowDown"&&$e.value&&((E=Ct.value)==null||E.focus("next")),["Backspace","Delete"].includes(h.key)){if(!t.multiple&&Ee.value&&v.value.length>0&&!I.value)return me(v.value[0],!1);if(~p.value){const x=p.value;me(v.value[p.value],!1),p.value=x>=D-1?D-2:x}else h.key==="Backspace"&&!I.value&&(p.value=D-1)}if(t.multiple){if(h.key==="ArrowLeft"){if(p.value<0&&y>0)return;const x=p.value>-1?p.value-1:D-1;v.value[x]?p.value=x:(p.value=-1,i.value.setSelectionRange((O=I.value)==null?void 0:O.length,($=I.value)==null?void 0:$.length))}if(h.key==="ArrowRight"){if(p.value<0)return;const x=p.value+1;v.value[x]?p.value=x:(p.value=-1,i.value.setSelectionRange(0,0))}}}function Qr(h){if(gn(i.value,":autofill")||gn(i.value,":-webkit-autofill")){const y=_.value.find(D=>D.title===h.target.value);y&&me(y)}}function Zr(){var h;t.eager&&((h=u.value)==null||h.calculateVisibleItems())}function ei(){var h;s.value&&(a.value=!0,(h=i.value)==null||h.focus())}function ti(h){s.value=!0,setTimeout(()=>{l.value=!0})}function ni(h){l.value=!1}function ri(h){(h==null||h===""&&!t.multiple&&!Ee.value)&&(v.value=[])}const At=Ce(!1);function me(h){let y=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;if(!(!h||h.props.disabled))if(t.multiple){const D=v.value.findIndex(O=>t.valueComparator(O.value,h.value)),E=y??!~D;if(~D){const O=E?[...v.value,h]:[...v.value];O.splice(D,1),v.value=O}else E&&(v.value=[...v.value,h]);t.clearOnSelect&&(I.value="")}else{const D=y!==!1;v.value=D?[h]:[],I.value=D&&!Ee.value?h.title:"",vn(()=>{m.value=!1,a.value=!0})}}return at(s,(h,y)=>{var D;h!==y&&(h?(At.value=!0,I.value=t.multiple||Ee.value?"":String(((D=v.value.at(-1))==null?void 0:D.props.title)??""),a.value=!0,vn(()=>At.value=!1)):(!t.multiple&&I.value==null&&(v.value=[]),m.value=!1,v.value.some(E=>{let{title:O}=E;return O===I.value})||(I.value=""),p.value=-1))}),at(I,h=>{!s.value||At.value||(h&&(m.value=!0),a.value=!h)}),at(m,()=>{if(!t.hideSelected&&m.value&&v.value.length){const h=M.value.findIndex(y=>v.value.some(D=>y.value===D.value));Vi&&window.requestAnimationFrame(()=>{var y;h>=0&&((y=u.value)==null||y.scrollToIndex(h))})}}),at(()=>t.items,(h,y)=>{m.value||s.value&&!y.length&&h.length&&(m.value=!0)}),Ve(()=>{const h=!!(!t.hideNoData||M.value.length||n["prepend-item"]||n["append-item"]||n["no-data"]),y=v.value.length>0,D=pn.filterProps(t);return c(pn,W({ref:i},D,{modelValue:I.value,"onUpdate:modelValue":[E=>I.value=E,ri],focused:s.value,"onUpdate:focused":E=>s.value=E,validationValue:v.externalValue,counterValue:B.value,dirty:y,onChange:Qr,class:["v-autocomplete",`v-autocomplete--${t.multiple?"multiple":"single"}`,{"v-autocomplete--active-menu":m.value,"v-autocomplete--chips":!!t.chips,"v-autocomplete--selection-slot":!!Ee.value,"v-autocomplete--selecting-index":p.value>-1},t.class],style:t.style,readonly:U.isReadonly.value,placeholder:y?void 0:t.placeholder,"onClick:clear":qr,"onMousedown:control":Kr,onKeydown:Xr}),{...n,default:()=>c(j,null,[c(wi,W({ref:o,modelValue:m.value,"onUpdate:modelValue":E=>m.value=E,activator:"parent",contentClass:"v-autocomplete__content",disabled:Te.value,eager:t.eager,maxHeight:310,openOnClick:!1,closeOnContentClick:!1,transition:t.transition,onAfterEnter:Zr,onAfterLeave:ei},t.menuProps),{default:()=>[h&&c(Ft,W({ref:Ct,selected:kt.value,selectStrategy:t.multiple?"independent":"single-independent",onMousedown:E=>E.preventDefault(),onKeydown:Jr,onFocusin:ti,onFocusout:ni,tabindex:"-1","aria-live":"polite",color:t.itemColor??t.color},Gr,t.listProps),{default:()=>{var E,O,$;return[(E=n["prepend-item"])==null?void 0:E.call(n),!M.value.length&&!t.hideNoData&&(((O=n["no-data"])==null?void 0:O.call(n))??c(mt,{title:r(t.noDataText)},null)),c(Ei,{ref:u,renderless:!0,items:M.value},{default:x=>{var un;let{item:F,index:ge,itemRef:H}=x;const cn=W(F.props,{ref:H,key:ge,active:$e.value&&ge===0?!0:void 0,onClick:()=>me(F,null)});return((un=n.item)==null?void 0:un.call(n,{item:F,index:ge,props:cn}))??c(mt,W(cn,{role:"option"}),{prepend:rt=>{let{isSelected:it}=rt;return c(j,null,[t.multiple&&!t.hideSelected?c(Ti,{key:F.value,modelValue:it,ripple:!1,tabindex:"-1"},null):void 0,F.props.prependAvatar&&c(Si,{image:F.props.prependAvatar},null),F.props.prependIcon&&c(Ut,{icon:F.props.prependIcon},null)])},title:()=>{var rt,it;return a.value?F.title:$l(F.title,(rt=K(F))==null?void 0:rt.title,((it=I.value)==null?void 0:it.length)??0)}})}}),($=n["append-item"])==null?void 0:$.call(n)]}})]}),v.value.map((E,O)=>{function $(H){H.stopPropagation(),H.preventDefault(),me(E,!1)}const x={"onClick:close":$,onKeydown(H){H.key!=="Enter"&&H.key!==" "||(H.preventDefault(),H.stopPropagation(),$(H))},onMousedown(H){H.preventDefault(),H.stopPropagation()},modelValue:!0,"onUpdate:modelValue":void 0},F=we.value?!!n.chip:!!n.selection,ge=F?Bi(we.value?n.chip({item:E,index:O,props:x}):n.selection({item:E,index:O})):void 0;if(!(F&&!ge))return c("div",{key:E.value,class:["v-autocomplete__selection",O===p.value&&["v-autocomplete__selection--selected",S.value]],style:O===p.value?L.value:{}},[we.value?n.chip?c(ki,{key:"chip-defaults",defaults:{VChip:{closable:t.closableChips,size:"small",text:E.title}}},{default:()=>[ge]}):c(je,W({key:"chip",closable:t.closableChips,size:"small",text:E.title,disabled:E.props.disabled},x),null):ge??c("span",{class:"v-autocomplete__selection-text"},[E.title,t.multiple&&O<v.value.length-1&&c("span",{class:"v-autocomplete__selection-comma"},[k(",")])])])})]),"append-inner":function(){var x;for(var E=arguments.length,O=new Array(E),$=0;$<E;$++)O[$]=arguments[$];return c(j,null,[(x=n["append-inner"])==null?void 0:x.call(n,...O),t.menuIcon?c(Ut,{class:"v-autocomplete__menu-icon",icon:t.menuIcon,onMousedown:Yr,onClick:$i,"aria-label":r(P.value),title:r(P.value),tabindex:"-1"},null):void 0])}})}),Jn({isFocused:s,isPristine:a,menu:m,search:I,filteredItems:q,select:me},i)}});export{ql as M,Yl as V,Kl as _,ot as a};
//# sourceMappingURL=VAutocomplete-Dl7dcuhR.js.map
