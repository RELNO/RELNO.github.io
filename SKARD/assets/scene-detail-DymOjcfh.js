import{G as H,B as X,E as $,J as re,M as T,K as ee,D as te,b as se,F as oe,d as j,Q as ne,l as ie,x as ce,V as F,C as I,O as le,W as de,X as q,Y as ue,Z as fe,j as pe,_ as he,p as ae,$ as J,a as xe,a0 as me,c as ve,S as ge}from"./index-CI1MCUCL.js";import{m as be}from"./BufferGeometryUtils-l55v_Qk4.js";const W=(a,s,e)=>new F(a,s,e),Me=W(0,1,0),K=[[4613480,3555154,11434081,4536114,12950367],[10247491,4473942,8476999,3419441,7359556],[5398899,6513759,13739136,7889995,10969677],[8550281,5002082,11369049,3682098,6182720],[6583378,5261400,9003079,3682357,10384717]],we=new se({vertexColors:!0,roughness:.92});function E(a,s,e){const t=a.getAttribute("position"),p=new I(s),i=new Float32Array(t.count*3);for(let n=0;n<i.length;n+=3)p.toArray(i,n);return a.setAttribute("color",new $(i,3)),a.applyMatrix4(e)}function O(a,s,e=12){const t=[],p=[];for(const[n,d,o,l=0,g=0]of a)for(let r=0;r<e;r++){const b=Math.PI*2*r/e;t.push(l+Math.cos(b)*d,n,g+Math.sin(b)*o)}for(let n=0;n<a.length-1;n++)for(let d=0;d<e;d++){const o=n*e+d,l=n*e+(d+1)%e;p.push(o,o+e,l,l,o+e,l+e)}for(let n=1;n<e-1;n++){p.push(0,n,n+1);const d=(a.length-1)*e;p.push(d,d+n+1,d+n)}const i=new X;return i.setAttribute("position",new oe(t,3)),i.setIndex(p),i.computeVertexNormals(),E(i,s,new j)}function B(a,s,e,t,p,i,n){return E(new ie(1,12,9),n,new j().compose(W(a,s,e),new ne,W(t,p,i)))}function G(a,s,e,t,p){const i=s.clone().sub(a);return E(new ce(t,e,i.length(),9),p,new j().compose(a.clone().lerp(s,.5),new ne().setFromUnitVectors(Me,i.normalize()),W(1,1,1)))}function N(a){const s=a.map(t=>(t.deleteAttribute("uv"),t.index?t.toNonIndexed():t)),e=new T(be(s),we);return e.castShadow=!0,e.receiveShadow=!0,e}function ye(a){const s=new H,e=new H;s.add(e);const[t,p,i,n,d]=K[a%K.length],o=a%3===1,l=N([O([[o?.63:.8,.186,.135],[.87,.183,.132],[1.03,.17,.121],[1.22,.194,.138],[1.31,.179,.113],[1.37,.075,.078]],t),O([[1.32,.064,.064],[1.42,.058,.058]],i),O([[1.378,.051,.069,.018,.004],[1.418,.079,.09,.014],[1.49,.101,.1],[1.56,.1,.099],[1.616,.081,.077],[1.64,.055,.053]],i,14),B(-.015,1.558,0,.106,.108,.104,n),B(.086,1.485,.004,.031,.024,.023,i),O([[1.31,.09,.085],[1.353,.083,.084],[1.368,.074,.074]],d),...a%2===0?[B(-.141,1.096,.014,.102,.158,.131,d)]:[]]);e.add(l);const g=[],r=[],b=[];for(const x of[-1,1]){const m=new H;m.position.set(-.01,.824,x*.083),e.add(m);const w=new H;w.position.set(.006,-.398,0),m.add(w),m.add(N([G(W(0,.015,0),W(.006,-.408,0),.089,.064,p)])),w.add(N([G(W(0,.015,0),W(-.017,-.351,0),.069,.044,p),B(.035,-.363,0,.118,.048,.054,4538698)])),g.push(m),r.push(w);const f=new H;f.position.set(.001,1.291,x*.173),e.add(f),f.add(N([G(W(0,0,0),W(-.038,-.257,x*.04),.072,.052,t),G(W(-.038,-.25,x*.04),W(.025,-.432,x*.052),.051,.035,t),B(.027,-.457,x*.052,.044,.059,.037,i)])),b.push(f)}return e.scale.setScalar([.99,1.075,1.015,.962,1.03][a%5]),{root:s,body:e,hips:g,knees:r,arms:b}}function Se(a,s){const t=new Float32Array(864),p=new X;p.setAttribute("position",new $(t,3).setUsage(re));const i=new T(p,new ee({color:6642796,side:te}));return i.name="A flock crossing above the rooftops",i.frustumCulled=!1,a.add(i),(n,d)=>{const o=Math.floor((n.x+110)/220),l=o*220;let g=0;for(let r=0;r<8;r++){const b=d*.27+r*.13,x=b+Math.PI*.5,m=l+Math.cos(b)*19+r%3*1.1,w=-29+Math.sin(b)*7+r%2*1.8,f=s.baseHeight(m)+6.7+Math.sin(b*.71+r)*.68+r*.21,y=.09+Math.sin(d*(6.6+r*.14)+r*2.1)*.18*Math.min(1,.27+.9*Math.max(0,Math.sin(d*.88+r))),c=(S,v,C)=>[m+Math.cos(x)*S-Math.sin(x)*C,f+v,w+Math.sin(x)*S+Math.cos(x)*C],u=(...S)=>{for(const v of S)t.set(v,g),g+=3},A=c(.155,.027,0),M=c(.025,.05,0),P=c(-.192,.005,0);for(const S of[-1,1]){const v=c(.08,0,S*.046),C=c(-.095,0,S*.034),U=c(-.015,y*.54,S*.177),h=c(-.163,y,S*.285);u(A,v,M,v,C,M,C,P,M,v,U,C,U,h,C,C,P,c(-.215,.01,S*.044))}}p.getAttribute("position").needsUpdate=!0}}function Ae(a,s){const e=Array.from({length:5},(n,d)=>ye(d));for(const n of e)n.root.name="Pedestrian on the far sidewalk",a.add(n.root);const t=Se(a,s),p=[17,41,63,96,124],i=151;return(n,d)=>{t(n,d);for(let o=0;o<e.length;o++){const l=e[o],g=o%2?-1:1,r=.69+o%3*.18,b=p[o]+g*d*r,x=b+i*Math.round((n.x-b)/i),m=x>1744&&x<1908,w=s.sectionAt(x);let f=m?-8.82-o%2*.26:-15.28-o%3*.23;if(w.id==="banks"&&(f=-6.91-o%2*.24),w.id==="les"&&(f=-6.94-o%2*.47),x>230&&x<294&&(f-=1.7),l.root.visible=Math.abs(x-n.x)<42,!l.root.visible)continue;const y=d*r*5.92+o*2.61;l.root.position.set(x,s.baseHeight(x)+(m?.134:-.025),f),l.root.rotation.y=g===1?.045:Math.PI+.035,l.body.position.y=-.028+.023*Math.cos(y*2),l.body.rotation.x=.018*Math.sin(y);for(let c=0;c<2;c++){const u=Math.sin(y+c*Math.PI);l.hips[c].rotation.z=.35*u+.035,l.knees[c].rotation.z=-.07-.54*Math.pow(Math.max(0,-Math.cos(y+c*Math.PI)),2),l.arms[c].rotation.z=-.215*u+.07}}}}class L extends T{constructor(s,e={}){super(s),this.isReflector=!0,this.type="Reflector",this.camera=new le;const t=this,p=e.color!==void 0?new I(e.color):new I(8355711),i=e.textureWidth||512,n=e.textureHeight||512,d=e.clipBias||0,o=e.shader||L.ReflectorShader,l=e.multisample!==void 0?e.multisample:4,g=new de,r=new F,b=new F,x=new F,m=new j,w=new F(0,0,-1),f=new q,y=new F,c=new F,u=new q,A=new j,M=this.camera,P=new ue(i,n,{samples:l,type:fe}),S=new pe({name:o.name!==void 0?o.name:"unspecified",uniforms:he.clone(o.uniforms),fragmentShader:o.fragmentShader,vertexShader:o.vertexShader});S.uniforms.tDiffuse.value=P.texture,S.uniforms.color.value=p,S.uniforms.textureMatrix.value=A,this.material=S,this.onBeforeRender=function(v,C,U){if(b.setFromMatrixPosition(t.matrixWorld),x.setFromMatrixPosition(U.matrixWorld),m.extractRotation(t.matrixWorld),r.set(0,0,1),r.applyMatrix4(m),y.subVectors(b,x),y.dot(r)>0)return;y.reflect(r).negate(),y.add(b),m.extractRotation(U.matrixWorld),w.set(0,0,-1),w.applyMatrix4(m),w.add(x),c.subVectors(b,w),c.reflect(r).negate(),c.add(b),M.position.copy(y),M.up.set(0,1,0),M.up.applyMatrix4(m),M.up.reflect(r),M.lookAt(c),M.far=U.far,M.updateMatrixWorld(),M.projectionMatrix.copy(U.projectionMatrix),A.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),A.multiply(M.projectionMatrix),A.multiply(M.matrixWorldInverse),A.multiply(t.matrixWorld),g.setFromNormalAndCoplanarPoint(r,b),g.applyMatrix4(M.matrixWorldInverse),f.set(g.normal.x,g.normal.y,g.normal.z,g.constant);const h=M.projectionMatrix;u.x=(Math.sign(f.x)+h.elements[8])/h.elements[0],u.y=(Math.sign(f.y)+h.elements[9])/h.elements[5],u.z=-1,u.w=(1+h.elements[10])/h.elements[14],f.multiplyScalar(2/f.dot(u)),h.elements[2]=f.x,h.elements[6]=f.y,h.elements[10]=f.z+1-d,h.elements[14]=f.w,t.visible=!1;const z=v.getRenderTarget(),D=v.xr.enabled,R=v.shadowMap.autoUpdate;v.xr.enabled=!1,v.shadowMap.autoUpdate=!1,v.setRenderTarget(P),v.state.buffers.depth.setMask(!0),v.autoClear===!1&&v.clear(),v.render(C,M),v.xr.enabled=D,v.shadowMap.autoUpdate=R,v.setRenderTarget(z);const V=U.viewport;V!==void 0&&v.state.viewport(V),t.visible=!0},this.getRenderTarget=function(){return P},this.dispose=function(){P.dispose(),t.material.dispose()}}}L.ReflectorShader={name:"ReflectorShader",uniforms:{color:{value:null},tDiffuse:{value:null},textureMatrix:{value:null}},vertexShader:`
		uniform mat4 textureMatrix;
		varying vec4 vUv;

		#include <common>
		#include <logdepthbuf_pars_vertex>

		void main() {

			vUv = textureMatrix * vec4( position, 1.0 );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			#include <logdepthbuf_vertex>

		}`,fragmentShader:`
		uniform vec3 color;
		uniform sampler2D tDiffuse;
		varying vec4 vUv;

		#include <logdepthbuf_pars_fragment>

		float blendOverlay( float base, float blend ) {

			return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );

		}

		vec3 blendOverlay( vec3 base, vec3 blend ) {

			return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );

		}

		void main() {

			#include <logdepthbuf_fragment>

			vec4 base = texture2DProj( tDiffuse, vUv );
			gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`};function Ce(a,s){const e={name:"Damp gutter",uniforms:{color:{value:new I},textureMatrix:{value:new j},tDiffuse:{value:null},clock:{value:0},seed:{value:0}},vertexShader:`
      uniform mat4 textureMatrix;
      varying vec4 reflection;
      varying vec2 patchUV;
      void main(){
        patchUV=uv;reflection=textureMatrix*vec4(position,1.);
        gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
      }`,fragmentShader:`
      varying vec2 patchUV;varying vec4 reflection;
      uniform sampler2D tDiffuse;uniform float clock,seed;
      float hash(vec2 v){return fract(sin(dot(v,vec2(37.9,153.8)))*45703.31);}
      float noise(vec2 v){vec2 i=floor(v),f=fract(v);f=f*f*(3.-2.*f);
        return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}
      void main(){
        vec2 p=patchUV*2.-1.;
        float edge=length(p*vec2(1.03,1.52))+.22*sin(p.x*8.1+seed)+.17*noise(p*vec2(18.,7.)+seed)+.075*noise(p*65.+seed);
        float wet=1.-smoothstep(.91,1.,edge);
        if(wet<.015)discard;
        vec2 sampleUV=reflection.xy/reflection.w;
        float ripples=sin(p.x*107.+p.y*17.+clock*.94)+sin(p.y*72.+clock*.8+p.x*18.);
        sampleUV+=vec2(ripples*.00065,noise(p*30.+clock*.06)*.0013);
        vec3 mirror=texture2D(tDiffuse,sampleUV).rgb;
        vec3 water=mix(vec3(.12,.12,.16),mirror,.78);
        gl_FragColor=vec4(water,(.54+.26*(1.-smoothstep(.79,.93,edge)))*wet);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`},t=new L(new ae(1,1),{textureWidth:320,textureHeight:192,multisample:0,clipBias:.002,shader:e});t.name="Reflections in the curb",t.material.transparent=!0,t.material.depthWrite=!1,t.rotation.order="ZYX",t.rotation.x=-Math.PI/2,t.visible=!1,a.add(t);const p=[-2.3,118,240.8,392,630.8,959,1274.6,1316,1424,1590,1696];let i=NaN;return(n,d)=>{let o=p[0];for(const l of p)Math.abs(l-n.x)<Math.abs(o-n.x)&&(o=l);if(t.visible=Math.abs(n.x-o)<18,!!t.visible){if(o!==i){i=o;const l=Math.sin(o*1.7)*.5+.5;t.position.set(o,s.baseHeight(o)-.077,-4.6),t.rotation.z=Math.atan(s.baseHeight(o+.5)-s.baseHeight(o-.5)),t.scale.set(5.6+4.5*l,1.8+.8*l,1),t.material.uniforms.seed.value=l*47}t.material.uniforms.clock.value=d}}}function Pe(){const a=document.createElement("canvas");a.width=a.height=128;const s=a.getContext("2d"),e=s.createRadialGradient(64,64,1,64,64,63);e.addColorStop(0,"rgba(24,23,30,.77)"),e.addColorStop(.36,"rgba(33,29,33,.52)"),e.addColorStop(.7,"rgba(37,32,39,.19)"),e.addColorStop(1,"rgba(37,32,39,0)"),s.fillStyle=e,s.fillRect(0,0,128,128);const t=new ve(a);return t.colorSpace=ge,t}function We(a,s){const e=new T(new ae(1,1),new ee({map:Pe(),transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2}));e.name="Ambient contact beneath the deck",e.rotation.x=-Math.PI/2,e.renderOrder=1,a.add(e);const t=[[0,-.66],[-.13,-.23],[-.42,-.31],[-.42,-.17],[-.7,.04],[-.46,.12],[-.53,.34],[-.24,.25],[-.25,.58],[-.1,.43],[0,.81],[.1,.43],[.25,.58],[.24,.25],[.53,.34],[.46,.12],[.7,.04],[.42,-.17],[.42,-.31],[.13,-.23]],p=[];t.forEach(([c,u],A)=>{const[M,P]=t[(A+1)%t.length];p.push(.055*c,.06*u,-.006*Math.abs(c),.055*M,.06*P,-.006*Math.abs(M),0,.004,.009)});const i=new X;i.setAttribute("position",new oe(p,3)),i.computeVertexNormals();const n=new J(i,new xe({color:16777215,side:te}),76);n.name="Falling autumn leaves",n.frustumCulled=!1,a.add(n);let d=372810;const o=()=>(d=Math.imul(d,1664525)+1013904223>>>0,d/4294967296),l=[],g=[11959092,13673810,12684602,10119471,13472329];for(let c=0;c<n.count;c++)l.push([o(),o(),o(),o(),o()]),n.setColorAt(c,new I(g[c%g.length]));const r=new me,b=Ae(a,s),x=Ce(a,s),m=new J(i,n.material,16);m.frustumCulled=!1,m.name="Leaves swept up by the wheels",m.count=0,a.add(m);for(let c=0;c<16;c++)m.setColorAt(c,new I(g[c*3%g.length]));const w=[];let f=NaN;const y=78;return function(u,A,M=!0){x(u,A),b(u,A),Number.isFinite(f)&&Math.abs(u.x-f)>5&&(w.length=0);const P=Math.floor(u.x/2.2),S=Number.isFinite(f)&&Math.abs(u.x-f)<4&&Math.floor(f/2.2)!==P;if(M&&S&&u.grounded&&u.speed>1.5&&Math.imul(P,2654435761)>>>29<5)for(let h=0;h<2;h++)w.push({x:u.x,z:u.z+(o()-.5)*.35,born:A,dx:-u.direction*(.32+o()*.61),dz:(o()-.5)*1.45,up:.48+o()*.67,angle:o()*6.28});f=u.x;let v=0;for(let h=w.length-1;h>=0;h--){const z=w[h],D=A-z.born;if(D>1.16){w.splice(h,1);continue}if(v>=16)continue;const R=z.x+z.dx*D,V=s.groundHeight(R)+.014,k=Math.max(0,(1.8*z.up-2.45*D)*D);r.position.set(R,V+k,z.z+z.dz*D),r.rotation.set(-Math.PI*.5+k*2.8,z.angle+k*4.1,z.angle+D*2.2),r.scale.setScalar(Math.min(1,(1.16-D)*4.4)*.69),r.updateMatrix(),m.setMatrixAt(v++,r.matrix)}m.count=v,m.instanceMatrix.needsUpdate=!0;const C=s.groundHeight(u.x),U=Math.max(0,u.y-C);e.position.set(u.x,C+.007,u.z),e.rotation.order="ZYX",e.rotation.z=u.groundPitch*u.direction,e.scale.set(1.12+U*.25,.43+U*.22,1),e.material.opacity=.66/(1+U*2.5);for(let h=0;h<l.length;h++){const[z,D,R,V,k]=l[h],Y=(R+A*(.044+V*.045))%1,_=A*(.65+k)+h*2,Z=y*z,Q=Z+y*Math.round((u.x-Z)/y)+1.7*Y+.43*Math.sin(_);r.position.set(Q,s.baseHeight(Q)+.18+(1-Y)*6.5+.14*Math.cos(_),-7.5+D*10+.3*Math.cos(_*.9)),r.rotation.set(.3+1.2*Math.sin(_*1.6),h+_*.65,.5*Math.cos(_*2)),r.scale.setScalar(.65+.68*k),r.updateMatrix(),n.setMatrixAt(h,r.matrix)}n.instanceMatrix.needsUpdate=!0}}export{We as addSceneDetail};
