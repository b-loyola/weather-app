$(function (){

	var resultList = $('#results');
	var weatherInfo = $('#weather-info');

	$('#city-query').on('submit keyup', function(e){
		e.preventDefault();
		
		var query = $(this).find('input').val();
		$.ajax({
			url: 'http://autocomplete.wunderground.com/aq?query=' + query,
			method: 'get',
			dataType: 'jsonp',
			jsonp: 'cb',
			success: function(search){
				console.log(search);
				resultList.empty();
				var results = search.RESULTS.filter(function(result){
					return result.type === "city";
				});
				for (var i=0; i<5; i++){
					result = results[i];
					if (result.type === "city") {
						$('<a>').addClass('search-result').addClass('list-group-item').attr('data-link', result.l).text(result.name).appendTo(resultList);
					}
				}
			}
		});
	});

	$('#results').on('click', '.search-result', function(){
		// resultList.empty();
		weatherInfo.empty();
		resultList.find('.active').removeClass('active');
		var city = $(this);
		city.addClass('active');
		$.ajax({
			url: 'http://api.wunderground.com/api/' + weatherKey + '/geolookup/conditions/forecast' + city.data('link') + ".json",
			method: 'get',
			dataType: 'jsonp',
			success: function(response){
				console.log(response);
				if (response.response.error){
					$('<article>').append($('<h4>').text("Please select a city to view forecast")).appendTo(weatherInfo);
				} else {
					$('<article>')
						.append($('<h4>').text(response.location.city + ", " + response.location.country_name))
						.append($('<p>').addClass('temperature').text(response.current_observation.temperature_string))
						.append($('<p>').text("Feels like: " + response.current_observation.feelslike_string))
						.append($('<p>').text(response.current_observation.weather))
						.append($('<img>').attr('src', response.current_observation.icon_url))
						.appendTo(weatherInfo);
				}
			}
		});
	});

});