$(function (){

	var resultList = $('#results');
	var weatherInfo = $('#weather-info');

	$('#city-query').on('submit', function(e){
		e.preventDefault();
		resultList.empty();
		weatherInfo.empty();
		var query = $(this).find('input').val();
		$.ajax({
			url: 'http://autocomplete.wunderground.com/aq?query=' + query,
			method: 'get',
			dataType: 'jsonp',
			jsonp: 'cb',
			success: function(search){
				search.RESULTS.forEach(function(city){
					$('<li>')
						.addClass('search-result')
						.attr('data-link', city.l)
						.text(city.name)
						.appendTo(resultList);
				});
			}
		});
	});

	$('#results').on('click', '.search-result', function(){
		resultList.empty();
		weatherInfo.empty();
		var city = $(this);
		$.ajax({
			url: 'http://api.wunderground.com/api/' + weatherKey + '/forecast/' + city.data('link') + ".json",
			method: 'get',
			dataType: 'jsonp',
			success: function(city){
				console.log(city);
				$('<article>').text(city.forecast.simpleforecast.forecastday[0].conditions).appendTo(weatherInfo);
			}
		});
	});

});