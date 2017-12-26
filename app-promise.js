const axios=require('axios');
const yargs=require('yargs');
const weather=require("./weather")
const argv=yargs
    .options({
        a:{
            demand:true,
            alias:'address',
            describe:'Address for which weather is to be obtained',
            string:true
        }
    })
    .help()
    .default("a","ballia")
    .alias('help','h')
    .argv;

    var encodedAddress=encodeURIComponent(argv.a);
    var geoCodeUrl=`https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;

    axios.get(geoCodeUrl).then((response)=>{
        if(response.data.status==="ZERO_RESULTS")
        {
           throw new Error("The address is not valid!");
        }
        {
            var lat=response.data.results[0].geometry.location.lat;
            var lng=response.data.results[0].geometry.location.lng;
            var webUrl=`https://api.darksky.net/forecast/711272dee9756755122d07a201e41f0d/${lat},${lng}`;
            
            console.log(response.data.results[0].formatted_address);
            return axios.get(webUrl);
        }
        
    }).then((response)=>{
        var temp=response.data.currently.temperature;
        var appTemp=response.data.currently.apparentTemperature;
        console.log(`The temperature is ${temp} .It feels like ${appTemp} `)
        console.log(`Today precipitation probability is ${response.data.currently.precipProbability}`);
        console.log(`Today dew point is ${response.data.currently.dewPoint}`);
        console.log(`Now humidity is ${response.data.currently.humidity}`);
        console.log(`Now wind speed  is ${response.data.currently.windSpeed}`);
        console.log(`The predicted weather summary for the week-:${response.data.daily.summary}`);

    }).catch((e)=>{
        if(e.code==="ECONNREFUSED")
        {
            console.log("unable to connect to API server");
        }
        else{
            console.log(e.message);
        }
    
        

    });

