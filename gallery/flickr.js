
!(function(){
    'use strict';

	var numOfImages = window.location.search ? parseInt(window.location.search.match(/\d+$/)[0]) : 70,
		gallery = $('#gallery'),
		videos = [
		];
		
    // Get some photos from Flickr for the demo
    $.ajax({
        url: 'http://api.flickr.com/services/rest/',
        data: {
            format: 'json',
            method: 'flickr.people.getPublicPhotos',
			per_page : numOfImages,
			user_id : '66832942@N07',
            api_key: 'c5913ee2298614734ac0be62ab26c6d1' 
        },
	    dataType: 'jsonp',
        jsonp: 'jsoncallback'
    })
	.done(function (data){
        var loadedIndex = 1, isVideo;
		
		
		data.photos.photo = data.photos.photo.concat(videos);
		
        $.each( data.photos.photo, function(index, photo){
			isVideo = photo.thumb ? true : false;
			
            var url = 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret,
				img = document.createElement('img');
			
			
			img.onload = function(e){
				img.onload = null;
				var link = document.createElement('a'),
				li = document.createElement('li')
				link.href = this.largeUrl;

				link.appendChild(this);
				if( this.isVideo ){
					link.rel = 'video';
					li.className = 'video'
				}
				li.appendChild(link);
				gallery[0].appendChild(li);
			
				setTimeout( function(){ 
					$(li).addClass('loaded');
				}, 25*loadedIndex++);
			};
			
			img['largeUrl'] = isVideo ? photo.url : url + '_b.jpg';
			img['isVideo'] = isVideo;
			img.src = isVideo ? photo.thumb : url + '_t.jpg';
			img.title = photo.title;
        });

		
		$('#gallery').photobox('a', { thumbs:true }, callback);
		
		setTimeout(window._photobox.history.load, 1000);
		function callback(){
			console.log('callback for loaded content:', this);
		};
    });
})();