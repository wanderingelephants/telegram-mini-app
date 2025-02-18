import{a5 as Yn,a6 as nt,a7 as Jn,a8 as hs,a9 as fs,aa as Xn,ab as yt,ac as _,ad as He,ae as ps,af as cn,ag as zt,ah as ms,s as Qn,_ as ht,E as M,A as Ot,C as qe,z as Zn,ai as ln,M as qt,aj as er,q as ft,ak as gs,al as _s,I as vs,am as ys,an as Is,H as ks,ao as bs,ap as Es,aq as Ts,J as ws,ar as Ss,as as Cs,L as As,at as Ds,P as Ns,G as Os,x as It,y as _e,p as Ps,o as Rs,D as xs,w as Ls}from"./index-CHSow7f6.js";import{N as ve,O as Oe,P as I,Q as w,_ as Pt,$ as Rt,m as h,S as Ms,R as kt,c as C,d as xt,s as Ke,w as tr,a as nr,n as U,z as Us,A as Vs,E as rr,F as Fs,V as bt}from"./vue-BQEgaIvT.js";import{A as Bs}from"./apexcharts-nQ7F75x6.js";import{a as $s,M as js,V as Hs}from"./VAutocomplete-BrqIPtkv.js";import{p as J,J as Ye,g as ie,f as me,Z as Ws,aJ as Me,B as de,G as Je,aK as Gs,ax as sr,o as ir,ak as zs,T as qs,m as Ks,b as Ys,d as Js,a0 as rt,W as Xs}from"./vuetify-BbdkIOBN.js";import{V as Qs}from"./VSnackbar-WMTSz_Rf.js";import"./VDialog-DR5onaTI.js";function Zs(t){return typeof t=="object"&&t!==null}function ei(t,e){if(!!!t)throw new Error("Unexpected invariant triggered.")}const ti=/\r\n|[\n\r]/g;function Lt(t,e){let n=0,s=1;for(const r of t.body.matchAll(ti)){if(typeof r.index=="number"||ei(!1),r.index>=e)break;n=r.index+r[0].length,s+=1}return{line:s,column:e+1-n}}function ni(t){return ar(t.source,Lt(t.source,t.start))}function ar(t,e){const n=t.locationOffset.column-1,s="".padStart(n)+t.body,r=e.line-1,i=t.locationOffset.line-1,a=e.line+i,c=e.line===1?n:0,o=e.column+c,l=`${t.name}:${a}:${o}
`,d=s.split(/\r\n|[\n\r]/g),f=d[r];if(f.length>120){const b=Math.floor(o/80),g=o%80,p=[];for(let y=0;y<f.length;y+=80)p.push(f.slice(y,y+80));return l+un([[`${a} |`,p[0]],...p.slice(1,b+1).map(y=>["|",y]),["|","^".padStart(g)],["|",p[b+1]]])}return l+un([[`${a-1} |`,d[r-1]],[`${a} |`,f],["|","^".padStart(o)],[`${a+1} |`,d[r+1]]])}function un(t){const e=t.filter(([s,r])=>r!==void 0),n=Math.max(...e.map(([s])=>s.length));return e.map(([s,r])=>s.padStart(n)+(r?" "+r:"")).join(`
`)}function ri(t){const e=t[0];return e==null||"kind"in e||"length"in e?{nodes:e,source:t[1],positions:t[2],path:t[3],originalError:t[4],extensions:t[5]}:e}class Kt extends Error{constructor(e,...n){var s,r,i;const{nodes:a,source:c,positions:o,path:l,originalError:d,extensions:f}=ri(n);super(e),this.name="GraphQLError",this.path=l??void 0,this.originalError=d??void 0,this.nodes=dn(Array.isArray(a)?a:a?[a]:void 0);const b=dn((s=this.nodes)===null||s===void 0?void 0:s.map(p=>p.loc).filter(p=>p!=null));this.source=c??(b==null||(r=b[0])===null||r===void 0?void 0:r.source),this.positions=o??(b==null?void 0:b.map(p=>p.start)),this.locations=o&&c?o.map(p=>Lt(c,p)):b==null?void 0:b.map(p=>Lt(p.source,p.start));const g=Zs(d==null?void 0:d.extensions)?d==null?void 0:d.extensions:void 0;this.extensions=(i=f??g)!==null&&i!==void 0?i:Object.create(null),Object.defineProperties(this,{message:{writable:!0,enumerable:!0},name:{enumerable:!1},nodes:{enumerable:!1},source:{enumerable:!1},positions:{enumerable:!1},originalError:{enumerable:!1}}),d!=null&&d.stack?Object.defineProperty(this,"stack",{value:d.stack,writable:!0,configurable:!0}):Error.captureStackTrace?Error.captureStackTrace(this,Kt):Object.defineProperty(this,"stack",{value:Error().stack,writable:!0,configurable:!0})}get[Symbol.toStringTag](){return"GraphQLError"}toString(){let e=this.message;if(this.nodes)for(const n of this.nodes)n.loc&&(e+=`

`+ni(n.loc));else if(this.source&&this.locations)for(const n of this.locations)e+=`

`+ar(this.source,n);return e}toJSON(){const e={message:this.message};return this.locations!=null&&(e.locations=this.locations),this.path!=null&&(e.path=this.path),this.extensions!=null&&Object.keys(this.extensions).length>0&&(e.extensions=this.extensions),e}}function dn(t){return t===void 0||t.length===0?void 0:t}function N(t,e,n){return new Kt(`Syntax Error: ${n}`,{source:t,positions:[e]})}var Mt;(function(t){t.QUERY="QUERY",t.MUTATION="MUTATION",t.SUBSCRIPTION="SUBSCRIPTION",t.FIELD="FIELD",t.FRAGMENT_DEFINITION="FRAGMENT_DEFINITION",t.FRAGMENT_SPREAD="FRAGMENT_SPREAD",t.INLINE_FRAGMENT="INLINE_FRAGMENT",t.VARIABLE_DEFINITION="VARIABLE_DEFINITION",t.SCHEMA="SCHEMA",t.SCALAR="SCALAR",t.OBJECT="OBJECT",t.FIELD_DEFINITION="FIELD_DEFINITION",t.ARGUMENT_DEFINITION="ARGUMENT_DEFINITION",t.INTERFACE="INTERFACE",t.UNION="UNION",t.ENUM="ENUM",t.ENUM_VALUE="ENUM_VALUE",t.INPUT_OBJECT="INPUT_OBJECT",t.INPUT_FIELD_DEFINITION="INPUT_FIELD_DEFINITION"})(Mt||(Mt={}));var u;(function(t){t.SOF="<SOF>",t.EOF="<EOF>",t.BANG="!",t.DOLLAR="$",t.AMP="&",t.PAREN_L="(",t.PAREN_R=")",t.SPREAD="...",t.COLON=":",t.EQUALS="=",t.AT="@",t.BRACKET_L="[",t.BRACKET_R="]",t.BRACE_L="{",t.PIPE="|",t.BRACE_R="}",t.NAME="Name",t.INT="Int",t.FLOAT="Float",t.STRING="String",t.BLOCK_STRING="BlockString",t.COMMENT="Comment"})(u||(u={}));class si{constructor(e){const n=new Yn(u.SOF,0,0,0,0);this.source=e,this.lastToken=n,this.token=n,this.line=1,this.lineStart=0}get[Symbol.toStringTag](){return"Lexer"}advance(){return this.lastToken=this.token,this.token=this.lookahead()}lookahead(){let e=this.token;if(e.kind!==u.EOF)do if(e.next)e=e.next;else{const n=ai(this,e.end);e.next=n,n.prev=e,e=n}while(e.kind===u.COMMENT);return e}}function ii(t){return t===u.BANG||t===u.DOLLAR||t===u.AMP||t===u.PAREN_L||t===u.PAREN_R||t===u.SPREAD||t===u.COLON||t===u.EQUALS||t===u.AT||t===u.BRACKET_L||t===u.BRACKET_R||t===u.BRACE_L||t===u.PIPE||t===u.BRACE_R}function we(t){return t>=0&&t<=55295||t>=57344&&t<=1114111}function pt(t,e){return or(t.charCodeAt(e))&&cr(t.charCodeAt(e+1))}function or(t){return t>=55296&&t<=56319}function cr(t){return t>=56320&&t<=57343}function fe(t,e){const n=t.source.body.codePointAt(e);if(n===void 0)return u.EOF;if(n>=32&&n<=126){const s=String.fromCodePoint(n);return s==='"'?`'"'`:`"${s}"`}return"U+"+n.toString(16).toUpperCase().padStart(4,"0")}function A(t,e,n,s,r){const i=t.line,a=1+n-t.lineStart;return new Yn(e,n,s,i,a,r)}function ai(t,e){const n=t.source.body,s=n.length;let r=e;for(;r<s;){const i=n.charCodeAt(r);switch(i){case 65279:case 9:case 32:case 44:++r;continue;case 10:++r,++t.line,t.lineStart=r;continue;case 13:n.charCodeAt(r+1)===10?r+=2:++r,++t.line,t.lineStart=r;continue;case 35:return oi(t,r);case 33:return A(t,u.BANG,r,r+1);case 36:return A(t,u.DOLLAR,r,r+1);case 38:return A(t,u.AMP,r,r+1);case 40:return A(t,u.PAREN_L,r,r+1);case 41:return A(t,u.PAREN_R,r,r+1);case 46:if(n.charCodeAt(r+1)===46&&n.charCodeAt(r+2)===46)return A(t,u.SPREAD,r,r+3);break;case 58:return A(t,u.COLON,r,r+1);case 61:return A(t,u.EQUALS,r,r+1);case 64:return A(t,u.AT,r,r+1);case 91:return A(t,u.BRACKET_L,r,r+1);case 93:return A(t,u.BRACKET_R,r,r+1);case 123:return A(t,u.BRACE_L,r,r+1);case 124:return A(t,u.PIPE,r,r+1);case 125:return A(t,u.BRACE_R,r,r+1);case 34:return n.charCodeAt(r+1)===34&&n.charCodeAt(r+2)===34?fi(t,r):li(t,r)}if(nt(i)||i===45)return ci(t,r,i);if(Jn(i))return pi(t,r);throw N(t.source,r,i===39?`Unexpected single quote character ('), did you mean to use a double quote (")?`:we(i)||pt(n,r)?`Unexpected character: ${fe(t,r)}.`:`Invalid character: ${fe(t,r)}.`)}return A(t,u.EOF,s,s)}function oi(t,e){const n=t.source.body,s=n.length;let r=e+1;for(;r<s;){const i=n.charCodeAt(r);if(i===10||i===13)break;if(we(i))++r;else if(pt(n,r))r+=2;else break}return A(t,u.COMMENT,e,r,n.slice(e+1,r))}function ci(t,e,n){const s=t.source.body;let r=e,i=n,a=!1;if(i===45&&(i=s.charCodeAt(++r)),i===48){if(i=s.charCodeAt(++r),nt(i))throw N(t.source,r,`Invalid number, unexpected digit after 0: ${fe(t,r)}.`)}else r=Et(t,r,i),i=s.charCodeAt(r);if(i===46&&(a=!0,i=s.charCodeAt(++r),r=Et(t,r,i),i=s.charCodeAt(r)),(i===69||i===101)&&(a=!0,i=s.charCodeAt(++r),(i===43||i===45)&&(i=s.charCodeAt(++r)),r=Et(t,r,i),i=s.charCodeAt(r)),i===46||Jn(i))throw N(t.source,r,`Invalid number, expected digit but got: ${fe(t,r)}.`);return A(t,a?u.FLOAT:u.INT,e,r,s.slice(e,r))}function Et(t,e,n){if(!nt(n))throw N(t.source,e,`Invalid number, expected digit but got: ${fe(t,e)}.`);const s=t.source.body;let r=e+1;for(;nt(s.charCodeAt(r));)++r;return r}function li(t,e){const n=t.source.body,s=n.length;let r=e+1,i=r,a="";for(;r<s;){const c=n.charCodeAt(r);if(c===34)return a+=n.slice(i,r),A(t,u.STRING,e,r+1,a);if(c===92){a+=n.slice(i,r);const o=n.charCodeAt(r+1)===117?n.charCodeAt(r+2)===123?ui(t,r):di(t,r):hi(t,r);a+=o.value,r+=o.size,i=r;continue}if(c===10||c===13)break;if(we(c))++r;else if(pt(n,r))r+=2;else throw N(t.source,r,`Invalid character within String: ${fe(t,r)}.`)}throw N(t.source,r,"Unterminated string.")}function ui(t,e){const n=t.source.body;let s=0,r=3;for(;r<12;){const i=n.charCodeAt(e+r++);if(i===125){if(r<5||!we(s))break;return{value:String.fromCodePoint(s),size:r}}if(s=s<<4|Ne(i),s<0)break}throw N(t.source,e,`Invalid Unicode escape sequence: "${n.slice(e,e+r)}".`)}function di(t,e){const n=t.source.body,s=hn(n,e+2);if(we(s))return{value:String.fromCodePoint(s),size:6};if(or(s)&&n.charCodeAt(e+6)===92&&n.charCodeAt(e+7)===117){const r=hn(n,e+8);if(cr(r))return{value:String.fromCodePoint(s,r),size:12}}throw N(t.source,e,`Invalid Unicode escape sequence: "${n.slice(e,e+6)}".`)}function hn(t,e){return Ne(t.charCodeAt(e))<<12|Ne(t.charCodeAt(e+1))<<8|Ne(t.charCodeAt(e+2))<<4|Ne(t.charCodeAt(e+3))}function Ne(t){return t>=48&&t<=57?t-48:t>=65&&t<=70?t-55:t>=97&&t<=102?t-87:-1}function hi(t,e){const n=t.source.body;switch(n.charCodeAt(e+1)){case 34:return{value:'"',size:2};case 92:return{value:"\\",size:2};case 47:return{value:"/",size:2};case 98:return{value:"\b",size:2};case 102:return{value:"\f",size:2};case 110:return{value:`
`,size:2};case 114:return{value:"\r",size:2};case 116:return{value:"	",size:2}}throw N(t.source,e,`Invalid character escape sequence: "${n.slice(e,e+2)}".`)}function fi(t,e){const n=t.source.body,s=n.length;let r=t.lineStart,i=e+3,a=i,c="";const o=[];for(;i<s;){const l=n.charCodeAt(i);if(l===34&&n.charCodeAt(i+1)===34&&n.charCodeAt(i+2)===34){c+=n.slice(a,i),o.push(c);const d=A(t,u.BLOCK_STRING,e,i+3,hs(o).join(`
`));return t.line+=o.length-1,t.lineStart=r,d}if(l===92&&n.charCodeAt(i+1)===34&&n.charCodeAt(i+2)===34&&n.charCodeAt(i+3)===34){c+=n.slice(a,i),a=i+1,i+=4;continue}if(l===10||l===13){c+=n.slice(a,i),o.push(c),l===13&&n.charCodeAt(i+1)===10?i+=2:++i,c="",a=i,r=i;continue}if(we(l))++i;else if(pt(n,i))i+=2;else throw N(t.source,i,`Invalid character within String: ${fe(t,i)}.`)}throw N(t.source,i,"Unterminated string.")}function pi(t,e){const n=t.source.body,s=n.length;let r=e+1;for(;r<s;){const i=n.charCodeAt(r);if(fs(i))++r;else break}return A(t,u.NAME,e,r,n.slice(e,r))}const mi=globalThis.process&&!0,gi=mi?function(e,n){return e instanceof n}:function(e,n){if(e instanceof n)return!0;if(typeof e=="object"&&e!==null){var s;const r=n.prototype[Symbol.toStringTag],i=Symbol.toStringTag in e?e[Symbol.toStringTag]:(s=e.constructor)===null||s===void 0?void 0:s.name;if(r===i){const a=Xn(e);throw new Error(`Cannot use ${r} "${a}" from another module or realm.

Ensure that there is only one instance of "graphql" in the node_modules
directory. If different versions of "graphql" are the dependencies of other
relied on modules, use "resolutions" to ensure only one version is installed.

https://yarnpkg.com/en/docs/selective-version-resolutions

Duplicate "graphql" modules cannot be used at the same time since different
versions may have different capabilities and behavior. The data from one
version used in the function from another could produce confusing and
spurious results.`)}}return!1};class lr{constructor(e,n="GraphQL request",s={line:1,column:1}){typeof e=="string"||yt(!1,`Body must be a string. Received: ${Xn(e)}.`),this.body=e,this.name=n,this.locationOffset=s,this.locationOffset.line>0||yt(!1,"line in locationOffset is 1-indexed and must be positive."),this.locationOffset.column>0||yt(!1,"column in locationOffset is 1-indexed and must be positive.")}get[Symbol.toStringTag](){return"Source"}}function _i(t){return gi(t,lr)}function vi(t,e){const n=new yi(t,e),s=n.parseDocument();return Object.defineProperty(s,"tokenCount",{enumerable:!1,value:n.tokenCount}),s}class yi{constructor(e,n={}){const s=_i(e)?e:new lr(e);this._lexer=new si(s),this._options=n,this._tokenCounter=0}get tokenCount(){return this._tokenCounter}parseName(){const e=this.expectToken(u.NAME);return this.node(e,{kind:_.NAME,value:e.value})}parseDocument(){return this.node(this._lexer.token,{kind:_.DOCUMENT,definitions:this.many(u.SOF,this.parseDefinition,u.EOF)})}parseDefinition(){if(this.peek(u.BRACE_L))return this.parseOperationDefinition();const e=this.peekDescription(),n=e?this._lexer.lookahead():this._lexer.token;if(n.kind===u.NAME){switch(n.value){case"schema":return this.parseSchemaDefinition();case"scalar":return this.parseScalarTypeDefinition();case"type":return this.parseObjectTypeDefinition();case"interface":return this.parseInterfaceTypeDefinition();case"union":return this.parseUnionTypeDefinition();case"enum":return this.parseEnumTypeDefinition();case"input":return this.parseInputObjectTypeDefinition();case"directive":return this.parseDirectiveDefinition()}if(e)throw N(this._lexer.source,this._lexer.token.start,"Unexpected description, descriptions are supported only on type definitions.");switch(n.value){case"query":case"mutation":case"subscription":return this.parseOperationDefinition();case"fragment":return this.parseFragmentDefinition();case"extend":return this.parseTypeSystemExtension()}}throw this.unexpected(n)}parseOperationDefinition(){const e=this._lexer.token;if(this.peek(u.BRACE_L))return this.node(e,{kind:_.OPERATION_DEFINITION,operation:He.QUERY,name:void 0,variableDefinitions:[],directives:[],selectionSet:this.parseSelectionSet()});const n=this.parseOperationType();let s;return this.peek(u.NAME)&&(s=this.parseName()),this.node(e,{kind:_.OPERATION_DEFINITION,operation:n,name:s,variableDefinitions:this.parseVariableDefinitions(),directives:this.parseDirectives(!1),selectionSet:this.parseSelectionSet()})}parseOperationType(){const e=this.expectToken(u.NAME);switch(e.value){case"query":return He.QUERY;case"mutation":return He.MUTATION;case"subscription":return He.SUBSCRIPTION}throw this.unexpected(e)}parseVariableDefinitions(){return this.optionalMany(u.PAREN_L,this.parseVariableDefinition,u.PAREN_R)}parseVariableDefinition(){return this.node(this._lexer.token,{kind:_.VARIABLE_DEFINITION,variable:this.parseVariable(),type:(this.expectToken(u.COLON),this.parseTypeReference()),defaultValue:this.expectOptionalToken(u.EQUALS)?this.parseConstValueLiteral():void 0,directives:this.parseConstDirectives()})}parseVariable(){const e=this._lexer.token;return this.expectToken(u.DOLLAR),this.node(e,{kind:_.VARIABLE,name:this.parseName()})}parseSelectionSet(){return this.node(this._lexer.token,{kind:_.SELECTION_SET,selections:this.many(u.BRACE_L,this.parseSelection,u.BRACE_R)})}parseSelection(){return this.peek(u.SPREAD)?this.parseFragment():this.parseField()}parseField(){const e=this._lexer.token,n=this.parseName();let s,r;return this.expectOptionalToken(u.COLON)?(s=n,r=this.parseName()):r=n,this.node(e,{kind:_.FIELD,alias:s,name:r,arguments:this.parseArguments(!1),directives:this.parseDirectives(!1),selectionSet:this.peek(u.BRACE_L)?this.parseSelectionSet():void 0})}parseArguments(e){const n=e?this.parseConstArgument:this.parseArgument;return this.optionalMany(u.PAREN_L,n,u.PAREN_R)}parseArgument(e=!1){const n=this._lexer.token,s=this.parseName();return this.expectToken(u.COLON),this.node(n,{kind:_.ARGUMENT,name:s,value:this.parseValueLiteral(e)})}parseConstArgument(){return this.parseArgument(!0)}parseFragment(){const e=this._lexer.token;this.expectToken(u.SPREAD);const n=this.expectOptionalKeyword("on");return!n&&this.peek(u.NAME)?this.node(e,{kind:_.FRAGMENT_SPREAD,name:this.parseFragmentName(),directives:this.parseDirectives(!1)}):this.node(e,{kind:_.INLINE_FRAGMENT,typeCondition:n?this.parseNamedType():void 0,directives:this.parseDirectives(!1),selectionSet:this.parseSelectionSet()})}parseFragmentDefinition(){const e=this._lexer.token;return this.expectKeyword("fragment"),this._options.allowLegacyFragmentVariables===!0?this.node(e,{kind:_.FRAGMENT_DEFINITION,name:this.parseFragmentName(),variableDefinitions:this.parseVariableDefinitions(),typeCondition:(this.expectKeyword("on"),this.parseNamedType()),directives:this.parseDirectives(!1),selectionSet:this.parseSelectionSet()}):this.node(e,{kind:_.FRAGMENT_DEFINITION,name:this.parseFragmentName(),typeCondition:(this.expectKeyword("on"),this.parseNamedType()),directives:this.parseDirectives(!1),selectionSet:this.parseSelectionSet()})}parseFragmentName(){if(this._lexer.token.value==="on")throw this.unexpected();return this.parseName()}parseValueLiteral(e){const n=this._lexer.token;switch(n.kind){case u.BRACKET_L:return this.parseList(e);case u.BRACE_L:return this.parseObject(e);case u.INT:return this.advanceLexer(),this.node(n,{kind:_.INT,value:n.value});case u.FLOAT:return this.advanceLexer(),this.node(n,{kind:_.FLOAT,value:n.value});case u.STRING:case u.BLOCK_STRING:return this.parseStringLiteral();case u.NAME:switch(this.advanceLexer(),n.value){case"true":return this.node(n,{kind:_.BOOLEAN,value:!0});case"false":return this.node(n,{kind:_.BOOLEAN,value:!1});case"null":return this.node(n,{kind:_.NULL});default:return this.node(n,{kind:_.ENUM,value:n.value})}case u.DOLLAR:if(e)if(this.expectToken(u.DOLLAR),this._lexer.token.kind===u.NAME){const s=this._lexer.token.value;throw N(this._lexer.source,n.start,`Unexpected variable "$${s}" in constant value.`)}else throw this.unexpected(n);return this.parseVariable();default:throw this.unexpected()}}parseConstValueLiteral(){return this.parseValueLiteral(!0)}parseStringLiteral(){const e=this._lexer.token;return this.advanceLexer(),this.node(e,{kind:_.STRING,value:e.value,block:e.kind===u.BLOCK_STRING})}parseList(e){const n=()=>this.parseValueLiteral(e);return this.node(this._lexer.token,{kind:_.LIST,values:this.any(u.BRACKET_L,n,u.BRACKET_R)})}parseObject(e){const n=()=>this.parseObjectField(e);return this.node(this._lexer.token,{kind:_.OBJECT,fields:this.any(u.BRACE_L,n,u.BRACE_R)})}parseObjectField(e){const n=this._lexer.token,s=this.parseName();return this.expectToken(u.COLON),this.node(n,{kind:_.OBJECT_FIELD,name:s,value:this.parseValueLiteral(e)})}parseDirectives(e){const n=[];for(;this.peek(u.AT);)n.push(this.parseDirective(e));return n}parseConstDirectives(){return this.parseDirectives(!0)}parseDirective(e){const n=this._lexer.token;return this.expectToken(u.AT),this.node(n,{kind:_.DIRECTIVE,name:this.parseName(),arguments:this.parseArguments(e)})}parseTypeReference(){const e=this._lexer.token;let n;if(this.expectOptionalToken(u.BRACKET_L)){const s=this.parseTypeReference();this.expectToken(u.BRACKET_R),n=this.node(e,{kind:_.LIST_TYPE,type:s})}else n=this.parseNamedType();return this.expectOptionalToken(u.BANG)?this.node(e,{kind:_.NON_NULL_TYPE,type:n}):n}parseNamedType(){return this.node(this._lexer.token,{kind:_.NAMED_TYPE,name:this.parseName()})}peekDescription(){return this.peek(u.STRING)||this.peek(u.BLOCK_STRING)}parseDescription(){if(this.peekDescription())return this.parseStringLiteral()}parseSchemaDefinition(){const e=this._lexer.token,n=this.parseDescription();this.expectKeyword("schema");const s=this.parseConstDirectives(),r=this.many(u.BRACE_L,this.parseOperationTypeDefinition,u.BRACE_R);return this.node(e,{kind:_.SCHEMA_DEFINITION,description:n,directives:s,operationTypes:r})}parseOperationTypeDefinition(){const e=this._lexer.token,n=this.parseOperationType();this.expectToken(u.COLON);const s=this.parseNamedType();return this.node(e,{kind:_.OPERATION_TYPE_DEFINITION,operation:n,type:s})}parseScalarTypeDefinition(){const e=this._lexer.token,n=this.parseDescription();this.expectKeyword("scalar");const s=this.parseName(),r=this.parseConstDirectives();return this.node(e,{kind:_.SCALAR_TYPE_DEFINITION,description:n,name:s,directives:r})}parseObjectTypeDefinition(){const e=this._lexer.token,n=this.parseDescription();this.expectKeyword("type");const s=this.parseName(),r=this.parseImplementsInterfaces(),i=this.parseConstDirectives(),a=this.parseFieldsDefinition();return this.node(e,{kind:_.OBJECT_TYPE_DEFINITION,description:n,name:s,interfaces:r,directives:i,fields:a})}parseImplementsInterfaces(){return this.expectOptionalKeyword("implements")?this.delimitedMany(u.AMP,this.parseNamedType):[]}parseFieldsDefinition(){return this.optionalMany(u.BRACE_L,this.parseFieldDefinition,u.BRACE_R)}parseFieldDefinition(){const e=this._lexer.token,n=this.parseDescription(),s=this.parseName(),r=this.parseArgumentDefs();this.expectToken(u.COLON);const i=this.parseTypeReference(),a=this.parseConstDirectives();return this.node(e,{kind:_.FIELD_DEFINITION,description:n,name:s,arguments:r,type:i,directives:a})}parseArgumentDefs(){return this.optionalMany(u.PAREN_L,this.parseInputValueDef,u.PAREN_R)}parseInputValueDef(){const e=this._lexer.token,n=this.parseDescription(),s=this.parseName();this.expectToken(u.COLON);const r=this.parseTypeReference();let i;this.expectOptionalToken(u.EQUALS)&&(i=this.parseConstValueLiteral());const a=this.parseConstDirectives();return this.node(e,{kind:_.INPUT_VALUE_DEFINITION,description:n,name:s,type:r,defaultValue:i,directives:a})}parseInterfaceTypeDefinition(){const e=this._lexer.token,n=this.parseDescription();this.expectKeyword("interface");const s=this.parseName(),r=this.parseImplementsInterfaces(),i=this.parseConstDirectives(),a=this.parseFieldsDefinition();return this.node(e,{kind:_.INTERFACE_TYPE_DEFINITION,description:n,name:s,interfaces:r,directives:i,fields:a})}parseUnionTypeDefinition(){const e=this._lexer.token,n=this.parseDescription();this.expectKeyword("union");const s=this.parseName(),r=this.parseConstDirectives(),i=this.parseUnionMemberTypes();return this.node(e,{kind:_.UNION_TYPE_DEFINITION,description:n,name:s,directives:r,types:i})}parseUnionMemberTypes(){return this.expectOptionalToken(u.EQUALS)?this.delimitedMany(u.PIPE,this.parseNamedType):[]}parseEnumTypeDefinition(){const e=this._lexer.token,n=this.parseDescription();this.expectKeyword("enum");const s=this.parseName(),r=this.parseConstDirectives(),i=this.parseEnumValuesDefinition();return this.node(e,{kind:_.ENUM_TYPE_DEFINITION,description:n,name:s,directives:r,values:i})}parseEnumValuesDefinition(){return this.optionalMany(u.BRACE_L,this.parseEnumValueDefinition,u.BRACE_R)}parseEnumValueDefinition(){const e=this._lexer.token,n=this.parseDescription(),s=this.parseEnumValueName(),r=this.parseConstDirectives();return this.node(e,{kind:_.ENUM_VALUE_DEFINITION,description:n,name:s,directives:r})}parseEnumValueName(){if(this._lexer.token.value==="true"||this._lexer.token.value==="false"||this._lexer.token.value==="null")throw N(this._lexer.source,this._lexer.token.start,`${We(this._lexer.token)} is reserved and cannot be used for an enum value.`);return this.parseName()}parseInputObjectTypeDefinition(){const e=this._lexer.token,n=this.parseDescription();this.expectKeyword("input");const s=this.parseName(),r=this.parseConstDirectives(),i=this.parseInputFieldsDefinition();return this.node(e,{kind:_.INPUT_OBJECT_TYPE_DEFINITION,description:n,name:s,directives:r,fields:i})}parseInputFieldsDefinition(){return this.optionalMany(u.BRACE_L,this.parseInputValueDef,u.BRACE_R)}parseTypeSystemExtension(){const e=this._lexer.lookahead();if(e.kind===u.NAME)switch(e.value){case"schema":return this.parseSchemaExtension();case"scalar":return this.parseScalarTypeExtension();case"type":return this.parseObjectTypeExtension();case"interface":return this.parseInterfaceTypeExtension();case"union":return this.parseUnionTypeExtension();case"enum":return this.parseEnumTypeExtension();case"input":return this.parseInputObjectTypeExtension()}throw this.unexpected(e)}parseSchemaExtension(){const e=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("schema");const n=this.parseConstDirectives(),s=this.optionalMany(u.BRACE_L,this.parseOperationTypeDefinition,u.BRACE_R);if(n.length===0&&s.length===0)throw this.unexpected();return this.node(e,{kind:_.SCHEMA_EXTENSION,directives:n,operationTypes:s})}parseScalarTypeExtension(){const e=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("scalar");const n=this.parseName(),s=this.parseConstDirectives();if(s.length===0)throw this.unexpected();return this.node(e,{kind:_.SCALAR_TYPE_EXTENSION,name:n,directives:s})}parseObjectTypeExtension(){const e=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("type");const n=this.parseName(),s=this.parseImplementsInterfaces(),r=this.parseConstDirectives(),i=this.parseFieldsDefinition();if(s.length===0&&r.length===0&&i.length===0)throw this.unexpected();return this.node(e,{kind:_.OBJECT_TYPE_EXTENSION,name:n,interfaces:s,directives:r,fields:i})}parseInterfaceTypeExtension(){const e=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("interface");const n=this.parseName(),s=this.parseImplementsInterfaces(),r=this.parseConstDirectives(),i=this.parseFieldsDefinition();if(s.length===0&&r.length===0&&i.length===0)throw this.unexpected();return this.node(e,{kind:_.INTERFACE_TYPE_EXTENSION,name:n,interfaces:s,directives:r,fields:i})}parseUnionTypeExtension(){const e=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("union");const n=this.parseName(),s=this.parseConstDirectives(),r=this.parseUnionMemberTypes();if(s.length===0&&r.length===0)throw this.unexpected();return this.node(e,{kind:_.UNION_TYPE_EXTENSION,name:n,directives:s,types:r})}parseEnumTypeExtension(){const e=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("enum");const n=this.parseName(),s=this.parseConstDirectives(),r=this.parseEnumValuesDefinition();if(s.length===0&&r.length===0)throw this.unexpected();return this.node(e,{kind:_.ENUM_TYPE_EXTENSION,name:n,directives:s,values:r})}parseInputObjectTypeExtension(){const e=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("input");const n=this.parseName(),s=this.parseConstDirectives(),r=this.parseInputFieldsDefinition();if(s.length===0&&r.length===0)throw this.unexpected();return this.node(e,{kind:_.INPUT_OBJECT_TYPE_EXTENSION,name:n,directives:s,fields:r})}parseDirectiveDefinition(){const e=this._lexer.token,n=this.parseDescription();this.expectKeyword("directive"),this.expectToken(u.AT);const s=this.parseName(),r=this.parseArgumentDefs(),i=this.expectOptionalKeyword("repeatable");this.expectKeyword("on");const a=this.parseDirectiveLocations();return this.node(e,{kind:_.DIRECTIVE_DEFINITION,description:n,name:s,arguments:r,repeatable:i,locations:a})}parseDirectiveLocations(){return this.delimitedMany(u.PIPE,this.parseDirectiveLocation)}parseDirectiveLocation(){const e=this._lexer.token,n=this.parseName();if(Object.prototype.hasOwnProperty.call(Mt,n.value))return n;throw this.unexpected(e)}node(e,n){return this._options.noLocation!==!0&&(n.loc=new ps(e,this._lexer.lastToken,this._lexer.source)),n}peek(e){return this._lexer.token.kind===e}expectToken(e){const n=this._lexer.token;if(n.kind===e)return this.advanceLexer(),n;throw N(this._lexer.source,n.start,`Expected ${ur(e)}, found ${We(n)}.`)}expectOptionalToken(e){return this._lexer.token.kind===e?(this.advanceLexer(),!0):!1}expectKeyword(e){const n=this._lexer.token;if(n.kind===u.NAME&&n.value===e)this.advanceLexer();else throw N(this._lexer.source,n.start,`Expected "${e}", found ${We(n)}.`)}expectOptionalKeyword(e){const n=this._lexer.token;return n.kind===u.NAME&&n.value===e?(this.advanceLexer(),!0):!1}unexpected(e){const n=e??this._lexer.token;return N(this._lexer.source,n.start,`Unexpected ${We(n)}.`)}any(e,n,s){this.expectToken(e);const r=[];for(;!this.expectOptionalToken(s);)r.push(n.call(this));return r}optionalMany(e,n,s){if(this.expectOptionalToken(e)){const r=[];do r.push(n.call(this));while(!this.expectOptionalToken(s));return r}return[]}many(e,n,s){this.expectToken(e);const r=[];do r.push(n.call(this));while(!this.expectOptionalToken(s));return r}delimitedMany(e,n){this.expectOptionalToken(e);const s=[];do s.push(n.call(this));while(this.expectOptionalToken(e));return s}advanceLexer(){const{maxTokens:e}=this._options,n=this._lexer.advance();if(n.kind!==u.EOF&&(++this._tokenCounter,e!==void 0&&this._tokenCounter>e))throw N(this._lexer.source,n.start,`Document contains more that ${e} tokens. Parsing aborted.`)}}function We(t){const e=t.value;return ur(t.kind)+(e!=null?` "${e}"`:"")}function ur(t){return ii(t)?`"${t}"`:t}var Xe=new Map,Ut=new Map,dr=!0,st=!1;function hr(t){return t.replace(/[\s,]+/g," ").trim()}function Ii(t){return hr(t.source.body.substring(t.start,t.end))}function ki(t){var e=new Set,n=[];return t.definitions.forEach(function(s){if(s.kind==="FragmentDefinition"){var r=s.name.value,i=Ii(s.loc),a=Ut.get(r);a&&!a.has(i)?dr&&console.warn("Warning: fragment with name "+r+` already exists.
graphql-tag enforces all fragment names across your application to be unique; read more about
this in the docs: http://dev.apollodata.com/core/fragments.html#unique-names`):a||Ut.set(r,a=new Set),a.add(i),e.has(i)||(e.add(i),n.push(s))}else n.push(s)}),cn(cn({},t),{definitions:n})}function bi(t){var e=new Set(t.definitions);e.forEach(function(s){s.loc&&delete s.loc,Object.keys(s).forEach(function(r){var i=s[r];i&&typeof i=="object"&&e.add(i)})});var n=t.loc;return n&&(delete n.startToken,delete n.endToken),t}function Ei(t){var e=hr(t);if(!Xe.has(e)){var n=vi(t,{experimentalFragmentVariables:st,allowLegacyFragmentVariables:st});if(!n||n.kind!=="Document")throw new Error("Not a valid GraphQL document.");Xe.set(e,bi(ki(n)))}return Xe.get(e)}function $(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];typeof t=="string"&&(t=[t]);var s=t[0];return e.forEach(function(r,i){r&&r.kind==="Document"?s+=r.loc.source.body:s+=r,s+=t[i+1]}),Ei(s)}function Ti(){Xe.clear(),Ut.clear()}function wi(){dr=!1}function Si(){st=!0}function Ci(){st=!1}var De={gql:$,resetCaches:Ti,disableFragmentWarnings:wi,enableExperimentalFragmentVariables:Si,disableExperimentalFragmentVariables:Ci};(function(t){t.gql=De.gql,t.resetCaches=De.resetCaches,t.disableFragmentWarnings=De.disableFragmentWarnings,t.enableExperimentalFragmentVariables=De.enableExperimentalFragmentVariables,t.disableExperimentalFragmentVariables=De.disableExperimentalFragmentVariables})($||($={}));$.default=$;var fn={VUE_APP_GRAPHQL_ENDPOINT:"http://localhost:8081",NODE_ENV:"development"};/**
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
 */const fr=function(t){const e=[];let n=0;for(let s=0;s<t.length;s++){let r=t.charCodeAt(s);r<128?e[n++]=r:r<2048?(e[n++]=r>>6|192,e[n++]=r&63|128):(r&64512)===55296&&s+1<t.length&&(t.charCodeAt(s+1)&64512)===56320?(r=65536+((r&1023)<<10)+(t.charCodeAt(++s)&1023),e[n++]=r>>18|240,e[n++]=r>>12&63|128,e[n++]=r>>6&63|128,e[n++]=r&63|128):(e[n++]=r>>12|224,e[n++]=r>>6&63|128,e[n++]=r&63|128)}return e},Ai=function(t){const e=[];let n=0,s=0;for(;n<t.length;){const r=t[n++];if(r<128)e[s++]=String.fromCharCode(r);else if(r>191&&r<224){const i=t[n++];e[s++]=String.fromCharCode((r&31)<<6|i&63)}else if(r>239&&r<365){const i=t[n++],a=t[n++],c=t[n++],o=((r&7)<<18|(i&63)<<12|(a&63)<<6|c&63)-65536;e[s++]=String.fromCharCode(55296+(o>>10)),e[s++]=String.fromCharCode(56320+(o&1023))}else{const i=t[n++],a=t[n++];e[s++]=String.fromCharCode((r&15)<<12|(i&63)<<6|a&63)}}return e.join("")},pr={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let r=0;r<t.length;r+=3){const i=t[r],a=r+1<t.length,c=a?t[r+1]:0,o=r+2<t.length,l=o?t[r+2]:0,d=i>>2,f=(i&3)<<4|c>>4;let b=(c&15)<<2|l>>6,g=l&63;o||(g=64,a||(b=64)),s.push(n[d],n[f],n[b],n[g])}return s.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(fr(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):Ai(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let r=0;r<t.length;){const i=n[t.charAt(r++)],c=r<t.length?n[t.charAt(r)]:0;++r;const l=r<t.length?n[t.charAt(r)]:64;++r;const f=r<t.length?n[t.charAt(r)]:64;if(++r,i==null||c==null||l==null||f==null)throw new Di;const b=i<<2|c>>4;if(s.push(b),l!==64){const g=c<<4&240|l>>2;if(s.push(g),f!==64){const p=l<<6&192|f;s.push(p)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class Di extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Ni=function(t){const e=fr(t);return pr.encodeByteArray(e,!0)},mr=function(t){return Ni(t).replace(/\./g,"")},gr=function(t){try{return pr.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function Oi(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const Pi=()=>Oi().__FIREBASE_DEFAULTS__,Ri=()=>{if(typeof process>"u"||typeof fn>"u")return;const t=fn.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},xi=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&gr(t[1]);return e&&JSON.parse(e)},Yt=()=>{try{return Pi()||Ri()||xi()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},Li=t=>{var e,n;return(n=(e=Yt())===null||e===void 0?void 0:e.emulatorHosts)===null||n===void 0?void 0:n[t]},_r=()=>{var t;return(t=Yt())===null||t===void 0?void 0:t.config},vr=t=>{var e;return(e=Yt())===null||e===void 0?void 0:e[`_${t}`]};/**
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
 */class Mi{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,s)=>{n?this.reject(n):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,s))}}}/**
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
 */function R(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Ui(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(R())}function Vi(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Fi(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function Bi(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function $i(){const t=R();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function ji(){try{return typeof indexedDB=="object"}catch{return!1}}function Hi(){return new Promise((t,e)=>{try{let n=!0;const s="validate-browser-context-for-indexeddb-analytics-module",r=self.indexedDB.open(s);r.onsuccess=()=>{r.result.close(),n||self.indexedDB.deleteDatabase(s),t(!0)},r.onupgradeneeded=()=>{n=!1},r.onerror=()=>{var i;e(((i=r.error)===null||i===void 0?void 0:i.message)||"")}}catch(n){e(n)}})}/**
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
 */const Wi="FirebaseError";class ae extends Error{constructor(e,n,s){super(n),this.code=e,this.customData=s,this.name=Wi,Object.setPrototypeOf(this,ae.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Ue.prototype.create)}}class Ue{constructor(e,n,s){this.service=e,this.serviceName=n,this.errors=s}create(e,...n){const s=n[0]||{},r=`${this.service}/${e}`,i=this.errors[e],a=i?Gi(i,s):"Error",c=`${this.serviceName}: ${a} (${r}).`;return new ae(r,c,s)}}function Gi(t,e){return t.replace(zi,(n,s)=>{const r=e[s];return r!=null?String(r):`<${s}?>`})}const zi=/\{\$([^}]+)}/g;function qi(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function it(t,e){if(t===e)return!0;const n=Object.keys(t),s=Object.keys(e);for(const r of n){if(!s.includes(r))return!1;const i=t[r],a=e[r];if(pn(i)&&pn(a)){if(!it(i,a))return!1}else if(i!==a)return!1}for(const r of s)if(!n.includes(r))return!1;return!0}function pn(t){return t!==null&&typeof t=="object"}/**
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
 */function Ve(t){const e=[];for(const[n,s]of Object.entries(t))Array.isArray(s)?s.forEach(r=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(r))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(s));return e.length?"&"+e.join("&"):""}function Ki(t,e){const n=new Yi(t,e);return n.subscribe.bind(n)}class Yi{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(s=>{this.error(s)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,s){let r;if(e===void 0&&n===void 0&&s===void 0)throw new Error("Missing Observer.");Ji(e,["next","error","complete"])?r=e:r={next:e,error:n,complete:s},r.next===void 0&&(r.next=Tt),r.error===void 0&&(r.error=Tt),r.complete===void 0&&(r.complete=Tt);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?r.error(this.finalError):r.complete()}catch{}}),this.observers.push(r),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(s){typeof console<"u"&&console.error&&console.error(s)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Ji(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function Tt(){}/**
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
 */function oe(t){return t&&t._delegate?t._delegate:t}class Ee{constructor(e,n,s){this.name=e,this.instanceFactory=n,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const le="[DEFAULT]";/**
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
 */class Xi{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const s=new Mi;if(this.instancesDeferred.set(n,s),this.isInitialized(n)||this.shouldAutoInitialize())try{const r=this.getOrInitializeService({instanceIdentifier:n});r&&s.resolve(r)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){var n;const s=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(n=e==null?void 0:e.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(s)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:s})}catch(i){if(r)return null;throw i}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Zi(e))try{this.getOrInitializeService({instanceIdentifier:le})}catch{}for(const[n,s]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(n);try{const i=this.getOrInitializeService({instanceIdentifier:r});s.resolve(i)}catch{}}}}clearInstance(e=le){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=le){return this.instances.has(e)}getOptions(e=le){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:s,options:n});for(const[i,a]of this.instancesDeferred.entries()){const c=this.normalizeInstanceIdentifier(i);s===c&&a.resolve(r)}return r}onInit(e,n){var s;const r=this.normalizeInstanceIdentifier(n),i=(s=this.onInitCallbacks.get(r))!==null&&s!==void 0?s:new Set;i.add(e),this.onInitCallbacks.set(r,i);const a=this.instances.get(r);return a&&e(a,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){const s=this.onInitCallbacks.get(n);if(s)for(const r of s)try{r(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:Qi(e),options:n}),this.instances.set(e,s),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=le){return this.component?this.component.multipleInstances?e:le:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Qi(t){return t===le?void 0:t}function Zi(t){return t.instantiationMode==="EAGER"}/**
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
 */class ea{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new Xi(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var T;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(T||(T={}));const ta={debug:T.DEBUG,verbose:T.VERBOSE,info:T.INFO,warn:T.WARN,error:T.ERROR,silent:T.SILENT},na=T.INFO,ra={[T.DEBUG]:"log",[T.VERBOSE]:"log",[T.INFO]:"info",[T.WARN]:"warn",[T.ERROR]:"error"},sa=(t,e,...n)=>{if(e<t.logLevel)return;const s=new Date().toISOString(),r=ra[e];if(r)console[r](`[${s}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class yr{constructor(e){this.name=e,this._logLevel=na,this._logHandler=sa,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in T))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?ta[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,T.DEBUG,...e),this._logHandler(this,T.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,T.VERBOSE,...e),this._logHandler(this,T.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,T.INFO,...e),this._logHandler(this,T.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,T.WARN,...e),this._logHandler(this,T.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,T.ERROR,...e),this._logHandler(this,T.ERROR,...e)}}const ia=(t,e)=>e.some(n=>t instanceof n);let mn,gn;function aa(){return mn||(mn=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function oa(){return gn||(gn=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Ir=new WeakMap,Vt=new WeakMap,kr=new WeakMap,wt=new WeakMap,Jt=new WeakMap;function ca(t){const e=new Promise((n,s)=>{const r=()=>{t.removeEventListener("success",i),t.removeEventListener("error",a)},i=()=>{n(re(t.result)),r()},a=()=>{s(t.error),r()};t.addEventListener("success",i),t.addEventListener("error",a)});return e.then(n=>{n instanceof IDBCursor&&Ir.set(n,t)}).catch(()=>{}),Jt.set(e,t),e}function la(t){if(Vt.has(t))return;const e=new Promise((n,s)=>{const r=()=>{t.removeEventListener("complete",i),t.removeEventListener("error",a),t.removeEventListener("abort",a)},i=()=>{n(),r()},a=()=>{s(t.error||new DOMException("AbortError","AbortError")),r()};t.addEventListener("complete",i),t.addEventListener("error",a),t.addEventListener("abort",a)});Vt.set(t,e)}let Ft={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return Vt.get(t);if(e==="objectStoreNames")return t.objectStoreNames||kr.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return re(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function ua(t){Ft=t(Ft)}function da(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const s=t.call(St(this),e,...n);return kr.set(s,e.sort?e.sort():[e]),re(s)}:oa().includes(t)?function(...e){return t.apply(St(this),e),re(Ir.get(this))}:function(...e){return re(t.apply(St(this),e))}}function ha(t){return typeof t=="function"?da(t):(t instanceof IDBTransaction&&la(t),ia(t,aa())?new Proxy(t,Ft):t)}function re(t){if(t instanceof IDBRequest)return ca(t);if(wt.has(t))return wt.get(t);const e=ha(t);return e!==t&&(wt.set(t,e),Jt.set(e,t)),e}const St=t=>Jt.get(t);function fa(t,e,{blocked:n,upgrade:s,blocking:r,terminated:i}={}){const a=indexedDB.open(t,e),c=re(a);return s&&a.addEventListener("upgradeneeded",o=>{s(re(a.result),o.oldVersion,o.newVersion,re(a.transaction),o)}),n&&a.addEventListener("blocked",o=>n(o.oldVersion,o.newVersion,o)),c.then(o=>{i&&o.addEventListener("close",()=>i()),r&&o.addEventListener("versionchange",l=>r(l.oldVersion,l.newVersion,l))}).catch(()=>{}),c}const pa=["get","getKey","getAll","getAllKeys","count"],ma=["put","add","delete","clear"],Ct=new Map;function _n(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(Ct.get(e))return Ct.get(e);const n=e.replace(/FromIndex$/,""),s=e!==n,r=ma.includes(n);if(!(n in(s?IDBIndex:IDBObjectStore).prototype)||!(r||pa.includes(n)))return;const i=async function(a,...c){const o=this.transaction(a,r?"readwrite":"readonly");let l=o.store;return s&&(l=l.index(c.shift())),(await Promise.all([l[n](...c),r&&o.done]))[0]};return Ct.set(e,i),i}ua(t=>({...t,get:(e,n,s)=>_n(e,n)||t.get(e,n,s),has:(e,n)=>!!_n(e,n)||t.has(e,n)}));/**
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
 */class ga{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(_a(n)){const s=n.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(n=>n).join(" ")}}function _a(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Bt="@firebase/app",vn="0.10.17";/**
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
 */const K=new yr("@firebase/app"),va="@firebase/app-compat",ya="@firebase/analytics-compat",Ia="@firebase/analytics",ka="@firebase/app-check-compat",ba="@firebase/app-check",Ea="@firebase/auth",Ta="@firebase/auth-compat",wa="@firebase/database",Sa="@firebase/data-connect",Ca="@firebase/database-compat",Aa="@firebase/functions",Da="@firebase/functions-compat",Na="@firebase/installations",Oa="@firebase/installations-compat",Pa="@firebase/messaging",Ra="@firebase/messaging-compat",xa="@firebase/performance",La="@firebase/performance-compat",Ma="@firebase/remote-config",Ua="@firebase/remote-config-compat",Va="@firebase/storage",Fa="@firebase/storage-compat",Ba="@firebase/firestore",$a="@firebase/vertexai",ja="@firebase/firestore-compat",Ha="firebase",Wa="11.1.0";/**
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
 */const $t="[DEFAULT]",Ga={[Bt]:"fire-core",[va]:"fire-core-compat",[Ia]:"fire-analytics",[ya]:"fire-analytics-compat",[ba]:"fire-app-check",[ka]:"fire-app-check-compat",[Ea]:"fire-auth",[Ta]:"fire-auth-compat",[wa]:"fire-rtdb",[Sa]:"fire-data-connect",[Ca]:"fire-rtdb-compat",[Aa]:"fire-fn",[Da]:"fire-fn-compat",[Na]:"fire-iid",[Oa]:"fire-iid-compat",[Pa]:"fire-fcm",[Ra]:"fire-fcm-compat",[xa]:"fire-perf",[La]:"fire-perf-compat",[Ma]:"fire-rc",[Ua]:"fire-rc-compat",[Va]:"fire-gcs",[Fa]:"fire-gcs-compat",[Ba]:"fire-fst",[ja]:"fire-fst-compat",[$a]:"fire-vertex","fire-js":"fire-js",[Ha]:"fire-js-all"};/**
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
 */const at=new Map,za=new Map,jt=new Map;function yn(t,e){try{t.container.addComponent(e)}catch(n){K.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function Re(t){const e=t.name;if(jt.has(e))return K.debug(`There were multiple attempts to register component ${e}.`),!1;jt.set(e,t);for(const n of at.values())yn(n,t);for(const n of za.values())yn(n,t);return!0}function br(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function W(t){return t.settings!==void 0}/**
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
 */const qa={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},se=new Ue("app","Firebase",qa);/**
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
 */class Ka{constructor(e,n,s){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new Ee("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw se.create("app-deleted",{appName:this._name})}}/**
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
 */const Fe=Wa;function Er(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const s=Object.assign({name:$t,automaticDataCollectionEnabled:!1},e),r=s.name;if(typeof r!="string"||!r)throw se.create("bad-app-name",{appName:String(r)});if(n||(n=_r()),!n)throw se.create("no-options");const i=at.get(r);if(i){if(it(n,i.options)&&it(s,i.config))return i;throw se.create("duplicate-app",{appName:r})}const a=new ea(r);for(const o of jt.values())a.addComponent(o);const c=new Ka(n,s,a);return at.set(r,c),c}function Ya(t=$t){const e=at.get(t);if(!e&&t===$t&&_r())return Er();if(!e)throw se.create("no-app",{appName:t});return e}function ye(t,e,n){var s;let r=(s=Ga[t])!==null&&s!==void 0?s:t;n&&(r+=`-${n}`);const i=r.match(/\s|\//),a=e.match(/\s|\//);if(i||a){const c=[`Unable to register library "${r}" with version "${e}":`];i&&c.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&a&&c.push("and"),a&&c.push(`version name "${e}" contains illegal characters (whitespace or "/")`),K.warn(c.join(" "));return}Re(new Ee(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
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
 */const Ja="firebase-heartbeat-database",Xa=1,xe="firebase-heartbeat-store";let At=null;function Tr(){return At||(At=fa(Ja,Xa,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(xe)}catch(n){console.warn(n)}}}}).catch(t=>{throw se.create("idb-open",{originalErrorMessage:t.message})})),At}async function Qa(t){try{const n=(await Tr()).transaction(xe),s=await n.objectStore(xe).get(wr(t));return await n.done,s}catch(e){if(e instanceof ae)K.warn(e.message);else{const n=se.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});K.warn(n.message)}}}async function In(t,e){try{const s=(await Tr()).transaction(xe,"readwrite");await s.objectStore(xe).put(e,wr(t)),await s.done}catch(n){if(n instanceof ae)K.warn(n.message);else{const s=se.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});K.warn(s.message)}}}function wr(t){return`${t.name}!${t.options.appId}`}/**
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
 */const Za=1024,eo=30*24*60*60*1e3;class to{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new ro(n),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var e,n;try{const r=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=kn();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(a=>a.date===i)?void 0:(this._heartbeatsCache.heartbeats.push({date:i,agent:r}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(a=>{const c=new Date(a.date).valueOf();return Date.now()-c<=eo}),this._storage.overwrite(this._heartbeatsCache))}catch(s){K.warn(s)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=kn(),{heartbeatsToSend:s,unsentEntries:r}=no(this._heartbeatsCache.heartbeats),i=mr(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=n,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(n){return K.warn(n),""}}}function kn(){return new Date().toISOString().substring(0,10)}function no(t,e=Za){const n=[];let s=t.slice();for(const r of t){const i=n.find(a=>a.agent===r.agent);if(i){if(i.dates.push(r.date),bn(n)>e){i.dates.pop();break}}else if(n.push({agent:r.agent,dates:[r.date]}),bn(n)>e){n.pop();break}s=s.slice(1)}return{heartbeatsToSend:n,unsentEntries:s}}class ro{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return ji()?Hi().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await Qa(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var n;if(await this._canUseIndexedDBPromise){const r=await this.read();return In(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var n;if(await this._canUseIndexedDBPromise){const r=await this.read();return In(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function bn(t){return mr(JSON.stringify({version:2,heartbeats:t})).length}/**
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
 */function so(t){Re(new Ee("platform-logger",e=>new ga(e),"PRIVATE")),Re(new Ee("heartbeat",e=>new to(e),"PRIVATE")),ye(Bt,vn,t),ye(Bt,vn,"esm2017"),ye("fire-js","")}so("");function Sr(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const io=Sr,Cr=new Ue("auth","Firebase",Sr());/**
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
 */const ot=new yr("@firebase/auth");function ao(t,...e){ot.logLevel<=T.WARN&&ot.warn(`Auth (${Fe}): ${t}`,...e)}function Qe(t,...e){ot.logLevel<=T.ERROR&&ot.error(`Auth (${Fe}): ${t}`,...e)}/**
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
 */function j(t,...e){throw Qt(t,...e)}function V(t,...e){return Qt(t,...e)}function Xt(t,e,n){const s=Object.assign(Object.assign({},io()),{[e]:n});return new Ue("auth","Firebase",s).create(e,{appName:t.name})}function he(t){return Xt(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function oo(t,e,n){const s=n;if(!(e instanceof s))throw s.name!==e.constructor.name&&j(t,"argument-error"),Xt(t,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Qt(t,...e){if(typeof t!="string"){const n=e[0],s=[...e.slice(1)];return s[0]&&(s[0].appName=t.name),t._errorFactory.create(n,...s)}return Cr.create(t,...e)}function v(t,e,...n){if(!t)throw Qt(e,...n)}function G(t){const e="INTERNAL ASSERTION FAILED: "+t;throw Qe(e),new Error(e)}function Y(t,e){t||G(e)}/**
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
 */function Ht(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.href)||""}function co(){return En()==="http:"||En()==="https:"}function En(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.protocol)||null}/**
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
 */function lo(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(co()||Fi()||"connection"in navigator)?navigator.onLine:!0}function uo(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
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
 */class Be{constructor(e,n){this.shortDelay=e,this.longDelay=n,Y(n>e,"Short delay should be less than long delay!"),this.isMobile=Ui()||Bi()}get(){return lo()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
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
 */function Zt(t,e){Y(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
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
 */class Ar{static initialize(e,n,s){this.fetchImpl=e,n&&(this.headersImpl=n),s&&(this.responseImpl=s)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;G("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;G("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;G("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
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
 */const ho={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
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
 */const fo=new Be(3e4,6e4);function en(t,e){return t.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:t.tenantId}):e}async function Se(t,e,n,s,r={}){return Dr(t,r,async()=>{let i={},a={};s&&(e==="GET"?a=s:i={body:JSON.stringify(s)});const c=Ve(Object.assign({key:t.config.apiKey},a)).slice(1),o=await t._getAdditionalHeaders();o["Content-Type"]="application/json",t.languageCode&&(o["X-Firebase-Locale"]=t.languageCode);const l=Object.assign({method:e,headers:o},i);return Vi()||(l.referrerPolicy="no-referrer"),Ar.fetch()(Nr(t,t.config.apiHost,n,c),l)})}async function Dr(t,e,n){t._canInitEmulator=!1;const s=Object.assign(Object.assign({},ho),e);try{const r=new mo(t),i=await Promise.race([n(),r.promise]);r.clearNetworkTimeout();const a=await i.json();if("needConfirmation"in a)throw Ge(t,"account-exists-with-different-credential",a);if(i.ok&&!("errorMessage"in a))return a;{const c=i.ok?a.errorMessage:a.error.message,[o,l]=c.split(" : ");if(o==="FEDERATED_USER_ID_ALREADY_LINKED")throw Ge(t,"credential-already-in-use",a);if(o==="EMAIL_EXISTS")throw Ge(t,"email-already-in-use",a);if(o==="USER_DISABLED")throw Ge(t,"user-disabled",a);const d=s[o]||o.toLowerCase().replace(/[_\s]+/g,"-");if(l)throw Xt(t,d,l);j(t,d)}}catch(r){if(r instanceof ae)throw r;j(t,"network-request-failed",{message:String(r)})}}async function po(t,e,n,s,r={}){const i=await Se(t,e,n,s,r);return"mfaPendingCredential"in i&&j(t,"multi-factor-auth-required",{_serverResponse:i}),i}function Nr(t,e,n,s){const r=`${e}${n}?${s}`;return t.config.emulator?Zt(t.config,r):`${t.config.apiScheme}://${r}`}class mo{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,s)=>{this.timer=setTimeout(()=>s(V(this.auth,"network-request-failed")),fo.get())})}}function Ge(t,e,n){const s={appName:t.name};n.email&&(s.email=n.email),n.phoneNumber&&(s.phoneNumber=n.phoneNumber);const r=V(t,e,s);return r.customData._tokenResponse=n,r}/**
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
 */async function go(t,e){return Se(t,"POST","/v1/accounts:delete",e)}async function Or(t,e){return Se(t,"POST","/v1/accounts:lookup",e)}/**
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
 */function Pe(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function _o(t,e=!1){const n=oe(t),s=await n.getIdToken(e),r=tn(s);v(r&&r.exp&&r.auth_time&&r.iat,n.auth,"internal-error");const i=typeof r.firebase=="object"?r.firebase:void 0,a=i==null?void 0:i.sign_in_provider;return{claims:r,token:s,authTime:Pe(Dt(r.auth_time)),issuedAtTime:Pe(Dt(r.iat)),expirationTime:Pe(Dt(r.exp)),signInProvider:a||null,signInSecondFactor:(i==null?void 0:i.sign_in_second_factor)||null}}function Dt(t){return Number(t)*1e3}function tn(t){const[e,n,s]=t.split(".");if(e===void 0||n===void 0||s===void 0)return Qe("JWT malformed, contained fewer than 3 sections"),null;try{const r=gr(n);return r?JSON.parse(r):(Qe("Failed to decode base64 JWT payload"),null)}catch(r){return Qe("Caught error parsing JWT payload as JSON",r==null?void 0:r.toString()),null}}function Tn(t){const e=tn(t);return v(e,"internal-error"),v(typeof e.exp<"u","internal-error"),v(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
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
 */async function Le(t,e,n=!1){if(n)return e;try{return await e}catch(s){throw s instanceof ae&&vo(s)&&t.auth.currentUser===t&&await t.auth.signOut(),s}}function vo({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
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
 */class yo{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var n;if(e){const s=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),s}else{this.errorBackoff=3e4;const r=((n=this.user.stsTokenManager.expirationTime)!==null&&n!==void 0?n:0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
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
 */class Wt{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=Pe(this.lastLoginAt),this.creationTime=Pe(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function ct(t){var e;const n=t.auth,s=await t.getIdToken(),r=await Le(t,Or(n,{idToken:s}));v(r==null?void 0:r.users.length,n,"internal-error");const i=r.users[0];t._notifyReloadListener(i);const a=!((e=i.providerUserInfo)===null||e===void 0)&&e.length?Pr(i.providerUserInfo):[],c=ko(t.providerData,a),o=t.isAnonymous,l=!(t.email&&i.passwordHash)&&!(c!=null&&c.length),d=o?l:!1,f={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:c,metadata:new Wt(i.createdAt,i.lastLoginAt),isAnonymous:d};Object.assign(t,f)}async function Io(t){const e=oe(t);await ct(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function ko(t,e){return[...t.filter(s=>!e.some(r=>r.providerId===s.providerId)),...e]}function Pr(t){return t.map(e=>{var{providerId:n}=e,s=zt(e,["providerId"]);return{providerId:n,uid:s.rawId||"",displayName:s.displayName||null,email:s.email||null,phoneNumber:s.phoneNumber||null,photoURL:s.photoUrl||null}})}/**
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
 */async function bo(t,e){const n=await Dr(t,{},async()=>{const s=Ve({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:r,apiKey:i}=t.config,a=Nr(t,r,"/v1/token",`key=${i}`),c=await t._getAdditionalHeaders();return c["Content-Type"]="application/x-www-form-urlencoded",Ar.fetch()(a,{method:"POST",headers:c,body:s})});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function Eo(t,e){return Se(t,"POST","/v2/accounts:revokeToken",en(t,e))}/**
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
 */class Ie{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){v(e.idToken,"internal-error"),v(typeof e.idToken<"u","internal-error"),v(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Tn(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){v(e.length!==0,"internal-error");const n=Tn(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(v(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:s,refreshToken:r,expiresIn:i}=await bo(e,n);this.updateTokensAndExpiration(s,r,Number(i))}updateTokensAndExpiration(e,n,s){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+s*1e3}static fromJSON(e,n){const{refreshToken:s,accessToken:r,expirationTime:i}=n,a=new Ie;return s&&(v(typeof s=="string","internal-error",{appName:e}),a.refreshToken=s),r&&(v(typeof r=="string","internal-error",{appName:e}),a.accessToken=r),i&&(v(typeof i=="number","internal-error",{appName:e}),a.expirationTime=i),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Ie,this.toJSON())}_performRefresh(){return G("not implemented")}}/**
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
 */function Z(t,e){v(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class z{constructor(e){var{uid:n,auth:s,stsTokenManager:r}=e,i=zt(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new yo(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=n,this.auth=s,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new Wt(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const n=await Le(this,this.stsTokenManager.getToken(this.auth,e));return v(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return _o(this,e)}reload(){return Io(this)}_assign(e){this!==e&&(v(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>Object.assign({},n)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new z(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return n.metadata._copy(this.metadata),n}_onReload(e){v(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let s=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),s=!0),n&&await ct(this),await this.auth._persistUserIfCurrent(this),s&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(W(this.auth.app))return Promise.reject(he(this.auth));const e=await this.getIdToken();return await Le(this,go(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){var s,r,i,a,c,o,l,d;const f=(s=n.displayName)!==null&&s!==void 0?s:void 0,b=(r=n.email)!==null&&r!==void 0?r:void 0,g=(i=n.phoneNumber)!==null&&i!==void 0?i:void 0,p=(a=n.photoURL)!==null&&a!==void 0?a:void 0,y=(c=n.tenantId)!==null&&c!==void 0?c:void 0,S=(o=n._redirectEventId)!==null&&o!==void 0?o:void 0,E=(l=n.createdAt)!==null&&l!==void 0?l:void 0,m=(d=n.lastLoginAt)!==null&&d!==void 0?d:void 0,{uid:O,emailVerified:L,isAnonymous:x,providerData:F,stsTokenManager:X}=n;v(O&&X,e,"internal-error");const ce=Ie.fromJSON(this.name,X);v(typeof O=="string",e,"internal-error"),Z(f,e.name),Z(b,e.name),v(typeof L=="boolean",e,"internal-error"),v(typeof x=="boolean",e,"internal-error"),Z(g,e.name),Z(p,e.name),Z(y,e.name),Z(S,e.name),Z(E,e.name),Z(m,e.name);const k=new z({uid:O,auth:e,email:b,emailVerified:L,displayName:f,isAnonymous:x,photoURL:p,phoneNumber:g,tenantId:y,stsTokenManager:ce,createdAt:E,lastLoginAt:m});return F&&Array.isArray(F)&&(k.providerData=F.map(P=>Object.assign({},P))),S&&(k._redirectEventId=S),k}static async _fromIdTokenResponse(e,n,s=!1){const r=new Ie;r.updateFromServerResponse(n);const i=new z({uid:n.localId,auth:e,stsTokenManager:r,isAnonymous:s});return await ct(i),i}static async _fromGetAccountInfoResponse(e,n,s){const r=n.users[0];v(r.localId!==void 0,"internal-error");const i=r.providerUserInfo!==void 0?Pr(r.providerUserInfo):[],a=!(r.email&&r.passwordHash)&&!(i!=null&&i.length),c=new Ie;c.updateFromIdToken(s);const o=new z({uid:r.localId,auth:e,stsTokenManager:c,isAnonymous:a}),l={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:i,metadata:new Wt(r.createdAt,r.lastLoginAt),isAnonymous:!(r.email&&r.passwordHash)&&!(i!=null&&i.length)};return Object.assign(o,l),o}}/**
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
 */const wn=new Map;function q(t){Y(t instanceof Function,"Expected a class definition");let e=wn.get(t);return e?(Y(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,wn.set(t,e),e)}/**
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
 */class Rr{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}Rr.type="NONE";const Sn=Rr;/**
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
 */function Ze(t,e,n){return`firebase:${t}:${e}:${n}`}class ke{constructor(e,n,s){this.persistence=e,this.auth=n,this.userKey=s;const{config:r,name:i}=this.auth;this.fullUserKey=Ze(this.userKey,r.apiKey,i),this.fullPersistenceKey=Ze("persistence",r.apiKey,i),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?z._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,s="authUser"){if(!n.length)return new ke(q(Sn),e,s);const r=(await Promise.all(n.map(async l=>{if(await l._isAvailable())return l}))).filter(l=>l);let i=r[0]||q(Sn);const a=Ze(s,e.config.apiKey,e.name);let c=null;for(const l of n)try{const d=await l._get(a);if(d){const f=z._fromJSON(e,d);l!==i&&(c=f),i=l;break}}catch{}const o=r.filter(l=>l._shouldAllowMigration);return!i._shouldAllowMigration||!o.length?new ke(i,e,s):(i=o[0],c&&await i._set(a,c.toJSON()),await Promise.all(n.map(async l=>{if(l!==i)try{await l._remove(a)}catch{}})),new ke(i,e,s))}}/**
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
 */function Cn(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Ur(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(xr(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Fr(e))return"Blackberry";if(Br(e))return"Webos";if(Lr(e))return"Safari";if((e.includes("chrome/")||Mr(e))&&!e.includes("edge/"))return"Chrome";if(Vr(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,s=t.match(n);if((s==null?void 0:s.length)===2)return s[1]}return"Other"}function xr(t=R()){return/firefox\//i.test(t)}function Lr(t=R()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Mr(t=R()){return/crios\//i.test(t)}function Ur(t=R()){return/iemobile/i.test(t)}function Vr(t=R()){return/android/i.test(t)}function Fr(t=R()){return/blackberry/i.test(t)}function Br(t=R()){return/webos/i.test(t)}function nn(t=R()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function To(t=R()){var e;return nn(t)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function wo(){return $i()&&document.documentMode===10}function $r(t=R()){return nn(t)||Vr(t)||Br(t)||Fr(t)||/windows phone/i.test(t)||Ur(t)}/**
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
 */function jr(t,e=[]){let n;switch(t){case"Browser":n=Cn(R());break;case"Worker":n=`${Cn(R())}-${t}`;break;default:n=t}const s=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${Fe}/${s}`}/**
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
 */class So{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const s=i=>new Promise((a,c)=>{try{const o=e(i);a(o)}catch(o){c(o)}});s.onAbort=n,this.queue.push(s);const r=this.queue.length-1;return()=>{this.queue[r]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const s of this.queue)await s(e),s.onAbort&&n.push(s.onAbort)}catch(s){n.reverse();for(const r of n)try{r()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:s==null?void 0:s.message})}}}/**
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
 */async function Co(t,e={}){return Se(t,"GET","/v2/passwordPolicy",en(t,e))}/**
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
 */const Ao=6;class Do{constructor(e){var n,s,r,i;const a=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(n=a.minPasswordLength)!==null&&n!==void 0?n:Ao,a.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=a.maxPasswordLength),a.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=a.containsLowercaseCharacter),a.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=a.containsUppercaseCharacter),a.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=a.containsNumericCharacter),a.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=a.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(r=(s=e.allowedNonAlphanumericCharacters)===null||s===void 0?void 0:s.join(""))!==null&&r!==void 0?r:"",this.forceUpgradeOnSignin=(i=e.forceUpgradeOnSignin)!==null&&i!==void 0?i:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var n,s,r,i,a,c;const o={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,o),this.validatePasswordCharacterOptions(e,o),o.isValid&&(o.isValid=(n=o.meetsMinPasswordLength)!==null&&n!==void 0?n:!0),o.isValid&&(o.isValid=(s=o.meetsMaxPasswordLength)!==null&&s!==void 0?s:!0),o.isValid&&(o.isValid=(r=o.containsLowercaseLetter)!==null&&r!==void 0?r:!0),o.isValid&&(o.isValid=(i=o.containsUppercaseLetter)!==null&&i!==void 0?i:!0),o.isValid&&(o.isValid=(a=o.containsNumericCharacter)!==null&&a!==void 0?a:!0),o.isValid&&(o.isValid=(c=o.containsNonAlphanumericCharacter)!==null&&c!==void 0?c:!0),o}validatePasswordLengthOptions(e,n){const s=this.customStrengthOptions.minPasswordLength,r=this.customStrengthOptions.maxPasswordLength;s&&(n.meetsMinPasswordLength=e.length>=s),r&&(n.meetsMaxPasswordLength=e.length<=r)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let s;for(let r=0;r<e.length;r++)s=e.charAt(r),this.updatePasswordCharacterOptionsStatuses(n,s>="a"&&s<="z",s>="A"&&s<="Z",s>="0"&&s<="9",this.allowedNonAlphanumericCharacters.includes(s))}updatePasswordCharacterOptionsStatuses(e,n,s,r,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=s)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=r)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}/**
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
 */class No{constructor(e,n,s,r){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=s,this.config=r,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new An(this),this.idTokenSubscription=new An(this),this.beforeStateQueue=new So(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Cr,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=r.sdkClientVersion}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=q(n)),this._initializationPromise=this.queue(async()=>{var s,r;if(!this._deleted&&(this.persistenceManager=await ke.create(this,e),!this._deleted)){if(!((s=this._popupRedirectResolver)===null||s===void 0)&&s._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((r=this.currentUser)===null||r===void 0?void 0:r.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await Or(this,{idToken:e}),s=await z._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(s)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var n;if(W(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(c=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(c,c))}):this.directlySetCurrentUser(null)}const s=await this.assertedPersistence.getCurrentUser();let r=s,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId,c=r==null?void 0:r._redirectEventId,o=await this.tryRedirectSignIn(e);(!a||a===c)&&(o!=null&&o.user)&&(r=o.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(r)}catch(a){r=s,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return v(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await ct(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=uo()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(W(this.app))return Promise.reject(he(this));const n=e?oe(e):null;return n&&v(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&v(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return W(this.app)?Promise.reject(he(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return W(this.app)?Promise.reject(he(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(q(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await Co(this),n=new Do(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new Ue("auth","Firebase",e())}onAuthStateChanged(e,n,s){return this.registerStateListener(this.authStateSubscription,e,n,s)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,s){return this.registerStateListener(this.idTokenSubscription,e,n,s)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const s=this.onAuthStateChanged(()=>{s(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),s={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(s.tenantId=this.tenantId),await Eo(this,s)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,n){const s=await this.getOrInitRedirectPersistenceManager(n);return e===null?s.removeCurrentUser():s.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&q(e)||this._popupRedirectResolver;v(n,this,"argument-error"),this.redirectPersistenceManager=await ke.create(this,[q(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,s;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)===null||n===void 0?void 0:n._redirectEventId)===e?this._currentUser:((s=this.redirectUser)===null||s===void 0?void 0:s._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const s=(n=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&n!==void 0?n:null;this.lastNotifiedUid!==s&&(this.lastNotifiedUid=s,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,s,r){if(this._deleted)return()=>{};const i=typeof n=="function"?n:n.next.bind(n);let a=!1;const c=this._isInitialized?Promise.resolve():this._initializationPromise;if(v(c,this,"internal-error"),c.then(()=>{a||i(this.currentUser)}),typeof n=="function"){const o=e.addObserver(n,s,r);return()=>{a=!0,o()}}else{const o=e.addObserver(n);return()=>{a=!0,o()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return v(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=jr(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const n={"X-Client-Version":this.clientVersion};this.app.options.appId&&(n["X-Firebase-gmpid"]=this.app.options.appId);const s=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());s&&(n["X-Firebase-Client"]=s);const r=await this._getAppCheckToken();return r&&(n["X-Firebase-AppCheck"]=r),n}async _getAppCheckToken(){var e;const n=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return n!=null&&n.error&&ao(`Error while retrieving App Check token: ${n.error}`),n==null?void 0:n.token}}function mt(t){return oe(t)}class An{constructor(e){this.auth=e,this.observer=null,this.addObserver=Ki(n=>this.observer=n)}get next(){return v(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
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
 */let rn={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Oo(t){rn=t}function Po(t){return rn.loadJS(t)}function Ro(){return rn.gapiScript}function xo(t){return`__${t}${Math.floor(Math.random()*1e6)}`}/**
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
 */function Lo(t,e){const n=br(t,"auth");if(n.isInitialized()){const r=n.getImmediate(),i=n.getOptions();if(it(i,e??{}))return r;j(r,"already-initialized")}return n.initialize({options:e})}function Mo(t,e){const n=(e==null?void 0:e.persistence)||[],s=(Array.isArray(n)?n:[n]).map(q);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(s,e==null?void 0:e.popupRedirectResolver)}function Uo(t,e,n){const s=mt(t);v(s._canInitEmulator,s,"emulator-config-failed"),v(/^https?:\/\//.test(e),s,"invalid-emulator-scheme");const r=!1,i=Hr(e),{host:a,port:c}=Vo(e),o=c===null?"":`:${c}`;s.config.emulator={url:`${i}//${a}${o}/`},s.settings.appVerificationDisabledForTesting=!0,s.emulatorConfig=Object.freeze({host:a,port:c,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:r})}),Fo()}function Hr(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function Vo(t){const e=Hr(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const s=n[2].split("@").pop()||"",r=/^(\[[^\]]+\])(:|$)/.exec(s);if(r){const i=r[1];return{host:i,port:Dn(s.substr(i.length+1))}}else{const[i,a]=s.split(":");return{host:i,port:Dn(a)}}}function Dn(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function Fo(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
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
 */class Wr{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return G("not implemented")}_getIdTokenResponse(e){return G("not implemented")}_linkToIdToken(e,n){return G("not implemented")}_getReauthenticationResolver(e){return G("not implemented")}}/**
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
 */async function be(t,e){return po(t,"POST","/v1/accounts:signInWithIdp",en(t,e))}/**
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
 */const Bo="http://localhost";class pe extends Wr{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new pe(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):j("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:s,signInMethod:r}=n,i=zt(n,["providerId","signInMethod"]);if(!s||!r)return null;const a=new pe(s,r);return a.idToken=i.idToken||void 0,a.accessToken=i.accessToken||void 0,a.secret=i.secret,a.nonce=i.nonce,a.pendingToken=i.pendingToken||null,a}_getIdTokenResponse(e){const n=this.buildRequest();return be(e,n)}_linkToIdToken(e,n){const s=this.buildRequest();return s.idToken=n,be(e,s)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,be(e,n)}buildRequest(){const e={requestUri:Bo,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=Ve(n)}return e}}/**
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
 */class sn{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class $e extends sn{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
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
 */class ee extends $e{constructor(){super("facebook.com")}static credential(e){return pe._fromParams({providerId:ee.PROVIDER_ID,signInMethod:ee.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return ee.credentialFromTaggedObject(e)}static credentialFromError(e){return ee.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return ee.credential(e.oauthAccessToken)}catch{return null}}}ee.FACEBOOK_SIGN_IN_METHOD="facebook.com";ee.PROVIDER_ID="facebook.com";/**
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
 */class H extends $e{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return pe._fromParams({providerId:H.PROVIDER_ID,signInMethod:H.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return H.credentialFromTaggedObject(e)}static credentialFromError(e){return H.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:s}=e;if(!n&&!s)return null;try{return H.credential(n,s)}catch{return null}}}H.GOOGLE_SIGN_IN_METHOD="google.com";H.PROVIDER_ID="google.com";/**
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
 */class te extends $e{constructor(){super("github.com")}static credential(e){return pe._fromParams({providerId:te.PROVIDER_ID,signInMethod:te.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return te.credentialFromTaggedObject(e)}static credentialFromError(e){return te.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return te.credential(e.oauthAccessToken)}catch{return null}}}te.GITHUB_SIGN_IN_METHOD="github.com";te.PROVIDER_ID="github.com";/**
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
 */class ne extends $e{constructor(){super("twitter.com")}static credential(e,n){return pe._fromParams({providerId:ne.PROVIDER_ID,signInMethod:ne.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return ne.credentialFromTaggedObject(e)}static credentialFromError(e){return ne.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:s}=e;if(!n||!s)return null;try{return ne.credential(n,s)}catch{return null}}}ne.TWITTER_SIGN_IN_METHOD="twitter.com";ne.PROVIDER_ID="twitter.com";/**
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
 */class Te{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,s,r=!1){const i=await z._fromIdTokenResponse(e,s,r),a=Nn(s);return new Te({user:i,providerId:a,_tokenResponse:s,operationType:n})}static async _forOperation(e,n,s){await e._updateTokensIfNecessary(s,!0);const r=Nn(s);return new Te({user:e,providerId:r,_tokenResponse:s,operationType:n})}}function Nn(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
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
 */class lt extends ae{constructor(e,n,s,r){var i;super(n.code,n.message),this.operationType=s,this.user=r,Object.setPrototypeOf(this,lt.prototype),this.customData={appName:e.name,tenantId:(i=e.tenantId)!==null&&i!==void 0?i:void 0,_serverResponse:n.customData._serverResponse,operationType:s}}static _fromErrorAndOperation(e,n,s,r){return new lt(e,n,s,r)}}function Gr(t,e,n,s){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?lt._fromErrorAndOperation(t,i,e,s):i})}async function $o(t,e,n=!1){const s=await Le(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return Te._forOperation(t,"link",s)}/**
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
 */async function jo(t,e,n=!1){const{auth:s}=t;if(W(s.app))return Promise.reject(he(s));const r="reauthenticate";try{const i=await Le(t,Gr(s,r,e,t),n);v(i.idToken,s,"internal-error");const a=tn(i.idToken);v(a,s,"internal-error");const{sub:c}=a;return v(t.uid===c,s,"user-mismatch"),Te._forOperation(t,r,i)}catch(i){throw(i==null?void 0:i.code)==="auth/user-not-found"&&j(s,"user-mismatch"),i}}/**
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
 */async function Ho(t,e,n=!1){if(W(t.app))return Promise.reject(he(t));const s="signIn",r=await Gr(t,s,e),i=await Te._fromIdTokenResponse(t,s,r);return n||await t._updateCurrentUser(i.user),i}/**
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
 */function Wo(t,e){return oe(t).setPersistence(e)}function zr(t,e,n,s){return oe(t).onIdTokenChanged(e,n,s)}function Go(t,e,n){return oe(t).beforeAuthStateChanged(e,n)}function zo(t,e,n,s){return oe(t).onAuthStateChanged(e,n,s)}const ut="__sak";/**
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
 */class qr{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(ut,"1"),this.storage.removeItem(ut),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
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
 */const qo=1e3,Ko=10;class Kr extends qr{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=$r(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const s=this.storage.getItem(n),r=this.localCache[n];s!==r&&e(n,r,s)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((a,c,o)=>{this.notifyListeners(a,o)});return}const s=e.key;n?this.detachListener():this.stopPolling();const r=()=>{const a=this.storage.getItem(s);!n&&this.localCache[s]===a||this.notifyListeners(s,a)},i=this.storage.getItem(s);wo()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(r,Ko):r()}notifyListeners(e,n){this.localCache[e]=n;const s=this.listeners[e];if(s)for(const r of Array.from(s))r(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,s)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:s}),!0)})},qo)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}Kr.type="LOCAL";const Yr=Kr;/**
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
 */class Jr extends qr{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}Jr.type="SESSION";const Xr=Jr;/**
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
 */function Yo(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
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
 */class gt{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(r=>r.isListeningto(e));if(n)return n;const s=new gt(e);return this.receivers.push(s),s}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:s,eventType:r,data:i}=n.data,a=this.handlersMap[r];if(!(a!=null&&a.size))return;n.ports[0].postMessage({status:"ack",eventId:s,eventType:r});const c=Array.from(a).map(async l=>l(n.origin,i)),o=await Yo(c);n.ports[0].postMessage({status:"done",eventId:s,eventType:r,response:o})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}gt.receivers=[];/**
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
 */function an(t="",e=10){let n="";for(let s=0;s<e;s++)n+=Math.floor(Math.random()*10);return t+n}/**
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
 */class Jo{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,s=50){const r=typeof MessageChannel<"u"?new MessageChannel:null;if(!r)throw new Error("connection_unavailable");let i,a;return new Promise((c,o)=>{const l=an("",20);r.port1.start();const d=setTimeout(()=>{o(new Error("unsupported_event"))},s);a={messageChannel:r,onMessage(f){const b=f;if(b.data.eventId===l)switch(b.data.status){case"ack":clearTimeout(d),i=setTimeout(()=>{o(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),c(b.data.response);break;default:clearTimeout(d),clearTimeout(i),o(new Error("invalid_response"));break}}},this.handlers.add(a),r.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:l,data:n},[r.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
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
 */function B(){return window}function Xo(t){B().location.href=t}/**
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
 */function Qr(){return typeof B().WorkerGlobalScope<"u"&&typeof B().importScripts=="function"}async function Qo(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function Zo(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)===null||t===void 0?void 0:t.controller)||null}function ec(){return Qr()?self:null}/**
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
 */const Zr="firebaseLocalStorageDb",tc=1,dt="firebaseLocalStorage",es="fbase_key";class je{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function _t(t,e){return t.transaction([dt],e?"readwrite":"readonly").objectStore(dt)}function nc(){const t=indexedDB.deleteDatabase(Zr);return new je(t).toPromise()}function Gt(){const t=indexedDB.open(Zr,tc);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const s=t.result;try{s.createObjectStore(dt,{keyPath:es})}catch(r){n(r)}}),t.addEventListener("success",async()=>{const s=t.result;s.objectStoreNames.contains(dt)?e(s):(s.close(),await nc(),e(await Gt()))})})}async function On(t,e,n){const s=_t(t,!0).put({[es]:e,value:n});return new je(s).toPromise()}async function rc(t,e){const n=_t(t,!1).get(e),s=await new je(n).toPromise();return s===void 0?null:s.value}function Pn(t,e){const n=_t(t,!0).delete(e);return new je(n).toPromise()}const sc=800,ic=3;class ts{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Gt(),this.db)}async _withRetries(e){let n=0;for(;;)try{const s=await this._openDb();return await e(s)}catch(s){if(n++>ic)throw s;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Qr()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=gt._getInstance(ec()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var e,n;if(this.activeServiceWorker=await Qo(),!this.activeServiceWorker)return;this.sender=new Jo(this.activeServiceWorker);const s=await this.sender._send("ping",{},800);s&&!((e=s[0])===null||e===void 0)&&e.fulfilled&&!((n=s[0])===null||n===void 0)&&n.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||Zo()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Gt();return await On(e,ut,"1"),await Pn(e,ut),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(s=>On(s,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(s=>rc(s,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>Pn(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(r=>{const i=_t(r,!1).getAll();return new je(i).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],s=new Set;if(e.length!==0)for(const{fbase_key:r,value:i}of e)s.add(r),JSON.stringify(this.localCache[r])!==JSON.stringify(i)&&(this.notifyListeners(r,i),n.push(r));for(const r of Object.keys(this.localCache))this.localCache[r]&&!s.has(r)&&(this.notifyListeners(r,null),n.push(r));return n}notifyListeners(e,n){this.localCache[e]=n;const s=this.listeners[e];if(s)for(const r of Array.from(s))r(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),sc)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}ts.type="LOCAL";const ac=ts;new Be(3e4,6e4);/**
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
 */function ns(t,e){return e?q(e):(v(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
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
 */class on extends Wr{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return be(e,this._buildIdpRequest())}_linkToIdToken(e,n){return be(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return be(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function oc(t){return Ho(t.auth,new on(t),t.bypassAuthState)}function cc(t){const{auth:e,user:n}=t;return v(n,e,"internal-error"),jo(n,new on(t),t.bypassAuthState)}async function lc(t){const{auth:e,user:n}=t;return v(n,e,"internal-error"),$o(n,new on(t),t.bypassAuthState)}/**
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
 */class rs{constructor(e,n,s,r,i=!1){this.auth=e,this.resolver=s,this.user=r,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(s){this.reject(s)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:s,postBody:r,tenantId:i,error:a,type:c}=e;if(a){this.reject(a);return}const o={auth:this.auth,requestUri:n,sessionId:s,tenantId:i||void 0,postBody:r||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(c)(o))}catch(l){this.reject(l)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return oc;case"linkViaPopup":case"linkViaRedirect":return lc;case"reauthViaPopup":case"reauthViaRedirect":return cc;default:j(this.auth,"internal-error")}}resolve(e){Y(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Y(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
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
 */const uc=new Be(2e3,1e4);async function dc(t,e,n){if(W(t.app))return Promise.reject(V(t,"operation-not-supported-in-this-environment"));const s=mt(t);oo(t,e,sn);const r=ns(s,n);return new ue(s,"signInViaPopup",e,r).executeNotNull()}class ue extends rs{constructor(e,n,s,r,i){super(e,n,r,i),this.provider=s,this.authWindow=null,this.pollId=null,ue.currentPopupAction&&ue.currentPopupAction.cancel(),ue.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return v(e,this.auth,"internal-error"),e}async onExecution(){Y(this.filter.length===1,"Popup operations only handle one event");const e=an();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(V(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(V(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,ue.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,s;if(!((s=(n=this.authWindow)===null||n===void 0?void 0:n.window)===null||s===void 0)&&s.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(V(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,uc.get())};e()}}ue.currentPopupAction=null;/**
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
 */const hc="pendingRedirect",et=new Map;class fc extends rs{constructor(e,n,s=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,s),this.eventId=null}async execute(){let e=et.get(this.auth._key());if(!e){try{const s=await pc(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(s)}catch(n){e=()=>Promise.reject(n)}et.set(this.auth._key(),e)}return this.bypassAuthState||et.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function pc(t,e){const n=_c(e),s=gc(t);if(!await s._isAvailable())return!1;const r=await s._get(n)==="true";return await s._remove(n),r}function mc(t,e){et.set(t._key(),e)}function gc(t){return q(t._redirectPersistence)}function _c(t){return Ze(hc,t.config.apiKey,t.name)}async function vc(t,e,n=!1){if(W(t.app))return Promise.reject(he(t));const s=mt(t),r=ns(s,e),a=await new fc(s,r,n).execute();return a&&!n&&(delete a.user._redirectEventId,await s._persistUserIfCurrent(a.user),await s._setRedirectUser(null,e)),a}/**
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
 */const yc=10*60*1e3;class Ic{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(s=>{this.isEventForConsumer(e,s)&&(n=!0,this.sendToConsumer(e,s),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!kc(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var s;if(e.error&&!ss(e)){const r=((s=e.error.code)===null||s===void 0?void 0:s.split("auth/")[1])||"internal-error";n.onError(V(this.auth,r))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const s=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&s}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=yc&&this.cachedEventUids.clear(),this.cachedEventUids.has(Rn(e))}saveEventToCache(e){this.cachedEventUids.add(Rn(e)),this.lastProcessedEventTime=Date.now()}}function Rn(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function ss({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function kc(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return ss(t);default:return!1}}/**
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
 */async function bc(t,e={}){return Se(t,"GET","/v1/projects",e)}/**
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
 */const Ec=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Tc=/^https?/;async function wc(t){if(t.config.emulator)return;const{authorizedDomains:e}=await bc(t);for(const n of e)try{if(Sc(n))return}catch{}j(t,"unauthorized-domain")}function Sc(t){const e=Ht(),{protocol:n,hostname:s}=new URL(e);if(t.startsWith("chrome-extension://")){const a=new URL(t);return a.hostname===""&&s===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&a.hostname===s}if(!Tc.test(n))return!1;if(Ec.test(t))return s===t;const r=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+r+"|"+r+")$","i").test(s)}/**
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
 */const Cc=new Be(3e4,6e4);function xn(){const t=B().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function Ac(t){return new Promise((e,n)=>{var s,r,i;function a(){xn(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{xn(),n(V(t,"network-request-failed"))},timeout:Cc.get()})}if(!((r=(s=B().gapi)===null||s===void 0?void 0:s.iframes)===null||r===void 0)&&r.Iframe)e(gapi.iframes.getContext());else if(!((i=B().gapi)===null||i===void 0)&&i.load)a();else{const c=xo("iframefcb");return B()[c]=()=>{gapi.load?a():n(V(t,"network-request-failed"))},Po(`${Ro()}?onload=${c}`).catch(o=>n(o))}}).catch(e=>{throw tt=null,e})}let tt=null;function Dc(t){return tt=tt||Ac(t),tt}/**
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
 */const Nc=new Be(5e3,15e3),Oc="__/auth/iframe",Pc="emulator/auth/iframe",Rc={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},xc=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Lc(t){const e=t.config;v(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?Zt(e,Pc):`https://${t.config.authDomain}/${Oc}`,s={apiKey:e.apiKey,appName:t.name,v:Fe},r=xc.get(t.config.apiHost);r&&(s.eid=r);const i=t._getFrameworks();return i.length&&(s.fw=i.join(",")),`${n}?${Ve(s).slice(1)}`}async function Mc(t){const e=await Dc(t),n=B().gapi;return v(n,t,"internal-error"),e.open({where:document.body,url:Lc(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Rc,dontclear:!0},s=>new Promise(async(r,i)=>{await s.restyle({setHideOnLeave:!1});const a=V(t,"network-request-failed"),c=B().setTimeout(()=>{i(a)},Nc.get());function o(){B().clearTimeout(c),r(s)}s.ping(o).then(o,()=>{i(a)})}))}/**
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
 */const Uc={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Vc=500,Fc=600,Bc="_blank",$c="http://localhost";class Ln{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function jc(t,e,n,s=Vc,r=Fc){const i=Math.max((window.screen.availHeight-r)/2,0).toString(),a=Math.max((window.screen.availWidth-s)/2,0).toString();let c="";const o=Object.assign(Object.assign({},Uc),{width:s.toString(),height:r.toString(),top:i,left:a}),l=R().toLowerCase();n&&(c=Mr(l)?Bc:n),xr(l)&&(e=e||$c,o.scrollbars="yes");const d=Object.entries(o).reduce((b,[g,p])=>`${b}${g}=${p},`,"");if(To(l)&&c!=="_self")return Hc(e||"",c),new Ln(null);const f=window.open(e||"",c,d);v(f,t,"popup-blocked");try{f.focus()}catch{}return new Ln(f)}function Hc(t,e){const n=document.createElement("a");n.href=t,n.target=e;const s=document.createEvent("MouseEvent");s.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(s)}/**
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
 */const Wc="__/auth/handler",Gc="emulator/auth/handler",zc=encodeURIComponent("fac");async function Mn(t,e,n,s,r,i){v(t.config.authDomain,t,"auth-domain-config-required"),v(t.config.apiKey,t,"invalid-api-key");const a={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:s,v:Fe,eventId:r};if(e instanceof sn){e.setDefaultLanguage(t.languageCode),a.providerId=e.providerId||"",qi(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[d,f]of Object.entries({}))a[d]=f}if(e instanceof $e){const d=e.getScopes().filter(f=>f!=="");d.length>0&&(a.scopes=d.join(","))}t.tenantId&&(a.tid=t.tenantId);const c=a;for(const d of Object.keys(c))c[d]===void 0&&delete c[d];const o=await t._getAppCheckToken(),l=o?`#${zc}=${encodeURIComponent(o)}`:"";return`${qc(t)}?${Ve(c).slice(1)}${l}`}function qc({config:t}){return t.emulator?Zt(t,Gc):`https://${t.authDomain}/${Wc}`}/**
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
 */const Nt="webStorageSupport";class Kc{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Xr,this._completeRedirectFn=vc,this._overrideRedirectResult=mc}async _openPopup(e,n,s,r){var i;Y((i=this.eventManagers[e._key()])===null||i===void 0?void 0:i.manager,"_initialize() not called before _openPopup()");const a=await Mn(e,n,s,Ht(),r);return jc(e,a,an())}async _openRedirect(e,n,s,r){await this._originValidation(e);const i=await Mn(e,n,s,Ht(),r);return Xo(i),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:r,promise:i}=this.eventManagers[n];return r?Promise.resolve(r):(Y(i,"If manager is not set, promise should be"),i)}const s=this.initAndGetManager(e);return this.eventManagers[n]={promise:s},s.catch(()=>{delete this.eventManagers[n]}),s}async initAndGetManager(e){const n=await Mc(e),s=new Ic(e);return n.register("authEvent",r=>(v(r==null?void 0:r.authEvent,e,"invalid-auth-event"),{status:s.onEvent(r.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:s},this.iframes[e._key()]=n,s}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(Nt,{type:Nt},r=>{var i;const a=(i=r==null?void 0:r[0])===null||i===void 0?void 0:i[Nt];a!==void 0&&n(!!a),j(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=wc(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return $r()||Lr()||nn()}}const Yc=Kc;var Un="@firebase/auth",Vn="1.8.1";/**
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
 */class Jc{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(s=>{e((s==null?void 0:s.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){v(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
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
 */function Xc(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Qc(t){Re(new Ee("auth",(e,{options:n})=>{const s=e.getProvider("app").getImmediate(),r=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:a,authDomain:c}=s.options;v(a&&!a.includes(":"),"invalid-api-key",{appName:s.name});const o={apiKey:a,authDomain:c,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:jr(t)},l=new No(s,r,i,o);return Mo(l,n),l},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,s)=>{e.getProvider("auth-internal").initialize()})),Re(new Ee("auth-internal",e=>{const n=mt(e.getProvider("auth").getImmediate());return(s=>new Jc(s))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),ye(Un,Vn,Xc(t)),ye(Un,Vn,"esm2017")}/**
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
 */const Zc=5*60,el=vr("authIdTokenMaxAge")||Zc;let Fn=null;const tl=t=>async e=>{const n=e&&await e.getIdTokenResult(),s=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(s&&s>el)return;const r=n==null?void 0:n.token;Fn!==r&&(Fn=r,await fetch(t,{method:r?"POST":"DELETE",headers:r?{Authorization:`Bearer ${r}`}:{}}))};function nl(t=Ya()){const e=br(t,"auth");if(e.isInitialized())return e.getImmediate();const n=Lo(t,{popupRedirectResolver:Yc,persistence:[ac,Yr,Xr]}),s=vr("authTokenSyncURL");if(s&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(s,location.origin);if(location.origin===i.origin){const a=tl(i.toString());Go(n,a,()=>a(n.currentUser)),zr(n,c=>a(c))}}const r=Li("auth");return r&&Uo(n,`http://${r}`),n}function rl(){var t,e;return(e=(t=document.getElementsByTagName("head"))===null||t===void 0?void 0:t[0])!==null&&e!==void 0?e:document}Oo({loadJS(t){return new Promise((e,n)=>{const s=document.createElement("script");s.setAttribute("src",t),s.onload=e,s.onerror=r=>{const i=V("internal-error");i.customData=r,n(i)},s.type="text/javascript",s.charset="UTF-8",rl().appendChild(s)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Qc("Browser");var sl="firebase",il="11.1.0";/**
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
 */ye(sl,il,"app");const al=async()=>{const t="production";try{if(t==="production")return(await ms(()=>import("./firebase.config.prod-CMcj8fXD.js"),[])).default}catch(e){throw console.error("Error loading Firebase config:",e),e}};let ze=null,Bn=null;const ol=async()=>{if(!ze){const t=await al();ze=Er(t),Bn=nl(ze)}return{app:ze,auth:Bn}},cl={data(){return{isInitialized:!1,authInstance:null,unsubscribeAuth:null,showDialog:!1}},created(){this.showDialog=!this.loggedInGoogle},watch:{loggedInGoogle(t){t&&(this.showDialog=!1)}},computed:{...Qn(["loggedInGoogle","userGoogle"])},async mounted(){try{const{auth:t}=await ol();Wo(t,Yr),this.authInstance=t,this.isInitialized=!0,zo(t,async e=>{if(e){const n=await e.getIdToken(!0);try{const s=await fetch("/api/auth/google",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({idToken:n})}),r=await s.json();console.log("Mountted",r),s.ok?(this.$store.commit("setloggedInGoogle",!0),this.$store.commit("setUserGoogle",r.userGoogle),localStorage.setItem("AUTH_TOKEN",r.token)):(localStorage.removeItem("AUTH_TOKEN"),this.$store.commit("setloggedInGoogle",!1))}catch(s){console.error("Token verification error:",s)}}}),this.unsubscribeAuth=zr(t,async e=>{if(e){const n=await e.getIdToken(!0);this.$store.commit("setloggedInGoogle",!0),this.$store.commit("setUserGoogle",e)}else this.$store.commit("setloggedInGoogle",!1),this.$store.commit("setUserGoogle",null)})}catch(t){console.error("Failed to initialize Firebase:",t)}},beforeDestroy(){this.unsubscribeAuth&&this.unsubscribeAuth()},methods:{closeDialog(){this.showDialog=!1},async signInWithGoogle(){if(!this.isInitialized||!this.authInstance){console.error("Firebase not yet initialized");return}try{const t=new H,n=await(await dc(this.authInstance,t)).user.getIdToken(!0),s=await fetch("/api/auth/google",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({idToken:n})});if(s.ok){const r=await s.json();console.log("SignIn",r),this.showDialog=!1,localStorage.setItem("AUTH_TOKEN",r.token),localStorage.setItem("jwtGoogle",n),this.$store.commit("setloggedInGoogle",!0)}}catch(t){console.error("Google sign-in error:",t)}}}};function ll(t,e,n,s,r,i){return t.loggedInGoogle?Pt("",!0):(ve(),Oe(M,{key:0,onClick:i.signInWithGoogle,color:"primary"},{default:I(()=>e[0]||(e[0]=[w(" Sign in with Google ")])),_:1},8,["onClick"]))}const is=ht(cl,[["render",ll],["__scopeId","data-v-c8e5f04f"]]),ul={Promoters:1,"Key Management Personnel":2,Relative:3,"-":4,"Promoter Group":5,"Employees/Designated Employees":6,Director:7,Other:8,"Immediate relative":9,"Key Managerial Personnel":10},dl=Object.entries(ul).reduce((t,[e,n])=>(t[n]=e,t),{}),hl={"7(2)":1,"7(3)":2};Object.entries(hl).reduce((t,[e,n])=>(t[n]=e,t),{});const fl={"Equity Shares":1,"Convertible Debentures":2,Warrants:3,"ADR/GDR/FCCB":4},pl=Object.entries(fl).reduce((t,[e,n])=>(t[n]=e,t),{}),ml={ESOP:1,Gift:2,"Invocation of Pledge":3,"Market Purchase":4,"Market Sale":5,"Off Market":6,Others:7,"Pledge Creation":8,"Preferential Offer":9,"Revokation of Pledge":10,"Scheme of Amalgamation/Merger/Demerger/Arrangement":11,"Inter-se-Transfer":12,"Conversion of security":13,Bonus:14,"-":15},gl=Object.entries(ml).reduce((t,[e,n])=>(t[n]=e,t),{}),_l={Buy:1,Sell:2,Pledge:3,"Pledge Revoke":4,"Invocation of Pledge":5},vl=Object.entries(_l).reduce((t,[e,n])=>(t[n]=e,t),{}),yl={NSE:1,BSE:2,MSEI:3,NA:4},Il={main:0,sme:1};Object.entries(Il).reduce((t,[e,n])=>(t[n]=e,t),{});Object.entries(yl).reduce((t,[e,n])=>(t[n]=e,t),{});const kl={Not_Specified:-1,Positive:0,Negative:1,Neutral:2},bl=Object.entries(kl).reduce((t,[e,n])=>(t[n]=e,t),{}),El={components:{apexchart:Bs},props:{candles:Array},computed:{series(){return[{data:this.candles.map(t=>({x:new Date(t.timestamp),y:[t.open,t.high,t.low,t.close]}))}]},chartOptions(){return{chart:{type:"candlestick",height:350},xaxis:{type:"datetime"},yaxis:{tooltip:{enabled:!0}}}}}};function Tl(t,e,n,s,r,i){const a=Rt("apexchart");return ve(),Oe(Zn,null,{default:I(()=>[h(Ot,null,{default:I(()=>e[0]||(e[0]=[w("Stock Price Chart")])),_:1}),h(qe,null,{default:I(()=>[h(a,{type:"candlestick",options:i.chartOptions,series:i.series},null,8,["options","series"])]),_:1})]),_:1})}const wl=ht(El,[["render",Tl],["__scopeId","data-v-cc929203"]]),Sl={props:{announcements:Array,insiderTrades:Array,candles:Array},components:{StockPriceChart:wl},data(){return{announcementHeaders:[{text:"Company",value:"company_name"},{text:"Summary",value:"announcement_text_summary"},{text:"Impact",value:"announcement_impact"},{text:"Signal",value:"announcement_sentiment"},{text:"Date",value:"announcement_date"}]}},computed:{insiderTradeHeaders(){return[{text:"Company",value:"company_name"},{text:"Insider",value:"name_of_insider"},{text:"Category",value:"category_of_insider"},{text:"Type",value:"transaction_type"},{text:"Mode",value:"mode_of_transaction"},{text:"% Pre",value:"shareholding_before_transaction"},{text:"% Post",value:"shareholding_after_transaction"},{text:"Date",value:"intimation_date"}]}}};function Cl(t,e,n,s,r,i){return ve(),Ms("div",null,[e[13]||(e[13]=kt("h2",null,"Stock Watchlist",-1)),e[14]||(e[14]=kt("h3",null,"Announcements",-1)),h(ln,{headers:r.announcementHeaders,items:n.announcements},{"header.company_name":I(()=>e[0]||(e[0]=[w("Company")])),"header.announcement_text_summary":I(()=>e[1]||(e[1]=[w("Summary")])),"header.announcement_impact":I(()=>e[2]||(e[2]=[w("Impact")])),"header.announcement_sentiment":I(()=>e[3]||(e[3]=[w("Signal")])),"header.announcement_date":I(()=>e[4]||(e[4]=[w("Date")])),_:1},8,["headers","items"]),e[15]||(e[15]=kt("h3",null,"Insider Trades",-1)),h(ln,{headers:i.insiderTradeHeaders,items:n.insiderTrades,class:"mb-4"},{"header.company_name":I(()=>e[5]||(e[5]=[w("Company")])),"header.name_of_insider":I(()=>e[6]||(e[6]=[w("Insider")])),"header.category_of_insider":I(()=>e[7]||(e[7]=[w("Category")])),"header.transaction_type":I(()=>e[8]||(e[8]=[w("Type")])),"header.mode_of_transaction":I(()=>e[9]||(e[9]=[w("Mode")])),"header.shareholding_before_transaction":I(()=>e[10]||(e[10]=[w("%Pre")])),"header.shareholding_after_transaction":I(()=>e[11]||(e[11]=[w("%Post")])),"header.intimation_date":I(()=>e[12]||(e[12]=[w("Intimation")])),_:1},8,["headers","items"])])}const Al=ht(Sl,[["render",Cl],["__scopeId","data-v-d151aaa6"]]),Dl=$`
    query  GetStocks{
        stock{
            id
            company_name
        }
    }
`,Nl=$`
mutation InsertStockPortfolio($object: portfolio_stocks_insert_input!) {
  insert_portfolio_stocks_one(object: $object) {
    stock_id
    user_id
  }
}
`,Ol=$`
query  GetUserStockPortfolio($email: String!){
        portfolio_stocks(where: {user: {email : {_eq: $email}}}){
						stock{
              id
              company_name
            }   
  			}
}
`,Pl=$`
mutation deleteUserStockPortfolio($stock_id: Int!, $email: String!){
  delete_portfolio_stocks(where: {
    stock_id: {_eq: $stock_id},
    user: {email: {_eq: $email}}
  }){
    affected_rows
  }
}
`,Rl=$`
query UserStockPortfolio($email: String!, $fromDate: date!, $toDate: date!){
  portfolio_stocks(where: {user:{email: {_eq: $email}}}){
    stock{
      company_name
      stock_price_dailies(where: {price_date: {_gte: $fromDate, _lte: $toDate}}){
        open
        high
        low
        volume
        price_date
      }
      stock_announcements (where: {announcement_date: {_gte: $fromDate, _lte: $toDate}}){
        announcement_date
        announcement_text_summary
        announcement_impact
        announcement_document_link
        announcement_sentiment
      }
      insider_trades (where: {intimation_date: {_gte: $fromDate, _lte: $toDate}}){
        intimation_date
        name_of_insider
        number_of_securities_transacted
        number_of_securities_after_transaction
        number_of_securities_before_transaction
        type_of_security
        shareholding_before_transaction
        shareholding_after_transaction
        mode_of_transaction
        transaction_type
        category_of_insider
      }
    }
    
  }
  
}
`,as=J({active:{type:[String,Array],default:void 0},disabled:{type:[Boolean,String,Array],default:!1},nextIcon:{type:Ye,default:"$next"},prevIcon:{type:Ye,default:"$prev"},modeIcon:{type:Ye,default:"$subgroup"},text:String,viewMode:{type:String,default:"month"}},"VDatePickerControls"),$n=ie()({name:"VDatePickerControls",props:as(),emits:{"click:year":()=>!0,"click:month":()=>!0,"click:prev":()=>!0,"click:next":()=>!0,"click:text":()=>!0},setup(t,e){let{emit:n}=e;const s=C(()=>Array.isArray(t.disabled)?t.disabled.includes("text"):!!t.disabled),r=C(()=>Array.isArray(t.disabled)?t.disabled.includes("mode"):!!t.disabled),i=C(()=>Array.isArray(t.disabled)?t.disabled.includes("prev"):!!t.disabled),a=C(()=>Array.isArray(t.disabled)?t.disabled.includes("next"):!!t.disabled);function c(){n("click:prev")}function o(){n("click:next")}function l(){n("click:year")}function d(){n("click:month")}return me(()=>h("div",{class:["v-date-picker-controls"]},[h(M,{class:"v-date-picker-controls__month-btn",disabled:s.value,text:t.text,variant:"text",rounded:!0,onClick:d},null),h(M,{key:"mode-btn",class:"v-date-picker-controls__mode-btn",disabled:r.value,density:"comfortable",icon:t.modeIcon,variant:"text",onClick:l},null),h($s,{key:"mode-spacer"},null),h("div",{key:"month-buttons",class:"v-date-picker-controls__month"},[h(M,{disabled:i.value,icon:t.prevIcon,variant:"text",onClick:c},null),h(M,{disabled:a.value,icon:t.nextIcon,variant:"text",onClick:o},null)])])),{}}}),xl=J({appendIcon:Ye,color:String,header:String,transition:String,onClick:Ws()},"VDatePickerHeader"),jn=ie()({name:"VDatePickerHeader",props:xl(),emits:{click:()=>!0,"click:append":()=>!0},setup(t,e){let{emit:n,slots:s}=e;const{backgroundColorClasses:r,backgroundColorStyles:i}=qt(t,"color");function a(){n("click")}function c(){n("click:append")}return me(()=>{const o=!!(s.default||t.header),l=!!(s.append||t.appendIcon);return h("div",{class:["v-date-picker-header",{"v-date-picker-header--clickable":!!t.onClick},r.value],style:i.value,onClick:a},[s.prepend&&h("div",{key:"prepend",class:"v-date-picker-header__prepend"},[s.prepend()]),o&&h(er,{key:"content",name:t.transition},{default:()=>{var d;return[h("div",{key:t.header,class:"v-date-picker-header__content"},[((d=s.default)==null?void 0:d.call(s))??t.header])]}}),l&&h("div",{class:"v-date-picker-header__append"},[s.append?h(ft,{key:"append-defaults",disabled:!t.appendIcon,defaults:{VBtn:{icon:t.appendIcon,variant:"text"}}},{default:()=>{var d;return[(d=s.append)==null?void 0:d.call(s)]}}):h(M,{key:"append-btn",icon:t.appendIcon,variant:"text",onClick:c},null)])])}),{}}}),Ll=J({allowedDates:[Array,Function],disabled:Boolean,displayValue:null,modelValue:Array,month:[Number,String],max:null,min:null,showAdjacentMonths:Boolean,year:[Number,String],weekdays:{type:Array,default:()=>[0,1,2,3,4,5,6]},weeksInMonth:{type:String,default:"dynamic"},firstDayOfWeek:[Number,String]},"calendar");function Ml(t){const e=Me(),n=de(t,"modelValue",[],g=>Je(g)),s=C(()=>t.displayValue?e.date(t.displayValue):n.value.length>0?e.date(n.value[0]):t.min?e.date(t.min):Array.isArray(t.allowedDates)?e.date(t.allowedDates[0]):e.date()),r=de(t,"year",void 0,g=>{const p=g!=null?Number(g):e.getYear(s.value);return e.startOfYear(e.setYear(e.date(),p))},g=>e.getYear(g)),i=de(t,"month",void 0,g=>{const p=g!=null?Number(g):e.getMonth(s.value),y=e.setYear(e.startOfMonth(e.date()),e.getYear(r.value));return e.setMonth(y,p)},g=>e.getMonth(g)),a=C(()=>{const g=Number(t.firstDayOfWeek??0);return t.weekdays.map(p=>(p+g)%7)}),c=C(()=>{const g=e.getWeekArray(i.value,t.firstDayOfWeek),p=g.flat(),y=6*7;if(t.weeksInMonth==="static"&&p.length<y){const S=p[p.length-1];let E=[];for(let m=1;m<=y-p.length;m++)E.push(e.addDays(S,m)),m%7===0&&(g.push(E),E=[])}return g});function o(g,p){return g.filter(y=>a.value.includes(e.toJsDate(y).getDay())).map((y,S)=>{const E=e.toISO(y),m=!e.isSameMonth(y,i.value),O=e.isSameDay(y,e.startOfMonth(i.value)),L=e.isSameDay(y,e.endOfMonth(i.value)),x=e.isSameDay(y,i.value);return{date:y,isoDate:E,formatted:e.format(y,"keyboardDate"),year:e.getYear(y),month:e.getMonth(y),isDisabled:b(y),isWeekStart:S%7===0,isWeekEnd:S%7===6,isToday:e.isSameDay(y,p),isAdjacent:m,isHidden:m&&!t.showAdjacentMonths,isStart:O,isSelected:n.value.some(F=>e.isSameDay(y,F)),isEnd:L,isSame:x,localized:e.format(y,"dayOfMonth")}})}const l=C(()=>{const g=e.startOfWeek(s.value,t.firstDayOfWeek),p=[];for(let S=0;S<=6;S++)p.push(e.addDays(g,S));const y=e.date();return o(p,y)}),d=C(()=>{const g=c.value.flat(),p=e.date();return o(g,p)}),f=C(()=>c.value.map(g=>g.length?Gs(e,g[0]):null));function b(g){if(t.disabled)return!0;const p=e.date(g);return t.min&&e.isAfter(e.date(t.min),p)||t.max&&e.isAfter(p,e.date(t.max))?!0:Array.isArray(t.allowedDates)&&t.allowedDates.length>0?!t.allowedDates.some(y=>e.isSameDay(e.date(y),p)):typeof t.allowedDates=="function"?!t.allowedDates(p):!1}return{displayValue:s,daysInMonth:d,daysInWeek:l,genDays:o,model:n,weeksInMonth:c,weekDays:a,weekNumbers:f}}const os=J({color:String,hideWeekdays:Boolean,multiple:[Boolean,Number,String],showWeek:Boolean,transition:{type:String,default:"picker-transition"},reverseTransition:{type:String,default:"picker-reverse-transition"},...Ll()},"VDatePickerMonth"),Hn=ie()({name:"VDatePickerMonth",props:os(),emits:{"update:modelValue":t=>!0,"update:month":t=>!0,"update:year":t=>!0},setup(t,e){let{emit:n,slots:s}=e;const r=xt(),{daysInMonth:i,model:a,weekNumbers:c}=Ml(t),o=Me(),l=Ke(),d=Ke(),f=Ke(!1),b=C(()=>f.value?t.reverseTransition:t.transition);t.multiple==="range"&&a.value.length>0&&(l.value=a.value[0],a.value.length>1&&(d.value=a.value[a.value.length-1]));const g=C(()=>{const E=["number","string"].includes(typeof t.multiple)?Number(t.multiple):1/0;return a.value.length>=E});tr(i,(E,m)=>{m&&(f.value=o.isBefore(E[0].date,m[0].date))});function p(E){const m=o.startOfDay(E);if(a.value.length===0?l.value=void 0:a.value.length===1&&(l.value=a.value[0],d.value=void 0),!l.value)l.value=m,a.value=[l.value];else if(d.value)l.value=E,d.value=void 0,a.value=[l.value];else{if(o.isSameDay(m,l.value)){l.value=void 0,a.value=[];return}else o.isBefore(m,l.value)?(d.value=o.endOfDay(l.value),l.value=m):d.value=o.endOfDay(m);const O=o.getDiff(d.value,l.value,"days"),L=[l.value];for(let x=1;x<O;x++){const F=o.addDays(l.value,x);L.push(F)}L.push(d.value),a.value=L}}function y(E){const m=a.value.findIndex(O=>o.isSameDay(O,E));if(m===-1)a.value=[...a.value,E];else{const O=[...a.value];O.splice(m,1),a.value=O}}function S(E){t.multiple==="range"?p(E):t.multiple?y(E):a.value=[E]}return()=>h("div",{class:"v-date-picker-month"},[t.showWeek&&h("div",{key:"weeks",class:"v-date-picker-month__weeks"},[!t.hideWeekdays&&h("div",{key:"hide-week-days",class:"v-date-picker-month__day"},[w(" ")]),c.value.map(E=>h("div",{class:["v-date-picker-month__day","v-date-picker-month__day--adjacent"]},[E]))]),h(er,{name:b.value},{default:()=>{var E;return[h("div",{ref:r,key:(E=i.value[0].date)==null?void 0:E.toString(),class:"v-date-picker-month__days"},[!t.hideWeekdays&&o.getWeekdays(t.firstDayOfWeek).map(m=>h("div",{class:["v-date-picker-month__day","v-date-picker-month__weekday"]},[m])),i.value.map((m,O)=>{const L={props:{onClick:()=>S(m.date)},item:m,i:O};return g.value&&!m.isSelected&&(m.isDisabled=!0),h("div",{class:["v-date-picker-month__day",{"v-date-picker-month__day--adjacent":m.isAdjacent,"v-date-picker-month__day--hide-adjacent":m.isHidden,"v-date-picker-month__day--selected":m.isSelected,"v-date-picker-month__day--week-end":m.isWeekEnd,"v-date-picker-month__day--week-start":m.isWeekStart}],"data-v-date":m.isDisabled?void 0:m.isoDate},[(t.showAdjacentMonths||!m.isAdjacent)&&h(ft,{defaults:{VBtn:{class:"v-date-picker-month__day-btn",color:(m.isSelected||m.isToday)&&!m.isDisabled?t.color:void 0,disabled:m.isDisabled,icon:!0,ripple:!1,text:m.localized,variant:m.isDisabled?m.isToday?"outlined":"text":m.isToday&&!m.isSelected?"outlined":"flat",onClick:()=>S(m.date)}}},{default:()=>{var x;return[((x=s.day)==null?void 0:x.call(s,L))??h(M,L.props,null)]}})])})])]}})])}}),cs=J({color:String,height:[String,Number],min:null,max:null,modelValue:Number,year:Number},"VDatePickerMonths"),Wn=ie()({name:"VDatePickerMonths",props:cs(),emits:{"update:modelValue":t=>!0},setup(t,e){let{emit:n,slots:s}=e;const r=Me(),i=de(t,"modelValue"),a=C(()=>{let c=r.startOfYear(r.date());return t.year&&(c=r.setYear(c,t.year)),sr(12).map(o=>{const l=r.format(c,"monthShort"),d=!!(t.min&&r.isAfter(r.startOfMonth(r.date(t.min)),c)||t.max&&r.isAfter(c,r.startOfMonth(r.date(t.max))));return c=r.getNextMonth(c),{isDisabled:d,text:l,value:o}})});return nr(()=>{i.value=i.value??r.getMonth(r.date())}),me(()=>h("div",{class:"v-date-picker-months",style:{height:ir(t.height)}},[h("div",{class:"v-date-picker-months__content"},[a.value.map((c,o)=>{var f;const l={active:i.value===o,color:i.value===o?t.color:void 0,disabled:c.isDisabled,rounded:!0,text:c.text,variant:i.value===c.value?"flat":"text",onClick:()=>d(o)};function d(b){if(i.value===b){n("update:modelValue",i.value);return}i.value=b}return((f=s.month)==null?void 0:f.call(s,{month:c,i:o,props:l}))??h(M,U({key:"month"},l),null)})])])),{}}}),ls=J({color:String,height:[String,Number],min:null,max:null,modelValue:Number},"VDatePickerYears"),Gn=ie()({name:"VDatePickerYears",props:ls(),emits:{"update:modelValue":t=>!0},setup(t,e){let{emit:n,slots:s}=e;const r=Me(),i=de(t,"modelValue"),a=C(()=>{const o=r.getYear(r.date());let l=o-100,d=o+52;t.min&&(l=r.getYear(r.date(t.min))),t.max&&(d=r.getYear(r.date(t.max)));let f=r.startOfYear(r.date());return f=r.setYear(f,l),sr(d-l+1,l).map(b=>{const g=r.format(f,"year");return f=r.setYear(f,r.getYear(f)+1),{text:g,value:b}})});nr(()=>{i.value=i.value??r.getYear(r.date())});const c=zs();return Us(async()=>{var o;await Vs(),(o=c.el)==null||o.scrollIntoView({block:"center"})}),me(()=>h("div",{class:"v-date-picker-years",style:{height:ir(t.height)}},[h("div",{class:"v-date-picker-years__content"},[a.value.map((o,l)=>{var f;const d={ref:i.value===o.value?c:void 0,active:i.value===o.value,color:i.value===o.value?t.color:void 0,rounded:!0,text:o.text,variant:i.value===o.value?"flat":"text",onClick:()=>{if(i.value===o.value){n("update:modelValue",i.value);return}i.value=o.value}};return((f=s.year)==null?void 0:f.call(s,{year:o,i:l,props:d}))??h(M,U({key:"month"},d),null)})])])),{}}}),Ul=qs("v-picker-title"),us=J({color:String,...gs(),...Ks(),..._s(),...vs(),...ys(),...Is(),...ks(),...bs(),...Ys()},"VSheet"),zn=ie()({name:"VSheet",props:us(),setup(t,e){let{slots:n}=e;const{themeClasses:s}=Js(t),{backgroundColorClasses:r,backgroundColorStyles:i}=qt(rr(t,"color")),{borderClasses:a}=Es(t),{dimensionStyles:c}=Ts(t),{elevationClasses:o}=ws(t),{locationStyles:l}=Ss(t),{positionClasses:d}=Cs(t),{roundedClasses:f}=As(t);return me(()=>h(t.tag,{class:["v-sheet",s.value,r.value,a.value,o.value,d.value,f.value,t.class],style:[i.value,c.value,l.value,t.style]},n)),{}}}),ds=J({bgColor:String,landscape:Boolean,title:String,hideHeader:Boolean,...us()},"VPicker"),qn=ie()({name:"VPicker",props:ds(),setup(t,e){let{slots:n}=e;const{backgroundColorClasses:s,backgroundColorStyles:r}=qt(rr(t,"color"));return me(()=>{const i=zn.filterProps(t),a=!!(t.title||n.title);return h(zn,U(i,{color:t.bgColor,class:["v-picker",{"v-picker--landscape":t.landscape,"v-picker--with-actions":!!n.actions},t.class],style:t.style}),{default:()=>{var c;return[!t.hideHeader&&h("div",{key:"header",class:[s.value],style:[r.value]},[a&&h(Ul,{key:"picker-title"},{default:()=>{var o;return[((o=n.title)==null?void 0:o.call(n))??t.title]}}),n.header&&h("div",{class:"v-picker__header"},[n.header()])]),h("div",{class:"v-picker__body"},[(c=n.default)==null?void 0:c.call(n)]),n.actions&&h(ft,{defaults:{VBtn:{slim:!0,variant:"text"}}},{default:()=>[h("div",{class:"v-picker__actions"},[n.actions()])]})]}})}),{}}}),Vl=J({header:{type:String,default:"$vuetify.datePicker.header"},...as(),...os({weeksInMonth:"static"}),...rt(cs(),["modelValue"]),...rt(ls(),["modelValue"]),...ds({title:"$vuetify.datePicker.title"}),modelValue:null},"VDatePicker"),Kn=ie()({name:"VDatePicker",props:Vl(),emits:{"update:modelValue":t=>!0,"update:month":t=>!0,"update:year":t=>!0,"update:viewMode":t=>!0},setup(t,e){let{emit:n,slots:s}=e;const r=Me(),{t:i}=Xs(),a=de(t,"modelValue",void 0,k=>Je(k),k=>t.multiple?k:k[0]),c=de(t,"viewMode"),o=C(()=>{var P;const k=r.date((P=a.value)==null?void 0:P[0]);return k&&r.isValid(k)?k:r.date()}),l=xt(Number(t.month??r.getMonth(r.startOfMonth(o.value)))),d=xt(Number(t.year??r.getYear(r.startOfYear(r.setMonth(o.value,l.value))))),f=Ke(!1),b=C(()=>t.multiple&&a.value.length>1?i("$vuetify.datePicker.itemsSelected",a.value.length):a.value[0]&&r.isValid(a.value[0])?r.format(r.date(a.value[0]),"normalDateWithWeekday"):i(t.header)),g=C(()=>{let k=r.date();return k=r.setDate(k,1),k=r.setMonth(k,l.value),k=r.setYear(k,d.value),r.format(k,"monthAndYear")}),p=C(()=>`date-picker-header${f.value?"-reverse":""}-transition`),y=C(()=>{const k=r.date(t.min);return t.min&&r.isValid(k)?k:null}),S=C(()=>{const k=r.date(t.max);return t.max&&r.isValid(k)?k:null}),E=C(()=>{if(t.disabled)return!0;const k=[];if(c.value!=="month")k.push("prev","next");else{let P=r.date();if(P=r.setYear(P,d.value),P=r.setMonth(P,l.value),y.value){const Q=r.addDays(r.startOfMonth(P),-1);r.isAfter(y.value,Q)&&k.push("prev")}if(S.value){const Q=r.addDays(r.endOfMonth(P),1);r.isAfter(Q,S.value)&&k.push("next")}}return k});function m(){l.value<11?l.value++:(d.value++,l.value=0,ce(d.value)),X(l.value)}function O(){l.value>0?l.value--:(d.value--,l.value=11,ce(d.value)),X(l.value)}function L(){c.value="month"}function x(){c.value=c.value==="months"?"month":"months"}function F(){c.value=c.value==="year"?"month":"year"}function X(k){c.value==="months"&&x(),n("update:month",k)}function ce(k){c.value==="year"&&F(),n("update:year",k)}return tr(a,(k,P)=>{const Q=Je(P),Ce=Je(k);if(!Ce.length)return;const vt=r.date(Q[Q.length-1]),Ae=r.date(Ce[Ce.length-1]),ge=r.getMonth(Ae),D=r.getYear(Ae);ge!==l.value&&(l.value=ge,X(l.value)),D!==d.value&&(d.value=D,ce(d.value)),f.value=r.isBefore(vt,Ae)}),me(()=>{const k=qn.filterProps(t),P=$n.filterProps(t),Q=jn.filterProps(t),Ce=Hn.filterProps(t),vt=rt(Wn.filterProps(t),["modelValue"]),Ae=rt(Gn.filterProps(t),["modelValue"]),ge={header:b.value,transition:p.value};return h(qn,U(k,{class:["v-date-picker",`v-date-picker--${c.value}`,{"v-date-picker--show-week":t.showWeek},t.class],style:t.style}),{title:()=>{var D;return((D=s.title)==null?void 0:D.call(s))??h("div",{class:"v-date-picker__title"},[i(t.title)])},header:()=>s.header?h(ft,{defaults:{VDatePickerHeader:{...ge}}},{default:()=>{var D;return[(D=s.header)==null?void 0:D.call(s,ge)]}}):h(jn,U({key:"header"},Q,ge,{onClick:c.value!=="month"?L:void 0}),{...s,default:void 0}),default:()=>h(Fs,null,[h($n,U(P,{disabled:E.value,text:g.value,"onClick:next":m,"onClick:prev":O,"onClick:month":x,"onClick:year":F}),null),h(Ds,{hideOnLeave:!0},{default:()=>[c.value==="months"?h(Wn,U({key:"date-picker-months"},vt,{modelValue:l.value,"onUpdate:modelValue":[D=>l.value=D,X],min:y.value,max:S.value,year:d.value}),null):c.value==="year"?h(Gn,U({key:"date-picker-years"},Ae,{modelValue:d.value,"onUpdate:modelValue":[D=>d.value=D,ce],min:y.value,max:S.value}),null):h(Hn,U({key:"date-picker-month"},Ce,{modelValue:a.value,"onUpdate:modelValue":D=>a.value=D,month:l.value,"onUpdate:month":[D=>l.value=D,X],year:d.value,"onUpdate:year":[D=>d.value=D,ce],min:y.value,max:S.value}),null)]})]),actions:s.actions})}),{}}}),Fl={name:"ChatApp",components:{MutualFundAnalysis:js,PromptChat:Ns,GoogleSignIn:is,StockWatchList:Al},data(){return{messages:[],userInput:"",isLoading:!1,showError:!1,errorMessage:"",stocks:[],selectedStocks:[],portfolio:[],compareData:{},inserts:[],deletes:[],fromDate:new Date,toDate:new Date,selectedPeriod:"yesterday",showCustomDatePicker:!1,dateRangePeriods:[{text:"Yesterday",value:"yesterday"},{text:"Last 7 Days",value:"last7"},{text:"Last 15 Days",value:"last15"},{text:"Custom",value:"custom"}],searchText:"",title:"Stocks Helper Agent",subTitles:["Ask what Google/ChatGPT cannot answer. E.g.","Which companies reported insider trades in last one month","Last one month, which companies made preferential offer announcements","** Trained on Indian data, can make mistakes"],userInputLabel:"This is an AI tool. Double Check",debug:!1,distilledModel:"analysis_reasoning",announcementHeaders:[{text:"Sentiment",value:"sentiment"}],announcements:[],insiderTrades:[],candles:[],analysisTypes:[{name:"Overlap",color:"primary",icon:"mdi-compare"},{name:"Diversification",color:"success",icon:"mdi-chart-pie"},{name:"Performance",color:"info",icon:"mdi-chart-line"},{name:"Fees",color:"warning",icon:"mdi-alert-circle-outline"}]}},watch:{async loggedInGoogle(t){},async userGoogle(t){t&&t.email&&await this.getUserStockPortfolio()}},computed:{...Qn(["loggedInGoogle","userGoogle"]),dateRangeText(){return`${this.fromDate} to ${this.toDate}`}},methods:{async getAnnouncements(){try{const t=await this.$apollo.query({query:Rl,variables:{fromDate:this.fromDate.toISOString().split("T")[0],toDate:this.toDate.toISOString().split("T")[0],email:this.userGoogle.email}}),e=this.extractArraysFromResponse(t);this.announcements=e.announcements,this.insiderTrades=e.insiderTrades,this.candles=e.candles}catch(t){console.error(t)}},extractArraysFromResponse(t){const e=t.data.portfolio_stocks,n=[],s=[],r=[];return e.forEach(i=>{const a=i.stock,c=a.company_name;a.stock_announcements.forEach(o=>{n.push({company_name:c,announcement_date:o.announcement_date,announcement_text_summary:o.announcement_text_summary,announcement_impact:o.announcement_impact,announcement_document_link:o.announcement_document_link,announcement_sentiment:bl[o.announcement_sentiment]})}),a.insider_trades.forEach(o=>{s.push({company_name:c,intimation_date:o.intimation_date,name_of_insider:o.name_of_insider,number_of_securities_transacted:o.number_of_securities_transacted,number_of_securities_after_transaction:o.number_of_securities_after_transaction,number_of_securities_before_transaction:o.number_of_securities_before_transaction,type_of_security:pl[o.type_of_security],shareholding_before_transaction:o.shareholding_before_transaction,shareholding_after_transaction:o.shareholding_after_transaction,mode_of_transaction:gl[o.mode_of_transaction],transaction_type:vl[o.transaction_type],category_of_insider:dl[o.category_of_insider]})}),a.stock_price_dailies.forEach(o=>{o.open!==void 0&&r.push({company_name:c,open:o.open,high:o.high,low:o.low,volume:o.volume,price_date:o.price_date})})}),{announcements:n,insiderTrades:s,candles:r}},customFilter(t,e){const n=t.toLowerCase();return e.toLowerCase().split(/\s+/).every(i=>n.includes(i))},formatDate(t){return t.toISOString().substr(0,10)},handlePeriodChange(){switch(this.selectedPeriod){case"today":this.fromDate=new Date,this.toDate=new Date,this.showCustomDatePicker=!1;break;case"yesterday":const t=new Date;t.setDate(t.getDate()-1),this.fromDate=t,this.toDate=t,this.showCustomDatePicker=!1;break;case"last7":this.toDate=new Date;const e=new Date;e.setDate(e.getDate()-6),this.fromDate=e,this.showCustomDatePicker=!1;break;case"last15":this.toDate=new Date;const n=new Date;n.setDate(n.getDate()-14),this.fromDate=n,this.showCustomDatePicker=!1;break;case"custom":this.fromDate=new Date,this.toDate=new Date,this.showCustomDatePicker=!0;break}},async updateWatchList(){const t=new Set(this.portfolio.map(r=>r.id)),e=new Set(this.selectedStocks.map(r=>r.id)),n=this.selectedStocks.filter(r=>!t.has(r.id)),s=this.portfolio.filter(r=>!e.has(r.id));for(const[r,i]of n.entries())try{const a=await this.$apollo.query({query:Nl,variables:{object:{stock_id:i.id,user:{data:{email:this.userGoogle.email,google_id:this.userGoogle.uid},on_conflict:{constraint:"users_email_key",update_columns:["email"]}}}},fetchPolicy:"no-cache"})}catch(a){console.error(a)}for(const[r,i]of s.entries())try{const a=await this.$apollo.query({query:Pl,variables:{stock_id:i.id,email:this.userGoogle.email},fetchPolicy:"no-cache"})}catch(a){console.error(a)}},async getUserStockPortfolio(){if(this.userGoogle.email)try{const t=await this.$apollo.query({query:Ol,variables:{email:this.userGoogle.email}});this.selectedStocks=t.data.portfolio_stocks.map(e=>({id:e.stock.id,company_name:e.stock.company_name})),this.portfolio=this.selectedStocks}catch(t){console.error(t)}},async getStocks(){try{let t=await this.$apollo.query({query:Dl,variables:{},fetchPolicy:"no-cache"});this.stocks=t.data.stock}catch(t){console.error(t)}},handleSearch(t){this.searchText=t},handleStockSelection(t){},scrollToBottom(){const t=this.$refs.messagesContainer;t&&(t.scrollTop=t.scrollHeight)}},async mounted(){this.stocks.length==0&&await this.getStocks()}};function Bl(t,e,n,s,r,i){const a=Rt("prompt-chat"),c=is,o=Rt("stock-watch-list");return ve(),Oe(Os,null,{default:I(()=>[h(Ls,{fluid:"",class:"fill-height pa-0"},{default:I(()=>[h(It,{"no-gutters":"",class:"fill-height"},{default:I(()=>[h(_e,{cols:"12",md:"6",order:"first","order-md":"first",class:"left-panel"},{default:I(()=>[h(a,{distilledModel:r.distilledModel,title:r.title,subTitles:r.subTitles,userInputLabel:r.userInputLabel,debug:r.debug},null,8,["distilledModel","title","subTitles","userInputLabel","debug"])]),_:1}),h(_e,{cols:"12",md:"6",order:"last","order-md":"last",class:"right-panel"},{default:I(()=>[t.loggedInGoogle===!0?(ve(),Oe(qe,{key:0},{default:I(()=>[w("Welcome "+bt(t.userGoogle.displayName),1)]),_:1})):Pt("",!0),h(Zn,null,{default:I(()=>[h(Ot,{class:"subtitle-wrap"},{default:I(()=>e[6]||(e[6]=[w("We are NOT registered with SEBI. We do not execute any trades, or take any deposits.")])),_:1}),h(Ot,{class:"subtitle-wrap"},{default:I(()=>e[7]||(e[7]=[w("No Investment advice. Only providing DIY query tools.")])),_:1}),h(c),h(qe,null,{default:I(()=>[h(M,{onClick:i.updateWatchList,color:"primary"},{default:I(()=>e[8]||(e[8]=[w("Update Watch List")])),_:1},8,["onClick"]),h(Hs,{modelValue:r.selectedStocks,"onUpdate:modelValue":[e[0]||(e[0]=l=>r.selectedStocks=l),i.handleStockSelection],items:r.stocks,"item-title":"company_name","custom-filter":i.customFilter,"item-value":"id",label:"Select Stocks "+(r.selectedStocks.length?`(${r.selectedStocks.length} selected)`:""),multiple:"",chips:"","closable-chips":"","persistent-hint":"",search:r.searchText,"onUpdate:search":i.handleSearch,"return-object":""},{chip:I(({props:l,item:d})=>[h(Ps,U(l,{text:d.raw.company_name,variant:"elevated"}),{default:I(()=>[h(Rs,{start:""},{default:I(()=>e[9]||(e[9]=[w("mdi-chart-line")])),_:1}),w(" "+bt(d.raw.company_name),1)]),_:2},1040,["text"])]),_:1},8,["modelValue","items","custom-filter","label","onUpdate:modelValue","search","onUpdate:search"])]),_:1}),h(qe,null,{default:I(()=>[h(It,null,{default:I(()=>[h(_e,{cols:"12",sm:"4"},{default:I(()=>[h(xs,{modelValue:r.selectedPeriod,"onUpdate:modelValue":[e[1]||(e[1]=l=>r.selectedPeriod=l),i.handlePeriodChange],items:r.dateRangePeriods,"item-title":"text","item-value":"value",label:"Select Period"},null,8,["modelValue","items","onUpdate:modelValue"])]),_:1}),r.showCustomDatePicker?(ve(),Oe(_e,{key:0,cols:"12",sm:"8"},{default:I(()=>[h(It,null,{default:I(()=>[h(_e,{cols:"12",sm:"6"},{default:I(()=>[h(Kn,{"show-adjacent-months":"",modelValue:r.fromDate,"onUpdate:modelValue":e[2]||(e[2]=l=>r.fromDate=l)},null,8,["modelValue"])]),_:1}),h(_e,{cols:"12",sm:"6"},{default:I(()=>[h(Kn,{"show-adjacent-months":"",modelValue:r.toDate,"onUpdate:modelValue":e[3]||(e[3]=l=>r.toDate=l)},null,8,["modelValue"])]),_:1})]),_:1})]),_:1})):Pt("",!0)]),_:1}),h(M,{onClick:i.getAnnouncements,color:"primary"},{default:I(()=>e[10]||(e[10]=[w("Fetch")])),_:1},8,["onClick"]),h(o,{announcements:r.announcements,insiderTrades:r.insiderTrades,candles:r.candles},null,8,["announcements","insiderTrades","candles"])]),_:1})]),_:1})]),_:1})]),_:1}),h(Qs,{modelValue:r.showError,"onUpdate:modelValue":e[5]||(e[5]=l=>r.showError=l),color:"error",timeout:"3000"},{action:I(({attrs:l})=>[h(M,U({text:""},l,{onClick:e[4]||(e[4]=d=>r.showError=!1)}),{default:I(()=>e[11]||(e[11]=[w(" Close ")])),_:2},1040)]),default:I(()=>[w(bt(r.errorMessage)+" ",1)]),_:1},8,["modelValue"])]),_:1})]),_:1})}const Kl=ht(Fl,[["render",Bl],["__scopeId","data-v-a0e4cc3d"]]);export{Kl as default};
//# sourceMappingURL=Stocks-Bd1fpBDz.js.map
