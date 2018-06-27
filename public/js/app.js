function getCurrentSeconds() {
  return Math.round(new Date().getTime() / 1000.0);
}

function stripSpaces(str) {
  return str.replace(/\s/g, '');
}

function truncateTo(str, digits) {
  if (str.length <= digits) {
    return str;
  }

  return str.slice(-digits);
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

new Vue({
  el: '#app',
  data: {
    secret_key: getParameterByName('secret') || 'paste the secret here',
    digits: 6,
    period: 30,
    updatingIn: 0,
    token: null
  },

  mounted: function () {
    this.update();

    this.intervalHandle = setInterval(this.update, 1000);
  },

  destroyed: function () {
    clearInterval(this.intervalHandle);
  },

  computed: {
    totp: function () {
      return new OTPAuth.TOTP({
        algorithm: 'SHA1',
        digits: this.digits,
        period: this.period,
        secret: OTPAuth.Secret.fromB32(stripSpaces(this.secret_key)),
      });
    }
  },

  methods: {
    update: function () {
      this.updatingIn = this.period - (getCurrentSeconds() % this.period);
      this.token = truncateTo(this.totp.generate(), this.digits);
    }
  }
});
