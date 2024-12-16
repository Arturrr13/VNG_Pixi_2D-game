/* Please, don't do shit-code  */
Element.prototype.closest || (Element.prototype.closest = function(t) { for (var e = this; e;) { if (e.matches(t)) return e;e = e.parentElement } return null });

Element.prototype.matches || (Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector);

Object.assign || Object.defineProperty(Object, "assign", { enumerable: !1, configurable: !0, writable: !0, value: function(e) { "use strict"; if (null == e) throw new TypeError("Cannot convert first argument to object"); for (var t = Object(e), n = 1; n < arguments.length; n++) { var o = arguments[n]; if (null != o) for (var a = Object.keys(Object(o)), c = 0, b = a.length; c < b; c++) { var i = a[c], l = Object.getOwnPropertyDescriptor(o, i); void 0 !== l && l.enumerable && (t[i] = o[i]) } } return t } });

window.NodeList && !NodeList.prototype.forEach && (NodeList.prototype.forEach = Array.prototype.forEach);

function $$(e, o, t) { "function" != typeof o ? o = o || document : (t = o, o = document); var c = o.querySelectorAll(e); return c = Array.prototype.slice.call(o.querySelectorAll(e)), "function" == typeof t && c.forEach(function(e, o, c) { t(e, o, c) }), c }

function addCss(r, s) { var a = function(r) { Object.assign(r.style, s) }; if (Array.isArray(r))
        for (var n = r.length - 1; n >= 0; n--) a(r[n]);
    else a(r) }

function getElementIndex(e) { for (var n = 0; e = e.previousElementSibling;) n++; return n }

function h_el(r) { return !!(Array.isArray(r) && r.length > 0) }

function debugging() { [].forEach.call($$("*"), function(n) { n.style.outline = "1px solid #" + (~~(Math.random() * (1 << 24))).toString(16) }) }

function degrees_to_radians(degrees)
{
  // Store the value of pi.
  var pi = Math.PI;
  // Multiply degrees by pi divided by 180 to convert to radians.
  return degrees * (pi/180);
}

function render(time) {
  TWEEN.update(time);
  requestAnimationFrame(render);

}
render();


let wdpr = window.devicePixelRatio || 1;

let appSettings = {
  debug: false,
  xSprites: [], 
  scale: 1,
  items:{}
};

const canvasPArrent = $$('.main__canvas')[0];

let app = new PIXI.Application({
	width: canvasPArrent.offsetWidth * wdpr,
	height: canvasPArrent.offsetHeight * wdpr,
  backgroundAlpha: 0,
  transparent: true,
  eventMode: 'static'
}); 


globalThis.__PIXI_APP__ = app;


canvasPArrent.appendChild(app.view); 

let step = 'floor', theme = '', progress = 0, skinsData = []

let viewportSize = {
    width: app.renderer.width,
    height: app.renderer.height,
}


function playAnimBg(item,animation,repeat = false,callback){
  if(!item.spineData.findAnimation(animation)){
      console.warn(`not found animation "${animation}"`);
      if (callback) callback();
  }else{
      item.state.setAnimation(0, animation, repeat);
      if (callback && !repeat) item.state.tracks[0].listener = {
          complete: function () {
              item.state.tracks[0].listener = {complete: function () {}};
              callback()
          }
      }
  }
}

function setSkin(item,skin){
  if(!item.spineData.findSkin(skin)){
      console.warn(`not found skin "${skin}"`);
      return;
  }
  const skeleton = item.skeleton;
  skeleton.setSkin(null);
  skeleton.setSkinByName(skin);
  skeleton.setSlotsToSetupPose();
  const index = skinsData.findIndex(el => el.name === item.name)
  index > -1 ? skinsData[index].skin = skin : skinsData.push({name: item.name, skin: skin})
}

function findKeyInObj(obj,key){
  return obj.hasOwnProperty(key)
}


function addSpineItem(item){
  if(findKeyInObj(items,item)){
    const element = items[item];

    const skeletonArray = new PIXI.spine.TextureAtlas(element.atlas, function (line, callback) {
        let myBaseTexture = new PIXI.BaseTexture(element.imgData[line]);
        
        callback(myBaseTexture);
    });
    
    const atlasAttachmentLoader = new PIXI.spine.AtlasAttachmentLoader(skeletonArray);

    const spineJsonParser = new PIXI.spine.SkeletonJson(atlasAttachmentLoader);
    
    const spineData = spineJsonParser.readSkeletonData(element.skeleton);
    

    return new PIXI.spine.Spine(spineData);
}else{
    return new PIXI.spine.Spine(appSettings.xSprites[item].spineData); 
}
}

function addItem(item,visible = true){
  const returnItem = addSpineItem(item) 
  if(!returnItem) return false
  returnItem.visible = false
  returnItem.eventMode = "static"
  returnItem.interactive = true
  returnItem.buttonMode = true

  // if(returnItem.spineData.hash === 'joOkE2fuaJo'){
  //   const mouseDown = (e) => {
  //     if(step === 'floor'){
  //       playAnimBg(appSettings.items.floor,'initial_hover',true)
  //       fieldAnim('field', 1)
  //       fieldAnim('field2', 1)
  //       playAnimBg(appSettings.items.speech_bubble,'show/1_text_show',false)
  //       playAnimBg(appSettings.items.hand,'hide',false)
  //       playSound('bubble')
  //     }
  //   }
  //   returnItem.on('pointerdown', e => mouseDown(e))
  // }

  // if(item === 'tables'){
  //   const mouseDown = (e) => {
  //     if(step === 'table'){
  //       playAnimBg(appSettings.items.tables,`initial/hover_initial`, true)
  //       setSkin(appSettings.items.field, `japanese_table`)
  //       setSkin(appSettings.items.field2, `space_table`)
  //       fieldAnim('field', 1)
  //       fieldAnim('field2', 1)
  //     }
  //   }

  //   returnItem.on('pointerdown', e => mouseDown(e))
  // }

  // if(item === 'central_objects'){
  //   const mouseDown = (e) => {
  //     if(step === 'central_figure'){
  //       playAnimBg(appSettings.items.central_objects,`initial/hover_initial`, true)
  //       setSkin(appSettings.items.field, `japanese_central_figure`)
  //       setSkin(appSettings.items.field2, `space_central_figure`)
  //       fieldAnim('field', 1)
  //       fieldAnim('field2', 1)
  //     }
  //   }

  //   returnItem.on('pointerdown', e => mouseDown(e))
  // }

  if(item === 'field'){
    const mouseOver = () => playAnimBg(appSettings.items.field,`hover`, false)
    const mouseOut = () => playAnimBg(appSettings.items.field,`idle`, false)

    returnItem.on('pointerdown', e => mouseDownField('japanese'))
    returnItem.on('pointerover', mouseOver)
    returnItem.on('pointerout', mouseOut)
  }

  if(item === 'field2'){
    const mouseOver = () => playAnimBg(appSettings.items.field2,`hover`, false)
    const mouseOut = () => playAnimBg(appSettings.items.field2,`idle`, false)

    returnItem.on('pointerdown', e => mouseDownField('space'))
    returnItem.on('pointerover', mouseOver)
    returnItem.on('pointerout', mouseOut)
  }

  app.stage.addChild(returnItem); 

  returnItem.scale.set(appSettings.scale);

  returnItem.position.set(viewportSize.width/2,viewportSize.height/2);// центрируем по середине сцены

  if(appSettings.debug){ 
    const div = document.createElement('div');
    const buttons = $$('#buttons')[0]; 
    buttons.appendChild(div);
    
    const head = document.createElement('h2');
    head.innerHTML = item;
    div.appendChild(head);
    
    
    
    const headAnimations = document.createElement('h4');
    headAnimations.innerHTML = 'Animation list';
    div.appendChild(headAnimations);

    returnItem.spineData.animations.forEach(el=>{
        const button = document.createElement('button');
        button.innerHTML = el.name;
        button.addEventListener('click',e=>{
            playAnimBg(returnItem,el.name,true) 
        })
        div.appendChild(button);
    });
    
    
    
    
    const headSkins = document.createElement('h4');
    headSkins.innerHTML = 'Skins list';
    div.appendChild(headSkins);
    
    returnItem.spineData.skins.forEach(el=>{
        const button = document.createElement('button');
        button.innerHTML = el.name;
        button.addEventListener('click',e=>{
            
            returnItem.skeleton.setSkin(null);
            returnItem.skeleton.setSkinByName(el.name);
            returnItem.skeleton.setSlotsToSetupPose();
        })
        div.appendChild(button);
    });
    //   ////!!!\\\\
    
    const hr = document.createElement('hr'); 
    div.appendChild(hr);
}
  requestAnimationFrame(() => {
    returnItem.visible = visible;
  })
  returnItem.name = item;
  return returnItem; 
}


let texturesPromise = PIXI.Assets.load([]);


texturesPromise.then(onAssetsLoaded) 

function onAssetsLoaded(textures) { 
  if(textures){
      appSettings.xSprites = textures; 
  }
  
  $$('#buttons button',el=>{
      el.disabled  = false;
  });

  prepareMainGame();

};

let skinsStatus = app.screen.height >= app.screen.width ? 'v' : 'h'

function prepareMainGame() {
  appSettings.items.anchor_hand = addItem('anchor_hand')
  appSettings.items.BG = addItem('BG')
  appSettings.items.floor = addItem('floor')
  appSettings.items.bg_objects = addItem('bg_objects')
  appSettings.items.tables = addItem('tables')
  appSettings.items.central_objects = addItem('central_objects')
  appSettings.items.score_notification = addItem('score_notification')
  appSettings.items.speech_bubble = addItem('speech_bubble')
  appSettings.items.fade_screen = addItem('fade_screen', false)
  appSettings.items.score = addItem('score')
  appSettings.items.logo = addItem('logo')
  appSettings.items.girl = addItem('girl')
  appSettings.items.CTA_text = addItem('CTA_text', false)
  appSettings.items.CTA_button = addItem('CTA_button', false)

  setSkin(appSettings.items.anchor_hand, `${skinsStatus}`)
  setSkin(appSettings.items.BG, `${skinsStatus}`)
  setSkin(appSettings.items.floor, `${skinsStatus}`)
  setSkin(appSettings.items.bg_objects, `initial/${skinsStatus}`)
  setSkin(appSettings.items.tables, `initial/${skinsStatus}`)
  setSkin(appSettings.items.central_objects, `initial/${skinsStatus}`)
  setSkin(appSettings.items.girl, `${skinsStatus}`)
  setSkin(appSettings.items.logo, `${skinsStatus}`)
  setSkin(appSettings.items.score, `${skinsStatus}`)
  setSkin(appSettings.items.score_notification, `${skinsStatus}`)
  setSkin(appSettings.items.speech_bubble, `japanese_style/${skinsStatus}`)
  setSkin(appSettings.items.fade_screen, `default`)
  setSkin(appSettings.items.CTA_text, `${skinsStatus}`)
  setSkin(appSettings.items.CTA_button, `play_again/${skinsStatus}`)
  
  playAnimBg(appSettings.items.anchor_hand,'step_1',true)
  playAnimBg(appSettings.items.BG,'animation',true)
  playAnimBg(appSettings.items.floor,'initial_hover',true)
  playAnimBg(appSettings.items.bg_objects,'idle_for_all',true)
  playAnimBg(appSettings.items.tables,'idle_for_all',true)
  playAnimBg(appSettings.items.central_objects,'idle_for_all',true)
  playAnimBg(appSettings.items.girl,'idle',true)
  playAnimBg(appSettings.items.logo,'idle',true)
  playAnimBg(appSettings.items.score,'idle/0',true)
  appSettings.items.score_notification.alpha = 0
  playAnimBg(appSettings.items.speech_bubble,'show/star_text_show',false)
  playAnimBg(appSettings.items.fade_screen,'idle',true)
  playAnimBg(appSettings.items.CTA_text,'idle_ok',true)
  playAnimBg(appSettings.items.CTA_button,'idle_CTA',true)

  playSound('bg')
  resize()

  PIXI.setTimeout(2, () => {
    playAnimBg(appSettings.items.speech_bubble,'show/1_text_show',false)
    appSettings.items.field = addItem('field', false)
    appSettings.items.field.alpha = 0
    appSettings.items.field2 = addItem('field2', false)
    appSettings.items.field2.alpha = 0
    appSettings.items.hand = addItem('hand')

    setSkin(appSettings.items.field, `japanese_floor`)
    setSkin(appSettings.items.field2, `space_floor`)
    setSkin(appSettings.items.hand, `${skinsStatus}`)

    playAnimBg(appSettings.items.field,'idle',true)
    playAnimBg(appSettings.items.field2,'idle',true)
    playAnimBg(appSettings.items.hand,'pointing',true)

    resize()

    fieldAnim('field', 1)
    fieldAnim('field2', 1)
  })
}


function searchSound(sound){
  if(!PIXI.sound.exists(sound)){
      console.warn(`not found sound "${sound}"`)
      return
  }
  return PIXI.sound.find(sound)
}
// ////!!!\\\\

function playSound(sound){
  const s = searchSound(sound)
  if(sound === 'bg'){
    s._loop = true
    s.volume = 0.5
  } 
  //s.volume = 0.5
  s.play()
}
// ////!!!\\\\

const fieldAnim = (el, opacity, visible = true) => {
  new TWEEN.Tween(appSettings.items[el])
  .to({ alpha: opacity }, 350)
  .easing(TWEEN.Easing.Cubic.InOut)
  .start()

  playSound('choose')
  requestAnimationFrame(() => appSettings.items[el].visible = visible)
  if(visible){
    playAnimBg(appSettings.items.hand,'show',false)
    PIXI.setTimeout(.5, () => playAnimBg(appSettings.items.hand,'pointing',true))
  } else {
    playAnimBg(appSettings.items.hand,'hide',false)
  }
}

const mouseDownField = (th) => {
      playSound('buy')
      if(step === 'floor') {
        theme = th
        setSkin(appSettings.items.speech_bubble, `${th}_style/${skinsStatus}`)
        playAnimBg(appSettings.items.speech_bubble,'show/2_text_show',false)
        playSound('bubble')
        playAnimBg(appSettings.items.floor,`initial_to_${th}`, false)
        playAnimBg(appSettings.items.bg_objects,`initial_hide`, false)
        appSettings.items.score_notification.alpha = 1
        playAnimBg(appSettings.items.score_notification,'show/show_0_+100',false)
        PIXI.setTimeout(.65, () => {
          setSkin(appSettings.items.bg_objects, `${th}/${skinsStatus}`)
          playAnimBg(appSettings.items.bg_objects,`show_jap+space`, false)
          playAnimBg(appSettings.items.score,`up_score/0_to_100`, false)
          playAnimBg(appSettings.items.score_notification,'hide/hide_0_+100',false)
          step = 'table'
          progress++
        })

        PIXI.setTimeout(1.25, () => {
          playAnimBg(appSettings.items.tables,`initial/hover_initial`, true)
          setSkin(appSettings.items.field, `japanese_table`)
          setSkin(appSettings.items.field2, `space_table`)
          fieldAnim('field', 1)
          fieldAnim('field2', 1)
        })
      } else if(step === 'table'){
        playAnimBg(appSettings.items.speech_bubble,'show/3_text_show',false)
        playSound('bubble')
        playAnimBg(appSettings.items.tables,`initial/hide_initial`, false)
        if(theme === th) playAnimBg(appSettings.items.score_notification,'show/show_100_+100',false)
        else playAnimBg(appSettings.items.score_notification,'show/show_100_-100',false)
        PIXI.setTimeout(.65, () => {
          setSkin(appSettings.items.tables, `${th}/${skinsStatus}`)
          playAnimBg(appSettings.items.tables,`show_jap+space`, false)
          if(theme === th){
            playAnimBg(appSettings.items.score,`up_score/100_to_200`, false)
            playAnimBg(appSettings.items.score_notification,'hide/hide_100_+100',false)
            progress++
          } else {
            playAnimBg(appSettings.items.score,`down_score/100_to_0`, false)
            playAnimBg(appSettings.items.score_notification,'hide/hide_100_-100',false)
            progress--
          }
          step = 'central_figure'
        })

        PIXI.setTimeout(1.25, () => {
          playAnimBg(appSettings.items.central_objects,`initial/hover_initial`, true)
          setSkin(appSettings.items.field, `japanese_central_figure`)
          setSkin(appSettings.items.field2, `space_central_figure`)
          fieldAnim('field', 1)
          fieldAnim('field2', 1)
        })
      } else {
        playAnimBg(appSettings.items.central_objects,`initial/hide_initial`, false)
        //playAnimBg(appSettings.items.speech_bubble,'show/3_text_show',false)
        playSound('bubble')
        if(progress == 2){
          if(theme === th) playAnimBg(appSettings.items.score_notification,'show/show_200_+100',false)
          else playAnimBg(appSettings.items.score_notification,'show/show_200_-100',false)
        } else {
          if(theme === th) playAnimBg(appSettings.items.score_notification,'show/show_0_+100',false)
          else playAnimBg(appSettings.items.score_notification,'show/show_0_-100',false)
        }
        PIXI.setTimeout(.65, () => {
          setSkin(appSettings.items.central_objects, `${th}/${skinsStatus}`)
          playAnimBg(appSettings.items.central_objects,`show_jap+space`, false)
          if(theme === th){
            if(progress == 2){
              playAnimBg(appSettings.items.score,`up_score/200_to_300`, false)
              playAnimBg(appSettings.items.score_notification,'hide/hide_200_+100',false)
            } else {
              playAnimBg(appSettings.items.score,`up_score/0_to_100`, false)
              playAnimBg(appSettings.items.score_notification,'hide/hide_0_+100',false)
            }
            progress++
          } else {
            if(progress == 2){
              playAnimBg(appSettings.items.score,`down_score/200_to_100`, false)
              playAnimBg(appSettings.items.score_notification,'hide/hide_200_-100',false)
            } else {
              playAnimBg(appSettings.items.score,`down_score/100_to_0`, false)
              playAnimBg(appSettings.items.score_notification,'hide/hide_0_-100',false)
            }
            progress--
          }
          requestAnimationFrame(() => {
            appSettings.items.fade_screen.visible = true
            appSettings.items.CTA_text.visible = true
            appSettings.items.CTA_button.visible = true
            appSettings.items.speech_bubble.visible = false
          })

          appSettings.items.CTA_button.off('pointerdown', ctaDown)
          if(progress == 3){
            playAnimBg(appSettings.items.CTA_text,`idle_well`, false) 
            playAnimBg(appSettings.items.girl,`go_to_happy_end`, false) 
            setSkin(appSettings.items.CTA_button, `play_game/${skinsStatus}`)
            playSound('well')
            PIXI.setTimeout(1, () => {
              playAnimBg(appSettings.items.girl,`happy_end`, true)
              appSettings.items.CTA_button.on('pointerdown', ctaDown)
            })
          } else if(progress == 1) failEnd('ok')
            else failEnd('fail')
        })
      }
      fieldAnim('field', 0, false)
      fieldAnim('field2', 0, false)
}

const ctaDown = () => {
  playSound('click')
  if(progress == 3){
    console.log('nice')
  } else {
    step = 'floor'
    progress = 0
    app.stage.removeChild(appSettings.items.bg_objects)
    PIXI.setTimeout(.15, () => {
      app.stage.removeChild(appSettings.items.bg_objects)
      delete appSettings.items.bg_objects
      appSettings.items.bg_objects = addItem('bg_objects')
      setSkin(appSettings.items.bg_objects, `initial/${skinsStatus}`)
      playAnimBg(appSettings.items.bg_objects,'idle_for_all',true)
      appSettings.items.bg_objects.visible = true
      for(let index in appSettings.items){
        if(index === 'floor' || index === 'BG' || index === 'bg_objects'){
          appSettings.items[index].zIndex = 0
        }else if(index === 'tables' || index === 'central_objects'){
          appSettings.items[index].zIndex = 1
        }else if(index === 'hand' || index === 'field' || index === 'field2' || index === 'score_notification' || index === 'speech_bubble'){
          appSettings.items[index].zIndex = 2
        }else{
          appSettings.items[index].zIndex = 3
        }
      }
      app.stage.sortableChildren = true
      resize()
    })
    fieldAnim('field', 1)
    fieldAnim('field2', 1)
    setSkin(appSettings.items.tables, `initial/${skinsStatus}`)
    setSkin(appSettings.items.central_objects, `initial/${skinsStatus}`)
    setSkin(appSettings.items.field, `japanese_floor`)
    setSkin(appSettings.items.field2, `space_floor`)
    playAnimBg(appSettings.items.floor,'initial_idle',true)
    playAnimBg(appSettings.items.central_objects,'idle_for_all',true)
    playAnimBg(appSettings.items.girl,'idle',true)
    appSettings.items.fade_screen.visible = false
    appSettings.items.CTA_text.visible = false
    appSettings.items.CTA_button.visible = false
    appSettings.items.speech_bubble.visible = true
    playAnimBg(appSettings.items.speech_bubble,'show/1_text_show',false)
  }
}

const failEnd = (el) => {
  playAnimBg(appSettings.items.CTA_text,`idle_${el}`, false)
  playAnimBg(appSettings.items.girl,`go_to_fail`, false) 
  setSkin(appSettings.items.CTA_button, `play_again/${skinsStatus}`)
  playSound(el)
  PIXI.setTimeout(1.33, () => {
    playAnimBg(appSettings.items.girl,`fail`, true)
    appSettings.items.CTA_button.on('pointerdown', ctaDown)
  }) 
}


function resize() {
  const portrait = window.matchMedia("(orientation: portrait)").matches;
  
  wdpr = window.devicePixelRatio || 1;

  app.renderer.view.style.width = canvasPArrent.offsetWidth + 'px';
  app.renderer.view.style.height = canvasPArrent.offsetHeight + 'px';
  app.renderer.resize(canvasPArrent.offsetWidth * wdpr,canvasPArrent.offsetHeight* wdpr);

  viewportSize = {
      width: app.renderer.width,
      height: app.renderer.height,
  }

  const changePos = (item) => {
    const handPos = appSettings.items.anchor_hand.skeleton.findBone(`${skinsStatus}_hand_base`)
    const fieldsPos = appSettings.items.anchor_hand.skeleton.findBone(`${skinsStatus}_fields`)
    if(item){
      if(skinsStatus === 'h'){
        item.scale.set(appSettings.scale * 1.25)
        item.position.set(viewportSize.width / 2, viewportSize.height / 2)
        if(item.name === 'field'){
          item.position.set(viewportSize.width / 1.83 + fieldsPos.x * appSettings.scale, viewportSize.height / 2 - fieldsPos.y * appSettings.scale)
          item.rotation = 0.1
        } 
        if(item.name === 'field2'){
          item.position.set(viewportSize.width / 2.17 + fieldsPos.x * appSettings.scale, viewportSize.height / 2 - fieldsPos.y * appSettings.scale)
          item.rotation = -0.1
        } 
        if(item.name === 'hand') item.position.set(viewportSize.width / 2 + handPos.x * appSettings.scale, viewportSize.height / 2 - handPos.y * appSettings.scale * 1.25)
      } else {
        item.scale.set(appSettings.scale * 2.25)
        item.position.set(viewportSize.width / 2, viewportSize.height / 2)
        if(item.name === 'field'){
          item.position.set(viewportSize.width / 1.7 + fieldsPos.x * appSettings.scale, viewportSize.height / 2 - fieldsPos.y * appSettings.scale)
          item.rotation = 0.1
        } 
        if(item.name === 'field2'){
          item.position.set(viewportSize.width / 2.3 + fieldsPos.x * appSettings.scale, viewportSize.height / 2 - fieldsPos.y * appSettings.scale)
          item.rotation = -0.1
        }
        if(item.name === 'hand') item.position.set(viewportSize.width / 2 + handPos.x * appSettings.scale, viewportSize.height / 2 - handPos.y * appSettings.scale * 12.25)
      }

      if(item.name === 'fade_screen') item.scale.set(appSettings.scale * 2.25)
    }
  }

  //set scale
    appSettings.scale = app.screen.width / 2 / 1920
    app.screen.height / 100 * 66.6 >= app.screen.width ? skinsStatus = 'v' : skinsStatus = 'h'
  //set scale

  skinsData.forEach(el => {
    if(el.skin.slice(-1) !== skinsStatus){
      if(el.name !== 'field' && el.name !== 'field2' && el.name !== 'fade_screen' && el.name !== 'bg_objects') setSkin(appSettings.items[el.name], el.skin.slice(0, -1) + skinsStatus)
      else if(el.name === 'bg_objects'){
        app.stage.removeChild(appSettings.items.bg_objects)
        PIXI.setTimeout(.15, () => {
          app.stage.removeChild(appSettings.items.bg_objects)
          delete appSettings.items.bg_objects
          appSettings.items.bg_objects = addItem('bg_objects')
          setSkin(appSettings.items.bg_objects, el.skin.slice(0, -1) + skinsStatus)
          playAnimBg(appSettings.items.bg_objects,'idle_for_all',true)
          for(let index in appSettings.items){
            if(index === 'floor' || index === 'BG' || index === 'bg_objects'){
              appSettings.items[index].zIndex = 0
            }else if(index === 'tables' || index === 'central_objects'){
              appSettings.items[index].zIndex = 1
            }else if(index === 'hand' || index === 'field' || index === 'field2' || index === 'score_notification' || index === 'speech_bubble'){
              appSettings.items[index].zIndex = 2
            }else{
              appSettings.items[index].zIndex = 3
            }
          }
          app.stage.sortableChildren = true
          resize()
        })
      }
    }
  })

  changePos(appSettings.items.anchor_hand)
  changePos(appSettings.items.BG)
  changePos(appSettings.items.floor)
  changePos(appSettings.items.CTA_text)
  changePos(appSettings.items.CTA_button)
  changePos(appSettings.items.field)
  changePos(appSettings.items.field2)
  changePos(appSettings.items.tables)
  changePos(appSettings.items.girl)
  changePos(appSettings.items.hand)
  changePos(appSettings.items.logo)
  changePos(appSettings.items.score)
  changePos(appSettings.items.score_notification)
  changePos(appSettings.items.speech_bubble)
  changePos(appSettings.items.bg_objects)
  changePos(appSettings.items.central_objects)
  changePos(appSettings.items.fade_screen)
}


window.addEventListener("resize", resize);
window.addEventListener("orientationchange", resize);
