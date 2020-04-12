"use strict"

class Personagem extends Inimigo {
    constructor(x, y, width, height, speed, img, arma) {
        super(x, y, width, height, speed, img, arma)
        this.right=false
        this.left=false
        this.up=false
        this.down=false
    }

    //-------------------------------------------------------------
    //--- Yin & Sasha Movement
    //-------------------------------------------------------------
    /**
     * @param {String} code 
     */
    detect_movement(code) {
        if (this.up==false && (code=="ArrowUp" || code=="KeyW")) {
            this.up=true
            //if (this.img.id=="yin") this.img.src="../resources/yin_sprite_back.gif"
            //else this.img.src="../resources/Sasha_sprite_back.gif"
        } else if (this.down==false && (code=="ArrowDown" || code=="KeyS")) {
            this.down=true
            //if (this.img.id=="yin") this.img.src="../resources/yin_sprite.gif"
            //else this.img.src="../resources/Sasha_sprite.gif"
        } else if (this.left==false && (code=="ArrowLeft" || code=="KeyA")) {
            this.left=true
            //if (this.img.id=="yin") this.img.src="../resources/yin_sprite_left.gif"
            //else this.img.src="../resources/Sasha_sprite_left.gif"
        } else if (this.right==false && (code=="ArrowRight" || code=="KeyD")) {
            this.right=true
            //if (this.img.id=="yin") this.img.src="../resources/yin_sprite_right.gif"
            //else this.img.src="../resources/Sasha_sprite_right.gif"
        }
    }
    /**
     * @param {String} code 
     */
    stop(code) {
        if (this.up==true && (code=="ArrowUp" || code=="KeyW")) {
            //if (this.img.id=="yin") this.img.src="../resources/yin_sprite_back.png"
            //else this.img.src="../resources/Sasha_sprite_back.png"
            this.up=false
        } else if (this.down==true && (code=="ArrowDown" || code=="KeyS")) {
            //if (this.img.id=="yin") this.img.src="../resources/yin_sprite.png"
            //else this.img.src="../resources/Sasha_sprite.png"
            this.down=false
        } else if (this.left==true && (code=="ArrowLeft" || code=="KeyA")) {
            //if (this.img.id=="yin") this.img.src="../resources/yin_sprite_left.png"
            //else this.img.src="../resources/Sasha_sprite_left.png"
            this.left=false
        } else if (this.right==true && (code=="ArrowRight" || code=="KeyD")) {
            //if (this.img.id=="yin") this.img.src="../resources/yin_sprite_right.png"
            //else this.img.src="../resources/Sasha_sprite_right.png"
            this.right=false
        }
    }
    walking(sprite, cw, ch) {
        this.detectIntersection(sprite)
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

    //-------------------------------------------------------------
    //--- Yin & Sasha Intersections
    //-------------------------------------------------------------
    intersectionWith(sprite) {
		//	xy1 -> canto superior esquerdo
		//	xy2 -> canto inferior direito
		let x1 = sprite.x, y1 = sprite.y
		let x2 = sprite.x+sprite.width, y2 = sprite.y+sprite.height
		
		if (x1>=this.x && x1 <= this.x+this.width) {
			if (y1>=this.y && y1 <= this.y+this.height) return this.checkPixeis(sprite, x1, this.menor(x2, this.x+this.width), y1, this.menor(y2, this.y+this.height))
			else if (y2>=this.y && y2 <= this.y+this.height) return this.checkPixeis(sprite, x1, this.menor(x2, this.x+this.width), this.y, y2)
		} else if (x2>=this.x && x2 <= this.x+this.width) {
			if (y1>=this.y && y1 <= this.y+this.height) return this.checkPixeis(sprite, this.x, x2, y1, this.menor(y2, this.y+this.height))
			else if (y2>=this.y && y2 <= this.y + this.height) return this.checkPixeis(sprite, this.x, x2, this.y, y2)
        }
        else return false
	}
	menor(a, b) {
		if (a<=b) return a 
		else return b
	}
	//	xy1 -> canto superior esquerdo
	//	xy2 -> canto inferior direito
    checkPixeis(sprite, x1, x2, y1, y2) {
		for(let i = y1 ; i < y2-1 ; i++){
			for(let j = x1 ; j < x2 ; j++){
				var this_opacity= this.imgData.data[((i-this.y)*Math.round(this.width)+(j-this.x))*4 + 3]
				var sprite_opacity= sprite.imgData.data[((i-sprite.y)*Math.round(sprite.width)+(j-sprite.x))*4 + 3]
				if (this_opacity!=0 && sprite_opacity!=0) return true
			}
		}
    }
    
    /**
     * @param {Personagem} sprite
     */
    detectIntersection(sprite) {
        if (this.intersectionWith(sprite)==true) {
            if (this.up==true) this.stop("ArrowUp")
            if (this.down==true) this.stop("ArrowDown")
            if (this.left==true) this.stop("ArrowLeft")
            if (this.right==true) this.stop("ArrowRight")
        }
    }
}