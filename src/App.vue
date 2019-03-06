<template>
  <div id="app">
    <div class="block">
      <label>Address</label><br />
      <input 
        type="text"
        class="input" 
        name="address"
        v-model="address">
      <button @click="submit()">Submit</button>
      <span class="pipe"></span>
      <button @click="findMe()">Find me</button>
    </div>
    
    <hr />
    
    <div class="block">
      <label>Currently:</label><br />
      <p>
        <img src="'/assets/images/' + currently.icon + '.png'" v-bind:alt="currently.icon">
        {{currently.summary}}
      </p>
      <br />
      <br />
    </div>

    <div v-if="forecast.length !== 0" class="block">
      <label>Forecast:</label><br />
      <table id="forecast" v-show="forecast.length !== 0">
        <thead>
          <tr>
            <td>Summary</td>
            <td>Temp Low</td>
            <td>Temp High</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(fc, index) in forecast">
            <td>{{$moment().day(index).format('dddd')}} {{fc.summary}}</td>
            <td>{{fc.temperatureLow}}</td>
            <td>{{fc.temperatureHigh}}</td>
          </tr>  
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

export default {
  name: 'app',
  components: {
    
  },

  data () {
    return {
      address: '',
      currently: {
        icon: '',
        summary: ''
      },
      forecast: [],
      ip: ''
    }
  },

  methods: {
    getForeCast(lat, long) {
      return fetch(`https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${process.env.VUE_APP_DARKSKY}/${lat},${long}`)
        .then(forecast => forecast.json())
        .then(forecast => {
          this.$data.currently.summary = `${forecast.currently.summary} and ${forecast.currently.temperature}f`;
          this.$data.currently.icon = forecast.currently.icon;
          this.$data.forecast = Object.assign({}, forecast.daily.data);
      });
    },

    findMe: function() {
      console.log(this.$ip.address());
      // no weather forecast for localhost's ip, just get an arbitrary ip so this can run
      const ip = this.$ip.address() === '127.0.0.1' ? '97.113.247.160' : this.$ip.address();

      return fetch(`http://cors-anywhere.herokuapp.com/http://api.ipstack.com/${ip}?access_key=${process.env.VUE_APP_IP_STACK}`)
        .then(location => location.json())
        .then(location => {
          this.$data.address = `${location.city}, ${location.region_code} ${location.zip}, ${location.country_code}`;
            
          return this.getForeCast(location.latitude, location.longitude);
      });
    },

    submit: function() {
      return fetch(`https://api.geocod.io/v1.3/geocode?q=${this.$data.address}&api_key=${process.env.VUE_APP_GEO_CODE}`)
        .then(geo => geo.json())
        .then(geo => {
        if (geo.results && geo.results.length) {
          const location = geo.results[0].location;

          return this.getForeCast(location.lat, location.lng);
        }
      });
    }
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  float: left;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.weather {
  float: left;
}

label {
  float: left;
  font-size: 16px;
  font-weight: bold;
}

input {
  width: 20rem;
  height: 1.5rem;
  float: left;
}

button {
  font-size: 14px;
  background-color: #d0d0d0;
  height: 1.5rem;
  border: 1px solid black;
  margin-left: 1rem;
}

p {
  float: left;
}

table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
  text-align: left;
}

tr {
  height: 2rem;
}

thead {
  background-color: #d0d0d0;
}

.block {
  padding-bottom: 1rem;
}

img {
  width: 1rem;
  height: 1rem;
}

.pipe {
  border-left: 1px solid #000;
  height: 1rem;
  width: 1rem;
  margin-left: 1rem;
}

</style>
