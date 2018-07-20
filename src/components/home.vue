<template>
    <div v-if='true'>
      <h2 id='headerIcon' style="margin-bottom: 2%;">C☕️ffee Dash</h2>
      <!-- <vue-tabs centered:true type='pills' style='width: 100%'>
        <v-tab title='😴' id='tab1'></v-tab>
        <v-tab title='📊' id='tab2'></v-tab>
      </vue-tabs> -->

      <swiper>
        <swiper-slide>
          <form @submit='drink' id="drinkFrom">
            <div style='margin: auto;text-align: center; margin-top: 50px;'>
              <ul style='text-align: center; margin-bottom: 50px; padding:0'>
                <h4>Size</h4>
                <li style='display: flex; flex-direction: row; text-align:center; margin-bottom: 20px'> 
                  <form class="buttonList">
                        <label class="size"><input type="radio" name="toggle" v-model="form.size" value="small"><span>Small</span></label>
                        <label class="size"><input type="radio" name="toggle" v-model="form.size" value="big"><span>Big</span></label>
                  </form>
                </li>
                <h4>Strength</h4>
                <li style='display: flex; flex-direction: row; text-align:center;'> 
                  <form class="buttonList" >
                        <label class="strength" ><input type="radio" name="toggle" v-model="form.strength" value="mild"><span>Mild</span></label>
                        <label class="strength"><input type="radio" name="toggle" v-model="form.strength" value="normal"><span>Normal</span></label>
                        <label class="strength"><input type="radio" name="toggle" v-model="form.strength" value="strong"><span>Strong</span></label>
                  </form>
                </li>
              </ul>
              <b-button id="drinkSubmit" type='submit' style='width: 150px; margin-bottom: 50px;  background-color: #499324;'>Drink</b-button>
            </div>
          </form>
        </swiper-slide>
        <swiper-slide>
          <!-- <div class="center" style='max-width: 500px; max-height: 500px;'> -->
            <div class="block">
              <div class="centered">
                <canvas id="myChart" width=500 height=500  style='width:500px;height:500px'></canvas>
              </div>
            </div>          
        </swiper-slide>
        <div class='swiper-pagination' slot='pagination'></div>
      </swiper>


      <form @submit='logout' id="logout">
        <!-- <button type='submit' style='width:450px; margin:auto; margin-top:120px; padding:50px; background-color:#efebeb'>logout</button> -->
        <div>
          <b-button type='submit' style='width: 50%; max-width: 300px;  background-color: #499324;'>Logout</b-button>
        </div>
      </form>

    </div>
    <div v-else>
      <h1 style='text-align:center; margin-top:200px; font-size:100px'>
        <b>Forbidden!</b>
      </h1>
    </div>
  </template>


<script>
import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import Swiper from "swiper";
import Chart from "chart.js";

Vue.use(Vuex);

let consumption;
let myDoughnutChart;
let positionMapping;
let mySwiper;

document.onkeydown = checkKey;

function checkKey(e) {
  e = e || window.event;
  if (mySwiper) {
    if (e.keyCode == "38") {
      // up arrow
    } else if (e.keyCode == "32") {
      //space
      e.preventDefault();
      mySwiper.activeIndex === 0
        ? mySwiper.slideTo(1, 500)
        : mySwiper.slideTo(0, 500);
    } else if (e.keyCode == "37") {
      // left arrow
      e.preventDefault();
      mySwiper.slideTo(0);
    } else if (e.keyCode == "39") {
      e.preventDefault();
      mySwiper.slideTo(1);
    }
  }
}

export default {
  data() {
    return {
      loggedIn: this.$store.getters.loggedin,
      user: this.$store.getters.user,
      overallConsumption: this.$store.getters.overallConsumption,
      form: {
        size: "",
        strength: ""
      }
    };
  },
  methods: {
    logout(evt) {
      evt.preventDefault();
      console.log("logout clicked", localStorage);
      localStorage.clear();
      this.$router.push("/");
    },
    getUsername() {
      console.log(" fabp_92@localStorage.de", localStorage["email"]);
      return localStorage["email"];
    },
    createChart() {
      if (this.$store.getters.chartData) {
        const ctx = document.getElementById("myChart");
        if (false) {
          const dataArrId = positionMapping.get(response.data.coffee);
          console.log(" mySwiper.activeIndex", dataArrId);
          this.$store.commit("updateChartData", dataArrId);
          myDoughnutChart.update();
        } else {
          myDoughnutChart = new Chart(ctx, {
            type: "doughnut",
            data: this.$store.getters.chartData,
            options: {
              legend: {
                position: "bottom"
              }
            }
          });
        }
      }
    },
    swipLeft(evt) {
      console.log("evt", evt);
      /* document.querySelector("#t-tab2").click(); */
    },
    drink(evt) {
      evt.preventDefault;
      console.log("drink");
      if (this.form.size && this.form.strength) {
        axios
          .post(`http://192.168.178.31:3003/api/insertcoffee`, {
            ...this.form,
            email: this.getUsername()
          })
          .then(response => {
            const dataArrId = positionMapping.get(response.data.coffee);
            this.$store.commit("updateChartData", dataArrId);
            myDoughnutChart.update();
            const tmpSwiper = document.querySelector(".swiper-container").swiper;

            //tmpSwiper.slideReset();
            setTimeout(() => tmpSwiper.slideTo(1, 500), 200);

            const inputArray = document.querySelectorAll("input");
            inputArray.forEach(input => (input.checked = false));
            const formArray = document.querySelectorAll(".buttonList");
            formArray.forEach(form => form.reset());
            this.form.size = "";
            this.form.strength = "";
          });
      }
    }
  },
  mounted() {
    console.log("mounted new slide");
    positionMapping = new Map(this.$store.getters.positionMapping);
    //this.createChart();

    mySwiper = new Swiper(".swiper-container", {
      grabCursor: false,
      centeredSlides: true,
      resistanceRatio: 0.3,
      spaceBetween: 40,
      simulateTouch: false,
      iOSEdgeSwipeThreshold: 2,
      pagination: {
        el: ".swiper-pagination",
        clickable: false
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      },
      themeColor: "#499324",
      // Enable debugger
      debugger: true,
      // Responsive breakpoints
      breakpoints: {
        // when window width is <= 320px
        320: {
          slidesPerView: 1,
          spaceBetween: 10
        },
        // when window width is <= 480px
        480: {
          slidesPerView: 1,
          spaceBetween: 20
        },
        // when window width is <= 640px
        640: {
          slidesPerView: 1,
          spaceBetween: 30
        }
      },
      on: {
        init: () => {
          console.log("swiper initialized");
        },
        slideChange: () => {
          console.log("swiper slideChange", this);
        },
        sliderMove: () => {
          console.log("swiper sliderMove");
        },
        transitionEnd: () => {
          console.log("transitionEnd transitionEnd");
        }
      }
    });
    mySwiper.mousewheel.disable();

    axios
      .get(
        `http://192.168.178.31:3003/api/getuserdata/${localStorage["email"]}`
      )
      .then(response => {
        console.log("​beforeCreate -> response ", response);
        this.$store.commit(
          "setOverallConsumption",
          response.data.overallConsumption
        );
        const tmpUser = {
          name: localStorage["email"],
          coffeeConsumption: response.data.userConsumption
        };
        this.$store.commit("setCurrentUser", tmpUser);
        this.user = this.$store.getters.user;
        this.overallConsumption = this.$store.getters.overallConsumption;

        this.$store.getters.chartData.datasets[0].data = [];
        this.$store.getters.chartData.labels = [];

        this.user.coffeeConsumption.forEach((obj, index) => {
          Object.entries(obj).forEach(([key, val]) => {
            this.$store.commit("pushChartData", val);
            this.$store.commit("pushLabel", key);
            this.$store.commit("setKeyPositionMapping", [key, index]);
          });
        });
        console.log(
          "​mounted -> this.$store.positionMapping ",
          this.$store.getters.positionMapping
        );
        positionMapping = new Map(this.$store.getters.positionMapping);
        console.log("​CHARTDATA", this.$store.getters.chartData.datasets[0].data);
        this.createChart();
      })
      .catch(e => {
        console.log("error", e);
      });
  },
  beforeCreate() {
    console.log("localStorage!", localStorage["token"]);
    this.$store.commit("setCurrentUser", {
      name: localStorage["email"],
      coffeeConsumption: []
    });
    this.user = this.$store.getters.user;
    this.user.name = localStorage["email"];
    this.loggedIn = this.$store.getters.loggedin;
  }
};
</script>
<style scoped>
.swiper-pagination {
  margin-top: 60px;
}

.size {
  max-width: 100;
}
.strength {
  max-width: 100;
}

#headerIcon {
  font-size: 4rem;
  padding-top: 15px;
  margin: 0;
  text-align: center;
  background-color: darkgrey;
}

#logout {
  position: relative;
  margin-top: 35%;
  width: 100%;
  text-align: center;
  bottom: 9%;
  margin-bottom: 10%;
}

.buttonList {
  margin: auto;
  float: left;
}

.buttonList label {
  float: left;
  width: 100px;
  margin: 4px;
  background-color: #efefef;
  border-radius: 4px;
  border: 1px solid #d0d0d0;
  overflow: auto;
}

.buttonList label span {
  text-align: center;
  font-size: calc(14px + 0.5vw);
  padding: 5px 0px;
  display: block;
}

#drinkSubmit {
  text-align: center;
  font-size: calc(12px + 0.5vw);
  padding: 5px 0px;
}

.buttonList label input {
  position: absolute;
  top: -20px;
}

.buttonList input:checked + span {
  background-color: #f7f7f7;
  color: #499324;
}

.buttonList .size {
  background-color: #499324;
  border-color: #499324;
  color: #f7f7f7;
  max-width: 27vw;
}
.buttonList .strength {
  background-color: #499324;
  border-color: #499324;
  color: #f7f7f7;
  max-width: 27vw;
}

.block {
  text-align: center;
  margin: 20px;
}

.block:before {
  content: "\200B";
  /*   content: '';
  margin-left: -0.25em; */
  display: inline-block;
  height: 100%;
  vertical-align: middle;
}

.centered {
  display: inline-block;
  vertical-align: middle;
  max-width: 100%;
  padding: 10px 15px;
}
</style>
