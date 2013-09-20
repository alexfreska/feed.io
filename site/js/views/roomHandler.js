define(function(require) {
    var $           = require('jquery'),
        _           = require('underscore'),
        Backbone    = require('backbone'),
        RoomSelec   = require('views/roomSelector'),
        AppT        = require('text!templates/app.html'),
        MD5         = require('helpers/md5');

    RoomHandler = Backbone.View.extend({
        tagName: 'div',
        id: 'roomHandler',

        template: _.template(AppT),

        events: {
            'click .submit' : 'addRoom',
            'click .login'  : 'login'
        },
        initialize: function (args) {
            var s = this;

            s.rooms = [];
            s.selectors = [];

            s.user = {
                name: args.user.name,
                email: args.user.email,
                hash: MD5.on(args.user.email)
            }
            
            s.$el.append(s.template({user: s.user}));

        },
        addRoom: function (e) {
            var s = this;

            e.preventDefault();

            var newRoom = s.$('#newRoom').val();

            if(!s.inRoom(newRoom) && s.user.name != '') {
            
            s.$('#newRoom').val('');    

            //add to list           
            var selector = new RoomSelec({room: newRoom});
            s.$('#roomList').append( selector.el );
            s.selectors[newRoom] = selector;

            //add room to list
            var room = new Room({room: newRoom, user: s.user});
            $('#container').append( room.el );
                s.rooms[newRoom] = room;

            //join room
                window.socket.emit('joinRoom',{room: newRoom, user: s.user.name});
                
                console.log('Joined: '+newRoom);
         }
            
        },
        inRoom: function (room) {
        var s = this;
            return s.rooms[room];
    
    },
    login: function () {
        var s = this;       

        var val = s.$('#username').val();
        if(val != '') {
            s.user.name = val;
            s.$('#userInfo .name').text(val);
        }
        val = s.$('#email').val();
        if(val != '') {
            s.user.email = val;
            s.$('#userInfo .email').text(val);
        }
    }

    });

    return RoomHandler;

});