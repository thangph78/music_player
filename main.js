const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const heading = $("header h2")
const cdThumb = $(".cd-thumb")
const audio = $("#audio")  
const cd = $(".cd")
const player = $(".player")
const itemSong = $("div #song1")
const playBtn = $(".btn-toggle-play")
const prevBtn = $(".btn-prev")
const nextBtn = $(".btn-next")
const randomBtn = $(".btn-random")
const repeatBtn = $(".btn-repeat")
const propress = $("#progress")
const playlist = $(".playlist")

const PLAYER_STORAGE_KEY = 'music_player'

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function(key,value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    songs: [
        {
            name: "Ánh nắng của anh",
            singer: "Đức Phúc",
            path: "./assets/AnhNangCuaAnh.mp3",
            images: "./assets/DucPhuc.jpg"
        },
        {
            name: "Khuê Mộc Lang",
            singer: "Jack",
            path: "./assets/IDo.mp3",
            images: "./assets/HinhA.jpg"
        },
        {
            name: "Luôn Yêu Đời",
            singer: "Đức Phúc",
            path: "./assets/LuonYeuDoi.mp3",
            images: "./assets/KhueMocLangjpg.jpg"
        },
        {
            name: "Ngày đầu tiên",
            singer: "Đức Phúc",
            path: "./assets/NgayDauTien.mp3",
            images: "./assets/DucPhuc.jpg"
        },
        {
            name: "Khuê Mộc Lang 2",
            singer: "Jack",
            path: "./assets/IDo.mp3",
            images: "./assets/HinhA.jpg"
        },
        {
            name: "Ngày đầu tiên 2",
            singer: "Đức Phúc",
            path: "./assets/NgayDauTien.mp3",
            images: "./assets/DucPhuc.jpg"
        },
        {
            name: "Khuê Mộc Lang 2",
            singer: "Jack",
            path: "./assets/IDo.mp3",
            images: "./assets/HinhA.jpg"
        },
        {
            name: "Luôn Yêu Đời 2",
            singer: "Đức Phúc",
            path: "./assets/LuonYeuDoi.mp3",
            images: "./assets/KhueMocLangjpg.jpg"
        },
        {
            name: "Ngày đầu tiên 3",
            singer: "Đức Phúc",
            path: "./assets/NgayDauTien.mp3",
            images: "./assets/DucPhuc.jpg"
        }
    ],

    render: function()  {
        const htmls = this.songs.map((song, index) => {
           return `
            <div data-index= ${index} class="song ${index === this.currentIndex ? "active" : ""}">
                <div class="thumb" style="background-image: url('${song.images}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },

    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },
   
    handleEvents: function(){
        const _this = this
        const cdWidth = cd.offsetWidth

        // Rotate Cd Thumb
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg'}
        ], {
            duration: 10000,
            interation: Infinity
        })
        cdThumbAnimate.pause()

        // Scroll 
        document.onscroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        playBtn.onclick = function(){
            _this.isPlaying ? audio.pause() : audio.play();
        }
        
        randomBtn.onclick = function(){
            _this.isRandom = !_this.isRandom
            _this.setConfig("isRandom", _this.isRandom);
            randomBtn.classList.toggle("active",_this.isRandom)
        }

        repeatBtn.onclick = function(e){

            _this.isRepeat = !_this.isRepeat;
            _this.setConfig("isRepeat", _this.isRepeat);
            repeatBtn.classList.toggle("active",_this.isRepeat)
        }

        // Next song
        nextBtn.onclick = function(){
            _this.isRandom ? _this.randomSong() : _this.nextSong()
            audio.play()
            cdThumbAnimate.play()
        }
        // Prev song
        prevBtn.onclick = function(){
            _this.isRandom ? _this.randomSong() : _this.prevSong()
            audio.play()
        }

        audio.onplay = function(){
            _this.isPlaying = true;
            cdThumbAnimate.play()
            player.classList.add("playing")
        }
        audio.onpause = function(){
            _this.isPlaying = false;
            player.classList.remove("playing")
            cdThumbAnimate.pause()
        }

        audio.ontimeupdate = function(){
            if(audio.duration) 
                propress.value = (audio.currentTime / audio.duration) * 100
        }

        audio.onended = function(){
            if(_this.isRandom)
            {
                _this.randomSong()
            }
            else if(_this.isRepeat)
            {
                audio.play()
            }
            else
                _this.nextSong()
            audio.play()
        }

        // Click to playlist
        playlist.onclick = function(e){
            const songNode = e.target.closest(".song:not(.active");
            if(songNode && !e.target.closest(".option"))
            {
                if(songNode) {
                    const song = Number(songNode.dataset.index)
                    _this.currentIndex =  song
                    _this.loadCurrentSong()
                    audio.play()
                }
            }
        }

        propress.onchange = function(e){
            audio.currentTime = (audio.duration / 100 * e.target.value ) 
            propress.value = e.target.value
        }

    },

    scrollToActiveSong: function(){
        setTimeout(() => {
            $(".song.active").scrollIntoView({behavior: "smooth", block: 'nearest'})
        },400)
    },

    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.images})`;
        audio.src = this.currentSong.path;
        this.render()
    },

    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },

    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >  this.songs.length -1) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong()
        this.scrollToActiveSong()

    },
    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0 ) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong()
        this.scrollToActiveSong()
    },

    randomSong: function(){
        let newIndex;
        do{
            newIndex =  Math.floor(Math.random() * this.songs.length)
        }while(newIndex == this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    repeatSong: function(){
        audio.value = 0
    },

    start: function(){
        this.loadConfig()
        this.render();
        this.defineProperties();
        this.loadCurrentSong();
        this.handleEvents();

        repeatBtn.classList.toggle("active",this.isRepeat)
        randomBtn.classList.toggle("active",this.isRandom)
    }
}

app.start();

