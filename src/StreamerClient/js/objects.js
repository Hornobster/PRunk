window.objects = [];

window.objects.push({
    name: 'gun',
    slot: 'hand',
    added: function(component) {
        component.ammo = 10;
    },
    activate: function() {
        if (this.ammo > 0) {
            this.ammo -= 1;
            console.log('pew pew');
        } else {
            this.entity.del('gun');
        }
    }
});

window.objects.push({
    name: 'jetpack',
    slot: 'chest',
    added: function(component) {
        component.charges = 50;
    },
    activate: function() {
        if (this.charges > 0) {
            this.charges -= 1;
            console.log('fuuu fuuu');      
            this.entity.p.vy += -280;
            if(this.entity.p.vy < -150){
                console.log('max speed');
                this.entity.p.vy = -150;
            }
        } else {
            this.entity.del('jetpack');
        }
    }
})

window.objects.push({
    name: 'boots',
    slot: 'feet',
    added: function(component) {
        console.log('supa fast');
        component.entity.p.speed *= 1.5;
    }
});

window.objects.push({
    name: 'jump',
    slot: 'legs',
    added: function(component) {
        console.log('supa jump');
        component.entity.p.jumpMultiplier *= 1.5;
        component.jumps = 50;
    }
})

window.objects.push({
    name: 'jump',
    slot: 'legs',
    added: function(component) {
        console.log('supa jump');
        component.entity.p.jumpMultiplier *= 1.5;
        component.jumps = 50;
    }
})

window.objects.push({
    name: 'springHead',
    slot: 'head',
    added: function(component) {
        component.entity.on('bump.top', component, function(){
            component.entity.p.vy = 1000;
        })
    }
})

window.objects.push({
    name: 'springBoots',
    slot: 'feet',
    added: function(component) {
        component.entity.on('bump.bottom', component, function(){
            component.entity.p.vy = -400;                
        })
    }
})

window.objects.push({
    name: 'springChest',
    slot: 'chest',
    added: function(component) {
        component.entity.on('bump.left', component, function(){
            component.entity.p.vx = 500;                
        });
        component.entity.on('bump.right', component, function(){
            component.entity.p.vx = -500;                
        })
    }
})

console.log(window.objects);