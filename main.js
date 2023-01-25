"use strict";
// Initialize and add the map
const ipAddress = document.getElementById("ip");
const ipLocation = document.getElementById("location");
const timezone = document.getElementById("timezone");
const isp = document.getElementById("isp");
const submitSearch = document.getElementById("search");
const searchForm = document.getElementById("search-form");
const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const domainRegex = /^(?=.{1,253}\.?$)(?:(?!-|[^.]+_)[A-Za-z0-9-_]{1,63}(?<!-)(?:\.|$)){2,}$/;
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const ipData = await getIPApi(submitSearch.value);
  initMap(ipData.data.ip);
  
});
const getIPApi = async (ip = "") => {
  try {
    if (ip == "") {
      const api = await axios.get(
        "https://geo.ipify.org/api/v2/country,city?apiKey=at_xyl7dNvj94EDiAthjzjVjepf24M2k"
      );
      return api;
    } else if (ipRegex.test(ip)) {
      const api = await axios.get(
        `https://geo.ipify.org/api/v2/country,city?apiKey=at_xyl7dNvj94EDiAthjzjVjepf24M2k&ipAddress=${ip}`
      );
      return api;
    }
    else if (domainRegex.test(ip)) {
      const api = await axios.get(
        `https://geo.ipify.org/api/v2/country,city?apiKey=at_xyl7dNvj94EDiAthjzjVjepf24M2k&domain=${ip}`
      );
      return api;
    }
    else alert('please enter a valid domain or ip address')
  } catch (err) {
    console.error(err);
  }
};
async function initMap(ip = "") {
  const ipData = await getIPApi(ip);
  const pinLocation = {
    lat: ipData.data.location.lat,
    lng: ipData.data.location.lng,
  };
  const map = new google.maps.Map(document.getElementById("map"), {
    mapId: '44fb6acc60f952f4',
    zoom: 16,
    center: pinLocation,
    disableDefaultUI: true,
  });
  const marker = new google.maps.Marker({
    position: pinLocation,
    icon: '/images/icon-location.svg',
    map: map,
  });
  fillIPInfo(ipData);
}
const fillIPInfo = (ip) => {
  ipAddress.textContent = ip.data.ip;
  ipLocation.textContent =
    ip.data.location.city +
    ", " +
    ip.data.location.country +
    ip.data.location.postalCode;
  timezone.textContent = "UTC " + ip.data.location.timezone;
  isp.textContent = ip.data.isp;
};
window.initMap = initMap;
