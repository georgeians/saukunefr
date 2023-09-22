 setTimeout(() => {
    const canvas = document.getElementById("game_canvas");
    const ctx = canvas.getContext("2d");
    let user;
    let ally = [];
    let world
    let Settings;
    Settings = {
        boxOnTop: true,
        Roofs: true,
        Tracers: {
            enabled: false,
            key: "KeyM",
        },
        E: true,
        BoxOnTop: true,
        DeadBox: true,
        t: true,
        Timer: true,
        PlayerOnTop: true,
        ListEnabledHacks: {
            enabled: true,
        },
        ColoredSpikes: {
            enabled: false,
            draw: true,
        },
AutoSpike: {
        enabled: true,
        key: 'Space',
        draw: true
    },
    }
    const symbol = Symbol();
    Object.defineProperty(Object.prototype, 'opacity', {
        get() {
            if (Settings.Roofs) {
                this[symbol] = 0.5
            } else {
                this[symbol] = 1
            }

            return this[symbol];
        },
        set(data) {

            this[symbol] = data;
        }
    });
    Object.defineProperty(Object.prototype, 'cam', {
        get() {
            user = this
            return this[symbol];
        },
        set(data) {

            this[symbol] = data;
        }
    });
    Object.defineProperty(Object.prototype, 'move_units', {
        get() {
            world = this

            return this[symbol];
        },
        set(data) {

            this[symbol] = data;
        }
    });

    function ctxDrawImage(ctx, img, b, c, d, e, f, g, h, i) {
        if ((img.tryLoad === undefined) || (img.tryLoad() === 1)) {
            if (i !== undefined) {
                ctx.drawImage(img, b, c, Math.max(1, d), Math.max(1, e), f, g, h, i);
            } else if (e !== undefined) {
                ctx.drawImage(img, b, c, d, e);
            } else {
                ctx.drawImage(img, b, c);
            }
        }
    };
function AutoSpike(){

    console.log('AutoSpike Is Enabled')

    let spacebarState = false;
    let autospikebypasscheck = false;
    let update;

    let getAngle = (ext) => {
        let myPlayer = world.fast_units[user.uid];
        let i = 2 * Math.PI;
        let angle = Math.floor((((myPlayer.angle + i) % i) * 255) / i);
    }


    let InventoryHas = (id) => {
        return user.inv.can_select.find((e) => e.id === id) != null;
    }
    let placeSpikesinterval
    document.addEventListener("keydown", function (event) {
        if (event.key === " ") {
            if (!spacebarState) {
                spacebarState = true;
                placeSpikes();
                placeSpikesinterval = setInterval(placeSpikes, 150);
            }
        }
    });

    document.addEventListener("keyup", function (event) {
        if (event.key === " ") {
            if (spacebarState) {
                spacebarState = false;
                clearInterval(placeSpikesinterval);
            }
        }
    })

    function placeSpikes() {
        console.log("placing");
        let checkHighest = () => {

            const spikes = [
                { id: 213, name: "Red Spike" },
                { id: 117, name: "Ame Spike" },
                { id: 164, name: "Dia Spike" },
                { id: 163, name: "Gold Spike" },
                { id: 162, name: "Stone Spike" },
                { id: 156, name: "Wood Wall" },
            ];

            let highestSpike = null;
            const spikePriorities = {
                "Red Spike": 5,
                "Ame Spike": 4,
                "Dia Spike": 3,
                "Gold Spike": 2,
                "Stone Spike": 1,
                "Wood Wall": 0,
            };

            const sortedSpikes = spikes.sort((a, b) => {
                const priorityA = spikePriorities[a.name];
                const priorityB = spikePriorities[b.name];
                return priorityB - priorityA;
            });

            for (var i = 0; i < sortedSpikes.length; i++) {
                if (InventoryHas(sortedSpikes[i].id)) {
                    highestSpike = sortedSpikes[i];
                    break;
                }
            }

            const cases = [
                { name: "Red Spike", id: 213 },
                { name: "Ame Spike", id: 117 },
                { name: "Dia Spike", id: 164 },
                { name: "Gold Spike", id: 163 },
                { name: "Stone Spike", id: 162 },
                { name: "Wood Wall", id: 156 },
            ];

            const highestSpikeId = highestSpike.id

            console.log(highestSpike)
            console.log(highestSpikeId)
            return highestSpikeId;
        }

        if (!user.chat.open && !user.terminal.open && user.build.wait == false && InventoryHas(checkHighest()) == true) {

            let count = user.inv.n[checkHighest()];

            ([14]);
            safeSend(JSON.stringify([102, checkHighest(), getAngle(), 0]));
            safeSend(JSON.stringify([102, checkHighest(), getAngle(-12), 0]));
            safeSend(JSON.stringify([102, checkHighest(), getAngle(12), 0]));
            safeSend(JSON.stringify([102, checkHighest(), getAngle(-20), 0]));
            safeSend(JSON.stringify([102, checkHighest(), getAngle(20), 0]));
        }


    }

}
    function draw_transition(o, a1, a2) {
        if (world.transition) {
            ctx.globalAlpha = 1;
            o.draw(a1, a2);
            world.time = world.time ? 0 : 1;
            ctx.globalAlpha = 1 - world.shade.v;
            o.draw(a1, a2);
            world.time = world.time ? 0 : 1;
            ctx.globalAlpha = 1;
        } else o.draw(a1, a2);
    };

    function mainHack() {
        requestAnimationFrame(mainHack)
        if (!user) return;
        if (!world) return;
        let myPlayer = world.fast_units[user.uid]
        let players = world.units[0]
        for (let i = 0; i < players.length; i++) {
            players[i].player.skinSize = 0
            players[i].player.skinType = 0
        }
        let isAlly = (id) => {
            switch (id) {
            case user.id:
                return true;
            default:
                return user.team.includes(id);
            }
        }
        if (user.alive && Settings.PlayerOnTop) {
            for (var i = 0; i < players.length; i++) {
                var p = players[i];
                if (((((players[i].vehicle !== INV.BABY_DRAGON) && (players[i].vehicle !== INV.BABY_LAVA)) && (players[i].vehicle !== INV.HAWK)) && (players[i].vehicle !== INV.PLANE)) && (players[i].vehicle !== INV.NIMBUS)) {
                    if (p.tower === 0) {
                        if (p.tower_fx > 0.001) {
                            p.tower_fx = Utils.lerp(p.tower_fx, 0, 0.018);
                            var spd = 1 + (0.18 * Math.min(1, Math.max(p.tower_fx, 0) / 100));
                            ctx.save();
                            ctx.scale(spd, spd);
                            user.cam.x /= spd;
                            user.cam.y /= spd;
                            p.x /= spd;
                            p.y /= spd;
                            p.r.x /= spd;
                            p.r.y /= spd;
                            p.draw_vehicle();
                            p.draw();
                            user.cam.x *= spd;
                            user.cam.y *= spd;
                            p.x *= spd;
                            p.y *= spd;
                            p.r.x *= spd;
                            p.r.y *= spd;
                            ctx.restore();
                        } else {
                            p.fly = 0;
                            p.draw_vehicle();
                            p.draw();
                        }
                    }
                }
            }
        }
        if (user.alive && Settings.t) {
            var totem = world.units[29];
            for (var i = 0; i < totem.length; i++) {
                draw_transition(totem[i], SPRITE.TOTEM);
            }
        }

        if (user.alive && Settings.BoxOnTop) {
            var crate = world.units[86];
            for (var i = 0; i < crate.length; i++) {
                draw_transition(crate[i], SPRITE.CRATE);
            }
        }
        if (user.alive && Settings.DeadBox) {
            var dead_box = world.units[82];
            for (var i = 0; i < dead_box.length; i++) {
                draw_transition(dead_box[i], SPRITE.CRATE);
            }
        }
        if (user.alive && Settings.ColoredSpikes) {
            spikeUnits = [12, 13, 14, 20, 52, 53]
            for (let i = 0; i < spikeUnits.length; i++) {
                unit = spikeUnits[i]
                let spike = world.units[unit];
                for (let i = 0; i < spike.length; i++) {
                    ctx.save()
                    ctx.beginPath();
                    ctx.arc(spike[i].x + user.cam.x, spike[i].y + user.cam.y, 40, 0, 2 * Math.PI);
                    ctx.lineWidth = 6;
                    ctx.strokeStyle = isAlly(spike[i].pid) ? "#00ff00" : "red";
                    ctx.stroke();
                    ctx.restore()
                }
            }
        }
        if (user.alive && Settings.Timer) {
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = 7;
            ctx.fillStyle = "green";
            ctx.strokeStyle = "black";
            ctx.font = '22px Baloo Paaji';


            ctx.strokeText(Math.floor(user.gauges.l * 100) + "%", myPlayer.x - 30 + user.cam.x, myPlayer.y + user.cam.y + 34);
            ctx.fillText(Math.floor(user.gauges.l * 100) + "%", myPlayer.x - 30 + user.cam.x, myPlayer.y + user.cam.y + 34);

            ctx.restore()
        }

    }
    setTimeout(mainHack, 6000)
}, 3000)
