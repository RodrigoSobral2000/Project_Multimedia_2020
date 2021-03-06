"use strict";

(function() {
	window.addEventListener("load", main);
}());

const TOT_HEROES=2
const ID_SASHA=0, ID_YIN=1
const TOT_LEVELS=3, TOT_CHAPTERS=5
const BLOCK_SIZE=32
const CHARACTER_SIZE=40
const MAX_LOOSING_HP=50, MIN_LOOSING_HP=20

function main() {
	var canvas = document.getElementById("canvas")
	var ctx = canvas.getContext("2d")
	var heroes, healths
	var deadHeroes= new Array(TOT_HEROES)
	LoadCareer()
	var training_camp= new Array(TOT_LEVELS), jungle= new Array(TOT_LEVELS), warehouse= new Array(TOT_LEVELS), lab= new Array(TOT_LEVELS), final= new Array(TOT_LEVELS)

	//	LOAD ALL MAPS
	for (let i = 0; i < TOT_LEVELS; i++) {
		training_camp[i]= new Nivel(i+1, "training_camp", "../resources/images/maps/Training Camp/level"+(i+1)+".png", canvas, ctx)
		jungle[i]= new Nivel(i+1, "jungle", "../resources/images/maps/Jungle/level"+(i+1)+".png", canvas, ctx)
		warehouse[i]= new Nivel(i+1, "warehouse", "../resources/images/maps/Warehouse/level"+(i+1)+".png", canvas, ctx)
		lab[i]= new Nivel(i+1, "lab", "../resources/images/maps/Lab/level"+(i+1)+".png", canvas, ctx)
		if (i!=TOT_LEVELS-1) final[i]= new Nivel(i+1, "escape", "../resources/images/maps/Escape/level"+(i+1)+".png", canvas, ctx)
		else final[i]= new Nivel(i+1, "final_stage", "../resources/images/maps/Escape/level"+(i+1)+".png", canvas, ctx)
	}

	document.addEventListener('keydown',backMainMenu)
	playBackgroundMusic()

	initAllComponents(ctx)
	canvas.addEventListener("initend", charInitEnd)

	function charInitEnd(ev) {
		heroes= ev.heroes
		healths= ev.healths

		heroes[ID_SASHA].img=heroes[ID_SASHA].stopped_sprites[1]
		heroes[ID_YIN].img=heroes[ID_YIN].stopped_sprites[1]
		heroes[ID_SASHA].imgData=heroes[ID_SASHA].getImageData()
		heroes[ID_YIN].imgData=heroes[ID_YIN].getImageData()

		prepareEnemiesBlocks(training_camp, warehouse, jungle, lab, final, heroes[ID_SASHA].bullets)

		ctx.drawImage(training_camp[0].backgroundLevel, 0, 0, ctx.canvas.width, ctx.canvas.height)
		drawBlocks(ctx, training_camp[0].hardBlockArray)
		drawSprites(ctx, training_camp[0].allEnemies)
		drawSprites(ctx, heroes)
		animLoop(ctx, heroes, [training_camp, warehouse, jungle, lab, final], healths, deadHeroes)
	}
}

function LoadCareer() {
	let career = JSON.parse(localStorage.getItem('career'));
	return career
}

function playBackgroundMusic() {
	if (localStorage.getItem('sound') === null) {
		var backgroundMusic = new Sound(1, 1)
		localStorage.setItem('sound', JSON.stringify(backgroundMusic));
	} else {
		var backgroundMusic = JSON.parse(localStorage.getItem('sound'));
	}
	var sound = new Audio("../../resources/sounds/menuBackgroundMusic.mp3")
	sound.volume = backgroundMusic.volume
	sound.loop = true
	sound.autoplay = true
	sound.play()
}

function initAllComponents(ctx) {
	var ids=["Left", "Right", "Up", "Down"]
	var heroes = new Array(TOT_HEROES)
	heroes[ID_SASHA] = new Personagem(100, 360, CHARACTER_SIZE, CHARACTER_SIZE, 2)
	heroes[ID_YIN]= new Personagem(50, 400, CHARACTER_SIZE, CHARACTER_SIZE, 2)
	
	var sashaSprite, yinSprite, auxYin, auxSasha, bullet_sprite
	var nLoad = 0
	//	bullets + posiçoes paradas + posiçoes caminhando
	var totLoad= 8 + 2*12

	// LOAD STOPPED HEROES
	for (let i=0; i<4; i++) {
		sashaSprite= new Image()
		yinSprite= new Image()
		yinSprite.id= "yin"+ids[i]
		sashaSprite.id= "sasha"+ids[i]
		yinSprite.src= "../resources/images/heroes/yin_sprite"+ids[i]+"1.png"
		sashaSprite.src="../resources/images/heroes/Sasha_sprite"+ids[i]+"1.png"
		yinSprite.addEventListener("load", imgLoadedHandler)
		sashaSprite.addEventListener("load", imgLoadedHandler)		
	}

	// LOAD WALKING HEROES
	for (let i = 0; i < 4; i++) {
		yinSprite= new Image()
		sashaSprite= new Image()
		auxSasha= new Image()
		auxYin= new Image()
		yinSprite.id= "yin"+ids[i]+"2"
		sashaSprite.id= "sasha"+ids[i]+"2"
		auxYin.id="yin"+ids[i]+"3"
		auxSasha.id="sasha"+ids[i]+"3"
		yinSprite.src= "../resources/images/heroes/yin_sprite"+ids[i]+"2.png"
		sashaSprite.src="../resources/images/heroes/Sasha_sprite"+ids[i]+"2.png"
		auxYin.src= "../resources/images/heroes/yin_sprite"+ids[i]+"3.png"
		auxSasha.src="../resources/images/heroes/Sasha_sprite"+ids[i]+"3.png"
		yinSprite.addEventListener("load", imgLoadedHandler)
		sashaSprite.addEventListener("load", imgLoadedHandler)
		auxYin.addEventListener("load", imgLoadedHandler)
		auxSasha.addEventListener("load", imgLoadedHandler)
	}

	//	LOAD BULLETS
	for (let i = 0, j=0; i < 8; j++, i++) {
		bullet_sprite= new Image()
		if (i==4 || i==6) j=0
		if (i<4) {
			bullet_sprite.id="bullet"+ids[j]
			bullet_sprite.src= "../resources/images/bullet"+ids[j]+".png"
		} else if (i<6) {
			bullet_sprite.id="bulletDown"+ids[j]
			bullet_sprite.src= "../resources/images/bulletDown"+ids[j]+".png"
		} else {
			bullet_sprite.id="bulletUp"+ids[j]
			bullet_sprite.src= "../resources/images/bulletUp"+ids[j]+".png"
		}
		bullet_sprite.addEventListener("load", imgLoadedHandler)
	}

	function imgLoadedHandler(ev) {
		var img = ev.target
		if (img.id.includes("sasha")==true) {
			if (img.src.includes("1.png")) {
				if (img.id.includes(ids[0])) heroes[ID_SASHA].stopped_sprites[0]=img
				else if (img.id.includes(ids[1])) heroes[ID_SASHA].stopped_sprites[1]=img
				else if (img.id.includes(ids[2])) heroes[ID_SASHA].stopped_sprites[2]=img
				else if (img.id.includes(ids[3])) heroes[ID_SASHA].stopped_sprites[3]=img
			} else {
				if (img.id.includes(ids[0])) heroes[ID_SASHA].walking_sprites[0].push(img)
				else if (img.id.includes(ids[1])) heroes[ID_SASHA].walking_sprites[1].push(img)
				else if (img.id.includes(ids[2])) heroes[ID_SASHA].walking_sprites[2].push(img)
				else if (img.id.includes(ids[3])) heroes[ID_SASHA].walking_sprites[3].push(img)
			}
		} else if (img.id.includes("yin")==true) {
			if (img.src.includes("1.png")) {
				if (img.id.includes(ids[0])) heroes[ID_YIN].stopped_sprites[0]=img
				else if (img.id.includes(ids[1])) heroes[ID_YIN].stopped_sprites[1]=img
				else if (img.id.includes(ids[2])) heroes[ID_YIN].stopped_sprites[2]=img
				else if (img.id.includes(ids[3])) heroes[ID_YIN].stopped_sprites[3]=img
			} else {
				if (img.id.includes(ids[0])) heroes[ID_YIN].walking_sprites[0].push(img)
				else if (img.id.includes(ids[1])) heroes[ID_YIN].walking_sprites[1].push(img)
				else if (img.id.includes(ids[2])) heroes[ID_YIN].walking_sprites[2].push(img)
				else if (img.id.includes(ids[3])) heroes[ID_YIN].walking_sprites[3].push(img)
			}
		} else if (img.id.includes("bullet")==true) {
			heroes[ID_SASHA].bullets.push(img)
			heroes[ID_YIN].bullets.push(img)
		}

		nLoad++	
		if (nLoad == totLoad) {
			var ev2 = new Event("initend");
			ev2.heroes= heroes
			ev2.healths= new Healths(heroes[ID_SASHA].health, heroes[ID_YIN].health)
			ctx.canvas.dispatchEvent(ev2);
		}
	}
}

function prepareEnemiesBlocks(training_camp, warehouse, jungle, lab, final, bullets) {
	for (let map = 0; map < TOT_LEVELS; map++) {

		//	ENEMIES
		for (let i = 0; i < training_camp[map].tot_enemies; i++) {
			training_camp[map].allEnemies[i].bullets= bullets
			training_camp[map].allEnemies[i].img = training_camp[map].allEnemies[i].stopped_sprites[3]
			training_camp[map].allEnemies[i].imgData = training_camp[map].allEnemies[i].getImageData()
		} for (let i = 0; i < warehouse[map].tot_enemies; i++) {
			warehouse[map].allEnemies[i].bullets= bullets
			warehouse[map].allEnemies[i].img = warehouse[map].allEnemies[i].stopped_sprites[3]
			warehouse[map].allEnemies[i].imgData = warehouse[map].allEnemies[i].getImageData()
		} for (let i = 0; i < jungle[map].tot_enemies; i++) {
			jungle[map].allEnemies[i].bullets= bullets
			jungle[map].allEnemies[i].img = jungle[map].allEnemies[i].stopped_sprites[3]
			jungle[map].allEnemies[i].imgData = jungle[map].allEnemies[i].getImageData()
		} for (let i = 0; i < lab[map].tot_enemies; i++) {
			lab[map].allEnemies[i].bullets= bullets
			lab[map].allEnemies[i].img = lab[map].allEnemies[i].stopped_sprites[3]
			lab[map].allEnemies[i].imgData = lab[map].allEnemies[i].getImageData()
		} for (let i = 0; i < final[map].tot_enemies; i++) {
			final[map].allEnemies[i].bullets= bullets
			final[map].allEnemies[i].img = final[map].allEnemies[i].stopped_sprites[3]
			final[map].allEnemies[i].imgData = final[map].allEnemies[i].getImageData()
		}

		//	WALL BLOCKS
		let block
		for (let i = 0; i < training_camp[map].hardBlockArray.length; i++) {
			for (let j = 0; j < training_camp[map].hardBlockArray[i].length; j++) {
				if ((block=training_camp[map].hardBlockArray[i][j])!=0) block.imgData=block.getImageData()
				if ((block=warehouse[map].hardBlockArray[i][j])!=0) block.imgData=block.getImageData()
				if ((block=jungle[map].hardBlockArray[i][j])!=0) block.imgData=block.getImageData()
				if ((block=lab[map].hardBlockArray[i][j])!=0) block.imgData=block.getImageData()
				if ((block=final[map].hardBlockArray[i][j])!=0) block.imgData=block.getImageData()
			}
		}
	} 
}

function drawSprites(ctx, sprites) {
	for (let i=0; i < sprites.length; i++) {
		if (sprites[i]!=undefined) sprites[i].draw(ctx);
	}
}

function drawBlocks(ctx, blocks) {
	for (let i=0; i < blocks.length; i++) {
		for (let j = 0; j<blocks[i].length; j++) {
			if (blocks[i][j]!=0) blocks[i][j].draw(ctx);
		}
	}
}

let actualChapter=0
let actualLevel=0
function animLoop(ctx, heroes, chapters, healths, deadHeroes) {
	var al = function() { animLoop(ctx, heroes, chapters, healths, deadHeroes) }
	window.requestAnimationFrame(al)
	
	renderGame(ctx, heroes, chapters, healths, deadHeroes)
}

function renderGame(ctx, heroes, chapters, healths, deadHeroes) {
	let ch= ctx.canvas.height
	let cw= ctx.canvas.width
	let enemies= chapters[actualChapter][actualLevel].allEnemies
	let hardBlockArray= chapters[actualChapter][actualLevel].hardBlockArray

	detectKeyboard(heroes, enemies, ctx)

	//	INTERSECTIONS WITH BLOCKS
	allBlockColisions(heroes[ID_SASHA], hardBlockArray, ctx)
	allBlockColisions(heroes[ID_YIN], hardBlockArray, ctx)

	for (let i = 0; i < chapters[actualChapter][actualLevel].tot_enemies; i++) {
		if (heroes[ID_SASHA]!=undefined) heroes[ID_SASHA].detectIntersection(enemies[i], ctx)
		if (heroes[ID_YIN]!=undefined) heroes[ID_YIN].detectIntersection(enemies[i], ctx)
		renderBullets(ctx, enemies, i, heroes, chapters[actualChapter][actualLevel].hardBlockArray, healths, deadHeroes)
		allBlockColisions(enemies[i], hardBlockArray, ctx)
		if (enemies[i]!=undefined) enemies[i].updateAimFollow(heroes, hardBlockArray ,ctx)
	}

	//	DRAW BULLETS WHEN FIRING
	renderBullets(ctx, heroes, ID_SASHA, enemies, chapters[actualChapter][actualLevel].hardBlockArray, undefined, undefined)
	renderBullets(ctx, heroes, ID_YIN, enemies, chapters[actualChapter][actualLevel].hardBlockArray, undefined, undefined)

	//	HEROES MOVEMENT AND INTERSECTIONS
	if (heroes[ID_SASHA]!=undefined) {
		heroes[ID_SASHA].detectIntersection(heroes[ID_YIN], ctx)
		heroes[ID_SASHA].moving(cw, ch)
	} if (heroes[ID_YIN]!=undefined) {
		heroes[ID_YIN].detectIntersection(heroes[ID_SASHA], ctx)
		heroes[ID_YIN].moving(cw, ch)
	}

	ctx.clearRect(0, 0, cw, ch)
	//	=====================
	//	DRAW EVERYTING HERE
	//	DRAW MAP
	ctx.drawImage(chapters[actualChapter][actualLevel].backgroundLevel, 0, 0, cw, ch)
	drawBlocks(ctx, hardBlockArray)
	//	DRAW CHARACTERES
	drawSprites(ctx, heroes)
	drawSprites(ctx, enemies)
	//	DRAW BULLETS
	if (heroes[ID_SASHA]!=undefined) drawSprites(ctx, heroes[ID_SASHA].activated_bullets)
	if (heroes[ID_YIN]!=undefined) drawSprites(ctx, heroes[ID_YIN].activated_bullets)
	for (let i = 0; i < chapters[actualChapter][actualLevel].tot_enemies; i++) {
		if (enemies[i]!=undefined) drawSprites(ctx, enemies[i].activated_bullets)
	}
	
	//	=====================
	//	NEW LEVEL
	if (levelPassed(enemies)==true && actualChapter<TOT_CHAPTERS && actualLevel<TOT_LEVELS) {
		if (actualLevel==TOT_LEVELS-1) { actualChapter++; actualLevel=0 }
		else actualLevel++
		updateHeros(heroes, healths, deadHeroes)	
	}
}

function renderBullets(ctx, friendly, own, hostile, mapBlocks, healths, deadHeroes) {
	var shooter= friendly[own]
	let bullets
	if (shooter==undefined || (bullets=shooter.activated_bullets).length==0) return
	let cw=ctx.canvas.width, ch=ctx.canvas.height
	let moving_flag
	let intersectsHostile, intersectsFriendly

	for (let i=0; i<bullets.length; i++) {
		moving_flag=false
		//	CHECK THE BULLETS FIRING
		if (bullets[i]==undefined) 
		return

		//	CHECK LIMITS OF THE GAME CANVAS
		if (bullets[i].x>0 && bullets[i].x+bullets[i].width<cw && bullets[i].y>0 && bullets[i].y+bullets[i].height<ch) {
			if (bulletsBlocksIntersection(bullets[i], mapBlocks)==true) { shooter.activated_bullets.splice(i,1); return }
			for (let sht_host=0, sht_frd=0; sht_host<hostile.length || sht_frd<friendly.length; sht_host++, sht_frd++) {
				intersectsHostile= intersectsFriendly= false
				//	CHECK THE BULLETS FIRING
				if (bullets.length==0 || i==bullets.length) return

				if (sht_host<hostile.length && hostile[sht_host]!=undefined) {
					intersectsHostile= hostile[sht_host].intersectionWith(bullets[i])
				} if (sht_frd<friendly.length && sht_frd!=own && friendly[sht_frd]!=undefined) {
					intersectsFriendly= friendly[sht_frd].intersectionWith(bullets[i])
				}
				//	CHECK INTERSECTION WITH ENEMIES OF FRIENDLY HERO
				if (intersectsHostile==false && intersectsFriendly==false) {
					if (moving_flag==false) {
						bullets[i].moving(cw, ch)
						moving_flag=true
					}
				} else {
					shooter.activated_bullets.splice(i,1)
					if (sht_host<hostile.length) damageCalculator(shooter, hostile, sht_host, healths, deadHeroes)
				}
			}
		} else shooter.activated_bullets.splice(i,1)
	}
}

function damageCalculator(shooter, hostile, sht_host, healths, deadHeroes) {
	let damage
	if (Inimigo.prototype.isPrototypeOf(shooter)==true && Personagem.prototype.isPrototypeOf(hostile[sht_host])==true) { 
		damage= Math.floor(Math.random() * (MAX_LOOSING_HP/2 - MIN_LOOSING_HP/2) ) + MIN_LOOSING_HP/2
		hostile[sht_host].health-= damage
		if (sht_host==ID_SASHA) healths.damageSasha(damage)
		else if (sht_host==ID_YIN) healths.damageYin(damage)
	} else if (Personagem.prototype.isPrototypeOf(shooter)==true && Inimigo.prototype.isPrototypeOf(hostile[sht_host])==true) {
		damage= Math.floor(Math.random() * (MAX_LOOSING_HP - MIN_LOOSING_HP) ) + MIN_LOOSING_HP
		hostile[sht_host].health-= damage
	} if (hostile[sht_host].health<=0) {
		if (hostile[sht_host].health<0) hostile[sht_host].health=0
		hostile[sht_host].walkingSound.pause()
		if (Personagem.prototype.isPrototypeOf(hostile[sht_host])==true) {
			if (sht_host==ID_SASHA) deadHeroes[ID_SASHA]=hostile[sht_host]
			else if (sht_host==ID_YIN) deadHeroes[ID_YIN]=hostile[sht_host]
		}
		hostile[sht_host]
		hostile[sht_host]=undefined
	}
}

function detectKeyboard(heroes) {
	function keyHandler(ev) { keyUpDownHandler(ev, heroes) }

	//	keyboard
	window.addEventListener("keydown", keyHandler)
	window.addEventListener("keyup", keyHandler)

}

function keyUpDownHandler(ev, heroes) {
	if (ev.type=="keydown") {
		if (ev.code=="ShiftRight" && heroes[ID_YIN]!=undefined && heroes[ID_YIN].keyStatus.firing==false) 
			heroes[ID_YIN].defineBullet()
		// SHOOT SASHA
		else if (ev.code=="ShiftLeft" && heroes[ID_SASHA]!=undefined && heroes[ID_SASHA].keyStatus.firing==false) 
			heroes[ID_SASHA].defineBullet()
		// MOVE YIN
		else if ((ev.code=="ArrowUp" || ev.code=="ArrowDown" || ev.code=="ArrowRight" || ev.code=="ArrowLeft") && heroes[ID_YIN]!=undefined)  
			heroes[ID_YIN].detect_movement(ev.code)
		// MOVE SASHA
		else if ((ev.code=="KeyW" || ev.code=="KeyS" || ev.code=="KeyA" || ev.code=="KeyD") && heroes[ID_SASHA]!=undefined) 
			heroes[ID_SASHA].detect_movement(ev.code)
	} else if (ev.type=="keyup") {
		// STOP SHOOTING YIN
		if (ev.code=="ShiftRight" && heroes[ID_YIN]!=undefined && heroes[ID_YIN].keyStatus.firing==true) 
			heroes[ID_YIN].keyStatus.firing=false 
		// STOP SHOOTING SASHA
		else if (ev.code=="ShiftLeft" && heroes[ID_SASHA]!=undefined && heroes[ID_SASHA].keyStatus.firing==true) 
			heroes[ID_SASHA].keyStatus.firing=false 
		// PARA YIN
		else if ((ev.code=="ArrowUp" || ev.code=="ArrowDown" || ev.code=="ArrowRight" || ev.code=="ArrowLeft") && heroes[ID_YIN]!=undefined) 
			heroes[ID_YIN].stop(ev.code)
		// PARA SASHA
		else if ((ev.code=="KeyW" || ev.code=="KeyS" || ev.code=="KeyA" || ev.code=="KeyD") && heroes[ID_SASHA]!=undefined) 
			heroes[ID_SASHA].stop(ev.code)
	}
}

function allBlockColisions(character, block_matrix, ctx) {
	if (character==undefined) return
	let block
	let centerX= Math.floor((character.x+character.width/2)/BLOCK_SIZE)
	let centerY= Math.floor((character.y+character.height/2)/BLOCK_SIZE)
	if ((block=block_matrix[centerY][centerX])!=0) {
		character.detectIntersection(block, ctx)
	} if (centerY!=0 && (block=block_matrix[centerY-1][centerX])!=0) {
		character.detectIntersection(block, ctx)
	} if (centerX!=0 && (block=block_matrix[centerY][centerX-1])!=0) {
		character.detectIntersection(block, ctx)
	} if (centerX!=block_matrix[0].length && (block=block_matrix[centerY][centerX+1])!=0) {
		character.detectIntersection(block, ctx)
	} if (centerY!=block_matrix.length && (block=block_matrix[centerY+1][centerX])!=0) {
		character.detectIntersection(block, ctx)
	} if (centerY!=0 && centerX!=0 && (block=block_matrix[centerY-1][centerX-1])!=0) {
		character.detectIntersection(block, ctx)
	} if (centerX!=block_matrix[0].length && centerY!=block_matrix.length && (block=block_matrix[centerY+1][centerX+1])!=0) {
		character.detectIntersection(block, ctx)
	} if (centerX!=block_matrix[0].length && centerY!=0 && (block=block_matrix[centerY-1][centerX+1])!=0) {
		character.detectIntersection(block, ctx)
	} if (centerX!=0 && centerY!=block_matrix.length && (block=block_matrix[centerY+1][centerX-1])!=0) {
		character.detectIntersection(block, ctx)
	}
}
function bulletsBlocksIntersection(bullet, mapBlocks) {
	for (let i = 0; i < mapBlocks.length; i++) {
		for (let j = 0; j < mapBlocks[i].length; j++) {
			if (mapBlocks[i][j]!=0 && mapBlocks[i][j].intersectionWith(bullet)!=false) return true
		}
	}
	return false
}

function levelPassed(enemies) {
	for (let i = 0; i < enemies.length; i++) {
		if (enemies[i]!=undefined) return false
	}
	return true
}
function updateHeros(heroes, healths, deadHeroes) {
	if (heroes[ID_SASHA]==undefined) {
		heroes[ID_SASHA]=deadHeroes[ID_SASHA]
		deadHeroes[ID_SASHA]=undefined
	} else if (heroes[ID_YIN]==undefined) {
		heroes[ID_YIN]=deadHeroes[ID_YIN]
		deadHeroes[ID_YIN]= undefined
	} if (heroes[ID_SASHA].health!=heroes[ID_SASHA].FULL_HEALTH) {
		heroes[ID_SASHA].health=heroes[ID_SASHA].FULL_HEALTH
		healths.healSasha()
	} if (heroes[ID_YIN].health!=heroes[ID_YIN].FULL_HEALTH) {
		heroes[ID_YIN].health=heroes[ID_YIN].FULL_HEALTH
		healths.healYin()
	} 
	if (actualChapter==0) {
		heroes[ID_SASHA].x=100, heroes[ID_SASHA].y=440
		heroes[ID_YIN].x=50, heroes[ID_YIN].y=420
	} else if (actualChapter==1 && actualLevel==0) {
		heroes[ID_SASHA].x=100, heroes[ID_SASHA].y=440
		heroes[ID_YIN].x=100, heroes[ID_YIN].y=470
	}
}

function backMainMenu(ev) {
	const key = ev.key
	if (key === "Escape" && confirm("Back to Main Menu?")==true) 
		location.replace("menu_main.html")
}