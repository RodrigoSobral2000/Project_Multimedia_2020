"use strict"

class Personagem extends Inimigo {
    constructor(x, y, width, height, speed, img, arma) {
        super(x, y, width, height, speed, img, arma)
        this.right=false
        this.left=false
        this.up=false
        this.down=false
    }

    detect_movement(code) {
        if (this.up==false && (code=="ArrowUp" || code=="KeyW")) {
            this.up=true
            //if (this.img.id=="yin") this.img.src="./resources/yin_sprite_back.gif"
            //else this.img.src="./resources/Sasha_sprite_back.gif"
        } else if (this.down==false && (code=="ArrowDown" || code=="KeyS")) {
            this.down=true
            //if (this.img.id=="yin") this.img.src="./resources/yin_sprite.gif"
            //else this.img.src="./resources/Sasha_sprite.gif"
        } else if (this.left==false && (code=="ArrowLeft" || code=="KeyA")) {
            this.left=true
            //if (this.img.id=="yin") this.img.src="./resources/yin_sprite_left.gif"
            //else this.img.src="./resources/Sasha_sprite_left.gif"
        } else if (this.right==false && (code=="ArrowRight" || code=="KeyD")) {
            this.right=true
            //if (this.img.id=="yin") this.img.src="./resources/yin_sprite_right.gif"
            //else this.img.src="./resources/Sasha_sprite_right.gif"
        }
    }

    stop(code) {
        if (this.up==true && (code=="ArrowUp" || code=="KeyW")) {
            //if (this.img.id=="yin") this.img.src="./resources/yin_sprite_back.png"
            //else this.img.src="./resources/Sasha_sprite_back.png"
            this.up=false
        } else if (this.down==true && (code=="ArrowDown" || code=="KeyS")) {
            //if (this.img.id=="yin") this.img.src="./resources/yin_sprite.png"
            //else this.img.src="./resources/Sasha_sprite.png"
            this.down=false
        } else if (this.left==true && (code=="ArrowLeft" || code=="KeyA")) {
            //if (this.img.id=="yin") this.img.src="./resources/yin_sprite_left.png"
            //else this.img.src="./resources/Sasha_sprite_left.png"
            this.left=false
        } else if (this.right==true && (code=="ArrowRight" || code=="KeyD")) {
            //if (this.img.id=="yin") this.img.src="./resources/yin_sprite_right.png"
            //else this.img.src="./resources/Sasha_sprite_right.png"
            this.right=false
        }
    }

    walking(cw, ch) {
        if (this.left==true) {
            if(this.x>0) this.x-=this.speed
            else this.x=0
        } if (this.right==true) {
            if(this.x+this.width<cw) this.x+=this.speed
            else this.x=cw-this.width
        } if (this.up==true) {
            if(this.y>0) this.y-=this.speed
            else this.y=0
        } if (this.down==true) {
            if(this.y+this.height<ch) this.y+=this.speed
            else this.y=ch-this.height
        }
    }
}